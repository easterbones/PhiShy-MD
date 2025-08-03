// plugin_skibidiboppy.js

/**
 * @INFO
 * Comando para responder con un mensaje temático de Skibidi Boppy en italiano.
 * Formato: CommonJS
 * Dependencia: whiskeysockets/Baileys
 * @AUTOR MayCode-V3 (con mucho amorcito UwU)
 */

const handler = async (m, { conn }) => {
  // Verificar si el mensaje contiene la palabra clave "skibidiboppy" (ignorar mayúsculas y minúsculas)
  if (/skibidiboppy/i.test(m.text)) {
    // Mensaje de respuesta temático en italiano
    const respuesta = "Skibidi Dop Dop Yes Yes 🇮🇹! W Toilet in Italia 🚽! Skibidi bop mm dada! ";

    // Enviar la respuesta al chat
    await conn.reply(m.chat, respuesta, m);
  }
};

// Configuración del comando
handler.help = ['skibidiboppy']; // Lista de comandos que activan este plugin
handler.tags = ['divertimento']; // Categoría del comando (diversión)
handler.command = ['skibidiboppy', 'skibidi']; // Comandos que activan este plugin
handler.register = true; // Indica que el comando debe ser registrado

export default handler;