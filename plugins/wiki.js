import axios  from "axios"
import fetch from "node-fetch"
import * as cheerio from "cheerio"
async function wikipedia(querry) {
try {
const link = await axios.get(`https://it.wikipedia.org/wiki/${querry}`)
const $ = cheerio.load(link.data)
let judul = $('#firstHeading').text().trim()
let thumb = $('#mw-content-text').find('div.mw-parser-output > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > a > img').attr('src') || `//i.ibb.co/nzqPBpC/http-error-404-not-found.png`
let isi = []
$('#mw-content-text > div.mw-parser-output').each(function (rayy, Ra) {
let penjelasan = $(Ra).find('p').text().trim() 
isi.push(penjelasan)})
for (let i of isi) {
const data = {
status: link.status,
result: {
judul: judul,
thumb: 'https:' + thumb,
isi: i}}
return data}
} catch (err) {
var notFond = {
status: link.status,
Pesan: eror}
return notFond}}
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `*[❗️𝐈𝐍𝐅𝐎❗️] 𝙴𝚂𝚃𝙰𝚂 𝚄𝚂𝙰𝙽𝙳𝙾 𝙼𝙰𝙻 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾!!*\n*𝚄𝚂𝙾 𝙲𝙾𝚁𝚁𝙴𝙲𝚃𝙾:*\n*${usedPrefix + command} 𝙿𝚊𝚕𝚊𝚋𝚛𝚊 𝚌𝚕𝚊𝚟𝚎 𝚊 𝚋𝚞𝚜𝚌𝚊𝚛*\n\n*𝙴𝙹𝙴𝙼𝙿𝙻𝙾:*\n*${usedPrefix + command} Estrellas*`
wikipedia(`${text}`).then(res => {
m.reply(`*ecco cosa ho trovato su wikipedia riguardo ${text}*\n\n` + res.result.isi)
}).catch(() => { m.reply('*[❗️𝐈𝐍𝐅𝐎❗️]non ho trovato niente riguardo l\'argomento*') })}
handler.command = /^(wiki|wikipedia|internet?)$/i
export default handler;