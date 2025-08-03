import db from '../lib/database.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  let input = text.trim()
  if (!input) return m.reply(`📆 Scrivi una data per impostare il tuo compleanno!\n\nEsempi:\n${usedPrefix + command} 31/12/2000\n${usedPrefix + command} 31/12\n${usedPrefix + command} 31`)

  let parts = input.split('/')
  if (parts.length > 3 || parts.length < 1) return m.reply(`❌ Formato non valido.\n\nScrivi la data nel formato:\nGG/MM/AAAA o GG/MM o solo GG`)

  let [day, month, year] = parts
  if (!day || isNaN(day) || day < 1 || day > 31) return m.reply(`📛 Giorno non valido.`)
  if (month && (isNaN(month) || month < 1 || month > 12)) return m.reply(`📛 Mese non valido.`)
  if (year && (isNaN(year) || year.length !== 4)) return m.reply(`📛 Anno non valido.`)

  let birthday = [day.padStart(2, '0')]
  if (month) birthday.push(month.padStart(2, '0'))
  if (year) birthday.push(year)
  birthday = birthday.join('/')

  // Prima volta: gratis
  if (!user.birthday) {
    user.birthday = birthday
    return m.reply(`🎉 Compleanno salvato con successo come *${birthday}*!\nIl primo utilizzo è gratis.`)
  }

  // Modifica: costa 1000 dolci
  if (user.limit < 1000) return m.reply(`🍬 Ti servono 1000 dolci per cambiare la data di compleanno!\nHai solo *${user.limit}*.`)

  user.limit -= 1000
  user.birthday = birthday
  return m.reply(`🎂 Compleanno aggiornato con successo in *${birthday}*!\nHai pagato 1000 dolci.`)
}

handler.help = ['compleanno'].map(v => v + ' <GG/MM/AAAA>')
handler.tags = ['user']
handler.command = ['compleanno']
handler.register = true

export default handler
