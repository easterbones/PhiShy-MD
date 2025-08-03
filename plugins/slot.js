//import db from '../lib/database.js'
let reg = 40
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let fa = `.`.trim()
    let users = global.db.data.users[m.sender]
    
    // Initialize slotLimit and lastSlotReset if not defined
    if (!users.slotLimit) users.slotLimit = 5
    if (!users.lastSlotReset) users.lastSlotReset = Date.now()
    
    // Reset attempts every 6 hours
    const now = Date.now()
    const sixHours = 6 * 60 * 60 * 1000
    
    if (now - users.lastSlotReset >= sixHours) {
        users.slotLimit = 5
        users.lastSlotReset = now
    }
    
    let apuesta = parseInt(args[0])
    if (isNaN(apuesta) || apuesta <= 0) {
        return m.reply(`❎ Inserisci un importo valido per scommettere.`)
    }
    
    // Check if user has enough experience points to bet
    if (users.exp < apuesta) {
        return m.reply(`❎ Non hai abbastanza XP per scommettere ${apuesta}.`)
    }
    
    // Check if the user has reached their daily limit
    if (users.slotLimit <= 0) {
        const nextReset = new Date(users.lastSlotReset + sixHours)
        const timeLeft = Math.ceil((nextReset - now) / (60 * 60 * 1000))
        return m.reply(`❎ Hai raggiunto il limite giornaliero di giochi.\n⏳ Prossimo reset tra circa ${timeLeft} ore.`)
    }
    
    // Parse the second argument to check if the user wants to bet dolci
    let betDolci = args[1]?.toLowerCase() === 'dolci'
    
    // Initialize dolci if not defined
    if (!users.limit) users.limit = 0
    
    let emojis = ["🪙", "🎰", "💎"]
    let a = Math.floor(Math.random() * emojis.length)
    let b = Math.floor(Math.random() * emojis.length)
    let c = Math.floor(Math.random() * emojis.length)
    
    let x = [emojis[a], emojis[(a + 1) % emojis.length], emojis[(a + 2) % emojis.length]]
    let y = [emojis[b], emojis[(b + 1) % emojis.length], emojis[(b + 2) % emojis.length]]
    let z = [emojis[c], emojis[(c + 1) % emojis.length], emojis[(c + 2) % emojis.length]]
    
    let end
    let dolciResult = ''
    
    if (x[1] === y[1] && y[1] === z[1]) {
        end = `𝐡𝐚𝐢 𝐯𝐢𝐧𝐭𝐨 🎉 🎁`
        users.exp += apuesta
        
        if (betDolci) {
            users.limit += apuesta * 2
            dolciResult = `\n🍬 Hai vinto ${apuesta * 2} dolci!`
        } else {
            users.limit += Math.floor(apuesta / 5)
            dolciResult = `\n🍬 Hai vinto ${Math.floor(apuesta / 5)} dolci!`
        }
    } else if (x[1] === y[1] || x[1] === z[1] || y[1] === z[1]) {
        end = `𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐚 𝐚 𝐭𝐞𝐧𝐭𝐚𝐫𝐞 . . .`
        dolciResult = betDolci ? `\n🍬 Nessun cambiamento nei dolci.` : ''
    } else {
        end = `𝐡𝐚𝐢 𝐩𝐞𝐫𝐬𝐨 🤡`
        users.exp -= apuesta
        
        if (betDolci) {
            users.limit = Math.max(0, users.limit - apuesta)
            dolciResult = `\n🍬 Hai perso ${apuesta} dolci!`
        }
    }
    
    users.slotLimit -= 1
    
    const nextReset = new Date(users.lastSlotReset + sixHours)
    const timeLeft = Math.ceil((nextReset - now) / (60 * 60 * 1000))
    
    return await m.reply(
        `
       🎰 ┃ 𝐒𝐋𝐎𝐓
     ──────────
       ${x[0]} : ${y[0]} : ${z[0]}
       ${x[1]} : ${y[1]} : ${z[1]}
       ${x[2]} : ${y[2]} : ${z[2]}
     ──────────
        
${end}${dolciResult}

📊 Statistiche:
💰 XP: ${users.exp}
🍬 Dolci: ${users.limit}
🎯 Tentativi rimasti: ${users.slotLimit}
⏳ Reset tentativi tra: ${timeLeft} ore`
    )
}

handler.help = ['slot <apuesta> [dolci]']
handler.tags = ['game']
handler.command = ['slot']
export default handler