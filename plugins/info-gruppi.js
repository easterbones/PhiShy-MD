import fetch from 'node-fetch'

let handler  = async (m, { conn, usedPrefix, command }) => {

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
let txt = `*yo, entra nel nostri gruppi*

> 🍭 viridi celsti

*🎌* 

*꒷꒦꒷꒷꒦꒷꒦꒷꒷꒦꒷꒦꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷꒦꒷꒦꒷꒦꒷꒦꒷*

> 📫 canale

Canal :
*🏷️* 

> 🚩 ${textbot}`
await conn.reply(m.chat, txt, m, rcanal)
}
handler.help = ['grupos']
handler.tags = ['main']
handler.command = /^(ninna)$/i
export default handler