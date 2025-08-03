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

function formatDate(dateString) {
    try {
        if (!dateString) return "Data non disponibile";
        if (typeof dateString === 'string' && dateString.includes('/')) return dateString;
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "𝘿𝙖𝙩𝙖 𝙣𝙤𝙣 𝙫𝙖𝙡𝙞𝙙𝙖";
        
        return date.toLocaleString('it-IT', {
            timeZone: 'Europe/Rome',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error("Errore formattazione data:", e);
        return "𝘿𝙖𝙩𝙖 𝙣𝙤𝙣 𝙫𝙖𝙡𝙞𝙙𝙖";
    }
}

function migrateWarnDates() {
    if (!global.db.data?.users) return;
    
    for (const [jid, user] of Object.entries(global.db.data.users)) {
        if (user.warnReasons) {
            user.warnReasons.forEach(warn => {
                if (!warn.displayDate) {
                    try {
                        const date = warn.date ? new Date(warn.date) : new Date();
                        warn.displayDate = date.toLocaleString('it-IT', {
                            timeZone: 'Europe/Rome',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } catch (e) {
                        warn.displayDate = "Data migrata";
                    }
                }
            });
        }
    }
}

// Run the migration at plugin load time
migrateWarnDates();

// Helper function to create fkontak object
function createFkontak(who) {
    return {
        key: { 
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast'
        },
        message: { 
            contactMessage: {
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${who.split('@')[0]};;;\nFN:${who.split('@')[0]}\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabel:Cellulare\nEND:VCARD`
            }
        }
    };
}

// Helper function to format phone number and ensure it's a valid JID
function formatPhoneNumber(phoneNumber) {
    // Remove common phone number formatting characters
    let cleaned = phoneNumber.replace(/[\s+\-()]/g, '');
    
    // If number doesn't start with +, assume it needs the + prefix
    if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
    }
    
    // Remove the + for the JID format
    const numericPart = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned;
    
    // Return properly formatted JID
    return numericPart + '@s.whatsapp.net';
}

let handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {
    const OWNER_NUMBER = '393534409026@s.whatsapp.net';
    const isOwner = m.sender === OWNER_NUMBER;
    const isAdmin = participants.find(p => p.id === m.sender)?.admin === 'admin' || isOwner;
    // Mod support
    function normalizeJid(jid) {
      return (jid || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }
    const isMod = global.db.data.mods && global.db.data.mods.includes(normalizeJid(m.sender));
    if (!isAdmin && !isMod) return m.reply('⚠️ 𝙎𝙤𝙡𝙤 𝙖𝙙𝙢𝙞𝙣 𝙤 𝙢𝙤𝙙𝙚𝙧𝙖𝙩𝙤𝙧𝙞 𝙥𝙤𝙨𝙨𝙤𝙣𝙤 𝙪𝙨𝙖𝙧𝙚 𝙦𝙪𝙚𝙨𝙩𝙤 𝙘𝙤𝙢𝙖𝙣𝙙𝙤');

    let who = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);

    switch (command.toLowerCase()) {
        // Comando per rimuovere richiami mod
        case 'unrichiamo':
        case 'unrichiama':
        case 'unrichiami':
            if (!who) return m.reply(`⚠️ 𝘿𝙚𝙫𝙞 𝙢𝙚𝙣𝙯𝙞𝙤𝙣𝙖𝙧𝙚 𝙤 𝙧𝙞𝙨𝙥𝙤𝙣𝙙𝙚𝙧𝙚 𝙖𝙡 𝙢𝙚𝙨𝙨𝙖𝙜𝙜𝙞𝙤 𝙙𝙞 𝙦𝙪𝙖𝙡𝙘𝙪𝙣𝙤\n𝙀𝙨𝙚𝙢𝙥𝙞𝙤:\n\`${usedPrefix + command} @𝙪𝙩𝙚𝙣𝙩𝙚\` 𝙍𝙞𝙢𝙪𝙤𝙫𝙚 𝙞𝙡 𝙧𝙞𝙘𝙝𝙞𝙖𝙢𝙤 𝙨𝙥𝙚𝙘𝙞𝙛𝙞𝙘𝙤, 𝙨𝙚 𝙢𝙖𝙣𝙘𝙖 𝙡'𝙪𝙡𝙩𝙞𝙢𝙤 𝙧𝙞𝙘𝙝𝙞𝙖𝙢𝙤\n\`${usedPrefix + command} @𝙪𝙩𝙚𝙣𝙩𝙚 𝙖𝙡𝙡\` 𝙍𝙞𝙢𝙪𝙤𝙫𝙚 𝙏𝙐𝙏𝙏𝙄 𝙞 𝙧𝙞𝙘𝙝𝙞𝙖𝙢𝙞 𝙖𝙡𝙡'𝙪𝙩𝙚𝙣𝙩𝙚`);
            return handleUnrichiamo(conn, m, who, text, args, usedPrefix, command);
        case 'warn':
        case 'warning':
        case 'avvertimento':
            if (!who) return m.reply(`⚠️ 𝘿𝙚𝙫𝙞 𝙢𝙚𝙣𝙯𝙞𝙤𝙣𝙖𝙧𝙚 𝙤 𝙧𝙞𝙨𝙥𝙤𝙣𝙙𝙚𝙧𝙚 𝙖𝙡 𝙢𝙚𝙨𝙨𝙖𝙜𝙜𝙞𝙤 𝙙𝙞 𝙦𝙪𝙖𝙡𝙘𝙪𝙣𝙤\n𝙀𝙨𝙚𝙢𝙥𝙞𝙤:\n\`${usedPrefix + command} @𝙪𝙩𝙚𝙣𝙩𝙚 [𝙢𝙤𝙩𝙞𝙫𝙤]\` `);
             const targetIsAdmin = participants.find(p => p.id === who)?.admin === 'admin';
            if (targetIsAdmin && !isOwner) return conn.reply(m.chat, '𝙉𝙤𝙣 𝙥𝙪𝙤𝙞 𝙬𝙖𝙧𝙣𝙖𝙧𝙚 𝙪𝙣 𝙖𝙡𝙩𝙧𝙤 𝙖𝙙𝙢𝙞𝙣!', m, rcanal);
            return handleWarn(conn, m, who, text, isOwner, isAdmin, isMod, participants, usedPrefix);

        // Comando per i richiami mod
        case 'richiamo':
        case 'richiama':
        case 'richiami': {
            if (!who) return m.reply(`⚠️ 𝘿𝙚𝙫𝙞 𝙢𝙚𝙣𝙯𝙞𝙤𝙣𝙖𝙧𝙚 𝙤 𝙧𝙞𝙨𝙥𝙤𝙣𝙙𝙚𝙧𝙚 𝙖𝙡 𝙢𝙚𝙨𝙨𝙖𝙜𝙜𝙞𝙤 𝙙𝙞 𝙦𝙪𝙖𝙡𝙘𝙪𝙣𝙤\n𝙀𝙨𝙚𝙢𝙥𝙞𝙤:\n\`${usedPrefix + command} @𝙪𝙩𝙚𝙣𝙩𝙚 [𝙢𝙤𝙩𝙞𝙫𝙤]\``);
            const targetIsAdmin = participants.find(p => p.id === who)?.admin === 'admin';
            if (targetIsAdmin && !isOwner) return m.reply('𝙉𝙤𝙣 𝙥𝙪𝙤𝙞 𝙧𝙞𝙘𝙝𝙞𝙖𝙢𝙖𝙧𝙚 𝙪𝙣 𝙖𝙡𝙩𝙧𝙤 𝙖𝙙𝙢𝙞𝙣!');
            // Forza il tipo mod anche se l'utente è admin
            return handleWarn(conn, m, who, text, isOwner, false, true, participants, usedPrefix);
        }

        case 'unwarn':
        case 'delwarn':
        case 'rimuoviwarn':
            if (!who) return m.reply(`⚠️ 𝘿𝙚𝙫𝙞 𝙢𝙚𝙣𝙯𝙞𝙤𝙣𝙖𝙧𝙚 𝙤 𝙧𝙞𝙨𝙥𝙤𝙣𝙙𝙚𝙧𝙚 𝙖𝙡 𝙢𝙚𝙨𝙨𝙖𝙜𝙜𝙞𝙤 𝙙𝙞 𝙦𝙪𝙖𝙡𝙘𝙪𝙣𝙤\n𝙀𝙨𝙚𝙢𝙥𝙞𝙤:\n\`${usedPrefix + command} @𝙪𝙩𝙚𝙣𝙩𝙚 [1 o 2]\` 𝙍𝙞𝙢𝙪𝙤𝙫𝙚 𝙞𝙡 𝙬𝙖𝙧𝙣 𝙨𝙥𝙚𝙘𝙞𝙛𝙞𝙘𝙤, 𝙨𝙚 𝙢𝙖𝙣𝙘𝙖 𝙡𝙚𝙫𝙖 𝙡'𝙪𝙡𝙩𝙞𝙢𝙤 𝙬𝙖𝙧𝙣\n\`${usedPrefix + command} @𝙪𝙩𝙚𝙣𝙩𝙚 𝙖𝙡𝙡\` 𝙍𝙞𝙢𝙪𝙤𝙫𝙚 𝙏𝙐𝙏𝙏𝙄 𝙞 𝙬𝙖𝙧𝙣 𝙖𝙡𝙡'𝙪𝙩𝙚𝙣𝙩𝙚`);
            return handleUnwarn(conn, m, who, text, args, usedPrefix, command);

        case 'warnlist':
        case 'listawarn':
        case 'warnhistory':
        case 'storiawarn': {
            if (!who && !text) return m.reply(`⚠️ 𝘿𝙚𝙫𝙞 𝙢𝙚𝙣𝙯𝙞𝙤𝙣𝙖𝙧𝙚 𝙤 𝙧𝙞𝙨𝙥𝙤𝙣𝙙𝙚𝙧𝙚 𝙖𝙡 𝙢𝙚𝙨𝙨𝙖𝙜𝙜𝙞𝙤 𝙙𝙞 𝙦𝙪𝙖𝙡𝙘𝙪𝙣𝙤\n𝙀𝙨𝙚𝙢𝙥𝙞𝙤:\n\`${usedPrefix + command} @𝙪𝙩𝙚𝙣𝙩𝙚\` 𝙤𝙥𝙥𝙪𝙧𝙚 \`${usedPrefix + command} +39 𝙓𝙓𝙓 𝙓𝙓𝙓 𝙓𝙓𝙓𝙓\``);
            if (!who && text) {
                who = formatPhoneNumber(text.trim());
            }
            // Mostra solo gli ultimi 3 avvertimenti per ogni categoria
            return handleWarnList(conn, m, who, 'all');
        }
        // Comandi per visualizzare direttamente la lista warn admin/mod
        case 'warnlistadmin':
        case 'warnlistmod': {
            let target = who;
            if (!target && text) {
                // Ensure proper phone number format
                target = text.startsWith('+') ? formatPhoneNumber(text.substring(1)) : formatPhoneNumber(text);
            }
            if (!target) return m.reply('⚠️ 𝘿𝙚𝙫𝙞 𝙨𝙘𝙧𝙞𝙫𝙚𝙧𝙚 𝙞𝙡 𝙣𝙪𝙢𝙚𝙧𝙤 𝙤 𝙩𝙖𝙜𝙜𝙖𝙧𝙚 𝙪𝙣 𝙪𝙩𝙚𝙣𝙩𝙚!');
            
            // Ensure proper JID format for database lookup
            const normalizedTarget = target.includes('@') ? target : formatPhoneNumber(target.replace(/[^0-9]/g, ''));
            return handleWarnList(conn, m, normalizedTarget, command.endsWith('mod') ? 'mod' : 'admin');
        }
    }
};

async function handleWarn(conn, m, who, text, isOwner, isAdmin, isMod, participants, usedPrefix) {
    const MAX_WARNINGS_ADMIN = 3;
    const MAX_RICHIAMI_MOD = 6; // 2 richiami mod = 1 warn admin
    if (who.includes(conn.user.jid.split('@')[0])) return conn.reply(m.chat, '❌ 𝙉𝙤𝙣 𝙥𝙤𝙨𝙨𝙤 𝙬𝙖𝙧𝙣𝙖𝙧𝙚 𝙢𝙚 𝙨𝙩𝙚𝙨𝙨𝙖 𝙩𝙚𝙨𝙩𝙖 𝙙𝙞 𝙘𝙪𝙡𝙤!', m, phishy);
    const targetIsAdmin = participants.find(p => p.id === who)?.admin === 'admin';
    if (targetIsAdmin && !isOwner) return conn.reply(m.chat, '❌ 𝙉𝙤𝙣 𝙥𝙪𝙤𝙞 𝙬𝙖𝙧𝙣𝙖𝙧𝙚 𝙪𝙣 𝙖𝙡𝙩𝙧𝙤 𝙖𝙙𝙢𝙞𝙣!', m, phishy);
    const comment = text ? text.replace(/@\d+/, '').trim() : null;
    if (!global.db.data.users[who]) {
        global.db.data.users[who] = { warnReasonsAdmin: [], warnReasonsMod: [], oldWarnReasonsAdmin: [], oldWarnReasonsMod: [] };
    }
    const user = global.db.data.users[who];
    if (!user.warnReasonsAdmin) user.warnReasonsAdmin = [];
    if (!user.warnReasonsMod) user.warnReasonsMod = [];
    if (!user.oldWarnReasonsAdmin) user.oldWarnReasonsAdmin = [];
    if (!user.oldWarnReasonsMod) user.oldWarnReasonsMod = [];
    const timestamp = new Date().toISOString();
    const displayTime = getItalianTimestamp();
    let tipo = 'admin';
    if (isMod && !isAdmin && !isOwner) {
        tipo = 'mod';
        user.warnReasonsMod.push({ reason: comment || "Nessun motivo specificato", date: timestamp, displayDate: displayTime, admin: m.sender });
    } else {
        user.warnReasonsAdmin.push({ reason: comment || "Nessun motivo specificato", date: timestamp, displayDate: displayTime, admin: m.sender });
    }
    // Calcolo richiami mod convertiti in warn
    const richiamiMod = user.warnReasonsMod.length;
    const warnAdmin = user.warnReasonsAdmin.length;
    const richiamiTotali = warnAdmin + Math.floor(richiamiMod / 2);
    const warnTotali = user.warnReasonsAdmin.length + Math.floor(user.warnReasonsMod.length / 2);
    const fkontak = createFkontak(who);
    if (m.quoted && m.quoted.sender === who) {
        try { await conn.sendMessage(m.chat, { delete: m.quoted.key }); } catch (e) { console.error("Errore nell'eliminazione del messaggio:", e); }
    }
    let warnMsg = `⚠️ AVVISO da parte di ${tipo === 'mod' ? 'MODERATORE (Richiamo)' : (isOwner ? 'OWNER (Warn)' : 'ADMIN (Warn)')} ⚠️\n\n` +
                  `▸ 👤 𝙪𝙩𝙚𝙣𝙩𝙚: @${who.split('@')[0]}\n` +
                  `▸⚠️ 𝙒𝙖𝙧𝙣: ${warnAdmin}/${MAX_WARNINGS_ADMIN}\n` +
                  `▸📢 𝙍𝙞𝙘𝙝𝙞𝙖𝙢𝙞: ${richiamiMod}\n` +
                  `▸📒 𝙢𝙤𝙩𝙞𝙫𝙤: ${comment || "Nessun motivo specificato"}\n` +
                  `▸🗓️ 𝙙𝙖𝙩𝙖: ${displayTime}\n\n` +
                  `𝘴𝘦𝘪 𝘢 ${warnTotali} 𝘴𝘶 ${MAX_WARNINGS_ADMIN} 𝘸𝘢𝘳𝘯, 𝘴𝘦 𝘢𝘳𝘳𝘪𝘷𝘪 𝘢𝘭 𝘭𝘪𝘮𝘪𝘵𝘦 𝘷𝘦𝘳𝘳𝘢𝘪 𝘳𝘪𝘮𝘰𝘴𝘴𝘰 𝘥𝘢𝘭 𝘨𝘳𝘶𝘱𝘱𝘰.\n\n` 
    // Ban se raggiunge il limite
    if (richiamiTotali >= MAX_WARNINGS_ADMIN) {
        user.oldWarnReasonsAdmin = [...user.oldWarnReasonsAdmin, ...user.warnReasonsAdmin];
        user.warnReasonsAdmin = [];
        user.oldWarnReasonsMod = [...user.oldWarnReasonsMod, ...user.warnReasonsMod];
        user.warnReasonsMod = [];
        await conn.sendMessage(m.chat, {
            text: `💀 𝚄𝚃𝙴𝙽𝚃𝙴 𝚁𝙸𝙼𝙾𝚂𝚂𝙾  💀\n\n@${who.split('@')[0]} ͓̽h͓̽a͓̽ ͓̽s͓͓̽̽u͓͓̽̽p͓͓̽̽e͓͓̽̽r͓̽a͓͓̽̽t͓͓̽̽o͓̽ ͓̽o͓͓̽̽g͓͓̽̽n͓͓̽̽i͓̽ ͓̽l͓͓̽̽i͓͓̽̽m͓͓̽̽i͓͓̽̽t͓͓̽̽e͓̽!\n\n𝙐𝙡𝙩𝙞𝙢𝙞 𝙒𝙖𝙧𝙣:\n` +
                user.oldWarnReasonsAdmin.slice(-MAX_WARNINGS_ADMIN).map((w, i) => `#${i+1}: ${w.reason} (${formatDate(w.displayDate || w.date)})`).join('\n') +
                `\n𝙐𝙡𝙩𝙞𝙢𝙞 𝙍𝙞𝙘𝙝𝙞𝙖𝙢𝙞:\n` +
                user.oldWarnReasonsMod.slice(-MAX_RICHIAMI_MOD).map((w, i) => `#${i+1}: ${w.reason} (${formatDate(w.displayDate || w.date)})`).join('\n'),
            mentions: [who]
        }, { quoted: fkontak });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
        return;
    }
    await conn.sendMessage(m.chat, { text: warnMsg, mentions: [who] }, { quoted: fkontak });
}

async function handleUnrichiamo(conn, m, who, text, args, usedPrefix, command) {
    if (!global.db.data.users[who]) return m.reply('ℹ️ 𝙌𝙪𝙚𝙨𝙩𝙤 𝙪𝙩𝙚𝙣𝙩𝙚 𝙣𝙤𝙣 𝙝𝙖 𝙧𝙞𝙘𝙝𝙞𝙖𝙢𝙞 𝙧𝙚𝙜𝙞𝙨𝙩𝙧𝙖𝙩𝙞');
    const user = global.db.data.users[who];
    if (!user.warnReasonsMod || user.warnReasonsMod.length === 0) {
        return m.reply(`ℹ️ @${who.split('@')[0]} 𝙣𝙤𝙣 𝙝𝙖 𝙧𝙞𝙘𝙝𝙞𝙖𝙢𝙞 𝙙𝙖 𝙧𝙞𝙢𝙤𝙫𝙚𝙧𝙚`, null, { mentions: [who] });
    }
    const fkontak = createFkontak(who);
    const currentTime = getItalianTimestamp();
    // Rimozione TUTTI i richiami
    if (args[1]?.toLowerCase() === 'all') {
        const totalRichiami = user.warnReasonsMod.length;
        user.warnReasonsMod = [];
        await conn.sendMessage(m.chat, {
            text: `✅ *𝚃𝚄𝚃𝚃𝙸 𝙸 𝚁𝙸𝙲𝙷𝙸𝙰𝙼𝙸 𝚂𝙾𝙽𝙾 𝚂𝚃𝙰𝚃𝙸 𝚁𝙸𝙼𝙾𝚂𝚂𝙸* ✅\n\n` +
                  `👤 𝙪𝙩𝙚𝙣𝙩𝙚: @${who.split('@')[0]}\n` +
                  `🔢 𝙧𝙞𝙘𝙝𝙞𝙖𝙢𝙞 rimossi: ${totalRichiami}\n` +
                  `⏱️ 𝙙𝙖𝙩𝙖: ${currentTime}\n\n` +
                  `⚠️ Ora l'utente ha 0 richiami!`,
            mentions: [who]
        }, { quoted: fkontak });
        return;
    }
    const richiamoIndex = parseInt(args[1]) - 1;
    if (!isNaN(richiamoIndex) && args[1]) {
        if (richiamoIndex >= 0 && richiamoIndex < user.warnReasonsMod.length) {
            const removedRichiamo = user.warnReasonsMod.splice(richiamoIndex, 1)[0];
            await conn.sendMessage(m.chat, {
                text: `✅ RICHIAMO RIMOSSO ✅\n\n` +
                      `👤 𝙪𝙩𝙚𝙣𝙩𝙚: @${who.split('@')[0]}\n` +
                      `🔢 𝙧𝙞𝙘𝙝𝙞𝙖𝙢𝙤 rimosso: ${richiamoIndex + 1}\n` +
                      `📝 𝙢𝙤𝙩𝙞𝙫𝙤: ${removedRichiamo.reason}\n` +
                      `🗓️ 𝙙𝙖𝙩𝙖: ${formatDate(removedRichiamo.displayDate || removedRichiamo.date)}\n` +
                      `🛠️ 𝙢𝙤𝙙: @${removedRichiamo.admin.split('@')[0]}\n` +
                      `⏱️ 𝙙𝙖𝙩𝙖 𝙧𝙞𝙢𝙤𝙯𝙞𝙤𝙣𝙚: ${currentTime}\n\n` +
                      `⚠️ richiami rimanenti: ${user.warnReasonsMod.length}`,
                mentions: [who, removedRichiamo.admin]
            }, { quoted: fkontak });
        } else {
            await conn.reply(m.chat, `❌ Numero richiamo non valido. L'utente ha solo ${user.warnReasonsMod.length} richiami.\nUsa \`${usedPrefix + command} @utente 1-2|all\` per rimuovere specificamente, se non specifichi il numero verra tolto quello piu recente, oppure aggiungi all e toglili tutti quanti.`, m);
        }
    } else {
        if (user.warnReasonsMod.length > 0) {
            const removedRichiamo = user.warnReasonsMod.pop();
            await conn.sendMessage(m.chat, {
                text: `✅ 𝚄𝙻𝚃𝙸𝙼𝙾 𝚁𝙸𝙲𝙷𝙸𝙰𝙼𝙾 𝚁𝙸𝙼𝙾𝚂𝚂𝙾 ✅\n\n` +
                      `👤 𝙪𝙩𝙚𝙣𝙩𝙚: @${who.split('@')[0]}\n` +
                      `📝 𝙢𝙤𝙩𝙞𝙫𝙤: ${removedRichiamo.reason}\n` +
                      `🗓️ 𝙙𝙖𝙩𝙖: ${formatDate(removedRichiamo.displayDate || removedRichiamo.date)}\n` +
                      `🛠️ 𝙢𝙤𝙙: @${removedRichiamo.admin.split('@')[0]}\n` +
                      `⏱️ 𝙙𝙖𝙩𝙖 𝙧𝙞𝙢𝙤𝙯𝙞𝙤𝙣𝙚: ${currentTime}\n\n` +
                      `⚠️ richiami rimanenti: ${user.warnReasonsMod.length}`,
                mentions: [who, removedRichiamo.admin]
            }, { quoted: fkontak });
        }
    }
}

async function handleUnwarn(conn, m, who, text, args, usedPrefix, command) {
    if (!global.db.data.users[who]) return m.reply('ℹ️ 𝙌𝙪𝙚𝙨𝙩𝙤 𝙪𝙩𝙚𝙣𝙩𝙚 𝙣𝙤𝙣 𝙝𝙖 𝙬𝙖𝙧𝙣 𝙧𝙚𝙜𝙞𝙨𝙩𝙧𝙖𝙩𝙞');
    
    const user = global.db.data.users[who];
    if (!user.warnReasonsAdmin || user.warnReasonsAdmin.length === 0) {
        return m.reply(`ℹ️ @${who.split('@')[0]} 𝙣𝙤𝙣 𝙝𝙖 𝙬𝙖𝙧𝙣 𝙙𝙖 𝙧𝙞𝙢𝙤𝙫𝙚𝙧𝙚`, null, { mentions: [who] });
    }
    
    const fkontak = createFkontak(who);
    const currentTime = getItalianTimestamp();
    
    // Modalità rimozione TUTTI i warn
    if (args[1]?.toLowerCase() === 'all') {
        const totalWarns = user.warnReasonsAdmin.length;
        user.warnReasonsAdmin = [];
        
        await conn.sendMessage(m.chat, { 
            text: `✅ 𝚃𝚄𝚃𝚃𝙸 𝙸 𝚆𝙰𝚁𝙽 𝚂𝙾𝙽𝙾 𝚂𝚃𝙰𝚃𝙸 𝚁𝙸𝙼𝙾𝚂𝚂𝙾 ✅\n\n` +
                  `👤 𝙪𝙩𝙚𝙣𝙩𝙚: @${who.split('@')[0]}\n` +
                  `🔢 𝙬𝙖𝙧𝙣 𝙧𝙞𝙢𝙤𝙨𝙨𝙞 ${totalWarns}\n` +
                  `⏱️ 𝙙𝙖𝙩𝙖 𝙙𝙚𝙡 𝙬𝙖𝙧𝙣: ${currentTime}\n\n` +
                  `⚠️ Ora l'utente ha 0 warn!`,
            mentions: [who]
        }, { quoted: fkontak });
        return;
    }
    
    const warnIndex = parseInt(args[1]) - 1;
    
    if (!isNaN(warnIndex) && args[1]) {
        if (warnIndex >= 0 && warnIndex < user.warnReasonsAdmin.length) {
            const removedWarn = user.warnReasonsAdmin.splice(warnIndex, 1)[0];
            
            await conn.sendMessage(m.chat, { 
                text: `✅ 𝚆𝙰𝚁𝙽 𝚁𝙸𝙼𝙾𝚂𝚜𝙾 ✅\n\n` +
                      `👤 𝙪𝙩𝙚𝙣𝙩𝙚: @${who.split('@')[0]}\n` +
                      `🔢 𝙬𝙖𝙧𝙣 𝙧𝙞𝙢𝙤𝙨𝙨𝙤: ${warnIndex + 1}\n` +
                      `📝 𝙢𝙤𝙩𝙞𝙫𝙤: ${removedWarn.reason}\n` +
                      `🗓️ 𝙙𝙖𝙩𝙖 𝙙𝙚𝙡 𝙬𝙖𝙧𝙣: ${formatDate(removedWarn.displayDate || removedWarn.date)}\n` +
                      `🛠️ 𝙖𝙙𝙢𝙞𝙣 : @${removedWarn.admin.split('@')[0]}\n` +
                      `⏱️ 𝙙𝙖𝙩𝙖 𝙧𝙞𝙢𝙤𝙯𝙞𝙤𝙣𝙚: ${currentTime}\n\n` +
                      `⚠️ 𝙬𝙖𝙧𝙣 𝙧𝙞𝙢𝙖𝙣𝙩𝙞: ${user.warnReasonsAdmin.length}`,
                mentions: [who, removedWarn.admin]
            }, { quoted: fkontak });
        } else {
            await conn.reply(m.chat, `❌ Numero warn non valido. L'utente ha solo ${user.warnReasonsAdmin.length} warn.\nUsa \`${usedPrefix + command} @utente 1-2|all\` per rimuovere specificamente, se non specifichi il numero verra tolto quello piu recente, oppure aggiungi all e toglili tutti quanti.`, m);
        }
    } else {
        if (user.warnReasonsAdmin.length > 0) {
            const removedWarn = user.warnReasonsAdmin.pop();
            
            await conn.sendMessage(m.chat, { 
                text: `✅ 𝚄𝙻𝚃𝙸𝙼𝙾 𝚆𝙰𝚁𝙽 𝚁𝙸𝙼𝙾𝚂𝚜𝙾 ✅\n\n` +
                      `👤 𝙪𝙩𝙚𝙣𝙩𝙚: @${who.split('@')[0]}\n` +
                      `📝 𝙢𝙤𝙩𝙞𝙫𝙤: ${removedWarn.reason}\n` +
                      `🗓️ 𝙙𝙖𝙩𝙖 𝙙𝙚𝙡 𝙬𝙖𝙧𝙣: ${formatDate(removedWarn.displayDate || removedWarn.date)}\n` +
                      `🛠️ 𝙖𝙙𝙢𝙞𝙣: @${removedWarn.admin.split('@')[0]}\n` +
                      `⏱️ 𝙙𝙖𝙩𝙖 𝙧𝙞𝙢𝙤𝙯𝙞𝙤𝙣𝙚: ${currentTime}\n\n` +
                      `⚠️  𝙬𝙖ρν 𝙧𝙞𝙢𝙖𝙣𝙚𝙣𝙩𝙞: ${user.warnReasonsAdmin.length}`,
                mentions: [who, removedWarn.admin]
            }, { quoted: fkontak });
        }
    }
}

async function handleWarnList(conn, m, who, tipo = 'admin') {
    if (!global.db.data.users[who]) return conn.reply(m.chat, 'ℹ️ 𝚀𝚞𝚎𝚜𝚝𝚘 𝚞𝚝𝚎𝚗𝚝𝚎 𝙣𝙤𝙣 𝙝𝙖 𝙬𝙖𝙧𝙣 𝙧𝙚𝙜𝙞𝙨𝙩𝙧𝙖𝙩𝙞', m, phishy);
    const user = global.db.data.users[who];
    // Prendi solo gli ultimi 3 per ogni categoria
    const warnList = (user.warnReasonsAdmin || []).slice(-3);
    const richiamiList = (user.warnReasonsMod || []).slice(-3);
    const oldWarnList = (user.oldWarnReasonsAdmin || []).slice(-3);
    const oldRichiamiList = (user.oldWarnReasonsMod || []).slice(-3);
    const userId = typeof who === 'string' && who.includes('@') ? who.split('@')[0] : who;
    if (
        warnList.length === 0 &&
        richiamiList.length === 0 
    ) {
        return conn.reply(m.chat, `ℹ️ 𝙇'𝙪𝙩𝙚𝙣𝙩𝙚 @${userId} 𝙣𝙤𝙣 𝙝𝙖 𝙖𝙫𝙫𝙚𝙧𝙩𝙞𝙢𝙚𝙣𝙩𝙞 𝙖𝙩𝙩𝙪𝙖𝙡𝙢𝙚𝙣𝙩𝙚`, m, oldWarnList, oldRichiamiList, { mentions: [who] });
    }
    let warnMessage = `📜 𝙲𝚁𝙾𝙽𝙾𝙇𝙾𝙶𝙸𝙰 𝙰𝚅𝚅𝙴𝚁𝚃𝙸𝙼𝙴𝙽𝚃𝙸 📜\n\n` +
                     `👤 𝙪𝙩𝙚𝙣𝙩𝙚: @${userId}\n`;
    warnMessage += `\n⚠️ 𝙒𝙖𝙧𝙣: ${warnList.length}\n`;
    warnList.forEach((warn, index) => {
        let adminId = warn.admin;
        if (typeof adminId === 'string' && adminId.includes('@')) adminId = adminId.split('@')[0];
        const adminName = warn.admin === '🤖PhiShy' ? '🤖PhiShy' : `@${adminId}`;
        warnMessage += `\n${index + 1}. 📅 ${formatDate(warn.displayDate || warn.date)}\n   🔹 𝙢𝙤𝙩𝙞𝙫𝙤: ${warn.reason}\n   🔹 𝙖𝙙𝙢𝙞𝙣: ${adminName}`;
    });
    warnMessage += `\n\n⚠️ 𝙍𝙞𝙘𝙝𝙞𝙖𝙢𝙞: ${richiamiList.length}\n`;
    richiamiList.forEach((warn, index) => {
        let adminId = warn.admin;
        if (typeof adminId === 'string' && adminId.includes('@')) adminId = adminId.split('@')[0];
        const adminName = warn.admin === '🤖PhiShy' ? '🤖PhiShy' : `@${adminId}`;
        warnMessage += `\n${index + 1}. 📅 ${formatDate(warn.displayDate || warn.date)}\n   🔹 𝙢𝙤𝙩𝙞𝙫𝙤: ${warn.reason}\n   🔹 𝙢𝙤𝙙: ${adminName}`;
    });
    warnMessage += `\n\n⚠️ 𝙒𝙖𝙧𝙣 𝙥𝙖𝙨𝙨𝙖𝙩𝙞: ${oldWarnList.length}\n`;
    oldWarnList.forEach((warn, index) => {
        let adminId = warn.admin;
        if (typeof adminId === 'string' && adminId.includes('@')) adminId = adminId.split('@')[0];
        const adminName = warn.admin === '🤖PhiShy' ? '🤖PhiShy' : `@${adminId}`;
        warnMessage += `\n${index + 1}. 📅 ${formatDate(warn.displayDate || warn.date)}\n   🔹 𝙢𝙤𝙩𝙞𝙫𝙤: ${warn.reason}\n   🔹 𝙖𝙙𝙢𝙞𝙣: ${adminName}`;
    });
    warnMessage += `\n\n⚠️ 𝙍𝙞𝙘𝙝𝙞𝙖𝙢𝙞 𝙥𝙖𝙨𝙨𝙖𝙩𝙞: ${oldRichiamiList.length}\n`;
    oldRichiamiList.forEach((warn, index) => {
        let adminId = warn.admin;
        if (typeof adminId === 'string' && adminId.includes('@')) adminId = adminId.split('@')[0];
        const adminName = warn.admin === '🤖PhiShy' ? '🤖PhiShy' : `@${adminId}`;
        warnMessage += `\n${index + 1}. 📅 ${formatDate(warn.displayDate || warn.date)}\n   🔹 𝙢𝙤𝙩𝙞𝙫𝙤: ${warn.reason}\n   🔹 𝙢𝙤𝙙: ${adminName}`;
    });
    await conn.sendMessage(m.chat, {
        text: warnMessage,
        mentions: [who]
    }, { quoted: m });
    return;
}

async function addPrivateMessageWarning(userId, reason) {
    if (!global.db.data.users[userId]) {
        global.db.data.users[userId] = { warnReasonsAdmin: [] };
    }

    const userData = global.db.data.users[userId];
    userData.warnReasonsAdmin.push({
        reason: reason || "Scrittura in privato al bot",
        date: new Date().toISOString()
    });
}


// Command configuration
handler.help = [
    'warn @user [motivo]',
    'richiamo @user [motivo]',
    'richiama @user [motivo]',
    'richiami @user [motivo]',
    'unwarn @user [numero|all]',
    'unrichiamo @user [numero|all]',
    'unrichiama @user [numero|all]',
    'unrichiami @user [numero|all]',
    'warnlist @user/numero'
];
handler.tags = ['group'];
handler.command = /^(warn|warning|avvertimento|unwarn|delwarn|rimuoviwarn|warnlist|listawarn|warnhistory|storiawarn|richiamo|richiama|richiami|unrichiamo|unrichiama|unrichiami|warnlistadmin|warnlistmod)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler