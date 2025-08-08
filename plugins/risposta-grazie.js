const handler = async (m) => {
  // Controlla se il messaggio è inviato dal bot stesso
  if (m.key.fromMe) return;

  // Nome dell'utente (se disponibile, altrimenti il numero)
  const senderName = m.pushName || m.sender || "Anonimo";

  // Controlla se il messaggio menziona, tagga o risponde al bot
  const isMentioningBot = m.mentionedJid?.includes(conn.user.jid);
  const isReplyingToBot = m.quoted?.sender === conn.user.jid;

  if (!isMentioningBot && !isReplyingToBot) return; // Ignora se non è diretto al bot

  // Array di 50 risposte casuali (ironiche e sincere)
  const responses = [
    `Prego, ${senderName}! Sempre qui per aiutarti! 😊`,
    `Di nulla, ${senderName}. È un piacere!`,
    `Grazie a te, ${senderName}, per essere così gentile!`,
    `Oh, ${senderName}, non c'è bisogno di ringraziare!`,
    `Prego, prego, ${senderName}. Non farci l'abitudine però! 😏`,
    `Di nulla, ${senderName}. Ma la prossima volta offri un caffè! ☕`,
    `Sempre a tua disposizione, ${senderName}.`,
    `Grazie a te, ${senderName}. Sei troppo gentile!`,
    `Non c'è di che, ${senderName}.`,
    `Prego, ${senderName}. Ma non esagerare con i complimenti!`,
    `Oh, ${senderName}, mi fai arrossire!`,
    `Di nulla, ${senderName}. Ma ora tocca a te aiutarmi!`,
    `Prego, ${senderName}. Ma non dimenticare chi è il boss qui! 😎`,
    `Grazie a te, ${senderName}. Sei il migliore!`,
    `Non c'è bisogno di ringraziare, ${senderName}.`,
    `Prego, ${senderName}. Ma la prossima volta portami un dolce! 🍩`,
    `Sempre qui per te, ${senderName}.`,
    `Grazie a te, ${senderName}. Sei fantastico!`,
    `Di nulla, ${senderName}. Ma ora vai a fare qualcosa di utile!`,
    `Prego, ${senderName}. Ma non dimenticare di dire grazie ogni tanto!`,
    `Oh, ${senderName}, sei troppo gentile!`,
    `Di nulla, ${senderName}. Ma ora tocca a te fare qualcosa per me!`,
    `Prego, ${senderName}. Ma non dimenticare chi è il vero MVP qui!`,
    `Grazie a te, ${senderName}. Sei un tesoro!`,
    `Non c'è bisogno di ringraziare, ${senderName}. Ma apprezzo il gesto!`,
    `Prego, ${senderName}. Ma non dimenticare di essere sempre gentile!`,
    `Oh, ${senderName}, mi fai sentire speciale!`,
    `Di nulla, ${senderName}. Ma ora vai a conquistare il mondo!`,
    `Prego, ${senderName}. Ma non dimenticare di sorridere oggi!`,
    `Grazie a te, ${senderName}. Sei una persona fantastica!`,
    `Non c'è bisogno di ringraziare, ${senderName}. Ma grazie comunque!`,
    `Prego, ${senderName}. Ma non dimenticare di essere sempre te stesso!`,
    `Oh, ${senderName}, sei un vero amico!`,
    `Di nulla, ${senderName}. Ma ora vai a fare qualcosa di straordinario!`,
    `Prego, ${senderName}. Ma non dimenticare di essere sempre positivo!`,
    `Grazie a te, ${senderName}. Sei una fonte di ispirazione!`,
    `Non c'è bisogno di ringraziare, ${senderName}. Ma apprezzo il pensiero!`,
    `Prego, ${senderName}. Ma non dimenticare di essere sempre gentile con gli altri!`,
    `Oh, ${senderName}, sei una persona meravigliosa!`,
    `Di nulla, ${senderName}. Ma ora vai a fare qualcosa di incredibile!`,
    `Prego, ${senderName}. Ma non dimenticare di essere sempre grato!`,
    `Grazie a te, ${senderName}. Sei un esempio per tutti noi!`,
    `Non c'è bisogno di ringraziare, ${senderName}. Ma grazie per essere te stesso!`,
    `Prego, ${senderName}. Ma non dimenticare di essere sempre gentile con te stesso!`,
    `Oh, ${senderName}, sei una vera ispirazione!`,
    `Di nulla, ${senderName}. Ma ora vai a fare qualcosa di straordinario!`,
    `Prego, ${senderName}. Ma non dimenticare di essere sempre positivo con gli altri!`,
    `Grazie a te, ${senderName}. Sei una persona straordinaria!`,
    `Non c'è bisogno di ringraziare, ${senderName}. Ma apprezzo il tuo gesto!`,
    `Prego, ${senderName}. Ma non dimenticare di essere sempre gentile con il mondo!`
  ];

  // Seleziona una risposta casuale
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Risponde al messaggio
  m.reply(randomResponse.trim(), null, { mentions: [m.sender] });
};

// Configurazione del comando
handler.customPrefix = /\b(grazie|thank you|thx|ty)\b/i; // Attivazione per parole chiave di ringraziamento
handler.command = new RegExp(); 
handler.priority = 10;
export default handler;
