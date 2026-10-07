/* ==========================================================================
   apps/memory.js — Working Memory Skills
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el;

  /* ==================================================================
     A — Digit / letter span (forward recall, adaptive difficulty)
     ================================================================== */
  function spanRun(host, tone) {
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Sequence recall</span><span class="lvl" data-lvl>Length 3</span></div>' +
        '<div class="prog" style="margin-bottom:14px"></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var prog = stage.querySelector('.prog');
    var body = stage.querySelector('.body');

    var len = 3, streak = 0, attempts = 0, best = 0, results = [], timer = null;
    var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
    var seq = [];

    function next() {
      clearInterval(timer);
      seq = [];
      var pool = SK.shuffle('23456789ABCDEFGHJKLMNPQRSTUVWXYZ'.split(''));
      for (var i = 0; i < len; i++) seq.push(pool[i]);
      showSequence();
    }

    function showSequence() {
      lvl.textContent = 'Length ' + len + ' — memorise';
      prog.innerHTML = SK.dotsHTML(results, -1);
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt-sm" style="text-align:center">Memorise the sequence — then reproduce it in order.</p>' +
        '<div class="seq-grid" data-g style="margin-top:20px"></div>' +
        '<div class="stage-actions" style="justify-content:center"><button class="btn btn-primary" data-go type="button">I have it</button></div></div>');
      body.appendChild(w);

      /* light each cell in turn */
      var grid = w.querySelector('[data-g]');
      seq.forEach(function () { grid.appendChild(el('<div class="seq-cell"><span class="dot"></span></div>')); });
      var cells = SK.$$('.seq-cell', grid);
      var i = 0;
      var step = Math.max(360, 760 - len * 40);
      timer = setInterval(function () {
        if (i > 0) cells[i - 1].classList.remove('lit');
        if (i >= seq.length) { clearInterval(timer); return; }
        cells[i].classList.add('lit');
        cells[i].textContent = seq[i];
        i++;
      }, step);

      w.querySelector('[data-go]').addEventListener('click', function () {
        clearInterval(timer);
        askInput();
      });
    }

    function askInput() {
      lvl.textContent = 'Length ' + len + ' — your turn';
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt-sm" style="text-align:center">Type the sequence, then press Enter.</p>' +
        '<div class="seq-grid" data-g style="margin-top:20px"></div>' +
        '<div style="max-width:320px;margin:16px auto 0"><input data-in maxlength="' + len + '" autocomplete="off" spellcheck="false" ' +
        'placeholder="' + seq.map(function () { return '_'; }).join(' ') + '" ' +
        'style="width:100%;padding:14px 16px;text-align:center;letter-spacing:.5em;text-transform:uppercase;font-family:var(--font-mono);font-size:1.3rem;border-radius:13px;border:1px solid var(--border-soft);background:color-mix(in srgb, var(--bg-base) 45%, transparent);color:var(--text-primary);outline:none"/></div>' +
        '<div class="stage-actions" style="justify-content:center"><button class="btn btn-primary" data-sub type="button">Submit</button></div>' +
        '<div data-fb></div></div>');
      body.appendChild(w);

      var grid = w.querySelector('[data-g]');
      for (var i = 0; i < len; i++) grid.appendChild(el('<div class="seq-cell muted"><span class="dot"></span></div>'));
      var cells = SK.$$('.seq-cell', grid);
      var input = w.querySelector('[data-in]');
      setTimeout(function () { input.focus(); }, 60);
      input.addEventListener('input', function () {
        var v = input.value.toUpperCase();
        for (var i = 0; i < cells.length; i++) {
          cells[i].querySelector('.dot').style.opacity = v[i] ? '1' : '.25';
        }
      });

      function submit() {
        var val = input.value.toUpperCase().trim();
        if (val.length < 1) return;
        input.disabled = true;
        var ok = val === seq.join('');
        attempts++;
        if (ok) { streak++; best = Math.max(best, len); results.push(true); }
        else { streak = 0; results.push(false); }
        prog.innerHTML = SK.dotsHTML(results, results.length - 1);

        cells.forEach(function (c, i) {
          c.classList.remove('muted');
          c.textContent = seq[i];
          if (val[i] === seq[i]) c.style.color = 'var(--teal)';
          else c.style.color = 'var(--rose)';
        });

        var fb = el('<div class="feedback ' + (ok ? 'good' : 'bad') + '"><span class="fb-title">' +
          (ok ? 'Held — length ' + len : 'Dropped at length ' + len) + '</span>' +
          (ok ? 'Correct sequence: <b>' + seq.join(' ') + '</b>. Streak ' + streak + ' — the span increases.'
              : 'The sequence was <b>' + seq.join(' ') + '</b>. ' + (len > 3 ? 'Stepping back to length ' + (len - 1) + '.' : 'Holding at length 3.') + '</div>'));
        w.querySelector('[data-fb]').appendChild(fb);

        if (ok) len++;
        else len = Math.max(3, len - 1);

        w.querySelector('[data-sub]').remove();
        var nb = el('<button class="btn btn-primary" type="button">Next round →</button>');
        nb.addEventListener('click', function () {
          if (attempts >= 7) return finish();
          next();
        });
        w.querySelector('.stage-actions').appendChild(nb);
        if (attempts >= 7) nb.textContent = 'See results →';
      }
      w.querySelector('[data-sub]').addEventListener('click', submit);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    }

    function finish() {
      clearInterval(timer);
      var score = SK.clamp(Math.round(((best - 2) / 6) * 100), 10, 100);
      lvl.textContent = 'Complete';
      prog.innerHTML = SK.dotsHTML(results, -1);
      body.innerHTML = '';
      body.appendChild(SKKit.resultBlock({
        score: score, correct: best, total: best + 2, tone: tone,
        title: 'Span length ' + best,
        blurb: best >= 8 ? 'An exceptional span. Most adults hold six to seven items; you are carrying well beyond that without rehearsal tricks.'
          : best >= 6 ? 'A solid, typical span — six to seven items. The next gain comes from chunking rather than raw capacity.'
          : best >= 4 ? 'A working span in the normal range. Chunking (grouping items into units) will raise this faster than trying harder.'
          : 'Span is currently short, which limits how much of a problem you can hold live. Train daily in short bursts — five rounds, never until frustrated.',
        onRetry: function () { len = 3; streak = 0; attempts = 0; best = 0; results = []; next(); }
      }));
      SK.record('memory', score, { correct: best, attempts: attempts });
    }

    var w0 = el('<div class="pop"><p class="prompt">Six rounds of adaptive sequence recall. The length rises when you succeed and falls when you fail.</p>' +
      '<p class="lede" style="margin-top:9px;color:var(--text-muted);font-size:.88rem">Try to hold the whole string as <b>chunks</b> rather than separate characters — that is the strategy the capacity is really testing.</p>' +
      '<div class="stage-actions"><button class="btn btn-primary" data-go type="button">Begin →</button></div></div>');
    body.appendChild(w0);
    w0.querySelector('[data-go]').addEventListener('click', function () { attempts = 0; next(); });
  }

  /* ==================================================================
     B — Spatial span (positions on a 3x3 pad)
     ================================================================== */
  function spatialRun(host, tone) {
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Spatial span</span><span class="lvl" data-lvl>Length 3</span></div>' +
        '<div class="prog" style="margin-bottom:14px"></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var prog = stage.querySelector('.prog');
    var body = stage.querySelector('.body');

    var len = 3, attempts = 0, best = 0, results = [], pad = [], timer = null;

    function build(w, interactive) {
      var g = el('<div class="pad-grid" data-p></div>');
      for (var i = 0; i < 9; i++) {
        var b = el('<button class="pad" type="button" aria-label="Cell ' + (i + 1) + '"></button>');
        b.dataset.i = i;
        g.appendChild(b);
      }
      w.appendChild(g);
      return g;
    }

    function show() {
      clearInterval(timer);
      lvl.textContent = 'Length ' + len + ' — watch';
      prog.innerHTML = SK.dotsHTML(results, -1);
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt-sm" style="text-align:center">Memorise the ORDER of the highlights.</p></div>');
      body.appendChild(w);
      var g = build(w);
      var pads = SK.$$('.pad', g);
      pad = SK.sample([0,1,2,3,4,5,6,7,8], len);
      var i = 0;
      var step = Math.max(400, 780 - len * 40);
      timer = setInterval(function () {
        pads.forEach(function (p) { p.classList.remove('lit'); });
        if (i >= pad.length) {
          clearInterval(timer);
          setTimeout(recall, 320);
          return;
        }
        pads[pad[i]].classList.add('lit');
        i++;
      }, step);

      var go = el('<div class="stage-actions" style="justify-content:center;margin-top:18px"><button class="btn btn-primary" data-go type="button">Skip to recall</button></div>');
      w.appendChild(go);
      go.querySelector('[data-go]').addEventListener('click', function () {
        clearInterval(timer);
        recall();
      });
    }

    function recall() {
      lvl.textContent = 'Length ' + len + ' — repeat in order';
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt-sm" style="text-align:center">Click the cells <b>in the order they lit up</b>.</p></div>');
      body.appendChild(w);
      var g = build(w);
      var pads = SK.$$('.pad', g);
      var chosen = [];
      g.addEventListener('click', function (e) {
        var p = e.target.closest('.pad');
        if (!p || chosen.length >= len) return;
        var idx = parseInt(p.dataset.i, 10);
        if (chosen.indexOf(idx) !== -1) return;
        chosen.push(idx);
        p.classList.add('mine');
        if (chosen.length === len) evaluate(chosen, pads, w);
      });
      var cancel = el('<div class="stage-actions" style="justify-content:center;margin-top:16px"><button class="btn btn-ghost btn-sm" data-r type="button">Clear</button></div>');
      w.appendChild(cancel);
      cancel.querySelector('[data-r]').addEventListener('click', function () { chosen = []; pads.forEach(function (p) { p.classList.remove('mine'); }); });
    }

    function evaluate(chosen, pads, w) {
      attempts++;
      var ok = chosen.every(function (v, i) { return v === pad[i]; });
      if (ok) { best = Math.max(best, len); results.push(true); len++; }
      else { results.push(false); len = Math.max(3, len - 1); }
      prog.innerHTML = SK.dotsHTML(results, results.length - 1);

      pads.forEach(function (p, i) {
        p.classList.remove('mine');
        if (pad[i] === chosen[i]) p.classList.add('good');
        else if (i < chosen.length) p.classList.add('bad');
        else p.classList.add('lit');
      });

      var fb = el('<div class="feedback ' + (ok ? 'good' : 'bad') + '"><span class="fb-title">' +
        (ok ? 'Correct order' : 'Order broken') + '</span>' +
        'The sequence was <b>' + pad.map(function (n) { return n + 1; }).join(' → ') + '</b>. ' +
        (attempts >= 6 ? 'Round ' + attempts + ' of 6 complete.' : 'Round ' + attempts + ' of 6.') + '</div>');
      w.appendChild(fb);
      var nb = el('<button class="btn btn-primary" type="button">' + (attempts >= 6 ? 'See results →' : 'Next round →') + '</button>');
      nb.addEventListener('click', function () { attempts >= 6 ? finish() : show(); });
      w.appendChild(el('<div class="stage-actions"></div>')).appendChild(nb);
    }

    function finish() {
      clearInterval(timer);
      var score = SK.clamp(Math.round(((best - 2) / 6) * 100), 10, 100);
      lvl.textContent = 'Complete';
      prog.innerHTML = SK.dotsHTML(results, -1);
      body.innerHTML = '';
      body.appendChild(SKKit.resultBlock({
        score: score, correct: best, total: best + 2, tone: tone,
        title: 'Spatial span ' + best,
        blurb: best >= 8 ? 'Excellent visuospatial span — you are holding long ordered spatial sequences reliably.'
          : best >= 6 ? 'A good spatial span. Position memory responds well to chunking the grid into regions (corners, edges, centre).'
          : 'Spatial span is a distinct channel from verbal span — train it separately; gains in one do not transfer much to the other.',
        onRetry: function () { len = 3; attempts = 0; best = 0; results = []; show(); }
      }));
      SK.record('memory', Math.max(score, 0), { correct: best, attempts: attempts });
    }

    var w0 = el('<div class="pop"><p class="prompt">Six rounds of positional recall on a 3×3 pad.</p>' +
      '<p class="lede" style="margin-top:9px;color:var(--text-muted);font-size:.88rem">Verbal and spatial working memory are <b>separately bottlenecked</b>. This drill targets the visuospatial sketchpad specifically.</p>' +
      '<div class="stage-actions"><button class="btn btn-primary" data-go type="button">Begin →</button></div></div>');
    body.appendChild(w0);
    w0.querySelector('[data-go]').addEventListener('click', function () { attempts = 0; show(); });
  }

  /* ==================================================================
     C — Dual task (hold a list while doing arithmetic)
     ================================================================== */
  function dualRun(host, tone) {
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Dual task</span><span class="lvl" data-lvl>Hold &amp; compute</span></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var body = stage.querySelector('.body');

    var LETTERS = ['Q', 'F', 'K', 'R', 'M', 'T', 'Z', 'W', 'B', 'V'];
    var round = 0, memScore = 0, mathScore = 0, total = 4;

    function start() {
      round = 0; memScore = 0; mathScore = 0;
      memRound();
    }

    function memRound() {
      if (round >= total) return finish();
      lvl.textContent = 'Round ' + (round + 1) + ' / ' + total + ' — memorise';
      var set = SK.sample(LETTERS, 5);
      var correctSet = set.slice();
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt-sm" style="text-align:center">Hold these five letters in mind. Keep them there while you compute.</p>' +
        '<div class="seq-grid" style="margin-top:18px">' +
          set.map(function (c) { return '<div class="seq-cell">' + c + '</div>'; }).join('') +
        '</div>' +
        '<div class="stage-actions" style="justify-content:center"><button class="btn btn-primary" data-go type="button">Ready — compute →</button></div></div>');
      body.appendChild(w);
      w.querySelector('[data-go]').addEventListener('click', function () { mathRound(set, correctSet, 0, []); });
    }

    function mathRound(set, correctSet, q, answered) {
      if (q >= 4) return collect(set, correctSet, answered);
      lvl.textContent = 'Round ' + (round + 1) + ' — compute ' + (q + 1) + '/4';
      var a = 3 + Math.floor(Math.random() * 40), b = 3 + Math.floor(Math.random() * 40);
      var isAdd = Math.random() > 0.5;
      var answer = isAdd ? a + b : Math.max(a, b) - Math.min(a, b);
      var shown = isAdd ? a + ' + ' + b : Math.max(a, b) + ' − ' + Math.min(a, b);

      var opts = SK.shuffle([answer, answer + 2, answer - 3, answer + 7, answer - 5].filter(function (v, i, arr) { return arr.indexOf(v) === i && v >= 0; }).slice(0, 4));
      if (opts.indexOf(answer) === -1) opts[0] = answer;
      opts = SK.shuffle(opts);

      body.innerHTML = '';
      var w = el('<div class="pop"><div class="stroop-sub" style="text-align:center">Do not release the letters</div>' +
        '<div class="stroop-wrap"><div class="stroop-word" style="color:var(--text-primary)">' + shown + ' = ?</div></div>' +
        '<div class="choices cols-2" style="max-width:460px;margin-inline:auto"></div></div>');
      body.appendChild(w);
      var ch = w.querySelector('.choices');
      opts.forEach(function (o) {
        var b = el('<button class="choice" type="button"><span class="key">' + (o === answer ? '=' : '·') + '</span><span>' + o + '</span></button>');
        b.addEventListener('click', function () {
          if (o === answer) mathScore++;
          answered.push(o === answer);
          SK.$$('.choice', ch).forEach(function (x) { x.disabled = true; });
          b.classList.add(o === answer ? 'correct' : 'wrong');
          setTimeout(function () { mathRound(set, correctSet, q + 1, answered); }, 380);
        });
        ch.appendChild(b);
      });
    }

    function collect(set, correctSet, answered) {
      lvl.textContent = 'Round ' + (round + 1) + ' — recall the letters';
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt-sm" style="text-align:center">Now type the five letters you were holding, in any order, separated by spaces.</p>' +
        '<div style="max-width:340px;margin:16px auto 0"><input data-in autocomplete="off" spellcheck="false" placeholder="X X X X X" ' +
        'style="width:100%;padding:14px 16px;text-align:center;letter-spacing:.4em;text-transform:uppercase;font-family:var(--font-mono);font-size:1.15rem;border-radius:13px;border:1px solid var(--border-soft);background:color-mix(in srgb, var(--bg-base) 45%, transparent);color:var(--text-primary);outline:none"/></div>' +
        '<div class="stage-actions" style="justify-content:center"><button class="btn btn-primary" data-sub type="button">Submit</button></div>' +
        '<div data-fb></div></div>');
      body.appendChild(w);
      var input = w.querySelector('[data-in]');
      setTimeout(function () { input.focus(); }, 60);

      function submit() {
        var typed = input.value.toUpperCase().split(/[\s,]+/).filter(Boolean);
        input.disabled = true;
        var hits = correctSet.filter(function (c) { return typed.indexOf(c) !== -1; }).length;
        memScore += hits;
        w.querySelector('[data-fb]').innerHTML =
          '<div class="feedback ' + (hits === 5 ? 'good' : 'bad') + '"><span class="fb-title">Held ' + hits + ' of 5</span>' +
          'The set was <b>' + correctSet.join(' ') + '</b>. This round\'s arithmetic accuracy: <b>' +
          answered.filter(Boolean).length + ' / 4</b>.</div>';
        w.querySelector('[data-sub]').remove();
        round++;
        var nb = el('<button class="btn btn-primary" type="button">' + (round >= total ? 'See results →' : 'Next round →') + '</button>');
        nb.addEventListener('click', function () { round >= total ? finish() : memRound(); });
        w.querySelector('.stage-actions').appendChild(nb);
      }
      w.querySelector('[data-sub]').addEventListener('click', submit);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    }

    function finish() {
      var memPct = SK.pct(memScore, total * 5);
      var mathPct = SK.pct(mathScore, total * 4);
      /* composite rewards doing BOTH well — the actual dual-task cost */
      var score = Math.round(memPct * 0.55 + mathPct * 0.45 - Math.abs(memPct - mathPct) * 0.18);
      score = SK.clamp(score, 0, 100);
      lvl.textContent = 'Complete';
      body.innerHTML = '';
      body.appendChild(SKKit.resultBlock({
        score: score, correct: memScore, total: total * 5, tone: tone,
        title: 'Under load, ' + memPct + '% held / ' + mathPct + '% computed',
        blurb: memPct >= 80 && mathPct >= 75
          ? 'You maintained both channels at once — this is the signature of a large, stable working memory.'
          : memPct >= 80
            ? 'Memory survived but computation slipped (or vice versa) — you are showing the classic dual-task cost. Train by deliberately protecting the weaker channel.'
            : 'The list degraded once arithmetic began. The fix is not more effort but better structure: rehearse the letters in a whisper-level loop between calculations.',
        onRetry: start
      }));
      SK.record('memory', score, { correct: memScore, attempts: total * 5 });
    }

    var w0 = el('<div class="pop"><p class="prompt">Hold five letters while you answer four arithmetic questions — then recall the letters.</p>' +
      '<p class="lede" style="margin-top:9px;color:var(--text-muted);font-size:.88rem">Working memory is not storage. It is <b>keeping information live while operating on something else</b> — which is exactly what this forces.</p>' +
      '<div class="stage-actions"><button class="btn btn-primary" data-go type="button">Begin →</button></div></div>');
    body.appendChild(w0);
    w0.querySelector('[data-go]').addEventListener('click', start);
  }

  /* ==================================================================
     Route
     ================================================================== */
  SK.registerRoute('memory', function (view) {
    var s = SKILLS.memory;
    view.appendChild(el(SK.appHead(s)));

    var wrap = el('<div class="wrap" style="padding-top:0"></div>');
    var layout = el('<div class="app-layout"></div>');
    var main = el('<div class="app-main"></div>');
    layout.appendChild(main);
    wrap.appendChild(layout);
    view.appendChild(wrap);

    SKKit.tabs(main, [
      {
        label: 'Briefing',
        render: function (host) {
          SKKit.briefing(host, s, [
            { type: 'prose', kicker: 'What it is', title: 'The workbench, not the filing cabinet', paras: [
              'Working memory is the ability to <b>keep information active and manipulate it at the same time</b>. It is the mental surface on which a calculation, a sentence being parsed, or an argument being weighed actually happens.',
              'Its capacity is famously small — around seven items, often quoted as four plus or minus one. Everything that makes reasoning easier works by reducing what must be held: chunking, externalising, and structuring.'
            ]},
            { type: 'list', kicker: 'The four strategies', title: 'How to expand an effective span', items: [
              '<b>Chunk.</b> "R T W B V" is five items; grouped into two meaningless clusters it is functionally fewer — but only if the clusters mean something to you.',
              '<b>Rehearse silently.</b> A quiet loop prevents decay. Anything that interrupts the loop costs you the tail of the sequence.',
              '<b>Externalise.</b> Anything written down leaves the bottleneck entirely. Never spend working memory on what a note can hold.',
              '<b>Structure the load.</b> Handle one variable at a time in a fixed order rather than juggling all of them at once.'
            ]},
            { type: 'list', kicker: 'Failure signatures', title: 'How overload shows up', grid: true, items: [
              'Losing the beginning of a list while handling the end.',
              'Forgetting why you opened the drawer mid-task.',
              'Re-reading the same paragraph four times without retention.',
              'Making an error on step four of a six-step calculation.',
              'Losing your train of thought when interrupted.',
              'Holding a plan in mind and dropping it under time pressure.'
            ]},
            { type: 'callout', kicker: 'The Sherlockian test', tone: 'good', body:
              'Hold five letters in mind, answer four arithmetic questions, then recall the letters. If you can keep <b>both</b> above 80%, your workbench is carrying a realistic investigative load. Most people lose 20–30% of the list the moment computation begins.'
            },
            { type: 'chips', kicker: 'What this module trains', items: s.trains }
          ]);
        }
      },
      { label: 'Sequence Span', render: function (host) { spanRun(host, 'violet'); } },
      { label: 'Spatial Span', render: function (host) { spatialRun(host, 'violet'); } },
      { label: 'Dual Task', render: function (host) { dualRun(host, 'violet'); } },
      {
        label: 'Field Drills',
        render: function (host) {
          var p = el('<div class="panel"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px">Unaided practice</span><h2 style="font-size:1.12rem;font-weight:800;margin-bottom:6px">Working-memory drills for daily use</h2><p class="muted" style="font-size:.86rem;margin-bottom:18px">The goal is a larger effective span under real interference, not a higher score on a clean test.</p><div class="concept-notes"></div></div>');
          var h = p.querySelector('.concept-notes');
          [
            { t: 'Shopping Without the List', d: 'On short trips, buy from memory alone. Group items into categories (produce, dairy, household) — chunking, not effort, is what makes it work.' },
            { t: 'Mental Reordering', d: 'Hold a phone number, then recite it backwards, then sort its digits ascending. Manipulation under load is the actual skill.' },
            { t: 'The Two-Track Conversation', d: 'Follow one conversation while another occurs nearby. Track both. Then summarise each. This is the dual task in natural form.' },
            { t: 'Serial Recalculation', d: 'Add a running total in your head while someone reads names aloud. Note exactly which step the interference breaks.' },
            { t: 'Delayed Instruction Test', d: 'Hear a four-step instruction, wait thirty seconds of unrelated talk, then execute it. Note where in the chain you fail.' }
          ].forEach(function (d, i) {
            h.appendChild(el('<div class="note-row"><span class="note-num">' + (i + 1) + '</span><span><b style="color:var(--text-primary)">' + esc(d.t) + '</b><br>' + esc(d.d) + '</span></div>'));
          });
          host.appendChild(p);
        }
      }
    ], 0);

    SKKit.rail(layout, 'memory');
  });
})();
