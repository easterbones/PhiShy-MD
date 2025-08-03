const handler = async (m) => {
    
  // Controlla se il messaggio è inviato dal bot stesso
  if (m.key.fromMe) return;

  // Controlla se il bot è menzionato
  const isBotMentioned = m.mentionedJid && m.mentionedJid.includes(conn.user.jid);
  
  // Controlla se il messaggio è una risposta al bot
  const isReplyToBot = m.quoted && m.quoted.fromMe;
  // Controlla se il bot è taggato in un gruppo
  const isTaggedInGroup = m.isGroup && isBotMentioned;

  // Se il bot non è menzionato, non è una risposta a un suo messaggio, e non è taggato in un gruppo, ignora
  if (!isBotMentioned && !isReplyToBot && !isTaggedInGroup) return;

  // Array di frasi casuali
  const responses = [
    "tranq ti perdono",
    "scuse accettate, per ora",
    "sisi ora prega in ginocchio e leccami i pedi",
    "ci pensero su se perdonarti",
    "dimmi qualcosa che mi faccia ridere e ci pensero",
     "non mi sembrano delle scuse sincere",
    "dai puoi impegnarti di piu"

    ]
    

  // Controlla se il messaggio contiene le parole trigger
  if (!/(scusa+|perdo|sorry+)/i.test(m.text)) return;



  // Sceglie una risposta casuale
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Risponde al messaggio
   m.reply(randomResponse.trim(), null, { mentions: [m.sender] });
};

// Configurazione del comando
handler.customPrefix = /(scusa+|perdo|sorry+)/i; // Attivazione se il testo contiene queste parole
handler.command = new RegExp; // Nessun prefisso, si attiva leggendo i messaggi

export default handler;