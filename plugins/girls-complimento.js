let handler = async (m, { conn, args, participants, command }) => {
  // Impostazioni
  const canale_privato = false // Se true, invia i complimenti in privato
  const sticker_abbinati = true // Aggiunge sticker tematici
  const stile_regina = true // Aggiunge corone alle ragazze più complimentate

  // Database complimenti (100+ frasi)
  const complimenti = [
    "👑 %name, sei la regina indiscussa del gruppo stasera!",
    "💖 %name, illumini la chat più del sole!",
    "✨ Sei la versione umana di una boccata d'aria fresca!",
    "🌹 %name, sei rara come un fiore nel deserto!",
    "🥂 Brindo alla persona più splendente della chat!",
    "💎 %name, sei più preziosa dei diamanti!",
    "🦋 La tua bellezza è rara come una farfalla blu!",
    "🍀 Porti fortuna solo con la tua presenza!",
    "🎀 Sei il fiocco perfetto sul pacco regalo della vita!",
    "🧿 Contro il malocchio: guarda una tua foto!",
    "👗 Staresti bene pure con un sacco della spazzatura!",
    "🍫 Sei dolce come il cioccolato, ma senza calorie!",
    "🕯️ Illumineresti anche una caverna!",
    "🎵 Sei la nota perfetta nella sinfonia della vita!",
    "🌌 Sei una costellazione di meraviglie!",
    "🍷 Invecchi come il vino pregiato!",
    "🧚 Sei la fata madrina che tutti vorrebbero!",
    "🦄 Gli unicorni ti invidiano!",
    "📸 Non servono filtri con te!",
    "💃 Il tuo stile è da copiare su Pinterest!",
    "👯‍♀️ Sei la BFF che tutte vorrebbero!",
    "🤳 La tua beauty routine è leggenda!",
    "💅 Le unghie più forti del tuo carattere!",
    "👛 Sei la borsa più chic del guardaroba!",
    "👒 Stai bene pure con la cuffia da doccia!",
    "🛍️ Sei l'emblema dello shopping intelligente!",
    "💄 Il rossetto più rosso del tuo potere!",
    "👠 Cammini come se le strade fossero tue!",
    "🌺 Profumi di primavera tutto l'anno!",
    "🍸 Sei l'aperitivo perfetto: chic e frizzante!"
  ]

  // Seleziona il destinatario
  let target = m.mentionedJid[0] || 
    args[0]?.replace(/[@ .+-]/g, '') + '@s.whatsapp.net' || 
    m.sender

  let user = participants.find(u => u.id === target)
  let name = user?.name || target.split('@')[0]
  let mention = [target]

  // Scegli complimento random
  let complimento = complimenti[Math.floor(Math.random() * complimenti.length)]
    .replace('%name', name)

  // Costruisci messaggio
  let message = `╔═════════════════╗
║   𝐂𝐎𝐌𝐏𝐋𝐈𝐌𝐄𝐍𝐓𝐎   ║
╚═════════════════╝

${complimento}

${stile_regina ? '👑 Ora hai diritto alla corona per 24h!' : ''}`

  // Opzioni di invio
  if (canale_privato) {
    await conn.sendMessage(target, { text: message }, { quoted: m })
    await m.reply(`✅ Complimento inviato in privato a @${name}`)
  } else {
    await conn.sendMessage(m.chat, { 
      text: message, 
      mentions: mention 
    }, { quoted: m })
  }

  // Aggiungi sticker
  if (sticker_abbinati) {
    const stickers = [
      'https://i.imgur.com/3pBk9Sj.webp', // Fiori
      'https://i.imgur.com/JlObt3X.webp', // Cuori
      'https://i.imgur.com/jr0J8vB.webp'  // Regina
    ]
    await conn.sendFile(m.chat, stickers[Math.floor(Math.random() * stickers.length)], '', '', m)
  }
}

handler.help = ['complimento @tag']
handler.tags = ['fun', 'group']
handler.command = /^(complimento|elogia|complimenta)$/i
handler.group = true

export default handler