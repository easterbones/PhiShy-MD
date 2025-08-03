const handler = async (m, { conn, mentionedJid, isGroup }) => {
    // Verifica se il messaggio è in un gruppo e se l'owner è stato taggato
    if (!isGroup) return;
    
    // Sostituisci con il tuo numero (formato internazionale con @s.whatsapp.net)
    const ownerNumber = '3933534409096@s.whatsapp.net'; 
    const isOwnerTagged = mentionedJid && mentionedJid.includes(ownerNumber);
    
    if (isOwnerTagged) {
        try {
            // Crea una copia esatta del messaggio originale
            const forwardedMsg = {
                key: m.key,
                message: m.message,
                participant: m.sender,
                contextInfo: {
                    ...m.contextInfo,
                    mentionedJid: mentionedJid.filter(jid => jid !== ownerNumber) // Rimuovi l'owner dalle menzioni
                },
                forward: true
            };
            
            // Inoltra il messaggio originale in privato all'owner
            await conn.relayMessage(ownerNumber, forwardedMsg.message, {
                messageId: forwardedMsg.key.id
            });
            
            // Aggiungi una piccola notifica nel gruppo
            await conn.sendMessage(m.chat, { 
                text: `✅ Ho inoltrato il tuo tag all'owner`, 
                mentions: [m.sender] 
            }, { quoted: m });
            
        } catch (error) {
            console.error('Errore nell\'inoltro:', error);
        }
    }
};

// Configurazione
handler.help = ['auto-forward'];
handler.tags = ['system'];
handler.event = 'mention';
handler.group = true;

export default handler;