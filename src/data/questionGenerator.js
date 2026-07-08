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

// Numerical Ability Question Generator Engine
export function generateQuestions(topicId, difficulty, count = 5) {
  const key = difficulty ? (difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()) : 'Easy';
  const genPool = GENERATORS[topicId]?.[key];
  if (!genPool || genPool.length === 0) return [];
  
  let result = [];
  const attempts = count * 3; // search space
  const seenQuestions = new Set();
  
  for (let i = 0; i < attempts && result.length < count; i++) {
    const gen = pickRandomArray(genPool);
    const q = gen();
    
    if (!seenQuestions.has(q.question)) {
      seenQuestions.add(q.question);
      q.id = `${topicId}_${difficulty.toLowerCase()}_${result.length}_${getRandomInt(100, 999)}`;
      q.difficulty = key;
      result.push(q);
    }
  }
  
  while (result.length < count) {
    const gen = pickRandomArray(genPool);
    const q = gen();
    q.id = `${topicId}_${difficulty.toLowerCase()}_${result.length}_${getRandomInt(100, 999)}`;
    q.difficulty = key;
    result.push(q);
  }
  
  return result.map(prepareQuestion);
}
