import os from 'os';
import util from 'util';
import sizeFormatter from 'human-readable';
import MessageType from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';

let handler = async (m, { conn, usedPrefix, text }) => {
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)
let old = performance.now()
let neww = performance.now()
let speed =  (neww - old).toFixed(4)
  let { key } = await conn.sendMessage(m.chat, { text: "Ora faccio un ditalino a " + text}, { quoted: m });
  const array = [
  "✌🏻\x0aㅤ", "🤟🏻\x0aㅤ", "ㅤ\x0a☝🏻", "☝🏻\x0aㅤ",  "ㅤ\x0a✌🏻", "👋🏻\x0aㅤ", "ㅤ\x0a👋🏻",  "✌🏻\x0aㅤ", "✌🏻\x0aㅤ", "🤟🏻\x0aㅤ", "ㅤ\x0a☝🏻", "☝🏻\x0aㅤ",  "ㅤ\x0a✌🏻", "👋🏻\x0aㅤ", "ㅤ\x0a👋🏻",  "✌🏻\x0aㅤ", "✌🏻\x0aㅤ", "🤟🏻\x0aㅤ", "ㅤ\x0a☝🏻", "☝🏻\x0aㅤ",  "ㅤ\x0a✌🏻", "👋🏻\x0aㅤ", "ㅤ\x0a👋🏻",  "✌🏻\x0aㅤ", 
  ];

  for (let item of array) {
    await conn.sendMessage(m.chat, { text: `${item}`, edit: key }, { quoted: m });
    await new Promise(resolve => setTimeout(resolve, 20)); // Delay 5 seconds
  }
let prova = { "key": {"participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo"
}, "message": { 
"contactMessage": { displayName: 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!',
"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD`
}}, "participant": "0@s.whatsapp.net"
}
  return conn.sendMessage(m.chat, { text: "Oh " + text + "  è venuta!🥵".trim() , edit: key, mentions: [m.sender] }, { quoted: m });
};

handler.help = ['ditalino @'];
handler.tags = ['fun'];
handler.command = /^(ditalino)$/i;

export default handler;


function clockString(ms) {
let h = Math.floor(ms / 3600000)
let m = Math.floor(ms / 60000) % 60
let s = Math.floor(ms / 1000) % 60
console.log({ms,h,m,s})
return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')}