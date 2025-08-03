import fs from 'fs'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

console.log('[bansticker] Plugin caricato')

// Sticker ban: rispondi a un messaggio con lo sticker specifico per bannare l'utente
let handler = async (m, { conn, participants, isBotAdmin }) => {
  console.log('[bansticker] Handler eseguito per messaggio:', m.mtype, m.sender)
  try {
    // Logga sempre se ricevi uno sticker
    if (m.mtype === 'stickerMessage') {
      const hash = m.msg?.fileSha256 ? m.msg.fileSha256.toString('base64') : 'n/a';
      console.log(`[bansticker] Ricevuto sticker. SHA256 base64: ${hash}`);
    }
    // Solo gruppi e admin
    if (!m.isGroup) return
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin
    if (!senderAdmin) return
    if (!isBotAdmin) return

    // Solo se il messaggio è uno sticker e risponde a un messaggio
    if (m.mtype !== 'stickerMessage') return
    if (!m.quoted) return
    if (!m.msg || !m.msg.fileSha256) return

    const stickerHash = m.msg.fileSha256.toString('base64')
    const TARGET_HASH = 'pSF3LA4huAfrREbY7snCPvdbCYHY572EpRSOmou7TPE=' // <-- il tuo sticker ban
    if (stickerHash !== TARGET_HASH) return

    const userToBan = m.quoted.sender
    if (!userToBan) return
    await conn.groupParticipantsUpdate(m.chat, [userToBan], 'remove')
    await conn.sendMessage(m.chat, {
      text: `Utente @${userToBan.split('@')[0]} bannato dal gruppo tramite sticker!`,
      mentions: [userToBan]
    })
  } catch (e) {
    console.error('[bansticker] Errore:', e)
  }
}

handler.command = /^(?!x)x$/i // mai attivato da comando
handler.all = true
handler.tags = ['group']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.register = false
export default handler