let handler = message => message;
const blasphemyTracker = new Map();

handler.all = async function (message) {
  let chatData = global.db.data.chats[message.chat];
  
  if (!message.isGroup) return null;
  
  if (chatData.bestemmiometro && containsBlasphemy(message.text)) {
    const userData = global.db.data.users[message.sender];
    userData.blasphemy = (userData.blasphemy || 0) + 1;
    
    const now = Date.now();
    const userTrack = blasphemyTracker.get(message.sender) || { count: 0, lastTime: 0 };
    
    if (now - userTrack.lastTime > 10000) {
      userTrack.count = 0;
    }
    
    userTrack.count++;
    userTrack.lastTime = now;
    blasphemyTracker.set(message.sender, userTrack);
    
    if (userTrack.count > 2) {
      userData.warn = (userData.warn || 0) + 1;
      
      const fkontak = {
        "key": {
          "participants": "0@s.whatsapp.net",
          "remoteJid": "status@broadcast",
          "fromMe": false,
          "id": "Halo"
        },
        "message": {
          "contactMessage": {
            "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:${message.sender.split('@')[0]};;;\nFN:${message.sender.split('@')[0]}\nitem1.TEL;waid=${message.sender.split('@')[0]}:${message.sender.split('@')[0]}\nitem1.X-ABLabel:Cellulare\nEND:VCARD`
          }
        },
        "participant": "0@s.whatsapp.net"
      };
      
      if (userData.warn <= 2) {
        await conn.sendMessage(message.chat, { 
          text: `@${message.sender.split('@')[0]} ⚠️ Hai ricevuto un avvertimento per spam di bestemmie!\n${userData.warn} warn totali`,
          mentions: [message.sender]
        }, { quoted: fkontak });
      } else {
        userData.warn = 0;
        userData.blasphemy = 0;
        await conn.sendMessage(message.chat, { 
          text: `@${message.sender.split('@')[0]} 💀 Hai superato i 3 avvertimenti! Bestemmie azzerate`,
          mentions: [message.sender]
        }, { quoted: fkontak });
      }
    }
    
    const userMention = `@${message.sender.split('@')[0]} ha tirato ${userData.blasphemy} ${userData.blasphemy === 1 ? 'bestemmia' : 'bestemmie'}`;
    const responseMsg = getBlasphemyResponse(userData);
    await sendBlasphemyMessage(message.chat, userMention + '\n' + responseMsg);
  }
};

const blasphemyResponses = {
  morning: [
    "Colazione con ostie consacrate?",
    "Buongiornissimo... ma non a Dio, eh?",
    "Sveglia così e già in odore di scomunica.",
    "Mannaggia la miseria... e anche a te.",
    "Caffè? No, bestemmie al volo oggi.",
    "Che bel modo di iniziare la giornata... nell'ira divina.",
    "Le preghiere del mattino le saltiamo, vero?",
    "Dio ha già smesso di ascoltarti oggi.",
    "Hai già bestemmiato prima del caffè, complimenti.",
    "Il gallo canta, tu bestemmi.",
    "Il sole sorge e tu offendi il cielo.",
    "Anche oggi la sveglia è una bestemmia.",
    "Dio ti ha tolto la benedizione prima delle 8.",
    "La colazione è più amara con le tue bestemmie.",
    "Hai già fatto arrabbiare un santo stamattina.",
    "Il pane quotidiano? No, la bestemmia quotidiana.",
    "Il buongiorno si vede dal bestemmiare.",
    "Hai già perso la grazia prima delle 9.",
    "Il rosario del mattino lo salti sempre.",
    "Dio ha già spento il telefono stamattina.",
    "Anche la Madonna si è svegliata male per colpa tua.",
    "Il caffè non basta a lavare i tuoi peccati.",
    "Hai già superato il limite mattutino.",
    "Il paradiso apre alle 10, tu sei già fuori.",
    "Hai bestemmiato più del gallo che canta.",
    "Il prete ti aspetta già in confessionale.",
    "Hai fatto bestemmiare anche Alexa.",
    "Il latte è scaduto come la tua fede.",
    "Hai già fatto arrabbiare il parroco.",
    "Il mattino ha l’oro in bocca, tu la bestemmia."
  ],
  afternoon: [
    "Dopo pranzo un rosario? No, bestemmie!",
    "La digestione è difficile... soprattutto per Dio con te.",
    "Si prega alle 15:00, non si bestemmia!",
    "Merenda con pane, nutella e peccati mortali.",
    "Sei il motivo per cui i preti bevono.",
    "Se bestemmi ancora, ti arriva la multa dalla Curia.",
    "Il pomeriggio è lungo, le bestemmie pure.",
    "Hai già superato il limite pomeridiano.",
    "Dio ha spento la luce per non sentirti.",
    "Il parroco fa la pennichella, tu bestemmi.",
    "Hai fatto bestemmiare anche il parroco.",
    "Il sole picchia, tu bestemmi più forte.",
    "La chiesa è chiusa, ma tu continui.",
    "Hai fatto scappare i santi dal calendario.",
    "Il confessionale è già prenotato per te.",
    "Hai bestemmiato anche durante la siesta.",
    "Il parroco ha chiesto ferie per colpa tua.",
    "Hai fatto bestemmiare anche il sagrestano.",
    "Il rosario del pomeriggio è saltato.",
    "Hai fatto arrabbiare anche il vescovo.",
    "Il parroco ti ha bloccato su WhatsApp.",
    "Hai bestemmiato più di una partita a carte.",
    "Il parroco ha chiesto il trasferimento.",
    "Hai fatto bestemmiare anche il campanaro.",
    "Il parroco ha cambiato parrocchia.",
    "Hai fatto bestemmiare anche il sacrestano.",
    "Il parroco ha chiesto aiuto al Papa.",
    "Hai fatto bestemmiare anche il Papa.",
    "Il parroco ha spento il microfono.",
    "Hai fatto bestemmiare anche il diacono."
  ],
  evening: [
    "E stasera preghierina della buonanotte? Macché!",
    "Dio sta già contando quante ne hai dette oggi.",
    "A cena: pane, vino e bestemmie.",
    "Sei la scusa perfetta per un esorcismo.",
    "La Via Crucis? No, la tua chat.",
    "Hai bestemmiato anche a cena.",
    "Il parroco ha spento la luce per non sentirti.",
    "Hai fatto bestemmiare anche il vicino.",
    "Il parroco ha chiuso la chiesa prima.",
    "Hai fatto bestemmiare anche il cane.",
    "Il parroco ha chiesto aiuto ai carabinieri.",
    "Hai fatto bestemmiare anche il gatto.",
    "Il parroco ha spento il campanile.",
    "Hai fatto bestemmiare anche il sindaco.",
    "Il parroco ha chiesto aiuto al vescovo.",
    "Hai fatto bestemmiare anche il sindaco.",
    "Il parroco ha spento il microfono.",
    "Hai fatto bestemmiare anche il diacono.",
    "Il parroco ha chiesto aiuto al Papa.",
    "Hai fatto bestemmiare anche il Papa.",
    "Il parroco ha spento la candela.",
    "Hai fatto bestemmiare anche il sacrestano.",
    "Il parroco ha chiesto aiuto al sagrestano.",
    "Hai fatto bestemmiare anche il sagrestano.",
    "Il parroco ha spento il confessionale.",
    "Hai fatto bestemmiare anche il confessionale.",
    "Il parroco ha chiesto aiuto al confessionale.",
    "Hai fatto bestemmiare anche il confessionale.",
    "Il parroco ha spento la chiesa.",
    "Hai fatto bestemmiare anche la chiesa."
  ],
  night: [
    "Di notte bestemmi? Sei un vampiro eretico?",
    "Metti in pausa l'inferno e dormi, su.",
    "Persino Lucifero a quest'ora riposa.",
    "Se bestemmi di notte, Dio ti manda l'insonnia.",
    "Le bestemmie notturne valgono doppio.",
    "Hai bestemmiato anche nel sonno.",
    "Il parroco sogna le tue bestemmie.",
    "Hai fatto bestemmiare anche i fantasmi.",
    "Il parroco ha spento la chiesa per dormire.",
    "Hai fatto bestemmiare anche il diavolo.",
    "Il parroco ha chiesto aiuto a Satana.",
    "Hai fatto bestemmiare anche Satana.",
    "Il parroco ha spento il lume.",
    "Hai fatto bestemmiare anche il lume.",
    "Il parroco ha chiesto aiuto al lume.",
    "Hai fatto bestemmiare anche il lume.",
    "Il parroco ha spento la candela.",
    "Hai fatto bestemmiare anche la candela.",
    "Il parroco ha chiesto aiuto alla candela.",
    "Hai fatto bestemmiare anche la candela.",
    "Il parroco ha spento il letto.",
    "Hai fatto bestemmiare anche il letto.",
    "Il parroco ha chiesto aiuto al letto.",
    "Hai fatto bestemmiare anche il letto.",
    "Il parroco ha spento la notte.",
    "Hai fatto bestemmiare anche la notte.",
    "Il parroco ha chiesto aiuto alla notte.",
    "Hai fatto bestemmiare anche la notte.",
    "Il parroco ha spento il sogno.",
    "Hai fatto bestemmiare anche il sogno."
  ],
  weekday: {
    monday: [
      "Lunedì e già bestemmi? Che settimana sarà...",
      "Inizia la settimana con un bel peccato!",
      "Dio odia il lunedì quasi quanto te."
    ],
    tuesday: [
      "Martedì grasso... di bestemmie!",
      "Mannaggia Martedì, Mannaggia te."
    ],
    wednesday: [
      "Mercoledì delle ceneri? No, delle bestemmie!",
      "A metà settimana e già in odore di inferno."
    ],
    thursday: [
      "Giovedì santo? Per te Giovedì bestemmioso.",
      "Dio vede e prende appunti per Domenica."
    ],
    friday: [
      "Venerdì Santo... ma non per te!",
      "Sei la croce di Dio il Venerdì."
    ],
    saturday: [
      "Sabato bestemmioso > Sabato sera.",
      "Dio si riposa, tu bestemmi. Coerenza zero."
    ],
    sunday: [
      "Domenica di preghiera? No, di bestemmie!",
      "Oggi è il giorno del Signore... ma tu lo insulti.",
      "Sei la ragione per cui i preti lavorano la Domenica."
    ]
  },
  levels: {
    1: ["Prima bestemmia? Che tenerezza.", "Dio ha segnato il tuo nome... in matita."],
    3: ["Bestemmi come un marinaio ubriaco.", "Sei nella lista dei 'da monitorare' di Dio."],
    5: ["Sei ufficialmente un problema per la Chiesa.", "Dio sta pensando di bloccarti."],
    10: ["Sei la ragione per cui esiste l'Inferno.", "Satana: 'Non lo voglio neanche io.'"],
    20: ["Sei la prova che Dio ha fallito.", "Se bestemmi ancora, il Vaticano ti manda l'FBI."],
    50: ["Sei la reincarnazione di Giuda.", "Dio ha smesso di leggere le tue notifiche."],
    100: ["Sei il motivo per cui Gesù non torna.", "Hai sbloccato: 'Eresia Assoluta'."]
  },
  warn: [
    "Se continui, ti arriva la scomunica via WhatsApp.",
    "Dio: 'Ma perché non lo banniamo?'",
    "Sei nella lista nera del Vaticano.",
    "Se bestemmi ancora, ti arriva il conto delle offerte.",
    "Hai superato il limite divino di bestemmie/minuto."
  ]
};

function getBlasphemyResponse(userData) {
  // Forza orario italiano (Europe/Rome) in modo affidabile
  const nowRome = new Date(new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }));
  const hour = nowRome.getHours();
  const day = nowRome.getDay();
  const total = userData.blasphemy || 0;

  let possibleResponses = [];

  // Risposte per livello bestemmie
  const levels = Object.keys(blasphemyResponses.levels).map(Number).sort((a, b) => b - a);
  for (let level of levels) {
    if (total >= level) {
      possibleResponses.push(...blasphemyResponses.levels[level]);
      break;
    }
  }

  // Risposte per fascia oraria
  if (hour >= 6 && hour < 12) {
    possibleResponses.push(...blasphemyResponses.morning);
  } else if (hour >= 12 && hour < 18) {
    possibleResponses.push(...blasphemyResponses.afternoon);
  } else if (hour >= 18 && hour < 24) {
    possibleResponses.push(...blasphemyResponses.evening);
  } else {
    possibleResponses.push(...blasphemyResponses.night);
  }

  // Risposte per giorno della settimana (aggiunte sempre)
  const weekMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayResponses = blasphemyResponses.weekday[weekMap[day]];
  if (dayResponses) {
    possibleResponses.push(...dayResponses);
  }

  if (possibleResponses.length === 0) possibleResponses.push("Hai bestemmiato, ma non so cosa dire.");

  return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
}

function containsBlasphemy(text) {
  if (!text) return false;

  const sacredWords = ['dio', 'madonna', 'ges[uù]', 'cristo', 'santo', 'padre pio', 'allah', 'maria', 'gESÙ', 'signore'];
  const offensiveWords = ['porc[o0]', 'cane', 'bastard[oi]'];

const regex = new RegExp(
    `(?:${sacredWords.join('|')})(?:.*?|\B)(?:${offensiveWords.join('|')})|` +
    `(?:${offensiveWords.join('|')})(?:.*?|\B)(?:${sacredWords.join('|')})`,
    'gi'
  );

  return regex.test(text) && !isReligiousContext(text);
}

// ❌ Filtra contesti non offensivi (es. "madonna santa", "dio è grande")
function isReligiousContext(text) {
  const neutralPhrases = [
    'madonna santa', 'preghiera', 'amen', 
    'grazie dio', 'santo subito', 'vangelo', 'bibbia',
    'lui', 'lei'
  ];
  return new RegExp(neutralPhrases.join('|'), 'gi').test(text);
}

// 📩 Funzione per inviare il messaggio nel gruppo
async function sendBlasphemyMessage(chatId, text) {
  const template = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: "𝐁𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐨𝐦𝐞𝐭𝐫𝐨",
        jpegThumbnail: Buffer.from(await (await fetch("https://i.ibb.co/ynP4McYh/bestemmiometro.png")).arrayBuffer()),
        vcard: `BEGIN:VCARD...` // Mantieni lo stesso vCard dell'originale
      }
    },
    participant: "0@s.whatsapp.net"
  };
  
  await conn.sendMessage(chatId, { 
    text: text,
    mentions: [...text.matchAll(/@(\d{5,16}|0)/g)].map(m => m[1] + '@s.whatsapp.net')
  }, { quoted: template });
}

export default handler;