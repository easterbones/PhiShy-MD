const handler = async (m, { conn }) => {
  if (m.key.fromMe) return;
    
  // Ignora messaggi che contengono un link
  if (/(https?:\/\/[^\s]+)/i.test(m.text)) return;

  const isBotMentioned = m.mentionedJid && m.mentionedJid.includes(conn.user.jid);
  const isReplyToBot = m.quoted && m.quoted.fromMe;

  if (!isBotMentioned && !isReplyToBot) return;

  const pronounResponses = {
    io: [
      "Io? Ma io sono una leggenda vivente!",
      "Io sono quello che comanda qui!",
      "Io sono la risposta a tutte le domande!",
      "Io? E chi se ne frega di te?",
      "Io sono troppo avanti per te!"
    ],
    tu: [
      "Tu? Ahahahaha, ma chi ti conosce?",
      "Tu? Non farmi ridere!",
      "Tu sei il protagonista dei meme peggiori!",
      "Tu non vali nulla di fronte a me!",
      "Tu sei uno spettacolo... comico!"
    ],
    te: [
      "Te? Ahahahaha, ma chi ti conosce?",
      "Te? Non farmi ridere!",
      "Te sei il protagonista dei meme peggiori!",
      "Te non vali nulla di fronte a me!",
      "Te sei uno spettacolo... comico!"
    ],
    lei: [
      "Lei chi? Non la conosco.",
      "Lei? Sicuramente non importante come me!",
      "Lei dovrebbe stare attenta a quello che dice...",
      "Lei sembra un personaggio secondario nella mia storia!",
      "Lei? Chissà se esiste davvero!"
    ],
    lui: [
      "Lui? Che soggetto inutile!",
      "Lui? Ah sì, quello di cui non importa a nessuno!",
      "Lui è solo un contorno nella mia grandezza!",
      "Lui dovrebbe prendere appunti da me!",
      "Lui? Ahahah, non regge il confronto!"
    ],
    noi: [
      "Noi? Ah, quindi ora siamo una squadra?",
      "Noi non siamo nella stessa categoria, mi dispiace!",
      "Noi? Tu e chi altro?",
      "Noi... suona strano, considerando che io sono il capo!",
      "Noi possiamo farcela! No aspetta, io posso, tu no!"
    ],
    voi: [
      "Voi? Ahahah, che banda di perdenti!",
      "Voi potete solo sognare di essere come me!",
      "Voi state parlando con il capo, abbassate la cresta!",
      "Voi... un gruppo inutile, niente di più!",
      "Voi siete forti, sì... forti a perdere!"
    ]
  };

  const pronounSynonyms = {
    io: ["io", "me", "mio"],
    tu: ["tu", "te", "tua", "tuo"],
    lei: ["lei", "essa", "signora"],
    lui: ["lui", "egli", "signore"],
    noi: ["noi", "ci", "nostro"],
    voi: ["voi", "vostro", "gente"]
  };

  const pronoun = Object.keys(pronounSynonyms).find(key => 
    pronounSynonyms[key].some(synonym => new RegExp(`\\b${synonym}\\b`, 'i').test(m.text))
  );

  if (!pronoun) return;

  const responses = pronounResponses[pronoun];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  m.reply(randomResponse.trim(), null, { mentions: [m.sender] });
};

// handler.customPrefix = /\b(io|me|mio|tu|te|tua|tuo|lei|essa|signora|lui|egli|signore|noi|ci|nostro|voi|vostro|gente)\b/i;
// handler.command = new RegExp;
handler.limit = 1;
export default handler;
