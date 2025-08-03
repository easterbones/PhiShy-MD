import os from 'os';
import util from 'util';
import humanReadable from 'human-readable';
import baileys from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';

let handler = async (message,{ conn, usedPrefix, }) => {
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
                displayName: 'Audio',
                vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
            }
        },
        participant: '0@s.whatsapp.net'
    };
    
    let responseMessage = `
══════ •⊰✧⊱• ══════
✧ USO DEL COMANDO
respondi a un audio con :
════════════════
✧‌⃟ᗒ ${usedPrefix}blown
✧‌⃟ᗒ ${usedPrefix}bass
✧‌⃟ᗒ ${usedPrefix}deep
✧‌⃟ᗒ ${usedPrefix}reverse
✧‌⃟ᗒ ${usedPrefix}chipmunk
✧‌⃟ᗒ ${usedPrefix}squirrel
✧‌⃟ᗒ ${usedPrefix}robot
✧‌⃟ᗒ ${usedPrefix}slow
✧‌⃟ᗒ ${usedPrefix}smooth
✧‌⃟ᗒ ${usedPrefix}earrape
✧‌⃟ᗒ ${usedPrefix}nightcore
✧‌⃟ᗒ ${usedPrefix}fast
══════ •⊰✧⊱• ══════
`.trim();
    conn.reply(message.chat, responseMessage, messageOptions, message, false);
};

handler.help = ['menuaudio'];
handler.tags = ['menu'];
handler.command = /effetti/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}