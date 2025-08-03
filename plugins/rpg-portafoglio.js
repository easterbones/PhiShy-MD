import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
  // Determina l'utente di cui mostrare il portafoglio
  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.fromMe 
      ? conn.user.jid 
      : m.sender
  let user = global.db.data.users[who]

  // Debug: Stampa l'oggetto user per verificarne il contenuto
  console.log("Utente:", user);

  // Inizializza `stocks` se non esiste
  if (!user.stocks) {
    user.stocks = {};
  }

  // Debug: Stampa l'oggetto stocks per verificarne il contenuto
  console.log("Azioni possedute:", user.stocks);

  // Se l'utente non ha azioni
  if (Object.keys(user.stocks).length === 0) {
    return conn.reply(m.chat, `*${user.name || 'Questo utente'} non possiede alcuna azione.*`, m);
  }

  // Percorso e caricamento thumbnail
  const basePath = './src/img/economy/';
  const portfolioImageBuffer = fs.readFileSync(path.join(basePath, 'tax.png'));

  // Costruisci il messaggio
  let txt = `╭─⬣「 *Portafoglio Azioni di ${user.name || 'Questo utente'}* 」⬣\n`
  let totalValue = 0; // Valore totale del portafoglio
  let orphanStocks = [];
  for (let stock in user.stocks) {
    if (!global.stockMarket || !global.stockMarket[stock]) {
      console.warn(`Attenzione: l'azione '${stock}' non esiste in global.stockMarket.`);
      orphanStocks.push(stock);
      continue; // Salta questa azione
    }
    let quantity = user.stocks[stock];
    let currentPrice = global.stockMarket[stock].price;
    let stockValue = quantity * currentPrice;
    totalValue += stockValue;

    txt += `│  ≡◦ *💰 ${stock}*\n`
    txt += `│  - Quantità: ${quantity}\n`
    txt += `│  - Prezzo attuale: ${currentPrice} dolci\n`
    txt += `│  - Valore totale: ${stockValue} dolci\n`
  }

  if (orphanStocks.length > 0) {
    txt += `│\n│  ⚠️ Azioni non più disponibili: ${orphanStocks.join(", ")}\n`;
  }

  txt += `│\n`
  txt += `│  ≡◦ *💼 Valore totale del portafoglio:* ${totalValue} dolci\n`
  txt += `╰─⬣`

  // Invia il messaggio con thumbnail in stile gp-muta.js
  await conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: {
      externalAdReply: {
        title: `Portafoglio di ${user.name || 'utente'}`,
        body: 'Valore attuale delle azioni',
        thumbnail: portfolioImageBuffer,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: false
      },
      mentionedJid: [who]
    }
  }, {
    quoted: {
      key: { fromMe: false, id: "portfolio", participant: "0@s.whatsapp.net" },
      message: {
        locationMessage: {
          name: `Portafoglio di ${user.name || 'utente'}`,
          jpegThumbnail: portfolioImageBuffer
        }
      }
    }
  })
}

handler.command = ['portafoglio', 'azioni']
handler.register = true

export default handler