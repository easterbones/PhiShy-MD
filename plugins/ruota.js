let handler = async (m, { conn, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) return m.reply("Utente non trovato nel database.")

  // Controllo uova
  if (!user.uova || user.uova < 1) {
    return m.reply(`🥚 Non hai nemmeno un uovo per far girare la ruota, povero sfigato!`)
  }

  // Toglie un uovo
  user.uova -= 1

  const premi = [
    { tipo: 'limit', min: 10, max: 5000 },
    { tipo: 'credito', min: 10, max: 300 },
    { tipo: 'joincount', min: 1, max: 10 },
    { tipo: 'cane', min: 1, max: 1 },
    { tipo: 'gatto', min: 1, max: 1 },
    { tipo: 'coniglio', min: 1, max: 1 },
    { tipo: 'drago', min: 1, max: 1 },
    { tipo: 'cavallo', min: 1, max: 1 },  
    { tipo: 'riccio', min: 1, max: 1 },
    { tipo: 'pesce', min: 1, max: 1 },
    { tipo: 'serpente', min: 1, max: 1 },
    { tipo: 'piccione', min: 1, max: 1 },  
    { tipo: 'vita', min: 1, max: 3 },
    { tipo: 'pozioneminore', min: 1, max: 5 },
    { tipo: 'pozionemaggiore', min: 1, max: 3 },
    { tipo: 'pozionedefinitiva', min: 1, max: 1 },
    { tipo: 'macchina', min: 1, max: 1 },
    { tipo: 'moto', min: 1, max: 1 },
    { tipo: 'bici', min: 1, max: 1 },
    { tipo: 'canna', min: 1, max: 1 },
    { tipo: 'forcina', min: 1, max: 1 },
    { tipo: 'exp', min: 300, max: 4000 },
    { tipo: 'bacini', min: 1, max: 30 },
      
  ]


// Funzione di caricamento migliorata
async function loading() {
    const loadingMessages = [
        "《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
        "《 ████▒▒▒▒▒▒▒▒》30%",
        "《 ███████▒▒▒▒▒》50%",
        "《 ██████████▒▒》80%",
        "《 ████████████》100%"
    ];

    let loadingMsg = await conn.sendMessage(m.chat, { text: `⏳ *Caricamento...*\n《 █▒▒▒▒▒▒▒▒▒▒▒》0%`, mentions: [m.sender] }, { quoted: m });
    for (let message of loadingMessages) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attesa di 1 secondo
        await conn.sendMessage(m.chat, {
            text: message,
            mentions: [m.sender],
            edit: loadingMsg.key
        });
    }
}

await loading();

// Logica originale per il premio
let premio = premi[Math.floor(Math.random() * premi.length)];
let quantità = Math.floor(Math.random() * (premio.max - premio.min + 1)) + premio.min;

// Premi animali booleani: cane, gatto, coniglio, drago, cavallo, macchina, moto, bici
const animaliBooleani = ['cane','gatto','coniglio','drago','cavallo','macchina','moto','bici'];
// Premi animali numerici: riccio, pesce, serpente, piccione
const animaliNumerici = ['riccio','pesce','serpente','piccione'];

if (animaliBooleani.includes(premio.tipo)) {
  user[premio.tipo] = true;
  quantità = 1;
} else if (animaliNumerici.includes(premio.tipo)) {
  if (!user[premio.tipo]) user[premio.tipo] = 0;
  user[premio.tipo] += quantità;
} else {
  if (!user[premio.tipo]) user[premio.tipo] = 0;
  user[premio.tipo] += quantità;
}

// Messaggio finale migliorato con reazione emoji
await conn.sendMessage(m.chat, {
    text: `🎉 *Complimenti, campione della fortuna!* 🎉\n\n` +
          `🏆 *Hai ricevuto:* \n` +
          `┣ ${quantità} × *${premio.tipo}*\n` +
          `┗ hai ancora ${user.uova} uova rimanenti! 🥚`,
    mentions: [m.sender], 
    quoted: m,
    react: {
        text: "🎁",
        key: m.key
    }
});

global.db.write();

  if (global.ruotaInUso) {
    await m.reply("⏳ La ruota è attualmente in uso da un altro utente. Attendi il tuo turno!");
    return;
  }

  global.ruotaInUso = true;

  try {
  } finally {
    global.ruotaInUso = false;
  }
}

handler.help = ['ruota', 'box']
handler.tags = ['gioco']
handler.command = ['ruota', 'box']
handler.group = false

export default handler;