import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, command, usedPrefix }) => {
  if (!m.quoted || !m.quoted.message) {
    return m.reply('⚠️ Rispondi a un messaggio con un file multimediale (es. foto, video, audio...)')
  }

  try {
    await conn.updateMediaMessage(m.quoted)
    m.reply('✅ Messaggio multimediale aggiornato con successo!')
  } catch (err) {
    console.error(err)
    m.reply('❌ Errore durante l\'aggiornamento del messaggio.')
  }
}

handler.command = ['aggiornamsg', 'aggiornamessaggio']
handler.tags = ['tools']
handler.help = ['aggiorna']

export default handler
