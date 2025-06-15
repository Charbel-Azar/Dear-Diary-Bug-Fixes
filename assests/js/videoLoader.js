(function(){
  const options = { rootMargin: '0px', threshold: 0.25 };
  const onIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const webm = video.dataset.srcWebm;
        const mp4 = video.dataset.srcMp4;
        if (webm || mp4) {
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
        }
        observer.unobserve(video);
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(onIntersect, options);
    document.querySelectorAll('video[data-src-webm], video[data-src-mp4]').forEach(v => observer.observe(v));
  } else {
    document.querySelectorAll('video[data-src-webm], video[data-src-mp4]').forEach(video => {
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
  }
})();
