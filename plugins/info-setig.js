const handler = async (m, { conn, usedPrefix }) => {
    const sender = m.sender;
    const user = global.db.data.users[sender];
    if (!user) return conn.reply(m.chat, 'Errore: Utente specificato non trovato.', m);

    if (/^(\D|_)eliminaig/i.test(m.text)) {
        if (!user.nomeinsta) return conn.reply(m.chat, `ⓘ Assicurati di configurare il tuo nome utente Instagram con ${usedPrefix}setig prima di continuare`, null, { quoted: m });
        user.nomeinsta = undefined;
        return conn.reply(m.chat, 'ⓘ Nome Instagram eliminato con successo dal tuo profilo utente', null, { quoted: m });
    }

    if (/^(\D|_)setig/i.test(m.text)) {
        const nomeinsta = m.text.split(' ')[1];
        if (!nomeinsta) return conn.reply(m.chat, 'ⓘ Specifica un nome utente Instagram', null, { quoted: m });
        user.nomeinsta = nomeinsta;
        return conn.reply(m.chat, `ⓘ Hai impostato con successo il tuo nome Instagram come:\n ${nomeinsta}`, null, { quoted: m });
    }
};

handler.command = /^(setig|eliminaig)$/i;
handler.admin = true;
export default handler;