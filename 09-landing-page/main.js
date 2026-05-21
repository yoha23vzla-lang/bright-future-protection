/* ================================================================
   BRIGHT FUTURE PROTECTION — Landing Page JavaScript
   ================================================================ */

'use strict';

// ── ELEMENTS ────────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navBurger = document.getElementById('navBurger');
const navLinks  = document.getElementById('navLinks');

// ── NAVIGATION SCROLL ───────────────────────────────────────────
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── MOBILE MENU ─────────────────────────────────────────────────
function setMenuOpen(open) {
  navLinks.classList.toggle('open', open);
  const [top, mid, bot] = navBurger.querySelectorAll('span');
  if (open) {
    top.style.transform = 'rotate(45deg) translate(4.5px, 5px)';
    mid.style.opacity   = '0';
    bot.style.transform = 'rotate(-45deg) translate(4.5px, -5px)';
  } else {
    top.style.transform = '';
    mid.style.opacity   = '';
    bot.style.transform = '';
  }
}

navBurger.addEventListener('click', () => {
  setMenuOpen(!navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => setMenuOpen(false));
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenuOpen(false);
});

// ── SMOOTH SCROLL ────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ── SCROLL REVEAL ────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // Stagger siblings in the same parent
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const idx = siblings.indexOf(entry.target);
    entry.target.style.transitionDelay = `${idx * 90}ms`;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION ────────────────────────────────────────────
function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  function tick(now) {
    const pct = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3);      // ease-out cubic
    el.textContent = Math.round(ease * target);
    if (pct < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const val = parseInt(el.dataset.count, 10);
    animateCount(el, val);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── SERVICE CARD → CTA ───────────────────────────────────────────
const ctaSection = document.getElementById('contacto');
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    if (!ctaSection) return;
    window.scrollTo({ top: ctaSection.offsetTop - navbar.offsetHeight - 16, behavior: 'smooth' });
  });
  // Keyboard accessibility
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// ── HERO PARALLAX (subtle) ──────────────────────────────────────
const heroBg = document.querySelector('.hero__bg');
if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }
  }, { passive: true });
}

// ── PREMIUM POPUP ────────────────────────────────────────────────
(function () {
  const STORAGE_KEY = 'bfp_popup_seen';
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  const overlay   = document.getElementById('ghlPopup');
  const closeBtn  = document.getElementById('popupClose');
  if (!overlay) return;

  let opened = false;

  function openPopup() {
    if (opened) return;
    opened = true;
    sessionStorage.setItem(STORAGE_KEY, '1');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn && closeBtn.focus();
    clearTimeout(timerID);
    window.removeEventListener('scroll', scrollHandler, { passive: true });
  }

  function closePopup() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Timer trigger — 3s for testing (change to 20000 for production)
  const timerID = setTimeout(openPopup, 3000);

  // 40% scroll trigger
  function scrollHandler() {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (pct >= 0.4) openPopup();
  }
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Close button
  closeBtn && closeBtn.addEventListener('click', closePopup);

  // Click outside modal
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closePopup();
  });
}());
