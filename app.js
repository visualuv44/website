/* ════════════════════════════════════════════
   VISUALUV — interactions (GSAP + Lenis)
   ════════════════════════════════════════════ */

document.documentElement.classList.add('js');

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || new URLSearchParams(location.search).has('instant');
const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ─── SMOOTH SCROLL (Lenis) ─── */
let lenis = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ─── SPLIT HELPERS ─── */
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach(ch => {
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = ch;
    el.appendChild(s);
  });
  return el.querySelectorAll('.char');
}

function splitLines(el) {
  // wrap words, detect lines by offsetTop, re-wrap in masks
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
  const spans = [...el.querySelectorAll('.w')];
  const lines = [];
  let top = null, line = [];
  spans.forEach(s => {
    if (top === null || Math.abs(s.offsetTop - top) > 4) {
      if (line.length) lines.push(line);
      line = []; top = s.offsetTop;
    }
    line.push(s.textContent);
  });
  if (line.length) lines.push(line);
  el.innerHTML = lines.map(l =>
    `<span class="line-mask"><span class="line-inner">${l.join(' ')}</span></span>`
  ).join('');
  return el.querySelectorAll('.line-inner');
}

document.querySelectorAll('[data-split]').forEach(splitChars);

/* ─── PRELOADER ─── */
const preloader = document.getElementById('preloader');
const preCount  = document.getElementById('preCount');
const preBar    = document.getElementById('preBar');

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(preloader, {
      yPercent: -100, duration: 1, ease: 'power4.inOut',
      onComplete: () => preloader.remove()
    })
    .to('.hero-title .char', {
      y: 0, duration: 1.2, stagger: 0.045, ease: 'power4.out'
    }, '-=0.45')
    .to('.hero-img-mask', {
      clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power4.inOut'
    }, '-=0.9')
    .to('#heroImg', { scale: 1, duration: 1.6, ease: 'power3.out' }, '<')
    .to('.hero [data-reveal]', {
      opacity: 1, y: 0, duration: 1, stagger: 0.12
    }, '-=1');
}

if (reduceMotion) {
  preloader.remove();
  gsap.set('.hero-title .char', { y: 0 });
  gsap.set('.hero-img-mask', { clipPath: 'inset(0% 0 0 0)' });
  gsap.set('#heroImg', { scale: 1 });
} else {
  const state = { p: 0 };
  gsap.to(state, {
    p: 100, duration: 1.6, ease: 'power2.inOut',
    onUpdate: () => {
      preCount.textContent = String(Math.round(state.p)).padStart(2, '0');
      preBar.style.width = state.p + '%';
    },
    onComplete: () => {
      const img = document.getElementById('heroImg');
      let started = false;
      const start = () => { if (!started) { started = true; heroIntro(); } };
      if (img.complete) start();
      else {
        img.addEventListener('load', start, { once: true });
        img.addEventListener('error', start, { once: true });
        setTimeout(start, 1500); // never strand the preloader
      }
    }
  });
}

/* ─── SCROLL REVEALS ─── */
if (!reduceMotion) {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (el.closest('.hero')) return; // handled in intro
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  document.querySelectorAll('[data-split-lines]').forEach(el => {
    const lines = splitLines(el);
    gsap.from(lines, {
      yPercent: 110, duration: 1.1, stagger: 0.09, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  /* parallax images */
  document.querySelectorAll('[data-parallax]').forEach(wrap => {
    const img = wrap.querySelector('img');
    const amt = parseFloat(wrap.dataset.parallax) || -10;
    gsap.fromTo(img, { yPercent: 0 }, {
      yPercent: amt, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* contact big text chars on scroll */
  ScrollTrigger.create({
    trigger: '.contact', start: 'top 70%', once: true,
    onEnter: () => gsap.to('.contact-big .char', {
      y: 0, duration: 1.1, stagger: 0.04, ease: 'power4.out'
    })
  });
} else {
  gsap.set('[data-reveal], .contact-big .char', { opacity: 1, y: 0, clearProps: 'transform' });
}

/* ─── MARQUEE (velocity-reactive) ─── */
const marqueeTrack = document.getElementById('marqueeTrack');
if (marqueeTrack && !reduceMotion) {
  const tween = gsap.to(marqueeTrack, { xPercent: -50, ease: 'none', duration: 22, repeat: -1 });
  if (lenis) {
    lenis.on('scroll', ({ velocity }) => {
      const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(velocity) * 0.06);
      gsap.to(tween, { timeScale: boost, duration: 0.3, overwrite: true });
    });
  }
}

/* ─── HORIZONTAL STRIP (desktop only) ─── */
ScrollTrigger.matchMedia({
  '(min-width: 921px)': () => {
    if (reduceMotion) return;
    const track = document.getElementById('stripTrack');
    const pin   = document.getElementById('stripPin');
    const getDist = () => track.scrollWidth - window.innerWidth + 80;
    gsap.to(track, {
      x: () => -getDist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.strip',
        start: 'top top',
        end: () => '+=' + getDist(),
        pin: pin,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }
});

/* ─── SERVICES HOVER PREVIEW ─── */
const preview    = document.getElementById('servicePreview');
const previewImg = document.getElementById('servicePreviewImg');
if (finePointer && preview) {
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
  const services = document.querySelector('.services');

  services.addEventListener('mousemove', e => {
    xTo(e.clientX - 140);
    yTo(e.clientY - 175);
  });
  document.querySelectorAll('.service').forEach(li => {
    li.addEventListener('mouseenter', () => {
      previewImg.src = li.dataset.img;
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
    });
    li.addEventListener('mouseleave', () => {
      gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.4, ease: 'power3.out' });
    });
  });
}

/* ─── CUSTOM CURSOR ─── */
const cursor      = document.getElementById('cursor');
const cursorLabel = document.getElementById('cursorLabel');
if (finePointer) {
  const cx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const cy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); });

  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorLabel.textContent = el.dataset.cursor;
      cursor.classList.add('is-label');
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
  });
} else {
  cursor.remove();
}

/* ─── MAGNETIC BUTTONS ─── */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    const inner = btn.querySelector('span');
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
      if (inner) gsap.to(inner, {
        x: (e.clientX - r.left - r.width / 2) * 0.15,
        y: (e.clientY - r.top - r.height / 2) * 0.15,
        duration: 0.4, ease: 'power3'
      });
    });
    btn.addEventListener('mouseleave', () => {
      xTo(0); yTo(0);
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ─── ANCHOR SCROLL + MENU ─── */
const burger = document.getElementById('navBurger');
const menu   = document.getElementById('menu');

function closeMenu() {
  document.body.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
  if (lenis) lenis.start();
}
burger.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  burger.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
  if (lenis) open ? lenis.stop() : lenis.start();
});

document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    closeMenu();
    const target = document.querySelector(href);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });
});

document.getElementById('toTop').addEventListener('click', () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── REFRESH ON LOAD (images change layout) ─── */
window.addEventListener('load', () => ScrollTrigger.refresh());

/* ─── TEST HOOK: ?instant&at=<id> translates content for headless captures ─── */
const atTarget = new URLSearchParams(location.search).get('at');
if (atTarget) {
  window.addEventListener('load', () => {
    const t = document.getElementById(atTarget);
    if (t) document.body.style.transform = `translateY(${-t.offsetTop}px)`;
  });
}
