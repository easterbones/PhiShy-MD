import os from 'os';
import util from 'util';
import humanReadable from 'human-readable';
import baileys from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let uptime = process.uptime() * 1000;
    let uptimeString = clockString(uptime);
    let userCount = Object.keys(global.db.data.users).length;
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const groups = chats.filter(([id]) => id.endsWith('@g.us'));
    const privateChats = chats.filter(([id]) => !id.endsWith('@g.us'));
    const memoryUsage = process.memoryUsage();
    const { restrict } = global.db.data.settings[conn.user.jid] || {};
    const { autoread } = global.opts;
    let start = performance.now();
    let end = performance.now();
    let speed = end - start;
    let sender = await conn.getName(m.sender);
   const response = await fetch('https://cdn.pixabay.com/photo/2016/06/15/15/02/info-1459077_1280.png');
const buffer = await response.arrayBuffer();
const base64Image = Buffer.from(buffer).toString('base64');

// Definiamo l'oggetto globale per il messaggio quotato
let quotedMessage = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
    message: {
      locationMessage: {
        name: "𝐌𝐞𝐧𝐮",
        jpegThumbnail: fs.readFileSync(path.join('./src/img/menu/book.png'))
      }
    },
    participant: "0@s.whatsapp.net"
  };

    let menu = `
╭━〔 ⚡𝑴𝑬𝑵𝑼 ⚡ 〕━┈⊷  
┃📋╭━━━━━━━━━━━━━·๏  
┃📋┃• 𝘤𝘰𝘮𝘢𝘯𝘥𝘪 𝘤𝘩𝘦 𝘵𝘶𝘵𝘵𝘪 
┃📋┃ 𝘱𝘰𝘴𝘴𝘰𝘯𝘰 𝘶𝘵𝘪𝘭𝘪𝘻𝘻𝘢𝘳𝘦 
┃📋╰━━━━━━━━━━━━┈⊷  
┃
┃🛠️╭─✦ *TOOLS* ✦═╗  
┃🖼️┃• ʜᴅ
┃🖼️┃• ɪᴍɢ
┃📄┃• ᴅᴏᴄ
┃🎵┃• ᴛɪᴋᴛᴏᴋ
┃📸┃• ɪɴꜱᴛᴀɢʀᴀᴍ
┃🎲┃• ᴅᴀᴅᴏ
┃🌦️┃• ᴍᴇᴛᴇᴏ
┃👤┃• ɪɴꜰᴏ
┃👑┃• ᴘʀᴏᴘʀɪᴇᴛᴀʀɪᴏ
┃🏓┃• ᴘɪɴɢ
┃🎤┃• ʟʏʀɪᴄꜱ
┃🗣️┃• ꜱᴛᴛ (speech to text)
┃🔍┃• ɪɢꜱᴛᴀʟᴋ
┃🧑‍🎤┃• ᴛᴏᴀɴɪᴍᴇ
┃🖼️┃• ᴛᴏɪᴍɢ
┃🎶┃• ᴛᴏᴍᴘ3
┃🎬┃• ᴛᴏᴠɪᴅᴇᴏ 
┃🪄┃• ꜱᴛɪᴄᴋᴇʀ|ꜱ
┃🤖┃• ᴘʜɪꜱʜʏ (ᴀɪ)
┃🦇┃• ʙᴀᴛᴍᴀɴ (ai)
┃👥┃• ᴄᴏɴᴛᴀᴜᴛᴇɴᴛɪ
┃🔎┃• ɪɴꜱᴘᴇᴢɪᴏɴᴀ
┃🌐┃• ꜱɪᴛᴏ
┃🦠┃• ᴠɪʀᴜꜱ
┃🌍┃• ᴛʀᴀɴꜱʟᴀᴛᴇ
┃📚┃• ᴡɪᴋɪ
┃♂️┃• ɢᴇɴᴅᴇʀ
┃🗺️┃• ᴘᴀᴇꜱᴇ
┃🎬┃• ᴄᴏɴꜱɪɢʟɪᴀꜰɪʟᴍ
┃🤐┃• ꜰɪʟᴛʀᴀ
┃📚┃• ʀɪᴀssᴜɴᴛᴏ
┃🛠️╰━━━━━━━━━━━━┈⊷
┃
┃🎭╭─✦ *AZIONI* ✦═╗
┃💃┃• ᴅᴀɴᴄᴇ
┃💍┃• ꜱᴘᴏꜱᴀ
┃💔┃• ᴅɪᴠᴏʀᴢɪᴀ
┃🗡️┃• ʙᴀɴᴋᴀɪ
┃🐶┃• ʙᴏɴᴋ
┃👆┃• ᴅɪᴛᴀʟɪɴᴏ
┃✋┃• ꜱᴇɢᴀ
┃📺┃• ꜱꜰɪᴅᴀ
┃🤼┃• ᴡᴡᴇ
┃🤗┃• ᴀʙʙʀᴀᴄᴄɪᴏ
┃🖕┃• ɪɴꜱᴜʟᴛᴀ
┃💢┃• ʟɪᴛᴇ (ʟɪᴛɪɢᴀʀᴇ)
┃📺┃• ᴀɴɪᴍᴇɪɴꜰᴏ
┃📺┃• ᴍᴀɴɢᴀɪɴꜰᴏ
┃📏┃• ᴍɪꜱᴜʀᴀ ᴘᴇɴᴇ|ʙᴏᴄᴄᴇ
┃📷┃• Qʀᴄᴏᴅᴇ
┃🤵🏻┃• ꜱᴘᴏꜱᴀᴍɪ
┃🪢┃• ʟᴇɢᴀ
┃🎭╰━━━━━━━━━━━━┈⊷
┃
┃🏅╭──✦ *TOP* ✦═╗
┃🏆┃• ᴛᴏᴘ
┃🙏┃• ᴛᴏᴘʙᴇꜱᴛᴇᴍᴍɪᴇ
┃🍬┃• ᴛᴏᴘᴅᴏʟᴄɪ
┃🏳️‍🌈┃• ᴛᴏᴘɢᴀʏ
┃🐒┃• ᴛᴏᴘꜱᴄɪᴍᴍɪᴇ
┃📽️┃• ᴛᴏᴘ5
┃📽️┃• ꜱᴇᴛᴛɪᴍᴀɴᴀ
┃🏅╰━━━━━━━━━━━━┈⊷
┃
┃🎰╭─✦*GIOCHI* ✦═╗
┃🃏┃• ʙʟᴀᴄᴋᴊᴀᴄᴋ
┃🎰┃• ꜱʟᴏᴛ
┃♠️┃• ᴘᴏᴋᴇʀ
┃🏁┃• ɢᴀʀᴀ @
┃➗┃• ᴍᴀᴛʜ
┃🎵┃• ᴄᴀɴᴢᴏɴᴇ
┃🎭┃• ᴏʙʙʟɪɢᴏ|ᴠᴇʀɪᴛᴀ
┃❌┃• ᴛʀɪꜱꜱ
┃🥊┃• ᴄꜰꜱ 
┃🎯┃• ᴍɪꜱꜱɪᴏɴɪ
┃📝┃↳  ᴍɪꜱꜱɪᴏɴɪʜᴇʟᴘ
┃✅┃↳  ᴀᴄᴄᴇᴛᴛᴀ
┃📋┃↳  ᴍʏᴍɪꜱꜱɪᴏɴɪ
┃❎┃↳  ᴀɴɴᴜʟʟᴀ
┃🔎┃↳  ᴠᴇʀɪꜰɪᴄᴀ
┃🔋┃↳  ʀɪᴄᴀʀɪᴄᴀᴍɪꜱꜱɪᴏɴɪ
┃🎰╰━━━━━━━━━━━━┈⊷
┃
┃🎉╭───✦*FUN* ✦═╗
┃🐐┃• ᴄʀ7
┃📸┃• ꜰᴏᴛᴏᴛᴇᴛᴀ
┃😂┃• ʀɪᴅɪ
┃💌┃• ᴀᴍᴏʀᴇ
┃😳┃• ɢᴜɪʟᴛʏ
┃🎴┃• ʜᴏʀɴʏᴄᴀʀᴅ
┃🚔┃• ᴊᴀɪʟ
┃🥙┃• ᴋᴇʙᴀʙ
┃😡┃• ᴏᴅɪᴏ
┃🤝┃• ʀɪꜱᴘᴇᴛᴛᴏ
┃🐱┃• ɢᴀᴛᴛᴏ
┃🎭┃• ᴘᴇʀꜱᴏɴᴀʟɪᴛᴀ
┃😃┃• ᴇᴍᴏᴊɪᴍɪx
┃🅰️┃• ᴀᴛᴛᴘ|ᴛᴛᴘ
┃🍝┃• ʀɪᴄᴇᴛᴛᴀ
┃🏎️┃• ꜰ1
┃🏷️┃• ʀɪɴᴏᴍɪɴᴀ (animali)
┃🎉╰━━━━━━━━━━━━┈⊷
╰━━━━━━━━━━━━━┈⊷  
•────────────•⟢
> *MADE BY🏅 𓊈ҽαʂƚҽɾ𓊉𓆇𓃹 
•────────────•⟢
aggiornato al 02/08/25* 📅
`.trim();

    // Immagine di contesto
    const menuImage = 'https://th.bing.com/th/id/R.12b054b2069cd70ad3fccd5edc437c09?rik=h%2bD5HqD31axS2w&riu=http%3a%2f%2fimmagini.disegnidacolorareonline.com%2fcache%2fdata%2fdisegni-colorati%2fscuola%2fdisegno-libri-scolastici-colorato-660x847.jpg&ehk=QI2r4Z7s4kGmi%2b1JHvliI2scIKeQYWw%2bioD8hTAphDs%3d&risl=&pid=ImgRaw&r=0';
    
        const wm = 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!';
    // Invia messaggio con immagine di contesto
    return conn.sendMessage(m.chat, {
        text: menu,
        contextInfo: {
            externalAdReply: {
                title: `prima del comando scrivi . # / *`, 
                body: `es: .info`,
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
                newsletterName: 'aggiornamenti 🎌 '
            }
        }
    }, { quoted: quotedMessage });
};

handler.help = ['menu'];
handler.tags = ['menu'];
handler.command = /^(menugruppo|gruppo)$/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
