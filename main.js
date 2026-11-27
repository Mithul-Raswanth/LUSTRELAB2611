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
