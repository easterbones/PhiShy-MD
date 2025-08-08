process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './config.js';
import './api.js';
import { LRUCache } from 'lru-cache';
import path, {join} from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import {platform} from 'process';
import * as ws from 'ws';
import {readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch} from 'fs';
import yargs from 'yargs';
import {spawn} from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import {tmpdir} from 'os';
import {format} from 'util';
import pino from 'pino';
import {Boom} from '@hapi/boom';
import {makeWASocket, protoType, serialize} from './lib/simple.js';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb';
import store from './lib/store.js';
const {proto} = (await import('@whiskeysockets/baileys')).default;
const {DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC} = await import('@whiskeysockets/baileys');
import readline from 'readline';
import NodeCache from 'node-cache';
const {CONNECTING} = ws;
const {chain} = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
import { useSingleFileAuthState } from '@whiskeysockets/baileys';
import { initializeModel, createNSFWHandler } from './nsfwHandler.mjs';

// Inizializzazione delle funzioni prototipo
protoType();
serialize();

// Percorsi e directory
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; 

global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
}; 


// Inizializza una cache globale per oggetti, file, ecc.
global.cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 10 // 10 minuti
});

// Configurazione API
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

// Variabili globali
global.timestamp = {start: new Date};
global.videoList = [];
global.videoListXXX = [];

const __dirname = global.__dirname(import.meta.url);

// Parametri da riga di comando
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-.@').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

global.DATABASE = global.db; 
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1 * 1000));
  }
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = chain(global.db.data);
};

// Inizializzazione del database con JSONFilePreset (lowdb v3+ ESM)

const defaultData = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
  sticker: {},
  settings: {},
};
const dbFile = `${opts._[0] ? opts._[0] + '_' : ''}database.json`;
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);
await db.read();
db.data ||= defaultData;
await db.write();
global.db = db;

// Add a utility function to remove circular references
function removeCircularReferences(obj) {
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return; // Remove circular reference
        seen.add(value);
      }
      return value;
    })
  );
}

// Update the interval to write the database safely
if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) {
        try {
          // Creazione backup prima del salvataggio
          const backupDate = new Date().toISOString().replace(/:/g, '-');
          const backupPath = `./backup/database_${backupDate.split('T')[0]}.json`;
          
          // Assicura che la directory esista
          if (!existsSync('./backup')) {
            fs.mkdirSync('./backup', { recursive: true });
          }
          
          // Fai il backup solo se ci sono cambiamenti rispetto all'ultimo salvataggio
          if (fs.existsSync('./database.json')) {
            // Copia il file attuale come backup se è passata almeno un'ora
            const stats = fs.statSync('./database.json');
            const lastModified = new Date(stats.mtime);
            const hoursPassed = (new Date() - lastModified) / (1000 * 60 * 60);
            
            if (hoursPassed >= 1) {
              fs.copyFileSync('./database.json', backupPath);
              console.log(`✅ Database backup creato: ${backupPath}`);
            }
          }
          
          // Rimuovi riferimenti circolari e salva
          global.db.data = removeCircularReferences(global.db.data);
          await global.db.write();
        } catch (err) {
          console.error('❌ Errore durante il salvataggio del database:', err);
          
          // Tentativo di ripristino da backup in caso di errore grave
          try {
            if (fs.existsSync('./backup')) {
              const backups = fs.readdirSync('./backup').filter(file => file.startsWith('database_'));
              if (backups.length > 0) {
                // Prendi il backup più recente
                backups.sort().reverse();
                const latestBackup = `./backup/${backups[0]}`;
                console.log(`⚠️ Tentativo di ripristino dal backup: ${latestBackup}`);
                fs.copyFileSync(latestBackup, './database.json');
              }
            }
          } catch (restoreErr) {
            console.error('❌ Errore durante il ripristino del backup:', restoreErr);
          }
        }
      }
      
      // Pulizia file temporanei
      if (opts['autocleartmp'] && (global.support || {}).find) {
        (tmp = [tmpdir(), 'tmp', 'jadibts'], tmp.forEach((filename) => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
      }
    }, 60 * 1000); // Aumentato a 60 secondi per ridurre il carico
  }
}

// Configurazione autenticazione e sessione
global.authFile = `Sessioni`;
const {state, saveState, saveCreds} = await useMultiFileAuthState(global.authFile);
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache();
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = global.botnumber;

// Determinazione del metodo di connessione<
const methodCodeQR = process.argv.includes("qr");
const methodCode = !!phoneNumber || process.argv.includes("code");
const MethodMobile = process.argv.includes("mobile");
const question = (texto) => {
  if (!global.rl) {
    global.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }
  return new Promise((resolver) => global.rl.question(texto, resolver));
};

// Selezione opzione di connessione
let opzione;
if (methodCodeQR) {
  opzione = '1';
}
if (!methodCodeQR && !methodCode && !existsSync(`./${authFile}/creds.json`)) {
  let risposta;
  while (true) {
    risposta = await question(chalk.greenBright(`🌟  𝐒𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐮𝐧'𝐨𝐩𝐳𝐢𝐨𝐧𝐞 𝐩𝐞𝐫 𝐜𝐨𝐧𝐧𝐞𝐭𝐭𝐞𝐫𝐞 𝐏𝐡𝐢𝐒𝐡𝐲:\n1. 𝐓𝐫𝐚𝐦𝐢𝐭𝐞 𝐜𝐨𝐝𝐢𝐜𝐞 𝐐𝐑\n2. 𝐓𝐫𝐚𝐦𝐢𝐭𝐞 𝐜𝐨𝐝𝐢𝐜𝐞 𝐚 8 𝐜𝐢𝐟𝐫𝐞\n---> `));
    risposta = risposta.trim();
    let firstChar = risposta[0];
    if (firstChar === '1' || firstChar === '2') {
      opzione = firstChar;
      break;
    } else {
      console.log(`𝐏𝐞𝐫 𝐟𝐚𝐯𝐨𝐫𝐞, 𝐬𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐬𝐨𝐥𝐨 1 𝐨 2.\n`);
    }
  }
  if (global.rl) {
    global.rl.close();
    global.rl = null;
  }
}

// Silenziamento dei log non necessari
console.info = () => {};

// Configurazione connessione WhatsApp
const connectionOptions = {
  logger: pino({ level: 'silent' }),
  mobile: MethodMobile, 
  browser: opzione == '1' ? ['PᏂ𝚒𝑠𝐡ⲩ Bot', 'Safari', '2.0.0'] : methodCodeQR ? ['PᏂ𝚒𝑠𝐡ⲩ Bot', 'Safari', '2.0.0'] : ['Ubuntu', 'Chrome', '110.0.5585.95'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
  },
  markOnlineOnConnect: true, 
  generateHighQualityLinkPreview: true, 
  syncFullHistory: true,  
  getMessage: async (clave) => {
    let jid = jidNormalizedUser(clave.remoteJid);
    let msg = await store.loadMessage(jid, clave.id);
    return msg?.message || "";
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  defaultQueryTimeoutMs: undefined, 
  version,  
};

// Inizializzazione della connessione
global.conn = makeWASocket(connectionOptions);

// Gestione connessione con codice a 8 cifre
if (!existsSync(`./${authFile}/creds.json`)) {
  if (opzione === '2' || methodCode) {
    opzione = '2';
    if (!conn.authState.creds.registered) {  
      if (MethodMobile) throw new Error(`𝐈𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐞 𝐮𝐧 𝐜𝐨𝐝𝐢𝐜𝐞 𝐝𝐢 𝐚𝐜𝐜𝐨𝐩𝐩𝐢𝐚𝐦𝐞𝐧𝐭𝐨 𝐜𝐨𝐧 𝐥'𝐀𝐏𝐈 𝐦𝐨𝐛𝐢𝐥𝐞`);

      let numeroTelefono;
      if (!!phoneNumber) {
        numeroTelefono = phoneNumber.replace(/[^0-9]/g, '');
        if (!Object.keys(PHONENUMBER_MCC).some(v => numeroTelefono.startsWith(v))) {
          console.log(chalk.bgBlack(chalk.bold.redBright(`𝐍𝐮𝐦𝐞𝐫𝐨 𝐝𝐢 𝐭𝐞𝐥𝐞𝐟𝐨𝐧𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨. 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐯𝐚𝐥𝐢𝐝𝐨.\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: +39 333 333 3333\n`)));
          process.exit(0);
        }
      } else {
        while (true) {
          numeroTelefono = await question(chalk.bgBlack(chalk.bold.yellowBright(`𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐝𝐢 𝐭𝐞𝐥𝐞𝐟𝐨𝐧𝐨 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨:: +39 333 333 3333\n`)));
          numeroTelefono = numeroTelefono.replace(/[^0-9]/g, '');
          if (numeroTelefono.match(/^\d+$/) && Object.keys(PHONENUMBER_MCC).some(v => numeroTelefono.startsWith(v))) {
            break;
          } else {
            console.log(chalk.bgBlack(chalk.bold.redBright(`𝐍𝐮𝐦𝐞𝐫𝐨 𝐝𝐢 𝐭𝐞𝐥𝐞𝐟𝐨𝐧𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨. 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐯𝐚𝐥𝐢𝐝𝐨.\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: +39 333 333 3333\n`)));
          }
        }
        if (global.rl) {
          global.rl.close();
          global.rl = null;
        }
      } 

      setTimeout(async () => {
        let codigo = await conn.requestPairingCode(numeroTelefono);
        codigo = codigo?.match(/.{1,4}/g)?.join("-") || codigo;
        console.log(chalk.yellowBright('𝐏𝐞𝐫 𝐜𝐨𝐧𝐧𝐞𝐭𝐭𝐞𝐫𝐞 𝐢𝐥 𝐛𝐨𝐭...'));
        console.log(chalk.black(chalk.bgCyanBright(`𝐀𝐩𝐫𝐢 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐬𝐮𝐥 𝐭𝐮𝐨 𝐭𝐞𝐥𝐞𝐟𝐨𝐧𝐨 𝐞 𝐯𝐚𝐢 𝐢𝐧 𝐈𝐦𝐩𝐨𝐬𝐭𝐚𝐳𝐢𝐨𝐧𝐢 > 𝐃𝐢𝐬𝐩𝐨𝐬𝐢𝐭𝐢𝐯𝐢 𝐜𝐨𝐥𝐥𝐞𝐠𝐚𝐭𝐢 > 𝐂𝐨𝐥𝐥𝐞𝐠𝐚 𝐮𝐧 𝐝𝐢𝐬𝐩𝐨𝐬𝐢𝐭𝐨, 𝐩𝐨𝐢 𝐜𝐥𝐢𝐜𝐜𝐚 𝐬𝐮 "𝐂𝐨𝐥𝐥𝐞𝐠𝐚 𝐜𝐨𝐧 𝐜𝐨𝐝𝐢𝐜𝐞"\n\n𝐈𝐍𝐒𝐄𝐑𝐈𝐒𝐂𝐈 𝐐𝐔𝐄𝐒𝐓𝐎 𝐂𝐎𝐃𝐈𝐂𝐄:`)), chalk.black(chalk.bgGreenBright(codigo)));
      }, 3000);
    }
  }
}

// Stato iniziale
conn.isInit = false;
conn.well = false;
conn.logger.info(`🌸 𝐀𝐭𝐭𝐞𝐧𝐝𝐞𝐫𝐞 𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...\n`);

// Gestione cache temporanea
if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) {
        try {
          global.db.data = removeCircularReferences(global.db.data);
          await global.db.write();
        } catch (err) {
          console.error('Error writing to database:', err);
        }
      }
      if (opts['autocleartmp'] && (global.support || {}).find) {
        (tmp = [tmpdir(), 'tmp', 'jadibts'], tmp.forEach((filename) => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
      }
    }, 10 * 1000);
  }
}

// Configurazione server (se richiesto)
if (opts['server']) (await import('./server.js')).default(global.conn, PORT);

// Funzione per ripulire i file temporanei
function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file); // 3 minuti
    return false;
  });
}

// Pulizia delle chiavi di sessione
function purgeSession() {
  let prekey = [];
  let directorio = readdirSync("./Sessioni");
  let filesFolderPreKeys = directorio.filter(file => {
    return file.startsWith('pre-key-');
  });
  prekey = [...prekey, ...filesFolderPreKeys];
  filesFolderPreKeys.forEach(files => {
    unlinkSync(`./Sessioni/${files}`);
  });
} 

// --- Funzioni gestione sessioni sub-bot (da main-altro-bot.js) ---
function purgeSessionSB() {
  try {
    let listaDirectorios = readdirSync('./jadibts/');
    let SBprekey = [];
    listaDirectorios.forEach(directorio => {
      if (statSync(`./jadibts/${directorio}`).isDirectory()) {
        let DSBPreKeys = readdirSync(`./jadibts/${directorio}`).filter(fileInDir => {
          return fileInDir.startsWith('pre-key-');
        });
        SBprekey = [...SBprekey, ...DSBPreKeys];
        DSBPreKeys.forEach(fileInDir => {
          unlinkSync(`./jadibts/${directorio}/${fileInDir}`);
        });
      }
    });
    if (SBprekey.length === 0) return;
  } catch (err) {
    console.log(chalk.bold.red(`⚠️ Qualcosa è andato storto durante l'eliminazione, file non eliminati`));
  }
}

function purgeOldFiles() {
  const directories = ['./Sessioni/', './jadibts/'];
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  directories.forEach(dir => {
    try {
      const files = readdirSync(dir);
      files.forEach(file => {
        const filePath = join(dir, file);
        const stats = statSync(filePath);
        if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') {
          unlinkSync(filePath);
          console.log(chalk.bold.green(`File ${file} eliminato con successo`));
        }
      });
    } catch (err) {
      console.log(chalk.bold.red(`Errore durante l'eliminazione dei file: ${err}`));
    }
  });
}

// --- Pulizia periodica sub-bot ---
setInterval(async () => {
  if (typeof stopped !== 'undefined' && (stopped === 'close' || !conn || !conn.user)) return;
  await purgeSessionSB();
  console.log(chalk.cyanBright(`\n╭─────────────────\n│ AUTO ELIMINAZIONE SESSIONI SUB-BOT\n│ ⓘ File eliminati con successo. ✅\n╰─────────────`));
}, 1000 * 60 * 60);

setInterval(async () => {
  if (typeof stopped !== 'undefined' && (stopped === 'close' || !conn || !conn.user)) return;
  await purgeOldFiles();
  console.log(chalk.cyanBright(`\n╭─────────────────\n│ AUTO ELIMINAZIONE OLDFILES\n│ ⓘ File eliminati con successo. ✅\n╰─────────────`));
}, 1000 * 60 * 60);

// Gestione degli aggiornamenti di connessione
async function connectionUpdate(update) {
  const {connection, lastDisconnect, isNewLogin, qr} = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date;
  }
  if (global.db.data == null) loadDatabase();

  // Stampa QR code in terminale se presente
  if (qr && (opzione == '1' || methodCodeQR)) {
    // Usa 'qrcode-terminal' per stampare il QR in modo leggibile
    try {
      const qrcode = (await import('qrcode-terminal')).default;
      qrcode.generate(qr, {small: true});
      console.log(chalk.yellow('𝐒𝐜𝐚𝐧𝐬𝐢𝐨𝐧𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐝𝐢𝐜𝐞 𝐐𝐑, 𝐬𝐜𝐚𝐝𝐫à 𝐭𝐫𝐚 60 𝐬𝐞𝐜𝐨𝐧𝐝𝐢.'));
    } catch (e) {
      console.log('Impossibile stampare il QR code:', e);
      console.log('QR:', qr);
    }
  }

  // Connessione stabilita
  if (connection == 'open') {
    console.log(chalk.green('\n𝐏𝐡𝐢𝐒𝐡𝐲 𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐚𝐦𝐞𝐧𝐭𝐞 ✅️ \n'));
  }
  
  // Gestione errori di connessione
  let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
  if (reason == 405) {
    await unlinkSync("./Sessioni/" + "creds.json");
    console.log(chalk.bold.redBright(`𝐂𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐬𝐨𝐬𝐭𝐢𝐭𝐮𝐢𝐭𝐚, 𝐫𝐢𝐚𝐯𝐯𝐢𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...\n𝐒𝐞 𝐚𝐩𝐩𝐚𝐫𝐞 𝐮𝐧 𝐞𝐫𝐫𝐨𝐫𝐞, 𝐫𝐢𝐚𝐯𝐯𝐢𝐚 𝐜𝐨𝐧: 𝐧𝐩𝐦 𝐬𝐭𝐚𝐫𝐭`)); 
    process.send('reset');
  }
  
  if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
      conn.logger.error(`𝐒𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐚. 𝐄𝐥𝐢𝐦𝐢𝐧𝐚 𝐥𝐚 𝐜𝐚𝐫𝐭𝐞𝐥𝐥𝐚 ${global.authFile} 𝐞 𝐬𝐜𝐚𝐧𝐬𝐢𝐨𝐧𝐚 𝐧𝐮𝐨𝐯𝐚𝐦𝐞𝐧𝐭𝐞 𝐢𝐥 𝐜𝐨𝐝𝐢𝐜𝐞.`);
    } else if (reason === DisconnectReason.connectionClosed) {
      conn.logger.warn(`𝐂𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐜𝐡𝐢𝐮𝐬𝐚, 𝐭𝐞𝐧𝐭𝐚𝐭𝐢𝐯𝐨 𝐝𝐢 𝐫𝐢𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionLost) {
      conn.logger.warn(`𝐂𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐩𝐞𝐫𝐬𝐚 𝐜𝐨𝐧 𝐢𝐥 𝐬𝐞𝐫𝐯𝐞𝐫, 𝐭𝐞𝐧𝐭𝐚𝐭𝐢𝐯𝐨 𝐝𝐢 𝐫𝐢𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionReplaced) {
      conn.logger.error(`𝐂𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐬𝐨𝐬𝐭𝐢𝐭𝐮𝐢𝐭𝐚. È 𝐬𝐭𝐚𝐭𝐚 𝐚𝐩𝐞𝐫𝐭𝐚 𝐮𝐧'𝐚𝐥𝐭𝐫𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐞. 𝐃𝐢𝐬𝐜𝐨𝐧𝐧𝐞𝐭𝐭𝐢 𝐩𝐫𝐢𝐦𝐚 𝐪𝐮𝐞𝐬𝐭𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐞.`);
    } else if (reason === DisconnectReason.loggedOut) {
      conn.logger.error(`𝐃𝐢𝐬𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐨. 𝐄𝐥𝐢𝐦𝐢𝐧𝐚 𝐥𝐚 𝐜𝐚𝐫𝐭𝐞𝐥𝐥𝐚 ${global.authFile} 𝐞 𝐬𝐜𝐚𝐧𝐬𝐢𝐨𝐧𝐚 𝐧𝐮𝐨𝐯𝐚𝐦𝐞𝐧𝐭𝐞 𝐢𝐥 𝐜𝐨𝐝𝐢𝐜𝐞.`);
    } else if (reason === DisconnectReason.restartRequired) {
      conn.logger.info(`𝐑𝐢𝐚𝐯𝐯𝐢𝐨 𝐧𝐞𝐜𝐞𝐬𝐬𝐚𝐫𝐢𝐨, 𝐫𝐢𝐚𝐯𝐯𝐢𝐨 𝐝𝐞𝐥 𝐬𝐞𝐫𝐯𝐞𝐫 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.timedOut) {
      conn.logger.warn(`𝐓𝐢𝐦𝐞𝐨𝐮𝐭 𝐝𝐢 𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞, 𝐭𝐞𝐧𝐭𝐚𝐭𝐢𝐯𝐨 𝐝𝐢 𝐫𝐢𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞...`);
      await global.reloadHandler(true).catch(console.error);
    } else {
      conn.logger.warn(`𝐌𝐨𝐭𝐢𝐯𝐨 𝐝𝐞𝐥𝐥𝐚 𝐝𝐢𝐬𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨: ${reason || ''}: ${connection || ''}`);
      await global.reloadHandler(true).catch(console.error);
    }
  }
}

// Gestione errori non catturati
process.on('uncaughtException', console.error);

// Gestione handler e ricaricamento
let isInit = true;
let handler = await import('./handler.js');
global.reloadHandler = async function(restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Handler && typeof Handler === 'object') handler = Handler;
  } catch (e) {
    console.error(e);
  }
  if (restatConn) {
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch { }
    conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions, {chats: oldChats});
    isInit = true;
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('group-participants.update', conn.participantsUpdate);
    conn.ev.off('groups.update', conn.groupsUpdate);
    conn.ev.off('message.delete', conn.onDelete);
    conn.ev.off('call', conn.onCall);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

  // Messaggi di gruppo predefiniti
  conn.welcome = '@user 𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨/𝐚 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨';
  conn.bye = '@user 𝐡𝐚 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐭𝐨 𝐢𝐥 𝐠𝐫𝐮𝐩𝐩𝐨';
  conn.spromote = '@user 𝐟𝐚 𝐩𝐚𝐫𝐭𝐞 𝐝𝐞𝐥𝐥𝐨 𝐬𝐭𝐚𝐟𝐟';
  conn.sdemote = '@user 𝐧𝐨𝐧 è 𝐩𝐢ù 𝐚𝐦𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐞';
  conn.sIcon = '𝐈𝐦𝐦𝐚𝐠𝐢𝐧𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚𝐭𝐚';
  conn.sRevoke = '𝐋𝐢𝐧𝐤 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐫𝐞𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨, 𝐧𝐮𝐨𝐯𝐨 𝐥𝐢𝐧𝐤: @revoke';

  // REGISTRAZIONE EVENTI CORRETTA
  // Check if all handler functions exist before binding
  if (!handler || typeof handler.handler !== 'function' || typeof handler.participantsUpdate !== 'function' || typeof handler.deleteUpdate !== 'function' || typeof handler.callUpdate !== 'function') {
    console.error('[reloadHandler] ERRORE: handler.js non esporta tutte le funzioni necessarie.');
    return false;
  }
  conn.handler = handler.handler.bind(global.conn);
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
  conn.groupsUpdate = handler.groupsUpdate ? handler.groupsUpdate.bind(global.conn) : () => {};
  conn.onDelete = handler.deleteUpdate.bind(global.conn);
  conn.onCall = handler.callUpdate.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);

  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('group-participants.update', conn.participantsUpdate);
  conn.ev.on('groups.update', conn.groupsUpdate);
  conn.ev.on('message.delete', conn.onDelete);
  conn.ev.on('call', conn.onCall);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);
  isInit = false;
  return true;
};

// Caricamento plugin
const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(e);
      delete global.plugins[filename];
    }
  }
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

// Gestione ricaricamento plugin
global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(` Plugin aggiornato - '${filename}'`);
      else {
        conn.logger.warn(`Plugin eliminato - '${filename}'`);
        return delete global.plugins[filename];
      }
    } else conn.logger.info(`Nuovo plugin - '${filename}'`);
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐢 𝐬𝐢𝐧𝐭𝐚𝐬𝐬𝐢 𝐧𝐞𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 '${filename}'\n${format(err)}`);
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(`𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥 𝐜𝐚𝐫𝐢𝐜𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐞𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 '${filename}\n${format(e)}'`);
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);
watch(pluginFolder, global.reload);
await global.reloadHandler();

// Test rapido delle dipendenze
async function _quickTest() {
  const test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version']),
  ].map((p) => {
    return Promise.race([
      new Promise((resolve) => {
        p.on('close', (code) => {
          resolve(code !== 127);
        });
      }),
      new Promise((resolve) => {
        p.on('error', (_) => resolve(false));
      })]);
  }));
  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
  Object.freeze(global.support);
}

// Intervalli per pulizia e aggiornamenti
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  const a = await clearTmp();
  console.log(chalk.cyanBright(`\n╭─────────────────\n│ 𝐏𝐔𝐋𝐈𝐙𝐈𝐀 𝐅𝐈𝐋𝐄 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐍𝐄𝐈\n│ ✅ 𝐅𝐢𝐥𝐞 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐧𝐞𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨\n╰─────────────`));
}, 180000);

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSession();
  console.log(chalk.cyanBright(`\n╭─────────────────\n│ 𝐏𝐔𝐋𝐈𝐙𝐈𝐀 𝐒𝐄𝐒𝐒𝐈𝐎𝐍𝐈\n│ ✅ 𝐂𝐡𝐢𝐚𝐯𝐢 𝐝𝐢 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐞 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨\n╰─────────────`));
}, 1000 * 60 * 60);

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeOldFiles();
  console.log(chalk.cyanBright(`\n╭─────────────────\n│ 𝐏𝐔𝐋𝐈𝐙𝐈𝐀 𝐅𝐈𝐋𝐄 𝐎𝐁𝐒𝐎𝐋𝐄𝐓𝐈\n│ ✅ 𝐅𝐢𝐥𝐞 𝐯𝐞𝐜𝐜𝐡𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨\n╰─────────────`));
}, 1000 * 60 * 60);

// Esecuzione test rapido
_quickTest().catch(console.error);

/**
 * Avvia una nuova istanza Baileys per sub-bot/jadibot
 * @param {string} sessionPath - percorso della sessione (es: './jadibts/<jid>')
 * @param {object} [optsOverride] - opzioni extra (opzionale)
 * @returns {Promise<object>} - la nuova connessione Baileys
 */
global.startJadibot = async function(sessionPath, optsOverride = {}) {
  const {useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore} = await import('@whiskeysockets/baileys');
  const {state, saveState, saveCreds} = await useMultiFileAuthState(sessionPath);
  const {version} = await fetchLatestBaileysVersion();
  const pino = (await import('pino')).default;
  const {makeWASocket} = await import('./lib/simple.js');
  const conn = makeWASocket({
    logger: pino({ level: 'silent' }),
    browser: ['PhishySubBot', 'Chrome', '110.0.5585.95'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    version,
    ...optsOverride
  });
  // Salva le credenziali ad ogni update
  conn.ev.on('creds.update', saveCreds);
  return conn;
};


// Define the main bot startup function
async function startBot() {
    // --- NSFW Handler ---

    // Inizializza il modello NSFW
    await initializeModel();

    // Crea l'handler NSFW
    const nsfwHandler = createNSFWHandler(global.conn);


    global.conn.ev.on('messages.upsert', async ({ messages }) => {
        for (const message of messages) {
            // Prima gestisci NSFW
            await nsfwHandler(message);

            // Poi gli altri tuoi handler
            // ... altro codice ...
        }
    });
}

// Call the main bot startup function and handle errors
startBot().catch(err => {
    console.error('Errore avvio bot:', err);
    process.exit(1);
});