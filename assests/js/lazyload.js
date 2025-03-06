document.addEventListener("DOMContentLoaded", function () {
  // Lazy load images
  const lazyImages = document.querySelectorAll("img[data-src]");

  // Lazy load videos
  const lazyVideos = document.querySelectorAll("video[data-src]");

  // Handle "click-to-play" videos
  const clickableVideos = document.querySelectorAll(
    "video[data-click-to-play]"
  );

  // Handle "autoplay when in view" videos
  const autoPlayVideos = document.querySelectorAll("video[data-autoplay]");

  // Create intersection observer for all lazy-loaded elements
  if ("IntersectionObserver" in window) {
    // Observer for images
    const imageObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");

            if (src) {
              img.src = src;

              // If there's a srcset, load that too
              if (img.getAttribute("data-srcset")) {
                img.srcset = img.getAttribute("data-srcset");
              }

              img.removeAttribute("data-src");
              img.removeAttribute("data-srcset");
              img.classList.add("loaded");
              obs.unobserve(img);
            }
          }
        });
      },
      { rootMargin: "50px 0px", threshold: 0.1 }
    );

    // Observer for videos
    const videoObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const video = entry.target;
            const src = video.getAttribute("data-src");

            if (src) {
              // For videos with source elements
              const sources = video.querySelectorAll("source");
              if (sources.length) {
                sources.forEach((source) => {
                  if (source.getAttribute("data-src")) {
                    source.src = source.getAttribute("data-src");
                    source.removeAttribute("data-src");
                  }
                });
                video.load();
              } else {
                // For videos with direct src attribute
                video.src = src;
              }

              video.removeAttribute("data-src");

              // If it should autoplay when visible
              if (video.hasAttribute("data-autoplay")) {
                video.play().catch(function (err) {
                  console.warn("Autoplay failed:", err);
                });
              }

              obs.unobserve(video);
            }
          }
        });
      },
      { rootMargin: "100px 0px", threshold: 0.1 }
    );

    // Apply observers to elements
    lazyImages.forEach((img) => imageObserver.observe(img));
    lazyVideos.forEach((video) => videoObserver.observe(video));
    autoPlayVideos.forEach((video) => videoObserver.observe(video));
  } else {
    // Fallback for browsers without IntersectionObserver
    // Load all images immediately
    lazyImages.forEach(function (img) {
      if (img.getAttribute("data-src")) {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      }
      if (img.getAttribute("data-srcset")) {
        img.srcset = img.getAttribute("data-srcset");
        img.removeAttribute("data-srcset");
      }
    });

    // Load all videos immediately
    lazyVideos.forEach(function (video) {
      if (video.getAttribute("data-src")) {
        const sources = video.querySelectorAll("source");
        if (sources.length) {
          sources.forEach((source) => {
            if (source.getAttribute("data-src")) {
              source.src = source.getAttribute("data-src");
              source.removeAttribute("data-src");
            }
          });
          video.load();
        } else {
          video.src = video.getAttribute("data-src");
        }
        video.removeAttribute("data-src");
      }
    });
  }

  // Handle click-to-play videos separately
  clickableVideos.forEach(function (video) {
    video.addEventListener("click", function () {
      // If no src yet, set from data-src
      if (video.getAttribute("data-src") && !video.src) {
        video.src = video.getAttribute("data-src");
        video.removeAttribute("data-src");
        video.load();
      }

      video.play().catch(function (err) {
        console.warn("Video failed to play on click:", err);
      });
    });
  });

  // Add support for background images
  const lazyBackgrounds = document.querySelectorAll("[data-background]");

  if ("IntersectionObserver" in window) {
    const bgObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const element = entry.target;
            element.style.backgroundImage = `url(${element.getAttribute(
              "data-background"
            )})`;
            element.removeAttribute("data-background");
            obs.unobserve(element);
          }
        });
      },
      { rootMargin: "50px 0px", threshold: 0.1 }
    );

    lazyBackgrounds.forEach((element) => bgObserver.observe(element));
  } else {
    // Fallback
    lazyBackgrounds.forEach(function (element) {
      element.style.backgroundImage = `url(${element.getAttribute(
        "data-background"
      )})`;
      element.removeAttribute("data-background");
    });
  }
});
