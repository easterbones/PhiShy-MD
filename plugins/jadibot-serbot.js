/*⚠ VIETATO MODIFICARE  ⚠

Il codice di questo file è stato completamente creato da:
- Aiden_NotLogic >> https://github.com/ferhacks

Funzione adattata da:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
- AzamiJs >> https://github.com/AzamiJs

Altri crediti:
- ReyEndymion >> https://github.com/ReyEndymion
- BrunoSobrino >> https://github.com/BrunoSobrino
*/

import fs from 'fs';
import { makeWASocket } from '../lib/simple.js';
import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import qrcode from 'qrcode';
import NodeCache from 'node-cache';
import pino from 'pino';
import { exec } from 'child_process';

if (!global.conns) global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  const settings = global.db.data.settings[conn.user.jid];
  if (!settings.jadibot) {
    return conn.reply(m.chat, 'ⓘ Questo comando è disabilitato dal mio creatore.', m);
  }
  let mode = null;
  let targetNumber = null;
  if (!args[0]) {
    return conn.reply(m.chat, `❓ Come vuoi collegare il sub-bot?\nScrivi:\n- *${usedPrefix + command} qr* per collegare con QR code\n- *${usedPrefix + command} codice +39 333 444 5555* per collegare con pairing code (inserisci il numero!)`, m);
  }
  if (/^(qr)$/i.test(args[0].trim())) mode = 'qr';
  else if (/^(codice|code)$/i.test(args[0].trim())) {
    mode = 'code';
    // Cerca il numero come secondo argomento
    if (args[1]) {
      // Unisci tutti gli argomenti dopo 'codice' e togli spazi
      targetNumber = args.slice(1).join('').replace(/\s+/g, '');
    }
    if (!targetNumber || !/^\+?\d{7,}$/.test(targetNumber)) {
      return conn.reply(m.chat, `❗ Devi specificare il numero di telefono per il pairing code!\nEsempio:\n*${usedPrefix + command} codice +393334445555*`, m);
    }
  } else {
    return conn.reply(m.chat, `❓ Comando non riconosciuto. Usa:\n- *${usedPrefix + command} qr* per collegare con QR code\n- *${usedPrefix + command} codice +39 333 444 5555* per pairing code`, m);
  }
  let jid = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : (m.fromMe ? conn.user.jid : m.sender);
  jid = '' + jid.split('@')[0];
  if (!fs.existsSync(`./jadibts/${jid}`)) fs.mkdirSync(`./jadibts/${jid}`, { recursive: true });
  if (args[1] && mode === 'code' && !isNaN(Number(args[1].replace(/\D/g, '')))) {
    fs.writeFileSync(`./jadibts/${jid}/creds.json`, JSON.stringify(JSON.parse(Buffer.from(args[1], 'base64').toString('utf-8')), null, '\t'));
  }
  if (fs.existsSync(`./jadibts/${jid}/creds.json`)) {
    let creds = JSON.parse(fs.readFileSync(`./jadibts/${jid}/creds.json`));
    if (creds && creds.registered === false) {
      if (fs.existsSync(`./jadibts/${jid}/creds.json`)) fs.unlinkSync(`./jadibts/${jid}/creds.json`);
    }
  }
  // Avvio sub-bot
  async function startSubBot() {
    if (!fs.existsSync(`./jadibts/${jid}`)) fs.mkdirSync(`./jadibts/${jid}`, { recursive: true });
    if (args[1] && mode === 'code' && !isNaN(Number(args[1].replace(/\D/g, '')))) {
      fs.writeFileSync(`./jadibts/${jid}/creds.json`, JSON.stringify(JSON.parse(Buffer.from(args[1], 'base64').toString('utf-8')), null, '\t'));
    }
    const { state, saveCreds } = await useMultiFileAuthState(`./jadibts/${jid}`);
    const { version } = await fetchLatestBaileysVersion();
    const subConn = makeWASocket({
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
      },
      version,
      syncFullHistory: true,
      browser: mode === 'code' ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['PhishySubBot', 'Chrome', '2.0.0'],
      getMessage: async (key) => ({ conversation: 'PhishySubBot' })
    });
    subConn.isInit = false;
    subConn.ev.on('creds.update', saveCreds);
    subConn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, isNewLogin, qr } = update;
      const statusCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
      if (connection === 'close') {
        if (statusCode === 405) {
          if (fs.existsSync(`./jadibts/${jid}/creds.json`)) fs.unlinkSync(`./jadibts/${jid}/creds.json`);
          return await conn.reply(m.chat, 'ⓘ Invia nuovamente il comando.', m);
        }
        if (statusCode === DisconnectReason.restartRequired) {
          startSubBot();
          return console.log('⌛ Connessione scaduta, riconnessione in corso...');
        }
        if (statusCode === DisconnectReason.loggedOut) {
          return conn.reply(m.chat, 'ⓘ Connessione chiusa, dovrai riconnetterti usando !deletesesion', m);
        }
        if (statusCode === DisconnectReason.badSession) {
          return conn.reply(m.chat, 'ⓘ Connessione chiusa, necessario connettersi manualmente.', m);
        }
        if (statusCode === DisconnectReason.timedOut) {
          return console.log('⌛ Connessione scaduta, riconnessione in corso...');
        }
        if (statusCode === DisconnectReason.connectionLost) {
          startSubBot();
          return console.log('⚠️ Connessione persa al server, riconnessione in corso...');
        }
        return console.log('⚠️ Motivo disconnessione sconosciuto:', statusCode, connection);
      }
      if (connection === 'open') {
        subConn.isInit = true;
        global.conns.push(subConn);
        await conn.reply(m.chat, args[1] && mode === 'code' ? 'ⓘ Sei connesso! Attendi, i messaggi sono in caricamento...' : '✅️ Connesso con successo! Puoi connetterti usando ' + usedPrefix + command, m);
        if (!(args[1] && mode === 'code')) {
          conn.sendMessage(m.chat, { text: usedPrefix + command + ' codice ' + Buffer.from(fs.readFileSync(`./jadibts/${jid}/creds.json`), 'utf-8').toString('base64') }, { quoted: m });
        }
        // --- PAIRING CODE FIX ---
        if (mode === 'code') {
          await conn.sendMessage(m.chat, { text: `🚀 Usa subito questo codice a 6 cifre per collegare il sub-bot al numero *${targetNumber}*! (Scade in pochi secondi)` }, { quoted: m });
          try {
            const code = await subConn.requestPairingCode(targetNumber.replace(/\D/g, ''));
            await conn.reply(m.chat, code, m);
          } catch (e) {
            await conn.reply(m.chat, '❌ Errore nella generazione del pairing code. Riprova subito!', m);
          }
        }
      }
      if (qr && mode === 'qr') {
        const qrImg = await qrcode.toBuffer(qr, { scale: 8 });
        await conn.sendMessage(m.chat, { image: qrImg, caption: '🚀 Scansiona questo QR per diventare sub-bot!' }, { quoted: m });
      }
    });
  }
  if (mode) startSubBot();
};

handler.help = ['serbot', 'serbot --code'];
handler.tags = ['serbot'];
handler.command = ['jadibot', 'serbot'];
handler.private = true;
export default handler;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}