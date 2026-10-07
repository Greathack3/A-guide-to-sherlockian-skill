/* ==========================================================================
   apps/kit.js — shared exercise engine used by every module
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el;

  /* ---------------------------------------------------------------------
     Tabs
     --------------------------------------------------------------------- */
  function tabs(host, defs, initial) {
    var bar = el('<div class="tabs" role="tablist"></div>');
    var body = el('<div class="tab-body"></div>');
    host.appendChild(bar); host.appendChild(body);

    var buttons = defs.map(function (d, i) {
      var b = el('<button class="tab" role="tab" type="button">' + esc(d.label) + '</button>');
      b.addEventListener('click', function () { activate(i); });
      bar.appendChild(b);
      return b;
    });

    var active = -1;
    function activate(i) {
      if (i === active) return;
      active = i;
      buttons.forEach(function (b, j) {
        b.classList.toggle('is-active', j === i);
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
      body.innerHTML = '';
      defs[i].render(body);
    }
    activate(initial || 0);
    return { activate: activate, body: body };
  }

  /* ---------------------------------------------------------------------
     Generic multiple-choice quiz runner
     items: { prompt, sub?, choices[], answer, explain, tag? }
     --------------------------------------------------------------------- */
  function quiz(host, opts) {
    var items = opts.items;
    var tone = opts.tone || 'gold';
    var i = 0, correct = 0;
    var results = items.map(function () { return null; });

    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>' + esc(opts.label || 'Exercise') + '</span>' +
          '<span class="lvl" data-lvl>—</span></div>' +
        '<div class="prog" style="margin-bottom:14px"></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);

    var lvlEl = stage.querySelector('[data-lvl]');
    var progEl = stage.querySelector('.prog');
    var bodyEl = stage.querySelector('.body');

    function renderProg() {
      progEl.innerHTML = SK.dotsHTML(results, i < items.length ? i : -1);
    }

    function render() {
      if (i >= items.length) return finish();
      var it = items[i];
      lvlEl.textContent = 'Item ' + (i + 1) + ' / ' + items.length;
      renderProg();

      var wrapEl = el('<div class="pop"></div>');
      if (it.tag) wrapEl.appendChild(el('<p class="eyebrow" style="margin-bottom:9px">' + esc(it.tag) + '</p>'));
      wrapEl.appendChild(el('<p class="prompt">' + it.prompt + '</p>'));
      if (it.sub) wrapEl.appendChild(el('<p class="lede" style="margin-top:9px;font-size:.87rem;color:var(--text-muted)">' + it.sub + '</p>'));

      var list = el('<div class="choices' + (it.cols ? ' cols-2' : '') + '"></div>');
      it.choices.forEach(function (c, ci) {
        var b = el('<button class="choice" type="button"><span class="key">' + String.fromCharCode(65 + ci) + '</span><span>' + esc(c) + '</span></button>');
        b.addEventListener('click', function () { answer(ci, b, list, wrapEl); });
        list.appendChild(b);
      });
      wrapEl.appendChild(list);
      bodyEl.innerHTML = '';
      bodyEl.appendChild(wrapEl);
    }

    function answer(ci, btn, list, wrapEl) {
      var it = items[i];
      var ok = ci === it.answer;
      if (ok) correct++;
      results[i] = ok;

      SK.$$('.choice', list).forEach(function (b, bi) {
        b.disabled = true;
        if (bi === it.answer) b.classList.add('correct');
        else if (bi === ci) b.classList.add('wrong');
        else b.classList.add('dim');
      });

      var fb = el(
        '<div class="feedback ' + (ok ? 'good' : 'bad') + '">' +
          '<span class="fb-title">' + (ok ? 'Correct' : 'Not quite') + '</span>' +
          '<b>' + esc(it.choices[it.answer]) + '</b> — ' + it.explain +
        '</div>'
      );
      wrapEl.appendChild(fb);

      var last = i >= items.length - 1;
      var actions = el('<div class="stage-actions"></div>');
      var next = el('<button class="btn btn-primary" type="button">' + (last ? 'See results' : 'Next item') + ' →</button>');
      next.addEventListener('click', function () { i++; renderProg(); render(); });
      actions.appendChild(next);
      if (it.hint) {
        var h = el('<button class="btn btn-ghost btn-sm" type="button">Show reasoning</button>');
        h.addEventListener('click', function () {
          fb.insertAdjacentHTML('beforeend', '<p style="margin-top:9px;color:var(--text-secondary)">' + it.hint + '</p>');
          h.disabled = true;
        });
        actions.appendChild(h);
      }
      wrapEl.appendChild(actions);
      renderProg();
    }

    function finish() {
      var score = SK.pct(correct, items.length);
      bodyEl.innerHTML = '';
      bodyEl.appendChild(resultBlock({
        score: score, correct: correct, total: items.length, tone: tone,
        title: opts.doneTitle || 'Session complete',
        blurb: opts.doneBlurb ? opts.doneBlurb(score) : defaultBlurb(score),
        onRetry: function () {
          i = 0; correct = 0; results = items.map(function () { return null; }); render();
        }
      }));
      progEl.innerHTML = SK.dotsHTML(results, -1);
      lvlEl.textContent = 'Complete';
      if (opts.onScore) opts.onScore(score, correct, items.length);
    }

    render();
    return { restart: function () { i = 0; correct = 0; results = items.map(function () { return null; }); render(); } };
  }

  function defaultBlurb(score) {
    if (score >= 90) return 'Excellent calibration. Your reads are precise and your reasoning held under pressure — this ability is in strong shape.';
    if (score >= 70) return 'Solid work. The core ability is functioning well; the misses point at a specific edge worth drilling again.';
    if (score >= 45) return 'A workable base, but the signal is still noisy. Run the drill again with deliberate speed reduction and watch the pattern of errors.';
    return 'This ability is currently a weak point in the composite skill. Slow down, read each item twice, and rebuild from the fundamentals in the briefing tab.';
  }

  function resultBlock(o) {
    var b = el(
      '<div class="result">' +
        SK.ring(o.score, o.tone) +
        '<h3>' + esc(o.title) + '</h3>' +
        '<p>' + esc(o.blurb) + '</p>' +
        '<p class="mono" style="font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted);margin-top:12px">' +
          o.correct + ' of ' + o.total + ' correct</p>' +
        '<div class="result-actions"></div>' +
      '</div>'
    );
    var actions = b.querySelector('.result-actions');
    var retry = el('<button class="btn btn-primary" type="button">Run it again</button>');
    retry.addEventListener('click', o.onRetry);
    actions.appendChild(retry);
    if (o.extraActions) o.extraActions.forEach(function (a) { actions.appendChild(a); });
    return b;
  }

  /* ---------------------------------------------------------------------
     Briefing renderer (explanation tab shared shape)
     --------------------------------------------------------------------- */
  function briefing(host, skill, blocks) {
    var wrap = el('<div class="app-main"></div>');

    blocks.forEach(function (b) {
      if (b.type === 'prose') {
        var p = el('<div class="panel"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px">' + esc(b.kicker) + '</span><h2 style="font-size:1.12rem;font-weight:800;margin-bottom:12px">' + esc(b.title) + '</h2></div>');
        b.paras.forEach(function (t) { p.appendChild(el('<p>' + t + '</p>')); });
        wrap.appendChild(p);
      }
      if (b.type === 'list') {
        var l = el('<div class="panel"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px">' + esc(b.kicker) + '</span><h2 style="font-size:1.12rem;font-weight:800;margin-bottom:14px">' + esc(b.title) + '</h2><div class="' + (b.grid ? 'choices cols-2' : 'concept-notes') + '"></div></div>');
        var host2 = l.lastElementChild;
        b.items.forEach(function (t, idx) {
          if (b.grid) host2.appendChild(el('<div class="choice" style="cursor:default;align-items:flex-start"><span class="key">' + (idx + 1) + '</span><span>' + t + '</span></div>'));
          else host2.appendChild(el('<div class="note-row"><span class="note-num">' + (idx + 1) + '</span><span>' + t + '</span></div>'));
        });
        wrap.appendChild(l);
      }
      if (b.type === 'callout') {
        wrap.appendChild(el('<div class="feedback ' + (b.tone || 'good') + '"><span class="fb-title">' + esc(b.kicker) + '</span>' + b.body + '</div>'));
      }
      if (b.type === 'chips') {
        wrap.appendChild(el('<div class="panel"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:10px">' + esc(b.kicker) + '</span><div class="chips">' +
          b.items.map(function (t) { return '<span class="chip on">' + esc(t) + '</span>'; }).join('') + '</div></div>'));
      }
    });

    host.appendChild(wrap);
  }

  /* ---------------------------------------------------------------------
     Rail: score card + module links
     --------------------------------------------------------------------- */
  function rail(host, skillId, extras) {
    var s = SKILLS[skillId];
    var r = el('<div class="app-rail"></div>');
    r.appendChild(el(SK.progressBar(SK.state.progress[skillId])));

    var others = SKILL_LIST.filter(function (x) { return x.id !== skillId; });
    var linkPanel = el('<div class="panel" ' + SK.toneVars(s.tone) + '><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:12px">Rest of the system</span><div class="chips" id="railLinks"></div></div>');
    var chips = linkPanel.querySelector('#railLinks');
    others.forEach(function (o) {
      var c = el('<a class="chip" href="#/' + o.id + '" style="cursor:pointer">' + esc(o.short) + '</a>');
      c.addEventListener('mouseenter', function () { c.classList.add('on'); c.style.setProperty('--tone', 'var(--' + o.tone + ')'); });
      c.addEventListener('mouseleave', function () { c.classList.remove('on'); });
      chips.appendChild(c);
    });
    r.appendChild(linkPanel);

    (extras || []).forEach(function (x) { r.appendChild(x); });
    host.appendChild(r);
    return r;
  }

  window.SKKit = {
    tabs: tabs, quiz: quiz, briefing: briefing, rail: rail,
    resultBlock: resultBlock, defaultBlurb: defaultBlurb
  };
})();
