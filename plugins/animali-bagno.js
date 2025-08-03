let handler = async (m, { conn, args }) => {
  let who = m.sender  
  let user = global.db.data.users[who]

  // Lista animali disponibili
  const animaliDisponibili = ["cane", "gatto", "coniglio", "drago", "scoiattolo", "piccione", "serpente", "cavallo", "pesce", "riccio"]

  // Controlla se l'utente ha specificato un animale
  if (!args[0]) {
    return conn.sendMessage(m.chat, { 
      text: `🚫 Devi specificare un animale! Usa: .bagno [${animaliDisponibili.join("/")}]` 
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

  // Animazioni per tutti gli animali
  const animazioni = {
    cane:       ["🛁", "🛁     🐶", "🛁   🐶 ", "🛁 🐶", "🛁🐶", "\n  🐶  ", " 🧼\n  🐶  ", "🧼\n  🐶  ", "  🧼\n  🐶  ", "🧼\n  🐶  ", "   🧼\n  🐶  ", "🧼\n  🐶  ", "🐶 ", "🐶🚿", "🐶🚿", "🐶❤️"],
    gatto:      ["🛁", "🛁     😺", "🛁   😺 ", "🛁 😺", "🛁😺", "\n  😺  ", " 🧼\n  😺  ", "🧼\n  😺  ", "  🧼\n  😺  ", "🧼\n  😺  ", "   🧼\n  😺  ", "🧼\n  😺  ", "😺 ", "😺🚿", "😺🚿", "😺❤️"],
    coniglio:   ["🛁", "🛁     🐇", "🛁   🐇 ", "🛁 🐇", "🛁🐇", "\n  🐇  ", " 🧼\n  🐇  ", "🧼\n  🐇  ", "  🧼\n  🐇  ", "🧼\n  🐇  ", "   🧼\n  🐇  ", "🧼\n  🐇  ", "🐇 ", "🐇🚿", "🐇🚿", "🐇❤️"],
    drago:      ["🛁", "🛁     🐉", "🛁   🐉 ", "🛁 🐉", "🛁🐉", "\n  🐉  ", " 🧼\n  🐉  ", "🧼\n  🐉  ", "  🧼\n  🐉  ", "🧼\n  🐉  ", "   🧼\n  🐉  ", "🧼\n  🐉  ", "🐉 ", "🐉🚿", "🐉🚿", "🐉❤️"],
    scoiattolo: ["🛁", "🛁     🐿️", "🛁   🐿️ ", "🛁 🐿️", "🛁🐿️", "\n  🐿️  ", " 🧼\n  🐿️  ", "🧼\n  🐿️  ", "  🧼\n  🐿️  ", "🧼\n  🐿️  ", "   🧼\n  🐿️  ", "🧼\n  🐿️  ", "🐿️ ", "🐿️🚿", "🐿️🚿", "🐿️❤️"],
    piccione:   ["🛁", "🛁     🕊️", "🛁   🕊️ ", "🛁 🕊️", "🛁🕊️", "\n  🕊️  ", " 🧼\n  🕊️  ", "🧼\n  🕊️  ", "  🧼\n  🕊️  ", "🧼\n  🕊️  ", "   🧼\n  🕊️  ", "🧼\n  🕊️  ", "🕊️ ", "🕊️🚿", "🕊️🚿", "🕊️❤️"],
    serpente:   ["🛁", "🛁     🐍", "🛁   🐍 ", "🛁 🐍", "🛁🐍", "\n  🐍  ", " 🧼\n  🐍  ", "🧼\n  🐍  ", "  🧼\n  🐍  ", "🧼\n  🐍  ", "   🧼\n  🐍  ", "🧼\n  🐍  ", "🐍 ", "🐍🚿", "🐍🚿", "🐍❤️"],
    cavallo:    ["🛁", "🛁     🐎", "🛁   🐎 ", "🛁 🐎", "🛁🐎", "\n  🐎  ", " 🧼\n  🐎  ", "🧼\n  🐎  ", "  🧼\n  🐎  ", "🧼\n  🐎  ", "   🧼\n  🐎  ", "🧼\n  🐎  ", "🐎 ", "🐎🚿", "🐎🚿", "🐎❤️"],
    pesce:      ["🛁", "🛁     🐟", "🛁   🐟 ", "🛁 🐟", "🛁🐟", "\n  🐟  ", " 🧼\n  🐟  ", "🧼\n  🐟  ", "  🧼\n  🐟  ", "🧼\n  🐟  ", "   🧼\n  🐟  ", "🧼\n  🐟  ", "🐟 ", "🐟🚿", "🐟🚿", "🐟❤️"],
    riccio:     ["🛁", "🛁     🦔", "🛁   🦔 ", "🛁 🦔", "🛁🦔", "\n  🦔  ", " 🧼\n  🦔  ", "🧼\n  🦔  ", "  🧼\n  🦔  ", "🧼\n  🦔  ", "   🧼\n  🦔  ", "🧼\n  🦔  ", "🦔 ", "🦔🚿", "🦔🚿", "🦔❤️"]
  }

  let frames = animazioni[animale] || animazioni.cane // Fallback a cane se manca l'animazione
  // Recupera nome personalizzato se presente
  let nomeAnimale = animale;
  if (user && typeof user[animale] === 'object' && Array.isArray(user[animale]?.nomi) && user[animale].nomi.length > 0) {
    nomeAnimale = user[animale].nomi[0];
  }

  // Invia il primo messaggio
  let { key } = await conn.sendMessage(m.chat, { 
    text: `Stai per fare il bagno al tuo ${animale}\n${frames[0]}` 
  }, { quoted: m })

  // Esegue l'animazione
  for (let frame of frames) {
    await new Promise(res => setTimeout(res, 400))
    await conn.sendMessage(m.chat, { 
      text: `Stai per fare il bagno al tuo ${animale}\n${frame}`, 
      edit: key 
    })
  }

  // Messaggio finale
  await new Promise(res => setTimeout(res, 400))
  return conn.sendMessage(m.chat, { 
    text: `🧽 Il tuo ${animale} ha finito il bagnetto ed ora è felice! 🥰`, 
    edit: key 
  })
}

handler.command = ['bagno']
handler.tags = ['animali']
handler.help = ['bagno <animale> - Fa il bagnetto al tuo animale domestico']
handler.register = true

export default handler