
/* ===== Sidebar + Menu ===== */
const hamburger = document.querySelector('.hamburger');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('sidebar-backdrop');
function toggleSidebar(force) {
  const willOpen = force !== undefined ? force : !sidebar.classList.contains('active');
  hamburger.classList.toggle('active', willOpen);
  sidebar.classList.toggle('active', willOpen);
  backdrop.classList.toggle('show', willOpen);
}
hamburger.addEventListener('click', () => toggleSidebar());
backdrop.addEventListener('click', () => toggleSidebar(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleSidebar(false);
});

/* Build number -> sublist (1..8 -> 1..6) */
const container = document.getElementById('menu-container');
for (let n = 1; n <= 8; n++) {
  const number = document.createElement('div');
  number.className = 'number';
  number.textContent = String(n);
  number.addEventListener('click', () => {
    // close others
    document.querySelectorAll('.sub-list').forEach(el => el.style.display = 'none');
    const list = document.getElementById('sub-' + n);
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  });
  container.appendChild(number);

  const sub = document.createElement('div');
  sub.className = 'sub-list';
  sub.id = 'sub-' + n;
  for (let i = 1; i <= 6; i++) {
    const a = document.createElement('a');
    a.href = `pages/${n}-${i}.html`;
    a.textContent = `${i}`;
    // Close sidebar when navigating
    a.addEventListener('click', () => toggleSidebar(false));
    sub.appendChild(a);
  }
  container.appendChild(sub);
}

/* ===== Slideshow ===== */
const slidesWrapper = document.querySelector('.slides');
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsWrapper = document.querySelector('.dots');

let index = 0;
function renderDots() {
  slides.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrapper.appendChild(d);
  });
}
function goTo(i) {
  index = i % slides.length;
  if (index < 0) index = slides.length - 1;
  slidesWrapper.style.transform = `translateX(-${index * 100}%)`;
  // dots
  dotsWrapper.querySelectorAll('.dot').forEach((dot, di) => {
    dot.classList.toggle('active', di === index);
  });
}
function next() { goTo(index + 1); }
renderDots();
setInterval(next, 3500); // auto advance

/* Lazy load images */
const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        io.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImgs.forEach(img => io.observe(img));
} else {
  // Fallback: just set src immediately
  lazyImgs.forEach(img => {
    const src = img.getAttribute('data-src');
    if (src) img.src = src;
  });
}

/* Back/Forward buttons */
document.getElementById('btn-back')?.addEventListener('click', () => history.back());
document.getElementById('btn-forward')?.addEventListener('click', () => history.forward());
