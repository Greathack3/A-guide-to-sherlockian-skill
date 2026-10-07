/* ==========================================================================
   apps/social.js — Social Cognition (Interpersonal Skills)
   ========================================================================== */
(function () {
  'use strict';
  var esc = SK.esc, el = SK.el;

  /* Simple face SVGs for emotion reading */
  function face(kind) {
    var base = '<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">';
    base += '<circle cx="30" cy="30" r="24" opacity=".5"/>';
    var brows = {
      neutral: '<path d="M18 23.5h7M35 23.5h7"/>',
      concerned: '<path d="M17.5 24.5l7-3M42.5 24.5l-7-3"/>',
      surprised: '<path d="M17 21.5q4-4 8 0M35 21.5q4-4 8 0"/>',
      happy: '<path d="M17.5 23q4-3 8 1M34.5 24q4-4 8-1"/>',
      angry: '<path d="M17.5 20l7 4M42.5 20l-7 4"/>',
      sad: '<path d="M17.5 25l7-3.5M42.5 25l-7-3.5"/>'
    };
    var eyes = {
      neutral: '<circle cx="23" cy="30" r="2.2" fill="currentColor"/><circle cx="37" cy="30" r="2.2" fill="currentColor"/>',
      concerned: '<circle cx="23" cy="31" r="2.6" fill="currentColor"/><circle cx="37" cy="31" r="2.6" fill="currentColor"/>',
      surprised: '<circle cx="23" cy="31" r="3.4" fill="currentColor"/><circle cx="37" cy="31" r="3.4" fill="currentColor"/>',
      happy: '<path d="M20.5 30.5q2.5-3 5 0M34.5 30.5q2.5-3 5 0" stroke-width="3"/>',
      angry: '<circle cx="23" cy="31.5" r="2.4" fill="currentColor"/><circle cx="37" cy="31.5" r="2.4" fill="currentColor"/>',
      sad: '<path d="M20.5 31.5q2.5 3 5 0M34.5 31.5q2.5 3 5 0" stroke-width="3"/>'
    };
    var mouth = {
      neutral: '<path d="M23 41.5h14"/>',
      concerned: '<path d="M23 42.5q7-4 14 0"/>',
      surprised: '<ellipse cx="30" cy="42" rx="4.5" ry="5.5"/>',
      happy: '<path d="M21.5 39.5q8.5 9 17 0"/>',
      angry: '<path d="M22.5 43.5q7.5-6 15 0"/>',
      sad: '<path d="M22.5 44q7.5-7 15 0"/>'
    };
    return base + (brows[kind] || brows.neutral) + (eyes[kind] || eyes.neutral) + (mouth[kind] || mouth.neutral) + '</svg>';
  }

  /* ==================================================================
     A — Read the room: infer intent from dialogue
     ================================================================== */
  var DIALOGUES = [
    {
      lines: [
        { who: 'Colleague', cls: 'them', text: 'I was going to send you the file, but I assumed you already had it from the shared drive.' },
        { who: 'You', cls: 'you', text: 'I did not.' },
        { who: 'Colleague', cls: 'them', text: 'Right. Well — it has been sitting there since Tuesday, so… no idea what happened on your end.' }
      ],
      meta: ['2 messages', 'Sent 16:42', 'Read instantly'],
      q: 'What is the colleague most likely doing in that final message?',
      choices: [
        'Genuinely puzzling over a technical problem they cannot explain.',
        'Shifting responsibility onto you while appearing to state a neutral fact.',
        'Apologising indirectly for not sending the file earlier.',
        'Suggesting you check the shared drive again.'
      ],
      a: 1,
      explain: 'The phrasing is carefully passive — "no idea what happened on your end" conveys blame without ever asserting it. Nothing was sent, nothing was promised, but the reader is left holding the fault. Indirect blame is one of the most common interpersonal moves and is almost invisible when read for content alone.',
      tips: 'When someone describes a problem but assigns its cause to you using passive or speculative language, read the function of the sentence rather than its literal claim.'
    },
    {
      lines: [
        { who: 'Witness', cls: 'them', text: 'I saw the man leave the building. Around ten, I think. Maybe a bit after.' },
        { who: 'You', cls: 'them', text: 'You think? Or you know?' },
        { who: 'Witness', cls: 'them', text: '…Ten past. I checked my phone for the time right after he passed me.' }
      ],
      meta: ['Statement sharpened under pressure', 'Confidence raised'],
      q: 'What should you infer from the witness becoming MORE specific after being pressed?',
      choices: [
        'The detail is almost certainly accurate — precision indicates confidence.',
        'The precision may be constructed to satisfy the questioner rather than recalled.',
        'Nothing; increased detail is a normal response to a focused question.',
        'The witness is lying about the entire account.'
      ],
      a: 1,
      explain: 'Spontaneous precision and prompted precision are different evidence. A witness who goes from "maybe a bit after" to "ten past" on demand has produced a number to fill the gap — it may be right, but the specificity is not itself evidence of accuracy. The useful follow-up is not to accept it but to ask what anchored it (in this case, the phone).',
      tips: 'Distinguish details volunteered without prompting from details supplied after a question. Only the first kind carries its own reliability signal.'
    },
    {
      lines: [
        { who: 'Client', cls: 'them', text: 'No, the new arrangement works fine. Honestly it is probably better this way.' },
        { who: 'Client', cls: 'them', text: 'I just think if something is decided, we should all be comfortable with it.' },
        { who: 'You', cls: 'them', text: 'Is there anything you would change?' },
        { who: 'Client', cls: 'them', text: 'I mean… it is your call. I would not want to hold things up.' }
      ],
      meta: ['Repeated assent', 'Three deferrals of disagreement'],
      q: 'What is the most informative reading of this exchange?',
      choices: [
        'The client is content and simply polite by temperament.',
        'The client objects but is signalling it indirectly through repetition and deferral.',
        'The client has not yet formed an opinion and needs more time.',
        'The client is attempting to take control of the decision.'
      ],
      a: 1,
      explain: 'Repetition of assent ("works fine", "probably better") without being asked to confirm it, followed by three opportunities to disagree that are all declined with deferrals, is a strong indirect signal. People who are genuinely comfortable state it once and move on; people who are not, keep re-stating it.',
      tips: 'Reliability comes from <b>unprompted repetition</b> and <b>declined opportunities to object</b>. One is a claim; the pattern is the evidence.'
    },
    {
      lines: [
        { who: 'Manager', cls: 'them', text: 'Great work on the presentation. Really strong. Small thing — did you get a chance to look at my notes?' },
        { who: 'You', cls: 'you', text: 'I saw them.' },
        { who: 'Manager', cls: 'them', text: 'Totally up to you, of course. I just know the board tends to ask about the second section.' }
      ],
      meta: ['Compliment first', 'Request never stated directly'],
      q: 'What is actually being asked of you?',
      choices: [
        'Nothing — the manager is sharing context about the board.',
        'To revise the second section of the presentation before it goes out.',
        'To explain why you did not read the notes.',
        'To reschedule the presentation.'
      ],
      a: 1,
      explain: 'The compliment is a framing device; the "small thing" is the real message; "totally up to you" removes the appearance of an instruction while the content of the sentence ("the board tends to ask about the second section") makes the desired action unambiguous. This is a request disguised as an aside — extremely common in hierarchical communication.',
      tips: 'Look at what the speaker <b>does not say</b> alongside what they do. A direct instruction preceded by reassurance that it is optional is still an instruction.'
    },
    {
      lines: [
        { who: 'Informant', cls: 'them', text: 'I can tell you where he was that night.' },
        { who: 'You', cls: 'you', text: 'Can, or will?' },
        { who: 'Informant', cls: 'them', text: '…What is in it for me if I do?' }
      ],
      meta: ['Negotiation opened', 'Motive surfaced explicitly'],
      q: 'What did your second question accomplish?',
      choices: [
        'It forced the informant to reveal the motive they had been concealing.',
        'It changed the subject away from the timeline.',
        'It established that the informant did not actually know.',
        'It made the informant more cooperative out of respect.'
      ],
      a: 0,
      explain: '"Can, or will?" converts a capability claim into a commitment demand. The informant\'s response immediately pivots to terms, which tells you (a) the information exists, (b) they have been withholding it deliberately, and (c) the constraint is price, not knowledge. One short question restructured the whole exchange.',
      tips: 'The most efficient social-cognitive move is often a single question that separates ability from willingness. It converts an ambiguous position into a legible one.'
    },
    {
      lines: [
        { who: 'Associate', cls: 'them', text: 'I would never have agreed to that if I had known about the clause.' },
        { who: 'You', cls: 'them', text: 'The clause was in the document you signed.' },
        { who: 'Associate', cls: 'them', text: 'I signed it quickly. There was a lot going on that week.' }
      ],
      meta: ['Claim of ignorance', 'Immediately followed by an excuse'],
      q: 'What is the strongest warranted conclusion?',
      choices: [
        'The associate read the document and is now lying about it.',
        'The associate did not read the clause, and is now explaining rather than denying.',
        'The associate was deceived by someone else about the clause.',
        'The signature is invalid on the grounds described.'
      ],
      a: 1,
      explain: 'Notice the move: the original claim ("I would never have agreed if I had known") is a denial of informed consent, not a denial of awareness. Once challenged, they do not say they were misled or that the clause was added afterwards — they explain why they failed to read. That is an admission of non-reading, and it is consistent with everything observed so far. Beyond that, you are speculating.',
      tips: 'Track which of several possible claims a person is actually defending. The defence they choose tells you what they are conceding.'
    }
  ];

  function intentRun(host, tone) {
    var items = SK.shuffle(DIALOGUES).map(function (d) {
      var rendered = '<span style="display:block;font-family:var(--font-body);font-weight:400;font-size:.9rem;color:var(--text-secondary);line-height:1.65;margin-bottom:12px">' +
        d.lines.map(function (l) {
          return '<span style="display:block;margin-bottom:7px"><b style="font-family:var(--font-mono);font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:3px">' + esc(l.who) + '</b>' +
            '<span style="color:var(--text-primary)">' + esc(l.text) + '</span></span>';
        }).join('') +
        '<span class="mono" style="font-size:.6rem;color:var(--text-muted);letter-spacing:.12em">' + d.meta.map(esc).join(' · ') + '</span></span>' +
        '<b style="color:var(--text-primary)">' + esc(d.q) + '</b>';
      return {
        tag: 'Intent inference',
        prompt: rendered,
        choices: d.choices,
        answer: d.a,
        explain: d.explain,
        hint: d.tips
      };
    });

    SKKit.quiz(host, {
      label: 'Read the room', tone: tone, items: items,
      doneTitle: 'Intent reading',
      doneBlurb: function (sc) {
        return sc >= 80
          ? 'You are reading the function of utterances rather than their surface content — the central move of social cognition.'
          : sc >= 55
            ? 'You are catching the obvious signals. The misses are in indirect moves: unprompted repetition, hedged blame, and instructions disguised as asides.'
            : 'Read for function, not content. For each line ask: what is this sentence <b>doing</b> — informing, deflecting, requesting, or concealing? Then decide what the speaker wanted to happen.';
      },
      onScore: function (sc, c, t) { SK.record('social', sc, { correct: c, attempts: t }); }
    });
  }

  /* ==================================================================
     B — False belief / theory of mind
     ================================================================== */
  var FALSE_BELIEFS = [
    {
      text: 'Marisol hides a ledger in the blue drawer and leaves the room. While she is out, Tomas moves it to the filing cabinet. Marisol returns. Where will she look first?',
      choices: ['The filing cabinet', 'The blue drawer', 'Both, simultaneously', 'Wherever you last saw it'],
      a: 1,
      explain: 'Marisol did not witness the move, so her belief still matches the world as it was when she left. Theory of mind is the ability to model a belief you know to be false — your own knowledge of the move must not contaminate your model of hers.',
      tips: 'The test is whether you can hold two states of the world at once: what is true, and what she thinks is true.'
    },
    {
      text: 'Aiko believes the museum closes at five. It actually closed at four today. Aiko arrives at 4:20. What does she expect, and what will she find?',
      choices: ['She expects closed and finds it closed', 'She expects open and finds it closed', 'She expects closed and finds it open', 'She expects it to depend on the day'],
      a: 1,
      explain: 'Her expectation is built on her own stale model; the outcome contradicts it. Crucially, the mismatch between expectation and result is itself information — the size of her surprise tells you how far her model was from reality.',
      tips: 'Surprise is measurable evidence of a belief. Watching what startles someone reveals what they had assumed.'
    },
    {
      text: 'Rafi tells Lena a rumour. Lena does not believe it but repeats it to Otto "just to check". Otto believes it. What does Rafi now believe about Otto?',
      choices: ['That Otto knows the rumour is false', 'Nothing — Rafi does not know about the repetition', 'That Otto believes the rumour', 'That Otto originated the rumour'],
      a: 1,
      explain: 'Rafi\'s belief state has not been updated, because none of the intermediate steps were reported back to him. Modelling other minds requires tracking not just beliefs but <b>who has received which information</b> — the classic second-order problem.',
      tips: 'Always maintain a ledger: who told what, to whom, when. Most modelling errors are stale ledger errors.'
    },
    {
      text: 'Two agents each believe the other is lying. Both are telling the truth about what they observed. What is the most likely explanation?',
      choices: ['At least one is actually lying', 'Their observations differed, or one inference from observation was wrong', 'Both are mistaken about the definition of truth', 'It is impossible for both to be truthful'],
      a: 1,
      explain: 'Sincerity of report and accuracy of report are separate properties. Two honest observers can produce contradictory testimony if they observed different things, viewed from different angles, or applied a different inference to the same raw observation.',
      tips: 'Separate three layers: what happened, what each person perceived, what each person concluded. Contradiction can enter at any layer without anyone lying.'
    },
    {
      text: 'You discover that a person has been told a lie about you by a third party. They have been behaving coldly for a week. What does their coldness most likely indicate?',
      choices: ['That they dislike you independently of the lie', 'That they are acting on a false belief about you that they hold sincerely', 'That they know about the lie and are testing you', 'That they are indifferent to you'],
      a: 1,
      explain: 'Their behaviour is fully explained by a belief state you know to be false. Until they are corrected, treating the coldness as a verdict on your character confuses their model with reality.',
      tips: 'When behaviour seems disproportionate, look for a belief that would make it proportionate — especially one you know to be false.'
    },
    {
      text: 'A suspect says: "I had no reason to take the papers — and anyway, I never entered the office that evening." Which statement should raise your attention most?',
      choices: ['The first, because motive is always the weakest claim', 'The second, because it is falsifiable and was volunteered as a denial', 'Both equally', 'Neither; a denial is a denial'],
      a: 1,
      explain: 'The first clause is unverifiable and self-serving. The second is a concrete, checkable claim about a specific action at a specific time. When someone pairs an unfalsifiable statement with a falsifiable one, the falsifiable one is where the real information lies — and unprompted denial of an action you had not yet raised is a classic tell.',
      tips: 'Prioritise claims that could be checked. What someone volunteers before being asked is disproportionately informative.'
    }
  ];

  function beliefRun(host, tone) {
    var items = SK.shuffle(FALSE_BELIEFS).map(function (x) {
      return {
        tag: 'Model another mind',
        prompt: esc(x.text),
        choices: x.choices, answer: x.a, explain: x.explain, hint: x.tips, cols: true
      };
    });
    SKKit.quiz(host, {
      label: 'Theory of mind', tone: tone, items: items,
      doneTitle: 'Mind-modelling',
      doneBlurb: function (sc) {
        return sc >= 80
          ? 'You are holding separate belief states for separate agents without letting your own knowledge leak into theirs — the core operation of theory of mind.'
          : sc >= 55
            ? 'The single-agent cases are landing; the multi-agent cases are where knowledge leaks between models. Slow down and name whose information is whose.'
            : 'The most common error is contaminating someone else\'s model with what you personally know. Before answering, state explicitly: <b>what does this person know, and when did they learn it?</b>';
      },
      onScore: function (sc, c, t) { SK.record('social', Math.max(sc, SK.scoreOf('social')), { correct: c, attempts: t }); }
    });
  }

  /* ==================================================================
     C — Tone decoder: same words, different function
     ================================================================== */
  var TONE_SETS = [
    {
      line: '"That is certainly one way to do it."',
      q: 'In a workplace review, spoken after a colleague shows you their draft — what is the most likely function?',
      choices: [
        'Genuine approval of an unconventional but valid approach.',
        'A polite reservation signalling the reviewer disagrees but will not say so directly.',
        'A neutral acknowledgement that more than one method exists.',
        'An invitation to explain the reasoning behind the choice.'
      ],
      a: 1,
      explain: 'The construction "that is certainly…" with the emphasised "certainly" and the qualifying "one way" is a standard hedge. Absent any follow-up approval, it functions as withheld criticism — the speaker has declined to say what a direct endorsement would look like ("that is the right way").',
      tips: 'Compare the sentence to what genuine approval would sound like. If a real endorsement would have been shorter and more definite, the longer version is hedging.'
    },
    {
      line: '"Interesting."',
      q: 'Sent as a one-word reply to a proposal you have just presented, then nothing further for two minutes.',
      choices: [
        'The listener is intrigued and is considering it seriously.',
        'The listener has stopped processing and has not formed a view.',
        'The listener is signalling that they find it questionable and are withholding judgement.',
        'The listener needs more information before responding.'
      ],
      a: 1,
      explain: 'A single word where a considered response was expected, followed by no follow-up question and no commitment, most often means the listener has not engaged. Interpretation as either praise or criticism imports content that was deliberately not supplied. The absence of a question is the most informative part.',
      tips: 'Silence and brevity are ambiguous. The reliable signal is what the listener <b>did not do</b> — no question, no request to revisit, no commitment.'
    },
    {
      line: '"I will leave that with you."',
      q: 'Said by a manager at the end of a meeting about a problem you did not create and were not assigned.',
      choices: [
        'A neutral delegation of the problem to you.',
        'A statement that the matter is now yours whether or not it was formally assigned.',
        'An acknowledgement that the problem exists and remains unsolved.',
        'A suggestion that the problem is outside both your remits.'
      ],
      a: 1,
      explain: 'The passive construction removes an agent: nobody decided to assign it, it was simply "left". No request was made, so none can be declined. The listener has acquired a problem without any exchange in which the acquisition could be negotiated.',
      tips: 'Passive voice in organisational speech usually removes the decision-maker. Ask: who acted, and who would have to be asked to reverse this?'
    },
    {
      line: '"Let\'s circle back on that when things are calmer."',
      q: 'Said three times across three meetings about the same topic.',
      choices: [
        'A genuine intention to revisit the topic once circumstances improve.',
        'A durable commitment being tracked across meetings.',
        'A polite, repeated deferral that functions as a refusal without ever being one.',
        'A scheduling problem that requires a concrete date to resolve.'
      ],
      a: 2,
      explain: 'The first instance is ambiguous and may be sincere. The third instance, with no date proposed and no follow-up, is a pattern: the topic is being kept permanently out of scope while no one is ever told "no". Deferral repeated without a date is refusal with plausible deniability.',
      tips: 'Ambiguity resolves over repetitions. Judge the first instance generously and the pattern strictly — repetition without escalation is itself the answer.'
    },
    {
      line: '"No offence, but…"',
      q: 'Followed by a comment about your competence in front of the group.',
      choices: [
        'A genuine disclaimer that should be taken at face value.',
        'A framing device that transfers responsibility for the offence to you for having taken it.',
        'A joke and should not be read as substantive.',
        'An attempt to soften the comment, which therefore works.'
      ],
      a: 1,
      explain: 'The disclaimer is addressed to the listener\'s reaction rather than to the speaker\'s act. It pre-frames any objection as oversensitivity, so the criticism lands and the objection is pre-empted. The comment itself carries the full content; the prefix changes only who is at fault if it stings.',
      tips: 'A disclaimer attached to a statement tells you the speaker already knows the statement is aggressive. That meta-knowledge is the more useful information.'
    },
    {
      line: '"I do not want to make this a thing."',
      q: 'Said by someone who has just raised it as a thing, in detail, for several minutes.',
      choices: [
        'A wish to minimise the topic going forward.',
        'An accurate description of their own behaviour.',
        'A request that you drop the subject, having established it themselves.',
        'An expression of discomfort with confrontation.'
      ],
      a: 2,
      explain: 'The statement and the behaviour diverge — which is precisely why it is informative. The speaker has done the raising while disclaiming the raising, which leaves them able to continue and you unable to object without becoming the one making it a thing.',
      tips: 'When statement and behaviour diverge, treat the behaviour as the primary datum and the statement as the framing device it is functioning as.'
    }
  ];

  function toneRun(host, tone) {
    var items = SK.shuffle(TONE_SETS).map(function (x) {
      return {
        tag: 'Decode the function',
        prompt: '<span style="display:block;font-family:var(--font-display);font-size:1.12rem;font-weight:700;color:var(--text-primary);font-style:italic;border-left:2px solid var(--teal);padding-left:16px;margin-bottom:12px">' + esc(x.line) + '</span>' + esc(x.q),
        choices: x.choices, answer: x.a, explain: x.explain,
        hint: 'Read the sentence aloud with the emphasis on each word in turn — the function usually becomes audible before it becomes obvious.'
      };
    });
    SKKit.quiz(host, {
      label: 'Tone & subtext', tone: tone, items: items,
      doneTitle: 'Subtext reading',
      doneBlurb: function (sc) {
        return sc >= 80
          ? 'You are decoding what sentences are for rather than what they say. This is the layer where most interpersonal information actually lives.'
          : sc >= 55
            ? 'You are reading the polite surface correctly and missing the function beneath it. The recurring test: compare the sentence to what a direct version would sound like.'
            : 'Take each line and write the <b>direct</b> version of it first — the sentence with no politeness encoding. The gap between the two is the subtext.';
      },
      onScore: function (sc, c, t) { SK.record('social', Math.max(sc, SK.scoreOf('social')), { correct: c, attempts: t }); }
    });
  }

  /* ==================================================================
     D — Emotion read from facial configuration
     ================================================================== */
  var EMOTIONS = [
    { id: 'concerned', label: 'Concerned', d: 'Raised inner brows with a slight downward mouth — distress about something external, not anger at the listener.' },
    { id: 'surprised', label: 'Surprised', d: 'Raised brows and widened eyes with an open mouth — an unexpected input that has not yet been interpreted.' },
    { id: 'happy', label: 'Genuine warmth', d: 'Raised cheeks with eye crinkle — the marker that distinguishes a real expression from a polite one.' },
    { id: 'angry', label: 'Anger', d: 'Lowered, drawn-together brows with pressed lips — readiness for confrontation, usually directed at a person.' },
    { id: 'sad', label: 'Sadness', d: 'Inner brows raised with the mouth corners pulled down — loss or helplessness rather than threat.' },
    { id: 'neutral', label: 'Neutral / guarded', d: 'No strong signal — either genuinely uncommitted or actively withholding. Treat as absence of evidence, not evidence of calm.' }
  ];

  function emotionRun(host, tone) {
    var rounds = 6, i = 0, correct = 0, results = [];
    var stage = el(
      '<div class="stage" ' + SK.toneVars(tone) + '>' +
        '<div class="stage-label"><span>Emotion read</span><span class="lvl" data-lvl>6 faces</span></div>' +
        '<div class="prog" style="margin-bottom:14px"></div>' +
        '<div class="body"></div>' +
      '</div>'
    );
    host.appendChild(stage);
    var lvl = stage.querySelector('[data-lvl]');
    var prog = stage.querySelector('.prog');
    var body = stage.querySelector('.body');

    function intro() {
      lvl.textContent = '6 faces'; prog.innerHTML = ''; body.innerHTML = '';
      var w = el('<div class="pop"><p class="prompt">Read the configuration, not the impression.</p>' +
        '<p class="lede" style="margin-top:10px;color:var(--text-muted);font-size:.88rem">Each face shows a specific arrangement of brows, eyes and mouth. Emotion reading is a <b>perceptual</b> skill before it is an intuitive one — you are learning which muscle groups carry which signal.</p>' +
        '<div class="stage-actions"><button class="btn btn-primary" data-go type="button">Begin →</button></div></div>');
      body.appendChild(w);
      w.querySelector('[data-go]').addEventListener('click', function () { i = 0; correct = 0; results = []; show(); });
    }

    function show() {
      if (i >= rounds) return finish();
      lvl.textContent = 'Face ' + (i + 1) + ' / ' + rounds;
      prog.innerHTML = SK.dotsHTML(results, i);

      var target = SK.pick(EMOTIONS);
      var distractors = SK.sample(EMOTIONS.filter(function (e) { return e.id !== target.id; }), 3);
      var options = SK.shuffle([target].concat(distractors));

      body.innerHTML = '';
      var w = el('<div class="pop"><div class="stroop-sub" style="text-align:center">What does this face convey?</div>' +
        '<div class="face-row" data-f></div><div data-fb></div></div>');
      body.appendChild(w);
      var row = w.querySelector('[data-f]');

      options.forEach(function (opt) {
        var b = el('<button class="face-btn" type="button">' + face(opt.id) + '<span>' + esc(opt.label) + '</span></button>');
        b.addEventListener('click', function () { answer(opt, target, b, row, w); });
        row.appendChild(b);
      });
    }

    function answer(opt, target, btn, row, w) {
      var ok = opt.id === target.id;
      if (ok) correct++;
      results.push(ok);
      SK.$$('.face-btn', row).forEach(function (b, bi) {
        b.disabled = true;
        if (optionsMatch(b, target)) b.classList.add('correct');
        else if (b === btn) b.classList.add('wrong');
        else b.classList.add('dim');
      });
      w.querySelector('[data-fb]').innerHTML =
        '<div class="feedback ' + (ok ? 'good' : 'bad') + '"><span class="fb-title">' + (ok ? 'Read correctly' : 'Misread') + '</span>' +
        '<b>' + esc(target.label) + '</b> — ' + target.d + '</div>' +
        '<div class="stage-actions"><button class="btn btn-primary" data-next type="button">' +
        (i >= rounds - 1 ? 'See results' : 'Next face') + ' →</button></div>';
      prog.innerHTML = SK.dotsHTML(results, results.length - 1);
      w.querySelector('[data-next]').addEventListener('click', function () { i++; show(); });
    }

    function optionsMatch(btn, target) {
      return btn.querySelector('span').textContent === target.label;
    }

    function finish() {
      var sc = SK.pct(correct, rounds);
      lvl.textContent = 'Complete';
      prog.innerHTML = SK.dotsHTML(results, -1);
      body.innerHTML = '';
      body.appendChild(SKKit.resultBlock({
        score: sc, correct: correct, total: rounds, tone: tone,
        title: 'Affect reading',
        blurb: sc >= 80
          ? 'You are reading the configuration rather than the vibe — brow angle, eye aperture and mouth curvature are all being used.'
          : sc >= 50
            ? 'Some signals are landing. The two most commonly confused are concern and sadness (both raise the inner brow) and neutral versus guarded (which are visually identical — context must supply that one).'
            : 'Slow down and decompose: first the brows, then the eyes, then the mouth. Each carries an independent part of the signal, and gestalt impressions are less accurate than the sum of the parts.',
        onRetry: intro
      }));
      SK.record('social', Math.max(sc, SK.scoreOf('social')), { correct: correct, attempts: rounds });
    }

    intro();
  }

  /* ==================================================================
     Route
     ================================================================== */
  SK.registerRoute('social', function (view) {
    var s = SKILLS.social;
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
            { type: 'prose', kicker: 'What it is', title: 'Modelling another mind', paras: [
              'Social cognition is the ability to hold a working model of somebody else: <b>what they know, what they believe, what they want, and what they are concealing</b>. It converts a conversation from an exchange of sentences into a source of evidence.',
              'People rarely state these things directly. The information arrives in what is repeated without being asked, deferred without being refused, and denied before it was alleged.'
            ]},
            { type: 'list', kicker: 'The four channels', title: 'Where the signal actually is', items: [
              '<b>Content.</b> What was literally said — the least reliable layer, and the one most people read.',
              '<b>Function.</b> What the utterance is doing — informing, deflecting, requesting, securing agreement.',
              '<b>Belief state.</b> What the person currently thinks is true, including things you know to be false.',
              '<b>Structure.</b> Who has received which information, and when. Most modelling errors are stale ledgers.'
            ]},
            { type: 'list', kicker: 'Diagnostic patterns', grid: true, title: 'Recurring interpersonal tells', items: [
              '<b>Unprompted repetition</b> of a reassurance — usually signals the opposite.',
              '<b>Declined opportunities</b> to object, repeated across occasions.',
              '<b>Passive constructions</b> that remove the person who decided.',
              '<b>Deferral without a date</b> — refusal with plausible deniability.',
              '<b>Pairing an unfalsifiable claim</b> with a checkable one.',
              '<b>Volunteered denial</b> of something you had not yet raised.'
            ]},
            { type: 'callout', kicker: 'The Sherlockian test', tone: 'good', body:
              'After any conversation, you should be able to state three things: what the other person <b>believes</b>, what they <b>want</b>, and what they <b>have not told you</b>. If you can only report what was said, you have recorded the transcript — not the conversation.'
            },
            { type: 'chips', kicker: 'What this module trains', items: s.trains }
          ]);
        }
      },
      { label: 'Read the Room', render: function (host) { intentRun(host, 'teal'); } },
      { label: 'Theory of Mind', render: function (host) { beliefRun(host, 'teal'); } },
      { label: 'Tone Decoder', render: function (host) { toneRun(host, 'teal'); } },
      { label: 'Emotion Read', render: function (host) { emotionRun(host, 'teal'); } },
      {
        label: 'Field Drills',
        render: function (host) {
          var p = el('<div class="panel"><span class="kicker" style="font-family:var(--font-mono);font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px">Unaided practice</span><h2 style="font-size:1.12rem;font-weight:800;margin-bottom:6px">Interpersonal drills for real conversations</h2><p class="muted" style="font-size:.86rem;margin-bottom:18px">The discipline is prediction, not interpretation after the fact.</p><div class="concept-notes"></div></div>');
          var h = p.querySelector('.concept-notes');
          [
            { t: 'Predict the Next Line', d: 'In any conversation, before the other person speaks, write two words predicting what they will say next. Track your hit rate — it is a genuine calibration metric.' },
            { t: 'The Three Statements', d: 'After any meeting, write: what they believe, what they want, what they did not say. You will find the third is almost always recoverable once you look for it.' },
            { t: 'Motive Before Malice', d: 'When someone\'s behaviour seems odd, generate three possible motives before settling on one. The first hypothesis you reach is usually your own anxiety, not their intent.' },
            { t: 'Record and Replay', d: 'Write out a difficult exchange verbatim from memory, then reread it a day later. The gap between what you remember and what was said is your interpretive bias, measured.' },
            { t: 'The Direct-Translation Pass', d: 'Take any vague or hedged message you receive and rewrite it in flat declarative English. Compare the two. The delta is the information.' }
          ].forEach(function (d, i) {
            h.appendChild(el('<div class="note-row"><span class="note-num">' + (i + 1) + '</span><span><b style="color:var(--text-primary)">' + esc(d.t) + '</b><br>' + esc(d.d) + '</span></div>'));
          });
          host.appendChild(p);
        }
      }
    ], 0);

    SKKit.rail(layout, 'social');
  });
})();
