document.addEventListener('DOMContentLoaded', function () {
    const serviceBtns = document.querySelectorAll('.service-btn');
    const packageContainers = document.querySelectorAll('.packages-container');
    const allCards = document.querySelectorAll('.package-card');
    const hoverSound = document.getElementById('hoverSound');
    const clickSound = document.getElementById('clickSound');
  
    // Fade in/out when switching packages
    function switchContainer(activeContainer) {
      const currentActive = document.querySelector('.packages-container.active');
  
      if (currentActive && currentActive !== activeContainer) {
        currentActive.classList.add('fade-out');
  
        setTimeout(() => {
          currentActive.classList.remove('active', 'fade-out');
          currentActive.style.display = 'none';
  
          activeContainer.style.display = 'flex';
          void activeContainer.offsetWidth; // force reflow
          activeContainer.classList.add('active');
        }, 500);
      } else {
        activeContainer.style.display = 'flex';
        void activeContainer.offsetWidth; // force reflow
        activeContainer.classList.add('active');
      }
    }
  
    // Click on service button
    serviceBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Play click sound (if desired)
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play();
        }
        serviceBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
  
        const serviceType = this.dataset.service;
        const activePackageContainer = document.getElementById(`${serviceType}-packages`);
        switchContainer(activePackageContainer);
      });
    });
  
    // Hover and click on package cards
    allCards.forEach(card => {
      // Play hover sound on mouseenter (if desired)
      card.addEventListener('mouseenter', () => {
        if (hoverSound) {
          hoverSound.currentTime = 0;
          hoverSound.play();
        }
      });
  
      // On click, toggle a "glow" class (if you want the card to remain glowing)
      card.addEventListener('click', () => {
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play();
        }
        card.classList.toggle('active');
      });
    });
  });
  