let handler = async (m, { conn, text, isROwner, isOwner }) => {
if (text) {
global.db.data.chats[m.chat].sBentornato = text
m.reply(`ⓘ 𝐈𝐥 bentornato 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨`)
} else throw `> ⓘ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨 𝐜𝐡𝐞 𝐝𝐞𝐬𝐢𝐝𝐞𝐫𝐢 𝐚𝐠𝐠𝐢𝐮𝐧𝐠𝐞𝐫𝐞, 𝐮𝐬𝐚:\n> - @user ( menzione )\n> - @group ( nome del gruppo )\n> - @desc ( descrizione del gruppo)`
}
handler.help = ['setbentornato <text>']
handler.tags = ['group']
handler.command = ['setbentornato'] 
handler.admin = true
export default handler