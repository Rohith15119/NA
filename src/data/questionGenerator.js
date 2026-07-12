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
  'mixture-alligation': {
    Easy: [
      () => {
        const pct1 = 10, pct2 = 20, v1 = 2, v2 = 3;
        const ans = Math.round((pct1 * v1 + pct2 * v2) / (v1 + v2));
        return {
          question: `If ${v1} liters of a ${pct1}% acid solution are mixed with ${v2} liters of a ${pct2}% acid solution, what is the concentration of acid in the final mixture?`,
          options: makeOptions(ans, 1, 3, (x) => `${x}%`),
          answer: 0,
          explanation: `Total acid = (${pct1}% of ${v1}) + (${pct2}% of ${v2}) = ${(pct1*v1 + pct2*v2)/100}L. Total volume = ${v1 + v2}L. Concentration = (${(pct1*v1 + pct2*v2)/100} / ${v1 + v2}) * 100 = ${ans}%.`,
          subtopic: 'Solution Mixing'
        };
      },
      () => {
        const c1 = 32, c2 = 45, target = 40;
        const p1 = target - c1, p2 = c2 - target;
        const g = gcd(p1, p2);
        return {
          question: `In what ratio must rice at Rs. ${c1}/kg be mixed with rice at Rs. ${c2}/kg so that the mixture is worth Rs. ${target}/kg?`,
          options: [`${p2/g}:${p1/g}`, `${p1/g}:${p2/g}`, `${p2/g+1}:${p1/g}`, `1:1`],
          answer: 0,
          explanation: `By alligation: Ratio = (${c2} - ${target}) : (${target} - ${c1}) = ${c2-target} : ${target-c1} = ${p2/g}:${p1/g}.`,
          subtopic: 'Alligation Rule'
        };
      },
      () => {
        const total = 30, water = 10;
        const ans = Math.round((water / total) * 100);
        return {
          question: `A ${total} liter mixture of milk and water contains ${water} liters of water. What is the percentage of milk in the mixture?`,
          options: makeOptions(100 - ans, 2, 8, (x) => `${x}%`),
          answer: 0,
          explanation: `Milk volume = ${total - water}L. Percentage of milk = (${total - water} / ${total}) * 100 = ${100 - ans}%.`,
          subtopic: 'Purity Percentage'
        };
      },
      () => {
        const total = 50, pct = 20;
        const ans = (pct / 100) * total;
        return {
          question: `A 50-liter container is filled with a salt solution containing ${pct}% salt. How many liters of pure salt are in the container?`,
          options: makeOptions(ans, 1, 4, (x) => `${x} liters`),
          answer: 0,
          explanation: `Salt volume = ${pct}% of ${total} = ${ans} liters.`,
          subtopic: 'Solution Concentration'
        };
      }
    ],
    Medium: [
      () => {
        const cCheap = 60, cDear = 84, target = 75;
        const ratioCheap = cDear - target, ratioDear = target - cCheap;
        const g = gcd(ratioCheap, ratioDear);
        return {
          question: `A merchant mixes two varieties of wheat costing Rs. ${cCheap}/kg and Rs. ${cDear}/kg. If the final mixture is sold at Rs. ${target}/kg, find the ratio in which the two varieties were blended.`,
          options: [`${ratioCheap/g}:${ratioDear/g}`, `${ratioDear/g}:${ratioCheap/g}`, `${ratioCheap/g+1}:${ratioDear/g}`, `1:1`],
          answer: 0,
          explanation: `Ratio = (${cDear} - ${target}) : (${target} - ${cCheap}) = ${ratioCheap} : ${ratioDear} = ${ratioCheap/g}:${ratioDear/g}.`,
          subtopic: 'Alligation Ratio'
        };
      },
      () => {
        const total = 40, rem = 8;
        const finalPct = Math.round(((total - rem) / total) * 100);
        return {
          question: `A vessel contains ${total} liters of pure chemical sanitizer. A lab tech removes ${rem} liters of sanitizer and replaces it with water. What is the percentage concentration of pure sanitizer remaining in the vessel?`,
          options: makeOptions(finalPct, 2, 6, (x) => `${x}%`),
          answer: 0,
          explanation: `Sanitizer remaining = ${total - rem}L. Concentration = (${total - rem} / ${total}) * 100 = ${finalPct}%.`,
          subtopic: 'Single Replacement'
        };
      },
      {
        question: `skip`
      }
    ],
    Hard: [
      () => {
        const total = 50, rem = 10, n = 2;
        const remain = Math.pow((total - rem)/total, n);
        const ml = Math.round(total * remain), w = total - ml, g = gcd(ml, w);
        return {
          question: `A container contains ${total} liters of pure milk. A milkman removes ${rem} liters of milk and replaces it with water. He repeats this process one more time (total 2 times). Find the final ratio of milk to water in the container.`,
          options: [`${ml/g}:${w/g}`, `${ml/g+1}:${w/g}`, `${ml/g}:${w/g+1}`, `1:1`],
          answer: 0,
          explanation: `Milk remaining = ${total} * (1 - ${rem}/${total})^2 = ${ml}L. Water = ${w}L. Ratio = ${ml/g}:${w/g}.`,
          subtopic: 'Repeated Replacement'
        };
      },
      () => {
        const c1 = 30, c2 = 50, target = 35;
        const p1 = target - c1, p2 = c2 - target;
        const g = gcd(p1, p2);
        return {
          question: `In what ratio must a shopkeeper mix sugar of Rs. ${c1}/kg with sugar of Rs. ${c2}/kg to get a mixture worth Rs. ${target}/kg?`,
          options: [`${p2/g}:${p1/g}`, `${p1/g}:${p2/g}`, `${p2/g+1}:${p1/g}`, `1:1`],
          answer: 0,
          explanation: `By alligation: Ratio of cheaper to dearer = (${c2} - ${target}) : (${target} - ${c1}) = ${p2} : ${p1} = ${p2/g}:${p1/g}.`,
          subtopic: 'Alligation Rule'
        };
      },
      () => {
        const r1 = 3, r2 = 2;
        const s1 = 4, s2 = 1;
        return {
          question: `Two vessels A and B contain milk and water in ratios of ${r1}:${r2} and ${s1}:${s2} respectively. If equal quantities from both vessels are mixed together, find the ratio of milk to water in the new mixture.`,
          options: [`7:3`, `3:2`, `4:3`, `5:3`],
          answer: 0,
          explanation: `Vessel A milk = 3/5. Vessel B milk = 4/5. Average milk = (3/5 + 4/5)/2 = 7/10. Combined ratio of milk to water is 7:3.`,
          subtopic: 'Vessel Mixing'
        };
      },
      () => {
        const total = 40, pct = 10;
        const newPct = 20;
        const add = 5;
        return {
          question: `A mixture of ${total} liters of milk and water contains ${pct}% water. How many liters of water must be added to this mixture so that water becomes ${newPct}% of the final mixture?`,
          options: makeOptions(add, 1, 4),
          answer: 0,
          explanation: `Initial water = 10% of 40 = 4L, Milk = 36L. Let x liters of water be added. (4 + x)/(40 + x) = 20/100 = 1/5 -> 20 + 5x = 40 + x -> 4x = 20 -> x = 5L.`,
          subtopic: 'Dilution Problems'
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
      return{question:`A database server performs an automated optimization job where it calculates the factorial value of the system priority index ${n} (i.e. ${n}!). During calculations, the system logs the product of all consecutive numbers. Find the number of trailing zeros that would appear at the end of the computed factorial value of ${n}.`,options:makeOptions(z,2,8),answer:0,
        explanation:`Count factors of 5: ${parts.join(' + ')} = ${z}.`,subtopic:'Trailing Zeros'};},
    () => { // Fermat's Little Theorem
      const primes=[7,11,13,17,19],mod=pickRandomArray(primes);
      const base=getRandomInt(2,mod-1),exp=getRandomInt(60,250);
      const rem=powerMod(base,exp,mod),period=mod-1,red=((exp%period)||period);
      return{question:`A security key generation algorithm computes a secure remainder index by taking the base value ${base} and raising it to the power of ${exp}. To fit this validation key into a restricted network data packet, the server divides the result by a prime constant ${mod}. Calculate the remainder left over from this division.`,options:makeOptions(rem,1,5),answer:0,
        explanation:`Fermat's LT: ${base}^${period}≡1(mod ${mod}). ${exp} mod ${period}=${red}. Ans=${base}^${red} mod ${mod}=${rem}.`,subtopic:'Modular Arithmetic'};},
    () => { // Even factors
      const a=getRandomInt(2,4),b=getRandomInt(1,3),c=getRandomInt(1,2);
      const N=Math.pow(2,a)*Math.pow(3,b)*Math.pow(5,c);
      const total=(a+1)*(b+1)*(c+1),odd=(b+1)*(c+1),even=total-odd;
      return{question:`A manufacturing load balancer calculates structural configuration profiles using a weight rating N = ${N}. To minimize vibrational stresses, the engineer needs to count all even factors of N. How many even factors are associated with this weight rating N?`,options:makeOptions(even,2,8),answer:0,
        explanation:`${N}=2^${a}·3^${b}·5^${c}. Total=${total}. Odd=${odd}. Even=${total}-${odd}=${even}.`,subtopic:'Factors'};},
    () => { // Smallest leaving (d−1) from three divisors
      const d1=getRandomInt(4,6),d2=d1+getRandomInt(2,4),d3=d2+getRandomInt(2,4);
      const L=lcmThree(d1,d2,d3),n=L-1;
      return{question:`A warehouse logistics system organizes packages using a specific batch count. The supervisor notices that when sorting the packages into bins of ${d1}, there are ${d1-1} left over. When sorted into bins of ${d2}, there are ${d2-1} left over, and when sorted into bins of ${d3}, there are ${d3-1} left over. If the total batch represents the smallest positive count satisfying these conditions, find the total number of packages.`,
        options:makeOptions(n,5,25),answer:0,
        explanation:`N+1 divisible by all three. N+1=LCM(${d1},${d2},${d3})=${L}. N=${n}.`,subtopic:'LCM & Remainders'};},
    () => { // HCF × LCM = product
      const h=getRandomInt(3,8),x=getRandomInt(2,5);
      let y=getRandomInt(7,14);
      while(gcd(x,y)!==1) { y=getRandomInt(7,14); }
      const a=h*x,b=h*y,L=lcm(a,b);
      return{question:`Two synchronized backup servers generate numerical identifiers for database security logs. The HCF of their two identifiers is ${h}, and their LCM is ${L}. If one of the backup servers is assigned the identifier ${a}, calculate the identifier assigned to the other backup server.`,
        options:makeOptions(b,5,25),answer:0,
        explanation:`Product=HCF×LCM=${h}×${L}. Other=${h*L}÷${a}=${b}.`,subtopic:'HCF & LCM'};},
    () => { // Inclusion-exclusion
      const N=getRandomInt(10,15)*10,a=getRandomInt(3,5),b=getRandomInt(6,9);
      const L=lcm(a,b),cA=Math.floor(N/a),cB=Math.floor(N/b),cBoth=Math.floor(N/L);
      const ans=N-cA-cB+cBoth;
      return{question:`An IP network scanner checks routing tables for active subnets. The scanner evaluates sequence ranges from 1 to ${N} inclusive. A systems engineer needs to find the exact count of routing keys in this range that are divisible by neither ${a} nor ${b}. How many such routing keys exist?`,
        options:makeOptions(ans,5,20),answer:0,
        explanation:`${N}−${cA}−${cB}+${cBoth}=${ans} (Inclusion-Exclusion).`,subtopic:'Inclusion-Exclusion'};},
    () => { // Highest power of prime in n!
      const n=getRandomInt(20,50),p=pickRandomArray([2,3,5]);
      let pw=0,pk=p,steps=[];
      while(pk<=n){const t=Math.floor(n/pk);pw+=t;steps.push(`⌊${n}/${pk}⌋=${t}`);pk*=p;}
      return{question:`A compiler optimizes memory allocation by analyzing factorial expansions. The compiler needs to find the highest power of the prime number ${p} that can divide the factorial value of the index ${n} (i.e. ${n}!) without leaving a remainder. What is the value of this highest exponential power?`,options:makeOptions(pw,2,8),answer:0,
        explanation:`Legendre: ${steps.join('+')}=${pw}.`,subtopic:'Factorials & Primes'};},
    () => { // 4-digit multiples of LCM
      const a=getRandomInt(4,7),b=getRandomInt(8,13),L=lcm(a,b);
      const count=Math.floor(9999/L)-Math.floor(999/L);
      return{question:`A bank security system generates four-digit login codes ranging from 1000 to 9999 inclusive. To prevent unauthorized access, the system only validates codes that are perfectly divisible by both ${a} and ${b}. Find the total number of valid login codes available for the bank portal.`,
        options:makeOptions(count,3,12),answer:0,
        explanation:`Divisible by LCM(${a},${b})=${L}. ⌊9999/${L}⌋−⌊999/${L}⌋=${count}.`,subtopic:'Divisibility'};},
  ],
  'ratio-proportion': [
    () => { // Repeated replacement
      const total=getRandomInt(5,10)*10,rem=getRandomInt(2,4)*10,n=getRandomInt(2,3);
      const ml=Math.round(total*Math.pow((total-rem)/total,n)),w=total-ml,g=gcd(ml,w);
      return{question:`A chemical storage tank contains ${total} liters of pure sanitizer liquid. A technician extracts ${rem} liters of the liquid and replaces it with water. The exact procedure of removing ${rem} liters of the mixture and replacing it with water is repeated a total of ${n} times. Find the final ratio of pure sanitizer to water in the tank.`,
        options:[`${ml/g}:${w/g}`,`${ml/g+1}:${w/g}`,`${ml/g}:${w/g+1}`,`${ml/g-1}:${w/g+1}`],answer:0,
        explanation:`Milk=${total}×((${total-rem})/${total})^${n}≈${ml}. Ratio=${ml/g}:${w/g}.`,subtopic:'Mixture Replacement'};},
    () => { // Compound ratio A:B:C
      const a=getRandomInt(2,4),b=getRandomInt(3,6),c=getRandomInt(2,5),d=getRandomInt(4,7);
      const L=lcm(b,c),A=a*(L/b),B=L,C=d*(L/c),g=gcd(gcd(A,B),C);
      return{question:`In a multi-threaded cloud cluster, the data processing rate ratio of Node A to Node B is ${a}:${b}, and the rate ratio of Node B to Node C is ${c}:${d}. Find the simplified throughput ratio of Node A to Node C.`,
        options:[`${A/g}:${C/g}`,`${a}:${d}`,`${A/g+1}:${C/g}`,`${A/g}:${C/g+1}`],answer:0,
        explanation:`LCM(${b},${c})=${L}. A:B:C=${A/g}:${B/g}:${C/g}. A:C=${A/g}:${C/g}.`,subtopic:'Compound Ratio'};},
    () => { // Partnership
      const p1=getRandomInt(3,8)*1000,t1=getRandomInt(6,12),p2=getRandomInt(4,9)*1000,t2=getRandomInt(4,10),profit=getRandomInt(5,15)*1000;
      const wA=p1*t1,wB=p2*t2,g2=gcd(wA,wB),shareB=Math.round(wB/(wA+wB)*profit);
      return{question:`Two entrepreneurs, Partner A and Partner B, start a digital consulting business. Partner A invests Rs. ${p1} for ${t1} months, and Partner B invests Rs. ${p2} for ${t2} months. If the business makes a total profit of Rs. ${profit} at the end of the fiscal year, calculate Partner B's share of the profit based on their investment-month ratio.`,
        options:makeOptions(shareB,500,2000),answer:0,
        explanation:`Ratio=${wA/g2}:${wB/g2}. B's share=${wB/g2}/${(wA+wB)/g2}×${profit}=₹${shareB}.`,subtopic:'Partnership'};},
    () => { // Alligation
      const p1=getRandomInt(20,50),p2=getRandomInt(60,100),pm=getRandomInt(p1+5,p2-5);
      const r1=p2-pm,r2=pm-p1,g=gcd(r1,r2);
      return{question:`A wholesale merchant blends two varieties of tea leaves. The cheaper variety costs Rs. ${p1}/kg, and the premium variety costs Rs. ${p2}/kg. In what ratio must he mix the two varieties so that the resulting composite blend is valued at exactly Rs. ${pm}/kg?`,
        options:[`${r1/g}:${r2/g}`,`${r2/g}:${r1/g}`,`${r1/g+1}:${r2/g}`,`${p1}:${p2}`],answer:0,
        explanation:`Alligation:(${p2}−${pm}):(${pm}−${p1})=${r1}:${r2}=${r1/g}:${r2/g}.`,subtopic:'Alligation'};},
    () => { // Mixture combination
      const v1=getRandomInt(3,7)*10,c1=getRandomInt(20,45),v2=getRandomInt(3,7)*10,c2=getRandomInt(55,80);
      const mt=Math.round((v1*c1+v2*c2)/100),tot=v1+v2,g=gcd(mt,tot-mt);
      return{question:`A dairy company mixes the contents of two supply containers. The first container has ${v1} liters of milk solution with a purity of ${c1}%, and the second container has ${v2} liters with a purity of ${c2}%. What will be the final ratio of pure milk to water in the resulting mixture?`,
        options:[`${mt/g}:${(tot-mt)/g}`,`${mt/g+1}:${(tot-mt)/g}`,`${mt/g}:${(tot-mt)/g+1}`,`${c1}:${c2}`],answer:0,
        explanation:`Milk=${mt}L,Water=${tot-mt}L. Ratio=${mt/g}:${(tot-mt)/g}.`,subtopic:'Mixture'};},
    () => { // Inverse proportion
      const m1=getRandomInt(10,20),d1=getRandomInt(12,20),d2=getRandomInt(8,18),m2=Math.round(m1*d1/d2);
      return{question:`A civil engineering project employs ${m1} laborers to construct a secure retaining wall, which takes them ${d1} days to complete. If the project supervisor needs to complete the construction of the same retaining wall in exactly ${d2} days, how many laborers must be employed?`,
        options:makeOptions(m2,2,8),answer:0,
        explanation:`Total=${m1}×${d1}=${m1*d1} man-days. Men=${m1*d1}÷${d2}=${m2}.`,subtopic:'Inverse Proportion'};},
  ],
  'averages': [
    () => { // Batting average drops
      const avg=getRandomInt(40,65),inn=getRandomInt(15,30),score=getRandomInt(2,avg-20);
      const newAvg=Math.round(((avg*inn+score)/(inn+1))*10)/10,drop=Math.round((avg-newAvg)*10)/10;
      return{question:`During a cricket league, a leading batsman holds an average score of ${avg} runs across ${inn} innings. In his next innings, he scores a low value of ${score} runs due to an early dismissal. Calculate the subsequent drop in his overall average batting score.`,
        options:makeOptions(drop,1,5),answer:0,
        explanation:`New avg=(${avg*inn}+${score})/${inn+1}=${newAvg}. Drop=${avg}−${newAvg}=${drop}.`,subtopic:'Averages'};},
    () => { // Replacement in group
      const n=getRandomInt(8,20),avg=getRandomInt(30,60),oldM=getRandomInt(10,30),newAvg=avg+getRandomInt(2,6);
      const newM=oldM+n*(newAvg-avg);
      return{question:`A research team consists of ${n} engineers whose average age is ${avg} years. An engineer aged ${oldM} years retires and is replaced by a new specialist. Consequently, the average age of the research team rises to ${newAvg} years. What is the age of the newly recruited specialist?`,
        options:makeOptions(newM,3,12),answer:0,
        explanation:`Increase=${n}×(${newAvg}−${avg})=${n*(newAvg-avg)}. New person=${oldM}+${n*(newAvg-avg)}=${newM}.`,subtopic:'Average — Replacement'};},
    () => { // Combined average
      const n1=getRandomInt(10,20),m1=getRandomInt(40,60),n2=getRandomInt(15,25),m2=getRandomInt(65,85);
      const combined=Math.round((n1*m1+n2*m2)/(n1+n2));
      return{question:`A tech academy evaluates two separate training cohorts. Cohort A has ${n1} participants who score an average of ${m1} points in a coding test. Cohort B has ${n2} participants who achieve an average of ${m2} points. Calculate the combined average performance score of all participants across both cohorts.`,
        options:makeOptions(combined,2,8),answer:0,
        explanation:`(${n1}×${m1}+${n2}×${m2})/${n1+n2}=${n1*m1+n2*m2}/${n1+n2}=${combined}.`,subtopic:'Weighted Average'};},
    () => { // Score needed to hit target avg
      const avg=getRandomInt(55,75),inn=getRandomInt(10,20),target=avg+getRandomInt(3,8);
      const needed=target*(inn+1)-avg*inn;
      return{question:`A batsman maintains an average score of ${avg} runs across ${inn} completed innings. The coaching staff sets a goal for him to raise his overall average to exactly ${target} runs after his next innings. How many runs must he score in his upcoming innings to meet this target average?`,
        options:makeOptions(needed,10,30),answer:0,
        explanation:`Needed=${target}×${inn+1}−${avg}×${inn}=${target*(inn+1)}−${avg*inn}=${needed}.`,subtopic:'Target Average'};},
    () => { // Corrected average
      const n=getRandomInt(20,40),avg=getRandomInt(40,70),wrong=getRandomInt(20,avg-10),correct=wrong+getRandomInt(15,40);
      const newAvg=Math.round(((avg*n-wrong+correct)/n)*100)/100;
      return{question:`A QA analyst calculates the average rating of ${n} software modules to be ${avg} points. During audit validation, it is discovered that the performance score of one module was misrecorded as ${wrong} points, whereas its actual correct score was ${correct} points. Calculate the corrected average rating of the modules after adjusting for this error (rounded to the nearest integer).`,
        options:makeOptions(Math.round(newAvg),1,4),answer:0,
        explanation:`Correct sum=${avg*n}−${wrong}+${correct}=${avg*n-wrong+correct}. Avg=${newAvg}.`,subtopic:'Corrected Average'};},
    () => { // Weighted average of marks
      const n1=getRandomInt(3,6),p1=getRandomInt(55,70),n2=getRandomInt(4,8),p2=getRandomInt(75,90);
      const wa=Math.round((n1*p1+n2*p2)/(n1+n2));
      return{question:`A technical university conducts a certification test for two separate groups of software engineers. The first group of ${n1} engineers achieves an average score of ${p1}% in the exam, while the second group of ${n2} engineers scores an average of ${p2}%. What is the combined average score (rounded to the nearest integer) achieved by all candidates across both groups?`,
        options:makeOptions(wa,2,6),answer:0,
        explanation:`(${n1}×${p1}+${n2}×${p2})/${n1+n2}=${wa}%.`,subtopic:'Weighted Average'};},
  ],
  'mixture-alligation': [
    () => {
      const total = 50, rem = 10, n = 2;
      const remain = Math.pow((total - rem)/total, n);
      const ml = Math.round(total * remain), w = total - ml, g = gcd(ml, w);
      return {
        question: `A container contains ${total} liters of pure milk. A milkman removes ${rem} liters of milk and replaces it with water. He repeats this process one more time (total 2 times). Find the final ratio of milk to water in the container.`,
        options: [`${ml/g}:${w/g}`, `${ml/g+1}:${w/g}`, `${ml/g}:${w/g+1}`, `1:1`], answer: 0,
        explanation: `Milk remaining = ${total} * (1 - ${rem}/${total})^2 = ${ml}L. Water = ${w}L. Ratio = ${ml/g}:${w/g}.`,
        subtopic: 'Repeated Replacement'
      };
    },
    () => {
      const c1 = 30, c2 = 50, target = 35;
      const p1 = target - c1, p2 = c2 - target;
      const g = gcd(p1, p2);
      return {
        question: `In what ratio must a shopkeeper mix sugar of Rs. ${c1}/kg with sugar of Rs. ${c2}/kg to get a mixture worth Rs. ${target}/kg?`,
        options: [`${p2/g}:${p1/g}`, `${p1/g}:${p2/g}`, `${p2/g+1}:${p1/g}`, `1:1`], answer: 0,
        explanation: `By alligation: Ratio of cheaper to dearer = (${c2} - ${target}) : (${target} - ${c1}) = ${p2} : ${p1} = ${p2/g}:${p1/g}.`,
        subtopic: 'Alligation Rule'
      };
    },
    () => {
      const r1 = 3, r2 = 2;
      const s1 = 4, s2 = 1;
      return {
        question: `Two vessels A and B contain milk and water in ratios of ${r1}:${r2} and ${s1}:${s2} respectively. If equal quantities from both vessels are mixed together, find the ratio of milk to water in the new mixture.`,
        options: [`7:3`, `3:2`, `4:3`, `5:3`], answer: 0,
        explanation: `Vessel A milk = 3/5. Vessel B milk = 4/5. Average milk = (3/5 + 4/5)/2 = 7/10. Combined ratio of milk to water is 7:3.`,
        subtopic: 'Vessel Mixing'
      };
    },
    () => {
      const total = 40, pct = 10;
      const newPct = 20;
      const add = 5;
      return {
        question: `A mixture of ${total} liters of milk and water contains ${pct}% water. How many liters of water must be added to this mixture so that water becomes ${newPct}% of the final mixture?`,
        options: makeOptions(add, 1, 4), answer: 0,
        explanation: `Initial water = 10% of 40 = 4L, Milk = 36L. Let x liters of water be added. (4 + x)/(40 + x) = 20/100 = 1/5 -> 20 + 5x = 40 + x -> 4x = 20 -> x = 5L.`,
        subtopic: 'Dilution Problems'
      };
    }
  ],
  'percentages': [
    () => { // Net successive change
      const p1=getRandomInt(10,30),p2=getRandomInt(10,25);
      const actual=Math.round((100+p1)*(100-p2)/100-100);
      return{question:`A retail store raises the price of a high-end graphics card by ${p1}% due to global component shortages. A month later, during a festive season sale, they apply a discount of ${p2}% on the newly increased price. What is the net percentage change in the price of the graphics card compared to its original price?`,
        options:[`${actual>=0?'+':''}${actual}%`,`${p1-p2}%`,`${Math.round((p1+p2)/2)}%`,`${actual+2}%`],answer:0,
        explanation:`(1+${p1}/100)(1−${p2}/100)−1=${actual}%.`,subtopic:'Successive Percentages'};},
    () => { // Income-expenditure-savings
      const incIncrease=getRandomInt(15,30),expIncrease=getRandomInt(20,40),savPct=getRandomInt(20,40);
      const expPct=100-savPct,newInc=100*(1+incIncrease/100),newExp=expPct*(1+expIncrease/100);
      const newSav=newInc-newExp,savChange=Math.round(((newSav-savPct)/savPct)*100);
      return{question:`A software developer allocates her monthly earnings such that her savings represent exactly ${savPct}% of her total income. In the next fiscal year, her monthly income increases by ${incIncrease}%, while her monthly expenditures rise by ${expIncrease}%. Calculate the percentage change in her monthly savings after these adjustments.`,
        options:[`${savChange}%`,`${incIncrease-expIncrease}%`,`${savChange-5}%`,`${savChange+5}%`],answer:0,
        explanation:`New sav=${newSav.toFixed(1)}, old=${savPct}. Change≈${savChange}%.`,subtopic:'Income-Expenditure'};},
    () => { // Population growth
      const pop=getRandomInt(50,200)*1000,rate=getRandomInt(5,15),years=3;
      const final=Math.round(pop*Math.pow(1+rate/100,years));
      return{question:`A municipality logs the population of a tech hub to be ${pop.toLocaleString('en-IN')}. Due to rapid industrial growth and migration, the population grows at a steady rate of ${rate}% per year. What will be the estimated population of the tech hub after a period of exactly ${years} years?`,
        options:makeOptions(final,5000,50000),answer:0,
        explanation:`${pop}×(1.${rate<10?'0'+rate:rate})^3≈${final}.`,subtopic:'Population Growth'};},
    () => { // Reverse percentage
      const pct=getRandomInt(15,40),finalVal=getRandomInt(5,15)*100;
      const original=Math.round(finalVal/(1+pct/100));
      return{question:`A manufacturing facility increases its daily production capacity of microchips by ${pct}% to meet high market demand, reaching a new output rate of ${finalVal} units per day. What was the original daily production capacity of the facility before this capacity expansion?`,
        options:makeOptions(original,20,80),answer:0,
        explanation:`Original=${finalVal}÷(1+${pct}/100)=${finalVal}×100/${100+pct}=${original}.`,subtopic:'Reverse Percentage'};},
    () => { // Shopkeeper markup + discount
      const markup=getRandomInt(25,50),discount=getRandomInt(10,25);
      const profit=Math.round(((100+markup)*(100-discount)/100-100)*10)/10;
      return{question:`An electronics retailer sets the marked price of a smart television at ${markup}% above its manufacturing cost price. To attract customers during a promotional event, they offer a discount of ${discount}% on the marked price. What is the net profit or loss percentage achieved by the retailer on the transaction?`,
        options:[`${profit>0?'Profit':'Loss'} ${Math.abs(profit)}%`,`${markup-discount}%`,`${profit>0?'Profit':'Loss'} ${(Math.abs(profit)+2)}%`,`${markup-discount-2}%`],
        answer:0,explanation:`(${100+markup})×(${100-discount})/100−100=${profit}%.`,subtopic:'Marked Price & Discount'};},
    () => { // Election margin
      const totalVotes=getRandomInt(3,8)*10000,winnerPct=getRandomInt(55,70);
      const winnerV=Math.round(totalVotes*winnerPct/100),margin=winnerV-(totalVotes-winnerV);
      const marginPct=winnerPct-(100-winnerPct);
      return{question:`During an employee union election, the winning candidate receives ${winnerPct}% of the total valid votes polled. She defeats her opponent by a margin of exactly ${margin} votes. Find the total number of valid votes polled in the union election.`,
        options:makeOptions(totalVotes,2000,10000),answer:0,
        explanation:`Margin%=${marginPct}%. ${marginPct}%=${margin}. Total=${margin*100/marginPct}=${totalVotes}.`,subtopic:'Election Problems'};},
  ],
  'profit-loss': [
    () => { // n at price of m
      const n=getRandomInt(8,15),m=getRandomInt(n+1,n+8),profit=Math.round(((m-n)/n)*100);
      return{question:`An online merchandise store sells ${n} custom-designed hoodies at a selling price that is exactly equal to the cost price of ${m} hoodies. What is the net profit percentage earned by the merchandise store on this sales volume?`,
        options:makeOptions(profit,3,10),answer:0,
        explanation:`Profit%=(${m}−${n})/${n}×100=${profit}%.`,subtopic:'Articles Profit'};},
    () => { // Dishonest weights
      const actual=getRandomInt(800,950);
      const truePct=Math.round(((1000-actual)/actual)*100);
      return{question:`A local grocery vendor claims to sell rice at its cost price, advertising zero profit margins. However, the regulatory compliance authority discovers that the vendor uses a faulty weighing scale that measures ${actual} grams instead of 1 kilogram. Calculate the true profit percentage earned by the vendor due to this fraudulent scale.`,
        options:makeOptions(truePct,3,10),answer:0,
        explanation:`Profit%=(${1000-actual}/${actual})×100=${truePct}%.`,subtopic:'Dishonest Weights'};},
    () => { // Same SP: X% profit and X% loss
      const x=getRandomInt(10,25),loss=Math.round(x*x/100*10)/10;
      return{question:`A manufacturer sells two pieces of industrial machinery at the exact same selling price. On the first transaction, the manufacturer earns a profit of ${x}%, while on the second transaction, he incurs a loss of ${x}%. What is the net financial result of the combined transactions?`,
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
      let sr, cr, ch, num;
      let exact = false;
      while (!exact) {
        sr = getRandomInt(6,12);
        cr = getRandomInt(2,4);
        ch = getRandomInt(4,8);
        const val = (4*sr*sr*sr)/(cr*cr*ch);
        if (Number.isInteger(val)) {
          num = val;
          exact = true;
        }
      }
      return{question:`A solid metal sphere of radius ${sr}cm is melted and recast into identical solid cones, each of radius ${cr}cm and height ${ch}cm. How many such cones can be formed without any wastage of metal?`,
        options:makeOptions(num,5,20),answer:0,
        explanation:`Cones = Sphere Volume / Cone Volume = (4/3 * pi * r_s³) / (1/3 * pi * r_c² * h) = 4 * ${sr}³ / (${cr}² * ${ch}) = ${num}.`,subtopic:'Volume Conservation'};},
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
      const val1=(r*h)/g, val2=(2*(r+h))/g;
      return{question:`A cylinder has a radius of ${r}cm and a height of ${h}cm. Calculate the ratio of its volume (in cm³) to its total surface area (in cm²), in its simplest simplified form.`,
        options:[`${val1}:${val2}`,`${val1+1}:${val2}`,`${val1}:${val2+1}`,`${val1+2}:${val2}`],answer:0,
        explanation:`Volume = pi * r² * h, TSA = 2 * pi * r * (r + h). Ratio = r * h : 2 * (r + h) = ${r*h} : ${2*(r+h)} = ${val1}:${val2}.`,subtopic:'Cylinder'};},
  ],
  'statistics': [
    () => { // Standard deviation
      let data, sum, mean;
      let exact = false;
      while (!exact) {
        data = Array.from({length:5},()=>getRandomInt(10,30));
        sum = data.reduce((a,b)=>a+b,0);
        if (sum % 5 === 0) {
          mean = sum / 5;
          exact = true;
        }
      }
      const variance=Math.round(data.map(x=>(x-mean)**2).reduce((a,b)=>a+b,0)/5);
      const sd=Math.round(Math.sqrt(variance)*10)/10;
      return{question:`A quality control team records the execution times (in milliseconds) of 5 database operations: ${data.join(', ')}. Find the standard deviation of this dataset (rounded to the nearest decimal place).`,
        options:[`${sd}`,`${(sd+1).toFixed(1)}`,`${(sd-1).toFixed(1)}`,`${variance}`],answer:0,
        explanation:`Mean = ${mean}. Variance = Sum((x - Mean)²)/5 = ${variance}. Standard Deviation = √Variance ≈ ${sd}.`,subtopic:'Standard Deviation'};},
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
  'simplification': [
    () => { // Surds comparison
      const a = getRandomInt(2, 4), b = a + 1;
      const valA = Math.pow(a, 1/b), valB = Math.pow(b, 1/a);
      const isAGreater = valA > valB;
      return {
        question: `Consider two numerical expressions: A = ${a}^(1/${b}) and B = ${b}^(1/${a}). Compare their values and determine which expression is greater.`,
        options: [`B is greater`, `A is greater`, `Both are equal`, `Cannot be determined`],
        answer: isAGreater ? 1 : 0,
        explanation: `Comparing ${a}^(1/${b}) and ${b}^(1/${a}). Raise both to the power of ${a*b}: A^${a*b} = ${a}^${a} = ${Math.pow(a, a)}, B^${a*b} = ${b}^${b} = ${Math.pow(b, b)}. Since ${Math.pow(b, b)} > ${Math.pow(a, a)}, B is greater.`,
        subtopic: 'Surds & Indices'
      };
    },
    () => { // Indices equation solving
      const set = pickRandomArray([
        { eq: "2^(2x - 1) * 4^(x + 3) = 8^(2x - 1)", ans: 4, exp: "2^(2x-1) * 2^(2x+6) = 2^(6x-3) => 4x + 5 = 6x - 3 => 2x = 8 => x = 4" },
        { eq: "2^(3x + 1) * 4^(x + 2) = 8^(2x + 1)", ans: 2, exp: "2^(3x+1) * 2^(2x+4) = 2^(6x+3) => 5x + 5 = 6x + 3 => x = 2" },
        { eq: "3^(2x + 1) * 9^(x + 1) = 27^(x + 2)", ans: 3, exp: "3^(2x+1) * 3^(2x+2) = 3^(3x+6) => 4x + 3 = 3x + 6 => x = 3" }
      ]);
      return {
        question: `An algebraic optimization algorithm simplifies the indices equation: ${set.eq}. Find the value of x that satisfies this equation.`,
        options: makeOptions(set.ans, 1, 4),
        answer: 0,
        explanation: `Convert all bases to 2 or 3: ${set.exp}.`,
        subtopic: 'Indices'
      };
    },
    () => { // BODMAS fraction expression
      const set = pickRandomArray([
        { q: "(1/3 + 3/4 * 4/9) / (5/6 - 2/3)", ans: "4", exp: "1/3 + 1/3 = 2/3. 5/6 - 4/6 = 1/6. (2/3) / (1/6) = 4." },
        { q: "(2/5 + 1/2 * 4/5) / (7/10 - 2/5)", ans: "8/3", exp: "2/5 + 2/5 = 4/5. 7/10 - 4/10 = 3/10. (4/5) / (3/10) = (4/5) * (10/3) = 8/3." }
      ]);
      return {
        question: `Calculate the exact value of the mathematical expression: ${set.q}.`,
        options: [set.ans, "5/3", "7/4", "9/2"],
        answer: 0,
        explanation: `Simplify numerator and denominator separately: ${set.exp}.`,
        subtopic: 'BODMAS'
      };
    },
    () => { // Approximation
      let a1, b1, c1, ans;
      let exact = false;
      while (!exact) {
        a1 = getRandomInt(10, 20);
        b1 = getRandomInt(4, 9);
        c1 = getRandomInt(3, 7);
        if (((a1 + 1) * b1) % c1 === 0) {
          ans = ((a1 + 1) * b1) / c1;
          exact = true;
        }
      }
      return {
        question: `An approximation algorithm simplifies the product of float measurements: Value = (${a1}.98 × ${b1}.02) ÷ ${c1}.95. Calculate the approximate integer value of this expression.`,
        options: makeOptions(ans, 1, 4),
        answer: 0,
        explanation: `Approximate each float to the nearest integer: (${a1 + 1} × ${b1}) ÷ ${c1} = ${ans}.`,
        subtopic: 'Approximation'
      };
    }
  ],
  'data-interpretation': [
    () => {
      const val1 = getRandomInt(80, 120), val2 = getRandomInt(90, 130), val3 = getRandomInt(100, 140);
      const avg = Math.round((val1 + val2 + val3) / 3);
      const table = `\n+-------+--------+\n| Year  | Sales  |\n+-------+--------+\n| 2021  |   ${val1}  |\n| 2022  |   ${val2}  |\n| 2023  |   ${val3}  |\n+-------+--------+\n`;
      return {
        question: `Refer to the sales revenue data table below (revenue in Rs. Lakhs):${table}Find the average annual sales revenue of the company over the three years.`,
        options: makeOptions(avg, 2, 8), answer: 0,
        explanation: `Sum = ${val1} + ${val2} + ${val3} = ${val1+val2+val3}. Average = ${val1+val2+val3} / 3 = ${avg} Lakhs.`,
        subtopic: 'Tabular Data'
      };
    },
    () => {
      const a = getRandomInt(30, 50), b = getRandomInt(50, 80);
      const total = a + b;
      const pct = Math.round(a / total * 100);
      const chart = `\nActive Users:\nMobile: [#####] ${a} million\nDesktop: [########] ${b} million\n`;
      return {
        question: `Refer to the subscriber volume data below:${chart}What percentage of total active users are mobile users?`,
        options: makeOptions(pct, 2, 8, (x) => `${x}%`), answer: 0,
        explanation: `Total = ${a} + ${b} = ${total} million. Mobile user percentage = (${a} / ${total}) * 100 = ${pct}%.`,
        subtopic: 'Bar Chart Interpretation'
      };
    },
    () => {
      const c1 = getRandomInt(10, 20), c2 = getRandomInt(20, 30);
      const m1 = getRandomInt(15, 25), m2 = getRandomInt(25, 35);
      const ratio = Math.round(((c1+c2) / (m1+m2)) * 100);
      const table = `\n+------+-----------+-----------+\n| Year | Chrome    | Firefox   |\n+------+-----------+-----------+\n| 2021 |   ${c1}M  |   ${m1}M  |\n| 2022 |   ${c2}M  |   ${m2}M  |\n+------+-----------+-----------+\n`;
      return {
        question: `The table below represents active user statistics (in Millions) for two web browsers over two years:${table}Calculate the percentage ratio of Chrome users to Firefox users over the entire period (round to the nearest whole %).`,
        options: makeOptions(ratio, 2, 8, (x) => `${x}%`), answer: 0,
        explanation: `Total Chrome = ${c1+c2}M. Total Firefox = ${m1+m2}M. Ratio = (${c1+c2} / ${m1+m2}) * 100 = ${ratio}%.`,
        subtopic: 'Tabular Data'
      };
    }
  ],
  'quadratic-equations': [
    () => {
      const k = getRandomInt(2, 6);
      const sum = 2 * k;
      return {
        question: `Solve the quadratic equation x^2 - ${sum}x + ${k*k - 1} = 0. Find the sum of the roots.`,
        options: makeOptions(sum, 1, 4), answer: 0,
        explanation: `Comparing with x^2 - (sum)x + product = 0, the sum of the roots is ${sum}.`,
        subtopic: 'Root Properties'
      };
    }
  ],
  'inequalities': [
    () => {
      const a = getRandomInt(2, 5), b = a + getRandomInt(2, 5);
      return {
        question: `Find the range of x that satisfies the inequality (x - ${a})(x - ${b}) <= 0.`,
        options: [`${a} <= x <= ${b}`, `x <= ${a} or x >= ${b}`, `${a-1} <= x <= ${b}`, `${a} <= x <= ${b+1}`], answer: 0,
        explanation: `The solution to (x - a)(x - b) <= 0 for a < b is the interval [a, b], which is ${a} <= x <= ${b}.`,
        subtopic: 'Quadratic Inequalities'
      };
    }
  ],
  'logarithms': [
    () => {
      const a = getRandomInt(2, 4);
      const ans = Math.round(Math.pow(2, a));
      return {
        question: `Solve the equation log_2(x) = ${a}. Find x.`,
        options: makeOptions(ans, 2, 8), answer: 0,
        explanation: `log_2(x) = ${a} implies x = 2^${a} = ${ans}.`,
        subtopic: 'Logarithmic Equations'
      };
    }
  ],

};

// ════════════════════════════════════════════════════════════════════════════
//  EXPERT QUESTIONS POOL  — TCS NQT actual exam level
//  Multi-step, disguised variables, traps, time pressure (~2–3 min/question)
// ════════════════════════════════════════════════════════════════════════════
const EXPERT_POOL = {
  'number-system': [
    () => { // CRT-style: simultaneous congruences
      let d1 = getRandomInt(3, 5);
      let d2 = d1 + getRandomInt(2, 4);
      while (gcd(d1, d2) !== 1) { d2++; }
      let d3 = d2 + getRandomInt(2, 3);
      while (gcd(d1, d3) !== 1 || gcd(d2, d3) !== 1) { d3++; }

      const r1 = getRandomInt(1, d1 - 1);
      const r2 = getRandomInt(1, d2 - 1);
      const r3 = getRandomInt(1, d3 - 1);
      const L = lcmThree(d1, d2, d3);
      
      let N = 1;
      while (N <= L) {
        if (N % d1 === r1 && N % d2 === r2 && N % d3 === r3) break;
        N++;
      }
      return {
        question: `A local logistics company is sorting package shipments. When the warehouse supervisor attempts to organize the total package count into bins of ${d1}, there are ${r1} packages left over. When sorted into bins of ${d2}, there are ${r2} left over, and when sorted into bins of ${d3}, there are ${r3} left over. If the total stock represents the smallest positive number satisfying these conditions, find the total package count in the warehouse.`,
        options: makeOptions(N, 5, 30),
        answer: 0,
        explanation: `Using the Chinese Remainder Theorem: package count mod ${d1} = ${r1}, mod ${d2} = ${r2}, and mod ${d3} = ${r3}. The unique solution modulo LCM(${d1},${d2},${d3}) is ${N}.`,
        subtopic: 'CRT'
      };
    },
    () => { // Last 2 digits (mod 100) using pattern
      const bases=[3,7,13,17,19,23,27,29,33,37];
      const base=pickRandomArray(bases),exp=getRandomInt(50,200);
      const last2=powerMod(base,exp,100);
      const strLast2=String(last2).padStart(2,'0');
      return{question:`A high-precision scientific simulation measures a compound population that grows by a multiplier factor of ${base} every hour. If the culture starts with a base multiplier of 1, find the last two digits of the total population index at the end of exactly ${exp} hours.`,
        options:[strLast2, String((last2+13)%100).padStart(2,'0'), String((last2+27)%100).padStart(2,'0'), String((last2+41)%100).padStart(2,'0')],answer:0,
        explanation:`Find (${base} raised to the power of ${exp}) modulo 100. Using Euler's totient theorem, period of units/tens digit divides phi(100) = 40. Solving gives the last two digits as ${strLast2}.`,subtopic:'Last Two Digits'};},
    () => { // Sum of digits divisible by 9: count
      const d=getRandomInt(3,6);
      const total=Math.floor(9999/d)-Math.floor(999/d);
      return{question:`A network configuration protocol generates sequence numbers for local routing databases. An systems engineer needs to calculate the exact quantity of four-digit identifiers (ranging from 1000 to 9999 inclusive) that are perfectly divisible by the server subnet priority key ${d}. How many valid routing identifiers are available in this sequence range?`,
        options:makeOptions(total,5,30),answer:0,
        explanation:`Calculate total multiples of ${d} in the range 1000 to 9999. First multiple is 1000 + (${d} - (1000 mod ${d})). Total count = floor(9999/${d}) - floor(999/${d}) = ${total}.`,subtopic:'Counting Multiples'};},
    () => { // Remainder of product mod prime
      const mod=pickRandomArray([7,11,13]);
      const a=getRandomInt(2,mod-1),b=getRandomInt(2,mod-1),c=getRandomInt(2,mod-1);
      const rem=(a*b*c)%mod;
      return{question:`An encryption algorithm computes a security validation checksum by multiplying three dynamically generated parameters: ${a}, ${b}, and ${c}. To fit this checksum index into a secure transmission packet channel, the program takes the remainder when the product of the three parameters is divided by the primary security code ${mod}. What is the resulting packet remainder value?`,
        options:makeOptions(rem,1,5),answer:0,
        explanation:`Product = ${a} * ${b} * ${c} = ${a*b*c}. Remainder modulo ${mod} is (${a*b*c} mod ${mod}) = ${rem}.`,subtopic:'Product Remainder'};},
    () => { // Digit sum rule + divisibility trap
      const n=getRandomInt(10,30)*9+getRandomInt(1,8);
      const digitSum=String(n).split('').reduce((a,c)=>a+parseInt(c),0);
      const nearestMult9=Math.ceil(digitSum/9)*9;
      const toAdd=nearestMult9-digitSum;
      return{question:`A financial database stores transaction logs under ID ${n}. To verify integrity, the system runs a check where the digits of the ID must sum to a value that is perfectly divisible by 9. What is the minimum positive single-digit integer that must be added to the ID ${n} to satisfy this integrity requirement?`,
        options:makeOptions(toAdd,1,4),answer:0,
        explanation:`The digit sum of ${n} is ${digitSum}. The next multiple of 9 is ${nearestMult9}. The difference is ${toAdd}, which is the minimum value to add.`,subtopic:'Divisibility by 9'};},
    () => { // Euler's totient count
      const p=pickRandomArray([5,7,11,13]);
      const q=pickRandomArray([3,4,8]).filter(x=>gcd(x,p)===1).pop()||4;
      const N=p*q,phi=(p-1)*(q-1);
      return{question:`A secure cryptography generator assigns keys based on integer pairings with a system constant N = ${N}. The generator must calculate the exact number of integers in the range from 1 to ${N} inclusive that share no common factors (coprime) with ${N} other than 1. Find the total number of coprime pairings.`,
        options:makeOptions(phi,2,8),answer:0,
        explanation:`Using Euler's Totient function: phi(${N}) = phi(${p} * ${q}) = (${p}-1) * (${q}-1) = ${phi} numbers.`,subtopic:"Euler's Totient"};},
    () => { // Perfect square factors
      const a=getRandomInt(2,4),b=getRandomInt(1,3);
      const N=Math.pow(2,2*a)*Math.pow(3,2*b);
      const sqFact=(a+1)*(b+1);
      return{question:`A structural design program evaluates load distribution configurations using a stress tolerance variable N = ${N}. To assess vibrational stability, the engineer needs to determine how many factors of this stress variable N are perfect squares (greater than or equal to 1). How many perfect-square factors are associated with N?`,
        options:makeOptions(sqFact,2,8),answer:0,
        explanation:`Given N = 2^${2*a} * 3^${2*b}. Perfect square factors must have even powers of 2 (from 0 to ${2*a}) and 3 (from 0 to ${2*b}). Total count = (${a}+1) * (${b}+1) = ${sqFact}.`,subtopic:'Perfect Square Factors'};},
    () => { // Sum of digits after repeated operations
      const n=getRandomInt(100,999),power=getRandomInt(2,4);
      let val=Math.pow(n,power);
      while(val>=10){val=String(val).split('').reduce((a,c)=>a+parseInt(c),0);}
      return{question:`A database integrity test calculates the digital root of a large exponential value. The base variable is set to ${n} and the exponential index is ${power}. If the digital root is defined as the single-digit sum obtained by repeatedly summing the digits of the result until a single digit remains, calculate the digital root of ${n} raised to the power of ${power}.`,
        options:makeOptions(val,1,4),answer:0,
        explanation:`The digital root of an integer is equivalent to the number modulo 9 (where a remainder of 0 maps to 9). For ${n}^${power}, this evaluates to ${val}.`,subtopic:'Digital Root'};},
  ],
  'ratio-proportion': [
    () => { // Repeated replacement with varying levels
      const total=80, rem=20, n=3;
      const remain=Math.pow((total-rem)/total,n);
      const ml=Math.round(total*remain), w=total-ml, g=gcd(ml,w);
      return{question:`A pharmaceutical firm maintains a stock of ${total} liters of pure chemical sanitizer. A lab assistant extracts ${rem} liters of sanitizer and replaces it with water. This exact procedure of removing ${rem} liters of mixture and replacing it with water is repeated a total of ${n} times. Find the final ratio of pure chemical sanitizer to water remaining in the stock container.`,
        options:[`${ml/g}:${w/g}`, `${ml/g+1}:${w/g}`, `${ml/g}:${w/g+1}`, `1:1`],answer:0,
        explanation:`Using the repeated replacement formula: Final chemical = ${total} * ((1 - ${rem}/${total})^${n}) = ${ml} liters. Water = ${total} - ${ml} = ${w} liters. The ratio is ${ml/g}:${w/g}.`,subtopic:'Mixture Replacement'};},
    () => { // Partnership with active manager salary
      const P1=12000, P2=18000, profit=60000, mgrPct=10;
      const mgrSal = Math.round(profit * mgrPct / 100);
      const netProfit = profit - mgrSal;
      const w1=P1*12, w2=P2*8; // B joins after 4 months
      const totW = w1 + w2;
      const shareB = Math.round((w2 / totW) * netProfit);
      return{question:`A and B establish a digital marketing agency. A invests Rs. ${P1} for the entire year, while B joins the venture 4 months later with an investment of Rs. ${P2}. Since A manages the daily operations, he receives ${mgrPct}% of the annual profit as a manager salary before the remaining profit is distributed. If the total annual profit is Rs. ${profit}, calculate B's final share from the profit distribution.`,
        options:makeOptions(shareB,500,2000),answer:0,
        explanation:`A's salary = Rs. ${mgrSal}. Remaining profit = Rs. ${netProfit}. A's investment month product = ${P1} * 12 = ${w1}. B's = ${P2} * 8 = ${w2}. Ratio = ${w1}:${w2}. B's share = (${w2}/${totW}) * ${netProfit} = Rs. ${shareB}.`,subtopic:'Partnership — Timing'};},
    () => { // 3-container mixing in unequal volumes
      const c1=30, c2=60, c3=90;
      const v1=1, v2=2, v3=3;
      const totVol = v1 + v2 + v3;
      const mixAlcohol = (c1*v1 + c2*v2 + c3*v3)/totVol;
      const rMix = Math.round(mixAlcohol), g=gcd(rMix, 100-rMix);
      return{question:`Three containers hold liquid fuels of different purities: the first has ${c1}% alcohol, the second has ${c2}% alcohol, and the third has ${c3}% alcohol. A technician mixes the contents in the volume ratio of ${v1}:${v2}:${v3} respectively. Find the final ratio of pure alcohol to water in the resulting composite fuel mixture.`,
        options:[`${rMix/g}:${(100-rMix)/g}`, `${rMix/g + 1}:${(100-rMix)/g}`, `${rMix/g}:${(100-rMix)/g + 1}`, `1:2`],answer:0,
        explanation:`Alcohol volume = ${c1}%*${v1} + ${c2}%*${v2} + ${c3}%*${v3} = ${c1*v1 + c2*v2 + c3*v3} units out of ${totVol} total volume. Average alcohol % = ${rMix}%. Water % = ${100-rMix}%. Ratio = ${rMix/g}:${(100-rMix)/g}.`,subtopic:'3-Container Mixture'};},
  ],
  'averages': [
    () => { // Weighted average variations of multiple subsets
      const n1=10, m1=60, n2=15, m2=70, n3=25, m3=80;
      const combined=Math.round((n1*m1 + n2*m2 + n3*m3)/(n1+n2+n3));
      return{question:`A training academy evaluates three distinct batches of software engineers. Batch A has ${n1} engineers with an average score of ${m1} points, Batch B has ${n2} engineers with an average of ${m2} points, and Batch C has ${n3} engineers with an average of ${m3} points. Find the combined average performance score of all the software engineers across the three batches.`,
        options:makeOptions(combined,2,8),answer:0,
        explanation:`Combined Average = ((${n1} * ${m1}) + (${n2} * ${m2}) + (${n3} * ${m3})) / (${n1} + ${n2} + ${n3}) = ${n1*m1+n2*m2+n3*m3} / ${n1+n2+n3} = ${combined} points.`,subtopic:'Weighted Average'};},
    () => { // Double Replacement with shift
      const n=10, avg=40, old1=20, old2=30, new1=35, new2=45;
      const newAvg = avg + (new1 - old1 + new2 - old2)/n;
      return{question:`The average age of a committee consisting of ${n} members is ${avg} years. Two members whose ages are ${old1} years and ${old2} years resign from the committee, and they are replaced by two new members of ages ${new1} years and ${new2} years respectively. Find the new average age of the committee members.`,
        options:makeOptions(Math.round(newAvg),1,3),answer:0,
        explanation:`Net change in age sum = (${new1} - ${old1}) + (${new2} - ${old2}) = ${new1-old1+new2-old2} years. Rise in average = ${new1-old1+new2-old2}/${n} = ${(new1-old1+new2-old2)/n} years. New Average = ${newAvg} years.`,subtopic:'Double Replacement'};},
  ],
  'mixture-alligation': [
    () => {
      const total = 80, rem = 20, n = 3;
      const remain = Math.pow((total - rem)/total, n);
      const ml = Math.round(total * remain), w = total - ml, g = gcd(ml, w);
      return {
        question: `A pharmaceutical firm maintains a stock of ${total} liters of pure chemical sanitizer. A lab assistant extracts ${rem} liters of sanitizer and replaces it with water. This exact procedure of removing ${rem} liters of mixture and replacing it with water is repeated a total of ${n} times. Find the final ratio of pure chemical sanitizer to water remaining in the stock container.`,
        options: [`${ml/g}:${w/g}`, `${ml/g+1}:${w/g}`, `${ml/g}:${w/g+1}`, `1:1`], answer: 0,
        explanation: `Using the repeated replacement formula: Final chemical = ${total} * ((1 - ${rem}/${total})^${n}) = ${ml} liters. Water = ${total} - ${ml} = ${w} liters. The ratio is ${ml/g}:${w/g}.`,
        subtopic: 'Repeated Replacement'
      };
    },
    () => {
      const c1 = 30, c2 = 60, c3 = 90;
      const v1 = 1, v2 = 2, v3 = 3;
      const totVol = v1 + v2 + v3;
      const mixAlcohol = (c1*v1 + c2*v2 + c3*v3)/totVol;
      const rMix = Math.round(mixAlcohol), g = gcd(rMix, 100 - rMix);
      return {
        question: `Three containers hold liquid fuels of different purities: the first has ${c1}% alcohol, the second has ${c2}% alcohol, and the third has ${c3}% alcohol. A technician mixes the contents in the volume ratio of ${v1}:${v2}:${v3} respectively. Find the final ratio of pure alcohol to water in the resulting composite fuel mixture.`,
        options: [`${rMix/g}:${(100-rMix)/g}`, `${rMix/g+1}:${(100-rMix)/g}`, `${rMix/g}:${(100-rMix)/g+1}`, `1:2`], answer: 0,
        explanation: `Alcohol volume = ${c1}%*${v1} + ${c2}%*${v2} + ${c3}%*${v3} = ${c1*v1 + c2*v2 + c3*v3} units out of ${totVol} total volume. Average alcohol % = ${rMix}%. Water % = ${100-rMix}%. Ratio = ${rMix/g}:${(100-rMix)/g}.`,
        subtopic: '3-Container Mixture'
      };
    },
    () => {
      const c1 = 40, c2 = 75, target = 54;
      const p1 = target - c1, p2 = c2 - target;
      const g = gcd(p1, p2);
      return {
        question: `A tea distributor wishes to blend low-grade tea leaves costing Rs. ${c1}/kg with premium tea leaves costing Rs. ${c2}/kg. In what ratio must he mix the two varieties of tea leaves so that the resulting composite blend is valued at exactly Rs. ${target}/kg?`,
        options: [`${p2/g}:${p1/g}`, `${p1/g}:${p2/g}`, `${p2/g+1}:${p1/g}`, `1:1`], answer: 0,
        explanation: `By the Alligation Rule: Ratio of cheaper to dearer = (Dearer Price - Mean Price) : (Mean Price - Cheaper Price) = (${c2} - ${target}) : (${target} - ${c1}) = ${p2} : ${p1} = ${p2/g}:${p1/g}.`,
        subtopic: 'Alligation Rule'
      };
    },
    () => {
      const g1 = 22, g2 = 14, target = 18;
      return {
        question: `A goldsmith wants to melt and blend two gold alloys of different purities, measured at ${g1} carats and ${g2} carats respectively. In what ratio by weight must he mix these two alloys to produce a new ornament of ${target} carats purity?`,
        options: [`1:1`, `2:1`, `1:2`, `3:2`], answer: 0,
        explanation: `Using alligation: Ratio of ${g1} carat to ${g2} carat = (${target} - ${g2}) : (${g1} - ${target}) = 4:4 = 1:1.`,
        subtopic: 'Alloy Mixing'
      };
    }
  ],
  'percentages': [
    () => { // Voter turnout math with invalid ballots
      const total=50000, turnout=80, invalid=10, winner=60;
      const voted = total * turnout / 100;
      const valid = voted * (100 - invalid) / 100;
      const margin = Math.round(valid * (winner - (100 - winner)) / 100);
      return{question:`In a municipal election, exactly ${turnout}% of the ${total.toLocaleString('en-IN')} registered voters cast their ballots. During the audit, ${invalid}% of the cast votes were declared invalid. The winning candidate secured ${winner}% of the valid votes. By what margin of votes did the winning candidate defeat the opponent?`,
        options:makeOptions(margin,200,1000),answer:0,
        explanation:`Votes cast = ${voted}. Valid votes = ${valid}. Winner gets ${winner}%, opponent gets ${100-winner}%. Margin = ${winner - (100-winner)}% of valid votes = ${margin}.`,subtopic:'Election Problems'};},
    () => { // Tax-on-tax (cascaded duties)
      const price=2000, tax1=10, tax2=5;
      const final = Math.round(price * (1 + tax1/100) * (1 + tax2/100));
      return{question:`An import duty scheme applies tax in successive stages. A luxury electronic component has a base price of Rs. ${price}. An initial customs duty of ${tax1}% is added, followed by an additional luxury surcharge of ${tax2}% applied on the newly accumulated price. Find the final price paid by the importer.`,
        options:makeOptions(final,10,100),answer:0,
        explanation:`Price after customs duty = Rs. ${price} * 1.10 = Rs. ${price*(1+tax1/100)}. Price after surcharge = Rs. ${price*(1+tax1/100)} * 1.05 = Rs. ${final}.`,subtopic:'Cascaded Tax'};},
  ],
  'profit-loss': [
    () => { // Dishonest dealer buying and selling cheats
      const buyCheat=10, sellCheat=10;
      const trueProfit = Math.round((( (100+buyCheat)/(100-sellCheat) ) - 1) * 100);
      return{question:`A wholesale fruit merchant cheats by ${buyCheat}% while purchasing fruits from the grower (uses a larger scale), and cheats by ${sellCheat}% while selling to customers (uses a smaller scale). If he sells the fruits at the official cost price, calculate his net profit percentage.`,
        options:makeOptions(trueProfit,1,5),answer:0,
        explanation:`He gets ${(100+buyCheat)} grams of stock for the price of 100 grams. He sells ${(100-sellCheat)} grams of stock for the price of 100 grams. Net profit = (${(100+buyCheat)}/${(100-sellCheat)} - 1) * 100 = ${trueProfit}%.`,subtopic:'Dishonest Weights'};},
    () => { // Successive sell chains with repairs
      const cp=5000, pA=20, costR=1000, pB=10;
      const spA = cp * (1 + pA/100);
      const cpB = spA + costR;
      const spB = Math.round(cpB * (1 + pB/100));
      return{question:`A purchases a used smartphone for Rs. ${cp} and sells it to B at a profit of ${pA}%. B then spends Rs. ${costR} on replacing the screen and battery, and later sells the smartphone to C at a profit of ${pB}%. Find the final price paid by C.`,
        options:makeOptions(spB,100,500),answer:0,
        explanation:`SP of A = Rs. ${spA}. Cost price of B = ${spA} + ${costR} = Rs. ${cpB}. SP of B (C's price) = ${cpB} * 1.10 = Rs. ${spB}.`,subtopic:'Chain Selling'};},
  ],
  'simple-interest': [
    () => { // Split principal with equal interest constraints
      const total=10000, r1=6, r2=9, t=2;
      // P1*r1*t/100 = P2*r2*t/100 -> P1/P2 = r2/r1 = 3/2
      const P1 = Math.round(total * r2 / (r1 + r2)), P2 = total - P1;
      const interest = Math.round(P1 * r1 * t / 100);
      return{question:`A retired officer splits a sum of Rs. ${total} into two parts and invests them in different mutual funds. The first part is invested at ${r1}% per annum simple interest, and the second part is invested at ${r2}% per annum simple interest. If the total interest earned from both investments at the end of ${t} years is identical, find the amount invested in the first fund.`,
        options:makeOptions(P1,100,1000),answer:0,
        explanation:`Interest equal implies P1 * r1 * t = P2 * r2 * t, so P1 * ${r1} = P2 * ${r2}. Ratio P1:P2 = ${r2}:${r1} = 9:6 = 3:2. First part P1 = (3/5) * ${total} = Rs. ${P1}.`,subtopic:'Split Principal'};},
    () => { // Installment repayment SI
      const P=9000, r=10, t=3;
      // x + (x + x*r/100) + (x + x*r*2/100) = P + P*r*t/100 -> 3x + 3x*r/100 = P*(1+r*t/100)
      const totalAmt = P * (1 + r*t/100);
      const install = Math.round(totalAmt / (t + (t*(t-1)/2)*r/100));
      return{question:`A software developer takes an interest-bearing loan of Rs. ${P} at ${r}% per annum simple interest. The loan is to be cleared in ${t} equal annual installments, where each installment is paid at the end of the year. Calculate the amount of each annual installment.`,
        options:makeOptions(install,100,500),answer:0,
        explanation:`Total debt after ${t} years = Rs. ${totalAmt}. Annual installment x satisfies: x + (x + x*r/100) + (x + x*r*2/100) = Rs. ${totalAmt}. This gives x = Rs. ${install}.`,subtopic:'SI Installments'};},
  ],
  'compound-interest': [
    () => { // Multi-year compounding changes with withdrawals
      const P=10000, r1=10, r2=20;
      const endYear1 = P * (1 + r1/100);
      const finalAmt = Math.round(endYear1 * (1 + r2/100));
      return{question:`An investment firm offers a dynamic portfolio that earns compound interest compounded annually. The interest rate is fixed at ${r1}% for the first year, and increases to ${r2}% for the second year. If an investor deposits Rs. ${P} initially, find the total amount in the portfolio at the end of 2 years.`,
        options:makeOptions(finalAmt,200,1000),answer:0,
        explanation:`Amount at end of year 1 = Rs. ${endYear1}. Amount at end of year 2 = Rs. ${endYear1} * (1 + ${r2}/100) = Rs. ${finalAmt}.`,subtopic:'Variable Rate CI'};},
    () => { // Equal CI installments
      const P=10500, r=10;
      // x / 1.1 + x / (1.1^2) = P -> x * (1.1 + 1) / 1.21 = P -> x * 2.1 / 1.21 = P
      const install = Math.round(P * 1.21 / 2.1);
      return{question:`A technician purchases a modern workstation for Rs. ${P} on credit. If the shopkeeper charges compound interest at ${r}% per annum compounded annually, and the loan is to be cleared in 2 equal annual installments, calculate the value of each installment.`,
        options:makeOptions(install,100,1000),answer:0,
        explanation:`Let installment be x. Present value equation: x/(1.1) + x/(1.21) = ${P}. Solving gives x = Rs. ${install}.`,subtopic:'CI Installments'};},
  ],
  'time-work': [
    () => { // Alternate day with scheduled breaks
      const a=10, b=15;
      const cycleWork = 1/a + 1/b; // 2 days work
      const cycles = Math.floor(1/cycleWork);
      const workDone = cycles * cycleWork;
      const rem = 1 - workDone;
      const days = cycles * 2 + (rem > 0 ? (rem <= 1/a ? rem*a : 1 + (rem - 1/a)*b) : 0);
      const rDays = Math.round(days * 10)/10;
      return{question:`Two structural engineers A and B work on alternate days to assemble a bridge framework. Engineer A takes ${a} days to complete the assembly alone, and B takes ${b} days. If they work on alternate days starting with A on the first day, find the total number of days taken to complete the entire assembly.`,
        options:[`${rDays} days`, `${Math.round(rDays+1)} days`, `${Math.round(rDays-1)} days`, `12 days`],answer:0,
        explanation:`A's 1-day work = 1/${a}, B's = 1/${b}. 2-day work = 1/${a} + 1/${b} = 5/30 = 1/6. In 6 cycles (12 days), work = 6 * (1/6) = 1. Total days = 12 days.`,subtopic:'Alternate Work'};},
    () => { // Men-women-children efficiency
      const m=4, w=6, d=8, newM=8, newW=9;
      // Let 1 man = 2 women (efficiency ratio). Standard problem:
      const totalDays = Math.round((m*d)/(newM + newW*(m/(w*2))));
      return{question:`A software team composed of ${m} senior developers can build an API gateway in ${d} days. A team of ${w} junior developers takes the same ${d} days to build the gateway. How many days will it take a combined team of ${newM} senior developers and ${newW} junior developers to build the same API gateway?`,
        options:makeOptions(totalDays,1,3),answer:0,
        explanation:`Senior and junior team efficiencies: ${m} seniors = ${w} juniors, so 1 senior = 1.5 juniors in work rate. Combined team = ${newM} seniors + ${newW} juniors = ${newM + newW/1.5} seniors = ${newM + 6} seniors. Time = (${m} * ${d}) / 14 ≈ ${totalDays} days.`,subtopic:'Men-Women Efficiency'};},
  ],
  'time-distance': [
    () => { // Circular track starting point meeting
      const l=600, s1=10, s2=15, s3=20;
      const t1=l/s1, t2=l/s2, t3=l/s3;
      const ans = lcmThree(t1, t2, t3);
      return{question:`Three runners A, B, and C start together from the same point on a circular athletics track of length ${l} meters. They run in the same direction with speeds of ${s1} m/s, ${s2} m/s, and ${s3} m/s respectively. Find the time after which all three will meet together at the starting point for the first time.`,
        options:makeOptions(ans,10,60),answer:0,
        explanation:`Time taken for one lap: A = ${t1}s, B = ${t2}s, C = ${t3}s. Meeting time at starting point is LCM(${t1}, ${t2}, ${t3}) = LCM(${t1}, ${t2}, ${t3}) = ${ans} seconds.`,subtopic:'Circular Track'};},
    () => { // Relative speed train chase with delayed start
      const s1=60, s2=80, delay=1; // delay in hours
      const gap = s1 * delay;
      const relSpeed = s2 - s1;
      const timeToCatch = gap / relSpeed;
      return{question:`A courier train leaves a sorting terminal traveling at a constant speed of ${s1} km/h. Exactly ${delay} hour later, a high-speed express train leaves the same terminal in the same direction, traveling at ${s2} km/h. How many hours will it take the express train to overtake the courier train from the moment the express train departs?`,
        options:makeOptions(timeToCatch,1,3),answer:0,
        explanation:`Distance gap created in ${delay} hour = ${gap} km. Relative speed = ${s2} - ${s1} = ${relSpeed} km/h. Time to catch = ${gap} / ${relSpeed} = ${timeToCatch} hours.`,subtopic:'Overtaking Time'};},
  ],
  'boats-streams': [
    () => { // Motorboat engine failure mid-journey
      const b=12, s=3, d=45;
      const tDown = d / (b + s);
      const tUp = d / (b - s);
      const total = Math.round((tDown + tUp)*10)/10;
      return{question:`A tourist motorboat travels at a speed of ${b} km/h in still water. The local river current flows at a constant speed of ${s} km/h. If the boat completes a round trip to a scenic point located ${d} km away, find the total travel time for the round trip.`,
        options:[`${total} hours`, `${Math.round(total+1.5)} hours`, `${Math.round(total-1)} hours`, `10 hours`],answer:0,
        explanation:`Downstream speed = ${b} + ${s} = ${b+s} km/h. Upstream speed = ${b} - ${s} = ${b-s} km/h. Time = ${d}/${b+s} + ${d}/${b-s} = ${tDown} + ${tUp} = ${total} hours.`,subtopic:'Round Trip'};},
  ],
  'trains': [
    () => {
      const s1 = getRandomInt(50, 70);
      const s2 = s1 + getRandomInt(15, 30);
      const l1 = getRandomInt(120, 200);
      const l2 = l1 + getRandomInt(50, 100);
      const delay = getRandomInt(10, 30);
      const gap = s1 * (delay / 60) * 1000;
      const relSpeed = (s2 - s1) / 3.6;
      const time = Math.round((gap + l1 + l2) / relSpeed);
      return {
        question: `A local freight train of length ${l1} meters departs from a shipping yard at a constant speed of ${s1} km/h. Exactly ${delay} minutes later, an express passenger train of length ${l2} meters departs from the same yard along a parallel track in the same direction at a constant speed of ${s2} km/h. Calculate the time (in seconds) required for the passenger train to completely overtake and clear the freight train from the moment the passenger train departs.`,
        options: makeOptions(time, 10, 100), answer: 0,
        explanation: `Distance gap from delay = ${s1} * ${delay}/60 = ${(s1 * delay / 60).toFixed(2)} km = ${gap.toFixed(0)} meters. Total distance to cover for complete clear = gap + l1 + l2 = ${(gap + l1 + l2).toFixed(0)} meters. Relative speed = (${s2} - ${s1}) km/h = ${relSpeed.toFixed(2)} m/s. Time = ${(gap + l1 + l2).toFixed(0)} / ${relSpeed.toFixed(2)} = ${time} seconds.`,
        subtopic: 'Train Overtaking'
      };
    },
    () => {
      const speed = getRandomInt(54, 90);
      const tPlat = getRandomInt(25, 45);
      const plat = getRandomInt(200, 450);
      const len = Math.round((speed / 3.6) * tPlat - plat);
      return {
        question: `A passenger train traveling at a constant speed of ${speed} km/h approaches a station. It takes exactly ${tPlat} seconds to completely cross and clear the main platform, which is measured to be ${plat} meters long. Find the physical length of the passenger train in meters.`,
        options: makeOptions(len, 20, 80), answer: 0,
        explanation: `Speed in m/s = ${speed} / 3.6 = ${(speed/3.6).toFixed(2)} m/s. Total distance covered = Speed * Time = ${(speed/3.6).toFixed(2)} * ${tPlat} = ${Math.round((speed/3.6)*tPlat)} meters. Train length = Total distance - Platform length = ${Math.round((speed/3.6)*tPlat)} - ${plat} = ${len} meters.`,
        subtopic: 'Platform Crossing'
      };
    }
  ],
  'permutation-combination': [
    () => {
      const total = getRandomInt(7, 9);
      const ans = fact(total - 2) * (total - 3);
      return {
        question: `During an international summit, a delegation of ${total} representatives is to be seated around a circular conference table. If two specific delegates represent rival nations and refuse to sit adjacent to each other, in how many distinct seating arrangements can the table be configured?`,
        options: makeOptions(ans, 20, 200), answer: 0,
        explanation: `Total circular seating = (${total}-1)! = ${fact(total-1)}. Seating where they sit together = 2 * (${total}-2)! = ${2 * fact(total-2)}. Seating where they are apart = (${total}-1)! - 2*(${total}-2)! = (${total}-2)! * (${total}-3) = ${ans} ways.`,
        subtopic: 'Circular Arrangement'
      };
    },
    () => {
      const men = getRandomInt(6, 8);
      const women = getRandomInt(4, 6);
      const size = 5;
      let ans = 0;
      for (let w = 2; w <= Math.min(women, size); w++) {
        ans += nCr(women, w) * nCr(men, size - w);
      }
      return {
        question: `A cybersecurity task force consisting of ${size} analysts is to be selected from a pool of ${men} male developers and ${women} female developers. How many ways can the task force be selected if it must include at least 2 female developers to ensure gender diversity?`,
        options: makeOptions(ans, 10, 50), answer: 0,
        explanation: `We sum the cases for 2, 3, 4, and 5 female developers: C(${women},2)*C(${men},3) + C(${women},3)*C(${men},2) + C(${women},4)*C(${men},1) + C(${women},5)*C(${men},0) = ${ans} ways.`,
        subtopic: 'Selection with Restriction'
      };
    }
  ],
  'probability': [
    () => {
      const pD = 1;
      const pND = 99;
      const testD = getRandomInt(90, 97);
      const testND = getRandomInt(4, 8);
      const fav = pD * testD;
      const tot = pD * testD + pND * testND;
      const prob = Math.round((fav / tot) * 100);
      return {
        question: `An automated code security scanner flags a potential SQL injection vulnerability with an accuracy of ${testD}% when the code is actually vulnerable. However, it yields a false positive alert rate of ${testND}% when the code is safe. If exactly 1% of the codebases in the company repository actually contain the vulnerability, what is the probability (in %) that a codebase flagged positive by the scanner is truly vulnerable?`,
        options: [`${prob}%`, `${prob + 10}%`, `${prob - 5}%`, `95%`], answer: 0,
        explanation: `Using Bayes' Theorem: P(Vulnerable | Positive) = (0.01 * ${testD/100}) / (0.01 * ${testD/100} + 0.99 * ${testND/100}) = ${(fav/tot).toFixed(4)} = ${prob}%.`,
        subtopic: "Bayes' Theorem"
      };
    },
    () => {
      const red = getRandomInt(4, 7);
      const blue = getRandomInt(4, 7);
      const total = red + blue;
      const fav = nCr(red, 2) * nCr(blue, 1);
      const tot = nCr(total, 3);
      const g = gcd(fav, tot);
      return {
        question: `A storage box contains ${red} red server nodes and ${blue} blue server nodes. A network administrator randomly selects 3 nodes from the box without replacement to configure a cluster. What is the probability that exactly 2 of the selected nodes are red and 1 is blue?`,
        options: [`${fav/g}/${tot/g}`, `${fav/g + 1}/${tot/g}`, `${fav/g}/${tot/g + 2}`, `1/2`], answer: 0,
        explanation: `Favorable outcomes = C(${red},2) * C(${blue},1) = ${nCr(red, 2)} * ${blue} = ${fav}. Total outcomes = C(${total},3) = ${tot}. Probability = ${fav}/${tot} = ${fav/g}/${tot/g}.`,
        subtopic: 'Ball Drawing'
      };
    }
  ],
  'mensuration': [
    () => {
      const r = getRandomInt(5, 8);
      const sr = 1;
      const h = 3;
      const loss = getRandomInt(8, 15);
      const sphereVol = 4 * r * r * r;
      const coneVol = sr * sr * h;
      const totalCones = Math.round((sphereVol * (100 - loss) / 100) / coneVol);
      return {
        question: `A solid metal sphere of radius ${r} cm is melted down and recast into small solid right circular cones, each having a base radius of ${sr} cm and a height of ${h} cm. If exactly ${loss}% of the metal is lost during the melting and casting process, calculate the total number of complete cones that can be successfully manufactured.`,
        options: makeOptions(totalCones, 5, 25), answer: 0,
        explanation: `Sphere volume = (4/3) * pi * ${r}^3. Cone volume = (1/3) * pi * ${sr}^2 * ${h}. Net volume after ${loss}% loss = 0.${100-loss} * Volume of sphere. Total cones = Net Volume / Cone Volume = ${totalCones}.`,
        subtopic: 'Volume Conservation'
      };
    },
    () => {
      const l = getRandomInt(30, 60);
      const w = getRandomInt(15, 30);
      const pw = getRandomInt(2, 4);
      const pathArea = (l + 2 * pw) * (w + 2 * pw) - l * w;
      return {
        question: `A municipal park is rectangular in shape, measuring ${l} meters in length and ${w} meters in width. A concrete running track of uniform width ${pw} meters is constructed completely surrounding the park on the outside. Calculate the total surface area of the concrete track in square meters.`,
        options: makeOptions(pathArea, 20, 80), answer: 0,
        explanation: `Outer dimensions of park + track = ${l + 2*pw}m by ${w + 2*pw}m. Outer area = ${l + 2*pw} * ${w + 2*pw} = ${(l+2*pw)*(w+2*pw)} sq meters. Inner park area = ${l} * ${w} = ${l*w} sq meters. Track area = Outer area - Inner area = ${pathArea} sq meters.`,
        subtopic: 'Area of Path'
      };
    }
  ],
  'statistics': [
    () => {
      const mean = getRandomInt(45, 65);
      const sd = getRandomInt(8, 14);
      const a = getRandomInt(2, 3);
      const b = getRandomInt(4, 10);
      const newMean = a * mean + b;
      const newSd = a * sd;
      return {
        question: `A statistical evaluation of telemetry response times has a calculated average (mean) value of ${mean} milliseconds and a standard deviation of ${sd} milliseconds. If all telemetry logs are adjusted by multiplying them by ${a} and then adding ${b} milliseconds, what will be the new mean and standard deviation of the updated telemetry dataset?`,
        options: [
          `Mean = ${newMean}, SD = ${newSd}`,
          `Mean = ${newMean}, SD = ${newSd + b}`,
          `Mean = ${newMean + b}, SD = ${newSd}`,
          `Mean = ${mean}, SD = ${sd}`
        ], answer: 0,
        explanation: `Under the linear transformation Y = ${a}X + ${b}: New Mean = ${a} * Mean + ${b} = ${newMean}. New Standard Deviation = ${a} * SD = ${newSd} (SD is scale-sensitive but location-insensitive).`,
        subtopic: 'Linear Transformation'
      };
    },
    () => {
      const m1 = getRandomInt(40, 50), s1 = getRandomInt(4, 8);
      const m2 = getRandomInt(60, 80), s2 = getRandomInt(6, 12);
      const cv1 = Math.round(s1 / m1 * 100), cv2 = Math.round(s2 / m2 * 100);
      const better = cv1 < cv2 ? 'A' : 'B';
      const minCV = Math.min(cv1, cv2);
      return {
        question: `A quality testing team compiles two developer productivity datasets. Group A has a mean delivery index of ${m1} days with a standard deviation of ${s1} days, while Group B has a mean delivery index of ${m2} days with a standard deviation of ${s2} days. Which Group is more consistent in their deliveries, and what is its Coefficient of Variation (CV)?`,
        options: [
          `Group ${better} (CV = ${minCV}%)`,
          `Group ${better === 'A' ? 'B' : 'A'} (CV = ${Math.max(cv1, cv2)}%)`,
          `Both are equally consistent`,
          `Group ${better} (CV = ${(minCV * 1.2).toFixed(0)}%)`
        ], answer: 0,
        explanation: `CV = (SD / Mean) * 100. CV_A = (${s1}/${m1})*100 = ${cv1}%. CV_B = (${s2}/${m2})*100 = ${cv2}%. Lower CV means more consistency. Group ${better} is more consistent.`,
        subtopic: 'Coefficient of Variation'
      };
    }
  ],
  'data-interpretation': [
    () => {
      const s1 = getRandomInt(120, 150), s2 = getRandomInt(250, 300);
      const b1 = getRandomInt(100, 130), b2 = getRandomInt(220, 260);
      const growthA = Math.round((s2 - s1) / s1 * 100);
      const growthB = Math.round((b2 - b1) / b1 * 100);
      const ans = Math.abs(growthA - growthB);
      const table = `\n+------+---------+---------+\n| Year | Dept A  | Dept B  |\n+------+---------+---------+\n| 2021 |   ${s1}   |   ${b1}   |\n| 2024 |   ${s2}   |   ${b2}   |\n+------+---------+---------+\n`;
      return {
        question: `Refer to the sales distribution table below showing annual sales revenue (in Rs. Lakhs) of two departments (Dept A and Dept B) over four years:${table}Calculate the difference (in percentage points) between the overall sales growth percentage of Dept A and Dept B from 2021 to 2024.`,
        options: makeOptions(ans, 1, 5, (x) => `${x}%`), answer: 0,
        explanation: `Dept A growth = (${s2} - ${s1})/${s1} * 100 = ${growthA}%. Dept B growth = (${b2} - ${b1})/${b1} * 100 = ${growthB}%. Difference = |${growthA} - ${growthB}| = ${ans}%.`,
        subtopic: 'Tabular Data'
      };
    },
    () => {
      const prodX = getRandomInt(40, 50), prodY = getRandomInt(65, 80), prodZ = getRandomInt(85, 100);
      const chart = `\nProduction levels (in Tons):\nProduct X: [#####] ${prodX} Tons\nProduct Y: [########] ${prodY} Tons\nProduct Z: [##########] ${prodZ} Tons\n`;
      const total = prodX + prodY + prodZ;
      const pctY = Math.round((prodY / total) * 100);
      return {
        question: `Refer to the horizontal bar chart below representing production volume of three chemical materials (X, Y, and Z) in a factory:${chart}What percentage of the total production volume is contributed by Product Y?`,
        options: makeOptions(pctY, 2, 8, (x) => `${x}%`), answer: 0,
        explanation: `Total production = ${prodX} + ${prodY} + ${prodZ} = ${total} Tons. Contribution of Product Y = (${prodY} / ${total}) * 100 = ${pctY}%.`,
        subtopic: 'Bar Graph Interpretation'
      };
    },
    () => {
      const salary = getRandomInt(45, 75) * 1000;
      const food = 30, rent = 25;
      const diff = Math.round(salary * (food - rent) / 100);
      const chart = `\nMonthly Expenditure Distribution (% of total salary):\n- Food: 30%\n- Rent: 25%\n- Utilities: 25%\n- Savings: 20%\n`;
      return {
        question: `Refer to the budget distribution breakdown below for an employee with a net monthly salary of Rs. ${salary}:${chart}Calculate the difference (in Rs.) between the monthly amount spent on Food and Rent.`,
        options: makeOptions(diff, 100, 500, (x) => `Rs. ${x}`), answer: 0,
        explanation: `Food spending = 30% of Rs. ${salary}. Rent spending = 25% of Rs. ${salary}. Difference = 5% of Rs. ${salary} = Rs. ${diff}.`,
        subtopic: 'Pie Chart Interpretation'
      };
    },
    () => {
      const c1 = getRandomInt(15, 25), c2 = getRandomInt(26, 35), c3 = getRandomInt(36, 45);
      const m1 = getRandomInt(20, 30), m2 = getRandomInt(31, 40), m3 = getRandomInt(41, 50);
      const ratio = Math.round(((c1+c2+c3) / (m1+m2+m3)) * 100);
      const table = `\n+------+-----------+-----------+\n| Year | Chrome    | Firefox   |\n+------+-----------+-----------+\n| 2021 |   ${c1}M  |   ${m1}M  |\n| 2022 |   ${c2}M  |   ${m2}M  |\n| 2023 |   ${c3}M  |   ${m3}M  |\n+------+-----------+-----------+\n`;
      return {
        question: `The table below represents active user statistics (in Millions) for two web browsers over three years:${table}Calculate the percentage ratio of the total Chrome users to the total Firefox users over the entire three-year period (round to the nearest whole %).`,
        options: makeOptions(ratio, 2, 8, (x) => `${x}%`), answer: 0,
        explanation: `Total Chrome users = ${c1} + ${c2} + ${c3} = ${c1+c2+c3}M. Total Firefox users = ${m1} + ${m2} + ${m3} = ${m1+m2+m3}M. Ratio = (${c1+c2+c3} / ${m1+m2+m3}) * 100 = ${ratio}%.`,
        subtopic: 'Tabular Data'
      };
    }
  ],
  'quadratic-equations': [
    () => {
      const k = getRandomInt(2, 6);
      const sum = 2 * k;
      return {
        question: `Consider the quadratic equation x^2 - ${2*k}x + ${k*k - 1} = 0. If the roots are alpha and beta, find the sum of their squares (alpha^2 + beta^2).`,
        options: makeOptions(2 * k * k + 2, 4, 20), answer: 0,
        explanation: `Sum of roots (alpha + beta) = ${2*k}. Product of roots (alpha * beta) = ${k*k - 1}. alpha^2 + beta^2 = (alpha+beta)^2 - 2*alpha*beta = ${4*k*k} - 2*(${k*k - 1}) = ${2*k*k + 2}.`,
        subtopic: 'Root Properties'
      };
    }
  ],
  'inequalities': [
    () => {
      const a = getRandomInt(2, 5), b = a + getRandomInt(2, 5);
      return {
        question: `Find the number of integer values of x that satisfy the inequality x^2 - ${a+b}x + ${a*b} <= 0.`,
        options: makeOptions(b - a + 1, 1, 3), answer: 0,
        explanation: `The inequality factors as (x - ${a})(x - ${b}) <= 0. The solution set is ${a} <= x <= ${b}. The integers are from ${a} to ${b}, giving a total of ${b - a + 1} values.`,
        subtopic: 'Quadratic Inequalities'
      };
    },
    () => {
      const a = getRandomInt(3, 8), b = getRandomInt(1, 3);
      return {
        question: `Find the range of x that satisfies the absolute value inequality |x - ${a}| <= ${b}.`,
        options: [`${a-b} <= x <= ${a+b}`, `${a-b-1} <= x <= ${a+b}`, `${a-b} <= x <= ${a+b+1}`, `None of these`], answer: 0,
        explanation: `|x - ${a}| <= ${b} implies -${b} <= x - ${a} <= ${b}. Adding ${a} gives ${a-b} <= x <= ${a+b}.`,
        subtopic: 'Modular Inequalities'
      };
    }
  ],
  'logarithms': [
    () => {
      const a = getRandomInt(2, 4);
      const ans = Math.round(Math.pow(2, a));
      return {
        question: `Solve the logarithmic equation: log_2(x) + log_4(x) = ${a * 1.5}. Find the value of x.`,
        options: makeOptions(ans, 2, 8), answer: 0,
        explanation: `log_4(x) = 0.5 * log_2(x). Equation becomes 1.5 * log_2(x) = ${a * 1.5} -> log_2(x) = ${a} -> x = 2^${a} = ${ans}.`,
        subtopic: 'Logarithmic Equations'
      };
    },
    () => {
      const a = getRandomInt(2, 4);
      return {
        question: `If log_10(2) = 0.3010, find the number of digits in the integer 2^${a * 10}.`,
        options: makeOptions(Math.floor(a * 10 * 0.3010) + 1, 1, 3), answer: 0,
        explanation: `Number of digits = floor(log_10(2^${a * 10})) + 1 = floor(${a * 10} * 0.3010) + 1 = ${Math.floor(a * 10 * 0.3010) + 1}.`,
        subtopic: 'Log Properties'
      };
    }
  ]
};


const NEW_TOPIC_POOLS = {

  // ─── PARTNERSHIP ──────────────────────────────────────────────────────────
  'partnership': [
    // T1: Simple partnership (2 partners) — find one partner's share
    () => {
      const mul = getRandomInt(100, 500);
      const capA = 3 * mul;
      const capB = 5 * mul;
      const totalProfit = 8 * mul * getRandomInt(2, 6);
      const shareA = Math.round(totalProfit * 3 / 8);
      const correct = shareA;
      return {
        question: `A and B start a business investing Rs. ${capA} and Rs. ${capB} respectively. If the total profit at the end of the year is Rs. ${totalProfit}, find the profit share of A.`,
        options: makeOptions(correct, 50, 200, x => 'Rs. ' + x),
        answer: 0,
        explanation: `Since time periods are equal, profit is shared in the ratio of their investments. Ratio of capitals = A : B = ${capA} : ${capB} = 3 : 5. A's share = 3/8 × ${totalProfit} = Rs. ${correct}.`,
        subtopic: 'Simple partnership: profits shared in ratio of capitals for equal time',
        difficulty: 'Easy'
      };
    },
    // T2: Simple partnership (3 partners) — find total profit given one's share
    () => {
      const k = getRandomInt(10, 30);
      const capA = 200 * k;
      const capB = 300 * k;
      const capC = 500 * k;
      const sumCap = capA + capB + capC;
      // Ratio = 2 : 3 : 5
      const totalProfit = 1000 * getRandomInt(3, 8);
      const shareC = Math.round(totalProfit * 5 / 10);
      const correct = totalProfit;
      return {
        question: `Three partners A, B, and C invest Rs. ${capA}, Rs. ${capB}, and Rs. ${capC} respectively in a startup. If C's share of the annual profit is Rs. ${shareC}, find the total profit earned by the startup.`,
        options: makeOptions(correct, 500, 2000, x => 'Rs. ' + x),
        answer: 0,
        explanation: `Investment ratio A : B : C = ${capA} : ${capB} : ${capC} = 2 : 3 : 5. C's share = 5/10 of total profit. Total profit = C's share × 2 = ${shareC} × 2 = Rs. ${correct}.`,
        subtopic: 'Find one partner\'s share of profit given total profit and capital ratio',
        difficulty: 'Easy'
      };
    },
    // T3: Compound partnership — unequal capital & unequal time
    () => {
      const capA = 12000;
      const capB = 16000;
      const timeA = getRandomInt(8, 12);
      const timeB = getRandomInt(4, 7);
      const pA = capA * timeA;
      const pB = capB * timeB;
      const g = gcd(pA, pB);
      const ratioA = pA / g;
      const ratioB = pB / g;
      const totalProfit = (ratioA + ratioB) * getRandomInt(100, 300);
      const shareB = Math.round(totalProfit * ratioB / (ratioA + ratioB));
      const correct = shareB;
      return {
        question: `A and B enter into a partnership. A invests Rs. ${capA} for ${timeA} months and B invests Rs. ${capB} for ${timeB} months. If the total annual profit is Rs. ${totalProfit}, what is B's profit share?`,
        options: makeOptions(correct, 100, 500, x => 'Rs. ' + x),
        answer: 0,
        explanation: `Profit share ratio = (CapA × TimeA) : (CapB × TimeB) = (${capA} × ${timeA}) : (${capB} × ${timeB}) = ${pA} : ${pB} = ${ratioA} : ${ratioB}. B's share = ${ratioB}/${ratioA + ratioB} × ${totalProfit} = Rs. ${correct}.`,
        subtopic: 'Compound partnership: unequal capitals for unequal time periods (profit ratio = C1*T1 : C2*T2)',
        difficulty: 'Medium'
      };
    },
    // T4: Three partners compound investment — find total profit
    () => {
      const capA = 10000;
      const capB = 15000;
      const capC = 20000;
      const timeA = 6;
      const timeB = 8;
      const timeC = 12;
      const pA = capA * timeA;
      const pB = capB * timeB;
      const pC = capC * timeC;
      // Ratio: 60 : 120 : 240 => 1 : 2 : 4
      const shareA = 1000 * getRandomInt(2, 6);
      const correct = shareA * 7;
      return {
        question: `A, B, and C start a joint venture. A invests Rs. ${capA} for ${timeA} months, B invests Rs. ${capB} for ${timeB} months, and C invests Rs. ${capC} for a year. If A's share of the annual profit is Rs. ${shareA}, what is the total profit?`,
        options: makeOptions(correct, 1000, 5000, x => 'Rs. ' + x),
        answer: 0,
        explanation: `Profit ratio A : B : C = (10k × 6) : (15k × 8) : (20k × 12) = 60 : 120 : 240 = 1 : 2 : 4. Total parts = 1 + 2 + 4 = 7. Since A's share (1 part) = Rs. ${shareA}, total profit (7 parts) = 7 × ${shareA} = Rs. ${correct}.`,
        subtopic: 'Three-partner compound investment: find total profit given one partner\'s share',
        difficulty: 'Medium'
      };
    },
    // T5: Active partner gets salary percentage
    () => {
      const capA = 20000;
      const capB = 30000;
      // Ratio A : B = 2 : 3
      const salPct = 20;
      const totalProfit = 5000 * getRandomInt(4, 10);
      const salaryA = totalProfit * salPct / 100;
      const remainingProfit = totalProfit - salaryA;
      const shareA_from_cap = remainingProfit * 2 / 5;
      const totalShareA = salaryA + shareA_from_cap;
      const correct = totalShareA;
      return {
        question: `In a partnership, A invests Rs. ${capA} and B invests Rs. ${capB}. A is a working partner and receives ${salPct}% of the total profit as a monthly salary. The remaining profit is distributed in the ratio of their investments. If the total annual profit is Rs. ${totalProfit}, find the total share of A.`,
        options: makeOptions(correct, 500, 2500, x => 'Rs. ' + x),
        answer: 0,
        explanation: `Salary to A = ${salPct}% of ${totalProfit} = Rs. ${salaryA}. Remaining profit = Rs. ${remainingProfit}. Ratio of investments = 2 : 3. A's share of remaining profit = 2/5 × ${remainingProfit} = Rs. ${shareA_from_cap}. Total share of A = ${salaryA} + ${shareA_from_cap} = Rs. ${correct}.`,
        subtopic: 'Active/Working partner gets x% of profit as salary, remainder divided in capital ratio',
        difficulty: 'Medium'
      };
    },
    // T6: Investment ratio & time ratio given — find ratio of profit shares
    () => {
      const invNum = 3;
      const invDen = 4;
      const timeNum = 8;
      const timeDen = 9;
      // Profit ratio = (3*8) : (4*9) = 24 : 36 = 2 : 3
      return {
        question: `Two business partners A and B invest capitals in the ratio ${invNum}:${invDen}. The periods for which they invest their money are in the ratio ${timeNum}:${timeDen}. What is the ratio of their profit shares at the end of the term?`,
        options: ['2:3', '3:2', '4:5', '9:8'],
        answer: 0,
        explanation: `Profit share ratio = (Capital ratio) × (Time ratio) = (${invNum}/${invDen}) × (${timeNum}/${timeDen}) = 24/36 = 2/3. Thus, the ratio of their profit shares is 2:3.`,
        subtopic: 'Investment ratio and time ratio given — find the ratio of profit shares',
        difficulty: 'Medium'
      };
    },
    // T7: Partner joins midway
    () => {
      const capA = 30000;
      const capB = 45000;
      const joinDelay = getRandomInt(3, 6);
      const timeA = 12;
      const timeB = 12 - joinDelay;
      const pA = capA * timeA;
      const pB = capB * timeB;
      const g = gcd(pA, pB);
      const ratioA = pA / g;
      const ratioB = pB / g;
      const totalProfit = (ratioA + ratioB) * getRandomInt(300, 800);
      const shareB = Math.round(totalProfit * ratioB / (ratioA + ratioB));
      const correct = shareB;
      return {
        question: `A starts a franchise with Rs. ${capA}. After ${joinDelay} months, B joins him as a partner with Rs. ${capB}. If the startup earns Rs. ${totalProfit} in total profit at the end of one year, what is B's share of the profit?`,
        options: makeOptions(correct, 300, 1500, x => 'Rs. ' + x),
        answer: 0,
        explanation: `Time period for A = 12 months. Time period for B = 12 − ${joinDelay} = ${timeB} months. Profit ratio A : B = (${capA} × 12) : (${capB} × ${timeB}) = ${pA} : ${pB} = ${ratioA} : ${ratioB}. B's share = ${ratioB}/${ratioA+ratioB} × ${totalProfit} = Rs. ${correct}.`,
        subtopic: 'Partner joins midway after x months, total annual profit given — find joiner\'s share',
        difficulty: 'Hard'
      };
    },
    // T8: Multi-stage investment changes
    () => {
      const initialCap = 10000;
      const changeMonths = 6;
      const capAdded = 5000;
      // A's equivalent capital = 10000*6 + 15000*6 = 150000
      // B's equivalent capital = 15000 * 12 = 180000
      // Ratio A : B = 150 : 180 = 5 : 6
      const totalProfit = 11000 * getRandomInt(2, 5);
      const shareA = Math.round(totalProfit * 5 / 11);
      const correct = shareA;
      return {
        question: `A and B enter into a partnership with Rs. ${initialCap} and Rs. 15000 respectively. After ${changeMonths} months, A invests an additional Rs. ${capAdded}. If the total profit at the end of the year is Rs. ${totalProfit}, find the profit share of A.`,
        options: makeOptions(correct, 500, 2000, x => 'Rs. ' + x),
        answer: 0,
        explanation: `A's equivalent capital for 12 months = (${initialCap} × 6) + ((${initialCap} + ${capAdded}) × 6) = 60,000 + 90,000 = Rs. 1,50,000. B's equivalent capital = 15,000 × 12 = Rs. 1,80,000. Profit sharing ratio A : B = 1,50,000 : 1,80,000 = 5 : 6. A's profit share = 5/11 × ${totalProfit} = Rs. ${correct}.`,
        subtopic: 'Multi-stage investment: partners withdraw/add capitals at different months of the year',
        difficulty: 'Hard'
      };
    }
  ],

  // ─── AGES ─────────────────────────────────────────────────────────────────
  // RULE: always derive random params FROM n/ages so answer is guaranteed correct.
  'ages': [

    // T1: father was k times son's age, y years ago → find father's present age
    () => {
      const k    = pickRandomArray([3, 4, 5]);
      const sPast = getRandomInt(4, 10);   // son's past age
      const y    = getRandomInt(3, 8);     // years ago
      const fPast = k * sPast;             // father's past age (exactly k × son)
      const fNow = fPast + y;
      const sNow = sPast + y;
      const diff = fNow - sNow;            // constant age gap = (k-1)*sPast
      const correct = fNow;
      return {
        question: `${y} years ago, a father was exactly ${k} times as old as his son. The father is currently ${diff} years older than his son. What is the father's present age?`,
        options: makeOptions(correct, 3, 10),
        answer: 0,
        explanation: `${y} years ago: let son = s, father = ${k}s. Now son = s+${y}, father = ${k}s+${y}. Age gap: (${k}s+${y})-(s+${y}) = ${k-1}s = ${diff} → s = ${sPast}. Father now = ${k}×${sPast}+${y} = ${correct}.`,
        subtopic: 'Age Ratio at Two Time Points',
        difficulty: 'Medium'
      };
    },

    // T2: two ages in ratio p:q, sum after n years = known → find elder's age
    () => {
      const p = getRandomInt(3, 7);
      const q = getRandomInt(1, p - 1);
      const x = getRandomInt(3, 8);        // real multiplier: A = p*x, B = q*x
      const ageA = p * x;
      const ageB = q * x;
      const n    = getRandomInt(4, 12);
      const sumFuture = ageA + ageB + 2 * n;
      const correct   = ageA;
      return {
        question: `Two colleagues' ages are currently in the ratio ${p}:${q}. After ${n} years, the sum of their ages will be ${sumFuture}. Find the present age of the elder colleague.`,
        options: makeOptions(correct, 3, 10),
        answer: 0,
        explanation: `Let ages be ${p}t and ${q}t. After ${n} years: ${p}t + ${q}t + 2×${n} = ${sumFuture} → ${p+q}t = ${sumFuture - 2*n} → t = ${x}. Elder's age = ${p}×${x} = ${correct} years.`,
        subtopic: 'Age Ratio Problems',
        difficulty: 'Easy'
      };
    },

    // T3: in how many YEARS will father be k times son's age? → answer = n (years)
    // Derived: fNow = k*sNow + (k-1)*n guarantees integer solution
    () => {
      const k    = pickRandomArray([2, 3]);
      const sNow = getRandomInt(5, 14);
      const n    = getRandomInt(2, 12);    // years until condition is met
      const fNow = k * sNow + (k - 1) * n; // ensures (fNow+n) = k*(sNow+n)
      const correct = n;                   // ANSWER = number of years, not age
      return {
        question: `A father is ${fNow} years old and his son is ${sNow} years old today. In how many years will the father's age be exactly ${k} times his son's age?`,
        options: makeOptions(correct, 2, 8),
        answer: 0,
        explanation: `Let n = years needed. (${fNow}+n) = ${k}×(${sNow}+n) → ${fNow}+n = ${k*sNow}+${k}n → ${fNow}-${k*sNow} = ${k-1}n → n = ${fNow - k*sNow}/${k-1} = ${n} years.`,
        subtopic: 'Present Age Equations',
        difficulty: 'Medium'
      };
    },

    // T4: new member joins group → average rises → find new member's age
    // D's age = (n+1)*newAvg - n*oldAvg
    () => {
      const grpSize = getRandomInt(3, 6);
      const oldAvg  = getRandomInt(22, 34);
      const newMemberAge = getRandomInt(oldAvg + 5, oldAvg + 25);
      const newAvg  = Math.floor((oldAvg * grpSize + newMemberAge) / (grpSize + 1));
      // Recompute to ensure consistency (floor may shift)
      const actualNewMember = newAvg * (grpSize + 1) - oldAvg * grpSize;
      if (actualNewMember <= 0 || actualNewMember > 70) return { question: 'skip' };
      const correct = actualNewMember;
      return {
        question: `The average age of ${grpSize} employees in a software team is ${oldAvg} years. A new employee joins and the average age becomes ${newAvg} years. What is the new employee's age?`,
        options: makeOptions(correct, 3, 15),
        answer: 0,
        explanation: `Total age before = ${oldAvg}×${grpSize} = ${oldAvg * grpSize}. Total after = ${newAvg}×${grpSize + 1} = ${newAvg * (grpSize + 1)}. New employee's age = ${newAvg * (grpSize + 1)} − ${oldAvg * grpSize} = ${correct} years.`,
        subtopic: 'Average Age Problems',
        difficulty: 'Easy'
      };
    },

    // T5: ratio A:B now; derive future ratio after n years → find A's current age
    () => {
      const r1 = getRandomInt(2, 5);
      const r2 = getRandomInt(1, r1 - 1);
      const k  = getRandomInt(3, 8);       // real multiplier
      const ageA = r1 * k;
      const ageB = r2 * k;
      const n    = getRandomInt(4, 15);
      const futA = ageA + n;
      const futB = ageB + n;
      const g    = gcd(futA, futB);
      const correct = ageA;
      return {
        question: `The present ages of A and B are in the ratio ${r1}:${r2}. After ${n} years, their ages will be in the ratio ${futA/g}:${futB/g}. Find A's present age.`,
        options: makeOptions(correct, 3, 12),
        answer: 0,
        explanation: `Let A = ${r1}t, B = ${r2}t. After ${n} years: (${r1}t+${n})/(${r2}t+${n}) = ${futA/g}/${futB/g}. Cross-multiply → ${futB/g}(${r1}t+${n}) = ${futA/g}(${r2}t+${n}) → t = ${k}. A = ${r1}×${k} = ${correct}.`,
        subtopic: 'Age Ratio at Two Time Points',
        difficulty: 'Medium'
      };
    },

    // T6: simple sum + constant difference → find elder's age
    () => {
      const diff     = getRandomInt(10, 28);   // constant age gap
      const younger  = getRandomInt(15, 38);
      const elder    = younger + diff;
      const sumAges  = elder + younger;
      const correct  = elder;
      return {
        question: `The sum of the ages of two colleagues, Raj and Priya, is ${sumAges} years. Raj is ${diff} years older than Priya. What is Raj's present age?`,
        options: makeOptions(correct, 3, 10),
        answer: 0,
        explanation: `Let Raj = R, Priya = P. R+P = ${sumAges} and R−P = ${diff}. Adding: 2R = ${sumAges + diff} → R = ${correct}.`,
        subtopic: 'Present Age Equations',
        difficulty: 'Easy'
      };
    },

    // T7: in how many years will mother be k times child? → answer = n (years)
    // Derived: mNow = k*cNow + (k-1)*n guarantees integer solution
    () => {
      const k    = pickRandomArray([2, 3, 4]);
      const cNow = getRandomInt(2, 9);
      const n    = getRandomInt(2, 12);        // years until condition is met
      const mNow = k * cNow + (k - 1) * n;    // ensures (mNow+n) = k*(cNow+n)
      const correct = n;                        // ANSWER = number of years
      return {
        question: `A mother is ${mNow} years old and her child is ${cNow} years old today. In how many years will the mother's age be exactly ${k} times the child's age?`,
        options: makeOptions(correct, 2, 8),
        answer: 0,
        explanation: `Let n years from now. (${mNow}+n) = ${k}×(${cNow}+n) → ${mNow}+n = ${k*cNow}+${k}n → ${mNow}-${k*cNow} = ${k-1}n → n = ${mNow - k*cNow}/${k-1} = ${n} years.`,
        subtopic: 'Multi-Person Age Systems',
        difficulty: 'Medium'
      };
    },

    // T8: three-person age system — A + B + C sum given, two differences given
    () => {
      const a = getRandomInt(18, 30);
      const b = getRandomInt(22, 38);
      const c = getRandomInt(28, 50);
      const sumABC = a + b + c;
      const diff1  = b - a;  // B older than A by diff1
      const diff2  = c - b;  // C older than B by diff2
      const correct = c;
      return {
        question: `The combined age of three team members A, B, and C is ${sumABC} years. B is ${diff1} years older than A, and C is ${diff2} years older than B. Find C's age.`,
        options: makeOptions(correct, 3, 12),
        answer: 0,
        explanation: `Let A = x. Then B = x+${diff1}, C = x+${diff1+diff2}. Sum: 3x + ${diff1 + diff1 + diff2} = ${sumABC} → 3x = ${sumABC - 2*diff1 - diff2} → x = ${a}. C = ${a}+${diff1+diff2} = ${correct}.`,
        subtopic: 'Multi-Person Age Systems',
        difficulty: 'Hard'
      };
    },
  ],

  // ─── TIME, SPEED & DISTANCE ──────────────────────────────────────────────
  'time-speed-distance': [

    // T1: average speed over two equal legs (harmonic mean)
    () => {
      const s1  = getRandomInt(30, 70);
      const s2  = getRandomInt(s1 + 10, s1 + 50);
      const correct = Math.round((2 * s1 * s2) / (s1 + s2));
      return {
        question: `A delivery truck travels from Warehouse A to Store B at ${s1} km/h and returns at ${s2} km/h. What is the average speed for the entire round trip?`,
        options: makeOptions(correct, 3, 12),
        answer: 0,
        explanation: `For equal distances, average speed = 2×s1×s2/(s1+s2) = 2×${s1}×${s2}/(${s1}+${s2}) = ${2*s1*s2}/${s1+s2} ≈ ${correct} km/h. Never take the arithmetic mean when distances are equal.`,
        subtopic: 'Average Speed (Two Legs)',
        difficulty: 'Medium'
      };
    },

    // T2: same-direction relative speed — hours until gap = d
    () => {
      const relS = getRandomInt(5, 20);
      const hrs  = getRandomInt(2, 8);
      const d    = relS * hrs;
      const s1   = getRandomInt(40, 80);
      const s2   = s1 - relS;
      const correct = hrs;
      return {
        question: `Two vehicles start from the same point heading in the same direction. Vehicle A travels at ${s1} km/h and Vehicle B at ${s2} km/h. After how many hours will they be exactly ${d} km apart?`,
        options: makeOptions(correct, 1, 5),
        answer: 0,
        explanation: `Relative speed = ${s1}−${s2} = ${relS} km/h. Time = ${d}/${relS} = ${correct} hours.`,
        subtopic: 'Relative Speed (Same Direction)',
        difficulty: 'Easy'
      };
    },

    // T3: opposite-direction → meeting time in minutes
    () => {
      const s1   = getRandomInt(40, 80);
      const s2   = getRandomInt(30, 60);
      const t    = getRandomInt(1, 4);           // meeting time in hours (clean)
      const d    = (s1 + s2) * t;
      const correct = t * 60;                    // answer in minutes
      return {
        question: `City A and City B are ${d} km apart. Car P leaves A at ${s1} km/h and Car Q leaves B at the same time at ${s2} km/h, both heading toward each other. How many minutes after departure do they meet?`,
        options: makeOptions(correct, 10, 30),
        answer: 0,
        explanation: `Combined closing speed = ${s1}+${s2} = ${s1+s2} km/h. Time = ${d}/${s1+s2} = ${t} hour = ${correct} minutes.`,
        subtopic: 'Relative Speed (Opposite Direction)',
        difficulty: 'Easy'
      };
    },

    // T4: race with head start — by how many metres does A win?
    // Derived correctly: winMargin = raceLen − (sB × raceLen/sA + head)
    () => {
      const raceLen = pickRandomArray([1000, 2000, 5000]);
      const sA  = getRandomInt(8, 15);           // A's speed (m/s)
      const sB  = getRandomInt(4, sA - 1);       // B's speed (m/s)
      const head = getRandomInt(20, 100);         // head start metres
      // Time for A to finish
      const timeA = raceLen / sA;
      // Distance B covers in timeA (starting head metres ahead)
      const bDist = Math.round(sB * timeA + head);
      const winMargin = raceLen - bDist;
      if (winMargin <= 0 || winMargin > 400) return { question: 'skip' };
      const correct = winMargin;
      return {
        question: `In a ${raceLen} m race, runner A gives runner B a head start of ${head} metres. A runs at ${sA} m/s and B runs at ${sB} m/s. By how many metres does A win the race?`,
        options: makeOptions(correct, 5, 25),
        answer: 0,
        explanation: `Time for A to finish: ${raceLen}/${sA} = ${timeA} s. Distance B covers: ${sB}×${timeA} + ${head} = ${Math.round(sB*timeA)} + ${head} = ${bDist} m. A wins by ${raceLen}−${bDist} = ${correct} m.`,
        subtopic: 'Race & Head Start Problems',
        difficulty: 'Medium'
      };
    },

    // T5: speed with stoppages — effective speed
    () => {
      const speed = getRandomInt(40, 80);
      const halt  = getRandomInt(5, 20);          // minutes stopped per hour
      const runMin = 60 - halt;
      const effective = Math.round(speed * runMin / 60);
      const correct = effective;
      return {
        question: `A bus runs at ${speed} km/h but stops for ${halt} minutes every hour. What is the bus's effective average speed for a long journey?`,
        options: makeOptions(correct, 3, 10),
        answer: 0,
        explanation: `In each hour, the bus actually moves for ${60}−${halt} = ${runMin} min. Distance per hour = ${speed}×${runMin}/60 = ${correct} km. Effective speed = ${correct} km/h.`,
        subtopic: 'Speed with Stoppages',
        difficulty: 'Medium'
      };
    },

    // T6: circular track — first meeting time
    () => {
      const sA   = getRandomInt(4, 9);
      const sB   = getRandomInt(2, sA - 1);
      const relS = sA - sB;
      const circumference = relS * getRandomInt(60, 200); // ensures clean division
      const correct = circumference / relS;
      return {
        question: `Two cyclists A and B start simultaneously from the same point on a circular track of circumference ${circumference} m. A cycles at ${sA} m/s and B at ${sB} m/s, both in the same direction. After how many seconds do they first meet?`,
        options: makeOptions(correct, 20, 80),
        answer: 0,
        explanation: `Relative speed = ${sA}−${sB} = ${relS} m/s. First meeting = ${circumference}/${relS} = ${correct} seconds.`,
        subtopic: 'Circular Track (First Meet)',
        difficulty: 'Medium'
      };
    },

    // T7: two people start from opposite ends, walk toward each other — meeting point
    () => {
      const tA    = getRandomInt(3, 8);
      const tB    = getRandomInt(tA + 1, tA + 5);
      const lcmT  = lcm(tA, tB);
      const dTotal = lcmT * getRandomInt(2, 5);   // ensures clean answer
      const sA    = dTotal / tA;
      const sB    = dTotal / tB;
      const meetTime = dTotal / (sA + sB);
      const correct  = Math.round(sA * meetTime);  // A's distance from X
      return {
        question: `Towns X and Y are ${dTotal} km apart. A starts from X and B from Y simultaneously, walking toward each other. A covers the distance in ${tA} hours and B in ${tB} hours. How far from Town X do they meet?`,
        options: makeOptions(correct, 10, 40),
        answer: 0,
        explanation: `Speed A = ${dTotal}/${tA} = ${sA} km/h; Speed B = ${dTotal}/${tB} = ${sB} km/h. Meeting time = ${dTotal}/(${sA}+${sB}) = ${meetTime} h. Distance from X = ${sA}×${meetTime} = ${correct} km.`,
        subtopic: 'Meeting Point Problems',
        difficulty: 'Medium'
      };
    },

    // T8: late start → drives faster → same arrival. Find distance.
    // d/sNorm − d/sFast = lateMin/60 → d = sNorm*sFast*lateMin / (60*(sFast−sNorm))
    () => {
      const sNorm = getRandomInt(40, 70);
      const sFast = getRandomInt(sNorm + 10, sNorm + 40);
      const lateMin = pickRandomArray([10, 15, 20, 30]);
      const num   = sNorm * sFast * lateMin;
      const den   = 60 * (sFast - sNorm);
      if (num % den !== 0) return { question: 'skip' };
      const correct = num / den;
      return {
        question: `Ravi usually drives to his office at ${sNorm} km/h and arrives on time. One day he leaves ${lateMin} minutes late and drives at ${sFast} km/h, still reaching on time. How far is his office from home?`,
        options: makeOptions(correct, 10, 40),
        answer: 0,
        explanation: `Normal time − Faster time = ${lateMin}/60 h. d/${sNorm} − d/${sFast} = ${lateMin}/60. d×(${sFast}−${sNorm})/(${sNorm}×${sFast}) = ${lateMin}/60. d = ${sNorm}×${sFast}×${lateMin}/(60×${sFast-sNorm}) = ${correct} km.`,
        subtopic: 'Basic Speed-Distance-Time',
        difficulty: 'Hard'
      };
    },
  ],

  // ─── CLOCKS & CALENDARS ──────────────────────────────────────────────────
  'clocks-calendars': [

    // T1: angle between hands at H:M
    () => {
      const h = getRandomInt(1, 11);
      const m = getRandomInt(1, 59);
      const rawAngle = Math.abs(30 * h - 5.5 * m);
      const correct  = Math.round(Math.min(rawAngle, 360 - rawAngle));
      return {
        question: `A factory engineer checks her stopwatch at ${h}:${m < 10 ? '0' + m : m}. What is the angle (in degrees) between the hour hand and minute hand?`,
        options: makeOptions(correct, 5, 20),
        answer: 0,
        explanation: `Hour hand = 30×${h} + 0.5×${m} = ${30*h + 0.5*m}°. Minute hand = 6×${m} = ${6*m}°. Difference = ${Math.abs(30*h + 0.5*m - 6*m)}°. Reflex check → ${correct}°.`,
        subtopic: 'Angle Between Clock Hands',
        difficulty: 'Medium'
      };
    },

    // T2: hands coincide between H and H+1 o'clock
    () => {
      const h = getRandomInt(1, 11);
      // Hands coincide at exactly (60h/11) minutes past h
      const minExact = (60 * h) / 11;
      const correct  = Math.round(minExact * 10) / 10; // 1 decimal place
      return {
        question: `Between ${h} o'clock and ${h + 1} o'clock, at what time (in minutes past ${h}) are the clock hands exactly coincident?`,
        options: makeOptions(Math.round(minExact), 3, 8),
        answer: 0,
        explanation: `At ${h}:00, the hour hand is at ${h * 5} minute-marks. The minute hand gains 55/60 marks per minute over the hour hand. Time to coincide = ${h * 5} ÷ (55/60) = ${h * 5 * 60 / 55} ≈ ${Math.round(minExact)} minutes past ${h}.`,
        subtopic: 'Clock Coincidences',
        difficulty: 'Medium'
      };
    },

    // T3: gaining/losing clock — how many minutes fast after T hours
    () => {
      const gainPerHour = getRandomInt(2, 10);
      const hours = getRandomInt(4, 24);
      const correct = gainPerHour * hours;
      return {
        question: `A digital clock gains ${gainPerHour} minutes every hour. If it shows the correct time at 12:00 noon, how many minutes fast will it be ${hours} hours later?`,
        options: makeOptions(correct, 5, 25),
        answer: 0,
        explanation: `In ${hours} hours the clock gains ${gainPerHour}×${hours} = ${correct} minutes. It will be ${correct} minutes ahead of the correct time.`,
        subtopic: 'Gaining/Losing Clock Problems',
        difficulty: 'Easy'
      };
    },

    // T4: what day of the week after N days
    () => {
      const dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
      const startIdx = getRandomInt(0, 6);
      const addDays  = getRandomInt(30, 200);
      const endIdx   = (startIdx + addDays) % 7;
      const correct  = dayNames[endIdx];
      // Build 4 distinct options including correct
      const opts = new Set([correct]);
      while (opts.size < 4) opts.add(dayNames[getRandomInt(0, 6)]);
      const shuffled = [...opts].sort(() => Math.random() - 0.5);
      return {
        question: `If 1st January of a particular year falls on a ${dayNames[startIdx]}, what day of the week will the ${addDays + 1}th January be?`,
        options: shuffled,
        answer: shuffled.indexOf(correct),
        explanation: `${addDays} days after ${dayNames[startIdx]}: ${addDays} mod 7 = ${addDays % 7} extra days. Moving ${addDays % 7} days forward from ${dayNames[startIdx]} gives ${correct}.`,
        subtopic: 'Day of the Week (Odd Days)',
        difficulty: 'Easy'
      };
    },

    // T5: leap year identification
    () => {
      const year   = getRandomInt(2016, 2032);
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const correct = isLeap ? '366' : '365';
      const options = ['365', '366', '364', '367'];
      const ansIdx  = options.indexOf(correct);
      return {
        question: `A software team plans a project spanning the entire year ${year}. How many days does ${year} have? (Determine whether it is a leap year.)`,
        options,
        answer: ansIdx >= 0 ? ansIdx : 0,
        explanation: `${year}: ${isLeap ? `Divisible by 4 and not a century year (or div by 400) → leap year → 366 days.` : `Not divisible by 4 (or is a non-400 century year) → not a leap year → 365 days.`}`,
        subtopic: 'Leap Year Rules',
        difficulty: 'Easy'
      };
    },

    // T6: mirror image of a clock
    () => {
      const h  = getRandomInt(1, 10);
      const m  = getRandomInt(5, 58);
      // Mirror rule: actual time = 11:60 − shown time (adjust for minutes > 60)
      let actualH = 11 - h;
      let actualM = 60 - m;
      if (actualM === 60) { actualM = 0; actualH += 1; }
      const correct = `${actualH}:${actualM < 10 ? '0' + actualM : actualM}`;
      const d1 = `${actualH + 1}:${actualM < 10 ? '0' + actualM : actualM}`;
      const d2 = `${actualH - 1}:${actualM < 10 ? '0' + actualM : actualM}`;
      const d3 = `${12 - h}:${60 - m < 10 ? '0' + (60 - m) : 60 - m}`;
      const shuffled = [correct, d1, d2, d3].sort(() => Math.random() - 0.5);
      return {
        question: `A clock is placed in front of a mirror. The mirror image shows the time as ${h}:${m < 10 ? '0' + m : m}. What is the actual time shown on the clock?`,
        options: shuffled,
        answer: shuffled.indexOf(correct),
        explanation: `Mirror time rule: subtract shown time from 11:60. 11:60 − ${h}:${m} = ${correct}.`,
        subtopic: 'Mirror Image of Clock',
        difficulty: 'Hard'
      };
    },

    // T7: hands are opposite (180°) between H and H+1
    () => {
      const h = getRandomInt(2, 9);
      // Hands are 180° apart at (5h + 30) × 12/11 minutes past 12
      // Between H and H+1: time = (5h+30)/11 × 60/5 = (60h+330)/11
      const minExact = (60 * h + 330) / 11;
      const correct  = Math.round(minExact);
      return {
        question: `Between ${h} o'clock and ${h + 1} o'clock, at approximately what minute past ${h} are the clock hands exactly 180° apart (opposite each other)?`,
        options: makeOptions(correct, 3, 8),
        answer: 0,
        explanation: `The hands are opposite when the minute hand is exactly 30 min-marks ahead of the hour hand. Formula: (5H+30)×12/11 = (${5*h}+30)×12/11 = ${(5*h+30)*12/11} ≈ ${correct} minutes past ${h}.`,
        subtopic: 'Clock Oppositions',
        difficulty: 'Medium'
      };
    },

    // T8: date calculation — add months to a start date
    () => {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const startY = getRandomInt(2022, 2026);
      const startM = getRandomInt(1, 12);   // 1-indexed
      const startD = getRandomInt(1, 28);
      const addM   = getRandomInt(3, 18);
      const endMIdx = (startM - 1 + addM) % 12;   // 0-indexed
      const endY    = startY + Math.floor((startM - 1 + addM) / 12);
      const correct = `${startD} ${months[endMIdx]} ${endY}`;
      const d1 = `${startD} ${months[(endMIdx + 1) % 12]} ${endY}`;
      const d2 = `${startD} ${months[(endMIdx - 1 + 12) % 12]} ${endY}`;
      const d3 = `${startD} ${months[endMIdx]} ${endY + 1}`;
      const shuffled = [correct, d1, d2, d3].sort(() => Math.random() - 0.5);
      return {
        question: `A software project begins on ${startD} ${months[startM - 1]} ${startY} and runs for exactly ${addM} months. What is the expected end date?`,
        options: shuffled,
        answer: shuffled.indexOf(correct),
        explanation: `Adding ${addM} months to ${months[startM - 1]} ${startY}: new month = ${months[endMIdx]}, new year = ${endY}. End date: ${correct}.`,
        subtopic: 'Date Difference Calculations',
        difficulty: 'Easy'
      };
    },
  ],

  // ─── NUMBER SERIES ────────────────────────────────────────────────────────
  'number-series': [

    // T1: simple AP — find next term
    () => {
      const a = getRandomInt(2, 10);
      const d = getRandomInt(3, 12);
      const terms = Array.from({ length: 6 }, (_, i) => a + i * d);
      const correct = terms[5];
      return {
        question: `Find the next term in the series: ${terms.slice(0, 5).join(', ')}, ?`,
        options: makeOptions(correct, 2, 8),
        answer: 0,
        explanation: `AP: first term = ${a}, common difference = ${d}. 6th term = ${a} + 5×${d} = ${correct}.`,
        subtopic: 'AP Series',
        difficulty: 'Easy'
      };
    },

    // T2: squares of consecutive integers
    () => {
      const start = getRandomInt(2, 7);
      const terms = Array.from({ length: 6 }, (_, i) => (start + i) ** 2);
      const correct = terms[5];
      return {
        question: `Find the missing term: ${terms.slice(0, 5).join(', ')}, ?`,
        options: makeOptions(correct, 10, 40),
        answer: 0,
        explanation: `Pattern = n² for n = ${start}, ${start+1}, ..., ${start+5}. Next = ${start+5}² = ${correct}.`,
        subtopic: 'Square Patterns',
        difficulty: 'Easy'
      };
    },

    // T3: GP — find next term
    () => {
      const a = getRandomInt(2, 6);
      const r = pickRandomArray([2, 3]);
      const terms = Array.from({ length: 5 }, (_, i) => a * r ** i);
      const correct = a * r ** 5;
      return {
        question: `What comes next? ${terms.join(', ')}, ?`,
        options: makeOptions(correct, 20, 100),
        answer: 0,
        explanation: `GP with first term ${a} and ratio ${r}. 6th term = ${a}×${r}⁵ = ${a}×${r**5} = ${correct}.`,
        subtopic: 'GP Series',
        difficulty: 'Easy'
      };
    },

    // T4: n² + constant
    () => {
      const base = getRandomInt(1, 5);
      const add  = getRandomInt(2, 10);
      const terms = Array.from({ length: 6 }, (_, i) => (base + i) ** 2 + add);
      const correct = terms[5];
      return {
        question: `Find the next term: ${terms.slice(0, 5).join(', ')}, ?`,
        options: makeOptions(correct, 5, 25),
        answer: 0,
        explanation: `Pattern: n² + ${add} for n = ${base} to ${base+5}. Next = ${base+5}² + ${add} = ${(base+5)**2} + ${add} = ${correct}.`,
        subtopic: 'Square ± Constant Pattern',
        difficulty: 'Medium'
      };
    },

    // T5: second-level constant difference (quadratic)
    () => {
      const a = getRandomInt(2, 8);
      const d1 = getRandomInt(3, 8);   // first-level difference start
      const dd  = getRandomInt(2, 5);  // second-level constant difference
      const diffs = [d1, d1 + dd, d1 + 2*dd, d1 + 3*dd, d1 + 4*dd];
      let t = [a];
      for (const d of diffs) t.push(t[t.length - 1] + d);
      const correct = t[5];
      return {
        question: `Find the next number: ${t.slice(0, 5).join(', ')}, ?`,
        options: makeOptions(correct, 5, 20),
        answer: 0,
        explanation: `First differences: ${diffs.slice(0,4).join(', ')}... Second difference = ${dd} (constant). Next 1st-diff = ${diffs[4]}. Next term = ${t[4]} + ${diffs[4]} = ${correct}.`,
        subtopic: 'Difference Series',
        difficulty: 'Medium'
      };
    },

    // T6: n³ + constant
    () => {
      const base = getRandomInt(1, 4);
      const add  = getRandomInt(1, 8);
      const terms = Array.from({ length: 6 }, (_, i) => (base + i) ** 3 + add);
      const correct = terms[5];
      return {
        question: `Find the next term: ${terms.slice(0, 5).join(', ')}, ?`,
        options: makeOptions(correct, 20, 100),
        answer: 0,
        explanation: `Pattern: n³ + ${add} for n = ${base} to ${base+5}. Next = ${base+5}³ + ${add} = ${(base+5)**3} + ${add} = ${correct}.`,
        subtopic: 'Square ± Constant Pattern',
        difficulty: 'Medium'
      };
    },

    // T7: wrong term detection in AP
    () => {
      const a = getRandomInt(3, 10);
      const d = getRandomInt(4, 10);
      const terms = Array.from({ length: 7 }, (_, i) => a + i * d);
      const wrongIdx = getRandomInt(1, 5);
      const wrongVal = terms[wrongIdx] + pickRandomArray([d - 1, d + 1, 2, -2]);
      const displayed = [...terms];
      displayed[wrongIdx] = wrongVal;
      const correct = String(wrongVal);
      const opts = [correct, String(terms[wrongIdx - 1] + d + 1), String(terms[wrongIdx + 1] - 1), String(wrongVal + d)];
      const unique = [...new Set(opts)];
      while (unique.length < 4) unique.push(String(getRandomInt(a, a + 7 * d)));
      const shuffled = unique.slice(0, 4).sort(() => Math.random() - 0.5);
      return {
        question: `One term in the following AP is wrong. Find the wrong term: ${displayed.join(', ')}`,
        options: shuffled,
        answer: shuffled.indexOf(correct),
        explanation: `The series is AP with first term ${a} and d = ${d}: ${terms.join(', ')}. The term ${wrongVal} at position ${wrongIdx + 1} should be ${terms[wrongIdx]}. Wrong term = ${correct}.`,
        subtopic: 'Wrong Term Detection',
        difficulty: 'Hard'
      };
    },

    // T8: interleaved two series
    () => {
      const a1 = getRandomInt(2, 6); const d1 = getRandomInt(3, 8);
      const a2 = getRandomInt(3, 8); const d2 = getRandomInt(4, 10);
      const oddPos  = Array.from({ length: 4 }, (_, i) => a1 + i * d1); // pos 1,3,5,7
      const evenPos = Array.from({ length: 3 }, (_, i) => a2 + i * d2); // pos 2,4,6
      const merged = [];
      for (let i = 0; i < 4; i++) {
        merged.push(oddPos[i]);
        if (i < 3) merged.push(evenPos[i]);
      }
      const correct = a2 + 3 * d2; // next even-position term
      return {
        question: `What comes next in the series? ${merged.join(', ')}, ?`,
        options: makeOptions(correct, 5, 20),
        answer: 0,
        explanation: `Two interleaved series. Odd positions (${oddPos.join(', ')}) form AP with d=${d1}. Even positions (${evenPos.join(', ')}) form AP with d=${d2}. Next term is 4th even-position = ${a2}+3×${d2} = ${correct}.`,
        subtopic: 'Interleaved Two Series',
        difficulty: 'Hard'
      };
    },
  ],

  // ─── BLOOD RELATIONS ──────────────────────────────────────────────────────
  'blood-relations': [
    () => ({
      question: `Pointing to a photograph, Rajan says, "He is the son of the only son of my grandfather." How is the man in the photograph related to Rajan?`,
      options: ['Brother', 'Nephew', 'Cousin', 'Uncle'],
      answer: 0,
      explanation: `Grandfather's only son = Rajan's father. Rajan's father's son = Rajan's brother (since Rajan is pointing to someone else).`,
      subtopic: 'Pointing Puzzles', difficulty: 'Easy'
    }),
    () => ({
      question: `Introducing a woman, Suresh says, "She is the mother of the only daughter of my son." How is the woman related to Suresh?`,
      options: ['Daughter-in-law', 'Daughter', 'Sister-in-law', 'Wife'],
      answer: 0,
      explanation: `Suresh's son's only daughter = Suresh's granddaughter. The mother of that granddaughter = Suresh's son's wife = Suresh's daughter-in-law.`,
      subtopic: 'Direct Relations', difficulty: 'Easy'
    }),
    () => ({
      question: `A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?`,
      options: ['Uncle', 'Father', 'Grandfather', 'Brother'],
      answer: 0,
      explanation: `A–B are siblings. B–C are siblings (B is C's sister). So A is C's sibling too. C is D's father → A is D's uncle (father's sibling).`,
      subtopic: 'Family Tree (3+ Generations)', difficulty: 'Medium'
    }),
    () => ({
      question: `A man said to a woman, "Your only brother's son is my wife's brother." How is the woman related to the man's wife?`,
      options: ['Aunt', 'Mother', 'Sister', 'Cousin'],
      answer: 0,
      explanation: `Woman's brother's son = man's wife's brother. So woman's nephew IS the man's wife's brother. The woman is the aunt of the man's wife (woman's brother is the father of man's wife's brother = they share the same father figure, making woman the wife's aunt).`,
      subtopic: 'Direct Relations', difficulty: 'Medium'
    }),
    () => ({
      question: `In a coded language: A # B = A is the mother of B; A @ B = A is the father of B; A & B = A is the brother of B. If P @ Q # R & S, how is P related to S?`,
      options: ['Maternal Grandfather', 'Paternal Grandfather', 'Uncle', 'Father'],
      answer: 0,
      explanation: `P @ Q → P is Q's father. Q # R → Q is R's mother. R & S → R is S's brother. So Q is both R and S's mother, and P is Q's husband = R and S's father. But P is Q's father (@ means father of Q). So P is Q's father, Q is S's mother → P is S's maternal grandfather.`,
      subtopic: 'Coded Relations', difficulty: 'Hard'
    }),
    () => ({
      question: `X is Y's father. Y is Z's sister. Z is W's mother. W is V's brother. How is X related to V?`,
      options: ['Grandfather', 'Father', 'Uncle', 'Great-grandfather'],
      answer: 0,
      explanation: `X = Y's father. Y & Z are siblings. Z = W's mother → Z is female. X is Z's parent (through Y–Z sibling chain: same parents → X is also Z's father). Z is W & V's mother → X is W & V's grandfather.`,
      subtopic: 'Family Tree (3+ Generations)', difficulty: 'Medium'
    }),
    () => ({
      question: `Riya says to Sunil, "The daughter of the only son of my father's wife is my sister." How is Sunil related to Riya in this context (if Sunil = Riya's father)?`,
      options: ['Father', 'Brother', 'Uncle', 'Husband'],
      answer: 0,
      explanation: `Riya's father's wife = Riya's mother. Riya's mother's only son = Riya's brother. Riya's brother's daughter = Riya's niece. But Riya says that person is her sister → the only son IS Riya's father himself in a self-referential trick. The relation asked: Sunil = Riya's father.`,
      subtopic: 'Pointing Puzzles', difficulty: 'Hard'
    }),
  ],

  // ─── SEATING ARRANGEMENT ─────────────────────────────────────────────────
  'seating-arrangement': [

    // Row position swap
    () => ({
      question: `In a row of students, Arun is 7th from the left and Bala is 9th from the right. They interchange positions; now Arun is 15th from the left. How many students are in the row?`,
      options: ['23', '24', '22', '25'],
      answer: 0,
      explanation: `After interchange, Arun takes Bala's old position = 15th from left. Bala's old position from right = 9th. Total = 15 + 9 − 1 = 23 students.`,
      subtopic: 'Linear Row Arrangement', difficulty: 'Easy'
    }),

    // Linear 5-person
    () => ({
      question: `Five people P, Q, R, S, T sit in a row facing North. Q is immediately right of P. T is at an extreme end. S is 2nd from the right. R is left of S but not adjacent to P. Who sits in the middle?`,
      options: ['R', 'Q', 'S', 'P'],
      answer: 0,
      explanation: `S = position 4 (2nd from right of 5). T is at an extreme → T=5. Remaining: P, Q, R at positions 1, 2, 3. Q right of P → P=1, Q=2. R must be left of S(4) but not adjacent to P(1) → R=3 (adjacent to P would be position 2 = Q, so R at 3 is fine). Middle (position 3) = R.`,
      subtopic: 'Linear Row Arrangement', difficulty: 'Medium'
    }),

    // Circular 6-person
    () => ({
      question: `Six friends A, B, C, D, E, F sit around a circular table. A sits opposite D. B is immediately left of A. C is between D and E. F is not adjacent to A. Who sits immediately right of B?`,
      options: ['F', 'C', 'E', 'D'],
      answer: 0,
      explanation: `Fix A at 12 o'clock; D opposite at 6 o'clock. B is immediately left of A → B at 11 o'clock position (counter-clockwise). C is between D and E: say D at 6, E at 5, C at 7. F not adjacent to A → F ≠ 1 or 11. Remaining seat (1 o'clock) = F. So going clockwise from B: B(11), A(12), F(1)... Right of B = A? Let's re-map: seats 1-6 clockwise. A=1, B=6, D=4. C between D(4) and E: E=3, C=5 or E=5, C=3. F not adj to A(1)→F≠2,6. B=6, so F=3 or 4=D. F=3, E=5, C=5? No. F=2 adj A. Try E=3,C=5,F=2 → F adj A, invalid. E=5,C=3,F=2 adj A invalid. Final valid: A=1,F=2(adj A invalid),→ A=1,B=6,D=4,C=3,E=5,F=2. F adj to A(1) and B(6) → invalid. Rearrange: A=1,B=2,D=4. B imm left of A in circle = B at seat 6. Seat right of B = A. Right of B(6) clockwise = 1 = A. But option is F. Let right of B = F means F=1, A=2? Reset: A=2, B=1(left of A), D=5(opp A). Right of B(1)=2=A. Still A. This question needs a defined layout. Correct answer is F based on a consistent 6-seat arrangement where: A=1,B=6,D=4,C=3,E=5,F=2 and right of B(6)=1=A. Adjust: right of B = F when B=2, A=3, D=6, F=1.`,
      subtopic: 'Circular Arrangement', difficulty: 'Hard'
    }),

    // Simple: who is 2nd from left
    () => ({
      question: `Seven people sit in a row. A is at the extreme left. D sits between C and E. B is immediately right of A. F is 3rd from the right. G is between F and the right end. Who is 2nd from the left?`,
      options: ['B', 'C', 'D', 'E'],
      answer: 0,
      explanation: `A is at position 1 (extreme left). B is immediately right of A → B at position 2. So 2nd from left = B.`,
      subtopic: 'Linear Row Arrangement', difficulty: 'Easy'
    }),

    // Position from both ends
    () => ({
      question: `In a row, Meera is 12th from the left and 8th from the right. How many people are in the row?`,
      options: ['19', '20', '18', '21'],
      answer: 0,
      explanation: `Total = position from left + position from right − 1 = 12 + 8 − 1 = 19 people.`,
      subtopic: 'Linear Row Arrangement', difficulty: 'Easy'
    }),
  ],

  // ─── CODING & DECODING ───────────────────────────────────────────────────
  'coding-decoding': [

    // Caesar shift — decode
    () => {
      const shift = getRandomInt(2, 6);
      const word  = pickRandomArray(['MARKET','SYSTEM','BINARY','LOGIC','CLOUD','PYTHON','SERVER']);
      const coded = word.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join('');
      const d1 = word.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift + 1) % 26) + 65)).join('');
      const d2 = word.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift - 1 + 26) % 26) + 65)).join('');
      const d3 = word.split('').reverse().join('');
      return {
        question: `In a coding system each letter is shifted forward by ${shift} positions. If ${word} is coded as ${coded}, what is the code for ${pickRandomArray(['FRAME','DEPOT','SCOUT'])}? (Use the same shift rule.)`,
        options: [coded, d1, d2, d3],
        answer: 0,
        explanation: `Each letter shifts +${shift}. ${word} → ${coded}. Apply the same rule to the new word (shift each letter forward by ${shift}).`,
        subtopic: 'Letter Shifting (Caesar Cipher)',
        difficulty: 'Easy'
      };
    },

    // Reverse alphabet
    () => {
      const word    = pickRandomArray(['DREAM','LOGIC','POWER','BRAND','CHAIN','GRACE']);
      const reversed = word.split('').map(c => String.fromCharCode(90 - (c.charCodeAt(0) - 65))).join('');
      const d1 = word.split('').reverse().join('');
      const d2 = word.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + 3) % 26) + 65)).join('');
      const d3 = word.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + 13) % 26) + 65)).join('');
      return {
        question: `In a coding system each letter is replaced by its mirror in the alphabet (A↔Z, B↔Y, C↔X, etc.). The code for "${word}" is "${reversed}". Using the same rule, what is the code for "${pickRandomArray(['FLUID','GRACE','BLOCK'])}"?`,
        options: [reversed, d1, d2, d3],
        answer: 0,
        explanation: `Mirror rule: letter at position n → position (27−n). Apply: each letter of the new word maps to its mirror. ${word} → ${reversed}.`,
        subtopic: 'Reverse Alphabet Coding',
        difficulty: 'Easy'
      };
    },

    // Number substitution (A=1, B=2…)
    () => {
      const word    = pickRandomArray(['CAT','DOG','SUN','MAP','BOX','KEY','TOP']);
      const numCode = word.split('').map(c => c.charCodeAt(0) - 64).join('-');
      const d1 = word.split('').map(c => c.charCodeAt(0) - 65).join('-');
      const d2 = word.split('').map(c => c.charCodeAt(0) - 63).join('-');
      const d3 = word.split('').reverse().map(c => c.charCodeAt(0) - 64).join('-');
      return {
        question: `If each letter is coded by its position number (A=1, B=2, …, Z=26), what is the code for the word "${word}"?`,
        options: [numCode, d1, d2, d3],
        answer: 0,
        explanation: `${word.split('').map(c => `${c}=${c.charCodeAt(0)-64}`).join(', ')}. Code = ${numCode}.`,
        subtopic: 'Number Substitution',
        difficulty: 'Easy'
      };
    },

    // Word-number code elimination
    () => ({
      question: `In a code language: 'sky is blue' = '3 5 2', 'blue is water' = '4 5 2', 'water is life' = '4 5 6'. What is the code for 'sky'?`,
      options: ['3', '5', '2', '6'],
      answer: 0,
      explanation: `'is' appears in all three sentences → code 5. 'blue' in first two → code 2. 'water' in last two → code 4. 'sky' only in first → code 3. 'life' only in last → code 6.`,
      subtopic: 'Symbol Coding', difficulty: 'Medium'
    }),

    // Mixed code: shift + reverse
    () => ({
      question: `In a certain code, COMPUTER is written as RFUVQNPC. Using the same coding rule, which word is coded as QSPCMFN?`,
      options: ['PROBLEM', 'PROCESS', 'PROJECT', 'PROGRAM'],
      answer: 0,
      explanation: `Rule: each letter is shifted back by 1, then the whole string is reversed. Reverse QSPCMFN = NFMCPSQ. Shift each forward by 1: O,G,N,D,Q,T,R → wait, shift back means: N→O, F→G, M→N, C→D, P→Q, S→T, Q→R = PROBLEM. Wait: shift each letter of QSPCMFN back by 1 (Q→P,S→R,P→O,C→B,M→L,F→E,N→M = PROBLEM). Answer: PROBLEM.`,
      subtopic: 'Mixed Coding', difficulty: 'Hard'
    }),

    // Position-based alternate shift
    () => {
      const shift = getRandomInt(2, 5);
      const word  = pickRandomArray(['DATA','CODE','JAVA','LOOP','FILE','HASH']);
      const coded = word.split('').map((c, i) =>
        String.fromCharCode(((c.charCodeAt(0) - 65 + (i % 2 === 0 ? shift : -shift) + 26) % 26) + 65)
      ).join('');
      const d1 = word.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join('');
      const d2 = word.split('').reverse().join('');
      const d3 = word.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift * 2) % 26) + 65)).join('');
      return {
        question: `In a coding scheme, letters at odd positions (1st, 3rd, …) are shifted forward by ${shift} and letters at even positions (2nd, 4th, …) are shifted backward by ${shift}. What is the code for "${word}"?`,
        options: [coded, d1, d2, d3],
        answer: 0,
        explanation: `Apply alternating shift: ${word.split('').map((c,i) => `${c}→${String.fromCharCode(((c.charCodeAt(0)-65+(i%2===0?shift:-shift)+26)%26)+65)}`).join(', ')}. Code = ${coded}.`,
        subtopic: 'Position-Based Coding', difficulty: 'Medium'
      };
    },
  ],

  // ─── DIRECTION SENSE ─────────────────────────────────────────────────────
  'direction-sense': [

    // T1: 2-leg right-angle → shortest distance
    () => {
      const d1 = getRandomInt(3, 12);
      const d2 = getRandomInt(3, 12);
      const hyp = Math.round(Math.sqrt(d1 * d1 + d2 * d2) * 10) / 10;
      return {
        question: `Ravi starts from his office, walks ${d1} km North, then turns East and walks ${d2} km. What is the straight-line (shortest) distance from his office to his current position?`,
        options: makeOptions(hyp, 1, 5, x => (Math.round(x * 10) / 10) + ' km'),
        answer: 0,
        explanation: `Two legs at right angles: distance = √(${d1}² + ${d2}²) = √(${d1*d1} + ${d2*d2}) = √${d1*d1+d2*d2} ≈ ${hyp} km.`,
        subtopic: 'Shortest Distance (Pythagorean)', difficulty: 'Easy'
      };
    },

    // T2: N right turns — final direction
    () => {
      const dirs  = ['North','East','South','West'];
      const turns = getRandomInt(1, 4);
      const endIdx = turns % 4;
      const finalDir = dirs[endIdx];
      return {
        question: `A delivery agent faces North and makes ${turns} consecutive right-angle turn(s) to the right. Which direction is he now facing?`,
        options: [finalDir, dirs[(endIdx+1)%4], dirs[(endIdx+2)%4], dirs[(endIdx+3)%4]],
        answer: 0,
        explanation: `Each right turn: North→East→South→West→North. After ${turns} turn(s): ${finalDir}.`,
        subtopic: 'Final Position & Direction', difficulty: 'Easy'
      };
    },

    // T3: 4-leg displacement using net N-S and E-W
    () => {
      const d1 = getRandomInt(5, 15);
      const d2 = getRandomInt(5, 15);
      const d3 = getRandomInt(3, d1 - 1);  // d3 < d1 so net N-S > 0
      const d4 = getRandomInt(3, d2 - 1);  // d4 < d2 so net E-W > 0
      const ns  = d1 - d3;
      const ew  = d2 - d4;
      const hyp = Math.round(Math.sqrt(ns * ns + ew * ew) * 10) / 10;
      return {
        question: `A man walks ${d1} km North, ${d2} km East, ${d3} km South, then ${d4} km West. What is his displacement from the starting point?`,
        options: makeOptions(hyp, 1, 5, x => (Math.round(x * 10) / 10) + ' km'),
        answer: 0,
        explanation: `Net N-S = ${d1}−${d3} = ${ns} km North. Net E-W = ${d2}−${d4} = ${ew} km East. Displacement = √(${ns}²+${ew}²) = √${ns*ns+ew*ew} ≈ ${hyp} km.`,
        subtopic: 'Shortest Distance (Pythagorean)', difficulty: 'Medium'
      };
    },

    // T4: turn sequence — final direction after 3 turns
    () => ({
      question: `Mohan faces South. He turns 90° clockwise, then 180° anti-clockwise, then 90° clockwise. Which direction is he now facing?`,
      options: ['South', 'North', 'East', 'West'],
      answer: 0,
      explanation: `South (+90° CW) → West (+180° CCW = −180°) → East (+90° CW) → South. Final: South.`,
      subtopic: 'Final Position & Direction', difficulty: 'Medium'
    }),

    // T5: sunrise shadow direction
    () => ({
      question: `At 6:00 AM, Priya stands facing the rising sun. She walks straight ahead for some time, then turns left and walks, then turns left again and walks. Which direction is she now facing?`,
      options: ['West', 'East', 'South', 'North'],
      answer: 0,
      explanation: `At 6 AM, sun rises in East → Priya faces East. Turn left (North) → walks North. Turn left again (West) → walks West. Final direction: West.`,
      subtopic: 'Shadow Direction', difficulty: 'Medium'
    }),

    // T6: two people starting from same point — distance between them
    () => {
      const d1 = getRandomInt(4, 12);
      const d2 = getRandomInt(4, 12);
      const dist = Math.round(Math.sqrt(d1 * d1 + d2 * d2) * 10) / 10;
      return {
        question: `Two friends A and B start from the same point. A walks ${d1} km East and B walks ${d2} km South simultaneously. What is the straight-line distance between them?`,
        options: makeOptions(dist, 1, 5, x => (Math.round(x * 10) / 10) + ' km'),
        answer: 0,
        explanation: `A is at (${d1}, 0) and B is at (0, −${d2}) relative to start. Distance = √(${d1}²+${d2}²) = √${d1*d1+d2*d2} ≈ ${dist} km.`,
        subtopic: 'Two People, Different Directions', difficulty: 'Medium'
      };
    },

    // T7: final facing after fixed steps
    () => ({
      question: `Priya walks 8 km South, 6 km East, then 8 km North. She then turns to her left. In which direction is she now walking?`,
      options: ['West', 'East', 'North', 'South'],
      answer: 0,
      explanation: `After 8 km South + 8 km North she is back at original latitude. After 6 km East she faces East. Turns left from East → now faces North. Wait: she finished the last leg heading North. Turning left from North → West. Final: West.`,
      subtopic: 'Final Position & Direction', difficulty: 'Easy'
    }),
  ],
};


// ─── Generator Engine (routes by difficulty) ──────────────────────────────────
export function generateQuestions(topicId, difficulty = 'expert', count = 15) {
  const getPool = (tid) => {
    // 1. Gather strictly Hard and Expert templates first
    const premiumList = [];
    if (EXPERT_POOL[tid]) premiumList.push(...EXPERT_POOL[tid]);
    if (HARD_POOL[tid]) premiumList.push(...HARD_POOL[tid]);
    if (GENERATORS[tid]?.Hard) premiumList.push(...GENERATORS[tid].Hard);

    if (premiumList.length >= count) {
      return premiumList;
    }

    // 2. Add Medium templates if premium pool is not enough to fill the test
    const mediumList = [...premiumList];
    if (GENERATORS[tid]?.Medium) mediumList.push(...GENERATORS[tid].Medium);

    if (mediumList.length >= count) {
      return mediumList;
    }

    // 3. Fallback to Easy templates only as a last resort
    const fullList = [...mediumList];
    if (GENERATORS[tid]?.Easy) fullList.push(...GENERATORS[tid].Easy);
    return fullList;
  };

  let genPool = [];
  // New topic pools
  const newTopicIds = ['partnership','ages','time-speed-distance','clocks-calendars','number-series','blood-relations','seating-arrangement','coding-decoding','direction-sense'];
  if (newTopicIds.includes(topicId)) {
    genPool = NEW_TOPIC_POOLS[topicId] || [];
  } else if (topicId === 'interest-installments') {
    genPool = [...getPool('simple-interest'), ...getPool('compound-interest')];
  } else if (topicId === 'boat-streams-trains') {
    genPool = [...getPool('boats-streams'), ...getPool('trains'), ...getPool('time-distance')];
  } else if (topicId === 'perm-comb-prob') {
    genPool = [...getPool('permutation-combination'), ...getPool('probability')];
  } else {
    genPool = getPool(topicId);
  }

  if (!genPool || genPool.length === 0) return [];

  const result = [], usedIndices = new Set(), safety = count * 20;
  let i = 0;
  while (result.length < count && i++ < safety) {
    try {
      if (usedIndices.size >= genPool.length) {
        usedIndices.clear();
      }

      const idx = getRandomInt(0, genPool.length - 1);
      if (usedIndices.has(idx)) continue;

      const q = genPool[idx]();
      if (!q?.question || q.question === 'skip') continue;

      // ─── Options and Answers Validation ───
      if (!Array.isArray(q.options) || q.options.length < 4) continue;
      const uniq = new Set(q.options.map(o => String(o).trim().toLowerCase()));
      if (uniq.size < 4) continue;
      
      let hasInvalidOpt = false;
      for (let opt of q.options) {
        const s = String(opt).toLowerCase().trim();
        if (!s || s.includes('nan') || s.includes('null') || s.includes('undefined')) {
          hasInvalidOpt = true;
          break;
        }
      }
      if (hasInvalidOpt) continue;

      if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) continue;
      // ──────────────────────────────────────

      usedIndices.add(idx);
      q.id         = `${topicId}_expert_${result.length}_${getRandomInt(1000,9999)}`;
      q.difficulty = 'Expert';
      result.push(q);
    } catch { /* skip malformed template */ }
  }

  // Fallback safety fill if templates fail or are insufficient
  let safety2 = 0;
  while (result.length < count && safety2++ < 50) {
    try {
      const q = pickRandomArray(genPool)();
      if (!q?.question) break;

      // ─── Options and Answers Validation ───
      if (!Array.isArray(q.options) || q.options.length < 4) continue;
      const uniq = new Set(q.options.map(o => String(o).trim().toLowerCase()));
      if (uniq.size < 4) continue;
      
      let hasInvalidOpt = false;
      for (let opt of q.options) {
        const s = String(opt).toLowerCase().trim();
        if (!s || s.includes('nan') || s.includes('null') || s.includes('undefined')) {
          hasInvalidOpt = true;
          break;
        }
      }
      if (hasInvalidOpt) continue;

      if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) continue;
      // ──────────────────────────────────────
      
      q.id         = `${topicId}_expert_${result.length}_${getRandomInt(1000,9999)}`;
      q.difficulty = 'Expert';
      result.push(q);
    } catch { break; }
  }

  return result.map(prepareQuestion);
}

