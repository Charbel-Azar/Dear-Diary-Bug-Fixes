document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.expanding-video');
  const wrapper = document.querySelector('.video-wrapper');

  function updateVideoSize() {
    const rect = wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate how much of the wrapper is visible
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportHeight, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityPercent = visibleHeight / viewportHeight;
    
    // Calculate a scroll-based percentage for sizing
    const transitionDistance = viewportHeight;
    let scrollPercent = (transitionDistance - rect.top) / transitionDistance;
    scrollPercent = Math.min(Math.max(scrollPercent, 0), 1);

    // Adjust volume based on visibility
    video.volume = visibilityPercent;
    video.muted = visibilityPercent < 0.1;

    // Playback control: play if at least 20% visible; pause if below 10%
    if (visibilityPercent >= 0.2) {
      if (video.paused) {
        video.play().catch(err => console.error("Play error:", err));
      }
    } else if (visibilityPercent < 0.1) {
      if (!video.paused) {
        video.pause();
      }
    }

    // Adjust video size and shape based on scrollPercent
    if (scrollPercent === 0) {
      video.style.width = '200px';
      video.style.height = '200px';
      video.style.borderRadius = '50%';
    } else if (scrollPercent === 1) {
      video.style.width = '100%';
      video.style.height = '100vh';
      video.style.borderRadius = '0';
    } else {
      const size = 200 + (scrollPercent * (window.innerWidth - 200));
      const heightSize = 200 + (scrollPercent * (window.innerHeight - 200));
      const borderRadius = 50 - (scrollPercent * 50);
      video.style.width = `${size}px`;
      video.style.height = `${heightSize}px`;
      video.style.borderRadius = `${borderRadius}%`;
    }
  }

  window.addEventListener('scroll', updateVideoSize);
  window.addEventListener('resize', updateVideoSize);
  updateVideoSize(); // initial call on load
});
