import { canLevelUp, xpRange } from '../lib/levelling.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'

export async function before(m, { conn }) {
    // Immagini predefinite
    const imgLevelUp = './src/img/level/levelup.jpg'
    const fallbackImage = './src/img/level/nolevelup.png' // Immagine di fallback locale
    
    // Fix exp negativi
    let user = global.db.data.users[m.sender]
    if (user) {
        let { min } = xpRange(user.level, global.multiplier)
        if (user.exp < min) {
            user.exp = min
            console.log(`[rpg-autolevelup] Exp negativa rilevata per ${m.sender}, corretta a ${min}`)
        }
    }
    let fkontak = { 
        "key": { 
            "participants": "0@s.whatsapp.net", 
            "remoteJid": "status@broadcast", 
            "fromMe": false, 
            "id": "Halo" 
        }, 
        "message": { 
            "contactMessage": { 
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Cellulare\nEND:VCARD` 
            }
        }, 
        "participant": "0@s.whatsapp.net" 
    }

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let username = conn.getName(who)
    let chat = global.db.data.chats[m.chat]

    if (!chat.autolevelup) return !0
    let before = user.level * 1
    
    // Salva i livelli sbloccati per mostrare tutti i premi
    let livellaSbloccati = []
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
        user.level++
        if ([10, 20, 30, 40, 50, 60].includes(user.level)) {
            livellaSbloccati.push(user.level)
        }
    }

    if (before !== user.level) {
        try {
            // Controlla quali livelli sono stati sbloccati tra il livello precedente e quello attuale
            let premiTxt = ''
            let premiAssegnati = false
            
            // Verifica tutti i livelli speciali tra il livello precedente e quello nuovo
            for (let lvl = before + 1; lvl <= user.level; lvl++) {
                if (lvl === 10) {
                    user.pozione_maggiore += 3
                    premiTxt += `\n🎁 *Premi per il livello 10:*\n`
                    premiTxt += `• +3 Pozioni Maggiori🧪\n`
                    premiTxt += `• lavori sbloccati:\n`
                    premiTxt += `postino✉️\n`
                    premiAssegnati = true
                } 
                if (lvl === 20) {
                    user.pozione_definitiva += 1
                    user.moto = true
                    premiTxt += `\n🎁 *Premi per il livello 20:*\n`
                    premiTxt += `• 1 Pozione Definitiva🧪\n`
                    premiTxt += `• hai la Moto sbloccata!🏍️\n`
                    premiTxt += `• lavori sbloccati:\n`
                    premiTxt += `meccanico🧑🏻‍🔧\ndj 🎧\n`
                    premiAssegnati = true
                } 
                if (lvl === 30) {
                    user.macchina = true
                    premiTxt += `\n🎁 *Premi per il livello 30:*\n`
                    premiTxt += `• hai sbloccato i tesori🦜 usa .tesoro\n`
                    premiTxt += `• 🚗 Macchina sbloccata!\n`
                    premiTxt += `• lavori sbloccati:\n`
                    premiTxt += `paiaccio🎭\n`
                    premiAssegnati = true
                } 
                if (lvl === 40) {
                    user.forcina += 1
                    premiTxt += `\n🎁 *Premi per il livello 40:*\n`
                    premiTxt += `• 🖇️ Forcina sbloccata!\n`
                    premiTxt += `• lavori sbloccati:\n`
                    premiTxt += `mafioso🧔🏻‍♂️🍕\n`
                    premiAssegnati = true
                } 
                if (lvl === 50) {
                    premiTxt += `\n🎁 *Premi per il livello 50:*\n`
                    premiTxt += `• lavori sbloccati:\n`
                    premiTxt += `avvocato⚖️\ncantante🎤\n`
                    premiAssegnati = true
                } 
                if (lvl === 60) {
                    premiTxt += `\n🎁 *Premi per il livello 60:*\n`
                    premiTxt += `• lavori sbloccati:\n`
                    premiTxt += `scienziato🔬\ningegniere informatico💻\nastronauta🚀\n`
                    premiAssegnati = true
                }
            }

            let { max } = xpRange(user.level, global.multiplier)
            let levelupMessage = 
                `*「 LEVEL UP 🆙🥳 ${before} → ${user.level} 」*\n\n` +
                `▢ *Utente*: @${who.split('@')[0]}\n` +
                `▢ *Ruolo*: ${user.role}\n` +
                `▢ *XP necessario per il prossimo livello*: ${max - user.exp}\n\n` +
                (premiAssegnati ? `*🎊 PREMI SBLOCCATI:*${premiTxt}` : `*Nessun premio speciale sbloccato in questi livelli*`)

            let img
            try {
                img = await (await fetch(imgLevelUp)).buffer()
            } catch {
                img = readFileSync(imgLevelUp)
            }

             await conn.sendMessage(m.chat, {
            text: levelupMessage,
            contextInfo: {
                isforwarded: true,
                forwardedNewsletterMessageInfo: {
                newsletterJid: "120363391446013555@newsletter",
                serverMessageId: 100,
                newsletterName: 'canale dei meme 🎌',
                },
                externalAdReply: {

                    title: `levelup`,
                    body: `aumenti di livello`,
                    thumbnail: img,
                    mediaType: 1,
                    sourceUrl: ''
                }
            }
        }, { quoted: fkontak })

        } catch (error) {
            console.error('Errore:', error)
            await conn.sendMessage(m.chat, { 
                text: '❌ Errore durante l\'aggiornamento del livello',
                mentions: [who]
            }, { quoted: fkontak })
        }
    }
    return !0
}