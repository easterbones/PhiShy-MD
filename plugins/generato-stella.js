// plugin_stella.js
const handler = async (m, { conn }) => {
  try {


    // Mensaggio carino con emoji stellare
    const messaggioStella = "🌟 ¡Mira una stella brillante! 🌟";

    // Invio del messaggio
    await conn.reply(m.chat, messaggioStella, m);

  } catch (error) {
    console.error("¡Oh no! Hubo un error:", error);
    await conn.reply(m.chat, "¡Ay no! Algo salió mal al mostrar la estrella. (っ˘̩╭╮˘̩)っ", m);
  }
};

handler.help = ['stella'];
handler.tags = ['fun'];
handler.command = ['stella'];

export default handler;