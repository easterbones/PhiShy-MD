const inventory = {
  others: {},
  items: {
    vita: true,
    pozione_minore: true,
    pozione_maggiore: true,
    pozione_definitiva: true,
    macchina: true,
    forcina: true,
    moto: true,
    canna: true,
    bici: true,
  },
  tools: {
    armor: {
      '0': '❌',
      '1': 'Armatura di Pelle',
      '2': 'Armatura di Ferro',
      '3': 'Armatura d’Oro',
      '4': 'Armatura di Diamante',
      '5': 'Armatura di Smeraldo',
      '6': 'Armatura di Cristallo',
      '7': 'Armatura di Ossidiana',
      '8': 'Armatura di Netherite',
      '9': 'Armatura del Wither',
      '10': 'Armatura del Drago',
      '11': 'Armatura Hacker'
    },
    sword: {
      '0': '❌',
      '1': 'Spada di Legno',
      '2': 'Spada di Pietra',
      '3': 'Spada di Ferro',
      '4': 'Spada d’Oro',
      '5': 'Spada di Rame',
      '6': 'Spada di Diamante',
      '7': 'Spada di Smeraldo',
      '8': 'Spada di Ossidiana',
      '9': 'Spada di Netherite',
      '10': 'Spada Samurai Verde',
      '11': 'Spada Hacker'
    },
    pickaxe: {
      '0': '❌',
      '1': 'Piccone di Legno',
      '2': 'Piccone di Pietra',
      '3': 'Piccone di Ferro',
      '4': 'Piccone d’Oro',
      '5': 'Piccone di Rame',
      '6': 'Piccone di Diamante',
      '7': 'Piccone di Smeraldo',
      '8': 'Piccone di Cristallo',
      '9': 'Piccone di Ossidiana',
      '10': 'Piccone di Netherite',
      '11': 'Piccone Hacker'
    },
    fishingrod: true,
  },
  crates: {
    common: true,
    uncommon: true,
    mythic: true,
    legendary: true,
    pet: true,
  },
  pets: {
    horse: 10,
    cat: 10,
    fox: 10,
    dog: 10,
  },
};

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];

  // Strumenti
  const tools = Object.keys(inventory.tools)
    .map(v => user[v] && `*${global.rpg.emoticon(v)} :* ${typeof inventory.tools[v] === 'object' ? inventory.tools[v][user[v]?.toString()] : `Livello/i ${user[v]}`}`)
    .filter(v => v).join('\n').trim();

  // Oggetti
  const items = Object.keys(inventory.items)
    .map(v => user[v] && `*${global.rpg.emoticon(v)} :* ${user[v]}`)
    .filter(v => v).join('\n').trim();

  // Casse
  const crates = Object.keys(inventory.crates)
    .map(v => user[v] && `*${global.rpg.emoticon(v)} :* ${user[v]}`)
    .filter(v => v).join('\n').trim();

  // Animali
  const pets = Object.keys(inventory.pets)
    .map(v => user[v] && `*${global.rpg.emoticon(v)} :* ${user[v] >= inventory.pets[v] ? 'Livello Massimo' : `Livello/i ${user[v]}`}`)
    .filter(v => v).join('\n').trim();

  // Azioni (Stock Market)
  const stocks = user.stocks ? Object.entries(user.stocks)
    .map(([name, quantity]) => quantity > 0 ? `*${name}:* ${quantity} azioni` : null)
    .filter(v => v)
    .join('\n') : '';

  // Altri (health, limit, exp)
  const others = Object.keys(inventory.others)
    .map(v => user[v] && `*${global.rpg.emoticon(v)} :* ${user[v]}`)
    .filter(v => v).join('\n').trim();

  // Messaggio finale
  const caption = `·:*¨༺ ♱✮♱ *¨༺ ♱✮♱ ༻¨*:·
 
 *Inventario di ${conn.getName(m.sender)}:*
> Novità: scrivi .profilo per vedere stats come vita e soldi
══════ •⊰✧⊱• ══════
${others ? `➤ *💼 Statistiche*
${others}\n════════════════` : ''}${tools ?`

➤ *⚔️ Strumenti*
${tools}\n════════════════` : ''}${items ?`

➤ *🎒 Oggetti*
${items}\n

➤ *🐾 Animali*
${pets}` : ''}${stocks ? `

➤ *📈 Stock Market in possesso*
${stocks}` : ''}
`.trim();

  m.reply(caption);
};

handler.help = ['inventory', 'inv'];
handler.tags = ['rpg'];
handler.command = /^(inv(entory)?|inventario|bal(ance)?|e?xp)$/i;

export default handler;
