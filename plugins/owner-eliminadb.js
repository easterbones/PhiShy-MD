import { areJidsSameUser } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, text, participants }) => {
  const chiaveInput = args[0];
  const target = (args[1] || '').toLowerCase();

  if (!chiaveInput || !target) {
    return m.reply('⚠️ Usa: .eliminadb [chiave] [@utente | numero | all]');
  }

  let users = global.db.data.users;

  // Funzione per trovare la chiave esatta nel db ignorando il case
  const trovaChiaveEsatta = (obj, chiaveInput) => {
    const chiaveInputLower = chiaveInput.toLowerCase();
    return Object.keys(obj).find(k => k.toLowerCase() === chiaveInputLower);
  };

  // ALL → elimina da tutti gli utenti
  if (target === 'all') {
    let contatore = 0;
    for (let jid in users) {
      const chiaveReale = trovaChiaveEsatta(users[jid], chiaveInput);
      if (chiaveReale) {
        delete users[jid][chiaveReale];
        contatore++;
      }
    }
    return m.reply(`✅ Voce "${chiaveInput}" eliminata da ${contatore} utenti.`);
  }

  // Target specifico
  let userJid;

  if (m.mentionedJid?.length) {
    userJid = m.mentionedJid[0];
  } else if (/^\d+$/.test(target)) {
    const jid = target.replace(/\D/g, '') + '@s.whatsapp.net';
    userJid = Object.keys(users).find(j => areJidsSameUser(j, jid));
  } else if (target.endsWith('@s.whatsapp.net')) {
    userJid = target;
  }

  if (!userJid || !users[userJid]) {
    return m.reply('❌ Utente non trovato nel database.');
  }

  const chiaveReale = trovaChiaveEsatta(users[userJid], chiaveInput);
  if (!chiaveReale) {
    return m.reply(`⚠️ L'utente non ha la voce "${chiaveInput}".`);
  }

  delete users[userJid][chiaveReale];
  return m.reply(`✅ Voce "${chiaveInput}" eliminata dall'utente.`);
};

handler.help = ['eliminadb chiave [@utente | numero | all]'];
handler.tags = ['owner'];
handler.command = /^eliminadb$/i;
handler.rowner = true;

export default handler;
