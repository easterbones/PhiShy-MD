// Regex per rilevare link di TikTok
const linkRegex = /vm.tiktok.com/i;

// Funzione "before" che viene eseguita prima di un evento
export async function before(m, { isAdmin, groupMetadata, isBotAdmin }) {
  // Se il messaggio è inviato dal bot stesso, ignora
  if (m.isBaileys && m.fromMe) return true;

  // Se il messaggio non è in un gruppo, ignora
  if (!m.isGroup) return false;

  // Ottieni i dati della chat dal database
  const chatData = global.db.data.chats[m.chat];

  // Ottieni il partecipante e l'ID del messaggio
  const participant = m.key.participant;
  const messageId = m.key.id;

  // Cerca un link di TikTok nel testo del messaggio
  const tiktokLink = linkRegex.exec(m.text);

  // Se l'utente è admin e la chat ha "antitiktok" attivo, ignora
  if (isAdmin && chatData.antitiktok && m.text.includes("vm.tiktok.com")) {
    return;
  }

  // Se "antitiktok" è attivo, c'è un link di TikTok, l'utente non è admin e il bot è admin
  if (chatData.antitiktok && tiktokLink && !isAdmin && isBotAdmin) {
    // Aumenta il contatore di avvertimenti dell'utente
    const user = global.db.data.users[m.sender];
    user.warn += 1;

    // Aggiungi motivo e dettagli a warnReasons
    if (!user.warnReasons) user.warnReasons = [];
    const now = new Date();
    user.warnReasons.push({
      reason: 'Spam TikTok',
      date: now.toISOString(),
      displayDate: now.toLocaleString('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      admin: 'sistema'
    });

    // Elimina il messaggio contenente il link di TikTok
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: participant,
      },
    });

    // Ottieni il numero di avvertimenti dell'utente
    const userWarn = user.warn;

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
            name: "𝐀𝐧𝐭𝐢 - 𝐓𝐢𝐤𝐓𝐨𝐤",
            jpegThumbnail: await (await fetch("https://telegra.ph/file/5dd0169efd3a5c1b99017.png")).buffer(),
            vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD",
          },
        },
        participant: "0@s.whatsapp.net",
      };

      await conn.reply(
        m.chat,
        `⚠ 𝐋𝐈𝐍𝐊 𝐓𝐈𝐊 𝐓𝐎𝐊 𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐈 \n*${userWarn}* ° 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎`,
        warningMessage
      );
    } else if (userWarn >= 3) {
      // Se l'utente ha 3 o più avvertimenti, rimuovilo dal gruppo
      user.warn = 0;
      await m.reply("⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈");
      await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  return true;
}