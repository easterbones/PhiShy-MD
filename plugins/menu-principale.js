import os from 'os'
import util from 'util'
import humanReadable from 'human-readable'
import { default as baileys } from '@whiskeysockets/baileys'
import fs from 'fs'
import { performance } from 'perf_hooks'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let uptime = process.uptime() * 1000
    let userCount = Object.keys(global.db.data.users).length

    let chatPhoto = await conn.profilePictureUrl(m.chat).catch(_ => null)
    const profilePicture = chatPhoto || 'https://i.ibb.co/spvt8r4m/lalalalal.jpg'
    const menuImageURL = 'https://i.ibb.co/7d1hbwyQ/allalaallaal.png' // immagine per la posizione

    // Scarichiamo entrambe le immagini come Buffer
    const profileBuffer = await (await fetch(profilePicture)).buffer()
    const menuBuffer = await (await fetch(menuImageURL)).buffer()

    // Testo del menu
    let menuText = `
Qᴜᴇꜱᴛᴏ è ɪʟ ᴍᴇɴ𝐮 ᴅᴇɪ ᴄᴏᴍ𝐚ɴ𝐝ɪ, ꜱᴄᴇɢʟɪ ᴜɴᴀ ᴄᴀᴛᴇɡᴏʀɪᴀ Qᴜɪ ꜱᴏᴛᴛᴏ:
══════ •⊰✧⊱• ══════
> MADE BY🏅 𓊈ҽαʂƚҽɾ𓊉𓆇𓃹 update 01/08/25 📅
`.trim()
      const wm = 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!';
        let botName = global.db.data.nomedelbot || 'phishy fuck u';

    const quotedMessage = {
        key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Menu" },
        message: {
            locationMessage: {
                name: "📚 𝐌𝐞𝐧𝐮 𝐝𝐞𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢",
                jpegThumbnail: menuBuffer // ⚠️ deve essere un Buffer!
            }
        },
        participant: "0@s.whatsapp.net"
    }

    const buttons = [
        { buttonId: '.gruppo', buttonText: { displayText: '👥 comandi per tutti' }, type: 1 },
        { buttonId: '.admin', buttonText: { displayText: '🛡️ comandi per admin' }, type: 1 },
        { buttonId: '.owner', buttonText: { displayText: '👑 comandi per l\'owner' }, type: 1 },
        { buttonId: '.rpg', buttonText: { displayText: '🎲 giochi di ruolo' }, type: 1 },
        { buttonId: '.audio', buttonText: { displayText: '🎵 audio di phishy' }, type: 1 },
        { buttonId: '.effetti', buttonText: { displayText: '✨ effetti audio' }, type: 1 },
        { buttonId: '.risposta', buttonText: { displayText: '💬 risposte di phishy' }, type: 1 },
        { buttonId: '.impostazioni', buttonText: { displayText: '⚙️ impostazioni' }, type: 1 },
        { buttonId: '.listacomandi', buttonText: { displayText: '📜 Lista completa comandi' }, type: 1 } // Nuovo bottone
    ];

    if (m.text === '.listacomandi') {
        const listaComandi = `
📜 *Lista completa dei comandi*:
👥 *Comandi per tutti*: ".gruppo"
🛡️ *Comandi per admin*: ".admin"
👑 *Comandi per l'owner*: ".owner"
🎲 *Giochi di ruolo*: ".rpg"
🎵 *Audio di phishy*: ".audio"
✨ *Effetti audio*: ".effetti"
💬 *Risposte di phishy*: ".risposta"
⚙️ *Impostazioni*: ".impostazioni"
`.trim();

        return conn.sendMessage(m.chat, {
            text: listaComandi,
            footer: 'Phishy Bot',
            buttons: [
                { buttonId: '.menu', buttonText: { displayText: '🔙 Torna al menu' }, type: 1 }
            ],
            headerType: 1
        });
    }

    return conn.sendMessage(m.chat, {
        text: menuText,
        buttons: buttons,
        headerType: 1,
        contextInfo: {
            externalAdReply: {
                title: `ꜱᴄᴇɢʟɪ ʟᴀ ᴄᴀᴛᴇɡᴏʀɪᴀ, ᴀᴅ ᴇꜱᴇᴍᴘɪᴏ:`,
                body: `.ɢʀᴜᴘᴘᴏ`,
                thumbnail: profileBuffer, // questa è la foto del gruppo
                mediaType: 1,
                renderLargerThumbnail: false,
            },
            mentionedJid: conn.parseMention(wm),
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401234816773@newsletter',
                serverMessageId: '',
                newsletterName: '' + botName
            }
        }
    }, { quoted: quotedMessage });
}

handler.help = ['menucomandi']
handler.tags = ['main']
handler.command = ['menu', 'comandi', 'aiuto']

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
