let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true;
  if (!m.isGroup) return false;

  let chat = global.db.data.chats[m.chat];
  let settings = global.db.data.settings[this.user.jid] || {};
  const linkMatch = linkRegex.exec(m.text);

  // Se è un admin o il messaggio è una risposta a un admin, ignora
  if (isAdmin || (m.quoted && (await this.groupMetadata(m.chat)).participants.find(p => p.id === m.quoted.sender)?.admin)) {
    return true;
  }

  if (chat.antiLink && linkMatch && !isAdmin) {
    const groupInviteCode = "https://chat.whatsapp.com/" + (await this.groupInviteCode(m.chat));

    // Se il link appartiene al gruppo corrente, ignora
    if (m.text.includes(groupInviteCode)) return true;

    // Log per debug
    console.log('Antilink triggered:', {
      sender: m.sender,
      text: m.text,
      isQuoted: !!m.quoted,
      quotedSender: m.quoted?.sender
    });

    // Notifica al gruppo admin
    try {
      const groupMetadata = await this.groupMetadata(m.chat);
      await this.sendMessage("120363387953890165@g.us", {
        text: `🚨 Link spammato in *${groupMetadata.subject}*
🔗 ${linkMatch[0]}
👤 Utente: @${m.sender.split('@')[0]}`,
        mentions: [m.sender]
      });
    } catch (e) {
      console.error('Errore notifica admin:', e);
    }

    // Azioni punitive
    if (isBotAdmin && settings.restrict) {
      await this.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant
        }
      });

      await this.sendMessage(m.chat, {
        text: `⚠️ @${m.sender.split('@')[0]} ha inviato un link non consentito!`,
        mentions: [m.sender]
      });

      // Rimuovi l'utente solo se il link non appartiene al gruppo corrente
      if (!m.text.includes(groupInviteCode)) {
        await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      }
    }
  }
  return true;
}