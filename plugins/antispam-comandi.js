// Plugin: blocca-spammer.js
// Blocca utenti non admin/moderatori che spammando troppi comandi per 20 minuti

const commandSpamData = {};

let handler = async (m, { conn, isAdmin, isOwner, isROwner, isPrems }) => {
  // Solo in gruppo
  if (!m.isGroup) return;
  const chat = global.db.data.chats[m.chat];
  if (chat.modoadmin) return;
  if (isOwner || isROwner || isAdmin || isPrems) return;

  const sender = m.sender;
  const now = Date.now();
  const timeWindow = 10000; // 10 secondi
  const commandLimit = 5; // Più di 5 comandi in 10s = spam
  const blockDuration = 20 * 60 * 1000; // 20 minuti in ms

  // Solo se è un comando
  if (!m.body || !m.body.startsWith('.')) return;

  if (!(sender in commandSpamData)) {
    commandSpamData[sender] = {
      lastCommandTime: now,
      commandCount: 1,
      blockedUntil: 0
    };
  } else {
    const userData = commandSpamData[sender];
    if (userData.blockedUntil > now) {
      // Blocca il comando
      return conn.reply(m.chat, `⛔ Sei stato bloccato per spam di comandi. Riprova tra ${Math.ceil((userData.blockedUntil - now)/60000)} minuti.`, m);
    }
    const diff = now - userData.lastCommandTime;
    if (diff <= timeWindow) {
      userData.commandCount += 1;
      if (userData.commandCount > commandLimit) {
        userData.blockedUntil = now + blockDuration;
        userData.commandCount = 0;
        return conn.reply(m.chat, `🚫 @${sender.split('@')[0]} hai spammato troppi comandi! Sei bloccato per 20 minuti.`, m, { mentions: [sender] });
      }
    } else {
      userData.commandCount = 1;
    }
    userData.lastCommandTime = now;
  }
};

handler.before = handler;
handler.group = true;
handler.priority = 99;
handler.disabled = false;
handler.help = ['antispamcomandi'];
handler.tags = ['antispam'];
handler.command = [];

export default handler;
