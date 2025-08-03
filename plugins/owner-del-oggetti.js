let handler = async (m, { conn, args, isOwner, isPremium, command }) => {
    // Funzione per ottenere il nome dell'oggetto (spostata all'inizio)
    const getItemName = (prop) => {
        return {
            'level': 'livelli',
            'messaggi': 'messaggi',
            'uova': 'uova',
            'exp': 'punti esperienza',
            'limit': 'dolci',
            'jointcount': 'joint',
            'baci': 'baci'
        }[prop];
    };

    // Verifica se l'utente è autorizzato (proprietario o premium)
    if (!isOwner && !isPremium) {
        return conn.reply(m.chat, 'Solo il proprietario o gli utenti premium possono usare questo comando.', m, rcanal);
    }

    // Prosegui con il comando se l'utente è autorizzato
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    if (!who) return conn.reply(m.chat, 'Devi menzionare un utente o rispondere a un messaggio!', m, rcanal);
    if (!(who in global.db.data.users)) return conn.reply(m.chat, 'L\'utente non è nel database', m, rcanal);

    let user = global.db.data.users[who];
    let amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) return conn.reply(m.chat, 'Inserisci un numero valido da rimuovere!', m, rcanal);

    // Mappa dei comandi e delle proprietà corrispondenti
    const commandMap = {
        'del-level': 'level',
        'del-messaggi': 'messaggi',
        'del-uova': 'uova',
        'del-exp': 'exp',
        'del-dolci': 'limit',
        'del-jointcount': 'jointcount',
        'del-baci': 'baci'
    };

    // Verifica che il comando sia valido
    const property = commandMap[command];
    if (!property) return conn.reply(m.chat,'Comando non riconosciuto!', m, rcanal);

    // Controlla che la quantità da rimuovere non sia maggiore di quella disponibile
    if (amount > user[property]) {
        return conn.reply(m.chat, `Non puoi rimuovere ${amount} ${getItemName(property)} perché @${who.split('@')[0]} ne ha solo ${user[property]}!`,  m, rcanal);
    }

    
    
    
    // Rimuove la quantità dalla proprietà corrispondente
    user[property] = Math.max(0, (user[property] || 0) - amount);
    
    conn.reply(m.chat,`✅ Sono stati rimossi ${amount} ${getItemName(property)} da @${who.split('@')[0]}. Nuovo totale: *${user[property]}*!`, m, phishy);
};

// Aggiungi tutti i comandi supportati
handler.command = ['del-level', 'del-messaggi', 'del-uova', 'del-exp', 'del-dolci', 'del-jointcount', 'del-baci'];
handler.tags = ['rpg'];
handler.help = [
    'del-level <quantità> [@utente]',
    'del-messaggi <quantità> [@utente]',
    'del-uova <quantità> [@utente]',
    'del-exp <quantità> [@utente]',
    'del-dolci <quantità> [@utente]',
    'del-jointcount <quantità> [@utente]',
    'del-baci <quantità> [@utente]'
].map(v => v + ' - Rimuove risorse da un utente');

export default handler;