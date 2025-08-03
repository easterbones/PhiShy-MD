import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    // Gestione anti-elimina migliorata
    if (m.message?.protocolMessage?.type === 7) { // Tipo 7 = messaggio eliminato
        await handleDeletedMessage(m, conn);
    }
}

async function handleDeletedMessage(m, conn) {
    try {
        const { key, participant } = m.message.protocolMessage;
        const chatId = key.remoteJid;
        const chat = global.db.data.chats[chatId] || {};
        
        // Verifica se la funzione è attiva e se il messaggio non è del bot
        if (!chat.antielimina || m.fromMe || !participant) return;
        
        // Ignora se l'utente è mutato
        const user = global.db.data.users[participant] || {};
        if (user.muto === true) return;

        // Carica il messaggio eliminato dalla cache
        const msg = await conn.loadMessage(chatId, key.id);
        if (!msg) return;

        // Crea cartella storage se non esiste
        const storageDir = './storage/eliminati';
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }

        // Prepara i dettagli della notifica
        const mention = '@' + participant.split('@')[0];
        let content = '';
        let mediaPath = null;
        let mediaType = null;

        // Gestione diversi tipi di messaggio
        if (msg.message?.conversation) {
            content = msg.message.conversation;
        } else if (msg.message?.extendedTextMessage?.text) {
            content = msg.message.extendedTextMessage.text;
        } else if (msg.message?.imageMessage) {
            mediaType = 'image';
            content = msg.message.imageMessage.caption || '';
        } else if (msg.message?.videoMessage) {
            mediaType = 'video';
            content = msg.message.videoMessage.caption || '';
        } else if (msg.message?.audioMessage) {
            mediaType = 'audio';
        } else if (msg.message?.documentMessage) {
            mediaType = 'document';
            content = msg.message.documentMessage.caption || '';
        }

        // Se è un media, scaricalo
        if (mediaType) {
            const downloadType = `${mediaType}Message`;
            const media = await downloadContentFromMessage(msg.message[downloadType], mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of media) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            const ext = mediaType === 'image' ? 'jpg' : 
                      mediaType === 'video' ? 'mp4' : 
                      mediaType === 'audio' ? 'mp3' : 'bin';
            mediaPath = path.join(storageDir, `${Date.now()}.${ext}`);
            fs.writeFileSync(mediaPath, buffer);
        }

        // Notifica gli owner
        await notifyOwners(conn, {
            chatId,
            participant,
            content,
            mediaPath,
            mediaType,
            mention
        });

    } catch (e) {
        console.error("Errore gestione messaggio eliminato:", e);
    }
}

async function notifyOwners(conn, { chatId, participant, content, mediaPath, mediaType, mention }) {
    if (!global.owner || !Array.isArray(global.owner)) return;
    
    const owners = global.owner
        .filter(([jid]) => jid)
        .map(([jid]) => jid + '@s.whatsapp.net');
    
    const chatName = chatId.includes('@g.us') ? 
        (await conn.groupMetadata(chatId)).subject : 
        'Chat Privata';
    
    const messageText = `🗑️ *Anti-Elimina* - ${chatName}\n\n` +
                      `👤 *Utente:* ${mention}\n` +
                      (content ? `📝 *Testo:* ${content}\n` : '') +
                      `⏰ *Ora:* ${new Date().toLocaleString()}`;

    for (const ownerJid of owners) {
        try {
            if (mediaPath && fs.existsSync(mediaPath)) {
                await conn.sendMessage(ownerJid, {
                    [mediaType]: fs.readFileSync(mediaPath),
                    caption: messageText,
                    mentions: [participant]
                });
            } else {
                await conn.sendMessage(ownerJid, {
                    text: messageText,
                    mentions: [participant]
                });
            }
        } catch (e) {
            console.error(`Errore notifica owner ${ownerJid}:`, e);
        }
    }
}