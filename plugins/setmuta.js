import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin }) => {
    const senderJid = m.sender;
    const userData = global.db.data.users[senderJid] || {};
    
    if (!isAdmin) {
        if (!userData.token || userData.token <= 0) {
            return conn.sendMessage(m.chat, {
                text: 'Comando disponibile solo per admin o utenti con token🌟',
                ...global.rcanal
            }, { quoted: m });
        }
    }

    let mentionedJid;
    let muteDuration;

    // Parsing migliorato per gestire i bottoni
    if (text) {
        const parts = text.split(' ');
        if (parts.length >= 2) {
            // Caso bottone: "60 @user123"
            const durationPart = parts[0];
            const userPart = parts[1];
            
            if (!isNaN(parseInt(durationPart)) && userPart.startsWith('@')) {
                muteDuration = parseInt(durationPart);
                mentionedJid = userPart.replace('@', '') + '@s.whatsapp.net';
            }
        } else if (!isNaN(parseInt(text))) {
            // Caso durata semplice con menzione normale
            muteDuration = parseInt(text);
            mentionedJid = m.mentionedJid?.[0] || m.quoted?.sender;
        }
    }

    // Fallback per menzioni normali
    if (!mentionedJid) {
        mentionedJid = m.mentionedJid?.[0] || m.quoted?.sender;
    }

    if (!mentionedJid) {
        return conn.sendMessage(m.chat, {
            text: 'Manca il tag❗︎',
            ...global.rcanal
        }, { quoted: m });
    }

    const targetUser = global.db.data.users[mentionedJid] || {};

    if (command === 'setmuta') {
        // Se non abbiamo una durata valida, mostra i bottoni
        if (!muteDuration || isNaN(muteDuration)) {
            const buttons = [
                { buttonId: `.${command} 5 @${mentionedJid.split('@')[0]}`, buttonText: { displayText: '🕐 5 min' }, type: 1 },
                { buttonId: `.${command} 15 @${mentionedJid.split('@')[0]}`, buttonText: { displayText: '🕑 15 min' }, type: 1 },
                { buttonId: `.${command} 30 @${mentionedJid.split('@')[0]}`, buttonText: { displayText: '🕒 30 min' }, type: 1 },
                { buttonId: `.${command} 60 @${mentionedJid.split('@')[0]}`, buttonText: { displayText: '🕓 1 h' }, type: 1 },
                { buttonId: `.${command} 180 @${mentionedJid.split('@')[0]}`, buttonText: { displayText: '🕕 3 h' }, type: 1 },
                { buttonId: `.${command} 600 @${mentionedJid.split('@')[0]}`, buttonText: { displayText: '🕘 10 h' }, type: 1 },
                { buttonId: `.${command} 1440 @${mentionedJid.split('@')[0]}`, buttonText: { displayText: '🕛 24 h' }, type: 1 }
            ];
            
            return await conn.sendMessage(m.chat, {
                text: `⏱️ Scegli per quanto tempo mutare @${mentionedJid.split('@')[0]}`,
                buttons,
                mentions: [mentionedJid],
                footer: 'Phishy Mute Bottoni',
                headerType: 1
            }, { quoted: m });
        }

        if (targetUser.muto) {
            return conn.sendMessage(m.chat, {
                text: '⚠︎ Utente già mutato ⚠︎',
                ...global.rcanal
            }, { quoted: m });
        }

        // Applica il mute
        targetUser.muto = true;
        
        if (!isAdmin) {
            userData.token -= 1;
            await conn.sendMessage(m.chat, {
                text: `@${senderJid.split('@')[0]} ha utilizzato 1 token per mutare l'utente 🔑`,
                mentions: [senderJid],
                ...global.phishy
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            text: `L'utente @${mentionedJid.split('@')[0]} è stato mutato per ${muteDuration} minuti ⏱️`,
            mentions: [mentionedJid],
        });

        // Salva il timeout nel database per persistenza
        const timeoutId = setTimeout(() => {
            // Verifica che l'utente sia ancora mutato prima di smutarlo
            if (global.db.data.users[mentionedJid] && global.db.data.users[mentionedJid].muto) {
                global.db.data.users[mentionedJid].muto = false;
                conn.sendMessage(m.chat, {
                    text: `@${mentionedJid.split('@')[0]} è stato smutato automaticamente ✅`,
                    mentions: [mentionedJid],
                });
            }
        }, muteDuration * 60 * 1000);

        // Salva l'ID del timeout per poterlo cancellare se necessario
        targetUser.muteTimeoutId = timeoutId;
    }

    if (command === 'setsmuta') {
        if (!targetUser.muto) {
            return conn.sendMessage(m.chat, {
                text: 'Questo utente non è mutato❕',
                ...global.rcanal
            }, { quoted: m });
        }
        
        // Cancella il timeout automatico se esiste
        if (targetUser.muteTimeoutId) {
            clearTimeout(targetUser.muteTimeoutId);
            delete targetUser.muteTimeoutId;
        }
        
        targetUser.muto = false;
        
        if (!isAdmin) {
            userData.token -= 1;
            await conn.sendMessage(m.chat, {
                text: `@${senderJid.split('@')[0]} ha utilizzato 1 token per smutare l'utente 🔑`,
                mentions: [senderJid],
                ...global.phishy
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            text: `L'utente @${mentionedJid.split('@')[0]} è stato smutato ✔︎`,
            mentions: [mentionedJid],
        });
    }
};

handler.command = /^(setmuta|setsmuta)$/i;
handler.group = true;
export default handler;