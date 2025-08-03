import fetch from 'node-fetch';
import translate from 'translate-google';

let handler = async (m) => {
  try {
    const apiUrl = 'https://geek-jokes.sameerkumar.website/api?format=json';
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const battutaOriginale = data.joke;
    console.log('[BATTUTA] Originale:', battutaOriginale);

    const tradotta = await translate(battutaOriginale, { to: 'it' });
    console.log('[BATTUTA] Tradotta:', tradotta);

    let messaggio = `🧠 *Battuta Geek:*\n\n_${tradotta}_`;

    m.reply(messaggio);

  } catch (e) {
    console.error('[BATTUTA] Errore:', e);
    m.reply('❌ Errore nel recuperare la battuta. Riprova più tardi.');
  }
};

handler.command = /^battuta$/i;
export default handler;
