// plugin.js (Formato ESM)

/**
 * @name: plugin-sexo
 * @description: Responde a menciones de la palabra "sexo" con mensajes divertidos.
 * @version: 1.0.0
 * @author: MayCode-V3 (con mucho amorcito UwU)
 */

const mensajes = [
  "¡Ay, pillín! (≧◡≦)",
  "¡Uy, qué travieso! (☞ﾟヮﾟ)☞",
  "¡Esa boquita! ♡",
  "¡Oye, oye! (o˘◡˘o)",
  "¡Qué cosita! (｡♥‿♥｡)",
];

/**
 * Función principal del plugin.
 * @param {Object} m - Objeto del mensaje de WhatsApp.
 * @param {Object} conn - Conexión del bot de WhatsApp.
 */
const handler = async (m, { conn }) => {
  const texto = m.text || ""; // Obtener el texto del mensaje
  if (/sexo/i.test(texto)) {
    // Comprobar si el mensaje contiene la palabra "sexo" (ignorando mayúsculas/minúsculas)
    const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)]; // Seleccionar un mensaje aleatorio
    await conn.reply(m.chat, mensajeAleatorio, m); // Responder con el mensaje aleatorio
  }
};

// Configuración del plugin
handler.help = ["sexo"]; // Comando de ayuda
handler.tags = ["diversion"]; // Categoría del comando
handler.command = ["sexo"]; // Palabras clave que activan el comando
handler.register = true; // Indica que el comando está registrado

export default handler;