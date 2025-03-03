// ================================
// Infinite Slider Setup
// ================================

// The element holding both slide sets
const slider = document.querySelector('.slidere');
// The container that receives pointer events
const sliderContainer = document.querySelector('.slidere-container');

let isDragging = false;
let startX = 0;            // X position when dragging starts
let initialOffset = 0;     // Offset at the start of dragging
let offset = 0;            // Current horizontal offset (in pixels)
let velocity = 0;          // Momentum (in pixels per ms, scaled up)
let lastX = 0;             // Previous pointer X (for velocity calculation)
let lastTimestamp = 0;     // Timestamp of the previous pointer event

// CONFIGURATION
const momentumFriction = 0.96;  // Deceleration factor (0 < factor < 1)
const minVelocity = 0.1;        // Minimum momentum threshold

// Main animation loop for infinite scrolling
function update() {
  // If not dragging and momentum exists, update the offset
  if (!isDragging && Math.abs(velocity) > minVelocity) {
    offset += velocity;
    velocity *= momentumFriction;
  } else if (!isDragging && Math.abs(velocity) <= minVelocity) {
    velocity = 0;
  }
  
  // Determine wrap-point: one set of slides = half the total width
  const halfWidth = slider.scrollWidth / 2;
  
  // Wrap the offset so it stays within [0, halfWidth)
  if (offset >= halfWidth) {
    offset -= halfWidth;
  } else if (offset < 0) {
    offset += halfWidth;
  }
  
  // Apply the transform to move the slider horizontally
  slider.style.transform = `translateX(-${offset}px)`;
  
  requestAnimationFrame(update);
}
update();

// ================================
// Drag / Flick Handlers (Mouse)
// ================================

sliderContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  velocity = 0;  // Cancel existing momentum
  startX = e.pageX;
  initialOffset = offset;
  lastX = e.pageX;
  lastTimestamp = Date.now();
});

sliderContainer.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  
  const x = e.pageX;
  const dx = x - startX;
  // Update offset (moving left increases offset)
  offset = initialOffset - dx;
  
  // Calculate velocity from pointer movement
  const now = Date.now();
  const dt = now - lastTimestamp;
  if (dt > 0) {
    // (lastX - x) is positive when moving left
    velocity = ((lastX - x) / dt) * 15;  // Tune the multiplier (15) as needed
  }
  lastX = x;
  lastTimestamp = now;
});

sliderContainer.addEventListener('mouseup', () => {
  isDragging = false;
});
sliderContainer.addEventListener('mouseleave', () => {
  isDragging = false;
});

// ================================
// Drag / Flick Handlers (Touch for Mobile)
// ================================

sliderContainer.addEventListener('touchstart', (e) => {
  isDragging = true;
  velocity = 0;
  startX = e.touches[0].pageX;
  initialOffset = offset;
  lastX = e.touches[0].pageX;
  lastTimestamp = Date.now();
});

sliderContainer.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  
  const x = e.touches[0].pageX;
  const dx = x - startX;
  offset = initialOffset - dx;
  
  const now = Date.now();
  const dt = now - lastTimestamp;
  if (dt > 0) {
    velocity = ((lastX - x) / dt) * 15;
  }
  lastX = x;
  lastTimestamp = now;
});

sliderContainer.addEventListener('touchend', () => {
  isDragging = false;
});

// ================================
// Mobile "Auto-Open" Behavior When Envelope is Centered
// (Only on devices without hover capability)
// ================================

if (window.matchMedia("(hover: none)").matches) {
  function checkCenterEnvelopes() {
    const viewportCenter = window.innerWidth / 2;  // Horizontal center of viewport in pixels
    const threshold = 50;  // Envelope center must be within 50px of viewport center to open
    
    // For each envelope, check its center position
    document.querySelectorAll('.wrappere').forEach(envelope => {
      const rect = envelope.getBoundingClientRect();
      const envelopeCenter = rect.left + rect.width / 2;
      
      // If near the viewport center, add the "open" class; otherwise, remove it
      if (Math.abs(envelopeCenter - viewportCenter) < threshold) {
        envelope.classList.add('open');
      } else {
        envelope.classList.remove('open');
      }
    });
    
    requestAnimationFrame(checkCenterEnvelopes);
  }
  checkCenterEnvelopes();
}
