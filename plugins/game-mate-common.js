/**
 * Math Game Common Functions and Data
 * Shared between math_command.js and math_answer.js
 */

// Different game modes with their parameters
// [min_a, max_a, min_b, max_b, operations, time_ms, xp_bonus]
export const modes = {
  noob: [-5, 5, -5, 5, '+-', 20000, 15],         // Very easy calculations
  easy: [-15, 15, -15, 15, '+-*', 25000, 45],    // Simple calculations
  medium: [-40, 40, -20, 20, '+-*/', 45000, 10000000],// Moderate calculations
  hard: [-100, 100, -50, 50, '+-*/', 60000, 350],// Challenging calculations
  expert: [-500, 500, -200, 200, '+-*/', 80000, 700], // Advanced calculations
  master: [-1000, 1000, -500, 500, '+-*/', 90000, 1200], // Master level
  // More reasonable impossible levels
  impossible: [-9999, 9999, -999, 999, '+-*/', 60000, 2500],
  ultimate: [-99999, 99999, -9999, 9999, '+-*/', 45000, 5000],
};

// Display symbols for operations
export const operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
  '^': '^', // New power operation
  '√': '√', // New square root operation
};

/**
 * Math problem generator
 * @param {string} mode - Difficulty level
 * @returns {Object} Math problem details
 */
export function genMath(mode) {
  const [a1, a2, b1, b2, ops, time, bonus] = modes[mode];
  
  // Select operation
  const op = pickRandom([...ops]);
  
  let a = randomInt(a1, a2);
  let b = randomInt(b1, b2);
  let result, str;

  // Make sure we don't divide by zero
  if (op === '/' && b === 0) b = randomInt(1, b2);
  
  // Generate appropriate numbers based on the operation
  switch(op) {
    case '+':
      result = a + b;
      str = `${a} ${operators[op]} ${b}`;
      break;
    case '-':
      result = a - b;
      str = `${a} ${operators[op]} ${b}`;
      break;
    case '*':
      // Make multiplication more manageable
      if (mode === 'impossible' || mode === 'ultimate') {
        a = randomInt(-99, 99);
        b = randomInt(-99, 99);
      } else if (mode === 'master') {
        a = randomInt(-50, 50);
        b = randomInt(-50, 50);
      }
      result = a * b;
      str = `${a} ${operators[op]} ${b}`;
      break;
    case '/':
      // Create clean divisions that result in integers or simple decimals
      if (mode === 'medium' || mode === 'easy') {
        b = pickRandom([2, 5, 10]);
        a = b * randomInt(-20, 20);
      } else {
        const divisors = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 50];
        b = pickRandom(divisors);
        // Make a divisible by b to get a clean result
        a = b * randomInt(Math.ceil(a1/b), Math.floor(a2/b));
      }
      result = a / b;
      str = `${a} ${operators[op]} ${b}`;
      break;
  }

  // Add variations for harder modes
  if (['expert', 'master', 'impossible', 'ultimate'].includes(mode)) {
    // 30% chance for expression with parentheses in harder modes
    if (Math.random() < 0.3) {
      const c = randomInt(-10, 10);
      const innerOp = (op === '+' || op === '-') ? '*' : '+';
      
      if (Math.random() < 0.5) {
        // (a OP b) INNER_OP c
        result = innerOp === '+' ? result + c : result * c;
        str = `(${a} ${operators[op]} ${b}) ${operators[innerOp]} ${c}`;
      } else {
        // a OP (b INNER_OP c)
        const innerResult = innerOp === '+' ? b + c : b * c;
        result = op === '+' ? a + innerResult : 
                 op === '-' ? a - innerResult :
                 op === '*' ? a * innerResult : a / innerResult;
        str = `${a} ${operators[op]} (${b} ${operators[innerOp]} ${c})`;
      }
    }
    
    // 20% chance for squared number in master and impossible modes
    if (['master', 'impossible', 'ultimate'].includes(mode) && Math.random() < 0.2) {
      a = randomInt(2, 20);
      result = a * a;
      str = `${a}²`;
    }
  }

  // Round the result to 2 decimal places for cleaner answers
  result = Math.round(result * 100) / 100;

  return {
    str,
    mode,
    time,
    bonus,
    result,
  };
}

/**
 * Helper function to generate random integer
 */
export function randomInt(from, to) {
  if (from > to) [from, to] = [to, from];
  from = Math.floor(from);
  to = Math.floor(to);
  return Math.floor((to - from) * Math.random() + from);
}

/**
 * Helper function to pick random element from array
 */
export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}