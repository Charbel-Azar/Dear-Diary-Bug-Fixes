document.addEventListener('DOMContentLoaded', () => {
  // Locate the grid wrapper
  const videoGrid = document.querySelector('.video-grid');
  if (!videoGrid) {
    console.error('No element with class "video-grid" found in the DOM.');
    return;
  }

  const gridSize = 3; // 3x3
  let currentPlayingVideo = null;

  // Video & poster sources
  const videoSources = [
    'assests/images/cube/pint (1).mp4',
    'assests/images/cube/pint (2).webm',
    'assests/images/cube/pint (3).webm',
    'assests/images/cube/pint (4).webm',
    'assests/images/cube/pint (5).webm',
    'assests/images/cube/pint (6).webm',
    'assests/images/cube/pint (7).webm',
    'assests/images/cube/pint (8).webm',
    'assests/images/cube/pint (9).webm'
  ];

  const posterSources = [
    'assests/images/cube/pint (1).jpg',
    'assests/images/cube/pint (2).jpg',
    'assests/images/cube/pint (3).jpg',
    'assests/images/cube/pint (4).jpg',
    'assests/images/cube/pint (5).jpg',
    'assests/images/cube/pint (6).jpg',
    'assests/images/cube/pint (7).jpg',
    'assests/images/cube/pint (8).jpg',
    'assests/images/cube/pint (9).jpg'
  ];

  let videoIndex = 0;

  /****************************************
   * Create the 3x3 grid of video cells
   ****************************************/
  for (let row = 1; row <= gridSize; row++) {
    for (let col = 1; col <= gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('video-cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Create video element
      const video = document.createElement('video');
      video.src = videoSources[videoIndex]; // start preloading
      video.poster = posterSources[videoIndex];
      video.setAttribute('playsinline', ''); // required for iOS inline play
      video.setAttribute('muted', '');       // required for iOS autoplay
      video.setAttribute('autoplay', '');    // allow silent autoplay
      video.setAttribute('loop', '');
      video.setAttribute('preload', 'auto');
      videoIndex++;

      // Create overlay with play/pause buttons
      const overlay = document.createElement('div');
      overlay.className = 'video-overlay';

      const playButton = document.createElement('button');
      playButton.className = 'play-button';
      playButton.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;

      const pauseButton = document.createElement('button');
      pauseButton.className = 'pause-button';
      pauseButton.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/>
        </svg>
      `;
      pauseButton.style.display = 'none';

      overlay.appendChild(playButton);
      overlay.appendChild(pauseButton);

      // Add video & overlay to cell, and cell to the grid
      cell.appendChild(video);
      cell.appendChild(overlay);
      videoGrid.appendChild(cell);
    }
  }

  /****************************************
   * GRID EXPANSION & HOVER EFFECTS
   ****************************************/
  const BIG = 1.5, SMALL = 0.75;
  function expandGrid(hoveredRow, hoveredCol) {
    for (let r = 1; r <= gridSize; r++) {
      document.documentElement.style.setProperty(
        `--row${r}`,
        r === hoveredRow ? `${BIG}fr` : `${SMALL}fr`
      );
    }
    for (let c = 1; c <= gridSize; c++) {
      document.documentElement.style.setProperty(
        `--col${c}`,
        c === hoveredCol ? `${BIG}fr` : `${SMALL}fr`
      );
    }
  }
  function resetGrid() {
    for (let r = 1; r <= gridSize; r++) {
      document.documentElement.style.setProperty(`--row${r}`, `1fr`);
    }
    for (let c = 1; c <= gridSize; c++) {
      document.documentElement.style.setProperty(`--col${c}`, `1fr`);
    }
  }
  document.querySelectorAll('.video-cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);
      expandGrid(r, c);
    });
    cell.addEventListener('mouseleave', resetGrid);
  });

  /****************************************
   * FADE-IN OBSERVER
   ****************************************/
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.video-cell').forEach(cell => observer.observe(cell));

  /****************************************
   * VIDEO PLAY/PAUSE + SOUND ENABLE
   ****************************************/
  document.querySelectorAll('.video-cell video').forEach(video => {
    // Since they're autoplay+muted, they might already be playing silently.
    video.style.filter = 'grayscale(100%)';

    const cell = video.parentElement;
    const playBtn = cell.querySelector('.play-button');
    const pauseBtn = cell.querySelector('.pause-button');

    // Show play button initially, hide pause button
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';

    // When user clicks Play
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // If another video is currently playing with sound, pause & mute it
      if (currentPlayingVideo && currentPlayingVideo !== video) {
        currentPlayingVideo.pause();
        currentPlayingVideo.style.filter = 'grayscale(100%)';
        const otherCell = currentPlayingVideo.parentElement;
        otherCell.querySelector('.play-button').style.display = 'block';
        otherCell.querySelector('.pause-button').style.display = 'none';
        // Mute the other video
        currentPlayingVideo.muted = true;
        currentPlayingVideo = null;
      }

      // Unmute this video, then play it
      video.muted = false;
      video.play().catch(err => {
        console.warn('iOS might block autoplay or another error occurred:', err);
      });

      video.style.filter = 'grayscale(0%)';
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'block';

      // Set as currently active (with sound)
      currentPlayingVideo = video;
    });

    // When user clicks Pause
    pauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.pause();
      // Optionally re-mute upon pausing,
      // so it doesn't blast sound if user hits Play again
      video.muted = true;
      video.style.filter = 'grayscale(100%)';

      playBtn.style.display = 'block';
      pauseBtn.style.display = 'none';

      if (currentPlayingVideo === video) {
        currentPlayingVideo = null;
      }
    });
  });
});