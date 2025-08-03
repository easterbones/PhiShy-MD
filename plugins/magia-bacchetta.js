import fs from 'fs'

const MAGHI_DB = 'maghi.json'

// Catalogo bacchette con statistiche casuali
const BACCHETTE = [
    {
        nome: "Bacchetta di Salice",
        materiale: "Salice con nucleo di pelo di Unicorno",
        lunghezza: "28 cm",
        flessibilità: "Flessibile",
        rarita: "B",
        potenza: Math.floor(Math.random() * 30) + 30,
        precisione: Math.floor(Math.random() * 40) + 40,
        affinità: Math.floor(Math.random() * 50) + 20
    },
    {
        nome: "Bacchetta di Quercia",
        materiale: "Quercia con nucleo di piuma di Fenice",
        lunghezza: "31 cm",
        flessibilità: "Rigida",
        rarita: "A",
        potenza: Math.floor(Math.random() * 40) + 40,
        precisione: Math.floor(Math.random() * 30) + 50,
        affinità: Math.floor(Math.random() * 40) + 30
    },
    {
        nome: "Bacchetta di Sambuco",
        materiale: "Sambuco con nucleo di corda di Cuore di Drago",
        lunghezza: "34 cm",
        flessibilità: "Molto rigida",
        rarita: "S",
        potenza: Math.floor(Math.random() * 50) + 50,
        precisione: Math.floor(Math.random() * 50) + 30,
        affinità: Math.floor(Math.random() * 30) + 40
    },
    {
        nome: "Bacchetta di Agrifoglio",
        materiale: "Agrifoglio con nucleo di capello di Veela",
        lunghezza: "26 cm",
        flessibilità: "Medio-flessibile",
        rarita: "A+",
        potenza: Math.floor(Math.random() * 35) + 45,
        precisione: Math.floor(Math.random() * 45) + 45,
        affinità: Math.floor(Math.random() * 60) + 20
    }
]

let handler = async function (m, { conn }) {
    // Carica il database
    let maghiData = JSON.parse(fs.readFileSync(MAGHI_DB))
    let user = maghiData.users[m.sender]
    
    // Verifica registrazione
    if (!user || !user.registered) {
          await m.react('❌') 
        return conn.reply(m.chat, "🔮 Devi prima registrarti come mago con .reg per ottenere una bacchetta!", m, rcanal)
        
    }
    
    // Verifica se ha già una bacchetta
    if (user.bacchetta) {
        await m.react('')
        return conn.reply(m.chat, 
            `🧙‍♂️ Hai già la tua bacchetta: ${user.bacchetta.nome} (${user.bacchetta.rarita})!\n\n` +
            `Potenza: ${user.bacchetta.potenza}/100\n` +
            `Precisione: ${user.bacchetta.precisione}/100`, 
            m, rcanal)
      
    }

    // Animazione di caricamento
    const loadingMessages = [
        "🔍 Sto cercando tra i rami di Salice...",
        "🌳 Esamino il legno di Quercia...",
        "✨ Controllo l'affinità magica...",
        "🌀 Analizzo i nuclei disponibili...",
        "💫 Quasi trovata la bacchetta perfetta...",
        "⚡ Sta per rivelarsi la tua compagna magica!"
    ]
    
    // Invia il primo messaggio
    let loadingMsg = await conn.sendMessage(m.chat, {
        text: loadingMessages[0],
        mentions: [m.sender],
        quoted: m
    })
    
    // Modifica il messaggio ogni 800ms
    let i = 1
    const interval = setInterval(async () => {
        if (i < loadingMessages.length) {
            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    key: loadingMsg.key,
                    type: 14,
                    editedMessage: {
                        conversation: loadingMessages[i]
                    }
                }
            }, {})
            i++
        } else {
            clearInterval(interval)
            
            // Aspetta un altro secondo prima del risultato
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Scegli una bacchetta casuale
            const bacchettaCasuale = BACCHETTE[Math.floor(Math.random() * BACCHETTE.length)]
            
            // Assegna la bacchetta all'utente
            user.bacchetta = bacchettaCasuale
            user.bacchetta.dataAssegnazione = new Date().toISOString()
            
            // Salva nel database
            fs.writeFileSync(MAGHI_DB, JSON.stringify(maghiData, null, 2))
            
            // Costruisci il messaggio
            let txt = `✨ *BACCHETTA MAGICA TROVATA!* ✨\n\n`
            txt += `▸ *Nome*: ${bacchettaCasuale.nome}\n`
            txt += `▸ *Rarità*: ${bacchettaCasuale.rarita}\n`
            txt += `▸ *Materiale*: ${bacchettaCasuale.materiale}\n`
            txt += `▸ *Lunghezza*: ${bacchettaCasuale.lunghezza}\n`
            txt += `▸ *Flessibilità*: ${bacchettaCasuale.flessibilità}\n\n`
            txt += `⚡ *Statistiche*:\n`
            txt += `▸ Potenza: ${bacchettaCasuale.potenza}/100\n`
            txt += `▸ Precisione: ${bacchettaCasuale.precisione}/100\n`
            txt += `▸ Affinità: ${bacchettaCasuale.affinità}/100\n\n`
            txt += `"${bacchettaCasuale.nome} ha scelto te!"`

            await conn.sendMessage(m.chat, { 
                text: txt,
                mentions: [m.sender],
                contextInfo: {
                    externalAdReply: {
                        title: "Bacchetta Magica Trovata!",
                        body: "Clicca per vedere la tua nuova bacchetta!",
                        thumbnailUrl: "https://i.pinimg.com/originals/3e/7e/02/3e7e02b7f0a8ebd9b7f128b3a9f8a0e8.jpg",
                        sourceUrl: "https://i.pinimg.com/originals/3e/7e/02/3e7e02b7f0a8ebd9b7f128b3a9f8a0e8.jpg"
                    }
                }
            }, { quoted: m })
            
            await m.react('✨')
        }
    }, 800)
}

handler.help = ['bacchetta']
handler.tags = ['magia']
handler.command = ['bacchetta', 'ottenibacchetta', 'wand'] 

export default handler