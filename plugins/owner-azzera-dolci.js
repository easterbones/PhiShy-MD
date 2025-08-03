let handler = async (m, { conn, args, isOwner, isPremium }) => {
    // Verifica se l'utente è autorizzato (proprietario o premium)
    if (!isOwner && !isPremium) {
        return m.reply('Solo il proprietario o gli utenti premium possono usare questo comando.');
    }

    // Prosegui con il comando se l'utente è autorizzato
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    if (!who) return m.reply('Devi menzionare un utente o rispondere a un messaggio!');
    if (!(who in global.db.data.users)) return m.reply('L\'utente non è nel database del gioco.');

    // Azzera le caramelle (limit) dell'utente
    let user = global.db.data.users[who];
    user.limit = 0; // Imposta il valore delle caramelle a 0

    // Invia un messaggio di conferma
    m.reply(`✅ Hai azzerato le caramelle di @${who.split('@')[0]}. Ora ne ha *${user.limit}* 🍬!`, null, { mentions: [who] });
};

handler.command = ['azzeradolci', 'azzeracaramelle'];
handler.rowner = true;
export default handler;