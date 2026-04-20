/* ═══════════════════════════════════════════════════════
   ECONOMIC GROUP — script.js  (Animations + Interactions)

   1.  Mobile nav toggle
   2.  Nav scrolled state (shadow)
   3.  Active nav link highlight on scroll
   4.  Smooth eased scroll for anchor links
   5.  Counter animation (stats)
   6.  Scroll fade-in (.fade-in)
   7.  Word-reveal for section headings
   8.  Section-label underline draw
   9.  Rule shimmer on enter
   10. Timeline line draw on enter
   11. Stat pulse on counter complete
   12. Button ripple click effect
   13. Magnetic button hover (desktop)
   14. Hero video parallax
   15. Hero video pause/resume on visibility
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────────── */
  function easeOutExpo (t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
  function easeOutCubic (t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function lerp (a, b, t) {
    return a + (b - a) * t;
  }

  /* ─────────────────────────────────────────────────
     1. MOBILE NAV TOGGLE
  ───────────────────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var navMenu   = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });

  /* ─────────────────────────────────────────────────
     2. NAV SCROLLED STATE
  ───────────────────────────────────────────────── */
  var navbar = document.getElementById('navbar');

  function updateNavScrolled () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ─────────────────────────────────────────────────
     3. ACTIVE NAV LINK
  ───────────────────────────────────────────────── */
  var sectionIds  = ['hero', 'stats', 'about', 'products', 'story', 'contact'];
  var navAnchors  = document.querySelectorAll('.nav-link[href^="#"]');

  function getActiveSection () {
    var scrollY   = window.scrollY;
    var navHeight = navbar.offsetHeight;
    var active    = 'hero';

    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (scrollY >= el.offsetTop - navHeight - 80) active = id;
    });
    return active;
  }

  function updateActiveNav () {
    var current = getActiveSection();
    navAnchors.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ─────────────────────────────────────────────────
     4. SMOOTH EASED SCROLL FOR ANCHOR LINKS
  ───────────────────────────────────────────────── */
  function smoothScrollTo (targetY, duration) {
    var startY     = window.scrollY;
    var distance   = targetY - startY;
    var startTime  = null;

    function step (timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed  = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutExpo(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href   = anchor.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var navH    = navbar.offsetHeight;
      var targetY = target.getBoundingClientRect().top + window.scrollY - navH;
      smoothScrollTo(targetY, 900);
    });
  });

  /* ─────────────────────────────────────────────────
     5. COUNTER ANIMATION
  ───────────────────────────────────────────────── */
  function animateCounter (el) {
    var target    = parseInt(el.getAttribute('data-target'), 10);
    var suffix    = el.getAttribute('data-suffix') || '';
    var duration  = 2000;
    var startTime = null;

    function step (ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
        /* 11. pulse on complete */
        el.classList.add('pulse');
        setTimeout(function () { el.classList.remove('pulse'); }, 500);
      }
    }
    requestAnimationFrame(step);
  }

  var counterEls      = document.querySelectorAll('.stat-num[data-target]');
  var countersStarted = new Set();

  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countersStarted.has(entry.target)) {
        countersStarted.add(entry.target);
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counterEls.forEach(function (el) { counterObs.observe(el); });

  /* ─────────────────────────────────────────────────
     6. SCROLL FADE-IN
  ───────────────────────────────────────────────── */
  var fadeEls = document.querySelectorAll('.fade-in');

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)')
      );
      var idx   = siblings.indexOf(entry.target);
      var delay = Math.max(0, idx) * 100;
      setTimeout(function () {
        entry.target.classList.add('visible');
      }, delay);
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(function (el) { fadeObserver.observe(el); });

  /* ─────────────────────────────────────────────────
     7. WORD REVEAL FOR HEADINGS
     Wraps each word in an overflow-hidden span so it
     clips up from below like a proper reveal.
  ───────────────────────────────────────────────── */
  var revealSelectors = [
    '.tl-title', '.prod-title', '.about-title',
    '.banner-title', '.contact-title'
  ];

  function wrapWords (el) {
    /* Walk child nodes — preserve <em> / <br> tags */
    Array.from(el.childNodes).forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var words = node.textContent.split(/(\s+)/);
        var frag  = document.createDocumentFragment();
        words.forEach(function (part) {
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
          } else if (part.length) {
            var wrap  = document.createElement('span');
            wrap.className = 'word-wrap';
            var inner = document.createElement('span');
            inner.className = 'word';
            inner.textContent = part;
            wrap.appendChild(inner);
            frag.appendChild(wrap);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        /* For <em> children, wrap the whole element */
        var wrap  = document.createElement('span');
        wrap.className = 'word-wrap';
        node.parentNode.insertBefore(wrap, node);
        wrap.appendChild(node);
        var inner = document.createElement('span');
        inner.className = 'word';
        /* move em inside inner */
        inner.appendChild(wrap.querySelector('em, strong') || node.cloneNode(true));
        wrap.innerHTML = '';
        wrap.appendChild(inner);
      }
    });
  }

  var wordEls = document.querySelectorAll(revealSelectors.join(','));

  wordEls.forEach(function (el) {
    wrapWords(el);
  });

  var wordObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var wraps = entry.target.querySelectorAll('.word-wrap');
      wraps.forEach(function (wrap, i) {
        setTimeout(function () {
          wrap.classList.add('revealed');
        }, i * 55);
      });
      wordObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  wordEls.forEach(function (el) { wordObserver.observe(el); });

  /* ─────────────────────────────────────────────────
     8. SECTION-LABEL UNDERLINE DRAW
  ───────────────────────────────────────────────── */
  var labelObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        labelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.section-label').forEach(function (el) {
    labelObserver.observe(el);
  });

  /* ─────────────────────────────────────────────────
     9. RULE SHIMMER ON ENTER
  ───────────────────────────────────────────────── */
  var ruleObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('shimmer');
        ruleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 1 });

  document.querySelectorAll('.rule').forEach(function (el) {
    ruleObserver.observe(el);
  });

  /* ─────────────────────────────────────────────────
     10. TIMELINE LINE DRAW
  ───────────────────────────────────────────────── */
  var tlList = document.querySelector('.tl-list');
  if (tlList) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-drawn');
        }
      });
    }, { threshold: 0.1 }).observe(tlList);
  }

  /* ─────────────────────────────────────────────────
     12. BUTTON RIPPLE
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect    = btn.getBoundingClientRect();
      var size    = Math.max(rect.width, rect.height);
      var x       = e.clientX - rect.left - size / 2;
      var y       = e.clientY - rect.top  - size / 2;
      var ripple  = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = [
        'width:'  + size + 'px',
        'height:' + size + 'px',
        'left:'   + x    + 'px',
        'top:'    + y    + 'px'
      ].join(';');
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  /* ─────────────────────────────────────────────────
     13. MAGNETIC BUTTON HOVER (desktop only)
     Buttons gently follow the cursor on hover.
  ───────────────────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      var targetX = 0, targetY = 0;
      var currentX = 0, currentY = 0;
      var rafId = null;
      var isHovering = false;

      function animate () {
        currentX = lerp(currentX, targetX, 0.14);
        currentY = lerp(currentY, targetY, 0.14);
        btn.style.transform = 'translate(' + currentX + 'px,' + currentY + 'px)';
        if (isHovering || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
          rafId = requestAnimationFrame(animate);
        }
      }

      btn.addEventListener('mouseenter', function () {
        isHovering = true;
        if (!rafId) animate();
      });

      btn.addEventListener('mousemove', function (e) {
        var rect   = btn.getBoundingClientRect();
        var cx     = rect.left + rect.width  / 2;
        var cy     = rect.top  + rect.height / 2;
        targetX = (e.clientX - cx) * 0.28;
        targetY = (e.clientY - cy) * 0.28;
      });

      btn.addEventListener('mouseleave', function () {
        isHovering = false;
        targetX = 0;
        targetY = 0;
      });
    });
  }

  /* ─────────────────────────────────────────────────
     14. HERO VIDEO PARALLAX
  ───────────────────────────────────────────────── */
  var heroVideo = document.querySelector('.hero-video');

  function applyParallax () {
    if (!heroVideo || window.innerWidth < 768) return;
    heroVideo.style.transform = 'translateY(' + window.scrollY * 0.18 + 'px)';
  }

  /* ─────────────────────────────────────────────────
     15. HERO VIDEO — ensure autoplay starts
     The HTML autoplay attr handles most cases.
     This fallback fires after user interaction if
     the browser blocked silent autoplay.
  ───────────────────────────────────────────────── */
  if (heroVideo) {
    /* Try to play immediately */
    var playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        /* Autoplay blocked — wait for first user gesture then play */
        var startOnGesture = function () {
          heroVideo.play().catch(function () {});
          document.removeEventListener('click',      startOnGesture);
          document.removeEventListener('touchstart', startOnGesture);
          document.removeEventListener('keydown',    startOnGesture);
        };
        document.addEventListener('click',      startOnGesture, { once: true });
        document.addEventListener('touchstart', startOnGesture, { once: true });
        document.addEventListener('keydown',    startOnGesture, { once: true });
      });
    }
  }

  /* ─────────────────────────────────────────────────
     SCROLL LISTENER (throttled with rAF)
  ───────────────────────────────────────────────── */
  var ticking = false;

  /* ─────────────────────────────────────────────────
     16. SCROLL PROGRESS BAR
  ───────────────────────────────────────────────── */
  var progressBar = document.getElementById('scroll-progress');

  function updateProgress () {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var docH      = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
  }

  /* ─────────────────────────────────────────────────
     17. ABOUT IMAGE SCROLL PARALLAX
     Image drifts at 80% page speed — creates depth
  ───────────────────────────────────────────────── */
  var aboutImgInner  = document.querySelector('.about-img-inner');
  var aboutSection   = document.querySelector('.about');

  function updateAboutParallax () {
    if (!aboutImgInner || !aboutSection) return;
    if (window.innerWidth < 768) {
      aboutImgInner.style.transform = ''; /* reset on mobile */
      return;
    }
    var rect     = aboutSection.getBoundingClientRect();
    var progress = -rect.top / window.innerHeight;
    aboutImgInner.style.transform = 'translateY(' + (progress * 40) + 'px) scale(1.08)';
  }

  /* ─────────────────────────────────────────────────
     SCROLL LISTENER (throttled with rAF)
  ───────────────────────────────────────────────── */
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateNavScrolled();
        updateActiveNav();
        applyParallax();
        updateProgress();
        updateAboutParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  updateNavScrolled();
  updateActiveNav();
  updateProgress();

})();

