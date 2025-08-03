let handler = async (m, { conn, usedPrefix }) => {
  let who = m.sender  
  let user = global.db.data.users[who]

  // Controlla se l'utente ha un pet
  if (!user.pet) {
    return conn.sendMessage(m.chat, { text: "🚫 Non hai un pet! Compra uno nel negozio." }, { quoted: m })
  }

  // Menu dei comandi disponibili per il pet
  let txt = `╭─⬣「 *Menu pet* 」⬣\n`
  txt += `  ≡◦ *🦴 .cibo* - Dai da mangiare al tuo pet\n`
  txt += `  ≡◦ *🎾 .gioca* - Gioca con il tuo pet\n`
  txt += `  ≡◦ *🚶‍♂️ .passeggiata* - Porta il pet a spasso\n`
  txt += `  ≡◦ *🛁 .bagno* - Fai il bagno al pet\n`
  txt += `╰─⬣`

  conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

// ...existing code...
// Quando mostri i nomi degli animali, usa il nome personalizzato se presente
// Esempio:
// const user = global.db.data.users[m.sender];
// let nomeCane = user && typeof user.cane === 'object' && Array.isArray(user.cane?.nomi) && user.cane.nomi.length > 0 ? user.cane.nomi[0] : 'Cane';
// ...
handler.command = ['animali', 'pet', 'cane', 'gatto', 'coniglio', 'drago']
handler.register = true

export default handler
