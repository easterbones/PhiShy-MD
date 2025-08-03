import { format } from 'util';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender];

    // Comando: .filtra [parola]
    if (command === 'filtra') {
        if (!user.filtro || user.filtro < 1) {
            return m.reply('❌ Devi possedere il *Filtro Parolacce* per usare questo comando!');
        }

        const word = args[0]?.toLowerCase();
        if (!word) return m.reply(`⚠️ Specifica una parola! Es: *${usedPrefix}filtra ciao*`);

        if (!global.db.data.filters) global.db.data.filters = {};

        // Aggiungi la parola al filtro (scade in 24h)
        global.db.data.filters[word] = {
            addedBy: m.sender,
            expiresAt: Date.now() + 86400000 // 24 ore
        };

        m.reply(`✅ La parola *"${word}"* è stata bloccata per 24 ore!`);
        return;
    }

    // Comando: .listafiltri
    if (command === 'listafiltri') {
        if (!global.db.data.filters || Object.keys(global.db.data.filters).length === 0) {
            return m.reply('ℹ️ Nessuna parola è attualmente filtrata.');
        }

        let list = '📜 *Lista Parole Bloccate*:\n\n';
        for (const [word, data] of Object.entries(global.db.data.filters)) {
            const remainingTime = Math.ceil((data.expiresAt - Date.now()) / 3600000); // Ore rimanenti
            list += `▸ *${word}* (scade tra ${remainingTime} ore)\n`;
        }

        m.reply(list);
        return;
    }

    // Comando: .rimuovifiltro [parola]
    if (command === 'rimuovifiltro') {
        if (!user.filtro || user.filtro < 1) {
            return m.reply('❌ Solo chi possiede il *Filtro Parolacce* può rimuovere parole!');
        }

        const word = args[0]?.toLowerCase();
        if (!word) return m.reply(`⚠️ Specifica una parola! Es: *${usedPrefix}rimuovifiltro ciao*`);

        if (global.db.data.filters[word]) {
            delete global.db.data.filters[word];
            m.reply(`✅ La parola *"${word}"* è stata rimossa dalla lista nera!`);
        } else {
            m.reply('❌ Parola non trovata nella lista filtrata.');
        }
        return;
    }
};

// Intercetta tutti i messaggi per cancellare quelli con parole vietate
handler.before = async (m) => {
    if (!global.db.data.filters || !m.text || !m.isGroup) return;

    const text = m.text.toLowerCase();
    const bannedWord = Object.keys(global.db.data.filters).find(word => 
        text.includes(word.toLowerCase())
    );

    if (bannedWord) {
        // Cancella il messaggio senza preavviso
        await m.delete().catch(e => console.error('Errore nella cancellazione:', e));
        
        // Log (opzionale)
        console.log(`🚫 Messaggio cancellato da @${m.sender.split('@')[0]} - Parola vietata: "${bannedWord}"`);
    }

    // Pulizia parole scadute (ogni 100 messaggi per efficienza)
    if (Math.random() < 0.01) {
        for (const [word, data] of Object.entries(global.db.data.filters)) {
            if (data.expiresAt < Date.now()) {
                delete global.db.data.filters[word];
            }
        }
    }
};

handler.command = ['filtra', 'listafiltri', 'rimuovifiltro'];
handler.tags = ['group'];
handler.help = [
    'filtra <parola> - Aggiungi una parola alla lista nera (richiede Filtro Parolacce)',
    'listafiltri - Mostra tutte le parole bloccate',
    'rimuovifiltro <parola> - Rimuovi una parola dalla lista nera'
];

export default handler;