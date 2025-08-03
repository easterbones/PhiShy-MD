import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0] || !/^next$/i.test(args[0])) {
    return m.reply(`❌ Usa: *${usedPrefix + command} next* per sapere quale **prossimo film Marvel** arriverà!`, null, { mentions: [m.sender] });
  }

  await m.reply('🧠 Interrogando il Multiverso...');

  try {
    const res = await fetch('https://www.whenisthenextmcufilm.com/api');
    if (!res.ok) throw new Error(`Errore API MCU: ${res.status}`);
    const data = await res.json();

    const { title, release_date, days_until, overview, poster_url, type } = data;

    // Traduci overview in italiano
    let overviewIT = overview;
    try {
      const translateUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(overview)}&langpair=en|it`;
      const translateRes = await fetch(translateUrl);
      const translateData = await translateRes.json();
      overviewIT = translateData.responseData.translatedText || overview;
    } catch (e) {
      console.warn('⚠️ Traduzione fallita, uso testo originale.');
    }

    const caption = `🎬 *Prossimo film Marvel:* ${title}

📅 *Data di uscita:* ${release_date} (${days_until} giorni)
🎥 *Tipo:* ${type || 'Film'}

📝 *Sinossi:*
_${overviewIT}_`;

    // Solo anteprima con thumbnail
    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: `In arrivo il ${release_date}`,
          thumbnailUrl: poster_url,
          mediaType: 1,
          renderLargerThumbnail: true,
          mediaUrl: 'https://www.whenisthenextmcufilm.com/',
          sourceUrl: 'https://www.whenisthenextmcufilm.com/'
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error('❌ Errore MCU plugin:', e);
    m.reply('❌ Non riesco a ricevere informazioni dal Multiverso! Riprova più tardi.');
  }
};

handler.command = /^mcu$/i;
handler.help = ['mcu next'];
handler.tags = ['film', 'entertainment'];
handler.limit = true;
handler.register = true;

export default handler;
