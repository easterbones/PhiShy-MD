import axios from 'axios'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙎𝙀𝙍𝙄𝙎𝘾𝙄 𝙇'𝙐𝙏𝙀𝙉𝙏𝙀 𝙄𝙉𝙎𝙏𝘼𝙂𝙍𝘼𝙈\n𝙀𝙎𝙀𝙈𝙋𝙄𝙊\n*${usedPrefix + command} nomeutente*`
  
  await m.reply(global.wait)
  
  try {
    const username = args[0].replace(/^@/, '')
    let res = await igstalk(username)
    let res2 = await fetch(`https://api.lolhuman.xyz/api/stalkig/${username}?apikey=${lolkeysapi}`)
    let res3 = await res2.json()
    
    if (!res || !res.username) throw 'Impossibile ottenere informazioni da Instagram'
    
    let iggs = `┃ 𓃠 *${gt} ${vs}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 𝙉𝙊𝙈𝙀
┃ *${res.fullname || 'Non disponibile'}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 𝙐𝙏𝙀𝙉𝙏𝙀
┃ *${res.username}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 𝙇𝙄𝙉𝙆
┃ *https://instagram.com/${res.username.replace(/^@/, '')}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 𝙎𝙀𝙂𝙐𝘼𝘾𝙄
┃ *${res.followers || 'Non disponibile'}* 
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 𝙎𝙀𝙂𝙐𝙄𝙏𝙄
┃ *${res.following || 'Non disponibile'}* 
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
┃ 𝙋𝙐𝘽𝘽𝙇𝙄𝘾𝘼𝙕𝙄𝙊𝙉𝙄
┃ *${res.post || 'Non disponibile'}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 𝘽𝙄𝙊𝙂𝙍𝘼𝙁𝙄𝘼
┃ *${res.bio || 'Non disponibile'}*`.trim()

    let profilePic = res3.result?.photo_profile || res.profile
    if (!profilePic) throw 'Impossibile ottenere la foto del profilo'
    
    await conn.sendFile(m.chat, profilePic, 'error.jpg', iggs, m)
    conn.reply(m.chat, `${lenguajeGB['smsAvisoIIG']()}💖 *Rimani aggiornato sulle novità e assicurati di avere l'ultima versione.*`, m, {
      contextInfo: { 
        externalAdReply: { 
          mediaUrl: null, 
          mediaType: 1, 
          description: null, 
          title: 'The-LoliBot-MD',
          body: 'Super Bot WhatsApp',         
          previewType: 0, 
          thumbnail: fs.readFileSync("./media/menus/Menu3.jpg"),
          sourceUrl: md
        }
      }
    })
  } catch (e) {
    console.error(e)
    throw `Si è verificato un errore. Verifica il nome utente o riprova più tardi.`
  }
}

handler.help = ['igstalk'].map(v => v + ' <username>')
handler.tags = ['downloader']
handler.command = /^(igstalk|verig|igver)$/i
handler.exp = 80
handler.money = 150
handler.level = 3
handler.register = true
export default handler

async function igstalk(Username) {
  try {
    const { data } = await axios.get('https://dumpor.com/v/' + Username, {
      headers: { 
        "cookie": "_inst_key=SFMyNTY.g3QAAAABbQAAAAtfY3NyZl90b2tlbm0AAAAYWGhnNS1uWVNLUU81V1lzQ01MTVY2R0h1.fI2xB2dYYxmWqn7kyCKIn1baWw3b-f7QvGDfDK2WXr8", 
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36" 
      }
    })
    
    const $ = cheerio.load(data)
    return {
      profile: $('#user-page > div.user > div.row > div > div.user__img').attr('style')?.replace(/(background-image: url\(\'|\'\);)/gi, ''),
      fullname: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > a > h1').text(),
      username: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > h4').text(),
      post: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(1)').text().replace(' Posts',''),
      followers: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(2)').text().replace(' Followers',''),
      following: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(3)').text().replace(' Following',''),
      bio: $('#user-page > div.user > div > div.col-md-5.my-3 > div').text()
    }
  } catch (error) {
    console.error('Errore in igstalk:', error)
    return null
  }
}