import { exec } from 'child_process'

const handler = async (m, { args, usedPrefix, command }) => {
  const pkg = args[0]
  if (!pkg) return m.reply(`❗ Usa: *${usedPrefix}${command} <nome_pacchetto>*\nEsempi:\n- *${usedPrefix}${command} @whiskeysockets/baileys* (da npm)\n- *${usedPrefix}${command} @adiwajshing/baileys@github:what-zit-tooyaa/Baileys#master* (da GitHub)\n- *${usedPrefix}${command} https://github.com/what-zit-tooyaa/Baileys.git* (da URL Git)`)

  m.reply(`📦 Installazione di *${pkg}* in corso...`)

  const install = (cmd) => {
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) reject({ err, stdout, stderr })
        else resolve({ stdout, stderr })
      })
    })
  }

  // Gestione dei formati speciali
  let installCommand
  if (pkg.includes('@github:')) {
    // Formato: nome-pacchetto@github:user/repo#branch
    const [pkgName, githubPart] = pkg.split('@github:')
    installCommand = `npm install ${pkgName}@github:${githubPart}`
  } else if (pkg.startsWith('github:')) {
    // Formato: github:user/repo#branch
    installCommand = `npm install ${pkg}`
  } else if (pkg.startsWith('http')) {
    // URL Git diretto
    installCommand = `npm install ${pkg}`
  } else {
    // Pacchetto npm standard
    installCommand = `npm install ${pkg}`
  }

  try {
    await install(installCommand)
    m.reply(`✅ Pacchetto *${pkg}* installato con successo!`)
  } catch (e1) {
    if (e1.stderr.includes('ERESOLVE')) {
      m.reply(`⚠️ Conflitto rilevato. Provo con la modalità compatibile...`)
      try {
        await install(`${installCommand} --legacy-peer-deps`)
        m.reply(`✅ Pacchetto *${pkg}* installato con successo (modalità compatibile)!`)
      } catch (e2) {
        m.reply(`❌ Fallita anche la modalità compatibile.\n\n🔧 Errore:\n${e2.stderr}`)
      }
    } else {
      m.reply(`❌ Errore durante l'installazione:\n${e1.stderr}`)
    }
  }
}

handler.command = /^node$/i
handler.owner = true

export default handler