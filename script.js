/* ═══════════════════════════════════════════════════════════════════
   MOHAMED KASSIM M — COCKPIT DASHBOARD ENGINE
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCockpitPhysics();
  initTime();
  initMagneticElements();
});

/* ── 1. IGNITION LOADER ── */
function initLoader() {
  const loader = document.getElementById('loader');
  const mainSite = document.getElementById('main-site');
  const progressCircle = document.getElementById('ign-progress');
  const loaderPct = document.getElementById('loader-pct');

  if (!loader) return;

  let pct = 0;
  const duration = 1500;
  const interval = 30;
  const step = 100 / (duration / interval);

  const counter = setInterval(() => {
    pct += step;
    if (pct >= 100) {
      pct = 100;
      clearInterval(counter);
    }
    if (loaderPct) loaderPct.innerText = Math.floor(pct) + '%';
  }, interval);

  // Simulate engine start (1.5s)
  setTimeout(() => {
    progressCircle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
    progressCircle.style.strokeDashoffset = '0';
  }, 50);

  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      mainSite.classList.remove('hidden');
      mainSite.classList.add('visible');
      initScrollReveal();
    }, 500);
  }, 1600);
}

/* ── 2. SCROLL REVEAL (Telemetry Reveal) ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // If it's the engine block, trigger cylinder firing
        if (entry.target.classList.contains('engine-block')) {
          fireCylinders();
        }
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ── 3. COCKPIT PHYSICS (Scroll mapping to UI) ── */
function initCockpitPhysics() {
  const tachoBar = document.getElementById('hero-tacho-bar');
  const tachoVal = document.getElementById('tacho-val');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Tachometer Mapping
    // Max scroll distance
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    // Map scroll Y to 0-1
    let scrollPct = window.scrollY / maxScroll;
    scrollPct = Math.max(0, Math.min(1, scrollPct));

    if (tachoBar && tachoVal) {
      // Stroke dashoffset: 502 (empty) to 0 (full)
      const maxOffset = 502;
      const currentOffset = maxOffset - (scrollPct * maxOffset);
      tachoBar.style.strokeDashoffset = currentOffset;

      // Update text value (0 to 10.0 RPM x1000)
      const rpm = (scrollPct * 10).toFixed(1);
      tachoVal.innerText = rpm;
    }
  });
}

/* ── 4. V8 ENGINE CYLINDERS ── */
function fireCylinders() {
  const cylinders = document.querySelectorAll('.cylinder');

  cylinders.forEach((cyl, index) => {
    const level = cyl.getAttribute('data-level');
    const pistonHead = cyl.querySelector('.piston-head');
    const glow = cyl.querySelector('.cyl-glow');

    // Stagger the firing sequence like a real V8 engine (1-8-4-3-6-5-7-2)
    // For simplicity, just staggering by index
    setTimeout(() => {
      if (pistonHead) pistonHead.style.width = `${level}%`;
      // We can also add a flash effect to cyl-glow if desired
    }, index * 150);
  });
}

/* ── 5. INFOTAINMENT CLOCK ── */
function initTime() {
  const timeEl = document.getElementById('console-time');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const mins = now.getMinutes().toString().padStart(2, '0');
    timeEl.innerText = `${hours}:${mins} ${ampm}`;
  }

  updateTime();
  setInterval(updateTime, 60000);
}

/* ── 6. MAGNETIC ELEMENTS ── */
function initMagneticElements() {
  const magnetics = document.querySelectorAll('.magnetic');

  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ── 7. SMOOTH SCROLL ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── 8. CUSTOM CROSSHAIR CURSOR ── */
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

/* ── 9. SPEED BLUR & PARALLAX ON SCROLL ── */
let lastScrollY = window.scrollY;
let scrollTimeout;
const carbonBg = document.getElementById('carbon-bg');

window.addEventListener('scroll', () => {
  // Speed Blur
  const currentScrollY = window.scrollY;
  const speed = Math.abs(currentScrollY - lastScrollY);
  const blurAmount = Math.min(speed * 0.05, 5); // Cap blur at 5px

  const mainSite = document.getElementById('main-site');
  if (mainSite) {
    mainSite.style.setProperty('--scroll-blur', `${blurAmount}px`);
  }

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (mainSite) mainSite.style.setProperty('--scroll-blur', `0px`);
  }, 100);

  // Parallax Background
  if (carbonBg) {
    carbonBg.style.transform = `translateY(${currentScrollY * 0.2}px)`;
  }

  // F1 Car Timeline Animation
  const trackPath = document.getElementById('race-track');
  const f1Car = document.getElementById('f1-car');
  const timelineSec = document.getElementById('timeline');

  if (trackPath && f1Car && timelineSec) {
    const rect = timelineSec.getBoundingClientRect();
    const secHeight = timelineSec.offsetHeight;
    const windowHeight = window.innerHeight;

    // Start animating when the section top is at 60% of the viewport height
    // This gives the user time to see the section title before the car takes off
    const startTrigger = windowHeight * 0.6;
    let progress = (startTrigger - rect.top) / secHeight;
    progress = Math.max(0, Math.min(1, progress));

    // Get point on SVG path
    const pathLength = trackPath.getTotalLength();
    const pt = trackPath.getPointAtLength(progress * pathLength);

    // Calculate angle for rotation (steer the car)
    const lookahead = Math.min(pathLength, progress * pathLength + 5);
    const ptNext = trackPath.getPointAtLength(lookahead);
    const dx = ptNext.x - pt.x;
    const dy = ptNext.y - pt.y;
    // Tweak the +90 depending on image's default orientation
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // The SVG viewBox is 800x800, container is 100% width
    const svgEl = trackPath.closest('svg');
    const svgRect = svgEl ? svgEl.getBoundingClientRect() : null;
    const scaleX = svgRect ? svgRect.width / 800 : 1;
    const scaleY = svgRect ? svgRect.height / 800 : 1;

    const screenX = pt.x * scaleX;
    const screenY = pt.y * scaleY;

    // Use translate -50% -50% inside the transform to flawlessly center the image regardless of its height/width
    // Reverted back to angle + 90 for cars that point UP by default
    f1Car.style.transform = `translate(calc(${screenX}px - 50%), calc(${screenY}px - 50%)) rotate(${angle + 90}deg)`;
  }

  lastScrollY = currentScrollY;
});

/* ── 10. SOFT SKILLS RADAR CHART ANIMATION ── */
function animateRadarChart() {
  const radarContainer = document.querySelector('.radar-container.revealed');
  if (!radarContainer || radarContainer.classList.contains('animated')) return;

  const poly = radarContainer.querySelector('#radar-poly');
  const counters = radarContainer.querySelectorAll('.counter');

  if (poly) {
    const targetPoints = poly.getAttribute('data-target');
    poly.setAttribute('points', targetPoints);
  }

  counters.forEach(counter => {
    const targetNum = parseInt(counter.getAttribute('data-target'));
    let current = 0;
    const step = Math.max(1, Math.floor(targetNum / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= targetNum) {
        current = targetNum;
        clearInterval(interval);
      }
      counter.innerText = current + '%';
    }, 30);
  });

  radarContainer.classList.add('animated');
}

// Hook into existing ScrollReveal observer
const originalScrollReveal = initScrollReveal;
initScrollReveal = function () {
  originalScrollReveal();

  const radarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateRadarChart();
      }
    });
  }, { threshold: 0.5 });

  const radarEl = document.querySelector('.radar-container');
  if (radarEl) radarObserver.observe(radarEl);
};

/* ── MOBILE MENU TOGGLE ── */
const navBurger = document.getElementById('nav-burger');
const navLinks = document.querySelector('.nav-links');

if (navBurger && navLinks) {
  navBurger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-active');
    });
  });
}

/* ── 3D HELMET ROTATION ── */
const aboutSection = document.getElementById('about');
const helmetWrapper = document.querySelector('.helmet-3d-wrapper');

if (aboutSection && helmetWrapper) {
  aboutSection.addEventListener('mousemove', (e) => {
    const rect = aboutSection.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    // Calculate rotation (-30deg to 30deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -30;
    const rotateY = ((x - centerX) / centerX) * 30;

    helmetWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  aboutSection.addEventListener('mouseleave', () => {
    helmetWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}
