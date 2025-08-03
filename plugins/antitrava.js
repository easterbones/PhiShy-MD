// Tradotto in italiano
import * as fs from 'fs';

export async function before(m, { conn, isAdmin, isBotAdmin, usedPrefix }) {
  if (!m.fromMe) return true;
  if (!m.isGroup) return false;
  m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && (m.id.length === 20 || m.id.length === 22) || m.id.startsWith('B24E') && m.id.length === 20;
  if (m.isBot) return;

  let chat = global.db.data.chats[m.chat];
  let bot = global.db.data.settings[this.user.jid] || {};
  let delet = m.key.participant;
  let bang = m.key.id;
  let name = await conn.getName(m.sender);
  let fakemek = {
    key: { participant: "0@s.whatsapp.net", "remoteJid": "0@s.whatsapp.net" },
    message: {
      groupInviteMessage: {
        groupJid: "51995386439-1616969743@g.us",
        inviteCode: "m",
        groupName: "P",
        caption: 'ʟᴏʟɪʙᴏᴛ-ᴍᴅ',
        jpegThumbnail: null
      }
    }
  };

  if (chat.antiTraba && m.text.length > 6000) { // Quantità massima di caratteri accettati in un messaggio
    if (isAdmin) return conn.sendMessage(m.chat, { text: `⚠️ L'amministratore @${m.sender.split("@")[0]} ha appena inviato un testo che contiene troppi caratteri!`, mentions: [m.sender] }, { quoted: fakemek });

    await conn.fakeReply(m.chat, `*[ ! ] È stato rilevato un messaggio che contiene troppi caratteri [ ! ]*`, '0@s.whatsapp.net', `${isBotAdmin ? 'Esiste ancora la lergionVirgo? 🤣' : 'Non sono amministratore, non posso fare nulla :/'}`, 'status@broadcast', null, fake);

    if (isBotAdmin) {
      conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
      setTimeout(() => {
        conn.fakeReply(m.chat, `Segna la chat come letta ✓\n${"\n".repeat(400)}\n• Numero: wa.me/${m.sender.split("@")[0]}\n• Alias: ${name}\n‼️ Ha appena inviato un testo che contiene troppi caratteri che possono causare problemi ai dispositivi`, '0@s.whatsapp.net', `${'Esiste ancora la lergionVirgo?'} 🤣, ${'sarà espulso, qui non vogliamo ratti'} 🐁`, 'status@broadcast', null, fake);
      }, 0);
      setTimeout(() => {
        conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      }, 1000);
    } else if (!bot.restrict) return m.reply(`Questo comando è disattivato dal mio capo`);
  }
  return true;
}