document.addEventListener('DOMContentLoaded', () => {
  const notebookSection = document.querySelector('.notebook-section');
  if (!notebookSection) return;

  const notebook = notebookSection.querySelector('.notebook');
  const pages = notebookSection.querySelectorAll('.page');

  function openNotebook() {
    pages.forEach((page, index) => {
      setTimeout(() => {
        page.classList.add('active');
        if (index === pages.length - 1) {
          setTimeout(() => {
            notebookSection.classList.remove('fixed');
          }, 600);
        }
      }, index * 300);
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        notebookSection.classList.add('fixed');
        openNotebook();
        observer.unobserve(notebookSection);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(notebookSection);
});
