const handler = async (m, { conn }) => {
  if (!m.isGroup) {
    await conn.reply(m.chat, 'Questo comando è disponibile solo nei gruppi.', m, rcanal);
    return;
  }

  const weapons = [
    'pistola ad acqua',
    'bazooka di marshmallow',
    'fucile laser',
    'banana esplosiva',
    'mitragliatrice di coriandoli',
    'lancia-patate',
    'spada di luce',
    'cannone di gelato',
    'guanto dell’infinito',
    'fionda di spaghetti',
    'trombetta rumorosa',
    'pistola a bolle',
    'lancia-unicorni',
    'fucile a pompa di arcobaleni',
    'pistola spara meme',
    'lancia-pizza',
    'martello di Thor giocattolo',
    'fucile a palline di ping pong',
    'lancia-cuscini',
    'fucile a popcorn',
  ];

  const situations = [
    'ma il colpo rimbalza su uno specchio e colpisce il mittente!',
    'il bersaglio si trasforma in un pollo e scappa via!',
    'arriva la polizia dei meme e arresta entrambi!',
    'il colpo apre un portale per un universo parallelo!',
    'il bersaglio si difende con uno scudo di emoji!',
    'il colpo si trasforma in una pioggia di dolci!',
    'il gruppo viene invaso da gattini ninja!',
    'il bersaglio diventa improvvisamente ricco!',
    'il colpo si trasforma in una dichiarazione d’amore!',
    'il bot si blocca per il troppo divertimento!',
    'il bersaglio riceve una pizza gratis!',
    'il colpo si trasforma in una pioggia di banane!',
    'il bersaglio diventa il nuovo admin del gruppo!',
    'il colpo viene intercettato da Chuck Norris!',
    'il gruppo viene teletrasportato su Marte!',
    'il bersaglio si trasforma in un meme virale!',
    'il colpo si trasforma in una canzone di Baby Shark!',
    'il bot si mette a ballare la Macarena!',
    'il bersaglio riceve un abbraccio virtuale!',
    'il colpo si trasforma in una pioggia di emoji!',
  ];

  const mentioned = m.mentionedJid && m.mentionedJid[0];
  if (!mentioned) {
    await conn.reply(m.chat, '❗ Devi taggare un utente da colpire! Esempio: .spara @utente', m, rcanal);
    return;
  }
  const weapon = weapons[Math.floor(Math.random() * weapons.length)];
  const situation = situations[Math.floor(Math.random() * situations.length)];
  const target = '@' + mentioned.split('@')[0];
  const text = `🔫 ${m.sender.split('@')[0]} spara a ${target} con una ${weapon}... ${situation}`;
  await conn.sendMessage(m.chat, { text, mentions: [mentioned, m.sender] }, { quoted: m }, { rcanal });
};

handler.help = ['sparatoria'];
handler.tags = ['fun'];
handler.command = ['sparatoria', 'spara'];
handler.group = true;

export default handler;
