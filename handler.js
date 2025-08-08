import { generateWAMessageFromContent } from "@whiskeysockets/baileys"
import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath, pathToFileURL } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'
import { getBenvenutoRandom } from './lib/benvenuto.js';
import { getAddioRandom } from './lib/addio.js';
import { getBentornatoRandom } from './lib/bentornato.js';
const  MAX_MONEY = 1000000; // 1 milione
const MAX_JOINCOUNT = 30; // Massimo di 30 crediti
const MAX_VITA = 3; // Massimo di 3 vite/scudi
import antirubaCheck from './plugins/antiadmin.js'; // <-- AGGIUNGI QUESTO IMPORT
/**
 * @type {import('@whiskeysockets/baileys')}
 */
const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

// Ensure __filename is correctly defined

// --- CARICAMENTO RICORSIVO DEI PLUGIN DALLE SOTTOCARTELLE DI plugins/ ---
function getAllPluginFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!['node_modules', 'benchmarks', 'test', '.git', 'lib'].includes(file)) {
        results = results.concat(getAllPluginFiles(filePath));
      }
    } else if (
      file.endsWith('.js') &&
      !file.startsWith('_') &&
      !file.endsWith('.d.ts') &&
      !file.includes('test') &&
      !file.includes('bench') &&
      !file.includes('lib')
    ) {
      results.push(filePath);
    }
  });
  return results;
}

// Carica tutti i plugin JS validi nelle sottocartelle di plugins/
global.plugins = {};
const pluginsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'plugins');

async function loadAllPlugins() {
  const { pathToFileURL } = await import('url');
  const pluginFiles = getAllPluginFiles(pluginsDir);
  for (const file of pluginFiles) {
    const filename = path.relative(pluginsDir, file).replace(/\\/g, '/');
    try {
      const module = await import(pathToFileURL(file));
      global.plugins[filename] = module.default || module;
    } catch (e) {
      console.error('[PLUGIN LOAD ERROR]', filename, e);
      delete global.plugins[filename];
    }
  }
}

// Avvia il caricamento dei plugin all'avvio del modulo
(async () => {
  await loadAllPlugins();
})();

// --- HANDLER PRINCIPALE ---
export async function handler(chatUpdate, opts = {}) {
    this.msgqueque = this.msgqueque || [];
    if (!chatUpdate) return;
    this.pushMessage(chatUpdate.messages).catch(console.error);
    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;
    if (global.db.data == null) await global.loadDatabase();
    try {
        m = smsg(this, m) || m;
        if (!m) return;
        m.exp = 0
        m.money = false
        try {
            // TODO: use loop to insert data instead of this
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.messaggi)) user.messaggi = 0
                if (!isNumber(user.messaggi_settimanali)) user.messaggi_settimanali = 0 // <--- AGGIUNTA
                if (!isNumber(user.blasphemy)) user.blasphemy = 0
                if (!isNumber(user.slotlimit)) user.slotlimit = 5
                if (!isNumber(user.msg)) user.msg = {}
                if (!isNumber(user.exp)) user.exp = 0 
                if (!isNumber(user.warn)) user.warn = 0
                if (!isNumber(user.warn_blasphemy)) user.warn_blasphemy = 0
                if (!isNumber(user.joincount)) user.joincount = 0   
                if (!isNumber(user.money)) user.money = 20
                if (!isNumber(user.limit)) user.limit = 300
                if (!isNumber(user.credito)) user.credito = 0
                if (!('premium' in user)) user.premium = false
                if (!isNumber(user.premiumDate)) user.premiumDate = -1
                if (!isNumber(user.tprem)) user.tprem = 0
                if (!user.premium) user.premiumTime = 0
                if (!('name' in user)) user.name = m.name
                if (!('muto' in user)) user.muto = false
                if (!('sposato' in user)) user.sposato = false;
                if (!('partner' in user)) user.partner = '';
                if (!isNumber(user.bacini)) user.bacini = 0
                if (!isNumber(user.health)) user.health = 100
                if (!('role' in user)) user.role = '*NOVIZIO(A)'
                if (!isNumber(user.level)) user.level = 0
                if (!isNumber(user.vita)) user.vita = 0
                if (!isNumber(user.spamMessaggi)) user.spamMessaggi = 0
                if (user.money > MAX_MONEY) user.money = MAX_MONEY
                if (!isNumber(user.stickerCount)) user.stickerCount = 0
                if (!isNumber(user.antiBan)) user.antiBan = 0
                if (!isNumber(user.message)) user.message = 0
                if (!isNumber(user.lastadventure)) user.lastadventure = 0
                if (!('descrizione' in user)) user.descrizione = 'nessuna descrizione'
                
                
                
               
                //negozio
                if (!isNumber(user.pozione_minore)) user.pozione_minore = 0
                if (!isNumber(user.pozione_maggiore)) user.pozione_maggiore = 0
                if (!isNumber(user.pozione_definitiva)) user.pozione_definitiva = 0
                if (!('macchina' in user)) user.macchina = false
                if (!('moto' in user)) user.moto = false
                if (!('bici' in user)) user.bici = false
                if (!isNumber(user.canna)) user.canna = 0
                if (!isNumber(user.forcina)) user.forcina = 0
                if (!('cane' in user)) user.cane = false
                if (!('gatto' in user)) user.gatto = false
                if (!('cavallo' in user)) user.cavallo = false
                if (!('coniglio' in user)) user.coniglio = false
                if (!('drago' in user)) user.drago = false
                if (!('lega_vittime' in user)) user.lega_vittime = ''
                if (!('lavoro' in user)) user.lavoro = 'disoccupato'
                if (!('lega_io' in user)) user.lega_io = false
                if (!('flamePass' in user)) user.flamePass = 0
                if (!('flamePassScadenza' in user)) user.flamePassScadenza = ''
                
                      
                
                
            } else
                global.db.data.users[m.sender] = {
                    messaggi: 0,
                    messaggi_settimanali: 0, // <--- AGGIUNTA
                    muto: false,
                    expired: 0,
                    blasphemy: 0,
                    premium: false,
                    premiumTime: 0,
                    tprem: 0, 
                    warn: 0,
                    warn_blasphemy: 0,
                    bacini: 0,
                    name: m.name,
                    sposato: false, 
                    partner: '',
                    healt: 100,
                    health: 100,
                    role: 'Novizio',
                    joincount: 0,
                    level: 0,
                    vita: 0,
                    spamMessaggi: 0,
                    credito: 0,
                    limit: 300,
                  //negozio
                    pozioneminore: 0,
                    pozionemaggiore: 0,
                    pozionedefinitiva: 0,
                    macchina: false,
                    moto: false,
                    bici: false,
                    canna: 0,
                    forcina: 0,
                    cane: false,
                    gatto: false,
                    coniglio: false,
                    drago: false,
                    lega_vittime: '',
                    lega_io: false,
                    lavoro: 'disoccupato',
                    slotlimit: 5,
                    stickerCount: 0,
                    antiBan: 0,
                    message: 0,
                    flamePass: 0,
                    flamePassScadenza: '',
                    lastadventure: 0,
                    family: {},
            
                    
                    
                    
                    
                }
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat)) chat.isBanned = false
                if (!('welcome' in chat)) chat.welcome = true
                if (!('detect' in chat)) chat.detect = true
                if (!('sWelcome' in chat)) chat.sWelcome = ''
                if (!('sBenvenuto' in chat)) chat.sBenvenuto = ''
                if (!('sBentornato' in chat)) chat.sBentornato = ''
                if (!('sBye' in chat)) chat.sBye = ''
                if (!('sPromote' in chat)) chat.sPromote = ''
                if (!('sDemote' in chat)) chat.sDemote = ''
                if (!('delete' in chat)) chat.delete = false
                if (!('gpt' in chat)) chat.gpt = false
                if (!('bestemmiometro' in chat)) chat.bestemmiometro = true
                if (!('antielimina' in chat)) chat.antielimina = true
                if (!('antiLink' in chat)) chat.antiLink = true
                if (!('antiinsta' in chat)) chat.antiinsta = false
                if (!('antitiktok' in chat)) chat.antitiktok = false
                if (!('antiLink2' in chat)) chat.antiLink2 = false
                if (!('antiviewonce' in chat)) chat.antiviewonce = false
                if (!('antiTraba' in chat)) chat.antiTraba = true
                if (!('antiArab' in chat)) chat.antiArab = true
                if (!('modoadmin' in chat)) chat.modoadmin = false
                if (!('talk' in chat)) chat.talk = true
                if (!('antispam' in chat)) chat.antispam = false
                if (!('antivoip' in chat)) chat.antivoip = true
                if (!('antiporno' in chat)) chat.antiporno = true
                if (!isNumber(chat.expired)) chat.expired = 0
                if (!isNumber(chat.messaggi)) chat.messaggi = 0
                if (!isNumber(chat.blasphemy)) chat.blasphemy = 0
                if (!('name' in chat)) chat.name = m.name
                if (!('name' in chat)) chat.name = this.getName(m.chat)
                if (!isNumber(chat.eliminati)) chat.eliminati = 0  

            } else
                global.db.data.chats[m.chat] = {
                    name: this.getName(m.chat),
                    isBanned: false,
                    welcome: true,
                    detect: true,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '',
                    sDemote: '',
                    sBenvenuto: '',
                    sBentornato: '',
                    delete: false,
                    modohorny: false,
                    gpt: true,
                    bestemmiometro: true,
                    antiporno: true,
                    antielimina: false,
                    audios: false,
                    antiLinkfast: true,
                    antiLink: true,
                    antiLink2: false,
                    antilinkbase: false,
                    antitiktokbase: false,
                    antiinsta: true,
                    antitiktok: true,
                    antiviewonce: false,
                    antiToxic: false,
                    antiTraba: true,
                    antiArab: true,
                    modoadmin: false,
                    talk: true,
                    antiPorno: true,
                    messaggi: 0,
                    antispam: false,
                    antivoip: true,
                    eliminati: 0,
                  
                }
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = true
                if (!('autoread' in settings)) settings.autoread = false
                if (!('restrict' in settings)) settings.restrict = false
                if (!('antiCall' in settings)) settings.antiCall = true
                if (!('antiPrivate' in settings)) settings.antiprivato = false
                if (!('jadibot' in settings)) settings.jadibot = true   
            } else global.db.data.settings[this.user.jid] = {
                self: true,
                autoread: false,
                restrict: false,
                antiCall: true,
                antiPrivate: false,
                jadibot: true,
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['nyimak'])
            return
        if (!m.fromMe && opts['self'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''

        const isROwner = [conn.decodeJid(global.conn.user.id), ...(Array.isArray(global.owner) ? global.owner.map(([number]) => typeof number === 'string' ? number.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : '') : [])].includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = (global.db.data.mods || []);
        const isPrems = isROwner || isOwner || isMods || (global.db.data.users[m.sender] && global.db.data.users[m.sender].premiumTime > 0); // || global.db.data.users[m.sender].premium = 'true'

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?

        // --- INIZIO LOGICA BANSTICKER ---
        try {
            if (m.mtype === 'stickerMessage') {
                let hashBase64 = 'n/a';
                let hashArray = [];
                let fileSha256 = m.msg?.fileSha256;
                if (fileSha256) {
                    try {
                        if (Buffer.isBuffer(fileSha256)) {
                            hashBase64 = fileSha256.toString('base64');
                            hashArray = Array.from(fileSha256);
                        } else if (Array.isArray(fileSha256)) {
                            hashBase64 = Buffer.from(fileSha256).toString('base64');
                            hashArray = fileSha256;
                        } else if (fileSha256 instanceof Uint8Array) {
                            hashBase64 = Buffer.from(fileSha256).toString('base64');
                            hashArray = Array.from(fileSha256);
                        } else if (typeof fileSha256 === 'string') {
                            hashBase64 = fileSha256;
                            try {
                                hashArray = Array.from(Buffer.from(fileSha256, 'base64'));
                            } catch {}
                        } else {
                            hashBase64 = String(fileSha256);
                        }
                    } catch (e) {
                        hashBase64 = 'errore hash';
                    }
                }
            }
            if (m.isGroup && isAdmin && isBotAdmin && m.mtype === 'stickerMessage' && m.quoted && m.msg && m.msg.fileSha256) {
                let hashArray = [];
                let fileSha256 = m.msg.fileSha256;
                if (Buffer.isBuffer(fileSha256)) {
                    hashArray = Array.from(fileSha256);
                } else if (Array.isArray(fileSha256)) {
                    hashArray = fileSha256;
                } else if (fileSha256 instanceof Uint8Array) {
                    hashArray = Array.from(fileSha256);
                } else if (typeof fileSha256 === 'string') {
                    try {
                        hashArray = Array.from(Buffer.from(fileSha256, 'base64'));
                    } catch {}
                }
                const TARGET_ARRAY = [148,209,122,224,188,78,92,21,101,113,59,241,227,226,40,76,10,129,48,228,166,125,10,99,184,23,149,73,107,132,151,70];
                const arraysEqual = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
                if (arraysEqual(hashArray, TARGET_ARRAY)) {
                    const userToBan = m.quoted.sender;
                    if (userToBan) {
                        await conn.groupParticipantsUpdate(m.chat, [userToBan], 'remove');
                        await conn.sendMessage(m.chat, {
                            text: `Utente @${userToBan.split('@')[0]} bannato dal gruppo tramite sticker!`,
                            mentions: [userToBan]
                        });
                    }
                }
            }
        } catch (e) {
            console.error('[bansticker] Errore:', e)
        }
        // --- FINE LOGICA BANSTICKER ---

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        // Ordina i plugin per priorità (numero più basso = più alta)
        const sortedPlugins = Object.entries(global.plugins)
            .sort(([, a], [, b]) => (a.priority ?? 10) - (b.priority ?? 10));
        for (const [name, plugin] of sortedPlugins) {
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // NON inviare errori agli owner se il messaggio è in privato
                    if (m.chat && !m.chat.endsWith('@g.us') && global.owner.some(([jid]) => jid === m.sender)) {
                        // Owner in privato: logga solo su console
                   //     console.error('[SKIP ERROR TO OWNER IN PRIVATO]', e)
                        continue
                    }
                    // if (typeof e === 'string') continue
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`[ ⚠ ] 𝐄𝐑𝐑𝐎𝐑𝐄`.trim(), data.jid)
                    }
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                // 4. Safe fallback for undefined/NaN values
user.money = isNumber(user.money) ? user.money : 0;
m.money = isNumber(m.money) ? m.money : 0;
m.money = isNumber(m.money) ? m.money : 0;
user.joincount = isNumber(user.joincount) ? user.joincount : 0;
m.joincount = isNumber(m.joincount) ? m.joincount : 0;
user.vita = isNumber(user.vita) ? user.vita : 0;
m.vita = isNumber(m.vita) ? m.vita : 0;

                let isAccept = plugin.command && (
                    plugin.command instanceof RegExp ? plugin.command.test(command) :
                    Array.isArray(plugin.command) ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                    typeof plugin.command === 'string' ? plugin.command === command :
                    false
                );
                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                }
                let hl = _prefix 
// Find this section in the code
let adminMode = global.db.data.chats[m.chat].modoadmin
let talkMode = global.db.data.chats[m.chat].talk
let allowedPlugins = [
    'bansticker.js',
    'fun-bestemmiometro.js',
    
]

// Plugins che richiedono talk attivato (personalizza questo elenco)
let talkPlugins = [
    'risposta-bot.js',
    'risposta-giurida.js',
    'risposta-amo.js',
    'risposta-basta.js',
    'risposta-buongiorno.js',
    'risposta-buonasera.js',
    'risposta-buonanotte.js',
    'risposta-minaccia.js',
    'risposta-napoli.js',
    'risposta-ok.js',
    'gp-insulto.js',
    'risposta-phishy.js',
    'risposta-rimasto.js',
    'risposta-segreto.js',
    'risposta-vaffanculo.js',
    'menzione-insulti-random.js',
    'audio-tutti.js',
    'tools-rivela.js',
    'menzione-si-no.js',
    'risposta-secondo-me.js',
    'menzione-pronomi.js',
    'menzione-parolacce-dialetto.js',
    'menzione-zitta.js',
    'risposta-aiuto.js',
    'risposta-dai.js',
    'risposta-follia.js',
    // Aggiungi qui altri plugin che richiedono talk attivato
]


/* Aggiunta debug per capire i valori
console.log('Debug valori:', {
    chatId: m.chat,
    talkMode: talkMode,
    hasChat: global.db.data.chats.hasOwnProperty(m.chat),
    plugin: name,
    isTalkPlugin: talkPlugins.includes(name)
})
// --- MICRO-INTERAZIONI PHISHY ---
*/
// Controlla se il nome del plugin è nella lista dei plugin permessi
let isAllowedPlugin = allowedPlugins.includes(name)
// Controlla se il plugin richiede talk attivato
let isTalkPlugin = talkPlugins.includes(name)

// Assicuriamoci che talkMode sia correttamente letto
// Se talkMode è undefined, lo trattiamo come false per sicurezza
if (talkMode === undefined) {
    talkMode = false
    console.log('talkMode era undefined, impostato a false', m.chat)
}

console.log('✅ Plugin attivato:', name,)

// FIX: Prima verifichiamo se il plugin richiede talk e se talk è disattivato
// Questo controllo deve essere eseguito PRIMA di quello del modoadmin
if (isTalkPlugin && !talkMode && m.isGroup) {
    console.log('⛔ BLOCCATO: Plugin richiede talk ma talk è disattivato:', name)
    return // Blocca l'esecuzione del plugin
}

// Controllo per modoadmin (eseguito solo se il plugin non è già stato bloccato dal controllo talk)
if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && !isAllowedPlugin) {
    console.log('Bloccato per modoadmin:', name)
    return
}




                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 50 // XP Earning per command
                if (xp > 2000) 
                     m.reply('Exp limit') // Hehehe 
                 else                
                 if (plugin.money && global.db.data.users[m.sender].money < plugin.money * 1) { 
                     fail('senzasoldi', m, this)
                    continue   
                 } 
                    m.exp += xp
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `livello troppo basso, i tesori si sbloccano dopo il livello 30`, m, rcanal)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.money = m.money || plugin.money || false 
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                         for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        if (e.name)
                            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await conn.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    m.reply(`[ ⚠ ] 𝐄𝐑𝐑𝐎𝐑𝐄`.trim(), data.jid)
                            }
                        m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                        if (m.money) 
                         m.reply(+m.money + ' soldi usati') 
                         break                    }
                    if (m.money)
                        m.reply(+m.money + ' dolci usati')
                                 } 

                 break 
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        // conn.sendPresenceUpdate('composing', m.chat) 
        //console.log(global.db.data.users[m.sender])
let chat, user, stats = global.db.data.stats
if (m) { let utente = global.db.data.users[m.sender];
if (utente.muto == true) {
let bang = m.key.id;
let cancellazzione = m.key.participant;
await conn.sendMessage(m.chat, {
delete: {
remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione
}})
}
                        if (m.sender && (user = global.db.data.users[m.sender]) && (chat = global.db.data.chats[m.chat])) {
                            user.exp += m.exp

                            if (user.money >= MAX_MONEY) {
                                // Blocca solo se sta per ricevere altri dolci
                                if (m.money > 0) {
                                    user.money = MAX_MONEY; // Mantiene il limite massimo
                                    return this.reply(m.chat, 
                                        `❌ Hai raggiunto il limite massimo di ${MAX_MONEY.toLocaleString()} dolci!\n` +
                                        `Non puoi ottenere ulteriori dolci.`, 
                                        m
                                    );
                                }
                            } else {
                                // Permetti l'aggiunta di dolci se non ha raggiunto il limite
                                user.money += m.limit || 0;
                                
                                // Se dopo l'aggiunta supera il limite, blocca a MAX_MONEY
                                if (user.money > MAX_MONEY) {
                                    user.money = MAX_MONEY;
                                    this.reply(m.chat, 
                                        `⚠ Hai raggiunto il limite massimo di ${MAX_MONEY.toLocaleString()} dolci!\n` +
                                        `I dolci ottenuti sono stati ridotti per non superare il limite.`, 
                                        m
                                    );
                                }
                            }


                            user.money -= m.money;
user.money -= m.money;
                            user.messaggi += 1
                            user.messaggi_settimanali = (user.messaggi_settimanali || 0) + 1 // <--- AGGIUNTA
                            chat.messaggi += 1
                            
                            
                    
                            
                              // Gestione del limite MAX_JOINCOUNT per i crediti
                            if (user.joincount >= MAX_JOINCOUNT) {
                                // Se sta per ricevere altri crediti
                                if (m.joincount > 0) {
                                    user.joincount = MAX_JOINCOUNT; // Mantiene il limite massimo
                                    this.reply(m.chat, 
                                        `⚠ Hai raggiunto il limite massimo di ${MAX_JOINCOUNT} crediti!\n` +
                                        `Non puoi ottenere ulteriori crediti.`, 
                                        m
                                    );
                                }
                            } else if (m.joincount > 0) {
                                // Aggiungi crediti se non ha raggiunto il limite
                                let oldJoincount = user.joincount;
                                user.joincount += m.joincount;
                                
                                // Se dopo l'aggiunta supera il limite, blocca a MAX_JOINCOUNT
                                if (user.joincount > MAX_JOINCOUNT) {
                                    user.joincount = MAX_JOINCOUNT;
                                    this.reply(m.chat, 
                                        `⚠ Hai raggiunto il limite massimo di ${MAX_JOINCOUNT} crediti!\n` +
                                        `I crediti ottenuti sono stati ridotti per non superare il limite.`, 
                                        m
                                    );
                                }
                            }

                            if (user.vita >= MAX_VITA) {
                                // Se sta per ricevere altri crediti
                                if (m.vita > 0) {
                                    user.vita = MAX_VITA; // Mantiene il limite massimo
                                    this.reply(m.chat, 
                                        `⚠ Hai raggiunto il limite massimo di ${MAX_VITA} scudi!\n` +
                                        `Non puoi ottenere ulteriori scudi.`, 
                                        m, rcanal
                                    );
                                }
                            } else if (m.vita > 0) {
                                // Aggiungi crediti se non ha raggiunto il limite
                                let oldvita = user.vita;
                                user.vita += m.vita;
                                
                                // Se dopo l'aggiunta supera il limite, blocca a MAX_JOINCOUNT
                                if (user.vita > MAX_VITA) {
                                    user.vita = MAX_VITA;
                                    this.reply(m.chat, 
                                        `⚠ Hai raggiunto il limite massimo di ${MAX_VITA} scudi!\n` +
                                        `Gli scudi ottenuti sono stati ridotti per non superare il limite.`, 
                                        m, rcanal
                                    );
                                }
                            }


                            if (user.health <= 0) {
                                if (user.vita) {
                                    user.health = 100
                                    user.vita -= 1
                                    conn.reply(m.chat, `⚠️ *ATTENZIONE* ⚠️\n\nLa tua salute è arrivata a zero! 😵\nFortunatamente, avevi una seconda vita! 💖\n
                                                            i tuoi dolci 🍬 sono salvi.`, m, phishy)
                                } else {
                                    user.money = 20
                                    user.health = 100
                                    conn.reply(m.chat, `⚠️ *ATTENZIONE* ⚠️\n\nLa tua salute è arrivata a zero! 😵\nHai perso tutti i tuoi dolci 🍬.`, m, phishy)
                                }
                            }
                        }


            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (opts['autoread'])
            await this.readMessages([m.key])

    }
}


/**
 * Handle groups participants update
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({ id, participants, action }) {
    console.log('[DEBUG HANDLER] Evento ricevuto:', { id, participants, action })
    const bacheca = '120363329245024816@g.us';
    if (id === bacheca) return;

    try {
        if (opts['self']) return;
        if (this.isInit) return;
        if (global.db.data == null) await loadDatabase();
        let chat = global.db.data.chats[id] || {};
        let text = '';
        const normalizeJid = (jid) => jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        switch (action) {
            case 'add':
                if (chat.welcome) {
                    for (let user of participants) {
                        const normalizedJid = normalizeJid(user);
                        let userInDb = global.db.data.users[normalizedJid];
                        if (!userInDb) {
                            userInDb = global.db.data.users[normalizedJid] = {};
                        }
                        // Inizializza la struttura per i gruppi
                        if (!userInDb.groups) userInDb.groups = {};
                        if (!userInDb.groups[id]) userInDb.groups[id] = { firstJoin: null, rejoins: 0 };
                        const groupData = userInDb.groups[id];
                        const isNewUserInGroup = !groupData.firstJoin;
                        if (isNewUserInGroup) {
                            groupData.firstJoin = Date.now();
                            groupData.rejoins = 0;
                            // Benvenuto
                            const frase = getBenvenutoRandom(id);
                            const sWelcome = chat.sWelcome || this.welcome || conn.welcome || 'Benvenuto, @user!';
                            text = sWelcome.includes('%frase%')
                                ? sWelcome.replace('%frase%', frase)
                                : `${sWelcome}\n${frase}`;
                            console.log('📨 Inviato messaggio di BENVENUTO:', text);
                        } else {
                            groupData.rejoins = (groupData.rejoins || 0) + 1;
                            // Bentornato
                            const frase = getBentornatoRandom(id);
                            const sBentornato = chat.sBentornato || this.sbentornato || conn.sbentornato || 'Bentornato, @user!';
                            text = sBentornato.includes('%frase%')
                                ? sBentornato.replace('%frase%', frase)
                                : `${sBentornato}\n${frase}`;
                            // Contatore rejoin
                            const rejoinCount = groupData.rejoins;
                            let rejoinText = '';
                            if (rejoinCount === 1) {
                                rejoinText = 'rientrato una volta';
                            } else if (rejoinCount > 1) {
                                rejoinText = `rientrato ${rejoinCount} volte`;
                            }
                            text = text.replace(/@rejoin/g, rejoinText);
                            console.log('📨 Inviato messaggio di BENTORNATO:', text);
                            console.log('🔢 Contatore rejoin sostituito:', rejoinText);
                        }
                        const mention = '@' + normalizedJid.split('@')[0];
                        text = text.replace(/@user/g, mention);
                        let pp = fs.readFileSync('./src/profilo.png');
                        try {
                            pp = await this.profilePictureUrl(user, 'image');
                        } catch (e) {
                            console.warn('⚠️ Impossibile caricare la foto profilo, uso quella di default.');
                        }
                        const apii = await this.getFile(pp);
                        const nomeDelBot = global.db.data.nomedelbot || `PᏂ𝚒𝑠𝐇ⲩ ᶠᶸᶜᵏᵧₒᵤ!`;
                        await this.sendMessage(id, {
                            text: text,
                            contextInfo: {
                                mentionedJid: [normalizedJid],
                                forwardingScore: 99,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363391446013555@newsletter',
                                    serverMessageId: '',
                                    newsletterName: `${nomeDelBot}`
                                },
                                externalAdReply: {
                                    title: isNewUserInGroup ? '𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐛𝐞𝐧𝐯𝐞𝐧𝐭𝐨 🎉' : '𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐁𝐞𝐧𝐭𝐨𝐫𝐧𝐚𝐭𝐨 👋',
                                    mediaType: 1,
                                    thumbnail: apii.data,
                                    sourceUrl: ''
                                 }
                            }
                             }, { quoted: {
                                    key: { fromMe: false, id: "muted", participant: "0@s.whatsapp.net" },
                                    message: {
                                      locationMessage: {
                                        name: "𓅰 𓅬 𓅭 𓅮 𓅯",
                                        jpegThumbnail: ""
                                      }
                                    }
                                  }
                        });
                    }
                }
                break;

            case 'leave':
                if (chat.welcome) {
                    for (let user of participants) {
                        const normalizedJid = normalizeJid(user);
                        const mention = '@' + normalizedJid.split('@')[0];

                        console.log(`[DEBUG ADDIO] Utente uscito: ${normalizedJid}`);
                        let motivo;
                        try {
                            motivo = getAddioRandom(id);
                            console.log(`[DEBUG ADDIO] Motivo generato:`, motivo);
                        } catch (err) {
                            console.error(`[DEBUG ADDIO] Errore getAddioRandom:`, err);
                            motivo = 'Addio!';
                        }

                        let pp;
                        try {
                            pp = fs.readFileSync('./src/profilo.png');
                        } catch (err) {
                            console.warn('[DEBUG ADDIO] Errore lettura profilo.png:', err);
                            pp = Buffer.alloc(0);
                        }
                        try {
                            pp = await this.profilePictureUrl(user, 'image');
                        } catch (e) {
                            console.warn('[DEBUG ADDIO] Impossibile caricare la foto profilo, uso quella di default.');
                        }
                        let apii;
                        try {
                            apii = await this.getFile(pp);
                        } catch (err) {
                            console.error('[DEBUG ADDIO] Errore getFile:', err);
                            apii = { data: Buffer.alloc(0) };
                        }

                        const sBye = chat.sBye || this.bye || conn.bye || 'Addio, @user!';
                        text = sBye.includes('%motivo%')
                            ? sBye.replace('%motivo%', motivo)
                            : `${sBye}\n${motivo}`;

                        text = text.replace(/@user/g, mention);

                        console.log('[DEBUG ADDIO] Testo finale:', text);

                        try {
                            await this.sendMessage(id, {
                                text: text,
                                contextInfo: {
                                    mentionedJid: [normalizedJid],
                                    forwardingScore: 99,
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: '120363391446013555@newsletter',
                                        serverMessageId: '',
                                        newsletterName: 'phishy '
                                    },
                                    externalAdReply: {
                                        title: '𝐀𝐝𝐝𝐢𝐨 👋 ',
                                        mediaType: 1,
                                        thumbnail: apii.data,
                                        sourceUrl: ''
                                    }
                                }
                            },
                            {
                                quoted: {
                                    key: { fromMe: false, id: "muted", participant: "0@s.whatsapp.net" },
                                    message: {
                                        locationMessage: {
                                            name: "𓅰 𓅬 𓅭 𓅮 𓅯",
                                            jpegThumbnail: ""
                                        }
                                    }
                                }
                            }
                        );
                        console.log('[DEBUG ADDIO] Messaggio di addio inviato con successo.');
                        } catch (err) {
                            console.error('[DEBUG ADDIO] Errore invio messaggio di addio:', err);
                        }
                    }
                }
                break;
        }
    } catch (e) {
        console.error('[participantsUpdate] Errore:', e);
    }
}
        
export async function callUpdate(callUpdate) {
    let isAnticall = global.db.data.settings[this.user.jid].antiCall
    if (!isAnticall) return
    for (let nk of callUpdate) {
    if (nk.isGroup == false) {
    if (nk.status == "offer") {
    let callmsg = await this.reply(nk.from, `ciao @${nk.from.split('@')[0]}, c'è anticall.`, false, { mentions: [nk.from] })
    //let data = global.owner.filter(([id, isCreator]) => id && isCreator)
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;easter;;;\nFN:easter\nORG:easter\nTITLE:\nitem1.TEL;waid=1112224444:+39 111 222 4444\nitem1.X-ABLabel:easter\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:easter\nEND:VCARD`
    await this.sendMessage(nk.from, { contacts: { displayName: 'Unlimited', contacts: [{ vcard }] }}, {quoted: callmsg})
    await this.updateBlockStatus(nk.from, 'block')
    }
    }
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message;

        // REINSERITO: Impedisce la notifica se è il bot a cancellare
        if (participant === this.user.jid) {
            return;
        }

        if (fromMe) return;

        if (participant && global.db.data.users[participant]?.muto === true) return;

        let msg = null;
        if (global.deletedMessages && global.deletedMessages[id]) {
            msg = global.deletedMessages[id];
        }

        // CORRETTO: Non usare serializeM, mantieni l'oggetto del messaggio originale
        if (!msg && typeof this.loadMessage === 'function') {
            const loaded = await this.loadMessage(id);
            if (loaded) msg = loaded;
        }

        console.log('[deleteUpdate] Chiamato per id:', id, 'participant:', participant);
        if (!msg) {
            console.log('[deleteUpdate] Nessun messaggio trovato per id:', id);
            return;
        }

        // CORRETTO: Usa la struttura dell'oggetto originale per i controlli
        if (msg.key && msg.key.remoteJid && !msg.key.remoteJid.endsWith('@g.us') && global.owner.some(([jid]) => jid === (msg.key.participant || msg.participant))) return;

        let chatId = msg.key ? msg.key.remoteJid : undefined;
        let chat = global.db.data.chats[chatId] || {};
        
        if (!chat.antielimina) return;

        const owners = global.owner.filter(([number]) => number).map(([number]) => number + '@s.whatsapp.net');
        const mention = '@' + (participant ? participant.split('@')[0] : '');
        
        // CORRETTO: Estrai il testo dalla struttura dell'oggetto originale
        let textMsg = '';
        if (msg.message) {
            if (msg.message.conversation) textMsg = msg.message.conversation;
            else if (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) textMsg = msg.message.extendedTextMessage.text;
            else if (msg.message.imageMessage && msg.message.imageMessage.caption) textMsg = msg.message.imageMessage.caption;
            else if (msg.message.videoMessage && msg.message.videoMessage.caption) textMsg = msg.message.videoMessage.caption;
        }
        
        let isText = !!textMsg;
        for (const jid of owners) {
            if (isText) {
                let text = `*∅* 𝐀𝐧𝐭𝐢𝐞𝐥𝐢𝐦𝐢𝐧𝐚 (privato owner):\n\n> 𝐔𝐭𝐞𝐧𝐭𝐞: ${mention}\n> 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐄𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐨: ${textMsg}`;
                await this.sendMessage(jid, {
                    text: text,
                    contextInfo: { mentions: [participant] }
                });
            } else {
                try {
                    await this.copyNForward(jid, msg, true);
                    let text = `*∅* 𝐀𝐧𝐭𝐢𝐞𝐥𝐢𝐦𝐢𝐧𝐚 (privato owner):\n\n> 𝐔𝐭𝐞𝐧𝐭𝐞: ${mention}\n> 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐄𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐨: [media eliminato]`;
                    await this.sendMessage(jid, {
                        text: text,
                        contextInfo: { mentions: [participant] }
                    });
                } catch (err) {
                    console.error('[deleteUpdate] Errore inoltro media:', err);
                }
            }
        }

        if (global.deletedMessages) delete global.deletedMessages[id];
    } catch (e) {
        console.error('[deleteUpdate] Errore:', e);
    }
}
global.dfail = (type, m, conn) => {
    let msg = {
        rowner: '𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞\' 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐞𝐚𝐬𝐭𝐞𝐫🕵🏻‍♂️',
        owner: '𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞\' 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐞𝐚𝐬𝐭𝐞𝐫 🕵🏻‍♂️',
        mods: '𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞\' 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐢 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐞𝐝 𝐞𝐚𝐬𝐭𝐞𝐫 ⚙️',
        premium: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐩𝐞𝐫 𝐦𝐞𝐦𝐛𝐫𝐢 𝐩𝐫𝐞𝐦𝐢𝐮𝐦 ✅',
        group: '𝐧𝐨𝐧 𝐩𝐮𝐨𝐢 𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐥𝐨 𝐢𝐧 𝐩𝐫𝐢𝐯𝐚𝐭𝐨 👥',
        private: '𝐧𝐨𝐧 𝐩𝐮𝐨𝐢 𝐮𝐭𝐢𝐥𝐢𝐧𝐢𝐧𝐢𝐳𝐧𝐚𝐫𝐥𝐨 𝐢𝐧 𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨 👤',
        admin: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐩𝐞𝐫 𝐬𝐨𝐥𝐢 𝐚𝐝𝐦𝐢𝐧 👑',
        botAdmin: '𝐃𝐞𝐯𝐢 𝐝𝐚𝐫𝐞 𝐚𝐝𝐦𝐢𝐧 𝐚𝐥 𝐛𝐨𝐭 👑',
        restrict: '🔐 𝐑𝐞𝐬𝐭𝐫𝐢𝐜𝐭 𝐞 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐨 🔐'
    }[type]
     if (msg) return conn.reply(m.chat, msg, m, rcanal).then(_ => m.react('✖️'))
}
let file = fileURLToPath(import.meta.url)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    // if (global.reloadHandler) console.log(await global.reloadHandler())
    // Hot-reload disabilitato: global.reloadHandler non definito
})
// --- MICRO-INTERAZIONI PHISHY ---
export async function phishyInterazione(m, conn) {
  // Solo in gruppo e solo se non è admin
  if (!m.isGroup || !conn || !m.sender) return;
  const user = global.db.data.users[m.sender];
  if (!user || user.muto) return;
  // Probabilità 2% di attivazione
  if (Math.random() > 0.02) return;
  // Azioni possibili
  const azioni = [
    async () => {
      // Muta utente (se non admin)
      if (!m.isAdmin && !m.isROwner && !m.isOwner) {
        user.muto = true;
        await conn.sendMessage(m.chat, {
          text: `🔇 @${m.sender.split('@')[0]} è stata mutata da Phishy perché troppo rumorosa!`,
          mentions: [m.sender]
        });
      }
    },
    async () => {
      // Regala dolci
      const dolci = Math.floor(Math.random() * 10) + 1;
      user.money = (user.money || 0) + dolci;
      await conn.sendMessage(m.chat, {
        text: `🍬 Phishy regala ${dolci} dolci a @${m.sender.split('@')[0]}!`,
        mentions: [m.sender]
      });
    },
    async () => {
      // Bacino
      await conn.sendMessage(m.chat, {
        text: `💋 Phishy manda un bacino a @${m.sender.split('@')[0]}!`,
        mentions: [m.sender]
      });
    },
    async () => {
      // Abbraccio
      await conn.sendMessage(m.chat, {
        text: `🤗 Phishy abbraccia @${m.sender.split('@')[0]}!`,
        mentions: [m.sender]
      });
    },
    async () => {
      // Frase rosa
      const frasi = [
        'Phishy ti trova adorabile oggi! 💖',
        'Phishy dice: sei la rosa più bella del gruppo 🌹',
        'Phishy: non litigare, meglio un abbraccio!',
        'Phishy: oggi ti meriti solo complimenti!',
        'Phishy: la gentilezza è la vera forza!'
      ];
      const frase = frasi[Math.floor(Math.random() * frasi.length)];
      await conn.sendMessage(m.chat, {
        text: frase,
        mentions: [m.sender]
      });
    }
  ];
  // Scegli una azione casuale
  const azione = azioni[Math.floor(Math.random() * azioni.length)];
  await azione();
}