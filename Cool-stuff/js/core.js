/* ==========================================================================
   core.js — state, appearance, routing, shared helpers
   ========================================================================== */
(function () {
  'use strict';

  var LS_STATE = 'sherlockian.state.v1';
  var LS_APPEAR = 'sherlockian.appearance.v1';

  /* ---------- tiny DOM helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function on(root, evt, sel, fn) {
    root.addEventListener(evt, function (e) {
      var target = e.target.closest(sel);
      if (target && root.contains(target)) fn(e, target);
    });
  }

  /* ---------- generic helpers ---------- */
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

  /* ---------- persistent state ---------- */
  var defaults = {
    progress: {},   // skillId -> { best, sessions, attempts, correct, total, last }
    completed: {},  // caseId -> true
    index: null
  };
  var state = load(LS_STATE, defaults);

  function load(key, fb) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return JSON.parse(JSON.stringify(fb));
      return Object.assign(JSON.parse(JSON.stringify(fb)), JSON.parse(raw));
    } catch (e) { return JSON.parse(JSON.stringify(fb)); }
  }
  function save() {
    try { localStorage.setItem(LS_STATE, JSON.stringify(state)); } catch (e) {}
  }
  function saveAppear() {
    try { localStorage.setItem(LS_APPEAR, JSON.stringify(appearance)); } catch (e) {}
  }

  function record(skillId, score, detail) {
    var p = state.progress[skillId] || { best: 0, sessions: 0, attempts: 0, correct: 0, last: 0 };
    p.sessions += 1;
    p.attempts += (detail && detail.attempts) || 0;
    p.correct += (detail && detail.correct) || 0;
    p.best = Math.max(p.best, Math.round(score));
    p.last = Date.now();
    state.progress[skillId] = p;
    save();
    computeIndex();
    return p;
  }
  function scoreOf(id) { return state.progress[id] ? state.progress[id].best : 0; }

  /* Sherlockian Index = weighted blend of the 5 cores (70%) + practical (30%) */
  var CORE = ['critical', 'observation', 'memory', 'focus', 'social'];
  function computeIndex() {
    var coreSum = 0, coreN = 0;
    CORE.forEach(function (id) {
      var p = state.progress[id];
      if (p) { coreSum += p.best; coreN++; }
    });
    var coreAvg = coreN ? coreSum / coreN : 0;
    var prac = state.progress.practical ? state.progress.practical.best : 0;
    var hasCore = coreN > 0, hasPrac = prac > 0;
    var idx;
    if (!hasCore && !hasPrac) idx = null;
    else if (hasCore && hasPrac) idx = coreAvg * 0.7 + prac * 0.3;
    else if (hasCore) idx = coreAvg * 0.7;
    else idx = prac * 0.3;
    state.index = idx === null ? null : Math.round(idx);
    save();
    return state.index;
  }

  /* ---------- appearance ---------- */
  var appearanceDefaults = {
    theme: 'case', bg: 'fog', layout: 'grid',
    density: 'comfortable', motion: 'full', font: 'sans',
    particles: true, compactText: false, glow: true, accent: null
  };
  var appearance = Object.assign({}, appearanceDefaults, load(LS_APPEAR, {}));

  var THEMES = {
    case:       { name: '221B Case',    dots: ['#160C0C', '#A33B3B', '#E8B86E'] },
    parchment:  { name: 'Parchment',    dots: ['#EFE7D8', '#8C3A2E', '#9A7434'] },
    midnight:   { name: 'Midnight',     dots: ['#0B1220', '#3E6FD1', '#5EC7E8'] },
    noir:       { name: 'Noir',         dots: ['#0A0A0A', '#8E8E8E', '#FFFFFF'] },
    verdigris:  { name: 'Verdigris',    dots: ['#08130F', '#2F8F73', '#D8C57E'] },
    monochrome: { name: 'Desaturated',  dots: ['#101010', '#6F8F76', '#D6C79A'] }
  };
  var BGS = {
    fog: 'Fog & grid', grid: 'Blueprint', motes: 'Dust motes', dusk: 'Ember dusk', plain: 'Plain'
  };
  var ACCENTS = [
    { id: null,     name: 'Theme default', color: null },
    { id: 'ember',  name: 'Ember',   color: '#D25A4E' },
    { id: 'gold',   name: 'Brass',   color: '#E8B86E' },
    { id: 'teal',   name: 'Verdant', color: '#4FC7A4' },
    { id: 'azure',  name: 'Azure',   color: '#6C9BFF' },
    { id: 'violet', name: 'Amethyst',color: '#A98BE0' },
    { id: 'rose',   name: 'Rose',    color: '#E58BA0' }
  ];

  function applyAppearance() {
    var r = document.documentElement;
    r.setAttribute('data-theme', appearance.theme);
    r.setAttribute('data-bg', appearance.bg);
    r.setAttribute('data-layout', appearance.layout);
    r.setAttribute('data-density', appearance.density);
    r.setAttribute('data-motion', appearance.motion);
    r.setAttribute('data-font', appearance.font);

    // accent override
    if (appearance.accent) {
      var a = ACCENTS.filter(function (x) { return x.id === appearance.accent; })[0];
      if (a && a.color) {
        r.style.setProperty('--accent', a.color);
        r.style.setProperty('--accent-bright', shade(a.color, 0.22));
      } else {
        r.style.removeProperty('--accent'); r.style.removeProperty('--accent-bright');
      }
    } else { r.style.removeProperty('--accent'); r.style.removeProperty('--accent-bright'); }

    if (!appearance.particles) $('#bgParticles').style.display = 'none';
    else $('#bgParticles').style.display = '';

    r.style.setProperty('--card-pad', appearance.density === 'compact' ? '18px' : '24px');
    if (appearance.compactText) r.style.setProperty('--body-size', '14px');
    else r.style.removeProperty('--body-size');

    var meta = document.querySelector('meta[name="theme-color"]');
    var bgc = THEMES[appearance.theme] ? getComputedStyle(r).getPropertyValue('--bg-base') : '';
    if (meta && bgc) meta.setAttribute('content', bgc.trim());

    saveAppear();
    buildParticles();
  }

  function shade(hex, amt) {
    var c = hex.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var n = parseInt(c, 16);
    var r = clamp(Math.round(((n >> 16) & 255) * (1 + amt)), 0, 255);
    var g = clamp(Math.round(((n >> 8) & 255) * (1 + amt)), 0, 255);
    var b = clamp(Math.round((n & 255) * (1 + amt)), 0, 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  /* particles */
  var particleTimer = null;
  function buildParticles() {
    var host = $('#bgParticles');
    if (!host) return;
    host.innerHTML = '';
    if (appearance.bg === 'plain' || appearance.bg === 'grid') return;
    var n = appearance.bg === 'motes' ? 34 : appearance.bg === 'dusk' ? 26 : 20;
    if (appearance.motion === 'reduced') n = Math.min(n, 16);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'mote';
      var size = 2 + Math.random() * 3;
      s.style.cssText =
        'left:' + (Math.random() * 100).toFixed(2) + '%;' +
        'top:' + (Math.random() * 100).toFixed(2) + '%;' +
        'width:' + size.toFixed(1) + 'px;height:' + size.toFixed(1) + 'px;' +
        'animation-duration:' + (6 + Math.random() * 6).toFixed(1) + 's;' +
        'animation-delay:' + (-Math.random() * 10).toFixed(1) + 's;';
      frag.appendChild(s);
    }
    host.appendChild(frag);
  }

  /* ---------- routing ---------- */
  var routes = {};
  var current = null;

  function registerRoute(id, handler) { routes[id] = handler; }

  function parseHash() {
    var h = (location.hash || '#/').replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean);
    if (!parts.length) return { id: 'home', param: null };
    return { id: parts[0], param: parts[1] || null };
  }

  function navigate() {
    var r = parseHash();
    var handler = routes[r.id] ? r.id : 'home';
    var view = $('#view');
    var changed = current !== handler + ':' + (r.param || '');
    current = handler + ':' + (r.param || '');

    // nav highlight
    $$('.nav-item').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-route') === (handler === 'home' ? 'home' : handler));
    });
    document.title = (handler === 'home' ? 'The Sherlockian Skill' : (SKILLS[handler] ? SKILLS[handler].title + ' — ' : '') + 'The Sherlockian Skill');

    if (changed) {
      view.style.opacity = '0';
      view.style.transform = 'translateY(8px)';
      view.scrollTop = 0;
      window.setTimeout(function () {
        view.innerHTML = '';
        try { routes[handler](view, r.param); } catch (e) {
          console.error(e);
          view.innerHTML = '<div class="wrap"><div class="panel"><h2>Something went wrong</h2><p>' + esc(e.message) + '</p></div></div>';
        }
        view.style.transition = 'opacity .38s cubic-bezier(.22,1,.36,1), transform .38s cubic-bezier(.22,1,.36,1)';
        view.style.opacity = '1';
        view.style.transform = 'none';
        observeReveals();
        refreshSidebarIndex();
        if (typeof closeMobileNav === 'function') closeMobileNav();
      }, 90);
    }
    updateIndexUI();
  }

  function refreshSidebarIndex() { updateIndexUI(); }

  function updateIndexUI() {
    var idx = computeIndex();
    var val = $('#sideIndex'), bar = $('#sideIndexBar'), note = $('#sideIndexNote');
    if (!val) return;
    if (idx === null) { val.textContent = '—'; bar.style.width = '0%'; note.textContent = 'Complete a module to calibrate your index.'; return; }
    val.textContent = idx;
    bar.style.width = idx + '%';
    var cores = CORE.filter(function (id) { return state.progress[id]; }).length;
    if (!state.progress.practical) note.textContent = cores + '/5 core modules trained. Practical not yet attempted.';
    else note.textContent = cores + '/5 core trained · practical applied.';
  }

  /* ---------- reveal on scroll ---------- */
  var io = null;
  var revealFallback = null;
  function observeReveals() {
    if (io) io.disconnect();
    var nodes = $$('.reveal');

    /* Anything already in or near the viewport is revealed immediately —
       never leave first paint dependent on an observer callback. */
    var vh = window.innerHeight || 800;
    nodes.forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < vh * 1.15) n.classList.add('in');
    });

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.03 });
    nodes.forEach(function (n) { if (!n.classList.contains('in')) io.observe(n); });

    /* Safety net: if the observer never delivers (backgrounded tab, odd
       scroll container), reveal everything rather than hide the page. */
    if (revealFallback) clearTimeout(revealFallback);
    revealFallback = setTimeout(function () {
      $$('.reveal').forEach(function (n) { n.classList.add('in'); });
    }, 1400);
  }

  /* ---------- shared UI builders ---------- */
  function toneVars(tone) { return 'style="--tone:var(--' + tone + ')"'; }

  function ring(score, tone) {
    var r = 56, c = 2 * Math.PI * r;
    var off = c - (clamp(score, 0, 100) / 100) * c;
    var col = 'var(--' + (tone || 'gold') + ')';
    return '<div class="ring"><svg width="132" height="132" viewBox="0 0 132 132">' +
      '<circle cx="66" cy="66" r="' + r + '" fill="none" stroke="color-mix(in srgb, var(--text-muted) 22%, transparent)" stroke-width="9"/>' +
      '<circle cx="66" cy="66" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="9" stroke-linecap="round" ' +
      'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" style="transition:stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)"/>' +
      '</svg><div class="num">' + Math.round(score) + '<small>/100</small></div></div>';
  }

  function dotsHTML(results, currentIndex) {
    return '<div class="progress-dots">' + results.map(function (r, i) {
      var cls = r === true ? 'done' : r === false ? 'miss' : '';
      if (i === currentIndex) cls = 'now';
      return '<i class="' + cls + '"></i>';
    }).join('') + '</div>';
  }

  function backLink(label) {
    return '<a class="back-link" href="#/">' +
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>' +
      esc(label || 'Back to the system') + '</a>';
  }

  function appHead(skill, extra) {
    return backLink() +
      '<div class="app-head" ' + toneVars(skill.tone) + '>' +
        '<div class="app-head-ico">' + skill.icon + '</div>' +
        '<div class="app-head-main">' +
          '<p class="role">' + esc(skill.role) + '</p>' +
          '<h1>' + esc(skill.title) + '</h1>' +
          '<p class="sub">' + esc(skill.long) + '</p>' +
          (extra || '') +
        '</div>' +
      '</div>';
  }

  function progressBar(p) {
    var v = p ? p.best : 0;
    return '<div class="stat-card"><span class="lbl">Best result</span>' +
      '<div class="val">' + (v ? v + '<small>/100</small>' : '—') + '</div>' +
      '<div class="meter" style="margin-top:9px"><i style="width:' + v + '%"></i></div>' +
      '<p class="hint">' + (p ? p.sessions + ' session' + (p.sessions === 1 ? '' : 's') + ' recorded' : 'Not yet trained') + '</p></div>';
  }

  /* ---------- export ---------- */
  window.SK = {
    $: $, $$: $$, el: el, esc: esc, on: on,
    clamp: clamp, shuffle: shuffle, pick: pick, sample: sample, pad2: pad2, pct: pct,
    state: state, save: save, record: record, scoreOf: scoreOf,
    computeIndex: computeIndex, CORE: CORE,
    appearance: appearance, appearanceDefaults: appearanceDefaults,
    applyAppearance: applyAppearance, THEMES: THEMES, BGS: BGS, ACCENTS: ACCENTS,
    registerRoute: registerRoute, navigate: navigate, parseHash: parseHash,
    observeReveals: observeReveals, updateIndexUI: updateIndexUI,
    ring: ring, dotsHTML: dotsHTML, backLink: backLink, appHead: appHead,
    progressBar: progressBar, toneVars: toneVars, shuffleN: sample
  };
})();
