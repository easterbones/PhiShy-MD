let handler = async (m, { conn, text, mentionedJid, participants }) => {
  try {
    // 🎯 Identifica l'utente: menzione > risposta > numero nel testo > mittente
    const user =
      (mentionedJid?.length > 0 && mentionedJid[0]) ||
      (m.quoted?.sender) ||
      (text?.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null) ||
      m.sender;

    if (!user) throw '❌ Devi menzionare o rispondere a un utente.';

    // 🔍 Recupera i dati dal database
    const data = global.db.data.users?.[user];
    if (!data) throw '❌ Nessun dato trovato per questo utente.';

    // 🧾 Converte i dati in stringa JSON formattata
    const jsonString = JSON.stringify(data, null, 2);

    // 🧩 Divide il messaggio in blocchi da massimo 4096 caratteri
    const chunks = jsonString.match(/.{1,4000}/gs); // un po' sotto il limite per sicurezza

    // 📤 Invia i messaggi uno per uno
    for (let i = 0; i < chunks.length; i++) {
      await conn.sendMessage(m.chat, {
        text: `📊 *Database utente:* ${i === 0 ? `\n🧾 ID: ${user}` : ''}\n\`\`\`${chunks[i]}\`\`\``,
      }, { quoted: m });
    }

  } catch (err) {
    console.error(err);
    await m.reply('⚠️ Errore durante il recupero dei dati utente.');
  }
};

handler.command = /^(datiutente|dbprofilo|rawuser)$/i;

export default handler;
