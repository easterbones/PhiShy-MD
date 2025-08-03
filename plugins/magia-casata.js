import fs from 'fs'

const CASE_MAGICHE = [
    { nome: "Grifondoro", emoji: "🦁", punti: 0 },
    { nome: "Serpeverde", emoji: "🐍", punti: 0 },
    { nome: "Tassorosso", emoji: "🦡", punti: 0 },
    { nome: "Corvonero", emoji: "🦅", punti: 0 },
    { nome: "Pecoranera", emoji: "🐑", punti: 0 },
    { nome: "Lupomannaro", emoji: "🐺", punti: 0 },
    { nome: "Dragofurioso", emoji: "🐉", punti: 0 },
    { nome: "Fenice", emoji: "🔥", punti: 0 }
]

function getCasataInfo(nomeCasata) {
    const info = {
            Grifondoro: {
            fondatore: "Godric Grifondoro",
            tratti: ["Coraggio", "Audacia", "Nobiltà d'animo"],
            colori: "Scarlatto e Oro",
            sala: "Torre di Grifondoro",
            motto: "Mette alla prova i coraggiosi!",
            image: "https://th.bing.com/th/id/OIP.XQeKi4BxRgJXIF452RkZ2AHaIR?rs=1&pid=ImgDetMain"
        },
        Serpeverde: {
            fondatore: "Salazar Serpeverde",
            tratti: ["Ambizione", "Astuzia", "Determinazione"],
            colori: "Verde e Argento",
            sala: "Dungeons sotto il lago",
            motto: "Chi è furbo prospererà!",
            image: "https://th.bing.com/th/id/R.b7f3fb4243daa125b4e20ccd33e1d9f1?rik=fuWD9VEI63ms3Q&pid=ImgRaw&r=0"
        },
        Tassorosso: {
            fondatore: "Priscilla Corvonero",
            tratti: ["Lealtà", "Costanza", "Giustizia"],
            colori: "Giallo e Nero",
            sala: "Seminterrato vicino alle cucine",
            motto: "Chi è leale raccoglierà i frutti!",
            image: "https://th.bing.com/th/id/R.4e3fee771ab7fbd3dc46da44768d7868?rik=7dLzoNXOI9mYCw&pid=ImgRaw&r=0"
        },
        Corvonero: {
            fondatore: "Rowena Corvonero",
            tratti: ["Intelligenza", "Saggezza", "Creatività"],
            colori: "Blu e Bronzo",
            sala: "Torre di Corvonero",
            motto: "La mente affilata è la tua arma migliore!",
            image: "https://th.bing.com/th/id/OIP.D3WZ4iDWXy6ck1rNflLQnQHaFE?rs=1&pid=ImgDetMaing"
        },
    }
    return info[nomeCasata] || {
        fondatore: "Sconosciuto",
        tratti: ["Segretezza", "Mistero"],
        colori: "Arcobaleno",
        sala: "Luogo segreto",
        motto: "La magia è ovunque!",
        image: "https://i.imgur.com/defaultWand.png"
    }
}

let handler = async function (m, { conn, rcanal }) {
    // Carica il database con gestione errori JSON
    let maghiData
    try {
        const data = fs.readFileSync('maghi.json', 'utf8')
        maghiData = JSON.parse(data)
    } catch (e) {
        console.error("Errore nel caricamento del database:", e)
        return conn.reply(m.chat, "🔮 Si è verificato un errore nel leggere il database delle casate!", m, rcanal)
    }

    // Inizializza se non esiste
    if (!maghiData.users) maghiData.users = {}
    
    let user = maghiData.users[m.sender] || {}
    
    // Inizializza user.casa a null se non esiste
    if (user.casa === undefined) {
        user.casa = null
        maghiData.users[m.sender] = user
    }

    if (!user.registered) {
        return conn.reply(m.chat, "🔮 Devi prima registrarti come mago con !registra per essere assegnato a una casata!", m, rcanal)
    }

    // Controlla se ha già una casata assegnata
    if (user.casa) {
        const casata = CASE_MAGICHE.find(c => c.nome === user.casa.nome)
        const infoCasata = getCasataInfo(user.casa.nome)
        return conn.reply(m.chat, 
            `🏰 Sei già nella Casata ${user.casa.nome} ${casata.emoji}!\n\n` +
            `🧙 *Fondatore*: ${infoCasata.fondatore}\n` +
            `⭐ *Punti Casata*: ${user.casa.punti || 0}\n` +
            `📅 *Membro dal*: ${new Date(user.casa.joinDate || Date.now()).toLocaleDateString()}\n\n` +
            `"${infoCasata.motto}"`,
            m, rcanal)
    }

    // Animazione di assegnazione
    await conn.sendMessage(m.chat, {
        text: "🎩 *Il Cappello Parlante sta decidendo...*",
        mentions: [m.sender]
    }, { quoted: m })
    
    await new Promise(resolve => setTimeout(resolve, 2000))

    const casataAssegnata = CASE_MAGICHE[Math.floor(Math.random() * CASE_MAGICHE.length)]
    
    // Assegna la nuova casata
    user.casa = {
        nome: casataAssegnata.nome,
        punti: 0,
        joinDate: new Date().toISOString()
    }
	await m.react(casataAssegnata.emoji)
    try {
        fs.writeFileSync('maghi.json', JSON.stringify(maghiData, null, 2))
    } catch (e) {
        console.error("Errore nel salvataggio del database:", e)
        return conn.reply(m.chat, "🔮 Si è verificato un errore nel salvare la tua casata!", m, rcanal)
    }

    const infoCasata = getCasataInfo(casataAssegnata.nome)
    let txt = `✨ *IL CAPPELLO PARLANTE HA DECISO!* ✨\n\n`
    txt += `🏰 *Casata Assegnata*: ${casataAssegnata.nome} ${casataAssegnata.emoji}\n`
    txt += `🧙 *Fondatore*: ${infoCasata.fondatore}\n`
    txt += `🌈 *Tratti Principali*: ${infoCasata.tratti.join(', ')}\n`
    txt += `🎨 *Colori*: ${infoCasata.colori}\n`
    txt += `🏠 *Sala Comune*: ${infoCasata.sala}\n\n`
    txt += `⚡ *Motto*: "${infoCasata.motto}"\n\n`
    txt += `Benvenut* nella ${casataAssegnata.nome}, ${user.name || 'novello mago'}!`

    await conn.sendMessage(m.chat, { 
        text: txt,
        mentions: [m.sender],
        contextInfo: {
            externalAdReply: {
                title: `Casata ${casataAssegnata.nome}`,
                body: "Scopri la tua nuova casa magica!",
                thumbnailUrl: infoCasata.image,
                sourceUrl: infoCasata.image
            }
        }
    }, { quoted: m })
    
    
}

handler.help = ['casata']
handler.tags = ['magia']
handler.command = ['casata', 'sorteggiocasata'] 

export default handler