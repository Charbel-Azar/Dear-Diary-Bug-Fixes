document.addEventListener("DOMContentLoaded", () => {
  // Helper function to set up video controls
  function setupVideoControls(video, playButton, pauseButton) {
    let manualStarted = false;
    // Start video muted and autoplay
    video.muted = true;
    video.play();

    // Play button click
    playButton.addEventListener("click", () => {
      if (!manualStarted) {
        // First click: reset and start with sound
        video.currentTime = 0;
        video.muted = false;
        video.play();
        manualStarted = true;
      } else if (video.paused) {
        // Resume from paused point with sound
        video.muted = false;
        video.play();
      }
    });

    // Pause button click
    pauseButton.addEventListener("click", () => {
      video.pause();
    });
  }

  // Set up Hero Video controls
  const heroVideo = document.querySelector(".hero-video");
  const heroPlayButton = document.querySelector(".hero-play-button");
  const heroPauseButton = document.querySelector(".hero-pause-button");

  if (heroVideo && heroPlayButton && heroPauseButton) {
    setupVideoControls(heroVideo, heroPlayButton, heroPauseButton);
  }

  // Set up Expanding Video controls
  const expandingVideo = document.querySelector(".expanding-video");
  // Assuming the expanding video is inside a container with control buttons:
  const expandingContainer = document.querySelector(".video-wrapper");
  const expandingPlayButton = expandingContainer.querySelector(".video-play-button");
  const expandingPauseButton = expandingContainer.querySelector(".video-pause-button");

  if (expandingVideo && expandingPlayButton && expandingPauseButton) {
    setupVideoControls(expandingVideo, expandingPlayButton, expandingPauseButton);
  }
});
