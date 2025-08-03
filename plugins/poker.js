let handler = async (m, { conn, usedPrefix, command, text, participants }) => {
  // Mappa per memorizzare le partite
  const pokerGames = new Map();
  
  // Colori e simboli per i giocatori
  const playerColors = ['🟥', '🟦', '🟩', '🟨', '🟪', '🟧'];
  const playerSymbols = ['♠', '♥', '♦', '♣', '⚡', '🎯'];

  // Cleanup automatico delle partite inattive
  setInterval(() => {
    const now = Date.now();
    for (const [chatId, game] of pokerGames.entries()) {
      if (game.lastActivity && now - game.lastActivity > 3600000) {
        pokerGames.delete(chatId);
      }
    }
  }, 60000);

  try {
    const chatId = m.chat;
    const sender = m.sender;
    
    // Inizializza la stanza se non esiste
    if (!pokerGames.has(chatId)) {
      pokerGames.set(chatId, {
        gameState: null,
        players: new Map(),
        playerOrder: [],
        deck: [],
        communityCards: [],
        pot: 0,
        currentBet: 0,
        smallBlind: 10,
        bigBlind: 20,
        dealerPos: 0,
        currentPlayer: 0,
        lastActivity: Date.now(),
        lastMessage: null
      });
    }
    
    const room = pokerGames.get(chatId);
    room.lastActivity = Date.now();

    // Funzione per inviare messaggi con delay e pulizia
    const sendMessage = async (text, delay = 1000) => {
      if (room.lastMessage) {
        await conn.sendMessage(m.chat, { delete: room.lastMessage });
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      const newMsg = await conn.sendMessage(m.chat, { text: text });
      room.lastMessage = newMsg.key.id;
      return newMsg;
    };

    // Mescola il mazzo (Fisher-Yates shuffle)
    const shuffleDeck = (deck) => {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    };

    // Genera un mazzo di carte
    const generateDeck = () => {
      const suits = ['h', 'd', 'c', 's'];
      const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
      let deck = [];
      for (let suit of suits) {
        for (let value of values) {
          deck.push(`${value}${suit}`);
        }
      }
      return shuffleDeck(deck);
    };

    // Valutatore di mani poker
    const evaluateHand = (hand, community) => {
      // Implementazione semplificata (come prima)
      // ... (omesso per brevità)
    };

    // Avanza il gioco alla fase successiva
    const advanceGame = async () => {
      if (room.gameState === 'preflop' && room.communityCards.length === 0) {
        room.gameState = 'flop';
        // Distribuisci il flop
        for (let i = 0; i < 3; i++) {
          room.communityCards.push(room.deck.pop());
        }
        await sendMessage(`🎴 *FLOP*: ${room.communityCards.slice(0, 3).join(' ')}`);
      } 
      else if (room.gameState === 'flop') {
        room.gameState = 'turn';
        room.communityCards.push(room.deck.pop());
        await sendMessage(`🃏 *TURN*: ${room.communityCards[3]}`);
      } 
      else if (room.gameState === 'turn') {
        room.gameState = 'river';
        room.communityCards.push(room.deck.pop());
        await sendMessage(`🌊 *RIVER*: ${room.communityCards[4]}`);
      } 
      else if (room.gameState === 'river') {
        await endGame();
        return;
      }
      
      // Resetta le scommesse per la nuova fase
      room.currentBet = 0;
      room.players.forEach(player => player.bet = 0);
      
      // Trova il primo giocatore non foldato
      let nextPlayer = (room.currentPlayer + 1) % room.playerOrder.length;
      while (room.players.get(room.playerOrder[nextPlayer]).folded && nextPlayer !== room.currentPlayer) {
        nextPlayer = (nextPlayer + 1) % room.playerOrder.length;
      }
      
      room.currentPlayer = nextPlayer;
      await showGameStatus();
    };

    // Termina la partita e mostra i risultati
    const endGame = async () => {
      const activePlayers = room.playerOrder.filter(p => !room.players.get(p).folded);
      
      if (activePlayers.length === 1) {
        // Un solo giocatore rimasto
        const winner = activePlayers[0];
        const winnerData = room.players.get(winner);
        winnerData.chips += room.pot;
        
        await sendMessage(`🏆 ${getPlayerName(winner)} vince il piatto di ${room.pot} fiches!`);
      } else {
        // Valuta le mani
        const results = activePlayers.map(p => {
          const playerData = room.players.get(p);
          return {
            player: p,
            hand: playerData.hand,
            rank: evaluateHand(playerData.hand, room.communityCards)
          };
        });
        
        // Determina il vincitore
        const winner = determineWinner(results);
        const winnerData = room.players.get(winner.player);
        winnerData.chips += room.pot;
        
        await sendMessage(`🏆 ${getPlayerName(winner.player)} vince ${room.pot} fiches con ${winner.rank}!`);
      }
      
      // Termina la partita
      pokerGames.delete(chatId);
    };

    // Mostra lo stato del gioco
    const showGameStatus = async () => {
      let statusText = `📊 *Poker Table* (${room.gameState.toUpperCase()})\n`;
      statusText += `Pot: ${room.pot} | Current Bet: ${room.currentBet}\n`;
      statusText += `Community: ${room.communityCards.join(' ') || 'None'}\n\n`;
      
      room.playerOrder.forEach((player, idx) => {
        const playerData = room.players.get(player);
        const isCurrent = idx === room.currentPlayer;
        const turnIndicator = isCurrent ? '🔄' : playerData.folded ? '✖' : '✔';
        
        statusText += `${turnIndicator} ${getPlayerName(player)}: ${playerData.chips} fiches`;
        if (isCurrent) statusText += ` (Your turn)`;
        statusText += `\n`;
      });
      
      await sendMessage(statusText);
    };

    // Ottieni nome giocatore con colore
    const getPlayerName = (playerId) => {
      const idx = room.playerOrder.indexOf(playerId);
      if (idx === -1) return playerId.split('@')[0];
      return `${playerColors[idx % playerColors.length]} Player ${idx+1} ${playerSymbols[idx % playerSymbols.length]}`;
    };

    // Menu comandi
    if (command === 'poker') {
      const helpText = `🎴 *POKER COMMANDS* 🎴\n\n.start - New game\n.join - Join game\n.begin - Start game\n.fold - Fold hand\n.call - Match bet\n.raise [amount] - Raise bet\n.end - End game`;
      return await sendMessage(helpText);
    }

    // Comando start
    if (command === 'start') {
      if (room.gameState) {
        return await sendMessage(`⚠ Game already in progress! Use .join to participate.`);
      }

      pokerGames.set(chatId, {
        gameState: 'waiting',
        players: new Map(),
        playerOrder: [],
        deck: [],
        communityCards: [],
        pot: 0,
        currentBet: 0,
        smallBlind: 10,
        bigBlind: 20,
        dealerPos: 0,
        currentPlayer: 0,
        lastActivity: Date.now(),
        lastMessage: null
      });

      return await sendMessage(`🚀 New poker game created! Blinds: 10/20\nType .join to participate`);
    }

    // Comando join
    if (command === 'join') {
      if (!room.gameState) {
        return await sendMessage(`⚠ No game in progress. Use .start to create one.`);
      }

      if (room.players.has(sender)) {
        return await sendMessage(`⚠ You're already in the game!`);
      }

      if (room.playerOrder.length >= 6) {
        return await sendMessage(`⚠ Game is full (max 6 players)!`);
      }

      room.players.set(sender, {
        chips: 1000,
        bet: 0,
        folded: false,
        hand: []
      });
      room.playerOrder.push(sender);

      return await sendMessage(`🎉 ${getPlayerName(sender)} joined with 1000 chips!`);
    }

    // Comando begin
    if (command === 'begin') {
      if (room.players.size < 2) {
        return await sendMessage(`⚠ Need at least 2 players to start!`);
      }

      room.gameState = 'preflop';
      room.deck = generateDeck();
      room.communityCards = [];
      room.pot = 0;
      room.currentBet = room.bigBlind;
      
      // Distribuisci carte
      for (let [player, data] of room.players) {
        data.hand = [room.deck.pop(), room.deck.pop()];
        await conn.sendMessage(player, { 
          text: `🃏 Your cards: ${data.hand.join(' ')}` 
        });
      }

      // Imposta i blinds
      const smallBlindPlayer = room.playerOrder[room.dealerPos % room.playerOrder.length];
      const bigBlindPlayer = room.playerOrder[(room.dealerPos + 1) % room.playerOrder.length];
      
      room.players.get(smallBlindPlayer).chips -= room.smallBlind;
      room.players.get(smallBlindPlayer).bet = room.smallBlind;
      
      room.players.get(bigBlindPlayer).chips -= room.bigBlind;
      room.players.get(bigBlindPlayer).bet = room.bigBlind;
      
      room.pot = room.smallBlind + room.bigBlind;
      room.currentPlayer = (room.dealerPos + 2) % room.playerOrder.length;

      await sendMessage(`🃏 Game started! ${getPlayerName(smallBlindPlayer)} posts small blind (${room.smallBlind}), ${getPlayerName(bigBlindPlayer)} posts big blind (${room.bigBlind})`);
      await showGameStatus();
    }

    // Comando fold
    if (command === 'fold') {
      if (room.gameState === 'waiting') {
        return await sendMessage(`⚠ Game hasn't started yet!`);
      }

      if (sender !== room.playerOrder[room.currentPlayer]) {
        return await sendMessage(`⚠ It's not your turn!`);
      }

      room.players.get(sender).folded = true;
      await sendMessage(`✖ ${getPlayerName(sender)} folds!`);

      // Verifica se rimane un solo giocatore
      const activePlayers = room.playerOrder.filter(p => !room.players.get(p).folded);
      if (activePlayers.length === 1) {
        await endGame();
        return;
      }

      // Passa al prossimo giocatore
      await advanceGame();
    }

    // Comando call
    if (command === 'call') {
      if (room.gameState === 'waiting') {
        return await sendMessage(`⚠ Game hasn't started yet!`);
      }

      if (sender !== room.playerOrder[room.currentPlayer]) {
        return await sendMessage(`⚠ It's not your turn!`);
      }

      const playerData = room.players.get(sender);
      const callAmount = room.currentBet - playerData.bet;
      
      if (callAmount > playerData.chips) {
        return await sendMessage(`⚠ You don't have enough chips!`);
      }

      playerData.chips -= callAmount;
      playerData.bet = room.currentBet;
      room.pot += callAmount;

      await sendMessage(`✔ ${getPlayerName(sender)} calls (${callAmount})`);

      // Passa alla fase successiva se tutti hanno chiamato
      await advanceGame();
    }

    // Comando raise
    if (command === 'raise') {
      if (room.gameState === 'waiting') {
        return await sendMessage(`⚠ Game hasn't started yet!`);
      }

      if (sender !== room.playerOrder[room.currentPlayer]) {
        return await sendMessage(`⚠ It's not your turn!`);
      }

      const raiseAmount = parseInt(text);
      if (isNaN(raiseAmount) || raiseAmount <= 0) {
        return await sendMessage(`⚠ Please specify a valid raise amount!`);
      }

      const playerData = room.players.get(sender);
      const totalBet = playerData.bet + raiseAmount;
      
      if (totalBet > playerData.chips) {
        return await sendMessage(`⚠ You don't have enough chips!`);
      }

      playerData.chips -= raiseAmount;
      playerData.bet = totalBet;
      room.currentBet = totalBet;
      room.pot += raiseAmount;

      await sendMessage(`⬆ ${getPlayerName(sender)} raises to ${totalBet}!`);

      // Passa al prossimo giocatore
      await advanceGame();
    }

    // Comando end
    if (command === 'end') {
      if (!room.gameState) {
        return await sendMessage(`⚠ No game in progress!`);
      }

      pokerGames.delete(chatId);
      return await sendMessage(`🛑 Game ended by ${getPlayerName(sender)}!`);
    }

  } catch (error) {
    console.error('Poker Error:', error);
    return await conn.sendMessage(m.chat, { 
      text: `❌ Error: ${error.message}`
    });
  }
};

handler.help = ['poker', 'start', 'join', 'begin', 'fold', 'call', 'raise', 'end'];
handler.tags = ['game'];
handler.command = ['poker', 'start', 'join', 'begin', 'fold', 'call', 'raise', 'end'];

export default handler;