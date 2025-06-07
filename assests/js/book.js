document.addEventListener('DOMContentLoaded', () => {
  const notebook = document.querySelector('.notebook');
  const pages = Array.from(document.querySelectorAll('.page'));
  const spacer = document.querySelector('.scroll-spacer');
  const storySection = document.querySelector('.story-section');

  let currentZ = pages.length;
  let lastScrollPos = window.scrollY;
  let activePageIndex = -1;
  let animationInProgress = false;

  // Slide config for phone vs. desktop
  const slideConfig = {
    mobile: { centerSlide: 7, finalSlide: 8 },
    desktop: { centerSlide: 25, finalSlide: 25 },
    breakpoint: 768
  };

  // Detect support for 3D transforms (a proxy for GPU acceleration)
  const supports3D = CSS.supports('perspective', '1500px');
  const lowPerformanceDevice = !supports3D;

  // Disable pointer events on pages for scroll-only flipping
  pages.forEach(page => {
    page.style.pointerEvents = 'none';
    // Set an appropriate transition duration based on device capability
    page.style.transition = lowPerformanceDevice 
      ? 'transform 0.5s ease'
      : 'transform 0.8s ease-in-out';
  });

  // Helper to determine which slide amounts to use based on screen width
  function getSlideAmounts() {
    const isMobile = window.innerWidth < slideConfig.breakpoint;
    return isMobile ? slideConfig.mobile : slideConfig.desktop;
  }

  // Update the notebook position. For low performance devices, we skip the 3D perspective.
  function updateNotebookPosition(scrollPosition) {
    const { centerSlide, finalSlide } = getSlideAmounts();
    const sectionTop = storySection.offsetTop;
    const scrollInSection = scrollPosition - sectionTop;
    const maxScroll = spacer.offsetHeight;
    const scrollProgress = Math.max(0, Math.min(1, scrollInSection / maxScroll));

    let slideAmount = centerSlide;
    if (!lowPerformanceDevice) {
      if (scrollProgress < 0.1) {
        slideAmount = centerSlide * (scrollProgress / 0.1);
      } else if (scrollProgress > 0.9) {
        let finalSlideAmount = centerSlide + (finalSlide * ((scrollProgress - 0.9) / 0.1));
        // Clamp the final slide amount
        const maxValue = window.innerWidth < slideConfig.breakpoint ? 20 : 60;
        slideAmount = Math.min(finalSlideAmount, maxValue);
      }
    }
    // Build transform string: skip perspective on low-performance devices
    const transform = lowPerformanceDevice 
      ? `translateX(${slideAmount}vh)` 
      : `translateY(-50%) perspective(1500px) translateX(${slideAmount}vh)`;
    notebook.style.transform = transform;
  }

  // Reset all pages to a "closed" state
  function resetPageStates() {
    animationInProgress = true;
    pages.forEach((page, index) => {
      page.classList.remove('active');
      page.style.zIndex = pages.length - index;
      // Transition is already set per page
    });
    setTimeout(() => {
      currentZ = pages.length;
      activePageIndex = -1;
      animationInProgress = false;
    }, lowPerformanceDevice ? 500 : 800);
  }

  // Calculate the scroll threshold for each page
  function getScrollThreshold(index) {
    const sectionTop = storySection.offsetTop;
    const totalScrollRange = spacer.offsetHeight;
    const pageScrollRange = totalScrollRange / pages.length;
    return sectionTop + pageScrollRange * (index + 1);
  }

  // Main logic: determine whether to open or close pages based on scroll direction
  function updatePages() {
    if (animationInProgress) return;
    const scrollPosition = window.scrollY;
    const scrollDirection = scrollPosition > lastScrollPos ? 'down' : 'up';

    updateNotebookPosition(scrollPosition);

    pages.forEach((page, index) => {
      const threshold = getScrollThreshold(index);
      if (scrollDirection === 'down') {
        if (!page.classList.contains('active') && index > activePageIndex && scrollPosition > threshold) {
          flipPage(page, index, true); // open page
        }
      } else {
        if (page.classList.contains('active') && index === activePageIndex && scrollPosition < threshold) {
          flipPage(page, index, false); // close page
        }
      }
    });

    lastScrollPos = scrollPosition;
  }

  // Flip a single page open or closed
  function flipPage(page, index, isOpening) {
    if (animationInProgress) return;
    animationInProgress = true;

    if (isOpening) {
      page.classList.add('active');
      page.style.zIndex = currentZ++;
      activePageIndex = index;
    } else {
      page.classList.remove('active');
      activePageIndex = index - 1;
    }

    setTimeout(() => {
      animationInProgress = false;
      updatePages();
    }, lowPerformanceDevice ? 500 : 800);
  }

  // After a transition ends, if a page is closed, push it behind
  pages.forEach(page => {
    page.addEventListener('transitionend', () => {
      if (!page.classList.contains('active')) {
        page.style.zIndex = pages.length - pages.indexOf(page);
      }
    });
  });

  // Use requestAnimationFrame to throttle scroll events
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updatePages();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Recalculate positions on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updatePages, 200);
  });

  // Initialize the pages
  resetPageStates();
});
