// ─── Gemini AI Question Generator Service ────────────────────────────────────
// API key is loaded from .env (VITE_GEMINI_API_KEY) — never hardcode keys in source.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL   = 'gemini-2.0-flash';
const API_URL        = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ─── Topic catalogue with per-difficulty hints ───────────────────────────────
export const TOPIC_DETAILS = {
  'number-system': {
    title: 'Number System',
    subtopics: 'LCM, HCF, Divisibility Rules, Remainders, Unit Digit Cyclicity, Trailing Zeros, Number of Factors, Simplification',
    easy:   'direct LCM/HCF of two numbers ≤100, simple divisibility check, single-step unit digit',
    medium: 'LCM×HCF product relationship, trailing zeros in factorial, factors of composite numbers, stepped remainders',
    hard:   'Chinese Remainder Theorem, last-2-digit using Euler totient/binomial theorem, high-power remainders via Fermat or Wilson theorem, cyclicity of complex expressions'
  },
  'ratio-proportion': {
    title: 'Ratio & Proportion',
    subtopics: 'Simple Ratios, Compound Ratios, Proportions, Direct/Inverse Variation, Mixtures, Alligation',
    easy:   'divide a quantity in given ratio, simple proportion, basic mixture',
    medium: 'compound ratio, three-way mixture with alligation, inverse variation word problems, k-method proportion',
    hard:   'repeated-replacement mixtures (nth replacement formula), partnership with changing investment durations, multi-stage alligation chain'
  },
  'averages': {
    title: 'Averages',
    subtopics: 'Simple Average, Weighted Average, Age Average, Score Replacement, Running Average',
    easy:   'find average of a list, find missing number given group average',
    medium: 'effect of replacement on group average, combined average of two groups, class average after adding/removing members',
    hard:   'multiple consecutive replacements changing average each time, average speed over mixed-mode journey, constrained max/min member value given average'
  },
  'ages': {
    title: 'Ages',
    subtopics: 'Present Ages, Past & Future Ages, Ratio of Ages, Multi-person Age Systems',
    easy:   'two-person age problem with simple present/past equation',
    medium: 'ratio of ages at two distinct points in time, three-person age equations',
    hard:   'five+ persons with multiple ratio conditions across several different years, min/max age constraints'
  },
  'percentages': {
    title: 'Percentages',
    subtopics: 'Percentage Change, Successive Change, Percentage of Percentage, Elections, Population Growth, Expenditure',
    easy:   'find x% of y, simple percentage increase/decrease, fraction to percent conversion',
    medium: 'successive percentage changes, population growth/decay, election majority/minority problems',
    hard:   'net change after multiple successive operations, reverse percentage (find original), combined expenditure-income with multiple % changes'
  },
  'profit-loss': {
    title: 'Profit & Loss',
    subtopics: 'Profit%, Loss%, CP, SP, Marked Price, Discount%, Faulty Weights, Multiple Items',
    easy:   'calculate profit or loss percentage, simple CP/SP given one unknown',
    medium: 'marked price + discount + profit combination, selling two items at same SP with different P% and L%',
    hard:   'dishonest dealer: faulty weights AND extra profit margin combined, multi-article trade with different buy/sell rates, overall result when some at profit and some at loss'
  },
  'simple-interest': {
    title: 'Simple Interest',
    subtopics: 'SI Formula, Principal, Rate, Time, Split Investment, Comparison Problems',
    easy:   'direct SI formula (one unknown), convert time units',
    medium: 'split principal at two different rates, compare SI for different periods',
    hard:   'three-part split investment with constraints giving same SI, installment repayment with SI, tricky rate-time-principal relationship'
  },
  'compound-interest': {
    title: 'Compound Interest',
    subtopics: 'Annual/Half-yearly/Quarterly CI, CI-SI Difference, Equal Installments, Population, Depreciation',
    easy:   'CI for 2 years compounded annually at given rate',
    medium: 'CI vs SI difference for 3 years, half-yearly compounding problems',
    hard:   'equal yearly installments with CI (loan repayment), compound depreciation + appreciation combined, CI with different rates for different years'
  },
  'time-work': {
    title: 'Time & Work',
    subtopics: 'Work Rates, Efficiency, Pipes & Cisterns, Alternate-Day Work, Work & Wages',
    easy:   'A and B together complete work — find time; basic fill/empty pipe problem',
    medium: 'three or more workers, alternate-day pattern, pipe with simultaneous leak',
    hard:   'wage distribution by efficiency, half-filled mid-way scenarios, work by a team that changes size over time, n-pipe system with timed closures'
  },
  'time-distance': {
    title: 'Time, Speed & Distance',
    subtopics: 'Basic TSD, Average Speed, Relative Speed, Meeting Points, Circular Track',
    easy:   'find one of time/distance/speed, simple average speed for two legs',
    medium: 'relative speed (opposite/same direction), two-person meeting time, speed ratio problems',
    hard:   'circular track: multiple objects, first meeting and nth meeting points; multi-leg journey speed changes; time gain/loss with % speed change'
  },
  'boats-streams': {
    title: 'Boats & Streams',
    subtopics: 'Upstream Speed, Downstream Speed, Still Water Speed, Stream Speed, Round Trips',
    easy:   'find upstream or downstream speed given the other quantities',
    medium: 'find still-water/stream speed from two journey conditions',
    hard:   'equating upstream and downstream travel time with constraints, boat with varying current, fastest crossing angle problems'
  },
  'trains': {
    title: 'Trains',
    subtopics: 'Crossing Pole/Platform/Tunnel, Two Trains Same/Opposite Direction, Overtaking',
    easy:   'single train crossing a pole or platform — find speed or length',
    medium: 'two trains crossing each other: find crossing time or missing length',
    hard:   'three or more trains, overtaking with head-start, bridge + tunnel in one journey, speed-change mid-platform'
  },
  'permutation-combination': {
    title: 'Permutation & Combination',
    subtopics: 'nPr, nCr, Circular Arrangement, Word Arrangement, Restricted Selection, Distribution',
    easy:   'basic nPr and nCr calculations, simple selection from a group',
    medium: 'circular arrangements, word arrangements with repeated letters, at-least/at-most constraints',
    hard:   'multiple restrictions combined, distributing n identical items into r groups, derangements, inclusion-exclusion principle'
  },
  'probability': {
    title: 'Probability',
    subtopics: 'Basic Probability, Conditional Probability, Independent Events, Coins/Dice/Cards/Balls',
    easy:   'probability using coins, dice, or simple card draws',
    medium: 'combined AND/OR events, conditional probability (given), two draws without replacement',
    hard:   "Bayes' theorem, multi-stage cascaded probability, expected value calculations, birthday paradox style"
  },
  'mensuration': {
    title: 'Mensuration',
    subtopics: 'Area/Perimeter of 2D shapes, Volume & Surface Area of 3D solids, Shape Transformations',
    easy:   'direct area or volume using formula with given dimensions',
    medium: 'compound shapes, path/border/shaded region area, cross-section volume',
    hard:   'solid melted and recast into new shape (volume conservation), maximise volume from sheet, combined 3D solids with overlapping regions'
  },
  'statistics': {
    title: 'Statistics',
    subtopics: 'Mean, Median, Mode, Range, Variance, Standard Deviation, Coefficient of Variation',
    easy:   'calculate mean/median/mode of a small dataset',
    medium: 'corrected mean after finding error, combined mean of two groups, grouped data median',
    hard:   'standard deviation from scratch, effect of linear transformation (a+bX) on mean/SD/variance, CV comparison, percentile calculations'
  }
};

// ─── Prompt builders ─────────────────────────────────────────────────────────

function capFirst(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Hard';
}

function buildTopicPrompt(topicId, difficulty, count, excludeTexts = []) {
  const info = TOPIC_DETAILS[topicId];
  if (!info) throw new Error(`No topic info for: ${topicId}`);

  const diff      = capFirst(difficulty);
  const diffHint  = info[diff.toLowerCase()] || info.hard;
  const exclusion = excludeTexts.length
    ? `\nDO NOT repeat these topics/structures already used:\n${excludeTexts.map((t, i) => `${i + 1}. "${t.slice(0, 100)}"`).join('\n')}\n`
    : '';

  return `You are a world-class TCS NQT Numerical Ability exam question setter.

TASK: Generate exactly ${count} unique ${diff.toUpperCase()}-difficulty MCQs on the topic "${info.title}".
Subtopics to cover: ${info.subtopics}
${diff} difficulty means: ${diffHint}
${exclusion}
━━━ STRICT REQUIREMENTS ━━━
1. All ${count} questions must be completely different — vary subtopics, numbers, and structures
2. Rotate across subtopics — never two consecutive questions on the same subtopic
3. Every calculation must be 100% correct — verify answer independently before writing
4. Exactly 4 options. One correct answer. Wrong options = typical calculation mistakes (plausible distractors)
5. HARD questions: must require 3+ steps and genuine insight — no direct formula plug-in
6. Explanation: clear step-by-step working showing exactly how to reach the answer

OUTPUT: Return ONLY a raw JSON array — NO markdown, NO prose, NO code fences:
[{"question":"<full question>","options":["<A>","<B>","<C>","<D>"],"answer":<0|1|2|3>,"explanation":"Step 1: ... Step 2: ... ∴ Answer = ...","subtopic":"<specific subtopic>"}]`;
}

function buildOverallPrompt(count, excludeTexts = []) {
  const topicList = Object.values(TOPIC_DETAILS).map(t => t.title);
  const exclusion = excludeTexts.length
    ? `\nAvoid repeating: ${excludeTexts.slice(0, 10).map(t => `"${t.slice(0, 70)}"`).join(' | ')}`
    : '';

  return `You are an expert TCS NQT exam setter. The real TCS NQT Numerical Ability section is extremely hard.

TASK: Generate exactly ${count} HARD-level MCQs for a TCS NQT Full Mock Test.
Distribute evenly across ALL these topics (minimum 1 question per topic where possible):
${topicList.join(', ')}
${exclusion}

━━━ STRICT REQUIREMENTS ━━━
1. HARD level — multi-step, tricky, requires deep insight and 3+ steps
2. Rotate topics every question — good coverage, no consecutive same-topic
3. Every calculation 100% correct — double-check before writing
4. 4 options, 1 correct, plausible distractors
5. Include "topicTitle" field set to the exact topic name from the list above

OUTPUT: Return ONLY a raw JSON array:
[{"question":"...","options":["...","...","...","..."],"answer":<0|1|2|3>,"explanation":"Step-by-step...","subtopic":"...","topicTitle":"<exact name from list>"}]`;
}

// ─── API call ─────────────────────────────────────────────────────────────────

async function callGemini(prompt) {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:      0.82,
        topP:             0.95,
        maxOutputTokens:  8192,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${msg.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');

  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\[[\s\S]*\]/);
    if (m) {
      try { return JSON.parse(m[0]); } catch {}
    }
    throw new Error('Cannot parse JSON from Gemini response');
  }
}

// ─── Normalisation helpers ────────────────────────────────────────────────────

function makeId(prefix, difficulty, idx) {
  return `ai_${prefix}_${String(difficulty).toLowerCase()}_${idx}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
}

function normalizeTopicQuestions(rawArr, topicId, difficulty, startIdx = 0) {
  if (!Array.isArray(rawArr)) return [];
  return rawArr
    .filter(q => q && typeof q.question === 'string' && q.question.trim()
              && Array.isArray(q.options) && q.options.length >= 4)
    .map((q, i) => ({
      id:          makeId(topicId, difficulty, startIdx + i),
      question:    q.question.trim(),
      options:     q.options.slice(0, 4).map(String),
      answer:      (typeof q.answer === 'number') ? Math.min(3, Math.max(0, Math.round(q.answer))) : 0,
      explanation: (q.explanation || 'Refer to the step-by-step working above.').trim(),
      subtopic:    (q.subtopic    || TOPIC_DETAILS[topicId]?.title || '').trim(),
      difficulty:  capFirst(difficulty),
      topicId,
      topicTitle:  TOPIC_DETAILS[topicId]?.title || ''
    }));
}

function normalizeOverallQuestions(rawArr) {
  if (!Array.isArray(rawArr)) return [];
  return rawArr
    .filter(q => q && typeof q.question === 'string' && q.question.trim()
              && Array.isArray(q.options) && q.options.length >= 4)
    .map((q, i) => {
      // Best-effort topic-ID resolution from topicTitle
      const entry = Object.entries(TOPIC_DETAILS).find(([, v]) => {
        const tt = (q.topicTitle || '').toLowerCase().trim();
        return v.title.toLowerCase() === tt
            || v.title.toLowerCase().includes(tt)
            || tt.includes(v.title.toLowerCase());
      });
      const tid = entry ? entry[0] : 'overall';
      return {
        id:          makeId('overall', 'hard', i),
        question:    q.question.trim(),
        options:     q.options.slice(0, 4).map(String),
        answer:      (typeof q.answer === 'number') ? Math.min(3, Math.max(0, Math.round(q.answer))) : 0,
        explanation: (q.explanation || 'See step-by-step working above.').trim(),
        subtopic:    (q.subtopic || '').trim(),
        difficulty:  'Hard',
        topicId:     tid,
        topicTitle:  q.topicTitle || TOPIC_DETAILS[tid]?.title || 'Mixed Topics'
      };
    });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate topic-wise AI questions.
 * @param {string}   topicId      - e.g. 'number-system'
 * @param {string}   difficulty   - 'easy' | 'medium' | 'hard'
 * @param {number}   count        - questions to generate
 * @param {string[]} excludeTexts - question texts already shown (to prevent repeats)
 * @param {number}   startIdx     - ID offset (for pagination uniqueness)
 */
export async function generateAIQuestions(topicId, difficulty, count = 5, excludeTexts = [], startIdx = 0) {
  const prompt    = buildTopicPrompt(topicId, difficulty, count, excludeTexts);
  const raw       = await callGemini(prompt);
  const questions = normalizeTopicQuestions(raw, topicId, difficulty, startIdx);

  if (questions.length === 0) throw new Error('AI returned 0 valid topic questions');
  return questions.slice(0, count);
}

/**
 * Generate overall mock-test AI questions (always HARD, mixed topics).
 * @param {number}   count        - questions to generate
 * @param {string[]} excludeTexts - question texts already shown
 */
export async function generateAIOverallQuestions(count = 10, excludeTexts = []) {
  const prompt    = buildOverallPrompt(count, excludeTexts);
  const raw       = await callGemini(prompt);
  const questions = normalizeOverallQuestions(raw);

  if (questions.length === 0) throw new Error('AI returned 0 valid overall questions');
  return questions.slice(0, count);
}
