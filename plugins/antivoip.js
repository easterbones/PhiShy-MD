/**
 * ULTIMATE VOIP BLOCKER v7.4 (Con accesso diretto al database, compatibile con antiinsta)
 * @description Blocca i numeri stranieri mostrando il nome del gruppo e salva i dati in un database JSON, rispettando l'impostazione antivoip
 */
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import path from 'path'

const ITALIAN_CODE = 39;
const LOG_CHAT = '120363387953890165@g.us';
const DB_FILE = 'voip.json';

// Flag per prevenire duplicazione di messaggi
let processingNumbers = new Set();

// Funzione per formattare la data nel formato GG/MM/AAAA HH:MM
function formatDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Funzione per gestire il database JSON
function manageVoipDatabase(number, groupName, nickname = "") {
  try {
    // Verifica se il file esiste, altrimenti lo crea
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({
        blockedNumbers: []
      }, null, 2));
    }

    // Legge il database attuale
    const dbContent = fs.readFileSync(DB_FILE, 'utf8');
    const database = JSON.parse(dbContent);

    // Verifica se il numero esiste già nel database
    const existingEntry = database.blockedNumbers.find(entry => entry.numero === number);
    
    const timestamp = formatDate();
    
    if (existingEntry) {
      // Aggiorna l'entry esistente
      existingEntry.ultimoTentativo = timestamp;
      existingEntry.gruppi = existingEntry.gruppi || [];
      if (!existingEntry.gruppi.includes(groupName)) {
        existingEntry.gruppi.push(groupName);
      }
      existingEntry.tentativi = (existingEntry.tentativi || 0) + 1;
      // Aggiorna il nickname solo se non esisteva o se è diverso e non vuoto
      if (nickname && (!existingEntry.nickname || existingEntry.nickname !== nickname)) {
        existingEntry.nickname = nickname;
      }
    } else {
      // Crea un nuovo entry
      database.blockedNumbers.push({
        numero: number,
        nickname: nickname || "Sconosciuto",
        primoTentativo: timestamp,
        ultimoTentativo: timestamp,
        gruppi: [groupName],
        tentativi: 1,
        paese: getCountryFromNumber(number),
        bloccato: true
      });
    }

    // Salva il database aggiornato
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
    console.log(`📊 Numero ${number} salvato nel database con nickname: ${nickname || "N/D"}`);
    
    return true;
  } catch (error) {
    console.error('❌ Errore nel gestire il database:', error);
    return false;
  }
}

// Funzione per ottenere il paese dal numero
function getCountryFromNumber(number) {
  try {
    const pn = new PhoneNumber(number);
    return pn.getRegionCode() || "Sconosciuto";
  } catch (e) {
    return "Sconosciuto";
  }
}

// Funzione migliorata per ottenere il nickname dell'utente
async function getUserNickname(conn, userJid) {
  try {
    const rawNumber = userJid.split('@')[0];
    const formattedNumber = rawNumber.startsWith('+') ? rawNumber : `+${rawNumber}`;
    let nickname = null;
    
    // Metodo 1: Verifica il nome del contatto tramite getName
    try {
      if (typeof conn.getName === 'function') {
        nickname = await conn.getName(userJid);
        if (nickname && nickname.trim() !== '' && !nickname.match(/^\+?\d+$/)) {
          console.log(`👤 Nome trovato tramite getName: ${nickname}`);
          return nickname.trim();
        }
      }
    } catch (e) {
      console.log('⚠️ Errore in getName:', e.message);
    }
    
    // Metodo 2: Ottieni il pushname dagli attributi di contatto
    try {
      let contact = null;
      if (typeof conn.fetchContactInfo === 'function') {
        contact = await conn.fetchContactInfo(userJid);
      } else if (typeof conn.getContact === 'function') {
        contact = await conn.getContact(userJid);
      }
      
      if (contact && contact.pushname && contact.pushname.trim() !== '' && !contact.pushname.match(/^\+?\d+$/)) {
        console.log(`👤 Nome trovato tramite pushname: ${contact.pushname}`);
        return contact.pushname.trim();
      }
      
      // Cerca altri campi utili nelle informazioni di contatto
      if (contact && contact.notify && contact.notify.trim() !== '' && !contact.notify.match(/^\+?\d+$/)) {
        console.log(`👤 Nome trovato tramite notify: ${contact.notify}`);
        return contact.notify.trim();
      }
      
      if (contact && contact.name && contact.name.trim() !== '' && !contact.name.match(/^\+?\d+$/)) {
        console.log(`👤 Nome trovato tramite attributo name: ${contact.name}`);
        return contact.name.trim();
      }
    } catch (e) {
      console.log('⚠️ Errore nel fetchContactInfo:', e.message);
    }
    
    // Metodo 3: Prova a ottenere il nome dal profilo business
    try {
      if (typeof conn.getBusinessProfile === 'function') {
        const businessProfile = await conn.getBusinessProfile(userJid);
        if (businessProfile && businessProfile.name && businessProfile.name.trim() !== '') {
          console.log(`👤 Nome trovato tramite business profile: ${businessProfile.name}`);
          return businessProfile.name.trim();
        }
      }
    } catch (e) {
      console.log('⚠️ Errore nel getBusinessProfile:', e.message);
    }
    
    // Metodo 4: Verifica lo stato dell'utente per pattern come ~nickname~
    try {
      if (typeof conn.fetchStatus === 'function') {
        const status = await conn.fetchStatus(userJid);
        if (status && status.status) {
          const match = status.status.match(/~([^~]+)~/);
          if (match && match[1] && match[1].trim() !== '') {
            console.log(`👤 Nome trovato tramite status: ${match[1]}`);
            return match[1].trim();
          }
        }
      }
    } catch (e) {
      console.log('⚠️ Errore nel fetchStatus:', e.message);
    }
    
    // Metodo 5: Verifica il database esistente per vedere se abbiamo già un nickname per questo numero
    try {
      if (fs.existsSync(DB_FILE)) {
        const dbContent = fs.readFileSync(DB_FILE, 'utf8');
        const database = JSON.parse(dbContent);
        const existingEntry = database.blockedNumbers.find(entry => entry.numero === formattedNumber);
        if (existingEntry && existingEntry.nickname && 
            existingEntry.nickname !== "Sconosciuto" && 
            !existingEntry.nickname.match(/^\+?\d+$/)) {
          console.log(`👤 Nome trovato nel database esistente: ${existingEntry.nickname}`);
          return existingEntry.nickname;
        }
      }
    } catch (e) {
      console.log('⚠️ Errore nella verifica del database:', e.message);
    }
    
    // Se tutti i metodi falliscono, usa il formattedNumber come fallback
    console.log(`⚠️ Nessun nome trovato per ${formattedNumber}, uso il numero come fallback`);
    return formattedNumber;
  } catch (error) {
    console.error('❌ Errore nel recupero del nickname:', error);
    const number = userJid.split('@')[0];
    return number.startsWith('+') ? number : `+${number}`;
  }
}

export async function before(m, { conn }) {
  if (!m.isGroup) return true;
  // Solo segnala su LOG_CHAT se è una vera richiesta di join tramite link
  const isJoinRequest = (
    m.messageStubType === 21 ||
    m.message?.protocolMessage?.type === 5 ||
    (m.messageStubParameters && m.messageStubParameters.length > 0)
  );
  if (!isJoinRequest) return true;
  try {
    let requesterJid = m.messageStubParameters?.[0] || 
                      m.message?.protocolMessage?.key?.participant || 
                      m.sender;
    if (!requesterJid) return true;
    const rawNumber = requesterJid.split('@')[0];
    const formattedNumber = rawNumber.startsWith('+') ? rawNumber : `+${rawNumber}`;
    if (processingNumbers.has(formattedNumber)) {
      console.log(`⚠️ Evitata duplicazione per ${formattedNumber}`);
      return true;
    }
    processingNumbers.add(formattedNumber);
    const groupMetadata = await conn.groupMetadata(m.chat).catch(() => null);
    const groupName = groupMetadata?.subject || 'Gruppo sconosciuto';
    const isBotAdmin = groupMetadata?.participants?.some(p => p.id === conn.user.jid && p.admin !== null) || false;
    const isAdmin = groupMetadata?.participants?.some(p => p.id === requesterJid && p.admin !== null) || false;
    const chatData = global.db.data.chats[m.chat];
    const antivoipEnabled = chatData?.antivoip !== false;
    if (!antivoipEnabled) {
      console.log(`ℹ️ Anti-VOIP disabilitato per il gruppo "${groupName}". Accesso consentito.`);
      processingNumbers.delete(formattedNumber);
      return true;
    }
    const isItalian = formattedNumber.startsWith('+39');
    if (!isItalian) {
      // Solo qui chiama executeBlock che segnala su LOG_CHAT
      await executeBlock(conn, m.chat, requesterJid, formattedNumber, groupName, isAdmin, groupMetadata, isBotAdmin);
      setTimeout(() => {
        processingNumbers.delete(formattedNumber);
      }, 5000);
      return false;
    }
    processingNumbers.delete(formattedNumber);
    return true;
  } catch (error) {
    console.error('🔥 ERRORE:', error);
    // Segnala su LOG_CHAT solo se è una join request
    if (m.messageStubType === 21 || m.message?.protocolMessage?.type === 5 || (m.messageStubParameters && m.messageStubParameters.length > 0)) {
      await conn.sendMessage(LOG_CHAT, {
        text: `*ERRORE FIREWALL*\n• Errore: ${error.message}`
      });
    }
    return true;
  }
}

async function executeBlock(conn, chatJid, userJid, number, groupName, isAdmin, groupMetadata, isBotAdmin) {
  if (!isAdmin && isBotAdmin) {  
    try {
      // Nuovo metodo per ottenere il nome - SIMILE A PARTICIPANTSUPDATE
      const normalizeJid = (jid) => jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      const normalizedJid = normalizeJid(userJid);
      const mention = '@' + normalizedJid.split('@')[0];
      
      // Usiamo la menzione come nome (WhatsApp automaticamente risolve il nome)
      const nickname = mention; 
      
      await conn.groupRequestParticipantsUpdate(chatJid, [userJid], 'reject');
      console.log(`☠️ VOIP BLOCCATO: ${number} (${nickname}) in "${groupName}"`);
      
      // Salva il numero nel database JSON con il nickname
      manageVoipDatabase(number, groupName, nickname);
      
      await conn.sendMessage(LOG_CHAT, {
        text: `*ATTENZIONE ADMIN*\n` +
              `*VOIP BLOCCATO*\n` +
              `• Numero: ${number}\n` +
              `• Menzione: ${mention}\n` +
              `• Gruppo: ${groupName}\n` +
              `• Data: ${formatDate()}\n`,
        mentions: [normalizedJid] // Aggiungiamo la menzione per risolvere il nome
      });
    } catch (error) {
      // Fallback intelligente
      try {
        if (!groupMetadata) {
          groupMetadata = await conn.groupMetadata(chatJid);
        }
        const alreadyInGroup = groupMetadata?.participants?.some(p => p.id === userJid);
        if (!alreadyInGroup) {
          const normalizeJid = (jid) => jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
          const normalizedJid = normalizeJid(userJid);
          const mention = '@' + normalizedJid.split('@')[0];
          
          await conn.groupParticipantsUpdate(chatJid, [userJid], 'remove');
          console.log(`☠️ VOIP BLOCCATO (fallback): ${number} (${mention}) in "${groupName}"`);
          
          manageVoipDatabase(number, groupName, mention);
          
          await conn.sendMessage(LOG_CHAT, {
            text: `*ATTENZIONE ADMIN*\n` +
                  `*VOIP BLOCCATO (fallback)*\n` +
                  `• Numero: ${number}\n` +
                  `• Menzione: ${mention}\n` +
                  `• Gruppo: ${groupName}\n` +
                  `• Data: ${formatDate()}\n`,
            mentions: [normalizedJid]
          });
        } else {
          console.warn(`❗ Utente ${number} è già nel gruppo, non lo rimuovo.`);
        }
      } catch (innerError) {
        console.error(`Errore nel fallback per ${number}:`, innerError.message);
      }
    }
  }
}

export function init() {
  console.log('🛡️ Firewall Anti-VOIP v7.4 attivato con controllo database diretto e compatibilità anti-instagram');
  
  // Verifica se il file DB esiste, altrimenti lo crea
  if (!fs.existsSync(DB_FILE)) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify({
        blockedNumbers: []
      }, null, 2));
      console.log('📁 Database voip.json creato con successo');
    } catch (error) {
      console.error('❌ Errore nella creazione del database:', error);
    }
  }
  
  return {
    name: 'voip-firewall',
    description: 'Blocca numeri stranieri in base alle impostazioni del gruppo e salva i dati in un database JSON',
    priority: 9999
  };
}