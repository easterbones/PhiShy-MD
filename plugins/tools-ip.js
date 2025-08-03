import fetch from 'node-fetch';

let handler = async (m, { args, command }) => {
  if (!args[0]) {
    return m.reply('❌ Inserisci un indirizzo IP!\nEsempio: .ip 8.8.8.8');
  }

  const ip = args[0];
  const url = `https://ipinfo.io/${ip}/geo`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    
    const data = await res.json();

    const {
      ip: indirizzo,
      city,
      region,
      country,
      loc,
      org,
      timezone,
      postal
    } = data;

    let messaggio = `🌐 *Informazioni su IP: ${indirizzo || ip}*\n\n`;
    messaggio += `📍 *Città:* ${city || 'Non disponibile'}\n`;
    messaggio += `📌 *Regione:* ${region || 'Non disponibile'}\n`;
    messaggio += `🏳️ *Nazione:* ${country || 'Non disponibile'}\n`;
    messaggio += `📫 *CAP:* ${postal || 'Non disponibile'}\n`;
    messaggio += `🛰️ *Coordinate:* ${loc || 'Non disponibile'}\n`;
    messaggio += `💼 *Provider:* ${org || 'Non disponibile'}\n`;
    messaggio += `🕒 *Timezone:* ${timezone || 'Non disponibile'}`;

    m.reply(messaggio);

  } catch (e) {
    console.error('[IP] Errore:', e);
    m.reply('❌ Errore durante il recupero delle informazioni. IP non valido o API non raggiungibile.');
  }
};

handler.command = /^ip$/i;
export default handler;
