const handler = async (m, { conn }) => {
  let target
  if (m.isGroup) {
    target = m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
        ? m.quoted.sender
        : false
  } else {
    target = m.chat
  }

  if (!target) return m.reply('❌ Devi taggare o rispondere a un messaggio di un utente.')

  const jid = m.chat

  try {
    // Ottieni la chiave dell’ultimo messaggio
    const { messages } = await conn.loadMessages(jid, 1)
    const lastMsg = messages && messages[0]

    if (!lastMsg) return m.reply('❌ Nessun messaggio trovato nella chat.')

    // Carica ultimi 50 messaggi prima del più recente
    const history = await conn.loadMessages(jid, 50, { before: lastMsg.key })

    if (!history || !Array.isArray(history.messages)) return m.reply('⚠️ Impossibile ottenere la cronologia.')

    const msgs = history.messages

    // Filtra messaggi del target
    const filtered = msgs
      .filter(msg =>
        msg.key?.participant === target || msg.key?.remoteJid === target
      )
      .filter(msg =>
        msg.message &&
        (msg.message.conversation || msg.message.extendedTextMessage?.text)
      )
      .slice(-10)

    if (!filtered.length) {
      return m.reply('⚠️ Nessun messaggio recente trovato per quell\'utente.')
    }

    const nameTarget = await conn.getName(target)
    let testo = `📜 Ultimi messaggi di ${nameTarget}:\n\n`

    for (let i = 0; i < filtered.length; i++) {
      const msg = filtered[i]
      const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '[messaggio non testuale]'
      testo += `• ${body}\n`
    }

    await conn.sendMessage(m.chat, { text: testo, mentions: [target] }, { quoted: m })

  } catch (err) {
    console.error('Errore in .ritrova:', err)
    m.reply('❌ Errore durante il recupero dei messaggi.')
  }
}

handler.help = ['ritrova @utente']
handler.tags = ['tools']
handler.command = ['ritrova']
handler.group = true

export default handler
