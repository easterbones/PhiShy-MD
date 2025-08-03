// CONFIGURAZIONE
const TAX_RATE = 0.15; // 15% tassa (ridotta)
const COOLDOWN = 1800000; // 30 minuti (ridotto)
const MAX_DECREASE = 0.08; // -8% max per transazione
const BASE_DECREASE = 0.02; // -2% ogni 100 azioni
const MIN_PRICE = 5; // Prezzo minimo
const MAX_PRICE = 50000; // Prezzo massimo

// DATI DEL MERCATO - Semplificati
let stockMarket = {
    'LoryCoin': { 
        price: 100, 
        volatility: 15, 
        initialPrice: 100, 
        demand: 0, 
        history: [100, 98, 102, 105, 99], 
        aliases: ['lory', 'lorycoin'] 
    },
    'WhatsApp': { 
        price: 300, 
        volatility: 25, 
        initialPrice: 300, 
        demand: 0, 
        history: [300, 295, 310, 320, 305], 
        aliases: ['whatsapp', 'wa'] 
    },
    'UmpaLumpa': { 
        price: 124, 
        volatility: 20, 
        initialPrice: 124, 
        demand: 0, 
        history: [124, 130, 120, 125, 122], 
        aliases: ['umpalumpa', 'umpa'] 
    },
    'NFTNapoli': { 
        price: 395, 
        volatility: 35, 
        initialPrice: 395, 
        demand: 0, 
        history: [395, 400, 385, 420, 410], 
        aliases: ['nftnapoli', 'napoli', 'nft'] 
    },
    'OnlyFeet': { 
        price: 669, 
        volatility: 18, 
        initialPrice: 669, 
        demand: 0, 
        history: [669, 675, 660, 680, 672], 
        aliases: ['onlyfeet', 'feet', 'of'] 
    }
};

let marketSentiment = 0;
let lastManipulation = {};

// Funzione per trovare azione
function getStockName(input) {
    if (!input) return null;
    input = input.toLowerCase().trim();
    
    // Cerca nome esatto
    for (const key in stockMarket) {
        if (key.toLowerCase() === input) return key;
        
        // Cerca negli alias
        if (stockMarket[key].aliases && stockMarket[key].aliases.includes(input)) {
            return key;
        }
    }
    
    // Cerca corrispondenze parziali
    for (const key in stockMarket) {
        if (key.toLowerCase().includes(input)) return key;
        
        if (stockMarket[key].aliases) {
            const found = stockMarket[key].aliases.find(alias => 
                alias.toLowerCase().includes(input)
            );
            if (found) return key;
        }
    }
    
    return null;
}

// Aggiorna prezzi mercato
function updateMarketPrices() {
    try {
        marketSentiment += (Math.random() * 2 - 1);
        marketSentiment = Math.max(-5, Math.min(5, marketSentiment));
        
        for (let stock in stockMarket) {
            let s = stockMarket[stock];
            
            // Calcola variazione prezzo
            let baseChange = (Math.random() * 2 - 1) * (s.volatility / 100);
            let demandImpact = s.demand > 50 ? -0.02 : 0;
            let sentimentImpact = marketSentiment * 0.01;
            
            let totalChange = baseChange + demandImpact + sentimentImpact;
            let newPrice = Math.round(s.price * (1 + totalChange));
            
            // Applica limiti
            newPrice = Math.max(MIN_PRICE, Math.min(MAX_PRICE, newPrice));
            
            s.price = newPrice;
            s.demand = Math.max(0, s.demand * 0.95); // Riduce domanda gradualmente
            
            // Aggiorna storia (mantieni solo ultimi 5 valori)
            s.history.push(s.price);
            if (s.history.length > 5) s.history.shift();
        }
    } catch (error) {
        console.error('Errore aggiornamento mercato:', error);
    }
}

// HANDLER PRINCIPALE
let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let user = global.db.data.users[m.sender];
        
        // Inizializza dati utente se mancanti
        if (typeof user.limit !== 'number') user.limit = 0;
        if (!user.stocks) user.stocks = {};
        
        let action = args[0]?.toLowerCase();
        let stock = args[1] ? getStockName(args[1]) : null;
        let amount = parseInt(args[2]) || 0;

        // COMANDO BORSA
        if (action === 'borsa' || action === 'lista') {
            updateMarketPrices();
            
            let marketStatus = `*📊 MERCATO AZIONARIO*\n\n`;
            marketStatus += `🎭 Sentimento: ${marketSentiment >= 0 ? '📈 Positivo' : '📉 Negativo'}\n\n`;
            
            for (let stock in stockMarket) {
                let s = stockMarket[stock];
                let trend = s.history.length >= 2 ? 
                    (s.price > s.history[s.history.length - 2] ? '📈' : '📉') : '➖';
                
                marketStatus += `🔹 *${stock}*\n`;
                marketStatus += `💰 Prezzo: ${s.price} punti ${trend}\n`;
                marketStatus += `📊 Domanda: ${s.demand}\n\n`;
            }
            
            marketStatus += `ℹ️ Usa *${usedPrefix}mercato compra [azione] [quantità]*`;
            
            return conn.reply(m.chat, marketStatus, m);
        }

        // COMANDO COMPRA
        if (action === 'compra' || action === 'buy') {
            if (!stock) {
                return conn.reply(m.chat, 
                    `❌ Specifica un'azione!\n\nAzioni disponibili:\n` +
                    Object.keys(stockMarket).map(s => `• ${s}`).join('\n'), 
                m);
            }
            
            if (amount <= 0 || amount > 1000) {
                return conn.reply(m.chat, `❌ Quantità non valida! (1-1000)`, m);
            }

            let s = stockMarket[stock];
            let totalCost = s.price * amount;
            
            if (user.limit < totalCost) {
                return conn.reply(m.chat, 
                    `❌ Fondi insufficienti!\n` +
                    `💵 Costo: ${totalCost} punti\n` +
                    `💰 Tuo saldo: ${user.limit} punti`, 
                m);
            }
            
            // Applica impatto sul prezzo
            if (amount > 20) {
                let decrease = Math.min(
                    Math.floor(s.price * MAX_DECREASE),
                    Math.floor(amount * BASE_DECREASE)
                );
                s.price = Math.max(MIN_PRICE, s.price - decrease);
            }
            
            s.demand += amount;
            
            // Registra manipolazione per grandi acquisti
            if (amount > 50) {
                lastManipulation[stock] = {
                    user: m.sender,
                    time: Date.now(),
                    amount: amount
                };
            }
            
            // Esegui acquisto
            if (!user.stocks[stock]) user.stocks[stock] = 0;
            user.stocks[stock] += amount;
            user.limit -= totalCost;
            
            return conn.reply(m.chat, 
                `✅ *Acquisto completato!*\n` +
                `📊 ${stock}: ${amount} azioni\n` +
                `💰 Costo totale: ${totalCost} punti\n` +
                `💵 Saldo rimanente: ${user.limit} punti`, 
            m);
        }

        // COMANDO VENDI
        if (action === 'vendi' || action === 'sell') {
            if (!stock) {
                return conn.reply(m.chat, `❌ Specifica quale azione vendere!`, m);
            }
            
            if (amount <= 0) {
                return conn.reply(m.chat, `❌ Quantità non valida!`, m);
            }
            
            if (!user.stocks[stock] || user.stocks[stock] < amount) {
                return conn.reply(m.chat, 
                    `❌ Non possiedi abbastanza azioni!\n` +
                    `📊 Possiedi: ${user.stocks[stock] || 0} ${stock}`, 
                m);
            }

            let s = stockMarket[stock];
            let baseEarnings = s.price * amount;
            let tax = 0;
            
            // Applica tassa anti-manipolazione
            if (lastManipulation[stock]?.user === m.sender && 
                Date.now() - lastManipulation[stock].time < COOLDOWN) {
                tax = Math.floor(baseEarnings * TAX_RATE);
            }
            
            let finalEarnings = baseEarnings - tax;
            
            // Impatto vendita sul prezzo
            if (amount > 30) {
                let decrease = Math.floor(amount * 0.01 * s.price / 100);
                s.price = Math.max(MIN_PRICE, s.price - decrease);
            }
            
            // Esegui vendita
            user.stocks[stock] -= amount;
            if (user.stocks[stock] <= 0) delete user.stocks[stock];
            user.limit += finalEarnings;
            
            let msg = `✅ *Vendita completata!*\n` +
                     `📉 ${stock}: ${amount} azioni vendute\n` +
                     `💰 Guadagno: ${baseEarnings} punti\n`;
            
            if (tax > 0) {
                msg += `⚠️ Tassa anti-manipolazione: -${tax} punti\n`;
            }
            
            msg += `💵 Saldo totale: ${user.limit} punti`;
            
            return conn.reply(m.chat, msg, m);
        }

        // COMANDO PORTAFOGLIO
        if (action === 'portafoglio' || action === 'wallet') {
            if (!user.stocks || Object.keys(user.stocks).length === 0) {
                return conn.reply(m.chat, `❌ Non possiedi azioni!`, m);
            }
            
            let portfolio = `*💼 IL TUO PORTAFOGLIO*\n\n`;
            let totalValue = 0;
            
            for (let stock in user.stocks) {
                if (user.stocks[stock] > 0 && stockMarket[stock]) {
                    let currentValue = stockMarket[stock].price * user.stocks[stock];
                    totalValue += currentValue;
                    
                    portfolio += `🔹 *${stock}*\n`;
                    portfolio += `📊 Quantità: ${user.stocks[stock]}\n`;
                    portfolio += `💰 Valore attuale: ${currentValue} punti\n\n`;
                }
            }
            
            portfolio += `💵 Valore totale portafoglio: ${totalValue} punti\n`;
            portfolio += `💰 Punti liquidi: ${user.limit} punti`;
            
            return conn.reply(m.chat, portfolio, m);
        }

        // HELP MENU (default)
        conn.reply(m.chat,
            `*📈 MERCATO AZIONARIO 📉*\n\n` +
            `🔹 ${usedPrefix}mercato borsa - Vedi prezzi\n` +
            `🔹 ${usedPrefix}mercato compra [azione] [quantità]\n` +
            `🔹 ${usedPrefix}mercato vendi [azione] [quantità]\n` +
            `🔹 ${usedPrefix}mercato portafoglio - Tue azioni\n\n` +
            `⚠️ *Regole:*\n` +
            `• Acquisti grandi riducono il prezzo\n` +
            `• Vendite rapide pagano tassa del 15%\n` +
            `• Prezzi si aggiornano automaticamente`,
        m);

    } catch (error) {
        console.error('Errore handler mercato:', error);
        conn.reply(m.chat, `❌ Errore del sistema! Riprova più tardi.`, m);
    }
};

handler.help = ['mercato'];
handler.tags = ['economy'];
handler.command = ['mercato', 'stock', 'azioni'];

export default handler;

// Avvia aggiornamenti automatici (ogni 5 minuti)
setInterval(updateMarketPrices, 300000);
setTimeout(updateMarketPrices, 3000); // Primo avvio