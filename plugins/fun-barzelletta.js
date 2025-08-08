import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';


async function traduciTesto(text, lang = 'it') {
  try {
    let result = await translate(`${text}`, { to: lang, autoCorrect: true });
    return result.text;
  } catch (err) {
    console.error('[TRADUCI TESTO] Errore:', err);
    // fallback: nessuna traduzione
    return text;
  }
}

let handler = async (m) => {
  try {
    const apiUrl = 'https://geek-jokes.sameerkumar.website/api?format=json';
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const battutaOriginale = data.joke;
    console.log('[BATTUTA] Originale:', battutaOriginale);
    let tradotta;
    try {
      tradotta = await traduciTesto(battutaOriginale, 'it');
    } catch (err) {
      console.error('[BATTUTA] Errore traduzione:', err);
      tradotta = battutaOriginale;
    }
    console.log('[BATTUTA] Tradotta:', tradotta);
    console.log('[BATTUTA] Tradotta:', tradotta);

    let messaggio = `🧠 *Battuta Geek:*\n\n_${tradotta}_`;
    await m.reply(messaggio);

  } catch (e) {
    console.error('[BATTUTA] Errore:', e);
    m.reply('❌ Errore nel recuperare la battuta. Riprova più tardi.');
  }
};

const BATTUTA_COMMAND_REGEX = /^battuta$/i;
handler.command = BATTUTA_COMMAND_REGEX;
export default handler;
