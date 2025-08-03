// ⚠️ Richiede: conn.sendMessage con supporto ai bottoni
// ⚠️ Includi questo handler nel tuo bot come plugin

let confirmation = {}; // Oggetto per memorizzare le richieste di conferma

const normalizeJid = (jid) => {
    if (!jid) return jid;
    return jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
};

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let users = global.db.data.users;
    let senderId = normalizeJid(m.sender);
    let senderName = await conn.getName(senderId);

    let targetId = null;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetId = normalizeJid(m.mentionedJid[0]);
    } else if (m.quoted && m.quoted.sender) {
        targetId = normalizeJid(m.quoted.sender);
    }

    if (!targetId) {
        return conn.reply(
            m.chat,
            `💘 Devi taggare qualcuno o rispondere a un suo messaggio per sposarti. Usa il comando nel formato: ${usedPrefix}${command} @utente`,
            m
        );
    }

    if (users[senderId]?.sposato) {
        return conn.reply(
            m.chat,
            `💔 Sei già sposato con @${users[senderId].partner.split('@')[0]}! Non puoi sposarti di nuovo. 😭`,
            m,
            { mentions: [users[senderId].partner, senderId] }
        );
    }

    if (users[targetId]?.sposato) {
        return conn.reply(
            m.chat,
            `💔 L'utente @${targetId.split("@")[0]} è già sposato! 😭`,
            m,
            { mentions: [targetId, senderId] }
        );
    }

    // Invia richiesta con bottoni
    const marriageText = `💍 hey @${targetId.split("@")[0]}, @${senderId.split("@")[0]} vuole sposarti! 💖\n\nClicca su *Lo voglio* per accettare o *Non lo voglio* per rifiutare. Hai 60 secondi!`;

    await conn.sendMessage(
        m.chat,
        {
            text: marriageText,
            footer: 'Phishy Matrimonio System 💍',
            buttons: [
                { buttonId: `accetta_matrimonio_${senderId}`, buttonText: { displayText: '💖 Lo voglio' }, type: 1 },
                { buttonId: `rifiuta_matrimonio_${senderId}`, buttonText: { displayText: '💔 Non lo voglio' }, type: 1 }
            ],
            mentions: [senderId, targetId]
        },
        { quoted: m }
    );

    confirmation[targetId] = {
        senderId,
        targetId,
        message: m,
        timeout: setTimeout(() => {
            conn.reply(
                m.chat,
                `⏰ Tempo scaduto! La richiesta di matrimonio è stata annullata.`,
                m,
                { mentions: [targetId, senderId] }
            );
            delete confirmation[targetId];
        }, 60 * 1000)
    };
};

// Gestione dei bottoni (handler.before non basta, serve conn.ws.onMessage o un handler dedicato)
handler.before = async (m, { conn }) => {
    if (!m?.message?.buttonsResponseMessage) return;

    const response = m.message.buttonsResponseMessage.selectedButtonId;
    const targetId = normalizeJid(m.sender);
    const matchAccept = response.match(/^accetta_matrimonio_(.+)/);
    const matchReject = response.match(/^rifiuta_matrimonio_(.+)/);

    if (!matchAccept && !matchReject) return;

    const senderId = matchAccept?.[1] || matchReject?.[1];
    const conf = confirmation[targetId];

    if (!conf || conf.senderId !== senderId) return;

    clearTimeout(conf.timeout);
    const users = global.db.data.users;

    if (matchReject) {
        await conn.reply(
            m.chat,
            `💔 @${targetId.split("@")[0]} ha rifiutato la proposta di matrimonio di @${senderId.split("@")[0]}. 😢`,
            conf.message,
            { mentions: [senderId, targetId] }
        );
        delete confirmation[targetId];
        return;
    }

    // Se accetta
    users[senderId] = users[senderId] || {};
    users[targetId] = users[targetId] || {};
    users[senderId].sposato = true;
    users[senderId].partner = targetId;
    users[targetId].sposato = true;
    users[targetId].partner = senderId;

    await conn.reply(
        m.chat,
        `🎉 Congratulazioni! @${targetId.split("@")[0]} e @${senderId.split("@")[0]} vi siete sposati! 💍💖`,
        conf.message,
        { mentions: [senderId, targetId] }
    );

    delete confirmation[targetId];
};

handler.tags = ['fun'];
handler.help = ['sposa @utente'];
handler.command = ['sposa'];
handler.group = true;
handler.register = true;

export default handler;