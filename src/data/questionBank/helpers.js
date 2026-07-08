// Shared utility functions for question generation

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

export function nCr(n, r) {
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;
  let num = 1, den = 1;
  for (let i = 0; i < r; i++) {
    num *= (n - i);
    den *= (i + 1);
  }
  return Math.round(num / den);
}

export function nPr(n, r) {
  if (r > n) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) result *= (n - i);
  return result;
}

export function factorial(n) {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** Shuffle array in-place (Fisher-Yates) */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick a random element from an array */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a distractor near the correct answer (integer) */
export function distractor(correct, range = 5) {
  let d;
  do { d = correct + getRandomInt(-range, range); } while (d === correct || d <= 0);
  return d;
}

/** Generate 3 unique distractors near the correct answer */
export function distractors3(correct, range = 5) {
  const set = new Set();
  set.add(correct);
  while (set.size < 4) {
    let d = correct + getRandomInt(-range, range);
    if (d > 0 && !set.has(d)) set.add(d);
  }
  const arr = [...set].filter(x => x !== correct);
  return arr.slice(0, 3);
}

/** Build a standard 4-option question object with answer=0 and shuffled options */
export function makeQuestion({ question, correct, wrong, explanation, subtopic }) {
  const options = [correct, ...wrong];
  // Shuffle options, track correct index
  const indices = [0, 1, 2, 3];
  shuffle(indices);
  const shuffled = indices.map(i => options[i]);
  const answer = indices.indexOf(0);
  return { question, options: shuffled.map(String), answer, explanation, subtopic, difficulty: 'Expert' };
}

/** Format a fraction string in simplest form */
export function frac(num, den) {
  const g = gcd(Math.abs(num), Math.abs(den));
  return `${num/g}/${den/g}`;
}

/** Format a ratio string in simplest form */
export function ratio(a, b) {
  const g = gcd(Math.abs(a), Math.abs(b));
  return `${a/g}:${b/g}`;
}
