import db from '../lib/database.js'
import { createHash } from 'crypto'
import fs from 'fs'
import fetch from 'node-fetch'

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  
  if (!text) return m.reply(`❌ Inserisci il nuovo nome\nEsempio: *${usedPrefix + command} Mario*`)
  if (text.length >= 100) return m.reply('❌ Nome troppo lungo (max 100 caratteri)')
  
  // Se l'utente non è registrato
  if (!user.registered) {
    user.registered = true
    user.limit = 200 // Bonus di benvenuto
    user.regTime = + new Date
  }

  let oldName = user.name || 'Nessun nome precedente'
  user.name = text.trim()

  let txt = `📝 *NOME MODIFICATO*\n\n`
      txt += `Vecchio nome: ${oldName}\n`
      txt += `Nuovo nome: ${user.name}\n\n`
      txt += `✅ Modifica avvenuta con successo!`

  await conn.sendMessage(m.chat, { 
    text: txt,
    contextInfo: {
      externalAdReply: {
        title: 'Aggiornamento Profilo',
        body: conn.getName(m.sender),
        thumbnail: await (await fetch('https://ams3.digitaloceanspaces.com/sempionenews/2018/03/cicciogamer89.jpg')).buffer(),
        mediaType: 1
      }
    }
  })
  
  await m.react('🔄')
}

handler.help = ['nome <nuovo_nome>']
handler.tags = ['profile']
handler.command = ['nome', 'cambianome', 'setname', 'impostanome'] 
export default handler