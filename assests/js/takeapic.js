document.addEventListener('DOMContentLoaded', function () {
    // 1. Grab references
    const cameraWrapper = document.querySelector('.camera-capture-wrapper');
    if (!cameraWrapper) return; // Safeguard if not present
  
    const container = cameraWrapper.querySelector('.containercamera');
    const loadingVideo = cameraWrapper.querySelector('.videocamera');
    const flash = cameraWrapper.querySelector('.flash');
  
    // -------------------------
    // NEW: Multi-Video Playlist
    // with a RANDOM first video
    // -------------------------
    const videoPlaylist = [
      './assests/images/camera/loading (1).mp4',
      './assests/images/camera/loading (2).mp4',
      './assests/images/camera/loading (3).mp4',
      './assests/images/camera/loading (4).mp4',
      './assests/images/camera/loading (5).mp4'
    ];
  
    // Pick a random starting index:
    let currentIndex = Math.floor(Math.random() * videoPlaylist.length);
  
    function playVideo(index) {
      loadingVideo.src = videoPlaylist[index];
      // Attempt auto-play
      loadingVideo.play().catch((err) => {
        console.warn('Autoplay prevented or failed:', err);
      });
    }
  
    // When the current video ends, go to the next, loop back if at the end
    loadingVideo.addEventListener('ended', () => {
      currentIndex++;
      if (currentIndex >= videoPlaylist.length) {
        currentIndex = 0;
      }
      playVideo(currentIndex);
    });
  
    // Start playing the first (random) video
    playVideo(currentIndex);
  
    // 2. Create the custom crosshair
    const crosshair = document.createElement('img');
    crosshair.src = './assests/images/camera/frame.svg';  // same crosshair icon
    crosshair.className = 'custom-crosshair';
    document.body.appendChild(crosshair);
  
    // 3. Shutter sound
    const shutterSound = new Audio('./assests/images/camera/camera.mp3');
    shutterSound.preload = 'auto';
  
    // 4. Show/hide crosshair on mousemove
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const insideX = e.clientX >= rect.left && e.clientX <= rect.right;
      const insideY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (insideX && insideY) {
        crosshair.style.display = 'block';
        crosshair.style.left = `${e.pageX}px`;
        crosshair.style.top = `${e.pageY}px`;
      } else {
        crosshair.style.display = 'none';
      }
    });
    
  
    container.addEventListener('mouseleave', () => {
      crosshair.style.display = 'none';
    });
  
    // 5. Flash effect
    function triggerFlash() {
      flash.style.opacity = '1';
      setTimeout(() => {
        flash.style.transition = 'opacity 0.5s ease';
        flash.style.opacity = '0';
        setTimeout(() => {
          flash.style.transition = '';
        }, 500);
      }, 50);
    }
  
    // 6. Create polaroid (the floating photo)
    function createPolaroid(x, y, capturedImage) {
      const polaroid = document.createElement('div');
      polaroid.className = 'polaroid';
  
      // Random rotation
      const rotation = Math.random() * 20 - 10;
      polaroid.style.setProperty('--rotation', `${rotation}deg`);
  
      // Position polaroid near click (fixed to viewport coords)
      const viewportX = x - window.scrollX;
      const viewportY = y - window.scrollY;
      polaroid.style.position = 'fixed';
      polaroid.style.left = `${Math.min(Math.max(viewportX - 100, 0), window.innerWidth - 230)}px`;
      polaroid.style.top = `${Math.min(Math.max(viewportY - 100, 0), window.innerHeight - 230)}px`;
  
      // Polaroid photo element
      const image = document.createElement('div');
      image.className = 'polaroid-image';
      image.appendChild(capturedImage);
  
      polaroid.appendChild(image);
      document.body.appendChild(polaroid);
  
      // Animate it in
      requestAnimationFrame(() => {
        polaroid.classList.add('show');
      });
  
      // Fade out and remove after a few seconds
      setTimeout(() => {
        polaroid.classList.add('fade-out');
        polaroid.addEventListener('transitionend', function onTransition(e) {
          if (e.propertyName === 'opacity') {
            polaroid.removeEventListener('transitionend', arguments.callee);
            polaroid.remove();
          }
        });
        // Fallback removal
        setTimeout(() => {
          if (polaroid.parentNode) {
            polaroid.remove();
          }
        }, 2000);
      }, 4000);
    }
  
    // 7. Capture logic
    const captureCanvas = document.createElement('canvas');
    const ctx = captureCanvas.getContext('2d');
  
    container.addEventListener('click', (e) => {
      shutterSound.currentTime = 0;
      shutterSound.play();
      triggerFlash();
  
      // Prepare canvas for snapshot
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      captureCanvas.width = 200;
      captureCanvas.height = 200;
  
      // Adjust for the original video ratio
      const sourceX = Math.max(0, x - 100);
      const sourceY = Math.max(0, y - 100);
      const sourceWidth = Math.min(200, loadingVideo.videoWidth - sourceX);
      const sourceHeight = Math.min(200, loadingVideo.videoHeight - sourceY);
  
      // Draw a 200x200 slice from the video based on click
      ctx.drawImage(
        loadingVideo,
        sourceX * (loadingVideo.videoWidth / rect.width),
        sourceY * (loadingVideo.videoHeight / rect.height),
        sourceWidth,
        sourceHeight,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
      );
  
      // Round corners
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = captureCanvas.width;
      finalCanvas.height = captureCanvas.height;
      const finalCtx = finalCanvas.getContext('2d');
  
      finalCtx.beginPath();
      finalCtx.roundRect(0, 0, finalCanvas.width, finalCanvas.height, 5);
      finalCtx.clip();
      finalCtx.drawImage(captureCanvas, 0, 0);
  
      // Create polaroid at click location
      createPolaroid(e.pageX, e.pageY, finalCanvas);
    });
  });
  