const handler = async (m, {conn, text, command, usedPrefix, args}) => {
// let pp = 'https://www.bighero6challenge.com/images/thumbs/Piedra,-papel-o-tijera-0003318_1584.jpeg'
  const pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg';

  // 60000 = 1 minuto // 30000 = 30 secondi // 15000 = 15 secondi // 10000 = 10 secondi
  const time = global.db.data.users[m.sender].wait + 10000;
  if (new Date - global.db.data.users[m.sender].wait < 10000) throw `*🕓 Devi aspettare ${Math.floor((time - new Date()) / 1000)} secondi prima di poter giocare di nuovo*`;

  if (!args[0]) return conn.reply(m.chat, `*Sasso 🗿, Carta 📄 o Forbici ✂️*

*—◉ Puoi usare questi comandi:*
*◉ ${usedPrefix + command} sasso*
*◉ ${usedPrefix + command} carta*
*◉ ${usedPrefix + command} forbici*`, m);

  // Sinonimi e normalizzazione input
  const synonyms = {
    sasso: ['sasso', 'pietra', 'rock'],
    carta: ['carta', 'paper', 'foglio'],
    forbici: ['forbici', 'forbice', 'scissors']
  };
  function normalize(input) {
    input = input.toLowerCase();
    for (const key in synonyms) {
      if (synonyms[key].includes(input)) return key;
    }
    return null;
  }
  const userChoice = normalize(args[0]);
  if (!userChoice) return m.reply('Scelta non valida! Usa: sasso, carta o forbici.');

  // Scelta random bot
  const choices = ['sasso', 'carta', 'forbici'];
  const astro = choices[Math.floor(Math.random() * 3)];

  // Regole del gioco
  const rules = {
    sasso: 'forbici',
    carta: 'sasso',
    forbici: 'carta'
  };

  // Risposte casuali
  const winMsgs = [
    'Hai vinto! 🎉',
    'Grande! Vittoria tua!',
    'Complimenti, hai battuto il bot!',
    'Sei stato più furbo del bot!',
    'Bravo! Questa volta hai vinto tu!'
  ];
  const loseMsgs = [
    'Hai perso! ❌',
    'Peccato, il bot ha vinto!',
    'Ritenta, sarai più fortunato!',
    'Il bot ti ha battuto questa volta!',
    'Sconfitta... ma puoi rifarti!'
  ];
  const drawMsgs = [
    'Pareggio!',
    'Siete pari!',
    'Nessun vincitore stavolta!',
    'Avete scelto la stessa cosa!',
    'Equilibrio perfetto!'
  ];

  // Statistiche base
  const user = global.db.data.users[m.sender];
  if (!user.cfs_win) user.cfs_win = 0;
  if (!user.cfs_lose) user.cfs_lose = 0;
  if (!user.cfs_draw) user.cfs_draw = 0;

  let resultMsg = '';
  if (userChoice === astro) {
    user.exp += 500;
    user.cfs_draw++;
    resultMsg = `*🔰 ${drawMsgs[Math.floor(Math.random()*drawMsgs.length)]}*\n\n*👉🏻 Tu: ${userChoice}*\n*👉🏻 Il Bot: ${astro}*\n*🎁 Premio +500 XP*`;
  } else if (rules[userChoice] === astro) {
    user.exp += 1000;
    user.cfs_win++;
    resultMsg = `*🥳 ${winMsgs[Math.floor(Math.random()*winMsgs.length)]}*\n\n*👉🏻 Tu: ${userChoice}*\n*👉🏻 Il Bot: ${astro}*\n*🎁 Premio +1000 XP*`;
  } else {
    user.exp -= 300;
    user.cfs_lose++;
    resultMsg = `*☠️ ${loseMsgs[Math.floor(Math.random()*loseMsgs.length)]}*\n\n*👉🏻 Tu: ${userChoice}*\n*👉🏻 Il Bot: ${astro}*\n*❌ Penalità -300 XP*`;
  }
  m.reply(resultMsg);
  user.wait = new Date * 1;

  // Mostra statistiche rapide dopo ogni partita
  m.reply(`*Statistiche CFS:*
Vittorie: ${user.cfs_win}
Sconfitte: ${user.cfs_lose}
Pareggi: ${user.cfs_draw}`);
};
handler.help = ['ppt'];
handler.tags = ['games'];
handler.command = /^(cfs|moracinese)$/i;
export default handler;