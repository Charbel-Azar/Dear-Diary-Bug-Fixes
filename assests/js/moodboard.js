

document.addEventListener('DOMContentLoaded', function() {
    const moodboard = document.querySelector('.moodboard');
    const elements = document.querySelectorAll('.element');
    const BORDER_SIZE = 10; // Size of the invisible resize border
    
    elements.forEach(element => {
      // Initialize random movement properties for each element
      const movementProperties = {
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        x: parseFloat(element.style.left) || Math.random() * (moodboard.clientWidth - element.clientWidth),
        y: parseFloat(element.style.top) || Math.random() * (moodboard.clientHeight - element.clientHeight)
      };
      
      let isDragging = false;
      let isResizing = false;
      let resizeEdges = { top: false, right: false, bottom: false, left: false };
      let startX, startY, startWidth, startHeight, elementX = movementProperties.x, elementY = movementProperties.y;
      
      function getResizeEdges(e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        return {
          top: y <= BORDER_SIZE,
          right: rect.width - x <= BORDER_SIZE,
          bottom: rect.height - y <= BORDER_SIZE,
          left: x <= BORDER_SIZE
        };
      }
      
      function updateResizeCursor(e) {
        const edges = getResizeEdges(e);
        if (edges.left && edges.top) element.style.cursor = 'nw-resize';
        else if (edges.right && edges.top) element.style.cursor = 'ne-resize';
        else if (edges.right && edges.bottom) element.style.cursor = 'se-resize';
        else if (edges.left && edges.bottom) element.style.cursor = 'sw-resize';
        else if (edges.left || edges.right) element.style.cursor = 'ew-resize';
        else if (edges.top || edges.bottom) element.style.cursor = 'ns-resize';
        else element.style.cursor = 'grab';
        return edges;
      }
      
      function startInteraction(e) {
        const edges = getResizeEdges(e);
        if (edges.top || edges.right || edges.bottom || edges.left) {
          isResizing = true;
          resizeEdges = edges;
        } else {
          isDragging = true;
          element.style.cursor = 'grabbing';
        }
        
        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        elementX = parseFloat(element.style.left) || 0;
        elementY = parseFloat(element.style.top) || 0;
        e.preventDefault();
      }
      
      function move(e) {
        if (isDragging) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          
          elementX = Math.max(0, Math.min(elementX + dx, moodboard.clientWidth - element.offsetWidth));
          elementY = Math.max(0, Math.min(elementY + dy, moodboard.clientHeight - element.offsetHeight));
          
          element.style.left = elementX + 'px';
          element.style.top = elementY + 'px';
          
          startX = e.clientX;
          startY = e.clientY;
        } else if (isResizing) {
          const minSize = 100;
          let newWidth = startWidth;
          let newHeight = startHeight;
          let newX = elementX;
          let newY = elementY;
          
          if (resizeEdges.right) {
            newWidth = Math.max(minSize, startWidth + (e.clientX - startX));
          }
          if (resizeEdges.left) {
            const dx = e.clientX - startX;
            newWidth = Math.max(minSize, startWidth - dx);
            if (newWidth !== startWidth - dx) {
              dx = startWidth - newWidth;
            }
            newX = elementX + dx;
          }
          if (resizeEdges.bottom) {
            newHeight = Math.max(minSize, startHeight + (e.clientY - startY));
          }
          if (resizeEdges.top) {
            const dy = e.clientY - startY;
            newHeight = Math.max(minSize, startHeight - dy);
            if (newHeight !== startHeight - dy) {
              dy = startHeight - newHeight;
            }
            newY = elementY + dy;
          }
          
          // Apply new dimensions and position
          element.style.width = newWidth + 'px';
          element.style.height = newHeight + 'px';
          element.style.left = newX + 'px';
          element.style.top = newY + 'px';
        } else {
          // Update cursor based on position
          updateResizeCursor(e);
        }
      }
      
      function stopInteraction() {
        isDragging = false;
        isResizing = false;
        element.style.cursor = 'grab';
      }
      
      // Autonomous movement function
      function autonomousMove() {
        if (!isDragging && !isResizing) {
          elementX += Math.cos(movementProperties.angle) * movementProperties.speed;
          elementY += Math.sin(movementProperties.angle) * movementProperties.speed;
          
          const bounds = moodboard.getBoundingClientRect();
          const elementBounds = element.getBoundingClientRect();
          
          if (elementX <= 0 || elementX + elementBounds.width >= bounds.width) {
            movementProperties.angle = Math.PI - movementProperties.angle;
            elementX = elementX <= 0 ? 0 : bounds.width - elementBounds.width;
          }
          
          if (elementY <= 0 || elementY + elementBounds.height >= bounds.height) {
            movementProperties.angle = -movementProperties.angle;
            elementY = elementY <= 0 ? 0 : bounds.height - elementBounds.height;
          }
          
          movementProperties.angle += (Math.random() - 0.5) * 0.1;
          
          element.style.left = elementX + 'px';
          element.style.top = elementY + 'px';
        }
        requestAnimationFrame(autonomousMove);
      }
      
      // Event listeners
      element.addEventListener('mousemove', move);
      element.addEventListener('mousedown', startInteraction);
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', stopInteraction);
      
      // Touch event listeners
      element.addEventListener('touchstart', e => startInteraction(e.touches[0]));
      document.addEventListener('touchmove', e => move(e.touches[0]));
      document.addEventListener('touchend', stopInteraction);
      
      // Start autonomous movement
      requestAnimationFrame(autonomousMove);
    });
  });