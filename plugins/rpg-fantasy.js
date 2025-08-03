// Codice realizzato da: https://github.com/GataNina-Li

import fetch from 'node-fetch'
import fs from 'fs'
const fantasyDBPath = './fantasy.json'
let jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
let id_message, pp, dato, fake, user, stato, idUtenteEsistente, nomeImmagine, fantasyDB, response, data, userId, voto, emojiSalvata = null
const likeEmojisArrays = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿']
const dislikeEmojisArrays = ['👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿']
const superlikeEmojisArrays = ['🩷', '❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎']

let handler = async (m, { command, usedPrefix, conn }) => {
let user = global.db.data.users[m.sender]
// let time = user.fantasy + 300000 //5 min
// if (new Date - user.fantasy < 300000) return await conn.reply(m.chat, `⏱️ Torna tra ${msToTime(time - new Date())}, NON FARE SPAM`, m)
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let fkontak = {
  "key": {
    "participants":"0@s.whatsapp.net",
    "remoteJid": "status@broadcast",
    "fromMe": false,
    "id": "Halo"
  },
  "message": {
    "contactMessage": {
      "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Cellulare\nEND:VCARD`
    }
  },
  "participant": "0@s.whatsapp.net"
}
try {
response = await fetch(jsonURL)
data = await response.json()

if (data.infoImg && data.infoImg.length > 0) {
dato = data.infoImg[Math.floor(Math.random() * data.infoImg.length)]
pp = await conn.profilePictureUrl(who, 'image').catch((_) => dato.url)

fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
  const data = fs.readFileSync(fantasyDBPath, 'utf8')
  fantasyDB = JSON.parse(data)
}
stato = 'Libero'
const codiceAttuale = dato.code
const utenteEsistente = fantasyDB.find(user => {
  const id = Object.keys(user)[0]
  const fantasy = user[id].fantasy
  return fantasy.some(personaggio => personaggio.id === codiceAttuale)
})

if (utenteEsistente) {
  idUtenteEsistente = Object.keys(utenteEsistente)[0]
  nomeImmagine = data.infoImg.find(p => p.code === codiceAttuale)?.name
  if (nomeImmagine) {
    stato = `Venduto\n✓ *Comprato da: ${conn.getName(idUtenteEsistente)}*`
  }
}

const personaggio = dato.name
let votiPersonaggio = []
for (const utenteObj of fantasyDB) {
  const utente = Object.values(utenteObj)[0]
  const flow = utente.flow || []
  const voti = flow.filter(v => v.character_name === personaggio)
  votiPersonaggio.push(...voti)
}

const likes = votiPersonaggio.filter(v => v.like).length || 0
const superlikes = votiPersonaggio.filter(v => v.superlike).length || 0
const dislikes = votiPersonaggio.filter(v => v.dislike).length || 0
const incremento_like = Math.floor(likes / 1)
const incremento_superlike = Math.floor(superlikes / 1)
const decremento_dislike = Math.floor(dislikes / 1)
const aumento_like = (likes >= 50) ? incremento_like * 0.01 : incremento_like * 0.02
const aumento_superlike = (superlikes >= 50) ? incremento_superlike * 0.03 : incremento_superlike * 0.05
const riduzione_dislike = decremento_dislike * 0.01

global.nuovoPrezzo = dato.price + (dato.price * aumento_like) + (dato.price * aumento_superlike) - (dato.price * riduzione_dislike)
nuovoPrezzo = Math.round(nuovoPrezzo)
if (nuovoPrezzo < 50) {
  nuovoPrezzo = 50
}

let txtNuovoPrezzo = nuovoPrezzo !== dato.price
  ? `\n✓ *Prezzo precedente:* ~\`${dato.price}\`~ *${rpgshop.emoticon('money')}*\n✓ *Nuovo Prezzo:* \`${nuovoPrezzo}\` *${rpgshop.emoticon('money')}*\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*`
  : `\n✓ *Prezzo:* \`\`\`${dato.price}\`\`\` *${rpgshop.emoticon('money')}*`

let info = `*⛱️ FANTASIA RPG ⛱️*\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*\n✓ *Nome:* ${dato.name}\n✓ *Origine:* ${dato.desp}\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*${txtNuovoPrezzo}\n✓ *Classe:* ${dato.class}\n✓ *ID:* \`\`\`${codiceAttuale}\`\`\`\n✓ *Tipo:* ${dato.type}\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*\n✓ *Stato:* ${stato}`
info += `\n\n${stato === 'Libero' ? '_Rispondi a questo messaggio con "c", "🛒", o "🐱" per comprarlo_\n\n' + listaAvisos(usedPrefix, personaggio) : listaAvisos(usedPrefix, personaggio)}`
id_message = (await conn.sendFile(m.chat, dato.url, 'error.jpg', info.trim(), fkontak, true, {
  contextInfo: {
    'forwardingScore': 200,
    'isForwarded': false,
    externalAdReply: {
      showAdAttribution: false,
      title: `${conn.getName(m.sender)}`,
      body: `${dato.desp}`,
      mediaType: 1,
      sourceUrl: "",
      thumbnailUrl: "https://i.ibb.co/SDmvw1hZ/Screenshot-2025-06-21-002946.png"
    }
  }
}, { caption: 'immagine_info' })).key.id

} else {
  console.log('Nessuna immagine trovata.')
  conn.sendMessage(m.chat, 'Errore nel recuperare o processare i dati.', { quoted: m })
}} catch (error) {
  console.log(error)
}

handler.before = async (m) => {
user = global.db.data.users[m.sender]
if (m.quoted && m.quoted.id === id_message && likeEmojisArrays.concat(dislikeEmojisArrays, superlikeEmojisArrays).includes(m.text)) {
fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
  const data = fs.readFileSync(fantasyDBPath, 'utf8')
  fantasyDB = JSON.parse(data)
}

const emoji = m.text
userId = m.sender
const utenteEsistente = fantasyDB.find(user => Object.keys(user)[0] === userId)

if (utenteEsistente) {
  const idUtenteEsistente = Object.keys(utenteEsistente)[0]
  const nomePersonaggio = dato.name

  if (nomePersonaggio) {
    const flow = utenteEsistente[idUtenteEsistente].flow || []
    const votoPresente = flow.find(v => v && v.character_name === nomePersonaggio && v[emoji.toLowerCase()])

    if (votoPresente && votoPresente[emoji.toLowerCase()] && votoPresente[emoji.toLowerCase()] !== m.text) {
      // niente
    } else {
      const emojiPrima = flow.find(v => v && v.character_name === nomePersonaggio && (v.like || v.dislike || v.superlike))
      const flowAggiornato = [
        ...(flow || []).filter(v => v.character_name !== nomePersonaggio),
        {
          character_name: nomePersonaggio,
          like: likeEmojisArrays.includes(emoji),
          dislike: dislikeEmojisArrays.includes(emoji),
          superlike: superlikeEmojisArrays.includes(emoji),
          emoji: emoji,
        }
      ]
      utenteEsistente[idUtenteEsistente].flow = flowAggiornato
      if (!utenteEsistente[idUtenteEsistente].fantasy) {
        utenteEsistente[idUtenteEsistente].fantasy = [
          {
            id: false,
            status: false,
          }
        ]
      }
      fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')
      emojiSalvata = emojiPrima?.emoji
      const cambioMessaggio = `Hai deciso di cambiare la tua valutazione precedente...`
    }
  }
}
}
}
}
handler.command = /^(fantasy|fy)$/i
export default handler

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds

return minutes + " m y " + seconds + " s " 
}  

export function listaAvisos(usedPrefix, personaje) {
const avisos = [
`> 🤩 ¡Agrega un personaje ahora! usando *${usedPrefix}fyagregar* o *${usedPrefix}fyadd*`,
`> 👀 *¿Qué tal ${personaje}?* ¡Califica!\n_Responde a este mensaje con:_\n*"${likeEmojisArrays.getRandom()}", "${dislikeEmojisArrays.getRandom()}", o "${superlikeEmojisArrays.getRandom()}"*\n\n> ⚠️ *Solo puede calificar si ha comprado mínimo un Personaje*`,
`> *¿Sabías que puedes cambiar un Personaje por tiempo premium 🎟️?*\n_¡Inténtalo! usa *${usedPrefix}fycambiar* o *${usedPrefix}fychange*_`,
`> ¡Para ser un Pro 😎 en *RPG Fantasy* visita la guía 📜!\n*Comienza a explorar usando:*\n\`${usedPrefix}fyguia o ${usedPrefix}fyguide\``,
`> *Conoce más de ${personaje} usando:*\n\`${usedPrefix}fyinfo\``,
`> *¿Quieres saber la lista de personajes 🤭?*\n*Consulta usando:* \`${usedPrefix}fylista o ${usedPrefix}fyl\``,
`> 🛒 Compra, ${superlikeEmojisArrays.getRandom()} califica, 🔄 cambia  y mucho más para ganar *recompensas extras 🎁*`,
`> 🌟 *¡Mira quien es tendencia!*\n\`${usedPrefix}fytendencia o ${usedPrefix}fyranking\`\n\n👀 _Mira avances de otros respondiendo al mensaje de alguien con *${usedPrefix}fytendencia*_`,
`> *Te digo un secreto* 😳\n_Mientras más uses los comandos *RPG Fantasy*, las 🎁 Recomepesas futuras se multiplican ☝️🤑_`,
`> 🌟 *Mira avances, misiones, datos de lo que has conseguido usando:*\n\`${usedPrefix}fymy\``,
//`> *¡Recuerda responder a este mensaje con "c", "🛒", o "🐱" para comprar personajes!*`,
`> 😁 *¡Pensamos en todo!* Transfiere cualquier personaje a tú Amigo/a usando:\n*${usedPrefix}fyentregar*, *${usedPrefix}fytransfer* o *${usedPrefix}fytr*`,
`> ⚠️ *Alerta* ⚠️ Calificar a *${personaje}* puede hacer que el precio suba o baje 😱 !Califica con sabiduría! 😸`
].getRandom()
return avisos.trim()
}