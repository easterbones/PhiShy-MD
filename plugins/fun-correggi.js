// Definizioni costanti FUORI dalla funzione handler
const erroriComuni = {
  'puo': 'può',
  'perche': 'perché',
  'xche': 'perché',
  'xke': 'perché',
  'pk': 'perché',
  'cmq': 'comunque',
  'nn': 'non',
  'x': 'per',
  'ke': 'che',
  'ki': 'chi',
  'qst': 'questo',
  'qll': 'quello',
  'tt': 'tutto',
  'sn': 'sono',
  'c6': 'ci sei',
  'ce': 'c\'è',
  'se': 'c\'è',
  'qualè': 'qual è',
  'qalè': 'qual è',
  'propio': 'proprio',
  'sopratutto': 'soprattutto',
  'sopratuto': 'soprattutto',
  'daccordo': 'd\'accordo',
  'dacordo': 'd\'accordo',
  'all\'ora': 'allora',
  'apposto': 'a posto',
  'apostto': 'a posto',
  'centra': 'c\'entra',
  'scenza': 'scienza',
  'efficacie': 'efficace',
  'accellerare': 'accelerare',
  'un\'altro': 'un altro',
  'unaltro': 'un altro',
  'à': 'ha',
  'fà': 'fa',
  'stà': 'sta',
  'và': 'va',
  'dà': 'da',
  'sà': 'sa',
  'andar': 'andare',
  'far': 'fare',
  'tvb': 'ti voglio bene',
  'bsx': 'baci',
  'thx': 'grazie',
  'pls': 'per favore',
  'msg': 'messaggio',
  'wats': 'WhatsApp',
  'a me mi': 'mi',
  'metereologia': 'meteorologia',
  'areoporto': 'aeroporto',
  'pscicologo': 'psicologo'
};

const frasiComuni = {
  '': /``/gi
};

const risposteSarcastiche = [
  'Madonna che italiano... Corretto:',
  'Non ti vergogni a scrivere così? Ecco come si fa:',
  'Hai appena fatto piangere Dante. Rimedio:',
  'Il tuo italiano è un insulto alla patria. Prova così:',
  'Che schifo di grammatica. Ti aiuto giusto per pietà:'
];

const paroleSbagliate = [
  ...Object.keys(erroriComuni),
  'qualè', 'qual\'è', 'apposto', 'daccordo', 'dacordo',
  'centra', 'sopratutto', 'sopratuto', 'propio'
];

// Handler principale
let handler = async (m, { conn }) => {
  if (!m.text) return;
  if (m.fromMe || m.isBaileys) return;

  try {
    const testo = m.text.toLowerCase();
    let correzioni = [];

    // Cerca errori singoli
    for (const [sbagliato, corretto] of Object.entries(erroriComuni)) {
      const regex = new RegExp(`\\b${sbagliato}\\b`, 'gi');
      if (regex.test(testo)) {
        correzioni.push(corretto);
      }
    }

    // Cerca frasi comuni
    for (const [corretto, regex] of Object.entries(frasiComuni)) {
      if (regex.test(testo)) {
        correzioni.push(corretto);
      }
    }

    if (correzioni.length > 0 && Math.random() < 0.6) {
      const risposta = risposteSarcastiche[Math.floor(Math.random() * risposteSarcastiche.length)];
      const correzioniUniche = [...new Set(correzioni)];
      
      if (correzioniUniche.length === 1) {
        await conn.reply(m.chat, `${risposta}\n\n📝 *${correzioniUniche[0]}*`, m);
      } else {
        const listaCorrezioni = correzioniUniche.map(c => `• ${c}`).join('\n');
        await conn.reply(m.chat, `${risposta}\n\n📝 Correzioni:\n${listaCorrezioni}`, m);
      }
    }
  } catch (e) {
    console.error('[Correttore italiano errore]', e);
  }
};

// Configurazione handler
handler.prefix = new RegExp(
  `\\b(${paroleSbagliate.join('|')})\\b`,
  'i'
);

handler.command = new RegExp(
  `^(${paroleSbagliate.join('|')})$`, 
  'i'
);

export default handler;