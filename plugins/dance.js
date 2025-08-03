let handler = async (m, { conn, usedPrefix, command}) => {
let pp = 'https://tinyurl.com/26djysdo'
let pp2 = 'https://tinyurl.com/294oahv9'
let who
if (m.isGroup) who = m.mentionedJid[0]
else who = m.chat
if (!who) return conn.reply(m.chat, '✦ menziona con chi vuoi ballare*', m, phishy)
let name2 = conn.getName(who)
let name = conn.getName(m.sender)

await conn.sendMessage(m.chat, { video: { url: [pp, pp2].getRandom() }, gifPlayback: true, caption: `*${name}*` + 'sta ballando con ' + ` *${name2}*` }, { quoted: m })
}
handler.help = ['dance *<@user>*']
handler.tags = ['fun']
handler.command = ['dance', 'bailar']
export default handler
