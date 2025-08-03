// pluginPiangere.js
// Plugin para hacer llorar al bot en italiano

const handler = async (m, { conn }) => {
  // Lista de frases para llorar en italiano (╥﹏╥)
  const frasiPiangere = [
    "Oh, povero me! (ಥ﹏ಥ)",
    "Non ce la faccio più! (っ˘̩╭╮˘̩)っ",
    "La vita è così dura! (╥_╥)",
    "Perché a me? (ಥ_ಥ)",
    "Aiuto, sto annegando nelle mie lacrime! (ノಠ益ಠ)ノ彡┻━┻"
  ];

  // Escoge una frase al azar de la lista (o˘◡˘o)
  const fraseRandom = frasiPiangere[Math.floor(Math.random() * frasiPiangere.length)];

  // Envía el mensaje al chat (｡♥‿♥｡)
  await conn.reply(m.chat, fraseRandom, m);
};

// Configuración del comando (≧◡≦) ♡
handler.help = ['piangere']; // Comando: .piangere
handler.tags = ['fun']; // Tag: diversión
handler.command = ['piangere']; // Activa con la palabra "piangere"
handler.register = true; // Registro (?)

export default handler;