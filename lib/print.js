import { parsePhoneNumber } from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const terminalImage = global.opts['img'] ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
    let _name = await conn.getName(m.sender);
    const phoneNumber = parsePhoneNumber('+' + m.sender.replace('@s.whatsapp.net', ''));
    const sender = phoneNumber.valid ? phoneNumber.number.international : m.sender;

    const botPhoneNumber = parsePhoneNumber('+' + (conn.user?.jid || '').replace('@s.whatsapp.net', ''));
    const me = botPhoneNumber.valid ? botPhoneNumber.number.international : conn.user?.jid || '';

    let chat = await conn.getName(m.chat);
    let img;
    try {
        if (global.opts['img']) {
            img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false;
        }
    } catch (e) {
        console.error(e);
    }
    let filesize = (m.msg ?
        m.msg.vcard ?
            m.msg.vcard.length :
            m.msg.fileLength ?
                m.msg.fileLength.low || m.msg.fileLength :
                m.msg.axolotlSenderKeyDistributionMessage ?
                    m.msg.axolotlSenderKeyDistributionMessage.length :
                    m.text ?
                        m.text.length :
                        0
            : m.text ? m.text.length : 0) || 0;
    let user = (global.db && global.db.data && global.db.data.users) ? global.db.data.users[m.sender] : undefined;

    let oraAttuale = new Date();
    let oraItaliana = oraAttuale.toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let chatName = chat ? (m.isGroup ? 'Gruppo: ' + chat : 'Chat privata: ' + chat) : '';
    
    console.log(`${chalk.redBright.bgWhite(global.nomebot)}\n\n╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
➤ ${chalk.red('%s')}
➤ ${chalk.hex('#FFA500')(oraItaliana)}
➤ ${chalk.yellow('%s')}
➤ ${chalk.green('%s')} ${chalk.cyan('[%s %sB]')}
➤ ${chalk.blue('%s')}
➤ ${chalk.magenta('%s')}${chalk.red('%s')}
➤ ${chalk.cyan(chatName)}
➤ ${chalk.white('%s')}
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
`.trim(),

me + ' ~' + conn.user.name,
m.messageStubType ? m.messageStubType : 'WAMessageStubType',
filesize,
filesize === 0 ? 0 : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1),
['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || '',
sender,
m ? m.exp : '?',
user ? '|' + user.exp + '|' + user.limit : '' + ('|' + user.level),
m.mtype ? m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) : ''
);
    if (img) console.log(img.trimEnd());
    if (typeof m.text === 'string' && m.text) {
        let log = m.text.replace(/\u200e+/g, '');
        let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
        let mdFormat = (depth = 4) => (_, type, text, monospace) => {
            let types = {
                _: 'italic',
                '*': 'bold',
                '~': 'strikethrough'
            };
            text = text || monospace;
            let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
            return formatted;
        };
        if (log.length < 4096) {
            log = log.replace(urlRegex, (url, i, text) => {
                let end = url.length + i;
                return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url;
            });
        }
        log = log.replace(mdRegex, mdFormat(4));
        if (m.mentionedJid) {
            for (let user of m.mentionedJid) {
                let name = '';
                try {
                    name = await conn.getName(user);
                } catch (e) {
                    name = String(user);
                }
                log = log.replace('@' + String(user).split('@')[0], chalk.blueBright('@' + name));
            }
        }
        try {
            console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log);
        } catch (e) {
            console.log('Errore nella stampa del messaggio:', e, '\nMessaggio:', typeof log === 'string' ? log : String(log));
        }
    }
    // Sanitize the phone number input to ensure proper formatting
    // Ensure all values are properly converted to strings
    if (m.messageStubParameters) {
        console.log(m.messageStubParameters.map(jid => {
            try {
                jid = String(conn.decodeJid(jid));
            } catch (e) {
                jid = String(jid);
            }
            let name = '';
            try {
                name = String(conn.getName(jid));
            } catch (e) {
                name = String(jid);
            }
            const sanitizedNumber = String(jid).replace(/[^0-9+]/g, '').replace(/^([^+])/, '+$1');
            let phoneNumber;
            try {
                phoneNumber = parsePhoneNumber(sanitizedNumber);
            } catch (e) {
                phoneNumber = { valid: false, number: { international: sanitizedNumber } };
            }
            const isValid = typeof phoneNumber.valid === 'boolean' ? phoneNumber.valid : false;
            let formattedNumber = 'Numero non valido';
            if (isValid && phoneNumber.number && typeof phoneNumber.number.international !== 'undefined') {
                formattedNumber = String(phoneNumber.number.international);
            } else {
                formattedNumber = String(sanitizedNumber);
            }
            return name ? chalk.gray(`${formattedNumber} (${name})`) : '';
        }).filter(Boolean).join(', '));
    }
    if (/document/i.test(m.mtype)) console.log(`ARCHIVIO: ${m.msg.fileName || m.msg.displayName || 'Document'}`)
    else if (/ContactsArray/i.test(m.mtype)) console.log(`CONTATTI: ${' ' || ''}`)
    else if (/contact/i.test(m.mtype)) console.log(`CONTATTO: ${m.msg.displayName || ''}`)
    else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(`${m.msg.ptt ? 'PTT (' : 'AUDIO ('}${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)})`)
    }
    console.log()
}
let file = global.__filename(import.meta.url)
watchFile(file, () => {
console.log(chalk.redBright("Update 'lib/print.js'"))})