export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  // Se il messaggio è di Baileys (sistema) o proviene dal bot stesso, esci subito
  if (m.isBaileys && m.fromMe) return true;

  // Se il messaggio viene da un gruppo, esci
  if (m.isGroup) return false;

  // Se non c'è un messaggio, esci
  if (!m.message) return true;

  // Ottieni i dati utente
  let userData = global.db.data.users[m.sender];

  // Ottieni le impostazioni della chat
  let chatSettings = global.db.data.chats[this.user.jid] || {};

  // Se antiPrivate è attivo, e il mittente non è owner né real owner, blocca il mittente
  if (chatSettings.antiPrivate && !isOwner && !isROwner) {
    await this.updateBlockStatus(m.sender, 'block');

    // Invia un messaggio di avviso
    await conn.sendMessage(m.chat, {
      text: "⚠️ Non scrivere in privato al bot! Hai ricevuto un warn.",
      mentions: [m.sender]
    });

    // Aggiungi un warn all'utente
    await addPrivateMessageWarning(m.sender, "Scrittura in privato al bot");
  }

  return false;
}
