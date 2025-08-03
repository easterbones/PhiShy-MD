import os from 'os';
import util from 'util';
import humanReadable from 'human-readable';
import baileys from '@whiskeysockets/baileys';
import fs from 'fs';
import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

let handler = async (message, { conn, usedPrefix }) => {
    let uptime = process.uptime() * 1000;
    let uptimeString = clockString(uptime);
    let userCount = Object.keys(global.db.data.users).length;
    const chats = Object.entries(conn.chats).filter(([, chat]) => chat.isChats);
    const groupChats = chats.filter(([id]) => id.endsWith('@g.us'));
    const newsletterChats = chats.filter(([id]) => id.endsWith('120363175463922716@newsletter'));
    const memoryUsage = process.memoryUsage();
    const { restrict } = global.db.data.settings[conn.user.jid] || {};
    const { autoread } = global.opts;
    let start = performance.now();
    let end = performance.now();
    let speed = (end - start).toFixed(3);
    const user = global.db.data.users[message.sender];
    let botName = global.db.data.nomedelbot || 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!';
    let response = await fetch('https://th.bing.com/th/id/OIP.huGbkzetMLlV2ugCC78dQQHaJM?rs=1&pid=ImgDetMain');
    if (!response.ok) throw new Error('errore durante la richiesta: ' + response.statusText);
    let text = `I AM SPEED MADAFAKA: ${speed}s 🌩️\n\nsai che non dormo da:\n ${uptimeString}\n`.trim();
    conn.sendMessage(message.chat, {
        text: text,
        contextInfo: {
            mentionedJid: conn.parseMention(wm),
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401234816773@newsletter',
                serverMessageId: '',
                newsletterName: botName
            }
        }
    });
};

handler.command = ['ping', 'speed'];
handler.tags = ['info', 'tools'];
handler.help = ['ping'];
handler.mods = true;

export default handler;

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *giorni*\n ', h, ' *ore*\n', m, ' *minuti*\n', s, ' *secondi*\n'].map(v => v.toString().padStart(2, 0)).join('')
}
