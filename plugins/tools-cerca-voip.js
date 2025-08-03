import fs from 'fs'
import levenshtein from 'fast-levenshtein'

const normalizza = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '')

function raggruppaPerNicknameSimile(data, soglia = 3) {
  const gruppi = []

  for (let item of data) {
    const nick = normalizza(item.nickname || '')
    if (!nick) continue

    let gruppoTrovato = false

    for (let gruppo of gruppi) {
      const nickBase = gruppo[0].nicknameNormalizzato
      if (levenshtein.get(nick, nickBase) <= soglia) {
        gruppo.push({ ...item, nicknameNormalizzato: nick })
        gruppoTrovato = true
        break
      }
    }

    if (!gruppoTrovato) {
      gruppi.push([{ ...item, nicknameNormalizzato: nick }])
    }
  }

  return gruppi
}

const handler = async (m, { text, args, usedPrefix, command }) => {
  const data = JSON.parse(fs.readFileSync('./voip.json'))
  const subcmd = (args[0] || '').toLowerCase()

  if (subcmd === 'riordina') {
    const datiConNickname = data.blockedNumbers.filter(e => e.nickname && e.nickname.trim())
    const gruppi = raggruppaPerNicknameSimile(datiConNickname)

    if (!gruppi.length) return m.reply('❌ Nessun nickname trovato da raggruppare.')

    let messaggio = `📚 *Nickname simili trovati: ${gruppi.length} gruppi*\n\n`

    gruppi.slice(0, 5).forEach((gruppo, i) => {
      messaggio += `🔸 *Gruppo ${i + 1}* (nick simili a "${gruppo[0].nickname}"):\n`
      gruppo.forEach(e => {
        messaggio += `  • ${e.nickname} (${e.numero})\n`
      })
      messaggio += '\n'
    })

    if (gruppi.length > 5) {
      messaggio += '🛈 Mostrati solo i primi 5 gruppi.\n'
    }

    return m.reply(messaggio)
  }

  // fallback: normale ricerca testuale
  const query = text.toLowerCase()
  if (!query) return m.reply(`Scrivi cosa vuoi cercare, oppure usa "${usedPrefix + command} riordina"`)

  const risultati = data.blockedNumbers.filter(entry => {
    return (
      entry.numero.toLowerCase().includes(query) ||
      (entry.nickname && entry.nickname.toLowerCase().includes(query)) ||
      (entry.paese && entry.paese.toLowerCase().includes(query)) ||
      (entry.gruppi && entry.gruppi.some(g => g.toLowerCase().includes(query)))
    )
  })

  if (!risultati.length) return m.reply(`❌ Nessun risultato trovato per: "${text}"`)

  let messaggio = `📞 *Risultati trovati:* ${risultati.length}\n\n`

  risultati.slice(0, 5).forEach(entry => {
    messaggio += `• *Numero:* ${entry.numero}\n`
    messaggio += `• *Nickname:* ${entry.nickname || '—'}\n`
    messaggio += `• *Paese:* ${entry.paese || '—'}\n`
    messaggio += `• *Tentativi:* ${entry.tentativi}\n`
    messaggio += `• *Gruppi:*\n  - ${entry.gruppi.join('\n  - ')}\n\n`
  })

  if (risultati.length > 10) {
    messaggio += `🛈 Mostrati solo i primi 5 risultati.`
  }

  m.reply(messaggio)
}

handler.command = ['cercavoip']
handler.help = ['cercavoip <testo>', 'cercavoip riordina']
handler.tags = ['tools']

export default handler
