/**
 * LUSTRE LAB — CLINICAL AESTHETICS & DERMATOLOGY
 * Lead: Dr. Sindhu Muthuraja (MBBS, MD DVL, TNMC 130654)
 * Interactions & Dynamic Behaviors
 */

(function () {
  'use strict';

  /* ============================================================
     1. LOADER DISMISSAL
     - Disappears immediately upon load event
     - Safe fallback timeout ensures page is NEVER stuck
     ============================================================ */
  const loader = document.getElementById('loader');
  const loaderReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LOADER_MIN_MS = loaderReduced ? 400 : 1600;   // smooth, brief logo fill
  const LOADER_MAX_MS = loaderReduced ? 900 : 2800;   // never trap the visitor
  const loaderStart = performance.now();
  let loaderDismissing = false;
  let pageReady = document.readyState === 'complete';

  function dismissLoader() {
    if (!loader || loaderDismissing) return;
    loaderDismissing = true;
    loader.classList.add('loaded');
    loader.setAttribute('aria-hidden', 'true');
    loader.setAttribute('inert', '');
    setTimeout(() => { loader.style.display = 'none'; }, 700);
  }

  // Dismiss only when BOTH page readiness and the minimum display time are satisfied
  function tryDismissLoader() {
    if (!pageReady) return;
    const remaining = LOADER_MIN_MS - (performance.now() - loaderStart);
    if (remaining <= 0) dismissLoader();
    else setTimeout(dismissLoader, remaining);
  }

  if (pageReady) tryDismissLoader();
  else window.addEventListener('load', () => { pageReady = true; tryDismissLoader(); }, { once: true });

  // Safety fallback regardless of external assets
  setTimeout(dismissLoader, LOADER_MAX_MS);


  /* ============================================================
     2. TRANSLUCENT SANDWICH HEADERBAR (Auto-hide on Scroll & Tuck-in)
     - Translucent floating capsule on mobile
     - Smoothly tucks away ("goes in") on scroll down
     - Tucks away immediately when a section is selected in the menu
     - Slides back down when scrolling up or near page top
     ============================================================ */
  const header = document.getElementById('header');
  let lastScrollY = window.scrollY;
  let isHeaderHidden = false;

  function handleHeaderScroll() {
    if (!header) return;
    const currentY = window.scrollY;

    // Sticky elevation
    if (currentY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Mobile tuck-away behavior
    if (window.innerWidth <= 960) {
      const sideDockEl = document.getElementById('mobile-side-dock');
      const isMobileMenuOpen = sideDockEl ? sideDockEl.classList.contains('expanded') : false;
      // If scrolling down past 70px and sandwich nav is closed, tuck headerbar away
      if (currentY > lastScrollY && currentY > 70 && !isMobileMenuOpen) {
        if (!isHeaderHidden) {
          header.classList.add('header-hidden');
          isHeaderHidden = true;
        }
      } else if (currentY < lastScrollY - 6 || currentY <= 30) {
        // Scrolling up or at top: slide back down
        if (isHeaderHidden) {
          header.classList.remove('header-hidden');
          isHeaderHidden = false;
        }
      }
    } else {
      header.classList.remove('header-hidden');
      isHeaderHidden = false;
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  window.addEventListener('resize', handleHeaderScroll, { passive: true });
  handleHeaderScroll();


  /* ============================================================
     3. APPLE-INSPIRED TRANSLUCENT SIDE DOCK NAVIGATION
     Compact floating dock on mobile/tablet. Expands into
     frosted glass menu on tap, smoothly tucks away on select.
     ============================================================ */
  const mobileSideDock = document.getElementById('mobile-side-dock');
  const dockCompactTrigger = document.getElementById('dock-compact-trigger');
  const dockCollapseBtn = document.getElementById('dock-collapse-btn');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileSideOverlay = document.getElementById('mobile-side-overlay');
  const dockNavItems = document.querySelectorAll('.dock-nav-item');
  const dockBeads = document.querySelectorAll('.dock-bead');
  const dockConsultTrigger = document.getElementById('dock-consult-trigger');
  const desktopNavLinks = document.querySelectorAll('.main-nav .nav-link');

  let isDockExpanded = false;

  function expandSideDock() {
    if (!mobileSideDock) return;
    isDockExpanded = true;
    mobileSideDock.classList.remove('compact');
    mobileSideDock.classList.add('expanded');
    if (mobileSideOverlay) mobileSideOverlay.classList.add('open');
    if (mobileToggle) {
      mobileToggle.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    if (dockCompactTrigger) {
      dockCompactTrigger.setAttribute('aria-expanded', 'true');
    }
  }

  function collapseSideDock() {
    if (!mobileSideDock) return;
    isDockExpanded = false;
    mobileSideDock.classList.remove('expanded');
    mobileSideDock.classList.add('compact');
    if (mobileSideOverlay) mobileSideOverlay.classList.remove('open');
    if (mobileToggle) {
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (dockCompactTrigger) {
      dockCompactTrigger.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleSideDock() {
    if (isDockExpanded) {
      collapseSideDock();
    } else {
      expandSideDock();
    }
  }

  if (dockCompactTrigger) {
    dockCompactTrigger.addEventListener('click', toggleSideDock);
    dockCompactTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSideDock();
      }
    });
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleSideDock);
  }

  if (dockCollapseBtn) {
    dockCollapseBtn.addEventListener('click', collapseSideDock);
  }

  if (mobileSideOverlay) {
    mobileSideOverlay.addEventListener('click', collapseSideDock);
  }

  // Smooth navigation and automatic collapse
  dockNavItems.forEach(item => {
    item.addEventListener('click', () => {
      collapseSideDock();
      if (window.innerWidth <= 960 && header) {
        setTimeout(() => {
          header.classList.add('header-hidden');
          isHeaderHidden = true;
        }, 140);
      }
    });
  });

  desktopNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 960 && header) {
        header.classList.add('header-hidden');
        isHeaderHidden = true;
      }
    });
  });

  if (dockConsultTrigger) {
    dockConsultTrigger.addEventListener('click', () => {
      collapseSideDock();
      openDrawer();
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDockExpanded) {
      collapseSideDock();
    }
  });

  // Dynamic active section spy for dock indicator beads & links
  const trackedNavSections = [
    { id: 'about', el: document.getElementById('about') },
    { id: 'treatments', el: document.getElementById('treatments') },
    { id: 'doctor', el: document.getElementById('doctor') },
    { id: 'credentials', el: document.getElementById('credentials') },
    { id: 'location', el: document.getElementById('location') }
  ].filter(item => item.el !== null);

  function updateActiveNavSection(activeId) {
    dockBeads.forEach(bead => {
      if (bead.getAttribute('data-target') === activeId) {
        bead.classList.add('active');
      } else {
        bead.classList.remove('active');
      }
    });

    dockNavItems.forEach(item => {
      if (item.getAttribute('data-section') === activeId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    desktopNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const navSpyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateActiveNavSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    trackedNavSections.forEach(item => navSpyObserver.observe(item.el));
  }


  /* ============================================================
     4. CLINICAL EXPERTISE CHAPTER TABS
     ============================================================ */
  const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(targetId, shouldFocus = false) {
    const activeBtn = tabBtns.find(b => b.getAttribute('data-tab') === targetId);
    if (!activeBtn) return;

    tabBtns.forEach(b => {
      const isCurrent = b === activeBtn;
      b.classList.toggle('active', isCurrent);
      b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      b.setAttribute('tabindex', isCurrent ? '0' : '-1');
    });

    tabPanels.forEach(panel => {
      if (panel.id === `tab-${targetId}`) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
      }
    });

    if (shouldFocus) {
      activeBtn.focus();
    }

    const dermalField = document.getElementById('dermal-living-field');
    if (dermalField) dermalField.dispatchEvent(new CustomEvent('lustre:pulse'));
  }

  tabBtns.forEach((btn, index) => {
    btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');

    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      activateTab(targetId);
    });

    // WAI-ARIA tablist arrow navigation
    btn.addEventListener('keydown', (e) => {
      let nextIndex = index;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (index + 1) % tabBtns.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (index - 1 + tabBtns.length) % tabBtns.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = tabBtns.length - 1;
      }

      if (nextIndex !== index) {
        const nextBtn = tabBtns[nextIndex];
        const nextId = nextBtn.getAttribute('data-tab');
        activateTab(nextId, true);
      }
    });
  });


  /* ============================================================
     5. CONSULTATION DRAWER & DYNAMIC WHATSAPP LINK
     ============================================================ */
  const consultDrawer = document.getElementById('consult-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close');
  const openDrawerBtns = [
    document.getElementById('open-drawer'),
    document.getElementById('hero-consult-btn'),
    document.getElementById('doctor-consult-btn'),
    document.getElementById('fab-consult')
  ].filter(Boolean);

  const waBtn = document.getElementById('wa-btn');

  function updateWhatsAppUrl() {
    if (!waBtn) return;
    const message = 'Hello Dr. Sindhu & Lustre Lab team, I would like to request a consultation appointment.';
    waBtn.href = `https://wa.me/918754496771?text=${encodeURIComponent(message)}`;
  }

  updateWhatsAppUrl();

  function openConsultDrawer() {
    if (!consultDrawer) return;
    consultDrawer.classList.add('open');
    consultDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateWhatsAppUrl();
  }

  function closeConsultDrawer() {
    if (!consultDrawer) return;
    consultDrawer.classList.remove('open');
    consultDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Explicit safe mobile nav close function
  function closeMobileNav() {
    if (typeof collapseSideDock === 'function') {
      collapseSideDock();
    }
  }

  openDrawerBtns.forEach(btn => {
    btn.addEventListener('click', openConsultDrawer);
  });

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeConsultDrawer);
  }

  if (consultDrawer) {
    consultDrawer.addEventListener('click', (e) => {
      // Close only if clicking the backdrop, not the drawer panel itself
      if (e.target === consultDrawer) {
        closeConsultDrawer();
      }
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeConsultDrawer();
      closeMobileNav();
    }
  });


  /* ============================================================
     6. PERSISTENT MOBILE FLOATING CTA
     ============================================================ */
  const mobileFab = document.querySelector('.mobile-fab');

  function handleFabScroll() {
    if (!mobileFab) return;
    // Show after scrolling past hero (~450px)
    if (window.scrollY > 450) {
      mobileFab.classList.add('visible');
    } else {
      mobileFab.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleFabScroll, { passive: true });
  handleFabScroll();


  /* ============================================================
     7. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Reveal all elements immediately
    revealElements.forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      }
    );

    revealElements.forEach(el => observer.observe(el));
  }


  /* ============================================================
     7B. DOCTOR SECTION — EDITORIAL UNFOLD ENTRANCE
     - Vertical expanding reveal for high-res portrait
     - Coordinated staggered entrance for name, lineage & credentials
     - Triggers strictly once upon viewport entry; accessible static fallback
     ============================================================ */
  const doctorSection = document.getElementById('doctor');
  if (doctorSection) {
    const triggerDoctorUnfold = () => {
      const spread = doctorSection.querySelector('.doctor-editorial-spread');
      const frame = doctorSection.querySelector('.doctor-unfold-frame');
      const centerStage = doctorSection.querySelector('.doctor-center-stage');
      if (spread) spread.classList.add('unfolded');
      if (frame) frame.classList.add('unfolded');
      if (centerStage) centerStage.classList.add('unfolded');
      doctorSection.classList.add('unfolded');
    };

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      triggerDoctorUnfold();
    } else {
      const doctorObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerDoctorUnfold();
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
      });
      doctorObserver.observe(doctorSection);
    }

    // 7C. Interactive Brand Statement Tactile Response
    const brandPill = doctorSection.querySelector('.brand-statement-pill');
    if (brandPill) {
      let touchTimeout;
      brandPill.addEventListener('touchstart', () => {
        brandPill.classList.add('is-touched');
        clearTimeout(touchTimeout);
      }, { passive: true });
      brandPill.addEventListener('touchend', () => {
        touchTimeout = setTimeout(() => {
          brandPill.classList.remove('is-touched');
        }, 1600);
      }, { passive: true });
      brandPill.addEventListener('touchcancel', () => {
        brandPill.classList.remove('is-touched');
      }, { passive: true });
    }
  }


  /* ============================================================
     8. PRIMARY BACKGROUND — DERMAL INTERFERENCE + THE LIVING FIELD
     - Section-aware modulation (density, opacity, contour alignment)
     - Travelling living wave distortions with tension relaxation
     - Desktop pointer tension disturbance (local field warp, not page shift)
     ============================================================ */
      const dermalField = document.getElementById('dermal-living-field');

  // Per-chapter character of the field: amplitude, line spacing, pulse gain, drift speed
  const STATE_PARAMS = {
    'state-hero':       { amp: 1.00, spread: 1.00, dist: 1.00, speed: 1.00 },
    'state-about':      { amp: 0.62, spread: 1.16, dist: 0.60, speed: 0.65 },
    'state-treatments': { amp: 0.85, spread: 0.92, dist: 0.85, speed: 0.85 },
    'state-doctor':     { amp: 0.70, spread: 1.06, dist: 0.70, speed: 0.75 },
    'state-location':   { amp: 0.75, spread: 1.00, dist: 0.85, speed: 0.80 },
    'state-footer':     { amp: 0.55, spread: 1.10, dist: 0.55, speed: 0.60 }
  };
  let fieldTarget = STATE_PARAMS['state-hero'];

  // A. SECTION-AWARE OBSERVER
  const trackedSections = [
    { el: document.querySelector('.hero'), state: 'state-hero' },
    { el: document.querySelector('.section-about'), state: 'state-about' },
    { el: document.querySelector('.section-treatments'), state: 'state-treatments' },
    { el: document.querySelector('.section-doctor'), state: 'state-doctor' },
    { el: document.querySelector('.section-location'), state: 'state-location' },
    { el: document.querySelector('footer'), state: 'state-footer' }
  ].filter(item => item.el !== null);

  if (dermalField && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const match = trackedSections.find(s => s.el === entry.target);
          if (match) {
            dermalField.className = 'dermal-living-field ' + match.state;
            fieldTarget = STATE_PARAMS[match.state] || fieldTarget;
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-15% 0px -25% 0px',
      threshold: 0.15
    });

    trackedSections.forEach(s => sectionObserver.observe(s.el));
  }

  // B. CREDENTIALS MATRIX SCROLL REVEAL (SVG OUTLINE DRAWING)
  const credsMatrix = document.getElementById('credentials') || document.querySelector('.credentials-matrix');
  if (credsMatrix && 'IntersectionObserver' in window) {
    const credsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    credsObserver.observe(credsMatrix);
  } else if (credsMatrix) {
    credsMatrix.classList.add('in-view');
  }

  // C. THE LIVING FIELD ENGINE
  // Two contour fields (A, B) are generated directly as SVG path data from a
  // continuous displacement function, so interference, travelling pulses and the
  // pointer all bend the real contours (no filter, no extra layers, no rebuilt DOM).
  function initLivingField() {
    const ridgesA = Array.from(dermalField.querySelectorAll('.field-ridges-group-a .contour-path'));
    const ridgesB = Array.from(dermalField.querySelectorAll('.field-ridges-group-b .contour-path'));
    if (!ridgesA.length || !ridgesB.length) return;

    const NS = 'http://www.w3.org/2000/svg';
    const W = 1600, H = 1000;
    const small = window.matchMedia('(max-width: 720px)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const PTS = small ? 32 : 48;
    const FRAME_MS = small ? 33 : 16;
    const X0 = -60, X1 = 1680, DX = (X1 - X0) / (PTS - 1);
    const xs = new Float32Array(PTS);
    for (let i = 0; i < PTS; i++) xs[i] = X0 + i * DX;
    const ys = new Float32Array(PTS);
    const NA = ridgesA.length, NB = ridgesB.length;
    const TAU = Math.PI * 2;
    const rand = (a, b) => a + Math.random() * (b - a);

    // Soft trailing echoes of two contours per field (created once)
    function makeEcho(list, idx) {
      const src = list[Math.min(idx, list.length - 1)];
      const el = document.createElementNS(NS, 'path');
      el.setAttribute('class', 'contour-echo');
      src.parentNode.appendChild(el);
      return { el, idx: Math.min(idx, list.length - 1) };
    }
    const echoesA = [makeEcho(ridgesA, 4), makeEcho(ridgesA, 11)];
    const echoesB = [makeEcho(ridgesB, 6), makeEcho(ridgesB, 13)];

    // Live parameters ease toward the active chapter's character
    const P = { amp: 1, spread: 1, dist: 1, speed: 1 };

    // Travelling disturbance
    let dist = null;
    let clock = 0;
    let nextAt = 4800;
    function spawnDisturbance(gain) {
      const ang = (Math.random() < 0.5 ? 0 : Math.PI) + rand(-0.7, 0.7);
      const dx = Math.cos(ang), dy = Math.sin(ang);
      const proj = [0, W * dx, H * dy, W * dx + H * dy];
      const sMin = Math.min.apply(null, proj), sMax = Math.max.apply(null, proj);
      const speed = rand(380, 560);
      dist = {
        t0: clock, dx, dy, ph: rand(0, TAU),
        s0: ang > Math.PI / 2 && ang < Math.PI * 1.5 ? sMin - 260 : sMin - 260,
        speed,
        width: rand(230, 330),
        amp: rand(8, 14) * (gain === undefined ? P.dist : gain),
        life: ((sMax - sMin) + 520) / speed * 1000
      };
    }
    function pulseAt(x, y, tms) {
      const d = dist;
      if (!d) return 0;
      const age = tms - d.t0;
      if (age < 0 || age > d.life) return 0;
      const u = (x * d.dx + y * d.dy - (d.s0 + d.speed * age / 1000)) / d.width;
      if (u > 4 || u < -4) return 0;
      const g = Math.exp(-u * u * 0.5);
      const env = Math.sin(Math.PI * age / d.life);
      // derivative-of-gaussian bends lines; the second term compresses/spreads spacing
      return d.amp * env * g * (-u * 0.7 + 0.15 * Math.sin(u * 2.2 + d.ph));
    }

    // Pointer tension (fine pointers only)
    let px = W / 2, py = H / 2, tx = px, ty = py, pt = 0, ptTarget = 0, ptTimer = 0;
    if (finePointer && !prefersReducedMotion) {
      window.addEventListener('mousemove', (e) => {
        tx = ((e.clientX / window.innerWidth) + 0.06) / 1.12 * W;
        ty = ((e.clientY / window.innerHeight) + 0.06) / 1.12 * H;
        ptTarget = 1;
        clearTimeout(ptTimer);
        ptTimer = setTimeout(() => { ptTarget = 0; }, 700);
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', () => { ptTarget = 0; });
    }

    // Scroll keeps the fixed field flowing as one continuous environment
    let scrollTarget = window.scrollY, sc = scrollTarget;
    window.addEventListener('scroll', () => { scrollTarget = window.scrollY; }, { passive: true });

    function fieldY(isB, i, n, x, t, scr) {
      let u = -0.1 + 1.2 * i / (n - 1);
      let y, k;
      if (!isB) {
        u += 0.018 * Math.sin(u * 7 + x * 0.0016 + t * 0.035 * P.speed);
        k = x * 0.0042;
        y = H * 0.5 + (u - 0.5) * H * P.spread
          + 11 * P.amp * Math.sin(k + u * 4.6 + t * 0.075 * P.speed + scr * 0.001)
          + 5 * P.amp * Math.sin(k * 1.8 - u * 6.1 - t * 0.10 * P.speed)
          - (x - 800) * 0.035;
      } else {
        u += 0.020 * Math.sin(u * 6 - x * 0.0013 - t * 0.03 * P.speed);
        k = x * 0.0029;
        y = H * 0.5 + (u - 0.5) * H * P.spread * 1.04
          + 12 * P.amp * Math.sin(k - u * 3.7 - t * 0.065 * P.speed - scr * 0.0008)
          + 5 * P.amp * Math.sin(k * 2.1 + u * 7.2 + t * 0.09 * P.speed)
          + (x - 800) * 0.05;
      }
      return y;
    }

    function buildPath(isB, i, n, t, scr, tms, usePointer) {
      for (let p = 0; p < PTS; p++) {
        const x = xs[p];
        let y = fieldY(isB, i, n, x, t, scr);
        y += pulseAt(x, y, tms);
        if (usePointer && pt > 0.01) {
          const ddx = (x - px) * 0.8, ddy = y - py;
          const g = Math.exp(-(ddx * ddx + ddy * ddy) / 57800); // radius ≈ 170 units
          y += ddy * 0.08 * pt * g;                              // lines spread around the pointer
        }
        ys[p] = y;
      }
      let d = 'M' + xs[0].toFixed(1) + ',' + ys[0].toFixed(1);
      for (let p = 1; p < PTS - 1; p++) {
        d += 'Q' + xs[p].toFixed(1) + ',' + ys[p].toFixed(1) + ' ' +
             ((xs[p] + xs[p + 1]) * 0.5).toFixed(1) + ',' + ((ys[p] + ys[p + 1]) * 0.5).toFixed(1);
      }
      return d + 'L' + xs[PTS - 1].toFixed(1) + ',' + ys[PTS - 1].toFixed(1);
    }

    function render() {
      const t = clock / 1000;
      for (let i = 0; i < NA; i++) ridgesA[i].setAttribute('d', buildPath(false, i, NA, t, sc, clock, true));
      for (let i = 0; i < NB; i++) ridgesB[i].setAttribute('d', buildPath(true, i, NB, t, sc, clock, true));

      // Echoes trail the pulse slightly in time; visible only while a disturbance is active
      let echoOpacity = 0;
      if (dist) {
        const age = clock - dist.t0;
        if (age >= 0 && age <= dist.life) echoOpacity = 0.035 * Math.sin(Math.PI * age / dist.life);
      }
      const lag = clock - 420;
      for (let e = 0; e < 2; e++) {
        const a = echoesA[e], b = echoesB[e];
        a.el.style.opacity = echoOpacity.toFixed(3);
        b.el.style.opacity = echoOpacity.toFixed(3);
        if (echoOpacity > 0.005) {
          a.el.setAttribute('d', buildPath(false, a.idx, NA, t - 0.45, sc, lag, false));
          b.el.setAttribute('d', buildPath(true, b.idx, NB, t - 0.45, sc, lag, false));
        }
      }
    }

    function applyCommon(dt) {
      const T = fieldTarget, r = Math.min(1, dt / 16) * 0.03;
      P.amp += (T.amp - P.amp) * r;
      P.spread += (T.spread - P.spread) * r;
      P.dist += (T.dist - P.dist) * r;
      P.speed += (T.speed - P.speed) * r;
      sc += (scrollTarget - sc) * 0.08;
      px += (tx - px) * 0.08; py += (ty - py) * 0.08;
      pt += (ptTarget - pt) * 0.07;
    }

    // Reduced motion: draw one calm static frame, no loop
    if (prefersReducedMotion) {
      clock = 3000;
      render();
      return;
    }

    dermalField.addEventListener('lustre:pulse', () => {
      if (!dist || clock - dist.t0 > dist.life) spawnDisturbance(P.dist * 0.7);
    });

    let last = 0;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (document.hidden) { last = 0; return; }
      if (!last) { last = ts; return; }
      const dt = ts - last;
      if (dt < FRAME_MS - 2) return;
      last = ts;
      clock += Math.min(dt, 100);
      applyCommon(dt);
      if (clock >= nextAt && (!dist || clock - dist.t0 > dist.life)) {
        spawnDisturbance();
        nextAt = clock + rand(9000, 14000); // a restrained travelling pulse every 9–14s
      }
      render();
    }
    render();
    requestAnimationFrame(frame);
  }

  if (dermalField) {
    try { initLivingField(); } catch (err) { /* optional effect: page stays usable with static contours */ }
  }


  /* ============================================================
     9. MAP RESILIENCE
     - If the embedded Google Maps iframe fails, display fallback
     ============================================================ */
  const mapIframe = document.querySelector('.map-iframe');
  const mapContainer = document.querySelector('.map-container');

  if (mapIframe && mapContainer) {
    mapIframe.addEventListener('error', () => {
      mapContainer.classList.add('map-failed');
    });
  }

  /* ============================================================
     10. DIMENSIONS OF CARE — DEEP LINKING & HASH NAVIGATION
     ============================================================ */
  function handleUrlHash() {
    const hash = window.location.hash;
    if (!hash) return;

    if (hash === '#tab-clinical' || hash === '#dimension-01') {
      activateTab('clinical');
    } else if (hash === '#tab-hair' || hash === '#dimension-02') {
      activateTab('hair');
    } else if (hash === '#tab-surgery' || hash === '#dimension-03' || hash === '#dimension-05') {
      activateTab('surgery');
    } else if (hash === '#tab-wellness' || hash === '#dimension-04') {
      activateTab('wellness');
    }
  }

  window.addEventListener('hashchange', handleUrlHash);
  if (window.location.hash) {
    setTimeout(handleUrlHash, 200);
  }


  /* ============================================================
     11. THE LIVING DERMAL SURFACE — GENERATIVE IDENTITY VISUAL
     - Flowing translucent cutaneous strata & organic contours
     - Champagne travelling light through contours
     - Pointer-responsive local deformation with damping echoes
     - High-performance, intersection-observed, reduced-motion compliant
     ============================================================ */
  function initLivingDermalSurface() {
    const frame = document.getElementById('living-dermal-frame');
    const canvas = document.getElementById('dermal-canvas');
    if (!frame || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = false;
    let animId = null;
    let time = 0;

    // Pointer state with smooth spring-damper tracking
    const pointer = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      vx: 0,
      vy: 0,
      active: false,
      echoStrength: 0,
      echoDecay: 0.94
    };

    // Travelling champagne light particles
    const photons = [
      { contourIdx: 2, t: 0.1, speed: 0.00035, radius: 2.5 },
      { contourIdx: 5, t: 0.45, speed: 0.00028, radius: 2.0 },
      { contourIdx: 8, t: 0.8, speed: 0.00042, radius: 2.8 },
      { contourIdx: 11, t: 0.25, speed: 0.00031, radius: 2.2 }
    ];

    function resize() {
      const rect = frame.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(10, width * dpr);
      canvas.height = Math.max(10, height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (prefersReducedMotion) {
        draw(0);
      }
    }

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(frame);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }
    resize();

    // Pointer tracking with local relative coordinates
    function updatePointerPos(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = clientX - rect.left;
      pointer.targetY = clientY - rect.top;
      pointer.active = true;
      pointer.echoStrength = Math.min(pointer.echoStrength + 0.15, 1.0);
    }

    frame.addEventListener('pointerenter', (e) => {
      updatePointerPos(e.clientX, e.clientY);
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
    }, { passive: true });

    frame.addEventListener('pointermove', (e) => {
      updatePointerPos(e.clientX, e.clientY);
    }, { passive: true });

    frame.addEventListener('pointerleave', () => {
      pointer.active = false;
      pointer.targetX = -1000;
      pointer.targetY = -1000;
    }, { passive: true });

    // Mathematical organic contour generator
    const NUM_CONTOURS = 14;
    const SAMPLES = 48; // Resolution along horizontal axis

    function getContourY(contourIdx, xNorm, t) {
      const baseY = height * (0.12 + (contourIdx / (NUM_CONTOURS - 1)) * 0.78);
      const waveFreq1 = 1.4 + contourIdx * 0.15;
      const waveFreq2 = 2.8 + contourIdx * 0.08;
      const speed1 = 0.0008 + contourIdx * 0.00008;
      const speed2 = 0.0012 - contourIdx * 0.00006;
      const amp1 = 18 + contourIdx * 2.2;
      const amp2 = 9 + contourIdx * 1.1;

      let y = baseY +
        Math.sin(xNorm * Math.PI * waveFreq1 + t * speed1) * amp1 +
        Math.cos(xNorm * Math.PI * waveFreq2 - t * speed2) * amp2;

      // Pointer local deformation (elastic dermal bending)
      if (pointer.x > -500 && pointer.y > -500) {
        const px = xNorm * width;
        const dx = px - pointer.x;
        const dy = y - pointer.y;
        const distSq = dx * dx + dy * dy;
        const radius = 135;
        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq);
          const gaussian = Math.exp(-(dist * dist) / (2 * 45 * 45));
          const push = gaussian * 26 * Math.sign(dy || 1);
          y += push;
        }

        // Motion echo ripple
        if (pointer.echoStrength > 0.02) {
          const echoDist = Math.abs(px - pointer.x);
          const echoWave = Math.sin(echoDist * 0.08 - t * 0.008) * Math.exp(-echoDist * 0.02);
          y += echoWave * 12 * pointer.echoStrength;
        }
      }

      return y;
    }

    function draw(t) {
      if (width <= 0 || height <= 0) return;

      ctx.clearRect(0, 0, width, height);

      // Spring-damper pointer update
      if (pointer.active) {
        pointer.vx = (pointer.targetX - pointer.x) * 0.14 + pointer.vx * 0.65;
        pointer.vy = (pointer.targetY - pointer.y) * 0.14 + pointer.vy * 0.65;
        pointer.x += pointer.vx;
        pointer.y += pointer.vy;
      } else {
        pointer.x += (pointer.targetX - pointer.x) * 0.08;
        pointer.y += (pointer.targetY - pointer.y) * 0.08;
      }
      pointer.echoStrength *= pointer.echoDecay;

      // 1. Draw 4 Layered Translucent Cutaneous Strata (Filled organic ribbons)
      const strataBands = [
        {
          startIdx: 0,
          endIdx: 3,
          fill: 'rgba(247, 230, 220, 0.42)' // Stratum Corneum silk
        },
        {
          startIdx: 3,
          endIdx: 7,
          fill: 'rgba(237, 224, 212, 0.35)' // Epidermal cellular bed
        },
        {
          startIdx: 7,
          endIdx: 10,
          fill: 'rgba(165, 126, 131, 0.14)' // Papillary dermis
        },
        {
          startIdx: 10,
          endIdx: 13,
          fill: 'rgba(94, 61, 70, 0.08)'    // Reticular deep connective matrix
        }
      ];

      strataBands.forEach(band => {
        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
          const xNorm = i / SAMPLES;
          const x = xNorm * width;
          const y = getContourY(band.startIdx, xNorm, t);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        for (let i = SAMPLES; i >= 0; i--) {
          const xNorm = i / SAMPLES;
          const x = xNorm * width;
          const y = getContourY(band.endIdx, xNorm, t);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = band.fill;
        ctx.fill();
      });

      // 2. Draw Topographical Contour Lines
      for (let c = 0; c < NUM_CONTOURS; c++) {
        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
          const xNorm = i / SAMPLES;
          const x = xNorm * width;
          const y = getContourY(c, xNorm, t);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const depthRatio = c / (NUM_CONTOURS - 1);
        const alpha = 0.22 + (1 - Math.abs(depthRatio - 0.5) * 1.5) * 0.28;

        if (c % 4 === 1) {
          ctx.strokeStyle = `rgba(178, 152, 70, ${alpha * 0.95})`;
          ctx.lineWidth = 1.2;
        } else if (c % 3 === 0) {
          ctx.strokeStyle = `rgba(94, 61, 70, ${alpha * 0.85})`;
          ctx.lineWidth = 0.9;
        } else {
          ctx.strokeStyle = `rgba(165, 126, 131, ${alpha * 0.75})`;
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();
      }

      // 3. Draw Travelling Champagne Photons with Light Trails
      photons.forEach(p => {
        p.t = (p.t + p.speed * 16) % 1.0;
        const xNorm = p.t;
        const x = xNorm * width;
        const y = getContourY(p.contourIdx, xNorm, t);

        const glow = ctx.createRadialGradient(x, y, 0, x, y, p.radius * 6);
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        glow.addColorStop(0.3, 'rgba(178, 152, 70, 0.65)');
        glow.addColorStop(1, 'rgba(178, 152, 70, 0)');

        ctx.beginPath();
        ctx.arc(x, y, p.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      // 4. Pointer Interaction Aura
      if (pointer.active && pointer.x > 0 && pointer.y > 0) {
        const pointerGlow = ctx.createRadialGradient(
          pointer.x, pointer.y, 0,
          pointer.x, pointer.y, 80
        );
        pointerGlow.addColorStop(0, 'rgba(178, 152, 70, 0.18)');
        pointerGlow.addColorStop(0.5, 'rgba(247, 230, 220, 0.08)');
        pointerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 80, 0, Math.PI * 2);
        ctx.fillStyle = pointerGlow;
        ctx.fill();
      }
    }

    function loop(ts) {
      if (!isVisible) return;
      time = ts;
      draw(time);
      animId = requestAnimationFrame(loop);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!prefersReducedMotion && !animId) {
              animId = requestAnimationFrame(loop);
            } else if (prefersReducedMotion) {
              draw(0);
            }
          } else {
            if (animId) {
              cancelAnimationFrame(animId);
              animId = null;
            }
          }
        });
      }, { rootMargin: '100px 0px' });

      observer.observe(frame);
    } else {
      isVisible = true;
      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(loop);
      } else {
        draw(0);
      }
    }
  }

  // Initialize The Living Dermal Surface visual
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLivingDermalSurface);
  } else {
    initLivingDermalSurface();
  }


  /* ============================================================
     LUXURY MOMENTUM SCROLLING ENGINE
     - Physics-based continuous inertia with exponential damping
     - Normalized trackpad & mouse-wheel gliding
     - Mobile touch-flick momentum extension
     - Anchor navigation with header-offset interpolation
     - Full accessibility and reduced-motion compliance
     ============================================================ */
  function initLuxurySmoothScroll() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReduced.matches) return;

    // Set scroll-behavior to auto during script control for microsecond RAF precision
    document.documentElement.style.scrollBehavior = 'auto';

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isRunning = false;
    let lastTime = performance.now();
    let currentDamping = 10.2; // Exponential decay factor
    let isWheelActive = false;
    let wheelTimer = null;

    // Trackpad vs Mouse Wheel identification
    let isTrackpad = false;
    let trackpadTimer = null;

    function getMaxScroll() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    // Keep target & current synchronized on external scroll events (e.g. scrollbar drag)
    function handleNativeScroll() {
      if (!isRunning) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    }
    window.addEventListener('scroll', handleNativeScroll, { passive: true });

    // Handle viewport resize
    window.addEventListener('resize', () => {
      const max = getMaxScroll();
      targetY = Math.max(0, Math.min(targetY, max));
      currentY = Math.max(0, Math.min(currentY, max));
    }, { passive: true });

    // Frame interpolation loop (60fps - 120fps ProMotion display aware)
    function raf(now) {
      if (!isRunning) return;

      // Delta time in seconds, clamped to protect against tab suspension spikes
      const dt = Math.min(0.064, (now - lastTime) / 1000);
      lastTime = now;

      const diff = targetY - currentY;
      const step = diff * (1 - Math.exp(-currentDamping * dt));
      currentY += step;

      // Threshold check for gentle settling
      if (Math.abs(targetY - currentY) <= 0.35 && !isWheelActive) {
        currentY = targetY;
        window.scrollTo({ top: currentY, left: 0, behavior: 'instant' });
        isRunning = false;
        return;
      }

      window.scrollTo({ top: currentY, left: 0, behavior: 'instant' });
      requestAnimationFrame(raf);
    }

    function startLoop(damping) {
      if (damping) currentDamping = damping;
      if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        requestAnimationFrame(raf);
      }
    }

    // ── WHEEL INPUT (Trackpad & Mouse Wheel) ──
    window.addEventListener('wheel', (e) => {
      // Allow modal drawer, inputs, and horizontal scrolls to behave natively
      if (e.target && e.target.closest('#consult-drawer, input, textarea, select')) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      isWheelActive = true;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        isWheelActive = false;
      }, 90);

      // Distinguish trackpad from discrete mouse wheel notches
      const delta = e.deltaY;
      const absDelta = Math.abs(delta);
      const isDiscreteMouse = (absDelta >= 40 && Number.isInteger(delta)) || e.deltaMode === 1;

      if (!isDiscreteMouse) {
        isTrackpad = true;
        clearTimeout(trackpadTimer);
        trackpadTimer = setTimeout(() => {
          isTrackpad = false;
        }, 200);
      }

      let scaledDelta = delta;
      if (e.deltaMode === 1) { // Line mode
        scaledDelta = delta * 26;
      } else if (e.deltaMode === 2) { // Page mode
        scaledDelta = delta * window.innerHeight * 0.85;
      } else if (isDiscreteMouse) {
        scaledDelta = delta * 1.08;
      } else {
        scaledDelta = delta * 1.0;
      }

      // Responsive damping: 13.8 for trackpad (direct feel), 9.6 for mouse wheel (luxury glide)
      const tunedDamping = isTrackpad ? 13.8 : 9.6;

      targetY = Math.max(0, Math.min(targetY + scaledDelta, getMaxScroll()));
      startLoop(tunedDamping);
    }, { passive: false });

    // ── TOUCH GESTURE MOMENTUM ──
    let touchStartY = 0;
    let lastTouchY = 0;
    let lastTouchTime = 0;
    let touchVelocity = 0;
    let isTouching = false;

    window.addEventListener('touchstart', (e) => {
      if (e.target && e.target.closest('#consult-drawer, input, textarea, select')) return;
      if (e.touches.length !== 1) return;

      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      lastTouchTime = performance.now();
      touchVelocity = 0;
      isTouching = true;

      if (isRunning) {
        targetY = window.scrollY;
        currentY = window.scrollY;
        isRunning = false;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isTouching || e.touches.length !== 1) return;
      const currentPos = e.touches[0].clientY;
      const now = performance.now();
      const dt = now - lastTouchTime;

      if (dt > 8) {
        const delta = lastTouchY - currentPos;
        const instantVel = delta / dt;
        touchVelocity = touchVelocity * 0.35 + instantVel * 0.65;
        lastTouchY = currentPos;
        lastTouchTime = now;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (!isTouching) return;
      isTouching = false;

      const now = performance.now();
      if (now - lastTouchTime < 90 && Math.abs(touchVelocity) > 0.25) {
        const momentumGlide = touchVelocity * 260;
        targetY = Math.max(0, Math.min(window.scrollY + momentumGlide, getMaxScroll()));
        currentY = window.scrollY;
        startLoop(10.5);
      }
    }, { passive: true });

    // ── KEYBOARD SMOOTH GLIDE ──
    window.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      let keyDelta = 0;
      const pageDist = window.innerHeight * 0.84;

      switch (e.key) {
        case 'ArrowDown': keyDelta = 96; break;
        case 'ArrowUp': keyDelta = -96; break;
        case 'PageDown': keyDelta = pageDist; break;
        case 'PageUp': keyDelta = -pageDist; break;
        case ' ':
          keyDelta = e.shiftKey ? -pageDist : pageDist;
          break;
        case 'Home':
          e.preventDefault();
          targetY = 0;
          startLoop(8.5);
          return;
        case 'End':
          e.preventDefault();
          targetY = getMaxScroll();
          startLoop(8.5);
          return;
        default:
          return;
      }

      if (keyDelta !== 0) {
        e.preventDefault();
        targetY = Math.max(0, Math.min(targetY + keyDelta, getMaxScroll()));
        startLoop(10.0);
      }
    });

    // ── ANCHOR SMOOTH NAVIGATION ──
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      // Tab switcher deep links are handled within tab logic
      if (href.startsWith('#tab-') || href.startsWith('#dimension-') || href.startsWith('#group-')) {
        setTimeout(() => {
          const targetEl = document.querySelector(href);
          if (targetEl) glideToEl(targetEl);
        }, 80);
        return;
      }

      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();
      glideToEl(targetEl);
      history.pushState(null, '', href);
    });

    function glideToEl(element) {
      const headerEl = document.getElementById('header');
      const headerH = headerEl ? headerEl.offsetHeight : 72;
      const clearance = 16;
      const targetPos = element.getBoundingClientRect().top + window.scrollY - headerH - clearance;

      targetY = Math.max(0, Math.min(targetPos, getMaxScroll()));
      startLoop(8.2); // Graceful editorial anchor descent
    }

    // Dynamically react to reduced-motion setting
    prefersReduced.addEventListener('change', (e) => {
      if (e.matches) {
        isRunning = false;
        document.documentElement.style.scrollBehavior = 'smooth';
      } else {
        document.documentElement.style.scrollBehavior = 'auto';
      }
    });
  }

  // Initialize Luxury Momentum Scrolling
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLuxurySmoothScroll);
  } else {
    initLuxurySmoothScroll();
  }

})();
