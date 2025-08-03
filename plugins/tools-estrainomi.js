import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    const filePath = './voip.json'
    if (!fs.existsSync(filePath)) {
      return m.reply('❌ Il file "voip.json" non esiste nella root del bot.')
    }

    const rawData = fs.readFileSync(filePath, 'utf8')
    const json = JSON.parse(rawData)

    if (!json.blockedNumbers || !Array.isArray(json.blockedNumbers)) {
      return m.reply('❌ Il file non contiene una lista valida in "blockedNumbers".')
    }

    const numeri = json.blockedNumbers.map(entry => entry?.numero).filter(Boolean)

    if (numeri.length === 0) {
      return m.reply('❌ Nessun numero valido trovato nel file.')
    }

    let risultati = []
    for (const numero of numeri) {
      const id = numero.replace(/\D/g, '') + '@s.whatsapp.net'
      let nome

      try {
        nome = await conn.getName(id)
      } catch {
        nome = '(nome non trovato)'
      }

      risultati.push(`• ${numero} → ${nome}`)
    }

    const messaggio = risultati.length
      ? risultati.join('\n').slice(0, 4000)
      : '❌ Nessun nome trovato.'

    await m.reply(`📋 *Nomi reali da WhatsApp:*\n\n${messaggio}`)
  } catch (err) {
    console.error('[estrainomi] Errore:', err)
    m.reply('❌ Errore durante la lettura o analisi del file.')
  }
}

handler.help = ['estrainomi']
handler.tags = ['tools']
handler.command = /^estrainomi$/i

export default handler
