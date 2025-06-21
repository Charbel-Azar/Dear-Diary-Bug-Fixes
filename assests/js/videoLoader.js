(function () {
  const loadVideos = () => {
    document
      .querySelectorAll('video[data-src-webm], video[data-src-mp4]')
      .forEach((video) => {
        const webm = video.dataset.srcWebm;
        const mp4 = video.dataset.srcMp4;

        if (webm) {
          const source = document.createElement('source');
          source.src = webm;
          source.type = 'video/webm';
          video.appendChild(source);
        }

        if (mp4) {
          const source = document.createElement('source');
          source.src = mp4;
          source.type = 'video/mp4';
          video.appendChild(source);
        }

        video.load();
      });
  };

  // The script is loaded with "defer" so the DOM is ready at this point.
  // Load all videos immediately to avoid lazy-loading grey placeholders.
  loadVideos();
})();
