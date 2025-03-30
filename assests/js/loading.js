/****************************************************
 *  MUSIC CONTROLLER (unchanged)
 ****************************************************/
class MusicController {
    static instance = null;
  
    static getInstance(userVolume = 0.5) {
      if (!MusicController.instance) {
        MusicController.instance = new MusicController(userVolume);
      }
      return MusicController.instance;
    }
  
    constructor(userVolume = 0.5) {
      if (MusicController.instance) {
        return MusicController.instance;
      }
  
      this.songs = [
        "./assests/music/music (1).mp3",
        "./assests/music/music (2).mp3",
        "./assests/music/music (3).mp3"
      ];
  
      // Flags controlling playback
      this.isMuted = true;
      this.manualMute = true; // User intent
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
      this.targetVolume = 0.5;
      this.isFading = false;
      this.fadeTimer = null;
  
      // Flag to track if a video is interfering with music
      this.isVideoInterference = false;
  
      // Make the controller visible
      this.controller.classList.add("visible");
  
      this.init();
      MusicController.instance = this;
    }
  
    init() {
      if (localStorage.getItem("musicMuted") === "true" || this.manualMute) {
        this.isMuted = true;
        this.manualMute = true;
        this.updateVolumeIcon();
      } else {
        this.isMuted = false;
        this.manualMute = false;
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
  
  // Expose a global function to start music
  window.startMusic = function () {
    MusicController.getInstance();
  };
  
  /****************************************************
   *  LOADING SCREEN LOGIC (cleaned of camera code)
   ****************************************************/ document.addEventListener("DOMContentLoaded", function () {
  // Prevent user from scrolling on load
  const initialScroll = window.scrollY;
  window.scrollTo(0, 0);
  document.body.classList.add("no-scroll");

  const loadingVideo = document.querySelector(".videocamera");
  const loadingScreen = document.getElementById("loading-screen");
  const mainContent = document.getElementById("main-content");

  let isFullyLoaded = false;
  let isVideoLoaded = true;

  // Full page load
  window.addEventListener("load", () => {
    isFullyLoaded = true;
  });


  // ========== FLASHING WORDS LOGIC (random start) ==========
  const flashTextElement = document.getElementById("flashing-text");
  const flashingWords = [
    "Authenticity",
    "Storytelling",
    "Creativity",
    "Inspiration",
    "Purpose",
    "Expression",
    "Community",
    "Emotion",
    "Connection",
    "Empathy",
    "Innovation",
    "Growth",
    "Heartwarming",
    "Narrative",
    "Imagination",
    "Warmth",
    "Relatable",
    "Impact",
    "Digital",
    "Strategy",
    "Social",
    "Passion",
    "Engagement",
    "Conversation",
    "Insight",
    "Branding",
    "Uplifting",
    "Approachable",
    "Courage",
    "Excellence",
    "Vision",
    "Sincerity",
    "Intriguing",
    "Bold",
    "Unique",
    "Friendly",
    "Inviting",
    "Originality",
    "Captivating",
    "Tailored",
    "Empowering",
    "Diary",
    "Dear Diary",
    "Media",
    "Online",
    "Audience",
    "Relatability",
    "Dream",
    "Motivation",
    "Experience",
    "Collaborate",
    "Deepen",
    "Express",
    "Highlight",
    "Vibrant",
    "Authentic",
    "Sophistication",
    "Memorable",
    "Effective",
    "Flourish",
    "Holistic",
    "Mindful",
    "Wellness",
    "Wellbeing",
    "Balance",
    "Local",
    "Women-led",
    "Entrepreneur",
    "Confidence",
    "Positivity",
    "Illuminating",
    "Remarkable",
    "Powerful",
    "Insightful",
    "Friendly Faces",
    "Purposeful",
    "Thoughtful",
    "Refreshing",
    "Curated",
    "Story-driven",
    "Genuine",
    "Alive",
    "Spark",
    "Curiosity",
    "Deeper Meaning",
    "Inner Voice",
    "Harmony",
    "Growth Mindset",
    "Warm-hearted",
    "Vulnerability",
    "Beirut",
    "Personal",
    "Resonate",
    "Voice",
    "Bravery",
    "Success",
    "Emotion-led",
    "Expressive"
  ];
  

  // Pick a random starting index
  let currentIndex = Math.floor(Math.random() * flashingWords.length);

  // Update the text every 200 ms
  setInterval(() => {
    flashTextElement.textContent = flashingWords[currentIndex];
    currentIndex = (currentIndex + 1) % flashingWords.length;
  }, 120);
  // ========================================================

  function endLoadingScreen(isFallback = false) {
    if (!isVideoLoaded && !isFallback) {
      console.log("Waiting for loading video to be ready...");
      return;
    }
    setTimeout(() => {
      loadingScreen.classList.add("hide");
      setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.style.display = "block";
        document.body.classList.remove("no-scroll");
        // Start background music now
        window.startMusic();
      }, 1000);
    }, 500);
  }

  const checkLoadInterval = setInterval(() => {
    if (isFullyLoaded && isVideoLoaded) {
      endLoadingScreen();
      clearInterval(checkLoadInterval);
    }
  }, 800);

  // Fallback after 15s
  setTimeout(() => {
    endLoadingScreen(true);
    clearInterval(checkLoadInterval);
  }, 15000);
});
