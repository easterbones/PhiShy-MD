import os from 'os';
import util from 'util';
import humanReadable from 'human-readable';
import baileys from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';

let handler = async (message, { conn, usedPrefix }) => {
    let uptime = process.uptime() * 1000;
    let uptimeString = clockString(uptime);
    let chatCount = Object.keys(global.db.data.chats).length;
    let groupChats = Object.entries(conn.chats).filter(([jid, chat]) => jid && chat.isChats);
    let groupCount = groupChats.filter(([jid]) => jid.endsWith('@g.us')).length;
    let privateCount = groupChats.filter(([jid]) => jid.endsWith('@s.whatsapp.net')).length;
    let memoryUsage = process.memoryUsage();
    let { restrict } = global.db.data.settings[conn.user.jid] || {};
    let { autoread } = global.opts;
    let botName = global.db.data.settings.nomedelbot || 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!';

    let startTime = performance.now();
    let endTime = performance.now();
    let responseTime = endTime - startTime;
    const menuImage = 'https://www.pngitem.com/pimgs/m/71-715964_owner-owner-icon-transparent-hd-png-download.png';

    let contextInfo =  {
        key: {
            participants: '0@s.whatsapp.net',
            fromMe: false,
            id: 'Halo'
        },
        message: {
            locationMessage: {
                name: '𝐌𝐄𝐍𝐔 𝐃𝐈 𝐄𝐀𝐒𝐓𝐄𝐑',
                jpegThumbnail: await (await fetch('https://i.ibb.co/7d1hbwyQ/allalaallaal.png')).buffer(),
                vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
            }
        },
        participant: '0@s.whatsapp.net'
    };

    function formatMenuLine(cmd, desc, indent = 4, maxWidth = 38) {
        // cmd: nome comando, desc: spiegazione, indent: spazi a sinistra per la spiegazione
        let line = `${cmd}`;
        let result = line + '\n';
        let words = desc.split(' ');
        let current = ' '.repeat(indent);
        let firstLine = true;
        for (let w of words) {
            if ((current + w).length > maxWidth) {
                result += current.trimEnd() + '\n' + ' '.repeat(indent) + w + ' ';
                current = ' '.repeat(indent) + w + ' ';
                firstLine = false;
            } else {
                current += w + ' ';
            }
        }
        result += current.trimEnd();
        return result;
    }

    let menuText = `
╭━━━⚡ 𝑴𝑬𝑵𝑼 𝐎𝐖𝐍𝐄𝐑 ⚡━━━╮

📋 *Comandi per proprietari e admin*

╭─✦ *GESTIONE* ✦─╮
${formatMenuLine('👑 ᴀᴅᴅᴏᴡɴᴇʀ', 'Aggiungi un proprietario')}
${formatMenuLine('👑 ʀᴇᴍᴏᴠᴇᴏᴡɴᴇʀ', 'Rimuovi un proprietario')}
${formatMenuLine('👥 ᴀɢɢɪᴜɴɢɪɢʀᴜᴘᴘɪ', 'Aggiungi un gruppo')}
${formatMenuLine('🔒 ʙᴀɴᴄʜᴀᴛ', 'Blocca i comandi in un gruppo')}
${formatMenuLine('🔓 ᴜɴʙᴀɴᴄʜᴀᴛ', 'Sblocca un gruppo')}
${formatMenuLine('🔒 ʙᴀɴᴜꜱᴇʀ', 'Blocca i comandi a un utente')}
${formatMenuLine('🔓 ᴜɴʙᴀɴᴜꜱᴇʀ', 'Sblocca un utente')}
${formatMenuLine('📋 ʙᴀɴʟɪꜱᴛ', 'Lista di utenti e gruppi bannati')}
${formatMenuLine('📋 ʙʟᴏᴄᴋʟɪꜱᴛ', 'Lista di utenti bloccati')}
${formatMenuLine('🔒 ʙʟᴏᴄᴋ|ᴜɴʙʟᴏᴄᴋ', 'Blocca o sblocca un utente in privato')}
╰─────────────────╯

╭─✦ *MODIFICA* ✦─╮
${formatMenuLine('🛠️ ᴍᴏᴅɪ꜀ɪᴄᴀ', 'Modifica parametri di un utente')}
${formatMenuLine('🛠️ ᴏᴍɴɪɢᴏᴅ', 'Alternativa al comando modifica')}
${formatMenuLine('📋 inizializzadb', 'Modifica un valore nel database')}
╰─────────────────╯

╭─✦ *PLUGINS* ✦─╮
${formatMenuLine('📂 ɢᴇᴛꜰɪʟᴇ|ᴘʟᴜɢɪɴ', 'Mostra i file di un plugin')}
${formatMenuLine('📂 ᴅᴇʟᴘʟᴜɢɪɴ', 'Rimuovi un plugin')}
${formatMenuLine('📂 ꜱᴀʟᴠᴀᴘʟᴜɢɪɴ', 'Salva un plugin')}
${formatMenuLine('📂 ɢɪᴛʜᴜʙ', 'Installa un plugin da GitHub')}
${formatMenuLine('📂 ɴᴏᴅᴇ', 'Installa un plugin da un link')}
╰─────────────────╯

╭─✦ *ALTRO* ✦─╮
${formatMenuLine('📋 ɪᴅ', "Mostra l'ID del gruppo")}
${formatMenuLine('📋 cleartmp', 'Elimina i file temporanei')}
${formatMenuLine('📋 ʟᴇᴀᴠᴇ', 'Il bot esce dal gruppo')}
${formatMenuLine('📋 ʟɪꜱᴛᴀᴍᴜᴛɪ', 'Lista di utenti mutati')}
${formatMenuLine('📋 ᴘʀᴇꜰɪꜱꜱᴏ', 'Cambia prefisso per i comandi')}
${formatMenuLine('📋 setgruppi', 'Cambia nome al gruppo')}
${formatMenuLine('📋 ꜱᴇᴛᴘᴘ', 'Cambia la foto del profilo del bot')}
╰─────────────────╯

•────────────•⟢
> *MADE BY🏅 𓊈ҽαʂƚҽɾ𓊉𓆇𓃹*
•────────────•⟢
Aggiornato al 29/07/25 📅
`.trim();

      return conn.sendMessage(message.chat, {
        text: menuText,
        contextInfo: {
            externalAdReply: {
                title: `Comandi speciali per owner`,
                body: `Non imitare`,
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
                newsletterName: 'Aggiornamenti 🎌 '
            }
        }
    }, { quoted: contextInfo });
};

handler.help = ['menuowner'];
handler.tags = ['menu'];
handler.command = /^(owner|menuownwer)$/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
