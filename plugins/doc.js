let handler = async (m, { conn, groupMetadata, participants }) => {
  if (!m.isGroup) return m.reply('⚠️ Solo nei gruppi!');

  // Stile compatto per mobile
  const docMessage = `
📚 *DOCUMENTAZIONE WHATSAPP MODS* 📚

*📛 ZOZZAP*
- WhatsApp modificato con funzioni extra
- Temi, icone, funzioni anti-ban
- ⚠️ Rischio ban account

*🦹 ZOZZAPER*
- "Paladino" di WhatsApp
- Competenze hacking avanzate
- Attenzione alle minacce

*🤡 MEME*
- Bluffatore digitale
- Finge di essere zozzaper
- 50% bluff - 50% pericolo

*👤 RANDOM*
- Utente standard
- Scrive normalmente o spamma
- Ignaro del "lato oscuro"

*📞 VOIP*
- Numeri virtuali (SIM virtuale)
- Per anonimato online
- Costo: gratis → 80€+

*📦 BUZON*
- Tecnica furto numeri
- Sfrutta vulnerabilità provider
- Ruba accesso SMS

🔍 *INFO GRUPPO*
- Nome: ${groupMetadata.subject || 'Sconosciuto'}
- Membri: ${participants.length} (Admin: ${participants.filter(p => p.admin).length})

ℹ️ Altro: wa.me/123456789
`;

  // Invia con stile mobile-friendly
  await conn.sendMessage(m.chat, { 
    text: docMessage,
    contextInfo: {
      mentionedJid: participants.map(p => p.id),
      externalAdReply: {
        title: "📱 WhatsApp Mod Docs",
        body: "Tutto in formato compatto",
        thumbnail: Buffer.from(await (await fetch('https://th.bing.com/th/id/OIP.xNlE1fhtHOPjoo4Z1p3yAgHaD4?rs=1&pid=ImgDetMain')).arrayBuffer()),
        mediaType: 1
      }
    }
  }, { quoted: m });

  // Reazione veloce
  await conn.sendMessage(m.chat, {
    react: {
      text: "📚",
      key: m.key
    }
  });
}

handler.help = ['doc'];
handler.tags = ['info'];
handler.command = /^(doc|docs|whatsappdoc)$/i;
handler.group = true;

export default handler;