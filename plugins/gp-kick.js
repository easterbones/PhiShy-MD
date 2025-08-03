import fetch from 'node-fetch';

let handler = async (message, { conn }) => {
  const userJid = conn.user.jid;
  const chatId = message.chat;


  // Controlla se è stata menzionata o citata una persona
  if (!message.mentionedJid[0] && !message.quoted) {
    // Messaggio di errore con vCard
    const errorMessage = {
      key: {
        participants: "0@s.whatsapp.net",
        fromMe: false,
        id: "Error"
      },
      message: {
        locationMessage: {
          name: "Errore: comando non valido",
          jpegThumbnail: Buffer.from(await (await fetch("https://telegra.ph/file/22b3e3d2a7b9f346e21b3.png")).arrayBuffer()),
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Errore;;;\nFN:Errore\nORG:Errore\nTITLE:\nitem1.TEL;waid=0000000000:+0 (000) 000-0000\nitem1.X-ABLabel:Errore\nX-WA-BIZ-DESCRIPTION:Usa il comando correttamente menzionando o citando un utente.\nX-WA-BIZ-NAME:Errore\nEND:VCARD`
        }
      },
      participant: "0@s.whatsapp.net"
    };

    return conn.sendMessage(chatId, {
      text: "ⓘ Errore: comando non valido. Menziona  o rispondi a un utente per bannarlo.",
      contextInfo: {
        externalAdReply: {
          title: "Uso errato del comando",
          previewType: "PHOTO",
          thumbnail: Buffer.from(await (await fetch("https://telegra.ph/file/8ca14ef9fa43e99d1d196.jpg")).arrayBuffer()),
          sourceUrl: "",
          mediaType: 1
        }
      }
    }, { quoted: errorMessage });
  }

  // Determina l'ID dell'utente da bannare
  const targetUser = message.quoted 
    ? message.quoted.sender 
    : message.mentionedJid && message.mentionedJid[0] 
      ? message.mentionedJid[0] 
      : message.fromMe 
        ? userJid 
        : message.sender;

  const userToBan = message.mentionedJid[0] 
    ? message.mentionedJid[0] 
    : message.quoted.sender;

  // Ottieni l'immagine del profilo dell'utente
  const profilePictureUrl = await conn.profilePictureUrl(targetUser, 'image').catch(() => null) || "./src/avatar_contact.png";
  let profilePictureBuffer;

  if (profilePictureUrl !== './src/avatar_contact.png') {
    profilePictureBuffer = Buffer.from(await (await fetch(profilePictureUrl)).arrayBuffer());
  } else {
    profilePictureBuffer = Buffer.from(await (await fetch('https://telegra.ph/file/8ca14ef9fa43e99d1d196.jpg')).arrayBuffer());
  }

  // Ottieni i metadati del gruppo
  const groupMetadata = await conn.groupMetadata(chatId);
  const groupOwner = groupMetadata.owner || chatId.split('-')[0] + "@s.whatsapp.net";
  const botOwner = global.owner[0][0] + "@s.whatsapp.net";

  // Controlli di sicurezza
  if (targetUser === userJid) {
    return conn.reply  (message.chat, `ⓘ Non puoi rimuovere il bot.`, message, rcanal )
  }

  if (targetUser === botOwner) {
    return conn.reply (message.chat,"ⓘ Il creatore del bot non può essere rimosso.", message, rcanal)
  }

  if (targetUser === groupOwner) {
    return conn.reply (message.chat,"ⓘ Non puoi rimuovere il creatore del gruppo.", message, rcanal)
  } 

  // Aggiungere controllo per moderatori
  const isMods = global.db.data.mods.includes(message.sender);
  if (!isMods && !message.isAdmin) {
     return conn.reply(message.chat, "ⓘ Questo comando è disponibile solo per admin o moderatori.", message, rcanal)
  }

  // Cooldown per moderatori (12 ore)
const modCooldown = 12 * 60 * 60 * 1000; // 12 ore in ms
if (!global.db.data.kickModCooldown) global.db.data.kickModCooldown = {};

if (isMods && !message.isAdmin) {
  const lastKick = global.db.data.kickModCooldown[message.sender] || 0;
  const now = Date.now();
  if (now - lastKick < modCooldown) {
    const remaining = Math.ceil((modCooldown - (now - lastKick)) / (60 * 60 * 1000));
    return conn.reply(message.chat, `ⓘ Come moderatore puoi usare questo comando solo una volta ogni 12 ore. Riprova tra ${remaining}h.`, message, rcanal);
  }
  global.db.data.kickModCooldown[message.sender] = now;
}

  // Messaggio di conferma
  const confirmationMessage = { 
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "Rimozione dal gruppo...",
        jpegThumbnail: Buffer.from(await (await fetch("https://telegra.ph/file/22b3e3d2a7b9f346e21b3.png")).arrayBuffer()),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
      }
    },
    participant: "0@s.whatsapp.net"
  };

  // Invia il messaggio di conferma
  conn.sendMessage(chatId, {
    text: "ⓘ Utente rimosso con successo ✔️",
    contextInfo: {
      externalAdReply: {
        title: conn.getName(targetUser) + " ",
        previewType: "PHOTO",
        thumbnail: profilePictureBuffer,
        sourceUrl: "https://wa.me/" + targetUser.split('@')[0],
        mediaType: 1
      }
    }
  }, { quoted: confirmationMessage });

  // Rimuovi l'utente dal gruppo
  await conn.groupParticipantsUpdate(chatId, [userToBan], "remove");
};

// Configurazione del comando
handler.command = /^(kick)$/i
handler.group = true;
handler.botAdmin = true;

export default handler;