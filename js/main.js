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

// Contact form — submits to shared UP infrastructure worker
const SUBSCRIBE_ENDPOINT = 'https://email-bot-server.micaiah-tasks.workers.dev/api/subscribe';
const COURIER_LIST = 'a-french-drain-leads';
const FORM_LOAD_TIME = Date.now();

const formSubmit = document.getElementById('form-submit');
const formStatus = document.getElementById('form-status');
const formView = document.getElementById('form-view');
const formSuccess = document.getElementById('form-success');

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

function showSuccess() {
  if (formView) formView.style.display = 'none';
  if (formSuccess) formSuccess.style.display = 'block';
}

if (formSubmit) {
  formSubmit.addEventListener('click', async () => {
    clearStatus();

    const name = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const location = document.getElementById('f-loc').value.trim();
    const message = document.getElementById('f-msg').value.trim();
    const honeypot = document.getElementById('f-website').value;

    // Honeypot check #1 — hidden field must be empty
    if (honeypot) {
      showSuccess();
      return;
    }

    // Honeypot check #2 — humans take longer than 3 seconds to fill a form
    const elapsed = Date.now() - FORM_LOAD_TIME;
    if (elapsed < 3000) {
      showSuccess();
      return;
    }

    // Validation
    if (!name) {
      showStatus('error', 'Please enter your name.');
      return;
    }
    if (!phone) {
      showStatus('error', 'Please enter your phone number.');
      return;
    }
    if (!email) {
      showStatus('error', 'Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('error', 'Please enter a valid email address.');
      return;
    }

    formSubmit.disabled = true;
    const originalLabel = formSubmit.textContent;
    formSubmit.textContent = 'Sending…';

    const payload = {
      email,
      name,
      list: COURIER_LIST,
      source: 'afrenchdrain.com',
      funnel: 'homepage-quote-form',
      metadata: {
        phone,
        location,
        message,
        time_to_fill_ms: elapsed,
      },
    };

    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showSuccess();
      } else {
        showStatus('error', data.error || 'Something went wrong. Please call 256-808-2100.');
        formSubmit.disabled = false;
        formSubmit.textContent = originalLabel;
      }
    } catch (err) {
      showStatus('error', 'Connection issue. Please call 256-808-2100.');
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
