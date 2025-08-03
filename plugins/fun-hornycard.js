let handler = async (m, { conn }) => {
  let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  conn.sendFile(m.chat, global.API('https://api.some-random-api.com/canvas/', '/misc/horny', {
    avatar: await conn.profilePictureUrl(who).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
  }), 'hornycard.png', 'bastardo di un pervertito', m)
}

handler.help = ['dance *<@user>*']
handler.tags = ['fun']
handler.command = ['horny', 'bailar']

export default handler