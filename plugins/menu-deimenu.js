import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, __dirname }) => {
    // 1. Trova tutti i file JavaScript nella cartella plugins
    let pluginsDir = path.join(__dirname, '../plugins')
    if (!fs.existsSync(pluginsDir)) {
        return m.reply('❌ Cartella plugins non trovata!')
    }

    let pluginFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))
    let commands = {}

    // 2. Analizza ogni file per trovare la struttura handler
    for (let file of pluginFiles) {
        try {
            let filePath = path.join(pluginsDir, file)
            let fileContent = fs.readFileSync(filePath, 'utf-8')
            
            // Cerca il pattern tipico degli handler
            let handlerMatch = fileContent.match(
                /handler\.help\s*=\s*(\[.*?\]|'.*?'|".*?").*?handler\.tags\s*=\s*(\[.*?\]|'.*?'|".*?").*?handler\.command\s*=\s*(.+?);.*?export\s+default\s+handler/si
            )
            
            if (handlerMatch) {
                // Estrae help, tags e command
                let help = eval(handlerMatch[1])
                let tags = eval(handlerMatch[2])
                let command = handlerMatch[3].trim()
                
                // Normalizza i dati
                help = Array.isArray(help) ? help : [help]
                tags = Array.isArray(tags) ? tags : [tags]
                
                // Estrae i comandi dalle regex
                let commandsList = []
                if (command.startsWith('/^(') && command.endsWith(')$/i')) {
                    commandsList = command.slice(3, -3).split('|').map(c => c.trim().replace(/\\/g, ''))
                } else {
                    commandsList = [command.replace(/\/.+/g, '').replace(/["']/g, '')]
                }
                
                // Aggiunge al menu organizzato per tag
                for (let tag of tags) {
                    if (!commands[tag]) commands[tag] = []
                    
                    for (let cmd of commandsList) {
                        commands[tag].push({
                            command: cmd,
                            help: help[0] || 'Nessuna descrizione',
                            file: file
                        })
                    }
                }
            }
        } catch (e) {
            console.error(`Errore analisi ${file}:`, e)
        }
    }

    // 3. Costruisci il menu organizzato
    let menuText = `╔═══════════════╗
 📜 MENU PHISHY 
  ${Object.values(commands).flat().length} comandi disponibili 
╚═══════════════╝\n\n`  
     

    for (let [tag, cmds] of Object.entries(commands)) {
        menuText += `📌 *${tag.toUpperCase()}*\n`
        cmds.forEach(({command, help}) => {
            menuText += `├ ${usedPrefix}${command}\n`
            menuText += `│ ➥ ${help}\n`
        })
        menuText += '\n'
    }

    menuText += `╚════════════════════╝\n📅 ${new Date().toLocaleDateString('it-IT')}`

    // 4. Invia il menu
    await conn.sendMessage(m.chat, { 
        text: menuText,
        contextInfo: {
            externalAdReply: {
                title: '📜 MENU AUTOMATICO',
                body: `Digita ${usedPrefix}help <comando> per dettagli`,
                thumbnail: await (await fetch('https://th.bing.com/th/id/OIP.XHyxPgv8QBIUCKraPZCCYAHaHb?rs=1&pid=ImgDetMain')).buffer(),
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    })
}

handler.help = ['menu']
handler.tags = ['system']
handler.command = /^(menus|comandi|help|cmd)$/i

export default handler