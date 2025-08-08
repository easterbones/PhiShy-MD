import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const terminalImage = global.opts?.img ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
  try {
    // Validazione di m
    if (!m || typeof m !== 'object') {
      console.warn('⚠️ Oggetto `m` non valido.');
      return;
    }

    // Validazione di m.text
    if (typeof m.text !== 'string') {
      console.warn('⚠️ m.text non è una stringa. Imposto un valore predefinito.');
      m.text = '';
    }

    // Validazione di m.mentionedJid
    if (!Array.isArray(m.mentionedJid)) {
      console.warn('⚠️ m.mentionedJid non è un array. Imposto un array vuoto.');
      m.mentionedJid = [];
    }

    // Validazione di conn.user
    if (!conn.user || typeof conn.user !== 'object') {
      console.warn('⚠️ conn.user non valido. Imposto un valore predefinito.');
      conn.user = { jid: '', name: 'Bot' };
    }

    let _name = m.sender ? await conn.getName(m.sender) : '';
    let senderStr = '';
    if (m.sender) {
      try {
        let senderObj = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', ''));
        if (senderObj && senderObj.valid) {
          senderStr = senderObj.number.international || senderObj.number.e164 || String(m.sender);
        } else {
          console.warn('⚠️ Oggetto PhoneNumber non valido:', senderObj);
          senderStr = String(m.sender);
        }
      } catch (e) {
        console.warn('⚠️ Errore durante la conversione del numero del mittente:', e);
        senderStr = String(m.sender);
      }
    }

    let sender = senderStr + (_name ? ' ~' + _name : '');
    let senderJid = m.sender || '';
    let msgId = m.id || m.key?.id || m.msgId || (m.message && m.message.id) || '';
    let chatName = m.chat ? await conn.getName(m.chat) : '';
    let img;
    try {
      if (global.opts?.img)
        img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false;
    } catch (e) {
      console.warn('⚠️ Errore durante il download dell\'immagine:', e);
    }

    // Timestamp ISO
    let isoTimestamp = m.messageTimestamp
      ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)).toISOString()
      : new Date().toISOString();

    let filesize = (m.msg?.vcard?.length || m.msg?.fileLength?.low || m.msg?.fileLength || m.text?.length || 0) || 0;

    // Evidenzia JID speciali e colori vivaci
    let isGroup = m.chat?.endsWith('@g.us');
    let isBroadcast = m.chat?.endsWith('@broadcast');
    let isChannel = m.chat?.endsWith('@channel') || m.chat?.endsWith('@newsletter');
    let specialJid = '';
    if (isGroup) specialJid = chalk.bgBlueBright.bold.white(' [GRUPPO] ');
    if (isBroadcast) specialJid = chalk.bgYellowBright.bold.black(' [BROADCAST] ');
    if (isChannel) specialJid = chalk.bgMagentaBright.bold.white(' [CANALE/BACHECA] ');

    // Log dettagliato migliorato
    console.log(chalk.hex('#FF00FF').bold('╭═[ PHISHY EVENT ]═⋆'));
    console.log(chalk.hex('#00FFFF')('│'));
    console.log(chalk.hex('#00FF00').bold('├─ Mittente:'), chalk.hex('#FFD700').bold(sender));
    console.log(chalk.hex('#00FF00').bold('├─ JID mittente:'), chalk.hex('#00CED1').bold(senderJid));
    console.log(chalk.hex('#00FF00').bold('├─ Bot:'), chalk.hex('#FF8C00').bold(conn.user.jid + ' ~' + conn.user.name));
    console.log(chalk.hex('#00FF00').bold('├─ Data:'), chalk.hex('#00BFFF').bold(new Date().toLocaleString()));
    if (specialJid) console.log(chalk.hex('#00FF00').bold('├─'), chalk.hex('#FF1493').bold('JID chat:'), chalk.whiteBright(m.chat), specialJid);
    else console.log(chalk.hex('#00FF00').bold('├─'), chalk.hex('#FF1493').bold('JID chat:'), chalk.whiteBright(m.chat));
    if (chatName) console.log(chalk.hex('#00FF00').bold('├─ Nome chat:'), chalk.hex('#00CED1').bold(chatName));
    if (m.mtype) console.log(chalk.hex('#00FF00').bold('├─ Tipo messaggio:'), chalk.hex('#FF4500').bold(m.mtype));

    // Menzionati
    if (m.mentionedJid && m.mentionedJid.length) console.log(chalk.hex('#00FF00').bold('├─ Menzionati:'), m.mentionedJid.map(jid => chalk.hex('#00CED1')(jid)).join(', '));
    if (m.isCommand) {
      console.log(chalk.hex('#2a570d7b').bold('├─'), chalk.bgGreen.black.bold(' COMANDO '));
      if (typeof m.text === 'string' && m.text) {
        let log = m.text.replace(/\u200e+/g, '');
        console.log(chalk.yellow.bold(log));
      }
    }
    if (img) console.log(img.trimEnd());
    if (typeof m.text === 'string' && m.text) {
      let log = m.text.replace(/\u200e+/g, '');
      console.log(log);
    }
  } catch (error) {
    console.error('❌ Errore in print.js:', error);
  }
}

let file = global.__filename(import.meta.url);
watchFile(file, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"));
});