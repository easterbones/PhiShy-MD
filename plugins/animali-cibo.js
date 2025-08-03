let handler = async (m, { conn, args }) => {
  let who = m.sender  
  let user = global.db.data.users[who]

  // Lista completa animali disponibili
  const animaliDisponibili = [
    "cane", "gatto", "coniglio", "drago", 
    "scoiattolo", "piccione", "serpente", 
    "cavallo", "pesce", "riccio"
  ]

  // Controlla se l'utente ha specificato un animale
  if (!args[0]) {
    return conn.sendMessage(m.chat, { 
      text: `🚫 Devi specificare un animale! Usa: .cibo [${animaliDisponibili.join("/")}]` 
    }, { quoted: m })
  }

  let animale = args[0].toLowerCase()

  // Controlla se l'animale è valido
  if (!animaliDisponibili.includes(animale)) {
    return conn.sendMessage(m.chat, { 
      text: `🚫 Animale non valido! Scegli tra: ${animaliDisponibili.join(", ")}.` 
    }, { quoted: m })
  }
  
  // Controlla se l'utente possiede l'animale
  if (!user[animale]) {
    return conn.sendMessage(m.chat, { 
      text: `🚫 Non hai un ${animale}! Comprane uno nel negozio.` 
    }, { quoted: m })
  }

  // Animazioni complete per tutti gli animali
  const animazioni = {
    cane: [
      "🐶   🍖", "🐶  🍖", "🐶 🍖", 
      "🐶🍖", "🐶🤤", "🐶😋", "🐶❤️"
    ],
    gatto: [
      "🐱   🥛", "🐱  🥛", "🐱 🥛", 
      "🐱🥛", "🐱😺", "🐱😋", "🐱❤️"
    ],
    coniglio: [
      "🐇   🥕", "🐇  🥕", "🐇 🥕", 
      "🐇🥕", "🐇🤤", "🐇😋", "🐇❤️"
    ],
    drago: [
      "🐉   🔥", "🐉  🔥", "🐉 🔥", 
      "🐉🔥", "🐉🤤", "🐉😋", "🐉❤️"
    ],
    scoiattolo: [
      "🐿️   🌰", "🐿️  🌰", "🐿️ 🌰", 
      "🐿️🌰", "🐿️🤤", "🐿️😋", "🐿️❤️"
    ],
    piccione: [
      "🕊️   🍞", "🕊️  🍞", "🕊️ 🍞", 
      "🕊️🍞", "🕊️🤤", "🕊️😋", "🕊️❤️"
    ],
    serpente: [
      "🐍   🥚", "🐍  🥚", "🐍 🥚", 
      "🐍🥚", "🐍🤤", "🐍😋", "🐍❤️"
    ],
    cavallo: [
      "🐎   🍎", "🐎  🍎", "🐎 🍎", 
      "🐎🍎", "🐎🤤", "🐎😋", "🐎❤️"
    ],
    pesce: [
      "🐟   🦐", "🐟  🦐", "🐟 🦐", 
      "🐟🦐", "🐟🤤", "🐟😋", "🐟❤️"
    ],
    riccio: [
      "🦔   🐛", "🦔  🐛", "🦔 🐛", 
      "🦔🐛", "🦔🤤", "🦔😋", "🦔❤️"
    ]
  }

  // Seleziona i frame dell'animazione
  let frames = animazioni[animale] || animazioni.cane // Fallback al cane se manca l'animazione

  // Invia il primo messaggio
  let { key } = await conn.sendMessage(m.chat, { 
    text: `🍽️ Il tuo ${animale} sta per mangiare...\n${frames[0]}` 
  }, { quoted: m })

  // Esegue l'animazione
  for (let frame of frames) {
    await new Promise(res => setTimeout(res, 500)) // 500ms tra i frame
    await conn.sendMessage(m.chat, { 
      text: `🍽️ Il tuo ${animale} sta mangiando...\n${frame}`, 
      edit: key 
    })
  }

  // Messaggio finale
  await new Promise(res => setTimeout(res, 500))
  return conn.sendMessage(m.chat, { 
    text: `🎉 Il tuo ${animale} ha finito di mangiare ed è sazio! ${animale === 'drago' ? '🔥' : '🥰'}`,
    edit: key 
  })
}

handler.command = ['cibo', 'feed']
handler.tags = ['animali']
handler.help = [
  'cibo <animale> - Dai da mangiare al tuo animale domestico',
  'feed <animale> - Alias per cibo'
]
handler.register = true

export default handler