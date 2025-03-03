document.addEventListener('DOMContentLoaded', function() {
  // Disable scrolling initially
  // (Let your other loading-screen script eventually remove 'no-scroll')
  document.body.classList.add('no-scroll');

  // ----------------------------------
  // Navigation transparency on scroll
  // ----------------------------------
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ----------------------------------
  // Mobile menu functionality
  // ----------------------------------
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }
});

// ----------------------------------
// Highlight active link in nav
// ----------------------------------
document.addEventListener("DOMContentLoaded", function() {
  // Get the current page filename from the URL
  let currentPage = window.location.pathname.split("/").pop();
  // If no filename is found (i.e., the homepage), assume index.html
  if (!currentPage) {
    currentPage = "index.html";
  }
  
  // Select all nav links (both desktop and mobile)
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu-links a");

  // Loop through each link and add the active class if its href matches the current page
  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
});
