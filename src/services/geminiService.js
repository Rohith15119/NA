// ─── Gemini AI Question Generator Service ────────────────────────────────────
// API key is loaded from .env (VITE_GEMINI_API_KEY) — never hardcode keys in source.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL   = 'gemini-2.0-flash';
const API_URL        = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ─── Exhaustive Topic Catalogue — All Models & Variations ─────────────────────
// Each topic lists ALL question models TCS NQT uses, tiered by difficulty.
// The AI prompt enforces rotation across these models and tags each question Easy/Medium/Hard.

export const TOPIC_DETAILS = {
  'number-system': {
    title: 'Number System',
    subtopics: 'LCM & HCF, Divisibility Rules (2–19), Factors & Multiples, Remainders & CRT, Unit Digit Cyclicity, Trailing Zeros in Factorials, Highest Power of Prime in n!, Base Conversions, Perfect Squares & Cubes, AP/GP in Number Context',
    models: [
      '[EASY] LCM/HCF of 2 or 3 numbers using prime factorization',
      '[EASY] Basic divisibility rule check and application',
      '[EASY] Number of factors / sum of factors of a given number',
      '[MEDIUM] LCM-based problem: smallest number leaving same remainder when divided by x, y, z',
      '[MEDIUM] Constant-deficit model: largest number below N divisible by x, y, z with same remainder',
      '[MEDIUM] Unit digit cyclicity: last digit of a^b for large b',
      '[MEDIUM] Number of trailing zeros in n! using Legendre formula',
      '[MEDIUM] Highest power of prime p in n! (Legendre\'s formula)',
      '[MEDIUM] Base conversion: decimal to binary/octal/hex or vice versa',
      '[HARD] Chinese Remainder Theorem (simultaneous congruences)',
      '[HARD] Fermat\'s Little Theorem / Euler\'s Theorem for remainder of a^b mod p',
      '[HARD] Highest power of composite number (e.g. 12, 36) dividing n!'
    ]
  },

  'simplification': {
    title: 'Simplification & Approximation',
    subtopics: 'BODMAS, Nested Fractions, Surds & Indices, Decimal Approximation, Square Root Estimation, Algebraic Identities',
    models: [
      '[EASY] Straightforward BODMAS with brackets and mixed operations',
      '[EASY] Fraction simplification with LCM of denominators',
      '[EASY] Decimal addition/subtraction/multiplication in word context',
      '[MEDIUM] Nested fraction: complex expression with 3+ levels of fractions',
      '[MEDIUM] Indices: simplify expressions with fractional/negative exponents',
      '[MEDIUM] Surd comparison: which of a^(1/m) or b^(1/n) is greater',
      '[MEDIUM] Approximation: estimate answer to nearest integer/decimal with 1–2% error tolerance',
      '[MEDIUM] Telescoping surd series: 1/(sqrt(1)+sqrt(2)) + ... + 1/(sqrt(99)+sqrt(100))',
      '[HARD] Nested radical simplification: sqrt(a + sqrt(a + sqrt(a + ...)))',
      '[HARD] Combined indices and surd equation: find the value of x'
    ]
  },

  'ratio-proportion': {
    title: 'Ratio & Proportion',
    subtopics: 'Basic Ratios, Compound Ratios, Three-Part Ratio, Componendo-Dividendo, Mean/Third/Fourth Proportional, Direct & Inverse Variation, Joint Variation, Chain Rule',
    models: [
      '[EASY] Splitting a total amount in a given ratio',
      '[EASY] Finding the missing value in a proportion a:b = c:?',
      '[EASY] Combining A:B and B:C to get A:B:C',
      '[MEDIUM] Componendo-Dividendo application to find ratio',
      '[MEDIUM] Mean proportional between two numbers',
      '[MEDIUM] Third proportional and fourth proportional',
      '[MEDIUM] Direct variation: find unknown when one variable changes',
      '[MEDIUM] Inverse variation: more workers/less time type problems',
      '[MEDIUM] Three-part proportional division with additional constraint',
      '[HARD] Joint variation: z varies directly as x^m and inversely as y^n',
      '[HARD] Chain rule (MDH = constant) with 3 changing parameters',
      '[HARD] Compound ratio of three or more ratios applied to a word problem'
    ]
  },

  'ages': {
    title: 'Problems on Ages',
    subtopics: 'Present Age Equations, Age Ratio at Two Time Points, Average Age, Age Difference, Multi-Person Systems, Father-Son-Grandfather chains',
    models: [
      '[EASY] Find present age given a simple linear condition',
      '[EASY] Age ratio given: find individual ages',
      '[EASY] Father/son age problem: one condition in present, one in future',
      '[MEDIUM] Age ratio at two different time points (present and n years ago/later)',
      '[MEDIUM] Average age of a group with one person joining/leaving',
      '[MEDIUM] Three-person age system with two constraints',
      '[MEDIUM] Age of a person as a fraction of another\'s age at a specific time',
      '[HARD] Multi-person chain: A is x years older than B, B is y years younger than C, etc.',
      '[HARD] Cross-year age comparison: A\'s age n years ago equals B\'s age m years later'
    ]
  },

  'averages': {
    title: 'Averages',
    subtopics: 'Simple Average, Weighted Average, Replacement Effect, Running Average, Batting Average, Average Speed, Corrected Mean',
    models: [
      '[EASY] Simple average of a set of numbers',
      '[EASY] Find the missing number given average of a list',
      '[MEDIUM] Weighted average of two or more groups',
      '[MEDIUM] Effect on average when one member is replaced by another',
      '[MEDIUM] Effect on average when a new member joins or one member leaves',
      '[MEDIUM] Batting average: runs needed in next innings to reach a target average',
      '[MEDIUM] Average speed over two legs with different speeds (use harmonic mean when equal distances)',
      '[HARD] Corrected average after wrong value was included',
      '[HARD] Consecutive integers average problem with missing or added terms'
    ]
  },

  'mixture-alligation': {
    title: 'Mixture & Alligation',
    subtopics: 'Basic Alligation Rule, Weighted Mixture, Repeated Replacement, Three-Component Blend, Milk-Water Dilution, Profit-based Alligation, Cost Optimization',
    models: [
      '[EASY] Basic alligation: find ratio of mixing two commodities at different prices',
      '[EASY] Two liquids mixed: find resultant concentration',
      '[MEDIUM] Find quantity of cheaper/costlier ingredient given mean price',
      '[MEDIUM] Repeated replacement: fraction of liquid replaced k times — purity after k operations',
      '[MEDIUM] Milk and water mixture: add water to reduce concentration to target',
      '[MEDIUM] Three-component alligation (two-step alligation)',
      '[HARD] Profit-based alligation: mixing at different CPs to achieve target profit%',
      '[HARD] Two vessels mixed in ratio: find final concentration'
    ]
  },

  'percentages': {
    title: 'Percentages',
    subtopics: 'Basic % Change, Successive % Change, Elections & Voting, Expenditure vs Savings, Population Growth, Price Rise & Consumption, Salary Increase/Decrease',
    models: [
      '[EASY] Calculate x% of a number; find what percent A is of B',
      '[EASY] Percentage increase or decrease between two values',
      '[MEDIUM] Successive percentage changes (net % change formula)',
      '[MEDIUM] Salary increased by x%, then decreased by y% — net change on original',
      '[MEDIUM] Election problem: candidate wins by n votes, votes polled, % of total',
      '[MEDIUM] Price rises by x% — consumption must fall by what % to keep expenditure constant',
      '[MEDIUM] Population growth: find population after n years at r% per year',
      '[HARD] Multiple successive changes with unknown base — reverse calculation',
      '[HARD] Two items bought, percentage profit on combined vs individual transactions'
    ]
  },

  'profit-loss': {
    title: 'Profit, Loss & Discount',
    subtopics: 'Basic Profit & Loss, CP/SP/MP calculations, Successive Discounts, Faulty Weights, Two-Item Problems, Buy X Get Y Free, Break-even Analysis',
    models: [
      '[EASY] Find profit% or loss% given CP and SP',
      '[EASY] Find SP given CP and profit/loss percentage',
      '[EASY] Find CP given SP and profit/loss percentage',
      '[MEDIUM] Marked price, discount%, find SP; then find profit% over CP',
      '[MEDIUM] Successive discounts: find equivalent single discount',
      '[MEDIUM] Faulty weight problem: trader uses x g weight instead of 100g — actual profit%',
      '[MEDIUM] Two items sold at same SP: one at x% profit, other at x% loss — net result',
      '[MEDIUM] Buy n get m free — effective discount percentage',
      '[HARD] Combined markup and multiple successive discounts to achieve target profit',
      '[HARD] Cost price of mixture using alligation + profit% on selling price calculation'
    ]
  },

  'interest-installments': {
    title: 'Simple & Compound Interest',
    subtopics: 'SI Basics, CI Annual/Half-yearly/Quarterly, CI–SI Difference (2 & 3 years), Equal Installments, EMI, Depreciation, Population Growth at CI',
    models: [
      '[EASY] Find SI given P, R, T; find one unknown given others',
      '[EASY] Find CI for 2 years annually; compare with SI',
      '[MEDIUM] CI compounded half-yearly or quarterly — find amount',
      '[MEDIUM] CI – SI difference formula for 2 years: P(R/100)^2',
      '[MEDIUM] CI – SI difference for 3 years using formula',
      '[MEDIUM] Find rate R% when CI and SI for same period are given',
      '[MEDIUM] Depreciation: machine depreciates at r% per year — find value after n years',
      '[HARD] Equal annual installment repayment — find installment amount',
      '[HARD] Population grows at r% for n years — find original or future population',
      '[HARD] Split investment: part at r1%, rest at r2%, total interest given — find split'
    ]
  },

  'time-work': {
    title: 'Time & Work',
    subtopics: 'Individual Work Rate (LCM method), Combined Work, Alternate-Day Work, Work & Wages, Pipes Filling, Pipes with Leak, Chain Rule (MDH)',
    models: [
      '[EASY] A does work in m days, B in n days — together how long?',
      '[EASY] A, B, C together finish in x days — if C leaves after y days, how long total?',
      '[MEDIUM] Alternate-day working: A and B work on alternate days starting with A',
      '[MEDIUM] Work and wages: wages distributed in ratio of work done',
      '[MEDIUM] Pipe A fills in m hours, Pipe B empties in n hours — net time to fill',
      '[MEDIUM] Efficiency ratio given: A is k times as efficient as B — find days',
      '[MEDIUM] Chain rule (MDH): M men, D days, H hours/day = constant work',
      '[HARD] A, B, C with varying efficiencies, some leave partway — find completion time',
      '[HARD] Pipes with a leak: tank fills in m hours but leak empties it in n hours',
      '[HARD] Three pipes: two filling, one draining — opened and closed at different times'
    ]
  },

  'time-speed-distance': {
    title: 'Time, Speed & Distance',
    subtopics: 'Basic SDT, Average Speed (Two Legs), Relative Speed (Same/Opposite Direction), Meeting Points, Circular Track, Race & Head Start, Speed with Stoppages',
    models: [
      '[EASY] Basic: find time/speed/distance given the other two',
      '[EASY] Convert km/h to m/s and vice versa in a problem',
      '[MEDIUM] Average speed when two legs have different speeds (harmonic mean for equal distances)',
      '[MEDIUM] Two people moving towards each other — when and where do they meet?',
      '[MEDIUM] Two people moving in same direction — when does the faster one overtake?',
      '[MEDIUM] Race: A gives B a head start of x metres or y seconds — find win margin',
      '[MEDIUM] Speed with stoppages: average speed including halt time',
      '[HARD] Circular track: two runners, first meeting time; number of meetings in T minutes',
      '[HARD] Three runners on circular track — find time for all three to meet at start',
      '[HARD] A leaves at t1, B leaves at t2 — B catches A at point P — find speeds or distance'
    ]
  },

  'boat-streams-trains': {
    title: 'Boats, Streams & Trains',
    subtopics: 'Upstream & Downstream Speed, Speed of Boat in Still Water, Stream Speed, Train Crossing Pole/Platform/Bridge, Two Trains Meeting, Train Passing Moving Person',
    models: [
      '[EASY] Upstream speed = u, downstream speed = d — find boat speed and stream speed',
      '[EASY] Train crosses a pole in t1 seconds and a platform in t2 seconds — find length',
      '[MEDIUM] Boat travels x km upstream and y km downstream in same time — find stream speed',
      '[MEDIUM] Boat goes from A to B and back — find total time given speeds',
      '[MEDIUM] Two trains running in same direction — time to pass each other',
      '[MEDIUM] Two trains running opposite direction — time to cross',
      '[MEDIUM] Train passes a man walking towards or away from it — find train length or speed',
      '[HARD] Boat: time upstream = k times time downstream — express speed relationship',
      '[HARD] Boat A and B start from opposite banks simultaneously — where do they meet first and second?'
    ]
  },

  'data-interpretation': {
    title: 'Data Interpretation',
    subtopics: 'Tabular DI, Bar Chart, Pie Chart (Sector%), Line Graph Trends, Caselet DI, Multi-Source DI, Ratio & Average Calculations from Data',
    models: [
      '[EASY] Read a value directly from a table or chart',
      '[EASY] Find percentage of a total from pie chart sector data',
      '[MEDIUM] Calculate percentage change between two years from bar/line graph',
      '[MEDIUM] Find ratio of two quantities read from the same chart',
      '[MEDIUM] Calculate average of a subset of data from a table',
      '[MEDIUM] Caselet: organize paragraph data into a mental table; then answer questions',
      '[MEDIUM] Find which category has the highest/lowest percentage growth',
      '[HARD] Multi-source DI: combine data from two charts to answer a question',
      '[HARD] Missing value in table: use row/column totals to find the unknown entry'
    ]
  },

  'perm-comb-prob': {
    title: 'Permutations, Combinations & Probability',
    subtopics: 'nPr & nCr Basics, Word Arrangements, Circular Seating, Selections from Groups, Dice & Cards, Conditional Probability, At-Least Probability, Expected Value',
    models: [
      '[EASY] Basic nCr and nPr calculation in a selection/arrangement context',
      '[EASY] Probability of an event from a simple sample space (dice, coin)',
      '[MEDIUM] Word arrangements with repeated letters or specific letter constraints',
      '[MEDIUM] Circular seating: n people arranged in a circle — with/without fixed positions',
      '[MEDIUM] Selecting a committee with gender/role restrictions using nCr',
      '[MEDIUM] Probability from a deck of cards or pair of dice',
      '[MEDIUM] At-least-one probability using complement rule: P(at least 1) = 1 - P(none)',
      '[HARD] Conditional probability: P(A|B) using Bayes-style setup',
      '[HARD] Arrangements with both adjacent AND non-adjacent constraints simultaneously',
      '[HARD] Expected value of a payoff structure in a probability game'
    ]
  },

  'quadratic-equations': {
    title: 'Quadratic Equations',
    subtopics: 'Factoring Method, Quadratic Formula, Nature of Roots (Discriminant), Sum & Product of Roots, Common Root, Quadratic Word Problems, Compare Two Quadratics',
    models: [
      '[EASY] Solve a quadratic by factoring; identify roots',
      '[EASY] Use quadratic formula for a given equation',
      '[MEDIUM] Find sum and product of roots without solving the equation',
      '[MEDIUM] Form a quadratic whose roots are given (e.g. 3 more than roots of another)',
      '[MEDIUM] Discriminant: determine nature of roots (real/equal/imaginary)',
      '[MEDIUM] Quadratic word problem: number, age, or geometric area context',
      '[HARD] Common root between two quadratic equations — find that root',
      '[HARD] Compare two quadratic equations — determine relation between their roots'
    ]
  },

  'inequalities': {
    title: 'Inequalities',
    subtopics: 'Linear Inequalities, Quadratic Inequalities (Sign Method), Modulus Inequalities, Double Inequalities, Integer Solutions in Range',
    models: [
      '[EASY] Solve a simple linear inequality; state the solution set',
      '[EASY] Find integer values satisfying a double inequality a < x < b',
      '[MEDIUM] Quadratic inequality: find the range of x using sign scheme',
      '[MEDIUM] Modulus inequality |x - a| < b — find range of x',
      '[MEDIUM] Modulus inequality |x - a| > b — find range of x (two separate regions)',
      '[HARD] Combined modulus and quadratic inequality',
      '[HARD] System of two simultaneous inequalities — find common solution'
    ]
  },

  'logarithms': {
    title: 'Logarithms',
    subtopics: 'Log Properties (Product/Quotient/Power Rule), Change of Base, Log Equations, Number of Digits in a^b, Log Inequalities',
    models: [
      '[EASY] Apply product/quotient/power rule to simplify a log expression',
      '[EASY] Find log value using given log table data (e.g. log 2, log 3)',
      '[MEDIUM] Change of base: convert log_a(b) to log_c form',
      '[MEDIUM] Solve a log equation: log_x(N) = k — find x or N',
      '[MEDIUM] Find number of digits in a^b using floor(b * log10(a)) + 1',
      '[MEDIUM] Simplify an expression like log(a^2 * b^3 / c^4)',
      '[HARD] Log inequality: log_a(x) > k — solve with base >1 and 0<base<1 cases',
      '[HARD] Combined log equation with two unknowns'
    ]
  },

  'mensuration': {
    title: 'Mensuration',
    subtopics: '2D Shapes (Triangle/Circle/Trapezium/Rhombus), Composite Areas, Paths & Borders, 3D Shapes (Cube/Cylinder/Cone/Sphere/Hemisphere), Surface Area, Volume, Recasting, Shape Transformation',
    models: [
      '[EASY] Area and perimeter of standard 2D shapes: rectangle, square, triangle, circle',
      '[EASY] Volume of a cube, cuboid, or cylinder',
      '[MEDIUM] Composite 2D area: total area minus cut-out area',
      '[MEDIUM] Path/border area: outer area minus inner area',
      '[MEDIUM] Surface area and volume of cone, sphere, or hemisphere',
      '[MEDIUM] Recasting: a solid melted and recast into another shape — find dimensions',
      '[MEDIUM] Largest sphere/cylinder/cone inscribed inside another 3D shape',
      '[HARD] Volume conservation with percentage material loss during recasting',
      '[HARD] Combined shape: cylinder with hemispheres on both ends — find total SA and volume'
    ]
  },

  'statistics': {
    title: 'Statistics',
    subtopics: 'Arithmetic Mean & Weighted Mean, Median & Mode, Range, Variance & Standard Deviation, Coefficient of Variation, Corrected Mean',
    models: [
      '[EASY] Find mean, median, or mode of a given data set',
      '[EASY] Find range of a data set',
      '[MEDIUM] Weighted mean of two or more groups',
      '[MEDIUM] Corrected mean after an incorrect value is fixed',
      '[MEDIUM] Find variance and standard deviation of a small data set',
      '[MEDIUM] Effect on SD when a constant is added to all values (SD unchanged)',
      '[MEDIUM] Coefficient of Variation = (SD / Mean) * 100 — compare two data sets',
      '[HARD] Find missing value given mean and SD are both known',
      '[HARD] Median of a combined dataset from two groups'
    ]
  },

  'number-series': {
    title: 'Number & Letter Series',
    subtopics: 'AP/GP Series, Square/Cube Patterns, Difference Series, Mixed Pattern Series, Wrong Term Detection, Letter-Number Series, Two-Tier Interleaved Series',
    models: [
      '[EASY] Find next term in a simple AP or GP series',
      '[EASY] Identify pattern: squares or cubes of consecutive integers',
      '[MEDIUM] Difference series: first-level differences form AP or GP',
      '[MEDIUM] Square ± constant pattern (e.g. n^2 + 3)',
      '[MEDIUM] Interleaved series: odd-position and even-position terms follow separate patterns',
      '[MEDIUM] Mixed pattern: alternating add and multiply rules',
      '[MEDIUM] Wrong term detection: find and correct the odd one out',
      '[HARD] Two-tier difference series: second-level differences form a pattern',
      '[HARD] Letter-number coded series: positional values follow a mathematical rule'
    ]
  },

  'clocks-calendars': {
    title: 'Clocks & Calendars',
    subtopics: 'Angle Between Clock Hands, Clock Coincidences & Oppositions, Gaining/Losing Clock, Day of Week (Odd Days Method), Leap Year Rules, Date Difference',
    models: [
      '[EASY] Find angle between hour and minute hand at a given time',
      '[EASY] What day of the week is a given date (using odd-days method)?',
      '[MEDIUM] At what time between H and (H+1) o\'clock do hands coincide?',
      '[MEDIUM] At what time between H and (H+1) o\'clock are hands exactly opposite?',
      '[MEDIUM] Clock gains/loses x minutes per hour — find correct time after y hours',
      '[MEDIUM] Broken/faulty clock shows wrong time — find actual time elapsed',
      '[MEDIUM] Leap year and non-leap year day counting',
      '[HARD] In a mirror image of a clock, what is the actual time?',
      '[HARD] Two clocks set at different times — when do they show the same time again?'
    ]
  },

  'seating-arrangement': {
    title: 'Seating Arrangement',
    subtopics: 'Linear Row, Circular Arrangement, Double-Row Facing, Rectangular Table, Puzzle-Based Arrangement',
    models: [
      '[EASY] Simple linear arrangement: find position of a person given clues',
      '[MEDIUM] Circular arrangement: find who sits to the left/right of a person',
      '[MEDIUM] Double-row arrangement: two rows facing each other — find neighbour',
      '[HARD] Rectangular/square table seating with constraints on corners and sides',
      '[HARD] Multi-constraint puzzle: 6–8 people with 5+ conditions — find complete arrangement'
    ]
  },

  'blood-relations': {
    title: 'Blood Relations',
    subtopics: 'Direct Relations, Coded Relations, Family Tree (3+ Generations), Pointing Puzzles, Mixed Gender Relations',
    models: [
      '[EASY] Simple one-step relation: A is B\'s brother\'s father — what is A to B?',
      '[EASY] Two-step relation chain: find the relationship between A and C via B',
      '[MEDIUM] Coded relation: "A # B" means A is the mother of B — decode and find relation',
      '[MEDIUM] Pointing puzzle: "Pointing to a photo, X says \'His father is my father\'s son\'" — find relation',
      '[HARD] Family tree puzzle: 3–4 generation constraints — build tree to find relation',
      '[HARD] Mixed gender ambiguity: determine gender from context then find relation'
    ]
  },

  'coding-decoding': {
    title: 'Coding & Decoding',
    subtopics: 'Letter Shift (Caesar), Reverse Alphabet, Number Substitution, Symbol Coding, Word-Position Coding, Mixed Coding',
    models: [
      '[EASY] Letter shift: each letter shifted forward/backward by k positions',
      '[EASY] Reverse alphabet: A=Z, B=Y, C=X etc. — decode a word',
      '[MEDIUM] Number substitution: letters assigned numbers — decode a word or number',
      '[MEDIUM] Symbol coding: specific symbols replace specific letters — find code for new word',
      '[MEDIUM] Position-based coding: first letter coded differently from last letter',
      '[HARD] Mixed coding: a combination of shift + reverse + number — apply layered rules',
      '[HARD] Decode the rule from examples then apply to new word'
    ]
  },

  'direction-sense': {
    title: 'Direction Sense',
    subtopics: 'Final Position & Direction, Total Distance Travelled, Shortest Distance (Pythagorean), Shadow Direction (Morning/Evening), Relative Direction',
    models: [
      '[EASY] Follow direction instructions — find final facing direction',
      '[EASY] Follow movement instructions — find which direction from start',
      '[MEDIUM] Calculate straight-line (shortest) distance from start to end using Pythagoras',
      '[MEDIUM] Shadow direction: person faces North at sunrise — shadow falls in which direction?',
      '[MEDIUM] Multiple turns with distances — find total displacement vector',
      '[HARD] Two people start from same point, travel in different directions — how far apart?',
      '[HARD] Relative direction: B is to the South-East of A — deduce other relative positions'
    ]
  }
};

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildTopicPrompt(topicId, count, excludeTexts = []) {
  const info = TOPIC_DETAILS[topicId];
  if (!info) throw new Error(`No topic info for: ${topicId}`);

  const modelList = (info.models || []).join('\n  ');

  const exclusion = excludeTexts.length
    ? `\nDO NOT repeat these question structures already used:\n${excludeTexts.map((t, i) => `${i + 1}. "${t.slice(0, 100)}"`).join('\n')}\n`
    : '';

  return `You are a world-class TCS NQT exam question setter specializing in "${info.title}".

TASK: Generate exactly ${count} unique, high-quality MCQs on "${info.title}" for TCS NQT 2026 preparation.

SUBTOPICS TO COVER: ${info.subtopics}

ALL QUESTION MODELS FOR THIS TOPIC (rotate across these — do NOT repeat the same model twice):
  ${modelList}
${exclusion}

━━━ DIFFICULTY DISTRIBUTION (mandatory) ━━━
- Distribute the ${count} questions as: ~30% Easy, ~50% Medium, ~20% Hard
- Tag EVERY question with its exact difficulty: "Easy", "Medium", or "Hard"
- Tag EVERY question with its exact model name from the list above (without the [EASY]/[MEDIUM]/[HARD] prefix)

━━━ QUESTION QUALITY RULES ━━━
1. Every question must be a DIFFERENT model — never two consecutive questions from the same model
2. Questions must be scenario-based word problems (3–5 lines). Use real-world contexts: IT company, logistics, finance, engineering, cricket, shopping. AVOID dry one-line arithmetic.
3. Include variation types across questions:
   - DIRECT: given known values, find the unknown
   - REVERSE: given the result, work backwards to find the input
   - MULTI-STEP: two concepts combined (e.g. Time & Work + Ratio)
   - ELIMINATION: identify which option is NOT possible
4. Exactly 4 options. One is correct. The 3 wrong options must be PLAUSIBLE (common calculation mistake values, not obviously wrong).
5. Every calculation must be 100% verified. Solve the problem yourself before writing it.
6. Explanation: clear numbered step-by-step working. Show ALL key steps.
7. NO LaTeX or math delimiters ($, $$, \\frac, \\sqrt). Write in plain text: "3/5", "x^2", "sqrt(x)", "pi", "phi(N)".
8. STRICT SYLLABUS: No calculus, no trigonometry, no coordinate geometry, no complex numbers.

OUTPUT FORMAT: Return ONLY a raw JSON array. No markdown, no prose, no code fences.
[
  {
    "question": "<full scenario-based question text>",
    "options": ["<A>", "<B>", "<C>", "<D>"],
    "answer": <0|1|2|3>,
    "explanation": "Step 1: ... Step 2: ... Therefore, answer = ...",
    "subtopic": "<exact model name from the list above>",
    "difficulty": "<Easy|Medium|Hard>"
  }
]`;
}

function buildOverallPrompt(count, excludeTexts = []) {
  const topicList = Object.values(TOPIC_DETAILS)
    .filter(t => ['Number System','Simplification & Approximation','Ratio & Proportion','Problems on Ages','Averages','Mixture & Alligation','Percentages','Profit, Loss & Discount','Simple & Compound Interest','Time & Work','Time, Speed & Distance','Boats, Streams & Trains','Data Interpretation','Permutations, Combinations & Probability','Quadratic Equations','Mensuration','Statistics'].includes(t.title))
    .map(t => t.title);

  const exclusion = excludeTexts.length
    ? `\nAvoid repeating: ${excludeTexts.slice(0, 10).map(t => `"${t.slice(0, 70)}"`).join(' | ')}`
    : '';

  return `You are an expert TCS NQT Quantitative Ability exam setter.

TASK: Generate exactly ${count} EXPERT-level MCQs for a TCS NQT Full Mock Test.

MANDATORY: Distribute exactly 1–2 questions across EACH of these topics (cover as many as possible):
${topicList.map((t, i) => `${i + 1}. ${t}`).join('\n')}
${exclusion}

━━━ DIFFICULTY DISTRIBUTION ━━━
- ~25% Easy, ~50% Medium, ~25% Hard
- Tag EVERY question: "Easy", "Medium", or "Hard"
- Tag EVERY question with the exact topic name from the list above as "topicTitle"
- Tag EVERY question with the specific model/sub-pattern as "subtopic"

━━━ QUALITY RULES ━━━
1. EXPERT level — multi-step, requires real insight, 3+ reasoning steps minimum
2. Scenario-based word problems only (3–5 lines). Real contexts: tech company, cricket, logistics, banking.
3. Rotate topics — never two consecutive questions on the same topic
4. Every calculation 100% verified. Plausible distractors (common mistake values).
5. Include a variety of question types: direct, reverse-calculation, multi-concept, elimination.
6. NO LaTeX. Plain text only: "3/5", "x^2", "sqrt(x)", "pi".
7. NO calculus, NO trigonometry, NO coordinate geometry.

OUTPUT: Return ONLY a raw JSON array:
[{
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "answer": <0|1|2|3>,
  "explanation": "Step 1: ... Step 2: ... Therefore, answer = ...",
  "subtopic": "<specific model/pattern>",
  "difficulty": "<Easy|Medium|Hard>",
  "topicTitle": "<exact topic name from list above>"
}]`;
}

// ─── API Call ─────────────────────────────────────────────────────────────────

async function callGemini(prompt) {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:      0.78,
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

// ─── Normalisation Helpers ────────────────────────────────────────────────────

function makeId(prefix, difficulty, idx) {
  return `ai_${prefix}_${String(difficulty).toLowerCase()}_${idx}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
}

const VALID_DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard', 'Expert']);

function normalizeDifficulty(raw) {
  if (!raw) return 'Medium';
  const cap = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return VALID_DIFFICULTIES.has(cap) ? cap : 'Medium';
}

function normalizeTopicQuestions(rawArr, topicId, startIdx = 0) {
  if (!Array.isArray(rawArr)) return [];
  return rawArr
    .filter(q => q && typeof q.question === 'string' && q.question.trim()
              && Array.isArray(q.options) && q.options.length >= 4)
    .map((q, i) => ({
      id:          makeId(topicId, q.difficulty || 'medium', startIdx + i),
      question:    q.question.trim(),
      options:     q.options.slice(0, 4).map(String),
      answer:      (typeof q.answer === 'number') ? Math.min(3, Math.max(0, Math.round(q.answer))) : 0,
      explanation: (q.explanation || 'Refer to the step-by-step working above.').trim(),
      subtopic:    (q.subtopic    || TOPIC_DETAILS[topicId]?.title || '').trim(),
      difficulty:  normalizeDifficulty(q.difficulty),
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
      const entry = Object.entries(TOPIC_DETAILS).find(([, v]) => {
        const tt = (q.topicTitle || '').toLowerCase().trim();
        return v.title.toLowerCase() === tt
            || v.title.toLowerCase().includes(tt)
            || tt.includes(v.title.toLowerCase());
      });
      const tid = entry ? entry[0] : 'overall';
      return {
        id:          makeId('overall', q.difficulty || 'medium', i),
        question:    q.question.trim(),
        options:     q.options.slice(0, 4).map(String),
        answer:      (typeof q.answer === 'number') ? Math.min(3, Math.max(0, Math.round(q.answer))) : 0,
        explanation: (q.explanation || 'See step-by-step working above.').trim(),
        subtopic:    (q.subtopic || '').trim(),
        difficulty:  normalizeDifficulty(q.difficulty),
        topicId:     tid,
        topicTitle:  q.topicTitle || TOPIC_DETAILS[tid]?.title || 'Mixed Topics'
      };
    });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate topic-wise AI questions.
 * @param {string}   topicId      - e.g. 'number-system'
 * @param {string}   difficulty   - (legacy param, kept for compatibility)
 * @param {number}   count        - questions to generate
 * @param {string[]} excludeTexts - question texts already shown (prevent repeats)
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
 * Generate overall mock-test AI questions (mixed topics, difficulty-tiered).
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
