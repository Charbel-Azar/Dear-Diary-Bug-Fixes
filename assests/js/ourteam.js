document.addEventListener('DOMContentLoaded', function() {
  const teamCards = document.querySelectorAll('.team-card');

  // Preload images for each team card
  teamCards.forEach(card => {
    const imagePaths = card.dataset.images.split(',');
    imagePaths.forEach(path => {
      const img = new Image();
      img.src = path.trim();
    });
  });

  // Check if the device supports hover (desktop vs. mobile)
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  teamCards.forEach(card => {
    const imagePaths = card.dataset.images.split(',');
    const teamImage = card.querySelector('.team-image');
    let currentIndex = 0; // starting with the first image

    if (supportsHover) {
      // DESKTOP: change on hover
      card.addEventListener('mouseenter', () => {
        currentIndex = (currentIndex + 1) % imagePaths.length;
        teamImage.style.opacity = '0';
        setTimeout(() => {
          teamImage.src = imagePaths[currentIndex].trim();
          teamImage.style.opacity = '1';
        }, 300);
      });
    } else {
      // MOBILE: change image every 3 seconds
      setInterval(() => {
        currentIndex = (currentIndex + 1) % imagePaths.length;
        teamImage.style.opacity = '0';
        setTimeout(() => {
          teamImage.src = imagePaths[currentIndex].trim();
          teamImage.style.opacity = '1';
        }, 300);
      }, 3000);
    }
  });
});
