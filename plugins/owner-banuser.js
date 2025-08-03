let handler = async (m, { conn, participants, usedPrefix, command }) => {
  if (!m.mentionedJid?.[0] && !m.quoted) return;

  let target;

  // Se il messaggio è una risposta o ha un tag, ottiene l'utente target
  if (m.quoted) {
    target = m.mentionedJid?.[0] ? m.mentionedJid[0] : m.quoted.sender;
  } else {
    target = m.chat;
  }

  // Segna l'utente come bannato nel database
  let users = global.db.data.users;
  users[target].banned = true;

  // Prepara un messaggio con posizione e vCard (biglietto da visita)
  let fakeContact = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo",
    },
    message: {
      locationMessage: {
        name: "chi? tagga qualcuno",
        jpegThumbnail: await (await fetch("https://telegra.ph/file/710185c7e0247662d8ca6.png")).buffer(),
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`,
      },
    },
    participant: "0@s.whatsapp.net",
  };

  // Risponde al messaggio con l’avviso che l’utente è stato bloccato
  conn.reply(m.sender, "𝐔𝐭𝐞𝐧𝐭𝐞 𝐛𝐥𝐨𝐜𝐜𝐚𝐭𝐨", fakeContact);
};

// Comando che attiva la funzione: .blocca
handler.command = /^banuser/i;
handler.rowner = true;

export default handler;
