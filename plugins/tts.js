import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  if (!text) throw '🗣️ Scrivi un testo da trasformare in audio.\n\nEsempio: .tts ciao amore mio 💞';

  try {
    const apiUrl = `https://laurine.site/api/tts/tts-nova?text=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json?.status || !json?.data?.URL) {
      throw '❌ Errore nella generazione dell\'audio.';
    }

    const audioUrl = json.data.URL;

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4', // compatibile con WhatsApp
      ptt: false
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    throw '⚠️ Si è verificato un errore nel comando .tts';
  }
};

handler.help = ['tts'].map(v => '.' + v);
handler.tags = ['tools'];
handler.command = /^tts$/i;

export default handler;
