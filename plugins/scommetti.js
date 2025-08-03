import fs from 'fs';
const FILE = './database/scommesse.json';
let scommesse = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : {};

function salva() {
  fs.writeFileSync(FILE, JSON.stringify(scommesse, null, 2));
}

function parsePhone(text) {
  const match = text.match(/(\+?\d{7,15})/);
  return match ? match[1] : null;
}

async function controllaUscita(conn, id, numero) {
  const chatId = id;
  const data = scommesse[chatId];
  if (!data || !data.attiva || !data.attiva.numero.endsWith(numero)) return;

  const uscita = Date.now();
  const durataOre = Math.floor((uscita - data.attiva.inizio) / (1000 * 60 * 60));
  const report = [`📉 ${numero} ha resistito ${durataOre} ore.`];
  const vincitori = [];

  for (const s of data.attiva.scommesse) {
    const differenza = Math.abs(durataOre - s.ore);
    const utente = global.db.data.users[s.utente] || {};
    if (differenza === 0) {
      const guadagno = s.importo * 3;
      utente.limit = (utente.limit || 0) + guadagno;
      vincitori.push(`🎯 @${s.utente.split('@')[0]} ha indovinato esattamente e vinto ${guadagno} dolci!`);
    } else if (differenza === 1) {
      const guadagno = s.importo * 2;
      utente.limit = (utente.limit || 0) + guadagno;
      vincitori.push(`✅ @${s.utente.split('@')[0]} ci è andato vicino e vince ${guadagno} dolci!`);
    }
  }

  if (!vincitori.length) {
    report.push('❌ Nessuno ha indovinato o ci è andato vicino.');
  } else {
    report.push(...vincitori);
  }

  delete scommesse[chatId].attiva;
  salva();
  await conn.sendMessage(chatId, { text: report.join('\n'), mentions: vincitori.map(v => v.match(/@(\d+)/)?.[1] + "@s.whatsapp.net").filter(Boolean) });
}

// 🔁 Promemoria ogni 3 ore
setInterval(() => {
  for (const chatId in scommesse) {
    const data = scommesse[chatId];
    if (data?.attiva) {
      const orePassate = Math.floor((Date.now() - data.attiva.inizio) / (1000 * 60 * 60));
      if ((orePassate % 3 === 0) && !data.attiva.lastReminder || Date.now() - (data.attiva.lastReminder || 0) > 1000 * 60 * 60 * 2.9) {
        data.attiva.lastReminder = Date.now();
        salva();
        global.conn.sendMessage(chatId, { text: `🔔 Ricorda: c'è una scommessa attiva su ${data.attiva.numero}! Hai già scommesso? Usa *.scommetti 10 dolci 3 ore*.` });
      }
    }
  }
}, 1000 * 60 * 60); // ogni ora

export async function handler(m, { conn, args, command }) {
  const chatId = m.chat;
  scommesse[chatId] = scommesse[chatId] || {};

  const isAdmin = m.isGroupAdmins;

  if (m.text?.toLowerCase().startsWith('.scommetti su')) {
    if (!isAdmin) return m.reply('❌ Solo gli admin possono avviare una scommessa.');
    const numero = parsePhone(m.text);
    if (!numero) return m.reply('❌ Numero non valido.');
    scommesse[chatId].attiva = {
      numero,
      inizio: Date.now(),
      scommesse: [],
      lastReminder: 0,
    };
    salva();
    return m.reply(`🎲 Scommessa su quanto resisterà ${numero} prima di uscire dal gruppo!\nUsa *.scommetti 10 dolci 4 ore* per partecipare.`);
  }

  if (m.text?.toLowerCase().startsWith('.scommetti ') && !m.text.includes('su')) {
    const attiva = scommesse[chatId].attiva;
    if (!attiva) return m.reply('❌ Nessuna scommessa attiva.');

    const match = m.text.match(/(\d+)\s+dolci\s+(\d+)\s+ore/i);
    if (!match) return m.reply('❌ Formato errato. Usa: .scommetti 10 dolci 3 ore');

    const importo = parseInt(match[1]);
    const ore = parseInt(match[2]);
    const user = global.db.data.users[m.sender];

    if (!user || user.limit < importo) return m.reply('❌ Non hai abbastanza dolci.');
    if (attiva.scommesse.find(s => s.utente === m.sender)) return m.reply('Hai già scommesso.');

    user.limit -= importo;
    attiva.scommesse.push({ utente: m.sender, importo, ore });
    salva();
    return m.reply(`✅ Hai scommesso ${importo} dolci su ${ore} ore.`);
  }

  if (m.text?.toLowerCase().startsWith('.scommesse')) {
    const attiva = scommesse[chatId].attiva;
    if (!attiva) return m.reply('❌ Nessuna scommessa attiva.');
    if (!attiva.scommesse.length) return m.reply('⚠️ Nessuno ha ancora scommesso.');

    const righe = attiva.scommesse.map(s =>
      `• @${s.utente.split('@')[0]} → ${s.ore}h (${s.importo} dolci)`
    );
    return conn.reply(m.chat, `📊 Scommessa su ${attiva.numero}\n\n${righe.join('\n')}`, m, {
      mentions: attiva.scommesse.map(s => s.utente),
    });
  }

  if (m.text?.toLowerCase().startsWith('.annulla scommessa')) {
    const attiva = scommesse[chatId].attiva;
    if (!attiva) return m.reply('❌ Nessuna scommessa attiva.');
    const index = attiva.scommesse.findIndex(s => s.utente === m.sender);
    if (index === -1) return m.reply('❌ Non hai scommesso nulla.');
    const rimborso = attiva.scommesse[index].importo;
    global.db.data.users[m.sender].limit += rimborso;
    attiva.scommesse.splice(index, 1);
    salva();
    return m.reply(`🗑️ Hai annullato la tua scommessa. ${rimborso} dolci ti sono stati restituiti.`);
  }
}

// 👇 Quando qualcuno esce dal gruppo
export async function participantsUpdate({ id, participants, action }, conn) {
  if (action === 'remove') {
    for (const p of participants) {
      await controllaUscita(conn, id, p);
    }
  }
}

export const disabled = false;
export const command = ['scommetti', 'scommesse', 'annulla'];
export const tags = ['game'];
export const help = [
  '.scommetti su +39...',
  '.scommetti 10 dolci 3 ore',
  '.scommesse',
  '.annulla scommessa'
];
