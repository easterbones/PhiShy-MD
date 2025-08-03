// plugin flamepass
function isFlamePassActive(user) {
  if (!user.flamePassScadenza) return false
  return Date.now() < Date.parse(user.flamePassScadenza)
}

function getFlamePassTimeRemaining(user) {
  if (!user.flamePassScadenza) return null
  const now = Date.now()
  const expiry = Date.parse(user.flamePassScadenza)
  const remaining = expiry - now

  if (remaining <= 0) return null

  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

  return { minutes, seconds, total: remaining }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  const durataFlameMs = 60 * 60 * 1000 // 1 ora

  if (command === 'flamepass') {
    if (!user.flamePass || user.flamePass <= 0)
      return conn.reply(m.chat, '❌ Non hai nessun *Flame Pass* disponibile!', m)

    const now = new Date()
    const expiryTime = now.getTime() + durataFlameMs
    user.flamePassScadenza = new Date(expiryTime).toISOString()
    user.flamePass--

    const scadenza = new Date(user.flamePassScadenza).toLocaleString('it-IT', {
      timeZone: 'Europe/Rome',
      hour: '2-digit', minute: '2-digit'
    })

    return conn.reply(m.chat, `🔥 Flame Pass attivato!\nHai 1 ora per flammare chi vuoi senza pietà.\n⏰ Scade alle *${scadenza}*`, m)
  }

  if (command === 'checkflame') {
    if (isFlamePassActive(user)) {
      const tempo = getFlamePassTimeRemaining(user)
      return conn.reply(m.chat, `🔥 Hai ancora *${tempo.minutes}m ${tempo.seconds}s* di flame pass attivo`, m)
    } else {
      return conn.reply(m.chat, '❌ Non hai un Flame Pass attivo', m)
    }
  }
}

handler.help = ['flamepass', 'checkflame']
handler.tags = ['fun', 'flame']
handler.command = /^flamepass|checkflame$/i
handler.register = true

export { isFlamePassActive }
export default handler
