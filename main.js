/* main.js — SamSation */

/* ── Nav: expanded bar → pill on scroll ─────────────────────── */
(function () {
  const pill = document.getElementById('navPill');
  if (!pill) return;

  let isExpanded = true;
  let ticking = false;

  pill.classList.add('is-expanded');

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        const y = window.scrollY;
        if (y > 60 && isExpanded) {
          pill.classList.remove('is-expanded');
          isExpanded = false;
        } else if (y <= 60 && !isExpanded) {
          pill.classList.add('is-expanded');
          isExpanded = true;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}());

/* ── Nav menu: open / close ──────────────────────────────────── */
(function () {
  const toggle   = document.getElementById('navToggle');
  const close    = document.getElementById('navClose');
  const backdrop = document.getElementById('navBackdrop');
  const menu     = document.getElementById('navMenu');
  const pill     = document.getElementById('navPill');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Hamburger button
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  // Clicking the pill itself (when collapsed) opens menu
  if (pill) {
    pill.addEventListener('click', function (e) {
      // Only trigger if in pill mode and not clicking a link
      if (!pill.classList.contains('is-expanded') && !e.target.closest('a')) {
        menu.classList.contains('is-open') ? closeMenu() : openMenu();
      }
    });
  }

  if (close)    close.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}());

/* ── Page motion — movement-led animations ───────────────────── */
(function () {

  /* 1. Staggered fade-up for sections */
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
      }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
      fadeEls.forEach(function (el) { obs.observe(el); });
    }
  }

  /* 2. Parallax drift on hero images — subtle vertical shift */
  const heroImgs = document.querySelectorAll('.hero__left img, .hero__right img');
  if (heroImgs.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      heroImgs.forEach(function (img, i) {
        const dir = i % 2 === 0 ? 1 : -1;
        img.style.transform = 'translateY(' + (y * 0.08 * dir) + 'px)';
      });
    }, { passive: true });
  }

  /* 3. Magnetic pull on pill CTAs and service items */
  const magnetics = document.querySelectorAll('.pill-cta, .s-service');
  magnetics.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      el.style.transform = 'translate(' + (x * 0.06) + 'px, ' + (y * 0.06) + 'px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  });

  /* 4. Image reveal — clip-path wipe on scroll entry */
  const revealImgs = document.querySelectorAll(
    '.s-split__img, .s-retreat__inner, .hero__left, .hero__right'
  );
  if ('IntersectionObserver' in window &&
      window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {

    revealImgs.forEach(function (el) {
      el.style.clipPath = 'inset(0 100% 0 0)';
      el.style.transition = 'clip-path 0.9s cubic-bezier(0.77,0,0.175,1)';
    });

    const revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.clipPath = 'inset(0 0% 0 0)';
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealImgs.forEach(function (el) { revObs.observe(el); });
  }

  /* 5. Subtle scale breathe on testimonial quotes */
  const quotes = document.querySelectorAll('.testimonial__quote');
  if ('IntersectionObserver' in window) {
    const qObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.23,1,0.32,1)';
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
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

  /* 6. Press / click ripple on pill CTAs */
  document.querySelectorAll('.pill-cta').forEach(function (btn) {
    btn.addEventListener('mousedown', function () {
      btn.style.transform = (btn.style.transform || '') + ' scale(0.95)';
      btn.style.transition = 'transform 0.1s ease';
    });
    btn.addEventListener('mouseup', function () {
      btn.style.transition = 'transform 0.3s cubic-bezier(0.23,1,0.32,1)';
      btn.style.transform  = btn.style.transform.replace(' scale(0.95)', '');
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });

  /* 7. Nav pill click animation — quick scale bounce */
  const navPill = document.getElementById('navPill');
  if (navPill) {
    navPill.addEventListener('mouseenter', function () {
      if (!navPill.classList.contains('is-expanded')) {
        navPill.style.transform = 'translateX(-50%) scale(1.04)';
        navPill.style.transition = 'transform 0.25s cubic-bezier(0.23,1,0.32,1)';
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
      setTimeout(function () {
        navPill.style.transform = 'translateX(-50%) scale(1)';
      }, 200);
    });
  }

}());
