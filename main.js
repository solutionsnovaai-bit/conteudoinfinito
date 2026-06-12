/* ─────────────────────────────────────────────────────────────────────────────
   C.I.A — Conteúdo Infinito com IA  |  main.js
   GSAP 3.12.5 + ScrollTrigger — scroll nativo (sem Lenis)
───────────────────────────────────────────────────────────────────────────── */
const FRAME_COUNT   = 48;
const KIWIFY_URL    = 'https://pay.kiwify.com.br/lRRpH6F';
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile      = () => window.innerWidth < 900;



/* ─── NAV ────────────────────────────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ─── CURTAIN ────────────────────────────────────────────────────────────── */
function runCurtain(onComplete) {
  const curtainEl = document.getElementById('curtain');
  if (REDUCE_MOTION || !curtainEl) {
    if (curtainEl) curtainEl.style.display = 'none';
    onComplete(); return;
  }
  // Fade simples — sem stagger de letras, zero custo de JS
  gsap.set('.cl', { yPercent: 0, rotate: 0, opacity: 1 });
  gsap.set('.curtain__bar', { width: '100%' });
  gsap.fromTo(curtainEl,
    { opacity: 1 },
    {
      opacity: 0, duration: 0.6, ease: 'power2.inOut', delay: 0.4,
      onComplete: () => { curtainEl.style.display = 'none'; onComplete(); }
    }
  );
}

/* ─── PARTICLES ──────────────────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const cx = canvas.getContext('2d');
  // máx 30 desktop, 15 mobile — throttle a 30fps
  const PARTICLE_COUNT = window.innerWidth <= 860 ? 15 : 30;
  const COLS = ['234,240,250', '9,204,244', '235,190,80'];
  let W, H, parts = [], particlesAnimId, lastParticleTime = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function spawn() {
    const ci = Math.random() < .72 ? 0 : Math.random() < .72 ? 1 : 2;
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: .4 + Math.random() * 1.4,
      a: .1 + Math.random() * .45,
      vx: (Math.random() - .5) * .25,
      vy: -.08 - Math.random() * .35,
      c: COLS[ci]
    };
  }
  function drawParticles(timestamp) {
    particlesAnimId = requestAnimationFrame(drawParticles);
    if (!window.__particlesActive) return;
    if (timestamp - lastParticleTime < 33) return; // ~30fps cap
    lastParticleTime = timestamp;
    cx.clearRect(0, 0, W, H);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(${p.c},${p.a})`;
      cx.fill();
    });
  }

  resize();
  parts = Array.from({ length: PARTICLE_COUNT }, spawn);
  window.addEventListener('resize', resize, { passive: true });

  // Cancelar RAF completamente quando hero sair da viewport
  window.__particlesActive = true;
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    const pObs = new IntersectionObserver(entries => {
      window.__particlesActive = entries[0].isIntersecting;
      if (!entries[0].isIntersecting && particlesAnimId) {
        cancelAnimationFrame(particlesAnimId);
        particlesAnimId = null;
      } else if (entries[0].isIntersecting && !particlesAnimId) {
        drawParticles();
      }
    }, { threshold: 0 });
    pObs.observe(hero);
  }
  drawParticles();
}

/* ─── HERO INTRO ─────────────────────────────────────────────────────────── */
function heroIntro() {
  if (REDUCE_MOTION) return;
  const tl = gsap.timeline({ delay: .08 });
  tl.fromTo('.hero__bg-wrap', { scale: 1.12 }, { scale: 1, duration: 1.7, ease: 'expo.out' })
    .fromTo('.hero .kicker',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, .4)
    .fromTo('.h1-word', { yPercent: 115, rotate: 2, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, stagger: .13, duration: .8, ease: 'power3.out' }, .54)
    .fromTo('.hero__sub',  { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, 1.0)
    .fromTo(['.hero__cta', '.hero__trust', '.hero__scroll-hint'], { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: .1, duration: .6, ease: 'power3.out' }, 1.2);
}

/* ─── HERO MOUSE PARALLAX ────────────────────────────────────────────────── */
function heroMouseParallax() {
  if (isMobile() || REDUCE_MOTION) return;
  const hero = document.querySelector('.hero');
  const bg   = document.getElementById('hero-bg-wrap');
  if (!hero || !bg) return;

  let mx = 0, my = 0, rafId = null;

  // mousemove só grava coords — custo zero
  hero.addEventListener('mousemove', e => {
    const { width: w, height: h } = hero.getBoundingClientRect();
    mx = (e.clientX / w - .5) * 2;
    my = (e.clientY / h - .5) * 2;
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        gsap.to(bg, { x: mx * -10, y: my * -7, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
        rafId = null;
      });
    }
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    gsap.to(bg, { x: 0, y: 0, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
  });
}

/* ─── HERO LIGHT PULSE ───────────────────────────────────────────────────── */
function heroPulse() {
  if (REDUCE_MOTION) return;
  const bg = document.getElementById('hero-bg');
  if (!bg) return;
  const schedule = () => setTimeout(() => {
    gsap.timeline()
      .to(bg, { filter: 'brightness(1.28)', duration: .14, ease: 'power2.in' })
      .to(bg, { filter: 'brightness(1)',    duration: .42, ease: 'power2.out' });
    schedule();
  }, 3200 + Math.random() * 3200);
  setTimeout(schedule, 2500);
}

/* ─── HERO SCROLL EXIT ───────────────────────────────────────────────────── */
function heroScrollExit() {
  if (REDUCE_MOTION) return;
  const bgWrap  = document.getElementById('hero-bg-wrap');
  const content = document.querySelector('.hero__content');
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1,
    onUpdate(self) {
      const p = self.progress;
      gsap.set(bgWrap,  { yPercent: -8 * p, scale: 1 + .08 * p, overwrite: 'auto' });
      gsap.set(content, { opacity: 1 - p * 1.6, y: -28 * p,     overwrite: 'auto' });
    }
  });
}

/* ─── MARQUEES ───────────────────────────────────────────────────────────── */
function initMarquees() {
  // Pausar marquee quando fora da viewport
  const marqueeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const tween = e.target.__marqueeTween;
      if (!tween) return;
      if (e.isIntersecting) tween.resume();
      else tween.pause();
    });
  }, { threshold: 0 });

  document.querySelectorAll('.marquee-wrap').forEach(wrap => {
    const inner = wrap.querySelector('.marquee-inner');
    if (!inner) return;
    const origW = inner.scrollWidth;
    inner.innerHTML += inner.innerHTML; // seamless double

    const speed = parseFloat(wrap.dataset.speed || .5);
    const tween = gsap.fromTo(inner, { x: 0 }, {
      x: -origW, ease: 'none',
      duration: origW / (60 * speed),
      repeat: -1
    });

    inner.__marqueeTween = tween;
    marqueeObs.observe(inner);

    // velocity boost on scroll
    ScrollTrigger.create({
      trigger: wrap, start: 'top bottom', end: 'bottom top',
      onUpdate(self) {
        if (!self.isActive) return;
        const v = Math.abs(self.getVelocity());
        if (v > 40) {
          const boost = Math.min(v / 600, 5);
          gsap.to(tween, { timeScale: 1 + boost, duration: .15, ease: 'none' });
          gsap.to(tween, { timeScale: 1, duration: .9, ease: 'power3.out', delay: .15 });
        }
      }
    });
  });
}

/* ─── DOR STAGGER REVEALS ────────────────────────────────────────────────── */
function initDorReveals() {
  const items = document.querySelectorAll('.dor__item');
  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item, start: 'top 89%', once: true,
      onEnter: () => gsap.to(item, { opacity: 1, x: 0, duration: .7, delay: i * .07, ease: 'power3.out' })
    });
  });
}

/* ─── GENERIC REVEALS ────────────────────────────────────────────────────── */
function initReveal() {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    ScrollTrigger.create({
      trigger: el, start: 'top 86%', once: true,
      onEnter: () => gsap.to(el, {
        opacity: 1, y: 0, duration: .8, delay, ease: 'power3.out',
        onComplete: () => { gsap.set(el, { clearProps: 'transform' }); el.removeAttribute('data-reveal'); }
      })
    });
  });
}

/* ─── BONUS STAGGER ──────────────────────────────────────────────────────── */
function initBonusReveals() {
  document.querySelectorAll('.bonus-item').forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item, start: 'top 90%', once: true,
      onEnter: () => gsap.to(item, {
        opacity: 1, y: 0, duration: .6, delay: i * .07, ease: 'power3.out',
        onComplete: () => { gsap.set(item, { clearProps: 'transform' }); item.classList.add('is-revealed'); }
      })
    });
  });
}

/* ─── STATS COUNT-UP ─────────────────────────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const end    = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    if (REDUCE_MOTION) { el.textContent = prefix + end + suffix; return; }

    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end, duration: 2, ease: 'power2.out',
          onUpdate: () => { el.textContent = prefix + Math.round(obj.val) + suffix; }
        });
      }
    });
  });
}

/* ─── FLOATING MOCKUPS — PARALLAX + REVEAL ───────────────────────────────── */
function initFloatingMockups() {
  if (!REDUCE_MOTION) {
    document.querySelectorAll('[data-float]').forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: 'top bottom', end: 'bottom top', scrub: true,
        onUpdate(self) {
          gsap.set(el, { y: -20 * (self.progress - .5) * 2, overwrite: 'auto' });
        }
      });
    });
  }
  document.querySelectorAll('[data-reveal-up]').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 86%', once: true,
      onEnter: () => gsap.to(el, {
        opacity: 1, y: 0, duration: .85, ease: 'power3.out',
        onComplete: () => gsap.set(el, { clearProps: 'transform' })
      })
    });
  });
}

/* ─── SCRUB FRAMES ───────────────────────────────────────────────────────── */
async function initScrub() {
  const canvas = document.getElementById('scrub-canvas');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  canvas.width  = 1280;
  canvas.height = 720;
  const frames  = [];

  // Fallback single image — garante que o canvas nunca fica vazio
  const fallback = new Image();
  fallback.src = 'assets/cia_001.webp';
  await new Promise(res => { fallback.onload = fallback.onerror = res; });
  for (let i = 0; i < FRAME_COUNT; i++) frames[i] = fallback;

  // Smart preload: primeiro, meio e último imediatos — resto em idle
  const BASE = 'assets/frames/cia_';
  const priority = [0, Math.floor(FRAME_COUNT / 2), FRAME_COUNT - 1];
  function loadFrame(idx) {
    const img = new Image();
    img.onload = () => { frames[idx] = img; };
    img.src = BASE + String(idx + 1).padStart(3, '0') + '.webp';
  }
  priority.forEach(i => loadFrame(i));
  const idle = typeof requestIdleCallback !== 'undefined' ? requestIdleCallback : setTimeout;
  idle(() => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      if (!priority.includes(i)) loadFrame(i);
    }
  });

  const ZOOM = 1.06;
  let lastFrameIdx = -1; // dirty-flag: não redesenha frame igual
  function draw(frameIndex) {
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frameIndex)));
    if (idx === lastFrameIdx) return;
    lastFrameIdx = idx;
    const img = frames[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    const cw = canvas.width, ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * ZOOM;
    const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }

  const labels = document.getElementById('scrub-labels');
  const close  = document.getElementById('scrub-close');
  draw(0);

  ScrollTrigger.create({
    trigger: '.scrub-section', start: 'top top', end: 'bottom bottom',
    scrub: 1,
    onUpdate(self) {
      const p = self.progress;
      draw(p * (FRAME_COUNT - 1));
      if (labels) labels.classList.toggle('visible', p > .2 && p < .88);
      if (close)  close.classList.toggle('visible',  p > .82);
    }
  });
}

/* ─── NICHOS HORIZONTAL SCROLL ───────────────────────────────────────────── */
function initNichos() {
  if (isMobile()) return;
  const track    = document.getElementById('nichos-track');
  const segs     = document.querySelectorAll('.np-seg');
  const ambients = document.querySelectorAll('.nichos-ambient');
  if (!track) return;

  ScrollTrigger.create({
    trigger: '.nichos-section', start: 'top top', end: 'bottom bottom',
    scrub: 1,
    onUpdate(self) {
      const p     = self.progress;
      const maxX  = track.scrollWidth - window.innerWidth;
      gsap.set(track, { x: -maxX * p });

      // progress bar
      const idx = Math.min(3, Math.floor(p * 4));
      segs.forEach((s, i) => s.classList.toggle('active', i <= idx));

      // ambient crossfade
      const fi = Math.min(3, Math.round(p * 3));
      ambients.forEach((a, i) => a.classList.toggle('active', i === fi));
    }
  });
}

/* ─── MAGNETIC BUTTONS ───────────────────────────────────────────────────── */
function initMagnetic() {
  if (isMobile()) return;
  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(btn, { x: x * .35, y: y * .35, duration: .4, ease: 'power2.out', overwrite: 'auto' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1.2,.4)', overwrite: 'auto' });
    });
  });
}

/* ─── FAQ ACCORDION ──────────────────────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn  = item.querySelector('.faq-btn');
    const body = item.querySelector('.faq-body');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-body').style.maxHeight = '0';
        other.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ─── GOLDEN RAYS ────────────────────────────────────────────────────────── */
function initRays() {
  const container = document.getElementById('rays');
  if (!container) return;
  for (let i = 0; i < 14; i++) {
    const ray  = document.createElement('span');
    ray.className = 'ray';
    const dur        = 80 + Math.random() * 30;
    const spinOffset = -((i / 14) * dur);
    const pulseDur   = 2 + Math.random() * 3;
    const pulseDelay = -(Math.random() * pulseDur);
    const opacity    = .07 + Math.random() * .16;
    ray.style.cssText = `opacity:${opacity};animation:ray-spin ${dur}s linear ${spinOffset}s infinite, ray-pulse ${pulseDur}s ease-in-out ${pulseDelay}s infinite;`;
    container.appendChild(ray);
  }
}

/* ─── DEMO (iframe YouTube com lazy load) ───────────────────────────────────── */
function initDemoVideo() {
  const demoFrame = document.getElementById('demoFrame');
  if (!demoFrame) return;
  const iframeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        demoFrame.src = demoFrame.dataset.src;
        iframeObs.unobserve(demoFrame);
      }
    });
  }, { rootMargin: '200px' });
  iframeObs.observe(demoFrame);
}

/* ─── KINETIC SECTION HEADLINES ──────────────────────────────────────────── */
function initKineticHeads() {
  if (REDUCE_MOTION) return;
  const heads = ['.dor__h2', '.compare__h2', '.scrub-h2', '.demo__h2',
                 '.dominar__h2', '.etapas__h2', '.prova__h2', '.bonus__h2',
                 '.oferta__h2', '.faq__title', '.cta-final__h2'];
  heads.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.fromTo(el,
        { opacity: 0, y: 28, skewX: -2 },
        { opacity: 1, y: 0,  skewX: 0,  duration: .85, ease: 'power3.out' }
      )
    });
  });
}

/* ─── SCROLL TO TOP ──────────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    btn.classList.toggle('visible', total > 0 && window.scrollY / total > .4);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── MAIN INIT ──────────────────────────────────────────────────────────── */
function initAll() {
  initNav();
  heroMouseParallax();
  heroPulse();
  heroScrollExit();
  initMarquees();
  initDorReveals();
  initReveal();
  initBonusReveals();
  initCounters();
  initFloatingMockups();
  initScrub();
  initDemoVideo();
  initNichos();
  initMagnetic();
  initFaq();
  initRays();
  initKineticHeads();
  initScrollTop();

  // Debounced resize refresh (transform-only animations stay cheap)
  let _rt;
  window.addEventListener('resize', () => {
    clearTimeout(_rt);
    _rt = setTimeout(() => ScrollTrigger.refresh(), 200);
  }, { passive: true });
}

/* ─── BOOT ───────────────────────────────────────────────────────────────── */
// Idempotent init — safe to call multiple times
let _bootDone = false;
function safeInit(withHeroAnim) {
  if (_bootDone) return;
  _bootDone = true;
  if (withHeroAnim && !REDUCE_MOTION) heroIntro();
  initAll();
}

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
  });
  initParticles();

  // Failsafe: always init within 4s even if curtain has issues
  const fallback = setTimeout(() => safeInit(false), 4000);

  runCurtain(() => {
    clearTimeout(fallback);
    safeInit(true);
  });
});
