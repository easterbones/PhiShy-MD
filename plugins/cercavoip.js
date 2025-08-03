import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, participants, groupMetadata, usedPrefix, command }) => {
  if (!m.isGroup) throw '❌ Questo comando funziona solo nei gruppi!'
  
  let stranieri = []

  for (let p of participants) {
    let jid = p.id
    let numero = '+' + jid.replace(/@.+/, '')
    let pn = new PhoneNumber(numero)
    let internazionale = pn.getNumber ? pn.getNumber('international') : pn.number
    let countryCode = pn.getRegionCode() || ''
    
    if (!numero.startsWith('+39')) {
      let nome = await conn.getName(jid)
      stranieri.push(`🌍 *${internazionale}* ~ ${nome} (${countryCode})`)
    }
  }

  if (stranieri.length == 0) {
    return m.reply('✅ Nessun numero straniero trovato nel gruppo.')
  }

  let messaggio = `📞 *Numeri stranieri nel gruppo "${groupMetadata.subject}":*\n\n` + stranieri.join('\n')
  m.reply(messaggio)
}

handler.command = ['voip', 'cercavoip']
handler.tags = ['gruppo']
handler.help = ['voip']
handler.group = true

export default handler
