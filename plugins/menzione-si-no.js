const handler = async (m, { conn }) => {
  if (m.key.fromMe) return;

  const text = typeof m.text === 'string' ? m.text : '';
  const isBotMentioned = m.mentionedJid && m.mentionedJid.includes(conn.user.jid);
  const isTaggedInGroup = m.isGroup && isBotMentioned;
  const isReplyToBot = m.quoted && m.quoted.fromMe;

  if (!isBotMentioned && !isReplyToBot && !isTaggedInGroup) return;

  const responses = [
    "nono",
    "sisi",
    "no guarda",
    "sicuro?",
    "sicurissimo",
    "ma va",
    "ma chi te l'ha chiesto",
    "🦗🦗....",
    "puahahahaha",
    "AHAHAHSAHAS",
    "noooooooooo",
    "siiiiiii",
    "seh",
    "bella risposta fratm"
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  m.reply(randomResponse.trim(), null, { mentions: [m.sender] });
};

// Imposta il prefisso personalizzato e il comando per attivare il bot
handler.customPrefix = /\b(si+|yep+|yes+|no+|nope|nop)\b/i;
handler.command = new RegExp();



export default handler;
