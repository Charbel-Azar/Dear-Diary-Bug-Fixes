document.addEventListener("DOMContentLoaded", function () {
  // Expanding video controls implementation
  const expandingVideo = document.querySelector(".expanding-video");
  const wrapper = document.querySelector(".video-wrapper");

  // Create play button for expanding video
  const playButton = document.createElement("button");
  playButton.className = "video-play-button";
  playButton.innerHTML = '<i class="fas fa-play"></i>';
  wrapper.appendChild(playButton);

  // Create pause button for expanding video (initially hidden)
  const pauseButton = document.createElement("button");
  pauseButton.className = "video-pause-button";
  pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  pauseButton.style.display = "none";
  wrapper.appendChild(pauseButton);

  // Play button click event for expanding video
  playButton.addEventListener("click", function () {
    if (expandingVideo.muted) {
      expandingVideo.currentTime = 0; // restart video
      expandingVideo.muted = false; // unmute
    }
    expandingVideo.play().catch((err) => console.error("Play error:", err));
    playButton.style.display = "none";
    pauseButton.style.display = "block";
  });

  // Pause button click event for expanding video
  pauseButton.addEventListener("click", function () {
    expandingVideo.pause();
    pauseButton.style.display = "none";
    playButton.style.display = "block";
  });

  // Hero video controls implementation
  const heroVideo = document.querySelector(".hero-video");
  const videoContainer = document.querySelector(".video-container");

  // Create play button for hero video
  const heroPlayButton = document.createElement("button");
  heroPlayButton.className = "video-play-button hero-play-button";
  heroPlayButton.innerHTML = '<i class="fas fa-play"></i>';
  videoContainer.appendChild(heroPlayButton);

  // Create pause button for hero video (initially hidden)
  const heroPauseButton = document.createElement("button");
  heroPauseButton.className = "video-pause-button hero-pause-button";
  heroPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
  heroPauseButton.style.display = "none";
  videoContainer.appendChild(heroPauseButton);

  // Play button click event for hero video
  heroPlayButton.addEventListener("click", function () {
    if (heroVideo.muted) {
      heroVideo.currentTime = 0; // restart video
      heroVideo.muted = false; // unmute
    }
    heroVideo.play().catch((err) => console.error("Play error:", err));
    heroPlayButton.style.display = "none";
    heroPauseButton.style.display = "block";
  });

  // Pause button click event for hero video
  heroPauseButton.addEventListener("click", function () {
    heroVideo.pause();
    heroPauseButton.style.display = "none";
    heroPlayButton.style.display = "block";
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
    if (expandingVideo.paused && playButton.style.display !== "none") {
      expandingVideo.muted = true;
      expandingVideo.play().catch((err) => console.error("Play error:", err));
    }

    // Adjust video size and shape based on scrollPercent
    if (scrollPercent === 0) {
      expandingVideo.style.width = "200px";
      expandingVideo.style.height = "200px";
      expandingVideo.style.borderRadius = "50%";
    } else if (scrollPercent === 1) {
      expandingVideo.style.width = "100%";
      expandingVideo.style.height = "100vh";
      expandingVideo.style.borderRadius = "0";
    } else {
      const size = 200 + scrollPercent * (window.innerWidth - 200);
      const heightSize = 200 + scrollPercent * (window.innerHeight - 200);
      const borderRadius = 50 - scrollPercent * 50;
      expandingVideo.style.width = `${size}px`;
      expandingVideo.style.height = `${heightSize}px`;
      expandingVideo.style.borderRadius = `${borderRadius}%`;
    }
  }

  window.addEventListener("scroll", updateVideoSize);
  window.addEventListener("resize", updateVideoSize);
  updateVideoSize(); // initial call on load
});
