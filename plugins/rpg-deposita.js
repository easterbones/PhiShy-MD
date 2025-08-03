const MAX_DEPOSIT = 1000000; // Limite massimo per il deposito
const MAX_WITHDRAW = 1000000; // Limite massimo per il ritiro
import phishy from './_phishy.js'
import abbrev from '../lib/abbrev.js'

function parseAbbrev(str) {
  if (typeof str === 'number') return str;
  if (typeof str !== 'string') return NaN;
  str = str.trim().toLowerCase();
  const match = str.match(/^([\d,.]+)\s*([kmgbt]?)$/i);
  if (!match) return NaN;
  let num = parseFloat(match[1].replace(',', '.'));
  if (isNaN(num)) return NaN;
  const mult = { '': 1, k: 1e3, m: 1e6, b: 1e9, t: 1e12 };
  return num * (mult[match[2]] || 1);
}

function cambia(num) {
  // Mostra abbreviazione solo se num >= 1000 e divisibile per 1000
  num = Number(num);
  if (num >= 1000 && Number.isInteger(num) && num % 1000 === 0) {
    return abbrev(num);
  }
  // Altrimenti formatta con i punti
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


function getNumber(val) {
  return typeof val === 'number' && !isNaN(val) ? val : 0;
}

function sendError(conn, m, msg, ...args) {
  return conn.reply(m.chat, msg, m, ...args);
}

async function handler(m, { conn, args, usedPrefix, command }) {
  try {
    let user = global.db.data.users[m.sender];
    if (!user) return sendError(conn, m, "❌ Rcanal: utente non trovato nel database.", rcanal);

    let amount = Math.floor(parseAbbrev(args[0]));
    if (isNaN(amount) || amount <= 0) {
      return sendError(conn, m,
        `*❌ VALORE NON VALIDO ❌*\n\nInserisci un numero valido di dolci.\n` +
        `Esempio: \`${usedPrefix}${command} 100\` oppure \
\`${usedPrefix}${command} 1k\``,
        rcanal
      );
    }

    user.limit = getNumber(user.limit);
    user.credito = getNumber(user.credito);

    if (command === "deposita") {
      if (amount > MAX_DEPOSIT) {
        return sendError(conn, m,
          `*❌ LIMITE DEPOSITO SUPERATO ❌*\n\nNon puoi depositare più di ${cambia(MAX_DEPOSIT)} dolci alla volta.\n` +
          `Prova con un importo minore.`,
          rcanal
        );
      }
      if (user.limit < amount) {
        return sendError(conn, m,
          `*❌ FONDI INSUFFICIENTI ❌*\n\nNon hai abbastanza dolci per depositare questa quantità.\n` +
          `Attualmente hai: ${cambia(user.limit)} dolci`,
          rcanal
        );
      }
      user.limit -= amount;
      user.credito += amount;
      await conn.reply(m.chat,
        `*✅ DEPOSITO EFFETTUATO ✅*\n\nHai depositato ${cambia(amount)} dolci nel tuo conto.\n` +
        `💳 Credito in banca: ${cambia(user.credito)}\n` +
        `🍬 Portafoglio: ${cambia(user.limit)}`,
        m, phishy
      );
    }

    if (command === "ritira") {
      if (amount > MAX_WITHDRAW) {
        return sendError(conn, m,
          `*❌ LIMITE RITIRO SUPERATO ❌*\n\nNon puoi ritirare più di ${cambia(MAX_WITHDRAW)} dolci alla volta.\n` +
          `Prova con un importo minore.`,
          rcanal
        );
      }
      if (user.credito < amount) {
        return sendError(conn, m,
          `*❌ CREDITO INSUFFICIENTE ❌*\n\nNon hai abbastanza credito per ritirare questa quantità.\n` +
          `Attualmente hai: ${cambia(user.credito)} dolci in banca`,
          rcanal
        );
      }
      user.credito -= amount;
      user.limit += amount;
      await conn.reply(m.chat,
        `*✅ RITIRO EFFETTUATO ✅*\n\nHai ritirato ${cambia(amount)} dolci dal tuo conto.\n` +
        `🍬 Portafoglio: ${cambia(user.limit)}\n` +
        `💳 Credito in banca: ${cambia(user.credito)}`,
        m, phishy
      );
    }
  } catch (err) {
    return sendError(conn, m, `❌ Errore interno: ${err && err.message ? err.message : err}`);
  }
}

handler.help = ["deposita", "ritira"];
handler.tags = ["economy"];
handler.command = ["deposita", "ritira"];

export default handler;