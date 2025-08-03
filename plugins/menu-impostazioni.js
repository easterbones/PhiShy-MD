import os from 'os';
import util from 'util';
import humanReadable from 'human-readable';
import { default as baileys } from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';



/**
 * Gestore per il comando 'funzioni' che mostra un menu delle funzionalità del bot
 * @param {Object} message - L'oggetto messaggio in arrivo
 * @param {Object} options - Opzioni aggiuntive come la connessione e il prefisso utilizzato
 */
let handler = async (message, { conn, usedPrefix }) => {
    let quotedMessage = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
    message: {
      locationMessage: {
        name: "𝐈𝐦𝐩𝐨𝐬𝐭𝐚𝐳𝐢𝐨𝐧𝐢 𝐝𝐞𝐥 𝐛𝐨𝐭",
        jpegThumbnail: await (await fetch("https://i.ibb.co/pjmZ6p9n/impostazioni.png")).buffer()
      }
    },
    participant: "0@s.whatsapp.net"
  };
    // Calcolo tempo di attività del bot
    let uptime = process.uptime() * 1000;
    let uptimeString = clockString(uptime);
    
    // Conteggio degli utenti registrati nel database
    let userCount = Object.keys(global.db.data.users).length;
    
    // Filtraggio delle chat
    const allChats = Object.entries(conn.chats).filter(([id, chat]) => id && chat.isChats);
    const groupChats = allChats.filter(([id]) => id.endsWith('@g.us'));
    const groups = allChats.filter(([id]) => id.endsWith('@g.us'));
    
    // Informazioni sulla memoria
    const memory = process.memoryUsage();
    
    // Impostazioni dal database
    const { restrict } = global.db.data.settings[conn.user.jid] || {};
    const { autoread } = global.opts;
    
    // Percorso immagine predefinita
    let defaultImage = './no.png';
    
    // Misura la performance
    let startTime = performance.now();
    let endTime = performance.now();
    let elapsedTime = endTime - startTime;
    
    // Ottieni la foto del profilo dall'utente della chat
    let chatPhoto = await conn.profilePictureUrl(message.chat);
    
    // Recupera tutte le impostazioni del gruppo dalla chat corrente
    const {
        antiToxic, antilinkhard, antiPrivate, antitraba, antiArab,
        antiviewonce, isBanned, welcome, detect, sWelcome,
        sBye, sPromote, sDemote, antiLink, antilinkbase,
        antitiktok, sologruppo, soloprivato, antiCall, modohorny,
        gpt, antiinsta, antielimina, antitelegram,
        antiPorno, jadibot, autosticker, modoadmin, audios, antivoip, antispam, talk, autolevelup, antiprivato,antiruba
    } = global.db.data.chats[message.chat];
    
    // Determina il mittente
    let sender = message.quoted 
        ? message.quoted.sender 
        : message.mentionedJid && message.mentionedJid[0] 
            ? message.mentionedJid[0] 
            : message.fromMe 
                ? conn.user.jid 
                : message.sender;
    
    // Ottieni l'immagine del profilo del mittente
    const profilePicture = await conn.profilePictureUrl(sender, 'image')
        .catch(error => null) || './src/avatar_contact.png';
    
    let profileBuffer;
    if (profilePicture !== './src/avatar_contact.png') {
        profileBuffer = await (await fetch(profilePicture)).buffer();
    } else {
        profileBuffer = await (await fetch('https://i.ibb.co/7d1hbwyQ/allalaallaal.png')).buffer();
    }
    
    // Costruisci il menu con tutte le funzionalità e il loro stato (attivo/disattivato)
    let menuText = `
𝐥𝐢𝐬𝐭𝐚 𝐝𝐞𝐥𝐥𝐞 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢'
──────────────
𝐏𝐄𝐑 𝐆𝐑𝐔𝐏𝐏𝐎
 ${detect ? '✔︎' : '✘'} » ${usedPrefix}𝐝𝐞𝐭𝐞𝐜𝐭
 ${welcome ? '✔︎' : '✘'} » ${usedPrefix}𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨
 ${modoadmin ? '✔︎' : '✘'} » ${usedPrefix}𝐦𝐨𝐝𝐨𝐚𝐝𝐦𝐢𝐧
 ${talk ? '✔︎' : '✘'} » ${usedPrefix}𝐭𝐚𝐥𝐤
 ${isBanned ? '✔︎' : '✘'} » ${usedPrefix}𝐛𝐚𝐧𝐠𝐩
 ${autolevelup ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐮𝐭𝐨𝐥𝐞𝐯𝐞𝐥𝐮𝐩
 ${antielimina ? '✔︎' : '✘'} » ${usedPrefix}antielimina
 ${antiruba ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐫𝐮𝐛𝐚
──────────────
𝐑𝐄𝐒𝐓𝐑𝐈𝐙𝐈𝐎𝐍𝐈
 ${antiArab ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐚𝐫𝐚𝐛
 ${antiPorno ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐩𝐨𝐫𝐧𝐨
 ${antitraba ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐭𝐫𝐚𝐯𝐚
 ${antiLink ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤
 ${antiinsta ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐢𝐧𝐬𝐭𝐚
 ${antitiktok ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐭𝐢𝐤𝐭𝐨𝐤
 ${antielimina ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐞𝐥𝐢𝐦𝐢𝐧𝐚
 ${antivoip ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐯𝐨𝐢𝐩
 ${antispam ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐬𝐩𝐚𝐦
──────────────
𝐀𝐋𝐓𝐑𝐎
 ${antiCall ? '✔︎' : '✘'} » ${usedPrefix}𝐚𝐧𝐭𝐢𝐜𝐚𝐥𝐥
 ${sologruppo ? '✔︎' : '✘'} » ${usedPrefix}𝐬𝐨𝐥𝐨𝐠𝐫𝐮𝐩𝐩𝐨
 ${soloprivato ? '✔︎' : '✘'} » ${usedPrefix}𝐬𝐨𝐥𝐨𝐩𝐫𝐢𝐯𝐚𝐭𝐨
 ${antiprivato ? '✔︎' : '✘'} » ${usedPrefix}antiprivato

`.trim();
    
    // Nome del bot dal database globale
    
    
    
    let botName = global.db.data.nomedelbot || 'phishy fuck u';
    
    // Invia il messaggio con il menu usando l'oggetto globale come quoted
       const menuImage = 'https://th.bing.com/th/id/OIP.pPizY1xraWKnh6iRcxSjegHaD5?cb=iwc1&rs=1&pid=ImgDetMain';
       const wm = 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!';

       const externalAdReplyText = `
> ✔︎ » 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 𝐚𝐭𝐭𝐢𝐯𝐚
> ✘ » 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 𝐬𝐩𝐞𝐧𝐭𝐚

🎉 » ${usedPrefix}𝐝𝐞𝐭𝐞𝐜𝐭
👋 » ${usedPrefix}𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨
🔒 » ${usedPrefix}𝐦𝐨𝐝𝐨𝐚𝐝𝐦𝐢𝐧
💬 » ${usedPrefix}𝐭𝐚𝐥𝐤
🚫 » ${usedPrefix}𝐛𝐚𝐧𝐠𝐩
🌟 » ${usedPrefix}𝐚𝐮𝐭𝐨𝐥𝐞𝐯𝐞𝐥𝐮𝐩
🛡️ » ${usedPrefix}antielimina
`;

       return conn.sendMessage(message.chat, {
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: `Menu delle Funzioni`,
                    body: externalAdReplyText,
                    thumbnailUrl: menuImage,
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: quotedMessage });
};

// Configurazione del comando
handler.help = ['menu'];
handler.tags = ['menu'];
handler.command = /^(impostazioni)$/i;

export default handler;

/**
 * Converte i millisecondi in formato ore:minuti:secondi
 * @param {number} ms - Millisecondi da convertire
 * @returns {string} - Stringa formattata come ore:minuti:secondi
 */
function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    
    console.log({ ms, h, m, s });
    
    return [h, m, s]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}