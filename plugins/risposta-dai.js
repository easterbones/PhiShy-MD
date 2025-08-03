const handler = async (m) => {
  // Controlla se il messaggio è inviato dal bot stesso
  if (m.key.fromMe) return;
  
  // Controlla se il messaggio contiene "dai" come parola isolata
  if (!/\bdai\b/i.test(m.text) || m.text.toLowerCase().replace(/\bdai\b/gi, '').trim().length === 0) {
    return;
  }

  // Array di 30 risposte casuali
  const responses = [
    "Dai cosa? Dai una spiegazione!",
    "Dai un po' di pace ai miei circuiti!",
    "Dai, dai... non finisce mai!",
    "Dai che ti do una sveglia!",
    "Dai, smettila di dirmi dai!",
    "Dai un attimo che sto pensando...",
    "Dai, fammi indovinare, vuoi qualcosa?",
    "Dai non rompere le scatole!",
    "Dai, su, forza, coraggio! (Ironico eh)",
    "Dai, ma che dai...",
    "Dai, non ho voglia di discutere!",
    "Dai, ti prego, basta!",
    "Dai, come se non lo avessi già sentito!",
    "Dai, fammi il piacere!",
    "Dai, ma sei rotto?",
    "Dai, non è il momento!",
    "Dai, che poi mi arrabbio!",
    "Dai, non farmi usare i miei poteri!",
    "Dai, ti sembra il caso?",
    "Dai, ma che palle!",
    "Dai, non ho capito!",
    "Dai, ripeti che non ho sentito!",
    "Dai, ma parla chiaro!",
    "Dai, non fare il timido!",
    "Dai, spara sta frase!",
    "Dai, che aspetti?",
    "Dai, non ho tutto il giorno!",
    "Dai, su, dimmi tutto!",
    "Dai, che ti devo dire...",
    "Dai, finiscila proprio!"
  ];

  // Sceglie una risposta casuale
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Risponde al messaggio
  m.reply(randomResponse.trim(), null, { mentions: [m.sender] });
};

// Configurazione del comando
handler.customPrefix = /\bdai\b/i; // Attivazione solo per la parola "dai" isolata
handler.command = new RegExp; // Nessun prefisso, si attiva leggendo i messaggi
handler.priority = 10;

export default handler;