import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const translate = async (text, from = 'it', to = 'en') => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.responseData.translatedText;
};

const handler = async (m, { conn, text, command }) => {
  let user = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

  if (!text) {
    return conn.reply(m.chat, '📥 Scrivi una frase da trasformare in stile *Yoda*.\nEsempio: `.yoda Sto imparando a programmare i bot`', m);
  }

  try {
    // 1. Traduzione in inglese
    const inInglese = await translate(text, 'it', 'en');

    // 2. Chiamata all’API Yoda
    const body = new URLSearchParams({ text: inInglese });
    const res = await fetch('https://api.funtranslations.com/translate/yoda.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);

    const yodaEnglish = json.contents.translated;

    // 3. Traduzione di ritorno in italiano
    const yodaItaliano = await translate(yodaEnglish, 'en', 'it');

    // 4. Risposta finale
    const output = `"${yodaItaliano}"`;

    // ❗ Assicurati che `locationImageBuffer` sia definito o rimuovi questa parte
    const locationImageBuffer = null; // <-- Aggiusta questa riga se vuoi usare un'immagine

    await conn.sendMessage(m.chat, {
      text: output,
      contextInfo: {
        externalAdReply: {
          title: `🟢 *Yoda dice:*\n\n`,
          body: ``,
          thumbnailUrl: "https://th.bing.com/th/id/OIP._ZHahhmP7En4YB3eFY9S1QHaFj?r=0&rs=1&pid=ImgDetMain",
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: false
        },
        mentionedJid: [user]
      }
    }, {
      quoted: {
        key: { fromMe: false, id: "unmuted", participant: "0@s.whatsapp.net" },
        message: {
          locationMessage: {
            name: "il dio sta parlando",
            jpegThumbnail: locationImageBuffer
          }
        }
      }
    });

  } catch (err) {
    console.error('[YODA ERROR]', err);
    conn.reply(m.chat, '❌ Errore nella traduzione Yoda. Potresti aver superato il limite dell’API, riprova più tardi.', m);
  }
};

handler.command = ['yoda'];
handler.help = ['yoda <frase italiana>'];
handler.tags = ['fun'];
handler.register = true;

export default handler;
