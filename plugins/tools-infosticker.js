import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import { default as baileys } from '@whiskeysockets/baileys'
let handler = async (m, { conn }) => {
  try {
    // Controlla che sia una risposta a uno sticker
    if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
      return conn.reply(m.chat, 'Rispondi a uno sticker per ottenere le info!', m)
    }

    const media = m.quoted
    const stickerInfo = {
      mimetype: media.mimetype || 'sconosciuto',
      sha256_hex: media.fileSha256 ? media.fileSha256.toString('hex') : 'n/a',
      sha256_base64: media.fileSha256 ? media.fileSha256.toString('base64') : 'n/a',
      mediaKey: media.mediaKey ? media.mediaKey.toString('hex') : 'n/a',
      type: media.type,
      fileLength: media.fileLength || 0,
      msgType: media.mtype,
      isAnimated: media.isAnimated || false
    }

    let message = `🧩 *Informazioni dello sticker:*\n`
    message += `• Tipo messaggio: ${stickerInfo.msgType}\n`
    message += `• Tipo media: ${stickerInfo.type}\n`
    message += `• Mimetype: ${stickerInfo.mimetype}\n`
    message += `• Dimensione: ${(stickerInfo.fileLength / 1024).toFixed(2)} KB\n`
    message += `• SHA256 (hex): ${stickerInfo.sha256_hex}\n`
    message += `• SHA256 (base64): ${stickerInfo.sha256_base64}\n`
    message += `• Animated: ${stickerInfo.isAnimated ? 'Sì' : 'No'}\n`

    await conn.reply(m.chat, message, m)
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Errore nel leggere le info dello sticker.', m)
  }
}

handler.help = ['infosticker']
handler.tags = ['tools']
handler.command = /^infosticker$/i
handler.register = true

export default handler
