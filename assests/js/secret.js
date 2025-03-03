document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.secret-section');
  // --- Physics constants ---
  const FRICTION = 0.995;
  const MAX_ROTATION_SPEED = 8;
  const THROW_MULTIPLIER = 1.2;

  // Grab all keys from the DOM
  const keys = document.querySelectorAll('.flying-key');

  // Each keyData holds state for ONE key
  const keysData = [];
  
  // Initialize each key’s data
  keys.forEach((key) => {
    keysData.push({
      original: key,      // The original DOM element in the flex layout
      clone: null,        // The draggable/floatable clone
      isDragging: false,
      isFloating: false,  // True once “picked up” the first time
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      rotation: 0,
      rotationSpeed: 0,
      lastX: 0,
      lastY: 0
    });
  });

  // ------------------------------------------------------------
  // Utility: Update the clone’s position & rotation via transform
  // ------------------------------------------------------------
  function updateClonePosition(keyData) {
    if (!keyData.clone) return;
    keyData.clone.style.transform = `translate3d(${keyData.x}px, ${keyData.y}px, 0) rotate(${keyData.rotation}deg)`;
  }
  

  // ------------------------------------------------------------
  // startDrag: Called on mousedown/touchstart
  // ------------------------------------------------------------
 // Updated startDrag function:
 function startDrag(e, keyData) {
  e.preventDefault();
  if (!keyData.isFloating) {
    keyData.isFloating = true;
    const rect = keyData.original.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Create the clone and append it to the container
    const clone = keyData.original.cloneNode(true);
    clone.classList.add('drag-clone');
    clone.style.position = 'absolute'; // Absolute positioning within container

    // Set initial position relative to the container, stored in keyData
    keyData.x = rect.left - containerRect.left;
    keyData.y = rect.top - containerRect.top;

    // Set left/top to 0 so that transform is the only positioning mechanism
    clone.style.left = '0px';
    clone.style.top = '0px';
    clone.style.zIndex = '999999';
    clone.style.pointerEvents = 'auto';

    container.appendChild(clone);

    // Attach listeners to the clone as before
    clone.addEventListener('mousedown', ev => startDrag(ev, keyData));
    clone.addEventListener('touchstart', ev => startDrag(ev, keyData), { passive: false });

    keyData.clone = clone;

    // Hide the original key
    keyData.original.style.visibility = 'hidden';
  }

  keyData.isDragging = true;
  keyData.clone.classList.add('dragging');

  const touch = e.type === 'touchstart' ? e.touches[0] : e;
  keyData.lastX = touch.clientX;
  keyData.lastY = touch.clientY;

  keyData.rotationSpeed = 0;}

  // ------------------------------------------------------------
  // drag: Called on mousemove/touchmove
  // ------------------------------------------------------------
  function drag(e, keyData) {
    if (!keyData.isDragging) return;
    e.preventDefault();

    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    const deltaX = touch.clientX - keyData.lastX;
    const deltaY = touch.clientY - keyData.lastY;

    // Update velocities
    keyData.velocityX = deltaX;
    keyData.velocityY = deltaY;

    // Update the clone position
    keyData.x += deltaX;
    keyData.y += deltaY;

    // Calculate rotation speed based on movement
    const moveSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    keyData.rotationSpeed = (moveSpeed * 0.1) * (deltaX > 0 ? 1 : -1);
    keyData.rotationSpeed = Math.max(-MAX_ROTATION_SPEED, Math.min(MAX_ROTATION_SPEED, keyData.rotationSpeed));

    keyData.lastX = touch.clientX;
    keyData.lastY = touch.clientY;

    // Apply transform
    updateClonePosition(keyData);
  }

  // ------------------------------------------------------------
  // endDrag: Called on mouseup/touchend
  // ------------------------------------------------------------
  function endDrag(keyData) {
    if (!keyData.isDragging) return;
    keyData.isDragging = false;
    keyData.clone.classList.remove('dragging');

    // Throw it a bit faster
    keyData.velocityX *= THROW_MULTIPLIER;
    keyData.velocityY *= THROW_MULTIPLIER;

    // Add some random tweak to rotation
    keyData.rotationSpeed += (Math.random() - 0.5) * 4;
  }

  // ------------------------------------------------------------
  // animate: Loop called via requestAnimationFrame
  // ------------------------------------------------------------
   // Updated animate function:
   function animate() {
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    keysData.forEach(keyData => {
      if (keyData.isFloating && !keyData.isDragging && keyData.clone) {
        keyData.velocityX *= FRICTION;
        keyData.velocityY *= FRICTION;
        keyData.x += keyData.velocityX;
        keyData.y += keyData.velocityY;

        keyData.rotation += keyData.rotationSpeed;
        keyData.rotationSpeed *= FRICTION;

        // Use container boundaries instead of window dimensions
        if (keyData.x > width)  keyData.x = 0;
        if (keyData.x < 0)      keyData.x = width;
        if (keyData.y > height) keyData.y = 0;
        if (keyData.y < 0)      keyData.y = height;

        updateClonePosition(keyData);
      }
    });
    // ------------------------------------------------------------
    // Collision detection and response between keys
    // ------------------------------------------------------------
    for (let i = 0; i < keysData.length; i++) {
      const keyA = keysData[i];
      if (!keyA.clone) continue;
      // Get keyA’s size from its clone’s bounding box
      const rectA = keyA.clone.getBoundingClientRect();
      const centerA_x = keyA.x + rectA.width / 2;
      const centerA_y = keyA.y + rectA.height / 2;
      const radiusA = rectA.width / 2; // assuming square keys

      for (let j = i + 1; j < keysData.length; j++) {
        const keyB = keysData[j];
        if (!keyB.clone) continue;
        const rectB = keyB.clone.getBoundingClientRect();
        const centerB_x = keyB.x + rectB.width / 2;
        const centerB_y = keyB.y + rectB.height / 2;
        const radiusB = rectB.width / 2; // assuming square keys

        // Calculate distance between centers
        const dx = centerB_x - centerA_x;
        const dy = centerB_y - centerA_y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = radiusA + radiusB;

        // If the keys are overlapping...
        if (distance < minDistance && distance > 0) {
          // Calculate the amount of overlap
          const overlap = (minDistance - distance) / 2;
          // Collision normal (avoid division by zero)
          const nx = dx / (distance || 1);
          const ny = dy / (distance || 1);

          // Separate the keys so they no longer overlap
          keyA.x -= overlap * nx;
          keyA.y -= overlap * ny;
          keyB.x += overlap * nx;
          keyB.y += overlap * ny;
          updateClonePosition(keyA);
          updateClonePosition(keyB);

          // -----------------------------
          // Adjust velocities (elastic collision for equal mass)
          // -----------------------------
          // Compute the velocity components along the collision normal
          const vA_dot = keyA.velocityX * nx + keyA.velocityY * ny;
          const vB_dot = keyB.velocityX * nx + keyB.velocityY * ny;

          // For equal mass, simply swap the normal components
          const vA_tangentX = keyA.velocityX - vA_dot * nx;
          const vA_tangentY = keyA.velocityY - vA_dot * ny;
          const vB_tangentX = keyB.velocityX - vB_dot * nx;
          const vB_tangentY = keyB.velocityY - vB_dot * ny;

          keyA.velocityX = vA_tangentX + vB_dot * nx;
          keyA.velocityY = vA_tangentY + vB_dot * ny;
          keyB.velocityX = vB_tangentX + vA_dot * nx;
          keyB.velocityY = vB_tangentY + vA_dot * ny;
        }
      }
    }

    requestAnimationFrame(animate);
  }

  // ------------------------------------------------------------
  // Attach event listeners for each original key
  // ------------------------------------------------------------
  keys.forEach((key, index) => {
    const keyData = keysData[index];

    // Start drag
    key.addEventListener('mousedown', e => startDrag(e, keyData));
    key.addEventListener('touchstart', e => startDrag(e, keyData), { passive: false });

    // Dragging
    window.addEventListener('mousemove', e => drag(e, keyData));
    window.addEventListener('touchmove', e => drag(e, keyData), { passive: false });

    // End drag
    window.addEventListener('mouseup', () => endDrag(keyData));
    window.addEventListener('touchend', () => endDrag(keyData));
  });

  // ------------------------------------------------------------
  // Reset logic: remove clones, restore original keys
  // ------------------------------------------------------------
  const resetElement = document.querySelector('.reset-text');
  resetElement.addEventListener('click', function() {
    keysData.forEach(keyData => {
      // 1) Remove any floating clone from the DOM
      if (keyData.clone) {
        keyData.clone.remove();
        keyData.clone = null;
      }
      
      // 2) Reset all state
      keyData.isFloating = false;
      keyData.isDragging = false;
      keyData.x = 0;
      keyData.y = 0;
      keyData.velocityX = 0;
      keyData.velocityY = 0;
      keyData.rotation = 0;
      keyData.rotationSpeed = 0;

      // 3) Show the original key again
      keyData.original.style.visibility = 'visible';
    });
  });

  // Kick off the animation loop
  animate();

});
