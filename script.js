/* ================================================================
   HENRY PILI — EXECUTIVE VIRTUAL ASSISTANT PORTFOLIO
   Main JavaScript Module
   ================================================================ */

// Mark JS as enabled for CSS animation fail-safe
document.documentElement.classList.add('js-enabled');

function initAll() {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initContactForm();
  initBackToTop();
  initActiveNavHighlight();
  initPortfolioFilter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}


/* ================================================================
   NAVBAR — Scroll-aware color transition
   ================================================================ */

function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const logoText   = document.getElementById('logo-text');
  const navLinks   = document.querySelectorAll('.nav-link');
  const hamburgers = document.querySelectorAll('.ham');

  function update() {
    const scrolled = window.scrollY > 60;

    // Background & scrolled class
    navbar.classList.toggle('scrolled', scrolled);
    if (scrolled) {
      navbar.style.background = 'rgba(255,255,255,0.98)';
      navbar.style.backdropFilter = 'blur(16px)';
      navbar.style.webkitBackdropFilter = 'blur(16px)';
      navbar.style.boxShadow = '0 4px 24px -2px rgba(15,23,42,0.08)';
      navbar.style.borderBottom = '1px solid #E2E8F0';
    } else {
      navbar.style.background = '';
      navbar.style.backdropFilter = '';
      navbar.style.webkitBackdropFilter = '';
      navbar.style.boxShadow = '';
      navbar.style.borderBottom = '';
    }

    // Logo text color
    logoText.classList.toggle('text-white', !scrolled);
    logoText.classList.toggle('text-navy', scrolled);

    // Nav link colors
    navLinks.forEach(link => {
      link.classList.toggle('text-slate-300', !scrolled);
      link.classList.toggle('text-charcoal', scrolled);
    });

    // Hamburger line colors
    hamburgers.forEach(line => {
      line.classList.toggle('bg-white', !scrolled);
      line.classList.toggle('bg-charcoal', scrolled);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // Run once on load
}


/* ================================================================
   MOBILE MENU — Toggle drawer
   ================================================================ */

function initMobileMenu() {
  const toggleBtn  = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}


/* ================================================================
   SCROLL REVEAL — IntersectionObserver animations
   ================================================================ */

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    }
  );

  reveals.forEach(el => {
    // If element is already in the viewport upon load (e.g. direct anchor #about), reveal it immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
    observer.observe(el);
  });
}


/* ================================================================
   ANIMATED COUNTERS — Count up on scroll
   ================================================================ */

function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
}

function animateCounter(element) {
  const target   = parseInt(element.dataset.counter, 10);
  const suffix   = element.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();

  function step(currentTime) {
    const elapsed  = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
    const current  = Math.round(target * eased);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target + suffix;
      element.style.animation = 'counterPop 0.4s ease';
    }
  }

  requestAnimationFrame(step);
}


/* ================================================================
   SMOOTH SCROLL — Anchor link navigation
   ================================================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
      event.preventDefault();

      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetEl.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/* ================================================================
   CASE STUDY TABS — Switch between case studies
   ================================================================ */

function switchCS(tabNumber) {
  // Reset all tabs
  document.querySelectorAll('.cs-tab').forEach(tab => {
    tab.classList.remove('bg-amber', 'text-white');
    tab.classList.add('bg-slate-100', 'text-charcoal');
  });

  // Activate selected tab
  const activeTab = document.getElementById('cs-tab-' + tabNumber);
  activeTab.classList.add('bg-amber', 'text-white');
  activeTab.classList.remove('bg-slate-100', 'text-charcoal');

  // Hide all panels, show selected
  document.querySelectorAll('.cs-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  const activePanel = document.getElementById('cs-' + tabNumber);
  activePanel.classList.remove('hidden');

  // Re-trigger reveal animations
  activePanel.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), 40);
  });
}


/* ================================================================
   MODALS — Open, close, backdrop click, Escape key
   ================================================================ */

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeM(modalId) {
  document.getElementById(modalId).classList.remove('active');
  document.body.style.overflow = '';
}

function closeMBg(event, modalId) {
  if (event.target === event.currentTarget) {
    closeM(modalId);
  }
}

// Close modals on Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});


/* ================================================================
   CONTACT FORM — Validation & submission
   ================================================================ */

function initContactForm() {
  const form = document.getElementById('contact-form');

  const fields = [
    { input: 'c-name',    err: 'err-name',    test: (value) => value.trim() !== '' },
    { input: 'c-email',   err: 'err-email',   test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
    { input: 'c-subject', err: 'err-subject', test: (value) => value.trim() !== '' },
    { input: 'c-message', err: 'err-message', test: (value) => value.trim() !== '' },
  ];

  // Real-time validation — clear errors on input
  fields.forEach(({ input, err }) => {
    const inputEl = document.getElementById(input);
    inputEl.addEventListener('input', () => {
      document.getElementById(err).classList.add('hidden');
      inputEl.classList.remove('border-red-400');
    });
  });

  // Submit handler
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    // Validate each field
    fields.forEach(({ input, err, test }) => {
      const inputEl = document.getElementById(input);
      const errorEl = document.getElementById(err);

      if (!test(inputEl.value)) {
        errorEl.classList.remove('hidden');
        inputEl.classList.add('border-red-400');
        isValid = false;
      } else {
        errorEl.classList.add('hidden');
        inputEl.classList.remove('border-red-400');
      }
    });

    if (isValid) {
      const submitBtn  = document.getElementById('submit-btn');
      const successMsg = document.getElementById('form-ok');

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Simulate submission
      setTimeout(() => {
        submitBtn.classList.add('hidden');
        successMsg.classList.remove('hidden');
        form.reset();

        // Reset form after delay
        setTimeout(() => {
          submitBtn.classList.remove('hidden');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          successMsg.classList.add('hidden');
        }, 4000);
      }, 1200);
    }
  });
}


/* ================================================================
   BACK TO TOP BUTTON
   ================================================================ */

function initBackToTop() {
  const btn = document.getElementById('btt');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 500;

    btn.classList.toggle('opacity-0', !scrolled);
    btn.classList.toggle('translate-y-3', !scrolled);
    btn.classList.toggle('pointer-events-none', !scrolled);
    btn.classList.toggle('opacity-100', scrolled);
    btn.classList.toggle('translate-y-0', scrolled);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================================
   ACTIVE NAV HIGHLIGHT — Highlight current section link
   ================================================================ */

function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + sectionId;
            link.classList.toggle('active', isActive);
          });
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: '-72px 0px -50% 0px'
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ================================================================
   LIGHTBOX — Full-size portfolio image viewer
   ================================================================ */

function openLightbox(src) {
  const overlay = document.getElementById('lightbox-overlay');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});


/* ================================================================
   PORTFOLIO FILTER — Category Tabs
   ================================================================ */

function initPortfolioFilter() {
  const filterContainer = document.getElementById('portfolio-filters');
  if (!filterContainer) return;

  const buttons = filterContainer.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.portfolio-item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden-item');
          item.style.position = '';
          item.style.height = '';
          item.style.overflow = '';
          item.style.margin = '';
          item.style.padding = '';
          item.style.border = '';
        } else {
          item.classList.add('hidden-item');
        }
      });
    });
  });
}


/* ================================================================
   GLOBAL WINDOW BINDINGS — For inline HTML onclick attributes
   ================================================================ */

window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;
window.openModal     = openModal;
window.closeM        = closeM;
window.closeMBg      = closeMBg;
window.switchCS      = switchCS;
