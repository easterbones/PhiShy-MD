// ========== CONFIGURAZIONE ==========
const CONFIG = {
  MAX_ACTIVE_MISSIONS: 3,
  DAILY_MISSIONS_COUNT: 3,
  WEEKLY_MISSIONS_COUNT: 1,
  CHECK_INTERVAL: 60000, // 1 minuto
  NOTIFICATION_ENABLED: true
};

const MISSION_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly'
};

// ========== MESSAGGI ==========
const MESSAGES = {
  HELP_TITLE: '🎮 *COMANDI MISSIONI* 🎮\n\n',
  USER_SECTION: '👤 *UTENTE*\n',
  ADMIN_SECTION: '\n👑 *ADMIN*\n',
  MISSIONS_TITLE: '🎯 *MISSIONI DISPONIBILI* 🎯\n\n',
  MY_MISSIONS_TITLE: '📋 *LE TUE MISSIONI* 📋\n\n',
  DAILY_BADGE: '🌞 Giornaliera',
  WEEKLY_BADGE: '📅 Settimanale',
  EXPIRED_WARNING: '⚠️ SCADUTA! ⚠️',
  ACCEPT_INSTRUCTION: '\nUsa *{prefix}accetta [numero]* per partecipare',
  TOTAL_REWARDS: '\nTotale dolci guadagnati: {total}',
  
  // Errori
  ERROR_SPECIFY_NUMBER: '⚠ Specifica il numero della missione!',
  ERROR_INVALID_MISSION: '⚠ Numero missione non valido!',
  ERROR_ALREADY_ACCEPTED: '⚠ Hai già accettato la missione *{title}*!',
  ERROR_MAX_MISSIONS: '⚠ Hai già {max} missioni attive! Completale prima di accettarne altre.',
  ERROR_NO_ACTIVE_MISSIONS: '⚠ Non hai missioni attive! Usa *.missioni* per vederle.',
  ERROR_USER_NOT_FOUND: '⚠ Utente non trovato!',
  ERROR_MISSION_NOT_FOUND: '⚠ Missione non trovata!',
  ERROR_ALREADY_COMPLETED: '⚠ Missione già completata!',
  ERROR_SYNTAX: '⚠ Sintassi: {prefix}{command} @utente numero',
  
  // Successo
  SUCCESS_ACCEPTED: '✅ Hai accettato: *{title}*\nHai {time} per completarla!',
  SUCCESS_CANCELLED: '❌ Missione annullata: *{title}*',
  SUCCESS_VERIFIED: '✅ {type}!\n👤 Utente: @{user}\n🎯 Missione: *{title}*\n🍬 Ricompensa: {reward} dolci\n💰 Totale: {total} dolci',
  SUCCESS_MISSIONS_RELOADED: '🔄 Missioni ricaricate con successo!',
  
  // Notifiche
  MISSION_EXPIRED: '⏰ La missione *{title}* è scaduta!',
  MISSION_COMPLETED: '🎉 Complimenti! Hai completato *{title}* e guadagnato {reward} dolci!'
};

// ========== LISTA MISSIONI ==========
const MISSION_LIST = [
  {
    id: 'read_30min',
    title: 'Leggi per 30 minuti',
    description: 'Leggi un libro o articolo online, smettila di usare il telefono',
    type: MISSION_TYPES.DAILY,
    duration: 1440,
    reward: 100
  },
  {
    id: 'exercise',
    title: 'Fai esercizio fisico',
    description: 'Allenati per almeno 20 minuti (palestra, corsa, yoga...)',
    type: MISSION_TYPES.DAILY,
    duration: 120,
    reward: 400
  },
  {
    id: 'invito',
    title: 'invita un amico',
    description: 'passa il codice qr al tuo best friend e aggiungilo al gruppo',
    type: MISSION_TYPES.DAILY,
    duration: 1440,
    reward: 800
  },
  {
    id: 'sandwitch',
    title: 'fammi un panino',
    description: 'non sai cucinare un uovo? va bene ma almeno un panino lo saprai fare.\n hai 10 minuti a disposizione',
    type: MISSION_TYPES.DAILY,
    duration: 60,
    reward: 0
  },
  {
    id: 'dance',
    title: 'fai un ballo',
    description: 'fatti un video dove balli insieme alla tua musica, selezione a scelta tua',
    type: MISSION_TYPES.DAILY,
    duration: 1440,
    reward: 500
  },
  {
    id: 'sing',
    title: 'canta una canzone',
    description: 'cantaci qualcosa e facci vedere quanto sei intonato, durata minima 30 secondi',
    type: MISSION_TYPES.DAILY,
    duration: 60,
    reward: 300
  },
  {
    id: 'drink',
    title: 'BEVI UN BICCHIER D\'ACQUA',
    description: 'AVRAI 7 SECONDI PER FILMARTI MENTRE BEVI ACQUA',
    type: MISSION_TYPES.DAILY,
    duration: 7,
    reward: 100
  },
  {
    id: 'sticker',
    title: 'manda uno sticker dolce, gli admin guidicheranno',
    description: '',
    type: MISSION_TYPES.WEEKLY,
    duration: 60,
    reward: 50
  },
  {
    id: 'shit',
    title: 'foto cacca',
    description: 'mandaci la foto del tuo riversamento nei fiumi',
    type: MISSION_TYPES.WEEKLY,
    duration: 10080,
    reward: 700
  },
  {
    id: 'truth',
    title: 'verita',
    description: 'fatti fare una domanda da un utente',
    type: MISSION_TYPES.DAILY,
    duration: 10080,
    reward: 0
  },
  {
    id: 'sponsor',
    title: 'fai pubblicita alla community',
    description: 'dacci visibilita postando un video con il nostro codice qr e manda le prove a un admin, chissa potremmo darti anche un extra',
    type: MISSION_TYPES.WEEKLY,
    duration: 10080,
    reward: 1000
  },
  {
    id: 'draw',
    title: 'fai un disegno',
    description: 'disegna qualcosa e gli admin giudicheranno il tuo talento',
    type: MISSION_TYPES.WEEKLY,
    duration: 10080,
    reward: 300
  }
];

// ========== COMANDI ==========
const USER_COMMANDS = [
  { cmd: 'missioni', desc: 'Mostra missioni disponibili' },
  { cmd: 'accetta [n]', desc: 'Accetta una missione' },
  { cmd: 'mymissioni', desc: 'Mostra le tue missioni' },
  { cmd: 'annulla [n]', desc: 'Annulla una missione' },
  { cmd: 'missionihelp', desc: 'Mostra questa guida' }
];

const ADMIN_COMMANDS = [
  { cmd: 'verifica @user [n]', desc: 'Verifica missione completata' },
  { cmd: 'forzacompleta @user [n]', desc: 'Completa missione scaduta' },
  { cmd: 'ricaricamissioni', desc: 'Ricarica le missioni' }
];

// ========== DATABASE IN MEMORIA ==========
const missionsDB = new Map();

// ========== FUNZIONI DI UTILITÀ ==========

/**
 * Formatta il tempo rimanente in modo leggibile
 * @param {number} ms Millisecondi
 * @returns {string} Tempo formattato
 */
function formatTime(ms) {
  if (ms <= 0) return "SCADUTA";
  
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}g ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

/**
 * Crea una copia profonda di un oggetto
 * @param {Object} obj Oggetto da copiare
 * @returns {Object} Copia dell'oggetto
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Formatta un messaggio sostituendo i placeholder
 * @param {string} template Template del messaggio
 * @param {Object} params Parametri da sostituire
 * @returns {string} Messaggio formattato
 */
function formatMessage(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
}

/**
 * Inizializza i dati utente se non esistono
 * @param {string} userId ID dell'utente
 */
function initializeUserData(userId) {
  try {
    if (!global.db.data.users[userId]) {
      global.db.data.users[userId] = {};
    }
    
    if (!global.db.data.users[userId].missioni) {
      global.db.data.users[userId].missioni = {
        attive: [],
        completate: [],
        fallite: [],
        dolciGuadagnati: 0,
        acceptedMissions: [] // Traccia le missioni già accettate
      };
    }
    
    if (!global.db.data.users[userId].limit) {
      global.db.data.users[userId].limit = 0;
    }
  } catch (error) {
    console.error('Errore inizializzazione dati utente:', error);
  }
}

/**
 * Inizializza il database della chat
 * @param {string} chatId ID della chat
 * @param {number} now Timestamp corrente
 */
function initializeChatData(chatId, now) {
  if (!missionsDB.has(chatId)) {
    missionsDB.set(chatId, {
      activeMissions: [],
      lastRefresh: now
    });
  }
}

/**
 * Ricarica le missioni per una chat
 * @param {string} chatId ID della chat
 * @param {number} now Timestamp corrente
 */
function refreshMissions(chatId, now) {
  const db = missionsDB.get(chatId);
  
  // Mescola e seleziona missioni
  const shuffled = [...MISSION_LIST].sort(() => 0.5 - Math.random());
  const daily = shuffled
    .filter(m => m.type === MISSION_TYPES.DAILY)
    .slice(0, CONFIG.DAILY_MISSIONS_COUNT);
  const weekly = shuffled
    .filter(m => m.type === MISSION_TYPES.WEEKLY)
    .slice(0, CONFIG.WEEKLY_MISSIONS_COUNT);
  
  // Crea copie delle missioni per evitare modifiche agli originali
  db.activeMissions = [...daily, ...weekly].map(mission => deepClone(mission));
  db.lastRefresh = now;
}

/**
 * Verifica se le missioni devono essere ricaricate
 * @param {Object} db Database della chat
 * @param {number} now Timestamp corrente
 * @returns {boolean} True se devono essere ricaricate
 */
function shouldRefreshMissions(db, now) {
  const lastRefreshTime = new Date(db.lastRefresh).setHours(0, 0, 0, 0);
  const currentTime = new Date(now).setHours(0, 0, 0, 0);
  
  return currentTime > lastRefreshTime || db.activeMissions.length === 0;
}

/**
 * Controlla se l'utente ha già accettato una missione specifica
 * @param {string} userId ID dell'utente
 * @param {string} missionId ID della missione
 * @returns {boolean} True se già accettata
 */
function hasUserAcceptedMission(userId, missionId) {
  try {
    const userMissions = global.db.data.users[userId].missioni;
    return userMissions.attive.some(m => m.id === missionId) ||
           userMissions.acceptedMissions.includes(missionId);
  } catch (error) {
    console.error('Errore controllo missione accettata:', error);
    return false;
  }
}

/**
 * Invia una notifica all'utente
 * @param {Object} conn Connessione
 * @param {string} userId ID dell'utente
 * @param {string} message Messaggio da inviare
 */
async function sendNotification(conn, userId, message) {
  if (!CONFIG.NOTIFICATION_ENABLED) return;
  
  try {
    // In un contesto reale, dovresti avere il chatId dell'utente per le notifiche private
    // Per ora, saltiamo l'invio effettivo della notifica
    console.log(`Notifica per ${userId}: ${message}`);
  } catch (error) {
    console.error('Errore invio notifica:', error);
  }
}

/**
 * Controlla e gestisce le missioni scadute
 * @param {Object} conn Connessione (per le notifiche)
 */
function checkExpiredMissions(conn = null) {
  const now = Date.now();

  try {
    if (!global.db?.data?.users) return;

    Object.entries(global.db.data.users).forEach(([userId, userData]) => {
      if (!userData.missioni) return;

      const expired = [];
      userData.missioni.attive = userData.missioni.attive.filter((mission) => {
        const isExpired = now > mission.expires;
        const isNotCompleted = !mission.completed && !mission.failed;

        if (isExpired && isNotCompleted) {
          mission.failed = true;
          mission.failedAt = now;
          expired.push(mission);

          // Invia notifica di scadenza SOLO sul gruppo
          if (conn && mission.chatId) {
            const message = formatMessage(MESSAGES.MISSION_EXPIRED, {
              title: mission.title
            });
            // Menziona l'utente nel gruppo
            conn.sendMessage(mission.chatId, { 
              text: `@${userId.split('@')[0]} ${message}`, 
              mentions: [userId] 
            });
          }

          return false;
        }
        return true;
      });

      // Aggiunge alle missioni fallite
      if (expired.length > 0) {
        userData.missioni.fallite.push(...expired);

        // Rimuove dalle missioni accettate per permettere di riaccettarle
        expired.forEach(mission => {
          const index = userData.missioni.acceptedMissions.indexOf(mission.id);
          if (index > -1) {
            userData.missioni.acceptedMissions.splice(index, 1);
          }
        });
      }
    });
  } catch (error) {
    console.error('Errore controllo missioni scadute:', error);
  }
}

// ========== HANDLER PRINCIPALE ==========
let handler = async (m, { conn, usedPrefix, command, text, isAdmin, isROwner }) => {
  const chatId = m.chat;
  const userId = m.sender;
  const now = Date.now();

  // Inizializza dati
  initializeUserData(userId);
  initializeChatData(chatId, now);

  const db = missionsDB.get(chatId);
  
  // Verifica se le missioni devono essere ricaricate
  if (shouldRefreshMissions(db, now)) {
    refreshMissions(chatId, now);
  }

  // ========== COMANDO HELP ==========
  if (command === 'missionihelp') {
    let helpText = MESSAGES.HELP_TITLE;
    helpText += MESSAGES.USER_SECTION;
    
    USER_COMMANDS.forEach(c => {
      helpText += `➡ ${usedPrefix}${c.cmd} - ${c.desc}\n`;
    });

    if (isAdmin || isROwner) {
      helpText += MESSAGES.ADMIN_SECTION;
      ADMIN_COMMANDS.forEach(c => {
        helpText += `➡ ${usedPrefix}${c.cmd} - ${c.desc}\n`;
      });
    }

    return m.reply(helpText);
  }

  // ========== COMANDO MISSIONI ==========
  if (command === 'missioni') {
    if (db.activeMissions.length === 0) {
      refreshMissions(chatId, now);
    }

    let missionText = MESSAGES.MISSIONS_TITLE;
    
    db.activeMissions.forEach((mission, i) => {
      const typeLabel = mission.type === MISSION_TYPES.DAILY ? 
        MESSAGES.DAILY_BADGE : MESSAGES.WEEKLY_BADGE;
      
      missionText += `${i + 1}. *${mission.title}* (${typeLabel})\n`;
      missionText += `📝 ${mission.description}\n`;
      missionText += `🍬 Ricompensa: ${mission.reward} dolci\n\n`;
    });

    missionText += formatMessage(MESSAGES.ACCEPT_INSTRUCTION, { prefix: usedPrefix });
    return m.reply(missionText);
  }

  // ========== COMANDO ACCETTA ==========
  if (command === 'accetta') {
    const missionNum = parseInt(text);
    if (isNaN(missionNum)) {
      return m.reply(MESSAGES.ERROR_SPECIFY_NUMBER);
    }

    if (db.activeMissions.length === 0) {
      refreshMissions(chatId, now);
    }

    if (missionNum < 1 || missionNum > db.activeMissions.length) {
      return m.reply(MESSAGES.ERROR_INVALID_MISSION);
    }

    const mission = db.activeMissions[missionNum - 1];
    const userMissions = global.db.data.users[userId].missioni;

    // Verifica se l'utente ha già questa missione
    if (hasUserAcceptedMission(userId, mission.id)) {
      return m.reply(formatMessage(MESSAGES.ERROR_ALREADY_ACCEPTED, {
        title: mission.title
      }));
    }

    if (userMissions.attive.length >= CONFIG.MAX_ACTIVE_MISSIONS) {
      return m.reply(formatMessage(MESSAGES.ERROR_MAX_MISSIONS, {
        max: CONFIG.MAX_ACTIVE_MISSIONS
      }));
    }

    // Crea una copia della missione per l'utente
    const userMission = deepClone(mission);
    userMission.acceptedAt = now;
    userMission.expires = now + (mission.duration * 60000);
    userMission.chatId = chatId;

    userMissions.attive.push(userMission);
    if (!Array.isArray(userMissions.acceptedMissions)) {
      userMissions.acceptedMissions = [];
    }
    userMissions.acceptedMissions.push(mission.id);

    return m.reply(formatMessage(MESSAGES.SUCCESS_ACCEPTED, {
      title: mission.title,
      time: formatTime(mission.duration * 60000)
    }));
  }

  // ========== COMANDO MYMISSIONI ==========
  if (command === 'mymissioni') {
    const userMissions = global.db.data.users[userId].missioni;
    
    if (userMissions.attive.length === 0) {
      return m.reply(MESSAGES.ERROR_NO_ACTIVE_MISSIONS);
    }

    let missionText = MESSAGES.MY_MISSIONS_TITLE;
    
    userMissions.attive.forEach((mission, i) => {
      const status = mission.completed ? '✅' : mission.failed ? '❌' : '⌛';
      const timeRemaining = mission.expires - now;
      const isExpired = timeRemaining <= 0;
      
      missionText += `${i + 1}. ${status} *${mission.title}*\n`;
      missionText += `📌 ${mission.description}\n`;
      missionText += isExpired ? 
        `${MESSAGES.EXPIRED_WARNING}\n` : 
        `⏳ Scade: ${formatTime(timeRemaining)}\n`;
      missionText += `🍬 Ricompensa: ${mission.reward} dolci\n\n`;
    });

    missionText += formatMessage(MESSAGES.TOTAL_REWARDS, {
      total: userMissions.dolciGuadagnati
    });
    
    return m.reply(missionText);
  }

  // ========== COMANDO ANNULLA ==========
  if (command === 'annulla') {
    const missionNum = parseInt(text);
    if (isNaN(missionNum)) {
      return m.reply(MESSAGES.ERROR_SPECIFY_NUMBER);
    }

    const userMissions = global.db.data.users[userId].missioni;
    if (missionNum < 1 || missionNum > userMissions.attive.length) {
      return m.reply(MESSAGES.ERROR_INVALID_MISSION);
    }

    const mission = userMissions.attive[missionNum - 1];
    userMissions.attive.splice(missionNum - 1, 1);

    // Rimuove dalle missioni accettate per permettere di riaccettarla
    if (!Array.isArray(userMissions.acceptedMissions)) {
      userMissions.acceptedMissions = [];
    }
    const acceptedIndex = userMissions.acceptedMissions.indexOf(mission.id);
    if (acceptedIndex > -1) {
      userMissions.acceptedMissions.splice(acceptedIndex, 1);
    }

    return m.reply(formatMessage(MESSAGES.SUCCESS_CANCELLED, {
      title: mission.title
    }));
  }

  // ========== COMANDI ADMIN ==========
  if ((command === 'verifica' || command === 'forzacompleta') && (isAdmin || isROwner)) {
    const [mention, missionNum] = text.split(' ');
    if (!mention || !missionNum) {
      return m.reply(formatMessage(MESSAGES.ERROR_SYNTAX, {
        prefix: usedPrefix,
        command: command
      }));
    }

    const user = String(mention).replace('@', '') + '@s.whatsapp.net';
    if (!global.db.data.users[user]) {
      return m.reply(MESSAGES.ERROR_USER_NOT_FOUND);
    }

    initializeUserData(user);
    const userMissions = global.db.data.users[user].missioni;
    const missionIdx = parseInt(missionNum) - 1;

    if (missionIdx < 0 || missionIdx >= userMissions.attive.length) {
      return m.reply(MESSAGES.ERROR_MISSION_NOT_FOUND);
    }

    const mission = userMissions.attive[missionIdx];
    if (mission.completed) {
      return m.reply(MESSAGES.ERROR_ALREADY_COMPLETED);
    }

    // Completa la missione
    mission.completed = true;
    mission.completedAt = now;
    userMissions.attive.splice(missionIdx, 1);
    userMissions.completate.push(mission);
    userMissions.dolciGuadagnati += mission.reward;
    
    // Aggiungi dolci
    global.db.data.users[user].limit += mission.reward;

    // Rimuove dalle missioni accettate
    const acceptedIndex = userMissions.acceptedMissions.indexOf(mission.id);
    if (acceptedIndex > -1) {
      userMissions.acceptedMissions.splice(acceptedIndex, 1);
    }

    const successType = command === 'forzacompleta' ? 
      'Missione forzatamente completata' : 'Missione verificata';

    return m.reply(
      formatMessage(MESSAGES.SUCCESS_VERIFIED, {
        type: successType,
        user: user.split('@')[0],
        title: mission.title,
        reward: mission.reward,
        total: global.db.data.users[user].limit
      }),
      { mentions: [user] }
    );
  }

  // ========== COMANDO RICARICA MISSIONI ==========
  if (command === 'ricaricamissioni' && (isAdmin || isROwner)) {
    refreshMissions(chatId, now);
    return m.reply(MESSAGES.SUCCESS_MISSIONS_RELOADED);
  }
};

// ========== CONTROLLO PERIODICO MISSIONI SCADUTE ==========
let expiredMissionsInterval;

// Avvia il controllo periodico
if (typeof global !== 'undefined') {
  if (expiredMissionsInterval) {
    clearInterval(expiredMissionsInterval);
  }

  expiredMissionsInterval = setInterval(() => {
    if (global.conn) checkExpiredMissions(global.conn);
    else checkExpiredMissions();
  }, CONFIG.CHECK_INTERVAL);
}

// ========== CONFIGURAZIONE HANDLER ==========
handler.help = [
  ...USER_COMMANDS.map(c => c.cmd.replace(/\s+\[.*\]/, '')),
  ...ADMIN_COMMANDS.map(c => c.cmd.replace(/\s+\[.*\]/, ''))
];

handler.tags = ['rpg'];

handler.command = [
  ...USER_COMMANDS.map(c => c.cmd.split(' ')[0]),
  ...ADMIN_COMMANDS.map(c => c.cmd.split(' ')[0])
].filter((v, i, a) => a.indexOf(v) === i);

export default handler;