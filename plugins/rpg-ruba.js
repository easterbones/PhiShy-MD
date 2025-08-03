import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

function cambia(num) {
  return String(num).replace(/\d/g, d => `${d}\u034F`); // U+034F
}

// Percorsi delle immagini
const thumbnailsPath = './src/img/ruba/'
const thumbnails = {
  success: fs.readFileSync(path.join(thumbnailsPath, 'success.png')),
  caught: fs.readFileSync(path.join(thumbnailsPath, 'caught.png')),
  partial: fs.readFileSync(path.join(thumbnailsPath, 'partial.png')),
  bigSteal: fs.readFileSync(path.join(thumbnailsPath, 'bigSteal.png')),
  stealth: fs.readFileSync(path.join(thumbnailsPath, 'stealth.png')),
  easterEgg: fs.readFileSync(path.join(thumbnailsPath, 'easterEgg.jpg'))
}

let cooldowns = {}
const EASTER_EGG_CHANCE = 0.6;

const MESSAGGI_UOVA = {
  successo: [
    "🪄 Easter ti osservava e ti ha regalato un uovo magico!",
    "🌸 Dal cielo è caduto un uovo con dentro... un dolcetto?!",
    "🐰 Easter ti vuole bene, e ti ha lasciato un regalino.",
    "🎁 Sorpresa! Hai trovato un uovo nascosto tra le caramelle.",
    "💫 Un portale si è aperto... e puff! Un uovo per te."
  ],
  fallimento: [
    "🙅‍♂️ Easter ti ha visto e ha detto 'non oggi'.",
    "👻 Un uovo stava per apparire, ma è scappato via.",
    "🚫 Easter ti ha ignorato... meglio la prossima volta.",
    "🫥 Niente uovo per te, il karma non era dalla tua parte.",
    "😔 L'uovo era lì... e poi puff, sparito."
  ]
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  const groupMetadata = await conn.groupMetadata(m.chat)
  const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + "@s.whatsapp.net"
  const botOwner = global.owner[0] + "@s.whatsapp.net"
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)
  let user = users[senderId]

  if (!user.health) user.health = 100
  if (!user.uova) user.uova = 0

  // --- CASA: blocca se il ladro è dentro casa (compatibilità con tutte le tipologie) ---
  if (user.casa && user.casa.stato === 'dentro') {
    return conn.reply(m.chat, '🚪 Non puoi rubare mentre sei dentro casa! Esci prima con *!casa esci*.', m)
  }

  let tempoAttesa = 5 * 60
  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tempoAttesa * 1000) {
    let tempoRimanente = secondiAHMS(Math.ceil((cooldowns[senderId] + tempoAttesa * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `⚠️ Devi aspettare ${tempoRimanente} prima di rubare ancora.`, m, rcanal)
  }

  let senderLimit = user.limit || 0
  let senderHealth = user.health || 100

  let mentionedUser = m.mentionedJid && m.mentionedJid[0]
  let repliedUser = m.quoted && m.quoted.sender
  let targetUserId = mentionedUser || repliedUser

  if (!targetUserId) return m.reply('❗ Devi menzionare un utente o rispondere a un messaggio per rubare caramelle.')

  // --- CASA: blocca se la vittima è dentro casa (compatibilità con tutte le tipologie) ---
  let targetUser = users[targetUserId]
  let targetInCasa = false
  if (targetUser && targetUser.casa && targetUser.casa.tipo && targetUser.casa.stato === 'dentro') {
    targetInCasa = true
  }
  // Rimuovi/ignora i vecchi flag legacy!
  // if (!targetInCasa && targetUser) {
  //   if (targetUser.monolocale || targetUser.villa || targetUser.castello) {
  //     targetInCasa = true
  //   }
  // }
  let bypassCasa = false
  if (targetInCasa && (user.level || 0) >= 50) {
    bypassCasa = true
  }
  if (targetInCasa && !bypassCasa) {
    return conn.reply(m.chat, `🚪 L'utente è protetto perché è dentro casa! Solo ladri di livello 50+ possono rubare chi è in casa.`, m)
  }

  // --- CONTROLLO SCUDO: calcola se scaduto usando la scadenza nel database meno l'ora attuale ---
  if (users[targetUserId]?.scudoScadenza) {
    // Calcola ora attuale in Italia
    const nowRome = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
    const expiry = new Date(users[targetUserId].scudoScadenza);
    const diffMs = expiry - nowRome;
    if (diffMs > 0) {
      const tempoFormattato = millisecondiAHMS(diffMs);
      const fkontak = contattoFake(m);
      await conn.sendMessage(m.chat, {
        text: `🛡️ ${senderName}, il tentativo di furto è fallito! @${targetUserId.split("@")[0]} è protetto da uno scudo ancora per ${tempoFormattato}.`,
        contextInfo: { mentionedJid: [targetUserId] }
      }, { quoted: fkontak });
      return;
    }
  }

  cooldowns[senderId] = Date.now()

  let targetUserLimit = users[targetUserId]?.limit || 0
  let targetUserHealth = users[targetUserId]?.health || 100

  let minAmount, maxAmount
  if (targetUserLimit > 1000) {
    minAmount = 50
    maxAmount = 200
  } else if (targetUserLimit >= 100) {
    minAmount = 15
    maxAmount = 50
  } else {
    minAmount = 5
    maxAmount = 15
  }

  let amountTaken = Math.min(Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount, targetUserLimit)
  let healthDamage = Math.floor(Math.random() * 19) + 2

  // Easter Egg Bonus
  let easterEggFound = Math.random() < EASTER_EGG_CHANCE
  let easterEggMessage = ''
  if (easterEggFound) {
    user.uova += 1
    let frase = pickRandom(MESSAGGI_UOVA.successo)
    easterEggMessage = `\n\n🐣 *${frase}*\nHai ora ${user.uova} uova nel tuo inventario!`
  } else {
    let frase = pickRandom(MESSAGGI_UOVA.fallimento)
    easterEggMessage = `\n\n😶 *${frase}*`
  }

  let randomOption = Math.floor(Math.random() * (bypassCasa ? 8 : 5))
  let messageText = ''
  let thumbnailCase = thumbnails.success
  let caseTitle = "Furto Riuscito!"
  let caseBody = ""

  switch (randomOption) {
    case 0:
      user.limit += amountTaken
      users[targetUserId].limit -= amountTaken
      users[targetUserId].health = Math.max(targetUserHealth - healthDamage, 0)
      messageText = `✅ ${senderName} Hai rubato con successo a @${targetUserId.split("@")[0]} e gli hai inflitto una anche una bella testata nel mentre.\n\nDolci rubati:*${cambia(amountTaken)} 🍭\ndanni causati: *${healthDamage} 💔*\n${easterEggMessage}`
      thumbnailCase = thumbnails.success
      caseTitle = "Furto Riuscito!"
      caseBody = `Hai rubato ${amountTaken} caramelle`
      break
    case 1:
      let amountSubtracted = Math.min(Math.floor(Math.random() * (senderLimit - minAmount + 1)) + minAmount, senderLimit)
      user.limit -= amountSubtracted
      user.health -= healthDamage
      messageText = `❌ ${senderName} Sei stato catturato! e hai perso delle caramelle. La pula ti ha anche picchiato.\n\n dolci sottratti: *${cambia(amountSubtracted)} 🍬*\n danni subiti: *${healthDamage} 💔*\n${easterEggMessage}`
      thumbnailCase = thumbnails.caught
      caseTitle = "Sei stato Catturato!"
      caseBody = `Hai perso ${amountSubtracted} caramelle`
      break
    case 2:
      let smallAmountTaken = Math.min(Math.floor(Math.random() * (targetUserLimit / 2 - minAmount + 1)) + minAmount, targetUserLimit)
      user.limit += smallAmountTaken
      users[targetUserId].limit -= smallAmountTaken
      users[targetUserId].health -= healthDamage
      messageText = `⚠️🏃 ${senderName} Ti hanno individuato e hai rubato *poche 🍬 Caramelle* da @${targetUserId.split("@")[0]}.\n sei anche riuscito a fargli del danno emotivo.\ndolci rubati: *${cambia(smallAmountTaken)} 🍬*\ndanni causati: *${healthDamage} 💔*${easterEggMessage}`
      thumbnailCase = thumbnails.partial
      caseTitle = "Furto Parziale!"
      caseBody = `Hai rubato ${smallAmountTaken} caramelle`
      break
    case 3:
      let megaAmount = Math.min(Math.floor(Math.random() * (maxAmount * 2 - minAmount + 1)) + minAmount, targetUserLimit)
      let autoDanno = healthDamage + Math.floor(Math.random() * 10)
      user.limit += megaAmount
      users[targetUserId].limit -= megaAmount
      user.health -= autoDanno
      messageText = `💥 ${senderName} Hai rubato un BOTTO di *🍭 Caramelle* da @${targetUserId.split("@")[0]}, ma sei inciampato e ti sei fatto male alla testa.\n\n*\dolci rubati: *${cambia(megaAmount)} 🍭*\n danni subiti: *${autoDanno} 💥*${easterEggMessage}`
      thumbnailCase = thumbnails.bigSteal
      caseTitle = "Colpo Grosso!"
      caseBody = `Hai rubato ${megaAmount} caramelle`
      break
    case 4:
      let furtino = Math.min(Math.floor(Math.random() * 5) + 1, targetUserLimit)
      user.limit += furtino
      users[targetUserId].limit -= furtino
      messageText = `🫣 ${senderName} Hai rubato in silenzio delle *🍬 Caramelle* da @${targetUserId.split("@")[0]}... Nessuno se n'è accorto!\n\ndolci rubati: *${cambia(furtino)} 🍬*\n ${easterEggMessage}`
      thumbnailCase = thumbnails.stealth
      caseTitle = "Furto Silenzioso!"
      caseBody = `Hai rubato ${furtino} caramelle`
      break
    // --- Nuovi casi speciali per ladro livello 50+ che ruba in casa ---
    case 5:
      // Il ladro viene scoperto e scappa senza nulla
      messageText = `🚨 ${senderName} hai provato a entrare in casa di @${targetUserId.split("@")[0]}, ma l'allarme è scattato! Sei dovuto scappare a mani vuote.`
      thumbnailCase = thumbnails.caught
      caseTitle = "Allarme!"
      caseBody = `Fuga a mani vuote`
      break
    case 6:
      // Il ladro trova la porta blindata e non riesce ad aprire
      messageText = `🔒 ${senderName} hai trovato una porta blindata a casa di @${targetUserId.split("@")[0]} e non sei riuscito a entrare. Riprova più tardi!`
      thumbnailCase = thumbnails.caught
      caseTitle = "Porta Blindata!"
      caseBody = `Furto fallito`
      break
    case 7:
      // Il ladro trova una cassaforte piena di dolci (bonus extra)
      let jackpot = Math.min(Math.floor(Math.random() * 300) + 100, targetUserLimit)
      user.limit += jackpot
      users[targetUserId].limit -= jackpot
      messageText = `💰 ${senderName} hai trovato la cassaforte segreta di @${targetUserId.split("@")[0]}!\nHai rubato un bottino di *${cambia(jackpot)} 🍬*\n${easterEggMessage}`
      thumbnailCase = thumbnails.bigSteal
      caseTitle = "Colpo nella Cassaforte!"
      caseBody = `Hai rubato ${jackpot} caramelle`
      break
  }

  const fkontak = contattoFake(m)
  await conn.sendMessage(m.chat, {
    text: messageText,
    contextInfo: { mentionedJid: [targetUserId] }
  }, { quoted: fkontak })
}
handler.tags = ['rpg']
handler.help = ['crimen']
handler.command = ['ruba', 'crimine', 'runa', 'rubq']
handler.group = true

export default handler

function secondiAHMS(secondi) {
  const ore = Math.floor(secondi / 3600)
  const minuti = Math.floor((secondi % 3600) / 60)
  const sec = secondi % 60
  return [ore, minuti, sec]
    .map(v => v.toString().padStart(2, '0'))
    .join(':')
}



function millisecondiAHMS(millisecondi) {
  const secondi = Math.floor(millisecondi / 1000)
  const minuti = Math.floor(secondi / 60)
  const ore = Math.floor(minuti / 60)
  
  const secondiRimanenti = secondi % 60
  const minutiRimanenti = minuti % 60
  
  
  if (ore > 0) {
    return `${ore} ore, ${minutiRimanenti} minuti e ${secondiRimanenti} secondi`
  } else if (minuti > 0) {
    return `${minutiRimanenti} minuti e ${secondiRimanenti} secondi`
  } else {
    return `${secondiRimanenti} secondi`
  }
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function contattoFake(m) {
  return {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Ruba"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:Crimine\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Cellulare\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }
}
