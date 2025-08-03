import fs from 'fs'

const xpLog = {}  // Per tenere traccia del vecchio XP utente

let handler = async (m, { conn, participants, plugins }) => {
  if (!m.isGroup) return

  let user = global.db.data.users[m.sender]
  if (!user) return

  let previousXP = xpLog[m.sender] || user.exp

  // Delay per dare tempo ad altri plugin di modificare l'XP
  setTimeout(() => {
    let newXP = global.db.data.users[m.sender].exp
    let diff = newXP - previousXP

    if (diff < -1000) {
      let stack = new Error().stack.split('\n')
      let cause = stack.find(line => line.includes('.js'))

      conn.reply(m.chat, `⚠️ Rilevata perdita XP sospetta: ${diff} punti\nPlugin sospetto: ${cause || 'Non identificato'}`, m)
    }

    xpLog[m.sender] = newXP
  }, 3000) // attende 3 secondi
}

handler.all = true
handler.priority = 0  // Altissima priorità, così è sempre eseguito per primo

export default handler
