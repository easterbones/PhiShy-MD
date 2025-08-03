import { areJidsSameUser } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, text, participants }) => {
  const chiaveInput = args[0];
  const valoreInput = args[1];
  const target = (args[2] || '').toLowerCase();
  
  if (!chiaveInput || valoreInput === undefined || !target) {
    return m.reply('⚠️ Usa: .inizializzadb [chiave] [valore] [@utente | numero | all]');
  }

  let users = global.db.data.users;
  
  // Funzione per trovare la chiave esatta nel db ignorando il case
  const trovaChiaveEsatta = (obj, chiaveInput) => {
    const chiaveInputLower = chiaveInput.toLowerCase();
    return Object.keys(obj).find(k => k.toLowerCase() === chiaveInputLower);
  };

  // Funzione per convertire il valore nel tipo appropriato
  const convertiValore = (valore) => {
    // Se è "true" o "false" → boolean
    if (valore.toLowerCase() === 'true') return true;
    if (valore.toLowerCase() === 'false') return false;
    
    // Se è un numero → number
    if (/^-?\d+(\.\d+)?$/.test(valore)) {
      return parseFloat(valore);
    }
    
    // Se è "null" → null
    if (valore.toLowerCase() === 'null') return null;
    
    // Se è "undefined" → undefined
    if (valore.toLowerCase() === 'undefined') return undefined;
    
    // Altrimenti rimane stringa
    return valore;
  };

  const valoreConvertito = convertiValore(valoreInput);

  // ALL → inizializza per tutti gli utenti che non hanno la chiave
  if (target === 'all') {
    let contatore = 0;
    
    for (let jid in users) {
      const chiaveReale = trovaChiaveEsatta(users[jid], chiaveInput);
      
      // Se l'utente non ha già questa chiave, la inizializziamo
      if (!chiaveReale) {
        users[jid][chiaveInput] = valoreConvertito;
        contatore++;
      }
    }
    
    return m.reply(`✅ Voce "${chiaveInput}" inizializzata con valore "${valoreInput}" per ${contatore} utenti.`);
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
  
  if (chiaveReale) {
    return m.reply(`⚠️ L'utente ha già la voce "${chiaveInput}" con valore: ${users[userJid][chiaveReale]}`);
  }

  // Inizializza la voce per l'utente
  users[userJid][chiaveInput] = valoreConvertito;
  
  return m.reply(`✅ Voce "${chiaveInput}" inizializzata con valore "${valoreInput}" per l'utente.`);
};

handler.help = ['inizializzadb chiave valore [@utente | numero | all]'];
handler.tags = ['owner'];
handler.command = /^inizializzadb$/i;
handler.rowner = true;

export default handler;