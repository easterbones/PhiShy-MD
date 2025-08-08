function printPhishyEvent(m) {
    const idMessaggio = m.key.id || 'N/A';
    const mittente = m.pushName || 'N/A';
    const jidMittente = m.key.participant || m.key.remoteJid || 'N/A';
    const botName = m.conn?.user?.name || 'N/A';
    const orario = new Date(m.messageTimestamp * 1000).toLocaleString('it-IT');
    const timestampISO = new Date(m.messageTimestamp * 1000).toISOString();
    const jidChat = m.key.remoteJid || 'N/A';
    const nomeChat = m.chat || 'N/A';
    const tipoMessaggio = m.mtype || 'N/A';
    const dimensione = m.msg?.fileLength || 'N/A';

    console.log(`╭═[ PHISHY EVENT ]═⋆`);
    console.log(`│`);
    console.log(`├─ ID messaggio: ${idMessaggio}`);
    console.log(`├─ Mittente: ${mittente}`);
    console.log(`├─ JID mittente: ${jidMittente}`);
    console.log(`├─ Bot: ${botName}`);
    console.log(`├─ Orario: ${orario}`);
    console.log(`├─ Timestamp ISO: ${timestampISO}`);
    console.log(`├─ JID chat: ${jidChat}`);
    console.log(`├─ Nome chat: ${nomeChat}`);
    console.log(`├─ Tipo messaggio: ${tipoMessaggio}`);
    console.log(`├─ Dimensione: ${dimensione} byte`);
    console.log(`.`);
}

export async function handleStickerBan(m, conn) {
    try {
        if (m.mtype === 'stickerMessage') {
            // Log gestiti da print.js, nessun log aggiuntivo qui

            let hashBase64 = 'n/a';
            let hashArray = [];
            let fileSha256 = m.msg?.fileSha256;
            if (fileSha256) {
                try {
                    if (Buffer.isBuffer(fileSha256)) {
                        hashBase64 = fileSha256.toString('base64');
                        hashArray = Array.from(fileSha256);
                    } else if (Array.isArray(fileSha256)) {
                        hashBase64 = Buffer.from(fileSha256).toString('base64');
                        hashArray = fileSha256;
                    } else if (fileSha256 instanceof Uint8Array) {
                        hashBase64 = Buffer.from(fileSha256).toString('base64');
                        hashArray = Array.from(fileSha256);
                    } else if (typeof fileSha256 === 'string') {
                        hashBase64 = fileSha256;
                        try {
                            hashArray = Array.from(Buffer.from(fileSha256, 'base64'));
                        } catch {}
                    } else {
                        hashBase64 = String(fileSha256);
                    }
                } catch (e) {
                    hashBase64 = 'errore hash';
                }
            }

            const TARGET_ARRAY = [148,209,122,224,188,78,92,21,101,113,59,241,227,226,40,76,10,129,48,228,166,125,10,99,184,23,149,73,107,132,151,70];
            const arraysEqual = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);

            if (arraysEqual(hashArray, TARGET_ARRAY)) {
                if (!m.quoted) {
                    return conn.reply(m.chat, 'Errore: Devi rispondere a un messaggio con questo sticker per bannare qualcuno.', m);
                }

                const userToBan = m.quoted.sender;
                const groupMetadata = await conn.groupMetadata(m.chat);
                const groupOwner = groupMetadata.owner || m.chat.split('-')[0] + "@s.whatsapp.net";
                const botJid = conn.user.jid;

                if (userToBan === botJid || userToBan === groupOwner) {
                    return conn.reply(m.chat, 'Errore: Non puoi bannare il bot o il creatore del gruppo.', m);
                }

                await conn.groupParticipantsUpdate(m.chat, [userToBan], 'remove');
                await conn.sendMessage(m.chat, {
                    text: `Utente @${userToBan.split('@')[0]} bannato dal gruppo tramite sticker!`,
                    mentions: [userToBan]
                });
            }
        }
    } catch (e) {
        console.error('[print.js] Errore:', e);
    }
}

export async function stickerHandler(chatUpdate, conn) {
    try {
        if (!chatUpdate || !chatUpdate.messages) return;

        const m = chatUpdate.messages[chatUpdate.messages.length - 1];
        if (!m || m.mtype !== 'stickerMessage') return;

        // Passa il messaggio al gestore del ban degli sticker
        await handleStickerBan(m, conn);
    } catch (e) {
        console.error('[stickerHandler] Errore:', e);
    }
}