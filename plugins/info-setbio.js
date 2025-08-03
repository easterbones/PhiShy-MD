let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    // Massima lunghezza della bio
    const MAX_BIO_LENGTH = 40;
    
    // Verifica se è stato fornito del testo
    if (!text) {
        return m.reply(`❌ Inserisci una bio!\nEsempio: ${usedPrefix + command} Sono un utente felice`);
    }
    
    // Controlla la lunghezza
    if (text.length > MAX_BIO_LENGTH) {
        return m.reply(`❌ La bio è troppo lunga! Massimo ${MAX_BIO_LENGTH} caratteri.\nHai scritto ${text.length} caratteri.`);
    }
    
    // Inizializza il database utente se non esiste
    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {};
    
    try {
        // Salva la bio nel database
        global.db.data.users[m.sender].descrizione = text;
        
        // Conferma all'utente
        await m.reply(`✅ Bio aggiornata con successo!\n\n"${text}"`);
        
        // Log dell'operazione
        console.log(`[BIO] ${m.sender} ha impostato la bio: "${text}"`);
        
    } catch (error) {
        console.error('[BIO ERROR]', error);
        m.reply('❌ Si è verificato un errore nel salvataggio della bio');
    }
};

handler.help = ['setbio <testo>'];
handler.tags = ['profile'];
handler.command = /^setbio$/i;
handler.fail = null;

export default handler;