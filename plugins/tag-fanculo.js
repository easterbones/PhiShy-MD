

let handler = async (m, { conn, args, participants,isAdmin }) => {
  if (!isAdmin) throw '[❗] Devi essere admin per usare questo comando!'
  
  let members = participants.filter(member => !member.isBot).map(member => ({
    jid: member.id,
    name: member.name || `@${member.id.split('@')[0]}`
  }))
  
  if (members.length === 0) throw '[❗] Non ci sono membri da insultare!'
  
  // Lista di insulti creativi
  const insults = [
    "🖕 Vaffanculo %name, puzzavi già dalla nascita!",
    "💩 %name, vai a cagare e non tornare!",
    "👊 %name, spero tu faccia un incidente con lo scooter!",
    "🤡 %name, clown di merda!",
    "🍆 %name, pisello ammucciato!",
    "🧠 %name, cerebroleso ambulante!",
    "👶 %name, svezzati!",
    "🧌 %name, troll di quartiere!",
    "💀 %name, crepa!",
    "🤢 %name, vomito pensando a te!",
    "🌸 %name, sei piu inutile di sakura",
     "🦨%name, non starmi vicino puzzi"
    
  ]
  
  // Costruisci il messaggio con stile
  let messageParts = [
    '╔════════════════╗',
    '║   𝐕𝐀𝐅𝐅𝐀𝐍𝐂𝐔𝐋𝐎        ║',
    '╚════════════════╝\n',
    '🎌 *Elenco degli sfigati:*\n'
  ]
  
  // Aggiungi ogni membro con insulto casuale
  members.forEach(member => {
    const randomInsult = insults[Math.floor(Math.random() * insults.length)]
    messageParts.push(`➡️ ${randomInsult.replace('%name', member.name)}`)
  })
  
  messageParts.push(
    '\n💢 *Messaggio generato automaticamente*',
    '📛 *Nessun membro è stato realmente insultato*',
    '😘 *Tanto vi voglio bene*'
  )
  
  // Invia il messaggio con menzioni
  await conn.sendMessage(m.chat, { 
    text: messageParts.join('\n'),
    mentions: members.map(member => member.jid)
  }, { quoted: m })
  
  // Invia uno sticker aggiuntivo per enfasi
  await conn.sendMessage(m.chat, {
    sticker: fs.readFileSync('./src/img/angry.webp'),
    mimetype: 'image/webp'
  }, { quoted: m })
}

handler.help = ['fanculo']
handler.tags = ['group', 'fun']
handler.command = /^(fanculo|vaffanculo|insulta)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler