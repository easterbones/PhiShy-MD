import fetch from 'node-fetch';

let handler = async (m, { conn, command }) => {
  try {
    let res = await fetch('https://corporatebs-generator.sameerkumar.website/');
    if (!res.ok) throw 'Errore nel recupero della frase aziendale.';

    let data = await res.json();
    let frase = data.phrase;

    // Phishy risponde in modo arrogante
    let messaggio = `💼 *Phishy dice:* "${frase}"\n\nCapito? È *growth mindset*, babbeo.`;

    conn.reply(m.chat, messaggio, m);
  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '🛑 Phishy ha fatto un burnout, riprova più tardi.', m);
  }
};

handler.command = ['business', 'corporate', 'manager'];
handler.tags = ['phishy'];
handler.help = ['business'];
handler.register = true;

export default handler;
