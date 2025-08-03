import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, command, text, isAdmin }) => {
  if (!isAdmin) throw "👑 Solo un *amministratore* può usare questo comando!";

  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + "@s.whatsapp.net";
  const botOwner = global.owner[0] + "@s.whatsapp.net";
  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;



  const userData = global.db.data.users[user];
  
  // Percorsi delle immagini locali
  const basePath = './src/img/audio';
  const muteImageBuffer = fs.readFileSync(path.join(basePath, 'muta.png'));
  const unmuteImageBuffer = fs.readFileSync(path.join(basePath, 'smuta.png'));
  const locationImageBuffer = fs.readFileSync(path.join(basePath, 'profilo.png'));

  if (command === "muta") {
    if (userData.muto === true) throw "🔇 Questo utente è *già mutato*.";
    userData.muto = true;

    await conn.sendMessage(m.chat, {
      text: `🔇 @${user.split('@')[0]} è 𝐬𝐭𝐚𝐭𝐨 𝐦𝐮𝐭𝐚𝐭𝐨`,
      contextInfo: {
          	isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363401234816773@newsletter",
      serverMessageId: 100,
      newsletterName: 'canale dei meme 🎌',
    },
        externalAdReply: {
          title: "🚫 𝐩𝐡𝐢𝐬𝐡𝐲 𝐜𝐚𝐧𝐜𝐞𝐥𝐥𝐞𝐫𝐚",
          body: "𝐭𝐮𝐭𝐭𝐢 𝐢 𝐭𝐮𝐨𝐢 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢",
          thumbnail: muteImageBuffer,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: false
        },
        mentionedJid: [user]
      }
    }, {
      quoted: {
        key: { fromMe: false, id: "muted", participant: "0@s.whatsapp.net" },
        message: {
          locationMessage: {
            name: "🔇 Silenzio Attivato",
            jpegThumbnail: locationImageBuffer
          }
        }
      }
    });
  }

  if (command === "smuta") {
    if (userData.muto === false) throw "🔊 Questo utente è *già smutato*.";
    userData.muto = false;

    await conn.sendMessage(m.chat, {
      text: `🔊 @${user.split('@')[0]} è 𝐬𝐭𝐚𝐭𝐨 𝐬𝐦𝐮𝐭𝐚𝐭𝐨`,
      contextInfo: {
        externalAdReply: {
          title: "🔓 Utente Smutato!",
          body: "Può di nuovo parlare nel gruppo.",
          thumbnail: unmuteImageBuffer,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: false
        },
        mentionedJid: [user]
      }
    }, {
      quoted: {
        key: { fromMe: false, id: "unmuted", participant: "0@s.whatsapp.net" },
        message: {
          locationMessage: {
            name: "🔓 Silenzio Disattivato",
            jpegThumbnail: locationImageBuffer
          }
        }
      }
    });
  }
};

handler.command = /^(muta|smuta)$/i;

export default handler;
