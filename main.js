/* main.js — SamSation */

/* ── Nav: pill expand/collapse (desktop) + scroll-hide (mobile) ─ */
(function () {
  const pill = document.getElementById('navPill');
  if (!pill) return;

  const isMobile = () => !window.matchMedia('(pointer: fine)').matches
                      || window.matchMedia('(max-width: 960px)').matches;

  let lastY      = 0;
  let ticking    = false;
  let stopTimer  = null;
  let isExpanded = false;

  function expand()   { if (!isExpanded) { isExpanded = true;  pill.classList.add('is-expanded'); } }
  function collapse() { if (isExpanded)  { isExpanded = false; pill.classList.remove('is-expanded'); } }

  // Desktop loads expanded; mobile stays a compact pill (CSS overrides the width)
  if (window.matchMedia('(pointer: fine)').matches
      && !window.matchMedia('(max-width: 960px)').matches) {
    expand();
  } else {
    isExpanded = true; // mobile: treat as "expanded" baseline so scroll logic is consistent
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    window.requestAnimationFrame(function () {
      const y   = window.scrollY;
      const dir = y > lastY ? 1 : -1;

      if (isMobile()) {
        // Mobile: keep the compact pill, just hide it on scroll-down
        if (dir === 1 && y > 80) pill.classList.add('is-hidden');
        if (dir === -1 || y <= 60) pill.classList.remove('is-hidden');
      } else {
        // Desktop: expand/collapse pill
        if (dir === 1 && y > 80) collapse();
        if (dir === -1) expand();
        if (y <= 60) expand();
        clearTimeout(stopTimer);
        stopTimer = setTimeout(expand, 600);
      }

      lastY   = y;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}());

/* ── Nav menu: overlay (mobile) / expand (desktop) ───────────── */
(function () {
  const toggle  = document.getElementById('navToggle');
  const pill    = document.getElementById('navPill');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !pill) return;

  const isMobile = () => !window.matchMedia('(pointer: fine)').matches
                      || window.matchMedia('(max-width: 960px)').matches;

  function openOverlay() {
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }
  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
  function setExpanded(open) {
    pill.classList.toggle('is-expanded', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function handleToggle(e) {
    e.stopPropagation();
    if (isMobile()) {
      overlay && overlay.classList.contains('is-open') ? closeOverlay() : openOverlay();
    } else {
      setExpanded(!pill.classList.contains('is-expanded'));
    }
  }

  toggle.addEventListener('click', handleToggle);

  // Tapping the collapsed pill body (desktop) expands it
  pill.addEventListener('click', function (e) {
    if (e.target.closest('a') || e.target.closest('.nav-pill__hamburger')) return;
    if (isMobile()) {
      openOverlay();
    } else if (!pill.classList.contains('is-expanded')) {
      setExpanded(true);
    }
  });

  // Overlay links close the menu
  if (overlay) {
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!a.target) closeOverlay(); // internal links close; external (_blank) leave it
      });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeOverlay();
    if (!isMobile()) setExpanded(false);
  });
}());

/* ── Page motion ─────────────────────────────────────────────── */
(function () {

  /* Fade-up sections */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    if (!('IntersectionObserver' in window)) {
      fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
      fadeEls.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.1) {
          el.classList.add('is-visible');
        } else {
          obs.observe(el);
        }
      });
    }
    // Safety net: never leave a section invisible. Reveal anything still
    // hidden a few seconds after load (covers no-scroll sessions / odd viewports).
    setTimeout(function () {
      document.querySelectorAll('.fade-in:not(.is-visible)').forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.5) el.classList.add('is-visible');
      });
    }, 2500);
  }

  const reduced = !window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* Parallax on hero images — desktop only */
  const heroImgs = document.querySelectorAll('.hero__left img, .hero__right img');
  if (heroImgs.length && !reduced && finePointer) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      heroImgs.forEach(function (img, i) {
        img.style.transform = 'translateY(' + (y * (i % 2 === 0 ? 0.08 : -0.08)) + 'px)';
      });
    }, { passive: true });
  }

  /* Magnetic pull — desktop pointer only */
  if (finePointer && !reduced) {
    document.querySelectorAll('.pill-cta, .s-service').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.06;
        const y = (e.clientY - r.top  - r.height / 2) * 0.06;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* Image reveal — simple fade with section (no clip-path) */

  /* Testimonial quote entrance */
  const quotes = document.querySelectorAll('.testimonial__quote');
  if ('IntersectionObserver' in window) {
    const qObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.23,1,0.32,1)';
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0) scale(1)';
          qObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    quotes.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(24px) scale(0.98)';
      qObs.observe(el);
    });
  }

  /* Press feedback on pill CTAs */
  document.querySelectorAll('.pill-cta').forEach(function (btn) {
    btn.addEventListener('mousedown', function () {
      btn.style.transition = 'transform 0.1s ease';
      btn.style.transform  = 'scale(0.95)';
    });
    btn.addEventListener('mouseup', function () {
      btn.style.transition = 'transform 0.3s cubic-bezier(0.23,1,0.32,1)';
      btn.style.transform  = 'scale(1)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });

  /* Nav pill hover + click bounce */
  const navPill = document.getElementById('navPill');
  if (navPill) {
    navPill.addEventListener('mouseenter', function () {
      if (!navPill.classList.contains('is-expanded')) {
        navPill.style.transition = 'transform 0.25s cubic-bezier(0.23,1,0.32,1)';
        navPill.style.transform  = 'translateX(-50%) scale(1.04)';
      }
    });
    navPill.addEventListener('mouseleave', function () {
      navPill.style.transform = 'translateX(-50%) scale(1)';
    });
    navPill.addEventListener('mousedown', function () {
      navPill.style.transform = 'translateX(-50%) scale(0.97)';
    });
    navPill.addEventListener('mouseup', function () {
      navPill.style.transform = 'translateX(-50%) scale(1.04)';
      setTimeout(function () { navPill.style.transform = 'translateX(-50%) scale(1)'; }, 200);
    });
  }

}());

/* Booking reveal (coaching page): scheduler loads only on request */
(function () {
  var btn = document.getElementById('bookingReveal');
  var frame = document.getElementById('bookingFrame');
  if (!btn || !frame) return;
  btn.addEventListener('click', function () {
    var iframe = frame.querySelector('iframe');
    if (iframe && !iframe.src) iframe.src = iframe.getAttribute('data-src');
    frame.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.style.display = 'none';
    frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* Fit footer wordmark to exact full container width */
(function () {
  var wm = document.querySelector('.footer__wordmark');
  if (!wm) return;
  function fit() {
    wm.style.transform = 'none';
    var wrap = wm.parentElement;
    var scale = wrap.clientWidth / wm.scrollWidth;
    wm.style.transform = 'scale(' + scale + ')';
  }
  fit();
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();

/* Fit hero wordmark to exact hero width (mirrors footer treatment) */
(function () {
  var el = document.querySelector('.hero-full__wordmark span');
  if (!el) return;
  function fit() {
    el.style.transform = 'none';
    var wrap = el.parentElement;
    el.style.transform = 'scale(' + (wrap.clientWidth / el.scrollWidth) + ')';
  }
  fit();
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();

/* ── Testimonials Carousel ──────────────────────────────────── */
(function () {
  var section = document.querySelector('.s-testimonials-slide');
  if (!section) return;

  var slides  = Array.from(section.querySelectorAll('.ts-slide'));
  var dots    = Array.from(section.querySelectorAll('.ts-dot'));
  var prevBtn = section.querySelector('.ts-prev');
  var nextBtn = section.querySelector('.ts-next');
  var current = 0;
  var timer;
  var DURATION = 500; /* must match CSS transition ms */

  function goTo(idx) {
    if (idx === current) return;
    var old = current;
    current = (idx + slides.length) % slides.length;

    /* Exit old slide to the left */
    slides[old].classList.remove('is-active');
    slides[old].classList.add('is-exit');
    slides[old].setAttribute('aria-hidden', 'true');

    /* Bring new slide in from the right */
    slides[current].setAttribute('aria-hidden', 'false');
    /* Force reflow so transition fires from translateX(100%) */
    slides[current].getBoundingClientRect();
    slides[current].classList.add('is-active');

    /* Clean up exit class once animation is done */
    setTimeout(function () {
      slides[old].classList.remove('is-exit');
    }, DURATION);

    /* Dots */
    dots[old].classList.remove('ts-dot--active');
    dots[old].setAttribute('aria-selected', 'false');
    dots[current].classList.add('ts-dot--active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function advance() { goTo(current + 1); }
  function startTimer() { timer = setInterval(advance, 3000); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  /* Arrows — stop propagation so the <a> slide doesn't navigate */
  prevBtn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); goTo(current - 1); resetTimer(); });
  nextBtn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); goTo(current + 1); resetTimer(); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function (e) { e.stopPropagation(); goTo(i); resetTimer(); });
  });

  /* Pause on hover */
  section.addEventListener('mouseenter', function () { clearInterval(timer); });
  section.addEventListener('mouseleave', startTimer);

  startTimer();
})();

/* ── About contact form — composes an email to hello@samrabon.com ── */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var msg = form.message.value.trim();
    var body = msg + '\n\n' + name + '\n' + email;
    window.location.href = 'mailto:hello@samrabon.com'
      + '?subject=' + encodeURIComponent('Enquiry from ' + name)
      + '&body=' + encodeURIComponent(body);
  });
})();

/* ── Motion v2: deferred video loading + lazy-image blur-up ── */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Videos: load when near the viewport, then play (unless reduced motion) */
  var vids = Array.from(document.querySelectorAll('video[data-src], video source[data-src]')).map(function (el) {
    return el.tagName === 'SOURCE' ? el.closest('video') : el;
  });
  vids = vids.filter(function (v, i) { return vids.indexOf(v) === i; });
  function loadVideo(v) {
    if (v.dataset.src) { v.src = v.dataset.src; delete v.dataset.src; }
    v.querySelectorAll('source[data-src]').forEach(function (s) { s.src = s.dataset.src; s.removeAttribute('data-src'); });
    v.load();
    if (!reduced) { var p = v.play(); if (p) p.catch(function () {}); }
  }
  if (!('IntersectionObserver' in window)) {
    vids.forEach(loadVideo);
  } else {
    var vObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { loadVideo(e.target); vObs.unobserve(e.target); }
      });
    }, { rootMargin: '300px 0px' });
    vids.forEach(function (v) { vObs.observe(v); });
  }

  /* Lazy images: mark loaded for the blur-up fade */
  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
    if (img.complete && img.naturalWidth) { img.classList.add('is-loaded'); return; }
    img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
    img.addEventListener('error', function () { img.classList.add('is-loaded'); }, { once: true });
  });
})();

/* ── Ticker: clone items until the track covers any viewport width ──
   The CSS animation slides the track by -50%, so the track must be at
   least 2× the viewport wide or a gap opens on large screens. */
(function () {
  document.querySelectorAll('.s-ticker__track').forEach(function (track) {
    var originals = Array.prototype.slice.call(track.children);
    var guard = 0;
    while (track.scrollWidth < window.innerWidth * 2 && guard < 10) {
      originals.forEach(function (item) {
        track.appendChild(item.cloneNode(true));
      });
      guard++;
    }
  });
})();

/* ── Booking deep-link: #book auto-opens the scheduler ──
   Covers direct links (IG bio, Substack) and in-page "Book" nav clicks. */
(function () {
  function openBooking() {
    var btn = document.getElementById('bookingReveal');
    var frame = document.getElementById('bookingFrame');
    if (!btn || !frame || !frame.hidden) return;
    btn.click();
  }
  if (location.hash === '#book') openBooking();
  window.addEventListener('hashchange', function () {
    if (location.hash === '#book') openBooking();
  });
})();

/* Kasumi color-mode toggle — square in the nav, remembers per visitor */
(function () {
  function make() {
    var b = document.createElement('button');
    b.className = 'mode-toggle';
    b.setAttribute('aria-label', 'Switch color mode');
    b.innerHTML = '<span class="dot" aria-hidden="true"></span>';
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var d = document.documentElement;
      var t = d.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      d.setAttribute('data-theme', t);
      try { localStorage.setItem('samsation-theme', t); } catch (err) {}
    });
    return b;
  }
  var links = document.querySelector('.nav-pill__links');
  if (links) links.insertBefore(make(), links.querySelector('.nav-link--book'));
  var overlay = document.querySelector('.nav-overlay');
  if (overlay) overlay.insertBefore(make(), overlay.querySelector('.nav-overlay__foot'));
})();
