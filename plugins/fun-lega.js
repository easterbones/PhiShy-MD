let handler = async (m, { conn, participants, usedPrefix, command }) => {
    
    
  // Ignora messaggi che contengono un link
  if (/(https?:\/\/[^\s]+)/i.test(m.text)) return;
  let target = m.mentionedJid?.[0] || m.quoted?.sender
  if (!target) {
    return conn.sendMessage(m.chat, {
      text: `👿 Tagga qualcuno o rispondi al suo messaggio per legarlo!\n\nUso: *${usedPrefix}${command} @utente*`
    }, { quoted: m })
  }

  if (target === m.sender) {
    return conn.sendMessage(m.chat, {
      text: `🤨 Vuoi legarti da solo? Malato...`
    }, { quoted: m })
  }

  const tag = '@' + target.split('@')[0]

  // Calcolo probabilità di successo
  const probabilitaSuccesso = 0.7
  const successo = Math.random() < probabilitaSuccesso

  // Inizializzazione sicura dei campi utente
  const assicuratiCampi = (utenteJid) => {
    let tentativi = 0
    let ok = false
    while (tentativi < 3 && !ok) {
      try {
        if (!global.db.data.users[utenteJid]) global.db.data.users[utenteJid] = {}
        if (!Array.isArray(global.db.data.users[utenteJid].lega_vittime)) global.db.data.users[utenteJid].lega_vittime = []
        if (typeof global.db.data.users[utenteJid].lega_io !== 'boolean') global.db.data.users[utenteJid].lega_io = false
        ok = true
      } catch (e) {
        tentativi++
      }
    }
    return ok
  }

  if (!assicuratiCampi(m.sender) || !assicuratiCampi(target)) {
    return conn.sendMessage(m.chat, {
      text: `❌ Errore nell'accesso al database. Riprova più tardi.`
    }, { quoted: m })
  }

  const userAggressore = global.db.data.users[m.sender]
  const userVittima = global.db.data.users[target]

  if (!successo) {
    return conn.sendMessage(m.chat, {
      text: `💥 Hai provato a legare ${tag}, ma sei inciampatə nelle tue stesse corde.`,
      mentions: [target]
    }, { quoted: m })
  }

  // Liberazione automatica delle vittime dell'utente vittima
  if (Array.isArray(userVittima.lega_vittime) && userVittima.lega_vittime.length > 0) {
    for (let jid of userVittima.lega_vittime) {
      if (!assicuratiCampi(jid)) continue
      global.db.data.users[jid].lega_io = false
    }
    userVittima.lega_vittime = []

    await conn.sendMessage(m.chat, {
      text: `💦 ${tag} è statə *sodomizzatə talmente forte* che ha perso il controllo sulle sue vittime. Tutti i legami si sono sciolti...`,
      mentions: [target]
    }, { quoted: m })
  }

  // Animazione NSFW / crudele
  const frames = [
    `🧑‍🦯     😐`,
    `🧑‍🦯    😐`,
    `🧑‍🦯   😐`,
    `🧑‍🦯  😧`,
    `🧑‍🦯 😨`,
    `🧑‍🦯🪢😰`,
    `🧑‍🦯🪢😖`,
    `🧑‍🦯🪢😵‍💫`,
    `🧑‍🦯🪢💀`,
    `🔗 ${tag} è statə *legatə, sodomizzatə e spezzatə dentro*.`
  ]

  let { key } = await conn.sendMessage(m.chat, {
    text: `😈 Inizio legatura oscena su ${tag}...\n\n${frames[0]}`,
    mentions: [target]
  }, { quoted: m })

  for (let i = 1; i < frames.length; i++) {
    await new Promise(res => setTimeout(res, 500))
    await conn.sendMessage(m.chat, {
      text: `😈 Inizio legatura oscena su ${tag}...\n\n${frames[i]}`,
      edit: key,
      mentions: [target]
    })
  }

  // Aggiorna aggressore
  if (!userAggressore.lega_vittime.includes(target)) {
    userAggressore.lega_vittime.push(target)
  }

  // Aggiorna vittima
  userVittima.lega_io = true

  return conn.sendMessage(m.chat, {
    text: `💀 ${tag} ora è *tuə schiavə legatə*. Non potrà più accedere al proprio profilo o alle info.`,
    mentions: [target]
  }, { quoted: m })
}

handler.command = ['lega']
handler.tags = ['azioni']
handler.help = ['lega @utente - lega qualcuno in modo oscuro']
handler.register = true

export default handler
