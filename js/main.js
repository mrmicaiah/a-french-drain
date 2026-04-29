// A. French Drain — main.js

document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 30 ? '0 1px 16px rgba(0,0,0,0.04)' : 'none';
  });
}

const formSubmit = document.getElementById('form-submit');
if (formSubmit) {
  formSubmit.addEventListener('click', () => {
    const name = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const loc = document.getElementById('f-loc').value.trim();
    const msg = document.getElementById('f-msg').value.trim();

    if (!name || (!phone && !email)) {
      alert('Please add your name and either a phone number or email so we can reach you.');
      return;
    }

    const body = `Name: ${name}%0D%0APhone: ${phone}%0D%0AEmail: ${email}%0D%0ALocation: ${loc}%0D%0A%0D%0A${msg}`;
    window.location.href = `mailto:dennygutter@gmail.com?subject=Free Quote Request — ${encodeURIComponent(name)}&body=${body}`;
  });
}

// Lightbox
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const hiRes = img.src.replace(/w_\d+/, 'w_1600');
    openLightbox(hiRes, img.alt);
  });
});

function openLightbox(src, alt) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(10,10,10,0.95);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 24px;
    cursor: zoom-out;
    opacity: 0; transition: opacity .25s ease;
  `;
  overlay.innerHTML = `<img src="${src}" alt="${alt}" style="max-width: 95vw; max-height: 92vh; object-fit: contain; box-shadow: 0 20px 80px rgba(0,0,0,0.5);">`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { overlay.style.opacity = '1'; });

  const close = () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 200);
  };

  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });
}
