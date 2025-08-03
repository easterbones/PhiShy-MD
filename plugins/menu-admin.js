import os from 'os';
import util from 'util';
import humanReadable from 'human-readable';
import baileys from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    // System information
    let uptime = process.uptime() * 1000;
    let uptimeString = clockString(uptime);
    
    // User and chat statistics
    let userCount = Object.keys(global.db.data.users).length;
    const chats = Object.entries(conn.chats).filter(([jid, chat]) => jid && chat.isChats);
    const groupCount = chats.filter(([jid]) => jid.endsWith('@g.us')).length;
    const privateCount = chats.filter(([jid]) => jid.endsWith('@s.whatsapp.net')).length;
    
    // Performance metrics
    const memoryUsage = process.memoryUsage();
    let startTime = performance.now();
    let endTime = performance.now();
    let responseTime = endTime - startTime;
    
    // Settings
    const { restrict } = global.db.data.settings[conn.user.jid] || {};
    const { autoread } = global.opts;
    const wm = 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!';
    let botName = global.db.data.settings[conn.user.jid].name || wm;
    
    let quotedMessage = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
    message: {
      locationMessage: {
        name: "𝐌𝐞𝐧𝐮 𝐚𝐝𝐦𝐢𝐧'",
        jpegThumbnail: await (await fetch('https://i.ibb.co/35HSdxFZ/admin.png')).buffer()
      }
    },
    participant: "0@s.whatsapp.net"
  };
   
    
    
    // Menu text
    let menuText = `
╭─〔 𝘾𝙊𝙈𝘼𝙉𝘿𝙄 𝘼𝘿𝙈𝙄𝙉 〕──⳹
│
├🗣️ 𝙂𝙍𝙐𝙋𝙋𝙊
│✧ ᴀᴅᴅ
│✧ ꜰɪxꜱᴄᴜᴅɪ
│✧ ꜱᴇᴛᴡᴇʟᴄᴏᴍᴇ|ꜱᴇᴛʙʏᴇ
│✧ ꜱᴇᴛ
│✧ ᴀᴘᴇʀᴛᴏ|ᴄʜɪᴜꜱᴏ
│✧ ᴅᴇʟ
│✧ ɪɴᴀᴛᴛɪᴠɪ
│✧ ᴋɪᴄᴋ
│✧ ᴋɪᴄᴋɴᴜᴍ
│✧ ᴍᴜᴛᴀ|ꜱᴍᴜᴛᴀ
│✧ ꜱᴇᴛᴍᴜᴛᴀ
│✧ ᴘʀᴏᴍᴜᴏᴠɪ|ᴘ
│✧ ʀᴇᴛʀᴏᴄᴇᴅɪ|ʀ
│✧ ꜱɪᴍᴜʟᴀ
│✧ 𝘸𝘢𝘳𝘯|𝘢𝘷𝘷𝘦𝘳𝘵𝘪𝘮𝘦𝘯𝘵𝘪
│   ⮩ ᴡᴀʀɴ
│   ⮩ ᴜɴᴡᴀʀɴ [ɴᴇꜱꜱᴜɴ ɴᴜᴍᴇʀᴏ]
│       ⮩ ᴏᴘᴘᴜʀᴇ .ᴜɴᴡᴀʀɴ 1|2
│       ⮩ ᴏᴘᴘᴜʀᴇ .ᴜɴᴡᴀʀɴ ᴀʟʟ
│   ⮩ ᴡᴀʀɴʟɪꜱᴛ
│✧ ꜱᴇᴛɪɢ
│✧ ꜱᴘᴇᴇᴅᴛᴇꜱᴛ
│✧ ɪɴꜰᴏꜱᴛᴀᴛᴏ
│
├👥 𝙏𝘼𝙂 𝙁𝙐𝙉𝙕𝙄𝙊𝙉𝙄
│✧ ʜɪᴅᴇᴛᴀɢ
│✧ ᴛᴀɢᴀʟʟ
│✧ ᴛᴀɢᴍᴇᴍʙʀɪ
│✧ ᴀᴅᴍɪɴꜱ
│✧ ᴠᴀꜰꜰᴀɴᴄᴜʟᴏ
│✧ 
│✧ 
│✧ 
├🎭 𝙁𝙐𝙉 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎
│✧ ᴅᴏx
│✧ ꜱᴛᴜᴘʀᴀ
│✧ ʙᴏᴄᴄʜɪɴᴏ
│✧ ʙᴏᴄᴄʜɪɴᴀ
│
╰───────────────⳹
> *MADE BY🏅    𓊈ҽαʂƚҽɾ𓊉𓆇𓃹 aggiornato al 11/05/25* 📅`

    // Immagine di contesto
    const menuImage = 'https://th.bing.com/th/id/OIP.pPizY1xraWKnh6iRcxSjegHaD5?cb=iwc1&rs=1&pid=ImgDetMain';
    
    // Invia messaggio con immagine di contesto
    return conn.sendMessage(m.chat, {
        text: menuText,
        contextInfo: {
            externalAdReply: {
                title: `comandi per i moderatori`,
                body: ``,
                thumbnailUrl: menuImage,
                sourceUrl: 'tiktoktoktiktok.com',
                mediaType: 1,
                renderLargerThumbnail: false
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
};

handler.help = ['menuadm'];
handler.tags = ['menuadm'];
handler.command = /^(admin|admins|menuadmin)$/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}