import { createHash } from 'crypto'
import fs from 'fs'
import fetch from 'node-fetch'

// Inizializzazione del database maghi
const MAGHI_DB = 'maghi.json'
if (!fs.existsSync(MAGHI_DB)) {
    fs.writeFileSync(MAGHI_DB, JSON.stringify({
        users: {},
        casate: {},
        battaglie: {},
        score: {}
    }, null, 2))
}

let Reg = /\|?(.*)([.|] *?)([0-9]*)([.|] *?)([mf])$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
    // Carica il database maghi
    let maghiData = JSON.parse(fs.readFileSync(MAGHI_DB))
    let user = maghiData.users[m.sender]
    
    // Funzione per generare messaggi gender-sensitive
    const genderMsg = (genere, parole) => {
        return genere === 'm' ? parole.m : parole.f
    }

    // Verifica se già registrato
    if (user && user.registered) {
        const msg = genderMsg(user.genere, {
            m: `🔮 Sei già registrato nel Ministero della Magia come Mago ${user.nome}!`,
            f: `🔮 Sei già registrata nel Ministero della Magia come Maga ${user.nome}!`
        })
        return m.reply(`${msg}\n\n*Vuoi ripetere la registrazione?*\nUsa *${usedPrefix}unreg*`)
    }
    
    if (!Reg.test(text)) {
        return m.reply(`🔮 registrazione non validata!\n\nUso corretto: *${usedPrefix + command} nome.eta.genere*\nEsempio: *${usedPrefix + command} ${conn.getName(m.sender)}.15.m*\n\nGeneri:\n- m = mago\n- f = maga`)
    }
    
    let [_, name, splitter1, age, splitter2, gender] = text.match(Reg)
    
    // Validazioni
    if (!name) return m.reply('🔮 Il nome magico non può essere vuoto!')
    if (!age) return m.reply('🔮 L\'età non può essere vuota!')
    if (!gender) return m.reply('🔮 Specifica il genere (m per mago, f per maga)!')
    if (name.length >= 30) return m.reply('🔮 Il nome è troppo lungo per il Rotolo della Magia! (max 30 caratteri)')
    
    age = parseInt(age)
    gender = gender.toLowerCase()
    
    if (age > 100) return m.reply('🧙‍♂️ Wow, il leggendario mago Silente vuole unirsi a noi!')
    if (age < 11) return m.reply('🧒 I babbani sotto gli 11 anni non possono ricevere la lettera per Hogwarts!')
    if (gender !== 'm' && gender !== 'f') return m.reply('🔮 Genere non valido! Usa "m" per mago o "f" per maga')

    // Crea/aggiorna il profilo magico
    maghiData.users[m.sender] = {
        nome: name.trim(),
        genere: gender,
        anni: age,
        registered: true,
        regTime: new Date().toISOString(),
        casa: null,
        bacchetta: null,
        incantesimi: [],
        score: 0,
        livello: 0,
    }

    // Salva il database
    fs.writeFileSync(MAGHI_DB, JSON.stringify(maghiData, null, 2))
    
    let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 8)
    let img = await (await fetch('https://tinyurl.com/258rd289')).buffer()
    
    // Messaggio gender-sensitive
    const benvenuto = genderMsg(gender, {
        m: `Benvenuto Mago ${name} ${age < 17 ? 'a Hogwarts' : 'nel mondo della magia'}!`,
        f: `Benvenuta Maga ${name} ${age < 17 ? 'a Hogwarts' : 'nel mondo della magia'}!`
    })

    let txt = '`– R E G I S T R O  -  M A G I C O`\n\n'
    txt += `┌  ✩  *Nome Magico*: ${name}\n`
    txt += `│  ✩  *Titolo*: ${gender === 'm' ? 'Mago' : 'Maga'}\n`
    txt += `│  ✩  *Età*: ${age} anni\n`
    txt += `│  ✩  *Status*: ${age < 17 ? 'Studente di Hogwarts' : 'Mago Adulto'}\n`
    txt += `│  ✩  *ID Registro Magico*\n`
    txt += `└  ✩  ${sn}\n\n`
    txt += benvenuto

    await conn.sendMessage(m.chat, { 
        image: img, 
        caption: txt,
        mentions: [m.sender]
    }, { quoted: m })
    
    await m.react('✨')
}

// Helper function per altri comandi (da esportare)
export function getGenderForm(user, parole) {
    return user.genere === 'm' ? parole.m : parole.f
}

handler.help = ['registra'].map(v => v + ' <nome.eta.genere>')
handler.tags = ['magia']
handler.command = ['registra', 'reg', 'iscriviti', 'registrazione'] 

export default handler