// plugin.js (per Giorgia in italiano)

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Verifica se l'utente ha fornito del testo
  if (!text) {
    await conn.reply(m.chat, '🌸 ¡Hola Giorgia! Para usar este comando, debes escribir algo después del comando. ¡Por ejemplo: *' + usedPrefix + command + ' Hola!* 🌸', m);
    return;
  }

  // Elabora il testo ricevuto (qui puoi aggiungere la tua logica specifica)
  const risposta = `💞 Ciao Giorgia Ha detto: ${text} 💞`;

  // Invia una risposta
  await conn.reply(m.chat, risposta, m);

  // Log dell'uso del comando (opzionale)
  console.log(`Comando "${command}" usato da: ${m.sender} con testo: ${text}`);
};

handler.help = ['giorgia <testo>']; // Ejemplo de uso
handler.tags = ['fun'];
handler.command = ['giorgia']; // Nombre del comando
handler.register = true; // Indica si el comando debe registrarse
handler.descripcion = 'Risponde con un messaggio personalizzato per Giorgia.';

export default handler;