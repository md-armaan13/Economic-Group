/* ══════════════════════════════════════
   ECONOMIC GROUP — STANDALONE SCRIPT
   ══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SCROLL PROGRESS ── */
  const progress = document.getElementById('scroll-progress');
  function updateProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && h > 0) progress.style.width = (window.scrollY / h * 100) + '%';
  }

  /* ── NAVBAR SCROLL EFFECT ── */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (!navbar) return;
    // Don't change navbar state while mobile menu is open
    if (navbar.classList.contains('menu-open')) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }

  window.addEventListener('scroll', function () {
    updateProgress();
    updateNavbar();
  }, { passive: true });

  updateProgress();
  updateNavbar();

  /* ── HAMBURGER MENU ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      // Lock navbar dark while menu is open
      navbar.classList.toggle('menu-open', open);
      if (!open) updateNavbar(); // restore scroll state on close
    });

    // close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        navbar.classList.remove('menu-open');
        updateNavbar();
      });
    });
  }

  /* ── REVEAL ON SCROLL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* ── ANIMATED COUNTERS ── */
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    const counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        counterObs.unobserve(e.target);

        const el     = e.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const dur    = 1800;
        const start  = performance.now();

        function tick(now) {
          const p     = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);          // ease-out cubic
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObs.observe(el); });
  }

})();
