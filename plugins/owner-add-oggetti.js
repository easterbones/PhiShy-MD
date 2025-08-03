let handler = async (m, { conn, args, isOwner, isPremium, command }) => {
    // Verifica se l'utente è autorizzato (proprietario o premium)
    if (!isOwner && !isPremium) {
        return m.reply('Solo il proprietario o gli utenti premium possono usare questo comando.');
    }

    // Prosegui con il comando se l'utente è autorizzato
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    if (!who) return m.reply('Devi menzionare un utente o rispondere a un messaggio!');
    if (!(who in global.db.data.users)) return m.reply('L\'utente non è nel database del gioco.');

    let user = global.db.data.users[who];
    let amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) return m.reply('Inserisci un numero valido da aggiungere!');

    // Mappa dei comandi e delle proprietà corrispondenti
    const commandMap = {
        'add-level': 'level',
        'add-messaggi': 'messaggi',
        'add-uova': 'uova',
        'add-exp': 'exp',
        'add-dolci': 'limit',
        'add-jointcount': 'jointcount',
        'add-baci': 'baci'
    };

    // Verifica che il comando sia valido
    const property = commandMap[command];
    if (!property) return m.reply('Comando non riconosciuto!');

    // Aggiunge la quantità alla proprietà corrispondente
    user[property] = (user[property] || 0) + amount;
    
    // Messaggio di conferma personalizzato
    let itemName = {
        'level': 'livello/i',
        'messaggi': 'messaggio/i',
        'uova': 'uova',
        'exp': 'punti esperienza',
        'limit': 'dolci',
        'jointcount': 'joint',
        'baci': 'baci'
    }[property];

    m.reply(`✅ Sono stati aggiunti ${amount} ${itemName} a @${who.split('@')[0]}. Nuovo totale: *${user[property]}*!`, null, { mentions: [who] });
};

// Aggiungi tutti i comandi supportati
handler.command = ['add-level', 'add-messaggi', 'add-uova', 'add-exp', 'add-dolci', 'add-jointcount', 'add-baci'];
handler.tags = ['rpg'];
handler.help = [
    'add-level <quantità> [@utente]',
    'add-messaggi <quantità> [@utente]',
    'add-uova <quantità> [@utente]',
    'add-exp <quantità> [@utente]',
    'add-dolci <quantità> [@utente]',
    'add-jointcount <quantità> [@utente]',
    'add-baci <quantità> [@utente]'
].map(v => v + ' - Aggiunge risorse a un utente');

export default handler;