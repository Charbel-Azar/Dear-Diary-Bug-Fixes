document.addEventListener("DOMContentLoaded", () => {
  // Select all video elements except those with the "expanding-video" class
  const videos = document.querySelectorAll("video");

  console.log(videos);

  // IntersectionObserver options: adjust these values to control when videos play.
  const observerOptions = {
    threshold: 0.5, // 50% of the video must be visible to trigger play.
    rootMargin: "100px", // Preload videos a bit before they fully enter view.
  };

  const checkIgnore = (entry) => {
    // If video is muted, ignore it - let it continue playing or pausing on its own
    return entry.target.muted;
  };

  // Callback function for the observer.
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        if (checkIgnore(entry)) {
          return;
        }

        const isExpandingVideo =
          entry.target.classList.contains("expanding-video");
        const isHeroVideo = entry.target.classList.contains("hero-video");

        if (isExpandingVideo) {
          // Reset the expanding video controls
          entry.target.pause();
          entry.target.currentTime = 0;
          entry.target.muted = true;

          const expandingPlayButton = document.querySelector(
            ".video-wrapper .video-play-button"
          );
          const expandingPauseButton = document.querySelector(
            ".video-wrapper .video-pause-button"
          );

          if (expandingPlayButton && expandingPauseButton) {
            expandingPlayButton.style.display = "block";
            expandingPauseButton.style.display = "none";
          }

          return;
        }

        if (isHeroVideo) {
          // Reset the hero video controls
          entry.target.pause();
          entry.target.currentTime = 0;
          entry.target.muted = true;

          const heroPlayButton = document.querySelector(".hero-play-button");
          const heroPauseButton = document.querySelector(".hero-pause-button");

          if (heroPlayButton && heroPauseButton) {
            heroPlayButton.style.display = "block";
            heroPauseButton.style.display = "none";
          }

          return;
        }

        entry.target.pause();

        const video = entry.target;
        const cell = video.parentElement;

        const isVideoCell = cell?.classList.contains("video-cell");
        if (isVideoCell) {
          video.style.filter = "grayscale(100%)";
          const playBtn = cell.querySelector(".play-button");
          const pauseBtn = cell.querySelector(".pause-button");

          playBtn.style.display = "block";
          pauseBtn.style.display = "none";
        }
      }
    });
  };

  // Create the IntersectionObserver instance.
  const videoObserver = new IntersectionObserver(
    observerCallback,
    observerOptions
  );

  // Observe each controlled video.
  videos.forEach((video) => {
    videoObserver.observe(video);
  });
});
