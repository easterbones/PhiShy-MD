const MIN_PERCENT = 2;  // Percentuale minima rubata (2%)
const MAX_PERCENT = 10; // Percentuale massima rubata (10%)
const COOLDOWN_TIME = 1 * 60 * 60 * 1000; // 1 ora di cooldown
const FAILURE_CHANCE = 0.3; // 30% di possibilità di fallimento
const COMPENSATION_PERCENT = 5; // 5% del credito dell'utente come risarcimento
const EASTER_EGG_CHANCE = 0.2; // 20% (1 su 5) possibilità di trovare un uovo di Pasqua

async function handler(m, { conn, usedPrefix, command }) {
    let user = global.db.data.users[m.sender];
    
    // Verifica se l'utente ha abbastanza forcine
    if (!user.forcina || user.forcina < 1) {
        return conn.reply(m.chat, 
            "❌ Non hai abbastanza forcine per scassare una cassaforte.", 
            m, rcanal
        );
    }

    // Controllo cooldown
    if (user.lastScassa && Date.now() - user.lastScassa < COOLDOWN_TIME) {
        let remainingTime = Math.ceil((COOLDOWN_TIME - (Date.now() - user.lastScassa)) / 1000 / 60);
        return conn.reply(m.chat, 
            `❌ Devi aspettare ancora ${remainingTime} minuti prima di poter usare di nuovo questo comando.`, 
            m, rcanal
        );
    }

    // Ottieni il target (utente taggato o risposto)
    let targetUserId;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUserId = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        targetUserId = m.quoted.sender;
    } else {
        return conn.reply(m.chat, 
            `❌ Devi taggare un utente o rispondere al messaggio di un utente per scassare la sua cassaforte.\nEsempio: ${usedPrefix}scassa @utente`, 
            m, rcanal
        );
    }

    // Verifica che il target non sia l'utente che esegue il comando
    if (targetUserId === m.sender) {
        return conn.reply(m.chat, 
            "❌ Non puoi scassinare la tua stessa cassaforte!", 
            m, rcanal
        );
    }

    // Ottieni i dati del target
    let targetUser = global.db.data.users[targetUserId];
    if (!targetUser || typeof targetUser.credito !== 'number' || targetUser.credito <= 0) {
        return conn.reply(m.chat, 
            "❌ L'utente specificato non ha credito disponibile o non è valido.", 
            m, rcanal
        );
    }

    // Rimuovi una forcina dall'utente che esegue il comando
    user.forcina -= 1;

    // Controlla se l'utente trova un uovo di Pasqua (20% di possibilità)
    let easterEggFound = Math.random() < EASTER_EGG_CHANCE;
    let easterEggMessage = '';
    
    if (easterEggFound) {
        user.uova += 1; // Incrementa il contatore uova
        easterEggMessage = '\n\n🐣 *Hai trovato un uovo di Pasqua!* 🥚\nOra hai ' + user.uova + ' uova nel tuo inventario!';
    }

    // Determina se l'utente fallisce o ha successo
    if (Math.random() < FAILURE_CHANCE) {
        // Fallimento: l'utente deve risarcire la vittima
        let compensationAmount = Math.floor((user.limit * COMPENSATION_PERCENT) / 100);
        if (compensationAmount <= 0 || compensationAmount > user.limit) {
            return conn.reply(m.chat, 
                "❌ Non hai abbastanza credito per risarcire la vittima.", 
                m, rcanal
            );
        }

        // Trasferisci il credito dall'utente alla vittima
        user.limit -= compensationAmount;
        targetUser.credito += compensationAmount;

        // Imposta il cooldown
        user.lastScassa = Date.now();

        // Ottieni il nome del target
        let targetName = conn.getName(targetUserId) || "un utente";

        // Invia un messaggio di fallimento
        return conn.reply(m.chat,
            `❌ Hai fallito nel tentativo di scassinare la cassaforte di ${targetName} e hai dovuto risarcirla con ${compensationAmount} dolci. Ora hai in totale ${user.limit} dolci 🍬${easterEggMessage}`,
            m, rcanal
        );

    } else {
        // Successo: l'utente ruba il credito
        let percent = Math.floor(Math.random() * (MAX_PERCENT - MIN_PERCENT + 1)) + MIN_PERCENT;
        let amountStolen = Math.floor((targetUser.credito * percent) / 100);

        // Verifica che l'utente bersaglio abbia abbastanza credito
        if (amountStolen <= 0 || amountStolen > targetUser.credito) {
            return conn.reply(m.chat,
                `❌ L'utente specificato non ha abbastanza credito per essere rubato.${easterEggMessage}`,
                m, rcanal
            );
        }

        // Trasferisci il credito rubato dall'utente bersaglio al ladro
        targetUser.credito -= amountStolen;
        user.limit = (user.limit || 0) + amountStolen;

        // Imposta il cooldown
        user.lastScassa = Date.now();

        // Ottieni il nome del target
        let targetName = conn.getName(targetUserId) || "un utente";

        // Invia un messaggio di conferma
        return conn.reply(m.chat,
            `✅ Hai scassato la cassaforte di ${targetName} e rubato ${amountStolen} dolci dalla sua banca. Ora hai in totale ${user.limit} dolci 🍬${easterEggMessage}`,
            m,
        );
    }

    // Salva i dati nel database
    global.db.write();
}

handler.help = ["scassa"];
handler.tags = ["economy"];
handler.command = ["scassa"];
handler.group = true; // Funziona solo nei gruppi

export default handler;