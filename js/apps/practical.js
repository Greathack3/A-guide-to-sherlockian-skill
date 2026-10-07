/* ==========================================================================
   apps/practical.js — Practical Implementation (assessment & application)
   Does not teach a sixth ability. It applies and evaluates the other five.
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el;

  var SKILL_REF = {
    critical:  { label: 'Critical Thinking', tone: 'amber',  abbr: 'CT' },
    observation:{ label: 'Observation',       tone: 'cyan',   abbr: 'OB' },
    memory:    { label: 'Working Memory',     tone: 'violet', abbr: 'WM' },
    focus:     { label: 'Deep Focus',         tone: 'rose',   abbr: 'DF' },
    social:    { label: 'Social Cognition',   tone: 'teal',   abbr: 'SC' }
  };

  /* ==================================================================
     Case files — each question is tagged with the skill it demands
     ================================================================== */
  var CASES = [
    {
      id: 'case-lantern',
      title: 'The Lantern Street Letting',
      diff: 'Standard',
      blurb: 'A property handover with three inconsistent accounts and one document that does not match.',
      narrative: 'You are conducting a routine handover of a leased workshop. Three people are present: the outgoing tenant, the incoming tenant, and the agent. The outgoing tenant states the space was handed to them "already stripped". The incoming tenant states the previous occupant left fittings in place. The agent states the inventory was never signed by anyone. On the wall is a laminated inventory sheet — signed, dated, and listing fourteen items, nine of which are present in the room. You have fifteen minutes and one set of keys.',
      questions: [
        {
          skill: 'observation',
          tag: 'Observation',
          q: 'Before speaking to anyone, you take one pass around the room. Which finding is most diagnostic?',
          choices: [
            'The exact count of items present against the laminated inventory.',
            'The general condition of the walls and floor.',
            'How many people are currently in the room.',
            'The brand of the fittings that remain.'
          ],
          a: 0,
          e: 'A signed document that lists fourteen items while nine are present is a falsifiable, quantified mismatch. It converts a he-said-she-said into a countable discrepancy — and the count itself is the observation that must be made before anyone speaks.'
        },
        {
          skill: 'critical',
          tag: 'Critical Thinking',
          q: 'The agent says the inventory "was never signed by anyone". The laminated sheet on the wall is signed and dated. What follows?',
          choices: [
            'The agent is lying, and should be confronted immediately.',
            'At least one of the two claims is false; determine which document is being discussed before inferring intent.',
            'The signature must be forged, because the agent has no reason to lie.',
            'The inventory on the wall is a different document and both statements are compatible.'
          ],
          a: 1,
          e: 'Both observations are established; the inference is not yet warranted. The agent may be referring to a different inventory, a missing signature page, or may simply be wrong. Confronting before establishing referent destroys the chance to hear how each account adjusts when shown the sheet.'
        },
        {
          skill: 'social',
          tag: 'Social Cognition',
          q: 'The outgoing tenant says the space was "already stripped" — attributing the condition to an unnamed prior state. What is the most useful next move?',
          choices: [
            'Ask directly: "Did you remove the fittings yourself?"',
            'Note the passive construction and ask what they personally did during their first week in possession.',
            'Accept it as an accurate description of an earlier condition.',
            'Tell them you know the fittings were removed by them.'
          ],
          a: 1,
          e: 'Passive voice removes the agent from the action. Rather than allege, ask for a timeline of their own conduct — you obtain the same information while letting them volunteer the detail. An accusation invites defence; a timeline invites account.'
        },
        {
          skill: 'memory',
          tag: 'Working Memory',
          q: 'You must hold in mind: five missing items, three people\'s accounts, one signature question, and a fifteen-minute limit. What is the correct handling?',
          choices: [
            'Keep all of it in mind so nothing is forgotten.',
            'Write the count and the three accounts down immediately, then work the timeline.',
            'Focus on the five missing items only; the rest is secondary.',
            'Hold the accounts in memory and write down only the item list.'
          ],
          a: 1,
          e: 'Working memory is the bottleneck, not the storage. Externalising the quantified parts frees the capacity for the part that actually requires reasoning — which of the accounts is internally consistent.'
        },
        {
          skill: 'focus',
          tag: 'Deep Focus',
          q: 'Midway through, the incoming tenant begins a lengthy complaint about an unrelated matter. What do you do?',
          choices: [
            'Let them finish — the full context may be relevant.',
            'Acknowledge in one sentence, then return to the item count explicitly and stay there.',
            'Interrupt immediately and return to the inventory.',
            'Split attention between the complaint and the inventory.'
          ],
          a: 1,
          e: 'Both the immediate interruption and the passive continuation cost more than a single bridging move. One sentence of acknowledgement plus an explicit return to the thread preserves the relationship while protecting the channel — selective attention applied socially.'
        },
        {
          skill: 'critical',
          tag: 'Critical Thinking',
          q: 'You have nine of fourteen items. Two explanations fit: theft, or an incomplete initial handover. What should you do?',
          choices: [
            'Assume theft — five missing items is the more likely explanation.',
            'Assume an incomplete handover — it requires fewer assumptions.',
            'State both, then look for the evidence that discriminates between them.',
            'Suspend judgement entirely until more information arrives on its own.'
          ],
          a: 2,
          e: 'You have reached the point where evidence must be collected rather than argued. The discriminating test is whether there is any record of the earlier handover — an earlier signature, a dated photo, a delivery note. Judgement is premature; a targeted search is not.'
        }
      ],
      debrief: 'This case is engineered so that no single skill can carry it. Observation produces the count; critical thinking tests it against the claims; social cognition extracts accounts without triggering defences; working memory keeps the quantified parts offloaded; focus holds the thread when it is under attack. Failing any one of them degrades the whole.'
    },

    {
      id: 'case-transit',
      title: 'The Nine-Forty Delay',
      diff: 'Advanced',
      blurb: 'Compressed timeline, incomplete data, and a witness whose confidence increases under pressure.',
      narrative: 'A scheduled courier collection did not arrive. You have: a dispatch log showing the vehicle left the depot at 21:12; a gate camera timestamp showing it exit at 21:26; a driver claiming departure at 21:05; and a phone record placing a fourteen-second call at 21:19. The route is fourteen minutes under normal conditions. The delivery window closed at 21:45. You have eight minutes before the next relevant person goes off shift.',
      questions: [
        {
          skill: 'observation',
          tag: 'Observation',
          q: 'The dispatch log says 21:12, the gate camera says 21:26. Which detail must be established first?',
          choices: [
            'Whether the driver is telling the truth about 21:05.',
            'Whether both timestamps use the same clock and timezone.',
            'Whether the fourteen-second call was inbound or outbound.',
            'Whether the route was actually fourteen minutes that night.'
          ],
          a: 1,
          e: 'A fourteen-minute gap between two records is meaningless until you know whether they measure the same thing. Clock offset between a digital log and a camera is the most common mundane explanation, and checking it costs seconds. Skipping it produces a "discrepancy" that is an artefact.'
        },
        {
          skill: 'memory',
          tag: 'Working Memory',
          q: 'You now have five timestamps and two route estimates. How do you avoid confusing them?',
          choices: [
            'Repeat them to yourself until they are fixed.',
            'Write them into a single table before analysing any of them.',
            'Hold the two disputed ones and discard the undisputed.',
            'Analyse each one as you recall it.'
          ],
          a: 1,
          e: 'A table removes the ordering and association load entirely. Reconstruction from memory under time pressure reliably transposes adjacent digits — precisely the failure that would turn a mundane offset into a false finding.'
        },
        {
          skill: 'focus',
          tag: 'Deep Focus',
          q: 'A colleague begins explaining an unrelated earlier incident involving the same driver. How do you handle it?',
          choices: [
            'Hear it out — prior behaviour may be relevant.',
            'Note it in one line as a separate thread and return to the timestamps.',
            'Reject it as irrelevant and continue.',
            'Hold both threads simultaneously while you work.'
          ],
          a: 1,
          e: 'Prior behaviour is a legitimate hypothesis, but it is not the current problem, and following it now abandons the eight-minute window. Writing it down both preserves it and stops it competing for the channel.'
        },
        {
          skill: 'social',
          tag: 'Social Cognition',
          q: 'The driver first says 21:05, then — pressed — becomes more precise: "21:05 and forty seconds." What does the added precision tell you?',
          choices: [
            'The account is reliable; precision indicates confidence.',
            'The precision is likely constructed to satisfy the question, so treat it as unprompted vs prompted evidence.',
            'The driver is definitely lying.',
            'Nothing — precision is unrelated to reliability.'
          ],
          a: 1,
          e: 'Spontaneous precision carries its own reliability signal; prompted precision does not. The interesting question is not whether the number is right but why it appeared only after pressure — which tells you the original claim was not anchored to anything.'
        },
        {
          skill: 'critical',
          tag: 'Critical Thinking',
          q: 'If the vehicle exited at 21:26 and the route is fourteen minutes, the earliest arrival is 21:40 — inside the window. What is the strongest warranted conclusion?',
          choices: [
            'The delivery should have succeeded, so someone is lying.',
            'The delay is not explained by the exit timestamp alone; the remaining gap needs a cause.',
            'The route estimate must be wrong.',
            'The driver is exonerated.'
          ],
          a: 1,
          e: 'The arithmetic produces a feasible arrival, which rules out "left too late" as a complete explanation. Something else consumes the margin. The conclusion is not exoneration or accusation — it is that the current model is incomplete and must be extended.'
        },
        {
          skill: 'observation',
          tag: 'Observation',
          q: 'You have one remaining minute. What single observation would most reduce the remaining uncertainty?',
          choices: [
            'Ask the driver to recount the route from memory.',
            'Check whether the delivery window\'s closing alarm was logged or manually overridden.',
            'Re-read the dispatch log entry.',
            'Ask the colleague to finish the story about the earlier incident.'
          ],
          a: 1,
          e: 'A logged or overridden alarm is a hard, timestamped datum that no one has to remember or report — and an override implies human involvement, which would restructure the entire hypothesis space. It is the highest-information observation available in the time remaining.'
        }
      ],
      debrief: 'Advanced cases compress the time budget so that the failure mode is no longer knowledge but prioritisation. Under eight minutes, the winning strategy is: check that your instruments agree, externalise the data immediately, refuse the tangent, and spend the last observation on the datum nobody has to remember.'
    },

    {
      id: 'case-witness',
      title: 'The Contradictory Witness',
      diff: 'Standard',
      blurb: 'Two honest accounts that disagree — where the problem is not deception but calibration.',
      narrative: 'Two people describe the same event. Neither has any incentive to lie. Witness A says the exchange happened "just after lunch, maybe one o\'clock" and describes the other party as "tall, dark hair". Witness B says it was "closer to four, definitely after three" and describes the party as "average height, lighter hair, wearing a grey coat". Both are certain. A building log records a delivery at 13:07 and a second delivery at 16:02. You must decide what happened and how confident to be.',
      questions: [
        {
          skill: 'critical',
          tag: 'Critical Thinking',
          q: 'Both witnesses are honest and both are certain. What is the correct starting position?',
          choices: [
            'One must be mistaken about a detail that matters.',
            'They may be describing different moments of the same extended event, or different events.',
            'Certainty in both indicates that neither is reliable.',
            'The delivery log arbitrates between them.'
          ],
          a: 1,
          e: 'Honesty plus certainty plus contradiction does not force error — it forces a search for a reconciling frame before an error frame. Accounts that describe different moments of one episode resolve the contradiction without anyone being wrong.'
        },
        {
          skill: 'observation',
          tag: 'Observation',
          q: 'Both describe clothing inconsistently — but only one mentions a grey coat at all. How should a single mentioned detail be weighted?',
          choices: [
            'Heavily — distinctive clothing is a high-salience observation.',
            'By what it would take to notice: a coat is removable, so its presence in one account and absence in the other may be entirely consistent.',
            'Not at all; absence of mention is absence of evidence.',
            'As evidence that the two accounts describe different people.'
          ],
          a: 1,
          e: 'Absence of mention and mention of absence are different. A coat can be removed between observations. The correct move is to test the physical consistency of the detail rather than treat it as a contradiction — this is observation applied to an account rather than to a scene.'
        },
        {
          skill: 'memory',
          tag: 'Working Memory',
          q: 'You need to compare four attributes across two accounts plus two log entries. What is the safe procedure?',
          choices: [
            'Compare them mentally, attribute by attribute, in sequence.',
            'Build a two-column comparison before drawing any conclusion about consistency.',
            'Hold Witness A\'s account and check it against B as you go.',
            'Reduce to the single most important attribute.'
          ],
          a: 1,
          e: 'Attribute-by-attribute mental comparison is where transposition errors occur. A written matrix makes the consistency judgement structural rather than a memory task — and reduces the load enough that the reconciling hypothesis has room to surface.'
        },
        {
          skill: 'social',
          tag: 'Social Cognition',
          q: 'Witness A becomes visibly uncomfortable when you ask about the time but not when you ask about appearance. What does that asymmetry suggest?',
          choices: [
            'They are lying about the time.',
            'The time is the part of their account they are least confident in — an internal signal about confidence, not necessarily about honesty.',
            'They are lying about the appearance.',
            'Nothing; discomfort is not evidence.'
          ],
          a: 1,
          e: 'Different discomfort across questions localises uncertainty within an account rather than condemning the account. The useful consequence is procedural: spend your scarce follow-up time on the time question, not the appearance question.'
        },
        {
          skill: 'focus',
          tag: 'Deep Focus',
          q: 'You have found a reconciliation for the time contradiction. What is the disciplined next step?',
          choices: [
            'Announce the reconciliation and close the matter.',
            'Hold the reconciliation as a provisional frame and actively test it against the remaining evidence.',
            'Move on to the appearance contradiction, which is now less important.',
            'Restate the reconciliation to confirm it.'
          ],
          a: 1,
          e: 'Finding a frame that fits is the moment attention is most at risk — the mind wants to stop. The discipline is to keep the frame provisional and deliberately hunt for the evidence that would break it before letting go.'
        },
        {
          skill: 'critical',
          tag: 'Critical Thinking',
          q: 'After all tests, both witnesses remain partly right and partly wrong. What is the most accurate report?',
          choices: [
            'A single account that the evidence best supports, with confidence stated and unresolved details flagged.',
            'Both accounts presented side by side with no conclusion.',
            'The account that matched the log, presented as established.',
            'A statement that the witnesses are unreliable and the matter cannot be determined.'
          ],
          a: 0,
          e: 'The output of an investigation is a weighted account with an explicit confidence level and an explicit list of what remains open — not neutrality, and not false certainty. Stating what is unresolved is itself a finding.'
        }
      ],
      debrief: 'This case contains no deception, which removes the easiest strategy. What remains is calibration: weighting details by how they would actually be observed, localising uncertainty instead of judging people, and resisting the urge to stop the moment a frame fits.'
    },

    {
      id: 'case-brief',
      title: 'The Eight-Minute Briefing',
      diff: 'Advanced',
      blurb: 'All five abilities under a hard deadline with deliberately interleaved demands.',
      narrative: 'You have eight minutes to brief a principal on a situation they know nothing about. Available to you: a one-page incident summary with two internal inconsistencies; a photograph in which one claimed element is not visible; a phone log showing an unexplained four-hour gap; and a stakeholder who will speak to you only for two minutes and has already signalled they are being evasive. The briefing begins in eight minutes and cannot be postponed. You must produce a recommendation, not just a summary.',
      questions: [
        {
          skill: 'focus',
          tag: 'Deep Focus',
          q: 'Eight minutes. Four inputs. What is the correct first decision?',
          choices: [
            'Survey all four inputs for two minutes each, then synthesise.',
            'Decide the recommendation structure first, then gather only what fills it.',
            'Start with the incident summary, since it is the most complete.',
            'Take the stakeholder meeting first, since it is the only time-limited input.'
          ],
          a: 1,
          e: 'With a fixed and short deadline, the structure of the output determines what is worth reading. Reading first and synthesising later guarantees you will have consumed everything and integrated nothing — the classic failure under time pressure.'
        },
        {
          skill: 'observation',
          tag: 'Observation',
          q: 'The photograph is cited as showing an element that is not in fact visible in it. What is the correct handling?',
          choices: [
            'Treat the citation as an error and discount the photograph entirely.',
            'Record the specific mismatch precisely — what was claimed, what is actually visible, and at what position.',
            'Assume the photograph has been altered.',
            'Ask the person who cited it what they meant, and rely on their answer.'
          ],
          a: 1,
          e: 'The precise mismatch is the datum. It may be an error, a crop, a different photograph, or an alteration — but only a precise record of what is present versus what was claimed lets you test any of those. The observation must be made before any interpretation.'
        },
        {
          skill: 'memory',
          tag: 'Working Memory',
          q: 'You must hold the recommendation structure, two inconsistencies, one photo mismatch, one phone-log gap and a two-minute stakeholder window. What must be externalised first?',
          choices: [
            'The recommendation structure, since it is the frame.',
            'The four raw facts, since they are the most easily lost.',
            'The stakeholder questions you intend to ask.',
            'Nothing — eight minutes is short enough to hold it all.'
          ],
          a: 1,
          e: 'The frame is one item and is easy to reconstruct; four raw facts with specific numbers are several items and are not. Externalise what would cost most to lose, in the order you would lose it.'
        },
        {
          skill: 'social',
          tag: 'Social Cognition',
          q: 'The stakeholder has signalled evasiveness and has two minutes. What question format extracts the most?',
          choices: [
            'An open question: "What happened?"',
            'A direct accusation followed by a denial you can test.',
            'A narrow, checkable question with an embedded alternative, then a follow-up on whichever branch they take.',
            'Two open questions and let them choose which to answer.'
          ],
          a: 2,
          e: 'Under a two-minute budget, open questions waste the window on framing. A narrow question with a built-in alternative forces a specific commitment that you already have a way to check — and the branch they decline to take is itself informative.'
        },
        {
          skill: 'critical',
          tag: 'Critical Thinking',
          q: 'All four inputs point the same way, but each individually is weak. What do you tell the principal?',
          choices: [
            'That the evidence is strong, because four sources agree.',
            'That four weak, independent indicators converge — and name which is strongest and what would change your mind.',
            'That the evidence is insufficient and no recommendation can be made.',
            'That you need more time.'
          ],
          a: 1,
          e: 'Convergence of independent weak indicators is genuinely meaningful — but only if they are independent, and only if you say what you would need to see to abandon it. Presenting it as "four sources agree" without stating independence and falsification overstates the finding.'
        },
        {
          skill: 'focus',
          tag: 'Deep Focus',
          q: 'With two minutes left, a new inconsistency appears in the summary. What do you do?',
          choices: [
            'Investigate it — it may change the recommendation.',
            'Acknowledge it explicitly as unresolved in the briefing and proceed with the recommendation.',
            'Drop the new inconsistency from consideration entirely.',
            'Delay the briefing to resolve it.'
          ],
          a: 1,
          e: 'This is where selective attention and honesty converge. The new detail must not hijack the remaining budget, but silently omitting it would corrupt the record. Naming it as open costs four seconds and preserves the integrity of the recommendation.'
        }
      ],
      debrief: 'This is the integration test: every question deliberately requires one skill while the constraint — eight minutes — attacks another. The pattern that separates strong performances is always the same: structure first, externalise the perishable facts, ask narrow questions, and state what remains unresolved.'
    }
  ];

  /* ==================================================================
     Radar / attribution chart
     ================================================================== */
  function radarSVG(scores) {
    var keys = Object.keys(SKILL_REF);
    var n = keys.length;
    var cx = 150, cy = 150, R = 100;

    function pt(i, r) {
      var ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
    }

    var out = '<svg viewBox="0 0 300 300" role="img" aria-label="Skill attribution radar">';
    /* rings */
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      var pts = [];
      for (var i = 0; i < n; i++) pts.push(pt(i, R * f).join(','));
      out += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="var(--border-soft)" stroke-width="1"/>';
    });
    /* spokes */
    for (var i = 0; i < n; i++) {
      var p = pt(i, R);
      out += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" stroke="var(--border-soft)" stroke-width="1"/>';
    }
    /* data polygon */
    var dataPts = keys.map(function (k, i) { return pt(i, R * ((scores[k] || 0) / 100)); });
    out += '<polygon points="' + dataPts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') +
      '" fill="color-mix(in srgb, var(--gold) 26%, transparent)" stroke="var(--gold)" stroke-width="2" stroke-linejoin="round"/>';
    dataPts.forEach(function (p) {
      out += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4" fill="var(--gold)" stroke="var(--bg-base)" stroke-width="2"/>';
    });
    /* labels */
    for (var j = 0; j < n; j++) {
      var lp = pt(j, R + 26);
      out += '<text x="' + lp[0].toFixed(1) + '" y="' + lp[1].toFixed(1) + '" text-anchor="middle" dominant-baseline="middle" ' +
        'font-family="var(--font-mono)" font-size="11" letter-spacing="1.4" fill="var(--text-muted)">' + SKILL_REF[keys[j]].abbr + '</text>';
    }
    out += '</svg>';
    return out;
  }

  /* ==================================================================
     Scoring
     ================================================================== */
  function caseScore(answers) {
    var bySkill = {}, right = 0;
    Object.keys(SKILL_REF).forEach(function (k) { bySkill[k] = { c: 0, t: 0 }; });
    answers.forEach(function (a) {
      bySkill[a.skill].t++;
      if (a.ok) { bySkill[a.skill].c++; right++; }
    });
    var pctOverall = SK.pct(right, answers.length);
    var perSkill = {};
    Object.keys(bySkill).forEach(function (k) {
      perSkill[k] = bySkill[k].t ? SK.pct(bySkill[k].c, bySkill[k].t) : null;
    });
    return { overall: pctOverall, perSkill: perSkill, right: right, total: answers.length, bySkill: bySkill };
  }

  function applyReport(score) {
    /* Practical score blends the case result with the observed training level of each core */
    var detail = { attempts: score.total, correct: score.right };
    SK.record('practical', score.overall, detail);

    /* Per-skill attribution nudges each core's recorded best — the report must feed back */
    Object.keys(score.perSkill).forEach(function (k) {
      if (score.perSkill[k] === null) return;
      var p = SK.state.progress[k] || { best: 0, sessions: 0, attempts: 0, correct: 0, last: 0 };
      /* practical application evidence counts as one supervised observation */
      p.last = Date.now();
      SK.state.progress[k] = p;
    });
    SK.save();
    SK.computeIndex();
  }

  function weakSkills(score) {
    return Object.keys(score.perSkill)
      .filter(function (k) { return score.perSkill[k] !== null; })
      .sort(function (a, b) { return score.perSkill[a] - score.perSkill[b]; })
      .slice(0, 2);
  }

  function verdictText(score) {
    var weak = weakSkills(score);
    var names = weak.map(function (k) { return '<b>' + SKILL_REF[k].label + '</b>'; }).join(' and ');
    if (score.overall >= 85) {
      return '<p>Strong integration. All five abilities are being deployed in the right order under pressure, and the seams between them are not showing. Push into harder cases or tighten the time budget to keep the margin.</p>';
    }
    if (score.overall >= 65) {
      return '<p>Working integration with identifiable drag. The weakest link in this scenario was ' + names + ' — and because the case interleaves the abilities, weakness there propagates into the others.</p>' +
        '<ul><li>Return to that module and run two sessions before attempting another case.</li><li>Re-attempt this case file to confirm the gain transfers.</li></ul>';
    }
    if (score.overall >= 40) {
      return '<p>The abilities exist in isolation but are not yet combining reliably under realistic conditions. The clearest deficits were ' + names + '.</p>' +
        '<ul><li>Train the two weakest modules first — assessment will keep returning the same answer until they move.</li><li>Re-attempt only after both show a higher best score on their own module pages.</li></ul>';
    }
    return '<p>Integration is not yet established: under realistic conditions the abilities are being applied one at a time, or not at all. This is normal early on and is exactly what the practical layer is designed to reveal.</p>' +
      '<ul><li>Work through the five core modules once each, in order.</li><li>Return to a Standard case before attempting Advanced.</li></ul>';
  }

  /* ==================================================================
     Case runner
     ================================================================== */
  function runCase(host, caseFile, onDone) {
    var i = 0, answers = [];
    var stage = el(
      '<div class="stage" style="--tone:var(--gold)">' +
        '<div class="stage-label"><span>' + esc(caseFile.title) + '</span><span class="lvl" data-lvl>Question 1 / ' + caseFile.questions.length + '</span></div>' +
        '<div class="prog" style="margin-bottom:14px"></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var prog = stage.querySelector('.prog');
    var body = stage.querySelector('.body');

    function render() {
      if (i >= caseFile.questions.length) return finish();
      var q = caseFile.questions[i];
      var ref = SKILL_REF[q.skill];
      lvl.textContent = 'Question ' + (i + 1) + ' / ' + caseFile.questions.length;
      prog.innerHTML = SK.dotsHTML(answers.map(function (a) { return a.ok; }), i);

      var w = el('<div class="pop">' +
        '<span class="q-tag" style="--qt:var(--' + ref.tone + ')"><span class="d"></span>' + esc(q.tag) + '</span>' +
        '<p class="prompt">' + esc(q.q) + '</p><div class="choices"></div></div>');
      body.innerHTML = '';
      body.appendChild(w);

      var ch = w.querySelector('.choices');
      q.choices.forEach(function (c, ci) {
        var b = el('<button class="choice" type="button" style="--tone:var(--' + ref.tone + ')"><span class="key">' + String.fromCharCode(65 + ci) + '</span><span>' + esc(c) + '</span></button>');
        b.addEventListener('click', function () {
          var ok = ci === q.a;
          SK.$$('.choice', ch).forEach(function (x, xi) {
            x.disabled = true;
            if (xi === q.a) x.classList.add('correct');
            else if (xi === ci) x.classList.add('wrong');
            else x.classList.add('dim');
          });
          answers.push({ skill: q.skill, ok: ok });
          w.appendChild(el('<div class="feedback ' + (ok ? 'good' : 'bad') + '">' +
            '<span class="fb-title">' + (ok ? 'Correct' : 'Missed') + ' · ' + esc(q.tag) + '</span>' +
            '<b>' + esc(q.choices[q.a]) + '</b> — ' + q.e + '</div>'));
          var nb = el('<button class="btn btn-primary" type="button">' +
            (i >= caseFile.questions.length - 1 ? 'Submit report' : 'Next question') + ' →</button>');
          nb.addEventListener('click', function () { i++; render(); });
          w.appendChild(el('<div class="stage-actions"></div>')).appendChild(nb);
          prog.innerHTML = SK.dotsHTML(answers.map(function (a) { return a.ok; }), answers.length);
        });
        ch.appendChild(b);
      });
    }

    function finish() {
      var score = caseScore(answers);
      applyReport(score);
      lvl.textContent = 'Report ready';
      prog.innerHTML = SK.dotsHTML(answers.map(function (a) { return a.ok; }), -1);

      var weak = weakSkills(score);
      body.innerHTML = '';

      var report = el('<div class="pop"></div>');
      report.appendChild(el(
        '<div class="radar-wrap">' +
          '<div>' +
            '<div class="eyebrow" style="margin-bottom:10px">Skill attribution</div>' +
            radarSVG(score.perSkill) +
            '<p class="muted" style="font-size:.72rem;text-align:center;margin-top:6px">Each axis = one core ability\'s score on this case file</p>' +
          '</div>' +
          '<div>' +
            '<div class="eyebrow" style="margin-bottom:14px">Performance by ability</div>' +
            '<div class="skill-bars"></div>' +
          '</div>' +
        '</div>'
      ));

      var bars = report.querySelector('.skill-bars');
      Object.keys(SKILL_REF).forEach(function (k) {
        var ref = SKILL_REF[k];
        var v = score.perSkill[k];
        bars.appendChild(el(
          '<div class="sbar"><div class="top"><b>' + ref.label + '</b><span>' + (v === null ? '—' : v + '%') + '</span></div>' +
          '<div class="track"><i style="width:0%;background:linear-gradient(90deg, var(--' + ref.tone + '), color-mix(in srgb, var(--' + ref.tone + ') 55%, var(--gold)))" data-w="' + (v || 0) + '"></i></div></div>'
        ));
      });
      setTimeout(function () {
        SK.$$('.track i', bars).forEach(function (n) { n.style.width = n.dataset.w + '%'; });
      }, 80);

      report.appendChild(el(
        '<div style="text-align:center;margin-top:24px">' +
          '<div class="eyebrow" style="margin-bottom:8px">Case result</div>' +
          '<div style="font-family:var(--font-display);font-size:3rem;font-weight:800;color:var(--gold);line-height:1">' +
            score.overall + '<small style="font-size:1rem;color:var(--text-muted)">/100</small></div>' +
          '<p class="muted" style="font-size:.82rem;margin-top:6px">' + score.right + ' of ' + score.total + ' decisions correct</p>' +
        '</div>'
      ));

      report.appendChild(el('<div class="verdict"><h4>Debrief</h4><p>' + esc(caseFile.debrief) + '</p></div>'));
      report.appendChild(el('<div class="verdict" style="border-color:color-mix(in srgb, var(--' + (weak[0] ? SKILL_REF[weak[0]].tone : 'gold') + ') 40%, transparent);background:color-mix(in srgb, var(--' + (weak[0] ? SKILL_REF[weak[0]].tone : 'gold') + ') 8%, transparent)">' +
        '<h4 style="color:var(--' + (weak[0] ? SKILL_REF[weak[0]].tone : 'gold') + ')">What to do next</h4>' + verdictText(score) + '</div>'));

      var actions = el('<div class="result-actions" style="justify-content:flex-start;margin-top:22px"></div>');
      var retry = el('<button class="btn btn-ghost" type="button">Re-run this case</button>');
      retry.addEventListener('click', function () { i = 0; answers = []; render(); });
      var back = el('<button class="btn btn-gold" type="button">Choose another case file</button>');
      back.addEventListener('click', function () { onDone(null); });
      actions.appendChild(back); actions.appendChild(retry);
      report.appendChild(actions);

      body.appendChild(report);
      onDone({ id: caseFile.id, score: score.overall });
    }

    render();
  }

  /* ==================================================================
     Overview: case list + system report
     ================================================================== */
  function renderOverview(host, onStart) {
    var wrap = el('<div class="app-main"></div>');

    /* System readiness panel */
    var trained = SK.CORE.filter(function (k) { return SK.state.progress[k]; });
    var readiness = el(
      '<div class="panel" style="--tone:var(--gold)">' +
        '<div class="panel-head"><div><span class="kicker">Integration status</span><h2>Are you ready to be assessed?</h2></div>' +
        '<span class="chip ' + (trained.length === 5 ? 'on' : '') + '">' + trained.length + ' / 5 core modules trained</span></div>' +
        '<p class="muted" style="font-size:.87rem">Practical implementation does not teach a skill. It measures how well the five you have trained <b style="color:var(--text-primary)">combine</b> when a real situation refuses to arrive labelled by difficulty.</p>' +
        '<div class="skill-bars" style="margin-top:18px"></div>' +
        (trained.length < 5
          ? '<div class="feedback" style="margin-top:16px"><span class="fb-title">Recommendation</span>You have not yet trained: <b>' +
            SK.CORE.filter(function (k) { return !SK.state.progress[k]; }).map(function (k) { return SKILLS[k].short; }).join('</b>, <b>') +
            '</b>. You may proceed, but the report will attribute everything to a small sample.</div>'
          : '<div class="feedback good" style="margin-top:16px"><span class="fb-title">All cores trained</span>Every core ability has a recorded baseline. The attribution below will be meaningful — proceed to a case file.</div>') +
      '</div>'
    );
    var sbars = wrap.appendChild(readiness).querySelector('.skill-bars');
    SK.CORE.forEach(function (k) {
      var v = SK.scoreOf(k);
      var ref = SKILL_REF[k];
      sbars.appendChild(el(
        '<div class="sbar"><div class="top"><b>' + ref.label + '</b><span>' + (v ? v : 'not trained') + '</span></div>' +
        '<div class="track"><i style="width:' + v + '%;background:var(--' + ref.tone + ')"></i></div></div>'
      ));
    });

    /* Case file list */
    var list = el(
      '<div class="panel" style="--tone:var(--gold)">' +
        '<div class="panel-head"><div><span class="kicker">Assessment files</span><h2>Choose a case file</h2></div></div>' +
        '<p class="muted" style="font-size:.87rem;margin-bottom:18px">Each file interleaves all five abilities across six decisions. Your result is reported per ability, so a weak score points directly back at the module that produced it.</p>' +
        '<div class="case-list"></div>' +
      '</div>'
    );
    var caseHost = list.querySelector('.case-list');
    CASES.forEach(function (c, ci) {
      var done = SK.state.completed[c.id];
      var b = el('<button class="case-pick ' + (done ? 'done' : '') + '" type="button">' +
        '<span class="idx">' + (done ? '✓' : (ci + 1)) + '</span>' +
        '<span class="txt"><b>' + esc(c.title) + '</b><span>' + esc(c.blurb) + '</span></span>' +
        '<span class="diff">' + esc(c.diff) + '</span>' +
        (done && SK.state.completed[c.id + '.score'] !== undefined
          ? '<span class="diff" style="border-color:var(--gold);color:var(--gold)">' + SK.state.completed[c.id + '.score'] + '</span>' : '') +
        '</button>');
      b.addEventListener('click', function () { onStart(c); });
      caseHost.appendChild(b);
    });
    wrap.appendChild(list);

    /* Debrief on method */
    wrap.appendChild(el(
      '<div class="panel" style="--tone:var(--gold)">' +
        '<div class="panel-head"><div><span class="kicker">How attribution works</span><h2>Why every question is tagged</h2></div></div>' +
        '<p style="font-size:.88rem">A question tagged <b style="color:var(--cyan)">Observation</b> is engineered so that it fails if your observation is weak — regardless of how strong your reasoning is. That is what makes the report useful: a low score is not "you did badly", it is "this specific ability was the constraint".</p>' +
        '<p style="font-size:.88rem">Because the five abilities are interleaved rather than blocked, a weakness in one degrades the others. That propagation <i>is</i> the measurement. The Sherlockian Skill is the integration, and this is where the integration is tested.</p>' +
        '<div class="chips" style="margin-top:16px">' +
          Object.keys(SKILL_REF).map(function (k) {
            return '<span class="chip" style="border-color:color-mix(in srgb,var(--' + SKILL_REF[k].tone + ') 45%,transparent);color:var(--' + SKILL_REF[k].tone + ')">' +
              SKILL_REF[k].abbr + ' · ' + SKILL_REF[k].label + '</span>';
          }).join('') +
        '</div>' +
      '</div>'
    ));

    host.appendChild(wrap);
  }

  /* ==================================================================
     Route
     ================================================================== */
  SK.registerRoute('practical', function (view) {
    var s = SKILLS.practical;
    view.appendChild(el(SK.appHead(s)));

    var wrap = el('<div class="wrap" style="padding-top:0"></div>');
    var layout = el('<div class="app-layout"></div>');
    var main = el('<div class="app-main"></div>');
    layout.appendChild(main);
    wrap.appendChild(layout);
    view.appendChild(wrap);

    var host = el('<div></div>');
    main.appendChild(host);

    function showOverview() {
      host.innerHTML = '';
      renderOverview(host, function (c) { showCase(c); });
      buildRail();
      SK.updateIndexUI();
    }

    function showCase(c) {
      host.innerHTML = '';
      var head = el('<div class="case-file">' +
        '<div class="case-head"><div><span class="ref">Case file · ' + esc(c.diff) + '</span><h2>' + esc(c.title) + '</h2></div>' +
        '<button class="btn btn-ghost btn-sm" data-back type="button">← All case files</button></div>' +
        '<div class="case-body"><div class="case-narrative">' + esc(c.narrative) + '</div></div></div>');
      head.querySelector('[data-back]').addEventListener('click', showOverview);
      host.appendChild(head);

      var runner = el('<div class="case-body" style="padding-top:0"></div>');
      head.querySelector('.case-body').appendChild(runner);

      runCase(runner, c, function (result) {
        if (result) {
          /* record only — the debrief report must stay on screen until
             the user chooses to leave it */
          SK.state.completed[c.id] = true;
          SK.state.completed[c.id + '.score'] = result.score;
          SK.save();
          SK.updateIndexUI();
        } else {
          showOverview();
        }
      });
    }

    /* rail — rebuilt whenever the overview is shown so its stats stay live */
    function buildRail() {
      var stale = layout.querySelector('.app-rail');
      if (stale) stale.parentNode.removeChild(stale);

      var railEl = el('<div class="app-rail"></div>');
      railEl.appendChild(el(SK.progressBar(SK.state.progress.practical)));

      var linkPanel = el('<div class="panel" style="--tone:var(--gold)"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:12px">Train the inputs first</span><div class="chips" id="pLinks"></div></div>');
      var lc = linkPanel.querySelector('#pLinks');
      ['critical', 'observation', 'memory', 'focus', 'social'].forEach(function (id) {
        var o = SKILLS[id];
        var c = el('<a class="chip" href="#/' + id + '" style="cursor:pointer">' + esc(o.short) + '</a>');
        c.addEventListener('mouseenter', function () { c.classList.add('on'); c.style.setProperty('--tone', 'var(--' + o.tone + ')'); });
        c.addEventListener('mouseleave', function () { c.classList.remove('on'); });
        lc.appendChild(c);
      });
      railEl.appendChild(linkPanel);

      var doneCount = Object.keys(SK.state.completed).filter(function (k) { return k.indexOf('.score') === -1; }).length;
      var completedList = el('<div class="panel" style="--tone:var(--gold)"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:10px">Cases completed</span>' +
        '<div class="val" style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--text-primary)">' +
        doneCount + ' <small style="font-size:.72rem;color:var(--text-muted);font-family:var(--font-mono)">/ ' + CASES.length + '</small></div>' +
        '<div class="meter" style="margin-top:9px"><i style="width:' +
        Math.round((doneCount / CASES.length) * 100) +
        '%"></i></div></div>');
      railEl.appendChild(completedList);

      layout.appendChild(railEl);
    }

    showOverview();
  });

  window.CASE_FILES = CASES;
})();
