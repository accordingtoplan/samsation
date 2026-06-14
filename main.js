/* main.js — SamSation */

/* ── Nav: expanded on load → collapses to pill on scroll ───── */
(function () {
  const pill = document.getElementById('navPill');
  if (!pill) return;

  let isExpanded = true;
  let ticking = false;

  // Start expanded
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

/* ── Nav menu: open / close ───────────────────────────────── */
(function () {
  const toggle   = document.getElementById('navToggle');
  const close    = document.getElementById('navClose');
  const backdrop = document.getElementById('navBackdrop');
  const menu     = document.getElementById('navMenu');
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

  toggle.addEventListener('click', function () {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  if (close)    close.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}());

/* ── Fade-in on scroll ────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { observer.observe(el); });
}());
