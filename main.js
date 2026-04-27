// ─── CURSOR ───
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

// ─── INDEX OVERLAY ───
const viewIndex = document.getElementById('view-index');

function showIndex() {
  // Posicionar arriba sin transición, luego animar hacia abajo
  viewIndex.classList.add('hiding');
  viewIndex.classList.remove('hidden');
  document.body.classList.add('index-open');
  viewIndex.offsetHeight; // force reflow
  viewIndex.classList.remove('hiding');
  history.pushState(null, '', '#');
}

function hideIndex(targetView) {
  viewIndex.classList.add('hiding');
  document.body.classList.remove('index-open');
  viewIndex.addEventListener('transitionend', function handler(e) {
    if (e.propertyName !== 'transform') return;
    viewIndex.classList.add('hidden');
    viewIndex.removeEventListener('transitionend', handler);
  });
  switchView(targetView, true);
}

// Panel clicks
viewIndex.querySelectorAll('[data-goto]').forEach(panel => {
  panel.addEventListener('click', () => {
    hideIndex(panel.getAttribute('data-goto'));
  });
});

// Logo click → show index
document.querySelector('.nav-logo').addEventListener('click', e => {
  e.preventDefault();
  showIndex();
});

// ─── REVEAL OBSERVER ───
let revealObserver = null;
function initReveal(viewEl) {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  viewEl.querySelectorAll('.reveal').forEach(el => {
    // Re-observe even already-visible elements when switching views
    revealObserver.observe(el);
  });
}

// ─── NAV ACTIVE LINK HIGHLIGHT (scroll-based, per view) ───
function updateNavActive(viewEl, linksEl) {
  const sections = viewEl.querySelectorAll('section[id]');
  const links    = linksEl.querySelectorAll('a');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  links.forEach(a => {
    const href = a.getAttribute('href');
    a.style.color = href === '#' + current ? 'var(--tierra)' : '';
  });
}

// ─── VIEW SWITCHING ───
const viewOrder = ['eventos', 'productos']; // define la dirección izq→derecha
let activeViewName = null; // null = primera carga, sin animación

const views = {
  eventos:  document.getElementById('view-eventos'),
  productos: document.getElementById('view-productos')
};
const tabEventos   = document.getElementById('tabEventos');
const tabProductos = document.getElementById('tabProductos');
const navLinksEventos   = document.getElementById('navLinksEventos');
const navLinksProductos = document.getElementById('navLinksProductos');
const navLogoSub = document.getElementById('navLogoSub');
const navCta     = document.querySelector('.nav-cta');

const viewConfig = {
  eventos: {
    tab:       tabEventos,
    otherTab:  tabProductos,
    links:     navLinksEventos,
    otherLinks: navLinksProductos,
    logoSub:   'Eventos',
    ctaText:   'Cotizar',
    ctaHref:   '#contacto'
  },
  productos: {
    tab:       tabProductos,
    otherTab:  tabEventos,
    links:     navLinksProductos,
    otherLinks: navLinksEventos,
    logoSub:   'Foto Producto',
    ctaText:   'Cotizar',
    ctaHref:   '#contacto'
  }
};

const ANIM_CLASSES = ['anim-enter-right','anim-enter-left','anim-exit-left','anim-exit-right'];

function switchView(name, pushState) {
  const cfg = viewConfig[name];
  if (!cfg) return;

  const goingRight = viewOrder.indexOf(name) > viewOrder.indexOf(activeViewName);
  const shouldAnim = activeViewName !== null && activeViewName !== name;
  const outView    = activeViewName ? views[activeViewName] : null;

  // ── Animate out the current view ──
  if (shouldAnim && outView) {
    const exitClass = goingRight ? 'anim-exit-left' : 'anim-exit-right';
    outView.classList.remove('active');
    ANIM_CLASSES.forEach(c => outView.classList.remove(c));
    outView.classList.add(exitClass);
    outView.addEventListener('animationend', function h() {
      outView.classList.remove(exitClass);
      outView.removeEventListener('animationend', h);
    }, { once: true });
  } else {
    Object.keys(views).forEach(k => {
      views[k].classList.remove('active');
      ANIM_CLASSES.forEach(c => views[k].classList.remove(c));
    });
  }

  // ── Animate in the new view ──
  activeViewName = name;
  ANIM_CLASSES.forEach(c => views[name].classList.remove(c));
  views[name].classList.add('active');
  if (shouldAnim) {
    const enterClass = goingRight ? 'anim-enter-right' : 'anim-enter-left';
    views[name].classList.add(enterClass);
    views[name].addEventListener('animationend', function h() {
      views[name].classList.remove(enterClass);
      views[name].removeEventListener('animationend', h);
    }, { once: true });
  }

  // Update nav-links visibility
  navLinksEventos.classList.remove('nav-links-visible');
  navLinksProductos.classList.remove('nav-links-visible');
  cfg.links.classList.add('nav-links-visible');

  // Update tab styles
  cfg.tab.classList.remove('nav-tab-inactive');
  cfg.tab.classList.add('nav-tab-' + name + '-active');
  cfg.otherTab.classList.remove('nav-tab-' + (name === 'eventos' ? 'productos' : 'eventos') + '-active');
  cfg.otherTab.classList.add('nav-tab-inactive');

  // Update logo sub-text
  navLogoSub.textContent = cfg.logoSub;

  // Update CTA
  navCta.textContent = cfg.ctaText;
  navCta.href = cfg.ctaHref;

  // Update hash without scrolling to top
  if (pushState) {
    history.pushState(null, '', '#' + name);
  }

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Re-run reveal observer on the newly active view
  initReveal(views[name]);
}

// ─── TAB CLICK HANDLERS ───
[tabEventos, tabProductos].forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const viewName = tab.getAttribute('data-view');
    switchView(viewName, true);
  });
});

// Handle footer "← Volver a Eventos" link in productos view
document.querySelectorAll('[data-view]').forEach(el => {
  if (el === tabEventos || el === tabProductos) return; // already handled
  el.addEventListener('click', e => {
    e.preventDefault();
    const viewName = el.getAttribute('data-view');
    switchView(viewName, true);
  });
});

// ─── NAV SECTION LINKS: scroll dentro de la view activa ───
document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    if (id === 'eventos' || id === 'productos') return; // handled by tabs
    const activeViewName = views.eventos.classList.contains('active') ? 'eventos' : 'productos';
    const target = views[activeViewName].querySelector('#' + id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ─── SCROLL: nav active link highlight ───
window.addEventListener('scroll', () => {
  const activeViewName = views.eventos.classList.contains('active') ? 'eventos' : 'productos';
  const activeLinksEl = activeViewName === 'eventos' ? navLinksEventos : navLinksProductos;
  updateNavActive(views[activeViewName], activeLinksEl);
});

// ─── INIT: read hash on load ───
(function init() {
  const hash = location.hash.replace('#', '');
  if (hash === 'eventos' || hash === 'productos') {
    viewIndex.classList.add('hidden');
    document.body.classList.remove('index-open');
    switchView(hash, false);
  } else {
    document.body.classList.add('index-open');
    switchView('eventos', false); // prepare eventos view underneath
  }
})();

// ─── HANDLE BROWSER BACK/FORWARD ───
window.addEventListener('popstate', () => {
  const hash = location.hash.replace('#', '');
  const v = (hash === 'productos') ? 'productos' : 'eventos';
  switchView(v, false);
});

// ─── TYPOGRAPHY SWITCHER ───
const typoMap = { mono: null, clasica: 'clasica', geo: 'geo', suave: 'suave' };

document.querySelectorAll('.nav-typo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const t = btn.getAttribute('data-typo');
    document.documentElement.setAttribute('data-typo', typoMap[t] || '');
    if (!typoMap[t]) document.documentElement.removeAttribute('data-typo');
    document.querySelectorAll('.nav-typo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    localStorage.setItem('typo', t);
  });
});

// restore saved preference
(function restoreTypo() {
  const saved = localStorage.getItem('typo');
  if (saved && saved !== 'mono') {
    const btn = document.querySelector('.nav-typo-btn[data-typo="' + saved + '"]');
    if (btn) btn.click();
  }
})();

// ─── COLOR SWITCHER ───
document.querySelectorAll('.nav-color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const c = btn.getAttribute('data-color');
    if (c === 'default') {
      document.documentElement.removeAttribute('data-color');
    } else {
      document.documentElement.setAttribute('data-color', c);
    }
    document.querySelectorAll('.nav-color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    localStorage.setItem('color', c);
  });
});

(function restoreColor() {
  const saved = localStorage.getItem('color');
  if (saved && saved !== 'default') {
    const btn = document.querySelector('.nav-color-btn[data-color="' + saved + '"]');
    if (btn) btn.click();
  }
})();
