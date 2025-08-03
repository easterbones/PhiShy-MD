import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import path from 'path';

let handler = async (m, { conn, mentionedJid, args }) => {
    // Ottieni l'utente target
    let targetJid = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender
    let user = global.db.data.users[targetJid]
    
    // Inizializza l'utente se non esiste
    if (!user) {
        user = {
            level: 1,
            exp: 0,
            role: 'Novizio',
            name: conn.getName(targetJid)
        }
        global.db.data.users[targetJid] = user
    }
    
    
    // Percorsi delle immagini locali
  const basePath = './src/img/level/';
  const levelImageBuffer = fs.readFileSync(path.join(basePath, 'level.jpg'));


    // Calcola EXP e progresso CORRETTO
    let currentLevel = user.level || 1
    let currentExp = user.exp || 0
    
    // Ottieni i range per il livello attuale
    let { min, xp, max } = xpRange(currentLevel, global.multiplier)
    
    // Calcola gli EXP per il livello successivo
    let nextLevelRange = xpRange(currentLevel + 1, global.multiplier)
    let neededExp = nextLevelRange.min - currentExp
    
    // Calcola la percentuale di completamento del livello corrente
    let expInCurrentLevel = currentExp - min
    let progressRatio = expInCurrentLevel / xp
    let progress = Math.floor(progressRatio * 10)
    
    // Barra di progresso
    let progressBar = '【'
    for (let i = 0; i < 10; i++) {
        progressBar += i < progress ? '■' : '□'
    }
    progressBar += '】'

    // Ottieni il nome
    let userName = user.name || conn.getName(targetJid)
    let nomeDelBot = global.db.data.nomedelbot || 'viridi meme 🎌'

    // Prepara il messaggio
    let text = `👤 *Utente:* ${user.name}\n`
    text += `🏆 *Livello attuale:* ${currentLevel}\n`
    text += `🎯 *Rank:* ${user.role}\n`
    text += `✨ *EXP Totali:* ${currentExp}\n`
    text += `📊 *EXP nel livello:* ${expInCurrentLevel}/${xp}\n`
    text += `📈 *Progresso:* ${progressBar} ${Math.round(progressRatio * 100)}%\n\n`
    
    // Messaggio speciale se ha raggiunto il massimo EXP per questo livello
    if (expInCurrentLevel >= xp) {
        text += `🎉 *Pronto per salire al livello ${currentLevel + 1}! Usa il comando [.levelup] per avanzare.`
    } else {
        text += `⚡ *EXP mancanti per livello ${currentLevel + 1}:* ${neededExp} EXP`
    }

    // Immagine profilo
    let pp = levelImageBuffer
    let apii = await conn.getFile(pp)
        
    await conn.sendMessage(m.chat, { 
        text: text,
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363401234816773@newsletter",
              serverMessageId: 100,
              newsletterName: 'canale dei meme 🎌',
            },
            externalAdReply: {
             title: `Controlla il tuo stato`,
             body:  `Livello e progresso`,
             thumbnail: apii.data,
                sourceUrl: "", 
                mediaType: 1,
                renderLargerThumbnail: false
            },
            mentionedJid: [user]
        },
    }, { quoted: m })
}
        
        
        
            
   
handler.help = ['livello @user']
handler.tags = ['rpg']
handler.command = ['livello', 'level', 'lvl']
export default handler