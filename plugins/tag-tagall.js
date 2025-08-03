let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
  // Verifica se l'utente è un amministratore o il proprietario del bot
  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn); // Mostra un messaggio di errore se non è autorizzato
    throw false;
  }

  // Unisci gli argomenti passati al comando in un'unica stringa
  let messageText = args.join` `;
  let formattedMessage = `*:* ${messageText}`;

  // Costruisci il messaggio con il testo formattato
  let finalMessage = `
══════ •⊰✦⊱• ══════
𝐁𝐎𝐓: ${nomebot}

✦➤ ${formattedMessage}

-_-  𝐌𝐄𝐌𝐁𝐑𝐈 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎 -_-
  `;

  // Aggiungi i tag di tutti i partecipanti al messaggio
  for (let participant of participants) {
    finalMessage += `✧‌⃟ᗒ @${participant.id.split('@')[0]}\n`;
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
        name: "𝐓𝐚𝐠𝐀𝐥𝐥", // Nome del messaggio
        jpegThumbnail: await (await fetch("https://telegra.ph/file/92576d96e97bb7e3939e2.png")).buffer(), // Immagine di anteprima
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

  // Invia il messaggio con i tag
  await conn.sendMessage(
    m.chat,
    {
      text: finalMessage,
      mentions: participants.map((user) => user.id), // Menziona tutti i partecipanti
    },
    {
      quoted: quotedMessage, // Aggiungi il messaggio citato
    }
  );
};

// Informazioni sul comando
handler.help = ["tagall <messaggio>", "invocar <messaggio>"];
handler.tags = ['group'];
handler.command = /^(tagall|menziona|marcar|todos|invocación)$/i;
handler.admin = true; // Solo gli amministratori possono eseguire il comando
handler.group = true; // Funziona solo nei gruppi

export default handler;