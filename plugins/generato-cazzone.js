// pluginCazzone.js
// Plugin para responder con un mensaje divertido cuando alguien menciona "cazzone"

/**
 * Handler para el comando "cazzone".
 * @param {Object} m - Objeto del mensaje de WhatsApp.
 * @param {Object} conn - Conexión de WhatsApp (whiskeysockets/Baileys).
 */
const handler = async (m, { conn }) => {
  // Verifica si el mensaje contiene la palabra "cazzone" (ignorando mayúsculas/minúsculas)
  const texto = m.text || '';
  if (/cazzone/i.test(texto)) {
    // Envía una respuesta divertida
    await conn.reply(m.chat, 'Ehi, ma che dici! Attento a come parli, birichino! (≧◡≦)', m,phishy);
  }
};

// Configuración del handler
handler.help = ['cazzone']; // Ayuda del comando
handler.tags = ['fun'];   // Categoría del comando
handler.command = ['cazzone']; // Comando que activa el handler
handler.register = true;  // Indica que el comando está registrado

export default handler;