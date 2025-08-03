let handler = async (m, { conn, args, participants }) => {
  // Lista di emergenze con risposte drammatiche
  const emergenze = {
    // Emergenze amorose
    cuore: [
      "💔 *CRISI DI CUORE DETECTED!* 💔\n\n" +
      "🔹 _Fase 1:_ Manda 3 vocali piangenti alle amiche\n" +
      "🔹 _Fase 2:_ Ascolta 'All By Myself' in loop\n" +
      "🔹 _Fase 3:_ Brucia tutte le sue foto (ma prima screenshotta per i ricordi)\n\n" +
      "⚠️ *Consiglio della Nonna:* 'Se non ti cerca, NON ESISTI PER LUI'",
      
      "🚨 **CODICE ROSSO: CUORE SPEZZATO** 🚨\n" +
      "📉 Livello di disperazione: 99%\n\n" +
      "💊 _Cura Immediate:_\n" +
      "1. Gelato al cioccolato (quantità: infinita)\n" +
      "2. Maratona di 'Sex and the City'\n" +
      "3. Cerca su Google: 'Come cancellare i ricordi'\n\n" +
      "🎯 _Frase Motivazionale:_ 'Ricordati che anche Beyoncé è stata tradita'"
    ],
    
    // Emergenze estetiche
    beauty: [
      "🚨 **DISASTRO BEAUTY!** 🚨\n" +
      "🔴 _Problema:_ 'Mi si è spaccato lo smalto!'\n\n" +
      "⚡ _Soluzioni Lightning:_\n" +
      "• Rimuovi tutto con acetone e fingi sia una scelta hipster\n" +
      "• Manda piccole minacce a chi lo nota\n" +
      "• Posta una storia IG con filtro 'senza mani'\n\n" +
      "💅 *Frase Zen:* 'Lo smalto si ripara, il carattere no'",
      
      "⚠️ **ALLARME BRUFOLO!** ⚠️\n" +
      "📍 Posizione: Sul naso, ovviamente\n\n" +
      "🚑 _Protocollo Anti-Brufolo:_\n" +
      "1. Applica il correttore (strato spesso come intonaco)\n" +
      "2. Di a tutti che è una 'nuova piercing'\n" +
      "3. Se qualcuno lo menziona, rispondi: *È il mio terzo occhio spirituale* 👁️"
    ],
    
    // Emergenze generali
    default: [
      "🚑 **EMERGENZA GENERICA!** 🚑\n" +
      "🔹 _Livello Drammaticità:_ " + ["Leggero", "Medio", "APOCALITTICO"][Math.floor(Math.random() * 3)] + "\n\n" +
      "📜 _Procedura Standard:_\n" +
      "1. Fai 3 storie IG con musica triste\n" +
      "2. Scrivi un post criptico su Facebook\n" +
      "3. Ordina cibo spazzatura per 3 persone\n\n" +
      "🎯 _Fatto Divertente:_ Le tue amiche stanno già screenshotando per il gruppo gossip"
    ]
  }

  // Tipi di emergenza supportati
  const tipo = args[0]?.toLowerCase() || 'default'
  const risposte = emergenze[tipo] || emergenze.default
  const rispostaRandom = risposte[Math.floor(Math.random() * risposte.length)]

  // Aggiungi sticker drammatici
  const stickers = [
    'https://i.imgur.com/WMjpO0a.webp', // Donna che urla
    'https://i.imgur.com/3TnGXFL.webp', // Incendio
    'https://i.imgur.com/KQ0gXWU.webp'  // SOS
  ]
  
  await conn.sendMessage(m.chat, { 
    text: rispostaRandom,
    mentions: participants.map(u => u.id)
  }, { quoted: m })
  
  await conn.sendMessage(m.chat, { 
    sticker: { url: stickers[Math.floor(Math.random() * stickers.length)] }
  }, { quoted: m })
}

handler.help = ['emergenza <tipo>', 'emergenza cuore', 'emergenza beauty']
handler.tags = ['fun', 'group']
handler.command = /^(emergenza|sos|aiuto)$/i
handler.group = true

export default handler