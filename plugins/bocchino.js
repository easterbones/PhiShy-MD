import os from 'os';
import util from 'util';
import sizeFormatter from 'human-readable';
import MessageType from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';

let handler = async (m, { conn, usedPrefix, text, participants }) => {
  // Verifica se l'utente è admin
  const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  const isAdmin = groupMetadata ? groupMetadata.participants.some(p => p.id === m.sender && p.admin) : false;

  if (!isAdmin) {
    return conn.sendMessage(
      m.chat,
      { text: "❌ Questo comando è riservato solo agli amministratori." },
      { quoted: m }
    );
  }

  let _uptime = process.uptime() * 1000;
  let uptime = clockString(_uptime);
  let old = performance.now();
  let neww = performance.now();
  let speed = (neww - old).toFixed(4);

  let { key } = await conn.sendMessage(m.chat, { text: "୧⍤⃝" }, { quoted: m });
  const array = [
    "୧⍤⃝  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧⍤⃝ ̶͞ لں͞", "୧⍤⃝Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧⍤⃝ ̶͞ لں͞",
    "୧⍤⃝ Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧⍤⃝ ̶͞ لں͞", "୧⍤⃝ لں͞", "୧⍤⃝ ̶͞ لں͞", "୧⍤⃝  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞",
    "୧⍤⃝  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧⍤⃝ ̶͞ لں͞", "୧⍤⃝Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧⍤⃝ ̶͞ لں͞",
    "୧⍤⃝ Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧⍤⃝ ̶͞ لں͞", "୧⍤⃝ لں͞", "୧⍤⃝ ̶͞ لں͞", "୧⍤⃝  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞"
  ];

  for (let item of array) {
    await conn.sendMessage(m.chat, { text: `${item}`, edit: key }, { quoted: m });
    await new Promise(resolve => setTimeout(resolve, 20)); // Ritardo di 20 ms
  }

  let prova = {
    "key": { "participants": "0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" },
    "message": {
      "contactMessage": {
        displayName: 'PHISHY',
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  };

  return conn.sendMessage(
    m.chat,
    { text: `${text} ha ingoiato!😋💦`.trim(), edit: key, mentions: [m.sender] },
    { quoted: m }
  );
};

handler.help = ['bocchino @'];
handler.tags = ['fun'];
handler.command = /^(bocchino|pompino|pompa)$/i;

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  console.log({ ms, h, m, s });
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
