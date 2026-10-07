/* ==========================================================================
   apps/focus.js — Deep Focus (Selective Attention)
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el;

  var INKS = [
    { id: 'red',   label: 'Red',   hex: '#E05B4B' },
    { id: 'blue',  label: 'Blue',  hex: '#5B9BE0' },
    { id: 'green', label: 'Green', hex: '#5BC07A' },
    { id: 'amber', label: 'Amber', hex: '#E8A33D' }
  ];

  /* ==================================================================
     A — Stroop: name the INK, not the word
     ================================================================== */
  function stroopRun(host, tone) {
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Interference control</span><span class="lvl" data-lvl>20 trials</span></div>' +
        '<div class="prog" style="margin-bottom:14px"></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var prog = stage.querySelector('.prog');
    var body = stage.querySelector('.body');

    var N = 20, i = 0, correct = 0, times = [], results = [], t0 = 0, busy = false;

    function intro() {
      lvl.textContent = '20 trials';
      prog.innerHTML = '';
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt">Name the <b>colour the word is printed in</b> — not what it says.</p>' +
        '<p class="lede" style="margin-top:10px;color:var(--text-muted);font-size:.88rem">When the word and the ink disagree, your reading system pre-activates the wrong answer. This task measures how well you suppress that automatic response — pure selective attention.</p>' +
        '<div class="stage-actions"><button class="btn btn-primary" data-go type="button">Begin →</button></div></div>');
      body.appendChild(w);
      w.querySelector('[data-go]').addEventListener('click', function () { i = 0; correct = 0; times = []; results = []; trial(); });
    }

    function trial() {
      if (i >= N) return finish();
      lvl.textContent = 'Trial ' + (i + 1) + ' / ' + N;
      prog.innerHTML = SK.dotsHTML(results, i);
      busy = false;

      var word = SK.pick(INKS), ink = SK.pick(INKS);
      /* ensure at least some congruent and incongruent mix */
      if (i % 4 === 3) ink = word;

      body.innerHTML = '';
      var w = el('<div class="pop"><div class="stroop-sub">Which colour is the ink?</div>' +
        '<div class="stroop-wrap"><div class="stroop-word" style="color:' + ink.hex + '">' + word.label.toUpperCase() + '</div></div>' +
        '<div class="stroop-btns"></div>' +
        '<p class="mono" style="text-align:center;font-size:.62rem;letter-spacing:.16em;color:var(--text-muted);margin-top:14px">PRESS 1–4 OR CLICK</p></div>');
      body.appendChild(w);
      t0 = performance.now();

      var wrapBtns = w.querySelector('.stroop-btns');
      INKS.forEach(function (k, ki) {
        var b = el('<button class="stroop-btn" type="button" style="color:' + k.hex + '">' + k.label + '</button>');
        b.addEventListener('click', function () { answer(ki); });
        wrapBtns.appendChild(b);
      });

      function answer(ki) {
        if (busy) return;
        busy = true;
        var dt = Math.round(performance.now() - t0);
        var ok = INKS[ki].id === ink.id;
        if (ok) correct++;
        times.push(dt);
        results.push(ok);

        SK.$$('.stroop-btn', w).forEach(function (b, bi) {
          b.disabled = true;
          if (bi === ki && ok) b.style.borderColor = 'var(--teal)', b.style.background = 'color-mix(in srgb,var(--teal) 22%,transparent)';
          else if (bi === ki) b.style.borderColor = 'var(--rose)', b.style.background = 'color-mix(in srgb,var(--rose) 20%,transparent)';
          else b.style.opacity = '.4';
        });

        var fb = el('<div class="feedback ' + (ok ? 'good' : 'bad') + '" style="margin-top:14px">' +
          '<span class="fb-title">' + (ok ? 'Correct' : 'Caught by interference') + '</span>' +
          (ok ? 'Ink was <b>' + ink.label + '</b> — ' + dt + 'ms.'
              : 'You read the word instead of the ink. The word said <b>' + word.label + '</b>, the ink was <b>' + ink.label + '</b> — ' + dt + 'ms.') +
          '</div>');
        w.appendChild(fb);

        prog.innerHTML = SK.dotsHTML(results, results.length - 1);
        setTimeout(function () {
          i++;
          i >= N ? finish() : trial();
        }, ok ? 520 : 900);
      }

      var keyHandler = function (e) {
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= 4 && !busy) { answer(n - 1); document.removeEventListener('keydown', keyHandler); }
      };
      document.addEventListener('keydown', keyHandler);
      w._cleanup = function () { document.removeEventListener('keydown', keyHandler); };
    }

    function finish() {
      var acc = SK.pct(correct, N);
      var median = times.sort(function (a, b) { return a - b; })[Math.floor(times.length / 2)] || 0;
      /* accuracy dominates; speed breaks ties */
      var score = SK.clamp(Math.round(acc * 0.78 + SK.clamp((1400 - median) / 1400, 0, 1) * 100 * 0.22), 0, 100);
      lvl.textContent = 'Complete';
      prog.innerHTML = SK.dotsHTML(results, -1);
      body.innerHTML = '';
      body.appendChild(SKKit.resultBlock({
        score: score, correct: correct, total: N, tone: tone,
        title: acc + '% accurate · median ' + median + 'ms',
        blurb: acc >= 90 && median < 900
          ? 'Excellent interference control — accurate and fast simultaneously. Your filter is suppressing the automatic read without costing time.'
          : acc >= 85
            ? 'Strong accuracy. The remaining gain is speed: you are trading time for correctness, which is the right order to learn it in.'
            : acc >= 65
              ? 'Interference is getting through. Deliberately slow down and verbalise the rule ("name the ink") before each response — accuracy first, speed follows.'
              : 'The automatic reading response is dominating. Practise at a deliberately slow pace for several sessions before chasing speed again.',
        onRetry: intro
      }));
      SK.record('focus', score, { correct: correct, attempts: N });
    }

    intro();
  }

  /* ==================================================================
     B — Target search among distractors (flanker / odd-one-out)
     ================================================================== */
  function flankerRun(host, tone) {
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Target search</span><span class="lvl" data-lvl>15 grids</span></div>' +
        '<div class="prog" style="margin-bottom:14px"></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var prog = stage.querySelector('.prog');
    var body = stage.querySelector('.body');

    var N = 15, i = 0, correct = 0, results = [], t0 = 0, busy = false;

    var SHAPES = ['circle', 'triangle', 'square', 'diamond', 'star', 'cross'];

    function shapeSVG(kind, color, size) {
      var s = size || 40, c = color;
      var mid = s / 2;
      switch (kind) {
        case 'circle': return '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="' + c + '"/></svg>';
        case 'triangle': return '<svg viewBox="0 0 40 40"><polygon points="20,6 34,32 6,32" fill="none" stroke="' + c + '" stroke-width="4" stroke-linejoin="round"/></svg>';
        case 'square': return '<svg viewBox="0 0 40 40"><rect x="7" y="7" width="26" height="26" rx="4" fill="' + c + '" opacity=".9"/></svg>';
        case 'diamond': return '<svg viewBox="0 0 40 40"><polygon points="20,5 35,20 20,35 5,20" fill="none" stroke="' + c + '" stroke-width="4" stroke-linejoin="round"/></svg>';
        case 'star': return '<svg viewBox="0 0 40 40"><path d="M20 5l4.6 9.9 10.4 1.4-7.6 7.3 1.9 10.6L20 29.1l-9.3 5.1 1.9-10.6L5 16.3l10.4-1.4z" fill="' + c + '"/></svg>';
        default: return '<svg viewBox="0 0 40 40"><path d="M20 7v26M7 20h26" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/></svg>';
      }
    }

    function intro() {
      lvl.textContent = '15 grids';
      prog.innerHTML = '';
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt">Find the <b>one shape that does not belong</b> and click it before the timer runs out.</p>' +
        '<p class="lede" style="margin-top:10px;color:var(--text-muted);font-size:.88rem">Each grid is filled with a repeated shape plus a single intruder. The distractors are designed so that a loose gaze slides over the target. Accuracy comes first — speed is scored only after accuracy.</p>' +
        '<div class="stage-actions"><button class="btn btn-primary" data-go type="button">Begin →</button></div></div>');
      body.appendChild(w);
      w.querySelector('[data-go]').addEventListener('click', function () { i = 0; correct = 0; results = []; grid(); });
    }

    function grid() {
      if (i >= N) return finish();
      lvl.textContent = 'Grid ' + (i + 1) + ' / ' + N;
      prog.innerHTML = SK.dotsHTML(results, i);
      busy = false;

      var common = SK.pick(SHAPES);
      var others = SHAPES.filter(function (s) { return s !== common; });
      var intruder = SK.pick(others);
      var intruderPos = Math.floor(Math.random() * 25);

      var toneHex = getComputedStyle(document.documentElement).getPropertyValue('--' + tone).trim() || '#E8B86E';
      var foilHex = getComputedStyle(document.documentElement).getPropertyValue('--rose').trim() || '#D96B6B';

      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt-sm" style="text-align:center;margin-bottom:4px">Click the intruder among the 24 identical shapes.</p>' +
        '<div class="flanker-grid" data-g style="margin-top:16px"></div>' +
        '<div style="display:flex;justify-content:center;margin-top:16px"><span class="chip on" data-t style="--tone:var(--gold)">⏱ 6.0s</span></div>' +
        '<div data-fb></div></div>');
      body.appendChild(w);

      var g = w.querySelector('[data-g]');
      for (var n = 0; n < 25; n++) {
        var kind = n === intruderPos ? intruder : common;
        var col = n === intruderPos ? foilHex : toneHex;
        var cell = el('<button class="flanker-cell" type="button" data-n="' + n + '">' + shapeSVG(kind, col) + '</button>');
        cell.style.opacity = '0';
        cell.style.animation = 'pop .3s var(--ease-out) ' + (n * 0.012) + 's forwards';
        g.appendChild(cell);
      }

      t0 = performance.now();
      var left = 6.0;
      var tick = setInterval(function () {
        left -= 0.1;
        var chip = w.querySelector('[data-t]');
        if (chip) chip.textContent = '⏱ ' + Math.max(0, left).toFixed(1) + 's';
        if (left <= 0) { clearInterval(tick); resolve(-1); }
      }, 100);

      g.addEventListener('click', function (e) {
        var c = e.target.closest('.flanker-cell');
        if (!c || busy) return;
        clearInterval(tick);
        resolve(parseInt(c.dataset.n, 10), c);
      });

      function resolve(n, cell) {
        if (busy) return;
        busy = true;
        var ok = n === intruderPos;
        var dt = Math.round(performance.now() - t0);
        if (ok) correct++;
        results.push(ok);

        SK.$$('.flanker-cell', g).forEach(function (c, ci) {
          c.style.pointerEvents = 'none';
          if (ci === intruderPos) { c.classList.add('foil'); c.style.opacity = '1'; }
          else if (ci === n) c.classList.add('miss');
        });

        w.querySelector('[data-fb]').innerHTML =
          '<div class="feedback ' + (ok ? 'good' : 'bad') + '"><span class="fb-title">' +
          (ok ? 'Found in ' + dt + 'ms' : n < 0 ? 'Time expired' : 'Wrong cell') + '</span>' +
          'The intruder was a <b>' + intruder + '</b> among <b>' + common + 's</b>.' +
          (ok && left > 3 ? ' Well under the deadline — the pattern broke immediately.' : '') +
          '</div>';

        prog.innerHTML = SK.dotsHTML(results, results.length - 1);
        setTimeout(function () { i++; i >= N ? finish() : grid(); }, ok ? 620 : 1000);
      }
    }

    function finish() {
      var acc = SK.pct(correct, N);
      var score = SK.clamp(acc, 0, 100);
      lvl.textContent = 'Complete';
      prog.innerHTML = SK.dotsHTML(results, -1);
      body.innerHTML = '';
      body.appendChild(SKKit.resultBlock({
        score: score, correct: correct, total: N, tone: tone,
        title: acc + '% of intruders found',
        blurb: acc >= 90
          ? 'Your search is systematic rather than glancing — you are scanning, not hoping. This is selective attention working as intended.'
          : acc >= 70
            ? 'Most intruders are being caught. The misses cluster at the grid edges, which is where a centre-biased gaze stops looking. Force an edge-first scan.'
            : 'The intruder is being averaged away with its neighbours. Slow down and compare cell by cell along a fixed route through the grid.',
        onRetry: intro
      }));
      SK.record('focus', score, { correct: correct, attempts: N });
    }

    intro();
  }

  /* ==================================================================
     C — Sustained focus (timed attention block with distraction log)
     ================================================================== */
  function sustainedRun(host, tone) {
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Sustained attention</span><span class="lvl" data-lvl>Idle</span></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var body = stage.querySelector('.body');

    var total = 0, left = 0, running = false, timer = null, lapses = 0, drift = 0;

    function intro() {
      lvl.textContent = 'Idle';
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt">Run a single sustained-attention block.</p>' +
        '<p class="lede" style="margin-top:10px;color:var(--text-muted);font-size:.88rem">Choose a block length. The timer runs; your task is to stay with one piece of work and <b>tap the button each time your mind wanders</b>. Every tap is a recorded lapse — not a failure, but data about where your attention leaks.</p>' +
        '<div class="choices cols-2" style="margin-top:18px">' +
          '<button class="choice" data-min="1"><span class="key">1</span><span><b>5 minutes</b><br><span class="muted" style="font-size:.78rem">Baseline block</span></span></button>' +
          '<button class="choice" data-min="2"><span class="key">2</span><span><b>10 minutes</b><br><span class="muted" style="font-size:.78rem">Standard block</span></span></button>' +
          '<button class="choice" data-min="3"><span class="key">3</span><span><b>15 minutes</b><br><span class="muted" style="font-size:.78rem">Deep work block</span></span></button>' +
          '<button class="choice" data-min="5"><span class="key">4</span><span><b>25 minutes</b><br><span class="muted" style="font-size:.78rem">Full Pomodoro</span></span></button>' +
        '</div></div>');
      body.appendChild(w);
      SK.$$('.choice', w).forEach(function (b) {
        b.addEventListener('click', function () { start(parseInt(b.dataset.min, 10) * 60); });
      });
    }

    function start(secs) {
      total = secs; left = secs; lapses = 0; drift = 0; running = true;
      lvl.textContent = 'Running';
      body.innerHTML = '';
      var w = el('<div class="pop">' +
        '<div class="breath run" data-b><span class="t" data-t>' + fmt(left) + '</span><span class="l" data-l>Focus</span></div>' +
        '<p class="prompt-sm" style="text-align:center;margin-top:14px">One task. One tab. Report every lapse.</p>' +
        '<div class="stage-actions" style="justify-content:center;margin-top:16px">' +
          '<button class="btn btn-ghost" data-lapse type="button">My mind just wandered</button>' +
          '<button class="btn btn-ghost btn-sm" data-pause type="button">Pause</button>' +
          '<button class="btn btn-ghost btn-sm" data-stop type="button">End early</button>' +
        '</div>' +
        '<div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:14px" class="chips">' +
          '<span class="chip on" data-lapsecount style="--tone:var(--rose)">0 lapses reported</span>' +
          '<span class="chip" data-rate>0.0 lapses / min</span>' +
        '</div>' +
        '<div data-fb></div></div>');
      body.appendChild(w);

      var tEl = w.querySelector('[data-t]');
      var lapBtn = w.querySelector('[data-lapse]');
      var pauseBtn = w.querySelector('[data-pause]');

      timer = setInterval(function () {
        if (!running) return;
        left--;
        tEl.textContent = fmt(left);
        drift++;
        if (left <= 0) { clearInterval(timer); running = false; done(); }
      }, 1000);

      lapBtn.addEventListener('click', function () {
        lapses++;
        w.querySelector('[data-lapsecount]').textContent = lapses + ' lapse' + (lapses === 1 ? '' : 's') + ' reported';
        var elapsed = Math.max(1, (total - left) / 60);
        w.querySelector('[data-rate]').textContent = (lapses / elapsed).toFixed(1) + ' lapses / min';
        lapBtn.classList.add('pop');
        setTimeout(function () { lapBtn.classList.remove('pop'); }, 320);
      });

      pauseBtn.addEventListener('click', function () {
        running = !running;
        pauseBtn.textContent = running ? 'Pause' : 'Resume';
        w.querySelector('[data-b]').classList.toggle('run', running);
        w.querySelector('[data-l]').textContent = running ? 'Focus' : 'Paused';
      });

      w.querySelector('[data-stop]').addEventListener('click', function () {
        clearInterval(timer); running = false; done();
      });

      function done() {
        var elapsedMin = Math.max(0.05, (total - left) / 60);
        var rate = lapses / elapsedMin;
        var completion = (total - left) / total;
        /* score: finishing the block matters most; lapse rate scales it down */
        var score = SK.clamp(Math.round(completion * 65 + SK.clamp(1 - rate / 4, 0, 1) * 35), 0, 100);
        lvl.textContent = 'Complete';
        body.innerHTML = '';
        body.appendChild(SKKit.resultBlock({
          score: score, correct: Math.round(completion * 100), total: 100, tone: tone,
          title: rate.toFixed(1) + ' lapses / min over ' + (total - left) + 's',
          blurb: score >= 80
            ? 'A clean block. Few reported intrusions and you saw it through — sustained attention is holding.'
            : score >= 55
              ? 'Attention held but leaked at a measurable rate. Notice what triggered the lapses: each one usually has a specific, repeatable cause.'
              : 'The block broke down early or the lapse rate was high. Shorten the block, remove one obvious source of interruption, and rebuild from a length you can complete cleanly.',
          onRetry: intro
        }));
        SK.record('focus', score, { correct: Math.round(completion * 100), attempts: 100 });
      }
    }

    function fmt(s) {
      return Math.floor(Math.max(0, s) / 60) + ':' + SK.pad2(Math.max(0, s) % 60);
    }

    intro();
  }

  /* ==================================================================
     Route
     ================================================================== */
  SK.registerRoute('focus', function (view) {
    var s = SKILLS.focus;
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
            { type: 'prose', kicker: 'What it is', title: 'Attention is subtraction', paras: [
              'Selective attention is not really about focusing harder. It is about <b>actively suppressing</b> everything that competes for the same channel. The effort is in the exclusion.',
              'Deep focus is what allows a single inconsistency in an otherwise tidy account to register instead of being smoothed away by the mind\'s preference for a clean story.'
            ]},
            { type: 'list', kicker: 'The three capacities', title: 'What attention actually does', items: [
              '<b>Selection.</b> Choose the relevant signal and protect it from equally available competitors — the Stroop task.',
              '<b>Search.</b> Scan structured space for a target that does not announce itself — the flanker task.',
              '<b>Sustain.</b> Hold the same standard of performance across minutes with no external stimulus — the timed block.'
            ]},
            { type: 'list', kicker: 'What breaks it', grid: true, title: 'Interference sources', items: [
              '<b>Switching cost.</b> Every context switch leaves a residue that degrades the next few minutes.',
              '<b>Task-relevant distractors.</b> Things that are almost, but not quite, the target.',
              '<b>Cognitive load.</b> Unresolved open loops consume the same resource as the task.',
              '<b>Physiological drift.</b> Sleep, hydration and time-on-task all shift the threshold silently.',
              '<b>Emotional preoccupation.</b> An unanswered message holds the channel whether you like it or not.',
              '<b>Learned interruption.</b> A device that has rewarded you for switching will keep asking.'
            ]},
            { type: 'callout', kicker: 'The Sherlockian test', tone: 'good', body:
              'Run a fifteen-minute block on one task. Report every lapse honestly. Below <b>one lapse per minute</b> you are operating at a level where detail survives contact with a real problem. Above three, the other four abilities will be undermined no matter how well trained.'
            },
            { type: 'chips', kicker: 'What this module trains', items: s.trains }
          ]);
        }
      },
      { label: 'Stroop', render: function (host) { stroopRun(host, 'rose'); } },
      { label: 'Target Search', render: function (host) { flankerRun(host, 'rose'); } },
      { label: 'Sustained Block', render: function (host) { sustainedRun(host, 'rose'); } },
      {
        label: 'Field Drills',
        render: function (host) {
          var p = el('<div class="panel"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px">Unaided practice</span><h2 style="font-size:1.12rem;font-weight:800;margin-bottom:6px">Attention drills for real conditions</h2><p class="muted" style="font-size:.86rem;margin-bottom:18px">Selectivity is trained by what you remove, not by what you add.</p><div class="concept-notes"></div></div>');
          var h = p.querySelector('.concept-notes');
          [
            { t: 'Single-Input Hours', d: 'One hour a day with exactly one channel open — no second screen, no background audio. The absence of competition is the exercise.' },
            { t: 'The Lapse Ledger', d: 'Keep a tally for a week. Counting interruptions changes them: most people discover the same two or three triggers account for the majority.' },
            { t: 'Completion Before New', d: 'Never open a new item while the current one is unresolved. Closing loops removes the background load that fragments attention.' },
            { t: 'Two-Minute Entry Ramp', d: 'Before any deep block, spend two minutes doing the task badly on purpose. Attention enters through the hands, not through resolve.' },
            { t: 'Environmental Subtraction', d: 'Each week remove one competing stimulus from your workspace. Note the measured effect on your sustained-block score.' }
          ].forEach(function (d, i) {
            h.appendChild(el('<div class="note-row"><span class="note-num">' + (i + 1) + '</span><span><b style="color:var(--text-primary)">' + esc(d.t) + '</b><br>' + esc(d.d) + '</span></div>'));
          });
          host.appendChild(p);
        }
      }
    ], 0);

    SKKit.rail(layout, 'focus');
  });
})();
