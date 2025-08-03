import { writeFile, unlink, readFile } from 'fs/promises'
import path from 'path'

// Variabili per memorizzare lo stato originale
let originalProfilePicture = null
let originalName = null
let originalStatus = null

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    // Comando per ripristinare l'identità originale
    if (command === 'restoreme') {
      await restoreOriginalIdentity(conn)
      return m.reply('✅ Identità originale ripristinata!')
    }

    // Comando per impersonare un utente
    const target = m.quoted ? m.quoted.sender : m.mentionedJid[0] || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    
    if (!target) throw `Specifica un utente:\n${usedPrefix}impersonate @utente\nOppure rispondi a un messaggio`

    // Salva l'identità originale solo se non è già stato fatto
    if (!originalProfilePicture) {
      originalProfilePicture = await conn.profilePictureUrl(conn.user.jid, 'image').catch(() => null)
      originalName = conn.user.name
      originalStatus = conn.user.status
    }

    // Ottieni i dati dell'utente target
    const targetUser = await conn.contactAddOrUpdate(target)
    const targetName = targetUser?.notify || target.split('@')[0]
    const targetStatus = targetUser?.status || ''
    const targetPicture = await conn.profilePictureUrl(target, 'image').catch(() => null)

    // Aggiorna solo ciò che è disponibile
    if (targetPicture) {
      const picturePath = path.join('./temp', 'target_profile.jpg')
      const response = await fetch(targetPicture)
      const buffer = Buffer.from(await response.arrayBuffer());
      await writeFile(picturePath, buffer)
      await conn.updateProfilePicture(conn.user.jid, picturePath)
      await unlink(picturePath).catch(() => {})
    }

    if (targetName) await conn.updateProfileName(targetName)
    if (targetStatus) await conn.updateProfileStatus(targetStatus)

    m.reply(`✅ Identità cambiata in *${targetName}*${targetStatus ? `\nStato: "${targetStatus}"` : ''}`)

  } catch (error) {
    console.error('Impersonate error:', error)
    m.reply('⚠️ Errore durante il cambio identità. Alcune modifiche potrebbero non essere state applicate.')
  }
}

async function restoreOriginalIdentity(conn) {
  try {
    if (originalProfilePicture) {
      const originalPath = path.join('./temp', 'original_profile.jpg')
      const response = await fetch(originalProfilePicture)
      const buffer = Buffer.from(await response.arrayBuffer());
      await writeFile(originalPath, buffer)
      await conn.updateProfilePicture(conn.user.jid, originalPath)
      await unlink(originalPath).catch(() => {})
    }
    
    if (originalName) await conn.updateProfileName(originalName)
    if (originalStatus) await conn.updateProfileStatus(originalStatus)
    
    // Resetta le variabili
    originalProfilePicture = null
    originalName = null
    originalStatus = null
    
  } catch (error) {
    console.error('Restore error:', error)
    throw '⚠️ Errore durante il ripristino. Potrebbe essere necessario reimpostare manualmente.'
  }
}

handler.help = [
  'impersonate @user (cambia identità)',
  'restoreme (ripristina identità originale)'
]
handler.tags = ['owner']
handler.command = /^(impersonate|rubaindentity|restoreme)$/i
handler.owner = true
handler.group = false

export default handler