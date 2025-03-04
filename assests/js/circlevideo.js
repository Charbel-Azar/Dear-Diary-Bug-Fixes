document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.expanding-video');
  const wrapper = document.querySelector('.video-wrapper');
  
  // Create play button
  const playButton = document.createElement('button');
  playButton.className = 'video-play-button';
  playButton.innerHTML = '<i class="fas fa-play"></i>';
  wrapper.appendChild(playButton);

  // Create pause button (initially hidden)
  const pauseButton = document.createElement('button');
  pauseButton.className = 'video-pause-button';
  pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  pauseButton.style.display = 'none';
  wrapper.appendChild(pauseButton);

  // Play button click event
  playButton.addEventListener('click', function() {
    video.currentTime = 0; // restart video
    video.muted = false; // unmute
    video.play().catch(err => console.error("Play error:", err));
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
  });

  // Pause button click event
  pauseButton.addEventListener('click', function() {
    video.pause();
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
  });

  function updateVideoSize() {
    const rect = wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate a scroll-based percentage for sizing
    const transitionDistance = viewportHeight;
    let scrollPercent = (transitionDistance - rect.top) / transitionDistance;
    scrollPercent = Math.min(Math.max(scrollPercent, 0), 1);

    // Always ensure the video is playing in muted state,
    // unless user has clicked the play button
    if (video.paused && playButton.style.display !== 'none') {
      video.muted = true;
      video.play().catch(err => console.error("Play error:", err));
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
