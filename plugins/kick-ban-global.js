import fetch from 'node-fetch';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (message, { conn, text }) => {
  const userJid = conn.user.jid;
  const chatId = message.chat;
  
  // Spostato dopo l'inizializzazione di chatId
  const groupMetadata = await conn.groupMetadata(chatId);
  const groupOwner = groupMetadata.owner || chatId.split('-')[0] + "@s.whatsapp.net";
  const botOwner = global.owner[0][0] + "@s.whatsapp.net";

  const numero = text?.replace(/[^0-9]/g, "");
  if (!numero) {
    return message.reply("❌ Scrivi il numero dell'utente da bannare. Esempio: `.ban 391234567890`");
  }

  const targetUser = numero + "@s.whatsapp.net";
  const profilePictureBuffer = await conn.profilePictureUrl(targetUser, 'image')
    .then(url => fetch(url).then(res => res.buffer()))
    .catch(() => fetch('https://telegra.ph/file/8ca14ef9fa43e99d1d196.jpg').then(res => res.buffer()));

  let nomeUtente = numero;
  try {
    nomeUtente = await conn.getName(targetUser) || numero;
  } catch (e) {}

  const groups = await conn.groupFetchAllParticipating();
  let removedFrom = [];

  for (let groupId in groups) {
    try {
      const metadata = groups[groupId];
      const isBotAdmin = metadata.participants.find(p => p.id === conn.user.jid)?.admin;
      const isTargetInGroup = metadata.participants.find(p => p.id === targetUser);
      
      // Controlli di sicurezza
      if (targetUser === userJid) {
        throw "ⓘ Non puoi rimuovere il bot.";
      }

      if (targetUser === botOwner) {
        throw "ⓘ Il creatore del bot non può essere rimosso.";
      }

      if (targetUser === groupOwner) {
        throw "ⓘ Non puoi rimuovere il creatore del gruppo.";
      }

      if (isBotAdmin && isTargetInGroup) {
        await conn.groupParticipantsUpdate(groupId, [targetUser], "remove");
        removedFrom.push({ groupId, groupName: metadata.subject });
        await sleep(2000);
      }
    } catch (e) {
      console.log(`[ban] Errore nel gruppo ${groupId}:`, e);
    }
  }

  if (!global.db.data.banLog) global.db.data.banLog = {};
  if (!global.db.data.banLog[targetUser]) global.db.data.banLog[targetUser] = [];

  global.db.data.banLog[targetUser].push({
    admin: message.sender,
    date: new Date().toISOString(),
    groups: removedFrom
  });

  const listaGruppi = removedFrom.length > 0
    ? removedFrom.map(g => `• ${g.groupName}`).join("\n")
    : "Nessun gruppo trovato o il bot non è admin nei gruppi.";

  return conn.sendMessage(message.chat, {
    text: `✅ L'utente @${numero} (${nomeUtente}) è stato rimosso da *${removedFrom.length}* gruppi con successo.\n\n📋 *Gruppi rimossi:*\n${listaGruppi}`,
    contextInfo: {
      mentionedJid: [targetUser],
      externalAdReply: {
        title: `Utente bannato:\n${nomeUtente}`,
        thumbnail: profilePictureBuffer,
        sourceUrl: "#"
      }
    }
  });
};

handler.help = ['ban'];
handler.tags = ['group'];
handler.command = /^ban$/i;
handler.admin = true;
handler.group = true;

export default handler;