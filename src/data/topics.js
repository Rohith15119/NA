import { generateQuestions } from './questionGenerator';

export const TOPICS = [
  {
    id: 'number-system',
    title: 'Number System',
    icon: '🔢',
    description: 'Divisibility rules, LCM, HCF, Simplification',
    subtopics: ['LCM', 'HCF', 'Divisibility', 'Simplification', 'Remainders'],
    testSize: 10,
    duration: 15,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    difficulty: 'Medium',
    examWeight: '20 Q/A'
  },
  {
    id: 'ratio-proportion',
    title: 'Ratio & Proportion',
    icon: '⚖️',
    description: 'Ratios, proportions, variations & mixtures',
    subtopics: ['Ratio', 'Proportion', 'Variation', 'Mixture'],
    testSize: 10,
    duration: 15,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A'
  },
  {
    id: 'averages',
    title: 'Averages',
    icon: '📊',
    description: 'Simple and weighted averages',
    subtopics: ['Simple Average', 'Weighted Average'],
    testSize: 10,
    duration: 15,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    difficulty: 'Easy',
    examWeight: '2 Q/A'
  },
  {
    id: 'ages',
    title: 'Ages',
    icon: '👶',
    description: 'Problems on ages — present, past, future',
    subtopics: ['Present Age', 'Past Age', 'Future Age'],
    testSize: 10,
    duration: 15,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    difficulty: 'Easy',
    examWeight: '1 Q/A'
  },
  {
    id: 'percentages',
    title: 'Percentages',
    icon: '%',
    description: 'Percentage change, successive change, elections',
    subtopics: ['Basic %', 'Successive Change', 'Population'],
    testSize: 10,
    duration: 15,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A'
  },
  {
    id: 'profit-loss',
    title: 'Profit & Loss',
    icon: '💰',
    description: 'Profit, loss, discount, markup calculations',
    subtopics: ['Profit%', 'Loss%', 'Discount', 'Markup'],
    testSize: 10,
    duration: 15,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A'
  },
  {
    id: 'interest-installments',
    title: 'SI, CI & Installments',
    icon: '🏦',
    description: 'Simple interest, compound interest, installments',
    subtopics: ['SI', 'CI', 'Installments', 'Difference'],
    testSize: 10,
    duration: 15,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    difficulty: 'Hard',
    examWeight: '7-9 Hard'
  },
  {
    id: 'time-work',
    title: 'Time & Work',
    icon: '⚙️',
    description: 'Work efficiency, pipes & cisterns, men-days',
    subtopics: ['Individual Work', 'Combined Work', 'Pipes & Cisterns'],
    testSize: 10,
    duration: 15,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    difficulty: 'Medium',
    examWeight: '1-3 Q/A'
  },
  {
    id: 'boat-streams-trains',
    title: 'Boat, Streams & Trains',
    icon: '🚂',
    description: 'Relative speed, upstream/downstream, train problems',
    subtopics: ['Boats & Streams', 'Trains', 'Speed-Distance'],
    testSize: 10,
    duration: 15,
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A'
  },
  {
    id: 'data-interpretation',
    title: 'Data Interpretation',
    icon: '📈',
    description: 'Tables, bar graphs, pie charts, line graphs',
    subtopics: ['Tables', 'Bar Graph', 'Pie Chart', 'Line Graph'],
    testSize: 10,
    duration: 15,
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)',
    difficulty: 'Medium',
    examWeight: '1 Q/A'
  },
  {
    id: 'perm-comb-prob',
    title: 'Permutations, Combinations & Probability',
    icon: '🎲',
    description: 'Counting, arrangements, probability',
    subtopics: ['Permutations', 'Combinations', 'Probability'],
    testSize: 10,
    duration: 15,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
    difficulty: 'Medium',
    examWeight: '2-4 Q/A'
  },
  {
    id: 'quadratic-equations',
    title: 'Quadratic Equations',
    icon: '📐',
    description: 'Solving quadratics, roots, nature of roots',
    subtopics: ['Factoring', 'Formula', 'Roots', 'Comparing'],
    testSize: 10,
    duration: 15,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A'
  },
  {
    id: 'inequalities',
    title: 'Inequalities',
    icon: '≤≥',
    description: 'Linear and quadratic inequalities, absolute values',
    subtopics: ['Linear', 'Quadratic', 'Absolute Value'],
    testSize: 10,
    duration: 15,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f43f5e)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A'
  },
  {
    id: 'logarithms',
    title: 'Logarithms',
    icon: 'log',
    description: 'Log properties, change of base, equations',
    subtopics: ['Properties', 'Equations', 'Change of Base'],
    testSize: 10,
    duration: 15,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
    difficulty: 'Medium',
    examWeight: '2-3 Q/A'
  },
  {
    id: 'mensuration',
    title: 'Mensuration',
    icon: '📏',
    description: '2D and 3D geometry: area, perimeter, volume',
    subtopics: ['2D Shapes', '3D Shapes', 'Surface Area', 'Volume'],
    testSize: 10,
    duration: 15,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    difficulty: 'Easy',
    examWeight: '1-2 Q/A'
  },
  {
    id: 'statistics',
    title: 'Statistics',
    icon: '📉',
    description: 'Mean, median, mode, standard deviation',
    subtopics: ['Mean', 'Median', 'Mode', 'SD', 'Variance'],
    testSize: 10,
    duration: 15,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #f59e0b)',
    difficulty: 'Easy',
    examWeight: '2-3 Q/A'
  }
];

export function getTopicTestQuestions(topicId, difficulty) {
  // Let's generate 10 unique questions for the test
  return generateQuestions(topicId, difficulty || 'easy', 10);
}

export function getOverallTestQuestions(totalCount = 20) {
  // TCS NQT is known to be very hard — mock test always uses Hard difficulty
  // to simulate real exam pressure and best prepare the student.
  const all = [];
  
  // Randomly distribute across the 16 topics to pick 20 questions
  const pickedTopics = [...TOPICS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < totalCount; i++) {
    const topic = pickedTopics[i % TOPICS.length];
    const qList = generateQuestions(topic.id, 'hard', 1);
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
