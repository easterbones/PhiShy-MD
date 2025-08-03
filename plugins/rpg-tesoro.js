let handler = async (m, { conn }) => {
  const cooldownTime = 86400000; // 24 ore in millisecondi
  const user = global.db.data.users[m.sender];

  // Verifica se è passato abbastanza tempo dall'ultimo utilizzo
  if (user.lastcofre && (new Date() - user.lastcofre) < cooldownTime) {
    const tiempoRestante = msToTime(cooldownTime - (new Date() - user.lastcofre));
    return conn.reply(m.chat, `*⚠️ Devi aspettare ${tiempoRestante} prima di cercare un altro tesoro!*`, m, rcanal);
  }

  // Genera ricompense casuali
  let dolci = Math.floor(Math.random() * 1700);
  let tok = Math.floor(Math.random() * 1);
  let expp = Math.floor(Math.random() * 100000);

  // Aggiorna i dati dell'utente
  user.limit += dolci;
  user.joincount += tok;
  user.exp += expp;
  user.lastcofre = new Date(); // Imposta il timestamp dell'ultimo utilizzo

  // Messaggio di risposta
  let testo = `
╭━━🎉━🎉━🎉━━⬣
┃✨ 𝑶𝒕𝒕𝒊𝒆𝒏𝒊 𝒊𝒍 𝒕𝒖𝒐 TESSOROoo!!
┃ ┈┈┈┈┈┈┈┈┈┈┈┈┈
┃⚗️ *${tok} 𝑻𝒐𝒌𝒆𝒏* 🪙
┃⚗️ *${dolci} CARAMELEEE* 🍬
┃⚗️ *${expp} 𝑬𝒙𝒑* ⚡
╰━━〔 𓃠 *PHISHY* 〕━━⬣
  `;

  const fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  };

  // Invia il messaggio con l'anteprima
  await conn.sendMessage(m.chat, {
    text: testo,
    contextInfo: {
      externalAdReply: {
        title: "Tesoro Scoperto!",
        body: "Clicca per vedere il tesoro!",
        thumbnailUrl: "https://img.freepik.com/vector-gratis/cofre-monedas-oro-piedras-preciosas-cristales-trofeo_107791-7769.jpg?w=2000",
        sourceUrl: "https://img.freepik.com/vector-gratis/cofre-monedas-oro-piedras-preciosas-cristales-trofeo_107791-7769.jpg?w=2000"
      }
    }
  }, { quoted: fkontak });
};

handler.command = ['tesoro', 'cofre', 'apricoffre', 'coffreapri'];
handler.level = 30;
export default handler;

// Funzione per convertire millisecondi in ore e minuti
function msToTime(duration) {
  const hours = Math.floor((duration / (1000 * 60 * 60))) % 24;
  const minutes = Math.floor((duration / (1000 * 60))) % 60;
  return `${hours} Ore ${minutes} Minuti`;
}