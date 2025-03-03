
  document.addEventListener('DOMContentLoaded', function () {
    // Handle "click-to-play" videos
    const clickableVideos = document.querySelectorAll('video[data-click-to-play]');
    clickableVideos.forEach(function (video) {
      video.addEventListener('click', function () {
        // If no src yet, set from data-src
        if (!video.src) {
          video.src = video.getAttribute('data-src');
        }
        video.play().catch(function (err) {
          console.warn('Video failed to play on click:', err);
        });
      });
    });

    // Handle "autoplay when in view" videos
    const autoPlayVideos = document.querySelectorAll('video[data-autoplay]');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const vid = entry.target;
            // Set src from data-src if not already set
            if (!vid.src) {
              vid.src = vid.getAttribute('data-src');
            }
            // Autoplay
            vid.play().catch(function (err) {
              console.warn('Autoplay failed:', err);
            });
            // Stop observing after first play
            obs.unobserve(vid);
          }
        });
      }, { threshold: 0.5 }); // half the video visible triggers playback

      autoPlayVideos.forEach(function (video) {
        observer.observe(video);
      });
    } else {
      // Fallback for older browsers without IntersectionObserver
      autoPlayVideos.forEach(function (vid) {
        if (!vid.src) {
          vid.src = vid.getAttribute('data-src');
        }
        vid.play().catch(function (err) {
          console.warn('Autoplay fallback failed:', err);
        });
      });
    }
  });
