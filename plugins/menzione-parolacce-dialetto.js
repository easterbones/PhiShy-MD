

    
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
  "uaaaa naboli naboli alla riscossa uaaaa",
    "parla in italiano coglione",
    "parla in italiano cogliona",  
    "ti sborro dentro i tuoi occhi da terrone",
    "in italiano?",
      "we are italians non terroni",
    "bubusettete! abbiamo imparato una parolina nuova oggi eh?👶🏻",
    "puoi fare di meglio, stop using fucking dialetto nella mia chat",
    "ce la fai a parlare la mia lingua",
      "italiano figlio di puttana, parli la mia lingua?",
    "che cane che sei",
      "buttati nel vesuvio",
      "tanto il vesuvio vi lavera tutti",
    "oh capitano mio capitano...",
      "sparisci dalla mia vista",
      "hai 10 anni per pensare che i dialetti li capiscono tutti?",
      "si vede che non vai a scuola ahahahah",
      "torna da dove sei venuto terun",
      "pensi che me ne freghi qualcosa?"
  ];

  // Controlla se il messaggio contiene le parole offese in dialetto
  if (!/(affamoc|fettuso|fetuso|strunz|schiatt|merd|ricchion|ricchione|mammt|bucchin|bukkin|mignot|rot|sort|papt|pat|cap|ktm|kit||cazz|ncul|ngul|lota|janara|panz|curnut|rattus|uallera|rozz|song|cess|capacchion|chine|mmerd|trmon|tremone|mbam|vaiass|trozzl|mocck|muert|chep|mala|calandron|sbunnat|mam|sor|mocche|chin|figghie|scofanat|scassat|murt|cagammerd|uaua|ciacie|fa o cess)/i.test(m.text)) return;



  // Sceglie una risposta casuale
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Risponde al messaggio
   m.reply(randomResponse.trim(), null, { mentions: [m.sender] });
};

// Configurazione del comando
handler.customPrefix = /(affamoc|fettuso|fetuso|strunz|schiatt|merd|ricchion|ricchione|mammt|bucchin|bukkin|mignot|rot|sort|papt|pat|cap|ktm|kit||cazz|ncul|ngul|lota|janara|panz|curnut|rattus|uallera|rozz|song|cess|capacchion|chine|mmerd|trmon|tremone|mbam|vaiass|trozzl|mocck|muert|chep|mala|calandron|sbunnat|mam|sor|mocche|chin|figghie|scofanat|scassat|murt|cagammerd|uaua|ciacie|fa o cess)/i; // Attivazione se il testo contiene queste parole
handler.command = new RegExp; // Nessun prefisso, si attiva leggendo i messaggi

export default handler;
