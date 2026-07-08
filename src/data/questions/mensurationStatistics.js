export const mensurationQuestions = [
  // Easy
  { id:'men1', question:'Area of a rectangle is 360 cm². If length is 24 cm, find perimeter.', options:['78 cm','60 cm','90 cm','72 cm'], answer:0, explanation:'Width = 360/24 = 15 cm. Perimeter = 2(24+15) = 2×39 = 78 cm.', difficulty:'Easy', subtopic:'Rectangle' },
  { id:'men2', question:'Circumference of a circle is 88 cm. Find its area. (π = 22/7)', options:['616 cm²','154 cm²','308 cm²','528 cm²'], answer:0, explanation:'2πr = 88 → r = 88×7/(2×22) = 14 cm. Area = πr² = (22/7)×196 = 616 cm².', difficulty:'Easy', subtopic:'Circle' },
  { id:'men3', question:'Volume of a cuboid is 840 cm³. Length = 10 cm, breadth = 7 cm. Height?', options:['12 cm','10 cm','14 cm','8 cm'], answer:0, explanation:'V = l×b×h → 840 = 10×7×h → h = 840/70 = 12 cm.', difficulty:'Easy', subtopic:'Cuboid' },
  { id:'men4', question:'Area of a triangle with sides 5, 12, 13 cm?', options:['30 cm²','60 cm²','25 cm²','65 cm²'], answer:0, explanation:'5²+12²=13² (Right triangle). Area = (1/2)×5×12 = 30 cm².', difficulty:'Easy', subtopic:'Triangle' },
  { id:'men5', question:'Find the area of a sector of a circle with radius 6 cm and sector angle 60°. (π = 22/7)', options:['18.86 cm²','15.50 cm²','22.00 cm²','12.30 cm²'], answer:0, explanation:'Area = (60/360) × πr² = (1/6) × (22/7) × 36 = 132/7 ≈ 18.86 cm².', difficulty:'Easy', subtopic:'Circle' },

  // Medium
  { id:'men6', question:'Total surface area of a cube with side 8 cm?', options:['384 cm²','512 cm²','192 cm²','256 cm²'], answer:0, explanation:'TSA = 6×side² = 6×64 = 384 cm².', difficulty:'Medium', subtopic:'Cube' },
  { id:'men7', question:'Volume of a cylinder with r=7cm and h=15cm. (π=22/7)', options:['2310 cm³','1540 cm³','3080 cm³','770 cm³'], answer:0, explanation:'V = πr²h = (22/7)×49×15 = 2310 cm³.', difficulty:'Medium', subtopic:'Cylinder' },
  { id:'men8', question:'If each side of a square is increased by 50%, area increases by?', options:['125%','50%','100%','75%'], answer:0, explanation:'New area = (1.5s)² = 2.25s². Increase = 125%.', difficulty:'Medium', subtopic:'Square' },
  { id:'men9', question:'Slant height of a cone with radius 5 cm and height 12 cm?', options:['13 cm','11 cm','15 cm','17 cm'], answer:0, explanation:'l = √(r²+h²) = √(25+144) = √169 = 13 cm.', difficulty:'Medium', subtopic:'Cone' },
  { id:'men10', question:'Area of a trapezium with parallel sides 14 cm, 8 cm and height 6 cm?', options:['66 cm²','84 cm²','48 cm²','72 cm²'], answer:0, explanation:'Area = ½×(a+b)×h = ½×(14+8)×6 = 66 cm².', difficulty:'Medium', subtopic:'Trapezium' },

  // Hard
  { id:'men11', question:'Surface area of a sphere with diameter 14 cm. (π=22/7)', options:['616 cm²','154 cm²','308 cm²','1232 cm²'], answer:0, explanation:'r=7. SA = 4πr² = 4×(22/7)×49 = 616 cm².', difficulty:'Hard', subtopic:'Sphere' },
  { id:'men12', question:'A room 8m×6m×4m. Cost of painting 4 walls and ceiling at ₹15/m²?', options:['₹2400','₹1800','₹2040','₹1680'], answer:0, explanation:'Area of 4 walls = 2h(l+b) = 2×4×14 = 112 m². Ceiling = 48 m². Total = 160 m². Cost = 160×15 = ₹2400.', difficulty:'Hard', subtopic:'Cuboid' },
  { id:'men13', question:'The radius of a circle is doubled. By what % does the area increase?', options:['300%','200%','100%','400%'], answer:0, explanation:'New area = π(2r)² = 4πr². Increase = 3πr², which is 300%.', difficulty:'Hard', subtopic:'Circle' },
  { id:'men14', question:'Find the volume of a sphere of radius 3 cm in terms of π.', options:['36π cm³','18π cm³','54π cm³','12π cm³'], answer:0, explanation:'V = (4/3)πr³ = (4/3) × π × 27 = 36π cm³.', difficulty:'Hard', subtopic:'Sphere' },
  { id:'men17', question:'The area of a square is equal to the area of a circle. Find the ratio of the side of the square to the radius of the circle.', options:['√π','π','1:√π','1:π'], answer:0, explanation:'s² = πr² → s²/r² = π → s/r = √π.', difficulty:'Hard', subtopic:'Mixed Shapes' }
];

export const statisticsQuestions = [
  // Easy
  { id:'st1', question:'Find the mean of: 4, 7, 13, 16, 21, 25, 30.', options:['16.57','15','16','17'], answer:0, explanation:'Sum = 116. Mean = 116/7 = 16.57.', difficulty:'Easy', subtopic:'Mean' },
  { id:'st2', question:'Find the median of: 11, 3, 7, 15, 9, 5, 13', options:['9','7','11','10'], answer:0, explanation:'Sorted: 3, 5, 7, 9, 11, 13, 15. Median = 9.', difficulty:'Easy', subtopic:'Median' },
  { id:'st3', question:'Find the mode of: 5, 3, 8, 5, 9, 3, 5, 7, 3, 5', options:['5','3','8','7'], answer:0, explanation:'5 appears 4 times (highest frequency). Mode = 5.', difficulty:'Easy', subtopic:'Mode' },
  { id:'st4', question:'Range of: 38, 12, 56, 24, 71, 9, 45 is:', options:['62','47','59','71'], answer:0, explanation:'Range = Max - Min = 71 - 9 = 62.', difficulty:'Easy', subtopic:'Range' },
  { id:'st5', question:'If the variance of a distribution is 144, find its standard deviation.', options:['12','14.4','144','6'], answer:0, explanation:'Standard Deviation = √Variance = √144 = 12.', difficulty:'Easy', subtopic:'Standard Deviation' },

  // Medium
  { id:'st6', question:'If mean = 18 and median = 15, find mode using empirical relation.', options:['9','21','12','15'], answer:0, explanation:'Mode = 3 Median - 2 Mean = 3×15 - 2×18 = 9.', difficulty:'Medium', subtopic:'Empirical Relation' },
  { id:'st7', question:'Find median of: 6, 18, 24, 12, 30, 36', options:['21','18','24','22'], answer:0, explanation:'Sorted: 6, 12, 18, 24, 30, 36. Median = (18+24)/2 = 21.', difficulty:'Medium', subtopic:'Median' },
  { id:'st8', question:'Class frequencies: 0-10 (5), 10-20 (8), 20-30 (15), 30-40 (7), 40-50 (5). Modal class?', options:['20-30','10-20','30-40','0-10'], answer:0, explanation:'Modal class has highest frequency = 15, which is 20-30.', difficulty:'Medium', subtopic:'Modal Class' },
  { id:'st9', question:'If the mean of five observations x, x+2, x+4, x+6, and x+8 is 11, find the value of x.', options:['7','5','9','6'], answer:0, explanation:'Sum = 5x + 20. Mean = (5x + 20)/5 = x + 4 = 11 → x = 7.', difficulty:'Medium', subtopic:'Mean' },
  { id:'st10', question:'Find the median of the following observations: 15, 35, 18, 26, 19, 25, 29, 20.', options:['22.5','20','25','22'], answer:0, explanation:'Sorted: 15, 18, 19, 20, 25, 26, 29, 35. Median is average of 4th and 5th terms = (20 + 25)/2 = 22.5.', difficulty:'Medium', subtopic:'Median' },

  // Hard
  { id:'st11', question:'Variance of: 2, 4, 6, 8, 10 is:', options:['8','4','6','10'], answer:0, explanation:'Mean=6. Deviations squared: 16, 4, 0, 4, 16. Variance = 40/5 = 8.', difficulty:'Hard', subtopic:'Variance' },
  { id:'st12', question:'Standard deviation of: 2, 4, 6, 8, 10 is:', options:['2√2','4','√6','2'], answer:0, explanation:'Variance = 8. SD = √8 = 2√2 ≈ 2.83.', difficulty:'Hard', subtopic:'Standard Deviation' },
  { id:'st13', question:'If each observation is multiplied by 3, the mean becomes 45. Original mean was?', options:['15','135','12','48'], answer:0, explanation:'New mean = 3 × original mean = 45. Original mean = 45/3 = 15.', difficulty:'Hard', subtopic:'Mean' },
  { id:'st14', question:'Find the coefficient of variation if the mean of a distribution is 50 and the standard deviation is 10.', options:['20%','15%','25%','10%'], answer:0, explanation:'CV = (Standard Deviation / Mean) × 100 = (10 / 50) × 100 = 20%.', difficulty:'Hard', subtopic:'Coefficient of Variation' },
  { id:'st15', question:'The mean marks of 100 students were found to be 40. Later on, it was discovered that a score of 53 was misread as 83. Find the corrected mean marks.', options:['39.7','40.3','39.5','41.0'], answer:0, explanation:'Sum = 4000. Correct Sum = 4000 - 83 + 53 = 3970. Correct Mean = 3970 / 100 = 39.7.', difficulty:'Hard', subtopic:'Mean' }
];
