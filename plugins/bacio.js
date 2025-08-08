let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (m.key.fromMe) return;

    console.log("[DEBUG] Comando ricevuto:", command);
    console.log("[DEBUG] Testo ricevuto:", text);

    let who = [];
    if (m.isGroup) {
        who = m.mentionedJid.length > 0 ? m.mentionedJid : m.quoted ? [m.quoted.sender] : text ? text.split(',').map(t => t.replace(/[^0-9]/g, '') + '@s.whatsapp.net') : [];
    } else {
        who = text ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'] : [m.chat];
    }

    console.log("[DEBUG] Utenti menzionati:", who);

    if (who.length === 0) {
        console.log("[DEBUG] Nessun utente menzionato o messaggio risposto.");
        return m.reply(`Menziona almeno una persona o rispondi a un messaggio per usare questo comando.`);
    }

    if (!text && !m.mentionedJid.length && !m.quoted) {
        console.log("[DEBUG] Nessun argomento fornito per il comando.");
        return m.reply(`Devi menzionare una persona, rispondere a un messaggio o fornire un numero per usare questo comando.`);
    }

    let baciati;
    if (who.length === 1) {
        baciati = [`@${m.sender.split('@')[0]}`, `@${who[0].split('@')[0]}`];
    } else {
        baciati = who.map(w => {
            let user = global.db.data.users[w];
            console.log("[DEBUG] Utente trovato:", user);
            if (user) user.bacini = (user.bacini || 0) + 1;
            return `@${w.split('@')[0]}`;
        });
    }

    console.log("[DEBUG] Utenti baciati:", baciati);

    let bacio = await conn.reply(m.chat, `${baciati.join(' e ')} si stanno baciando 💋`, m, { mentions: who.length === 1 ? [m.sender, ...who] : who });

    conn.sendMessage(m.chat, { react: { text: '💋', key: bacio.key }});
};
handler.isGroup = true;
handler.command = /bacio|bacia/i;
export default handler;