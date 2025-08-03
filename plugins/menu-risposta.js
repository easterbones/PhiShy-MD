import os from 'os';
import util from 'util';
import humanReadable from 'human-readable';
import baileys from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';

let handler = async ( message,{ conn, usedPrefix }) => {
       if (message.key.fromMe) return;  
    
    
    let uptime = process.uptime() * 1000;
    let uptimeString = clockString(uptime);
    let chatCount = Object.keys(global.db.data.chats).length;
    const chatEntries = Object.entries(conn.chats).filter(([jid, chat]) => jid && chat.isChats);
    const groupChats = chatEntries.filter(([jid]) => jid.endsWith('@g.us'));
    const userChats = chatEntries.filter(([jid]) => jid.endsWith('@s.whatsapp.net'));
    const memoryUsage = process.memoryUsage();
    const { restrict } = global.db.data.settings[conn.user.jid] || {};
    const { autoread } = global.opts;
    const menu = 'RISPOSTE AUDIO';
    let startTime = performance.now();
    let endTime = performance.now();
    let responseTime = endTime - startTime;
    let sender = await conn.getName(message.sender);
    
    const {
        talk
    } = global.db.data.chats[message.chat];
    let contextInfo = {
        key: {
            participants: '0@s.whatsapp.net',
            fromMe: false,
            id: 'Halo'
        },
        message: {
            locationMessage: {
                name: '𝐌𝐄𝐍𝐔 𝐓𝐀𝐋𝐊',
                jpegThumbnail: await (await fetch('https://i.ibb.co/7d1hbwyQ/allalaallaal.png')).buffer(),
                vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
            }
        },
        participant: '0@s.whatsapp.net'
    };
let responseMessage = `
══════ •⊰✧⊱• ══════
✧‌⃟ᗒ 𝘤𝘰𝘮𝘦?
✧‌⃟ᗒ 𝘢𝘮𝘰/𝘢𝘮𝘰𝘳𝘦
✧‌⃟ᗒ 𝘣𝘢𝘴𝘵𝘢
✧‌⃟ᗒ 𝘣𝘶𝘰𝘯𝘨𝘪𝘰𝘳𝘯𝘰/𝘣𝘨
✧‌⃟ᗒ 𝘣𝘰𝘵
✧‌⃟ᗒ 𝘫𝘶𝘳𝘪𝘥𝘢
✧‌⃟ᗒ 𝘮𝘪𝘯𝘢𝘤𝘤𝘪𝘢
✧‌⃟ᗒ 𝘯𝘢𝘱𝘰𝘭𝘪
✧‌⃟ᗒ 𝘱𝘩𝘪𝘴𝘩𝘺
✧‌⃟ᗒ 𝘳𝘪𝘮𝘢𝘴𝘵𝘰
✧‌⃟ᗒ 𝘴𝘦𝘨𝘳𝘦𝘵𝘰
✧‌⃟ᗒ 𝘷𝘢𝘧𝘧𝘢𝘯𝘤𝘶𝘭𝘰
✧‌⃟ᗒ 𝘭𝘪𝘵𝘦
✧‌⃟ᗒ 𝘪𝘯𝘴𝘶𝘭𝘵𝘰
✧‌⃟ᗒ 𝘧𝘰𝘵𝘰𝘵𝘦𝘵𝘢

> aggiornato al 16/02/25

══════ •⊰✧⊱• ══════
`.trim();

 const menuImage = 'https://static.vecteezy.com/system/resources/previews/012/659/103/original/talking-man-icon-great-for-logos-and-voice-control-interactions-flat-concept-of-talking-head-isolated-on-white-background-vector.jpg';
    

    // Invia messaggio con immagine di contesto
    return conn.sendMessage(message.chat, {
        text: responseMessage,
        contextInfo: {
            externalAdReply: {
                title: `phishy risponde in chat se scrivi:`,
                body: `${talk ? '🟢 𝐭𝐚𝐥𝐤 attivo' : '🔴 𝐭𝐚𝐥𝐤 non attivo'}`,
                thumbnailUrl: menuImage,
                sourceUrl: 'tiktoktoktiktok.com',
                mediaType: 1,
                renderLargerThumbnail: false
            },
            mentionedJid: conn.parseMention(wm),
            forwardingScore: 1,
            isForwarded: true,
            forwardedMessageInfo: {
                messageId: message.id,
                chatId: message.chat,
                senderId: message.sender
            },
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401234816773@newsletter',
                serverMessageId: '',
                newsletterName: 'aggiornamenti 🎌 '
            }
        }
    }, { quoted: contextInfo });
};


handler.command = /^(risposta)/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}