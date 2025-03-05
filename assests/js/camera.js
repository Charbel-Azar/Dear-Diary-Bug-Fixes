class MusicController {
  constructor(userVolume = 0.5) {
    this.songs = ["./assests/music/ES_Always by Your Side - House Of Say.mp3"];

    // Flags controlling playback
    this.isMuted = false;
    this.manualMute = false; // User intent
    this.controller = document.getElementById("musicController");
    this.volumeHalf = this.controller.querySelector(".volume-half");
    this.nextHalf = this.controller.querySelector(".next-half");
    this.volumeIcon = this.volumeHalf.querySelector("i");

    // Random song selection
    this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
    this.selectedSong = this.songs[this.currentSongIndex];

    this.audio = new Audio(this.selectedSong);
    this.audio.loop = true;
    this.audio.volume = 0; // Start with volume 0 for fade-in

    // Fade settings
    this.fadeTime = 500;
    this.fadeInterval = 50;
    this.targetVolume = 1.0;
    this.isFading = false;
    this.fadeTimer = null;

    // Flag to track if a video is interfering with music
    this.isVideoInterference = false;

    // Make the controller visible
    this.controller.classList.add("visible");

    this.init();
  }

  init() {
    if (localStorage.getItem("musicMuted") === "true") {
      this.isMuted = true;
      this.manualMute = true;
      this.updateVolumeIcon();
      // Do not auto-play music if user had it muted
    } else {
      this.audio.muted = true;
      this.audio
        .play()
        .then(() => {
          if (!this.manualMute) {
            this.audio.muted = false;
            this.updateVolumeIcon();
            this.fadeIn();
          }
        })
        .catch((error) => {
          console.warn("Auto-play prevented:", error);
          this.isMuted = true;
          this.manualMute = true;
          localStorage.setItem("musicMuted", "true");
          this.updateVolumeIcon();
        });
    }

    // Event listeners for controller
    this.volumeHalf.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMusic();
    });
    this.nextHalf.addEventListener("click", (e) => {
      e.stopPropagation();
      this.nextSong();
    });
    this.audio.addEventListener("ended", () => {
      this.nextSong();
    });

    // Observe videos for interference
    this.observeVideos();
  }

  fadeIn() {
    if (this.isFading) clearInterval(this.fadeTimer);
    this.isFading = true;
    const startVolume = this.audio.volume;
    const volumeStep =
      (this.targetVolume - startVolume) / (this.fadeTime / this.fadeInterval);
    let currentTime = 0;

    this.fadeTimer = setInterval(() => {
      currentTime += this.fadeInterval;
      if (currentTime >= this.fadeTime) {
        this.audio.volume = this.targetVolume;
        clearInterval(this.fadeTimer);
        this.isFading = false;
      } else {
        this.audio.volume = Math.min(
          startVolume + (volumeStep * currentTime) / this.fadeInterval,
          this.targetVolume
        );
      }
    }, this.fadeInterval);
  }

  fadeOut(callback) {
    if (this.isFading) clearInterval(this.fadeTimer);
    this.isFading = true;
    const startVolume = this.audio.volume;
    const volumeStep = startVolume / (this.fadeTime / this.fadeInterval);
    let currentTime = 0;

    this.fadeTimer = setInterval(() => {
      currentTime += this.fadeInterval;
      if (currentTime >= this.fadeTime) {
        this.audio.volume = 0;
        clearInterval(this.fadeTimer);
        this.isFading = false;
        if (callback) callback();
      } else {
        this.audio.volume = Math.max(
          startVolume - (volumeStep * currentTime) / this.fadeInterval,
          0
        );
      }
    }, this.fadeInterval);
  }

  toggleMusic() {
    if (this.isMuted) {
      this.isMuted = false;
      this.manualMute = false;
      localStorage.setItem("musicMuted", "false");
      this.updateVolumeIcon();
      if (!this.isAnyUnmutedVideoPlaying() && this.audio.paused) {
        this.audio.volume = 0;
        this.audio.play().then(() => this.fadeIn());
      }
    } else {
      this.isMuted = true;
      this.manualMute = true;
      localStorage.setItem("musicMuted", "true");
      this.updateVolumeIcon();
      this.fadeOut(() => this.audio.pause());
    }
  }

  updateVolumeIcon() {
    if (this.isMuted) {
      this.volumeIcon.classList.remove("fa-volume-up");
      this.volumeIcon.classList.add("fa-volume-mute");
    } else {
      this.volumeIcon.classList.remove("fa-volume-mute");
      this.volumeIcon.classList.add("fa-volume-up");
    }
  }

  nextSong() {
    const wasMuted = this.isMuted;
    this.fadeOut(() => {
      this.audio.pause();
      this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
      this.selectedSong = this.songs[this.currentSongIndex];
      this.audio = new Audio(this.selectedSong);
      this.audio.loop = true;
      this.audio.volume = 0;
      if (!wasMuted && !this.isAnyUnmutedVideoPlaying()) {
        this.audio.play().then(() => this.fadeIn());
      }
      this.isMuted = wasMuted;
      this.audio.addEventListener("ended", () => this.nextSong());
    });
  }

  observeVideos() {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => this.attachVideoListeners(video));

    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === "VIDEO") {
              this.attachVideoListeners(node);
            } else if (node.querySelectorAll) {
              const newVideos = node.querySelectorAll("video");
              newVideos.forEach((v) => this.attachVideoListeners(v));
            }
          });
        }
      });
    });

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  attachVideoListeners(video) {
    video.addEventListener("play", () => this.updateAudioState());
    video.addEventListener("pause", () => this.updateAudioState());
    video.addEventListener("ended", () => this.updateAudioState());
    video.addEventListener("volumechange", () => this.updateAudioState());
  }

  updateAudioState() {
    if (this.isAnyUnmutedVideoPlaying()) {
      this.isVideoInterference = true;
      if (!this.audio.paused) {
        this.fadeOut(() => {
          if (this.isVideoInterference) {
            this.audio.pause();
          }
        });
      }
    } else {
      this.isVideoInterference = false;
      if (!this.isMuted && !this.manualMute && this.audio.paused) {
        this.audio.volume = 0;
        this.audio.play().then(() => this.fadeIn());
      }
    }
  }

  isAnyUnmutedVideoPlaying() {
    const videos = document.querySelectorAll("video");
    return Array.from(videos).some((video) => {
      const isPlaying = !video.paused && !video.ended;
      return isPlaying && video.muted === false;
    });
  }
}

window.startMusic = function () {
  new MusicController();
};

/****************************************************
 *  Loading Screen + Combined Logic
 ****************************************************/ document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Initial scroll fix
    const initialScroll = window.scrollY;
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");

    // DOM elements
    const container = document.querySelector(".containercamera");
    const loadingVideo = document.querySelector(".videocamera"); // Use the loading screen video
    const flash = document.querySelector(".flash");
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");

    // Custom crosshair
    const crosshair = document.createElement("img");
    crosshair.src = "./assests/images/camera/frame.png";
    crosshair.className = "custom-crosshair";
    document.body.appendChild(crosshair);
    container.style.cursor = "none";

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        crosshair.style.display = "block";
        crosshair.style.left = `${e.pageX}px`;
        crosshair.style.top = `${e.pageY}px`;
      } else {
        crosshair.style.display = "none";
      }
    });

    container.addEventListener("mouseleave", () => {
      crosshair.style.display = "none";
    });

    // Shutter sound
    const shutterSound = new Audio("./assests/images/camera/camera.mp3");
    shutterSound.preload = "auto";

    // Track load states
    let isFullyLoaded = false;
    let isVideoLoaded = false;

    window.addEventListener("load", function () {
      isFullyLoaded = true;
    });

    // Wait for the loading video to be ready
    loadingVideo.addEventListener("canplaythrough", () => {
      isVideoLoaded = true;
    });

    // End loading screen when both page and video are ready
    function endLoadingScreen() {
      if (!isVideoLoaded) {
        console.log("Waiting for loading video to be ready...");
        return;
      }
      setTimeout(() => {
        loadingScreen.classList.add("hide");
        setTimeout(() => {
          loadingScreen.style.display = "none";
          mainContent.style.display = "block";
          document.body.classList.remove("no-scroll");
          //window.scrollTo(0, initialScroll);
          loadingVideo.pause(); // Pause the loading screen video
          crosshair.remove();

          // Start background music
          window.startMusic();
        }, 1000);
      }, 500);
    }

    // Use a timer to check if both conditions are met
    const checkLoadInterval = setInterval(() => {
      if (isFullyLoaded && isVideoLoaded) {
        endLoadingScreen();
        clearInterval(checkLoadInterval);
      }
    }, 100);

    // Fallback: after 15 seconds, end loading screen regardless
    setTimeout(() => {
      endLoadingScreen();
      clearInterval(checkLoadInterval);
    }, 15000);

    // Flash effect
    function triggerFlash() {
      flash.style.opacity = "1";
      setTimeout(() => {
        flash.style.transition = "opacity 0.5s ease";
        flash.style.opacity = "0";
        setTimeout(() => {
          flash.style.transition = "";
        }, 500);
      }, 50);
    }

    // Polaroid creation
    function createPolaroid(x, y, capturedImage) {
      const polaroid = document.createElement("div");
      polaroid.className = "polaroid";
      polaroid.style.zIndex = 99999;

      const viewportX = x - window.scrollX;
      const viewportY = y - window.scrollY;
      const rotation = Math.random() * 20 - 10;
      polaroid.style.setProperty("--rotation", `${rotation}deg`);

      polaroid.style.position = "fixed";
      polaroid.style.left = `${Math.min(
        Math.max(viewportX - 100, 0),
        window.innerWidth - 230
      )}px`;
      polaroid.style.top = `${Math.min(
        Math.max(viewportY - 100, 0),
        window.innerHeight - 230
      )}px`;

      const image = document.createElement("div");
      image.className = "polaroid-image";
      image.appendChild(capturedImage);

      polaroid.appendChild(image);
      document.body.appendChild(polaroid);

      requestAnimationFrame(() => {
        polaroid.classList.add("show");
      });

      setTimeout(() => {
        polaroid.classList.add("fade-out");
      }, 4000);

      setTimeout(() => {
        polaroid.remove();
      }, 5000);
    }

    // Capture logic: now capture from loadingVideo (the loading screen video)
    const captureCanvas = document.createElement("canvas");
    const ctx = captureCanvas.getContext("2d");

    container.addEventListener("click", async (e) => {
      shutterSound.currentTime = 0;
      shutterSound.play();

      triggerFlash();

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      captureCanvas.width = 200;
      captureCanvas.height = 200;

      const sourceX = Math.max(0, x - 100);
      const sourceY = Math.max(0, y - 100);
      const sourceWidth = Math.min(200, loadingVideo.videoWidth - sourceX);
      const sourceHeight = Math.min(200, loadingVideo.videoHeight - sourceY);

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

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = captureCanvas.width;
      finalCanvas.height = captureCanvas.height;
      const finalCtx = finalCanvas.getContext("2d");

      finalCtx.beginPath();
      finalCtx.roundRect(0, 0, finalCanvas.width, finalCanvas.height, 5);
      finalCtx.clip();
      finalCtx.drawImage(captureCanvas, 0, 0);

      createPolaroid(e.pageX, e.pageY, finalCanvas);
    });
  }
);
