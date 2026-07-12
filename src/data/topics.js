import { generateQuestions } from './questionGenerator';

export const TOPICS = [
  // ══════════════════════════════════════════════════════
  //  QUANTITATIVE APTITUDE
  // ══════════════════════════════════════════════════════
  {
    id: 'number-system',
    title: 'Number System',
    icon: '🔢',
    description: 'LCM, HCF, divisibility rules, remainders, factors, unit digit cyclicity',
    subtopics: ['LCM & HCF', 'Divisibility Rules', 'Remainders & CRT', 'Factors & Multiples', 'Unit Digit Cyclicity', 'Trailing Zeros'],
    testSize: 15,
    duration: 15,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'simplification',
    title: 'Simplification & Approximation',
    icon: '🧮',
    description: 'BODMAS, nested fractions, surds, indices & decimal approximations',
    subtopics: ['BODMAS Order', 'Surds & Indices', 'Nested Fractions', 'Decimal Approximation', 'Square Root Estimation'],
    testSize: 15,
    duration: 15,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'ratio-proportion',
    title: 'Ratio & Proportion',
    icon: '⚖️',
    description: 'Ratios, compound ratios, proportions, direct/inverse variation, componendo-dividendo',
    subtopics: ['Basic Ratios', 'Compound Ratios', 'Mean/Third Proportional', 'Componendo-Dividendo', 'Direct & Inverse Variation', 'Joint Variation'],
    testSize: 15,
    duration: 15,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'partnership',
    title: 'Partnership',
    icon: '🤝',
    description: 'Investments, profit sharing, simple & compound partnerships, working vs sleeping partners',
    subtopics: ['Simple Partnership', 'Compound Partnership', 'Unequal Investments', 'Variable Time Periods', 'Working & Sleeping Partners', 'Manager Salaries from Profit'],
    testSize: 15,
    duration: 15,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    difficulty: 'Easy',
    examWeight: '1-2 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'ages',
    title: 'Problems on Ages',
    icon: '👤',
    description: 'Age ratios at different time points, present/past/future age equations',
    subtopics: ['Present Age Equations', 'Age Ratio at Two Time Points', 'Average Age Problems', 'Age Difference Constraints', 'Multi-Person Age Systems'],
    testSize: 15,
    duration: 15,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
    difficulty: 'Easy',
    examWeight: '1-2 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'averages',
    title: 'Averages',
    icon: '📊',
    description: 'Simple average, weighted average, replacement, cricket batting average',
    subtopics: ['Simple Average', 'Weighted Average', 'Replacement Effect', 'Running Average', 'Average Speed'],
    testSize: 15,
    duration: 15,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    difficulty: 'Easy',
    examWeight: '2 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'mixture-alligation',
    title: 'Mixture & Alligation',
    icon: '⚗️',
    description: 'Alligation rule, repeated replacement, multi-component blending, purity',
    subtopics: ['Basic Alligation', 'Repeated Replacement', 'Three-Component Blend', 'Milk-Water Dilution', 'Profit-based Alligation'],
    testSize: 15,
    duration: 15,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    difficulty: 'Hard',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'percentages',
    title: 'Percentages',
    icon: '%',
    description: 'Successive change, elections, expenditure, population, budget allocation',
    subtopics: ['Basic % Change', 'Successive % Change', 'Election Problems', 'Expenditure vs Savings', 'Population Growth', 'Price Rise & Consumption'],
    testSize: 15,
    duration: 15,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'profit-loss',
    title: 'Profit, Loss & Discount',
    icon: '💰',
    description: 'CP, SP, markup, discount chains, faulty weights, break-even',
    subtopics: ['Basic Profit & Loss', 'Successive Discounts', 'Faulty Weights (Dishonest Trade)', 'Markup & Markdown', 'Two Items at Equal SP', 'Buy X Get Y Free'],
    testSize: 15,
    duration: 15,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'interest-installments',
    title: 'Simple & Compound Interest',
    icon: '🏦',
    description: 'SI, CI, compounding frequencies, CI-SI difference, installments, depreciation',
    subtopics: ['Simple Interest Basics', 'Compound Interest (Annual)', 'Half-Yearly / Quarterly CI', 'CI–SI Difference (2 & 3 years)', 'Equal Installments', 'Depreciation & Growth'],
    testSize: 15,
    duration: 15,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    difficulty: 'Hard',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'time-work',
    title: 'Time & Work',
    icon: '⚙️',
    description: 'Individual work rates, combined work, alternate days, pipes & cisterns, wages',
    subtopics: ['Individual Work Rate', 'Combined Work Efficiency', 'Alternate-Day Work', 'Work & Wages', 'Pipes & Cisterns (Filling)', 'Pipes with Leak (Emptying)', 'Chain Rule (MDH)'],
    testSize: 15,
    duration: 15,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'time-speed-distance',
    title: 'Time, Speed & Distance',
    icon: '🚗',
    description: 'Average speed, relative speed, meeting points, circular tracks, escalators',
    subtopics: ['Basic Speed-Distance-Time', 'Average Speed (Two Legs)', 'Relative Speed (Same & Opposite)', 'Meeting Point Problems', 'Circular Track (First Meet)', 'Head Start & Race Problems', 'Speed with Stoppages'],
    testSize: 15,
    duration: 15,
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'boat-streams-trains',
    title: 'Boats, Streams & Trains',
    icon: '🚂',
    description: 'Upstream/downstream, train crossing, passing moving objects',
    subtopics: ['Upstream & Downstream Speed', 'Speed of Boat in Still Water', 'Stream Speed', 'Train Passing Pole/Platform', 'Two Trains Crossing', 'Train Passing Walking Person'],
    testSize: 15,
    duration: 15,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #14b8a6)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'data-interpretation',
    title: 'Data Interpretation',
    icon: '📈',
    description: 'Tables, bar graphs, pie charts, line graphs, caselets, multi-source DI',
    subtopics: ['Tabular Data', 'Bar Chart Comparison', 'Pie Chart (Sector %)', 'Line Graph Trends', 'Caselet DI', 'Multi-Source DI'],
    testSize: 15,
    duration: 15,
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)',
    difficulty: 'Medium',
    examWeight: '3-4 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'perm-comb-prob',
    title: 'Permutation, Combination & Probability',
    icon: '🎲',
    description: 'Arrangements, selections, circular seating, conditional probability, dice, cards',
    subtopics: ['Basic Permutations (nPr)', 'Basic Combinations (nCr)', 'Word Arrangements with Repetition', 'Circular Seating', 'Conditional Probability', 'Dice & Card Problems', 'At-Least Probability'],
    testSize: 15,
    duration: 15,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
    difficulty: 'Hard',
    examWeight: '2-4 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'quadratic-equations',
    title: 'Quadratic Equations',
    icon: '📐',
    description: 'Roots, discriminant, sum/product of roots, comparing two quadratics',
    subtopics: ['Factoring Method', 'Quadratic Formula', 'Nature of Roots (Discriminant)', 'Sum & Product of Roots', 'Common Root Problems', 'Quadratic Word Problems'],
    testSize: 15,
    duration: 15,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'inequalities',
    title: 'Inequalities',
    icon: '≤≥',
    description: 'Linear, quadratic & modulus inequalities, range finding',
    subtopics: ['Linear Inequalities', 'Quadratic Inequalities (Sign Method)', 'Modulus / Absolute Value', 'Double Inequalities', 'Integer Solutions in Range'],
    testSize: 15,
    duration: 15,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f43f5e)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'logarithms',
    title: 'Logarithms',
    icon: 'log',
    description: 'Log properties, change of base, log equations, number of digits in powers',
    subtopics: ['Log Properties (Product/Quotient/Power)', 'Change of Base', 'Log Equations', 'Number of Digits (log₁₀ application)', 'Log Inequalities'],
    testSize: 15,
    duration: 15,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
    difficulty: 'Hard',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'mensuration',
    title: 'Mensuration',
    icon: '📏',
    description: '2D & 3D geometry: area, perimeter, surface area, volume, recasting',
    subtopics: ['2D Shapes (Triangle, Circle, Trapezium)', 'Composite 2D Areas', 'Paths & Borders', '3D Shapes (Cube, Cylinder, Cone, Sphere)', 'Surface Area', 'Volume Conservation (Recasting)'],
    testSize: 15,
    duration: 15,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'statistics',
    title: 'Statistics',
    icon: '📉',
    description: 'Mean, median, mode, range, standard deviation, coefficient of variation',
    subtopics: ['Arithmetic Mean & Weighted Mean', 'Median & Mode', 'Range', 'Variance & Standard Deviation', 'Coefficient of Variation', 'Corrected Mean'],
    testSize: 15,
    duration: 15,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #f59e0b)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A',
    section: 'Quantitative Aptitude'
  },

  // ══════════════════════════════════════════════════════
  //  LOGICAL REASONING
  // ══════════════════════════════════════════════════════
  {
    id: 'number-series',
    title: 'Number & Letter Series',
    icon: '🔗',
    description: 'Find missing terms, identify wrong terms, letter-number patterns',
    subtopics: ['AP/GP Series', 'Square/Cube Patterns', 'Difference Series', 'Mixed Pattern Series', 'Wrong Term Detection', 'Letter-Number Series'],
    testSize: 15,
    duration: 15,
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A',
    section: 'Logical Reasoning'
  },
  {
    id: 'clocks-calendars',
    title: 'Clocks & Calendars',
    icon: '🕐',
    description: 'Angle between hands, clock coincidences, day-of-week calculations',
    subtopics: ['Angle Between Clock Hands', 'Clock Coincidences & Oppositions', 'Gaining/Losing Clock Problems', 'Day of the Week (Odd Days)', 'Leap Year Rules', 'Date Difference Calculations'],
    testSize: 15,
    duration: 15,
    color: '#dc2626',
    gradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
    difficulty: 'Medium',
    examWeight: '1-2 Q/A',
    section: 'Logical Reasoning'
  },
  {
    id: 'seating-arrangement',
    title: 'Seating Arrangement',
    icon: '🪑',
    description: 'Linear, circular, and double-row seating arrangement puzzles',
    subtopics: ['Linear Row Arrangement', 'Circular Arrangement', 'Double-Row Facing', 'Rectangular Table Arrangement', 'Puzzle-Based Arrangement'],
    testSize: 10,
    duration: 15,
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    difficulty: 'Hard',
    examWeight: '2-3 Q/A',
    section: 'Logical Reasoning'
  },
  {
    id: 'blood-relations',
    title: 'Blood Relations',
    icon: '🧬',
    description: 'Family tree analysis, coded relations, generation-based puzzles',
    subtopics: ['Direct Relations', 'Coded Relations', 'Family Tree (3+ Generations)', 'Pointing Puzzles', 'Mixed Gender Relations'],
    testSize: 10,
    duration: 15,
    color: '#db2777',
    gradient: 'linear-gradient(135deg, #db2777, #ec4899)',
    difficulty: 'Easy',
    examWeight: '1-2 Q/A',
    section: 'Logical Reasoning'
  },
  {
    id: 'coding-decoding',
    title: 'Coding & Decoding',
    icon: '🔐',
    description: 'Letter shift codes, number substitution, symbol-based coding patterns',
    subtopics: ['Letter Shifting (Caesar Cipher)', 'Reverse Alphabet Coding', 'Number Substitution', 'Symbol Coding', 'Word-Position Coding', 'Mixed Coding'],
    testSize: 10,
    duration: 15,
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #0891b2, #0ea5e9)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A',
    section: 'Logical Reasoning'
  },
  {
    id: 'direction-sense',
    title: 'Direction Sense',
    icon: '🧭',
    description: 'Distance travelled, final direction, shadow direction at different times',
    subtopics: ['Final Position & Direction', 'Total Distance Travelled', 'Shortest Distance (Pythagorean)', 'Shadow Direction (Morning/Evening)', 'Relative Direction'],
    testSize: 10,
    duration: 15,
    color: '#65a30d',
    gradient: 'linear-gradient(135deg, #65a30d, #84cc16)',
    difficulty: 'Easy',
    examWeight: '1-2 Q/A',
    section: 'Logical Reasoning'
  },
];

export function getTopicTestQuestions(topicId, count = 15) {
  return generateQuestions(topicId, 'expert', count);
}

export function getOverallTestQuestions(totalCount = 20) {
  const all = [];
  const quantTopics = TOPICS.filter(t => t.section === 'Quantitative Aptitude');
  const pickedTopics = [...quantTopics].sort(() => Math.random() - 0.5);
  for (let i = 0; i < totalCount; i++) {
    const topic = pickedTopics[i % quantTopics.length];
    const qList = generateQuestions(topic.id, 'expert', 1);
    if (qList.length > 0) {
      all.push({
        ...qList[0],
        topicId: topic.id,
        topicTitle: topic.title
      });
    }
  }
  return all.sort(() => Math.random() - 0.5).slice(0, totalCount);
}
