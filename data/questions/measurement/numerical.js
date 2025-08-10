// data/questions/measurement/numerical.js
export const numericalQuestions = [
  { 
    id: 1, 
    difficulty: 'Easy', 
    question: 'A student measures a rectangle with length $l = 15.12$ cm and width $w = 3.45$ cm. Calculate the area with the correct number of significant figures.', 
    answer: `<h4>Steps:</h4><ol><li>Count significant figures: $l$ (4), $w$ (3). The result must have 3.</li><li>Calculate: $A = 15.12 \\times 3.45 = 52.164$ cm²</li><li>Round: Rounding to 3 significant figures gives 52.2.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $52.2$ cm²</div>` 
  },
  { 
    id: 2, 
    difficulty: 'Medium', 
    question: 'The period of a spring-mass system is $T = 2\\pi\\sqrt{m/k}$. Check if this is dimensionally correct. (Dimension of spring constant $k$ is $[MT^{-2}]$)', 
    answer: `<h4>Steps:</h4><ol><li>LHS dimension: $[T]$.</li><li>RHS dimension: $\\sqrt{[M] / [MT^{-2}]} = \\sqrt{[T^2]} = [T]$.</li><li>Conclusion: The dimensions match.</li></ol><div class="finalAnswer"><strong>Conclusion:</strong> The formula is dimensionally correct.</div>` 
  },
  { 
    id: 3, 
    difficulty: 'Hard', 
    question: 'A quantity P is related by $P = a^3b^2 / (\\sqrt{c} d)$. The percentage errors in a, b, c, and d are 1%, 3%, 4%, and 2% respectively. Find the percentage error in P.', 
    answer: `<h4>Steps:</h4><ol><li>Error formula: $\\frac{\\Delta P}{P} = 3\\frac{\\Delta a}{a} + 2\\frac{\\Delta b}{b} + \\frac{1}{2}\\frac{\\Delta c}{c} + \\frac{\\Delta d}{d}$.</li><li>Add percentage errors: % Error = $3(1\\%) + 2(3\\%) + \\frac{1}{2}(4\\%) + 1(2\\%) = 3\\% + 6\\% + 2\\% + 2\\%$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 13%</div>` 
  },
  { 
    id: 4, 
    difficulty: 'Easy', 
    question: 'Convert a speed of 72 km/h into m/s.', 
    answer: '<h4>Steps:</h4><ol><li>Use conversion factors: $1 \\text{ km} = 1000 \\text{ m}$ and $1 \\text{ h} = 3600 \\text{ s}$.</li><li>Calculation: $72 \\frac{\\text{km}}{\\text{h}} = 72 \\times \\frac{1000 \\text{ m}}{3600 \\text{ s}} = 20 \\text{ m/s}$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 20 m/s</div>' 
  },
  { 
    id: 5, 
    difficulty: 'Easy', 
    question: 'The density of a material is 8.6 g/cm³. Express it in kg/m³.', 
    answer: '<h4>Steps:</h4><ol><li>Use conversion factors: $1 \\text{ g} = 10^{-3} \\text{ kg}$ and $1 \\text{ cm} = 10^{-2} \\text{ m}$, so $1 \\text{ cm}^3 = (10^{-2})^3 \\text{ m}^3 = 10^{-6} \\text{ m}^3$.</li><li>Calculation: $8.6 \\frac{\\text{g}}{\\text{cm}^3} = 8.6 \\times \\frac{10^{-3} \\text{ kg}}{10^{-6} \\text{ m}^3} = 8.6 \\times 10^3 \\text{ kg/m}^3$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 8600 kg/m³</div>' 
  },
  { 
    id: 6, 
    difficulty: 'Easy', 
    question: 'Add 2.34 kg and 15.2 kg and give the result to the correct number of decimal places.', 
    answer: '<h4>Steps:</h4><ol><li>Perform the addition: $2.34 + 15.2 = 17.54$.</li><li>In addition, the result must be rounded to the same number of decimal places as the number with the least decimal places. 15.2 has one decimal place.</li><li>Round: Rounding 17.54 to one decimal place gives 17.5.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 17.5 kg</div>' 
  },
  { 
    id: 7, 
    difficulty: 'Easy', 
    question: 'A screw gauge has a least count of 0.001 cm and zero error of +0.005 cm. Find the correct diameter if the measured value is 0.250 cm.', 
    answer: '<h4>Steps:</h4><ol><li>Formula for correct reading: Correct Reading = Measured Reading - Zero Error.</li><li>Calculation: $0.250 \\text{ cm} - (+0.005 \\text{ cm}) = 0.245 \\text{ cm}$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 0.245 cm</div>' 
  },
  { 
    id: 8, 
    difficulty: 'Easy', 
    question: 'The side of a cube is measured to be $5.2 \\pm 0.1$ cm. What is the uncertainty in the volume?', 
    answer: '<h4>Steps:</h4><ol><li>Volume $V = s^3$. Relative error in volume is $3 \\times (\\text{relative error in side})$.</li><li>Relative error in side: $\\frac{\\Delta s}{s} = \\frac{0.1}{5.2}$.</li><li>Relative error in volume: $\\frac{\\Delta V}{V} = 3 \\times \\frac{0.1}{5.2} \\approx 0.0577$.</li><li>Volume $V = (5.2)^3 = 140.608 \\text{ cm}^3$.</li><li>Uncertainty $\\Delta V = V \\times 0.0577 = 140.608 \\times 0.0577 \\approx 8.1 \\text{ cm}^3$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> Uncertainty is approximately 8.1 cm³</div>' 
  },
  { 
    id: 9, 
    difficulty: 'Easy', 
    question: 'What is the dimensional formula for gravitational constant G?', 
    answer: '<h4>Steps:</h4><ol><li>Start with Newton\'s law of gravitation: $F = G \\frac{m_1 m_2}{r^2}$.</li><li>Rearrange for G: $G = \\frac{F r^2}{m_1 m_2}$.</li><li>Substitute dimensions: $[G] = \\frac{[MLT^{-2}][L^2]}{[M][M]} = [M^{-1}L^3T^{-2}]$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $[M^{-1}L^3T^{-2}]$</div>' 
  },
  { 
    id: 10, 
    difficulty: 'Easy', 
    question: 'The length of a rod is measured as 25.0 cm. This measurement has how many significant figures?', 
    answer: '<p>The measurement 25.0 cm has three significant figures. The trailing zero after the decimal point indicates that the measurement is precise to the first decimal place.</p><div class="finalAnswer"><strong>Final Answer:</strong> 3</div>' 
  },
  { 
    id: 11, 
    difficulty: 'Medium', 
    question: 'The resistance R is $V/I$ where $V = (100 \\pm 5)$ V and $I = (10 \\pm 0.2)$ A. Find the percentage error in R.', 
    answer: '<h4>Steps:</h4><ol><li>Percentage error in V: $\\frac{5}{100} \\times 100\\% = 5\\%$.</li><li>Percentage error in I: $\\frac{0.2}{10} \\times 100\\% = 2\\%$.</li><li>The percentage error in R is the sum of the percentage errors in V and I.</li><li>Total % Error = $5\\% + 2\\% = 7\\%$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> 7%</div>' 
  },
  { 
    id: 12, 
    difficulty: 'Medium', 
    question: 'The radius of a sphere is measured to be $(2.1 \\pm 0.5)$ cm. Calculate its surface area with error limits.', 
    answer: '<h4>Steps:</h4><ol><li>Surface area $A = 4\\pi r^2$.</li><li>Calculate area: $A = 4\\pi (2.1)^2 = 55.417... \\approx 55.4 \\text{ cm}^2$.</li><li>Relative error in A: $\\frac{\\Delta A}{A} = 2 \\frac{\\Delta r}{r} = 2 \\times \\frac{0.5}{2.1} \\approx 0.476$.</li><li>Absolute error $\\Delta A = A \\times 0.476 = 55.4 \\times 0.476 \\approx 26.4 \\text{ cm}^2$.</li></ol><div class="finalAnswer"><strong>Final Answer:</strong> $(55.4 \\pm 26.4)$ cm²</div>' 
  }
];
