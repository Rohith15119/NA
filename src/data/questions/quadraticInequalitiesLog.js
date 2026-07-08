export const quadraticEquationsQuestions = [
  // Easy
  { id:'qe1', question:'Solve: x² - 7x + 12 = 0', options:['x = 3, 4','x = -3, -4','x = 3, -4','x = -3, 4'], answer:0, explanation:'x² - 7x + 12 = (x-3)(x-4) = 0. So x = 3 or x = 4.', difficulty:'Easy', subtopic:'Factoring' },
  { id:'qe2', question:'Sum of roots of 3x² - 9x + 6 = 0 is:', options:['3','6','-3','2'], answer:0, explanation:'Sum of roots = -b/a = -(-9)/3 = 9/3 = 3.', difficulty:'Easy', subtopic:'Roots' },
  { id:'qe3', question:'Product of roots of 2x² + 5x - 12 = 0 is:', options:['-6','6','-2.5','2.5'], answer:0, explanation:'Product of roots = c/a = -12/2 = -6.', difficulty:'Easy', subtopic:'Roots' },
  { id:'qe4', question:'Form a quadratic equation with roots -3 and 5.', options:['x² - 2x - 15 = 0','x² + 2x - 15 = 0','x² - 2x + 15 = 0','x² + 2x + 15 = 0'], answer:0, explanation:'Sum = -3+5 = 2. Product = -3×5 = -15. Equation: x² - 2x - 15 = 0.', difficulty:'Easy', subtopic:'Forming Equations' },
  { id:'qe5', question:'Solve the equation: x + 6/x = 5', options:['x = 2, 3','x = -2, -3','x = 1, 5','x = -1, -5'], answer:0, explanation:'Multiply by x: x² - 5x + 6 = 0 → (x - 2)(x - 3) = 0 → x = 2 or x = 3.', difficulty:'Easy', subtopic:'Factoring' },

  // Medium
  { id:'qe6', question:'For what value of k does x² - kx + 9 = 0 have equal roots?', options:['6 or -6','3 or -3','9 or -9','4 or -4'], answer:0, explanation:'Equal roots: D=0. k²-4×9=0 → k²=36 → k=±6.', difficulty:'Medium', subtopic:'Nature of Roots' },
  { id:'qe7', question:'Solve: 2x² - 5x - 3 = 0', options:['x = 3, -0.5','x = -3, 0.5','x = 3, 1','x = -1, 1.5'], answer:0, explanation:'2x²-5x-3=0. (2x+1)(x-3)=0. x=3 or x=-0.5.', difficulty:'Medium', subtopic:'Quadratic Formula' },
  { id:'qe8', question:'Equation I: x²-5x+6=0. Equation II: y²-7y+12=0. Which is true?', options:['x ≤ y','Cannot determine','x ≥ y','x = y'], answer:0, explanation:'x: (x-2)(x-3)=0 → x=2 or 3. y: (y-3)(y-4)=0 → y=3 or 4. In all combinations (x=2, y=3; x=2, y=4; x=3, y=3; x=3, y=4), x is less than or equal to y. So x ≤ y is always true.', difficulty:'Medium', subtopic:'Comparison' },
  { id:'qe9', question:'If one root of x² + px + 12 = 0 is 4, find p.', options:['-7','7','-3','3'], answer:0, explanation:'x=4 is a root: 16+4p+12=0 → 4p=-28 → p=-7.', difficulty:'Medium', subtopic:'Roots' },
  { id:'qe10', question:'Nature of roots of 4x² - 4x + 1 = 0?', options:['Equal real roots','Two distinct real roots','No real roots','One real root'], answer:0, explanation:'D = (-4)²-4×4×1 = 16-16 = 0. Equal real roots.', difficulty:'Medium', subtopic:'Nature of Roots' },

  // Hard
  { id:'qe11', question:'If α and β are roots of x² - 6x + 8 = 0, find α² + β².', options:['20','36','28','16'], answer:0, explanation:'α+β=6, αβ=8. α²+β² = (α+β)²-2αβ = 36-16 = 20.', difficulty:'Hard', subtopic:'Roots' },
  { id:'qe12', question:'If the roots of x² - px + 9 = 0 have a difference of 8, find the positive value of p.', options:['10','8','12','6'], answer:0, explanation:'Roots α, β. α - β = 8 → (α - β)² = 64 → (α + β)² - 4αβ = 64 → p² - 36 = 64 → p² = 100 → p = 10.', difficulty:'Hard', subtopic:'Roots' },
  { id:'qe13', question:'Find the value of m for which the sum of the roots of 2x² - (m-3)x + 8 = 0 is equal to half their product.', options:['7','5','8','6'], answer:0, explanation:'Sum of roots = (m - 3)/2. Product of roots = 8/2 = 4. Given: Sum = Product / 2 → (m - 3)/2 = 2 → m - 3 = 4 → m = 7.', difficulty:'Hard', subtopic:'Roots' },
  { id:'qe14', question:'If one root of x² - 8x + k = 0 is 3 times the other, find the value of k.', options:['12','16','9','15'], answer:0, explanation:'Let roots be α and 3α. Sum = 4α = 8 → α = 2. Roots are 2 and 6. Product = k = 2 × 6 = 12.', difficulty:'Hard', subtopic:'Roots' },
  { id:'qe15', question:'Find the number of real roots of the equation: x² - 3|x| + 2 = 0.', options:['4','2','0','3'], answer:0, explanation:'For x ≥ 0: x² - 3x + 2 = 0 → x = 1, 2. For x < 0: x² + 3x + 2 = 0 → x = -1, -2. Total real roots = 4.', difficulty:'Hard', subtopic:'Roots' }
];

export const inequalitiesQuestions = [
  // Easy
  { id:'iq1', question:'Solve: 3x - 7 > 11', options:['x > 6','x < 6','x ≥ 6','x ≤ 6'], answer:0, explanation:'3x > 18 → x > 6.', difficulty:'Easy', subtopic:'Linear Inequality' },
  { id:'iq2', question:'Solve: |2x - 3| ≤ 5', options:['-1 ≤ x ≤ 4','x ≤ -1 or x ≥ 4','0 ≤ x ≤ 4','-2 ≤ x ≤ 3'], answer:0, explanation:'-5 ≤ 2x-3 ≤ 5 → -2 ≤ 2x ≤ 8 → -1 ≤ x ≤ 4.', difficulty:'Easy', subtopic:'Absolute Value' },
  { id:'iq3', question:'If a > b > 0, which of the following is always true?', options:['1/a < 1/b','a² < b²','a - b < 0','-a > -b'], answer:0, explanation:'a > b > 0 → dividing by ab: 1/b > 1/a → 1/a < 1/b.', difficulty:'Easy', subtopic:'Inequality Properties' },
  { id:'iq4', question:'Solve: 5 - 2x ≥ 11', options:['x ≤ -3','x ≥ -3','x ≤ 3','x ≥ 3'], answer:0, explanation:'-2x ≥ 6 → x ≤ -3.', difficulty:'Easy', subtopic:'Linear Inequality' },
  { id:'iq5', question:'Solve the inequality: x² - 9 < 0', options:['-3 < x < 3','x < -3 or x > 3','x < 3','x > -3'], answer:0, explanation:'(x - 3)(x + 3) < 0. Since it is < 0, it is between the roots: -3 < x < 3.', difficulty:'Easy', subtopic:'Quadratic Inequality' },

  // Medium
  { id:'iq6', question:'Equation I: x² - 5x + 4 ≤ 0. The solution set is:', options:['1 ≤ x ≤ 4','x ≤ 1 or x ≥ 4','0 ≤ x ≤ 5','x < 1'], answer:0, explanation:'x²-5x+4=(x-1)(x-4)≤0. Since it is ≤0, it is between the roots: 1 ≤ x ≤ 4.', difficulty:'Medium', subtopic:'Quadratic Inequality' },
  { id:'iq7', question:'Solve: (x-2)(x+3) > 0', options:['x < -3 or x > 2','-3 < x < 2','x > 2','x < -3'], answer:0, explanation:'Product > 0 when both are positive (x > 2) or both negative (x < -3).', difficulty:'Medium', subtopic:'Quadratic Inequality' },
  { id:'iq8', question:'Equation I: x² - x - 6 ≥ 0. Solution?', options:['x ≤ -2 or x ≥ 3','-2 ≤ x ≤ 3','x ≥ 3','All x'], answer:0, explanation:'x²-x-6=(x-3)(x+2)≥0. ≥0 outside roots: x≤-2 or x≥3.', difficulty:'Medium', subtopic:'Quadratic Inequality' },
  { id:'iq9', question:'The integer values of x satisfying: -3 ≤ 2x - 1 < 7 are:', options:['-1, 0, 1, 2, 3','0, 1, 2, 3','-1, 0, 1, 2','0, 1, 2'], answer:0, explanation:'-3≤2x-1<7 → -2≤2x<8 → -1≤x<4. Integers: -1, 0, 1, 2, 3.', difficulty:'Medium', subtopic:'Linear Inequality' },
  { id:'iq10', question:'Find the range of x if: 1/x > 2 (given x > 0).', options:['0 < x < 0.5','x > 0.5','x < 0.5','x > 2'], answer:0, explanation:'For x > 0: 1/x > 2 → x < 1/2. Thus, 0 < x < 0.5.', difficulty:'Medium', subtopic:'Rational Inequality' },

  // Hard
  { id:'iq11', question:'I: p² - 3p + 2 ≤ 0. II: q² - 5q + 6 ≤ 0. Find the relation between p and q.', options:['p ≤ q','p ≥ q','p = q','Cannot determine'], answer:0, explanation:'p ∈ [1,2] and q ∈ [2,3]. So p ≤ q always.', difficulty:'Hard', subtopic:'Quadratic Inequality' },
  { id:'iq12', question:'Which of the following describes the solution of: |x - 4| > 3?', options:['x < 1 or x > 7','1 < x < 7','x > 7','x < 1'], answer:0, explanation:'|x - 4| > 3 → x - 4 > 3 or x - 4 < -3 → x > 7 or x < 1.', difficulty:'Hard', subtopic:'Absolute Value' },
  { id:'iq13', question:'Find the range of x satisfying the inequality: (x - 1)(x - 2) / (x - 3) ≥ 0.', options:['1 ≤ x ≤ 2 or x > 3','x ≤ 1 or 2 ≤ x < 3','1 < x < 2','x > 3'], answer:0, explanation:'Roots at 1, 2. Pole at 3. Using sign schemes: Positive when 1 ≤ x ≤ 2 or x > 3 (x cannot be 3).', difficulty:'Hard', subtopic:'Rational Inequality' },
  { id:'iq14', question:'Solve the system of inequalities: x² - 5x + 6 > 0 and x² - 3x + 2 ≤ 0.', options:['1 ≤ x < 2','1 < x < 2','x ≥ 1','x < 2'], answer:0, explanation:'x² - 5x + 6 > 0 → x < 2 or x > 3. x² - 3x + 2 ≤ 0 → 1 ≤ x ≤ 2. Intersection = 1 ≤ x < 2.', difficulty:'Hard', subtopic:'Quadratic Inequality' },
  { id:'iq15', question:'Find the number of integer values of x that satisfy: |x - 3| < 2 and |x - 1| > 1.', options:['2','3','1','4'], answer:0, explanation:'|x - 3| < 2 → 1 < x < 5. |x - 1| > 1 → x > 2 or x < 0. Intersection = 2 < x < 5. Integer values are 3 and 4 (count = 2).', difficulty:'Hard', subtopic:'Absolute Value' }
];

export const logarithmsQuestions = [
  // Easy
  { id:'log1', question:'log₂(32) = ?', options:['5','4','6','3'], answer:0, explanation:'2⁵ = 32. So log₂(32) = 5.', difficulty:'Easy', subtopic:'Basic Log' },
  { id:'log2', question:'log(75) + log(4) - log(3) = ? (all log base 10)', options:['2','1','3','0'], answer:0, explanation:'log(75×4/3) = log(100) = log₁₀(10²) = 2.', difficulty:'Easy', subtopic:'Log Properties' },
  { id:'log3', question:'Solve: log₃(x) + log₃(9) = 4', options:['9','27','3','81'], answer:0, explanation:'log₃(9) = 2. So log₃(x) = 2. x = 3² = 9.', difficulty:'Easy', subtopic:'Log Equations' },
  { id:'log4', question:'If log_x(343) = 3, find x.', options:['7','6','8','9'], answer:0, explanation:'x³ = 343 = 7³, so x = 7.', difficulty:'Easy', subtopic:'Basic Log' },
  { id:'log5', question:'Simplify: log(25) + log(8) - log(2) (all base 10)', options:['2','1','3','0'], answer:0, explanation:'log(25) + log(8) - log(2) = log(25 × 8 / 2) = log(100) = log₁₀(10²) = 2.', difficulty:'Easy', subtopic:'Log Properties' },

  // Medium
  { id:'log6', question:'If log(2) = 0.3010 and log(3) = 0.4771, find log(12).', options:['1.0791','0.7781','1.3802','0.6021'], answer:0, explanation:'log(12) = log(4×3) = 2log(2)+log(3) = 2(0.3010)+0.4771 = 1.0791.', difficulty:'Medium', subtopic:'Log Properties' },
  { id:'log7', question:'log₁₀(0.001) = ?', options:['-3','3','-2','2'], answer:0, explanation:'0.001 = 10⁻³. So log₁₀(10⁻³) = -3.', difficulty:'Medium', subtopic:'Basic Log' },
  { id:'log8', question:'If log₂(x) = -3, find x.', options:['1/8','1/6','8','-8'], answer:0, explanation:'x = 2⁻³ = 1/8.', difficulty:'Medium', subtopic:'Log Equations' },
  { id:'log9', question:'log_b(a) × log_a(b) = ?', options:['1','0','log(ab)','log(a+b)'], answer:0, explanation:'log_b(a) = log(a)/log(b). log_a(b) = log(b)/log(a). Product = 1.', difficulty:'Medium', subtopic:'Log Properties' },
  { id:'log10', question:'If log_y(x) = 3 and log_z(y) = 2, find log_z(x).', options:['6','5','8','9'], answer:0, explanation:'log_z(x) = log_z(y) × log_y(x) = 2 × 3 = 6.', difficulty:'Medium', subtopic:'Log Properties' },

  // Hard
  { id:'log11', question:'If log(2) = 0.3010, find the number of digits in 2²0.', options:['7','6','8','5'], answer:0, explanation:'log(2²0) = 20×0.3010 = 6.020. Digits = ⌊6.020⌋+1 = 7.', difficulty:'Hard', subtopic:'Applications' },
  { id:'log12', question:'Solve for x: log₂(x + 2) + log₂(x - 2) = 5', options:['6','8','4','10'], answer:0, explanation:'log₂((x + 2)(x - 2)) = 5 → x² - 4 = 2⁵ = 32 → x² = 36 → x = 6 (since x > 2).', difficulty:'Hard', subtopic:'Log Equations' },
  { id:'log13', question:'If log_x(y) = 100 and log₂[x] = 10, find the value of y.', options:['2¹⁰⁰⁰','2¹⁰⁰','2¹⁰','2⁵⁰⁰'], answer:0, explanation:'log₂[x] = 10 → x = 2¹⁰ = 1024. log_x(y) = 100 → y = x¹⁰⁰ = (2¹⁰)¹⁰⁰ = 2¹⁰⁰⁰.', difficulty:'Hard', subtopic:'Log Equations' },
  { id:'log14', question:'Solve for x: log₁₀(x - 3) + log₁₀(x) = 1', options:['5','2','-2','10'], answer:0, explanation:'log₁₀(x(x - 3)) = 1 → x² - 3x = 10 → x² - 3x - 10 = 0 → (x - 5)(x + 2) = 0. Since x > 3, x = 5.', difficulty:'Hard', subtopic:'Log Equations' },
  { id:'log15', question:'Find the value of x if: log_x(2) + log_x(4) + log_x(8) = 6', options:['2','4','8','3'], answer:0, explanation:'log_x(2 × 4 × 8) = log_x(64) = 6 → x⁶ = 64 → x = 2.', difficulty:'Hard', subtopic:'Log Equations' }
];
