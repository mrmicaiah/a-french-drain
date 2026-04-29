// ====== A. French Drain — main.js ======

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// Nav scroll shadow
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 30 ? '0 1px 16px rgba(0,0,0,0.04)' : 'none';
  });
}

// Contact form submission via Cloudflare Worker
const CONTACT_ENDPOINT = 'https://afrenchdrain-contact.micaiah-tasks.workers.dev';

const formSubmit = document.getElementById('form-submit');
const formStatus = document.getElementById('form-status');

function showStatus(type, message) {
  if (!formStatus) return;
  formStatus.className = 'form-status ' + type;
  formStatus.textContent = message;
}

function clearStatus() {
  if (!formStatus) return;
  formStatus.className = 'form-status';
  formStatus.textContent = '';
}

if (formSubmit) {
  formSubmit.addEventListener('click', async () => {
    clearStatus();

    const name = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const location = document.getElementById('f-loc').value.trim();
    const message = document.getElementById('f-msg').value.trim();
    const website = document.getElementById('f-website').value.trim(); // honeypot

    if (!name) {
      showStatus('error', 'Please enter your name.');
      return;
    }
    if (!phone && !email) {
      showStatus('error', 'Please provide a phone number or email so we can reach you.');
      return;
    }

    formSubmit.disabled = true;
    const originalLabel = formSubmit.textContent;
    formSubmit.textContent = 'Sending…';

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, location, message, website }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        showStatus('success', "Thanks! We got it. We'll be in touch within 1 business day.");
        ['f-name', 'f-phone', 'f-email', 'f-loc', 'f-msg', 'f-website'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        formSubmit.textContent = 'Sent ✓';
      } else {
        showStatus('error', data.error || 'Something went wrong. Please call 256-808-2100.');
        formSubmit.disabled = false;
        formSubmit.textContent = originalLabel;
      }
    } catch (err) {
      showStatus('error', 'Network error. Please call 256-808-2100.');
      formSubmit.disabled = false;
      formSubmit.textContent = originalLabel;
    }
  });
}

// Lightbox for gallery
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
