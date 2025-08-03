import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';

let handler = async (m, { conn, text, command }) => {
  if (!text) {
    return conn.reply(m.chat, '❓ *Scrivi una domanda, babbeo.*\nEsempio: .8ball Sarò mai felice?', m);
  }

  try {
    let url = `https://eightballapi.com/api/biased?question=${encodeURIComponent(text)}&lucky=false&locale=en`;

    let res = await fetch(url);
    if (!res.ok) throw 'Errore nel contattare la sfera magica.';

    let data = await res.json();
    let rispostaOriginale = data.reading;

    // Traduci la risposta in italiano
    let tradotta = await translate(rispostaOriginale, { to: 'it' });
    let rispostaIt = tradotta.text;

    let messaggio = `🎱 *Phishy risponde:* "${rispostaIt}"\n\nContento? Io no.`;

    conn.reply(m.chat, messaggio, m, phishy);
  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '🛑 Phishy ha rotto la sfera... forse perché ha detto la verità.', m);
  }
};

handler.command = ['8ball', 'phishyball'];
handler.tags = ['phishy', 'giochi'];
handler.help = ['8ball [domanda]'];
handler.register = true;

export default handler;
