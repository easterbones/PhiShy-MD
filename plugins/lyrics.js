const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎶 Inserisci il nome della canzone e l'autore\n📌 Esempio: *${usedPrefix + command} Adele - Hello*`;

  const fkontak = {
    key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
    message: { contactMessage: { vcard: "BEGIN:VCARD\nVERSION:3.0\nN:Bot\nFN:Bot\nTEL;waid=000:000\nEND:VCARD" } },
    participant: "0@s.whatsapp.net"
  };

  try {
    const [artist, ...titleParts] = text.split("-");
    if (!artist || titleParts.length === 0) throw `❌ Formato non valido. Usa *Artista - Titolo*`;

    const title = titleParts.join("-").trim();
    const res = await fetch(`https://api.lyrics.ovh/v1/${artist.trim()}/${title}`);
    if (!res.ok) throw await res.text();
    
    const json = await res.json();
    if (!json.lyrics) throw "❌ Testo non trovato.";

    await conn.sendMessage(m.chat, {
      text: `🎤 *${artist.trim()} - ${title}*\n\n📃 *TESTO:*\n${json.lyrics}`
    }, { quoted: fkontak });

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, `⚠️ Errore nel recupero del testo.\nProva con: *Artista - Titolo*\nEsempio: *Eros Ramazzotti - Più bella cosa*`, m);
  }
};

handler.help = ['testo'].map(v => v + ' <artista - titolo>');
handler.tags = ['internet'];
handler.command = /^(testo|letra|lyrics|lyric|lirik)$/i;
handler.limit = 1;
handler.level = 2;
handler.exp = 40;

export default handler;
