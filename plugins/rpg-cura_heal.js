import { join } from 'path'
import { promises as fs } from 'fs'
import sharp from 'sharp'

function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

let handler = async (m, { conn, args, usedPrefix, __dirname, isReply }) => {
    const nomeUtente = conn.getName ? conn.getName(m.sender) : m.sender;
    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Ciao"
        },
        message: {
            contactMessage: {
                displayName: nomeUtente,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${nomeUtente};;;\nFN:${nomeUtente}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Cellulare\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    }



    let user = global.db.data.users[m.sender]
    if (user.health >= 100) return conn.reply(m.chat, `La tua salute è già al massimo ❤️`, fkontak, m)

    let pozioneScelta = args[0]?.toLowerCase()
    let tipoPozione = {
        minore: { cura: 20, key: 'pozioneminore', nome: 'Minore', img: 'pozioneminore.png', emoji: '🥤' },
        maggiore: { cura: 50, key: 'pozionemaggiore', nome: 'Maggiore', img: 'pozionemaggiore.png', emoji: '🍷' },
        definitiva: { cura: 100, key: 'pozionedefinitiva', nome: 'Definitiva', img: 'pozionedefinitiva.png', emoji: '🧪' }
    }

    // Se manca la scelta o è errata, mostra i bottoni
    if (!pozioneScelta || !tipoPozione[pozioneScelta]) {
        let buttons = [
            { buttonId: `${usedPrefix}cura minore`, buttonText: { displayText: '🥤 Minore (+20)' }, type: 1 },
            { buttonId: `${usedPrefix}cura maggiore`, buttonText: { displayText: '🍷 Maggiore (+50)' }, type: 1 },
            { buttonId: `${usedPrefix}cura definitiva`, buttonText: { displayText: '🧪 Definitiva (+100)' }, type: 1 },
        ];
        let buttonMessage = {
            text: `Scegli che pozione vuoi usare per curarti:\n\n🥤 Minore (+20 salute)\n🍷 Maggiore (+50 salute)\n🧪 Definitiva (+100 salute)`,
            footer: 'Phishy RPG',
            buttons: buttons,
            headerType: 1
        };
        return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    }

    let pozione = tipoPozione[pozioneScelta]
    if (user[pozione.key] < 1) {
        return conn.reply(m.chat, `⚠️Non hai pozioni ${pozione.nome} disponibili!`, m)
    }

    user[pozione.key] -= 1
    user.health = Math.min(100, user.health + pozione.cura)

    // Carica la thumbnail della pozione
    let thumbPath = join(__dirname, '../src/img/shop', pozione.img)
    let thumb = undefined
    try {
        thumb = await fs.readFile(thumbPath)
    } catch (e) {
        thumb = null
    }
    if (!pozioneScelta || !tipoPozione[pozioneScelta]) {
        let buttons = [
            { buttonId: `${usedPrefix}cura minore`, buttonText: { displayText: '🥤 Minore (+20)' }, type: 1 },
            { buttonId: `${usedPrefix}cura maggiore`, buttonText: { displayText: '🍷 Maggiore (+50)' }, type: 1 },
            { buttonId: `${usedPrefix}cura definitiva`, buttonText: { displayText: '🧪 Definitiva (+100)' }, type: 1 },
        ];
        let buttonMessage = {
            text: `Scegli che pozione vuoi usare per curarti:\n\n🥤 Minore (+20 salute)\n🍷 Maggiore (+50 salute)\n🧪 Definitiva (+100 salute)`,
            footer: 'Phishy RPG',
            buttons: buttons,
            headerType: 1
        };
        return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    }
    let userProfileBuffer = null
    try {
        userProfileBuffer = await (await import('node-fetch')).default(userProfilePic).then(res => res.buffer())
    } catch (e) {
        userProfileBuffer = null
    }

    // Messaggio quotato di posizione con thumbnail profilo utente
    const quotedPosition = {
        key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Cura" },
        message: {
            locationMessage: {
                name: `❤️ Cura di ${conn.getName ? conn.getName(m.sender) : m.sender}`,
                jpegThumbnail: userProfileBuffer || null
            }
        },
        participant: "0@s.whatsapp.net"
    }

    // Messaggio posizione con thumbnail pozione e link canale
    await conn.sendMessage(m.chat, {
        text: `Hai usato una pozione ${pozione.emoji} ${pozione.nome}!\n❤️ Salute: ${user.health}`,

        contextInfo: {
            externalAdReply: {
                title: 'hai usato una pozione ' +  pozione.nome,
                body: '',
                mediaType: 1,
                thumbnail: thumb || null,
                sourceUrl: '', // <-- inserisci qui il link del tuo canale
                 forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401234816773@newsletter',
                serverMessageId: '',
                newsletterName: 'aggiornamenti 🎌 '
            }
            }
        }
    }, { quoted: fkontak })
}

handler.help = ['cura <minore/maggiore/definitiva>']
handler.tags = ['rpg']
handler.command = /^(cura|heal|pozione)$/i
export default handler