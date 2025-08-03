let handler = async (m, { conn, usedPrefix, command }) => {
  let who = m.sender; // Chi invia il comando
  let user = global.db.data.users[who];

  // Controlla se l'utente è sposato
  if (!user.sposato) {
    m.reply('💔 Non sei sposato, non puoi divorziare.');
    return;
  }

  // Recupera il partner
  let partnerId = user.partner;
  if (!partnerId || !global.db.data.users[partnerId]) {
    m.reply('❌ Errore: il tuo partner non è stato trovato nel database.');
    return;
  }

  let partner = global.db.data.users[partnerId];

  // Imposta lo stato come non sposato e rimuovi il partner per entrambi
  user.sposato = false;
  user.partner = '';
  partner.sposato = false;
  partner.partner = '';

  // Invia un messaggio di conferma
  conn.reply(
    m.chat,
    `💔 @${who.split('@')[0]} e @${partnerId.split('@')[0]} avete divorziato. Ora siete entrambi single.`,
    m,
    { mentions: [who, partnerId] }
  );
};

handler.help = ['divorzia @'];
handler.tags = ['rpg'];
handler.command = ['divorzia', 'divorzio'];
handler.register = true;

export default handler;