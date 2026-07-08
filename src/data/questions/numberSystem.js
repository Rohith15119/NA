export const numberSystemQuestions = [
  // Easy
  { id:'ns1', question:'Find the LCM of 12, 18 and 24.', options:['72','36','144','48'], answer:0, explanation:'12=2²×3, 18=2×3², 24=2³×3. LCM=2³×3²=8×9=72.', difficulty:'Easy', subtopic:'LCM' },
  { id:'ns2', question:'Find the HCF of 48, 72 and 96.', options:['24','12','48','6'], answer:0, explanation:'48=2⁴×3, 72=2³×3², 96=2⁵×3. HCF=2³×3=24.', difficulty:'Easy', subtopic:'HCF' },
  { id:'ns3', question:'LCM of two numbers is 180 and HCF is 6. If one number is 30, find the other number.', options:['36','45','60','90'], answer:0, explanation:'Product = LCM×HCF = 180×6=1080. Other number = 1080÷30 = 36.', difficulty:'Easy', subtopic:'LCM & HCF' },
  { id:'ns4', question:'Which of the following numbers is divisible by 9?', options:['74826','69143','75831','82461'], answer:0, explanation:'Sum of digits of 74826 = 7+4+8+2+6 = 27, which is divisible by 9.', difficulty:'Easy', subtopic:'Divisibility' },
  { id:'ns5', question:'What is the remainder when 256 is divided by 7?', options:['4','3','5','2'], answer:0, explanation:'256 = 7×36 + 4. Remainder = 4.', difficulty:'Easy', subtopic:'Remainders' },
  
  // Medium
  { id:'ns6', question:'Find the smallest number divisible by all integers from 1 to 10.', options:['2520','5040','1260','3600'], answer:0, explanation:'LCM(1–10) = 2³×3²×5×7 = 2520.', difficulty:'Medium', subtopic:'LCM' },
  { id:'ns7', question:'A number leaves remainder 3 when divided by 7. What remainder does its square leave when divided by 7?', options:['2','3','4','1'], answer:0, explanation:'Number = 7k+3. Square = (7k+3)² = 49k²+42k+9 = 7(7k²+6k+1)+2. Remainder = 2.', difficulty:'Medium', subtopic:'Remainders' },
  { id:'ns8', question:'How many total factors does 720 have?', options:['30','24','36','18'], answer:0, explanation:'720=2⁴×3²×5. Total factors = (4+1)(2+1)(1+1) = 5×3×2 = 30.', difficulty:'Medium', subtopic:'Number Properties' },
  { id:'ns9', question:'Three bells ring at intervals of 12, 15 and 20 minutes. If they ring together at 6 AM, they ring together next at:', options:['7:00 AM','6:30 AM','6:45 AM','7:30 AM'], answer:0, explanation:'LCM(12,15,20)=60 min. Next ring = 6:00 + 60 min = 7:00 AM.', difficulty:'Medium', subtopic:'LCM' },
  { id:'ns10', question:'Find the unit digit of 7^95 - 3^58.', options:['4','0','6','7'], answer:0, explanation:'Unit digit of 7^95: 95 mod 4 = 3, so 7³ ends in 3. Unit digit of 3^58: 58 mod 4 = 2, so 3² ends in 9. (3 - 9) = -6 ≡ 4 mod 10.', difficulty:'Medium', subtopic:'Unit Digit' },
  
  // Hard
  { id:'ns11', question:'Find the remainder when 4³² is divided by 5.', options:['1','0','4','2'], answer:0, explanation:'4 ≡ -1 (mod 5). 4³² ≡ (-1)³² ≡ 1 (mod 5). Remainder is 1.', difficulty:'Hard', subtopic:'Remainders' },
  { id:'ns12', question:'Find the largest 4-digit number divisible by 15, 25, and 35.', options:['9975','9950','9900','9825'], answer:0, explanation:'LCM of 15, 25, and 35 is 525. 9999 ÷ 525 = 19.04. The largest 4-digit multiple is 19 × 525 = 9975.', difficulty:'Hard', subtopic:'Divisibility' },
  { id:'ns13', question:'What is the remainder when 3^21 is divided by 5?', options:['3','1','2','4'], answer:0, explanation:'By Fermat\'s Theorem, 3⁴ ≡ 1 (mod 5). Thus, 3^21 = (3⁴)⁵ × 3¹ ≡ 1 × 3 ≡ 3 (mod 5).', difficulty:'Hard', subtopic:'Remainders' },
  { id:'ns14', question:'Find the unit digit of the expression: 23^34 × 45^56 × 78^89.', options:['0','5','8','2'], answer:0, explanation:'Unit digit of 23^34 is 3² = 9. Unit digit of 45^56 is 5. Unit digit of 78^89 is 8¹ = 8. Product unit digit = 9 × 5 × 8 = 360 → 0.', difficulty:'Hard', subtopic:'Unit Digit' },
  { id:'ns15', question:'What is the remainder when (17^23 + 23^23) is divided by 40?', options:['0','1','2','3'], answer:0, explanation:'Since 23 is odd, (a^n + b^n) is divisible by (a+b). Here, 17^23 + 23^23 is divisible by 17 + 23 = 40. The remainder is 0.', difficulty:'Hard', subtopic:'Remainders' }
];
