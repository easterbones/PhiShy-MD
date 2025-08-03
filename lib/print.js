import { WAMessageStubType } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {
  // Opzione verbose: stampa tutto il payload raw se global.opts.verbose
  if (global.opts && global.opts.verbose) {
    console.log(chalk.bgGray.white('PAYLOAD RAW'));
    // Usa util.inspect per evitare errori di conversione
    import('util').then(util => {
      console.log(util.inspect(m, { depth: 4, colors: true }));
    });
  }
  let _name = m.sender ? await conn.getName(m.sender) : '';
  let senderStr = '';
  if (m.sender) {
    try {
      let senderObj = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', ''));
      senderStr = senderObj.getNumber ? senderObj.getNumber('international') : senderObj.number;
      if (typeof senderStr === 'object' && senderStr !== null) senderStr = senderStr.number || '';
      senderStr = typeof senderStr === 'string' ? senderStr : (senderStr ? String(senderStr) : '');
    } catch (e) {
      senderStr = String(m.sender);
    }
  }
  let sender = senderStr + (_name ? ' ~' + _name : '');
  let senderJid = m.sender || '';
  let msgId = m.id || m.key?.id || m.msgId || (m.message && m.message.id) || '';
  let chatName = m.chat ? await conn.getName(m.chat) : '';
  let img
  try {
    if (global.opts['img'])
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
  } catch (e) {
    console.error(e)
  }
  // Timestamp ISO
  let isoTimestamp = m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)).toISOString() : new Date().toISOString();
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
    : m.text ? m.text.length : 0) || 0
  let user = global.DATABASE.data.users[m.sender]
  let meObj = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', ''));
  let meStr = meObj.getNumber ? meObj.getNumber('international') : meObj.number;
  if (typeof meStr === 'object' && meStr !== null) meStr = meStr.number || '';
  meStr = typeof meStr === 'string' ? meStr : (meStr ? String(meStr) : '');
  let me = meStr

  // Evidenzia JID speciali e colori vivaci
  let isGroup = m.chat.endsWith('@g.us')
  let isBroadcast = m.chat.endsWith('@broadcast')
  let isChannel = m.chat.endsWith('@channel') || m.chat.endsWith('@newsletter')
  let specialJid = ''
  if (isGroup) specialJid = chalk.bgBlueBright.bold.white(' [GRUPPO] ')
  if (isBroadcast) specialJid = chalk.bgYellowBright.bold.black(' [BROADCAST] ')
  if (isChannel) specialJid = chalk.bgMagentaBright.bold.white(' [CANALE/BACHECA] ')

  // Log dettagliato migliorato
  console.log(chalk.hex('#FF00FF').bold('╭═[ PHISHY EVENT ]═⋆'))
  console.log(chalk.hex('#00FFFF')('│'))
  console.log(chalk.hex('#00FF00').bold('├─ ID messaggio:'), chalk.hex('#FFA500').bold(msgId))
  console.log(chalk.hex('#00FF00').bold('├─ Mittente:'), chalk.hex('#FFD700').bold(sender))
  console.log(chalk.hex('#00FF00').bold('├─ JID mittente:'), chalk.hex('#00CED1').bold(senderJid))
  console.log(chalk.hex('#00FF00').bold('├─ Bot:'), chalk.hex('#FF8C00').bold(me + ' ~' + conn.user.name))
  console.log(chalk.hex('#00FF00').bold('├─ Orario:'), chalk.hex('#00BFFF').bold((m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)) : new Date).toLocaleString()))
  console.log(chalk.hex('#00FF00').bold('├─ Timestamp ISO:'), chalk.hex('#B0C4DE').bold(isoTimestamp))
  if (specialJid) console.log(chalk.hex('#00FF00').bold('├─'), chalk.hex('#FF1493').bold('JID chat:'), chalk.whiteBright(m.chat), specialJid)
  else console.log(chalk.hex('#00FF00').bold('├─'), chalk.hex('#FF1493').bold('JID chat:'), chalk.whiteBright(m.chat))
  if (chatName) console.log(chalk.hex('#00FF00').bold('├─ Nome chat:'), chalk.hex('#00CED1').bold(chatName))
  if (m.mtype) console.log(chalk.hex('#00FF00').bold('├─ Tipo messaggio:'), chalk.hex('#FF4500').bold(m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase())))
  // Dettagli media
  if (m.msg && (m.msg.fileName || m.msg.displayName)) console.log(chalk.hex('#00FF00').bold('├─ File media:'), chalk.hex('#00BFFF').bold(m.msg.fileName || m.msg.displayName))
  if (m.msg && m.msg.mimetype) console.log(chalk.hex('#00FF00').bold('├─ MimeType:'), chalk.hex('#00BFFF').bold(m.msg.mimetype))
  if (filesize) console.log(chalk.hex('#00FF00').bold('├─ Dimensione:'), chalk.hex('#FF69B4').bold(filesize + ' byte'))
  // Menzionati
  if (m.mentionedJid && m.mentionedJid.length) console.log(chalk.hex('#00FF00').bold('├─ Menzionati:'), m.mentionedJid.map(jid => chalk.hex('#00CED1')(jid)).join(', '))
  if (m.isCommand) console.log(chalk.hex('#3a8608ff').bold('├─'), chalk.bgGreen.black.bold(' COMANDO '))
  if (img) console.log(img.trimEnd())
  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '')
    let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g
    let mdFormat = (depth = 4) => (_, type, text, monospace) => {
      let types = {
        _: 'italic',
        '*': 'bold',
        '~': 'strikethrough'
      }
      text = text || monospace
      let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)))
      return formatted
    }
    if (log.length < 4096)
      log = log.replace(urlRegex, (url, i, text) => {
        let end = url.length + i
        return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url
      })
    log = log.replace(mdRegex, mdFormat(4))
    if (m.mentionedJid) for (let user of m.mentionedJid) log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' + await conn.getName(user)))
    // Stampa testo con colore diverso per errori/comandi
    if (m.error != null) {
      console.log(chalk.bgRed.white('ERRORE!'))
      console.log(chalk.red(log))
      if (m.error && m.error.stack) console.log(chalk.red(m.error.stack))
    } else if (m.isCommand) {
      console.log(chalk.yellow(log))
    } else {
      console.log(log)
    }
  }
  if (m.messageStubParameters) {
    (async () => {
      const mappedArr = await Promise.all(m.messageStubParameters.map(async jid => {
        jid = conn.decodeJid(jid)
        let name = '';
        try {
          name = await conn.getName(jid)
        } catch {}
        let jidObj = PhoneNumber('+' + jid.replace('@s.whatsapp.net', ''));
        let jidStr = jidObj.getNumber ? jidObj.getNumber('international') : jidObj.number;
        if (typeof jidStr === 'object' && jidStr !== null) jidStr = jidStr.number || '';
        jidStr = typeof jidStr === 'string' ? jidStr : (jidStr ? String(jidStr) : '');
        return chalk.gray(jidStr + (name ? ' ~' + name : ''))
      }));
      const mapped = mappedArr.filter(Boolean).join(', ');
      if (mapped) console.log(mapped)
    })();
  }
  if (/document/i.test(m.mtype)) console.log(`📄 ${m.msg.fileName || m.msg.displayName || 'Document'}`)
  else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`)
  else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(`${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`)
  }

  console.log()
  // if (m.quoted) console.log(m.msg.contextInfo)
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"))
})