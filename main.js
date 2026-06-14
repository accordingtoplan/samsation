/* main.js — SamSation */

/* ── Nav: always pill, expands on top/scroll-stop/scroll-up ─── */
(function () {
  const pill = document.getElementById('navPill');
  if (!pill) return;

  let lastY       = 0;
  let scrollDir   = 0; // 1 = down, -1 = up
  let ticking     = false;
  let stopTimer   = null;
  let isExpanded  = true;

  function expand() {
    if (isExpanded) return;
    isExpanded = true;
    pill.classList.add('is-expanded');
  }

  function collapse() {
    if (!isExpanded) return;
    isExpanded = false;
    pill.classList.remove('is-expanded');
  }

  // Start expanded
  expand();

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        const y = window.scrollY;
        scrollDir = y > lastY ? 1 : -1;
        const touch = !window.matchMedia('(pointer: fine)').matches;

        // Collapse when scrolling down past threshold
        if (scrollDir === 1 && y > 80) {
          collapse();
          pill.dataset.userToggled = '';
        }

        // Expand when scrolling up (desktop only — avoids fighting tap state on mobile)
        if (scrollDir === -1 && !touch) {
          expand();
        }

        // Expand when at top
        if (y <= 60) {
          expand();
        }

        // Expand when scroll stops — desktop only
        clearTimeout(stopTimer);
        if (!touch) {
          stopTimer = setTimeout(function () { expand(); }, 600);
        }

        lastY    = y;
        ticking  = false;
      });
      ticking = true;
    }
  }, { passive: true });
}());

/* ── Nav: toggle expanded state on tap (works on mobile) ─────── */
(function () {
  const toggle = document.getElementById('navToggle');
  const pill   = document.getElementById('navPill');
  if (!pill) return;

  function setOpen(open) {
    pill.classList.toggle('is-expanded', open);
    if (toggle) {
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    // Tell the scroll handler the user pinned this state
    pill.dataset.userToggled = open ? 'open' : 'closed';
  }

  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!pill.classList.contains('is-expanded'));
    });
  }

  // Tapping anywhere on the collapsed pill expands it
  pill.addEventListener('click', function (e) {
    if (e.target.closest('a')) return; // let links work
    if (!pill.classList.contains('is-expanded')) {
      setOpen(true);
    }
  });

  // Close when tapping a nav link (mobile) or pressing Escape
  pill.querySelectorAll('.nav-pill__links a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
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
