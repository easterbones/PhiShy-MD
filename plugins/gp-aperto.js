let handler = async (m, { conn, args, text, isAdmin, usedPrefix, command }) => {
    // ==================== FUNZIONI DI UTILITY ====================
    const log = (msg) => console.log(`[APERTURA GRUPPO] ${new Date().toLocaleString()} - ${msg}`);
    const normalizeJid = (jid) => {
        if (typeof jid !== 'string') return '';
        return jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    };
    
    // ==================== VERIFICA PERMESSI ====================
    const senderJid = normalizeJid(m.sender);
    const isOwner = global.owner?.some(([id]) => normalizeJid(id) === senderJid) || false;
    const isMod = (global.db.data.mods || []);
    
    // ==================== OTTIENI NOME UTENTE ====================
    let nomeUtente = 'Utente sconosciuto';
    try {
        // Prova prima con il nome salvato nel messaggio
        if (m.pushName) {
            nomeUtente = m.pushName;
        } else {
            // Se non disponibile, ottieni info dal contatto
            const contact = await conn.getName(senderJid);
            nomeUtente = contact || 'Utente sconosciuto';
        }
        log(`Nome utente identificato: ${nomeUtente} (${senderJid})`);
    } catch (error) {
        log(`Errore nell'ottenere il nome utente: ${error.message}`);
        nomeUtente = `@${senderJid.split('@')[0]}`;
    }
    
    log(`Verifica permessi per ${senderJid} - Owner:${isOwner} Mod:${isMod} Admin:${isAdmin}`);
    
    if (!isAdmin && !isOwner && !isMod) {
        log(`Accesso negato per ${senderJid}`);
        return m.reply('❌ Solo admin, owner e moderatori possono usare questo comando.');
    }

    // ==================== GESTIONE GRUPPO TARGET ====================
    const CONTROL_GROUP = '120363387953890165@g.us';
    let targetGroup = m.chat;
    let groupSource = 'current';

    const extractGroupJid = () => {
        try {
            // Caso 1: Menzione diretta
            if (m.mentionedJid?.length) {
                const mentionedGroup = m.mentionedJid.find(j => j.endsWith('@g.us'));
                if (mentionedGroup) return { jid: mentionedGroup, source: 'mention' };
            }

            // Caso 2: JID nel testo
            const jidMatch = text.match(/(\d+-\d+-\d+@g\.us|\d+@g\.us)/);
            if (jidMatch) return { jid: jidMatch[0], source: 'text' };

            return null;
        } catch (e) {
            log(`Errore estrazione JID: ${e.message}`);
            return null;
        }
    };

    if (m.chat === CONTROL_GROUP) {
        const extracted = extractGroupJid();
        if (!extracted) {
            return m.reply('❌ Formato non valido. Usa:\n' +
                         `${usedPrefix + command} @menzione-gruppo\n` +
                         `${usedPrefix + command} 123-456-789@g.us`);
        }
        targetGroup = extracted.jid;
        groupSource = extracted.source;
        log(`Target group: ${targetGroup} (from ${groupSource})`);
    }

    // ==================== VERIFICA GRUPPO ====================
    try {
        log(`Verifica gruppo ${targetGroup}`);
        const groupMetadata = await conn.groupMetadata(targetGroup);
        
        if (!groupMetadata) {
            throw new Error('Gruppo non trovato');
        }

        const isBotAdmin = groupMetadata.participants.some(p => 
            p.id === conn.user.jid && ['admin', 'superadmin'].includes(p.admin)
        );
        
        if (!isBotAdmin) {
            throw new Error('Il bot non è admin');
        }
    } catch (error) {
        log(`Errore verifica gruppo: ${error.message}`);
        return m.reply('❌ Impossibile aprire il gruppo: ' + (
            error.message.includes('non è admin') ? 'Il bot non è admin' :
            'Gruppo non valido'
        ));
    }

    // ==================== LIMITI MODERATORI ====================
    if (isMod && !isOwner && !isAdmin) {
        if (!global.db.data.modLimits) global.db.data.modLimits = {};
        
        const now = Date.now();
        const key = `${senderJid}:gp-aperto`;
        const record = global.db.data.modLimits[key] || { count: 0, last: 0 };

        if (now - record.last > 86400000) {
            record.count = 0;
            record.last = now;
        }

        if (record.count >= 3) {
            return m.reply('❌ Hai raggiunto il limite di 3 aperture nelle ultime 24h');
        }

        record.count++;
        global.db.data.modLimits[key] = record;
        log(`Conteggio aggiornato per ${senderJid}: ${record.count}/3`);
    }

    // ==================== APERTURA GRUPPO ====================
    try {
        log(`Apertura gruppo ${targetGroup} da parte di ${nomeUtente}`);
        await conn.groupSettingUpdate(targetGroup, 'not_announcement');
        
        await conn.sendMessage(targetGroup, { 
            text: `✅ Chat aperta da ${nomeUtente}`, 
            contextInfo: {
                externalAdReply: {
                    title: "Modalità chat modificata",
                    thumbnail: await (await fetch('https://tse1.mm.bing.net/th/id/OIP.GOxWWwPy-60orP0PSlXLBQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3')).buffer(),
                    mediaType: 1
                }
            }
        });

        if (m.chat === CONTROL_GROUP) {
            await m.reply(`✅ Gruppo ${targetGroup} aperto con successo da ${nomeUtente}`);
        }

        log(`Operazione completata per ${nomeUtente} (${senderJid})`);
    } catch (error) {
        log(`ERRORE CRITICO: ${error.stack}`);
        await conn.sendMessage(CONTROL_GROUP, {
            text: `⚠️ Fallita apertura gruppo ${targetGroup}\nErrore: ${error.message}\nRichiesto da: ${nomeUtente} (@${senderJid.split('@')[0]})`,
            mentions: [senderJid]
        });
        return m.reply('❌ Errore durante l\'apertura. Controlla i log.');
    }
};

handler.help = ["aperto [@gruppo]", "apri [123-456-789@g.us]"];
handler.tags = ["group"];
handler.command = /^(aperto|apri|open)$/i;
handler.botAdmin = true;
export default handler;