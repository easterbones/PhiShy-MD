// Regex per rilevare link di Temu
const linkRegex = /temu.com/i;

// Funzione "before" che viene eseguita prima di un evento
export async function before(m, { isAdmin, groupMetadata, isBotAdmin }) {
  // Se il messaggio è inviato dal bot stesso, ignora
  if (m.isBaileys && m.fromMe) {
    return true;
  }

  // Se il messaggio non è in un gruppo, ignora
  if (!m.isGroup) {
    return false;
  }

  // Ottieni i dati della chat dal database
  const chatData = global.db.data.chats[m.chat];

  // Ottieni il partecipante e l'ID del messaggio
  const participant = m.key.participant;
  const messageId = m.key.id;

  // Cerca un link di Instagram nel testo del messaggio
  const instaLink = linkRegex.exec(m.text);

  // Se l'utente è admin e la chat ha "antiinsta" attivo, ignora
  if (isAdmin && chatData.antiinsta && m.text.includes("instagram.com")) {
    return;
  }

  // Se "antiinsta" è attivo, c'è un link di Instagram, l'utente non è admin e il bot è admin
  if (chatData.antiinsta && instaLink && !isAdmin && isBotAdmin) {
    // Aumenta il contatore di avvertimenti dell'utente
    global.db.data.users[m.sender].warn += 1;

    // Elimina il messaggio contenente il link di Instagram
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: participant,
      },
    });

    // Ottieni il numero di avvertimenti dell'utente
    const userWarn = global.db.data.users[m.sender].warn;
    const userData = global.db.data.users[m.sender];

    // Se l'utente ha meno di 3 avvertimenti
    if (userWarn < 3) {
      // Invia un messaggio di avvertimento
      const warningMessage = {
        key: {
          participants: "0@s.whatsapp.net",
          fromMe: false,
          id: "Halo",
        },
        message: {
          locationMessage: {
            name: "𝐀𝐧𝐭𝐢 - 𝐈𝐧𝐬𝐭𝐚",
            jpegThumbnail: Buffer.from(await (await fetch("https://telegra.ph/file/e12aae9f5ea6c2e5e52aa.png")).arrayBuffer()),
            vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD",
          },
        },
        participant: "0@s.whatsapp.net",
      };

      await conn.reply(
        m.chat,
        `⚠ 𝐋𝐈𝐍𝐊 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌 𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐈 \n*${userData.warn}* ° 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎`,
        warningMessage
      );
    } else if (userWarn >= 3) {
      // Se l'utente ha 3 o più avvertimenti, rimuovilo dal gruppo
      global.db.data.users[m.sender].warn = 0;
      await m.reply("⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈");
      await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  return true;
}