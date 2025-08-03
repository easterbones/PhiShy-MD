const handler = async (m, {conn}) => {
  const user = global.db.data.users[m.sender];

  // Animali con rarità uniche
  const animali = [
    { nome: 'cane', emoji: '🐶', rarita: 'comune' },
    { nome: 'gatto', emoji: '🐱', rarita: 'comune' },
    { nome: 'drago', emoji: '🐉', rarita: 'leggendario' }
  ];
  const armi = ['🪚', '⛏️', '🔫', '🗡️', '🏹'];
  // Probabilità: cane/gatto 45% ciascuno, drago 10%
  function randomRarita() {
    const n = Math.random();
    if (n < 0.45) return 0; // cane
    if (n < 0.9) return 1;  // gatto
    return 2;               // drago
  }
  const getArma = () => armi.getRandom();

  // Solo un animale trovato per caccia
  const trovatoIdx = randomRarita();
  const quantita = (trovatoIdx === 2) ? (Math.random() < 0.5 ? 1 : 0) : Math.floor(Math.random() * 2) + 1; // drago max 1, altri max 2
  const arma = getArma();

  // Aggiorna inventario utente solo per l'animale trovato
  const trovato = animali[trovatoIdx];
  if (typeof user[trovato.nome] === 'number') user[trovato.nome] += quantita;
  else user[trovato.nome] = quantita;

  const time = user.lastberburu + 2700000; // 45 Minuti
  if (new Date - user.lastberburu < 2700000)
    return conn.reply(m.chat, `Per favore riposa un momento prima di continuare la caccia\n\n⫹⫺ TEMPO ${clockString(time - new Date())}\n${wm}`, m, rcanal);

  // Messaggio iniziale
  let msg = await conn.reply(
    m.chat,
    `@${m.sender.split('@s.whatsapp.net')[0]} *${[
      "Cerco attrezzatura da caccia...",
      "Preparo tutto per la caccia!!",
      "Sto scegliendo il luogo di caccia...",
      "PREPARO IL LUOGO DI CACCIA!!"
    ].getRandom()}*`,
    m,
    {mentions: [m.sender]}
  );

  // Aggiorna messaggio con le varie fasi
  setTimeout(async () => {
    await conn.sendMessage(m.chat, {
      edit: msg.key,
      text: `@${m.sender.split('@s.whatsapp.net')[0]} *${[
        "Armi pronte per la caccia!!",
        "Test delle armi 🔫 💣 🪓 🏹",
        "VEICOLI PER LA CACCIA!! 🚗 🏍️ 🚜",
        "OTTIMO MOMENTO PER LA CACCIA 🧤"
      ].getRandom()}*`
    }, {mentions: [m.sender]});
  }, 15000);

  setTimeout(async () => {
    await conn.sendMessage(m.chat, {
      edit: msg.key,
      text: `@${m.sender.split('@s.whatsapp.net')[0]} *${[
        "OBIETTIVO IMPOSTATO 🎯",
        "Esca in azione 🍫 🍇 🍖",
        "ANIMALE RILEVATO!! " + trovato.emoji
      ].getRandom()}*`
    }, {mentions: [m.sender]});
  }, 18000);

  setTimeout(async () => {
    // Risultato finale solo per l'animale trovato
    let risultato = `*✧ Risultato della caccia di ${await conn.getName(m.sender)} ✧*\n\n`;
    if (quantita > 0) {
      risultato += `Hai trovato: *${trovato.emoji} ${trovato.nome}* (${trovato.rarita}) con ${arma} x${quantita}`;
    } else {
      risultato += `Non hai trovato nessun animale raro stavolta!`;
    }

    await conn.sendMessage(m.chat, {
      edit: msg.key,
      text: risultato.trim()
    }, {mentions: [m.sender]});
  }, 20000);

  user.lastberburu = new Date * 1;
};
handler.help = ['berburu'];
handler.tags = ['rpg'];
handler.command = /^(hunt|caccia|caza(r)?)$/i;
handler.group = true;
export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0) ).join(':');
}