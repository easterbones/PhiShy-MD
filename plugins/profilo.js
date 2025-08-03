import { canLevelUp, xpRange } from '../lib/levelling.js';
import PhoneNumber from 'awesome-phonenumber';

// Funzioni dal plugin flamepass
function isFlamePassActive(user) {
  if (!user.flamePassScadenza) return false
  return Date.now() < Date.parse(user.flamePassScadenza)
}

function getFlamePassTimeRemaining(user) {
  if (!user.flamePassScadenza) return null
  const now = Date.now()
  const expiry = Date.parse(user.flamePassScadenza)
  const remaining = expiry - now
  if (remaining <= 0) return null
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
  return { minutes, seconds, total: remaining }
}

function formatNumber(num) {
  return String(num).replace(/\d/g, d => `${d}͏`);
}

function formatText(text) {
  return text.split('\n').map(line => `┃ ${line}`).join('\n');
}

let handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.fromMe 
      ? conn.user.jid 
      : m.sender;

  let user = global.db.data.users[who];
  if (!user) return m.reply('❌ Utente non trovato.');

  // Inizializza la lista legati se non esiste o è corrotta
  if (!Array.isArray(user.lega_lista)) user.lega_lista = [];

  // Se l'utente è legato, mostra messaggio di presa in giro
 if (user.lega_iono) {
    const frasiPreseInGiro = [
      'guarda questo che cerca di usare il comando e non puo 👀🔗',
      'Ops! Qualcuno è finito nella gabbia di qualcuno, non puoi usare profilo mentre sei legato🐦🔐',
      'Ehi tu! Sì, proprio tu, legato come un salame! 🥓⛓️',
      'Mi dispiace, ma sono fuori servizio per chi e legato⚡🚫',
      'Shhh... non svegliare il tuo padrone o ti punira lavando il pavimento con la lingua 🤫',
      'Questo profilo è attualmente in... timeout! ⏳🙈',
      'Accesso negato! Hai esaurito i tentativi disponibili! 🚧❌',
      'Il proprietario di questo account è in vacanza... forzata! 🏝️⛓️'
    ];
    
    const randomFrase = frasiPreseInGiro[Math.floor(Math.random() * frasiPreseInGiro.length)];
    return m.reply(randomFrase);
  }

  // Se non è legato, mostra il profilo normale
  let {
    name, health, role, limit, level, credito, joincount, cane, gatto, coniglio, drago,
    piccione, serpente, cavallo, pesce, riccio, scoiattolo, polpo, ragno, scorpione,
    vita, pozioneminore, pozionemaggiore, pozionedefinitiva,
    macchina, moto, bici,
    canna, forcina, lavoro, scudo, exp, bacini, uova, lente, filtro,
    lega_vittime, lega_io, scudoScadenza, birthday, flamePass, flamePassScadenza, casa
  } = user;

    // Calcola casaString
  let casaString = 'Nessuna';
  if (user.casa && user.casa.tipo) {
    casaString = user.casa.tipo.charAt(0).toUpperCase() + user.casa.tipo.slice(1);
  }

  // Calcolo scudo: mostra tempo rimanente invece della data grezza
  let scudoString = 'Nessuno';
  if (scudoScadenza) {
    const now = new Date();
    const nowRome = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
    const expiry = new Date(scudoScadenza);
    const diffMs = expiry - nowRome;
    if (diffMs > 0) {
      const ore = Math.floor(diffMs / (1000 * 60 * 60));
      const minuti = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secondi = Math.floor((diffMs % (1000 * 60)) / 1000);
      scudoString = `${ore}h ${minuti}m ${secondi}s`;
    } else {
      scudoString = 'Scaduto';
    }
  }
  
  // Calcolo flame pass usando le funzioni del plugin
  let flamePassTickets = flamePass || 0;
  let flamePassAttivo = '❌';
  
  if (isFlamePassActive(user)) {
    const tempo = getFlamePassTimeRemaining(user);
    if (tempo) {
      flamePassAttivo = `${tempo.minutes}m ${tempo.seconds}s`;
    }
  }
   

  // Se l'utente è sposato, mostra con chi e con il genere corretto
  let sposatoString = '';
  if (user.sposato && user.partner) {
    let partnerName;
    try {
      partnerName = await conn.getName(user.partner);
    } catch {
      partnerName = user.partner.split('@')[0];
    }
    let finale = 'sposato'; // fallback
    if (typeof name === 'string' && name.length > 0) {
      const lastChar = name.trim().toLowerCase().slice(-1);
      if (['a', 'e', 'i'].includes(lastChar)) finale = 'sposata';
      else if (['o', 'u'].includes(lastChar)) finale = 'sposato';
    }
    sposatoString = `┃ 💍 *${finale} con:* ${partnerName}\n`;
  }

  let txt = `┏━━❰ *Profilo Utente* ❱━━┓\n`;
  txt += `┃ 🪴 *Nome:* ${name}\n`;
  txt += `┃ ❤️ *Salute:* ${health}\n`;
  txt += `┃ 	💞 *vite:* ${vita}\n`;
  if (typeof birthday !== 'undefined' && birthday !== null) {
    txt += `┃ 🎂 *Compleanno:*\n┃    ${formatNumber(birthday)}\n`;
  }
  txt += `┃ 🏠 *Casa:* ${casaString}\n`;
  if (user.casa && user.casa.tipo) {
    txt += `┃        stato: ${user.casa.stato}\n`;
  }
  if (sposatoString) txt += sposatoString;
  txt += `┃ 🍬 *Dolci:* ${limit}\n`;
  txt += `┃ 🛡️ *Scudo:* ${scudoString}\n`;
  txt += `┃ 🏦 *Banca:* ${formatNumber(credito)}\n`;
  txt += `┃ 🪙 *Token:* ${formatNumber(joincount)}\n`;
  txt += `┣━━━━━━━━━━━━━━━\n`;
  txt += `┃ 🍧 *Level up:*\n`;
  txt += `┃   🎮 *Livello:* ${level}\n`;
  txt += `┃   💸 *Lavoro:* ${lavoro}\n`;
  txt += `┃   🏅 *Rank:* ${role}\n`;
  txt += `┃   🏅 *Esperienza:* ${exp}\n`;
  txt += `┣━━━━━━━━━━━━━━━\n`;

const animali = [
  { key: 'cane', emoji: '🐶', label: 'Cane' },
  { key: 'gatto', emoji: '🐱', label: 'Gatto' },
  { key: 'coniglio', emoji: '🐰', label: 'Coniglio' },
  { key: 'drago', emoji: '🐉', label: 'Drago' },
  { key: 'piccione', emoji: '🐦‍⬛', label: 'Piccione' },
  { key: 'serpente', emoji: '🐍', label: 'Serpente' },
  { key: 'cavallo', emoji: '🐎', label: 'Cavallo' },
  { key: 'pesce', emoji: '🐟', label: 'Pesce' },
  { key: 'riccio', emoji: '🦔', label: 'Riccio' },
  { key: 'polpo', emoji: '🐙', label: 'Polpo' },
  { key: 'scoiattolo', emoji: '🐿️', label: 'Scoiattolo' },
  { key: 'ragno', emoji: '�️', label: 'Ragno' },
  { key: 'scorpione', emoji: '🦂', label: 'Scorpione' },
];
const posseduti = animali.filter(a => user[a.key]);
if (posseduti.length > 0) {
  txt += `┃ 🐾 *Animali:*\n`;
  for (const a of posseduti) {
    let nomeAnimale = a.label;
    if (typeof user[a.key] === 'object' && user[a.key] && Array.isArray(user[a.key].nomi) && user[a.key].nomi.length > 0) {
      nomeAnimale = user[a.key].nomi[0];
    }
    txt += `┃   ${a.emoji} ${nomeAnimale} ✅\n`;
  }
  txt += `┣━━━━━━━━━━━━━━━\n`;
}
  if (vita > 0 || pozioneminore > 0 || pozionemaggiore > 0 || pozionedefinitiva > 0) {
    txt += `┃ ⚗️ *Pozioni & Vita:*\n`;
    if (pozioneminore > 0) txt += `┃   🧪 Pozione Minore: ${formatNumber(pozioneminore)}\n`;
    if (pozionemaggiore > 0) txt += `┃   🧪 Pozione Maggiore: ${formatNumber(pozionemaggiore)}\n`;
    if (pozionedefinitiva > 0) txt += `┃   🧪 Pozione Definitiva: ${formatNumber(pozionedefinitiva)}\n`;
    txt += `┣━━━━━━━━━━━━━━━\n`;
  }

  if (macchina || moto || bici) {
    txt += `┃ 🚗 *Veicoli:*\n`;
    if (macchina) txt += `┃   🚗 Macchina ✅\n`;
    if (moto) txt += `┃   🏍️ Moto ✅\n`;
    if (bici) txt += `┃   🚲 Bici ✅\n`;
    txt += `┣━━━━━━━━━━━━━━━\n`;
  }
    txt += `┃ 🚗 *EVENTI:*\n`;
    txt += `┃ 🐣 *uova:* ${uova}\n`;
    txt += `┃ 💋 *bacini:* ${bacini}\n`;
    txt += `┣━━━━━━━━━━━━━━━\n`;      
      
  
  if (canna > 0 || forcina > 0) {
    txt += `┃ 🎒 *Oggetti:*\n`;
     txt += `┃ 🎫 *Flame pass:* ${formatNumber(flamePassTickets)}\n`;
    txt += `┃ 🔥 *Attivo:* ${flamePassAttivo}\n`;
    txt += `┃   🏷️ *Name Tag:* ${formatNumber(user.nametag ? user.nametag : 0)}\n`;
     if (canna > 0) txt += `┃   🌿 Canna: ${formatNumber(canna)}\n`;
     if (forcina > 0) txt += `┃   📎 Forcina: ${formatNumber(forcina)}\n`;
  }
     txt += `┣━━━━━━━━━━━━━━━\n`; 
  if (lega_vittime.length in user > 0) {
    txt += `┃ 🪢 *Legati:*\n`;
    for (let jid of lega_vittime) {
      const name = conn.getName(jid) || jid.split('@')[0];
      txt += `┃ 🧷 ${name}\n`;
    }
  }

  txt += `┗━━━━━━━━━━━━━━━━┛`;
  txt = formatText(txt);

  const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;${name};;;\nFN:${name}\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`;

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: { vcard }
    },
    participant: "0@s.whatsapp.net"
  };

  await conn.sendMessage(m.chat, { text: txt }, { quoted: fkontak });
};

handler.command = ['profilo'];
export default handler;