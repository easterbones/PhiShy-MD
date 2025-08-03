const toMention = id => '@' + id.split('@')[0];

async function handler(message, { conn, groupMetadata }) {
    // Controlla se l'utente ha abbastanza dolci
    let userInvoker = global.db.data.users[message.sender];
    if (!userInvoker || (userInvoker.limit || 0) < 500) {
        await conn.sendMessage(message.chat, {
            text: 'sei un povero, devi pagare 500 dolci per usare la roulette russa',
            mentions: [message.sender]
        }, {
            quoted: message
        });
        return;
    }
    // Scala 500 dolci
    userInvoker.limit -= 500;
    
    const costo =  userInvoker.limit
    const soldi = userInvoker.limit - costo

    // Escludi il bot e l'autore del comando dalla selezione
    const botId = conn.user.id;
    const participants = groupMetadata.participants
        .map(participant => participant.id)
        .filter(id => id !== botId && id !== message.sender);

    if (participants.length < 1) {
        return console.log('DEVONO ESSERCI ALMENO 2 PARTECIPANTI (ESCLUSO IL BOT E L\'AUTORE) PER GIOCARE.');
    }

    // Scegli un utente casuale
    const randomIndex = Math.floor(Math.random() * participants.length);
    const participantToMute = participants[randomIndex];

    const messageText = `${toMention(participantToMute)} A SCEMO FRA 30 SECONDI VERRAI BANNATO PER LA BELLEZZA DI 5 MINUTI.`;

    let displayedText = '';
    let charCount = 0;
    for (const char of messageText) {
        await new Promise(resolve => setTimeout(resolve, 20));
        displayedText += char;
        charCount++;
        if (charCount % 10 === 0) {
            await conn.sendPresenceUpdate('composing', message.chat);
        }
    }

    await conn.sendMessage(message.chat, {
        text: displayedText.trim(),
        mentions: conn.parseMention(displayedText)
    }, {
        quoted: message,
        ephemeralExpiration: 24 * 60 * 60,
        disappearingMessagesInChat: 24 * 60 * 60
    });

    await new Promise(resolve => setTimeout(resolve, 30000));

    // Mutare il partecipante nel database per 5 minuti
    let user = global.db.data.users[participantToMute];
    if (user) {
        user.muto = true;
        // Imposta un timeout per rimuovere il mute dopo 5 minuti (300000 ms)
        setTimeout(() => {
            user.muto = false;
        }, 5 * 60 * 1000);
    }

    // Invia il messaggio di conferma
    await conn.sendMessage(message.chat, {
        text: `${toMention(participantToMute)} è STATO MUTATO PUAAHAHA!`,
        mentions: conn.parseMention(toMention(participantToMute))
    }, {
        quoted: message,
        ephemeralExpiration: 24 * 60 * 60,
        disappearingMessagesInChat: 24 * 60 * 60
    });

    // Mostra i dolci rimanenti all'utente che ha usato il comando
    await conn.sendMessage(message.chat, {
        text: `ti sono rimasti ${userInvoker.limit} dolci🍬.`,
        mentions: [message.sender]
    }, {
        quoted: message
    });
}

handler.command = ['roulette', 'rulette'];
handler.admin = true;
handler.group = true;

export default handler;
