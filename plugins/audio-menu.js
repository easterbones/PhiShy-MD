import os from 'os';
import util from 'util';
import fs from 'fs';
import { performance } from 'perf_hooks';


let handler = async (message, { conn, usedPrefix }) => {
    let uptime = process.uptime() * 1000;
    let uptimeString = clockString(uptime);
    let chatCount = Object.keys(global.db.data.chats).length;
    const chatEntries = Object.entries(conn.chats).filter(([jid, chat]) => jid && chat.isChats);
    const groupChats = chatEntries.filter(([jid]) => jid.endsWith('@g.us'));
    const userChats = chatEntries.filter(([jid]) => jid.endsWith('@s.whatsapp.net'));
    const { restrict } = global.db.data.settings[conn.user.jid] || {};
    const { autoread } = global.opts;
    const menu = 'Menu Audio';
    let startTime = performance.now();
    let endTime = performance.now();
    let responseTime = endTime - startTime;
    let sender = await conn.getName(message.sender);
    
    
    
    
    
  
    
    
    let messageOptions = {
        key: {
            participants: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            fromMe: false,
            id: 'Halo'
        },
        message: {
            audioMessage: {
                displayName: 'Audio Menu',
                vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
            }
        },
        participant: '0@s.whatsapp.net'
    };
    
    let menuText = `
══════ •⊰✧⊱• ══════
✧‌⃟ᗒ paguro
✧‌⃟ᗒ grasso/a
✧‌⃟ᗒ razzista
✧‌⃟ᗒ topolino
✧‌⃟ᗒ topa
✧‌⃟ᗒ woman
✧‌⃟ᗒ ohno
✧‌⃟ᗒ orcodio
✧‌⃟ᗒ rizz
✧‌⃟ᗒ troia
✧‌⃟ᗒ piedi
✧‌⃟ᗒ disco
> aggiornato al 16/05/25
══════ •⊰✧⊱• ══════
`.trim();
    
    const menuImage = 'https://th.bing.com/th/id/OIP.YffY3lG8146Qe1a6FmorlQHaHa?cb=iwc2&rs=1&pid=ImgDetMain';
    
    return conn.sendMessage(message.chat, {
        text: menuText,
        contextInfo: {
            externalAdReply: {
                title: `𝐩𝐡𝐢𝐬𝐡𝐲 𝐦𝐚𝐧𝐝𝐞𝐫𝐚 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨 𝐬𝐞 𝐮𝐧𝐚 𝐟𝐫𝐚𝐬𝐞`,
                body: `𝐜𝐨𝐧𝐭𝐢𝐞𝐧𝐞 𝐥𝐞 𝐩𝐚𝐫𝐨𝐥𝐞:`,
                thumbnailUrl: menuImage,
                sourceUrl: 'tiktoktoktiktok.com',
                mediaType: 1,
                renderLargerThumbnail: false
            },
            mentionedJid: [], // Deve essere un array, anche se vuoto
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401234816773@newsletter',
                serverMessageId: '',
                newsletterName: '' + (global.botName || 'aggiornamenti')
            }
        }
    }, { quoted: messageOptions });
};
    
handler.help = ['menuaudio'];
handler.tags = ['menu'];
handler.command = /^(audio)/i;
export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}