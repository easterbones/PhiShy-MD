import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
    // Verifica se l'utente è un admin
    if (!global.db.data.admins.includes(m.sender)) {
        return conn.reply(m.chat, '❌ Solo gli admin possono usare questo comando!', m);
    }

    // Sintassi: modifyall parametro valore
    if (args.length < 2) {
        let helpMsg = `
*📌 Sintassi del comando:*
${usedPrefix}modifyall parametro valore

*⚠️ ATTENZIONE:*
Questo comando modificherà il parametro specificato per TUTTI gli utenti nel database!

*🔢 Esempi:*
${usedPrefix}modifyall limit 1000
${usedPrefix}modifyall premium false
${usedPrefix}modifyall banned false

*📊 Tipi di parametri supportati:*
- Numeri (es. 100, 50.5)
- Stringhe (es. "valore")
- Booleani (true/false)
`;
        return conn.reply(m.chat, helpMsg, m);
    }

    const param = args[0].toLowerCase();
    let value = args.slice(1).join(' ');

    // Conversione automatica del tipo di valore
    if (!isNaN(value)) {
        value = Number(value);
    } else if (value.toLowerCase() === 'true') {
        value = true;
    } else if (value.toLowerCase() === 'false') {
        value = false;
    }

    // Conferma prima di modificare tutto il database
    await conn.reply(m.chat, `⚠️ Sei sicuro di voler modificare *${param}* a *${value}* per TUTTI gli utenti?\n\nRispondi con *SI* per confermare.`, m);

    // Aspetta conferma
    conn.ev.once('messages.upsert', async ({ messages }) => {
        const response = messages[0];
        if (response.key.remoteJid === m.chat && 
            response.key.fromMe === false && 
            response.message?.conversation?.toLowerCase() === 'si' &&
            response.key.participant === m.sender) {

            // Modifica per tutti gli utenti
            let counter = 0;
            for (let user in global.db.data.users) {
                global.db.data.users[user][param] = value;
                counter++;
            }

            // Salva il database
            fs.writeFileSync(path.join(global.db.path, 'database.json'), JSON.stringify(global.db.data, null, 2));

            return conn.reply(m.chat, `✅ Modifica completata!\n\n📌 Parametro: *${param}*\n💾 Nuovo valore: *${value}*\n👥 Utenti modificati: *${counter}*`, m);
        }
    });
};

handler.command = ['omnigod', 'modificatutti'];
handler.tags = ['admin'];
handler.help = ['modifyall param value', 'modificatutti parametro valore'];
handler.admin = true;
export default handler;