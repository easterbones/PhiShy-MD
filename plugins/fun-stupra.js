import os from 'os';
import util from 'util';
import sizeFormatter from 'human-readable';
import fs from 'fs';
import { performance } from 'perf_hooks';

let handler = async (m, { conn, usedPrefix, text }) => {
  let _uptime = process.uptime() * 1000;
  let uptime = clockString(_uptime);
  let old = performance.now();
  // Simulazione di operazione
  await new Promise(resolve => setTimeout(resolve, 100));
  let neww = performance.now();
  let speed = (neww - old).toFixed(4);

  let { key } = await conn.sendMessage(m.chat, { text: "● █▀█▄" }, { quoted: m });
  const array = [
    "● █▀█▄  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧ ̶͞● █▀█▄ لں͞", "● █▀█▄  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧ ̶͞● █▀█▄ لں͞", 
    "● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "● █▀█▄  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧ ̶͞● █▀█▄ لں͞", 
    "● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "● █▀█▄  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧ ̶͞● █▀█▄ لں͞", 
    "● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "● █▀█▄  Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", "୧ ̶͞● █▀█▄ لں͞", 
    "● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞", 
    "● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞",
  ];

  for (let item of array) {
    await conn.sendMessage(m.chat, { text: `${item}`, edit: key }, { quoted: m });
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay 500 ms
  }

  return conn.sendMessage(m.chat, {
    text: `Oh,  ${text}  sei stato inculato per bene.`,
    mentions: [m.sender]
  }, { quoted: m });
};

handler.help = ['menu'];
handler.tags = ['divertente'];
 handler.admin = true
handler.command = /^(stupra)$/i;

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
1