// pluginCacca.js (ESM)

/**
 * Plugin per rispondere al comando "cacca" con varie risposte divertenti.
 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m - Oggetto messaggio.
 * @param {import('@adiwajshing/baileys').WASocket} conn - Connessione WhatsApp.
 */
const handler = async (m, { command, text, conn }) => {

  const risposte = [
    "Hai detto cacca? Che schifo! ಠ_ಠ",
    "Cacca? Ma che linguaggio è questo? (ノಠ益ಠ)ノ彡┻━┻",
    "Ewww, ma sei un orco! (＠＾◡＾)",
    "Cacca! Cacca! Cacca! (ง •̀_•́)ง... Ok, basta.",
    "Ma che cosa ti viene in mente? (o˘◡˘o)",
    "Spero tu abbia almeno tirato lo sciacquone! (☞ﾟヮﾟ)☞",
    "Cacca detected! Inizio pulizia automatica del chat... (っ˘̩╭╮˘̩)っ",
    "Non parlare di cacca a tavola! (¬‿¬)",
    "Sei peggio di un bambino! (≧◡≦) ♡",
    "La cacca è marrone e fa puzzetta! (｡♥‿♥｡)",
  ];

  const rispostaCasuale = risposte[Math.floor(Math.random() * risposte.length)];

  await conn.reply(m.chat, rispostaCasuale, m);
}
handler.command = ['cacca']
export default handler;