/* ═══════════════════════════════════════════════════════════════════
   MOHAMED KASSIM M — PORTFOLIO JAVASCRIPT
   Loading · Particles · Cursor · Tilt · Counters · Reveals
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. LOADING SCREEN
───────────────────────────────────────────────────────────────── */
(function initLoader() {
  const screen    = document.getElementById('loading-screen');
  const fill      = document.getElementById('loader-fill');
  const pctEl     = document.getElementById('loader-percent');
  const statusEl  = document.getElementById('loader-status');
  const mainSite  = document.getElementById('main-site');

  const statuses = [
    'Initializing environment...',
    'Compiling experience...',
    'Loading systems...',
    'Mounting components...',
    'Establishing connections...',
    'Rendering interface...',
    'Almost ready...',
    'Launching...'
  ];

  // Loading canvas particle burst
  const lc  = document.getElementById('loading-particles');
  const lctx = lc.getContext('2d');
  lc.width  = window.innerWidth;
  lc.height = window.innerHeight;

  const loaderDots = Array.from({ length: 60 }, () => ({
    x: Math.random() * lc.width,
    y: Math.random() * lc.height,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    a: Math.random() * 0.4 + 0.1
  }));

  function drawLoaderCanvas() {
    lctx.clearRect(0, 0, lc.width, lc.height);
    loaderDots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > lc.width)  d.vx *= -1;
      if (d.y < 0 || d.y > lc.height) d.vy *= -1;
      lctx.beginPath();
      lctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      lctx.fillStyle = `rgba(0,243,255,${d.a})`;
      lctx.fill();
    });
    loaderDots.forEach((d, i) => {
      loaderDots.slice(i + 1).forEach(d2 => {
        const dist = Math.hypot(d.x - d2.x, d.y - d2.y);
        if (dist < 120) {
          lctx.beginPath();
          lctx.moveTo(d.x, d.y);
          lctx.lineTo(d2.x, d2.y);
          lctx.strokeStyle = `rgba(0,243,255,${0.06 * (1 - dist / 120)})`;
          lctx.lineWidth = 0.5;
          lctx.stroke();
        }
      });
    });
    if (!loaderDone) requestAnimationFrame(drawLoaderCanvas);
  }
  let loaderDone = false;
  drawLoaderCanvas();

  let pct = 0;
  let statusIdx = 0;

  function updateStatus() {
    statusEl.textContent = statuses[statusIdx % statuses.length];
    statusIdx++;
  }

  const interval = setInterval(() => {
    const step = Math.random() * 3 + 1;
    pct = Math.min(100, pct + step);
    fill.style.width = pct + '%';
    pctEl.firstChild.textContent = Math.floor(pct);
    if (pct % 15 < step + 1) updateStatus();
    if (pct >= 100) {
      clearInterval(interval);
      loaderDone = true;
      statusEl.textContent = 'Ready.';
      setTimeout(revealSite, 600);
    }
  }, 40);

  function revealSite() {
    screen.classList.add('fade-out');
    mainSite.classList.remove('hidden');
    setTimeout(() => {
      mainSite.style.display = '';
      mainSite.classList.add('visible');
      screen.style.display = 'none';
      initAll();
    }, 900);
  }
})();

/* ─────────────────────────────────────────────────────────────────
   2. MAIN INIT — called after loader completes
───────────────────────────────────────────────────────────────── */
function initAll() {
  initCustomCursor();
  initParticleCanvas();
  initNavbar();
  initHeroTitle();
  initScrollReveal();
  initCounters();
  initTilt();
  initMagneticElements();
  initNavBurger();
}

/* ─────────────────────────────────────────────────────────────────
   3. CUSTOM CURSOR
───────────────────────────────────────────────────────────────── */
function initCustomCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mx = 0, my = 0;   // target
  let rx = 0, ry = 0;   // ring current

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // Ring lags behind
  function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Hover detection
  const hoverTargets = 'a, button, .magnetic, .tilt-card, .skill-chip, .stat-card, .achievement-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
  });

  // Hide on mobile
  document.addEventListener('touchstart', () => {
    dot.style.display  = 'none';
    ring.style.display = 'none';
  }, { once: true });
}

/* ─────────────────────────────────────────────────────────────────
   4. PARTICLE NETWORK CANVAS
───────────────────────────────────────────────────────────────── */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const mouse  = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  const COUNT      = 80;
  const MAX_DIST   = 140;
  const MOUSE_PUSH = 120;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.8 + 0.6;
      this.a  = Math.random() * 0.5 + 0.2;
    }
    update() {
      // Mouse interaction
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.hypot(dx, dy);
      if (d < MOUSE_PUSH) {
        const force = (MOUSE_PUSH - d) / MOUSE_PUSH * 0.8;
        this.vx += (dx / d) * force * 0.6;
        this.vy += (dy / d) * force * 0.6;
      }
      // Damping
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x  += this.vx;
      this.y  += this.vy;
      // Wrap
      if (this.x < -20)  this.x = W + 20;
      if (this.x > W+20) this.x = -20;
      if (this.y < -20)  this.y = H + 20;
      if (this.y > H+20) this.y = -20;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,243,255,${this.a})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(0,243,255,0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const particles = Array.from({ length: COUNT }, () => new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,243,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      // Line to mouse
      const dm = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
      if (dm < MOUSE_PUSH * 1.5) {
        const alphaM = (1 - dm / (MOUSE_PUSH * 1.5)) * 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,243,255,${alphaM})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
}

/* ─────────────────────────────────────────────────────────────────
   5. NAVBAR SCROLL EFFECT
───────────────────────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ─────────────────────────────────────────────────────────────────
   6. HERO KINETIC TITLE (letter-by-letter)
───────────────────────────────────────────────────────────────── */
function initHeroTitle() {
  const title = document.getElementById('hero-title');
  const words = [
    { text: 'FULL-STACK', teal: false },
    { text: 'DEVELOPER', teal: false },
    { text: '&', teal: false },
    { text: 'AI', teal: true },
    { text: 'BUILDER.', teal: true },
  ];

  let charDelay = 0.3; // starts after badge is revealed

  words.forEach((wordObj, wi) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word' + (wordObj.teal ? ' teal-word' : '');

    // Handle & as entity
    const chars = wordObj.text === '&' ? ['&'] : wordObj.text.split('');

    chars.forEach(ch => {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--char-delay', charDelay + 's');
      span.textContent = ch;
      wordSpan.appendChild(span);
      charDelay += 0.045;
    });

    title.appendChild(wordSpan);

    // Space between words (not last)
    if (wi < words.length - 1) {
      const space = document.createElement('span');
      space.className = 'word-space';
      title.appendChild(space);
    }
  });
}

/* ─────────────────────────────────────────────────────────────────
   7. SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));

  // Trigger hero elements immediately (they're in viewport)
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal-up, #stats .reveal-up').forEach(el => {
      observer.unobserve(el);
      el.classList.add('revealed');
    });
  }, 100);
}

/* ─────────────────────────────────────────────────────────────────
   8. ANIMATED COUNTERS
───────────────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el       = entry.target;
      const target   = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals) || 0;
      const start    = decimals === 0 ? 0 : 0;
      const duration = 2000;
      const startTime = performance.now();

      function tick(now) {
        const elapsed  = Math.min(now - startTime, duration);
        const progress = easeOutExpo(elapsed / duration);
        const value    = start + (target - start) * progress;
        el.textContent = value.toFixed(decimals);
        if (elapsed < duration) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ─────────────────────────────────────────────────────────────────
   9. 3D TILT ON PROJECT CARDS
───────────────────────────────────────────────────────────────── */
function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    const MAX_TILT = 12;

    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * MAX_TILT;
      const rotY   =  dx * MAX_TILT;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;

      // Glow follows cursor
      const glowEl = card.querySelector('.project-glow');
      if (glowEl) {
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        glowEl.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(0,243,255,0.18), transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform   = '';
      card.style.transition  = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      const glowEl = card.querySelector('.project-glow');
      if (glowEl) glowEl.style.background = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   10. MAGNETIC ELEMENTS
───────────────────────────────────────────────────────────────── */
function initMagneticElements() {
  const magnetics = document.querySelectorAll('.magnetic');

  magnetics.forEach(el => {
    const STRENGTH = 0.3;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * STRENGTH;
      const dy   = (e.clientY - cy) * STRENGTH;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = 'transform 0.1s ease';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   11. MOBILE NAV BURGER
───────────────────────────────────────────────────────────────── */
function initNavBurger() {
  const burger = document.getElementById('nav-burger');
  const mobileNav = document.getElementById('nav-mobile');
  if (!burger) return;

  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   12. SMOOTH SCROLL for anchor links
───────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
