/* ==========================================================================
   home.js — landing page: concept, integration diagram, six modules
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el;

  /* ------------------------------------------------------------------
     Integration diagram
     5 cores → bus → hub (the composite skill) → practical implementation
     ------------------------------------------------------------------ */
  function diagramSVG() {
    var cores = SKILL_LIST.filter(function (s) { return s.id !== 'practical'; });
    var W = 960, H = 548;
    var nodeW = 164, nodeH = 104, y0 = 58;
    var xs = [96, 288, 480, 672, 864];

    var toneVar = function (t) { return 'var(--' + t + ')'; };
    var SHORT_ROLE = {
      critical: 'Reasoning engine', observation: 'Data collector', memory: 'Mental workbench',
      focus: 'Attention filter', social: 'Mind modelling'
    };
    /* nested <svg> needs explicit dimensions or it fills the outer viewport */
    function ico(svg, size) {
      return svg.replace('<svg ', '<svg width="48" height="48" ');
    }
    /* SVG <text> does not wrap — split long titles onto a second line */
    function titleText(x, y, label) {
      var words = label.split(' ');
      if (label.length <= 14 || words.length === 1) {
        return '<text class="dg-title" x="' + x + '" y="' + y + '">' + esc(label) + '</text>';
      }
      var mid = Math.ceil(words.length / 2);
      var l1 = words.slice(0, mid).join(' '), l2 = words.slice(mid).join(' ');
      return '<text class="dg-title" x="' + x + '" y="' + (y - 18) + '">' + esc(l1) + '</text>' +
             '<text class="dg-title" x="' + x + '" y="' + (y + 1) + '">' + esc(l2) + '</text>';
    }

    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" ' +
      'aria-label="Diagram: five core abilities feed the integrated Sherlockian Skill, which is then tested by practical implementation">';

    out += '<defs>' +
      '<linearGradient id="hubGrad" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="color-mix(in srgb, var(--gold) 22%, var(--surface-hero))"/>' +
        '<stop offset="100%" stop-color="var(--surface-solid)"/>' +
      '</linearGradient>' +
      '<linearGradient id="pracGrad" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="var(--surface-hero)"/>' +
        '<stop offset="100%" stop-color="color-mix(in srgb, var(--gold) 16%, var(--surface-solid))"/>' +
      '</linearGradient>' +
      '<filter id="hubGlow" x="-40%" y="-40%" width="180%" height="180%">' +
        '<feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
    '</defs>';

    /* --- tier label: learn --- */
    out += '<text class="dg-tier-label" x="' + (W / 2) + '" y="26" text-anchor="middle">Stage 1 · Isolate &amp; train</text>';
    out += '<path class="dg-bracket" d="M30 40h' + (W - 60) + '" stroke-dasharray="3 6" opacity=".7"/>';

    /* --- links from each node down to the bus --- */
    var busY = y0 + nodeH + 44;
    cores.forEach(function (c, i) {
      out += '<path class="dg-link" style="stroke:' + toneVar(c.tone) + ';opacity:.7" d="M' + xs[i] + ' ' + (y0 + nodeH) + ' V' + busY + '"/>';
    });
    out += '<path class="dg-bus" d="M' + xs[0] + ' ' + busY + ' H' + xs[4] + '"/>';

    /* --- bus down into hub --- */
    var hubY = busY + 34, hubH = 104, hubW = 520;
    out += '<path class="dg-bus" style="stroke:var(--gold)" d="M480 ' + busY + ' V' + hubY + '"/>';

    /* --- core nodes --- */
    cores.forEach(function (c, i) {
      var x = xs[i], left = x - nodeW / 2;
      var glow = 'color-mix(in srgb, ' + toneVar(c.tone) + ' 70%, transparent)';
      out += '<g class="dg-node" data-goto="' + c.id + '" tabindex="0" role="link" aria-label="' + esc(c.title) + '" style="--node-glow:' + glow + '">' +
        '<rect class="dg-bg" x="' + left + '" y="' + y0 + '" width="' + nodeW + '" height="' + nodeH + '" rx="16"/>' +
        '<rect x="' + left + '" y="' + y0 + '" width="4" height="' + nodeH + '" rx="2" fill="' + toneVar(c.tone) + '" opacity=".9"/>' +
        '<g transform="translate(' + (left + 14) + ',' + (y0 + 11) + ')">' +
          '<g class="dg-ico" style="color:' + toneVar(c.tone) + '">' + ico(c.icon) + '</g>' +
        '</g>' +
        '<text class="dg-num" x="' + (left + nodeW - 13) + '" y="' + (y0 + 31) + '" text-anchor="end" fill="' + toneVar(c.tone) + '">' + c.num + '</text>' +
        titleText(left + 14, y0 + 74, shortLabel(c)) +
        '<text class="dg-sub" x="' + (left + 14) + '" y="' + (y0 + nodeH - 11) + '">' + esc(SHORT_ROLE[c.id]) + '</text>' +
      '</g>';
    });

    /* --- hub --- */
    var hubLeft = 480 - hubW / 2;
    out += '<g filter="url(#hubGlow)">' +
      '<rect class="dg-hub-bg" x="' + hubLeft + '" y="' + hubY + '" width="' + hubW + '" height="' + hubH + '" rx="24"/>' +
    '</g>';
    out += '<text class="dg-tier-label" x="480" y="' + (hubY + 28) + '" text-anchor="middle" fill="var(--gold)">Stage 2 · Integrate</text>';
    out += '<text class="dg-hub-title" x="480" y="' + (hubY + 60) + '" text-anchor="middle">The Sherlockian Skill</text>';
    out += '<text class="dg-hub-sub" x="480" y="' + (hubY + 85) + '" text-anchor="middle">five abilities running as one reasoning process</text>';

    /* --- hub down to practical --- */
    var arrowTop = hubY + hubH, arrowBot = arrowTop + 54;
    out += '<path class="dg-arrow" d="M480 ' + arrowTop + ' V' + (arrowBot - 11) + '"/>';
    out += '<path class="dg-arrow" d="M471 ' + (arrowBot - 14) + ' L480 ' + arrowBot + ' L489 ' + (arrowBot - 14) + '"/>';
    out += '<text class="dg-tier-label" x="502" y="' + (arrowTop + 30) + '" fill="var(--gold)">Stage 3 · Apply &amp; evaluate</text>';

    /* --- practical node --- */
    var pw = 620, ph = 104, pl = 480 - pw / 2, py = arrowBot + 14;
    out += '<g class="dg-node" data-goto="practical" tabindex="0" role="link" aria-label="Practical Implementation" style="--node-glow:color-mix(in srgb, var(--gold) 70%, transparent)">' +
      '<rect class="dg-prac-bg" x="' + pl + '" y="' + py + '" width="' + pw + '" height="' + ph + '" rx="22"/>' +
      '<g transform="translate(' + (pl + 24) + ',' + (py + 26) + ') scale(1.05)">' +
        '<g class="dg-ico" style="color:var(--gold)">' + ico(SKILLS.practical.icon) + '</g>' +
      '</g>' +
      '<text class="dg-prac-title" x="' + (pl + 92) + '" y="' + (py + 44) + '">Practical Implementation</text>' +
      '<text class="dg-prac-sub" x="' + (pl + 92) + '" y="' + (py + 68) + '">Realistic scenarios · per-skill attribution · debrief</text>' +
      '<text class="dg-sub" x="' + (pl + 92) + '" y="' + (py + 90) + '" fill="var(--gold)">Assessment — it does not teach, it proves</text>' +
      '<rect x="' + (pl + pw - 86) + '" y="' + (py + 34) + '" width="64" height="34" rx="10" fill="color-mix(in srgb, var(--gold) 16%, transparent)" stroke="color-mix(in srgb, var(--gold) 50%, transparent)"/>' +
      '<text x="' + (pl + pw - 54) + '" y="' + (py + 56) + '" text-anchor="middle" font-family="var(--font-mono)" font-size="12" fill="var(--gold)" letter-spacing="1.5">TEST</text>' +
    '</g>';

    out += '</svg>';
    return out;
  }

  function shortLabel(c) {
    var m = {
      critical: 'Critical Thinking', observation: 'Observation', memory: 'Working Memory',
      focus: 'Deep Focus', social: 'Social Cognition', practical: 'Practical'
    };
    return m[c.id] || c.short;
  }

  /* ------------------------------------------------------------------
     Cards
     ------------------------------------------------------------------ */
  function cardHTML(s) {
    var best = SK.scoreOf(s.id);
    var sessions = (SK.state.progress[s.id] || {}).sessions || 0;
    var isPrac = s.id === 'practical';

    if (isPrac) {
      var casesDone = Object.keys(SK.state.completed).filter(function (k) { return k.indexOf('.score') === -1; }).length;
      var totalCases = (window.CASE_FILES || []).length || 4;
      return '<a class="card card--practical" href="#/practical" data-tone="' + s.tone + '" style="--tone:var(--gold)">' +
        '<span class="card-ico">' + s.icon + '</span>' +
        '<span class="prac-body">' +
          '<span class="card-role" style="color:var(--gold)">' + esc(s.num) + ' · ' + esc(s.role) + '</span>' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<p>' + esc(s.blurb) + '</p>' +
        '</span>' +
        '<span class="prac-cta">' +
          '<span class="prac-skills">' +
            ['CT', 'OB', 'WM', 'DF', 'SC'].map(function (t) { return '<span>' + t + '</span>'; }).join('') +
          '</span>' +
          '<span class="card-score">' + (best ? 'Last report <b>' + best + '</b>/100' : 'Not yet assessed') + '</span>' +
          '<span class="btn btn-gold btn-sm">Open case files <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '</span>' +
        '<span class="card-progress"><i style="width:' + Math.round((casesDone / totalCases) * 100) + '%"></i></span>' +
      '</a>';
    }

    return '<a class="card" href="#/' + s.id + '" data-tone="' + s.tone + '" style="--tone:var(--' + s.tone + ')">' +
      '<span class="card-top">' +
        '<span class="card-ico">' + s.icon + '</span>' +
        '<span class="card-num">' + esc(s.num) + '</span>' +
      '</span>' +
      '<h3>' + esc(s.short) + '</h3>' +
      '<span class="card-role">' + esc(s.role) + '</span>' +
      '<p>' + esc(s.blurb) + '</p>' +
      '<span class="card-meta">' +
        '<span class="go">Enter module <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '<span class="card-score">' + (best ? 'Best <b>' + best + '</b>' : (sessions ? 'In progress' : 'Not trained')) + '</span>' +
      '</span>' +
      '<span class="card-progress"><i style="width:' + best + '%"></i></span>' +
    '</a>';
  }

  /* ------------------------------------------------------------------
     Home route
     ------------------------------------------------------------------ */
  SK.registerRoute('home', function (view) {
    var wrap = el('<div class="wrap"></div>');

    /* ---------- Hero ---------- */
    var idx = SK.computeIndex();
    var trained = SK.CORE.filter(function (k) { return SK.state.progress[k]; }).length;
    var casesDone = Object.keys(SK.state.completed).filter(function (k) { return k.indexOf('.score') === -1; }).length;

    var hero = el(
      '<section class="hero reveal">' +
        '<span class="hero-badge"><span class="pulse"></span> Six modules · one integrated system</span>' +
        '<h1>The Sherlockian<br><em>Skill</em>' +
          '<span class="thin">Not a single ability — a composite one. Five core capacities, trained separately, integrated into one reasoning process, and proven under realistic conditions.</span>' +
        '</h1>' +
        '<div class="hero-actions">' +
          '<a class="btn btn-primary" href="#/critical">Begin training <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
          '<a class="btn btn-ghost" href="#/practical">Jump to assessment</a>' +
          '<button class="btn btn-ghost" id="heroCustomize" type="button">Customise this page</button>' +
        '</div>' +
        '<div class="hero-stats">' +
          '<div class="hero-stat"><b>' + (idx === null ? '—' : idx) + '</b><span>Sherlockian Index</span></div>' +
          '<div class="hero-stat"><b>' + trained + '<small style="font-size:.8rem;color:var(--text-muted)">/5</small></b><span>Cores trained</span></div>' +
          '<div class="hero-stat"><b>' + casesDone + '</b><span>Cases assessed</span></div>' +
          '<div class="hero-stat"><b>6</b><span>Integrated modules</span></div>' +
        '</div>' +
      '</section>'
    );
    wrap.appendChild(hero);

    /* ---------- Concept ---------- */
    var concept = el(
      '<section class="concept reveal" style="margin-top:26px">' +
        '<div class="concept-main">' +
          '<p class="eyebrow">The central concept</p>' +
          '<h2 style="font-size:clamp(1.35rem,2.6vw,1.85rem);font-weight:800;margin-top:10px;letter-spacing:-.03em">' + esc(CONCEPT.headline) + '</h2>' +
          '<blockquote class="concept-quote">' + CONCEPT.quote + '</blockquote>' +
          '<div class="concept-notes"></div>' +
        '</div>' +
        '<div class="concept-side">' +
          '<p class="eyebrow" style="margin-bottom:16px">How it is developed</p>' +
          '<div class="pipeline"></div>' +
        '</div>' +
      '</section>'
    );
    var notesHost = concept.querySelector('.concept-notes');
    CONCEPT.notes.forEach(function (n, i) {
      notesHost.appendChild(el('<div class="note-row"><span class="note-num">' + (i + 1) + '</span><span>' + n + '</span></div>'));
    });
    var pipeHost = concept.querySelector('.pipeline');
    CONCEPT.pipeline.forEach(function (p) {
      pipeHost.appendChild(el('<div class="pipe-step"><span class="pipe-dot"></span><span class="tag">' + esc(p.tag) + '</span>' +
        '<h4>' + esc(p.title) + '</h4><p>' + esc(p.body) + '</p></div>'));
    });
    wrap.appendChild(concept);

    /* ---------- Integration diagram ---------- */
    var diagSection = el(
      '<section class="reveal" style="margin-top:26px">' +
        '<div class="sec-head"><p class="eyebrow">The system, drawn</p>' +
        '<h2>Six applications, one training pipeline</h2>' +
        '<p>Five abilities are trained in isolation because they fail in isolation. They are then integrated into a single reasoning process. Practical implementation does not add a sixth ability — it measures whether the five are actually working together. Select any node to open it.</p></div>' +
        '<div class="diagram-shell"></div>' +
      '</section>'
    );
    var shell = diagSection.querySelector('.diagram-shell');
    shell.innerHTML = diagramSVG();
    SK.$$('.dg-node', shell).forEach(function (g) {
      var go = function () { location.hash = '#/' + g.getAttribute('data-goto'); };
      g.addEventListener('click', go);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      g.addEventListener('mousemove', function (e) {
        var r = shell.getBoundingClientRect();
        g.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      });
    });
    wrap.appendChild(diagSection);

    /* ---------- Modules grid ---------- */
    var gridSection = el(
      '<section class="reveal" style="margin-top:34px">' +
        '<div class="sec-head"><p class="eyebrow">The six applications</p>' +
        '<h2>Choose where to begin</h2>' +
        '<p>Each card is a complete application with its own briefing, exercises and field drills. Hover to light it up; click to enter. Progress is recorded and feeds the index in the sidebar.</p></div>' +
        '<div class="cards" id="cardsHost"></div>' +
      '</section>'
    );
    var cardsHost = gridSection.querySelector('#cardsHost');
    SKILL_LIST.forEach(function (s) { cardsHost.insertAdjacentHTML('beforeend', cardHTML(s)); });
    wrap.appendChild(gridSection);

    /* ---------- Flow strip ---------- */
    var flow = el(
      '<section class="reveal" style="margin-top:34px">' +
        '<div class="panel" style="--tone:var(--gold)">' +
          '<div class="panel-head"><div><span class="kicker">The progression</span><h2>Learn → integrate → apply</h2></div>' +
            '<a class="btn btn-ghost btn-sm" href="#/practical">See the assessment</a></div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:6px">' +
            stepCard('1', 'Learn the individual skills', 'Five modules, each isolating one capacity so its specific failure mode becomes visible and trainable.', 'amber') +
            stepCard('2', 'Integrate them', 'As the abilities improve they begin to run concurrently — observing while reasoning, holding while focusing.', 'teal') +
            stepCard('3', 'Apply under realistic conditions', 'Case files blend all five and report back per skill, showing exactly where integration succeeds or breaks.', 'gold') +
          '</div>' +
        '</div>' +
      '</section>'
    );
    wrap.appendChild(flow);

    /* ---------- Footer ---------- */
    wrap.appendChild(el(
      '<footer class="reveal" style="margin-top:40px;padding-top:24px;border-top:1px solid var(--border-soft);display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center">' +
        '<p class="mono" style="font-size:.63rem;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)">The Sherlockian Skill · Integrated Cognitive Training</p>' +
        '<p class="muted" style="font-size:.76rem;max-width:62ch">This platform reports performance on its own training tasks. It is not a clinical or standardised assessment of intelligence or cognitive function.</p>' +
      '</footer>'
    ));

    view.appendChild(wrap);

    var hc = wrap.querySelector('#heroCustomize');
    if (hc) hc.addEventListener('click', function () { document.dispatchEvent(new CustomEvent('open-appearance')); });
  });

  function stepCard(n, title, body, tone) {
    return '<div class="stat-card" style="--tone:var(--' + tone + ');border-color:color-mix(in srgb,var(--' + tone + ') 32%,transparent)">' +
      '<span class="lbl" style="color:var(--' + tone + ')">Stage ' + n + '</span>' +
      '<div class="val" style="font-size:1.02rem;line-height:1.35">' + esc(title) + '</div>' +
      '<p class="hint" style="font-size:.8rem;line-height:1.62;margin-top:8px">' + esc(body) + '</p></div>';
  }
})();
