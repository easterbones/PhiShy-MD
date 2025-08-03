let handler = async (m, { conn, usedPrefix, command, text }) => {
    // Inizializza il gioco se non esiste
    if (!conn.blackjack) conn.blackjack = {};
    if (!conn.blackjackCooldown) conn.blackjackCooldown = {};

    // Se l'utente scrive .blackjack, inizia una nuova partita
    if (command === 'blackjack') {
        const now = Date.now();
        const cooldown = 5 * 60 * 1000; // 5 minuti in millisecondi

        if (conn.blackjackCooldown[m.sender] && now - conn.blackjackCooldown[m.sender] < cooldown) {
            const remainingTime = Math.ceil((cooldown - (now - conn.blackjackCooldown[m.sender])) / 1000);
            return await conn.reply(m.chat, `Devi aspettare ancora ${remainingTime} secondi prima di poter iniziare una nuova partita.`, m);
        }

        conn.blackjackCooldown[m.sender] = now;

        if (conn.blackjack[m.sender]) {
            return await conn.reply(m.chat, `Stai già giocando una partita.\nScrivi *${usedPrefix}pesca* per pescare una carta o *${usedPrefix}stop* per fermarti.`, m);
        }

        let user = global.db.data.users[m.sender];
        if (!user) {
            user = global.db.data.users[m.sender] = { limit: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0 };
        }

        let bet;
        if (m.quoted && m.quoted.sender === m.sender && m.quoted.text.includes('Stesso Importo')) {
            // Ensure only the original player can use the replay button
            if (m.sender !== m.quoted.sender) {
                return await conn.reply(m.chat, `Solo l'utente che ha iniziato la partita può usare questo bottone.`, m);
            }

            // Retrieve the bet amount from the quoted message
            const match = m.quoted.text.match(/\(Stesso Importo: (\d+)\)/);
            if (match) {
                bet = parseInt(match[1]);
            }
        } else {
            bet = parseInt(text);
        }

        if (isNaN(bet) || bet < 50 || bet > user.limit) {
            return await conn.reply(m.chat, `Inserisci un importo valido per la puntata (minimo 50, massimo ${user.limit}).`, m, rcanal);
        }

        user.limit -= bet; // Deduce la somma iniziale

        let deck = generateDeck();
        let playerHand = [drawCard(deck), drawCard(deck)];
        let dealerHand = [drawCard(deck), drawCard(deck)];
        let playerSum = calculateHand(playerHand);
        let dealerSum = calculateHand(dealerHand);

        // Salva lo stato del gioco
        conn.blackjack[m.sender] = {
            deck,
            playerHand,
            dealerHand,
            playerSum,
            dealerSum,
            bet,
            gameOver: false
        };

        console.log(`Nuova partita avviata per ${m.sender}`); // Debug

        let message = `🃏 ┃ 𝐁𝐋𝐀𝐂𝐊𝐉𝐀𝐂𝐊 ┃ 🃏\n\n`;
        message += `Le tue carte 👤:\n${formatHand(playerHand)}\n(Totale: ${playerSum})\n\n`;
        message += `Le carte del banco 🤖:\n${dealerHand[0]}  *???*\n\n`;
        message += `Scrivi:\n *${usedPrefix}pesca* per pescare una carta\n *${usedPrefix}stop* per fermarti\n *${usedPrefix}abbandona* per terminare la partita.`;

        const buttons = [
            { buttonId: `${usedPrefix}pesca`, buttonText: { displayText: '🎴 Pesca' }, type: 1 },
            { buttonId: `${usedPrefix}stop`, buttonText: { displayText: '🛑 Stop' }, type: 1 },
            { buttonId: `${usedPrefix}abbandona`, buttonText: { displayText: '🚪 Abbandona' }, type: 1 }
        ];

        return await conn.sendMessage(m.chat, {
            text: message,
            buttons: buttons,
            headerType: 1
        }, { quoted: m });
    }

    // Sistema di classifica
    if (command === 'classifica') {
        let users = Object.entries(global.db.data.users)
            .map(([id, data]) => ({ id, ...data }))
            .filter(user => user.gamesWon > 0); // Filtra solo i giocatori con almeno una vittoria

        if (users.length === 0) {
            return await m.reply('🏆 Nessun giocatore ha ancora vinto una partita di Blackjack.');
        }

        users.sort((a, b) => (b.gamesWon || 0) - (a.gamesWon || 0)); // Ordina per partite vinte

        let leaderboard = '🏆 Classifica Vincitori Blackjack 🏆\n\n';
        users.slice(0, 10).forEach((user, index) => {
            leaderboard += `${index + 1}. @${user.id.split('@')[0]} - 🏅 Vittorie: ${user.gamesWon || 0}\n`;
        });

        return await m.reply(leaderboard, null, { mentions: users.slice(0, 10).map(user => user.id) });
    }

    // Statistiche del giocatore
    if (command === 'statistiche') {
        let user = global.db.data.users[m.sender];
        if (!user) {
            return await conn.reply(m.chat, `Non hai ancora giocato nessuna partita.`, m);
        }

        let stats = `📊 Statistiche di Gioco 📊\n\n`;
        stats += `💰 Soldi: ${user.limit || 0}\n`;
        stats += `🎮 Partite Giocate: ${user.gamesPlayed || 0}\n`;
        stats += `✅ Partite Vinte: ${user.gamesWon || 0}\n`;
        stats += `❌ Partite Perse: ${user.gamesLost || 0}\n`;

        return await m.reply(stats);
    }

    if (command === 'tutorial') {
        return await m.reply(`Fattelo spiegare da easter o altri esperti coglione!`);
    }

    // Se l'utente scrive .pesco
    if (command === 'pesca') {
        if (!conn.blackjack[m.sender]) {
            return await conn.reply(m.chat, `Non stai giocando. Scrivi *${usedPrefix}blackjack* per iniziare.`, m, rcanal);
        }

        let game = conn.blackjack[m.sender];
        if (game.gameOver) {
            return await conn.reply(m.chat, `La partita è già terminata. Scrivi *${usedPrefix}blackjack* per iniziare una nuova partita.`, m, rcanal);
        }

        // Pesca una carta con possibilità di duplicato
        const lastCard = game.playerHand[game.playerHand.length - 1];
        game.playerHand.push(drawCard(game.deck, lastCard));
        game.playerSum = calculateHand(game.playerHand);

        console.log(`Carta pescata da ${m.sender}: ${game.playerHand[game.playerHand.length - 1]}`); // Debug

        if (game.playerSum > 21) {
            game.gameOver = true;
            await conn.sendMessage(m.chat, {
                text: `Hai sballato! Le tue carte: ${formatHand(game.playerHand)} (Totale: ${game.playerSum})\nHai perso!`,
                buttons: [
                    { buttonId: `${usedPrefix}choosebet`, buttonText: { displayText: '💰 Scegli Importo' }, type: 1 }
                ],
                headerType: 1
            }, { quoted: m });
            delete conn.blackjack[m.sender];
            console.log(`Partita terminata per ${m.sender}: Sballato`);
            return;
        }

        const buttons = [
            { buttonId: `${usedPrefix}pesca`, buttonText: { displayText: '🎴 Pesca' }, type: 1 },
            { buttonId: `${usedPrefix}stop`, buttonText: { displayText: '🛑 Stop' }, type: 1 },
            { buttonId: `${usedPrefix}abbandona`, buttonText: { displayText: '🚪 Abbandona' }, type: 1 }
        ];

        return await conn.sendMessage(m.chat, {
            text: `Le tue carte: ${formatHand(game.playerHand)} (Totale: ${game.playerSum})\nScrivi *${usedPrefix}pesca* per pescare una carta, *${usedPrefix}stop* per fermarti, o *${usedPrefix}esci* per terminare la partita.`,
            buttons: buttons,
            headerType: 1
        }, { quoted: m });
    }

    // Se l'utente scrive .ferma
    if (command === 'stop') {
        if (!conn.blackjack[m.sender]) {
            return await conn.reply(m.chat, `Non hai una partita in corso. Scrivi *${usedPrefix}blackjack* per iniziare.`, m);
        }

        let game = conn.blackjack[m.sender];
        if (game.gameOver) {
            return await conn.reply(m.chat, `La partita è già terminata. Scrivi *${usedPrefix}blackjack* per iniziare una nuova partita.`, m);
        }

        game.gameOver = true;

        // Il banco pesco carte fino a raggiungere almeno 17
        while (game.dealerSum < 17) {
            game.dealerHand.push(drawCard(game.deck));
            game.dealerSum = calculateHand(game.dealerHand);
        }

        console.log(`Partita terminata per ${m.sender}: Dealer = ${game.dealerSum}, Giocatore = ${game.playerSum}`); // Debug

        let message = `🃏 ┃ 𝐁𝐋𝐀𝐂𝐊𝐉𝐀𝐂𝐊\n\n`;

        let user = global.db.data.users[m.sender];
        if (!user) {
            user = global.db.data.users[m.sender] = { limit: 0 };
        }
        let amount = game.bet * 2; // Premio: doppio della puntata

        message += `Le tue carte👤:\n┆${formatHand(game.playerHand)}┆\n (Totale: ${game.playerSum})\n`;
        message += `Carte del banco 🤖:\n┆${formatHand(game.dealerHand)}┆\n (Totale: ${game.dealerSum})\n\n`;

        if (game.dealerSum > 21 || game.playerSum > game.dealerSum) {
            user.limit += amount;
            user.gamesWon = (user.gamesWon || 0) + 1;
            user.gamesPlayed = (user.gamesPlayed || 0) + 1;
            console.log(`User ${m.sender} won ${amount} 🍬. New limit: ${user.limit}`);
            message += `*Hai vinto! ${amount} 🍬 dolci.🎉*`;
        } else if (game.dealerSum > 21 || game.playerSum === game.dealerSum) {
            user.gamesPlayed = (user.gamesPlayed || 0) + 1;
            message += `*Pareggio!*`;
        } else {
            user.gamesLost = (user.gamesLost || 0) + 1;
            user.gamesPlayed = (user.gamesPlayed || 0) + 1;
            message += `*Hai perso! 🤡*`;
        }
        await conn.sendMessage(m.chat, {
            text: message,
            buttons: [
                { buttonId: `${usedPrefix}choosebet`, buttonText: { displayText: '💰 Scegli Importo' }, type: 1 }
            ],
            headerType: 1
        }, { quoted: m });
        delete conn.blackjack[m.sender];
        console.log(`Partita terminata per ${m.sender}`);
    }

    // Se l'utente scrive .stopbj
    if (command === 'abbandona') {
        if (!conn.blackjack[m.sender]) {
            return await conn.reply(m.chat, `Non hai una partita in corso. Scrivi *${usedPrefix}blackjack* per iniziare.`, m);
        }

        delete conn.blackjack[m.sender];
        console.log(`Partita forzatamente terminata per ${m.sender}`);
        return await conn.sendMessage(m.chat, {
            text: `Partita terminata con successo. Scrivi *${usedPrefix}blackjack* per iniziare una nuova partita.`,
            buttons: [
                { buttonId: `${usedPrefix}choosebet`, buttonText: { displayText: '💰 Scegli Importo' }, type: 1 }
            ],
            headerType: 1 
        }, { quoted: m });
    }

    // Se l'utente scrive .split
    if (command === 'split') {
        if (!conn.blackjack[m.sender]) {
            return await conn.reply(m.chat, `Non stai giocando. Scrivi *${usedPrefix}blackjack* per iniziare.`, m, rcanal);
        }

        let game = conn.blackjack[m.sender];
        if (game.gameOver) {
            return await conn.reply(m.chat, `La partita è già terminata. Scrivi *${usedPrefix}blackjack* per iniziare una nuova partita.`, m, rcanal);
        }

        if (game.splitUsato) {
            return await conn.reply(m.chat, `Hai già usato lo split. Non puoi usarlo di nuovo.`, m, rcanal);
        }

        if (game.playerHand.length !== 2 || game.playerHand[0].slice(0, -1) !== game.playerHand[1].slice(0, -1)) {
            return await conn.reply(m.chat, `Non puoi fare lo split. Le tue carte devono avere lo stesso valore.`, m, rcanal);
        }

        let user = global.db.data.users[m.sender];
        if (!user || user.limit < 50) {
            return await conn.reply(m.chat, `⚠️ Non hai abbastanza dolci per fare lo split. Ti servono almeno 50 dolci.`, m, rcanal);
        }

        user.limit -= 50; // Deduce la somma per lo split

        // Crea due mani separate
        let firstHand = [game.playerHand[0], drawCard(game.deck)];
        let secondHand = [game.playerHand[1], drawCard(game.deck)];

        game.splitUsato = true; // Segna che lo split è stato usato
        game.hands = [
            { hand: firstHand, sum: calculateHand(firstHand), finished: false },
            { hand: secondHand, sum: calculateHand(secondHand), finished: false }
        ];
        game.currentHand = 0; // Inizia con la prima mano

        console.log(`Split usato da ${m.sender}: Prima mano ${formatHand(firstHand)}, Seconda mano ${formatHand(secondHand)}`); // Debug

        return await conn.reply(m.chat, `Hai diviso le carte! Ora stai giocando con due mani.

Mano 1: ${formatHand(firstHand)} (Totale: ${calculateHand(firstHand)})
Mano 2: ${formatHand(secondHand)} (Totale: ${calculateHand(secondHand)})

Scrivi *${usedPrefix}pesca* per pescare una carta per la mano corrente, *${usedPrefix}stop* per passare alla mano successiva, o *${usedPrefix}esci* per terminare la partita.`, m);
    }

    // Aggiungi un nuovo comando per scegliere l'importo
    if (command === 'choosebet') {
        const betButtons = [
            { buttonId: `${usedPrefix}blackjack 50`, buttonText: { displayText: '50 💰' }, type: 1 },
            { buttonId: `${usedPrefix}blackjack 100`, buttonText: { displayText: '100 💰' }, type: 1 },
            { buttonId: `${usedPrefix}blackjack 200`, buttonText: { displayText: '200 💰' }, type: 1 },
            { buttonId: `${usedPrefix}blackjack 500`, buttonText: { displayText: '500 💰' }, type: 1 }
        ];

        return await conn.sendMessage(m.chat, {
            text: `Scegli l'importo per iniziare una nuova partita:`,
            buttons: betButtons,
            headerType: 1
        }, { quoted: m });
    }
}

// Funzioni di supporto
function generateDeck() {
    let suits = ['♠', '♣', '♥', '♦'];
    let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push(`${value}${suit}`);
        }
    }
    return shuffle(deck);
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function drawCard(deck, lastCard = null) {
    if (lastCard && Math.random() < 0.15) {
        console.log("[DEBUG] Duplicate card drawn for split opportunity.");
        return lastCard; // 15% chance to draw the same card as the last one
    }
    return deck.pop();
}

function calculateHand(hand) {
    let sum = 0;
    let aces = 0;
    for (let card of hand) {
        let value = card.slice(0, -1);
        if (value === 'A') {
            sum += 11;
            aces++;
        } else if (['J', 'Q', 'K'].includes(value)) {
            sum += 10;
        } else {
            sum += parseInt(value);
        }
    }
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
}

function formatHand(hand) {
    return hand.join(' ');
}

// Comandi supportati
handler.help = ['blackjack', 'pesca', 'ferma', 'stop'];
handler.tags = ['game'];
handler.command = ['blackjack', 'pesca', 'ferma', 'stop', 'tutorial', 'classifica', 'statistiche', 'abbandona', 'split', 'choosebet'];

export default handler;