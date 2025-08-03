let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Verifica se l'utente è l'owner

  // Sintassi del comando: !modifica @utente campo valore
  if (args.length < 3) {
    return conn.sendMessage(m.chat, { text: `❌ *Sintassi errata!*\nUsa: ${usedPrefix}modifica @utente campo valore` }, { quoted: m });
  }

  // Recupera l'utente menzionato
  let mentionedJid = m.mentionedJid && m.mentionedJid[0];
  if (!mentionedJid) {
    return conn.sendMessage(m.chat, { text: '❌ *Nessun utente menzionato!* Devi menzionare un utente.' }, { quoted: m });
  }

  // Recupera il campo e il valore da modificare
  let campo = args[1].toLowerCase(); // Campo da modificare (es. "name", "level", "messaggi")
  let valore = args.slice(2).join(' '); // Nuovo valore

  // Verifica se l'utente esiste nel database
  if (!global.db.data.users[mentionedJid]) {
    return conn.sendMessage(m.chat, { text: '❌ *Utente non trovato nel database!*' }, { quoted: m });
  }

  // Modifica il campo specificato
  try {
    // Converte il valore in numero se il campo è numerico
    if (['level', 'messaggi', 'warn', 'exp', 'blasphemy'].includes(campo)) {
      valore = Number(valore);
      if (isNaN(valore)) {
        return conn.sendMessage(m.chat, { text: '❌ *Valore non valido!* Il valore deve essere un numero.' }, { quoted: m });
      }
    }

    // Aggiorna il campo nel database
    global.db.data.users[mentionedJid][campo] = valore;

    // Conferma la modifica
    conn.sendMessage(m.chat, { text: `✅ *Campo aggiornato!*\nUtente: @${mentionedJid.split('@')[0]}\nCampo: ${campo}\nNuovo valore: ${valore}` }, { quoted: m });
  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { text: '❌ *Errore durante la modifica del campo!*' }, { quoted: m });
  }
}

handler.help = ['modifica @utente campo valore']
handler.tags = ['owner']
handler.command = ['modifica']
handler.rowner = true

export default handler