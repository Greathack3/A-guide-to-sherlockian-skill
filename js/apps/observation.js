/* ==========================================================================
   apps/observation.js — Observational Skills
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el;

  /* ==================================================================
     SVG scenes — deliberately dense with countable / positional detail
     ================================================================== */
  var TONES = { cyan: '#7FB6D9', amber: '#E8A33D', teal: '#7BAE7A', rose: '#D96B6B', gold: '#E8B86E', violet: '#A98BE0' };

  function sceneStudy(width) { return (
    '<svg viewBox="0 0 400 240" role="img" aria-label="Study scene">' +
    '<rect width="400" height="240" fill="#1A1010"/>' +
    '<rect x="0" y="168" width="400" height="72" fill="#241616"/>' +
    '<path d="M0 168h400" stroke="#3A2424" stroke-width="2"/>' +
    /* window */
    '<rect x="24" y="34" width="92" height="96" rx="4" fill="#10202B" stroke="#4A6272" stroke-width="2"/>' +
    '<path d="M70 34v96M24 82h92" stroke="#4A6272" stroke-width="2"/>' +
    '<path d="M32 122l18-30 14 18 12-22 24 34z" fill="#1B3242" opacity=".9"/>' +
    /* moon */
    '<circle cx="96" cy="54" r="11" fill="' + TONES.gold + '" opacity=".85"/>' +
    '<circle cx="91" cy="51" r="9" fill="#10202B"/>' +
    /* bookshelf */
    '<rect x="248" y="42" width="130" height="126" rx="3" fill="#2C1A18" stroke="#472C28" stroke-width="2"/>' +
    '<path d="M248 84h130M248 126h130" stroke="#472C28" stroke-width="2"/>' +
    /* row 1 books — 7 */
    books(254, 48, ['#7A3B3B','#4E6E8A','#6E8A4E','#8A6E4E','#5E4E8A','#8A4E6E','#4E8A82'], 16, 32, 34) +
    /* row 2 books — 6 */
    books(254, 90, ['#8A4E6E','#7A6E3B','#3B7A8A','#6E4E8A','#4E8A5E','#8A5E3B'], 18, 32, 34) +
    /* row 3 books — 5 */
    books(254, 132, ['#5E8A4E','#8A3B5E','#3B5E8A','#8A7A3B','#4E8A8A'], 21, 32, 34) +
    /* desk */
    '<rect x="126" y="146" width="152" height="12" rx="3" fill="#3E2620"/>' +
    '<rect x="136" y="158" width="10" height="34" fill="#33201C"/>' +
    '<rect x="258" y="158" width="10" height="34" fill="#33201C"/>' +
    /* inkwell + quill */
    '<rect x="146" y="134" width="16" height="12" rx="2" fill="#1C2A34"/>' +
    '<path d="M154 134l22-30" stroke="' + TONES.gold + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M176 104c6-6 12-8 14-6-2 6-8 10-14 6z" fill="' + TONES.gold + '" opacity=".85"/>' +
    /* papers — 3 sheets */
    '<rect x="176" y="136" width="26" height="10" rx="1.5" fill="#E8DCC4" transform="rotate(-5 189 141)"/>' +
    '<rect x="192" y="138" width="26" height="10" rx="1.5" fill="#D8CBB2" transform="rotate(3 205 143)"/>' +
    '<rect x="210" y="137" width="24" height="10" rx="1.5" fill="#E8DCC4" transform="rotate(-2 222 142)"/>' +
    /* candle */
    '<rect x="240" y="128" width="9" height="18" rx="2" fill="#EFE2C4"/>' +
    '<ellipse cx="244.5" cy="124" rx="4" ry="7" fill="' + TONES.amber + '"/>' +
    '<circle cx="244.5" cy="124" r="26" fill="' + TONES.amber + '" opacity=".08"/>' +
    /* magnifier on desk */
    '<circle cx="164" cy="168" r="14" fill="none" stroke="#9AA8B4" stroke-width="3"/>' +
    '<path d="M174 178l12 12" stroke="#9AA8B4" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="164" cy="168" r="14" fill="#5C7A8C" opacity=".28"/>' +
    /* hat on hook */
    '<path d="M310 24v14" stroke="#5A3A32" stroke-width="3"/>' +
    '<path d="M294 66c0-10 7-18 16-18s16 8 16 18z" fill="#2A1A16"/>' +
    '<rect x="286" y="66" width="52" height="6" rx="3" fill="#2A1A16" stroke="#4A302A"/>' +
    /* clock */
    '<circle cx="356" cy="196" r="24" fill="#241616" stroke="' + TONES.gold + '" stroke-width="3"/>' +
    '<path d="M356 196v-13M356 196l10 6" stroke="' + TONES.gold + '" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="356" cy="196" r="2.5" fill="' + TONES.gold + '"/>' +
    '<circle cx="356" cy="176" r="2" fill="' + TONES.gold + '"/>' +
    /* chair */
    '<path d="M56 168v-42h34v42" fill="none" stroke="#4A302A" stroke-width="4"/>' +
    '<rect x="50" y="166" width="46" height="8" rx="3" fill="#3E2620"/>' +
    '<path d="M54 174v22M92 174v22" stroke="#3E2620" stroke-width="4"/>' +
    /* cat silhouette */
    '<path d="M206 240c-6-16 2-30 14-30 6 0 9 4 10 9 1-5 4-9 10-9 12 0 20 14 14 30z" fill="#0E0A0A"/>' +
    '<path d="M216 214l-3-12 9 6M240 214l3-12-9 6" fill="#0E0A0A"/>' +
    '<circle cx="224" cy="224" r="2.4" fill="' + TONES.teal + '"/>' +
    '<circle cx="234" cy="224" r="2.4" fill="' + TONES.teal + '"/>' +
    '</svg>'
  ); }

  function books(x, y, colors, w, h, gap) {
    var out = '', cx = x;
    for (var i = 0; i < colors.length; i++) {
      out += '<rect x="' + cx + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.5" fill="' + colors[i] + '" stroke="#1A1010" stroke-width="1"/>';
      out += '<path d="M' + (cx + 3) + ' ' + (y + 5) + 'h' + (w - 6) + '" stroke="#000" stroke-width="1" opacity=".3"/>';
      cx += w + (gap - w);
    }
    return out;
  }

  /* The scene's ground truth — every question is answerable only by looking */
  var SCENE_FACTS = [
    { q: 'How many books are on the TOP shelf of the bookcase?', a: '7', d: 'Count from the left edge of the top shelf: seven distinct spines.' },
    { q: 'What colour is the inkwell on the desk?', a: 'Dark blue', d: 'It is the small dark-blue block to the left of the papers, holding the quill.' },
    { q: 'Which hand of the wall clock is pointing straight up?', a: 'The minute hand', d: 'The clock shows roughly 4:00 — the long hand is at twelve, the short hand at four.' },
    { q: 'How many sheets of paper lie on the desk?', a: 'Three', d: 'Three overlapping sheets, fanned between the inkwell and the candle.' },
    { q: 'What is hanging on the hook to the right of the window area?', a: 'A hat', d: 'A dark hat with a brim hangs from a hook at the top right of the wall.' },
    { q: 'How many shelves does the bookcase have?', a: 'Three', d: 'Two horizontal dividers create three shelf levels, each with books.' },
    { q: 'What animal is sitting on the floor at the bottom right?', a: 'A cat', d: 'A black cat silhouette with two glowing teal eyes sits by the wall.' },
    { q: 'The candle flame — is it lit or unlit?', a: 'Lit', d: 'A yellow-orange flame with a soft halo of light around it.' },
    { q: 'How many visible legs does the desk have?', a: 'Two', d: 'Only the left and right legs are drawn; the desk is seen from the front.' },
    { q: 'What is the moon doing in the window?', a: 'Crescent — partially covered', d: 'A gold circle with a dark circle overlapping it, making a crescent.' },
    { q: 'Which shelf holds the FEWEST books?', a: 'The bottom shelf', d: 'Top has 7, middle has 6, bottom has 5.' },
    { q: 'What colour is the chair to the left?', a: 'Brown / dark wood', d: 'A simple wooden chair in dark brown tones, positioned at the left edge of the desk.' }
  ];

  /* ==================================================================
     Exercise A — Timed scene study
     ================================================================== */
  function sceneStudyRun(host, tone) {
    var facts = SK.sample(SCENE_FACTS, 5);
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Scene study</span><span class="lvl" data-lvl>Memorise</span></div>' +
        '<div class="prog" style="margin-bottom:14px"></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var prog = stage.querySelector('.prog');
    var body = stage.querySelector('.body');
    var seconds = 12, timer = null, phase = 'ready';

    function start() {
      phase = 'study';
      body.innerHTML = '';
      var frame = el(
        '<div class="scene-frame pop">' +
          '<div class="scene-timer" data-t>12.0s</div>' +
          sceneStudy() +
          '<div class="scene-cover" data-cover></div>' +
        '</div>'
      );
      body.appendChild(frame);
      var cover = frame.querySelector('[data-cover]');
      cover.style.display = 'none';
      var tEl = frame.querySelector('[data-t]');
      var left = 12;
      lvl.textContent = 'Study — 12 seconds';
      timer = setInterval(function () {
        left -= 0.1;
        tEl.textContent = Math.max(0, left).toFixed(1) + 's';
        if (left <= 0) { clearInterval(timer); hide(); }
      }, 100);

      function hide() {
        phase = 'recall';
        cover.style.display = 'grid';
        cover.innerHTML = '<div><h4>The scene is gone.</h4><p>Twelve seconds of looking. Now report exactly what you saw — no guessing beyond what you actually registered.</p></div>';
        lvl.textContent = 'Recall — 5 questions';
        setTimeout(ask, 700);
      }
    }

    function ask() {
      var i = 0, correct = 0;
      var results = facts.map(function () { return null; });

      function renderQ() {
        if (i >= facts.length) return done();
        var f = facts[i];
        prog.innerHTML = SK.dotsHTML(results, i);
        lvl.textContent = 'Question ' + (i + 1) + ' / ' + facts.length;
        var w = el('<div class="pop"><p class="prompt">' + esc(f.q) + '</p>' +
          '<div style="margin-top:16px"><input type="text" data-in placeholder="Type what you saw…" autocomplete="off" spellcheck="false" ' +
          'style="width:100%;padding:14px 16px;border-radius:13px;border:1px solid var(--border-soft);background:color-mix(in srgb, var(--bg-base) 45%, transparent);color:var(--text-primary);font-size:.95rem;outline:none"/></div>' +
          '<div class="stage-actions"><button class="btn btn-primary" data-submit type="button">Submit answer</button></div></div>');
        body.innerHTML = '';
        body.appendChild(w);
        var input = w.querySelector('[data-in]');
        setTimeout(function () { input.focus(); }, 60);
        function submit() {
          var val = input.value.trim().toLowerCase();
          if (!val) return;
          var norm = val.replace(/[^\w\s]/g, '');
          var ok = normalise(f.a) === norm || norm.includes(normalise(f.a)) || (normalise(f.a).includes(norm) && norm.length >= 3);
          if (ok) correct++;
          results[i] = ok;
          var fb = el('<div class="feedback ' + (ok ? 'good' : 'bad') + '"><span class="fb-title">' + (ok ? 'Correct' : 'You missed it') + '</span>' +
            '<b>' + esc(f.a) + '</b> — ' + esc(f.d) + '</div>');
          w.appendChild(fb);
          input.disabled = true;
          w.querySelector('[data-submit]').remove();
          var next = el('<button class="btn btn-primary" type="button">' + (i >= facts.length - 1 ? 'See results' : 'Next question') + ' →</button>');
          next.addEventListener('click', function () { i++; renderQ(); });
          w.querySelector('.stage-actions').appendChild(next);
          prog.innerHTML = SK.dotsHTML(results, i);
        }
        w.querySelector('[data-submit]').addEventListener('click', submit);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
      }

      function normalise(s) {
        return s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
      }

      function done() {
        var score = SK.pct(correct, facts.length);
        prog.innerHTML = SK.dotsHTML(results, -1);
        lvl.textContent = 'Complete';
        body.innerHTML = '';
        body.appendChild(SKKit.resultBlock({
          score: score, correct: correct, total: facts.length, tone: tone,
          title: 'Observation report',
          blurb: score >= 80 ? 'You observed rather than merely saw — count, colour, position and state all registered in twelve seconds.'
            : score >= 60 ? 'Partial capture. You likely took in the salient objects but lost counts and positions; that is the normal gap between seeing and observing.'
            : 'You glanced rather than observed. Next run, pick a scanning order — left to right, shelf by shelf — and count as you go.',
          onRetry: function () { clearInterval(timer); body.innerHTML = ''; prog.innerHTML = ''; start(); }
        }));
        SK.record('observation', score, { correct: correct, attempts: facts.length });
      }

      renderQ();
    }

    function intro() {
      phase = 'ready';
      lvl.textContent = 'Ready';
      prog.innerHTML = '';
      body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt">Study the room, then answer five questions from memory.</p>' +
        '<p class="lede" style="margin-top:10px;color:var(--text-muted);font-size:.88rem">You will have <b>12 seconds</b>. Do not try to memorise everything — pick a scanning order and count what you find. Counts, colours, positions and states are what get asked.</p>' +
        '<div class="stage-actions"><button class="btn btn-primary" data-go type="button">Reveal the scene →</button></div></div>');
      body.appendChild(w);
      w.querySelector('[data-go]').addEventListener('click', start);
    }

    intro();
    return { destroy: function () { if (timer) clearInterval(timer); } };
  }

  /* ==================================================================
     Exercise B — Change detection (spot the difference)
     ================================================================== */
  function changeGrid(variant) {
    /* 5x3 grid of symbols; variant B alters 4 cells */
    var base = [
      ['◆','●','▲','■','●'], ['▲','■','◆','●','▲'], ['●','◆','■','▲','◆']
    ];
    var changes = { '0-2': '●', '1-0': '■', '1-4': '●', '2-3': '■' };
    var out = '<svg viewBox="0 0 300 190" role="img" aria-label="Grid">';
    out += '<rect width="300" height="190" fill="#1A1010"/>';
    var idx = 0;
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 5; c++) {
        var key = r + '-' + c;
        var sym = base[r][c];
        if (variant && changes[key]) sym = changes[key];
        var x = 30 + c * 52, y = 44 + r * 52;
        var isChanged = variant && changes[key];
        out += '<rect x="' + (x - 22) + '" y="' + (y - 22) + '" width="44" height="44" rx="9" fill="#241616" stroke="#3A2424"/>';
        out += '<text x="' + x + '" y="' + (y + 9) + '" text-anchor="middle" font-size="24" fill="' +
          (isChanged ? TONES.rose : TONES.cyan) + '" opacity="' + (isChanged ? '.95' : '.8') + '">' + sym + '</text>';
        idx++;
      }
    }
    out += '<text x="150" y="178" text-anchor="middle" font-size="9" fill="#6A5454" font-family="monospace" letter-spacing="3">FRAME ' + (variant ? 'B' : 'A') + '</text>';
    out += '</svg>';
    return { html: out, keys: Object.keys(changes) };
  }

  function changeDetectionRun(host, tone) {
    var found = {};
    var totalChanges = 4;
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Change detection</span><span class="lvl" data-lvl>Find all 4 differences</span></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var body = stage.querySelector('.body');
    var lvl = stage.querySelector('[data-lvl]');
    var gridA = changeGrid(false), gridB = changeGrid(true);

    var w = el('<div class="pop"><p class="prompt-sm" style="margin-bottom:14px">Two frames of the same grid. Four cells changed symbol. Click every cell that differs — in <b>either</b> panel.</p>' +
      '<div class="diff-grid">' +
        '<div class="diff-panel"><div class="cap">Frame A</div><div class="hit" data-panel="A">' + gridA.html + '</div></div>' +
        '<div class="diff-panel"><div class="cap">Frame B</div><div class="hit" data-panel="B">' + gridB.html + '</div></div>' +
      '</div>' +
      '<div class="chips" style="margin-top:16px" data-chips></div>' +
      '<div class="stage-actions"><button class="btn btn-primary" data-done type="button" disabled>Submit findings</button>' +
      '<button class="btn btn-ghost btn-sm" data-hint type="button">Reveal one</button></div>' +
      '<div data-fb></div></div>');
    body.appendChild(w);

    var chips = w.querySelector('[data-chips]');
    function paintChips() {
      chips.innerHTML = '<span class="chip ' + (Object.keys(found).length ? 'on' : '') + '">' +
        Object.keys(found).length + ' / ' + totalChanges + ' differences found</span>' +
        '<span class="chip">Click a cell to flag it</span>';
      w.querySelector('[data-done]').disabled = Object.keys(found).length !== totalChanges;
    }
    paintChips();

    SK.$$('.hit rect[rx="9"]', w).forEach(function (rect, i) {
      rect.style.cursor = 'crosshair';
      rect.style.transition = 'fill .2s';
      rect.addEventListener('click', function () {
        var r = Math.floor(i / 5), c = i % 5;
        var panel = rect.closest('[data-panel]').getAttribute('data-panel');
        var key = panel + ':' + r + '-' + c;
        if (found[key]) return;
        found[key] = true;
        rect.setAttribute('fill', 'rgba(123,174,122,.45)');
        rect.setAttribute('stroke', TONES.teal);
        paintChips();
      });
    });

    w.querySelector('[data-hint]').addEventListener('click', function () {
      for (var k in changesMap) {
        if (!found['A:' + k] && !found['B:' + k]) {
          found['A:' + k] = true;
          var idx = (parseInt(k.split('-')[0], 10)) * 5 + parseInt(k.split('-')[1], 10);
          var rects = SK.$$('.hit[data-panel="A"] rect[rx="9"]', w);
          if (rects[idx]) { rects[idx].setAttribute('fill', 'rgba(232,163,61,.4)'); rects[idx].setAttribute('stroke', TONES.amber); }
          paintChips();
          return;
        }
      }
    });
    var changesMap = { '0-2': 1, '1-0': 1, '1-4': 1, '2-3': 1 };

    w.querySelector('[data-done]').addEventListener('click', function () {
      /* precise scoring: a valid finding = clicking either side of a real change */
      var validPairs = {};
      Object.keys(found).forEach(function (k) {
        var parts = k.split(':'); var cell = parts[1];
        if (changesMap[cell]) validPairs[cell] = true;
      });
      var accuracy = Object.keys(validPairs).length / totalChanges;
      var noise = Object.keys(found).length - Object.keys(validPairs).length * 2;
      var score = Math.round(SK.clamp(accuracy * 100 - Math.max(0, noise) * 6, 0, 100));

      var missed = Object.keys(changesMap).filter(function (c) { return !validPairs[c]; });
      w.querySelector('[data-fb]').innerHTML =
        '<div class="feedback ' + (missed.length === 0 ? 'good' : 'bad') + '">' +
        '<span class="fb-title">' + (missed.length === 0 ? 'All differences located' : missed.length + ' still hidden') + '</span>' +
        (missed.length === 0
          ? 'All four changed cells: <b>row 1 col 3</b>, <b>row 2 col 1</b>, <b>row 2 col 5</b>, <b>row 3 col 4</b>. Change blindness is defeated by deliberate comparison rather than raw attention.'
          : 'The ones you missed were <b>' + missed.map(describeCell).join('</b>, <b>') + '</b>. Try scanning row by row and comparing cell-to-cell instead of taking in the grid as a whole.') +
        '</div>';
      SK.record('observation', score, { correct: Object.keys(validPairs).length, attempts: totalChanges });
      lvl.textContent = 'Score ' + score;
    });

    function describeCell(k) {
      var p = k.split('-');
      return 'row ' + (parseInt(p[0], 10) + 1) + ' col ' + (parseInt(p[1], 10) + 1);
    }
  }

  /* ==================================================================
     Exercise C — Detail ladder (self-graded enumeration)
     ================================================================== */
  var LADDER = [
    {
      prompt: 'You meet someone once for ninety seconds. List everything you could report about their appearance afterwards — without inventing.',
      targets: ['Hair colour and length', 'Approximate height or build', 'A visible accessory (glasses, ring, watch)', 'Clothing colour — top', 'Clothing colour — bottom', 'Distinguishing feature (beard, scar, tattoo)', 'Dominant hand / posture', 'Anything they were carrying'],
      hint: 'Trained observers build a fixed checklist: hair → face → torso → hands → feet → carried items. A fixed order prevents the random sampling that makes recall patchy.'
    },
    {
      prompt: 'You have just left a room you will never enter again. Enumerate what you could reconstruct about its layout.',
      targets: ['Number and position of doors', 'Number and position of windows', 'Light source type and location', 'Where the largest piece of furniture sat', 'Wall colour or covering', 'Floor covering', 'Anything on the walls (art, shelves, boards)', 'What was on or near the desk/table'],
      hint: 'Orient first: fix yourself to one landmark (usually the entrance) and describe everything relative to it. Spatial memory without an anchor degrades within minutes.'
    },
    {
      prompt: 'A person speaks to you for thirty seconds with an urgent tone. What would you report beyond their words?',
      targets: ['Speech rate (faster or slower than usual)', 'Volume — loud, quiet, normal', 'Pitch variation — flat or animated', 'A hesitation, pause or self-correction', 'Hand or body movement during speech', 'Where their eyes were directed', 'The emotional word they emphasised', 'What they conspicuously did not say'],
      hint: 'Report behaviour, not interpretation. "Said the name twice with a pause" is evidence; "was nervous" is a conclusion. Keep the two in separate columns.'
    }
  ];

  function detailLadderRun(host, tone) {
    var idx = 0;
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Detail ladder</span><span class="lvl" data-lvl>Enumerate</span></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var body = stage.querySelector('.body');
    var lvl = stage.querySelector('[data-lvl]');

    function render() {
      if (idx >= LADDER.length) return finish();
      var item = LADDER[idx];
      lvl.textContent = 'Scenario ' + (idx + 1) + ' / ' + LADDER.length;
      var w = el('<div class="pop"><p class="prompt">' + esc(item.prompt) + '</p>' +
        '<p class="lede" style="margin-top:9px;font-size:.87rem;color:var(--text-muted)">Write as many as you can, one per line. There is no auto-grader here — this is deliberate recall, scored honestly by you.</p>' +
        '<textarea data-ta rows="7" placeholder="1. …&#10;2. …&#10;3. …" ' +
        'style="width:100%;margin-top:14px;padding:14px 16px;border-radius:13px;border:1px solid var(--border-soft);background:color-mix(in srgb, var(--bg-base) 45%, transparent);color:var(--text-primary);font-size:.9rem;line-height:1.7;resize:vertical;outline:none"></textarea>' +
        '<div class="stage-actions"><button class="btn btn-primary" data-rev type="button">Reveal the checklist</button></div>' +
        '<div data-out></div></div>');
      body.innerHTML = '';
      body.appendChild(w);
      w.querySelector('[data-rev]').addEventListener('click', function () {
        var typed = w.querySelector('[data-ta]').value.split('\n').map(function (s) { return s.trim().replace(/^\d+[.)]\s*/, ''); }).filter(Boolean);
        var lower = typed.map(function (t) { return t.toLowerCase(); });
        var hit = item.targets.filter(function (t) {
          return lower.some(function (l) { return l.length > 2 && (l.includes(t.toLowerCase().split(' ')[0]) || t.toLowerCase().includes(l.split(' ')[0])); });
        });
        var score = Math.round(SK.clamp((hit.length / item.targets.length) * 100, 0, 100));

        var out = w.querySelector('[data-out]');
        out.innerHTML = '<div class="feedback ' + (score >= 60 ? 'good' : 'bad') + '">' +
          '<span class="fb-title">You captured ' + hit.length + ' of ' + item.targets.length + ' — score ' + score + '</span>' +
          '<div class="obs-list" style="margin-top:8px">' +
            item.targets.map(function (t) {
              var found = hit.indexOf(t) !== -1;
              return '<div class="obs-item ' + (found ? 'found' : 'missed') + '"><span class="box"></span><span>' + esc(t) + '</span></div>';
            }).join('') +
          '</div>' +
          '<p style="margin-top:12px;color:var(--text-secondary)">' + item.hint + '</p></div>' +
          '<div class="stage-actions"><button class="btn btn-primary" data-next type="button">' +
          (idx >= LADDER.length - 1 ? 'See results' : 'Next scenario') + ' →</button></div>';
        w.querySelector('[data-rev]').remove();
        w.querySelector('[data-next]').addEventListener('click', function () {
          lastScore = score; idx++; render();
        });
      });
    }

    var scores = [];
    var lastScore = 0;

    function finish() {
      var avg = Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / (scores.length || 1));
      lvl.textContent = 'Complete';
      body.innerHTML = '';
      body.appendChild(SKKit.resultBlock({
        score: avg, correct: Math.round(avg / 20), total: 5, tone: tone,
        title: 'Enumeration capacity',
        blurb: avg >= 70 ? 'Your free recall is well organised — you recover counts, positions and states without prompting.'
          : avg >= 45 ? 'You recall the obvious and lose the specific. Fix a scanning order and a reporting order, and the count of captured details rises sharply.'
          : 'Recall is currently unstructured. Practise the ladder daily: fix an order (head to feet, left to right) and force yourself through it every single time.',
        onRetry: function () { idx = 0; scores = []; render(); }
      }));
      SK.record('observation', avg, { correct: Math.round(avg / 20), attempts: 5 });
    }

    var _render = render;
    render = function () {
      if (idx > 0 && scores.length < idx) scores.push(lastScore);
      _render();
    };
    render();
  }

  /* ==================================================================
     Route
     ================================================================== */
  SK.registerRoute('observation', function (view) {
    var s = SKILLS.observation;
    view.appendChild(el(SK.appHead(s)));

    var wrap = el('<div class="wrap" style="padding-top:0"></div>');
    var layout = el('<div class="app-layout"></div>');
    var main = el('<div class="app-main"></div>');
    layout.appendChild(main);
    wrap.appendChild(layout);
    view.appendChild(wrap);

    var active = null;
    SKKit.tabs(main, [
      {
        label: 'Briefing',
        render: function (host) {
          SKKit.briefing(host, s, [
            { type: 'prose', kicker: 'What it is', title: 'You see, but you do not observe', paras: [
              'The famous rebuke is a technical distinction, not a literary one. <b>Seeing</b> is passive reception of light. <b>Observing</b> is directed attention with a question already in mind.',
              'A witness who "saw everything" typically reports two or three salient objects and nothing else. An observer arrives knowing what they are looking for, scans systematically, and counts as they go.'
            ]},
            { type: 'list', kicker: 'Method', title: 'How trained observers work', items: [
              '<b>Fix a question first.</b> Unfocused looking has no target, so nothing is retained.',
              '<b>Scan in an order.</b> Left to right, top to bottom, near to far — never randomly.',
              '<b>Count out loud in the head.</b> Numbers are the first detail the mind discards.',
              '<b>Separate report from inference.</b> "Watch on left wrist" is data; "wealthy" is a conclusion.',
              '<b>Rehearse immediately.</b> Unrehearsed detail decays by roughly half within a minute.'
            ]},
            { type: 'list', kicker: 'Why it fails', title: 'The four filters that eat detail', grid: true, items: [
              '<b>Inattentional blindness</b> — looking for one thing, missing the unexpected entirely.',
              '<b>Change blindness</b> — failing to notice a change hidden by a brief interruption.',
              '<b>Schema filling</b> — reporting what usually belongs there rather than what was there.',
              '<b>Post-event contamination</b> — later information quietly rewriting the original memory.'
            ]},
            { type: 'callout', kicker: 'The Sherlockian test', tone: 'good', body:
              'Enter a room, spend ten seconds looking, then leave and write down <b>at least twelve specific details</b> — counts, colours, positions, states. If you cannot reach twelve, you are seeing. Twelve is the threshold where observation begins.'
            },
            { type: 'chips', kicker: 'What this module trains', items: s.trains }
          ]);
        }
      },
      {
        label: 'Scene Study',
        render: function (host) {
          if (active && active.destroy) active.destroy();
          active = sceneStudyRun(host, 'cyan');
        }
      },
      {
        label: 'Change Detection',
        render: function (host) {
          if (active && active.destroy) active.destroy();
          changeDetectionRun(host, 'cyan');
        }
      },
      {
        label: 'Detail Ladder',
        render: function (host) {
          if (active && active.destroy) active.destroy();
          detailLadderRun(host, 'cyan');
        }
      },
      {
        label: 'Field Drills',
        render: function (host) {
          var p = el('<div class="panel"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px">Unaided practice</span><h2 style="font-size:1.12rem;font-weight:800;margin-bottom:6px">Observation drills for the street</h2><p class="muted" style="font-size:.86rem;margin-bottom:18px">Observation only transfers if it is practised where the data is uncontrolled.</p><div class="concept-notes"></div></div>');
          var h = p.querySelector('.concept-notes');
          [
            { t: 'The Twelve-Item Exit', d: 'Leave any room and immediately write twelve specific details. Check nothing. Over weeks, your recovery rate is the metric.' },
            { t: 'The Stranger Sketch', d: 'After a brief encounter, write a description using only observable facts. Later, compare it against a photo if you can. Note where imagination crept in.' },
            { t: 'Commuter Census', d: 'On any journey, count and classify: how many red coats, how many people reading, how many left-handed. Numbers force real looking.' },
            { t: 'Reverse Description', d: 'Describe an ordinary object at home in twenty precise sentences — a kettle, a door handle. Twenty sentences is far harder than it sounds.' },
            { t: 'Interruption Test', d: 'Watch a scene for thirty seconds, look away for two seconds, look back and list what changed. This is change detection in its natural habitat.' }
          ].forEach(function (d, i) {
            h.appendChild(el('<div class="note-row"><span class="note-num">' + (i + 1) + '</span><span><b style="color:var(--text-primary)">' + esc(d.t) + '</b><br>' + esc(d.d) + '</span></div>'));
          });
          host.appendChild(p);
        }
      }
    ], 0);

    SKKit.rail(layout, 'observation');
  });
})();
