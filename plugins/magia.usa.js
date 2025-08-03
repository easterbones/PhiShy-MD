import fs from 'fs'
import fetch from 'node-fetch'
import { exec } from 'child_process'
import { promisify } from 'util'
import Incantesimi from '../lib/incantesimi.js'


const execAsync = promisify(exec)
const GIPHY_API_KEY = '217GM0iA13nj6lBpje3FW7j4FQLGfTsI' // La tua chiave API

let handler = async (m, { conn, args, usedPrefix, command }) => {
   const allSpells = Object.values(Incantesimi).flat() 
    
  const spell = args.join(" ").trim()
  if (!spell) return conn.reply(m.chat, `✨ Usa: *${usedPrefix}${command} [incantesimo]*\nEsempio: *${usedPrefix}${command} lumos*`, m)


  // Verifica incantesimo nella libreria
const spellExists = allSpells.some(s => s.toLowerCase() === spell.toLowerCase());

  if (!spellExists) {
    return conn.reply(m.chat, `❌ *${spell}* non è un incantesimo valido!\nUsa *${usedPrefix}incantesimi* per la lista`, m)
  }

  // Caricamento database
  let user
  try {
    const data = fs.readFileSync('maghi.json', 'utf8')
    user = JSON.parse(data).users?.[m.sender] || {}
  } catch (e) {
    console.error('DB error:', e)
    return conn.reply(m.chat, '🔮 Errore nel leggere i tuoi dati magici', m)
  }

  // Verifiche utente
  if (!user.registered) {
    return conn.reply(m.chat, '📖 Devi *registrarti* prima di lanciare incantesimi!', m)
  }

  if (!user.incantesimi?.map(i => i.toLowerCase()).includes(spell.toLowerCase())) {
    return conn.reply(m.chat, `❌ Non conosci *${spell}*!\nStudia con *${usedPrefix}studia*`, m)
  }

  // Ricerca GIF ottimizzata con /translate
  let gifUrl
  try {
    const searchTerm = `harry potter ${spell} spell`
    const apiUrl = `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${encodeURIComponent(searchTerm)}`
    
    const response = await fetch(apiUrl)
    const data = await response.json()

    gifUrl = data.data?.images?.original?.url || 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif'
    
    console.log('GIPHY API used. Remaining:', response.headers.get('x-ratelimit-remaining'))
  } catch (e) {
    console.error('GIPHY error:', e)
    gifUrl = 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif'
  }

  // Invio con conversione a MP4
  try {
    const res = await fetch(gifUrl)
    const buffer = await res.buffer()
    fs.writeFileSync('temp.gif', buffer)

    // Conversione ottimizzata
    await execAsync(`ffmpeg -i temp.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -f mp4 temp.mp4`)

    await conn.sendMessage(m.chat, {
      video: { url: 'temp.mp4' },
      caption: `✨ *${spell.toUpperCase()}!*\n${user.casata ? `Lanciato da ${user.nome || 'un mago'} della ${user.casata.nome}` : 'Incantesimo lanciato'}`,
      gifPlayback: true
    }, { quoted: m })

    // Pulizia
    fs.unlinkSync('temp.gif')
    fs.unlinkSync('temp.mp4')
  } catch (err) {
    console.error('Send error:', err)
    await conn.reply(m.chat, `💫 ${spell.toUpperCase()}! (L'animazione non è disponibile)`, m)
  }
}

handler.help = ['incantesimo <nome>']
handler.tags = ['magia']
handler.command = ['incantesimo', 'usa', 'cast']
export default handler