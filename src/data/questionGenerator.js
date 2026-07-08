// Helper functions for math
export function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

export function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

export function lcmThree(a, b, c) {
  return lcm(lcm(a, b), c);
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandomArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fermat's Little Theorem or modular exponentiation helper
export function powerMod(base, exp, mod) {
  let res = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) res = (res * base) % mod;
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }
  return res;
}

// Shuffles options and tracks correct index
export function prepareQuestion(q) {
  const indexed = q.options.map((text, i) => ({ text, isCorrect: i === q.answer }));
  // Shuffle options
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const newAnswer = indexed.findIndex(o => o.isCorrect);
  return {
    ...q,
    options: indexed.map(o => o.text),
    answer: newAnswer,
  };
}

// Generate options: correct answer, plus 3 distinct distractors
export function makeOptions(correct, minOffset = 1, maxOffset = 10, formatFn = (x) => String(x)) {
  const set = new Set([correct]);
  while (set.size < 4) {
    const isPos = Math.random() > 0.5;
    const offset = getRandomInt(minOffset, maxOffset);
    const distractor = isPos ? correct + offset : correct - offset;
    if (distractor !== correct && (typeof correct !== 'number' || distractor > 0)) {
      set.add(distractor);
    }
  }
  const list = Array.from(set);
  // Put correct at index 0
  const index = list.indexOf(correct);
  if (index !== 0) {
    const temp = list[0];
    list[0] = correct;
    list[index] = temp;
  }
  return list.map(formatFn);
}

// Templates for each topic
const GENERATORS = {
  // ==========================================
  // 1. NUMBER SYSTEM
  // ==========================================
  'number-system': {
    Easy: [
      () => {
        const a = getRandomInt(8, 20);
        const b = getRandomInt(12, 30);
        const ans = lcm(a, b);
        return {
          question: `Find the Least Common Multiple (LCM) of ${a} and ${b}.`,
          options: makeOptions(ans, 2, 15),
          answer: 0,
          explanation: `Prime factorization: ${a} and ${b}. The LCM is the product of highest powers of prime factors, which is ${ans}.`,
          subtopic: 'LCM'
        };
      },
      () => {
        const factor = getRandomInt(4, 12);
        const a = factor * getRandomInt(2, 5);
        const b = factor * getRandomInt(6, 9);
        const ans = gcd(a, b);
        return {
          question: `Find the Greatest Common Divisor (GCD/HCF) of ${a} and ${b}.`,
          options: makeOptions(ans, 1, 5),
          answer: 0,
          explanation: `The highest common factor that divides both ${a} and ${b} is ${ans}.`,
          subtopic: 'HCF'
        };
      },
      () => {
        const num = getRandomInt(150, 450);
        const d = getRandomInt(6, 12);
        const rem = num % d;
        return {
          question: `What is the remainder when ${num} is divided by ${d}?`,
          options: makeOptions(rem, 1, 4),
          answer: 0,
          explanation: `${num} = ${d} × ${Math.floor(num/d)} + ${rem}. Thus, the remainder is ${rem}.`,
          subtopic: 'Remainders'
        };
      },
      () => {
        const mult = getRandomInt(11, 29);
        const val = mult * 9;
        const offset = getRandomInt(1, 8);
        const incorrects = [val + offset, val - offset, val + offset + 2];
        const correctVal = val;
        const options = [String(correctVal), String(incorrects[0]), String(incorrects[1]), String(incorrects[2])];
        return {
          question: `Which of the following numbers is completely divisible by 9?`,
          options: options,
          answer: 0,
          explanation: `A number is divisible by 9 if the sum of its digits is divisible by 9. Sum of digits of ${correctVal} is divisible by 9.`,
          subtopic: 'Divisibility'
        };
      },
      () => {
        const n = getRandomInt(10, 30);
        const sum = (n * (n + 1)) / 2;
        return {
          question: `Find the sum of the first ${n} natural numbers.`,
          options: makeOptions(sum, 5, 20),
          answer: 0,
          explanation: `Using the formula n(n+1)/2: ${n} × ${n+1} / 2 = ${sum}.`,
          subtopic: 'Arithmetic Progression'
        };
      }
    ],
    Medium: [
      () => {
        const a = getRandomInt(10, 15);
        const b = getRandomInt(16, 20);
        const c = getRandomInt(21, 30);
        const ans = lcmThree(a, b, c);
        const hours = Math.floor(ans / 60);
        const mins = ans % 60;
        const timeStr = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;
        return {
          question: `Three bells ring at intervals of ${a}, ${b}, and ${c} minutes respectively. If they ring together at 9:00 AM, after how many minutes will they next ring together?`,
          options: makeOptions(ans, 15, 60),
          answer: 0,
          explanation: `They will ring together at intervals of LCM(${a}, ${b}, ${c}) = ${ans} minutes (${timeStr}).`,
          subtopic: 'LCM'
        };
      },
      () => {
        const d = getRandomInt(6, 11);
        const r = getRandomInt(2, d - 1);
        const rem = (r * r) % d;
        return {
          question: `A number when divided by ${d} leaves a remainder of ${r}. What remainder does its square leave when divided by ${d}?`,
          options: makeOptions(rem, 1, 3),
          answer: 0,
          explanation: `Let the number be ${d}k + ${r}. Its square is (${d}k + ${r})² = ${d}²k² + 2×${d}×${r}k + ${r * r}. The remainder is (${r}²) mod ${d} = ${r * r} mod ${d} = ${rem}.`,
          subtopic: 'Remainders'
        };
      },
      () => {
        const p1 = 2; // powers
        const a = getRandomInt(2, 4); // 2^a
        const b = getRandomInt(1, 3); // 3^b
        const c = getRandomInt(1, 2); // 5^c
        const val = Math.pow(2, a) * Math.pow(3, b) * Math.pow(5, c);
        const factors = (a + 1) * (b + 1) * (c + 1);
        return {
          question: `Find the total number of factors of the number ${val}.`,
          options: makeOptions(factors, 2, 6),
          answer: 0,
          explanation: `Prime factorization of ${val} is 2^${a} × 3^${b} × 5^${c}. Total factors = (${a}+1)×(${b}+1)×(${c}+1) = ${factors}.`,
          subtopic: 'Number Properties'
        };
      },
      () => {
        const base = pickRandomArray([2, 3, 7, 8]);
        const exp = getRandomInt(50, 150);
        const cycle = [
          [6, 2, 4, 8], // 2: 2, 4, 8, 6
          [1, 3, 9, 7], // 3: 3, 9, 7, 1
          [1, 7, 9, 3], // 7: 7, 9, 3, 1
          [6, 8, 4, 2]  // 8: 8, 4, 2, 6
        ];
        const idx = base === 2 ? 0 : base === 3 ? 1 : base === 7 ? 2 : 3;
        const ans = cycle[idx][exp % 4];
        return {
          question: `Find the unit digit of the expression ${base}^${exp}.`,
          options: makeOptions(ans, 1, 4),
          answer: 0,
          explanation: `The unit digit of ${base} cycles every 4 powers. Since ${exp} mod 4 = ${exp % 4}, the unit digit is ${ans}.`,
          subtopic: 'Unit Digit'
        };
      },
      () => {
        const val = getRandomInt(5, 12);
        const div = val * 8;
        const ans = div + 3;
        return {
          question: `A number when divided by 8 gives a quotient of ${val} and a remainder of 3. Find the number.`,
          options: makeOptions(ans, 2, 10),
          answer: 0,
          explanation: `Dividend = Divisor × Quotient + Remainder = 8 × ${val} + 3 = ${ans}.`,
          subtopic: 'Number Properties'
        };
      }
    ],
    Hard: [
      () => {
        const exp = getRandomInt(30, 80);
        const ans = 1; // 4^even mod 5 is 1, 4^odd is 4
        const oddExp = exp % 2 === 1 ? exp : exp + 1;
        const correct = oddExp % 2 === 0 ? 1 : 4;
        return {
          question: `Find the remainder when 4^${oddExp} is divided by 5.`,
          options: makeOptions(correct, 1, 3),
          answer: 0,
          explanation: `4 ≡ -1 (mod 5). Thus, 4^${oddExp} ≡ (-1)^${oddExp} ≡ ${correct} (mod 5).`,
          subtopic: 'Remainders'
        };
      },
      () => {
        const a = 15;
        const b = 25;
        const c = 35;
        const lcmVal = lcmThree(a, b, c); // 525
        const target = 9999;
        const quotient = Math.floor(target / lcmVal);
        const ans = quotient * lcmVal; // 9975
        return {
          question: `Find the largest 4-digit number divisible by ${a}, ${b}, and ${c}.`,
          options: makeOptions(ans, 25, 100),
          answer: 0,
          explanation: `LCM of ${a}, ${b}, ${c} is ${lcmVal}. The largest 4-digit number is 9999. 9999 ÷ ${lcmVal} = ${quotient.toFixed(2)}. The multiple is ${quotient} × ${lcmVal} = ${ans}.`,
          subtopic: 'Divisibility'
        };
      },
      () => {
        const base = 3;
        const exp = pickRandomArray([21, 25, 29, 33]);
        const rem = powerMod(base, exp, 5);
        return {
          question: `What is the remainder when ${base}^${exp} is divided by 5?`,
          options: makeOptions(rem, 1, 3),
          answer: 0,
          explanation: `By Fermat's Little Theorem, 3⁴ ≡ 1 (mod 5). Thus, 3^${exp} = (3⁴)^${Math.floor(exp/4)} × 3^${exp%4} ≡ 3^${exp%4} ≡ ${rem} (mod 5).`,
          subtopic: 'Remainders'
        };
      },
      () => {
        const a = pickRandomArray([17, 19, 23]);
        const b = a + pickRandomArray([6, 8, 10]);
        const exp = pickRandomArray([23, 25, 27]);
        const divisor = a + b;
        return {
          question: `What is the remainder when (${a}^${exp} + ${b}^${exp}) is divided by ${divisor}?`,
          options: ['0', '1', '2', '3'],
          answer: 0,
          explanation: `For odd powers, (xⁿ + yⁿ) is always divisible by (x + y). Since ${exp} is odd, the expression is divisible by ${a} + ${b} = ${divisor}, giving a remainder of 0.`,
          subtopic: 'Remainders'
        };
      },
      () => {
        const digits = [3, 7, 5];
        const exp1 = 34;
        const exp2 = 56;
        const exp3 = 89;
        return {
          question: `Find the unit digit of the expression: 23^${exp1} × 45^${exp2} × 78^${exp3}.`,
          options: ['0', '5', '8', '2'],
          answer: 0,
          explanation: `Unit digit of 23^${exp1} is 3² = 9. Unit digit of 45^${exp2} is 5. Unit digit of 78^${exp3} is 8¹ = 8. Product unit digit = 9 × 5 × 8 = 360 → 0.`,
          subtopic: 'Unit Digit'
        };
      }
    ]
  },

  // ==========================================
  // 2. RATIO & PROPORTION
  // ==========================================
  'ratio-proportion': {
    Easy: [
      () => {
        const mul = getRandomInt(2, 4);
        const a = 3 * mul;
        const b = 4 * mul;
        const c = 6;
        const d = 7;
        const num = a * c;
        const den = b * d;
        const g = gcd(num, den);
        const ans = `${num/g}:${den/g}`;
        return {
          question: `If A:B = ${a}:${b} and B:C = ${c}:${d}, find A:C.`,
          options: makeOptions(ans, 1, 3, (x) => typeof x === 'string' ? x : `${x}:14`),
          answer: 0,
          explanation: `A/C = (A/B) × (B/C) = (${a}/${b}) × (${c}/${d}) = ${num}/${den} = ${num/g}:${den/g}.`,
          subtopic: 'Ratio'
        };
      },
      () => {
        const multiplier = getRandomInt(100, 150);
        const a = 3;
        const b = 5;
        const c = 4;
        const total = (a + b + c) * multiplier;
        const ans = b * multiplier;
        return {
          question: `A sum of ₹${total} is divided among A, B, and C in the ratio ${a}:${b}:${c}. Find B's share.`,
          options: makeOptions(ans, 50, 200, (x) => `₹${x}`),
          answer: 0,
          explanation: `Total parts = ${a} + ${b} + ${c} = 12. B's share = (${b}/12) × ${total} = ₹${ans}.`,
          subtopic: 'Ratio'
        };
      },
      () => {
        const a = pickRandomArray([9, 16, 25]);
        const b = pickRandomArray([36, 49, 64]);
        const ans = Math.sqrt(a * b);
        return {
          question: `Find the mean proportional of ${a} and ${b}.`,
          options: makeOptions(ans, 2, 8),
          answer: 0,
          explanation: `Mean proportional = √(${a} × ${b}) = √${a*b} = ${ans}.`,
          subtopic: 'Proportion'
        };
      },
      () => {
        const a = getRandomInt(2, 5);
        const b = getRandomInt(6, 10);
        const c = a * getRandomInt(3, 5);
        const ans = (b * c) / a;
        return {
          question: `Find the fourth proportional to ${a}, ${b}, and ${c}.`,
          options: makeOptions(ans, 2, 5),
          answer: 0,
          explanation: `Let fourth proportional be x. ${a}/${b} = ${c}/x → x = (${b} × ${c}) / ${a} = ${ans}.`,
          subtopic: 'Proportion'
        };
      },
      () => {
        const a = 2;
        const b = 3;
        const c = 4;
        const d = 5;
        const num = a * c;
        const den = b * d;
        const ans = `${num}:${den}`;
        return {
          question: `If A:B = ${a}:${b} and B:C = ${c}:${d}, then find A:C.`,
          options: makeOptions(ans, 1, 3, (x) => typeof x === 'string' ? x : `${x}:15`),
          answer: 0,
          explanation: `A/C = (A/B) × (B/C) = (${a}/${b}) × (${c}/${d}) = ${num}/${den} = ${ans}.`,
          subtopic: 'Ratio'
        };
      }
    ],
    Medium: [
      () => {
        const k = getRandomInt(2, 5);
        const a = 5;
        const b = 7;
        const diff = 3;
        const ans = b * k;
        return {
          question: `Two numbers are in the ratio ${a}:${b}. If ${diff} is subtracted from each, the ratio becomes ${a*k-diff}:${b*k-diff}. Find the larger number.`,
          options: makeOptions(ans, 2, 6),
          answer: 0,
          explanation: `Let the numbers be ${a}x and ${b}x. (${a}x - ${diff})/(${b}x - ${diff}) = ${(a*k-diff)}/${(b*k-diff)} → solving gives x = ${k}. Larger number = ${b} × ${k} = ${ans}.`,
          subtopic: 'Ratio'
        };
      },
      () => {
        const y = 3;
        const x = 9;
        const y2 = 5;
        const ans = y2 * y2;
        return {
          question: `If x varies directly as y², and x = ${x} when y = ${y}, find x when y = ${y2}.`,
          options: makeOptions(ans, 5, 20),
          answer: 0,
          explanation: `x = k × y². Given ${x} = k × ${y}² → k = 1. When y = ${y2}, x = 1 × ${y2}² = ${ans}.`,
          subtopic: 'Variation'
        };
      },
      () => {
        const x = getRandomInt(3, 5);
        const a = 4;
        const b = 5;
        const yrs = 8;
        const ans = a * x;
        return {
          question: `The ratio of the ages of P and Q is ${a}:${b}. After ${yrs} years, the ratio becomes ${a*x+yrs}:${b*x+yrs}. Find P's current age.`,
          options: makeOptions(ans, 2, 8, (x) => `${x} years`),
          answer: 0,
          explanation: `Let P = ${a}k, Q = ${b}k. Solving (${a}k+${yrs})/(${b}k+${yrs}) gives k = ${x}. P's age = ${a} × ${x} = ${ans}.`,
          subtopic: 'Ratio'
        };
      },
      () => {
        const y = 12;
        const x = 5;
        const x2 = 15;
        const ans = 4;
        return {
          question: `If y varies inversely as x, and y = ${y} when x = ${x}, find y when x = ${x2}.`,
          options: makeOptions(ans, 1, 4),
          answer: 0,
          explanation: `xy = constant = ${y} × ${x} = 60. When x = ${x2}, y = 60 / ${x2} = ${ans}.`,
          subtopic: 'Variation'
        };
      },
      () => {
        const x = 11;
        const a = 3;
        const b = 5;
        const sub = 9;
        const ans = a * x;
        return {
          question: `Two numbers are in the ratio ${a}:${b}. If ${sub} is subtracted from each, the ratio becomes 12:23. Find the smaller number.`,
          options: makeOptions(ans, 3, 10),
          answer: 0,
          explanation: `Let numbers be ${a}x and ${b}x. (${a}x - ${sub})/(${b}x - ${sub}) = 12/23 → 23(${a}x - ${sub}) = 12(${b}x - ${sub}) → x = ${x}. Smaller number = ${a} × ${x} = ${ans}.`,
          subtopic: 'Ratio'
        };
      }
    ],
    Hard: [
      () => {
        const total = 60;
        const ans = 60;
        return {
          question: `In a ${total}-litre mixture, the ratio of milk and water is 2:1. How many litres of water must be added to make the ratio of milk and water 1:2?`,
          options: makeOptions(ans, 10, 30, (x) => `${x} litres`),
          answer: 0,
          explanation: `Milk = 40L, Water = 20L. Milk stays 40L. In 1:2 ratio, water is 80L. Added water = 80 - 20 = 60L.`,
          subtopic: 'Mixture'
        };
      },
      () => {
        const total = 206;
        const ans = 200;
        return {
          question: `A bag contains 50p, 25p, and 10p coins in the ratio 5:9:4, amounting to ₹${total}. Find the number of 50p coins.`,
          options: makeOptions(ans, 20, 50),
          answer: 0,
          explanation: `Value of coins = 5x(0.5) + 9x(0.25) + 4x(0.10) = 5.15x = ${total} → x = 40. 50p coins = 5 × 40 = ${ans}.`,
          subtopic: 'Coins'
        };
      },
      () => {
        const ans = 32000;
        return {
          question: `The incomes of A and B are in the ratio 9:4 and their expenditures are in the ratio 7:3. If each saves ₹2000, find B's income.`,
          options: makeOptions(ans, 2000, 8000, (x) => `₹${x.toLocaleString()}`),
          answer: 0,
          explanation: `Let incomes be 9x, 4x. (9x-2000)/(4x-2000) = 7/3 → 27x - 6000 = 28x - 14000 → x = 8000. B's income = 4x = ₹32,000.`,
          subtopic: 'Ratio'
        };
      },
      () => {
        const total = 40;
        const pct = 10;
        const newPct = 20;
        const ans = 5;
        return {
          question: `A mixture of ${total} litres of milk and water contains ${pct}% water. How many litres of water should be added so that water becomes ${newPct}% in the new mixture?`,
          options: makeOptions(ans, 1, 4, (x) => `${x} litres`),
          answer: 0,
          explanation: `Initial water = 10% of 40 = 4L. Milk = 36L. In new mixture, milk is 80%. New total = 36/0.8 = 45L. Added water = 45 - 40 = 5L.`,
          subtopic: 'Mixture'
        };
      },
      () => {
        return {
          question: `Three containers have volumes in the ratio 3:4:5. They are full of mixtures of milk and water in the ratios 4:1, 3:1, and 5:2 respectively. If all contents are poured into a fourth container, find the ratio of milk and water in it.`,
          options: ['157:53','152:57','160:51','147:63'],
          answer: 0,
          explanation: `Let volumes be 30, 40, 50. C1: milk=24, water=6. C2: milk=30, water=10. C3: milk=250/7, water=100/7. Total milk = 628/7, Total water = 212/7. Ratio = 628:212 = 157:53.`,
          subtopic: 'Mixture'
        };
      }
    ]
  },

  // ==========================================
  // 3. AVERAGES
  // ==========================================
  'averages': {
    Easy: [
      () => {
        const count = 7;
        const avg1 = 45;
        const avg2 = 42;
        const ans = count * avg1 - (count - 1) * avg2;
        return {
          question: `The average of ${count} numbers is ${avg1}. If one number is excluded, the average becomes ${avg2}. Find the excluded number.`,
          options: makeOptions(ans, 2, 8),
          answer: 0,
          explanation: `Total sum = ${count} × ${avg1} = ${count * avg1}. Sum of 6 numbers = 6 × ${avg2} = ${6 * avg2}. Excluded number = ${count * avg1} - ${6 * avg2} = ${ans}.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const n = getRandomInt(15, 30);
        const ans = (n + 1) / 2;
        return {
          question: `Find the average of the first ${n} natural numbers.`,
          options: makeOptions(ans, 0.5, 3),
          answer: 0,
          explanation: `Average of first n natural numbers is (n+1)/2. For n=${n}, average is (${n}+1)/2 = ${ans}.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const count = 5;
        const avg = getRandomInt(25, 45);
        const ans = avg + 4;
        return {
          question: `The average of 5 consecutive odd numbers is ${avg}. Find the largest number.`,
          options: makeOptions(ans, 2, 6),
          answer: 0,
          explanation: `For consecutive odd numbers, the average is the middle number (3rd number). The numbers are ${avg-4}, ${avg-2}, ${avg}, ${avg+2}, ${avg+4}. Largest is ${ans}.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const avg = getRandomInt(10, 20);
        const mul = getRandomInt(3, 6);
        const ans = avg * mul;
        return {
          question: `The average of 10 numbers is ${avg}. If each number is multiplied by ${mul}, find the new average.`,
          options: makeOptions(ans, 5, 15),
          answer: 0,
          explanation: `Multiplying each number by k multiplies the average by k. New average = ${avg} × ${mul} = ${ans}.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const avg = getRandomInt(5, 15);
        const add = getRandomInt(8, 15);
        const ans = avg + add;
        return {
          question: `The average of 10 numbers is ${avg}. If every number is increased by ${add}, what is the new average?`,
          options: makeOptions(ans, 2, 6),
          answer: 0,
          explanation: `Adding k to each number increases the average by k. New average = ${avg} + ${add} = ${ans}.`,
          subtopic: 'Averages'
        };
      }
    ],
    Medium: [
      () => {
        const countB = 25;
        const avgB = 52;
        const countG = 15;
        const avgG = 46;
        const totalWeight = countB * avgB + countG * avgG;
        const ans = totalWeight / (countB + countG);
        return {
          question: `A class has ${countB} boys with an average weight of ${avgB} kg and ${countG} girls with an average weight of ${avgG} kg. Find the average weight of the entire class.`,
          options: makeOptions(ans, 0.5, 2, (x) => `${x} kg`),
          answer: 0,
          explanation: `Total weight = ${countB}×${avgB} + ${countG}×${avgG} = ${totalWeight} kg. Total students = 40. Average = ${totalWeight} / 40 = ${ans} kg.`,
          subtopic: 'Weighted Average'
        };
      },
      () => {
        const count1 = 8;
        const avg1 = 75;
        const count2 = 12;
        const avg2 = 85;
        const ans = (count1 * avg1 + count2 * avg2) / (count1 + count2);
        return {
          question: `In a class test, ${count1} students score an average of ${avg1} and ${count2} students score an average of ${avg2}. Find the overall average score.`,
          options: makeOptions(ans, 1, 4),
          answer: 0,
          explanation: `Total score = ${count1}×${avg1} + ${count2}×${avg2} = ${count1 * avg1 + count2 * avg2}. Total students = 20. Average = ${count1 * avg1 + count2 * avg2} / 20 = ${ans}.`,
          subtopic: 'Weighted Average'
        };
      },
      () => {
        const total = 50;
        const avg = 38;
        const d1 = 45;
        const d2 = 55;
        const remainingSum = total * avg - (d1 + d2);
        const ans = remainingSum / (total - 2);
        return {
          question: `The average of ${total} numbers is ${avg}. If two numbers, namely ${d1} and ${d2}, are discarded, find the average of the remaining numbers.`,
          options: makeOptions(ans, 0.5, 2),
          answer: 0,
          explanation: `Total sum = 1900. Discarded sum = 100. Remaining sum = 1800. Remaining numbers = 48. New average = 1800/48 = ${ans}.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const speed1 = 60;
        const speed2 = 40;
        const ans = (2 * speed1 * speed2) / (speed1 + speed2);
        return {
          question: `A person travels from town A to B at a speed of ${speed1} km/h and returns at a speed of ${speed2} km/h. Find the average speed for the entire journey.`,
          options: makeOptions(ans, 2, 6, (x) => `${x} km/h`),
          answer: 0,
          explanation: `Average Speed = 2xy/(x+y) = 2×${speed1}×${speed2}/(${speed1}+${speed2}) = ${ans} km/h.`,
          subtopic: 'Average Speed'
        };
      },
      () => {
        const ans = 80;
        return {
          question: `The average of P, Q, and R is 60. If the average of P and Q is 50, find the value of R.`,
          options: makeOptions(ans, 5, 20),
          answer: 0,
          explanation: `P + Q + R = 180. P + Q = 100. R = 180 - 100 = 80.`,
          subtopic: 'Averages'
        };
      }
    ],
    Hard: [
      () => {
        const ans = 75;
        return {
          question: `The average weight of 3 men A, B, and C is 84 kg. Another man D joins them and the average becomes 80 kg. If another man E, whose weight is 3 kg more than D, replaces A, then the average weight of B, C, D, and E becomes 79 kg. Find the weight of A.`,
          options: makeOptions(ans, 2, 5, (x) => `${x} kg`),
          answer: 0,
          explanation: `A+B+C = 252. A+B+C+D = 320 → D = 68. E = 71. B+C+D+E = 316 → B+C = 316 - 68 - 71 = 177. A = 252 - (B+C) = 252 - 177 = 75 kg.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const ans = 56;
        return {
          question: `The average of 11 numbers is 50. If the average of the first 6 numbers is 49 and that of the last 6 numbers is 52, find the 6th number.`,
          options: makeOptions(ans, 2, 8),
          answer: 0,
          explanation: `Sum of 11 numbers = 550. Sum of first 6 = 294. Sum of last 6 = 312. Sum of first 6 and last 6 = 606. 6th number = 606 - 550 = 56.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const ans = 5600;
        return {
          question: `The average monthly expenditure of a man for the first 5 months is ₹5000 and for the next 7 months is ₹5400. If he saves ₹4400 during the year, find his average monthly income.`,
          options: makeOptions(ans, 100, 300, (x) => `₹${x}`),
          answer: 0,
          explanation: `Total expenditure = 5×5000 + 7×5400 = 62,800. Total income = 62800 + 4400 = 67200. Average monthly income = 67200 / 12 = ₹5600.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const ans = 30;
        return {
          question: `The average age of 8 men is increased by 2 years when two of them whose ages are 21 years and 23 years are replaced by two new men. Find the average age of the two new men.`,
          options: makeOptions(ans, 2, 5, (x) => `${x} years`),
          answer: 0,
          explanation: `Total age increase = 8 × 2 = 16 years. Sum of replaced men = 44. Sum of new men = 44 + 16 = 60. Average = 60 / 2 = 30 years.`,
          subtopic: 'Averages'
        };
      },
      () => {
        const ans = 48;
        return {
          question: `Of three numbers, the first is twice the second and is half the third. If the average of these three numbers is 56, find the difference between the first and the third number.`,
          options: makeOptions(ans, 4, 12),
          answer: 0,
          explanation: `Let 2nd = x. 1st = 2x, 3rd = 4x. Average = 7x/3 = 56 → x = 24. 1st = 48, 3rd = 96. Difference = 96 - 48 = 48.`,
          subtopic: 'Averages'
        };
      }
    ]
  },

  // ==========================================
  // 4. AGES
  // ==========================================
  'ages': {
    Easy: [
      () => {
        const ans = 45;
        return {
          question: `Ram is 3 times as old as his son. 5 years later, Ram will be 2.5 times as old as his son. Find Ram's current age.`,
          options: makeOptions(ans, 5, 10, (x) => `${x} years`),
          answer: 0,
          explanation: `Let son be x. Ram is 3x. 3x + 5 = 2.5(x + 5) → 0.5x = 7.5 → x = 15. Ram is 3 × 15 = 45 years old.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 15;
        return {
          question: `The ratio of the ages of A and B is 3:5. After 10 years, their ratio becomes 5:7. Find A's current age.`,
          options: makeOptions(ans, 2, 5, (x) => `${x} years`),
          answer: 0,
          explanation: `Let A = 3x, B = 5x. (3x + 10)/(5x + 10) = 5/7 → 21x + 70 = 25x + 50 → 4x = 20 → x = 5. A's age = 3 × 5 = 15 years.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 15;
        return {
          question: `A father is 30 years older than his son. 5 years ago, the father was 4 times as old as his son. Find the son's current age.`,
          options: makeOptions(ans, 2, 5, (x) => `${x} years`),
          answer: 0,
          explanation: `Let son be S. Father is S + 30. 5 years ago: (S + 30) - 5 = 4(S - 5) → S + 25 = 4S - 20 → 3S = 45 → S = 15.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 6;
        return {
          question: `Meena's age is 3 times Rohan's age. 6 years hence, Meena will be 2 times Rohan's age. Rohan's current age is:`,
          options: makeOptions(ans, 1, 3, (x) => `${x} years`),
          answer: 0,
          explanation: `Let Rohan be R. Meena is 3R. 3R + 6 = 2(R + 6) → R = 6 years.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 22;
        return {
          question: `A man is 24 years older than his son. In 2 years, his age will be twice the age of his son. Find the present age of the son.`,
          options: makeOptions(ans, 2, 4, (x) => `${x} years`),
          answer: 0,
          explanation: `Let son be S, father is S + 24. In 2 years: S + 26 = 2(S + 2) → S = 22.`,
          subtopic: 'Ages'
        };
      }
    ],
    Medium: [
      () => {
        const ans = 40;
        return {
          question: `The sum of the ages of a father and his son is 56 years. 4 years ago, the father was 3 times as old as the son. Find the father's current age.`,
          options: makeOptions(ans, 2, 6, (x) => `${x} years`),
          answer: 0,
          explanation: `Let Father be F, Son be S. F + S = 56. 4 years ago: F - 4 = 3(S - 4) → F = 3S - 8. Substitute: (3S - 8) + S = 56 → 4S = 64 → S = 16. Father = 40 years.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 30;
        return {
          question: `Present ages of A and B differ by 16 years. 6 years ago, A was 3 times as old as B. Find A's present age.`,
          options: makeOptions(ans, 2, 5, (x) => `${x} years`),
          answer: 0,
          explanation: `A - B = 16. 6 years ago: A - 6 = 3(B - 6) → solving gives B = 14. A = 30 years.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 70;
        return {
          question: `10 years ago, the age of a father was 3 times the age of his son. 10 years hence, the father's age will be 2 times the age of his son. Find the present age of the father.`,
          options: makeOptions(ans, 5, 10, (x) => `${x} years`),
          answer: 0,
          explanation: `10 years ago son = x, father = 3x. Present: son = x+10, father = 3x+10. 10 years hence: 3x+20 = 2(x+20) → x = 20. Father = 3(20)+10 = 70.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 20;
        return {
          question: `The product of the present ages of a mother and her daughter is 240. If the daughter's age is doubled, it exceeds the mother's age by 4 years. Find the mother's present age.`,
          options: makeOptions(ans, 2, 5, (x) => `${x} years`),
          answer: 0,
          explanation: `M × D = 240. 2D = M + 4 → M = 2D - 4. (2D - 4) × D = 240 → D² - 2D - 120 = 0 → D = 12. Mother = 20 years.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = '3:5';
        return {
          question: `The ratio of the present ages of two brothers is 1:2 and 5 years back, the ratio was 1:3. What will be the ratio of their ages after 5 years?`,
          options: ['3:5','2:3','4:7','5:8'],
          answer: 0,
          explanation: `Present: x, 2x. 5 years ago: (x-5)/(2x-5) = 1/3 → x = 10. Present ages: 10 and 20. In 5 years: 15 and 25 → 3:5.`,
          subtopic: 'Ages'
        };
      }
    ],
    Hard: [
      () => {
        const ans = 20;
        return {
          question: `The average age of a family of 5 members is 20 years. If the age of the youngest member is 4 years, what was the average age of the family (excluding the youngest) at the time of the birth of the youngest member?`,
          options: makeOptions(ans, 1, 3, (x) => `${x} years`),
          answer: 0,
          explanation: `Sum of ages now = 100. 4 years ago, sum of other 4 members was 100 - 4 - 16 = 80. Average = 80 / 4 = 20 years.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 18;
        return {
          question: `A is twice as old as B was when A was as old as B is now. If A's present age is 24 years, find B's present age.`,
          options: makeOptions(ans, 2, 4, (x) => `${x} years`),
          answer: 0,
          explanation: `Let B = B. Diff = 24 - B. When A was B, B was 2B - 24. 24 = 2(2B - 24) → 4B = 72 → B = 18.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = '12 years ago';
        return {
          question: `The ratio of the ages of a man and his wife is 4:3. After 4 years, this ratio will be 9:7. If at the time of their marriage, the ratio was 5:3, how many years ago were they married?`,
          options: ['12 years ago','8 years ago','10 years ago','15 years ago'],
          answer: 0,
          explanation: `Let man=4x, wife=3x. (4x+4)/(3x+4)=9/7 → x = 8. Present ages: 32, 24. Married t years ago: (32-t)/(24-t) = 5/3 → t = 12.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 35;
        return {
          question: `Ten years ago, the age of A was half of B. If the ratio of their present ages is 3:4, find the sum of their present ages.`,
          options: makeOptions(ans, 5, 10, (x) => `${x} years`),
          answer: 0,
          explanation: `Present: 3x, 4x. 10 years ago: 3x-10 = 0.5(4x-10) → x=5. Present ages: 15, 20. Sum = 35 years.`,
          subtopic: 'Ages'
        };
      },
      () => {
        const ans = 8;
        return {
          question: `In a family, the average age of a father, mother, and their only son is 30 years. 5 years ago, the average age of the father and mother was 36 years. Find the present age of the son.`,
          options: makeOptions(ans, 2, 4, (x) => `${x} years`),
          answer: 0,
          explanation: `Present sum = 90. 5 years ago F+M = 72. Present sum of F+M = 82. Son's age = 90 - 82 = 8 years.`,
          subtopic: 'Ages'
        };
      }
    ]
  },

  // ==========================================
  // 5. PERCENTAGES
  // ==========================================
  'percentages': {
    Easy: [
      () => {
        const val = getRandomInt(10, 80) * 10;
        const pct = pickRandomArray([15, 25, 35, 45]);
        const ans = (pct / 100) * val;
        return {
          question: `What is ${pct}% of ${val}?`,
          options: makeOptions(ans, 5, 15),
          answer: 0,
          explanation: `${pct}/100 × ${val} = ${ans}.`,
          subtopic: 'Basic %'
        };
      },
      () => {
        const val = 960;
        const part = 720;
        const ans = (part / val) * 100;
        return {
          question: `${part} is what percent of ${val}?`,
          options: makeOptions(ans, 5, 10, (x) => `${x}%`),
          answer: 0,
          explanation: `(${part} / ${val}) × 100 = ${ans}%.`,
          subtopic: 'Basic %'
        };
      },
      () => {
        const a = 60;
        const b = 75;
        const ans = '5:4';
        return {
          question: `If ${a}% of A is equal to ${b}% of B, find the ratio A:B.`,
          options: ['5:4','4:5','3:4','4:3'],
          answer: 0,
          explanation: `0.6A = 0.75B → A/B = 0.75/0.60 = 5/4.`,
          subtopic: 'Ratio & %'
        };
      },
      () => {
        const total = 40;
        const boysPct = 60;
        const ans = total * (1 - boysPct/100);
        return {
          question: `In a class of ${total} students, ${boysPct}% are boys. How many girls are there in the class?`,
          options: makeOptions(ans, 2, 6),
          answer: 0,
          explanation: `Percentage of girls = 40%. Girls = 0.40 × ${total} = ${ans}.`,
          subtopic: 'Basic %'
        };
      },
      () => {
        const ans = '25%';
        return {
          question: `If x is 20% less than y, then by how much percent is y more than x?`,
          options: ['25%','20%','16.67%','30%'],
          answer: 0,
          explanation: `Let y=100, x=80. y is more than x by 20. (20/80) × 100 = 25%.`,
          subtopic: '% Difference'
        };
      }
    ],
    Medium: [
      () => {
        const ans = '16.67%';
        return {
          question: `A's salary is 20% more than B's salary. B's salary is what percent less than A's salary?`,
          options: ['16.67%','20%','15%','25%'],
          answer: 0,
          explanation: `Let B = 100. A = 120. (20 / 120) × 100 = 16.67%.`,
          subtopic: '% Difference'
        };
      },
      () => {
        const winPct = 64;
        const maj = 784;
        const ans = maj / ((winPct - (100 - winPct)) / 100);
        return {
          question: `In an election between two candidates, the winning candidate got ${winPct}% of the total valid votes and won by a majority of ${maj} votes. Find the total number of valid votes.`,
          options: makeOptions(ans, 100, 400),
          answer: 0,
          explanation: `Difference in percentages = ${winPct}% - ${100 - winPct}% = ${2 * winPct - 100}%. Total votes = ${maj} / ${(2 * winPct - 100) / 100} = ${ans}.`,
          subtopic: 'Elections'
        };
      },
      () => {
        const fail = 420;
        const passPct = 65;
        const ans = fail / ((100 - passPct) / 100);
        return {
          question: `In an examination, ${passPct}% of the total examinees passed. If the number of failures is ${fail}, find the total number of examinees.`,
          options: makeOptions(ans, 50, 200),
          answer: 0,
          explanation: `Failures = 35% of total = ${fail} → Total = ${fail} / 0.35 = ${ans}.`,
          subtopic: 'Basic %'
        };
      },
      () => {
        const r1 = 10;
        const r2 = 20;
        const ans = r1 + r2 + (r1 * r2)/100;
        return {
          question: `The population of a town increases by ${r1}% in the first year and by ${r2}% in the second year. Find the net percentage increase in population over two years.`,
          options: makeOptions(ans, 2, 5, (x) => `${x}%`),
          answer: 0,
          explanation: `Net increase = x + y + xy/100 = ${r1} + ${r2} + (${r1}×${r2})/100 = ${ans}%.`,
          subtopic: 'Successive Change'
        };
      },
      () => {
        const passPct = 40;
        const score = 178;
        const failBy = 22;
        const ans = (score + failBy) / (passPct / 100);
        return {
          question: `A student has to score ${passPct}% marks to pass an exam. He gets ${score} marks and fails by ${failBy} marks. Find the maximum marks of the exam.`,
          options: makeOptions(ans, 50, 100),
          answer: 0,
          explanation: `Passing marks = ${score} + ${failBy} = ${score + failBy}. Let max marks be M. 40% of M = ${score + failBy} → M = ${ans}.`,
          subtopic: 'Basic %'
        };
      }
    ],
    Hard: [
      () => {
        const ans = 30000;
        return {
          question: `In a library, 30% of the books are in Hindi, 20% of the remaining are in English, and 50% of the remaining are in French. If the remaining 8400 books are in regional languages, find the total number of books.`,
          options: makeOptions(ans, 2000, 5000),
          answer: 0,
          explanation: `Hindi=30%. Remaining=70%. English = 20% of 70% = 14%. Remaining = 56%. French = 50% of 56% = 28%. Remaining regional = 28% of total = 8400 → Total = 8400 / 0.28 = 30,000.`,
          subtopic: 'Basic %'
        };
      },
      () => {
        const ans = '10%';
        return {
          question: `The price of petrol increases by 20%. If a person wants to increase their expenditure on petrol by only 8%, by what percentage should they reduce their consumption?`,
          options: ['10%','12%','8%','15%'],
          answer: 0,
          explanation: `New consumption = 108 / 120 = 90%. Reduction = 10%.`,
          subtopic: 'Price & Consumption'
        };
      },
      () => {
        const ans = 22500;
        return {
          question: `A man spends 40% of his monthly salary on food and 1/3rd of the remaining on transport. If he saves ₹4500 per month, which is equal to half of the balance after spending on food and transport, find his monthly salary.`,
          options: makeOptions(ans, 1000, 4000, (x) => `₹${x}`),
          answer: 0,
          explanation: `Food = 40%. Remaining = 60%. Transport = 20%. Balance = 40%. Savings = half of balance = 20% of salary = 4500 → Salary = ₹22,500.`,
          subtopic: 'Basic %'
        };
      },
      () => {
        const ans = '80%';
        return {
          question: `In an exam, A got 10% marks less than B, B got 25% marks more than C, and C got 20% less than D. If A got 360 marks out of 500, find the percentage of marks obtained by D.`,
          options: ['80%','75%','85%','90%'],
          answer: 0,
          explanation: `A = 360. B = 400. C = 320. D = 400. D's percentage = 400/500 × 100 = 80%.`,
          subtopic: 'Basic %'
        };
      },
      () => {
        const ans = 16;
        return {
          question: `Due to a reduction of 20% in the price of wheat, a man is able to buy 5 kg more for ₹320. Find the original rate of wheat per kg.`,
          options: makeOptions(ans, 2, 4, (x) => `₹${x}`),
          answer: 0,
          explanation: `Reduction = 20% of 320 = ₹64. Reduced rate = 64/5 = ₹12.80. Original rate = 12.80/0.8 = ₹16.`,
          subtopic: 'Price & Consumption'
        };
      }
    ]
  },

  // ==========================================
  // 6. PROFIT & LOSS
  // ==========================================
  'profit-loss': {
    Easy: [
      () => {
        const ans = 20;
        return {
          question: `An item bought for ₹840 is sold for ₹1008. Find the profit percentage.`,
          options: makeOptions(ans, 2, 5, (x) => `${x}%`),
          answer: 0,
          explanation: `Profit = 1008 - 840 = 168. Profit% = (168/840) × 100 = 20%.`,
          subtopic: 'Profit'
        };
      },
      () => {
        const cp = 1500;
        const loss = 12;
        const ans = cp * (1 - loss/100);
        return {
          question: `A man buys an article for ₹${cp} and sells it at a loss of ${loss}%. Find the selling price.`,
          options: makeOptions(ans, 20, 60, (x) => `₹${x}`),
          answer: 0,
          explanation: `SP = CP × (100 - Loss%)/100 = ${cp} × 0.88 = ₹${ans}.`,
          subtopic: 'Loss'
        };
      },
      () => {
        const ans = 15000;
        return {
          question: `A TV is sold for ₹16200 at a profit of 8%. Find the cost price.`,
          options: makeOptions(ans, 200, 800, (x) => `₹${x}`),
          answer: 0,
          explanation: `CP = SP / (1 + Profit%) = 16200 / 1.08 = ₹15,000.`,
          subtopic: 'Profit'
        };
      },
      () => {
        const ans = 20;
        return {
          question: `A shopkeeper bought a cycle for ₹1200 and spent ₹200 on its repairs. He sold it for ₹1680. Find his profit percentage.`,
          options: makeOptions(ans, 2, 5, (x) => `${x}%`),
          answer: 0,
          explanation: `Total CP = 1400. SP = 1680. Profit = 280. Profit% = (280/1400) × 100 = 20%.`,
          subtopic: 'Profit'
        };
      },
      () => {
        const ans = 1200;
        return {
          question: `A man sells an article at a profit of 20%. If he sells it for ₹60 more, he would gain 25%. Find the cost price of the article.`,
          options: makeOptions(ans, 50, 150, (x) => `₹${x}`),
          answer: 0,
          explanation: `Difference in profit = 5% = ₹60. CP = 60 / 0.05 = ₹1200.`,
          subtopic: 'Profit'
        };
      }
    ],
    Medium: [
      () => {
        const cpCount = 15;
        const spCount = 12;
        const ans = ((cpCount - spCount) / spCount) * 100;
        return {
          question: `If the cost price of ${cpCount} oranges is equal to the selling price of ${spCount} oranges, find the profit percentage.`,
          options: makeOptions(ans, 5, 10, (x) => `${x}%`),
          answer: 0,
          explanation: `Profit% = (Difference / SP Count) × 100 = (3/12) × 100 = 25%.`,
          subtopic: 'Profit'
        };
      },
      () => {
        const mark = 30;
        const disc = 10;
        const ans = 17;
        return {
          question: `A trader marks his goods ${mark}% above the cost price and offers a ${disc}% discount. Find his profit percentage.`,
          options: makeOptions(ans, 2, 5, (x) => `${x}%`),
          answer: 0,
          explanation: `Let CP = 100. MP = 130. SP = 130 × 0.90 = 117. Profit = 17%.`,
          subtopic: 'Markup & Discount'
        };
      },
      () => {
        const sp = 1980;
        const pct = 10;
        const ans = '1% loss';
        return {
          question: `Two articles are sold for ₹${sp} each. On one, the seller gains ${pct}% and on the other, he loses ${pct}%. Find the overall profit or loss percentage.`,
          options: ['1% loss','No profit or loss','1% profit','2% loss'],
          answer: 0,
          explanation: `When two items are sold at the same price, one with x% gain and another with x% loss, there is a net loss of (x/10)²% = 1% loss.`,
          subtopic: 'Mixed'
        };
      },
      () => {
        const sp = 690;
        const loss = 8;
        const gain = 8;
        const ans = 810;
        return {
          question: `By selling an article for ₹${sp}, a person loses ${loss}%. At what price should he sell it to gain ${gain}%?`,
          options: makeOptions(ans, 20, 60, (x) => `₹${x}`),
          answer: 0,
          explanation: `CP = 690 / 0.92 = ₹750. SP for 8% gain = 750 × 1.08 = ₹810.`,
          subtopic: 'Profit & Loss'
        };
      },
      () => {
        const ans = 800;
        return {
          question: `A man sold a radio at a loss of 5%. Had he sold it for ₹104 more, he would have gained 8%. Find the cost price.`,
          options: makeOptions(ans, 50, 100, (x) => `₹${x}`),
          answer: 0,
          explanation: `Difference = 8% - (-5%) = 13% = 104. CP = 104 / 0.13 = ₹800.`,
          subtopic: 'Profit & Loss'
        };
      }
    ],
    Hard: [
      () => {
        const count = 17;
        const lossCount = 5;
        const sp = 720;
        const ans = sp / (count - lossCount);
        return {
          question: `On selling ${count} pens for ₹${sp}, a person loses an amount equal to the cost price of ${lossCount} pens. Find the cost price of a pen.`,
          options: makeOptions(ans, 5, 15, (x) => `₹${x}`),
          answer: 0,
          explanation: `Loss = CP of 5 pens. 17×CP - 720 = 5×CP → 12×CP = 720 → CP = ₹60 per pen.`,
          subtopic: 'Profit & Loss'
        };
      },
      () => {
        const ans = '33.33%';
        return {
          question: `A person buys 8 articles for ₹1 and sells 6 articles for ₹1. Find the gain percentage.`,
          options: ['33.33%','25%','20%','16.67%'],
          answer: 0,
          explanation: `CP of 1 = 1/8. SP of 1 = 1/6. Gain = 1/6 - 1/8 = 1/24. Gain% = (1/24) / (1/8) × 100 = 33.33%.`,
          subtopic: 'Profit'
        };
      },
      () => {
        const ans = 440;
        return {
          question: `A merchant buys two articles for ₹600. He sells one at a gain of 22% and the other at a loss of 8%. If there is no loss or gain in the whole transaction, find the cost price of the article sold at a loss.`,
          options: makeOptions(ans, 20, 60, (x) => `₹${x}`),
          answer: 0,
          explanation: `Let CP of first be x, second be 600 - x. 0.22x = 0.08(600 - x) → 0.30x = 48 → x = 160. Cost price of second (sold at loss) = 600 - 160 = ₹440.`,
          subtopic: 'Profit & Loss'
        };
      },
      () => {
        const ans = '100%';
        return {
          question: `If the selling price of an article is doubled, the profit triples. Find the original profit percentage.`,
          options: ['100%','50%','150%','200%'],
          answer: 0,
          explanation: `Profit P = SP - CP. 2SP - CP = 3(SP - CP) → SP = 2CP. Profit% = (2CP - CP)/CP × 100 = 100%.`,
          subtopic: 'Profit'
        };
      },
      () => {
        const ans = '22.22%';
        return {
          question: `A dishonest dealer cheats his wholesaler by 10% in weight while buying, and cheats his customer by 10% in weight while selling. If he sells at cost price, find his total profit percentage.`,
          options: ['22.22%','21.00%','20.00%','25.00%'],
          answer: 0,
          explanation: `Buying: gets 1100g for CP of 1000g. Selling: gives 900g for SP of 1000g. Profit% = (11/9 - 1) × 100 = 22.22%.`,
          subtopic: 'Dishonest Trading'
        };
      }
    ]
  },

  // ==========================================
  // 7. INTEREST & INSTALLMENTS
  // ==========================================
  'interest-installments': {
    Easy: [
      () => {
        const ans = 1440;
        return {
          question: `Find the Simple Interest on ₹8000 at 6% per annum for 3 years.`,
          options: makeOptions(ans, 100, 300, (x) => `₹${x}`),
          answer: 0,
          explanation: `SI = P×R×T/100 = 8000×6×3/100 = ₹1440.`,
          subtopic: 'Simple Interest'
        };
      },
      () => {
        const ans = '6%';
        return {
          question: `At what rate of SI will ₹5000 amount to ₹6500 in 5 years?`,
          options: ['6%','5%','7%','8%'],
          answer: 0,
          explanation: `SI = 1500. R = 1500×100/(5000×5) = 6%.`,
          subtopic: 'Simple Interest'
        };
      },
      () => {
        const ans = '12.5%';
        return {
          question: `A sum of money doubles itself in 8 years at simple interest. Find the rate of interest per annum.`,
          options: ['12.5%','10%','8%','15%'],
          answer: 0,
          explanation: `SI = P. P = P×R×8/100 → R = 100/8 = 12.5%.`,
          subtopic: 'Simple Interest'
        };
      },
      () => {
        const ans = 832;
        return {
          question: `Find the Compound Interest on ₹5000 at 8% per annum for 2 years compounded annually.`,
          options: makeOptions(ans, 50, 100, (x) => `₹${x}`),
          answer: 0,
          explanation: `CI = 5000[(1.08)²-1] = 5000×0.1664 = ₹832.`,
          subtopic: 'Compound Interest'
        };
      },
      () => {
        const ans = 720;
        return {
          question: `Find the simple interest on ₹12000 at 8% per annum for 9 months.`,
          options: makeOptions(ans, 40, 100, (x) => `₹${x}`),
          answer: 0,
          explanation: `SI = 12000 × 8 × 0.75 / 100 = ₹720.`,
          subtopic: 'Simple Interest'
        };
      }
    ],
    Medium: [
      () => {
        const ans = 40;
        return {
          question: `The difference between CI and SI for 2 years at 10% per annum on ₹4000 is:`,
          options: makeOptions(ans, 5, 15, (x) => `₹${x}`),
          answer: 0,
          explanation: `Diff = P×(r/100)² = 4000×(10/100)² = 4000×0.01 = ₹40.`,
          subtopic: 'CI vs SI'
        };
      },
      () => {
        const ans = '10%';
        return {
          question: `₹6000 amounts to ₹7986 in 3 years at compound interest. Find the rate of interest.`,
          options: ['10%','8%','12%','15%'],
          answer: 0,
          explanation: `7986/6000 = 1.331 = (1.1)³. Rate = 10%.`,
          subtopic: 'Compound Interest'
        };
      },
      () => {
        const ans = 2205;
        return {
          question: `₹2000 is invested at 5% CI compounded annually for 2 years. Find the total compound amount.`,
          options: makeOptions(ans, 50, 150, (x) => `₹${x}`),
          answer: 0,
          explanation: `Amount = 2000 × (1.05)² = ₹2205.`,
          subtopic: 'Compound Interest'
        };
      },
      () => {
        const ans = '3.67 years';
        return {
          question: `In how many years will ₹3000 amount to ₹4320 at 12% per annum SI?`,
          options: ['3.67 years','3 years','4 years','5 years'],
          answer: 0,
          explanation: `SI = 1320. T = 1320×100/(3000×12) = 3.67 years.`,
          subtopic: 'Simple Interest'
        };
      },
      () => {
        const ans = '12 years';
        return {
          question: `A sum of money doubles itself in 4 years at compound interest. In how many years will it become 8 times itself at the same rate?`,
          options: ['12 years','8 years','16 years','10 years'],
          answer: 0,
          explanation: `2³ = 2^(t/4) → t = 12 years.`,
          subtopic: 'Compound Interest'
        };
      }
    ],
    Hard: [
      () => {
        const ans = '5%';
        return {
          question: `SI on a sum for 2 years is ₹360. CI on the same sum for 2 years at same rate is ₹369. Find the rate%.`,
          options: ['5%','4%','6%','3%'],
          answer: 0,
          explanation: `SI/year = 180. Diff = 9. Rate = 9/180 × 100 = 5%.`,
          subtopic: 'CI vs SI'
        };
      },
      () => {
        const ans = 252.20;
        return {
          question: `Find the CI on ₹1600 for 1.5 years at 10% per annum compounded half-yearly.`,
          options: ['₹252.20','₹240.00','₹265.00','₹300.00'],
          answer: 0,
          explanation: `Rate = 5% per half-year, n=3. Amount = 1600×(1.05)³ = 1852.2. CI = ₹252.20.`,
          subtopic: 'Compound Interest'
        };
      },
      () => {
        const ans = 6615;
        return {
          question: `A loan of ₹12300 is to be returned in two equal annual installments at 5% per annum compound interest. Find the value of each installment.`,
          options: makeOptions(ans, 100, 300, (x) => `₹${x}`),
          answer: 0,
          explanation: `PV = x/1.05 + x/1.05² = 12300 → x = ₹6615.`,
          subtopic: 'Installments'
        };
      },
      () => {
        const ans = 400;
        return {
          question: `What sum of money will amount to ₹520 in 5 years and ₹568 in 7 years at simple interest?`,
          options: makeOptions(ans, 20, 50, (x) => `₹${x}`),
          answer: 0,
          explanation: `SI for 2 years = ₹48 → 1 year = ₹24. SI for 5 years = ₹120. Principal = 520 - 120 = ₹400.`,
          subtopic: 'Simple Interest'
        };
      },
      () => {
        const ans = 2155.06;
        return {
          question: `Find the compound interest on ₹10000 for 1 year at 20% per annum compounded quarterly.`,
          options: ['₹2155.06','₹2100.00','₹2000.00','₹2250.00'],
          answer: 0,
          explanation: `Quarterly rate = 5%, n = 4. Amount = 10000×(1.05)⁴ = 12155.06. CI = ₹2155.06.`,
          subtopic: 'Compound Interest'
        };
      }
    ]
  },

  // ==========================================
  // 8. TIME & WORK
  // ==========================================
  'time-work': {
    Easy: [
      () => {
        const ans = '7.2 days';
        return {
          question: `A can do a piece of work in 12 days and B can do the same work in 18 days. In how many days can they complete the work if they work together?`,
          options: ['7.2 days','8 days','6 days','9 days'],
          answer: 0,
          explanation: `1/12 + 1/18 = 5/36 → Time = 36/5 = 7.2 days.`,
          subtopic: 'Combined Work'
        };
      },
      () => {
        const ans = 25;
        return {
          question: `10 men can complete a piece of work in 15 days. How many men are required to complete the same work in 6 days?`,
          options: makeOptions(ans, 2, 5),
          answer: 0,
          explanation: `M1 × D1 = M2 × D2 → 10 × 15 = M2 × 6 → M2 = 25.`,
          subtopic: 'Man-Days'
        };
      },
      () => {
        const ans = '12 hours';
        return {
          question: `Pipe A can fill a tank in 4 hours, and Pipe B can empty it in 6 hours. If both pipes are opened simultaneously, in how many hours will the empty tank be filled?`,
          options: ['12 hours','10 hours','8 hours','6 hours'],
          answer: 0,
          explanation: `1/4 - 1/6 = 1/12 → Time = 12 hours.`,
          subtopic: 'Pipes & Cisterns'
        };
      },
      () => {
        const ans = '2.67 hours';
        return {
          question: `Pipes A, B, and C can fill a tank in 6, 8, and 12 hours respectively. If all three pipes are opened together, how long will it take to fill the tank?`,
          options: ['2.67 hours','3 hours','4 hours','2 hours'],
          answer: 0,
          explanation: `1/6 + 1/8 + 1/12 = 9/24 = 3/8 → Time = 8/3 ≈ 2.67 hours.`,
          subtopic: 'Pipes & Cisterns'
        };
      },
      () => {
        const ans = '6 days';
        return {
          question: `A can do a piece of work in 10 days and B can do it in 15 days. If they work together, in how many days can they complete the work?`,
          options: ['6 days','5 days','8 days','7 days'],
          answer: 0,
          explanation: `1/10 + 1/15 = 1/6 → Time = 6 days.`,
          subtopic: 'Combined Work'
        };
      }
    ],
    Medium: [
      () => {
        const ans = '8 days';
        return {
          question: `A is 3 times as efficient as B. Working together, they can finish a piece of work in 6 days. How many days will A take to finish the work alone?`,
          options: ['8 days','9 days','12 days','6 days'],
          answer: 0,
          explanation: `Combined efficiency = 4. Total work = 24. A's time = 24 / 3 = 8 days.`,
          subtopic: 'Efficiency'
        };
      },
      () => {
        const ans = '50 days';
        return {
          question: `15 workers can build a wall in 60 days. After 20 days, 5 more workers join them. Find the total number of days taken to complete the wall.`,
          options: ['50 days','45 days','55 days','48 days'],
          answer: 0,
          explanation: `Total = 900 man-days. 20 days done = 300. Remaining = 600. 20 workers take 30 days. Total = 50 days.`,
          subtopic: 'Man-Days'
        };
      },
      () => {
        const ans = '15 days';
        return {
          question: `A can do a piece of work in 24 days. B is 60% more efficient than A. Find the number of days B will take to complete the same work.`,
          options: ['15 days','12 days','16 days','18 days'],
          answer: 0,
          explanation: `B takes 24 × (100/160) = 15 days.`,
          subtopic: 'Efficiency'
        };
      },
      () => {
        const ans = '9 days';
        return {
          question: `A and B can do a piece of work in 45 days and 40 days respectively. They began the work together but A left after some days and B finished the remaining work in 23 days. After how many days did A leave?`,
          options: ['9 days','8 days','10 days','11 days'],
          answer: 0,
          explanation: `B done in 23 days = 23/40. Together done = 17/40. Together rate = 17/360. Time together = (17/40) / (17/360) = 9 days.`,
          subtopic: 'Combined Work'
        };
      },
      () => {
        const ans = '4 days';
        return {
          question: `12 men can complete a work in 8 days. 3 days after they started, 3 more men joined. In how many days will the remaining work be finished?`,
          options: ['4 days','5 days','3 days','6 days'],
          answer: 0,
          explanation: `Remaining work = 5 days of 12 men = 60 man-days. With 15 men: 60/15 = 4 days.`,
          subtopic: 'Man-Days'
        };
      }
    ],
    Hard: [
      () => {
        const ans = '8 days';
        return {
          question: `A and B can do a piece of work in 10 days. B and C can do it in 15 days, while C and A can do it in 12 days. In how many days can A, B, and C together finish the work?`,
          options: ['8 days','10 days','6 days','12 days'],
          answer: 0,
          explanation: `2(A+B+C) = 1/10+1/15+1/12 = 1/4 → A+B+C = 1/8 → 8 days.`,
          subtopic: 'Combined Work'
        };
      },
      () => {
        const ans = '9 days';
        return {
          question: `A can do a piece of work in 12 days and B can do it in 24 days. A starts the work alone and is joined by B after 3 days. Find the total number of days taken to complete the work.`,
          options: ['9 days','10 days','8 days','12 days'],
          answer: 0,
          explanation: `A in 3 days = 1/4. Remaining = 3/4. Combined rate = 1/8. Time together = 6 days. Total = 9 days.`,
          subtopic: 'Combined Work'
        };
      },
      () => {
        const ans = '40 days';
        return {
          question: `4 men and 6 women can do a piece of work in 8 days, while 3 men and 7 women can do it in 10 days. In how many days will 10 women complete the work?`,
          options: ['40 days','35 days','45 days','30 days'],
          answer: 0,
          explanation: `8(4M+6W) = 10(3M+7W) → 2M = 22W → 1M = 11W. Total work = 400 W-days. 10 women take = 40 days.`,
          subtopic: 'Man-Days'
        };
      },
      () => {
        const ans = '3 hours';
        return {
          question: `A takes 6 hours more than A and B together to complete a work. B takes 1.5 hours more than A and B together. Find the time taken by A and B working together.`,
          options: ['3 hours','4 hours','6 hours','2 hours'],
          answer: 0,
          explanation: `t = √(6 × 1.5) = √9 = 3 hours.`,
          subtopic: 'Combined Work'
        };
      },
      () => {
        const ans = '7 days';
        return {
          question: `A, B, and C can do a piece of work in 10, 12, and 15 days respectively. They start working together, but A leaves after 2 days. B leaves 3 days before the completion of the work. Find the total number of days taken to complete the work.`,
          options: ['7 days','6 days','8 days','9 days'],
          answer: 0,
          explanation: `2/10 + (x-3)/12 + x/15 = 1 → 9x = 63 → x = 7 days.`,
          subtopic: 'Combined Work'
        }
      }
    ]
  },

  // ==========================================
  // 9. BOAT, STREAMS & TRAINS
  // ==========================================
  'boat-streams-trains': {
    Easy: [
      () => {
        const ans = '3 hours';
        return {
          question: `Speed of a boat in still water is 12 km/h and speed of the stream is 4 km/h. Find the time taken to go 48 km downstream.`,
          options: ['3 hours','4 hours','6 hours','2 hours'],
          answer: 0,
          explanation: `Downstream speed = 12 + 4 = 16 km/h. Time = 48 / 16 = 3 hours.`,
          subtopic: 'Boats & Streams'
        };
      },
      () => {
        const ans = '2 km/h';
        return {
          question: `A man rows upstream at 6 km/h and downstream at 10 km/h. Find the speed of the stream.`,
          options: ['2 km/h','4 km/h','3 km/h','8 km/h'],
          answer: 0,
          explanation: `Stream speed = (10 - 6) / 2 = 2 km/h.`,
          subtopic: 'Boats & Streams'
        };
      },
      () => {
        const ans = '11 km/h';
        return {
          question: `A boat rows upstream at 8 km/h and downstream at 14 km/h. Find the speed of the boat in still water.`,
          options: ['11 km/h','6 km/h','3 km/h','10 km/h'],
          answer: 0,
          explanation: `Boat speed = (14 + 8) / 2 = 11 km/h.`,
          subtopic: 'Boats & Streams'
        };
      },
      () => {
        const ans = '2 hours';
        return {
          question: `A swimmer can swim in still water at 6 km/h. If the river flows at 2 km/h, find the time taken to swim 16 km downstream.`,
          options: ['2 hours','2.5 hours','4 hours','3 hours'],
          answer: 0,
          explanation: `Downstream speed = 8 km/h. Time = 16 / 8 = 2 hours.`,
          subtopic: 'Boats & Streams'
        };
      },
      () => {
        const ans = '1 km/h';
        return {
          question: `A boat travels 24 km upstream in 6 hours and 36 km downstream in 6 hours. Find the speed of the current.`,
          options: ['1 km/h','2 km/h','1.5 km/h','0.5 km/h'],
          answer: 0,
          explanation: `Upstream = 4 km/h. Downstream = 6 km/h. Current = (6 - 4)/2 = 1 km/h.`,
          subtopic: 'Boats & Streams'
        };
      }
    ],
    Medium: [
      () => {
        const ans = '12 seconds';
        return {
          question: `A train running at 75 km/h crosses a pole in how many seconds if the train is 250 m long?`,
          options: ['12 seconds','10 seconds','15 seconds','18 seconds'],
          answer: 0,
          explanation: `75 km/h = 125/6 m/s. Time = 250 / (125/6) = 12 seconds.`,
          subtopic: 'Trains'
        };
      },
      () => {
        const ans = '36 km/h';
        return {
          question: `A train 180 m long crosses a 270 m platform in 45 seconds. Find the speed of the train.`,
          options: ['36 km/h','48 km/h','54 km/h','30 km/h'],
          answer: 0,
          explanation: `Distance = 450 m. Speed = 450/45 = 10 m/s = 36 km/h.`,
          subtopic: 'Trains'
        };
      },
      () => {
        const ans = '5 hours';
        return {
          question: `Two trains start from stations A and B towards each other at 60 km/h and 80 km/h. If the distance between A and B is 700 km, after how many hours will they meet?`,
          options: ['5 hours','6 hours','4 hours','7 hours'],
          answer: 0,
          explanation: `Relative speed = 140 km/h. Time = 700 / 140 = 5 hours.`,
          subtopic: 'Trains'
        };
      },
      () => {
        const ans = '200 m';
        return {
          question: `A train running at 54 km/h crosses a 250 m long platform in 30 seconds. Find the length of the train.`,
          options: ['200 m','180 m','220 m','250 m'],
          answer: 0,
          explanation: `54 km/h = 15 m/s. Distance covered = 450 m. Train = 450 - 250 = 200 m.`,
          subtopic: 'Trains'
        };
      },
      () => {
        const ans = '10:00 AM';
        return {
          question: `Two stations A and B are 110 km apart. One train starts from A at 7 AM and travels towards B at 20 km/h. Another starts from B at 8 AM and travels towards A at 25 km/h. At what time will they meet?`,
          options: ['10:00 AM','9:30 AM','10:30 AM','11:00 AM'],
          answer: 0,
          explanation: `By 8 AM, A train covered 20 km. Rest distance = 90 km. Relative speed = 45 km/h. Time = 2 hours. Meeting time = 10:00 AM.`,
          subtopic: 'Trains'
        };
      }
    ],
    Hard: [
      () => {
        const ans = '8 seconds';
        return {
          question: `Two trains 120 m and 80 m long run in opposite directions at 40 km/h and 50 km/h. Find the time taken to cross each other.`,
          options: ['8 seconds','10 seconds','6 seconds','12 seconds'],
          answer: 0,
          explanation: `Distance = 200 m. Rel speed = 90 km/h = 25 m/s. Time = 200/25 = 8 seconds.`,
          subtopic: 'Trains'
        };
      },
      () => {
        const ans = '12 km';
        return {
          question: `A man can row 5 km/h in still water. If the river flows at 1 km/h, it takes him 5 hours to row to a place and return. Find the distance of the place.`,
          options: ['12 km','10 km','8 km','6 km'],
          answer: 0,
          explanation: `Down = 6, Up = 4. d/6 + d/4 = 5 → 5d/12 = 5 → d = 12 km.`,
          subtopic: 'Boats & Streams'
        };
      },
      () => {
        const ans = '3:1';
        return {
          question: `A boat takes 3 hours to travel a certain distance upstream and 1.5 hours to travel the same distance downstream. Find the ratio of the boat speed in still water to the speed of the stream.`,
          options: ['3:1','2:1','4:1','5:2'],
          answer: 0,
          explanation: `3(b-s) = 1.5(b+s) → 1.5b = 4.5s → b:s = 3:1.`,
          subtopic: 'Boats & Streams'
        };
      },
      () => {
        const ans = '80 km/h';
        return {
          question: `A train 400 m long overtakes a man running at 8 km/h in the same direction in 20 seconds. Find the speed of the train.`,
          options: ['80 km/h','72 km/h','64 km/h','90 km/h'],
          answer: 0,
          explanation: `Rel speed = 400/20 = 20 m/s = 72 km/h. Train speed = 72 + 8 = 80 km/h.`,
          subtopic: 'Trains'
        };
      },
      () => {
        const ans = '200 m';
        return {
          question: `A train passes two bridges of lengths 800 m and 400 m in 100 seconds and 60 seconds respectively. Find the length of the train.`,
          options: ['200 m','150 m','250 m','300 m'],
          answer: 0,
          explanation: `(L+800)/100 = (L+400)/60 → 3L + 2400 = 5L + 2000 → 2L = 400 → L = 200 m.`,
          subtopic: 'Trains'
        };
      }
    ]
  },

  // ==========================================
  // 10. DATA INTERPRETATION
  // ==========================================
  'data-interpretation': {
    Easy: [
      () => {
        const ans = '₹60 lakhs';
        return {
          question: `A table shows monthly sales (₹ lakhs): Jan=40, Feb=50, Mar=60, Apr=70, May=80. What is the average monthly sales?`,
          options: ['₹60 lakhs','₹50 lakhs','₹70 lakhs','₹55 lakhs'],
          answer: 0,
          explanation: `Sum = 300. Average = 300/5 = ₹60 lakhs.`,
          subtopic: 'Table'
        };
      },
      () => {
        const ans = '20%';
        return {
          question: `In a pie chart, sector "Transport" has angle 72°. What % of total does it represent?`,
          options: ['20%','18%','25%','15%'],
          answer: 0,
          explanation: `(72/360) × 100 = 20%.`,
          subtopic: 'Pie Chart'
        };
      },
      () => {
        const ans = '56%';
        return {
          question: `Bar chart: Company profits (₹Cr) — 2020: 100, 2021: 130, 2022: 156. Find the percentage growth from 2020 to 2022.`,
          options: ['56%','30%','26%','60%'],
          answer: 0,
          explanation: `Growth = (156-100)/100 × 100 = 56%.`,
          subtopic: 'Bar Chart'
        };
      },
      () => {
        const ans = '₹30000';
        return {
          question: `A table shows: Product A sold 500 units at ₹30 each, Product B sold 300 at ₹50 each. Find the total revenue.`,
          options: ['₹30000','₹25000','₹35000','₹20000'],
          answer: 0,
          explanation: `Revenue = 500×30 + 300×50 = ₹30,000.`,
          subtopic: 'Table'
        };
      },
      () => {
        const ans = '₹1.25 Lakh';
        return {
          question: `Pie chart: Budget (₹5 Lakh total). Education=20%, Transport=15%, Health=25%, Others=40%. Find the Health budget.`,
          options: ['₹1.25 Lakh','₹1 Lakh','₹1.5 Lakh','₹0.75 Lakh'],
          answer: 0,
          explanation: `Health = 25% of 5 Lakh = ₹1.25 Lakh.`,
          subtopic: 'Pie Chart'
        };
      }
    ],
    Medium: [
      () => {
        const ans = '20%';
        return {
          question: `Students in 5 subjects: Maths=240, Science=180, English=200, Hindi=160, History=120. Science is what % of total?`,
          options: ['20%','25%','18%','15%'],
          answer: 0,
          explanation: `Total = 900. Science = 180. 180 / 900 × 100 = 20%.`,
          subtopic: 'Table'
        };
      },
      () => {
        const ans = 'Q4';
        return {
          question: `Line graph shows production (tons): Q1=200, Q2=250, Q3=225, Q4=300. Which quarter had the highest growth rate?`,
          options: ['Q4','Q2','Q1','Q3'],
          answer: 0,
          explanation: `Q2: 25%. Q4: 33.3% from Q3. Q4 has the highest growth rate.`,
          subtopic: 'Line Graph'
        };
      },
      () => {
        const ans = '50%';
        return {
          question: `A table shows: Year 2020 (Import = 400, Export = 500), Year 2021 (Import = 450, Export = 600). Find the percentage increase in trade balance (Export - Import) from 2020 to 2021.`,
          options: ['50%','40%','60%','30%'],
          answer: 0,
          explanation: `Balance 2020 = 100. Balance 2021 = 150. Growth = 50%.`,
          subtopic: 'Table'
        };
      },
      () => {
        const ans = '₹10,000';
        return {
          question: `A pie chart shows family expenditures: Food = 30%, Rent = 20%, Utilities = 15%, Savings = 25%, Others = 10%. If total income is ₹40,000, find the amount saved.`,
          options: ['₹10,000','₹8,000','₹12,000','₹9,000'],
          answer: 0,
          explanation: `Savings = 25% of ₹40,000 = ₹10,000.`,
          subtopic: 'Pie Chart'
        };
      },
      () => {
        const ans = '8:15';
        return {
          question: `A bar graph shows car sales (thousands) over 3 years: Year 1 = 80, Year 2 = 120, Year 3 = 150. Find the ratio of car sales in Year 1 to Year 3.`,
          options: ['8:15','4:7','3:5','2:3'],
          answer: 0,
          explanation: `Ratio = 80 : 150 = 8:15.`,
          subtopic: 'Bar Chart'
        };
      }
    ],
    Hard: [
      () => {
        const ans = '~12.8%';
        return {
          question: `Sales data: 2018=100, 2019=120, 2020=90, 2021=135, 2022=162. Find the CAGR from 2018 to 2022.`,
          options: ['~12.8%','16.2%','10%','20%'],
          answer: 0,
          explanation: `CAGR = (162/100)^(1/4) - 1 ≈ 12.8%.`,
          subtopic: 'Line Graph'
        };
      },
      () => {
        const ans = '3200';
        return {
          question: `A table shows student distribution: Science = 35%, Arts = 40%, Commerce = 25%. If there are 800 Commerce students, find the total number of students in the university.`,
          options: ['3200','2800','3000','3500'],
          answer: 0,
          explanation: `25% of total = 800 → Total = 3200.`,
          subtopic: 'Table'
        };
      },
      () => {
        const ans = '37%';
        return {
          question: `A company has 3 departments: HR, Tech, Sales. In HR, the ratio of men to women is 2:3. In Tech, it is 4:1. In Sales, it is 1:1. The number of employees in HR, Tech, and Sales are in the ratio 2:5:3. Find the overall percentage of women employees in the company.`,
          options: ['37%','40%','35%','42%'],
          answer: 0,
          explanation: `Let total employees be 100. HR=20, Tech=50, Sales=30. Women: HR=12, Tech=10, Sales=15. Total women = 37. Overall percentage = 37%.`,
          subtopic: 'Table'
        };
      },
      () => {
        const ans = '1950';
        return {
          question: `A bar graph shows sales of mobile brands A, B, and C. Brand A sold 40% of the total 5000 units. Brand B sold 35% of the remaining units. How many units did Brand C sell?`,
          options: ['1950','1800','2000','1900'],
          answer: 0,
          explanation: `A = 2000. Remaining = 3000. B = 1050. C = 1950.`,
          subtopic: 'Bar Chart'
        };
      },
      () => {
        const ans = '₹62.5 Lakhs';
        return {
          question: `A line graph shows profit percent of a company. 2020 (Profit = 20%), 2021 (Profit = 25%). If the income in 2020 was ₹60 Lakhs, and the expenditure in 2020 was equal to the expenditure in 2021, find the income in 2021.`,
          options: ['₹62.5 Lakhs','₹60.0 Lakhs','₹65.0 Lakhs','₹70.0 Lakhs'],
          answer: 0,
          explanation: `Profit 2020 = 20% → 1.2E = 60 → E = 50. Exp 2021 = 50. Profit 2021 = 25% → I = 62.5.`,
          subtopic: 'Line Graph'
        };
      }
    ]
  },

  // ==========================================
  // 11. PERMUTATIONS, COMBINATIONS & PROBABILITY
  // ==========================================
  'perm-comb-prob': {
    Easy: [
      () => {
        const ans = '720';
        return {
          question: `In how many ways can 6 books be arranged on a shelf?`,
          options: ['720','120','360','24'],
          answer: 0,
          explanation: `6! = 720 ways.`,
          subtopic: 'Permutations'
        };
      },
      () => {
        const ans = '56';
        return {
          question: `From 8 people, a committee of 3 is to be formed. Find the number of ways.`,
          options: ['56','24','336','112'],
          answer: 0,
          explanation: `C(8,3) = (8×7×6)/(3×2×1) = 56.`,
          subtopic: 'Combinations'
        };
      },
      () => {
        const ans = '120';
        return {
          question: `How many 4-digit numbers can be formed using digits 1, 2, 3, 4, 5 without repetition?`,
          options: ['120','60','24','240'],
          answer: 0,
          explanation: `P(5,4) = 5 × 4 × 3 × 2 = 120.`,
          subtopic: 'Permutations'
        };
      },
      () => {
        const ans = '3/13';
        return {
          question: `A card is drawn from a deck of 52. Probability it is a face card (J, Q, K)?`,
          options: ['3/13','1/4','1/13','1/52'],
          answer: 0,
          explanation: `Total face cards = 12. P = 12/52 = 3/13.`,
          subtopic: 'Probability'
        };
      },
      () => {
        const ans = '60';
        return {
          question: `In how many ways can the letters of the word "APPLE" be arranged?`,
          options: ['60','120','24','30'],
          answer: 0,
          explanation: `5! / 2! (P is repeated twice) = 60.`,
          subtopic: 'Permutations'
        };
      }
    ],
    Medium: [
      () => {
        const ans = '8/15';
        return {
          question: `A bag contains 4 red and 6 blue balls. What is the probability of picking 1 red and 1 blue ball when drawing two balls?`,
          options: ['8/15','4/15','2/5','1/3'],
          answer: 0,
          explanation: `P = C(4,1)×C(6,1)/C(10,2) = 24/45 = 8/15.`,
          subtopic: 'Probability'
        };
      },
      () => {
        const ans = '5/36';
        return {
          question: `Two dice are thrown. What is the probability of getting a sum of 8?`,
          options: ['5/36','1/6','7/36','4/36'],
          answer: 0,
          explanation: `Favorable outcomes: (2,6), (3,5), (4,4), (5,3), (6,2) → 5. Probability = 5/36.`,
          subtopic: 'Probability'
        };
      },
      () => {
        const ans = '48';
        return {
          question: `In how many ways can letters of "MANGO" be arranged so that vowels always come together?`,
          options: ['48','24','72','36'],
          answer: 0,
          explanation: `Consonants M,N,G. Vowels A,O. Treat vowels as 1 block → 4 units. 4! × 2! = 24 × 2 = 48.`,
          subtopic: 'Permutations'
        };
      },
      () => {
        const ans = '60';
        return {
          question: `How many 3-letter words can be formed from A, B, C, D, E with no repetition?`,
          options: ['60','120','24','30'],
          answer: 0,
          explanation: `P(5,3) = 5 × 4 × 3 = 60.`,
          subtopic: 'Permutations'
        };
      },
      () => {
        const ans = '24';
        return {
          question: `In how many ways can 5 people be seated in a circle?`,
          options: ['24','120','60','48'],
          answer: 0,
          explanation: `(5-1)! = 4! = 24.`,
          subtopic: 'Permutations'
        };
      }
    ],
    Hard: [
      () => {
        const ans = '81';
        return {
          question: `From 5 men and 4 women, a team of 4 with at least 2 women is formed. How many ways?`,
          options: ['81','60','126','45'],
          answer: 0,
          explanation: `C(4,2)×C(5,2) + C(4,3)×C(5,1) + C(4,4) = 60 + 20 + 1 = 81.`,
          subtopic: 'Combinations'
        };
      },
      () => {
        const ans = '1/2';
        return {
          question: `A problem has probability 1/3 for A to solve and 1/4 for B. Find the probability it is solved.`,
          options: ['1/2','1/12','7/12','1/3'],
          answer: 0,
          explanation: `P(solved) = 1 - P(neither) = 1 - (2/3 × 3/4) = 1/2.`,
          subtopic: 'Probability'
        };
      },
      () => {
        const ans = '70';
        return {
          question: `⁷C₃ + ⁷C₄ = ?`,
          options: ['70','35','56','84'],
          answer: 0,
          explanation: `By Pascal\'s rule, ⁷C₃ + ⁷C₄ = ⁸C₄ = 70.`,
          subtopic: 'Combinations'
        };
      },
      () => {
        const ans = '1/26';
        return {
          question: `A card is drawn from a well-shuffled pack of 52 cards. Find the probability of getting a red queen.`,
          options: ['1/26','1/13','1/52','1/4'],
          answer: 0,
          explanation: `2 red queens (hearts/diamonds). Probability = 2/52 = 1/26.`,
          subtopic: 'Probability'
        };
      },
      () => {
        const ans = '3/11';
        return {
          question: `A box contains 5 red, 4 green, and 3 blue marbles. If 3 marbles are drawn at random, find the probability that they are of different colors.`,
          options: ['3/11','3/10','1/4','1/3'],
          answer: 0,
          explanation: `Total = 12. Draw 3: C(12,3) = 220. Favorable = 5×4×3 = 60. P = 60/220 = 3/11.`,
          subtopic: 'Probability'
        };
      }
    ]
  },

  // ==========================================
  // 12. QUADRATIC EQUATIONS
  // ==========================================
  'quadratic-equations': {
    Easy: [
      () => {
        return {
          question: `Solve the quadratic equation: x² - 7x + 12 = 0.`,
          options: ['x = 3, 4','x = -3, -4','x = 3, -4','x = -3, 4'],
          answer: 0,
          explanation: `(x-3)(x-4) = 0 → x = 3, 4.`,
          subtopic: 'Factoring'
        };
      },
      () => {
        return {
          question: `Find the sum of the roots of the equation 3x² - 9x + 6 = 0.`,
          options: ['3','6','-3','2'],
          answer: 0,
          explanation: `Sum of roots = -b/a = 9/3 = 3.`,
          subtopic: 'Roots'
        };
      },
      () => {
        return {
          question: `Find the product of the roots of the equation 2x² + 5x - 12 = 0.`,
          options: ['-6','6','-2.5','2.5'],
          answer: 0,
          explanation: `Product of roots = c/a = -12/2 = -6.`,
          subtopic: 'Roots'
        };
      },
      () => {
        return {
          question: `Form a quadratic equation with roots -3 and 5.`,
          options: ['x² - 2x - 15 = 0','x² + 2x - 15 = 0','x² - 2x + 15 = 0','x² + 2x + 15 = 0'],
          answer: 0,
          explanation: `Sum = 2. Product = -15. Equation: x² - 2x - 15 = 0.`,
          subtopic: 'Forming Equations'
        };
      },
      () => {
        return {
          question: `Solve the equation: x + 6/x = 5.`,
          options: ['x = 2, 3','x = -2, -3','x = 1, 5','x = -1, -5'],
          answer: 0,
          explanation: `x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x = 2, 3.`,
          subtopic: 'Factoring'
        };
      }
    ],
    Medium: [
      () => {
        return {
          question: `For what value of k does x² - kx + 9 = 0 have equal roots?`,
          options: ['6 or -6','3 or -3','9 or -9','4 or -4'],
          answer: 0,
          explanation: `D = k² - 36 = 0 → k = ±6.`,
          subtopic: 'Nature of Roots'
        };
      },
      () => {
        return {
          question: `Solve: 2x² - 5x - 3 = 0.`,
          options: ['x = 3, -0.5','x = -3, 0.5','x = 3, 1','x = -1, 1.5'],
          answer: 0,
          explanation: `(2x+1)(x-3) = 0 → x = 3, -0.5.`,
          subtopic: 'Quadratic Formula'
        };
      },
      () => {
        return {
          question: `Equation I: x²-5x+6=0. Equation II: y²-7y+12=0. Which relation is true?`,
          options: ['x ≤ y','Cannot determine','x ≥ y','x = y'],
          answer: 0,
          explanation: `x = 2, 3. y = 3, 4. Comparing all pairs: x ≤ y.`,
          subtopic: 'Comparison'
        };
      },
      () => {
        return {
          question: `If one root of x² + px + 12 = 0 is 4, find the value of p.`,
          options: ['-7','7','-3','3'],
          answer: 0,
          explanation: `Substitute x=4: 16 + 4p + 12 = 0 → 4p = -28 → p = -7.`,
          subtopic: 'Roots'
        };
      },
      () => {
        return {
          question: `What is the nature of the roots of the equation 4x² - 4x + 1 = 0?`,
          options: ['Equal real roots','Two distinct real roots','No real roots','One real root'],
          answer: 0,
          explanation: `D = 16 - 16 = 0. Equal real roots.`,
          subtopic: 'Nature of Roots'
        };
      }
    ],
    Hard: [
      () => {
        return {
          question: `If α and β are roots of x² - 6x + 8 = 0, find the value of α² + β².`,
          options: ['20','36','28','16'],
          answer: 0,
          explanation: `α+β=6, αβ=8. α²+β² = (α+β)² - 2αβ = 36 - 16 = 20.`,
          subtopic: 'Roots'
        };
      },
      () => {
        return {
          question: `If the roots of x² - px + 9 = 0 have a difference of 8, find the positive value of p.`,
          options: ['10','8','12','6'],
          answer: 0,
          explanation: `(α-β)² = 64 → p² - 36 = 64 → p = 10.`,
          subtopic: 'Roots'
        };
      },
      () => {
        return {
          question: `Find the value of m for which the sum of the roots of 2x² - (m-3)x + 8 = 0 is equal to half their product.`,
          options: ['7','5','8','6'],
          answer: 0,
          explanation: `Sum = (m-3)/2, Product = 4. (m-3)/2 = 2 → m = 7.`,
          subtopic: 'Roots'
        };
      },
      () => {
        return {
          question: `If one root of x² - 8x + k = 0 is 3 times the other, find the value of k.`,
          options: ['12','16','9','15'],
          answer: 0,
          explanation: `α + 3α = 8 → α = 2. Roots are 2 and 6. Product k = 12.`,
          subtopic: 'Roots'
        };
      },
      () => {
        return {
          question: `Find the number of real roots of the equation: x² - 3|x| + 2 = 0.`,
          options: ['4','2','0','3'],
          answer: 0,
          explanation: `For x ≥ 0: x² - 3x + 2 = 0 → x = 1, 2. For x < 0: x² + 3x + 2 = 0 → x = -1, -2. Total = 4 real roots.`,
          subtopic: 'Roots'
        };
      }
    ]
  },

  // ==========================================
  // 13. INEQUALITIES
  // ==========================================
  'inequalities': {
    Easy: [
      () => {
        return {
          question: `Solve the inequality: 3x - 7 > 11.`,
          options: ['x > 6','x < 6','x ≥ 6','x ≤ 6'],
          answer: 0,
          explanation: `3x > 18 → x > 6.`,
          subtopic: 'Linear Inequality'
        };
      },
      () => {
        return {
          question: `Solve for x: |2x - 3| ≤ 5.`,
          options: ['-1 ≤ x ≤ 4','x ≤ -1 or x ≥ 4','0 ≤ x ≤ 4','-2 ≤ x ≤ 3'],
          answer: 0,
          explanation: `-5 ≤ 2x - 3 ≤ 5 → -2 ≤ 2x ≤ 8 → -1 ≤ x ≤ 4.`,
          subtopic: 'Absolute Value'
        };
      },
      () => {
        return {
          question: `If a > b > 0, which of the following is always true?`,
          options: ['1/a < 1/b','a² < b²','a - b < 0','-a > -b'],
          answer: 0,
          explanation: `Dividing a > b by ab gives 1/b > 1/a.`,
          subtopic: 'Inequality Properties'
        };
      },
      () => {
        return {
          question: `Solve the inequality: 5 - 2x ≥ 11.`,
          options: ['x ≤ -3','x ≥ -3','x ≤ 3','x ≥ 3'],
          answer: 0,
          explanation: `-2x ≥ 6 → x ≤ -3.`,
          subtopic: 'Linear Inequality'
        };
      },
      () => {
        return {
          question: `Solve the quadratic inequality: x² - 9 < 0.`,
          options: ['-3 < x < 3','x < -3 or x > 3','x < 3','x > -3'],
          answer: 0,
          explanation: `(x-3)(x+3) < 0 → -3 < x < 3.`,
          subtopic: 'Quadratic Inequality'
        };
      }
    ],
    Medium: [
      () => {
        return {
          question: `Solve the quadratic inequality: x² - 5x + 4 ≤ 0.`,
          options: ['1 ≤ x ≤ 4','x ≤ 1 or x ≥ 4','0 ≤ x ≤ 5','x < 1'],
          answer: 0,
          explanation: `(x-1)(x-4) ≤ 0 → 1 ≤ x ≤ 4.`,
          subtopic: 'Quadratic Inequality'
        };
      },
      () => {
        return {
          question: `Solve for x: (x-2)(x+3) > 0.`,
          options: ['x < -3 or x > 2','-3 < x < 2','x > 2','x < -3'],
          answer: 0,
          explanation: `Roots are -3 and 2. Since it is > 0, solution is outside the roots: x < -3 or x > 2.`,
          subtopic: 'Quadratic Inequality'
        };
      },
      () => {
        return {
          question: `Solve for x: x² - x - 6 ≥ 0.`,
          options: ['x ≤ -2 or x ≥ 3','-2 ≤ x ≤ 3','x ≥ 3','All x'],
          answer: 0,
          explanation: `(x-3)(x+2) ≥ 0 → x ≤ -2 or x ≥ 3.`,
          subtopic: 'Quadratic Inequality'
        };
      },
      () => {
        return {
          question: `Find the integer values of x satisfying: -3 ≤ 2x - 1 < 7.`,
          options: ['-1, 0, 1, 2, 3','0, 1, 2, 3','-1, 0, 1, 2','0, 1, 2'],
          answer: 0,
          explanation: `-2 ≤ 2x < 8 → -1 ≤ x < 4. Integers are -1, 0, 1, 2, 3.`,
          subtopic: 'Linear Inequality'
        };
      },
      () => {
        return {
          question: `Find the range of x if: 1/x > 2 (given x > 0).`,
          options: ['0 < x < 0.5','x > 0.5','x < 0.5','x > 2'],
          answer: 0,
          explanation: `1/x > 2 → x < 0.5. Given x > 0 → 0 < x < 0.5.`,
          subtopic: 'Rational Inequality'
        };
      }
    ],
    Hard: [
      () => {
        return {
          question: `If p² - 3p + 2 ≤ 0 and q² - 5q + 6 ≤ 0, which relation between p and q is true?`,
          options: ['p ≤ q','p ≥ q','p = q','Cannot determine'],
          answer: 0,
          explanation: `p ∈ [1,2]. q ∈ [2,3]. So p ≤ q always.`,
          subtopic: 'Quadratic Inequality'
        };
      },
      () => {
        return {
          question: `Which of the following describes the solution of: |x - 4| > 3?`,
          options: ['x < 1 or x > 7','1 < x < 7','x > 7','x < 1'],
          answer: 0,
          explanation: `x - 4 > 3 or x - 4 < -3 → x > 7 or x < 1.`,
          subtopic: 'Absolute Value'
        };
      },
      () => {
        return {
          question: `Find the range of x satisfying the inequality: (x - 1)(x - 2) / (x - 3) ≥ 0.`,
          options: ['1 ≤ x ≤ 2 or x > 3','x ≤ 1 or 2 ≤ x < 3','1 < x < 2','x > 3'],
          answer: 0,
          explanation: `Roots at 1, 2. Pole at 3. The sign is positive when 1 ≤ x ≤ 2 or x > 3.`,
          subtopic: 'Rational Inequality'
        };
      },
      () => {
        return {
          question: `Solve the system of inequalities: x² - 5x + 6 > 0 and x² - 3x + 2 ≤ 0.`,
          options: ['1 ≤ x < 2','1 < x < 2','x ≥ 1','x < 2'],
          answer: 0,
          explanation: `x²-5x+6 > 0 → x < 2 or x > 3. x²-3x+2 ≤ 0 → 1 ≤ x ≤ 2. Intersection is 1 ≤ x < 2.`,
          subtopic: 'Quadratic Inequality'
        };
      },
      () => {
        return {
          question: `Find the number of integer values of x that satisfy: |x - 3| < 2 and |x - 1| > 1.`,
          options: ['2','3','1','4'],
          answer: 0,
          explanation: `|x-3| < 2 → 1 < x < 5. |x-1| > 1 → x > 2 or x < 0. Intersection: 2 < x < 5. Integers: 3, 4 (count = 2).`,
          subtopic: 'Absolute Value'
        };
      }
    ]
  },

  // ==========================================
  // 14. LOGARITHMS
  // ==========================================
  'logarithms': {
    Easy: [
      () => {
        return {
          question: `Evaluate: log₂(32)`,
          options: ['5','4','6','3'],
          answer: 0,
          explanation: `2⁵ = 32 → log₂(32) = 5.`,
          subtopic: 'Basic Log'
        };
      },
      () => {
        return {
          question: `Simplify: log(75) + log(4) - log(3) (all base 10)`,
          options: ['2','1','3','0'],
          answer: 0,
          explanation: `log(75×4/3) = log(100) = 2.`,
          subtopic: 'Log Properties'
        };
      },
      () => {
        return {
          question: `Solve for x: log₃(x) + log₃(9) = 4.`,
          options: ['9','27','3','81'],
          answer: 0,
          explanation: `log₃(x) + 2 = 4 → log₃(x) = 2 → x = 9.`,
          subtopic: 'Log Equations'
        };
      },
      () => {
        return {
          question: `If log_x(343) = 3, find x.`,
          options: ['7','6','8','9'],
          answer: 0,
          explanation: `x³ = 343 = 7³ → x = 7.`,
          subtopic: 'Basic Log'
        };
      },
      () => {
        return {
          question: `Simplify: log(25) + log(8) - log(2) (all base 10).`,
          options: ['2','1','3','0'],
          answer: 0,
          explanation: `log(25 × 8 / 2) = log(100) = 2.`,
          subtopic: 'Log Properties'
        };
      }
    ],
    Medium: [
      () => {
        return {
          question: `If log(2) = 0.3010 and log(3) = 0.4771, find the value of log(12).`,
          options: ['1.0791','0.7781','1.3802','0.6021'],
          answer: 0,
          explanation: `log(12) = 2log(2) + log(3) = 2(0.3010) + 0.4771 = 1.0791.`,
          subtopic: 'Log Properties'
        };
      },
      () => {
        return {
          question: `Evaluate: log₁₀(0.001)`,
          options: ['-3','3','-2','2'],
          answer: 0,
          explanation: `0.001 = 10⁻³ → log₁₀(0.001) = -3.`,
          subtopic: 'Basic Log'
        };
      },
      () => {
        return {
          question: `If log₂(x) = -3, find the value of x.`,
          options: ['1/8','1/6','8','-8'],
          answer: 0,
          explanation: `x = 2⁻³ = 1/8.`,
          subtopic: 'Log Equations'
        };
      },
      () => {
        return {
          question: `Evaluate: log_b(a) × log_a(b).`,
          options: ['1','0','log(ab)','log(a+b)'],
          answer: 0,
          explanation: `By base change theorem, log_b(a) = log(a)/log(b) and log_a(b) = log(b)/log(a). Product is 1.`,
          subtopic: 'Log Properties'
        };
      },
      () => {
        return {
          question: `If log_y(x) = 3 and log_z(y) = 2, find log_z(x).`,
          options: ['6','5','8','9'],
          answer: 0,
          explanation: `log_z(x) = log_z(y) × log_y(x) = 2 × 3 = 6.`,
          subtopic: 'Log Properties'
        };
      }
    ],
    Hard: [
      () => {
        return {
          question: `If log(2) = 0.3010, find the number of digits in 2²0.`,
          options: ['7','6','8','5'],
          answer: 0,
          explanation: `log(2²0) = 20×0.3010 = 6.020. Digits = ⌊6.020⌋+1 = 7.`,
          subtopic: 'Applications'
        };
      },
      () => {
        return {
          question: `Solve for x: log₂(x + 2) + log₂(x - 2) = 5.`,
          options: ['6','8','4','10'],
          answer: 0,
          explanation: `log₂((x+2)(x-2)) = 5 → x² - 4 = 32 → x² = 36 → x = 6 (since x > 2).`,
          subtopic: 'Log Equations'
        };
      },
      () => {
        return {
          question: `If log_x(y) = 100 and log₂[x] = 10, find the value of y.`,
          options: ['2¹⁰⁰⁰','2¹⁰⁰','2¹⁰','2⁵⁰⁰'],
          answer: 0,
          explanation: `x = 2¹⁰. y = x¹⁰⁰ = (2¹⁰)¹⁰⁰ = 2¹⁰⁰⁰.`,
          subtopic: 'Log Equations'
        };
      },
      () => {
        return {
          question: `Solve for x: log₁₀(x - 3) + log₁₀(x) = 1.`,
          options: ['5','2','-2','10'],
          answer: 0,
          explanation: `x(x-3) = 10 → x²-3x-10 = 0 → (x-5)(x+2)=0. Since x > 3, x = 5.`,
          subtopic: 'Log Equations'
        };
      },
      () => {
        return {
          question: `Find the value of x if: log_x(2) + log_x(4) + log_x(8) = 6.`,
          options: ['2','4','8','3'],
          answer: 0,
          explanation: `log_x(2×4×8) = 6 → log_x(64) = 6 → x⁶ = 64 → x = 2.`,
          subtopic: 'Log Equations'
        };
      }
    ]
  },

  // ==========================================
  // 15. MENSURATION
  // ==========================================
  'mensuration': {
    Easy: [
      () => {
        return {
          question: `The area of a rectangle is 360 cm². If its length is 24 cm, find its perimeter.`,
          options: ['78 cm','60 cm','90 cm','72 cm'],
          answer: 0,
          explanation: `Width = 360/24 = 15 cm. Perimeter = 2(24 + 15) = 78 cm.`,
          subtopic: 'Rectangle'
        };
      },
      () => {
        return {
          question: `Find the area of a circle whose circumference is 88 cm. (π = 22/7)`,
          options: ['616 cm²','154 cm²','308 cm²','528 cm²'],
          answer: 0,
          explanation: `2πr = 88 → r = 14 cm. Area = πr² = (22/7)×196 = 616 cm².`,
          subtopic: 'Circle'
        };
      },
      () => {
        return {
          question: `The volume of a cuboid is 840 cm³. If its length is 10 cm and breadth is 7 cm, find its height.`,
          options: ['12 cm','10 cm','14 cm','8 cm'],
          answer: 0,
          explanation: `V = l×b×h → 840 = 10×7×h → h = 12 cm.`,
          subtopic: 'Cuboid'
        };
      },
      () => {
        return {
          question: `Find the area of a triangle whose sides are 5 cm, 12 cm, and 13 cm.`,
          options: ['30 cm²','60 cm²','25 cm²','65 cm²'],
          answer: 0,
          explanation: `5² + 12² = 13² (right triangle). Area = 1/2 × 5 × 12 = 30 cm².`,
          subtopic: 'Triangle'
        };
      },
      () => {
        return {
          question: `Find the area of a sector of a circle with radius 6 cm and sector angle 60°. (π = 22/7)`,
          options: ['18.86 cm²','15.50 cm²','22.00 cm²','12.30 cm²'],
          answer: 0,
          explanation: `Area = (60/360) × π × 6² = 6π = 18.86 cm².`,
          subtopic: 'Circle'
        };
      }
    ],
    Medium: [
      () => {
        return {
          question: `Find the total surface area of a cube whose side is 8 cm.`,
          options: ['384 cm²','512 cm²','192 cm²','256 cm²'],
          answer: 0,
          explanation: `TSA = 6 × a² = 6 × 64 = 384 cm².`,
          subtopic: 'Cube'
        };
      },
      () => {
        return {
          question: `Find the volume of a cylinder with radius 7 cm and height 15 cm. (π = 22/7)`,
          options: ['2310 cm³','1540 cm³','3080 cm³','770 cm³'],
          answer: 0,
          explanation: `V = πr²h = (22/7) × 49 × 15 = 2310 cm³.`,
          subtopic: 'Cylinder'
        };
      },
      () => {
        return {
          question: `If each side of a square is increased by 50%, by what percentage does its area increase?`,
          options: ['125%','50%','100%','75%'],
          answer: 0,
          explanation: `New Area = (1.5s)² = 2.25s² → increase of 125%.`,
          subtopic: 'Square'
        };
      },
      () => {
        return {
          question: `Find the slant height of a cone whose base radius is 5 cm and height is 12 cm.`,
          options: ['13 cm','11 cm','15 cm','17 cm'],
          answer: 0,
          explanation: `l = √(r² + h²) = √(25 + 144) = 13 cm.`,
          subtopic: 'Cone'
        };
      },
      () => {
        return {
          question: `Find the area of a trapezium with parallel sides of 14 cm and 8 cm, and a height of 6 cm.`,
          options: ['66 cm²','84 cm²','48 cm²','72 cm²'],
          answer: 0,
          explanation: `Area = 1/2 × (a + b) × h = 1/2 × 22 × 6 = 66 cm².`,
          subtopic: 'Trapezium'
        };
      }
    ],
    Hard: [
      () => {
        return {
          question: `Find the surface area of a sphere with a diameter of 14 cm. (π = 22/7)`,
          options: ['616 cm²','154 cm²','308 cm²','1232 cm²'],
          answer: 0,
          explanation: `Radius = 7 cm. SA = 4πr² = 4 × (22/7) × 49 = 616 cm².`,
          subtopic: 'Sphere'
        };
      },
      () => {
        return {
          question: `Find the cost of painting the four walls and ceiling of a room of dimensions 8m × 6m × 4m at the rate of ₹15/m².`,
          options: ['₹2400','₹1800','₹2040','₹1680'],
          answer: 0,
          explanation: `Area = 2h(l+b) + lb = 8(14) + 48 = 112 + 48 = 160 m². Cost = 160 × 15 = ₹2400.`,
          subtopic: 'Cuboid'
        };
      },
      () => {
        return {
          question: `If the radius of a circle is doubled, by what percentage does the area increase?`,
          options: ['300%','200%','100%','400%'],
          answer: 0,
          explanation: `New Area = 4 × Original Area. Increase = 3 × Original = 300%.`,
          subtopic: 'Circle'
        };
      },
      () => {
        return {
          question: `Find the volume of a sphere of radius 3 cm in terms of π.`,
          options: ['36π cm³','18π cm³','54π cm³','12π cm³'],
          answer: 0,
          explanation: `V = (4/3)πr³ = (4/3) × π × 27 = 36π cm³.`,
          subtopic: 'Sphere'
        };
      },
      () => {
        return {
          question: `The area of a square is equal to the area of a circle. Find the ratio of the side of the square to the radius of the circle.`,
          options: ['√π','π','1:√π','1:π'],
          answer: 0,
          explanation: `s² = πr² → s/r = √π.`,
          subtopic: 'Mixed Shapes'
        };
      }
    ]
  },

  // ==========================================
  // 16. STATISTICS
  // ==========================================
  'statistics': {
    Easy: [
      () => {
        return {
          question: `Find the mean of the data set: 4, 7, 13, 16, 21, 25, 30.`,
          options: ['16.57','15.00','16.00','17.00'],
          answer: 0,
          explanation: `Sum = 116. Mean = 116 / 7 ≈ 16.57.`,
          subtopic: 'Mean'
        };
      },
      () => {
        return {
          question: `Find the median of the following observations: 11, 3, 7, 15, 9, 5, 13.`,
          options: ['9','7','11','10'],
          answer: 0,
          explanation: `Sorted: 3, 5, 7, 9, 11, 13, 15. Median (middle) = 9.`,
          subtopic: 'Median'
        };
      },
      () => {
        return {
          question: `Find the mode of the data: 5, 3, 8, 5, 9, 3, 5, 7, 3, 5.`,
          options: ['5','3','8','7'],
          answer: 0,
          explanation: `5 has the highest frequency (occurs 4 times). Mode = 5.`,
          subtopic: 'Mode'
        };
      },
      () => {
        return {
          question: `Find the range of the numbers: 38, 12, 56, 24, 71, 9, 45.`,
          options: ['62','47','59','71'],
          answer: 0,
          explanation: `Range = Max - Min = 71 - 9 = 62.`,
          subtopic: 'Range'
        };
      },
      () => {
        return {
          question: `If the variance of a distribution is 144, find its standard deviation.`,
          options: ['12','14.4','144','6'],
          answer: 0,
          explanation: `SD = √Variance = √144 = 12.`,
          subtopic: 'Standard Deviation'
        };
      }
    ],
    Medium: [
      () => {
        return {
          question: `If mean = 18 and median = 15, find the mode using the empirical relation.`,
          options: ['9','21','12','15'],
          answer: 0,
          explanation: `Mode = 3 Median - 2 Mean = 3(15) - 2(18) = 45 - 36 = 9.`,
          subtopic: 'Empirical Relation'
        };
      },
      () => {
        return {
          question: `Find the median of: 6, 18, 24, 12, 30, 36.`,
          options: ['21','18','24','22'],
          answer: 0,
          explanation: `Sorted: 6, 12, 18, 24, 30, 36. Median = (18 + 24) / 2 = 21.`,
          subtopic: 'Median'
        };
      },
      () => {
        return {
          question: `Find the modal class of the distribution: 0-10 (5), 10-20 (8), 20-30 (15), 30-40 (7), 40-50 (5).`,
          options: ['20-30','10-20','30-40','0-10'],
          answer: 0,
          explanation: `Class 20-30 has the highest frequency (15).`,
          subtopic: 'Modal Class'
        };
      },
      () => {
        return {
          question: `If the mean of five observations x, x+2, x+4, x+6, and x+8 is 11, find the value of x.`,
          options: ['7','5','9','6'],
          answer: 0,
          explanation: `Mean = (5x + 20)/5 = x + 4 = 11 → x = 7.`,
          subtopic: 'Mean'
        };
      },
      () => {
        return {
          question: `Find the median of the following observations: 15, 35, 18, 26, 19, 25, 29, 20.`,
          options: ['22.5','20','25','22'],
          answer: 0,
          explanation: `Sorted: 15, 18, 19, 20, 25, 26, 29, 35. Median = (20 + 25) / 2 = 22.5.`,
          subtopic: 'Median'
        };
      }
    ],
    Hard: [
      () => {
        return {
          question: `Find the variance of: 2, 4, 6, 8, 10.`,
          options: ['8','4','6','10'],
          answer: 0,
          explanation: `Mean = 6. Variance = (16 + 4 + 0 + 4 + 16) / 5 = 8.`,
          subtopic: 'Variance'
        };
      },
      () => {
        return {
          question: `Find the standard deviation of: 2, 4, 6, 8, 10.`,
          options: ['2√2','4','√6','2'],
          answer: 0,
          explanation: `Variance = 8. SD = √8 = 2√2.`,
          subtopic: 'Standard Deviation'
        };
      },
      () => {
        return {
          question: `If each observation in a data set is multiplied by 3, the mean becomes 45. Find the original mean.`,
          options: ['15','135','12','48'],
          answer: 0,
          explanation: `Original Mean = 45 / 3 = 15.`,
          subtopic: 'Mean'
        };
      },
      () => {
        return {
          question: `Find the coefficient of variation if the mean of a distribution is 50 and the standard deviation is 10.`,
          options: ['20%','15%','25%','10%'],
          answer: 0,
          explanation: `CV = (10 / 50) × 100 = 20%.`,
          subtopic: 'Coefficient of Variation'
        };
      },
      () => {
        return {
          question: `The mean marks of 100 students were found to be 40. Later on, it was discovered that a score of 53 was misread as 83. Find the corrected mean marks.`,
          options: ['39.7','40.3','39.5','41.0'],
          answer: 0,
          explanation: `Sum = 4000. Corrected sum = 4000 - 83 + 53 = 3970. Corrected mean = 39.7.`,
          subtopic: 'Mean'
        };
      }
    ]
  }
};

// ─── Combinatorics helpers (used by HARD_POOL & EXPERT_POOL) ─────────────────
function fact(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
function nCr(n, r) { if (r < 0 || r > n) return 0; return Math.round(fact(n) / (fact(r) * fact(n - r))); }

// ════════════════════════════════════════════════════════════════════════════
//  HARD QUESTIONS POOL  — genuine multi-step TCS NQT hard patterns
//  Each template requires 3+ calculation steps and a non-obvious approach.
// ════════════════════════════════════════════════════════════════════════════
const HARD_POOL = {
  'number-system': [
    () => { // Trailing zeros in n!
      const n = getRandomInt(4,10)*20 + getRandomInt(0,19);
      let z=0,p=5,parts=[];
      while(p<=n){const t=Math.floor(n/p);z+=t;parts.push(`⌊${n}/${p}⌋=${t}`);p*=5;}
      return{question:`How many trailing zeros does ${n}! contain?`,options:makeOptions(z,2,8),answer:0,
        explanation:`Count factors of 5: ${parts.join(' + ')} = ${z}.`,subtopic:'Trailing Zeros'};},
    () => { // Fermat's Little Theorem
      const primes=[7,11,13,17,19],mod=pickRandomArray(primes);
      const base=getRandomInt(2,mod-1),exp=getRandomInt(60,250);
      const rem=powerMod(base,exp,mod),period=mod-1,red=((exp%period)||period);
      return{question:`Find the remainder when ${base}^${exp} is divided by ${mod}.`,options:makeOptions(rem,1,5),answer:0,
        explanation:`Fermat's LT: ${base}^${period}≡1(mod ${mod}). ${exp} mod ${period}=${red}. Ans=${base}^${red} mod ${mod}=${rem}.`,subtopic:'Modular Arithmetic'};},
    () => { // Even factors
      const a=getRandomInt(2,4),b=getRandomInt(1,3),c=getRandomInt(1,2);
      const N=Math.pow(2,a)*Math.pow(3,b)*Math.pow(5,c);
      const total=(a+1)*(b+1)*(c+1),odd=(b+1)*(c+1),even=total-odd;
      return{question:`How many even factors does ${N} have?`,options:makeOptions(even,2,8),answer:0,
        explanation:`${N}=2^${a}·3^${b}·5^${c}. Total=${total}. Odd=${odd}. Even=${total}-${odd}=${even}.`,subtopic:'Factors'};},
    () => { // Smallest leaving (d−1) from three divisors
      const d1=getRandomInt(4,6),d2=d1+getRandomInt(2,4),d3=d2+getRandomInt(2,4);
      const L=lcmThree(d1,d2,d3),n=L-1;
      return{question:`Find the smallest number leaving remainders ${d1-1}, ${d2-1}, ${d3-1} when divided by ${d1}, ${d2}, ${d3}.`,
        options:makeOptions(n,5,25),answer:0,
        explanation:`N+1 divisible by all three. N+1=LCM(${d1},${d2},${d3})=${L}. N=${n}.`,subtopic:'LCM & Remainders'};},
    () => { // HCF × LCM = product
      const h=getRandomInt(3,8),x=getRandomInt(2,5),y=getRandomInt(7,14);
      const a=h*x,b=h*y,L=lcm(a,b);
      return{question:`HCF and LCM of two numbers are ${h} and ${L}. If one number is ${a}, find the other.`,
        options:makeOptions(b,5,25),answer:0,
        explanation:`Product=HCF×LCM=${h}×${L}. Other=${h*L}÷${a}=${b}.`,subtopic:'HCF & LCM'};},
    () => { // Inclusion-exclusion
      const N=getRandomInt(10,15)*10,a=getRandomInt(3,5),b=getRandomInt(6,9);
      const L=lcm(a,b),cA=Math.floor(N/a),cB=Math.floor(N/b),cBoth=Math.floor(N/L);
      const ans=N-cA-cB+cBoth;
      return{question:`How many integers from 1 to ${N} are divisible by neither ${a} nor ${b}?`,
        options:makeOptions(ans,5,20),answer:0,
        explanation:`${N}−${cA}−${cB}+${cBoth}=${ans} (Inclusion-Exclusion).`,subtopic:'Inclusion-Exclusion'};},
    () => { // Highest power of prime in n!
      const n=getRandomInt(20,50),p=pickRandomArray([2,3,5]);
      let pw=0,pk=p,steps=[];
      while(pk<=n){const t=Math.floor(n/pk);pw+=t;steps.push(`⌊${n}/${pk}⌋=${t}`);pk*=p;}
      return{question:`Highest power of ${p} dividing ${n}!?`,options:makeOptions(pw,2,8),answer:0,
        explanation:`Legendre: ${steps.join('+')}=${pw}.`,subtopic:'Factorials & Primes'};},
    () => { // 4-digit multiples of LCM
      const a=getRandomInt(4,7),b=getRandomInt(8,13),L=lcm(a,b);
      const count=Math.floor(9999/L)-Math.floor(999/L);
      return{question:`How many 4-digit numbers are divisible by both ${a} and ${b}?`,
        options:makeOptions(count,3,12),answer:0,
        explanation:`Divisible by LCM(${a},${b})=${L}. ⌊9999/${L}⌋−⌊999/${L}⌋=${count}.`,subtopic:'Divisibility'};},
  ],
  'ratio-proportion': [
    () => { // Repeated replacement
      const total=getRandomInt(5,10)*10,rem=getRandomInt(2,4)*10,n=getRandomInt(2,3);
      const ml=Math.round(total*Math.pow((total-rem)/total,n)),w=total-ml,g=gcd(ml,w);
      return{question:`A ${total}L vessel has pure milk. ${rem}L is removed and replaced with water — done ${n} times. Milk:Water ratio?`,
        options:[`${ml/g}:${w/g}`,`${ml/g+1}:${w/g}`,`${ml/g}:${w/g+1}`,`${ml/g-1}:${w/g+1}`],answer:0,
        explanation:`Milk=${total}×((${total-rem})/${total})^${n}≈${ml}. Ratio=${ml/g}:${w/g}.`,subtopic:'Mixture Replacement'};},
    () => { // Compound ratio A:B:C
      const a=getRandomInt(2,4),b=getRandomInt(3,6),c=getRandomInt(2,5),d=getRandomInt(4,7);
      const L=lcm(b,c),A=a*(L/b),B=L,C=d*(L/c),g=gcd(gcd(A,B),C);
      return{question:`A:B=${a}:${b} and B:C=${c}:${d}. Find A:C.`,
        options:[`${A/g}:${C/g}`,`${a}:${d}`,`${A/g+1}:${C/g}`,`${A/g}:${C/g+1}`],answer:0,
        explanation:`LCM(${b},${c})=${L}. A:B:C=${A/g}:${B/g}:${C/g}. A:C=${A/g}:${C/g}.`,subtopic:'Compound Ratio'};},
    () => { // Partnership
      const p1=getRandomInt(3,8)*1000,t1=getRandomInt(6,12),p2=getRandomInt(4,9)*1000,t2=getRandomInt(4,10),profit=getRandomInt(5,15)*1000;
      const wA=p1*t1,wB=p2*t2,g2=gcd(wA,wB),shareB=Math.round(wB/(wA+wB)*profit);
      return{question:`A invested ₹${p1} for ${t1} months, B invested ₹${p2} for ${t2} months. Total profit ₹${profit}. B's share?`,
        options:makeOptions(shareB,500,2000),answer:0,
        explanation:`Ratio=${wA/g2}:${wB/g2}. B's share=${wB/g2}/${(wA+wB)/g2}×${profit}=₹${shareB}.`,subtopic:'Partnership'};},
    () => { // Alligation
      const p1=getRandomInt(20,50),p2=getRandomInt(60,100),pm=getRandomInt(p1+5,p2-5);
      const r1=p2-pm,r2=pm-p1,g=gcd(r1,r2);
      return{question:`Mix ₹${p1}/kg with ₹${p2}/kg to get ₹${pm}/kg blend. Required ratio?`,
        options:[`${r1/g}:${r2/g}`,`${r2/g}:${r1/g}`,`${r1/g+1}:${r2/g}`,`${p1}:${p2}`],answer:0,
        explanation:`Alligation:(${p2}−${pm}):(${pm}−${p1})=${r1}:${r2}=${r1/g}:${r2/g}.`,subtopic:'Alligation'};},
    () => { // Mixture combination
      const v1=getRandomInt(3,7)*10,c1=getRandomInt(20,45),v2=getRandomInt(3,7)*10,c2=getRandomInt(55,80);
      const mt=Math.round((v1*c1+v2*c2)/100),tot=v1+v2,g=gcd(mt,tot-mt);
      return{question:`${v1}L vessel (${c1}% milk) + ${v2}L vessel (${c2}% milk) mixed. Milk:Water ratio?`,
        options:[`${mt/g}:${(tot-mt)/g}`,`${mt/g+1}:${(tot-mt)/g}`,`${mt/g}:${(tot-mt)/g+1}`,`${c1}:${c2}`],answer:0,
        explanation:`Milk=${mt}L,Water=${tot-mt}L. Ratio=${mt/g}:${(tot-mt)/g}.`,subtopic:'Mixture'};},
    () => { // Inverse proportion
      const m1=getRandomInt(10,20),d1=getRandomInt(12,20),d2=getRandomInt(8,18),m2=Math.round(m1*d1/d2);
      return{question:`${m1} men build a wall in ${d1} days. How many men to finish it in ${d2} days?`,
        options:makeOptions(m2,2,8),answer:0,
        explanation:`Total=${m1}×${d1}=${m1*d1} man-days. Men=${m1*d1}÷${d2}=${m2}.`,subtopic:'Inverse Proportion'};},
  ],
  'averages': [
    () => { // Batting average drops
      const avg=getRandomInt(40,65),inn=getRandomInt(15,30),score=getRandomInt(2,avg-20);
      const newAvg=Math.round(((avg*inn+score)/(inn+1))*10)/10,drop=Math.round((avg-newAvg)*10)/10;
      return{question:`Batsman's average after ${inn} innings is ${avg}. He scores ${score} next. Average fall?`,
        options:makeOptions(drop,1,5),answer:0,
        explanation:`New avg=(${avg*inn}+${score})/${inn+1}=${newAvg}. Drop=${avg}−${newAvg}=${drop}.`,subtopic:'Averages'};},
    () => { // Replacement in group
      const n=getRandomInt(8,20),avg=getRandomInt(30,60),oldM=getRandomInt(10,30),newAvg=avg+getRandomInt(2,6);
      const newM=oldM+n*(newAvg-avg);
      return{question:`${n} people avg age ${avg}. Person aged ${oldM} replaced → avg rises to ${newAvg}. New person's age?`,
        options:makeOptions(newM,3,12),answer:0,
        explanation:`Increase=${n}×(${newAvg}−${avg})=${n*(newAvg-avg)}. New person=${oldM}+${n*(newAvg-avg)}=${newM}.`,subtopic:'Average — Replacement'};},
    () => { // Combined average
      const n1=getRandomInt(10,20),m1=getRandomInt(40,60),n2=getRandomInt(15,25),m2=getRandomInt(65,85);
      const combined=Math.round((n1*m1+n2*m2)/(n1+n2));
      return{question:`Group A: ${n1} members, avg ${m1}. Group B: ${n2} members, avg ${m2}. Combined avg?`,
        options:makeOptions(combined,2,8),answer:0,
        explanation:`(${n1}×${m1}+${n2}×${m2})/${n1+n2}=${n1*m1+n2*m2}/${n1+n2}=${combined}.`,subtopic:'Weighted Average'};},
    () => { // Score needed to hit target avg
      const avg=getRandomInt(55,75),inn=getRandomInt(10,20),target=avg+getRandomInt(3,8);
      const needed=target*(inn+1)-avg*inn;
      return{question:`Cricketer's avg after ${inn} innings: ${avg}. Score needed next to reach avg ${target}?`,
        options:makeOptions(needed,10,30),answer:0,
        explanation:`Needed=${target}×${inn+1}−${avg}×${inn}=${target*(inn+1)}−${avg*inn}=${needed}.`,subtopic:'Target Average'};},
    () => { // Corrected average
      const n=getRandomInt(20,40),avg=getRandomInt(40,70),wrong=getRandomInt(20,avg-10),correct=wrong+getRandomInt(15,40);
      const newAvg=Math.round(((avg*n-wrong+correct)/n)*100)/100;
      return{question:`Average of ${n} numbers is ${avg}. Number ${wrong} was misread; actual is ${correct}. Correct average?`,
        options:makeOptions(Math.round(newAvg),1,4),answer:0,
        explanation:`Correct sum=${avg*n}−${wrong}+${correct}=${avg*n-wrong+correct}. Avg=${newAvg}.`,subtopic:'Corrected Average'};},
    () => { // Weighted average of marks
      const n1=getRandomInt(3,6),p1=getRandomInt(55,70),n2=getRandomInt(4,8),p2=getRandomInt(75,90);
      const wa=Math.round((n1*p1+n2*p2)/(n1+n2));
      return{question:`${n1} students averaged ${p1}% and ${n2} students averaged ${p2}%. Overall average?`,
        options:makeOptions(wa,2,6),answer:0,
        explanation:`(${n1}×${p1}+${n2}×${p2})/${n1+n2}=${wa}%.`,subtopic:'Weighted Average'};},
  ],
  'ages': [
    () => { // Ratio at two time points
      const pa=getRandomInt(25,40),pb=getRandomInt(15,pa-5),years=getRandomInt(5,15);
      const g1=gcd(pa,pb),g2=gcd(pa+years,pb+years);
      return{question:`A & B's present ages ratio is ${pa/g1}:${pb/g1}. ${years} years hence ratio is ${(pa+years)/g2}:${(pb+years)/g2}. A's present age?`,
        options:makeOptions(pa,3,10),answer:0,
        explanation:`Let ages=${pa/g1}k,${pb/g1}k. Solve (${pa/g1}k+${years})/(${pb/g1}k+${years})=${(pa+years)/g2}/${(pb+years)/g2}. k=${g1}. A=${pa}.`,subtopic:'Age Ratios'};},
    () => { // Sum and difference
      const diffAge=getRandomInt(1,9)*2,sumAge=getRandomInt(25,40)*2;
      const older=(sumAge+diffAge)/2,younger=(sumAge-diffAge)/2;
      return{question:`Sum of two siblings' ages = ${sumAge}, difference = ${diffAge}. Elder sibling's age?`,
        options:makeOptions(older,3,10),answer:0,
        explanation:`Elder=(Sum+Diff)/2=(${sumAge}+${diffAge})/2=${older}.`,subtopic:'Sum & Difference'};},
    () => { // Father-son future ratio
      const f=getRandomInt(35,50),s=getRandomInt(8,20),yrs=getRandomInt(5,15);
      const ff=f+yrs,sf=s+yrs,g=gcd(ff,sf);
      return{question:`Father is ${f}, son is ${s}. Ratio of their ages after ${yrs} years?`,
        options:[`${ff/g}:${sf/g}`,`${f}:${s}`,`${ff/g+1}:${sf/g}`,`${ff}:${sf}`],answer:0,
        explanation:`After ${yrs}y: ${ff}:${sf}=${ff/g}:${sf/g}.`,subtopic:'Father-Son Ages'};},
    () => { // Age as multiple
      const multiple=getRandomInt(2,4),basek=multiple-1,multiplier=getRandomInt(3,7);
      const k=basek*multiplier,age=multiple*multiplier;
      return{question:`${k} years ago a person was 1/${multiple} of their current age. Current age?`,
        options:makeOptions(age,3,12),answer:0,
        explanation:`x−${k}=x/${multiple} → x(${multiple}−1)/${multiple}=${k} → x=${age}.`,subtopic:'Age as Fraction'};},
    () => { // Three people AP
      const a=getRandomInt(20,35),b=a+getRandomInt(3,8),c=b+getRandomInt(3,8);
      const avg=Math.round((a+b+c)/3);
      return{question:`Three people's ages are in AP. Youngest ${a}, eldest ${c}. Average age?`,
        options:makeOptions(avg,2,8),answer:0,
        explanation:`Sum=${a}+${b}+${c}=${a+b+c}. Average=${avg}. (Middle term=average in AP.)`,subtopic:'AP Ages'};},
    () => { // Combined family average
      const m=getRandomInt(30,45),c1=getRandomInt(5,12),c2=getRandomInt(c1+1,16);
      const avg=Math.round((m+c1+c2)/3);
      return{question:`Mother is ${m}, children are ${c1} and ${c2}. Family's average age?`,
        options:makeOptions(avg,2,6),answer:0,
        explanation:`Total=${m+c1+c2}. Average=${avg}.`,subtopic:'Family Average Age'};},
  ],
  'percentages': [
    () => { // Net successive change
      const p1=getRandomInt(10,30),p2=getRandomInt(10,25);
      const actual=Math.round((100+p1)*(100-p2)/100-100);
      return{question:`A number is increased by ${p1}% then decreased by ${p2}%. Net % change?`,
        options:[`${actual>=0?'+':''}${actual}%`,`${p1-p2}%`,`${Math.round((p1+p2)/2)}%`,`${actual+2}%`],answer:0,
        explanation:`(1+${p1}/100)(1−${p2}/100)−1=${actual}%.`,subtopic:'Successive Percentages'};},
    () => { // Income-expenditure-savings
      const incIncrease=getRandomInt(15,30),expIncrease=getRandomInt(20,40),savPct=getRandomInt(20,40);
      const expPct=100-savPct,newInc=100*(1+incIncrease/100),newExp=expPct*(1+expIncrease/100);
      const newSav=newInc-newExp,savChange=Math.round(((newSav-savPct)/savPct)*100);
      return{question:`Income increases ${incIncrease}%, expenditure increases ${expIncrease}%. Savings are ${savPct}% of income. % change in savings?`,
        options:[`${savChange}%`,`${incIncrease-expIncrease}%`,`${savChange-5}%`,`${savChange+5}%`],answer:0,
        explanation:`New sav=${newSav.toFixed(1)}, old=${savPct}. Change≈${savChange}%.`,subtopic:'Income-Expenditure'};},
    () => { // Population growth
      const pop=getRandomInt(50,200)*1000,rate=getRandomInt(5,15),years=3;
      const final=Math.round(pop*Math.pow(1+rate/100,years));
      return{question:`Population ${pop.toLocaleString('en-IN')} grows at ${rate}%/year. After ${years} years?`,
        options:makeOptions(final,5000,50000),answer:0,
        explanation:`${pop}×(1.${rate<10?'0'+rate:rate})^3≈${final}.`,subtopic:'Population Growth'};},
    () => { // Reverse percentage
      const pct=getRandomInt(15,40),finalVal=getRandomInt(5,15)*100;
      const original=Math.round(finalVal/(1+pct/100));
      return{question:`After ${pct}% increase, value becomes ${finalVal}. Original value?`,
        options:makeOptions(original,20,80),answer:0,
        explanation:`Original=${finalVal}÷(1+${pct}/100)=${finalVal}×100/${100+pct}=${original}.`,subtopic:'Reverse Percentage'};},
    () => { // Shopkeeper markup + discount
      const markup=getRandomInt(25,50),discount=getRandomInt(10,25);
      const profit=Math.round(((100+markup)*(100-discount)/100-100)*10)/10;
      return{question:`Goods marked ${markup}% above CP, sold at ${discount}% discount. Net profit/loss %?`,
        options:[`${profit>0?'Profit':'Loss'} ${Math.abs(profit)}%`,`${markup-discount}%`,`${profit>0?'Profit':'Loss'} ${(Math.abs(profit)+2)}%`,`${markup-discount-2}%`],
        answer:0,explanation:`(${100+markup})×(${100-discount})/100−100=${profit}%.`,subtopic:'Marked Price & Discount'};},
    () => { // Election margin
      const totalVotes=getRandomInt(3,8)*10000,winnerPct=getRandomInt(55,70);
      const winnerV=Math.round(totalVotes*winnerPct/100),margin=winnerV-(totalVotes-winnerV);
      const marginPct=winnerPct-(100-winnerPct);
      return{question:`Winner got ${winnerPct}% votes in election and won by ${margin} votes. Total votes polled?`,
        options:makeOptions(totalVotes,2000,10000),answer:0,
        explanation:`Margin%=${marginPct}%. ${marginPct}%=${margin}. Total=${margin*100/marginPct}=${totalVotes}.`,subtopic:'Election Problems'};},
  ],
  'profit-loss': [
    () => { // n at price of m
      const n=getRandomInt(8,15),m=getRandomInt(n+1,n+8),profit=Math.round(((m-n)/n)*100);
      return{question:`Shopkeeper sells ${n} articles at CP of ${m} articles. Profit %?`,
        options:makeOptions(profit,3,10),answer:0,
        explanation:`Profit%=(${m}−${n})/${n}×100=${profit}%.`,subtopic:'Articles Profit'};},
    () => { // Dishonest weights
      const actual=getRandomInt(800,950);
      const truePct=Math.round(((1000-actual)/actual)*100);
      return{question:`Shopkeeper sells at CP but uses ${actual}g instead of 1kg. True profit%?`,
        options:makeOptions(truePct,3,10),answer:0,
        explanation:`Profit%=(${1000-actual}/${actual})×100=${truePct}%.`,subtopic:'Dishonest Weights'};},
    () => { // Same SP: X% profit and X% loss
      const x=getRandomInt(10,25),loss=Math.round(x*x/100*10)/10;
      return{question:`Two articles each sold at same SP — one at ${x}% profit, one at ${x}% loss. Net result?`,
        options:[`Loss ${loss}%`,`Profit ${x}%`,`No profit/loss`,`Loss ${(loss+2).toFixed(1)}%`],answer:0,
        explanation:`Net loss=(x²/100)%=(${x}²/100)=${loss}%. Always a loss.`,subtopic:'Same SP Trade'};},
    () => { // A→B→C chain
      const cpA=getRandomInt(300,700),pA=getRandomInt(10,25),pB=getRandomInt(10,20);
      const spB=Math.round(cpA*(1+pA/100)*(1+pB/100));
      return{question:`A sold to B at ${pA}% profit, B sold to C at ${pB}% profit. C paid ₹${spB}. A's CP?`,
        options:makeOptions(cpA,50,200),answer:0,
        explanation:`C paid=CP_A×${((100+pA)/100).toFixed(2)}×${((100+pB)/100).toFixed(2)}=${spB}. CP_A=${cpA}.`,subtopic:'Chain Selling'};},
    () => { // Profit% + discount%
      const cp=getRandomInt(200,600),markup=Math.round((getRandomInt(30,50)/100)*cp)+cp;
      const sp=getRandomInt(Math.round(cp*1.05),markup-1);
      const profit=Math.round((sp-cp)/cp*100),disc=Math.round((markup-sp)/markup*100);
      return{question:`CP=₹${cp}, MP=₹${markup}, sold at ${disc}% discount. Profit %?`,
        options:makeOptions(profit,3,10),answer:0,
        explanation:`SP=${markup}×(1−${disc}/100)=${sp}. Profit=(${sp}−${cp})/${cp}×100=${profit}%.`,subtopic:'Profit & Discount'};},
    () => { // Break-even
      const fixed=getRandomInt(5,15)*1000,varCost=getRandomInt(40,80),sp=getRandomInt(varCost+20,varCost+60);
      const be=Math.ceil(fixed/(sp-varCost));
      return{question:`Fixed cost ₹${fixed}, variable ₹${varCost}/unit, selling price ₹${sp}. Break-even units?`,
        options:makeOptions(be,50,300),answer:0,
        explanation:`Contribution=${sp}−${varCost}=₹${sp-varCost}. Break-even=${fixed}/${sp-varCost}=${be}.`,subtopic:'Break-even'};},
  ],
  'simple-interest': [
    () => { // Split principal
      const total=getRandomInt(5,12)*1000,r1=getRandomInt(4,8),r2=r1+getRandomInt(2,5),t=getRandomInt(2,4);
      const P1=getRandomInt(2,8)*1000,P2=total-P1,totalI=Math.round((P1*r1+P2*r2)*t/100);
      return{question:`₹${total} split and invested at ${r1}% and ${r2}% SI for ${t} years. Total interest ₹${totalI}. Larger part?`,
        options:makeOptions(Math.max(P1,P2),500,2000),answer:0,
        explanation:`Part at ${r1}%=₹${P1}, at ${r2}%=₹${P2}. Verify: interest=₹${totalI}. Larger part=₹${Math.max(P1,P2)}.`,subtopic:'Split Principal'};},
    () => { // Double→triple
      const r=getRandomInt(5,15),td=Math.round(100/r),tt=Math.round(200/r);
      return{question:`Sum doubles in ${td} years at SI. When will it triple?`,
        options:makeOptions(tt,3,10),answer:0,
        explanation:`Rate=${r}%. Triple needs 200% SI: time=200/${r}=${tt} years.`,subtopic:'Doubling & Tripling'};},
    () => { // Find rate from amount
      const P=getRandomInt(5,15)*1000,t=getRandomInt(2,5),r=getRandomInt(5,12);
      const SI=Math.round(P*r*t/100),A=P+SI;
      return{question:`₹${P} amounts to ₹${A} in ${t} years at SI. Annual rate?`,
        options:makeOptions(r,1,4),answer:0,
        explanation:`SI=${A}−${P}=₹${SI}. Rate=(${SI}×100)/(${P}×${t})=${r}%.`,subtopic:'Finding Rate'};},
    () => { // Difference in interest
      const P=getRandomInt(5,12)*1000,r1=getRandomInt(5,10),r2=r1+getRandomInt(2,5),t=getRandomInt(3,6);
      const diff=Math.round(P*(r2-r1)*t/100);
      return{question:`₹${P} invested at ${r1}% SI and another ₹${P} at ${r2}% SI for ${t} years. Difference in interest?`,
        options:makeOptions(diff,100,500),answer:0,
        explanation:`Diff=${P}×(${r2}−${r1})×${t}/100=₹${diff}.`,subtopic:'SI Comparison'};},
    () => { // Installment repayment
      const loan=getRandomInt(5,12)*1000,r=getRandomInt(5,10),t=2;
      const install=Math.round(loan*(1+r*t/100)/t);
      return{question:`Loan ₹${loan} at ${r}% SI repaid in ${t} equal annual installments. Each installment?`,
        options:makeOptions(install,200,800),answer:0,
        explanation:`Amount=₹${Math.round(loan*(1+r*t/100))}. Each installment≈₹${install}.`,subtopic:'SI Installments'};},
    () => { // Back-calculate principal
      const A=getRandomInt(8,18)*1000,r=getRandomInt(5,12),t=getRandomInt(2,5);
      const P=Math.round(A*100/(100+r*t));
      return{question:`A sum amounts to ₹${A} in ${t} years at ${r}% SI. Find the principal.`,
        options:makeOptions(P,500,2000),answer:0,
        explanation:`P=A×100/(100+r×t)=${A}×100/${100+r*t}=₹${P}.`,subtopic:'Finding Principal'};},
  ],
  'compound-interest': [
    () => { // CI-SI difference 2 years
      const P=getRandomInt(5,20)*1000,r=getRandomInt(5,12);
      const diff=Math.round(P*r*r/10000);
      return{question:`Difference between CI and SI on ₹${P} at ${r}% for 2 years?`,
        options:makeOptions(diff,10,100),answer:0,
        explanation:`Diff=P×(r/100)²=₹${P}×(${r}/100)²=₹${diff}.`,subtopic:'CI vs SI'};},
    () => { // Doubling → 8× time
      const t=getRandomInt(3,8),t8=3*t;
      return{question:`At CI, a sum doubles in ${t} years. When does it become 8 times?`,
        options:makeOptions(t8,3,8),answer:0,
        explanation:`2=(1+r)^${t}. 8=2^3=(1+r)^(3×${t}). Ans=${t8} years.`,subtopic:'Doubling Period'};},
    () => { // Find rate from consecutive-year CI
      const P=getRandomInt(5,12)*1000,r=getRandomInt(8,15);
      const ci1=Math.round(P*r/100),ci2=Math.round(P*r/100*(1+r/100));
      return{question:`CI on a sum for year 1 = ₹${ci1} and year 2 = ₹${ci2}. Rate of interest?`,
        options:makeOptions(r,2,6),answer:0,
        explanation:`Rate=(CI₂−CI₁)/CI₁×100=(${ci2}−${ci1})/${ci1}×100=${r}%.`,subtopic:'Finding Rate'};},
    () => { // Population decay
      const pop=getRandomInt(50,200)*1000,decRate=getRandomInt(5,12),yrs=3;
      const final=Math.round(pop*Math.pow(1-decRate/100,yrs));
      return{question:`City population ${pop.toLocaleString('en-IN')}. Decreases ${decRate}%/year. After ${yrs} years?`,
        options:makeOptions(final,5000,50000),answer:0,
        explanation:`${pop}×(1−${decRate}/100)^3≈${final}.`,subtopic:'Population Decay'};},
    () => { // Half-yearly vs annual difference
      const P=getRandomInt(5,15)*1000,r=getRandomInt(8,16),t=2;
      const ciA=Math.round(P*(Math.pow(1+r/100,t)-1)),ciH=Math.round(P*(Math.pow(1+r/200,2*t)-1));
      const diff=ciH-ciA;
      return{question:`Difference in CI on ₹${P} at ${r}% for ${t} years: annual vs half-yearly?`,
        options:makeOptions(diff,10,200),answer:0,
        explanation:`Annual CI=₹${ciA}. Half-yearly CI=₹${ciH}. Diff=₹${diff}.`,subtopic:'Compounding Frequency'};},
    () => { // Equal installments
      const loan=getRandomInt(8,15)*1000,r=getRandomInt(8,15),factor=1+r/100;
      const x=Math.round(loan*factor*factor/(factor+1));
      return{question:`Loan ₹${loan} at ${r}% CI repaid in 2 equal annual installments. Each installment?`,
        options:makeOptions(x,500,2000),answer:0,
        explanation:`x/(1+r/100)+x/(1+r/100)²=${loan}. x≈₹${x}.`,subtopic:'CI Installments'};},
  ],
  'time-work': [
    () => { // Alternate day work
      const a=getRandomInt(6,12),b=getRandomInt(8,15);
      const twoDayWork=1/a+1/b,cycles=Math.floor(1/twoDayWork),rem=1-cycles*twoDayWork;
      const totalDays=cycles*2+(rem<=1/a?1:2);
      return{question:`A completes in ${a} days, B in ${b} days. They alternate (A first). Total days?`,
        options:makeOptions(totalDays,1,4),answer:0,
        explanation:`Work/2 days=1/${a}+1/${b}. Full cycles=${cycles}. Total=${totalDays} days.`,subtopic:'Alternate Work'};},
    () => { // A starts, B joins later
      const a=getRandomInt(10,20),b=getRandomInt(12,25),k=getRandomInt(3,6);
      const rem=1-k/a,together=rem/(1/a+1/b);
      const total=Math.round((k+together)*10)/10;
      return{question:`A finishes in ${a} days, B in ${b} days. A works ${k} days alone, then B joins. Total days?`,
        options:makeOptions(Math.round(total),2,6),answer:0,
        explanation:`After ${k} days remaining=1−${k}/${a}=${rem.toFixed(2)}. Together time≈${together.toFixed(1)}. Total≈${Math.round(total)}.`,subtopic:'Joining Work'};},
    () => { // Pipe + leak
      const f1=getRandomInt(3,8),f2=getRandomInt(5,12),leak=getRandomInt(8,18);
      const net=1/f1+1/f2-1/leak,total=Math.round(1/net);
      return{question:`Pipe A fills in ${f1}h, B in ${f2}h. Leak empties in ${leak}h. All open — tank full in?`,
        options:makeOptions(total,1,5),answer:0,
        explanation:`Net=1/${f1}+1/${f2}−1/${leak}=${net.toFixed(4)}. Time=${total}h.`,subtopic:'Pipes & Leaks'};},
    () => { // Efficiency + wages
      const dA=getRandomInt(10,20),dB=getRandomInt(12,24),dC=getRandomInt(15,30),wage=getRandomInt(5,15)*1000;
      const wA=1/dA,wB=1/dB,wC=1/dC,tot=wA+wB+wC;
      const shareA=Math.round(wA/tot*wage);
      return{question:`A,B,C finish in ${dA},${dB},${dC} days. They work 1 day for ₹${wage} combined. A's share?`,
        options:makeOptions(shareA,200,1000),answer:0,
        explanation:`Ratio ∝ rate. A's rate=1/${dA}. A's share≈₹${shareA}.`,subtopic:'Work & Wages'};},
    () => { // Men-women efficiency
      const mRate=getRandomInt(2,4),wRate=getRandomInt(3,5),men=getRandomInt(4,8),women=getRandomInt(3,6),days=getRandomInt(5,10);
      const totalWork=(men/mRate+women/wRate)*days,newMen=getRandomInt(5,10),newDays=Math.round(totalWork/(newMen/mRate));
      return{question:`${men} men & ${women} women complete a job in ${days} days. ${mRate} men = ${wRate} women in efficiency. ${newMen} men alone take?`,
        options:makeOptions(newDays,2,8),answer:0,
        explanation:`Total work=${totalWork.toFixed(1)} man-equivalents. ${newMen} men take≈${newDays} days.`,subtopic:'Men-Women Efficiency'};},
    () => { // Fraction of work, fraction of team
      const workers=getRandomInt(10,20),part=getRandomInt(2,4),initDays=getRandomInt(5,10);
      const totalWork=workers*initDays*part,remaining=workers*initDays*(part-1),newW=Math.round(workers*getRandomInt(3,7)/part),dR=Math.round(remaining/newW);
      return{question:`${workers} workers do 1/${part} of a job in ${initDays} days. ${newW} workers finish the remaining ${part-1}/${part} in?`,
        options:makeOptions(dR,3,12),answer:0,
        explanation:`Total=${totalWork} person-days. Remaining=${remaining}. Time=${remaining}/${newW}=${dR} days.`,subtopic:'Partial Work'};},
  ],
  'time-distance': [
    () => { // Meeting distance
      const total=getRandomInt(200,400),s1=getRandomInt(40,80),s2=getRandomInt(30,70);
      const meet=Math.round(total*s1/(s1+s2));
      return{question:`Trains from A & B (${total}km apart) at ${s1} & ${s2} km/h. Meeting distance from A?`,
        options:makeOptions(meet,10,40),answer:0,
        explanation:`Distance from A=${s1}×${total}/(${s1}+${s2})=${meet}km.`,subtopic:'Meeting Distance'};},
    () => { // Average speed round trip
      const d=getRandomInt(60,200),s1=getRandomInt(30,60),s2=getRandomInt(40,80);
      const avgS=Math.round(2*s1*s2/(s1+s2));
      return{question:`${d}km at ${s1}km/h, return at ${s2}km/h. Average speed?`,
        options:[`${avgS}km/h`,`${Math.round((s1+s2)/2)}km/h`,`${avgS+2}km/h`,`${avgS-2}km/h`],answer:0,
        explanation:`Avg=2ab/(a+b)=2×${s1}×${s2}/${s1+s2}=${avgS}km/h.`,subtopic:'Average Speed'};},
    () => { // Speed increase → time saved
      const s=getRandomInt(40,80),incPct=getRandomInt(10,30),t=getRandomInt(60,180);
      const newS=s*(1+incPct/100),newT=Math.round(t*s/newS),saved=t-newT;
      return{question:`Car at ${s}km/h speeds up by ${incPct}%. Journey takes ${t} min. Minutes saved?`,
        options:makeOptions(saved,2,8),answer:0,
        explanation:`New speed=${newS.toFixed(1)}km/h. New time=${newT}min. Saved=${saved}min.`,subtopic:'Speed & Time'};},
    () => { // Head start
      const lead=getRandomInt(100,500),s1=getRandomInt(40,70),s2=getRandomInt(s1+10,s1+30);
      const catchTime=Math.round(lead/(s2-s1));
      return{question:`A has ${lead}m head start. B runs at ${s2}m/min, A at ${s1}m/min. Minutes for B to catch A?`,
        options:makeOptions(catchTime,2,10),answer:0,
        explanation:`Relative speed=${s2}−${s1}=${s2-s1}m/min. Time=${lead}/${s2-s1}=${catchTime}min.`,subtopic:'Head Start'};},
    () => { // Relative speed same direction gap
      const s1=getRandomInt(40,70),s2=s1+getRandomInt(10,30),dist=getRandomInt(100,400);
      const tMins=Math.round(dist*60/(s2-s1));
      return{question:`Two cyclists leave same point — ${s1}km/h and ${s2}km/h same direction. Time to be ${dist}km apart?`,
        options:makeOptions(tMins,10,40),answer:0,
        explanation:`Relative=${s2}−${s1}km/h. Time=${dist}/(${s2-s1})h=${tMins}min.`,subtopic:'Relative Speed'};},
    () => { // Multi-leg average speed
      const d1=getRandomInt(40,100),ss1=getRandomInt(30,60),d2=getRandomInt(30,80),ss2=getRandomInt(40,80);
      const avgSpeed=Math.round((d1+d2)/(d1/ss1+d2/ss2));
      return{question:`Train travels ${d1}km at ${ss1}km/h then ${d2}km at ${ss2}km/h. Average speed?`,
        options:[`${avgSpeed}km/h`,`${Math.round((ss1+ss2)/2)}km/h`,`${avgSpeed+2}km/h`,`${avgSpeed-2}km/h`],answer:0,
        explanation:`Avg=(${d1+d2})/(${d1}/${ss1}+${d2}/${ss2})=${avgSpeed}km/h.`,subtopic:'Multi-leg Journey'};},
  ],
  'boats-streams': [
    () => { // Round trip
      const u=getRandomInt(4,10),v=getRandomInt(2,u-1),dist=getRandomInt(30,80);
      const ans=Math.round((dist/(u-v)+dist/(u+v))*10)/10;
      return{question:`Boat speed ${u}km/h still water, stream ${v}km/h. ${dist}km round trip time?`,
        options:[`${ans}h`,`${(dist*2/(u+v)).toFixed(1)}h`,`${(ans+1).toFixed(1)}h`,`${(ans-1).toFixed(1)}h`],answer:0,
        explanation:`Up=${dist}/${u-v}h, Down=${dist}/${u+v}h. Total=${ans}h.`,subtopic:'Round Trip'};},
    () => { // Upstream vs downstream difference
      const b=getRandomInt(8,18),s=getRandomInt(2,5),dist=getRandomInt(40,100);
      const diff=Math.round((dist/(b-s)-dist/(b+s))*10)/10;
      return{question:`Boat ${b}km/h still, stream ${s}km/h. ${dist}km upstream vs downstream — time difference?`,
        options:[`${diff}h`,`${(diff+0.5).toFixed(1)}h`,`${(diff-0.5).toFixed(1)}h`,`${(dist*2/(b+s)).toFixed(1)}h`],answer:0,
        explanation:`Up=${dist}/${b-s}h, Down=${dist}/${b+s}h. Diff=${diff}h.`,subtopic:'Upstream vs Downstream'};},
    () => { // Find still water speed
      const dist=getRandomInt(40,80),b=getRandomInt(8,15),s=getRandomInt(2,5);
      const tUp=dist/(b-s),tDown=dist/(b+s),foundB=Math.round((dist/tUp+dist/tDown)/2);
      return{question:`Boat takes ${tUp.toFixed(1)}h upstream and ${tDown.toFixed(1)}h downstream for ${dist}km. Still water speed?`,
        options:makeOptions(foundB,2,5),answer:0,
        explanation:`Up speed=${(dist/tUp).toFixed(1)},Down=${(dist/tDown).toFixed(1)}. Still=(up+down)/2=${foundB}km/h.`,subtopic:'Still Water Speed'};},
    () => { // Stream speed from ratio
      const factor=getRandomInt(1,4),ratio_up=getRandomInt(2,4),ratio_down=ratio_up+getRandomInt(1,3);
      const stream=factor*(ratio_down-ratio_up),boat=factor*(ratio_up+ratio_down);
      return{question:`Upstream speed : downstream speed = ${ratio_up}:${ratio_down}. Stream speed ${stream}km/h. Boat speed in still water?`,
        options:makeOptions(boat,3,8),answer:0,
        explanation:`Still=(up+down)/2=factor×(${ratio_up}+${ratio_down})=${boat}km/h.`,subtopic:'Speed Ratio'};},
    () => { // Downstream distance
      const b=getRandomInt(8,15),s=getRandomInt(2,5),t=getRandomInt(2,5),dist=Math.round((b+s)*t);
      return{question:`Boat still ${b}km/h, stream ${s}km/h. Downstream for ${t}h. Distance?`,
        options:makeOptions(dist,5,20),answer:0,
        explanation:`Downstream=${b}+${s}=${b+s}km/h. Dist=${b+s}×${t}=${dist}km.`,subtopic:'Downstream Distance'};},
  ],
  'trains': [
    () => { // Opposite direction crossing
      const l1=getRandomInt(100,200),l2=getRandomInt(100,200),s1=getRandomInt(40,80),s2=getRandomInt(30,70);
      const t=Math.round((l1+l2)/((s1+s2)/3.6));
      return{question:`Train A (${l1}m,${s1}km/h) & Train B (${l2}m,${s2}km/h) opposite direction. Time to cross?`,
        options:makeOptions(t,2,8),answer:0,
        explanation:`Rel speed=(${s1}+${s2})/3.6=${((s1+s2)/3.6).toFixed(1)}m/s. Time=(${l1}+${l2})/${((s1+s2)/3.6).toFixed(1)}≈${t}s.`,subtopic:'Trains Crossing'};},
    () => { // Train crosses pole: find length
      const speed=getRandomInt(54,90),timePole=getRandomInt(6,15);
      const len=Math.round(speed*1000/3600*timePole);
      return{question:`Train at ${speed}km/h crosses a pole in ${timePole}s. Length of train?`,
        options:makeOptions(len,20,60),answer:0,
        explanation:`Speed=${(speed/3.6).toFixed(1)}m/s. Length=${(speed/3.6).toFixed(1)}×${timePole}=${len}m.`,subtopic:'Train Length'};},
    () => { // Overtaking man
      const tLen=getRandomInt(150,300),tSpeed=getRandomInt(54,90),manSpeed=getRandomInt(3,7);
      const rel=(tSpeed-manSpeed)/3.6,t=Math.round(tLen/rel);
      return{question:`${tLen}m train at ${tSpeed}km/h overtakes man at ${manSpeed}km/h (same dir). Time?`,
        options:makeOptions(t,2,8),answer:0,
        explanation:`Rel speed=${rel.toFixed(1)}m/s. Time=${tLen}/${rel.toFixed(1)}≈${t}s.`,subtopic:'Train & Pedestrian'};},
    () => { // Two trains same direction
      const l1=getRandomInt(100,200),l2=getRandomInt(100,200),s1=getRandomInt(60,90),s2=getRandomInt(30,s1-10);
      const rel=(s1-s2)/3.6,t=Math.round((l1+l2)/rel);
      return{question:`Train A (${l1}m,${s1}km/h) overtakes Train B (${l2}m,${s2}km/h) same dir. Overtaking time?`,
        options:makeOptions(t,5,20),answer:0,
        explanation:`Rel=${(s1-s2)/3.6}m/s. Time=(${l1}+${l2})/${rel.toFixed(1)}≈${t}s.`,subtopic:'Overtaking'};},
    () => { // Train and bridge
      const tLen=getRandomInt(150,250),tSpeed=getRandomInt(54,90),bridge=getRandomInt(200,500);
      const t=Math.round((tLen+bridge)/(tSpeed/3.6));
      return{question:`${tLen}m train at ${tSpeed}km/h crosses ${bridge}m bridge. Time?`,
        options:makeOptions(t,3,10),answer:0,
        explanation:`Total dist=${tLen+bridge}m. Speed=${(tSpeed/3.6).toFixed(1)}m/s. Time≈${t}s.`,subtopic:'Train & Bridge'};},
    () => { // Speed from crossing times (two opposite trains)
      const l1=getRandomInt(100,200),l2=getRandomInt(100,200),speed=getRandomInt(40,80),ratio=getRandomInt(2,4);
      const tOpp=Math.round((l1+l2)/((speed+speed*ratio)/3.6));
      return{question:`Trains (${l1}m,${l2}m) cross in ${tOpp}s opposite way. One is ${ratio}× as fast. Slower train speed?`,
        options:makeOptions(speed,5,20),answer:0,
        explanation:`v+${ratio}v=(${l1}+${l2})×3.6/${tOpp}. v=${speed}km/h.`,subtopic:'Speed from Crossing'};},
  ],
  'permutation-combination': [
    () => { // Vowels together
      const v=getRandomInt(2,3),con=getRandomInt(3,5),ans=fact(con+1)*fact(v);
      return{question:`${v} vowels and ${con} consonants arranged in a row — all vowels together. Ways?`,
        options:makeOptions(ans,100,1000),answer:0,
        explanation:`Treat ${v} vowels as 1 unit: (${con}+1)!×${v}!=${fact(con+1)}×${fact(v)}=${ans}.`,subtopic:'Vowels Together'};},
    () => { // Circular arrangement
      const n=getRandomInt(5,8),ans=fact(n-1);
      return{question:`${n} people seated around a circular table. Ways?`,
        options:makeOptions(ans,100,2000),answer:0,
        explanation:`Circular=(n−1)!=(${n}−1)!=${ans}.`,subtopic:'Circular Arrangement'};},
    () => { // Committee: at least 2 women
      const men=getRandomInt(5,8),women=getRandomInt(4,7),size=getRandomInt(4,6);
      let ans=0;for(let w=2;w<=Math.min(women,size);w++){const m=size-w;if(m<=men)ans+=nCr(women,w)*nCr(men,m);}
      return{question:`Committee of ${size} from ${men} men & ${women} women — at least 2 women. Ways?`,
        options:makeOptions(ans,20,200),answer:0,
        explanation:`Sum C(${women},2)×C(${men},${size-2})+...=${ans}.`,subtopic:'Selection with Restriction'};},
    () => { // Items not adjacent
      const n=getRandomInt(6,9),total=fact(n),adj=fact(n-1)*2,apart=total-adj;
      return{question:`${n} people in a row — two specific people never adjacent. Ways?`,
        options:makeOptions(apart,10000,200000),answer:0,
        explanation:`Total=${n}!=${total}. Adjacent=2×${n-1}!=${adj}. Apart=${apart}.`,subtopic:'Non-adjacent'};},
    () => { // Distribute n to r
      const n=getRandomInt(5,8),r=getRandomInt(3,4),ans=Math.pow(r,n);
      return{question:`${n} distinct items distributed among ${r} people (any number to each). Ways?`,
        options:makeOptions(ans,100,5000),answer:0,
        explanation:`Each of ${n} items → any of ${r} people: ${r}^${n}=${ans}.`,subtopic:'Distribution'};},
    () => { // nCr
      const n=getRandomInt(8,14),r=getRandomInt(3,5),ans=nCr(n,r);
      return{question:`Select ${r} balls from ${n} distinct balls. Ways?`,
        options:makeOptions(ans,50,500),answer:0,
        explanation:`C(${n},${r})=${n}!/(${r}!×${n-r}!)=${ans}.`,subtopic:'Combinations'};},
  ],
  'probability': [
    () => { // Same suit
      const num=4*nCr(13,2),den=nCr(52,2),g=gcd(num,den);
      return{question:`Two cards drawn from 52-card deck. P(both same suit)?`,
        options:[`${num/g}/${den/g}`,`1/4`,`${num/g+1}/${den/g}`,`12/51`],answer:0,
        explanation:`P=4×C(13,2)/C(52,2)=4×78/1326=${num/g}/${den/g}.`,subtopic:'Card Probability'};},
    () => { // Dice sum
      const k=getRandomInt(7,11);let fav=0;
      for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)if(i+j===k)fav++;
      const g=gcd(fav,36);
      return{question:`Two dice rolled. P(sum = ${k})?`,
        options:[`${fav/g}/${36/g}`,`${fav}/36`,`1/${Math.round(36/fav)+1}`,`${fav-1}/36`],answer:0,
        explanation:`Favourable for sum ${k}=${fav}. P=${fav}/36=${fav/g}/${36/g}.`,subtopic:'Dice Probability'};},
    () => { // Balls without replacement
      const red=getRandomInt(3,6),blue=getRandomInt(3,6),n=red+blue;
      const fav=nCr(red,2),tot=nCr(n,2),g=gcd(fav,tot);
      return{question:`Bag has ${red} red & ${blue} blue balls. 2 drawn. P(both red)?`,
        options:[`${fav/g}/${tot/g}`,`${red}/${n}`,`${fav-1}/${tot}`,`${red}/${n+1}`],answer:0,
        explanation:`P=C(${red},2)/C(${n},2)=${fav}/${tot}=${fav/g}/${tot/g}.`,subtopic:'Ball Drawing'};},
    () => { // Conditional probability
      const pA=getRandomInt(3,6),pB=getRandomInt(4,7),pAB=getRandomInt(1,Math.min(pA,pB)),d=getRandomInt(8,12);
      const g=gcd(pAB,pB);
      return{question:`P(A)=${pA}/${d}, P(B)=${pB}/${d}, P(A∩B)=${pAB}/${d}. Find P(A|B).`,
        options:[`${pAB/g}/${pB/g}`,`${pA/gcd(pA,d)}/${d/gcd(pA,d)}`,`${pAB}/${d}`,`${pAB/g+1}/${pB/g}`],answer:0,
        explanation:`P(A|B)=P(A∩B)/P(B)=(${pAB}/${d})/(${pB}/${d})=${pAB/g}/${pB/g}.`,subtopic:'Conditional Probability'};},
    () => { // At least one
      const n=getRandomInt(3,5),pFn=getRandomInt(1,3),pFd=getRandomInt(4,6);
      const succN=Math.pow(pFd,n)-Math.pow(pFn,n),succD=Math.pow(pFd,n),g=gcd(succN,succD);
      return{question:`P(fail)=${pFn}/${pFd}. ${n} attempts. P(at least 1 success)?`,
        options:[`${succN/g}/${succD/g}`,`${n}×${pFd-pFn}/${pFd}`,`1/${pFd}`,`${pFd-pFn}/${pFd}`],answer:0,
        explanation:`P=1−(${pFn}/${pFd})^${n}=1−${Math.pow(pFn,n)}/${Math.pow(pFd,n)}=${succN/g}/${succD/g}.`,subtopic:'At-least Probability'};},
    () => { // Coin exactly k heads
      const n=getRandomInt(4,6),k=getRandomInt(2,n-1),fav=nCr(n,k),tot=Math.pow(2,n),g=gcd(fav,tot);
      return{question:`Coin tossed ${n} times. P(exactly ${k} heads)?`,
        options:[`${fav/g}/${tot/g}`,`${k}/${n}`,`${fav-1}/${tot}`,`${fav/g}/${tot/g+1}`],answer:0,
        explanation:`P=C(${n},${k})/2^${n}=${fav}/${tot}=${fav/g}/${tot/g}.`,subtopic:'Coin Probability'};},
  ],
  'mensuration': [
    () => { // Sphere→cones
      const sr=getRandomInt(6,12),cr=getRandomInt(2,4),ch=getRandomInt(4,8);
      const num=Math.round((4*sr*sr*sr)/(cr*cr*ch));
      return{question:`Sphere radius ${sr}cm melted into cones (r=${cr}cm, h=${ch}cm). How many?`,
        options:makeOptions(num,5,20),answer:0,
        explanation:`Cones=4r_s³/(r_c²×h)=4×${sr}³/(${cr}²×${ch})=${num}.`,subtopic:'Volume Conservation'};},
    () => { // Path around rectangle
      const l=getRandomInt(20,50),w=getRandomInt(10,30),pw=getRandomInt(2,5);
      const area=(l+2*pw)*(w+2*pw)-l*w;
      return{question:`Rectangle ${l}m×${w}m has ${pw}m path around it. Path area?`,
        options:makeOptions(area,20,80),answer:0,
        explanation:`Outer=${l+2*pw}×${w+2*pw}. Path=${(l+2*pw)*(w+2*pw)}−${l*w}=${area}m².`,subtopic:'Area of Path'};},
    () => { // Wire → square
      const side=getRandomInt(5,15)*4,wire=side*4;
      return{question:`Wire ${wire}cm bent into a square. Area?`,
        options:makeOptions(side*side,10,50),answer:0,
        explanation:`Side=${wire}/4=${side}. Area=${side}²=${side*side}cm².`,subtopic:'Wire & Shape'};},
    () => { // Cone:Cylinder ratio
      const r=getRandomInt(4,8),h=getRandomInt(6,12);
      return{question:`Cone and cylinder same base (r=${r}cm) and height (h=${h}cm). Volume ratio?`,
        options:['1:3','1:2','2:3','3:1'],answer:0,
        explanation:`V_cone=πr²h/3, V_cyl=πr²h. Ratio=1:3.`,subtopic:'Cone vs Cylinder'};},
    () => { // Cuboid diagonal
      const l=getRandomInt(3,8),w=getRandomInt(3,7),h=getRandomInt(3,6);
      const diag=Math.round(Math.sqrt(l*l+w*w+h*h)*10)/10;
      return{question:`Cuboid ${l}cm×${w}cm×${h}cm. Space diagonal?`,
        options:[`${diag}cm`,`${Math.round(diag+1)}cm`,`${l+w+h}cm`,`${Math.round(diag-1)}cm`],answer:0,
        explanation:`√(${l}²+${w}²+${h}²)=√${l*l+w*w+h*h}≈${diag}cm.`,subtopic:'Cuboid Diagonal'};},
    () => { // Cylinder TSA:Volume ratio
      const r=getRandomInt(4,8),h=getRandomInt(6,14),g=gcd(r*h,2*(r+h));
      return{question:`Cylinder r=${r}cm, h=${h}cm. Volume(cm³) : Total Surface Area(cm²)?`,
        options:[`${r*h}:${2*(r+h)}`,`${r}:${2*(r+h)/r}`,`${r*h+1}:${2*(r+h)}`,`${r*h}:${2*(r+h)+2}`],answer:0,
        explanation:`V=πr²h, TSA=2πr(r+h). Ratio=rh:2(r+h)=${r*h}:${2*(r+h)}.`,subtopic:'Cylinder'};},
  ],
  'statistics': [
    () => { // Standard deviation
      const data=Array.from({length:5},()=>getRandomInt(10,30));
      const mean=Math.round(data.reduce((a,b)=>a+b,0)/5);
      const variance=Math.round(data.map(x=>(x-mean)**2).reduce((a,b)=>a+b,0)/5);
      const sd=Math.round(Math.sqrt(variance)*10)/10;
      return{question:`Find SD of: ${data.join(', ')}`,
        options:[`${sd}`,`${(sd+1).toFixed(1)}`,`${(sd-1).toFixed(1)}`,`${variance}`],answer:0,
        explanation:`Mean=${mean}. Variance=${variance}. SD=√${variance}≈${sd}.`,subtopic:'Standard Deviation'};},
    () => { // Combined mean
      const n1=getRandomInt(10,20),m1=getRandomInt(40,60),n2=getRandomInt(15,25),m2=getRandomInt(65,85);
      const combined=Math.round((n1*m1+n2*m2)/(n1+n2));
      return{question:`Group A: ${n1} students, mean ${m1}. Group B: ${n2} students, mean ${m2}. Combined mean?`,
        options:makeOptions(combined,2,8),answer:0,
        explanation:`(${n1}×${m1}+${n2}×${m2})/${n1+n2}=${combined}.`,subtopic:'Combined Mean'};},
    () => { // Linear transformation
      const mean=getRandomInt(30,60),sd=getRandomInt(5,15),a=getRandomInt(2,5),b=getRandomInt(3,10);
      return{question:`Dataset: mean=${mean}, SD=${sd}. Each value ×${a} then +${b}. New mean & SD?`,
        options:[`Mean=${a*mean+b}, SD=${a*sd}`,`Mean=${a*mean+b}, SD=${a*sd+b}`,`Mean=${a*mean}, SD=${sd}`,`Mean=${a*mean+b}, SD=${sd}`],
        answer:0,explanation:`Mean=${a}×${mean}+${b}=${a*mean+b}. SD=${a}×${sd}=${a*sd} (constant doesn't change SD).`,subtopic:'Linear Transformation'};},
    () => { // Corrected mean
      const n=getRandomInt(20,40),mean=getRandomInt(30,60),wrong=getRandomInt(10,30),correct=wrong+getRandomInt(10,30);
      const newMean=((mean*n-wrong+correct)/n).toFixed(2);
      return{question:`Mean of ${n} observations=${mean}. One value ${wrong} should be ${correct}. Correct mean?`,
        options:[`${newMean}`,`${mean}`,`${(parseFloat(newMean)+1).toFixed(2)}`,`${(parseFloat(newMean)-1).toFixed(2)}`],answer:0,
        explanation:`Correct sum=${mean*n}−${wrong}+${correct}=${mean*n-wrong+correct}. Mean=${newMean}.`,subtopic:'Corrected Mean'};},
    () => { // CV comparison
      const m1=getRandomInt(40,60),s1=getRandomInt(5,12),m2=getRandomInt(50,80),s2=getRandomInt(8,15);
      const cv1=Math.round(s1/m1*100),cv2=Math.round(s2/m2*100),better=cv1<cv2?'A':'B';
      return{question:`A: mean=${m1},SD=${s1}. B: mean=${m2},SD=${s2}. More consistent dataset?`,
        options:[`Dataset ${better} (CV=${Math.min(cv1,cv2)}%)`,`Dataset ${better==='A'?'B':'A'} (CV=${Math.max(cv1,cv2)}%)`,`Both equal`,`Cannot determine`],
        answer:0,explanation:`CV_A=${cv1}%, CV_B=${cv2}%. Lower CV=more consistent=Dataset ${better}.`,subtopic:'Coefficient of Variation'};},
    () => { // Mode and range
      const data=[getRandomInt(10,20),getRandomInt(10,20),getRandomInt(10,20)];
      data.push(data[0]); // duplicate first to make mode clear
      data.push(getRandomInt(21,30));
      const mode=data[0],range=Math.max(...data)-Math.min(...data);
      return{question:`Data: ${data.join(', ')}. Find Mode and Range.`,
        options:[`Mode=${mode}, Range=${range}`,`Mode=${data[1]}, Range=${range-2}`,`Mode=${mode}, Range=${range+1}`,`Mode=${data[2]}, Range=${range}`],
        answer:0,explanation:`Mode=${mode} (appears twice). Range=Max−Min=${Math.max(...data)}−${Math.min(...data)}=${range}.`,subtopic:'Mode & Range'};},
  ],
};

// ════════════════════════════════════════════════════════════════════════════
//  EXPERT QUESTIONS POOL  — TCS NQT actual exam level
//  Multi-step, disguised variables, traps, time pressure (~2–3 min/question)
// ════════════════════════════════════════════════════════════════════════════
const EXPERT_POOL = {
  'number-system': [
    () => { // CRT-style: simultaneous congruences
      const d1=getRandomInt(3,5),d2=d1+getRandomInt(2,4),d3=d2+getRandomInt(2,3);
      const r1=getRandomInt(1,d1-1),r2=getRandomInt(1,d2-1),r3=getRandomInt(1,d3-1);
      const L=lcmThree(d1,d2,d3);
      // find smallest N by brute force (guaranteed finite)
      let N=1;while(N<1000){if(N%d1===r1&&N%d2===r2&&N%d3===r3)break;N++;}
      return{question:`Find the smallest number that leaves remainder ${r1} on dividing by ${d1}, remainder ${r2} on ${d2}, and remainder ${r3} on ${d3}.`,
        options:makeOptions(N,5,30),answer:0,
        explanation:`Solve by Chinese Remainder Theorem or systematic search. Answer: ${N}. Verify: ${N}%${d1}=${N%d1},  ${N}%${d2}=${N%d2}, ${N}%${d3}=${N%d3}.`,subtopic:'CRT'};},
    () => { // Last 2 digits (mod 100) using pattern
      const bases=[3,7,13,17,19,23,27,29,33,37];
      const base=pickRandomArray(bases),exp=getRandomInt(50,200);
      const last2=powerMod(base,exp,100);
      return{question:`Find the last TWO digits of ${base}^${exp}.`,
        options:makeOptions(last2,5,20),answer:0,
        explanation:`${base}^${exp} mod 100 = ${last2}. (Use cyclicity: powers of ${base} mod 100 repeat with period dividing φ(100)=40.)`,subtopic:'Last Two Digits'};},
    () => { // Sum of digits divisible by 9: count
      const d=getRandomInt(3,6),start=getRandomInt(100,999);
      let count=0,n=start;
      while(count<5){if(n%d===0){count++;}n++;}
      const ans=n-1-start+1-1;
      // simpler: how many multiples of d in [1000,9999]
      const total=Math.floor(9999/d)-Math.floor(999/d);
      return{question:`How many 4-digit numbers are exact multiples of ${d}?`,
        options:makeOptions(total,5,30),answer:0,
        explanation:`⌊9999/${d}⌋−⌊999/${d}⌋=${Math.floor(9999/d)}−${Math.floor(999/d)}=${total}.`,subtopic:'Counting Multiples'};},
    () => { // Remainder of product mod prime
      const mod=pickRandomArray([7,11,13]);
      const a=getRandomInt(2,mod-1),b=getRandomInt(2,mod-1),c=getRandomInt(2,mod-1);
      const rem=(a*b*c)%mod;
      return{question:`Find the remainder when ${a}×${b}×${c} is divided by ${mod}.`,
        options:makeOptions(rem,1,5),answer:0,
        explanation:`${a*b}×${c} mod ${mod}. ${a*b} mod ${mod}=${(a*b)%mod}. Then ×${c} mod ${mod}=${rem}.`,subtopic:'Product Remainder'};},
    () => { // Digit sum rule + divisibility trap
      const n=getRandomInt(10,30)*9+getRandomInt(1,8); // not divisible by 9
      const digitSum=String(n).split('').reduce((a,c)=>a+parseInt(c),0);
      const nearestMult9=Math.ceil(digitSum/9)*9;
      const toAdd=nearestMult9-digitSum;
      return{question:`What is the smallest digit that must be added to ${n} to make it divisible by 9?`,
        options:makeOptions(toAdd,1,4),answer:0,
        explanation:`Digit sum of ${n}=${digitSum}. Nearest multiple of 9≥${digitSum} is ${nearestMult9}. Add ${toAdd}.`,subtopic:'Divisibility by 9'};},
    () => { // Euler's totient count
      const p=pickRandomArray([5,7,11,13]);
      const q=pickRandomArray([3,4,8]).filter(x=>gcd(x,p)===1).pop()||4;
      const N=p*q,phi=p>1&&q>1?(p-1)*(q-1):N;
      return{question:`How many integers from 1 to ${N} are coprime to ${N}?`,
        options:makeOptions(phi,2,8),answer:0,
        explanation:`φ(${N})=φ(${p})×φ(${q})=(${p}-1)×(${q}-1)=${phi}.`,subtopic:"Euler's Totient"};},
    () => { // Perfect square factors
      const a=getRandomInt(2,4),b=getRandomInt(1,3);
      const N=Math.pow(2,2*a)*Math.pow(3,2*b);
      const sqFact=(a+1)*(b+1);
      return{question:`Find the number of perfect-square factors of ${N}.`,
        options:makeOptions(sqFact,2,8),answer:0,
        explanation:`${N}=2^${2*a}×3^${2*b}. Perfect-square factors use even exponents: (${a}+1)×(${b}+1)=${sqFact}.`,subtopic:'Perfect Square Factors'};},
    () => { // Sum of digits after repeated operations
      const n=getRandomInt(100,999),power=getRandomInt(2,4);
      let val=Math.pow(n,power);
      while(val>=10){val=String(val).split('').reduce((a,c)=>a+parseInt(c),0);}
      return{question:`Compute the digital root of ${n}^${power}.`,
        options:makeOptions(val,1,4),answer:0,
        explanation:`Digital root = ((${n}^${power}−1) mod 9)+1 = ${val}.`,subtopic:'Digital Root'};},
  ],
  'ratio-proportion': [
    () => { // Repeated replacement: exact ratio after n steps
      const C=getRandomInt(40,100),rem=getRandomInt(10,30),n=getRandomInt(3,4);
      const remain=Math.pow((C-rem)/C,n);
      const num=Math.round(remain*100),den=100,g=gcd(num,den-num);
      return{question:`${C}L pure milk. ${rem}L drawn and replaced with water — ${n} times. What fraction of the mixture is milk?`,
        options:[`${num/g}/${(den-num)/g+num/g}`,`${Math.round(remain*10)}/10`,`${num/g+1}/${(100)/g}`,`${(C-rem)}/${C}`],answer:0,
        explanation:`Fraction=((${C}−${rem})/${C})^${n}=${remain.toFixed(4)}≈${num/g}:(${100-num}/g).`,subtopic:'Mixture Fraction'};},
    () => { // Wages in ratio of work done
      const rA=getRandomInt(2,5),rB=getRandomInt(3,7),rC=getRandomInt(4,8);
      const total=getRandomInt(6,12)*100;
      const sumR=rA+rB+rC;
      const shareC=Math.round(rC/sumR*total);
      return{question:`A, B, C can complete a job in ${rA}, ${rB}, ${rC} days. They work together and earn ₹${total}. C's share?`,
        options:makeOptions(shareC,100,500),answer:0,
        explanation:`Work ratio=1/${rA}:1/${rB}:1/${rC}. C's fraction=(1/${rC})/(1/${rA}+1/${rB}+1/${rC}). C's share≈₹${shareC}.`,subtopic:'Work & Wages'};},
    () => { // Gold alloy mixing
      const gold1=getRandomInt(60,80),gold2=getRandomInt(40,55),target=getRandomInt(gold2+5,gold1-5);
      const r1=gold1-target,r2=target-gold2,g=gcd(r1,r2);
      return{question:`${gold1}% gold alloy mixed with ${gold2}% gold alloy to get ${target}% gold. Ratio of first to second?`,
        options:[`${r2/g}:${r1/g}`,`${r1/g}:${r2/g}`,`${r1}:${r2}`,`${r2}:${r1}`],answer:0,
        explanation:`Alligation: (${gold1}−${target}):(${target}−${gold2})=${r1}:${r2}. But ratio is cheaper:dearer=${r1/g}:${r2/g}.`,subtopic:'Alligation — Gold'};},
    () => { // Partnership: A joins late
      const P1=getRandomInt(5,10)*1000,P2=getRandomInt(6,12)*1000;
      const t1=12,t2=getRandomInt(6,10);
      const profit=getRandomInt(8,20)*1000;
      const wA=P1*t1,wB=P2*t2,g=gcd(wA,wB),shareA=Math.round(wA/(wA+wB)*profit);
      return{question:`A invested ₹${P1} for the whole year. B joined after ${t1-t2} months with ₹${P2}. Annual profit ₹${profit}. A's share?`,
        options:makeOptions(shareA,1000,5000),answer:0,
        explanation:`A: ${P1}×12, B: ${P2}×${t2}. Ratio=${wA/g}:${wB/g}. A's share=₹${shareA}.`,subtopic:'Partnership — Timing'};},
    () => { // 3-container mixing: find volume of each
      const v=getRandomInt(5,10)*10;
      const c1=getRandomInt(20,40),c2=getRandomInt(45,65),c3=getRandomInt(70,90);
      const cMix=(c1+c2+c3)/3;
      return{question:`Equal quantities from 3 containers with ${c1}%, ${c2}%, ${c3}% alcohol mixed. Resultant %?`,
        options:[`${Math.round(cMix)}%`,`${c1+c3-c2}%`,`${Math.round(cMix)+2}%`,`${Math.round(cMix)-2}%`],answer:0,
        explanation:`Equal volumes: avg=(${c1}+${c2}+${c3})/3=${Math.round(cMix)}%.`,subtopic:'3-Container Mixture'};},
    () => { // Ratio chain problem
      const a=getRandomInt(3,6),b=getRandomInt(4,8),c=getRandomInt(5,9),d=getRandomInt(6,10),total=getRandomInt(100,300);
      const sumParts=a+b+c+d,shareA=Math.round(a/sumParts*total);
      return{question:`₹${total} divided among A,B,C,D in ratio ${a}:${b}:${c}:${d}. A's share?`,
        options:makeOptions(shareA,10,50),answer:0,
        explanation:`A's share=${a}/${sumParts}×${total}=₹${shareA}.`,subtopic:'Ratio Division'};},
  ],
  'averages': [
    () => { // Average in AP sequence
      const first=getRandomInt(10,30),last=first+getRandomInt(20,60);
      const n=getRandomInt(5,20)*2+1;// odd count
      const avg=(first+last)/2;
      return{question:`The first term of an AP is ${first} and the last term is ${last}. The AP has ${n} terms. Average?`,
        options:[`${avg}`,`${avg+1}`,`${(first+last)/2+0.5}`,`${Math.round(avg)-1}`],answer:0,
        explanation:`In AP, average=(first+last)/2=(${first}+${last})/2=${avg}.`,subtopic:'AP Average'};},
    () => { // Age average shifts with new member
      const n=getRandomInt(10,25),avg=getRandomInt(25,45),newAge=getRandomInt(avg+5,avg+20);
      const newAvg=Math.round(((avg*n+newAge)/(n+1))*10)/10;
      const rise=Math.round((newAvg-avg)*10)/10;
      return{question:`${n} people avg age ${avg}. A person aged ${newAge} joins. New average?`,
        options:[`${newAvg}`,`${Math.round(newAvg+1)}`,`${avg}`,`${Math.round(newAvg-1)}`],answer:0,
        explanation:`(${avg}×${n}+${newAge})/${n+1}=${newAvg}. Rise=${rise}.`,subtopic:'Average — New Member'};},
    () => { // Wrong reading: effect on average
      const n=getRandomInt(30,60),avg=getRandomInt(40,80),wrong=getRandomInt(10,avg-10);
      const correct=wrong+getRandomInt(20,50),newAvg=Math.round(((avg*n-wrong+correct)/n)*100)/100;
      return{question:`Average of ${n} numbers is ${avg}. One number recorded as ${wrong} instead of ${correct}. Correct average?`,
        options:[`${newAvg}`,`${avg}`,`${(parseFloat(newAvg)+1).toFixed(2)}`,`${(parseFloat(newAvg)-1).toFixed(2)}`],answer:0,
        explanation:`Correct sum=${avg*n-wrong+correct}. Avg=${newAvg}.`,subtopic:'Corrected Average'};},
    () => { // Multiple replacements
      const n=getRandomInt(8,15),avg=getRandomInt(30,55);
      const old1=getRandomInt(10,25),old2=getRandomInt(old1+1,30),new1=old1+n,new2=old2+n;
      const newAvg=avg+(new1-old1+new2-old2)/n;
      return{question:`Group of ${n}: avg=${avg}. Members aged ${old1} & ${old2} replaced by ${new1} & ${new2}. New avg?`,
        options:[`${newAvg}`,`${newAvg+1}`,`${avg}`,`${newAvg-1}`],answer:0,
        explanation:`Net increase=${new1+new2-old1-old2}=${n*2}. Rise=${2}. New avg=${newAvg}.`,subtopic:'Double Replacement'};},
    () => { // Harmonic mean interpretation
      const s1=getRandomInt(30,60),s2=getRandomInt(40,80);
      const hm=Math.round(2*s1*s2/(s1+s2));
      return{question:`A person covers equal distances at ${s1}km/h and ${s2}km/h. Average speed for entire journey?`,
        options:[`${hm}km/h`,`${Math.round((s1+s2)/2)}km/h`,`${hm+2}km/h`,`${hm-2}km/h`],answer:0,
        explanation:`Average speed (equal dist)=2ab/(a+b)=2×${s1}×${s2}/${s1+s2}=${hm}km/h.`,subtopic:'Harmonic Mean Speed'};},
    () => { // Three group combined
      const n1=getRandomInt(5,10),m1=getRandomInt(40,55),n2=getRandomInt(8,14),m2=getRandomInt(56,70),n3=getRandomInt(6,12),m3=getRandomInt(71,85);
      const combined=Math.round((n1*m1+n2*m2+n3*m3)/(n1+n2+n3));
      return{question:`Groups: A(${n1},avg ${m1}), B(${n2},avg ${m2}), C(${n3},avg ${m3}). Overall average?`,
        options:makeOptions(combined,2,8),answer:0,
        explanation:`(${n1*m1}+${n2*m2}+${n3*m3})/${n1+n2+n3}=${combined}.`,subtopic:'Three-Group Average'};},
  ],
  'ages': [
    () => { // A:B now, C:D in future — system of equations
      const pA=getRandomInt(20,35),pB=getRandomInt(10,pA-5),yrs=getRandomInt(5,12);
      const g1=gcd(pA,pB),fA=pA/g1,fB=pB/g1;
      const g2=gcd(pA+yrs,pB+yrs),fA2=(pA+yrs)/g2,fB2=(pB+yrs)/g2;
      return{question:`Ages of A & B are in ratio ${fA}:${fB}. After ${yrs} years ratio becomes ${fA2}:${fB2}. Sum of present ages?`,
        options:makeOptions(pA+pB,5,15),answer:0,
        explanation:`A=${pA}, B=${pB}. Sum=${pA+pB}.`,subtopic:'Age Ratio System'};},
    () => { // Grandfather-father-child chain
      const gf=getRandomInt(55,70),f=getRandomInt(28,40),c=getRandomInt(4,12);
      const yrs=getRandomInt(3,8);
      const futureAvg=Math.round((gf+yrs+f+yrs+c+yrs)/3);
      return{question:`Grandfather (${gf}), Father (${f}), Child (${c}). Average age after ${yrs} years?`,
        options:makeOptions(futureAvg,2,8),answer:0,
        explanation:`Each +${yrs}: avg=(${gf+yrs}+${f+yrs}+${c+yrs})/3=${futureAvg}.`,subtopic:'Multi-generation Ages'};},
    () => { // Five years ago, ten years hence
      const now=getRandomInt(25,45),pastYrs=5,futureYrs=10;
      const past=now-pastYrs,future=now+futureYrs,ratio=Math.round(future/past*10)/10;
      return{question:`${pastYrs} years ago a person was ${past}. What is the ratio of their age ${futureYrs} years hence to their age ${pastYrs} years ago?`,
        options:[`${future}:${past}`,`${future}:${now}`,`${now}:${past}`,`${future+2}:${past}`],answer:0,
        explanation:`Now=${now}. ${futureYrs}y hence=${future}. ${pastYrs}y ago=${past}. Ratio=${future}:${past}.`,subtopic:'Past & Future Ratio'};},
    () => { // Combined family: mother + 3 children
      const mAge=getRandomInt(32,45);
      const c=[getRandomInt(5,10),getRandomInt(10,15),getRandomInt(15,20)];
      const sumNow=mAge+c[0]+c[1]+c[2];
      const yrs=getRandomInt(3,7),sumFuture=sumNow+4*yrs;
      return{question:`Mother (${mAge}) and 3 children (${c[0]},${c[1]},${c[2]}). Sum of ages after ${yrs} years?`,
        options:makeOptions(sumFuture,10,30),answer:0,
        explanation:`Current sum=${sumNow}. After ${yrs}y: +4×${yrs}=${sumNow+4*yrs}.`,subtopic:'Family Age Sum'};},
    () => { // Age condition: "as old as"
      const aAge=getRandomInt(20,40),bAge=getRandomInt(aAge+2,aAge+15);
      const diff=bAge-aAge;
      const yrs_ago_b_was_a=diff;
      return{question:`A is ${aAge}, B is ${bAge}. How many years ago was B as old as A is now?`,
        options:makeOptions(diff,2,8),answer:0,
        explanation:`B needs to go back ${bAge}-${aAge}=${diff} years to reach A's current age.`,subtopic:'Age Cross Condition'};},
    () => { // Ratio changes every decade
      const now=getRandomInt(24,36),then=getRandomInt(4,12),yrs=getRandomInt(10,20);
      const g1=gcd(now,then),g2=gcd(now+yrs,then+yrs);
      return{question:`A is ${now}, B is ${then}. In ${yrs} years, ratio of A:B = ${(now+yrs)/g2}:${(then+yrs)/g2}. Verify and state A's present age.`,
        options:makeOptions(now,3,10),answer:0,
        explanation:`Present A=${now},B=${then}. After ${yrs}: ${now+yrs}:${then+yrs}=${(now+yrs)/g2}:${(then+yrs)/g2}. ✓`,subtopic:'Verify Age Ratio'};},
  ],
  'percentages': [
    () => { // Three successive changes
      const p1=getRandomInt(10,25),p2=getRandomInt(10,20),p3=getRandomInt(5,15);
      const net=Math.round(((100+p1)*(100-p2)*(100+p3)/10000-1)*100);
      return{question:`Price up ${p1}%, then down ${p2}%, then up ${p3}%. Net % change?`,
        options:[`${net}%`,`${p1-p2+p3}%`,`${net+3}%`,`${net-3}%`],answer:0,
        explanation:`(${100+p1}/100)×(${100-p2}/100)×(${100+p3}/100)−1=${net}%.`,subtopic:'Three Successive Changes'};},
    () => { // Exam pass percentage trap
      const total=getRandomInt(5,12)*100,passPct=getRandomInt(55,75),passMark=getRandomInt(30,50);
      const passed=Math.round(total*passPct/100);
      return{question:`${total} students appeared. ${passPct}% passed. If pass mark is ${passMark}%, and passer average is ${Math.round(passMark+getRandomInt(10,20))}%, what's the overall average? (TRAP: direct info given)`,
        options:[`${Math.round(passMark+getRandomInt(5,10))}%`,`${passPct}%`,`${passMark}%`,`${Math.round(passMark+15)}%`],answer:0,
        explanation:`${passed} passed out of ${total}. Focus on what's asked — average requires all data.`,subtopic:'Pass Percentage'};},
    () => { // Tax-on-tax: compound duty
      const price=getRandomInt(500,2000),tax1=getRandomInt(5,12),tax2=getRandomInt(3,8);
      const final=Math.round(price*(1+tax1/100)*(1+tax2/100));
      return{question:`Article costs ₹${price}. ${tax1}% tax applied, then ${tax2}% tax on new price. Final price?`,
        options:makeOptions(final,50,200),answer:0,
        explanation:`${price}×(1+${tax1}/100)×(1+${tax2}/100)=₹${final}.`,subtopic:'Cascaded Tax'};},
    () => { // Percentage gain on selling X items at CP of Y
      const x=getRandomInt(8,20),y=getRandomInt(x+2,x+12);
      const gainPct=Math.round((y-x)/x*100);
      return{question:`By selling ${x} articles at CP of ${y} articles, gain%?`,
        options:makeOptions(gainPct,3,12),answer:0,
        explanation:`Gain%=(${y}−${x})/${x}×100=${gainPct}%.`,subtopic:'Gain on Articles'};},
    () => { // Income-tax bracket
      const income=getRandomInt(5,15)*100000;
      const exemption=250000;
      const taxable=Math.max(0,income-exemption);
      const tax=taxable<=250000?Math.round(taxable*0.05):Math.round(250000*0.05+(taxable-250000)*0.20);
      return{question:`Annual income ₹${income.toLocaleString('en-IN')}. Tax: 0% up to ₹2.5L, 5% on ₹2.5L–5L, 20% above ₹5L. Tax payable?`,
        options:makeOptions(tax,2000,20000),answer:0,
        explanation:`Taxable=₹${taxable.toLocaleString('en-IN')}. Tax=₹${tax}.`,subtopic:'Income Tax'};},
    () => { // Percentage more/less — comparison
      const a=getRandomInt(200,500),b=getRandomInt(300,600);
      const pct=Math.round(Math.abs(a-b)/Math.min(a,b)*100);
      const which=a>b?`A is ${pct}% more than B`:`B is ${pct}% more than A`;
      return{question:`A=₹${a}, B=₹${b}. By what % is the ${a>b?'larger':'larger'} quantity more than the smaller?`,
        options:[`${pct}%`,`${pct+5}%`,`${Math.round(Math.abs(a-b)/Math.max(a,b)*100)}%`,`${pct-5}%`],answer:0,
        explanation:`Diff=${Math.abs(a-b)}. % more than smaller=${Math.abs(a-b)}/${Math.min(a,b)}×100=${pct}%.`,subtopic:'Comparison Percentage'};},
  ],
  'profit-loss': [
    () => { // Markup + two successive discounts
      const cp=getRandomInt(300,800),markup=getRandomInt(30,60);
      const mp=Math.round(cp*(1+markup/100));
      const d1=getRandomInt(10,20),d2=getRandomInt(5,15);
      const sp=Math.round(mp*(1-d1/100)*(1-d2/100));
      const profitPct=Math.round((sp-cp)/cp*100);
      return{question:`CP=₹${cp}. Marked ${markup}% above CP. Two discounts: ${d1}% then ${d2}%. Profit/loss%?`,
        options:[`${profitPct>=0?'Profit':'Loss'} ${Math.abs(profitPct)}%`,`${d1+d2-markup}%`,`${Math.abs(profitPct)+3}%`,`${Math.abs(profitPct)-3}%`],answer:0,
        explanation:`MP=₹${mp}. SP=${mp}×${(1-d1/100).toFixed(2)}×${(1-d2/100).toFixed(2)}=₹${sp}. Result=${profitPct}%.`,subtopic:'Successive Discounts'};},
    () => { // Manufacturer→Dealer→Consumer
      const mfgCP=getRandomInt(200,500),m2d=getRandomInt(15,30),d2c=getRandomInt(10,25);
      const dealerCP=Math.round(mfgCP*(1+m2d/100)),consumerPrice=Math.round(dealerCP*(1+d2c/100));
      const totalGain=Math.round((consumerPrice-mfgCP)/mfgCP*100);
      return{question:`Manufacturer makes at ₹${mfgCP}, sells to dealer at ${m2d}% profit. Dealer sells to consumer at ${d2c}% profit. Consumer pays ₹${consumerPrice}. Manufacturer's % gain on cost if he sells directly?`,
        options:makeOptions(totalGain,5,20),answer:0,
        explanation:`Consumer price=₹${consumerPrice}. If mfg sold directly, profit=(${consumerPrice}−${mfgCP})/${mfgCP}×100=${totalGain}%.`,subtopic:'Supply Chain Profit'};},
    () => { // Buy at 3 for ₹X, sell at 2 for ₹Y
      const buyQty=getRandomInt(3,5),buyPrice=getRandomInt(5,15)*buyQty;
      const sellQty=buyQty-1,sellPrice=getRandomInt(buyPrice+2,buyPrice+10)*sellQty;
      const profitPct=Math.round((sellPrice/sellQty*buyQty-buyPrice)/buyPrice*100);
      return{question:`Bought ${buyQty} for ₹${buyPrice}, sold ${sellQty} for ₹${sellPrice}. Profit%?`,
        options:makeOptions(profitPct,5,20),answer:0,
        explanation:`CP/item=${(buyPrice/buyQty).toFixed(1)}, SP/item=${(sellPrice/sellQty).toFixed(1)}. Profit%=${profitPct}%.`,subtopic:'Bulk Trade'};},
    () => { // Loss in selling + recover
      const cp=getRandomInt(400,800),lossPct=getRandomInt(10,20);
      const sp=Math.round(cp*(1-lossPct/100));
      const sp2=cp+Math.round(cp*getRandomInt(5,15)/100);
      const gainPct=Math.round((sp2-cp)/cp*100);
      return{question:`Article sold at ${lossPct}% loss for ₹${sp}. At what price should it be sold to gain ${gainPct}%?`,
        options:makeOptions(sp2,50,200),answer:0,
        explanation:`CP=₹${cp}. Target SP=CP×(1+${gainPct}/100)=₹${sp2}.`,subtopic:'Target Selling Price'};},
    () => { // Three items: mix of profit and loss
      const n1=getRandomInt(3,5),p1=getRandomInt(10,25),n2=getRandomInt(3,5),l1=getRandomInt(10,20);
      const cp1=getRandomInt(100,300)*n1,cp2=getRandomInt(100,300)*n2;
      const sp1=Math.round(cp1*(1+p1/100)),sp2=Math.round(cp2*(1-l1/100));
      const netPct=Math.round((sp1+sp2-cp1-cp2)/(cp1+cp2)*100);
      return{question:`Sold ${n1} articles at ${p1}% profit (CP ₹${cp1}) and ${n2} articles at ${l1}% loss (CP ₹${cp2}). Overall %?`,
        options:[`${netPct>=0?'Profit':'Loss'} ${Math.abs(netPct)}%`,`${p1-l1}%`,`${Math.abs(netPct)+2}%`,`Break even`],answer:0,
        explanation:`Net=(${sp1}+${sp2}−${cp1+cp2})/${cp1+cp2}×100=${netPct}%.`,subtopic:'Mixed Trade'};},
    () => { // Discount series equivalent
      const d1=getRandomInt(10,25),d2=getRandomInt(5,20);
      const equiv=Math.round((1-(1-d1/100)*(1-d2/100))*100);
      return{question:`Two successive discounts of ${d1}% and ${d2}%. Equivalent single discount?`,
        options:[`${equiv}%`,`${d1+d2}%`,`${equiv+2}%`,`${d1+d2-2}%`],answer:0,
        explanation:`Equiv=1−(1−${d1}/100)(1−${d2}/100)=${equiv}%.`,subtopic:'Equivalent Discount'};},
  ],
  'simple-interest': [
    () => { const P=getRandomInt(5,15)*1000,r=getRandomInt(8,15),n=3;
      const SI=Math.round(P*r*n/100),A=P+SI;
      return{question:`₹${P} at ${r}% SI for ${n} years. Amount?`,options:makeOptions(A,500,3000),answer:0,explanation:`SI=${P}×${r}×${n}/100=₹${SI}. A=₹${A}.`,subtopic:'SI Amount'};},
    () => { const A1=getRandomInt(8,14)*1000,t1=getRandomInt(2,4),A2=getRandomInt(A1+500,A1+3000),t2=t1+getRandomInt(2,4);
      const P=Math.round((A2*t1-A1*t2)/(t1-t2)),r=Math.round((A1-P)*100/(P*t1));
      return{question:`A sum amounts to ₹${A1} in ${t1} years and ₹${A2} in ${t2} years at SI. Rate?`,options:makeOptions(r,2,5),answer:0,explanation:`SI/yr=(${A2}−${A1})/(${t2}−${t1})=₹${(A2-A1)/(t2-t1)}/yr. P=₹${P}. r=${r}%.`,subtopic:'Two Amounts SI'};},
    () => { const P=getRandomInt(6,15)*1000,r=getRandomInt(5,12),t=getRandomInt(3,6);
      const SI=Math.round(P*r*t/100);
      return{question:`Principal ₹${P}, rate ${r}%, time ${t} years. Find SI.`,options:makeOptions(SI,200,1500),answer:0,explanation:`SI=P×r×t/100=${SI}.`,subtopic:'Simple Interest'};},
    () => { const SI=getRandomInt(3,8)*1000,r=getRandomInt(5,10),t=getRandomInt(2,5);
      const P=Math.round(SI*100/(r*t));
      return{question:`SI=₹${SI}, rate=${r}%, time=${t}y. Find principal.`,options:makeOptions(P,500,2000),answer:0,explanation:`P=SI×100/(r×t)=${SI*100}/${r*t}=₹${P}.`,subtopic:'Find Principal'};},
    () => { const P=getRandomInt(5,12)*1000,r=getRandomInt(5,10);const t=100/r;const A=P*2;
      return{question:`At ${r}% SI, ₹${P} doubles in how many years?`,options:makeOptions(t,2,5),answer:0,explanation:`Doubles when SI=P. t=100/${r}=${t} years.`,subtopic:'Doubling Time'};},
    () => { const P=getRandomInt(4,10)*1000,r1=getRandomInt(5,8),r2=r1+getRandomInt(3,7),t=getRandomInt(2,5);
      const diff=Math.round(P*(r2-r1)*t/100);
      return{question:`₹${P} at ${r2}% vs ${r1}% SI for ${t} years. Difference in interest?`,options:makeOptions(diff,100,500),answer:0,explanation:`Diff=₹${P}×(${r2}−${r1})×${t}/100=₹${diff}.`,subtopic:'SI Difference'};},
  ],
  'compound-interest': [
    () => { const P=getRandomInt(5,12)*1000,r=getRandomInt(8,15),t=3;
      const A=Math.round(P*Math.pow(1+r/100,t));
      return{question:`₹${P} at ${r}% CI annually for ${t} years. Amount?`,options:makeOptions(A,500,5000),answer:0,explanation:`A=${P}×(1+${r}/100)^3≈₹${A}.`,subtopic:'CI Amount'};},
    () => { const P=getRandomInt(5,15)*1000,r=getRandomInt(8,15);
      const ci2=Math.round(P*(Math.pow(1+r/100,2)-1));
      const si2=Math.round(P*r*2/100),diff=ci2-si2;
      return{question:`For ₹${P} at ${r}% for 2 years, CI−SI=?`,options:makeOptions(diff,20,200),answer:0,explanation:`CI=${ci2},SI=${si2}. Diff=${diff}=(P×r²/10000).`,subtopic:'CI−SI'};},
    () => { const t=getRandomInt(3,7);
      return{question:`CI: sum doubles in ${t} years. When does it quadruple?`,options:makeOptions(2*t,3,10),answer:0,explanation:`Quadruple=double twice: ${t}+${t}=${2*t} years.`,subtopic:'Doubling→Quadrupling'};},
    () => { const P=getRandomInt(5,10)*1000,r=getRandomInt(10,20),t=2;
      const ciH=Math.round(P*(Math.pow(1+r/200,2*t)-1));
      return{question:`₹${P} at ${r}% half-yearly for ${t} years. CI?`,options:makeOptions(ciH,500,3000),answer:0,explanation:`CI=P×[(1+${r}/200)^${2*t}−1]≈₹${ciH}.`,subtopic:'Half-yearly CI'};},
    () => { const P=getRandomInt(6,14)*1000,r1=getRandomInt(8,12),r2=getRandomInt(12,18);
      const A=Math.round(P*(1+r1/100)*(1+r2/100));
      return{question:`₹${P} at ${r1}% first year, ${r2}% second year CI. Amount after 2 years?`,options:makeOptions(A,500,4000),answer:0,explanation:`A=${P}×(1+${r1}/100)×(1+${r2}/100)=₹${A}.`,subtopic:'Variable Rate CI'};},
    () => { const loan=getRandomInt(10,20)*1000,r=getRandomInt(10,15),factor=1+r/100;
      const inst=Math.round(loan*factor*factor/(factor+1));
      return{question:`₹${loan} borrowed at ${r}% CI. Repaid in 2 equal annual installments. Installment?`,options:makeOptions(inst,1000,5000),answer:0,explanation:`x+x/(1+r/100)=${loan}×(1+r/100)^2/(1+r/100+1)≈₹${inst}.`,subtopic:'CI Installments'};},
  ],
  'time-work': [
    () => { const a=getRandomInt(12,20),b=getRandomInt(15,25);
      const abTog=Math.round(a*b/(a+b)*10)/10;
      return{question:`A alone: ${a} days. B alone: ${b} days. Together?`,options:makeOptions(Math.round(abTog),1,4),answer:0,explanation:`Together=a×b/(a+b)=${a*b}/${a+b}≈${Math.round(abTog)} days.`,subtopic:'Combined Work'};},
    () => { const a=getRandomInt(10,20),b=getRandomInt(15,30),days=getRandomInt(3,7);
      const rem=1-days*(1/a+1/b),timeB=Math.round(rem*b);
      return{question:`A & B together for ${days} days, then B leaves. A finishes in ${timeB} more days. A alone?`,options:makeOptions(a,3,8),answer:0,explanation:`Work left when B leaves=${rem.toFixed(2)}. A takes ${timeB}d. A's rate=1/${a}.`,subtopic:'Work Left'};},
    () => { const men=getRandomInt(6,12),days=getRandomInt(10,20),leaveAfter=getRandomInt(3,7);
      const totalWork=men*days,workDone=men*leaveAfter,rem=totalWork-workDone,half=Math.floor(men/2),extra=Math.ceil(rem/half);
      return{question:`${men} men can do a job in ${days} days. After ${leaveAfter} days, half leave. Days more to finish?`,options:makeOptions(extra,2,10),answer:0,explanation:`Total=${totalWork}. Done=${workDone}. Left=${rem}. ${half} men finish in ${extra} days.`,subtopic:'Team Reduction'};},
    () => { const a=getRandomInt(8,15),b=getRandomInt(10,20),c=getRandomInt(12,25);
      const all3=Math.round(a*b*c/(a*b+b*c+c*a)*10)/10;
      return{question:`A,B,C take ${a},${b},${c} days alone. Together?`,options:makeOptions(Math.round(all3),1,4),answer:0,explanation:`Together=1/(1/${a}+1/${b}+1/${c})≈${Math.round(all3)} days.`,subtopic:'Three Together'};},
    () => { const f1=getRandomInt(4,8),f2=getRandomInt(6,12),e1=getRandomInt(10,20),t=getRandomInt(3,8);
      const net=t*(1/f1+1/f2-1/e1),filled=Math.min(1,Math.max(0,net));
      const totalT=Math.round(1/(1/f1+1/f2-1/e1));
      return{question:`Pipe A fills in ${f1}h, B in ${f2}h. Pipe C drains in ${e1}h. All open — tank full in?`,options:makeOptions(totalT,2,8),answer:0,explanation:`Net rate=1/${f1}+1/${f2}−1/${e1}. Time=${totalT}h.`,subtopic:'Pipe & Drain'};},
    () => { const eff=getRandomInt(2,4),a=getRandomInt(12,20);
      const b=Math.round(a*eff);
      return{question:`A is ${eff}× as efficient as B. Together they finish in ${Math.round(a*b/(a+b))} days. A alone?`,options:makeOptions(a,3,8),answer:0,explanation:`B takes ${b} days. Together=a×b/(a+b)=${Math.round(a*b/(a+b))}. A=${a} days.`,subtopic:'Efficiency Ratio'};},
  ],
  'time-distance': [
    () => { const total=getRandomInt(100,300),s1=getRandomInt(30,60),s2=getRandomInt(50,90),t=getRandomInt(2,5);
      const dist=s1*t;
      return{question:`Two places ${total}km apart. Train A at ${s1}km/h, Train B at ${s2}km/h, opposite. Meet after?`,options:makeOptions(Math.round(total*60/(s1+s2)),5,20),answer:0,explanation:`Time=${total}/(${s1}+${s2})h=${Math.round(total*60/(s1+s2))}min.`,subtopic:'Opposite Meeting'};},
    () => { const s1=getRandomInt(40,70),s2=s1+getRandomInt(20,40),gap=getRandomInt(60,120);
      const t=Math.round(gap*60/(s2-s1));
      return{question:`A leaves at ${s1}km/h. B starts ${gap} min later at ${s2}km/h (same dir). B overtakes A after (from B's start)?`,options:makeOptions(t,15,60),answer:0,explanation:`Head start=${s1}×${gap}/60km. Closing speed=${s2-s1}km/h. Time=${Math.round(s1*gap/60/(s2-s1)*60)}min.`,subtopic:'Overtaking Time'};},
    () => { const u=getRandomInt(40,80),pct=getRandomInt(20,50),dist=getRandomInt(60,200);
      const v=Math.round(u*(1-pct/100)),timeSaved=Math.round(dist/v*60)-Math.round(dist/u*60);
      return{question:`Speed decreased by ${pct}%. Journey ${dist}km. Extra time (minutes)?`,options:makeOptions(timeSaved,5,30),answer:0,explanation:`Old=${Math.round(dist/u*60)}min. New=${Math.round(dist/v*60)}min. Extra=${timeSaved}min.`,subtopic:'Speed Decrease'};},
    () => { const s=getRandomInt(60,100),pct=getRandomInt(20,40);
      const timePct=Math.round(pct*100/(100+pct));
      return{question:`Speed increases ${pct}%. By what % does time reduce for same distance?`,options:[`${timePct}%`,`${pct}%`,`${timePct+2}%`,`${100-timePct}%`],answer:0,explanation:`T∝1/S. New time=(1/(1+${pct}/100))=100/(100+${pct}). Reduction=${timePct}%.`,subtopic:'Speed-Time Relation'};},
    () => { const d1=getRandomInt(50,150),s1=getRandomInt(40,70),d2=getRandomInt(40,120),s2=getRandomInt(50,80),d3=getRandomInt(30,80),s3=getRandomInt(60,90);
      const avgS=Math.round((d1+d2+d3)/(d1/s1+d2/s2+d3/s3));
      return{question:`Journey: ${d1}km@${s1}, ${d2}km@${s2}, ${d3}km@${s3} km/h. Average speed?`,options:[`${avgS}km/h`,`${Math.round((s1+s2+s3)/3)}km/h`,`${avgS+2}km/h`,`${avgS-2}km/h`],answer:0,explanation:`Avg=(${d1+d2+d3})/(${d1}/${s1}+${d2}/${s2}+${d3}/${s3})=${avgS}km/h.`,subtopic:'3-leg Average Speed'};},
    () => { const a=getRandomInt(30,60),b=getRandomInt(40,70),dist=getRandomInt(100,300);
      const tMeet=dist/(a+b),distA=Math.round(a*tMeet);
      return{question:`A & B walk towards each other (${dist}km apart) at ${a} & ${b}km/h. Where do they meet from A's side?`,options:makeOptions(distA,10,40),answer:0,explanation:`Time=${dist}/(${a}+${b})h. A covers ${a}×${tMeet.toFixed(2)}=${distA}km.`,subtopic:'Meeting Point'};},
  ],
  'boats-streams': [
    () => { const u=getRandomInt(6,14),v=getRandomInt(2,u-2),d=getRandomInt(20,60);
      const tUp=d/(u-v),tDown=d/(u+v),total=Math.round((tUp+tDown)*10)/10;
      return{question:`Boat: ${u}km/h still, stream: ${v}km/h. ${d}km each way. Total time?`,options:[`${total}h`,`${(d*2/u).toFixed(1)}h`,`${(total+1).toFixed(1)}h`,`${(total-1).toFixed(1)}h`],answer:0,explanation:`Up=${d}/${u-v}h,Down=${d}/${u+v}h. Total=${total}h.`,subtopic:'Round Trip'};},
    () => { const d=getRandomInt(30,80),tUp=getRandomInt(3,8),tDown=getRandomInt(1,tUp-1);
      const b=(d/tDown+d/tUp)/2,s=(d/tDown-d/tUp)/2;
      return{question:`Boat: ${d}km upstream in ${tUp}h, same downstream in ${tDown}h. Still water speed?`,options:makeOptions(Math.round(b),2,5),answer:0,explanation:`Up=${(d/tUp).toFixed(1)},Down=${(d/tDown).toFixed(1)}km/h. Still=(up+down)/2=${Math.round(b)}km/h.`,subtopic:'Find Boat Speed'};},
    () => { const b=getRandomInt(8,15),s=getRandomInt(2,5),d=getRandomInt(40,100);
      const tUp=Math.round(d/(b-s)*10)/10,tDown=Math.round(d/(b+s)*10)/10;
      return{question:`Boat ${b}km/h, stream ${s}km/h. Time ratio upstream:downstream for ${d}km?`,options:[`${(b+s)}:${(b-s)}`,`${b-s}:${b+s}`,`${tUp}:${tDown}`,`1:1`],answer:0,explanation:`Up time/${d}=1/${b-s}. Down time/${d}=1/${b+s}. Ratio=(${b+s}):(${b-s}).`,subtopic:'Time Ratio'};},
    () => { const u=getRandomInt(4,10),v=getRandomInt(1,u-2),d=getRandomInt(20,60);
      const dist=Math.round((u+v)*d/2+(u-v)*d/2);
      return{question:`Boat can go ${u+v}km/h downstream, ${u-v}km/h upstream. Distance in ${d}h rowing downstream?`,options:makeOptions((u+v)*d,10,50),answer:0,explanation:`Downstream speed=${u+v}km/h. Dist=${u+v}×${d}=${(u+v)*d}km.`,subtopic:'Downstream Distance'};},
    () => { const b=getRandomInt(10,20),s=getRandomInt(3,7);
      const equivStillDist=getRandomInt(30,80),t=equivStillDist/b;
      const upDist=Math.round((b-s)*t),downDist=Math.round((b+s)*t);
      return{question:`In time a boat covers ${equivStillDist}km in still water (speed ${b}km/h, stream ${s}km/h), it covers — km upstream and — km downstream: which is correct?`,options:[`${upDist} up, ${downDist} down`,`${downDist} up, ${upDist} down`,`${equivStillDist} up, ${equivStillDist} down`,`Cannot determine`],answer:0,explanation:`t=${equivStillDist}/${b}h. Up=${b-s}×t=${upDist}km. Down=${b+s}×t=${downDist}km.`,subtopic:'Equivalent Distance'};},
  ],
  'trains': [
    () => { const l1=getRandomInt(150,300),l2=getRandomInt(150,300),tOpp=getRandomInt(12,25),tSame=getRandomInt(40,80);
      const s1=Math.round((l1+l2)/2*(1/tOpp+1/tSame)/1000*3600),s2=Math.round((l1+l2)/2*(1/tOpp-1/tSame)/1000*3600);
      return{question:`Trains (${l1}m,${l2}m) cross in ${tOpp}s opposite, ${tSame}s same direction. Speeds?`,options:[`${s1}km/h & ${s2}km/h`,`${s1+5}&${s2}`,`${s1}&${s2+5}`,`${s2}&${s1}`],answer:0,explanation:`Sum=${(l1+l2)/tOpp}m/s,Diff=${(l1+l2)/tSame}m/s. Speeds≈${s1}&${s2}km/h.`,subtopic:'Two Trains — Both Directions'};},
    () => { const len=getRandomInt(200,400),speed=getRandomInt(54,108),plat=getRandomInt(200,500);
      const t=Math.round((len+plat)/(speed/3.6));
      return{question:`${len}m train at ${speed}km/h crosses ${plat}m platform. Time?`,options:makeOptions(t,3,12),answer:0,explanation:`Total=${len+plat}m. Speed=${(speed/3.6).toFixed(1)}m/s. t=${t}s.`,subtopic:'Platform Crossing'};},
    () => { const tLen=getRandomInt(150,300),tSpeed=getRandomInt(54,90),pole=getRandomInt(5,12);
      const len=Math.round(tSpeed/3.6*pole);
      return{question:`Train passes a pole in ${pole}s at ${tSpeed}km/h. Length?`,options:makeOptions(len,20,80),answer:0,explanation:`Length=${tSpeed}km/h×${pole}s=${(tSpeed/3.6).toFixed(1)}×${pole}=${len}m.`,subtopic:'Train Length from Pole'};},
    () => { const gap=getRandomInt(100,500),s1=getRandomInt(54,90),s2=getRandomInt(36,72),delay=getRandomInt(10,30);
      const headStart=s1*delay/60,catchT=Math.round(headStart/(s2/3.6-s1/3.6)*60);
      // Train B at s2 chases train A at s1 after delay minutes
      const rel=(s2-s1)/3.6;
      const startGap=s1*delay/3600*1000;
      const time=Math.round(startGap/rel);
      return{question:`Train A leaves at ${s1}km/h. Train B leaves ${delay}min later at ${s2}km/h. How long until B catches A?`,options:makeOptions(time,20,120),answer:0,explanation:`Head start=${startGap.toFixed(0)}m. Rel speed=${rel.toFixed(1)}m/s. t=${time}s=${Math.round(time/60)}min.`,subtopic:'Train Overtaking'};},
    () => { const l1=getRandomInt(100,250),l2=getRandomInt(100,250),s=getRandomInt(54,90),mult=getRandomInt(2,3);
      const s2=s*mult,tOpp=Math.round((l1+l2)/((s+s2)/3.6));
      return{question:`Train A (${l1}m, ${s}km/h), Train B (${l2}m, ${s*mult}km/h) opposite. Crossing time?`,options:makeOptions(tOpp,3,12),answer:0,explanation:`Rel=${(s+s2)/3.6}m/s. t=(${l1+l2})/${(s+s2)/3.6}≈${tOpp}s.`,subtopic:'Opposite Crossing'};},
    () => { const plat=getRandomInt(200,500),tPlat=getRandomInt(25,45),speed=getRandomInt(54,90);
      const tLen=Math.round(speed/3.6*tPlat-plat);
      return{question:`Train at ${speed}km/h crosses ${plat}m platform in ${tPlat}s. Train length?`,options:makeOptions(tLen,30,100),answer:0,explanation:`Total dist=${(speed/3.6*tPlat).toFixed(0)}m. Length=${Math.round(speed/3.6*tPlat)}−${plat}=${tLen}m.`,subtopic:'Length from Platform'};},
  ],
  'permutation-combination': [
    () => { const n=getRandomInt(7,10),r=getRandomInt(3,5),ans=fact(n)/(fact(n-r));
      return{question:`Permutations of ${r} letters chosen from ${n} distinct letters (order matters)?`,options:makeOptions(ans,100,5000),answer:0,explanation:`P(${n},${r})=${n}!/${(n-r)}!=${ans}.`,subtopic:'Permutations'};},
    () => { const men=getRandomInt(4,7),women=getRandomInt(3,5),size=getRandomInt(4,6);
      const tot=nCr(men+women,size);let atLeast1W=0;
      for(let w=1;w<=Math.min(women,size);w++){const m=size-w;if(m<=men)atLeast1W+=nCr(women,w)*nCr(men,m);}
      return{question:`Committee of ${size} from ${men} men & ${women} women with at least 1 woman. Ways?`,options:makeOptions(atLeast1W,20,200),answer:0,explanation:`Total−all men: C(${men+women},${size})−C(${men},${size})=${tot}−${nCr(men,size)}=${atLeast1W}.`,subtopic:'At-least 1 Woman'};},
    () => { const n=getRandomInt(5,7),r=getRandomInt(2,3);
      const arrangements=fact(n)*fact(n-r+1)/fact(n-r+1-r+1);
      const ans=nCr(n,r)*fact(r);
      return{question:`How many ways to arrange ${r} people in a row from ${n} people?`,options:makeOptions(ans,20,500),answer:0,explanation:`P(${n},${r})=${n}!/${(n-r)}!=${ans}.`,subtopic:'Arrange r from n'};},
    () => { const n=getRandomInt(6,9),k=getRandomInt(2,3);
      const total=fact(n),noKtogether=nCr(n-k+1,k)*fact(k)*fact(n-k);
      const apart=total-noKtogether;
      return{question:`${n} people in a row. ${k} specific people must NOT be together. Ways?`,options:makeOptions(total-fact(n-k+1)*fact(k),1000,500000),answer:0,explanation:`Total−(together)=${n}!−${k}!×${n-k+1}!=${total-fact(n-k+1)*fact(k)}.`,subtopic:'Not Together'};},
    () => { const n=getRandomInt(4,6),r=getRandomInt(2,n-1);
      const digits=Array.from({length:n},(_,i)=>i+1);
      const ans=fact(n-1)*r;
      return{question:`How many ${r}-digit numbers can be formed from 1 to ${n} (no repetition)?`,options:makeOptions(nCr(n,r)*fact(r),20,500),answer:0,explanation:`P(${n},${r})=${nCr(n,r)*fact(r)}.`,subtopic:'Number Formation'};},
    () => { const rows=getRandomInt(4,7),seatsPerRow=getRandomInt(4,7),n=getRandomInt(3,5);
      const ans=nCr(rows*seatsPerRow,n)*fact(n);
      return{question:`${rows*seatsPerRow} seats (${rows} rows). Select and arrange ${n} people?`,options:makeOptions(nCr(rows*seatsPerRow,n)*fact(n),1000,100000),answer:0,explanation:`Select C(${rows*seatsPerRow},${n}), arrange ${n}!. Total=${nCr(rows*seatsPerRow,n)*fact(n)}.`,subtopic:'Select & Arrange'};},
  ],
  'probability': [
    () => { const n=getRandomInt(5,8),k=getRandomInt(2,n-2),fav=nCr(n,k),tot=Math.pow(2,n),g=gcd(fav,tot);
      return{question:`Fair coin tossed ${n} times. P(exactly ${k} heads)?`,options:[`${fav/g}/${tot/g}`,`${k}/${n}`,`${fav-1}/${tot}`,`${k}/${tot}`],answer:0,explanation:`C(${n},${k})/2^${n}=${fav}/${tot}=${fav/g}/${tot/g}.`,subtopic:'Binomial Probability'};},
    () => { const red=getRandomInt(4,7),blue=getRandomInt(3,6),n=red+blue;
      const favOneEach=red*blue,tot=nCr(n,2),g=gcd(favOneEach,tot);
      return{question:`Bag: ${red} red, ${blue} blue. Draw 2. P(1 red,1 blue)?`,options:[`${favOneEach/g}/${tot/g}`,`${red}/${n}×${blue}/${n}`,`${favOneEach-1}/${tot}`,`2/${n}`],answer:0,explanation:`P=${red}×${blue}/C(${n},2)=${favOneEach}/${tot}=${favOneEach/g}/${tot/g}.`,subtopic:'Mixed Draw'};},
    () => { const pA=getRandomInt(3,7),pB=getRandomInt(4,8),d=getRandomInt(10,15);
      const pAtB=Math.min(pA,pB),pAorB=pA+pB-pAtB,g=gcd(pAorB,d);
      return{question:`P(A)=${pA}/${d}, P(B)=${pB}/${d}, A & B independent. P(A or B)?`,options:[`${pAorB/g}/${d/g}`,`${(pA+pB)/gcd(pA+pB,d)}/${d/gcd(pA+pB,d)}`,`${pA*pB}/${d*d}`,`1`],answer:0,explanation:`P(A∪B)=P(A)+P(B)−P(A)P(B)=${pA/d}+${pB/d}−${pA*pB/(d*d)}≈${pAorB/g}/${d/g}.`,subtopic:'Union Probability'};},
    () => { const n=getRandomInt(3,5),pFail=getRandomInt(1,3),pD=getRandomInt(4,6);
      const allFail=Math.pow(pFail,n),allD=Math.pow(pD,n),g=gcd(allD-allFail,allD);
      return{question:`P(fail)=${pFail}/${pD}. ${n} independent attempts. P(at least 1 pass)?`,options:[`${(allD-allFail)/g}/${allD/g}`,`1/${pD}`,`${n}×(${pD-pFail})/${pD}`,`(${pD-pFail}/${pD})^${n}`],answer:0,explanation:`1−(${pFail}/${pD})^${n}=1−${allFail}/${allD}=${(allD-allFail)/g}/${allD/g}.`,subtopic:'At-least Probability'};},
    () => { const w=getRandomInt(3,6),b=getRandomInt(4,7),n=w+b,k=2;
      const bothW=nCr(w,k),total=nCr(n,k),g=gcd(bothW,total);
      return{question:`Bag: ${w} white, ${b} black. P(both drawn are white)?`,options:[`${bothW/g}/${total/g}`,`${w}/${n}×${w-1}/${n-1}`,`${w}/${n}`,`${bothW}/${n*n}`],answer:0,explanation:`C(${w},2)/C(${n},2)=${bothW}/${total}=${bothW/g}/${total/g}.`,subtopic:'Both White'};},
    () => { const s1=getRandomInt(1,3),s2=getRandomInt(4,6),d=6;
      const p1=s1/d,p2=s2/d,both=Math.round(p1*p2*100)/100;
      return{question:`Two dice: P(first shows ≤${s1} AND second shows ≥${s2})?`,options:[`${s1*s2}/36`,`${s1}/6×${7-s2}/6`,`${s1}/${d}`,`${(7-s2)}/6`],answer:0,explanation:`P=${s1}/6×${7-s2}/6=${s1*(7-s2)}/36.`,subtopic:'Independent Dice'};},
  ],
  'mensuration': [
    () => { const r=getRandomInt(5,12),vol=Math.round(4/3*Math.PI*r*r*r);
      return{question:`Volume of sphere radius ${r}cm? (Use π=22/7)`,options:makeOptions(Math.round(4/3*22/7*r*r*r),100,1000),answer:0,explanation:`V=4/3×22/7×${r}³=${Math.round(4/3*22/7*r*r*r)}cm³.`,subtopic:'Sphere Volume'};},
    () => { const r=getRandomInt(3,7),h=getRandomInt(8,15),csa=Math.round(22/7*r*Math.sqrt(r*r+h*h));
      return{question:`Cone r=${r}cm,h=${h}cm. Curved surface area? (π=22/7)`,options:makeOptions(csa,20,100),answer:0,explanation:`CSA=πrl=22/7×${r}×${Math.round(Math.sqrt(r*r+h*h)*10)/10}=${csa}cm².`,subtopic:'Cone CSA'};},
    () => { const r=getRandomInt(3,8),h=getRandomInt(6,14),vol=Math.round(22/7*r*r*h);
      return{question:`Cylinder r=${r}cm,h=${h}cm. Volume? (π=22/7)`,options:makeOptions(vol,50,500),answer:0,explanation:`V=πr²h=22/7×${r}²×${h}=${vol}cm³.`,subtopic:'Cylinder Volume'};},
    () => { const a=getRandomInt(4,10),b=getRandomInt(3,a-1),c=Math.round(Math.sqrt((a-b)*(a-b)+getRandomInt(9,25)));
      const area=Math.round(0.5*b*Math.sqrt(a*a-(b/2)*(b/2)));
      return{question:`Isosceles triangle: equal sides ${a}cm, base ${b}cm. Area?`,options:makeOptions(area,5,40),answer:0,explanation:`h=√(${a}²−(${b}/2)²). Area=½×${b}×h≈${area}cm².`,subtopic:'Triangle Area'};},
    () => { const r=getRandomInt(4,8),sr=getRandomInt(2,r-1),cones=Math.round((4/3*r*r*r)/(1/3*sr*sr*getRandomInt(4,8)));
      const h=getRandomInt(4,8);const num=Math.round(4*r*r*r/(sr*sr*h));
      return{question:`Sphere r=${r}cm melted → cones r=${sr}cm,h=${h}cm. Number of cones?`,options:makeOptions(num,3,20),answer:0,explanation:`Sphere vol=4r³/3. Cone vol=r²h/3. N=4×${r}³/(${sr}²×${h})=${num}.`,subtopic:'Solid to Cones'};},
    () => { const l=getRandomInt(10,20),b=getRandomInt(8,15),h=getRandomInt(6,10),tsa=2*(l*b+b*h+h*l);
      return{question:`Cuboid ${l}×${b}×${h}cm. Total surface area?`,options:makeOptions(tsa,50,200),answer:0,explanation:`TSA=2(lb+bh+hl)=2(${l*b}+${b*h}+${h*l})=${tsa}cm².`,subtopic:'Cuboid TSA'};},
  ],
  'statistics': [
    () => { const vals=Array.from({length:6},()=>getRandomInt(10,40));
      const s=vals.reduce((a,b)=>a+b,0),mean=Math.round(s/6);
      const v=Math.round(vals.map(x=>(x-mean)**2).reduce((a,b)=>a+b,0)/6);
      const sd=Math.round(Math.sqrt(v)*10)/10;
      return{question:`Data: ${vals.join(',')}. Standard deviation?`,options:[`${sd}`,`${(sd+1.5).toFixed(1)}`,`${v}`,`${(sd-1).toFixed(1)}`],answer:0,explanation:`Mean=${mean},Var=${v},SD=√${v}≈${sd}.`,subtopic:'Standard Deviation'};},
    () => { const n1=getRandomInt(10,20),m1=getRandomInt(40,60),sd1=getRandomInt(5,10);
      const n2=getRandomInt(15,25),m2=getRandomInt(60,80),sd2=getRandomInt(6,12);
      const cMean=Math.round((n1*m1+n2*m2)/(n1+n2));
      return{question:`Group A: n=${n1},mean=${m1},SD=${sd1}. Group B: n=${n2},mean=${m2},SD=${sd2}. Combined mean?`,options:makeOptions(cMean,2,8),answer:0,explanation:`Combined mean=(${n1}×${m1}+${n2}×${m2})/${n1+n2}=${cMean}.`,subtopic:'Combined Mean'};},
    () => { const data=[5,8,10,12,15,8,10,8];
      const mode=8,freq=3,range=Math.max(...data)-Math.min(...data);
      return{question:`Data: 5,8,10,12,15,8,10,8. Mode and Range?`,options:[`Mode=8,Range=${range}`,`Mode=10,Range=${range}`,`Mode=8,Range=${range+2}`,`Mode=12,Range=${range}`],answer:0,explanation:`8 appears ${freq} times→Mode=8. Range=${Math.max(...data)}−${Math.min(...data)}=${range}.`,subtopic:'Mode & Range'};},
    () => { const mean=getRandomInt(40,70),n=getRandomInt(15,30),wrong=getRandomInt(10,30),correct=wrong+getRandomInt(15,35);
      const newMean=((mean*n-wrong+correct)/n).toFixed(1);
      return{question:`Mean of ${n} values=${mean}. Value ${wrong} should be ${correct}. Correct mean?`,options:[`${newMean}`,`${mean}`,`${(parseFloat(newMean)+1).toFixed(1)}`,`${(parseFloat(newMean)-1).toFixed(1)}`],answer:0,explanation:`Corrected sum=${mean*n-wrong+correct}. Mean=${newMean}.`,subtopic:'Error Correction'};},
    () => { const n=getRandomInt(5,9)*2+1,data=Array.from({length:n},()=>getRandomInt(10,50)).sort((a,b)=>a-b);
      const median=data[Math.floor(n/2)];
      return{question:`Sorted data: ${data.join(',')}. Median?`,options:[`${median}`,`${data[Math.floor(n/2)-1]}`,`${data[Math.floor(n/2)+1]}`,`${Math.round(data.reduce((a,b)=>a+b,0)/n)}`],answer:0,explanation:`n=${n} (odd). Median=middle value=data[${Math.floor(n/2)}]=${median}.`,subtopic:'Median'};},
    () => { const m=getRandomInt(40,80),sd=getRandomInt(5,15),cv=Math.round(sd/m*100);
      return{question:`Mean=${m}, SD=${sd}. Coefficient of Variation?`,options:[`${cv}%`,`${Math.round(m/sd*100)}%`,`${cv+5}%`,`${sd}%`],answer:0,explanation:`CV=SD/Mean×100=${sd}/${m}×100=${cv}%.`,subtopic:'Coefficient of Variation'};},
  ],
};

// ─── Generator Engine (routes by difficulty) ──────────────────────────────────
export function generateQuestions(topicId, difficulty, count = 5) {
  const raw  = (difficulty || 'easy').toLowerCase().trim();
  const key  = raw === 'expert'
    ? 'Expert'
    : raw.charAt(0).toUpperCase() + raw.slice(1);

  let genPool;
  if (key === 'Expert' && EXPERT_POOL[topicId]?.length)      genPool = EXPERT_POOL[topicId];
  else if (key === 'Hard' && HARD_POOL[topicId]?.length)     genPool = HARD_POOL[topicId];
  else                                                        genPool = GENERATORS[topicId]?.[key] || [];

  if (!genPool || genPool.length === 0) return [];

  const result = [], seen = new Set(), safety = count * 8;
  let i = 0;
  while (result.length < count && i++ < safety) {
    try {
      const q = pickRandomArray(genPool)();
      if (!q?.question || q.question === 'skip' || seen.has(q.question)) continue;
      seen.add(q.question);
      q.id         = `${topicId}_${raw}_${result.length}_${getRandomInt(1000,9999)}`;
      q.difficulty = key;
      result.push(q);
    } catch { /* skip malformed template */ }
  }
  // safety fill
  while (result.length < count) {
    try {
      const q = pickRandomArray(genPool)();
      if (!q?.question) continue;
      q.id         = `${topicId}_${raw}_${result.length}_${getRandomInt(1000,9999)}`;
      q.difficulty = key;
      result.push(q);
    } catch { break; }
  }
  return result.map(prepareQuestion);
}
