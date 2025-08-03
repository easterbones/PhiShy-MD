import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

let handler = async (m, { conn, text, isAdmin }) => {
  try {
    // Verifica se l'utente è un admin
    if (!isAdmin) {
      return m.reply(m.chat, '❌ Errore: Solo gli amministratori possono usare questo comando!', m , rcanal)
    }

    // Ottieni l'ID dell'utente da processare
    const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
    
    // Percorso dell'immagine template locale
    const templatePath = './src/img/bonk.png'
    
    // Leggi il file immagine template
    let templateBuffer
    try {
      templateBuffer = await fs.readFile(templatePath)
      console.log('Template caricato, dimensione:', templateBuffer.length)
    } catch (e) {
      console.error('Errore lettura template:', e.message)
      return m.reply(`❌ Impossibile trovare o leggere l'immagine template. Verifica che il file ${templatePath} esista.`)
    }
    
    // Ottieni la foto profilo
    let ppUrl, avatarBuffer
    try {
      ppUrl = await conn.profilePictureUrl(who, 'image')
      const avatarResponse = await fetch(ppUrl)
      if (!avatarResponse.ok) throw new Error(`Errore HTTP: ${avatarResponse.status}`)
      
      const avatarArrayBuffer = await avatarResponse.arrayBuffer()
      avatarBuffer = Buffer.from(avatarArrayBuffer)
      console.log('Avatar scaricato, dimensione:', avatarBuffer.length)
    } catch (e) {
      console.error('Errore download avatar:', e.message)
      m.reply('⚠️ Impossibile ottenere la foto profilo dell\'utente. Verrà utilizzata un\'immagine predefinita.')
      // Usa un'immagine predefinita
      const defaultAvatarPath = './src/img/level.jpg'
      try {
        avatarBuffer = await fs.readFile(defaultAvatarPath)
      } catch {
        // Se anche l'avatar predefinito non è disponibile, crea un buffer vuoto grigio
        avatarBuffer = await sharp({
          create: {
            width: 128,
            height: 128,
            channels: 4,
            background: { r: 200, g: 200, b: 200, alpha: 1 }
          }
        }).png().toBuffer()
      }
    }
    
    // Ridimensiona l'avatar
    const resizedAvatar = await sharp(avatarBuffer)
      .resize(128, 128)
      .toBuffer()
    
    // Combina le immagini con sharp
    const bonkImage = await sharp(templateBuffer)
      .composite([
        {
          input: resizedAvatar,
          top: 90,  // Posizione verticale dell'avatar
          left: 120 // Posizione orizzontale dell'avatar
        }
      ])
      .toBuffer()
    
    // Invia l'immagine risultante
    await conn.sendMessage(m.chat, { 
      image: bonkImage,
      caption: '🔨 *BONK!* ' + (conn.getName(who) || 'Utente')
    }, { quoted: m })
    
  } catch (error) {
    console.error('Errore Bonk:', error.message)
    m.reply(`❌ Si è verificato un errore: ${error.message}`)
  }
}

handler.command = /^(bonk)$/i
handler.tags = ['fun']
handler.help = ['bonk @utente']
handler.admin = true;
export default handler