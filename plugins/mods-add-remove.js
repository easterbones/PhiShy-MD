let handler = async (m, { conn, args, command, usedPrefix, isOwner, mentionedJid }) => {
  if (!isOwner) throw '❌ Solo il mio creatore può usare questo comando';

  if (args.length < 2) {
    throw `📌 Uso corretto:\n${usedPrefix + command} add @tag/numero\n${usedPrefix + command} remove @tag/numero`;
  }

  const mode = args[0].toLowerCase();
  let input = args[1];
  
  // Estrai JID da menzione se presente
  let jid;
  if (mentionedJid && mentionedJid.length > 0) {
    jid = mentionedJid[0];
  } else {
    // Normalizza numero (supporta +39, spazi, trattini)
    const number = input.replace(/[^0-9]/g, '');
    jid = number.endsWith('@s.whatsapp.net') || number.endsWith('@c.us') 
      ? number 
      : number + '@s.whatsapp.net';
  }

  // Inizializza array moderatori se non esiste
  if (!global.db.data.mods) global.db.data.mods = [];

  // Aggiungi moderatore
  if (mode === 'add' || mode === 'aggiungi') {
    if (global.db.data.mods.includes(jid)) {
      throw `⚠️ ${jid} è già un moderatore!`;
    }
    global.db.data.mods.push(jid);
    m.reply(`✅ Aggiunto moderatore:\n${jid}`);
  } 
  // Rimuovi moderatore
  else if (mode === 'remove' || mode === 'rimuovi' || mode === 'delete' || mode === 'elimina' || mode === 'leva') {
    const index = global.db.data.mods.indexOf(jid);
    if (index === -1) {
      throw `⚠️ ${jid} non è nella lista moderatori!`;
    }
    global.db.data.mods.splice(index, 1);
    m.reply(`❌ Rimosso moderatore:\n${jid}`);
  } else {
    throw `❌ Comando non valido. Usa:\n${usedPrefix + command} add @tag/numero\n${usedPrefix + command} remove @tag/numero`;
  }

  // Log per debug
  console.log('Moderatori attuali:', global.db.data.mods);
};

handler.command = ['mod', 'moderatore', 'modifica'];
handler.help = [
  'mod add @tag/numero',
  'mod remove @tag/numero'
];
handler.tags = ['owner'];
handler.owner = true;

export default handler;