import fetch from 'node-fetch';

let handler = async (m) => {
    const from = m.sender;
    const chatId = m.chat;
    const activeGames = global.activeGames || (global.activeGames = {});

    // Reset game if command is sent again
    if (m.text?.trim().toLowerCase() === '.inglese') {
        if (activeGames[from]) {
            delete activeGames[from];
        }
    }

    if (!activeGames[from]) {
        const italianWord = 'lussemburgo'; // Test word - replace with API call
        // const italianWord = await getRandomItalianWord();
        if (!italianWord) {
            return m.reply('Errore nel recupero della parola. Riprova più tardi.');
        }
        
        const englishWord = 'luxembourg'; // Test translation - replace with API call
        // const englishWord = await translateToEnglish(italianWord);
        if (!englishWord) {
            return m.reply('Errore nella traduzione della parola. Riprova più tardi.');
        }
        
        activeGames[from] = {
            italian: italianWord.toLowerCase(),
            english: englishWord.trim().toLowerCase(),
            attempts: 3,
            chatId: chatId
        };
        return m.reply(`Traduci questa parola in inglese: *${italianWord}*\nHai 3 tentativi!`);
    }

    // Ignore messages from other chats
    if (activeGames[from] && activeGames[from].chatId !== chatId) {
        return;
    }

    const game = activeGames[from];
    if (game.attempts <= 0) {
        delete activeGames[from];
        return m.reply(`❌ Hai esaurito i tentativi! La risposta corretta era: *${game.english}*.\nScrivi di nuovo il comando per iniziare una nuova partita.`);
    }

    const userResponse = m.text?.trim().toLowerCase();
    
    // Ignore empty responses or commands
    if (!userResponse || userResponse.startsWith('.')) {
        return;
    }

    if (userResponse === game.english) {
        delete activeGames[from];
        const user = global.db.data.users[from];
        user.money = (user.money || 0) + 10;
        return m.reply(`🎉 Complimenti! La traduzione di *${game.italian}* è *${game.english}*. Hai guadagnato 10 dolci! 🍬`);
    } else {
        game.attempts -= 1;
        if (game.attempts > 0) {
            return m.reply(`❌ Risposta sbagliata! Hai ancora ${game.attempts} ${game.attempts === 1 ? 'tentativo' : 'tentativi'}.`);
        } else {
            const solution = game.english;
            delete activeGames[from];
            return m.reply(`❌ Hai esaurito i tentativi! La risposta corretta era: *${solution}*.\nScrivi di nuovo il comando per iniziare una nuova partita.`);
        }
    }
};

async function getRandomItalianWord() {
    try {
        const response = await fetch('https://random-words-api.kushcreates.com/api?language=it&words=1');
        const data = await response.json();
        return data[0]?.word?.toLowerCase();
    } catch (error) {
        console.error('Errore nel recupero della parola:', error);
        return null;
    }
}

async function translateToEnglish(word) {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=it|en`);
        const data = await response.json();
        return data.responseData?.translatedText?.toLowerCase();
    } catch (error) {
        console.error('Errore nella traduzione:', error);
        return null;
    }
}

handler.help = ['inglese'];
handler.tags = ['games'];
handler.command = /^(inglese)$/i;

export default handler;