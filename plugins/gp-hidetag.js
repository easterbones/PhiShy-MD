import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  try {
    // Verifica iniziale
    if (!global.db.data?.users?.[m.sender]) {
      return m.reply('❌ Errore nel recupero del profilo utente.')
    }

    const user = global.db.data.users[m.sender]

    // Inizializza valori se mancanti
    user.joincount = Number(user.joincount) || 0
    user.hidetag_limit = Number(user.hidetag_limit) || 0
    user.hidetag_day = String(user.hidetag_day) || ''

    const isPrivileged = isAdmin || isOwner
    const cost = isPrivileged ? 0 : 1
    const today = new Date().toLocaleDateString('it-IT')

    // Controlli per utenti non privilegiati
    if (!isPrivileged) {
      // Reset giornaliero
      if (user.hidetag_day !== today) {
        user.hidetag_day = today
        user.hidetag_limit = 0
      }

      // Controllo limite giornaliero
      if (user.hidetag_limit >= 3) {
        return m.reply('⛔ Hai raggiunto il limite giornaliero (3 utilizzi al giorno)')
      }

      // Controllo crediti
      if (user.joincount < cost) {
        const messageText = `💳 Ti serve ${cost} credito! (Attuali: ${user.joincount})\nScrivi *#compra gettoni* per acquistarne`
        const thumbnailUrl = 'https://tse1.explicit.bing.net/th/id/OIP.Q2NSiMvY9g7jp24sb1UvxQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
        
        await conn.sendMessage(m.chat, {
          text: messageText,
          contextInfo: {
            externalAdReply: {
              title: "⚠️ Attenzione",
              body: "Crediti insufficienti",
              thumbnailUrl: thumbnailUrl,
              mediaType: 1,
              renderLargerThumbnail: true,
              showAdAttribution: false
            }
          }
        })
        return
      }
    }

    // Preparazione menzioni
    let users = []
    try {
      users = participants
        .filter(p => p?.id)
        .map(p => conn.decodeJid(p.id))
        .filter(jid => jid && typeof jid === 'string' && jid.endsWith('@s.whatsapp.net'))
    } catch (e) {
      return m.reply('❌ Errore nel processare la lista partecipanti')
    }

    // Invio messaggio
    try {
      const quoted = m.quoted || m
      const caption = text || quoted?.text || ''
      
      await conn.sendMessage(m.chat, { 
        text: caption, 
        mentions: users 
      }, { quoted: m })

      // Aggiornamento crediti se utente normale
      if (!isPrivileged) {
        user.joincount -= cost
        user.hidetag_limit += 1
      }

    } catch (e) {
      return m.reply('❌ Errore durante l\'invio del messaggio')
    }

  } catch (error) {
    return m.reply('⚠️ Si è verificato un errore imprevisto')
  }
}

handler.command = /^(hidetag|notificar|menziona)$/i
handler.group = true
handler.botAdmin = true
handler.priority = 0  // Altissima priorità, così è sempre eseguito per primo

export default handler