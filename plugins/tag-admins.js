let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
  // Verifica se l'utente è un amministratore o il proprietario del bot
  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn); // Mostra un messaggio di errore se non è autorizzato
    throw false;
  }

  // Filtra solo gli amministratori del gruppo
  const admins = participants.filter(participant => participant.admin !== null && participant.admin !== undefined);

  // Verifica se ci sono amministratori
  if (admins.length === 0) {
    return conn.reply(m.chat, '⚠️ Nessun amministratore trovato in questo gruppo.', m);
  }

  // Unisci gli argomenti passati al comando in un'unica stringa (opzionale)
  let messageText = args.join` `;

  // Costruisci il messaggio con il testo formattato
  let finalMessage = `
══════ •⊰✦⊱• ══════
-_-  𝐀𝐌𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐎𝐑𝐈 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎 -_-
  `;

  // Aggiungi i tag degli amministratori al messaggio
  for (let admin of admins) {
    finalMessage += `✧‌⃟ᗒ @${admin.id.split('@')[0]}\n`;
  }

  // Aggiungi la chiusura del messaggio
  finalMessage += "══════ •⊰✧⊱• ══════";

  // Crea un oggetto per il messaggio citato (quoted)
  let quotedMessage = {
    key: {
      participants: "0@s.whatsapp.net", // Partecipante fittizio
      fromMe: false, // Non inviato dal bot
      id: "Halo", // ID del messaggio
    },
    message: {
      locationMessage: {
        name: "𝐓𝐚𝐠𝐀𝐝𝐦𝐢𝐧", // Nome del messaggio
        jpegThumbnail: Buffer.from(await (await fetch("https://telegra.ph/file/92576d96e97bb7e3939e2.png")).arrayBuffer()), // Immagine di anteprima
        vcard: `
BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=15395490858:+1 (539) 549-0858
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD
        `, // vCard fittizia
      },
    },
    participant: '0@s.whatsapp.net', // Partecipante fittizio
  };

  // Invia il messaggio con i tag degli amministratori
  await conn.sendMessage(
    m.chat,
    {
      text: finalMessage,
      mentions: admins.map((admin) => admin.id), // Menziona solo gli amministratori
    },
    {
      quoted: quotedMessage, // Aggiungi il messaggio citato
    }
  );
};

// Informazioni sul comando
handler.help = ["admins", "amministratori"];
handler.tags = ['tag'];
handler.command = /^(tagadmins|tagadmin|amministratori)$/i;
handler.admin = true; // Solo gli amministratori possono eseguire il comando
handler.group = true; // Funziona solo nei gruppi

export default handler;