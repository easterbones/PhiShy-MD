/**
 * Plugin per mostrare la lista di tutti i partecipanti con i loro warn
 * Comando: /gruppowarns
 */

function getItalianTimestamp() {
    return new Date().toLocaleString('it-IT', {
        timeZone: 'Europe/Rome',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

let handler = async (m, { conn, args, participants, usedPrefix, command }) => {
    const MAX_WARNINGS = 3;
    const isAdmin = participants.find(p => p.id === m.sender)?.admin === 'admin';
    
    if (!isAdmin) return conn.reply(m.chat, '⚠️ Solo gli admin possono usare questo comando', m);
    
    // Crea un array con tutti i membri del gruppo
    const members = participants.map(p => p.id);
    
    // Ottieni solo i membri che hanno warn
    const usersWithWarns = members.filter(jid => {
        const user = global.db.data.users[jid];
        return user && user.warnReasons && user.warnReasons.length > 0;
    });
    
    if (usersWithWarns.length === 0) {
        return conn.reply(m.chat, '✅ Nessun utente in questo gruppo ha avvertimenti attivi', m);
    }
    
    // Ordina gli utenti per numero di warn (dal più alto al più basso)
    usersWithWarns.sort((a, b) => {
        const userA = global.db.data.users[a];
        const userB = global.db.data.users[b];
        return (userB.warnReasons?.length || 0) - (userA.warnReasons?.length || 0);
    });
    
    let reportMessage = `📊 *REPORT WARN GRUPPO* 📊\n\n`;
    reportMessage += `📅 Data: ${getItalianTimestamp()}\n`;
    reportMessage += `👥 Membri con warn: ${usersWithWarns.length}/${members.length}\n\n`;
    
    let mentionList = [];
    
    usersWithWarns.forEach((jid, index) => {
        const user = global.db.data.users[jid];
        const warnCount = user.warnReasons?.length || 0;
        
        reportMessage += `${index + 1}. @${jid.split('@')[0]} `;
        
        // Aggiungi emoji in base alla gravità
        if (warnCount >= MAX_WARNINGS) {
            reportMessage += `⛔ `;
        } else if (warnCount >= MAX_WARNINGS - 1) {
            reportMessage += `🚨 `;
        } else {
            reportMessage += `⚠️ `;
        }
        
        reportMessage += `${warnCount}/${MAX_WARNINGS} warn\n`;
        
        // Aggiungi il motivo dell'ultimo warn
        if (user.warnReasons && user.warnReasons.length > 0) {
            const lastWarn = user.warnReasons[user.warnReasons.length - 1];
            reportMessage += `   🔹 Ultimo warn: ${lastWarn.reason.substring(0, 30)}${lastWarn.reason.length > 30 ? '...' : ''}\n`;
        }
        
        mentionList.push(jid);
    });
    
    reportMessage += `\n📌 Usa "${usedPrefix}warnlist @utente" per vedere i dettagli di un utente specifico`;
    
    const fkontak = {
        key: { 
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast'
        },
        message: { 
            contactMessage: {
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sistema;;;\nFN:Sistema\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Warn System\nEND:VCARD`
            }
        }
    };
    
    await conn.sendMessage(m.chat, {
        text: reportMessage,
        mentions: mentionList
    }, { quoted: fkontak });
};

handler.help = ['gruppowarns'];
handler.tags = ['group'];
handler.command = /^(gruppowarns|warnsgroup|warnslist|listawarns|allwarns)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = false;

export default handler;