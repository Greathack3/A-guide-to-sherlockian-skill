/* ==========================================================================
   apps/critical.js — Critical Thinking Skills
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el;

  /* ------------------------------------------------------------------
     Exercise A — Fallacy identification
     ------------------------------------------------------------------ */
  var FALLACIES = [
    { name: 'Ad hominem', d: 'Attacks the person making the claim rather than the claim itself.' },
    { name: 'Straw man', d: 'Misrepresents an opponent\'s position so it is easier to knock down.' },
    { name: 'Appeal to authority', d: 'Treats a person\'s status as proof, even outside their expertise.' },
    { name: 'False dilemma', d: 'Presents two options as the only possibilities when more exist.' },
    { name: 'Post hoc', d: 'Assumes that because B followed A, A caused B.' },
    { name: 'Circular reasoning', d: 'Uses the conclusion as one of its own premises.' },
    { name: 'Hasty generalisation', d: 'Draws a broad conclusion from a sample that is too small or unrepresentative.' },
    { name: 'Red herring', d: 'Introduces an irrelevant topic to divert attention from the real issue.' },
    { name: 'Slippery slope', d: 'Claims one step will inevitably trigger an extreme chain of consequences.' },
    { name: 'Tu quoque', d: 'Dismisses a criticism by pointing out that the accuser is guilty of it too.' },
    { name: 'Composition', d: 'Assumes what is true of a part must be true of the whole.' },
    { name: 'No true Scotsman', d: 'Protects a generalisation by redefining the category to exclude counter-examples.' }
  ];

  function fallacyItems() {
    var statements = [
      { t: '"You cannot trust Dr. Ellery\'s climate paper — he was caught inflating his citation count ten years ago."', a: 'Ad hominem',
        e: 'The misconduct claim, even if true, says nothing about whether the current paper\'s methods are sound. The argument substitutes character for evidence.' },
      { t: '"My opponent wants to reduce class sizes. So apparently he wants to bankrupt the state and put every teacher out of work."', a: 'Straw man',
        e: 'The position being argued against ("reduce class sizes") has been replaced by a far more extreme one that was never held.' },
      { t: '"After I started wearing this pendant, my migraines stopped. The pendant clearly works."', a: 'Post hoc',
        e: 'Sequence is not causation. Without a control, regression to the mean and coincidental improvement are unexamined alternatives.' },
      { t: '"Either we cut the entire archives budget, or we accept that the city cannot afford a library at all."', a: 'False dilemma',
        e: 'Many intermediate options exist — partial reductions, alternative funding, phased cuts. Presenting only two is a manipulation of the choice set.' },
      { t: '"The report must be accurate; it is published by the Bureau of Records, and the Bureau is by definition authoritative on records."', a: 'Circular reasoning',
        e: 'The conclusion ("the report is accurate") is assumed by the premise ("the Bureau is authoritative"), which is itself the thing requiring proof.' },
      { t: '"I interviewed four new arrivals and all four preferred the old market. Clearly the whole town prefers the old market."', a: 'Hasty generalisation',
        e: 'Four self-selected interviews cannot support a town-wide claim; the sample is both small and unrepresentative.' },
      { t: '"You argue we should publish fewer papers? Funny, given your own lab published eleven last year."', a: 'Tu quoque',
        e: 'Pointing out hypocrisy does not address the argument. The proposal stands or falls on its merits regardless of the accuser\'s record.' },
      { t: '"Senator Whyte is a decorated economist, so his opinion on nuclear safety regulations should settle the matter."', a: 'Appeal to authority',
        e: 'Expertise does not transfer across domains. Economics credentials confer no special reliability on reactor engineering.' },
      { t: '"If we allow late submissions this once, next term nobody will submit anything on time and standards will collapse entirely."', a: 'Slippery slope',
        e: 'The chain from one exception to total collapse is asserted rather than evidenced.' },
      { t: '"We should discuss the courier\'s missing package. Anyway, have you seen the weather we are having?"', a: 'Red herring',
        e: 'The weather is irrelevant to the missing package; it changes the subject without addressing it.' },
      { t: '"Small local shops are friendlier, so the entire retail sector should be run by small local shops."', a: 'Composition',
        e: 'A property true of individual members does not automatically hold for the aggregate, which has different constraints.' },
      { t: '"No real cyclist would ever use an e-bike."', a: 'No true Scotsman',
        e: 'The category "real cyclist" is being redefined on the spot to exclude inconvenient counter-examples.' }
    ];

    var pool = SK.shuffle(statements).slice(0, 8);
    return pool.map(function (s) {
      var wrong = SK.shuffle(FALLACIES.filter(function (f) { return f.name !== s.a; })).slice(0, 3);
      var choices = SK.shuffle([{ name: s.a }].concat(wrong));
      return {
        tag: 'Name the flaw',
        prompt: esc(s.t),
        choices: choices.map(function (c) { return c.name + ' — ' + c.d; }),
        answer: choices.findIndex(function (c) { return c.name === s.a; }),
        explain: s.e,
        hint: '<b>' + s.a + '.</b> ' + (FALLACIES.filter(function (f) { return f.name === s.a; })[0] || {}).d
      };
    });
  }

  /* ------------------------------------------------------------------
     Exercise B — Argument autopsy (identify conclusion & premises)
     ------------------------------------------------------------------ */
  function autopsyItems() {
    var args = [
      {
        text: 'The vault was opened from inside the building. The only two keys were held by the curator and the night guard. The guard has confessed to being outside the city that night. Therefore the curator opened the vault.',
        q: 'What is the conclusion of this argument?',
        choices: ['The vault was opened from inside the building.', 'The only two keys were held by the curator and the night guard.', 'Therefore the curator opened the vault.', 'The guard confessed to being outside the city.'],
        a: 2,
        e: 'The conclusion is the claim the other sentences are offered to support — signalled by "therefore". Everything before it is offered as grounds.',
        tips: 'Ask: which sentence would be denied if the whole argument were rejected? That is the conclusion.'
      },
      {
        text: 'Every ledger signed by Halloway bears a faint blue fibre. This ledger bears a faint blue fibre. So this ledger was signed by Halloway.',
        q: 'Which sentence is the argument trying to prove?',
        choices: ['Every ledger signed by Halloway bears a faint blue fibre.', 'This ledger bears a faint blue fibre.', 'So this ledger was signed by Halloway.', 'None of these — the argument proves nothing.'],
        a: 2,
        e: 'The final sentence is the conclusion. Note, though, that the reasoning is invalid: the form is "all A are B; this is B; therefore this is A" — affirming the consequent.',
        tips: 'Always separate two questions: what is being argued, and whether the argument works. The first is anatomy, the second is evaluation.'
      },
      {
        text: 'If the train had been on time, we would have arrived before dark. We did not arrive before dark. So the train was not on time.',
        q: 'Identify the structure. This argument is:',
        choices: ['Valid — the conclusion follows necessarily from the premises.', 'Invalid — it attacks the person rather than the claim.', 'Invalid — it assumes its own conclusion.', 'Undecidable without knowing the timetable.'],
        a: 0,
        e: 'This is modus tollens: if P then Q; not Q; therefore not P. The structure guarantees a true conclusion when the premises are true.',
        tips: 'Validity is about form, not content. Replace the sentences with letters — if the letters work in every arrangement, the form is valid.'
      },
      {
        text: 'The note was written by someone in a hurry — the ink blots, the letters slant, the address is truncated. It was therefore written by the defendant, who was known to be in a hurry that evening.',
        q: 'What is the weakest link here?',
        choices: ['The premise about ink blots.', 'The leap from "written in a hurry" to "written by the defendant".', 'The observation that the address is truncated.', 'There is no weak link; the argument is deductively valid.'],
        a: 1,
        e: 'Being in a hurry is shared by many people. The argument moves from a general trait to a specific author without excluding anyone else who was also hurried.',
        tips: 'Ask: does anything rule out the alternatives? If not, you have likelihood, not identification.'
      },
      {
        text: 'Nine of the ten samples tested positive. The tenth returned an inconclusive reading. Therefore the method is unreliable.',
        q: 'What is the conclusion, and what is wrong with it?',
        choices: ['Conclusion: nine samples tested positive. Wrong: positive results may be false.', 'Conclusion: the tenth sample was inconclusive. Wrong: nothing — that is simply reported.', 'Conclusion: the method is unreliable. Wrong: one inconclusive result out of ten suggests high reliability.', 'Conclusion: the method is unreliable. Wrong: the argument is circular.'],
        a: 2,
        e: 'A single inconclusive reading in ten is a 90% resolution rate. The conclusion contradicts the evidence offered in its own premises.',
        tips: 'Check whether the premises actually point where the conclusion claims — many bad arguments are internally mismatched rather than formally invalid.'
      }
    ];

    return SK.shuffle(args).map(function (x) {
      return {
        tag: 'Argument autopsy',
        prompt: '<span style="display:block;font-weight:500;font-size:.93rem;color:var(--text-secondary);font-family:var(--font-body);line-height:1.7;border-left:2px solid var(--amber);padding-left:16px;margin-bottom:4px">' + esc(x.text) + '</span>' + esc(x.q),
        choices: x.choices,
        answer: x.a,
        explain: x.e,
        hint: x.tips
      };
    });
  }

  /* ------------------------------------------------------------------
     Exercise C — Evidence weighting (pick the strongest / weakest)
     ------------------------------------------------------------------ */
  function evidenceItems() {
    var sets = [
      {
        stem: 'A rare manuscript was sold as authentic. Which piece of evidence weighs MOST strongly in favour of authenticity?',
        choices: [
          'A respected dealer described it as "beautiful and quite convincing".',
          'Radiocarbon dating of the vellum places it in the correct period, and the ink chemistry matches period recipes.',
          'The seller seemed sincere and answered every question without hesitation.',
          'It looks very much like two other manuscripts already in the museum.'
        ],
        a: 1,
        e: 'Independent physical tests with known error rates are far stronger than testimony, resemblance or impressions of sincerity — none of which are calibrated.',
        tips: 'Prefer evidence that could have come out the other way. Anything that cannot fail cannot confirm.'
      },
      {
        stem: 'Which of these is the WEAKEST basis for concluding that the factory caused the river pollution?',
        choices: [
          'Pollutant concentrations downstream of the outflow are ten times those upstream.',
          'The factory\'s own discharge logs show a spike on the exact dates of the fish deaths.',
          'The factory is the largest industrial site on the river and is generally unpopular locally.',
          'A tracer dye released at the outflow was recovered 12 km downstream within 30 hours.'
        ],
        a: 2,
        e: 'Size and unpopularity establish motive and opportunity at most; they are not evidence of mechanism. Popularity is entirely irrelevant to chemistry.',
        tips: 'Weigh evidence by its link to mechanism, not by how much it supports the story you already believe.'
      },
      {
        stem: 'Two witnesses disagree about the colour of the car. Which factor should raise your confidence in one account?',
        choices: [
          'The witness who speaks more confidently and quickly.',
          'The witness who was closer, under better light, and had no stake in the outcome.',
          'The witness whose account is more detailed overall, regardless of detail relevance.',
          'The witness who was the first to come forward.'
        ],
        a: 1,
        e: 'Viewing conditions and lack of interest are the standard calibration factors for eyewitness reliability. Confidence and speed are weakly correlated with accuracy, and detail count can rise from imagination.',
        tips: 'Ask of every witness: what could have distorted their view — physically, or motivationally?'
      },
      {
        stem: 'You have one test that is 95% accurate and a second independent test that is also 95% accurate. Both come back positive. The best conclusion is:',
        choices: [
          'Certainty of guilt — two independent confirmations compound.',
          'Probability is now very high, but the base rate of the condition still determines how high.',
          'Accuracy is unchanged at 95%; the second test adds nothing.',
          'Accuracy is now 99.75%, because the errors cancel.'
        ],
        a: 1,
        e: 'Independence multiplies the evidence but not the raw accuracy, and a rare condition can still make a positive result more likely to be false than true. This is the base-rate problem.',
        tips: 'Before celebrating a confirmation, ask: how common is this outcome when nothing is wrong?'
      },
      {
        stem: 'Which single observation would most change your mind about a colleague who has been unusually secretive?',
        choices: [
          'A third colleague mentions they also found the behaviour odd.',
          'You learn they were recently assigned to a confidential review that legally prohibits disclosure.',
          'Their email tone has been shorter than usual this month.',
          'They declined an invitation to lunch twice in the same week.'
        ],
        a: 1,
        e: 'An innocent, specific, verifiable explanation accounts for the behaviour entirely. The other options merely pile more instances of the same ambiguous signal.',
        tips: 'Look for the observation that changes the explanation, not the observation that adds more of the same data.'
      }
    ];

    return SK.shuffle(sets).map(function (x) {
      return {
        tag: 'Weigh the evidence',
        prompt: esc(x.stem),
        choices: x.choices,
        answer: x.a,
        explain: x.e,
        hint: x.tips
      };
    });
  }

  /* ------------------------------------------------------------------
     Open-ended training prompts
     ------------------------------------------------------------------ */
  var DRILLS = [
    { t: 'The Two-Hypothesis Hour', d: 'Pick any news claim you accept. Force yourself to write one full paragraph defending the opposite conclusion using only admitted facts. If you cannot, you do not yet understand your own position.' },
    { t: 'Premise Extraction', d: 'Take three paragraphs of any editorial. Write down only the unstated premises — the sentences the author needed but never wrote. Most persuasive writing lives in those gaps.' },
    { t: 'Fallacy Journal', d: 'For one week, log every fallacy you hear — including your own. Record the exact wording. Patterns in your own reasoning surface fastest when quoted verbatim.' },
    { t: 'Steel-Man Round', d: 'Before you rebut anyone, restate their position so they would say "yes, exactly". Only then argue. This is the single highest-yield critical-thinking habit.' },
    { t: 'Prediction Log', d: 'Write down predictions with a probability attached and a date. Review them monthly. Calibration — knowing how often you are actually right — is the foundation of good judgement.' }
  ];

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */
  SK.registerRoute('critical', function (view) {
    var s = SKILLS.critical;
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
            { type: 'prose', kicker: 'What it is', title: 'Reasoning you can audit', paras: [
              'Critical thinking is not scepticism for its own sake. It is the practice of making your reasoning <b>inspectable</b> — laying out what you assumed, what you observed, and the exact step that carries you from one to the other.',
              'A detective and a credulous observer can look at the same facts. The difference is that the detective can state which fact would change their mind, and the credulous observer cannot.'
            ]},
            { type: 'list', kicker: 'The four movements', title: 'How an argument is handled', items: [
              '<b>Dissect.</b> Separate conclusion from premises. Most bad arguments hide the load-bearing premise.',
              '<b>Classify.</b> Name the inferential pattern — deduction, induction, abduction — and hold it to that standard.',
              '<b>Attack.</b> Look for the strongest objection, not the easiest. Then look for a rival explanation of equal plausibility.',
              '<b>Update.</b> Decide in advance what evidence would move you, and let it.'
            ]},
            { type: 'list', kicker: 'Common failure modes', title: 'Where reasoning breaks', grid: true, items: [
              'Accepting a conclusion because it is pleasant.',
              'Treating confidence as if it were evidence.',
              'Confusing "not disproven" with "supported".',
              'Arguing against a weakened version of a claim.',
              'Letting the frame of a question dictate its answer.',
              'Stopping at the first explanation that fits.'
            ]},
            { type: 'callout', kicker: 'The Sherlockian test', tone: 'good', body:
              'Before accepting a conclusion, you should be able to name (1) the strongest evidence for it, (2) the strongest evidence against it, and (3) one alternative account you rejected and why. If you cannot do all three, you hold a preference, not a finding.'
            },
            { type: 'chips', kicker: 'What this module trains', items: s.trains }
          ]);
        }
      },
      {
        label: 'Fallacy Drill',
        render: function (host) {
          var p = el('<div></div>');
          host.appendChild(p);
          var q = SKKit.quiz(p, {
            label: 'Fallacy recognition', tone: 'amber',
            items: fallacyItems(),
            doneTitle: 'Pattern recognition',
            doneBlurb: function (sc) {
              return sc >= 80 ? 'You are recognising the recurring shapes of bad reasoning quickly. These twelve patterns account for the majority of flawed argumentation you will encounter.'
                : sc >= 55 ? 'Some patterns are landing, others are still blurred. The most common confusion is between ad hominem and tu quoque, and between straw man and red herring — reread the briefing list and rerun.'
                : 'Slow down. Fallacies are recognised by their <b>structure</b>, not their topic. Read each statement, identify what the argument is aimed at, then name the manoeuvre.';
            },
            onScore: function (sc, c, t) { SK.record('critical', sc, { correct: c, attempts: t }); }
          });
        }
      },
      {
        label: 'Autopsy',
        render: function (host) {
          SKKit.quiz(host, {
            label: 'Argument dissection', tone: 'amber',
            items: autopsyItems(),
            doneTitle: 'Dissection complete',
            doneBlurb: function (sc) {
              return sc >= 75 ? 'You are locating conclusions and judging structure reliably — the core mechanical skill of argument analysis.'
                : 'Locating the conclusion is the first hurdle, and judging validity is the second. Rerun with the reasoning hints on until both feel automatic.';
            },
            onScore: function (sc, c, t) {
              var prev = SK.scoreOf('critical');
              SK.record('critical', Math.max(prev, Math.round(sc * 0.95)), { correct: c, attempts: t });
            }
          });
        }
      },
      {
        label: 'Evidence',
        render: function (host) {
          SKKit.quiz(host, {
            label: 'Evidence weighting', tone: 'amber',
            items: evidenceItems(),
            doneTitle: 'Weighing complete',
            doneBlurb: function (sc) {
              return sc >= 75 ? 'You are ranking evidence by its actual diagnostic power rather than by how reassuring it feels — exactly the discipline the composite skill requires.'
                : 'Evidence ranking is where intuition fails most often. The recurring lesson: prefer evidence that could have come out the other way.';
            },
            onScore: function (sc, c, t) {
              var prev = SK.scoreOf('critical');
              SK.record('critical', Math.max(prev, Math.round(sc * 0.95)), { correct: c, attempts: t });
            }
          });
        }
      },
      {
        label: 'Field Drills',
        render: function (host) {
          var p = el('<div class="panel"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px">Unaided practice</span><h2 style="font-size:1.12rem;font-weight:800;margin-bottom:6px">Exercises for the page, not the screen</h2><p class="muted" style="font-size:.86rem;margin-bottom:18px">These have no auto-grader. They are the transfer step — where the drill becomes a habit.</p><div class="concept-notes"></div></div>');
          var host2 = p.querySelector('.concept-notes');
          DRILLS.forEach(function (d, i) {
            host2.appendChild(el('<div class="note-row"><span class="note-num">' + (i + 1) + '</span><span><b style="color:var(--text-primary)">' + esc(d.t) + '</b><br>' + esc(d.d) + '</span></div>'));
          });
          host.appendChild(p);
        }
      }
    ], 0);

    SKKit.rail(layout, 'critical');
  });
})();
