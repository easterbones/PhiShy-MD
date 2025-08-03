const items = ['limit', 'exp', 'joincount', 'pozione_minore', 'pozione_maggiore', 'pozione_definitiva', 'macchina', 'moto', 'bici', 'cane', 'gatto', 'coniglio', 'drago', 'piccione', 'serpente', 'cavallo', 'pesce', 'riccio', 'scoiattolo', 'polpo', 'ragno', 'scorpione', 'canna', 'forcina', 'scudo', 'bacini', 'uova', 'lente', 'filtro']

let confirmation = {}
const MAX_LIMIT = 1000000

// Importa i moduli necessari
import fs from 'fs'
import path from 'path'

// Percorsi delle immagini locali
const basePath = './src/img/economy'
const successImage = fs.readFileSync(path.join(basePath, 'transfer-success.png'))
const taxImage = fs.readFileSync(path.join(basePath, 'tax.png'))
const locationImage = fs.readFileSync(path.join(basePath, 'location.png'))

// Percorso base immagini oggetti transfer
const baseTransferImgPath = path.join('src', 'img', 'shop');

// Tasse fisse in caramelle (limit)
const taxRates = {
  'exp': 0.10,                  // 10% del valore in caramelle
  'joincount': 0.15,            // 15% del valore in caramelle
  'pozione_minore': 0.20,       // 20%
  'pozione_maggiore': 0.25,     // 25%
  'pozione_definitiva': 0.30,   // 30%
  'macchina': 0.35,             // 35%
  'moto': 0.35,
  'bici': 0.35,
  'cane': 0.40,                // 40%
  'gatto': 0.40,
  'cavallo': 0.40,
  'coniglio': 0.40,
  'drago': 0.40,
  'piccione': 0.40,
  'serpente': 0.40,
  'pesce': 0.40,
  'riccio': 0.40,
  'scoiattolo': 0.40,
  'polpo': 0.40,
  'ragno': 0.40,
  'scorpione': 0.40,
  'canna': 0.25,
  'forcina': 0.25,
  'scudo': 0.30,
  'bacini': 0.15,
  'uova': 0.20,
  'lente': 0.15,
  'filtro': 0.15
}

// Valori di conversione in caramelle
const itemValues = {
  'exp': 5,                     // 1 XP = 5 caramelle
  'joincount': 10,              // 1 gettone = 10 caramelle
  'pozione_minore': 50,
  'pozione_maggiore': 150,
  'pozione_definitiva': 500,
  'macchina': 2000,
  'moto': 1000,
  'bici': 500,
  'cane': 800,
  'gatto': 800,
  'cavallo': 1500,
  'coniglio': 600,
  'drago': 3000,
  'piccione': 400,
  'serpente': 700,
  'pesce': 300,
  'riccio': 500,
  'scoiattolo': 450,
  'polpo': 900,
  'ragno': 750,
  'scorpione': 850,
  'canna': 200,
  'forcina': 100,
  'scudo': 300,
  'bacini': 50,
  'uova': 80,
  'lente': 120,
  'filtro': 150
}

// Funzione per trovare l'oggetto più simile
function getClosestItem(input) {
    if (!input) return null
    input = input.toLowerCase()
    let minDist = Infinity, closest = null
    for (const it of items) {
        let dist = levenshtein(input, it)
        if (dist < minDist) {
            minDist = dist
            closest = it
        }
    }
    return closest
}

// Distanza di Levenshtein semplice
function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => [])
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            matrix[i][j] = a[i - 1] === b[j - 1]
                ? matrix[i - 1][j - 1]
                : Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                )
        }
    }
    return matrix[a.length][b.length]
}

// Funzione per ottenere la thumbnail specifica per un oggetto (come shop-plugin-discounts.js)
function getItemThumbnail(itemKey) {
    const itemImgPath = path.join('src', 'img', 'shop', `${itemKey}.png`)
    if (fs.existsSync(itemImgPath)) {
        return fs.readFileSync(itemImgPath)
    }
    return null
}

async function handler(m, { conn, args, usedPrefix, command }) {
    if (confirmation[m.sender]) 
        return conn.reply(m.chat, '✖️ Hai già una transazione in corso! Attendi il completamento.', m)
    
    let user = global.db.data.users[m.sender]
    const item = items.filter(v => v in user && typeof user[v] == 'number')
    
    let helpText = `💠 *SISTEMA DI TRASFERIMENTO* 💠\n\n` +
                  `📌 Esempio: ${usedPrefix + command} dolci 100 @utente\n\n` +
                  `📦 *Oggetti trasferibili:*\n` +
                  `┌───────────────\n` +
                  `│ • 🍬 Dolci (max ${MAX_LIMIT.toLocaleString()})\n` +
                  `│ • ⚡ Esperienza (XP)\n` +
                  `│ • 🪙 Gettoni\n` +
                  `│ • 💊 Pozioni (minore/maggiore/definitiva)\n` +
                  `│ • 🚗 Veicoli (auto/moto/bici)\n` +
                  `│ • 🐾 Animali\n` +
                  `│ • 🛡️ Oggetti vari\n` +
                  `└───────────────\n\n` +
                  `ℹ️ Tutti i trasferimenti prevedono una tassa in caramelle.`

    // Campo oggetto mancante
    if (!args[0]) return m.reply('❌ Devi specificare l\'oggetto da trasferire.\nEsempio:\n ' + '> ' + usedPrefix + command + ' dolci 100 @utente')

    // Primo argomento non valido
    if (args[0] && args[0].startsWith('@')) {
        return m.reply('❌ Il primo campo deve essere l\'oggetto da trasferire.\nEsempio:\n ' + '> ' + usedPrefix + command + ' dolci 100 @utente')
    }
    if (args[0] && isNumber(args[0])) {
        return m.reply('❌ Il primo campo deve essere l\'oggetto, non un numero.\nEsempio:\n ' + '> ' + usedPrefix + command + 'dolci 100 @utente')
    }
    if (args[0] === (args[1]) && !args[1].startsWith('@')) {
        return m.reply('❌ hai scritto due volte l\'oggetto, riprova cosi:\n' + '> ' + usedPrefix + command + 'dolci 100 @utente')
    }

    // Campo quantità mancante
    if (!args[1]) {
        return m.reply('❌ Devi specificare la quantità da trasferire.\nEsempio:\n ' + '> ' + usedPrefix + command + ' dolci 100 @utente')
    }
    // Quantità non valida
    if (args[1] && !isNumber(args[1]) && !args[1].startsWith('@')) {
        return m.reply('❌ La quantità deve essere un numero.\nEsempio:\n ' + '> ' + usedPrefix + command + ' dolci 100 @utente')
    }
    // Secondo argomento è una mention ma manca la quantità
    if (args[1] && args[1].startsWith('@')) {
        // Se manca la quantità ma c'è la mention, imposta quantità a 1 e sposta la mention in args[2]
        args.splice(1, 0, '1')
    }

    // Se args[1] non è un numero e non è una mention, metti di default 1
    if ((!args[1] || !isNumber(args[1])) && (!args[1] || !args[1].startsWith('@'))) {
        args.splice(1, 0, '1')
    }

    // Campo utente mancante
    if (!args[2] && (!m.mentionedJid || m.mentionedJid.length === 0)) {
        return m.reply('❌ Devi specificare l\'utente destinatario con @utente.\nEsempio:\n ' + '> ' + usedPrefix + command + ' dolci 100 @utente')
    }
    // Terzo argomento non è una mention e non c'è mention
    if (args[2] && !args[2].startsWith('@') && (!m.mentionedJid || m.mentionedJid.length === 0)) {
        return m.reply('❌ Il terzo campo deve essere @utente destinatario.\nEsempio:\n ' + '> ' + usedPrefix + command + ' dolci 100 @utente')
    }

    const typeAlias = { 
      'dolci': 'limit', 
      'xp': 'exp', 
      'gettoni': 'joincount', 
      'pozione minore': 'pozione_minore', 
      'pozione maggiore': 'pozione_maggiore', 
      'pozione definitiva': 'pozione_definitiva' 
    }
    const type = (args[0] || '').toLowerCase()
    const realType = typeAlias[type] || type

    // Oggetto non esiste: suggerisci il più simile
    if (!items.includes(realType)) {
        const suggestion = getClosestItem(type)
        let example = ''
        let thumb = null
        if (suggestion === 'limit') {
            example = `${usedPrefix + command} limit 100 @utente`
        } else if (suggestion === 'exp') {
            example = `${usedPrefix + command} exp 1000 @utente`
        } else if (suggestion) {
            example = `${usedPrefix + command} ${suggestion} @utente`
        }
        if (suggestion) {
            thumb = getItemThumbnail(suggestion) || taxImage
        } else {
            thumb = taxImage
        }
        return await conn.sendMessage(m.chat, {
            text:
                `❌ L'oggetto "${args[0]}" non esiste.\n` +
                (suggestion ? `Forse volevi scrivere: *${suggestion}* ?\n` : '') +
                'Scrivi il nome corretto di un oggetto disponibile.\n' +
                (example ? 'Esempio:\n> ' + example + '\n' : ''),
            contextInfo: {
                externalAdReply: {
                    title: suggestion ? `Suggerimento: ${suggestion}` : 'Oggetto non trovato',
                    body: suggestion ? `Prova con "${suggestion}"` : '',
                    thumbnail: thumb,
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        })
    }

    // Prendo la quantità da trasferire (minima 1)
    const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1)))
    
    // Gestione JID
    let who = m.mentionedJid && m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : args[2] 
            ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') 
            : ''
    
    if (!who) return m.reply('❌ Devi taggare un utente!', null, { mentions: [] })
    if (who === m.sender) return m.reply('❌ Non puoi trasferire a te stesso!')
    
    try {
        who = conn.parseMention(who)[0] || who
        if (!(who in global.db.data.users)) 
            return m.reply('❌ Utente non registrato nel database', null, { mentions: [who] })
    } catch (e) {
        return m.reply('❌ ID utente non valido')
    }

    // Calcolo del valore in caramelle per la tassa
    let taxInLimit = 0;
    let taxRate = 0; // Dichiarazione della variabile taxRate
    
    if (realType === 'limit') {
        // Tassa dinamica per i dolci
        if (count < 10) {
            taxRate = 0;
        } else if (count < 1000) {
            taxRate = 0.05 + ((count - 10) / 990) * 0.35;
        } else {
            taxRate = 0.40;
        }
        taxInLimit = Math.ceil(count * taxRate);
    } else {
        // Per altri oggetti: tassa in caramelle basata sul valore dell'oggetto
        const itemValue = itemValues[realType] || 10; // Valore di default
        taxRate = taxRates[realType] || 0.05;
        taxInLimit = Math.ceil(count * itemValue * taxRate);
    }
    
    // Verifica che il mittente abbia abbastanza caramelle per la tassa
    if (user.limit < taxInLimit) {
        return m.reply(`❌ Non hai abbastanza caramelle per pagare la tassa!\nNecessarie: ${taxInLimit} 🍬 (hai ${user.limit} 🍬)`)
    }
    
    // Verifica che il mittente abbia l'oggetto da trasferire
    if (user[realType] < count) {
        const itemName = {
            'limit': '🍬 Dolci',
            'exp': '⚡ XP',
            'joincount': '🪙 Gettoni',
            'pozione_minore': '💊 Pozione minore',
            'pozione_maggiore': '💊 Pozione maggiore',
            'pozione_definitiva': '💊 Pozione definitiva',
            'macchina': '🚗 Auto',
            'moto': '🏍️ Moto',
            'bici': '🚲 Bici'
        }[realType] || realType;
        return m.reply(`❌ Non hai abbastanza ${itemName}!\nNecessari: ${count} (hai ${user[realType]})`)
    }

    // Controlli quantità e limiti (solo per dolci)
    if (realType === 'limit') {
        const receiver = global.db.data.users[who]
        const username = conn.getName(who) || who.split('@')[0]
        if (!receiver) {
            return m.reply(
                `❌ L'utente destinatario non è registrato nel database. Deve prima interagire con il bot!`,
                null, { mentions: [who] }
            )
        }
        if (receiver.limit >= MAX_LIMIT) {
            return m.reply(
                `❌ @${username} ha già il massimo di ${MAX_LIMIT.toLocaleString()} dolci!\n` +
                `Non puoi trasferirgliene altri.`,
                null, { mentions: [who] }
            )
        }
        if (receiver.limit + count > MAX_LIMIT) {
            const availableSpace = MAX_LIMIT - receiver.limit
            return m.reply(
                `❌ @${username} può ricevere solo ${availableSpace.toLocaleString()} dolci!\n` +
                `Modifica la quantità.`,
                null, { mentions: [who] }
            )
        }
    }
    
    // Richiesta conferma con thumbnail avanzata
    const itemName = {
        'limit': '🍬 Dolci',
        'exp': '⚡ XP',
        'joincount': '🪙 Gettoni',
        'pozione_minore': '💊 Pozione minore',
        'pozione_maggiore': '💊 Pozione maggiore',
        'pozione_definitiva': '💊 Pozione definitiva',
        'macchina': '🚗 Auto',
        'moto': '🏍️ Moto',
        'bici': '🚲 Bici'
    }[realType] || realType;

    // Thumbnail specifica per l'oggetto (usa getItemThumbnail)
    let itemThumb = getItemThumbnail(realType) || taxImage

    await conn.sendMessage(m.chat, {
        text: `⚠️ *CONFERMA TRASFERIMENTO* ⚠️\n\n` +
              `🔹 Tipo: ${itemName}\n` +
              `🔹 Quantità: ${count}\n` +
              `🔹 Destinatario: @${who.split('@')[0]}\n` +
              `🔹 Tassa: ${taxInLimit} 🍬 (${Math.round(taxRate * 100)}%)\n\n` +
              `📌 Digita *CONFERMA* per procedere\n` +
              `📌 Digita *ANNULLA* per cancellare`,
        contextInfo: {
            externalAdReply: {
                title: "💰 TRASFERIMENTO IN CORSO",
                body: `Stai per trasferire ${count} ${itemName}`,
                thumbnail: itemThumb,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
            },
            mentionedJid: [who]
        }
    }, {
        quoted: {
            key: { fromMe: false, id: "transfer-confirm", participant: "0@s.whatsapp.net" },
            message: {
                locationMessage: {
                    name: "📦 Trasferimento Items",
                    jpegThumbnail: locationImage
                }
            }
        }
    })
    
    // Salvo i dati della transazione
    confirmation[m.sender] = {
        sender: m.sender,
        to: who,
        type: realType,
        count,
        taxInLimit,
        timeout: setTimeout(() => {
            delete confirmation[m.sender]
            m.reply('⏳ *Transazione annullata per inattività*')
        }, 60000)
    }
}

handler.before = async m => {
    if (!m.text || !(m.sender in confirmation)) return
    
    const { sender, to, type, count, taxInLimit, timeout } = confirmation[m.sender]
    const user = global.db.data.users[sender]
    const receiver = global.db.data.users[to]
    
    if (/annulla|cancel|stop/i.test(m.text)) {
        clearTimeout(timeout)
        delete confirmation[sender]
        return m.reply('❌ *Transazione annullata con successo*')
    }
    
    if (/conferma|confirm|ok|si/i.test(m.text)) {
        clearTimeout(timeout)
        
        // Verifica finale dei fondi
        if (user[type] < count) {
            delete confirmation[sender]
            return m.reply('❌ Quantità insufficiente al momento della conferma!')
        }

        if (user.limit < taxInLimit) {
            delete confirmation[sender]
            return m.reply('❌ Caramelle insufficienti per pagare la tassa!')
        }
        
        if (type === 'limit' && receiver.limit + count > MAX_LIMIT) {
            delete confirmation[sender]
            return m.reply('❌ Limite destinatario superato durante la conferma!')
        }
        
        // Esecuzione del trasferimento
        user[type] -= count
        receiver[type] += count
        user.limit -= taxInLimit // Pagamento tassa in caramelle
        
        // Accreditiamo la tassa al bot
        const botID = '4915210183245@s.whatsapp.net'
        global.db.data.users[botID].limit = (global.db.data.users[botID].limit || 0) + taxInLimit
        
        const itemName = {
            'limit': '🍬 Dolci',
            'exp': '⚡ XP',
            'joincount': '🪙 Gettoni',
            'pozione_minore': '💊 Pozione minore',
            'pozione_maggiore': '💊 Pozione maggiore',
            'pozione_definitiva': '💊 Pozione definitiva'
        }[type] || type;

        // Thumbnail specifica per l'oggetto trasferito (usa getItemThumbnail)
        let completeThumb = getItemThumbnail(type) || successImage

        await conn.sendMessage(m.chat, {
            text: `▸ 👤 Mittente: @${sender.split('@')[0]}\n` +
                  `▸ 👥 Destinatario: @${to.split('@')[0]}\n` +
                  `▸ 💸 Tassa pagata: ${taxInLimit} 🍬\n\n` +
                  `📦 Trasferimento effettuato con successo!`,
            contextInfo: {
                externalAdReply: {
                    title: "✅ TRASFERIMENTO RIUSCITO",
                    body: `${count} ${itemName} trasferiti`,
                    thumbnail: completeThumb,
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: false
                },
                mentionedJid: [sender, to]
            }
        }, {
            quoted: {
                key: { fromMe: false, id: "transfer-complete", participant: "0@s.whatsapp.net" },
                message: {
                    locationMessage: {
                        name: "💰 Transazione Completata",
                        jpegThumbnail: locationImage
                    }
                }
            }
        })
        
        delete confirmation[sender]
    }
}

handler.help = ['transfer'].map(v => v + ' [tipo] [quantità] @utente')
handler.tags = ['economy']
handler.command = ['pay', 'transfer', 'dai', 'invia', 'trasferisci', 'dona']

function isNumber(x) {
    return !isNaN(x) && !isNaN(parseFloat(x))
}

export default handler