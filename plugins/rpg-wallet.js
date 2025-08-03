let handler = async (m, {conn, usedPrefix}) => {
   let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   if (who == conn.user.jid && who == m.sender) {
       who = m.sender; // Permetti all'utente di vedere il proprio portafoglio
   } else if (who == conn.user.jid) {
       return conn.reply(m.chat, 'Errore: Non puoi controllare il portafoglio del bot in questo momento.', m, rcanal);
   }
   if (!(who in global.db.data.users)) return conn.reply(m.chat, 'non sei nel database del gioco', m)
   let user = global.db.data.users[who]
   await m.reply(`${who == m.sender ? `hai *${user.limit} 🍬caramelle * nel tuo portafoglio` : `L'utente @${who.split('@')[0]} ha *${user.limit} 🍬 Dolci* in totale`}. `, null, { mentions: [who] })
}
handler.command = ['wallet', 'dolci', 'caramelle', 'money', 'portafoglio']
export default handler