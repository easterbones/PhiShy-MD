import fs from 'fs'

let handler = async (m, { conn, participants }) => {
  if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi!')

  // Ottieni solo i jid dei membri
  let listaJid = participants.map(u => u.id)

  // Usa m.chat come id del gruppo
  const groupId = m.chat
  const nomeFile = `lista_membri_${groupId.replace(/[^a-zA-Z0-9]/g, '')}.json`
  const pathFile = `./archivi/${nomeFile}`

  // Crea la cartella se non esiste
  if (!fs.existsSync('./archivi')) fs.mkdirSync('./archivi')

  // Salva il file
  fs.writeFileSync(pathFile, JSON.stringify(listaJid, null, 2))

  // Invia il file nel gruppo
  await conn.sendFile(m.chat, pathFile, nomeFile, '✅ Ecco la lista dei membri del gruppo (solo jID).')
}

handler.command = ['listajid', 'crealista']
handler.group = true

export default handler
