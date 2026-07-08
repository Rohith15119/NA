// ─── Gemini AI Question Generator Service ────────────────────────────────────
// API key is loaded from .env (VITE_GEMINI_API_KEY) — never hardcode keys in source.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL   = 'gemini-2.0-flash';
const API_URL        = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ─── Topic catalogue with TCS NQT level hints ─────────────────────────────────
export const TOPIC_DETAILS = {
  'number-system': {
    title: 'Number System',
    subtopics: 'LCM, HCF, Divisibility Rules, Remainders, Unit Digit Cyclicity, Trailing Zeros, Number of Factors, Simplification',
    hint: 'Complex system of congruence equations, advanced Euler totient counts φ(N), Fermat Littles modulo composite variables, complex divisors and factorization count tricks, and base system conversion logic under time pressure.'
  },
  'ratio-proportion': {
    title: 'Ratio & Proportion',
    subtopics: 'Simple Ratios, Compound Ratios, Proportions, Direct/Inverse Variation, Mixtures, Alligation',
    hint: 'Multi-leg compound ratios, complex partnerships where profit share is reinvested at varying cycles, complex repeated replacements with non-identical replacement quantities, and multi-component weighted mixtures.'
  },
  'averages': {
    title: 'Averages',
    subtopics: 'Simple Average, Weighted Average, Age Average, Score Replacement, Running Average',
    hint: 'Tricky consecutive replacements with varying values, weighted average variations of multiple subsets with overlapping constraints, and dynamic averages of Arithmetic Progressions (AP).'
  },
  'mixture-alligation': {
    title: 'Mixture & Alligation',
    subtopics: 'Weighted Mixtures, Alligation Rule, Repeated Replacements, Solution Concentration, Purity & Cost Optimization',
    hint: 'Multi-stage repeated replacements with unequal fractions, multi-container weighted mixing with profit margins, and complex alligation of three or more components.'
  },
  'percentages': {
    title: 'Percentages',
    subtopics: 'Percentage Change, Successive Change, Percentage of Percentage, Elections, Population Growth, Expenditure',
    hint: 'Multi-stage successive percentage changes with tax-on-tax (cascaded duties), voter turnout math with invalid/spoiled ballot equations, and multi-variable budget optimization percentage change.'
  },
  'profit-loss': {
    title: 'Profit & Loss',
    subtopics: 'Profit%, Loss%, CP, SP, Marked Price, Discount%, Faulty Weights, Multiple Items',
    hint: 'Complex markup structures combined with multiple successions of random discount campaigns, dishonest trade where weights are manipulated in both buying AND selling, and triple-transaction supply chain margin optimization.'
  },
  'simple-interest': {
    title: 'Simple Interest',
    subtopics: 'SI Formula, Principal, Rate, Time, Split Investment, Comparison Problems',
    hint: 'Multi-part split investments with time duration constraints, complex equal installment repayment equations with interest accruals, and step-up rates of interest.'
  },
  'compound-interest': {
    title: 'Compound Interest',
    subtopics: 'Annual/Half-yearly/Quarterly CI, CI-SI Difference, Equal Installments, Population, Depreciation',
    hint: 'Multilevel equal installment schemes compounded at varying frequencies, multi-year rate variation with compounded growth and periodic withdrawals, and complex CI vs SI comparison equations.'
  },
  'time-work': {
    title: 'Time & Work',
    subtopics: 'Work Rates, Efficiency, Pipes & Cisterns, Alternate-Day Work, Work & Wages',
    hint: 'Complex alternate-day rotations with varying individual efficiencies, wages divided among teams with shifting members, and multi-pipe systems with varying inflow/outflow rates and timed valve operations.'
  },
  'time-distance': {
    title: 'Time, Speed & Distance',
    subtopics: 'Basic TSD, Average Speed, Relative Speed, Meeting Points, Circular Track',
    hint: 'Circular track races with 3+ competitors finding exact meeting points and intervals, relative speed problems with delay offsets and variable accelerations, and multi-leg speed-time optimization.'
  },
  'boats-streams': {
    title: 'Boats & Streams',
    subtopics: 'Upstream Speed, Downstream Speed, Still Water Speed, Stream Speed, Round Trips',
    hint: 'Multi-lap downstream/upstream races with varying currents, motorboat engine failure mid-journey with speed drop, and speed ratios under non-linear current changes.'
  },
  'trains': {
    title: 'Trains',
    subtopics: 'Crossing Pole/Platform/Tunnel, Two Trains Same/Opposite Direction, Overtaking',
    hint: 'Three-train overtaking systems with variable head-starts, relative crossing speeds in non-parallel crossing tracks, and platform/tunnel transitions with variable acceleration.'
  },
  'permutation-combination': {
    title: 'Permutation & Combination',
    subtopics: 'nPr, nCr, Circular Arrangement, Word Arrangement, Restricted Selection, Distribution',
    hint: 'Complex restricted arrangements (letters, digits) under multiple conditions, distributing distinct items to groups with size constraints, circular table seating with specific adjacencies and non-adjacencies, and complex derangement permutations.'
  },
  'probability': {
    title: 'Probability',
    subtopics: 'Basic Probability, Conditional Probability, Independent Events, Coins/Dice/Cards/Balls',
    hint: 'Bayes\' Theorem with multiple dependent variables, probability of success in infinite sequential trials (games of chance), complex conditional selections without replacement, and expected value payoff structures.'
  },
  'mensuration': {
    title: 'Mensuration',
    subtopics: 'Area/Perimeter of 2D shapes, Volume & Surface Area of 3D solids, Shape Transformations',
    hint: 'Recasting solids with a percentage metal loss, nested 3D geometries (largest sphere inside cone inside cylinder), and volume optimization of folded sheets with precise boundaries.'
  },
  'statistics': {
    title: 'Statistics',
    subtopics: 'Mean, Median, Mode, Range, Variance, Standard Deviation, Coefficient of Variation',
    hint: 'Coefficient of Variation (CV) comparisons with incomplete dataset properties, SD calculations under multiple data corrections, and linear transformations with variance impact.'
  }
};

// ─── Prompt builders ─────────────────────────────────────────────────────────

function buildTopicPrompt(topicId, count, excludeTexts = []) {
  const info = TOPIC_DETAILS[topicId];
  if (!info) throw new Error(`No topic info for: ${topicId}`);

  const exclusion = excludeTexts.length
    ? `\nDO NOT repeat these topics/structures already used:\n${excludeTexts.map((t, i) => `${i + 1}. "${t.slice(0, 100)}"`).join('\n')}\n`
    : '';

  return `You are a world-class TCS NQT Numerical Ability exam question setter.

TASK: Generate exactly ${count} unique TCS NQT Exam Level MCQs on the topic "${info.title}".
Subtopics to cover: ${info.subtopics}
TCS NQT Level requires: ${info.hint}
${exclusion}
━━━ STRICT REQUIREMENTS ━━━
1. All ${count} questions must be completely different — vary subtopics, numbers, and structures
2. Rotate across subtopics — never two consecutive questions on the same subtopic
3. Every calculation must be 100% correct — verify answer independently before writing
4. Exactly 4 options. One correct answer. Wrong options = typical calculation mistakes (plausible distractors)
5. Questions must be scenario-based word problems of 3 to 5 lines. They should have a clear, easy-to-understand real-world scenario, but require multi-step logical thinking, clever shortcuts, and strong quantitative skills to solve. Avoid dry, one-line arithmetic equations.
6. NO LaTeX formatting or math delimiters like $ or $$. Write equations and values in clean, plain-text human-readable format. E.g., write 'x squared' or 'x^2' instead of 'x²', write '3/5' or '3 out of 5' instead of '\\frac{3}{5}', write 'phi(N)' instead of '\\phi(N)', and write 'pi' instead of 'π'.
7. Explanation: clear step-by-step working showing exactly how to reach the answer
8. STRICT SYLLABUS LIMITATION: Ensure questions do NOT use concepts outside the standard TCS NQT syllabus (e.g. absolutely NO calculus, NO trigonometry, NO coordinate geometry, NO complex numbers, and NO advanced physics). Focus strictly on commercial math, arithmetic, algebra, simple logarithms, quadratic equations, simple inequalities, mensuration (area/volume), statistics, probability, and permutations/combinations.
9. STRICT VALIDATION: You must verify that the math holds true. Solve the problem yourself first to check that the correct option is exactly equal to the mathematical result, and distractor options are mathematically clean numbers. Verify that the answer index (0-3) points to the correct option exactly.

OUTPUT: Return ONLY a raw JSON array — NO markdown, NO prose, NO code fences:
[{"question":"<full question>","options":["<A>","<B>","<C>","<D>"],"answer":<0|1|2|3>,"explanation":"Step 1: ... Step 2: ... ∴ Answer = ...","subtopic":"<specific subtopic>"}]`;
}

function buildOverallPrompt(count, excludeTexts = []) {
  const topicList = Object.values(TOPIC_DETAILS).map(t => t.title);
  const exclusion = excludeTexts.length
    ? `\nAvoid repeating: ${excludeTexts.slice(0, 10).map(t => `"${t.slice(0, 70)}"`).join(' | ')}`
    : '';

  return `You are an expert TCS NQT exam setter. The real TCS NQT Numerical Ability section is extremely challenging.

TASK: Generate exactly ${count} EXPERT-level MCQs for a TCS NQT Full Mock Test.
Distribute evenly across ALL these topics (minimum 1 question per topic where possible):
${topicList.join(', ')}
${exclusion}

━━━ STRICT REQUIREMENTS ━━━
1. EXPERT level — matching the actual TCS NQT difficulty (multi-step, tricky, requires deep insight, 3+ steps)
2. All questions must be scenario-based word problems of 3 to 5 lines. They should have a clear, easy-to-understand real-world scenario, but require multi-step logical thinking, clever shortcuts, and strong quantitative skills to solve. Avoid dry, one-line arithmetic equations.
3. NO LaTeX formatting or math delimiters like $ or $$. Write equations and values in clean, plain-text human-readable format. E.g., write 'x squared' or 'x^2' instead of 'x²', write '3/5' or '3 out of 5' instead of '\\frac{3}{5}', write 'phi(N)' instead of '\\phi(N)', and write 'pi' instead of 'π'.
4. Rotate topics every question — good coverage, no consecutive same-topic
5. Every calculation 100% correct — double-check before writing
6. 4 options, 1 correct, plausible distractors
7. Include "topicTitle" field set to the exact topic name from the list above
8. STRICT SYLLABUS LIMITATION: Ensure questions do NOT use concepts outside the standard TCS NQT syllabus (e.g. absolutely NO calculus, NO trigonometry, NO coordinate geometry, NO complex numbers, and NO advanced physics). Focus strictly on commercial math, arithmetic, algebra, simple logarithms, quadratic equations, simple inequalities, mensuration (area/volume), statistics, probability, and permutations/combinations.
9. STRICT VALIDATION: You must verify that the math holds true. Solve the problem yourself first to check that the correct option is exactly equal to the mathematical result, and distractor options are mathematically clean numbers. Verify that the answer index (0-3) points to the correct option exactly.

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

function normalizeTopicQuestions(rawArr, topicId, startIdx = 0) {
  if (!Array.isArray(rawArr)) return [];
  return rawArr
    .filter(q => q && typeof q.question === 'string' && q.question.trim()
              && Array.isArray(q.options) && q.options.length >= 4)
    .map((q, i) => ({
      id:          makeId(topicId, 'expert', startIdx + i),
      question:    q.question.trim(),
      options:     q.options.slice(0, 4).map(String),
      answer:      (typeof q.answer === 'number') ? Math.min(3, Math.max(0, Math.round(q.answer))) : 0,
      explanation: (q.explanation || 'Refer to the step-by-step working above.').trim(),
      subtopic:    (q.subtopic    || TOPIC_DETAILS[topicId]?.title || '').trim(),
      difficulty:  'Expert',
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
        id:          makeId('overall', 'expert', i),
        question:    q.question.trim(),
        options:     q.options.slice(0, 4).map(String),
        answer:      (typeof q.answer === 'number') ? Math.min(3, Math.max(0, Math.round(q.answer))) : 0,
        explanation: (q.explanation || 'See step-by-step working above.').trim(),
        subtopic:    (q.subtopic || '').trim(),
        difficulty:  'Expert',
        topicId:     tid,
        topicTitle:  q.topicTitle || TOPIC_DETAILS[tid]?.title || 'Mixed Topics'
      };
    });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate topic-wise AI questions.
 * @param {string}   topicId      - e.g. 'number-system'
 * @param {string}   difficulty   - (deprecated, always expert)
 * @param {number}   count        - questions to generate
 * @param {string[]} excludeTexts - question texts already shown (to prevent repeats)
 * @param {number}   startIdx     - ID offset (for pagination uniqueness)
 */
export async function generateAIQuestions(topicId, difficulty, count = 5, excludeTexts = [], startIdx = 0) {
  const prompt    = buildTopicPrompt(topicId, count, excludeTexts);
  const raw       = await callGemini(prompt);
  const questions = normalizeTopicQuestions(raw, topicId, startIdx);

  if (questions.length === 0) throw new Error('AI returned 0 valid topic questions');
  return questions.slice(0, count);
}

/**
 * Generate overall mock-test AI questions (always Expert level, mixed topics).
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
