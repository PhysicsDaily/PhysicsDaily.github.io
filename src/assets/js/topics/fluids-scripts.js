// Topic helpers for fluids pages
document.addEventListener('DOMContentLoaded', () => {
  const progressSection = document.body.dataset.progressSection || 'fluids';

  const chapterCards = document.querySelectorAll('[data-chapter]');
  const chapterProgress = {};
  chapterCards.forEach(card => {
    const chapter = card.getAttribute('data-chapter');
    if (!chapter) return;
    const key = `${progressSection}-chapter-${chapter}-progress`;
    const value = parseInt(localStorage.getItem(key) || '0', 10);
    chapterProgress[chapter] = Number.isFinite(value) ? value : 0;
    const bar = card.querySelector('.progress-bar');
    if (bar) bar.style.width = `${chapterProgress[chapter]}%`;
  });

  const completedEl = document.getElementById('completed-chapters');
  if (completedEl) {
    const completed = Object.values(chapterProgress).filter(p => p === 100).length;
    completedEl.textContent = completed.toString();
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  let backToTop = document.querySelector('.back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.textContent = 'Top';
    document.body.appendChild(backToTop);
  }

  const toggleBackToTop = () => {
    if (window.scrollY > 300) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  };

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
