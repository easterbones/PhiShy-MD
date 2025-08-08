//código creado x The Carlos 

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) {
    return await m.reply(`
⛔ *ACCESSO NEGATO*  
┏━━━━━━━━━━━━━━━━━━━━━━┓  
┃ 🔐 *PERMESSO RISERVATO*  
┃ 🚫 Solo il [ROOT-OVERSEER] può eseguire questo modulo.  
┃ 🧠 Tentativo registrato nel nucleo.  
┗━━━━━━━━━━━━━━━━━━━━━━┛  
    `.trim())
  }

  const sleep = ms => new Promise(res => setTimeout(res, ms))
  const group = m.chat
  const metadata = await conn.groupMetadata(group)
  const totalMembers = metadata.participants.length
  const admins = metadata.participants.filter(p => p.admin != null).length

  const chatMessages = conn.chats?.[m.chat]?.messages
  let lastSenders = []
  if (chatMessages) {
    lastSenders = [...new Set(Object.values(chatMessages)
      .map(msg => msg.key.participant)
      .filter(Boolean)
      .reverse())]
      .slice(0, 5)
      .map((jid, i) => `  ${i + 1}. @${jid.split('@')[0]}`)
  }

  const allMentions = metadata.participants.map(u => u.id)

  // Messaggio iniziale brutale hacker con tag
  await m.reply(`
⚠️ 🚨 *ALLARME DI SICUREZZA* 🚨 ⚠️

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
█▄─█─▄█▄─▀█▀─▄█▄─▄█▄─▀█▄─▄█▄─▀█▄─▄█
██─▄▀███─█▄█─███─███─█▄▀─███─█▄▀─██
▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▀▀▄▄▀

👁️‍🗨️ *INTRUSI RILEVATI NEL SISTEMA* 👁️‍🗨️

⏳ Avvio attacco informatico in 3 secondi...
`.trim(), null, { mentions: allMentions })

  await sleep(3000)

  // Frasi glitch stile hacker brutali
  const glitchFrases = [
    '💀 A͟L͟L͟A͟R͟M͟E͟: T̷i̷ ̷s̷t̷a̷n̷n̷o̷ ̷h̷a̷c̷k̷e̷r̷a̷n̷d̷o̷... 💀',
    '👾 A͟c͟c͟e͟d͟e͟n͟d͟o͟ ̷a̷i̷ ̷t̷u̷o̷i̷ ̷d̷a̷t̷i̷ ̷p̷r̷i̷v̷a̷t̷i̷... 👾',
    '⚠️ P̷r̷e̷p̷a̷r̷a̷n̷d̷o̷ ̷v̷i̷r̷u̷s̷ ̷i̷n̷f̷o̷r̷m̷a̷t̷i̷c̷o̷... ⚠️',
    '🧨 B͟o͟m͟b͟a͟ ͟l͟o͟g͟i͟c͟a͟ ͟a͟t͟t͟i͟v͟a͟t͟a͟! 🧨',
    '💻 I͟n͟i͟e͟z͟i͟o͟n͟e͟ ͟d͟i͟ ͟c͟o͟d͟i͟c͟e͟ ͟m͟a͟l͟i͟z͟i͟o͟s͟o͟ ͟i͟n͟ ͟c͟o͟r͟s͟o͟... 💻',
    '🔓 P͟a͟s͟s͟w͟o͟r͟d͟ ͟c͟o͟m͟p͟r͟o͟m͟e͟s͟s͟e͟... 🔓',
    '☠️ S͟i͟s͟t͟e͟m͟a͟ ͟s͟u͟l͟ ͟p͟u͟n͟t͟o͟ ͟d͟i͟ ͟c͟r͟o͟l͟l͟a͟r͟e͟... ☠️',
    '🎯 H͟a͟c͟k͟i͟n͟g͟ ͟r͟i͟u͟s͟c͟i͟t͟o͟ ͟i͟n͟ ͟3͟... ͟2͟... ͟1͟... 🎯',
    '🔥 H͟A͟C͟K͟I͟N͟G͟ ͟C͟O͟M͟P͟L͟E͟T͟A͟T͟O͟.͟ ͟H͟A͟I͟ ͟P͟E͟R͟S͟O͟ ͟T͟U͟T͟T͟E͟ ͟L͟E͟ ͟T͟U͟E͟ ͟I͟N͟F͟O͟R͟M͟A͟Z͟I͟O͟N͟I͟ ͟E͟ ͟C͟A͟R͟T͟E͟ ͟D͟I͟ ͟C͟R͟E͟D͟I͟T͟O͟ 🔥'
  ]

  for (const frase of glitchFrases) {
    await m.reply(frase)
    await sleep(1600)
  }

  // Animazione di caricamento classica
  const loadingFrames = [
    '🛰️ AVVIO SISTEMA "OVERWATCH"...',
    '🧠 Connessione alla rete globale .',
    '🧠 Connessione alla rete globale ..',
    '🧠 Connessione alla rete globale ...',
    '✅ Connessione stabilita.'
  ]

  for (const frame of loadingFrames) {
    await m.reply(frame)
    await sleep(700)
  }

  const loadingBars = [
    '🔄 Caricamento moduli di sorveglianza:',
    '🔳 [▒▒▒▒▒▒▒▒▒▒] 0%',
    '🔳 [██▒▒▒▒▒▒▒▒] 20%',
    '🔳 [████▒▒▒▒▒▒] 40%',
    '🔳 [██████▒▒▒▒] 60%',
    '🔳 [████████▒▒] 80%',
    '🔳 [██████████] 100% ✅'
  ]

  for (const bar of loadingBars) {
    await m.reply(bar)
    await sleep(400)
  }

  // Mostra dati reali con stile cyberpunk e tag
  await m.reply(`
╭─〔📊 SCANSIONE COMPLETA DEL GRUPPO
│ 👥 Membri totali: *${totalMembers}*
│ 🛡️ Amministratori: *${admins}*
│ 🧠 Ultimi utenti attivi:
${lastSenders.length > 0 ? lastSenders.join('\n') : '  - Nessuna attività rilevata'}
╰───────────────────╯
`.trim(), null, {
    mentions: allMentions
  })

  await sleep(1000)

  // Finale epico cyberpunk
  await m.reply(`
▒█▀▀█ ▒█▀▀█ ▀▀█▀▀ ░█▀▀█ ▒█▀▀█  
▒█░▄▄ ▒█░░░ ░▒█░░ ▒█▀▀▀ ▒█
▒█▄▄█ ▒█▄▄█ ░▒█░░ ▒█▄▄▄ ▒█▄▄█ 

👁️ MODALITÀ OVERWATCH ATTIVATA  
📡 Scansione in tempo reale...  
🗂️ Informazioni registrate nel nucleo privato.

✔️ Sistema *CYBER-VIGILANZA* online.
`.trim())
}

handler.command = ['overwatch', 'sorvegliare']
handler.group = true
export default handler