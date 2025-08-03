import fs from 'fs'
import path from 'path'

// Definizione delle case disponibili
const CASE = [
  {
    key: 'monolocale',
    nome: 'Monolocale',
    prezzo: 500,
    affitto: 100,
    intervallo: 3 * 24 * 60 * 60 * 1000, // 3 giorni
    vantaggi: 'Protezione base dai furti',
    svantaggi: 'Nessun bonus extra',
    thumb: 'https://th.bing.com/th/id/OIP.bT04673UsqHMTgp7f431AwHaEK'
  },
  {
    key: 'villa',
    nome: 'Villa',
    prezzo: 3000,
    affitto: 600,
    intervallo: 7 * 24 * 60 * 60 * 1000, // 7 giorni
    vantaggi: 'Protezione avanzata, +5% XP',
    svantaggi: 'Affitto alto',
    thumb: 'https://th.bing.com/th/id/OIP.jNfI0NiLykDB78Lp1WA53AAAAA'
  },
  {
    key: 'castello',
    nome: 'Castello',
    prezzo: 10000,
    affitto: 2000,
    intervallo: 14 * 24 * 60 * 60 * 1000, // 14 giorni
    vantaggi: 'Protezione massima, +10% XP, +10% guadagni',
    svantaggi: 'Affitto molto alto',
    thumb: 'https://th.bing.com/th/id/OIP.PYwMW2KlbAIkyuLo8Fe61gHaDt?r=0&cb=thvnextc1&rs=1&pid=ImgDetMain&o=7&rm=3'
  }
]

// Utility per trovare la casa per key
function getCasaByKey(key) {
  return CASE.find(c => c.key === key)
}

// Utility per trovare la casa posseduta (compatibilità vecchio DB)
function getCasaPosseduta(user) {
  for (const c of CASE) {
    if (user[c.key]) return c.key
  }
  return null
}

// Utility per formattare tempo rimanente
function formatTime(ms) {
  if (!ms || ms <= 0) return 'scaduto'
  const giorni = Math.floor(ms / (24*60*60*1000))
  const ore = Math.floor((ms % (24*60*60*1000)) / (60*60*1000))
  return `${giorni}g ${ore}h`
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  // --- Compatibilità: se user.casa non esiste, ma ha una casa come flag, crea user.casa ---
  if (!user.casa) {
    const casaKey = getCasaPosseduta(user)
    if (casaKey) {
      // Se non esiste user.casa ma ha il flag, crea user.casa con dati base
      const casaObj = getCasaByKey(casaKey)
      user.casa = {
        stato: 'fuori',
        tipo: casaKey,
        nextRent: Date.now() + casaObj.intervallo,
        lastPaid: Date.now()
      }
    } else {
      user.casa = { stato: 'fuori', tipo: null, nextRent: null, lastPaid: null }
    }
  }

  // --- Sincronizza flag casa posseduta con user.casa.tipo ---
  for (const c of CASE) {
    if (user.casa.tipo === c.key) user[c.key] = 1
    else if (user[c.key]) delete user[c.key]
  }

  const stato = user.casa.stato
  const subcommand = args[0]

  // --- Mostra stato casa e info ---
  if (!subcommand) {
    let caption = ''
    if (!user.casa || !user.casa.tipo) {
      caption = `Non hai ancora una casa!\n\nPer acquistare una casa usa:\n${usedPrefix}compra monolocale\n${usedPrefix}compra villa\n${usedPrefix}compra castello`;
      return await conn.reply(m.chat, caption, m)
    }
    const casa = getCasaByKey(user.casa.tipo)
    const thumb = casa.thumb
    const titolo = stato === 'dentro' ? `🏡 Sei dentro la tua ${casa.nome}` : `🚷 Sei fuori casa (${casa.nome})`
    const corpo = `🏠 *Casa attuale: ${casa.nome}*\n` +
      `Affitto: ${casa.affitto} 🍬 ogni ${Math.floor(casa.intervallo/(24*60*60*1000))} giorni\n` +
      `Vantaggi: ${casa.vantaggi}\nSvantaggi: ${casa.svantaggi}\n` +
      `Stato: ${stato}\n` +
      `Prossimo affitto: ${user.casa.nextRent ? formatTime(user.casa.nextRent - Date.now()) : 'da pagare'}\n` +
      `\nComandi rapidi:\n` +
      `- ${usedPrefix}casa entra\n` +
      `- ${usedPrefix}casa esci\n` +
      `- ${usedPrefix}casa shop\n` +
      `- ${usedPrefix}casa paga\n` +
      `- ${usedPrefix}vendi casa`;
    return await inviaCasaPreview(corpo, thumb, titolo, corpo)
  }

  // --- SHOP CASE ---
  if (subcommand === 'shop') {
    let text = '*🏠 CASE DISPONIBILI:*\n'
    for (const casa of CASE) {
      text += `\n🏡 *${casa.nome}*\n` +
        `Prezzo: ${casa.prezzo} 🍬\n` +
        `Affitto: ${casa.affitto} 🍬 ogni ${Math.floor(casa.intervallo/(24*60*60*1000))} giorni\n` +
        `Vantaggi: ${casa.vantaggi}\n` +
        `Svantaggi: ${casa.svantaggi}\n` +
        `Comando acquisto: ${usedPrefix}compra ${casa.key}\n` +
        `Comando vendita: ${usedPrefix}vendi casa\n`;
    }
    return await conn.reply(m.chat, text, m)
  }

  // --- COMPRA CASA ---
  if (subcommand === 'compra') {
    return m.reply('Per acquistare una casa usa:\n' +
      `${usedPrefix}compra monolocale\n` +
      `${usedPrefix}compra villa\n` +
      `${usedPrefix}compra castello\n` +
      'Per vendere la casa usa:\n' +
      `${usedPrefix}vendi casa`)
  }

  // --- ENTRA/ESCI CASA ---
  if (subcommand === 'entra') {
    if (!user.casa.tipo) return m.reply('Non hai una casa!')
    if (stato === 'dentro') return m.reply('❗ Sei già dentro casa!')
    user.casa.stato = 'dentro'
    // Sincronizza flag
    for (const c of CASE) {
      if (user.casa.tipo === c.key) user[c.key] = 1
      else if (user[c.key]) delete user[c.key]
    }
    return inviaCasaPreview(
      '🔑 Hai **aperto la porta** e sei **entrato in casa**. Benvenuto! 🛋️',
      getCasaByKey(user.casa.tipo).thumb,
      '🚪 Sei entrato!',
      'Ora sei al sicuro in casa tua 🏠'
    )
  }
  if (subcommand === 'esci') {
    if (!user.casa.tipo) return m.reply('Non hai una casa!')
    if (stato === 'fuori') return m.reply('❗ Sei già fuori casa!')
    user.casa.stato = 'fuori'
    // Sincronizza flag
    for (const c of CASE) {
      if (user.casa.tipo === c.key) user[c.key] = 1
      else if (user[c.key]) delete user[c.key]
    }
    return inviaCasaPreview(
      '🚶‍♂️ Hai **chiuso la porta** e sei uscito. Buona fortuna là fuori! 🌍',
      getCasaByKey(user.casa.tipo).thumb,
      '🏃‍♂️ Sei uscito!',
      'Le avventure ti aspettano là fuori...'
    )
  }

  // --- PAGA AFFITTO ---
  if (subcommand === 'paga') {
    if (!user.casa.tipo) return m.reply('Non hai una casa!')
    const casa = getCasaByKey(user.casa.tipo)
    if (!user.casa.nextRent || Date.now() > user.casa.nextRent) {
      if (user.limit < casa.affitto) {
        // Se non puoi pagare perdi la casa
        // Rimuovi anche i flag
        for (const c of CASE) {
          if (user[c.key]) delete user[c.key]
        }
        user.casa = { stato: 'fuori', tipo: null, nextRent: null, lastPaid: null }
        let resultText = `❌ Non hai abbastanza caramelle per pagare l'affitto! Hai perso la casa.`
        return await conn.sendMessage(m.chat, {
            text: resultText,
            contextInfo: {
                isforwarded: true,
                forwardedNewsletterMessageInfo: {
                newsletterJid: "120363401234816773@newsletter",
                serverMessageId: 100,
                newsletterName: 'canale dei meme 🎌',
                },
                externalAdReply: {
                    title: `Affitto non pagato`,
                    body: `Hai perso la casa!`,
                    thumbnailUrl: "https://i.kinja-img.com/gawker-media/image/upload/c_fit,f_auto,g_center,q_60,w_645/1c3c94c82d5b0b67f4bfc5528d17d8de.jpg",
                    mediaType: 1,
                    sourceUrl: ''
                }
            }
        }, { quoted: m })
      }
      user.limit -= casa.affitto
      user.casa.nextRent = Date.now() + casa.intervallo
      user.casa.lastPaid = Date.now()
      // Sincronizza flag
      for (const c of CASE) {
        if (user.casa.tipo === c.key) user[c.key] = 1
        else if (user[c.key]) delete user[c.key]
      }
      let resultText = `✅ Affitto pagato! Prossimo pagamento tra ${Math.floor(casa.intervallo/(24*60*60*1000))} giorni.`
      return await conn.sendMessage(m.chat, {
        text: resultText,
        contextInfo: {
          isforwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363401234816773@newsletter",
            serverMessageId: 100,
            newsletterName: 'canale dei meme 🎌',
          },
          externalAdReply: {
            title: `Affitto pagato`,
            body: `Casa: ${casa.nome}`,
            thumbnailUrl: "https://i.kinja-img.com/gawker-media/image/upload/c_fit,f_auto,g_center,q_60,w_645/1c3c94c82d5b0b67f4bfc5528d17d8de.jpg",
            mediaType: 1,
            sourceUrl: ''
          }
        }
      }, { quoted: m })
    } else {
      let resultText = '⏳ Non è ancora il momento di pagare l\'affitto!'
      return await conn.sendMessage(m.chat, {
        text: resultText,
        contextInfo: {
          isforwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363401234816773@newsletter",
            serverMessageId: 100,
            newsletterName: 'canale dei meme 🎌',
          },
          externalAdReply: {
            title: `Affitto non ancora dovuto`,
            body: `Riprova più tardi!`,
            thumbnailUrl: "https://i.kinja-img.com/gawker-media/image/upload/c_fit,f_auto,g_center,q_60,w_645/1c3c94c82d5b0b67f4bfc5528d17d8de.jpg",
            mediaType: 1,
            sourceUrl: ''
          }
        }
      }, { quoted: m })
    }
  }

  // --- VENDI CASA ---
  if (subcommand === 'vendi') {
    if (!user.casa || !user.casa.tipo) {
      return m.reply('❌ Non possiedi nessuna casa da vendere!')
    }
    const casaVenduta = getCasaByKey(user.casa.tipo)
    if (!casaVenduta) {
      return m.reply('❌ Errore: tipo casa non valido.')
    }
    // Prezzo di vendita: 60% del prezzo di acquisto
    const sellPrice = Math.floor(casaVenduta.prezzo * 0.6)
    user.limit = (user.limit || 0) + sellPrice
    user.casa = { stato: 'fuori', tipo: null, nextRent: null, lastPaid: null }
    for (const c of CASE) { if (user[c.key]) delete user[c.key] }
    let msg = `🏚️ *Casa venduta!*

` +
      `┣ *Tipo:* ${casaVenduta.nome}
` +
      `┣ *Prezzo vendita:* ${sellPrice} 🍬
` +
      `┗ *Nuovo saldo:* ${user.limit} 🍬`
    await conn.sendMessage(m.chat, {
      text: msg,
      contextInfo: {
        isforwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363401234816773@newsletter",
          serverMessageId: 100,
          newsletterName: 'canale dei meme 🎌',
        },
        externalAdReply: {
          title: '🏚️ CASA VENDUTA',
          body: `Hai venduto la tua casa!`,
          thumbnailUrl: casaVenduta.thumb,
          mediaType: 1,
          sourceUrl: ''
        }
      }
    }, { quoted: m })
    return
  }

  // --- COMANDO SCONOSCIUTO ---
  m.reply(`❓ Uso corretto:\n> ${usedPrefix}casa\n> ${usedPrefix}casa entra\n> ${usedPrefix}casa esci\n> ${usedPrefix}casa shop\n> ${usedPrefix}casa compra <tipo>\n> ${usedPrefix}casa paga`)

  // --- funzione anteprima ---
  async function inviaCasaPreview(caption, thumb, title = '🏡 Casa', body = 'Info casa personale') {
    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363401234816773@newsletter",
          serverMessageId: 100,
          newsletterName: '𝘣𝘰𝘵 𝘶𝘱𝘥𝘢𝘵𝘦𝘴 🎌'
        },
        externalAdReply: {
          title,
          body,
          mediaType: 1,
          thumbnailUrl: thumb,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
  }
}

handler.command = ['casa']
export default handler
