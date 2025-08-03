import axios from "axios"

let handler = async (m, { conn, args }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => global.icon)
try {
let id = args?.[0]?.match(/\d+\-\d+@g.us/) || m.chat

const partecipantiUnici = Object.values(conn.chats[id]?.messages || {})
.map((item) => item.key.participant)
.filter((value, index, self) => self.indexOf(value) === index)

const partecipantiOrdinati = partecipantiUnici
.filter(partecipante => partecipante)
.sort((a, b) => {
if (a && b) {
return a.split("@")[0].localeCompare(b.split("@")[0])
}
return 0
})

const listaOnline =
partecipantiOrdinati
.map((k) => `*●* @${k.split("@")[0]}`)
.join("\n") || "✧ Non ci sono utenti online al momento."

await conn.sendMessage(
m.chat, 
{
image: { url: pp },
caption: `*❀ Lista utenti online:*\n\n${listaOnline}\n\n> `,
contextInfo: { mentionedJid: partecipantiOrdinati },
},
{ quoted: m })

await m.react("✅")
} catch (error) {
await m.reply(`⚠︎ Si è verificato un errore: ${error.message}`)
}}

handler.help = ["listonline"]
handler.tags = ["owner"]
handler.command = ["listonline", "online", "linea", "connessi"]
handler.group = true

export default handler