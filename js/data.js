/* ==========================================================================
   data.js — the six modules: identity, icons, and shared explanatory copy
   ========================================================================== */
(function () {
  'use strict';

  var ICONS = {
    critical:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M24 8.5c-3.4 0-6.2 1.1-8.2 2.6-1.6 1.2-2.5 2.7-2.5 4.2 0 .9.3 1.7.9 2.4-1.2.9-1.9 2.2-1.9 3.7 0 1.5.7 2.8 1.9 3.7-.6.7-.9 1.5-.9 2.4 0 1.5.9 3 2.5 4.2 2 1.5 4.8 2.6 8.2 2.6"/>' +
      '<path d="M24 8.5c3.4 0 6.2 1.1 8.2 2.6 1.6 1.2 2.5 2.7 2.5 4.2 0 .9-.3 1.7-.9 2.4 1.2.9 1.9 2.2 1.9 3.7 0 1.5-.7 2.8-1.9 3.7.6.7.9 1.5.9 2.4 0 1.5-.9 3-2.5 4.2-2 1.5-4.8 2.6-8.2 2.6"/>' +
      '<path d="M24 8.5V40"/><path d="M15.8 15.3c2.4.4 5.4 1.5 8.2 4.1M32.2 15.3c-2.4.4-5.4 1.5-8.2 4.1"/>' +
      '<circle cx="19.6" cy="26.4" r="2.1" fill="currentColor" stroke="none" opacity=".85"/>' +
      '<circle cx="29" cy="31" r="1.6" fill="currentColor" stroke="none" opacity=".65"/>' +
      '<path d="M38 34.5l4.5 4.5M41 31.5l2.4 2.4" opacity=".7"/>' +
      '<circle cx="39.5" cy="36" r="5.6" opacity=".8"/>'
    ,
    observation:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4.5 24S11.6 11.5 24 11.5 43.5 24 43.5 24 36.4 36.5 24 36.5 4.5 24 4.5 24Z"/>' +
      '<circle cx="24" cy="24" r="6.4"/>' +
      '<circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none"/>' +
      '<path d="M24 5.6v3.2M24 39.2v3.2M8.4 12.4l2.3 2.3M37.3 33.3l2.3 2.3M3.6 24h3.2M41.2 24h3.2M8.4 35.6l2.3-2.3M37.3 14.7l2.3-2.3" opacity=".55"/>' +
      '<path d="M18.4 19.2c1.4-1.4 3.3-2.2 5.6-2.2" opacity=".8"/>'
    ,
    memory:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="7" y="7" width="14" height="14" rx="3.5"/>' +
      '<rect x="27" y="7" width="14" height="14" rx="3.5" opacity=".55"/>' +
      '<rect x="7" y="27" width="14" height="14" rx="3.5" opacity=".55"/>' +
      '<rect x="27" y="27" width="14" height="14" rx="3.5"/>' +
      '<path d="M34 30.5v7M30.5 34h7" stroke-width="2.2"/>' +
      '<path d="M14 12.5v6M11 15.5h6" opacity=".8"/>' +
      '<path d="M21 14h6M34 21v6M27 34h6M14 27v-6" opacity=".45"/>' +
      '<circle cx="14" cy="34" r="2.4" fill="currentColor" stroke="none" opacity=".9"/>' +
      '<circle cx="34" cy="14" r="2.4" fill="currentColor" stroke="none" opacity=".6"/>'
    ,
    focus:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="11.5" opacity=".7"/><circle cx="24" cy="24" r="6" opacity=".5"/>' +
      '<circle cx="24" cy="24" r="2.6" fill="currentColor" stroke="none"/>' +
      '<path d="M24 2.6v7M24 38.4v7M2.6 24h7M38.4 24h7" stroke-width="2.2"/>' +
      '<path d="M33 15l7-7M15 33l-7 7" opacity=".5"/>' +
      '<path d="M38.6 34.2a17 17 0 0 0 5.2-9.6" stroke-width="3" opacity=".9"/>'
    ,
    social:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 14.5A5.5 5.5 0 0 1 10.5 9h15A5.5 5.5 0 0 1 31 14.5v7A5.5 5.5 0 0 1 25.5 27H15l-6.5 6v-6h-3A5.5 5.5 0 0 1 5 21.5Z"/>' +
      '<path d="M36 20.5A5.5 5.5 0 0 1 41.5 26v7.5A5.5 5.5 0 0 1 36 39h-3v6l-6.5-6h-4" transform="translate(1 -2)"/>' +
      '<circle cx="14.5" cy="18" r="1.9" fill="currentColor" stroke="none"/>' +
      '<circle cx="21.5" cy="18" r="1.9" fill="currentColor" stroke="none"/>' +
      '<path d="M13.5 22.6c1.6 1.7 4.4 1.7 6 0" opacity=".8"/>' +
      '<path d="M34 10.5c0-2.5 2-4.5 4.5-4.5M43 10.5c0-2.5-2-4.5-4.5-4.5" opacity=".5"/>'
    ,
    practical:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="5" y="14" width="38" height="27" rx="5"/>' +
      '<path d="M17 14v-3.5A3.5 3.5 0 0 1 20.5 7h7A3.5 3.5 0 0 1 31 10.5V14"/>' +
      '<path d="M5 25.5h38" opacity=".5"/>' +
      '<path d="M15.5 29.5l4.6 4.6 9.4-9.4" stroke-width="2.6"/>' +
      '<path d="M36 8.5l1.6 3.4 3.4 1.6-3.4 1.6L36 18.5l-1.6-3.4L31 13.5l3.4-1.6Z" opacity=".75"/>' +
      '<circle cx="11" cy="19.5" r="1.6" fill="currentColor" stroke="none" opacity=".7"/>'
    ,
    home:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M6 21 24 6l18 15"/><path d="M10 19.4V40h28V19.4"/><path d="M19 40V27h10v13"/><circle cx="24" cy="19" r="3" opacity=".6"/>'
  };

  var SKILLS = [
    {
      id: 'critical',
      num: '01',
      title: 'Critical Thinking Skills',
      short: 'Critical Thinking',
      role: 'The reasoning engine',
      tone: 'amber',
      navIco: 'tone-amber',
      icon: ICONS.critical,
      tagline: 'Separate what is known from what is merely assumed.',
      blurb: 'Build and break arguments on purpose. Learn to name the fallacy, weigh the evidence, and hold a hypothesis only as tightly as the facts allow.',
      long: 'Critical thinking is the discipline of auditing your own conclusions. In this module you will dissect arguments into premises and conclusions, recognise the recurring patterns of flawed reasoning, and practise generating rival explanations before committing to one.',
      trains: ['Argument dissection', 'Fallacy recognition', 'Hypothesis generation', 'Evidence weighting'],
      skills: ['Argues a case from evidence', 'Names the flaw in bad reasoning', 'Generates rival explanations', 'Updates a belief when new facts arrive']
    },
    {
      id: 'observation',
      num: '02',
      title: 'Observational Skills',
      short: 'Observation',
      role: 'The data collector',
      tone: 'cyan',
      navIco: 'tone-cyan',
      icon: ICONS.observation,
      tagline: 'You see, but you do not observe.',
      blurb: 'Train the difference between glancing and looking. Study a scene under time pressure, then reconstruct it from memory with precision.',
      long: 'Observation is deliberate, structured noticing. Sherlock Holmes drew a sharp line between seeing and observing: one is passive reception, the other is directed attention with a purpose. This module forces you to look with intent and then report accurately.',
      trains: ['Timed scene study', 'Change detection', 'Detail enumeration', 'Accurate description'],
      skills: ['Notices what others miss', 'Recalls colour, count and position', 'Detects a changed detail', 'Describes without inventing']
    },
    {
      id: 'memory',
      num: '03',
      title: 'Working Memory Skills',
      short: 'Working Memory',
      role: 'The mental workbench',
      tone: 'violet',
      navIco: 'tone-violet',
      icon: ICONS.memory,
      tagline: 'Hold many threads at once, without dropping one.',
      blurb: 'Manipulate information while it is live. Sequence recall, spatial span and dual-task drills that stretch the size of your mental workspace.',
      long: 'Working memory is the ability to keep information active and operate on it simultaneously — the workbench on which reasoning actually happens. A larger, stabler workbench means you can carry more of a problem in mind at once.',
      trains: ['Digit & letter span', 'Spatial sequence recall', 'Dual-task interference', 'Chunking strategies'],
      skills: ['Tracks several variables at once', 'Recalls order, not just content', 'Works under mild distraction', 'Chunks raw data into units']
    },
    {
      id: 'focus',
      num: '04',
      title: 'Deep Focus',
      short: 'Deep Focus',
      role: 'The attention filter',
      tone: 'rose',
      navIco: 'tone-rose',
      icon: ICONS.focus,
      tagline: 'Select what matters. Suppress everything else.',
      blurb: 'Selective attention under interference. Stroop conflict, target search among distractors, and sustained-attention drills that reward precision over speed.',
      long: 'Deep focus is selective attention — the ability to keep one signal loud while the room stays noisy. It is what allows a single inconsistency in an otherwise tidy story to register instead of being smoothed away.',
      trains: ['Interference control', 'Target search speed', 'Sustained vigilance', 'Distraction resistance'],
      skills: ['Holds a rule while tempted otherwise', 'Finds the signal in noise', 'Sustains attention over minutes', 'Recovers quickly from interruption']
    },
    {
      id: 'social',
      num: '05',
      title: 'Social Cognition',
      short: 'Social Cognition',
      role: 'The model of other minds',
      tone: 'teal',
      navIco: 'tone-teal',
      icon: ICONS.social,
      tagline: 'People leave evidence too — in tone, motive and omission.',
      blurb: 'Model what another person believes, intends and feels. Read intent beneath wording, track false beliefs, and infer motive from what was said and what was not.',
      long: 'Social cognition is the practice of building a working model of somebody else\'s mind: what they know, what they want, what they are concealing. It converts a conversation from an exchange of sentences into a source of evidence.',
      trains: ['Intent inference', 'Tone & subtext reading', 'Theory of mind', 'Motive construction'],
      skills: ['Reads intent behind wording', 'Tracks what each person believes', 'Notes omission as well as statement', 'Tests a motive against behaviour']
    },
    {
      id: 'practical',
      num: '06',
      title: 'Practical Implementation',
      short: 'Practical',
      role: 'The proving ground',
      tone: 'gold',
      navIco: 'tone-gold',
      icon: ICONS.practical,
      tagline: 'Integration under realistic conditions.',
      blurb: 'The assessment layer. Scenario files that deliberately blend all five core abilities, scored back to each one so you can see exactly where your reasoning holds and where it breaks.',
      long: 'Practical implementation does not teach a sixth ability. It is the proving ground: a set of realistic scenarios in which every question is engineered to demand one or more of the five core skills, with a report that traces your result back to its source.',
      trains: ['Integrated scenarios', 'Timed case files', 'Skill attribution', 'Reflective debrief'],
      skills: ['Applies the five skills in sequence', 'Works to a deadline with incomplete data', 'Chooses which skill a problem needs', 'Converts a result into a training plan']
    }
  ];

  var MAP = {};
  SKILLS.forEach(function (s) { MAP[s.id] = s; });

  /* Concept copy used on the home page (and echoed in the drawer-free "system" panel) */
  var CONCEPT = {
    headline: 'The Sherlockian Skill is not a single ability.',
    quote: 'It is a <mark>composite skill</mark> developed through the improvement and integration of five core abilities — <span class="hl">critical thinking, observation, working memory, deep focus and social cognition</span>. Practical implementation is then used to test how effectively these abilities can be integrated and applied in realistic situations.',
    notes: [
      'Train each ability on its own — they are separable, and each has its own failure mode.',
      'Integrate them — real problems never arrive labelled by which skill they need.',
      'Apply them under realistic conditions — practical implementation measures the whole, not the parts.'
    ],
    pipeline: [
      { tag: 'Stage one', title: 'Isolate', body: 'Five modules, five distinct capacities. Each is trained with exercises that isolate one ability so its limits become visible.' },
      { tag: 'Stage two', title: 'Integrate', body: 'As the abilities improve they begin to run together: you observe while you reason, hold both while you stay focused on one thread.' },
      { tag: 'Stage three', title: 'Apply & evaluate', body: 'Practical implementation presents realistic scenarios and reports your performance back per skill — showing exactly where integration succeeds or fails.' }
    ]
  };

  window.SKILLS = MAP;
  window.SKILL_LIST = SKILLS;
  window.ICONS = ICONS;
  window.CONCEPT = CONCEPT;
})();
