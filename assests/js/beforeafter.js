document.querySelectorAll('.image-container').forEach(container => {
    const wrapper = container.querySelector('.comparison-wrapper');
    const slider = wrapper.querySelector('.slider');
    const beforeVideo = wrapper.querySelector('.before-video');
    const neonText = container.querySelector('.neon-textslide');
    let isResizing = false;

    // Mouse events - attach only to the slider element
    slider.addEventListener('mousedown', e => {
        e.preventDefault();
        initResize();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    // Touch events - attach only to the slider element
    slider.addEventListener('touchstart', e => {
        e.preventDefault();
        initResize();
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    });

    function initResize() {
        isResizing = true;
        wrapper.classList.add('active');
        wrapper.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6), 0 0 90px rgba(255, 255, 255, 0.4)';
    }

    function handleMouseMove(e) {
        resize(e.clientX);
    }

    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            resize(e.touches[0].clientX);
        }
    }

    function resize(clientX) {
        if (!isResizing) return;
        const rect = wrapper.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width * 100, 0), 100);
        slider.style.left = `${percent}%`;
        beforeVideo.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;

        // Show text when slider is near the start (15% or less)
        neonText.style.opacity = (percent <= 15) ? '1' : '0';
    }

    function handleMouseUp() {
        stopResize();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    function handleTouchEnd() {
        stopResize();
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }

    function stopResize() {
        isResizing = false;
        wrapper.classList.remove('active');
        wrapper.style.boxShadow = 'none';
    }
});
