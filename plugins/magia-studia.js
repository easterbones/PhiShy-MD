import fs from 'fs/promises'
import Incantesimi from '../lib/incantesimi.js' // rimane per altri scopi eventualmente
import { canLevelUp, xpRange } from '../lib/levelling.js'

// Tempo di cooldown globale per il comando studia (non legato al singolo argomento)
const COOLDOWN_TIME = 60 * 60 * 1000 // 1 ora in millisecondi

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
  return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;
}
6

/**
 * Configurazione per ogni materia (corrispondenti alle materie di Hogwarts)
 * Per ogni materia, l'array contiene oggetti con:
 * - spell: nome dell'incantesimo
 * - xpReq: XP richiesta per sbloccarlo
 */
const materieConfig = {
  luce: [
    { spell: "Lumos", xpReq: 100 },
    { spell: "Lumos Maxima", xpReq: 300 },
    { spell: "Lumos Solem", xpReq: 600 },
    { spell: "Nox", xpReq: 900 }
  ],
  difesa: [
    { spell: "Protego", xpReq: 150 },
    { spell: "Protego Totalum", xpReq: 350 },
    { spell: "Protego Horribilis", xpReq: 600 },
    { spell: "Protego Diabolica", xpReq: 900 },
    { spell: "Expecto Patronum", xpReq: 1200 },
    { spell: "Fianto Duri", xpReq: 1500 },
    { spell: "Repello Muggletum", xpReq: 1800 },
    { spell: "Salvio Hexia", xpReq: 2100 },
    { spell: "Cave Inimicum", xpReq: 2400 }
  ],
  attacco: [
    { spell: "Expelliarmus", xpReq: 100 },
    { spell: "Stupefy", xpReq: 250 },
    { spell: "Petrificus Totalus", xpReq: 400 },
    { spell: "Impedimenta", xpReq: 550 },
    { spell: "Flipendo", xpReq: 700 },
    { spell: "Confringo", xpReq: 850 },
    { spell: "Diffindo", xpReq: 1000 },
    { spell: "Reducto", xpReq: 1150 },
    { spell: "Sectumsempra", xpReq: 1300 },
    { spell: "Langlock", xpReq: 1450 }
  ],
  movimento: [
    { spell: "Wingardium Leviosa", xpReq: 120 },
    { spell: "Locomotor", xpReq: 300 },
    { spell: "Mobiliarbus", xpReq: 480 },
    { spell: "Mobilicorpus", xpReq: 660 },
    { spell: "Depulso", xpReq: 840 },
    { spell: "Ascendio", xpReq: 1020 },
    { spell: "Descendo", xpReq: 1200 },
    { spell: "Carpe Retractum", xpReq: 1380 }
  ],
  trasformazione: [
    { spell: "Vera Verto", xpReq: 130 },
    { spell: "Draconifors", xpReq: 300 },
    { spell: "Lapifors", xpReq: 470 },
    { spell: "Avifors", xpReq: 640 },
    { spell: "Duro", xpReq: 810 },
    { spell: "Reparifarge", xpReq: 980 },
    { spell: "Evanesco", xpReq: 1150 }
  ],
  cura: [
    { spell: "Episkey", xpReq: 110 },
    { spell: "Vulnera Sanentur", xpReq: 250 },
    { spell: "Brackium Emendo", xpReq: 390 },
    { spell: "Anapneo", xpReq: 530 },
    { spell: "Rennervate", xpReq: 670 },
    { spell: "Ferula", xpReq: 810 }
  ],
  maledizioni: [
    { spell: "Avada Kedavra", xpReq: 2000 },
    { spell: "Crucio", xpReq: 1800 },
    { spell: "Imperio", xpReq: 1600 },
    { spell: "Morsmordre", xpReq: 1400 },
    { spell: "Obliviate", xpReq: 1200 },
    { spell: "Confundo", xpReq: 1000 }
  ],
  utilità: [
    { spell: "Accio", xpReq: 90 },
    { spell: "Alohomora", xpReq: 90 },
    { spell: "Aguamenti", xpReq: 180 },
    { spell: "Aresto Momentum", xpReq: 270 },
    { spell: "Colloportus", xpReq: 360 },
    { spell: "Deletrius", xpReq: 450 },
    { spell: "Engorgio", xpReq: 540 },
    { spell: "Reducio", xpReq: 630 },
    { spell: "Erecto", xpReq: 720 },
    { spell: "Finite Incantatem", xpReq: 810 },
    { spell: "Flagrate", xpReq: 900 },
    { spell: "Geminio", xpReq: 990 },
    { spell: "Homenum Revelio", xpReq: 1080 },
    { spell: "Incendio", xpReq: 1170 },
    { spell: "Legilimens", xpReq: 1260 },
    { spell: "Occlumency", xpReq: 1350 },
    { spell: "Muffliato", xpReq: 1440 },
    { spell: "Orchideous", xpReq: 1530 },
    { spell: "Point Me", xpReq: 1620 },
    { spell: "Prior Incantato", xpReq: 1710 },
    { spell: "Quietus", xpReq: 1800 },
    { spell: "Reparo", xpReq: 1890 },
    { spell: "Rictusempra", xpReq: 1980 },
    { spell: "Scourgify", xpReq: 2070 },
    { spell: "Serpensortia", xpReq: 2160 },
    { spell: "Silencio", xpReq: 2250 },
    { spell: "Sonorus", xpReq: 2340 },
    { spell: "Specialis Revelio", xpReq: 2430 },
    { spell: "Tarantallegra", xpReq: 2520 },
    { spell: "Tergeo", xpReq: 2610 },
    { spell: "Waddiwasi", xpReq: 2700 }
  ],
  magiaNera: [
    { spell: "Fiendfyre", xpReq: 2500 },
    { spell: "Horcrux", xpReq: 2400 },
    { spell: "Inferi", xpReq: 2300 },
    { spell: "Liberacorpus", xpReq: 2200 },
    { spell: "Necromanzia", xpReq: 2100 }
  ],
  inventati: [
    // Potresti decidere di aggiungere incantesimi inventati qui in futuro
  ]
}

/**
 * Funzione che gestisce lo studio per una specifica materia.
 * Aggiunge un certo quantitativo di XP alla materia scelta,
 * poi controlla (in base a materieConfig) se sono sbloccabili nuovi incantesimi.
 *
 * @param {Object} subjectData - L'oggetto relativo alla materia dello studente (xp, unlocked)
 * @param {String} subject - Il nome della materia (es. "difesa")
 * @returns {Object} { addedXP, newlyUnlocked } con XP aggiunti e gli incantesimi sbloccati in questa sessione.
 */
function studySubject(subjectData, subject) {
  // Determina un guadagno di XP casuale (per esempio tra 50 e 150 XP)
  const xpGained = Math.floor(Math.random() * 101) + 50
  subjectData.xp += xpGained

  let newlyUnlocked = []
  // Scorri i possibili incantesimi per la materia: se il requisito XP è raggiunto e l'incantesimo
  // non è già stato sbloccato, allora sbloccalo.
  materieConfig[subject].forEach(item => {
    if (subjectData.xp >= item.xpReq && !subjectData.unlocked.includes(item.spell)) {
      subjectData.unlocked.push(item.spell)
      newlyUnlocked.push(item.spell)
    }
  })

  return { addedXP: xpGained, newlyUnlocked }
}
// Parte II: Integrazione nel comando "studia" per le materie

let handler = async (m, { conn, args, usedPrefix, command, isOwner, isPremium }) => {
  let maghiData = {}
 let senderId = m.sender
  let senderName = conn.getName(senderId)
  // Legge il file del database in modo asincrono
  try {
    const data = await fs.readFile('maghi.json', 'utf8')
    maghiData = JSON.parse(data)
  } catch (e) {
    console.error("Errore nel caricamento del database:", e)
    return conn.reply(m.chat, "🔮 Errore nel leggere il database dei maghi!", m)
  }

  if (!maghiData.users) maghiData.users = {}
  let user = maghiData.users[m.sender] || {}

  // Controlla che l'utente sia registrato
  if (!user.registered) {
    return conn.reply(m.chat, "🔮 Devi prima registrarti come mago con !registra per poter studiare!", m)
  }

  // Inizializza le voci delle materie se non presenti
  if (!user.materie) {
    user.materie = {}
    for (const subject in materieConfig) {
      user.materie[subject] = { xp: 0, unlocked: [] }
    }
  }

  // Verifica che l'utente abbia fornito il nome di una materia (esempio: "!studia difesa")
  if (!args[0]) {
    const availableSubjects = Object.keys(materieConfig).join(', ')
    return conn.reply(m.chat, "🔮 Devi specificare una materia da studiare!\nMaterie disponibili: " + availableSubjects, m)
  }

  const subject = args[0].toLowerCase()

  if (!materieConfig.hasOwnProperty(subject)) {
    const availableSubjects = Object.keys(materieConfig).join(', ')
    return conn.reply(m.chat, `🔮 Materia non valida! Scegli una tra: ${availableSubjects}`, m, rcanal)
  }

const currentTime = Date.now();
if (user.lastStudy && (currentTime - user.lastStudy) < COOLDOWN_TIME) {
  const remainingMillis = COOLDOWN_TIME - (currentTime - user.lastStudy);
  const prossimaSessione = new Date(currentTime + remainingMillis);

  // Orario corretto in Italia
  const orarioCorretto = prossimaSessione.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Rome' // FONDAMENTALE
  });

  const remainingTime = msToTime(remainingMillis);
 if (!isOwner && !isPremium) {
  return conn.reply(m.chat, 
    `⏳ Devi aspettare ancora ${remainingTime}\n` +
    `🕒 Potrai studiare di nuovo alle: ${orarioCorretto}`,
    m, rcanal
  );
 }
}

  // Effettua lo studio della materia scelta
  const subjectData = user.materie[subject]
  const { addedXP, newlyUnlocked } = studySubject(subjectData, subject)

  // Aggiorna il timestamp globale dell'ultimo studio (cooldown)
  user.lastStudy = Date.now()

// Costruisce il messaggio di risposta per la materia studiata
let msg = `*📚 RISULTATI DELLO STUDIO IN ${subject.toUpperCase()} 📚*\n\n`
msg += `▸ XP guadagnati: +${addedXP}\n`
msg += `▸ XP totale in ${subject}: ${subjectData.xp}\n`

if (newlyUnlocked.length > 0) {
  msg += `\n🎉 Nuovi incantesimi sbloccati in ${subject}:\n`
  newlyUnlocked.forEach(spell => {
    msg += `▸ ${spell}\n`
  })
}

// Calcola il progresso per sbloccare il prossimo incantesimo (se presente)
const subjectConfig = materieConfig[subject]
let nextSpell;
for (const item of subjectConfig) {
  if (!subjectData.unlocked.includes(item.spell)) {
    nextSpell = item
    break
  }
}
if (nextSpell) {
  const progress = Math.floor((subjectData.xp / nextSpell.xpReq) * 100)
  msg += `\nProgresso per sbloccare "${nextSpell.spell}": ${Math.min(progress, 100)}%\n`
  msg += `${'▣'.repeat(Math.floor(progress / 10))}${'▢'.repeat(10 - Math.floor(progress / 10))}\n`
} else {
  msg += `\nHai sbloccato tutti gli incantesimi disponibili in ${subject}!\n`
}



  // Salva i dati aggiornati sul file JSON
  maghiData.users[m.sender] = user
  try {
    await fs.writeFile('maghi.json', JSON.stringify(maghiData, null, 2))
  } catch (e) {
    console.error("Errore nel salvataggio del database:", e)
    return conn.reply(m.chat, "🔮 Errore nel salvare il database dei maghi!", m)
  }


// Invia il messaggio con l'anteprima (externalAdReply)
await conn.sendMessage(m.chat, {
  text: msg,
  contextInfo: {
    externalAdReply: {
      title: `lezione di ${subject}`,
      body: `ciao ${senderName} 📚`,
      thumbnailUrl: 'https://www.eusemfronteiras.com.br/wp-content/uploads/2023/03/shutterstock_2195696831-scaled.jpg',
      sourceUrl: ''
    }
  }
}, { quoted: m });


  await m.react('📚')
};

handler.help = ['studia <materia>']
handler.tags = ['magia']
handler.command = ['studia', 'impara', 'study']
handler.exp = 0

export default handler
