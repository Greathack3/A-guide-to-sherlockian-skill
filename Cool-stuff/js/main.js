/* ==========================================================================
   main.js — boot, appearance drawer, navigation chrome
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el, $ = SK.$, $$ = SK.$$;

  /* ==================================================================
     Appearance drawer
     ================================================================== */
  function buildDrawer() {
    var body = $('#drawerBody');
    body.innerHTML = '';

    /* --- Theme --- */
    var themeGroup = group('Colour theme', 'Six palettes');
    var sw = el('<div class="swatches"></div>');
    Object.keys(SK.THEMES).forEach(function (id) {
      var t = SK.THEMES[id];
      var b = el('<button class="swatch ' + (SK.appearance.theme === id ? 'on' : '') + '" type="button" data-v="' + id + '">' +
        '<span class="dots">' + t.dots.map(function (d) { return '<i style="background:' + d + '"></i>'; }).join('') + '</span>' +
        '<b>' + esc(t.name) + '</b></button>');
      b.addEventListener('click', function () {
        SK.appearance.theme = id;
        SK.applyAppearance();
        SK.$$('.swatch', sw).forEach(function (x) { x.classList.toggle('on', x.dataset.v === id); });
      });
      sw.appendChild(b);
    });
    themeGroup.appendChild(sw);
    body.appendChild(themeGroup);

    /* --- Accent --- */
    var accGroup = group('Accent colour', 'Interface highlight');
    var accSeg = el('<div class="seg icons"></div>');
    SK.ACCENTS.forEach(function (a) {
      var b = el('<button class="btn-ghost ' + (SK.appearance.accent === a.id ? 'on' : '') + '" type="button" data-v="' + (a.id || 'default') + '">' +
        (a.color
          ? '<span style="width:22px;height:14px;border-radius:5px;background:' + a.color + ';display:block"></span>'
          : '<span style="width:22px;height:14px;border-radius:5px;background:linear-gradient(90deg,var(--accent),var(--gold));display:block"></span>') +
        '<span>' + esc(a.name) + '</span></button>');
      b.addEventListener('click', function () {
        SK.appearance.accent = a.id;
        SK.applyAppearance();
        SK.$$('button', accSeg).forEach(function (x) { x.classList.toggle('on', x.dataset.v === (a.id || 'default')); });
      });
      accSeg.appendChild(b);
    });
    accGroup.appendChild(accSeg);
    body.appendChild(accGroup);

    /* --- Background --- */
    var bgGroup = group('Background atmosphere', 'Behind everything');
    var bgSeg = el('<div class="seg icons"></div>');
    var bgIcons = {
      fog: '<svg viewBox="0 0 40 24"><defs><radialGradient id="gf"><stop offset="0" stop-color="currentColor" stop-opacity=".7"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient></defs><rect width="40" height="24" rx="4" fill="currentColor" opacity=".15"/><ellipse cx="12" cy="9" rx="14" ry="9" fill="url(#gf)"/><ellipse cx="30" cy="16" rx="12" ry="8" fill="url(#gf)"/></svg>',
      grid: '<svg viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="currentColor" opacity=".15"/><path d="M0 6h40M0 12h40M0 18h40M8 0v24M16 0v24M24 0v24M32 0v24" stroke="currentColor" stroke-width="1" opacity=".6"/></svg>',
      motes: '<svg viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="currentColor" opacity=".15"/><circle cx="9" cy="8" r="2" fill="currentColor"/><circle cx="20" cy="15" r="1.5" fill="currentColor"/><circle cx="31" cy="7" r="2.5" fill="currentColor"/><circle cx="27" cy="18" r="1.4" fill="currentColor"/><circle cx="13" cy="18" r="1.2" fill="currentColor"/></svg>',
      dusk: '<svg viewBox="0 0 40 24"><defs><linearGradient id="gd" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="currentColor" stop-opacity=".85"/><stop offset="1" stop-color="currentColor" stop-opacity=".1"/></linearGradient></defs><rect width="40" height="24" rx="4" fill="url(#gd)"/><circle cx="30" cy="7" r="4" fill="currentColor" opacity=".5"/></svg>',
      plain: '<svg viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="currentColor" opacity=".15"/><rect x="6" y="6" width="28" height="12" rx="3" fill="currentColor" opacity=".35"/></svg>'
    };
    Object.keys(SK.BGS).forEach(function (id) {
      var b = el('<button type="button" data-v="' + id + '" class="' + (SK.appearance.bg === id ? 'on' : '') + '">' +
        (bgIcons[id] || '') + '<span>' + esc(SK.BGS[id]) + '</span></button>');
      b.addEventListener('click', function () {
        SK.appearance.bg = id;
        SK.applyAppearance();
        SK.$$('button', bgSeg).forEach(function (x) { x.classList.toggle('on', x.dataset.v === id); });
      });
      bgSeg.appendChild(b);
    });
    bgGroup.appendChild(bgSeg);
    body.appendChild(bgGroup);

    /* --- Layout --- */
    var layoutGroup = group('Module card layout', 'Homepage grid');
    var layoutSeg = el('<div class="seg icons"></div>');
    var layoutIcons = {
      grid: '<svg viewBox="0 0 40 24"><rect x="2" y="3" width="11.5" height="18" rx="2.5" fill="currentColor" opacity=".7"/><rect x="14.5" y="3" width="11.5" height="18" rx="2.5" fill="currentColor" opacity=".7"/><rect x="27" y="3" width="11.5" height="18" rx="2.5" fill="currentColor" opacity=".7"/></svg>',
      compact: '<svg viewBox="0 0 40 24"><rect x="2" y="3" width="18" height="18" rx="3" fill="currentColor" opacity=".7"/><rect x="21" y="3" width="17" height="18" rx="3" fill="currentColor" opacity=".7"/></svg>',
      wide: '<svg viewBox="0 0 40 24"><rect x="2" y="3" width="36" height="6" rx="2" fill="currentColor" opacity=".7"/><rect x="2" y="11" width="36" height="6" rx="2" fill="currentColor" opacity=".7"/><rect x="2" y="19" width="36" height="4" rx="2" fill="currentColor" opacity=".4"/></svg>'
    };
    [['grid', 'Three columns'], ['compact', 'Two columns'], ['wide', 'List rows']].forEach(function (pair) {
      var id = pair[0];
      var b = el('<button type="button" data-v="' + id + '" class="' + (SK.appearance.layout === id ? 'on' : '') + '">' +
        layoutIcons[id] + '<span>' + pair[1] + '</span></button>');
      b.addEventListener('click', function () {
        SK.appearance.layout = id;
        SK.applyAppearance();
        SK.$$('button', layoutSeg).forEach(function (x) { x.classList.toggle('on', x.dataset.v === id); });
      });
      layoutSeg.appendChild(b);
    });
    layoutGroup.appendChild(layoutSeg);
    body.appendChild(layoutGroup);

    /* --- Type --- */
    var fontGroup = group('Typography', 'Display & body face');
    var fontSeg = el('<div class="seg"></div>');
    [['sans', 'Sans (default)'], ['serif', 'Editorial serif'], ['mono', 'Monospace']].forEach(function (p) {
      var b = el('<button type="button" data-v="' + p[0] + '" class="' + (SK.appearance.font === p[0] ? 'on' : '') + '">' + p[1] + '</button>');
      b.addEventListener('click', function () {
        SK.appearance.font = p[0];
        SK.applyAppearance();
        SK.$$('button', fontSeg).forEach(function (x) { x.classList.toggle('on', x.dataset.v === p[0]); });
      });
      fontSeg.appendChild(b);
    });
    fontGroup.appendChild(fontSeg);
    body.appendChild(fontGroup);

    /* --- Toggles --- */
    var opts = group('Interface behaviour', 'Behaviour');
    opts.appendChild(toggle('particles', 'Floating dust motes', 'Animate particles across the background atmosphere.', 'particles'));
    opts.appendChild(toggle('density', 'Compact spacing', 'Tighten padding throughout panels and cards.', 'density'));
    opts.appendChild(toggle('compactText', 'Smaller body text', 'Reduce the base text size for denser reading.', 'compactText'));
    opts.appendChild(toggle('motion', 'Full motion', 'Entrance animations, dashed connector flow and hover sweeps.', 'motion'));
    body.appendChild(opts);

    /* --- Reset note --- */
    body.appendChild(el('<p class="muted" style="font-size:.74rem;line-height:1.6;border-top:1px dashed var(--border-soft);padding-top:16px">Appearance settings are stored in this browser only and never affect how the six applications behave or score.</p>'));
  }

  function group(title, hint) {
    return el('<div class="opt-group"><div class="opt-title"><b>' + esc(title) + '</b><span>' + esc(hint) + '</span></div></div>');
  }

  function toggle(key, title, desc, kind) {
    var on = SK.appearance[key] === true || SK.appearance[key] === 'full' ||
             (kind === 'density' && SK.appearance.density === 'compact') ||
             (kind === 'motion' && SK.appearance.motion === 'full');
    var row = el('<div class="toggle-row"><span class="tr-txt"><b>' + esc(title) + '</b><span>' + esc(desc) + '</span></span>' +
      '<label class="switch"><input type="checkbox" ' + (on ? 'checked' : '') + '><i></i></label></div>');
    var input = row.querySelector('input');
    input.addEventListener('change', function () {
      var v = input.checked;
      if (kind === 'density') SK.appearance.density = v ? 'compact' : 'comfortable';
      else if (kind === 'motion') SK.appearance.motion = v ? 'full' : 'reduced';
      else SK.appearance[key] = v;
      SK.applyAppearance();
    });
    return row;
  }

  function openDrawer() {
    buildDrawer();
    var d = $('#drawer');
    $('#drawerScrim').hidden = false;
    d.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { d.classList.add('open'); });
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    var d = $('#drawer');
    d.classList.remove('open');
    d.setAttribute('aria-hidden', 'true');
    $('#drawerScrim').hidden = true;
    if (window.innerWidth > 860) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }

  /* ==================================================================
     Mobile navigation
     ================================================================== */
  function openMobileNav() {
    $('#sidebar').classList.add('open');
    $('#navScrim').hidden = false;
    $('#navToggle').setAttribute('aria-expanded', 'true');
  }
  function closeMobileNav() {
    $('#sidebar').classList.remove('open');
    $('#navScrim').hidden = true;
    var t = $('#navToggle');
    if (t) t.setAttribute('aria-expanded', 'false');
  }

  /* ==================================================================
     Boot
     ================================================================== */
  function boot() {
    SK.applyAppearance();
    SK.computeIndex();

    /* nav */
    $('#navToggle').addEventListener('click', function () {
      $('#sidebar').classList.contains('open') ? closeMobileNav() : openMobileNav();
    });
    $('#navScrim').addEventListener('click', closeMobileNav);
    SK.$$('.nav-item').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 860) setTimeout(closeMobileNav, 120);
      });
    });

    /* drawer */
    $('#openCustomize').addEventListener('click', openDrawer);
    $('#openCustomizeMobile').addEventListener('click', openDrawer);
    $('#closeDrawer').addEventListener('click', closeDrawer);
    $('#doneDrawer').addEventListener('click', closeDrawer);
    $('#drawerScrim').addEventListener('click', closeDrawer);
    $('#resetAppearance').addEventListener('click', function () {
      Object.keys(SK.appearanceDefaults).forEach(function (k) {
        SK.appearance[k] = SK.appearanceDefaults[k];
      });
      SK.applyAppearance();
      buildDrawer();
    });
    document.addEventListener('open-appearance', openDrawer);

    /* escape closes overlays */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if ($('#drawer').classList.contains('open')) closeDrawer();
        else closeMobileNav();
      }
    });

    /* routing */
    window.addEventListener('hashchange', function () {
      if (location.hash === '' || location.hash === '#') location.replace('#/');
      SK.navigate();
    });
    if (!location.hash || location.hash === '#') location.replace('#/');
    SK.navigate();

    /* re-apply particle field once layout settles */
    setTimeout(SK.applyAppearance, 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* expose for kit/router */
  window.closeMobileNav = closeMobileNav;
})();
