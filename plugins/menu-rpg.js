import os from 'os';
import util from 'util';
import humanReadable from 'human-readable';
import baileys from '@whiskeysockets/baileys';
import fs from 'fs';
import { performance } from 'perf_hooks';

let handler = async (message, { conn, usedPrefix }) => {
    let uptime = process.uptime() * 1000;
    let uptimeString = clockString(uptime);
    let userCount = Object.keys(global.db.data.users).length;
    const chats = Object.entries(conn.chats).filter(([jid, chat]) => jid && chat.isChats);
    const groupChats = chats.filter(([jid]) => jid.endsWith('@g.us'));
    const privateChats = chats.filter(([jid]) => jid.endsWith('@s.whatsapp.net'));
    const memoryUsage = process.memoryUsage();
    const { restrict } = global.db.data.settings[conn.user.jid] || {};
    const { autoread } = global.opts;
    const wm = 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!';
    let startTime = performance.now();
    let endTime = performance.now();
    let responseTime = endTime - startTime;
    let quotedMessage = await conn.loadMessage(message.chat);
    let contextInfo = {
        key: {
            participants: '0@s.whatsapp.net',
            fromMe: false,
            id: 'Halo'
        },
        message: {
            locationMessage: {
                name: '𝐌𝐄𝐍𝐔 𝐑𝐏𝐆',
                jpegThumbnail: await (await fetch('https://i.ibb.co/7d1hbwyQ/allalaallaal.png')).buffer(),
                vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
            }
        },
        participant: '0@s.whatsapp.net'
    };
    let menu = `
══════ •⊰⊱• ══════
                  📃 *𝙎𝙏𝘼𝙏𝙎* 

𝘥𝘢 𝘲𝘶𝘪 𝘱𝘶𝘰𝘪 𝘷𝘦𝘥𝘦𝘳𝘦 𝘪𝘭 𝘵𝘶𝘰 𝘮𝘦𝘯𝘶 𝘰𝘨𝘨𝘦𝘵𝘵𝘪/𝘴𝘵𝘢𝘵𝘪𝘴𝘵𝘪𝘤𝘩𝘦 𝘦 𝘢𝘭𝘵𝘳𝘰
✧ ᴘʀᴏꜰɪʟᴏ
> statistiche nel gioco
✧ ɪɴꜰᴏ
> statistiche generali nel gruppo
✧ ʟɪᴠᴇʟʟᴏ|ʟᴇᴠᴇʟ|ʟᴠʟ
> mostra il tuo livello attuale
✧ ʟᴇᴠᴇʟᴜᴘ|ʟᴠʟᴜᴘ
> aumenta di livello
✧ ᴄᴜʀᴀ
> curati la vita se hai delle pozioni, le trovi nel negozio
✧ ɴᴏᴍᴇ|ᴄᴀᴍʙɪᴀɴᴏᴍᴇ
> cambia il tuo nome
════════ •⊰⊱• ═══════
                 🛒 𝙉𝙀𝙂𝙊𝙕𝙄𝙊      

𝘵𝘪 𝘴𝘦𝘳𝘷𝘰𝘯𝘰 𝘥𝘰𝘭𝘤𝘪 𝘱𝘦𝘳 𝘤𝘰𝘮𝘱𝘳𝘢𝘳𝘦 𝘲𝘶𝘢𝘭𝘴𝘪𝘢𝘴𝘪 𝘰𝘨𝘨𝘦𝘵𝘵𝘰
✧ ꜱʜᴏᴘ
> menu del negozio
✧ ᴄᴏᴍᴘʀᴀ
✧ ᴠᴇɴᴅɪ
══════ •⊰⊱• ══════
                 🍬𝘾𝘼𝙍𝘼𝙈𝙀𝙇𝙇𝙀

𝘭𝘦 𝘤𝘢𝘳𝘢𝘮𝘦𝘭𝘭𝘦 𝘰 𝘥𝘰𝘭𝘤𝘪 𝘴𝘰𝘯𝘰 𝘭𝘢 𝘷𝘢𝘭𝘶𝘵𝘢 𝘥𝘦𝘭 𝘨𝘪𝘰𝘤𝘰, 𝘦𝘤𝘤𝘰 𝘤𝘰𝘮𝘦 𝘱𝘶𝘰𝘪 𝘨𝘶𝘢𝘥𝘢𝘳𝘵𝘦𝘭𝘦
✧ ʟᴀᴠᴏʀᴏ|ꜱᴄᴇɢʟɪʟᴀᴠᴏʀᴏ|ꜱᴇᴛᴊᴏʙ
> cercati un lavoro
ᴍɪꜱꜱɪᴏɴɪ ʟᴀᴠᴏʀᴀ|ᴡᴏʀᴋ
> fai soldi fatturando
✧ ᴘʀᴇɢᴀ
> meno soldi ma minore cooldown
✧ ʀᴜʙᴀ @
> ruba altri utenti 
✧ ᴅᴀɪʟʏ
> premio quotidiano
✧ ᴡᴀʟʟᴇᴛ
> vedi i tuoi soldi
✧ ᴅᴇᴘᴏꜱɪᴛᴀ [num]
> metti in banca i tuoi dolci
✧ ᴛʀᴀɴꜱꜰᴇʀɪꜱᴄɪ [num|oggetto]
> transferisci ad un altro utente i tuoi oggetti
✧ ᴛᴇꜱᴏʀᴏ
> ricevi grossi premi
✧ ꜱᴄᴀꜱꜱᴀ @
> scassina una cassaforte, ti servono le forcine dal negozio
✧ ᴍɪꜱꜱɪᴏɴɪʜᴇʟᴘ
> mostra tutti i comandi realtivi alle missioni
══════ •⊰⊱• ══════
                🎡𝙂𝙄𝙊𝘾𝙃𝙄

𝘢𝘵𝘵𝘪𝘷𝘪𝘵𝘢 𝘥𝘢 𝘧𝘢𝘳𝘦 𝘲𝘶𝘢𝘯𝘥𝘰 𝘵𝘪 𝘢𝘯𝘯𝘰𝘪
✧ ʙʟᴀᴄᴋᴊᴀᴄᴋ
✧ ꜱʟᴏᴛ
✧ ᴘᴏᴋᴇʀ
✧ ɢᴀʀᴀ @
══════ •⊰⊱• ══════
                🐯𝘼𝙉𝙄𝙈𝘼𝙇𝙄

𝘴𝘦 𝘩𝘢𝘪 𝘤𝘰𝘮𝘱𝘳𝘢𝘵𝘰 𝘶𝘯 𝘱𝘦𝘵 𝘥𝘢𝘭 𝘯𝘦𝘨𝘰𝘻𝘪𝘰 𝘤𝘪 𝘱𝘶𝘰𝘪 𝘪𝘯𝘵𝘦𝘳𝘢𝘨𝘪𝘳𝘦
✧ ʙᴀɢɴᴏ
✧ ᴄɪʙᴏ
✧ ᴄᴜʀɪᴏꜱɪᴛᴀ
✧ ᴄᴏᴍʙᴀᴛᴛɪ @
      ↳ ᴀᴛᴛᴀᴄᴄᴀ
      ↳ ᴅɪꜰᴇɴᴅɪ
      ↳ ᴀʙɪʟɪᴛᴀ
══════•⊰⊱•══════
                📊𝘼𝙕𝙄𝙊𝙉𝙄 𝙀 𝘾𝙍𝙔𝙋𝙏𝙊

𝘭𝘦 𝘢𝘻𝘪𝘰𝘯𝘪, 𝘤𝘳𝘺𝘱𝘵𝘰 𝘦 𝘮𝘰𝘯𝘦𝘵𝘦 𝘴𝘵𝘳𝘢𝘯𝘪𝘦𝘳𝘦 𝘵𝘪 𝘢𝘪𝘶𝘵𝘦𝘳𝘢𝘯𝘯𝘰 𝘢 𝘴𝘢𝘭𝘪𝘳𝘦 𝘤𝘰𝘯 𝘪 𝘥𝘰𝘭𝘤𝘪 𝘴𝘦 𝘴𝘵𝘢𝘪 𝘢𝘵𝘵𝘦𝘯𝘵𝘰
✧ ᴍᴇʀᴄᴀᴛᴏ ʙᴏʀꜱᴀ
> mostra i dati piu recenti
✧ ᴍᴇʀᴄᴀᴛᴏ ɢʀᴀꜰɪᴄᴏ [ɴᴏᴍᴇ ᴄʀʏᴘᴛᴏ]
> mostra il grafico della cryto moneta
✧ ᴍᴇʀᴄᴀᴛᴏ ᴄᴏᴍᴘʀᴀ/ᴠᴇɴᴅɪ
> scambia la valuta fra il valore dei dolci con la crypto
✧ ᴀᴢɪᴏɴɪ
> mostra che azioni o crypto hai in tuo possesso
════════•⊰⊱•════════
                🧙🏻‍♂️𝙈𝘼𝙂𝙄𝘼
𝘦𝘯𝘵𝘳𝘢 𝘯𝘦𝘭 𝘮𝘰𝘯𝘥𝘰 𝘥𝘪 𝘩𝘢𝘳𝘳𝘺 𝘱𝘰𝘵𝘵𝘦𝘳
✧ ʀᴇɢ
> registrati se sei un nuovo utente
✧ ʙᴀᴄᴄʜᴇᴛᴛᴀ
> compra una bacchetta, la prima e gratis e random
✧ ʙᴏʀꜱᴀ
> mostra le tue statistiche ed oggetti
✧ ᴄᴀꜱᴀᴛᴀ
> il cappello parlate scegliera la tua casata
✧ ꜱᴛᴜᴅɪᴀ
> impara nuove magie
✧ ᴜꜱᴀ
> lancia un incantesimo
✧ ᴅᴜɴɢᴇᴏɴ
> entra nel dungeon e combatti contro i nemici



  ══════ •⊰✧⊱• ══════
> *MADE BY🏅    𓊈ҽαʂƚҽɾ𓊉𓆇𓃹 aggiornato al 11/05/25* 📅`
  const menuImage = 'https://th.bing.com/th/id/OIP.vQ2tzt2wjroqtFZ9t3LpywHaHa?cb=iwc2&rs=1&pid=ImgDetMain';
    

    // Invia messaggio con immagine di contesto
    return conn.sendMessage(message.chat, {
        text: menu,
        contextInfo: {
            externalAdReply: {
                title: `menu dedicato al gioco di ruolo su whatsapp `,
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
                newsletterName: 'aggiornamenti 🎌 '
            }
        }
    }, { quoted: contextInfo });
};

handler.help = ['menuadm'];
handler.tags = ['menuadm'];
handler.command = /^(rpg|menurpg)$/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return console.log({ ms, h, m, s }), [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
