import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import * as fs from 'fs';

let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  if (!(isAdmin || isOwner)) {
    await m.reply("❌ Solo gli admin possono usare questo comando!");
    throw false;
  }

  try {
    // Filtra SOLO i non-admin (esclude admin, superadmin e owner)
    let nonAdminUsers = participants
      .filter(user => !user.admin && !user.isSuperAdmin)
      .map(u => conn.decodeJid(u.id));

    // Prepara il messaggio fisso + testo citato
    let fixedMessage = "📢 *Messaggio per gli utenti normali:*\n";
    let quotedText = m.quoted ? (m.quoted.text || "") : "";
    let fullText = fixedMessage + (text || quotedText);

    // Se non ci sono utenti normali, avvisa
    if (nonAdminUsers.length === 0) {
      await m.reply("⚠️ Nessun utente normale da menzionare.");
      return;
    }

    // Invia il messaggio con menzioni
    await conn.sendMessage(
      m.chat,
      {
        text: fullText,
        mentions: nonAdminUsers,
      },
      {
        quoted: m, // Cita il messaggio originale
      }
    );

  } catch (error) {
    console.error("Errore nel comando:", error);
    await m.reply("❌ Si è verificato un errore durante l'invio del messaggio.");
  }
};

handler.help = ["tagNormali <testo>"];
handler.tags = ['group'];
handler.command = /^(tagmembri|tagnormali)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;