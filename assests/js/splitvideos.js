const sections = document.querySelectorAll('.workvideos-section');
const videos = document.querySelectorAll('.workvideos-video');

// Initialize IntersectionObserver for videos to play/pause based on visibility
videos.forEach(video => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });
    
    const container = video.parentElement.parentElement;
    observer.observe(container);

    // Set pointer cursor so users know the container is clickable
    container.style.cursor = 'pointer';

    // Click event to toggle sound on/off
    container.addEventListener('click', () => {
        video.muted = !video.muted;
    });
});

// Scroll-based animation
window.addEventListener('scroll', () => {
    sections.forEach(section => {
        const progress = getScrollProgress(section);
        animateSection(section, progress);
    });
});

// Helper function to calculate the scroll progress for each section
function getScrollProgress(section) {
    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offsetTop = rect.top + scrollTop;
    const scrollPosition = window.pageYOffset;
    
    // Calculate progress as percentage through the section
    return Math.min(Math.max((scrollPosition - offsetTop) / (section.offsetHeight - window.innerHeight), 0), 1);
}

// Function to animate each section based on scroll progress
function animateSection(section, progress) {
    const leftCard = section.querySelector('.workvideos-card-left');
    const rightCard = section.querySelector('.workvideos-card-right');
    const text = section.querySelector('.workvideos-text');
    
    // Split distance and rotation values
    const maxDistance = window.innerWidth * 0.2; // 20% of viewport width
    const maxRotation = 15;

    // Cards directly impacted by scroll (no "animation feel")
    const distance = maxDistance * progress;
    const rotation = maxRotation * progress;
    
    // Split the cards apart in the first half of the scroll, then bring them together in the second half
    leftCard.style.transform = `translateX(-${distance}px) rotate(-${rotation}deg)`;
    rightCard.style.transform = `translateX(${distance}px) rotate(${rotation}deg)`;
    
    // Directly control text opacity and scaling
    text.style.opacity = progress;
    text.style.transform = `scale(${0.5 + progress * 0.5})`;
    if (progress > 0.5) text.classList.add('visible');
    else text.classList.remove('visible');
}
    