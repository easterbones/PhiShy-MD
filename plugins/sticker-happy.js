import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import MessageType from '@whiskeysockets/baileys'
let handler = async (m, { conn}) => {
try {
if(m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
if(!m.mentionedJid.length) m.mentionedJid.push(m.sender)
let res = await fetch('https://api.waifu.pics/sfw/happy')
let json = await res.json()
let { url } = json
let stiker = await sticker(null, url, 'buon per te💗')
conn.sendFile(m.chat, stiker, null, { asSticker: true })
} catch (e) { }}
handler.customPrefix = /felice|y[+e]|content[a-z]/i
handler.command = new RegExp
export default handler