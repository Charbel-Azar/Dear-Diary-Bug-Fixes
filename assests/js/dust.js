/**
 * CSS-based Fairy Dust Effect
 * This is a lightweight alternative to the Canvas-based implementation
 * that uses DOM elements and CSS animations for better performance.
 */
class LightFairyDust {
    constructor(container) {
        this.container = container;
        this.isActive = false;
        this.particles = [];
        this.maxParticles = 40;
        this.mouseMoveThrottle = false;
        this.throttleDelay = 50; // ms between particle creation
        this.cleanupInterval = null;

        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.cleanup = this.cleanup.bind(this);
        
        // Add event listeners
        this.addEventListeners();
        
        // Add needed CSS if not already present
        this.injectStyles();
    }

    injectStyles() {
        // Only inject the styles if they don't already exist
        if (!document.getElementById('fairy-dust-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'fairy-dust-styles';
            styleSheet.textContent = `
                .fairy-particle {
                    position: absolute;
                    background-color: rgba(226, 203, 159, 0.8);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    box-shadow: 0 0 10px rgba(226, 203, 159, 0.6);
                }
                
                @keyframes fairy-fade {
                    0% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(-40px) scale(0.2); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }

    createParticle(x, y) {
        if (!this.isActive || this.particles.length >= this.maxParticles) return;
        
        // Create particle element
        const particle = document.createElement('div');
        particle.className = 'fairy-particle';
        
        // Random size (2-6px)
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Calculate position relative to container
        const rect = this.container.getBoundingClientRect();
        particle.style.left = `${x - rect.left}px`;
        particle.style.top = `${y - rect.top}px`;
        
        // Random trajectory
        const xOffset = (Math.random() - 0.5) * 30;
        const duration = 1.5 + Math.random();
        
        // Apply animation
        particle.style.animation = `fairy-fade ${duration}s ease-out forwards`;
        particle.style.animationName = 'fairy-fade';
        
        // Add random transform for trajectory
        particle.style.setProperty('--x-offset', `${xOffset}px`);
        
        // Add to container and track
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            createdAt: Date.now(),
            duration: duration * 1000 // convert to ms
        });
        
        // Set timeout to remove particle after animation completes
        setTimeout(() => {
            this.removeParticle(particle);
        }, duration * 1000);
    }

    removeParticle(particleElement) {
        // Find the particle in our tracked array
        const index = this.particles.findIndex(p => p.element === particleElement);
        
        if (index !== -1) {
            // Remove from DOM
            if (particleElement.parentNode) {
                particleElement.parentNode.removeChild(particleElement);
            }
            
            // Remove from our tracking array
            this.particles.splice(index, 1);
        }
    }

    handleMouseMove(e) {
        // Throttle particle creation
        if (!this.mouseMoveThrottle) {
            this.mouseMoveThrottle = true;
            
            // Create 2-3 particles at current location
            const particleCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < particleCount; i++) {
                this.createParticle(e.clientX, e.clientY);
            }
            
            // Reset throttle after delay
            setTimeout(() => {
                this.mouseMoveThrottle = false;
            }, this.throttleDelay);
        }
    }

    handleMouseEnter() {
        this.isActive = true;
        
        // Start periodic cleanup for any stray particles
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            this.particles.forEach(particle => {
                if (now - particle.createdAt > particle.duration + 500) {
                    this.removeParticle(particle.element);
                }
            });
        }, 1000);
    }

    handleMouseLeave() {
        this.isActive = false;
        
        // Clear cleanup interval
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    addEventListeners() {
        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('mouseenter', this.handleMouseEnter);
        this.container.addEventListener('mouseleave', this.handleMouseLeave);
        window.addEventListener('beforeunload', this.cleanup);
    }

    removeEventListeners() {
        this.container.removeEventListener('mousemove', this.handleMouseMove);
        this.container.removeEventListener('mouseenter', this.handleMouseEnter);
        this.container.removeEventListener('mouseleave', this.handleMouseLeave);
        window.removeEventListener('beforeunload', this.cleanup);
    }

    cleanup() {
        // Remove all particles
        this.particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        
        this.particles = [];
        
        // Clear interval
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        
        // Remove event listeners
        this.removeEventListeners();
    }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('fairySection');
    
    if (section) {
        // Create the effect directly on the section
        const fairyEffect = new LightFairyDust(section);
        
        // Store reference for potential cleanup
        window.fairyDustInstance = fairyEffect;
    } else {
        console.warn('Fairy section not found in the document');
    }
});

/**
 * Fairy Dust Cursor Effect
 * Creates a magical fairy dust effect that follows the cursor
 */

(function() {
  // Create a self-contained module
  const FairyDustCursor = {
    // Customizable options - golden colors only
    colors: ["#FFD700", "#FFC125", "#E2CB9F", "#FFDF00", "#F0E68C", "#DAA520", "#FFD93D", "#FEE9A0"],
    // Use a mix of fairy-like characters
    characters: ["✨", "★", "✩", "✦", "✮", "✯", "⋆", "·", "⁺", "°", "⊹"],
    particleLifeSpan: 200, // Increased lifespan for more floaty effect
    maxParticles: 100, // Reduced from 150 for smoother performance
    particleInterval: 4, // Reduced frequency (higher number = less frequent)
    gradientHeight: 80,
    
    // Internal state
    particles: [],
    container: null,
    cursorPos: { x: 0, y: 0 },
    frameCount: 0,
    isActive: false, // Start inactive until mouse enters
    isInitialized: false,
    intervalId: null,
    originalCursor: null, // Store the original cursor style
    originalPadding: null, // Store the original padding
    
    // Init function to start the effect
    init: function(targetElement) {
      if (this.isInitialized) return;
      
      this.isInitialized = true;
      this.container = targetElement || document.body;
      
      // Store the original cursor style before changing it
      this.originalCursor = getComputedStyle(this.container).cursor;
      
      // Store original padding
      this.originalPadding = {
        top: getComputedStyle(this.container).paddingTop,
        right: getComputedStyle(this.container).paddingRight,
        bottom: getComputedStyle(this.container).paddingBottom,
        left: getComputedStyle(this.container).paddingLeft
      };
      
      // Add padding to the top to account for the gradient
      const currentPaddingTop = parseInt(getComputedStyle(this.container).paddingTop) || 0;
      this.container.style.paddingTop = (currentPaddingTop + this.gradientHeight) + 'px';
      
      // Create parent element to hold particles
      this.particleContainer = document.createElement('div');
      this.particleContainer.className = 'fairy-dust-container';
      this.particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 10000;
        width: 100%;
        height: 100%;
        overflow: hidden;
      `;
      
      // Add gradient div at the top for smooth transition
      const gradientDiv = document.createElement('div');
      gradientDiv.className = 'fairy-dust-gradient';
      gradientDiv.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: ${this.gradientHeight}px;
        background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
        pointer-events: none;
        z-index: 10001;
      `;
      
      // Ensure the container has position relative if it's not already positioned
      if (getComputedStyle(this.container).position === 'static') {
        this.container.style.position = 'relative';
      }
      
      this.container.appendChild(this.particleContainer);
      this.container.appendChild(gradientDiv);
      
      // Bind context to methods
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleTouchMove = this.handleTouchMove.bind(this);
      this.handleResize = this.handleResize.bind(this);
      this.handleMouseEnter = this.handleMouseEnter.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.loop = this.loop.bind(this);
      
      // Bind events
      this.addEventListeners();
      
      // Start animation loop but don't create particles until mouse enters
      this.startLoop();
      
      console.log('Fairy dust initialized on', this.container);
    },
    
    // Add all event listeners
    addEventListeners: function() {
      this.container.addEventListener('mousemove', this.handleMouseMove);
      this.container.addEventListener('touchmove', this.handleTouchMove);
      this.container.addEventListener('touchstart', this.handleTouchMove);
      this.container.addEventListener('mouseenter', this.handleMouseEnter);
      this.container.addEventListener('mouseleave', this.handleMouseLeave);
      window.addEventListener('resize', this.handleResize);
    },
    
    // Remove all event listeners
    removeEventListeners: function() {
      this.container.removeEventListener('mousemove', this.handleMouseMove);
      this.container.removeEventListener('touchmove', this.handleTouchMove);
      this.container.removeEventListener('touchstart', this.handleTouchMove);
      this.container.removeEventListener('mouseenter', this.handleMouseEnter);
      this.container.removeEventListener('mouseleave', this.handleMouseLeave);
      window.removeEventListener('resize', this.handleResize);
    },
    
    // Handle mouse entering the container
    handleMouseEnter: function(e) {
      console.log('Mouse entered fairy section');
      const rect = this.container.getBoundingClientRect();
      this.cursorPos.x = e.clientX - rect.left;
      this.cursorPos.y = e.clientY - rect.top;
      this.isActive = true;
      
      // Hide the cursor
      this.container.style.cursor = 'none';
    },
    
    // Handle mouse leaving the container
    handleMouseLeave: function(e) {
      console.log('Mouse left fairy section');
      this.isActive = false;
      
      // Restore the original cursor
      this.container.style.cursor = this.originalCursor;
      
      // Clear existing particles immediately
      this.clearParticles();
    },
    
    // Handle mouse movement
    handleMouseMove: function(e) {
      const rect = this.container.getBoundingClientRect();
      this.cursorPos.x = e.clientX - rect.left;
      this.cursorPos.y = e.clientY - rect.top;
    },
    
    // Handle touch events
    handleTouchMove: function(e) {
      if (e.touches.length > 0 && this.isActive) {
        const rect = this.container.getBoundingClientRect();
        this.cursorPos.x = e.touches[0].clientX - rect.left;
        this.cursorPos.y = e.touches[0].clientY - rect.top;
      }
    },
    
    // Handle window resize
    handleResize: function() {
      // Nothing specific needed here, as we use relative positioning
    },
    
    // Add a new particle
    addParticle: function() {
      // Only add particles if active and below max limit
      if (!this.isActive || this.particles.length >= this.maxParticles) return;
      
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const character = this.characters[Math.floor(Math.random() * this.characters.length)];
      
      // More randomized size for variety - smaller on average
      const size = 6 + Math.random() * 10;
      
      // Random animation duration for twinkling effect - slower
      const twinkleSpeed = 0.3 + Math.random() * 0.7;
      
      const particle = {
        element: document.createElement('span'),
        position: { 
          x: this.cursorPos.x + (Math.random() - 0.5) * 12, // Reduced spread
          y: this.cursorPos.y + (Math.random() - 0.5) * 12  // Reduced spread
        },
        velocity: {
          // Much slower, more gentle velocity
          x: (Math.random() - 0.5) * 0.8,
          y: -0.3 - Math.random() * 1.2 // Significantly slower upward movement
        },
        size: size,
        lifeSpan: this.particleLifeSpan + Math.random() * 80, // More varied and longer lifespan
        initialLifeSpan: this.particleLifeSpan + Math.random() * 80, // Store initial value for calculations
        color: color,
        twinkleSpeed: twinkleSpeed,
        rotate: Math.random() * 360, // Random rotation
        rotateSpeed: (Math.random() - 0.5) * 1.2, // Slower rotation
        character: character,
        // Add some wobble to each particle - slower and gentler
        wobble: {
          x: Math.random() * 2 * Math.PI,
          y: Math.random() * 2 * Math.PI,
          xSpeed: 0.01 + Math.random() * 0.02, // Slower wobble
          ySpeed: 0.01 + Math.random() * 0.02, // Slower wobble
          amplitude: 0.3 + Math.random() * 0.8  // Smaller amplitude
        }
      };
      
      // Set up the element
      particle.element.innerHTML = character;
      particle.element.style.cssText = `
        position: absolute;
        display: block;
        pointer-events: none;
        z-index: 10000;
        font-size: ${particle.size}px;
        color: ${color};
        will-change: transform;
        text-shadow: 0 0 3px ${color}, 0 0 5px rgba(255, 215, 0, 0.5);
        left: 0;
        top: 0;
      `;
      
      // Add to DOM and track
      this.particleContainer.appendChild(particle.element);
      this.particles.push(particle);
    },
    
    // Clear all particles immediately
    clearParticles: function() {
      // Remove all particles immediately when mouse leaves
      while (this.particles.length) {
        const particle = this.particles.pop();
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      }
    },
    
    // Update all particles
    updateParticles: function() {
      // Create new particles continuously when active
      if (this.isActive && this.frameCount % this.particleInterval === 0) {
        // Create 1-2 particles every few frames for continuous effect
        const particleCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < particleCount; i++) {
          this.addParticle();
        }
      }
      
      // Update existing particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        
        // Update position with velocity plus wobble effect
        p.wobble.x += p.wobble.xSpeed;
        p.wobble.y += p.wobble.ySpeed;
        
        const wobbleX = Math.sin(p.wobble.x) * p.wobble.amplitude;
        const wobbleY = Math.sin(p.wobble.y) * p.wobble.amplitude;
        
        p.position.x += p.velocity.x + wobbleX;
        p.position.y += p.velocity.y + wobbleY;
        
        // Slow down as it rises (more floaty) - even slower deceleration
        p.velocity.y *= 0.99;
        
        // Very slight acceleration downward (gravity) - reduced
        p.velocity.y += 0.005;
        
        // Update rotation - slower
        p.rotate += p.rotateSpeed * 0.8;
        
        // Decrease lifespan more slowly
        p.lifeSpan -= 0.9;
        
        // Calculate opacity with a twinkling effect using sine wave
        const twinkling = 0.7 + 0.3 * Math.sin(p.twinkleSpeed * p.lifeSpan / 10);
        const baseOpacity = p.lifeSpan / p.initialLifeSpan;
        const opacity = baseOpacity * twinkling;
        
        // Update the style with transforms for better performance
        p.element.style.transform = `
          translate3d(${p.position.x}px, ${p.position.y}px, 0)
          rotate(${p.rotate}deg)
          scale(${baseOpacity * 0.5 + 0.5})
        `;
        p.element.style.opacity = opacity;
      }
      
      // Remove dead particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (this.particles[i].lifeSpan < 0) {
          const particle = this.particles[i];
          
          // Remove DOM element
          if (particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
          }
          
          // Remove from array
          this.particles.splice(i, 1);
        }
      }
    },
    
    // Animation loop
    loop: function() {
      this.updateParticles();
      this.frameCount++;
      
      // Request next frame
      this.animationFrameId = requestAnimationFrame(this.loop);
    },
    
    // Start just the animation loop
    startLoop: function() {
      if (this.animationFrameId) return;
      
      this.frameCount = 0;
      this.loop();
    },
    
    // Stop the effect and animation
    stopLoop: function() {
      // Cancel the animation frame
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      
      // Clear all particles
      this.clearParticles();
    },
    
    // Full cleanup of all resources
    cleanup: function() {
      // Stop animation
      this.stopLoop();
      
      // Clear the interval if any
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      
      // Restore the cursor
      if (this.container) {
        this.container.style.cursor = this.originalCursor;
        
        // Restore original padding
        if (this.originalPadding) {
          this.container.style.paddingTop = this.originalPadding.top;
        }
      }
      
      // Remove the gradient div
      const gradientDiv = this.container.querySelector('.fairy-dust-gradient');
      if (gradientDiv) {
        gradientDiv.parentNode.removeChild(gradientDiv);
      }
      
      // Remove the container
      if (this.particleContainer && this.particleContainer.parentNode) {
        this.particleContainer.parentNode.removeChild(this.particleContainer);
      }
      
      // Remove event listeners
      this.removeEventListeners();
      
      // Reset state
      this.isInitialized = false;
      this.isActive = false;
    }
  };
  
  // Initialize the effect on DOM content loaded
  document.addEventListener('DOMContentLoaded', function() {
    const fairySection = document.getElementById('fairySection');
    
    if (fairySection) {
      console.log('Found fairy section, initializing effect...');
      
      // Wait a bit to ensure everything is loaded
      setTimeout(() => {
        // Create or find the container for dust particles
        FairyDustCursor.init(fairySection);
      }, 500);
      
      // Clean up on page unload
      window.addEventListener('beforeunload', function() {
        FairyDustCursor.cleanup();
      });
    } else {
      console.warn('Fairy section not found in the document');
    }
    
    // Store the instance for potential access
    window.FairyDustCursor = FairyDustCursor;
  });
})();