import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const pluginName = args[0]
    if (!pluginName) return m.reply(`⚠️ Specifica un nome plugin!\nEsempio: ${usedPrefix + command} saluto`)

    try {
        // Invio stato "componendo"
        await conn.sendPresenceUpdate('composing', m.chat)

        // Prompt avanzato per generazione plugin
        const prompt = `sei un programmatore di bot e crei plugins utili e divertenti, ecco le instruzioni:
- Formato ES Module (import/export)
- Compatibile con Baileys
- il comanddo deve essere simile o uguale a ${pluginName}
- Handler ben strutturato
- Include help, tags e command
- Export default handler alla fine
- Usa async/await
- Gestione errori robusta
- Documentazione nel codice`
        
        const text = `usa questo come nome per crearmi un plugin: ${pluginName}`

        // Richiesta all'API
        const apiUrl = `https://api.fgmods.xyz/api/info/openai?prompt=${encodeURIComponent(prompt)}&text=${encodeURIComponent(`${text}`)}&apikey=fg_CDcRH42j`
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!data?.result) throw new Error('API non ha restituito dati validi')

        // Estrazione codice dalla risposta
        const codeMatch = data.result.match(/```javascript([\s\S]+?)```/)?.[1] || data.result
        const cleanCode = codeMatch.trim()

        // Verifica codice minimale
        if (!cleanCode.includes('export default handler')) {
            throw new Error('Codice generato non valido')
        }

        // Salvataggio file
        const pluginsDir = path.join(process.cwd(), 'plugins')
        if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir, { recursive: true })

        const filename = `generato-${pluginName.toLowerCase().replace(/\s+/g, '-')}.js`
        const filePath = path.join(pluginsDir, filename)

        fs.writeFileSync(filePath, cleanCode)

        // Estrazione comandi
        const cmdMatch = cleanCode.match(/handler\.command\s*=\s*(?:\/([^/]+)\/|\[([^\]]+)\])/i)
        let commands = ''
        
        if (cmdMatch) {
            commands = cmdMatch[1] 
                ? `.${cmdMatch[1]}` 
                : cmdMatch[2] 
                    ? match[2].split(',').map(c => `.${c.trim().replace(/['"]/g, '')}`).join(' | ')
                    : ''
        }

        await m.reply(
            `🛠️ *Plugin generato con successo!*\n\n` +
            `📄 Nome: ${filename}\n` +
            (commands ? `🔧 Comandi: ${commands}\n` : '') +
            `📁 Percorso: plugins/${filename}`
        )

    } catch (error) {
        console.error(`Errore ${command}:`, error)
        await m.reply(
            `❌ *Errore generazione plugin*\n\n` +
            `Motivo: ${error.message || 'Errore sconosciuto'}\n\n` +
            `Se il problema persiste, contatta lo sviluppatore.`
        )
    }
}

handler.help = ['creaplugin <nome>']
handler.tags = ['owner']
handler.command = ['creaplugin']
handler.rowner = true

export default handler