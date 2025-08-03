import util from 'util'
import path from 'path'

async function handler(m, { groupMetadata, command, conn, text, usedPrefix }) {
  let user = a => '@' + a.split('@')[0]
  if (!text) throw `💀 Scrivi qualcosa idiota.\n\nEsempio: *${usedPrefix + command} chi mi paga da bere?*`

  let partecipanti = groupMetadata.participants.map(v => v.id)
  let vincitore = partecipanti.getRandom()
  let soundIndex = Math.floor(Math.random() * 70)
  let audioURL = `https://hansxd.nasihosting.com/sound/sound${soundIndex}.mp3`

  let messaggio = `*\`[ 🎉 CHE SCHIFO DI FORTUNA 🎉 ]\`*\n\n${user(vincitore)} ha vinto sto schifo di sorteggio 😒\nNon so se ridere o piangere, ma congratulazioni (credo).`

  let output = ''
  let contatore = 0

  for (const carattere of messaggio) {
    await new Promise(resolve => setTimeout(resolve, 15))
    output += carattere
    contatore++

    if (contatore % 10 === 0) {
      conn.sendPresenceUpdate('composing', m.chat)
    }
  }

  await conn.sendMessage(m.chat, {
    text: output.trim(),
    mentions: conn.parseMention(output)
  }, {
    quoted: m,
    ephemeralExpiration: 24 * 60 * 100,
    disappearingMessagesInChat: 24 * 60 * 100
  })
}

handler.help = ['sorteo']
handler.command = ['sorteggio']
handler.tags = ['giochi']
handler.group = true

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
