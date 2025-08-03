let handler = async (m, { conn, command, text, usedPrefix, participants }) => {
  let target;
  
  // Determina il target (menzione o risposta)
  if (text) {
    target = text.toUpperCase();
  } else if (m.quoted && m.quoted.sender) {
    target = "@" + m.quoted.sender.split("@")[0];
  } else {
    return conn.reply(m.chat, `Per favore, menziona qualcuno o rispondi a un messaggio. Esempio: ${usedPrefix + command} @utente`, m);
  }

  // ID dell'owner e del bot
  const ownerId = "393534409026@s.whatsapp.net"; // Sostituisci con l'ID reale dell'owner
  const botId = conn.user.jid; // ID del bot

  // Estrai solo la parte numerica dell'ID (prima di @)
  const targetId = target.replace("@", ""); // Rimuove il simbolo @ dal target
  const ownerIdNum = ownerId.split("@")[0]; // Estrae solo la parte numerica dell'owner
  const botIdNum = botId.split("@")[0]; // Estrae solo la parte numerica del bot

  // Controlla se il target è l'owner o il bot
  if (targetId === ownerIdNum) {
    return conn.reply(m.chat, "[ ⚠ ] 𝐄𝐑𝐑𝐎𝐑𝐄\nNon puoi usare questo comando sull'owner del bot! 😠", m, rcanal);
  }
  if (targetId === botIdNum) {
    return conn.reply(m.chat, "[ ⚠ ] 𝐄𝐑𝐑𝐎𝐑𝐄\nNon puoi usare questo comando su di me! 😤", m, rcanal);
  }

  const percentage = Math.floor(Math.random() * 100); // Percentuale casuale
  const getRandomMessage = (messages) => messages[Math.floor(Math.random() * messages.length)]; // Funzione per messaggi casuali

  let response;
  switch (command.toLowerCase()) {
    case 'pajero':
    case 'pajera':
      response = `
${target} è un* ${command.toUpperCase()} al ${percentage}%! 😏
${getRandomMessage([
  "Passa più tempo con il suo 'amico' che con le persone reali!",
  "Ha una relazione seria con il suo cuscino.",
  "Probabilmente ha bisogno di un abbonamento a un sito... specifico.",
  "Si allena più con la mano che in palestra!",
])}
      `;
      break;

    case 'gay':
      response = `
${target} è ${percentage}% GAY! 🌈
${getRandomMessage([
  "Sei così gay che l'arcobaleno è geloso di te!",
  "Hai più stile di una sfilata di moda LGBTQ+!",
  "Sei più gay di una borsetta piena di glitter!",
  "Freddie Mercury sarebbe fiero di te!",
])}
      `;
      break;

    case 'lesbica':
      response = `
${target} è ${percentage}% LESBICA! 💖
${getRandomMessage([
  "Sei così lesbica che persino Ellen DeGeneres ti invidia!",
  "Hai più fascino di un film romantico tra donne!",
  "Sei la ragione per cui il Pride esiste!",
  "Sei più lesbica di un flannel shirt!",
])}
      `;
      break;

    case 'puttana':
    case 'puto':
      response = `
${target} è 🔞 ${command.toUpperCase()} al ${percentage}%! 💃
${getRandomMessage([
  "Sei così puttana che persino i gigolò ti chiedono consigli!",
  "Hai più clienti di un negozio in saldo!",
  "Sei la ragione per cui il karma esiste!",
  "Sei più puttan* di una soap opera!",
])}
      `;
      break;

    case 'coglione':
    case 'cogliona':
      response = `
${target} è ${command.toUpperCase()} al ${percentage}%! 🤡
${getRandomMessage([
  "Sei così stupido che persino i clown ti prendono in giro!",
  "Hai più fallimenti di un progetto scolastico!",
  "Sei la ragione per cui i genitori dicono 'studia, figliolo'!",
  "Sei più manc* di una partita di calcio senza gol!",
])}
      `;
      break;

    case 'feccia':
      response = `
${target} è ${percentage}% feccia! 🐀
${getRandomMessage([
  "Sei così ratto che persino i topi ti rispettano!",
  "Hai più debiti di uno studente universitario!",
  "Sei la ragione per cui le serrature esistono!",
  "Sei più rat* di un negozio di pegni!",
])}
      `;
      break;

    case 'troia':
    case 'troio':
      response = `
${target} è un* ${command.toUpperCase()} al ${percentage}%! 💋
${getRandomMessage([
  "Sei così professionist* che persino i gigolò ti chiedono consigli!",
  "Hai più clienti di un negozio in saldo!",
  "Sei la ragione per cui il karma esiste!",
  "Sei più professionist* di una soap opera!",
])}
      `;
      break;

    default:
      response = "Comando non riconosciuto. Prova con uno dei comandi disponibili!";
      break;
  }

  // Funzione di caricamento
  async function loading() {
    const loadingMessages = [
      "《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
      "《 ████▒▒▒▒▒▒▒▒》30%",
      "《 ███████▒▒▒▒▒》50%",
      "《 ██████████▒▒》80%",
      "《 ████████████》100%"
    ];

    let { key } = await conn.sendMessage(m.chat, { text: `📊 Calcolo in corso...`, mentions: conn.parseMention(response) }, { quoted: m });
    for (let message of loadingMessages) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Attesa di 1 secondo
      await conn.sendMessage(m.chat, { text: message, edit: key, mentions: conn.parseMention(response) }, { quoted: m });
    }
    await conn.sendMessage(m.chat, { text: response, edit: key, mentions: conn.parseMention(response) }, { quoted: m });
  }

  loading();
};

handler.help = ['gay', 'lesbica', 'pajero', 'pajera', 'puto', 'puttana', 'coglione', 'cogliona', 'feccia', 'troia', 'troio'].map(v => v + ' @tag | nome');
handler.tags = ['fun'];
handler.command = /^(gay|lesbica|pajero|pajera|puto|puttana|coglione|cogliona|feccia|troia|troio)$/i;
export default handler;