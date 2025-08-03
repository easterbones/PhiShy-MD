let logHandler = async (m, { conn, args }) => {
  const numero = args[0]?.replace(/[^0-9]/g, "");

  // SE è stato passato un numero → mostra i log per quell'utente
  if (numero) {
    const targetUser = numero + "@s.whatsapp.net";
    const log = global.db.data.banLog?.[targetUser];

    if (!log || log.length === 0) {
      return m.reply(`📭 Nessun log trovato per @${numero}`, null, { mentions: [targetUser] });
    }

    let testo = `🧾 *Ban Log per @${numero}*\n\n`;
    log.forEach((entry, index) => {
      testo += `#${index + 1} - Admin: @${entry.admin.split('@')[0]}\n📅 ${new Date(entry.date).toLocaleString('it-IT')}\n📌 Gruppi:\n`;
      testo += entry.groups.map(g => `• ${g.groupName}`).join('\n') + '\n\n';
    });

    return conn.reply(m.chat, testo, m, {
      mentions: [targetUser, ...log.map(e => e.admin)]
    });
  }

  // ALTRIMENTI → mostra gli ultimi 10 utenti bannati
  const logData = global.db.data.banLog || {};
  const utenti = Object.entries(logData)
    .map(([jid, logs]) => ({
      jid,
      last: logs[logs.length - 1], // prendi l'ultima azione
    }))
    .sort((a, b) => new Date(b.last.date) - new Date(a.last.date)) // ordina per data
    .slice(0, 10); // prendi i primi 10

  if (utenti.length === 0) return m.reply("📭 Nessun utente è stato ancora bannato.");

  let testo = `🧾 *Ultimi 10 utenti bannati*\n\n`;
  for (let i = 0; i < utenti.length; i++) {
    const u = utenti[i];
    testo += `${i + 1}. @${u.jid.split('@')[0]}\n👮‍♂️ Admin: @${u.last.admin.split('@')[0]}\n📅 ${new Date(u.last.date).toLocaleString('it-IT')}\n🔹 Gruppi: ${u.last.groups.length}\n\n`;
  }

  const menzioni = utenti.map(u => u.jid).concat(utenti.map(u => u.last.admin));

  return conn.reply(m.chat, testo, m, {
    mentions: menzioni
  });
};

logHandler.command = /^listaban$/i;
logHandler.admin = true;

export default logHandler;
