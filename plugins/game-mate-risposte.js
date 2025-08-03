/**
 * Math Game Answer Handler - Processes user answers to math problems
 */

// Ensure global math object exists
global.math = global.math ? global.math : {};

const handler = async (m, {conn}) => {
  const id = m.chat;
  
  // Check if this is a reply to a valid math question
  if (!m.quoted) return;
  if (m.quoted.sender != conn.user.jid) return;
  if (!/^QUANTO FA/i.test(m.quoted.text)) return;
  if (!(m.chat in global.math)) {
    return conn.reply(m.chat, `*[❗INFO❗] LA RISPOSTA A QUESTA DOMANDA È STATA GIÀ DATA*`, m);
  }
  
  // Check if this is the current active math problem
  if (m.quoted.id == global.math[id][0].id) {
    const math = global.math[id][1];
    const userAnswer = parseFloat(m.text);
    const correctAnswer = parseFloat(math.result);
    
    // Validate user answer
    if (isNaN(userAnswer)) return; // Not a valid number
    
    // Check if answer is correct (with small margin for floating point errors)
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
    
    if (isCorrect) {
      // Correct answer
      conn.reply(m.chat, `*RISPOSTA CORRETTA!!*\n*HAI VINTO: ${math.bonus} XP*`, m);
      
      // Add XP to user
      if (global.db && global.db.data && global.db.data.users) {
        global.db.data.users[m.sender] = global.db.data.users[m.sender] || {};
        global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + math.bonus;
      }
      
      // Clean up the game
      clearTimeout(global.math[id][3]);
      delete global.math[id];
    } else {
      // Wrong answer
      if (--global.math[id][2] == 0) {
        // No more attempts
        conn.reply(m.chat, `*OPPORTUNITÀ TERMINATE*\n*LA RISPOSTA ERA: ${math.result}*`, m);
        clearTimeout(global.math[id][3]);
        delete global.math[id];
      } else {
        // Still has attempts
        conn.reply(m.chat, `*RISPOSTA ERRATA!!*\n*HAI ANCORA ${global.math[id][2]} TENTATIVI*`, m);
      }
    }
  }
};

// Set command properties
handler.customPrefix = /^-?[0-9]+(\.[0-9]+)?$/;
handler.command = new RegExp;

export default handler;