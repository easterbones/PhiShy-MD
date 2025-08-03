import fetch from 'node-fetch';

let handler = async (m, { args }) => {
  try {
    const year = parseInt(args[0]) || 2024;
    const url = `https://eurovisionapi.runasp.net/api/contests/${year}`;
    console.log('[EUROVISION] Richiesta a:', url);

    const res = await fetch(url);
    if (!res.ok) {
      console.log(`[EUROVISION] Errore HTTP ${res.status}`);
      return m.reply(`❌ Nessuna edizione trovata per l'anno ${year}.`);
    }

    const data = await res.json();
    console.log('[EUROVISION] Risposta API:', JSON.stringify(data, null, 2));

    let vincitore = data.contestants?.[0];

    let messaggio = `🎤 *EUROVISION ${data.year}*\n`;
    messaggio += `📍 *Città:* ${data.city || 'Sconosciuta'}\n`;
    messaggio += `🏟️ *Arena:* ${data.arena || 'Non specificata'}\n`;
    messaggio += `📺 *Slogan:* ${data.slogan || 'Non disponibile'}\n`;

    if (vincitore) {
      messaggio += `🏆 *Vincitore:* ${vincitore.artist} (${vincitore.country}) - "${vincitore.song}"\n`;
    } else {
      messaggio += `🏆 Vincitore non disponibile\n`;
    }

    if (data.logoUrl) {
      await conn.sendMessage(m.chat, {
        image: { url: data.logoUrl },
        caption: messaggio
      }, { quoted: m });
    } else {
      m.reply(messaggio);
    }

  } catch (err) {
    console.error('[EUROVISION] Errore nel plugin:', err);
    m.reply('❌ Errore nel recuperare i dati da Eurovision.');
  }
};

handler.command = /^eurovision$/i;
export default handler;
