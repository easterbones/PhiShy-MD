let handler = async (m, { conn }) => {
  // Verifica se l'utente esiste nel database
  if (!global.db.data.users[m.sender]) return;
  
  const user = global.db.data.users[m.sender];
  
  // Controlla se user.limit esiste e ha raggiunto 1 milione
  if (user.limit !== undefined && user.limit >= 1000000) {
    // Invia il messaggio di congratulazioni
    await conn.sendMessage(m.chat, {
      text: `🎉 Ciao @${m.sender.split('@')[0]}, sei arrivato al limite! 🍬\nLe tue tasche non possono più contenere così tanti dolci!`,
      mentions: [m.sender]
    }, { quoted: m });
  }
};

// Esegui questo handler prima di qualsiasi comando che modifica user.limit
handler.before = async function (m) {
  // Verifica se l'utenthttps://panel.cafirexos.com/server/6a2bd3f0/filese esiste nel database
  if (!global.db.data.users[m.sender]) return;
  
  const user = global.db.data.users[m.sender];
  
  // Controlla se user.limit esiste e ha raggiunto 1 milione
  if (user.limit !== undefined && user.limit >= 1000000) {
    // Invia il messaggio di congratulazioni
    await conn.sendMessage(m.chat, {
      text: `🎉 Ciao @${m.sender.split('@')[0]}, sei arrivato al limite! 🍬\nLe tue tasche non possono più contenere così tanti dolci!`,
      mentions: [m.sender]
    }, { quoted: m });
  }
};

// Non limitare il comando a specifici tag o comandi
handler.tags = [];
handler.command = /^(?!x)x$/i; // Regex che non matcha nulla
handler.group = false;
handler.private = false;

export default handler;