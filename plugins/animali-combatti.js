// Funzioni di supporto
async function terminaBattaglia(chat, vincitore) {
  if (chat.battaglia) {
    delete chat.battaglia
  }
// ...existing code...

async function applicaEffettoVeleno(m, conn, battaglia, users) {
  if (battaglia.veleno && battaglia.veleno.turniRimanenti > 0) {
    const bersaglio = battaglia.veleno.bersaglio
    const danno = battaglia.veleno.dannoPerTurno
    const fonte = battaglia.veleno.fonte === '1' ? battaglia.giocatore1 : battaglia.giocatore2

    battaglia[`hp${bersaglio}`] = Math.max(0, battaglia[`hp${bersaglio}`] - danno)

    await conn.sendMessage(m.chat, {
      text: `☠️ VELENO! ${conn.getName(fonte)} infligge ${danno} danni passivi!`
    })

    battaglia.veleno.turniRimanenti--

    if (battaglia.veleno.turniRimanenti === 0) {
      delete battaglia.veleno
    }

    if (battaglia[`hp${bersaglio}`] <= 0) {
      let vincitore = bersaglio === '1' ? battaglia.giocatore2 : battaglia.giocatore1
      let sconfitto = bersaglio === '1' ? battaglia.giocatore1 : battaglia.giocatore2

      users[vincitore].exp += 1000
      users[vincitore].limit += 500
      users[sconfitto].exp -= 300

      await conn.sendMessage(m.chat, {
        text: `🏆 *VITTIMA DEL VELENO!* ☠️\n${conn.getName(vincitore)} vince!\n\nPremi:\n🥇 +100 XP e +500 monete\n🥈 +30 XP`,
        mentions: [vincitore, sconfitto]
      })

      terminaBattaglia(global.db.data.chats[m.chat], vincitore)
      return true
    }
  }
  return false
}

async function applicaEffettoAccecamento(battaglia) {
  if (battaglia.accecato && battaglia.accecato.turniRimanenti > 0) {
    battaglia.accecato.turniRimanenti--;
    
    if (battaglia.accecato.turniRimanenti === 0) {
      delete battaglia.accecato;
    }
    
    return Math.random() < 0.5; // 50% di probabilità di mancare
  }
  return false;
}

// Nuova funzione per applicare l'effetto della ragnatela
async function applicaEffettoRagnatela(m, conn, battaglia) {
  if (battaglia.intrappolato) {
    const bersaglio = battaglia.intrappolato.bersaglio
    const attaccante = battaglia.intrappolato.attaccante
    
    // Determina se l'attacco predatorio ha successo
    if (Math.random() < 0.30) { // 15% di probabilità di un attacco fatale
      battaglia[`hp${bersaglio}`] = 0 // Uccisione istantanea
      
      await conn.sendMessage(m.chat, {
        text: `🕷️ ATTACCO PREDATORIO! ${conn.getName(attaccante)} divora completamente l'avversario e vince istantaneamente!`
      })
      
      return true; // Segnala la fine della battaglia
    } else {
      // Calcoliamo un danno maggiorato per l'attacco predatorio
      const dannoBase = attaccante === battaglia.giocatore1 ? 
                     battaglia.stats1.attacco : battaglia.stats2.attacco;
      const danno = Math.floor(dannoBase * 1.8); // Danno maggiorato del 80%
      
      battaglia[`hp${bersaglio}`] = Math.max(0, battaglia[`hp${bersaglio}`] - danno);
      
      await conn.sendMessage(m.chat, {
        text: `🕸️ COSI VICINO! ${conn.getName(attaccante)} attacca la preda intrappolata e infligge ${danno} danni!`
      })
      
      delete battaglia.intrappolato; // Libera l'avversario dalla trappola
      
      // Verifica se la battaglia è finita
      if (battaglia[`hp${bersaglio}`] <= 0) {
        return true; // Segnala la fine della battaglia
      // ...existing code...
    }
  }
  return false;
// ...existing code...

const scenari = [
  { nome: 'Foresta Magica', perk: 'velocita', malus: 'difesa', meteo: 'pioggia', effetto: (battaglia) => { battaglia.stats1.velocita += 10; battaglia.stats2.velocita += 10; } },
  { nome: 'Deserto Infuocato', perk: 'attacco', malus: 'velocita', meteo: 'sole', effetto: (battaglia) => { battaglia.stats1.attacco += 15; battaglia.stats2.attacco += 15; battaglia.stats1.velocita -= 10; battaglia.stats2.velocita -= 10; } },
  { nome: 'Montagna Ventosa', perk: 'difesa', malus: 'attacco', meteo: 'vento', effetto: (battaglia) => { battaglia.stats1.difesa += 20; battaglia.stats2.difesa += 20; battaglia.stats1.attacco -= 10; battaglia.stats2.attacco -= 10; } },
  { nome: 'Lago Nebbioso', perk: 'velocita', malus: 'attacco', meteo: 'nebbia', effetto: (battaglia) => { battaglia.stats1.velocita += 15; battaglia.stats2.velocita += 15; battaglia.stats1.attacco -= 10; battaglia.stats2.attacco -= 10; } },
  { nome: 'Città Notturna', perk: 'cura', malus: 'difesa', meteo: 'notte', effetto: (battaglia) => { battaglia.stats1.difesa -= 10; battaglia.stats2.difesa -= 10; } },
  { nome: 'Spiaggia Tempestosa', perk: 'attacco', malus: 'cura', meteo: 'tempesta', effetto: (battaglia) => { battaglia.stats1.attacco += 10; battaglia.stats2.attacco += 10; } },
  { nome: 'Prateria Serena', perk: 'cura', malus: 'velocita', meteo: 'sereno', effetto: (battaglia) => { battaglia.stats1.cura = (battaglia.stats1.cura || 0) + 10; battaglia.stats2.cura = (battaglia.stats2.cura || 0) + 10; battaglia.stats1.velocita -= 5; battaglia.stats2.velocita -= 5; } },
  { nome: 'Ghiacciaio Artico', perk: 'difesa', malus: 'cura', meteo: 'neve', effetto: (battaglia) => { battaglia.stats1.difesa += 15; battaglia.stats2.difesa += 15; battaglia.stats1.cura = (battaglia.stats1.cura || 0) - 10; battaglia.stats2.cura = (battaglia.stats2.cura || 0) - 10; } },
  { nome: 'Vulcano Attivo', perk: 'attacco', malus: 'difesa', meteo: 'lava', effetto: (battaglia) => { battaglia.stats1.attacco += 20; battaglia.stats2.attacco += 20; battaglia.stats1.difesa -= 15; battaglia.stats2.difesa -= 15; } },
  { nome: 'Palude Oscura', perk: 'velocita', malus: 'cura', meteo: 'umidità', effetto: (battaglia) => { battaglia.stats1.velocita += 5; battaglia.stats2.velocita += 5; battaglia.stats1.cura = (battaglia.stats1.cura || 0) - 5; battaglia.stats2.cura = (battaglia.stats2.cura || 0) - 5; } }
]

function scegliScenario(battaglia) {
  const scenario = scenari[Math.floor(Math.random() * scenari.length)]
  battaglia.scenario = scenario
  scenario.effetto(battaglia)
}

const azioniDisponibili = ['attacca', 'cura', 'speciale', 'difendi', 'schiva', 'provoca', 'carica', 'analizza']
const cooldownSpeciale = {
  cane: 3,
  gatto: 2,
  coniglio: 2,
  drago: 4,
  cavallo: 3,
  riccio: 2,
  pesce: 2,
  piccione: 2,
  serpente: 3,
  scoiattolo: 2,
  polpo: 2,
  ragno: 3,
  scorpione: 3
}

// Handler principale
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let users = global.db.data.users
  let chat = global.db.data.chats[m.chat]
  let mittente = m.sender

  if (command === 'termina' || command === 'fine') {
    if (!chat.battaglia) {
      return conn.reply(m.chat, '⚠️ Nessuna battaglia in corso!', m)
    }
    
    // Correzione del controllo permessi: verifica se l'utente è giocatore, admin o owner
    const isAdmin = m.isGroupAdmin || m.isROwner || m.fromMe || '393534409026@s.whatsapp.net'
    const isPlayer = [chat.battaglia.giocatore1, chat.battaglia.giocatore2].includes(mittente)
    
    if (!isPlayer && !isAdmin) {
      return conn.reply(m.chat, '🚫 Solo i giocatori, admin o owner possono terminare!', m)
    }
    
    if (chat.battaglia.timer) clearTimeout(chat.battaglia.timer);
    
    await conn.sendMessage(m.chat, { 
      text: `🛑 Battaglia terminata da ${conn.getName(mittente)}!` 
    })
    terminaBattaglia(chat, null)
    return
  }

  if (command === 'combatti' || command === 'sfida') {
    if (chat.battaglia) {
      return conn.reply(m.chat, '⚠️ Battaglia già in corso!', m)
    }

    let avversario = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null
    if (!avversario) {
      return conn.reply(m.chat, `🚫 Devi menzionare un utente!\nEsempio: ${usedPrefix}combatti @utente`, m, rcanal)
    }

    if (avversario === mittente) {
      return conn.reply(m.chat, '🤨 Non puoi sfidare te stesso!', m, rcanal)
    }

    chat.battaglia = {
      fase: 'selezione1',
      giocatore1: mittente,
      giocatore2: avversario,
      animale1: null,
      animale2: null,
      hp1: null,
      hp2: null,
      turno: null,
      timer: null
    }
    // Mostra solo animali posseduti dal primo giocatore
    let animaliValidi = ['cane', 'gatto', 'coniglio', 'drago', 'serpente', 'riccio', 'pesce', 'cavallo', 'piccione', 'scoiattolo', 'polpo', 'ragno', 'scorpione']
    let animaliPosseduti1 = animaliValidi.filter(a => users[mittente][a])
    conn.reply(m.chat, `⚔️ ${conn.getName(mittente)}, scegli il tuo animale con *scegli [animale]*\nDisponibili: ${animaliPosseduti1.join(', ')}`,
      m, { mentions: [mittente] })
  }
}

handler.before = async (m, { conn }) => {
  let chat = global.db.data.chats[m.chat]
  let users = global.db.data.users
  let mittente = m.sender
  let testo = m.text.toLowerCase()

  if (!chat.battaglia) return

  // Mostra solo animali posseduti dall'utente
  if (testo.startsWith('.scegli ')) {
    let animale = testo.split(' ')[1]
    let animaliValidi = ['cane', 'gatto', 'coniglio', 'drago', 'serpente', 'riccio', 'pesce', 'cavallo', 'piccione', 'scoiattolo', 'polpo', 'ragno', 'scorpione']
    let animaliPosseduti = animaliValidi.filter(a => users[mittente][a])
    if (!animaliPosseduti.includes(animale)) {
      return conn.reply(m.chat, `🚫 Animale non valido! Scegli tra: ${animaliPosseduti.join(', ')}`, m)
    }

    if (chat.battaglia.fase === 'selezione1' && mittente === chat.battaglia.giocatore1) {
      chat.battaglia.animale1 = animale
      chat.battaglia.fase = 'selezione2'
      
      // Mostra le caratteristiche dell'animale scelto
      const stats = {
      cane: { hp: 140, attacco: 35, difesa: 55, velocita: 60 },
    gatto: { hp: 95, attacco: 60, difesa: 45, velocita: 85 },
    coniglio: { hp: 75, attacco: 45, difesa: 40, velocita: 100 },
    drago: { hp: 160, attacco: 80, difesa: 60, velocita: 55 },
    cavallo: { hp: 130, attacco: 65, difesa: 65, velocita: 75 },
    riccio: { hp: 110, attacco: 50, difesa: 90, velocita: 35 },
    pesce: { hp: 85, attacco: 50, difesa: 45, velocita: 80 },
    piccione: { hp: 70, attacco: 40, difesa: 40, velocita: 95 },
    serpente: { hp: 90, attacco: 70, difesa: 45, velocita: 75 },
    scoiattolo: { hp: 60, attacco: 40, difesa: 35, velocita: 105 },
    polpo: { hp: 95, attacco: 55, difesa: 40, velocita: 75 },
    ragno: { hp: 85, attacco: 60, difesa: 70, velocita: 65 },
    scorpione: { hp: 90, attacco: 75, difesa: 55, velocita: 70 }
  }
      const emoji = {
        cane: '🐶', gatto: '🐱', coniglio: '🐰', drago: '🐉',
        cavallo: '🐎', riccio: '🦔', pesce: '🐟', 
        piccione: '🐦‍⬛', serpente: '🐍', scoiattolo: '🐿️', polpo: '🦑',
         scorpione: '🦂', ragno: '🕷️'
      }
      
      conn.reply(m.chat, `⚔️ ${conn.getName(chat.battaglia.giocatore1)} ha scelto ${emoji[animale]} ${animale.toUpperCase()}!\n\nStats:\n❤️ HP: ${stats[animale].hp}\n⚔️ Attacco: ${stats[animale].attacco}\n🛡️ Difesa: ${stats[animale].difesa}\n💨 Velocità: ${stats[animale].velocita}\n\n${conn.getName(chat.battaglia.giocatore2)}, ora tocca a te! Scegli con *.scegli [animale]*`, m, {
        mentions: [chat.battaglia.giocatore2]
      })
    } 
    else if (chat.battaglia.fase === 'selezione2' && mittente === chat.battaglia.giocatore2) {
      chat.battaglia.animale2 = animale
      chat.battaglia.fase = 'battaglia'
      
      // Mostra le caratteristiche dell'animale scelto per il secondo giocatore prima dell'inizio
      const stats = {
   cane: { hp: 140, attacco: 35, difesa: 55, velocita: 60 },
    gatto: { hp: 95, attacco: 60, difesa: 45, velocita: 85 },
    coniglio: { hp: 75, attacco: 45, difesa: 40, velocita: 100 },
    drago: { hp: 160, attacco: 80, difesa: 60, velocita: 55 },
    cavallo: { hp: 130, attacco: 65, difesa: 65, velocita: 75 },
    riccio: { hp: 110, attacco: 50, difesa: 90, velocita: 35 },
    pesce: { hp: 85, attacco: 50, difesa: 45, velocita: 80 },
    piccione: { hp: 70, attacco: 40, difesa: 40, velocita: 95 },
    serpente: { hp: 90, attacco: 70, difesa: 45, velocita: 75 },
    scoiattolo: { hp: 60, attacco: 40, difesa: 35, velocita: 105 },
    polpo: { hp: 95, attacco: 55, difesa: 40, velocita: 75 },
    ragno: { hp: 85, attacco: 60, difesa: 70, velocita: 65 },
    scorpione: { hp: 90, attacco: 75, difesa: 55, velocita: 70 }
  }
      
      const emoji = {
        cane: '🐶', gatto: '🐱', coniglio: '🐰', drago: '🐉',
        cavallo: '🐎', riccio: '🦔', pesce: '🐟', 
        piccione: '🐦‍⬛', serpente: '🐍', scoiattolo: '🐿️', polpo: '🦑',
        ragno: '🕷️', scorpione: '🦂'
      }
      
      await conn.reply(m.chat, `⚔️ ${conn.getName(chat.battaglia.giocatore2)} ha scelto ${emoji[animale]} ${animale.toUpperCase()}!\n\nStats:\n❤️ HP: ${stats[animale].hp}\n⚔️ Attacco: ${stats[animale].attacco}\n🛡️ Difesa: ${stats[animale].difesa}\n💨 Velocità: ${stats[animale].velocita}`, m)
      
      // Avvia battaglia dopo una breve pausa
      setTimeout(() => {
        iniziaBattaglia(m, conn)
      }, 1500)
    }
  }

  if (chat.battaglia.fase === 'battaglia' && ['attacca', 'cura', 'speciale'].includes(testo)) {
    let giocatoreCorrente = chat.battaglia.turno === 1 ? chat.battaglia.giocatore1 : chat.battaglia.giocatore2
    if (mittente !== giocatoreCorrente) return

    processaMossa(m, conn, testo)
  }
}

// Quando inizia la battaglia, scegli scenario e mostra info
async function iniziaBattaglia(m, conn) {
  let chat = global.db.data.chats[m.chat]
  let battaglia = chat.battaglia
  scegliScenario(battaglia)
  let scenario = battaglia.scenario
  let nome1 = conn.getName(battaglia.giocatore1)
  let nome2 = conn.getName(battaglia.giocatore2)

  // Emoji e statistiche animali - riequilibrate
  const emoji = {
    cane: '🐶', gatto: '🐱', coniglio: '🐰', drago: '🐉',
    cavallo: '🐎', riccio: '🦔', pesce: '🐟', 
    piccione: '🐦‍⬛', serpente: '🐍', scoiattolo: '🐿️',
    polpo: '🦑', ragno: '🕷️', scorpione: '🦂'
  }

  const stats = {
    cane: { hp: 140, attacco: 35, difesa: 55, velocita: 60 },
    gatto: { hp: 95, attacco: 60, difesa: 45, velocita: 85 },
    coniglio: { hp: 75, attacco: 45, difesa: 40, velocita: 100 },
    drago: { hp: 160, attacco: 80, difesa: 60, velocita: 55 },
    cavallo: { hp: 130, attacco: 65, difesa: 65, velocita: 75 },
    riccio: { hp: 110, attacco: 50, difesa: 90, velocita: 35 },
    pesce: { hp: 85, attacco: 50, difesa: 45, velocita: 80 },
    piccione: { hp: 70, attacco: 40, difesa: 40, velocita: 95 },
    serpente: { hp: 90, attacco: 70, difesa: 45, velocita: 75 },
    scoiattolo: { hp: 60, attacco: 40, difesa: 35, velocita: 105 },
    polpo: { hp: 95, attacco: 55, difesa: 40, velocita: 75 },
    ragno: { hp: 85, attacco: 60, difesa: 70, velocita: 65 },
    scorpione: { hp: 90, attacco: 75, difesa: 55, velocita: 70 }
  }

  // Recupera i nomi personalizzati se presenti
  const users = global.db.data.users;
  let nomeAnimale1 = battaglia.animale1;
  let nomeAnimale2 = battaglia.animale2;
  if (users[battaglia.giocatore1] && typeof users[battaglia.giocatore1][battaglia.animale1] === 'object' && Array.isArray(users[battaglia.giocatore1][battaglia.animale1]?.nomi) && users[battaglia.giocatore1][battaglia.animale1].nomi.length > 0) {
    nomeAnimale1 = users[battaglia.giocatore1][battaglia.animale1].nomi[0];
  }
  if (users[battaglia.giocatore2] && typeof users[battaglia.giocatore2][battaglia.animale2] === 'object' && Array.isArray(users[battaglia.giocatore2][battaglia.animale2]?.nomi) && users[battaglia.giocatore2][battaglia.animale2].nomi.length > 0) {
    nomeAnimale2 = users[battaglia.giocatore2][battaglia.animale2].nomi[0];
  }

  battaglia.stats1 = stats[battaglia.animale1]
  battaglia.stats2 = stats[battaglia.animale2]
  
  // Imposta HP specifici per ciascun animale
  battaglia.hp1 = battaglia.stats1.hp
  battaglia.hp2 = battaglia.stats2.hp
  
  // Determina il primo turno in base alla velocità
  battaglia.turno = battaglia.stats1.velocita > battaglia.stats2.velocita ? 1 : 
                    battaglia.stats1.velocita < battaglia.stats2.velocita ? 2 : 
                    Math.random() < 0.5 ? 1 : 2;

  let primoGiocatore = battaglia.turno === 1 ? nome1 : nome2
  let primoAnimale = battaglia.turno === 1 ? nomeAnimale1 : nomeAnimale2

  await conn.sendMessage(m.chat, {
    text: `⚔️ *INIZIO BATTAGLIA!* ⚔️\n\nScenario: ${scenario.nome} | Meteo: ${scenario.meteo}\nEffetti: perk ${scenario.perk}, malus ${scenario.malus}\n\n` +
          `${nome1}: ${emoji[battaglia.animale1]} ${nomeAnimale1.toUpperCase()} (HP: ${battaglia.hp1}/${battaglia.stats1.hp})\n` +
          `${nome2}: ${emoji[battaglia.animale2]} ${nomeAnimale2.toUpperCase()} (HP: ${battaglia.hp2}/${battaglia.stats2.hp})\n\n` +
          `Inizia ${primoGiocatore} con ${emoji[battaglia.turno === 1 ? battaglia.animale1 : battaglia.animale2]} ${primoAnimale} grazie alla sua velocità (${battaglia.turno === 1 ? battaglia.stats1.velocita : battaglia.stats2.velocita})!\n\n` +
          `Azioni disponibili: ${azioniDisponibili.join(', ')}`,
    mentions: [battaglia.turno === 1 ? battaglia.giocatore1 : battaglia.giocatore2],
    buttons: azioniDisponibili.map(a => ({buttonId: a, buttonText: {displayText: a.charAt(0).toUpperCase() + a.slice(1)}, type: 1}))
  })

  // Imposta un timer più lungo (5 minuti)
  if (battaglia.timer) clearTimeout(battaglia.timer);
  battaglia.timer = setTimeout(() => {
    if (chat.battaglia && chat.battaglia.fase === 'battaglia') {
      conn.sendMessage(m.chat, { text: '⏳ Tempo scaduto! La battaglia termina in pareggio.' })
      terminaBattaglia(chat, null)
    }
  }, 300000) // 5 minuti
}

async function processaMossa(m, conn, mossa) {
  let chat = global.db.data.chats[m.chat]
  let battaglia = chat.battaglia
  let users = global.db.data.users
  let mittente = m.sender

  let finitoPerVeleno = await applicaEffettoVeleno(m, conn, battaglia, users)
  if (finitoPerVeleno) return
  
  // Verifica se il ragno deve applicare l'effetto della ragnatela
  if (battaglia.intrappolato) {
    const finitoPerRagnatela = await applicaEffettoRagnatela(m, conn, battaglia);
    if (finitoPerRagnatela) {
      let vincitore = battaglia.intrappolato.attaccante;
      let sconfitto = battaglia.intrappolato.bersaglio === '1' ? battaglia.giocatore1 : battaglia.giocatore2;
      
      users[vincitore].exp += 150;
      users[vincitore].limit += 600;
      users[sconfitto].exp += 30;
      
      await conn.sendMessage(m.chat, {
        text: `🏆 *VITTORIA DEL PREDATORE!* 🕷️\n${conn.getName(vincitore)} vince!\n\nPremi:\n🥇 +150 XP e +600 dolci\n🥈 +30 XP`,
        mentions: [vincitore, sconfitto]
      });
      
      terminaBattaglia(global.db.data.chats[m.chat], vincitore);
      return;
    }
  }
  
  let attaccante = battaglia.turno === 1 ? '1' : '2'
  let difensore = battaglia.turno === 1 ? '2' : '1'

  let nomeGiocatore = conn.getName(mittente)
  let nomeAvversario = conn.getName(attaccante === '1' ? battaglia.giocatore2 : battaglia.giocatore1)

  let animale = attaccante === '1' ? battaglia.animale1 : battaglia.animale2
  let animaleAvversario = difensore === '1' ? battaglia.animale1 : battaglia.animale2

  // Controlla se il giocatore è stordito
  if (battaglia.stordito === attaccante) {
    delete battaglia.stordito
    await conn.sendMessage(m.chat, {
      text: `😵 ${nomeGiocatore} è stordito e perde il turno!`
    })
    battaglia.turno = battaglia.turno === 1 ? 2 : 1
    
    // Notifica prossimo turno
    let prossimoGiocatore = battaglia.turno === 1 ? battaglia.giocatore1 : battaglia.giocatore2
    await conn.sendMessage(m.chat, {
      text: `🔄 Turno di ${conn.getName(prossimoGiocatore)}!\nUsa *attacca*, *cura* o *speciale*`,
      mentions: [prossimoGiocatore]
    })
    return
  }

  const emoji = {
    cane: '🐶', gatto: '🐱', coniglio: '🐰', drago: '🐉',
    cavallo: '🐎', riccio: '🦔', pesce: '🐟', 
    piccione: '🐦‍⬛', serpente: '🐍', scoiattolo: '🐿️',
    polpo: '🦑', ragno: '🕷️', scorpione: '🦂'
  }

  let testoRisultato = ''
  let danno = 0
  
  // Controlla se l'avversario schiva l'attacco
  if (battaglia.schivaProssimoAttacco === difensore && (mossa === 'attacca' || mossa === 'speciale')) {
    delete battaglia.schivaProssimoAttacco
    await conn.sendMessage(m.chat, {
      text: `🐰 ${nomeAvversario} schiva l'attacco!`
    })
    
    battaglia.turno = battaglia.turno === 1 ? 2 : 1
    
    // Notifica prossimo turno
    let prossimoGiocatore = battaglia.turno === 1 ? battaglia.giocatore1 : battaglia.giocatore2
    await conn.sendMessage(m.chat, {
      text: `🔄 Turno di ${conn.getName(prossimoGiocatore)}!\nUsa *attacca*, *cura* o *speciale*`,
      mentions: [prossimoGiocatore]
    })
    return
  }
  
  // Controlla effetto accecamento (solo per attacchi)
  if ((mossa === 'attacca' || mossa === 'speciale') && battaglia.accecato && 
      battaglia.accecato.bersaglio === attaccante) {
    
    const manca = await applicaEffettoAccecamento(battaglia);
    
    if (manca) {
      await conn.sendMessage(m.chat, {
        text: `👁️ ${nomeGiocatore} è accecato e manca il bersaglio!`
      });
      
      battaglia.turno = battaglia.turno === 1 ? 2 : 1;
      let prossimoGiocatore = battaglia.turno === 1 ? battaglia.giocatore1 : battaglia.giocatore2;
      
      await conn.sendMessage(m.chat, {
        text: `🔄 Turno di ${conn.getName(prossimoGiocatore)}!\nUsa *attacca*, *cura* o *speciale*`,
        mentions: [prossimoGiocatore]
      });
      return;
    }
  }

  switch (mossa) {
    case 'attacca':
      let attacco = attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco
      let difesa = difensore === '1' ? battaglia.stats1.difesa : battaglia.stats2.difesa
      
      // Formula migliore per il calcolo del danno, tiene conto della difesa
      danno = Math.max(5, Math.floor(attacco * (0.7 + Math.random() * 0.6) - difesa * 0.5))
      battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - danno)
      
      testoRisultato = `💥 ${nomeGiocatore} attacca con ${emoji[animale]} ${animale}!\nInfligge ${danno} danni!\n\nHP:\n${emoji[battaglia.animale1]} ${battaglia.animale1}: ${battaglia.hp1}/${battaglia.stats1.hp}\n${emoji[battaglia.animale2]} ${battaglia.animale2}: ${battaglia.hp2}/${battaglia.stats2.hp}`
      break
      
        case 'riccio':
          // Migliorata in base alla difesa
          dannoAbilita = Math.floor(10 + Math.random() * 8 + (attaccante === '1' ? battaglia.stats1.difesa : battaglia.stats2.difesa) * 0.3)
          battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita)
          // Aumenta difesa e recupera HP
          let curaRiccio = Math.floor(15 + (attaccante === '1' ? battaglia.stats1.difesa : battaglia.stats2.difesa) * 0.2)
          battaglia[`hp${attaccante}`] = Math.min(
            attaccante === '1' ? battaglia.stats1.hp : battaglia.stats2.hp,
            battaglia[`hp${attaccante}`] + curaRiccio
          )
          effettoAbilita = `🦔 RICCIO DIFENSIVO! Infligge ${dannoAbilita} danni, recupera ${curaRiccio} HP e aumenta difesa!`
          break
      }
    }
    // ...existing code...
}
      // Abilità speciali uniche
      switch (animale) {
        case 'cane':
          // Potenziato in base alla statistica di attacco
          dannoAbilita = Math.floor(15 + Math.random() * 20 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.5)
          battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita)
          effettoAbilita = `🦷 MORSO POTENTE! Infligge ${dannoAbilita} danni!`
          break
          
        case 'serpente':
          // Il veleno è più efficace e dura più a lungo
          dannoAbilita = Math.floor(15 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.4)
          battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita)
          battaglia.veleno = {
            bersaglio: difensore,
            dannoPerTurno: Math.floor(8 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.15),
            turniRimanenti: 3,
            fonte: attaccante
          }
          effettoAbilita = `🐍 MORSO VELENOSO! Infligge ${dannoAbilita} danni + veleno per 3 turni!`
          break
          
        // Nuovo animale: Scorpione
        case 'scorpione':
          dannoAbilita = Math.floor(12 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.3)
          battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita)
          battaglia.veleno = {
            bersaglio: difensore,
            dannoPerTurno: Math.floor(10 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.2),
            turniRimanenti: 4,
            fonte: attaccante
          }
          effettoAbilita = `🦂 PUNGIGLIONE VELENOSO! Infligge ${dannoAbilita} danni + veleno potente per 4 turni!`
          break
          
        case 'polpo':
          // 60% di probabilità di accecare, modificato in base alla velocità
          const probAccecamento = 0.4 + (attaccante === '1' ? battaglia.stats1.velocita : battaglia.stats2.velocita) / 500;
          const accecato = Math.random() < probAccecamento;
          
          if (accecato) {
            battaglia.accecato = {
              bersaglio: difensore,
              turniRimanenti: 2
            };
            effettoAbilita = `🦑 LANCIO DI INCHIOSTRO! L'avversario è accecato per 2 turni (50% di mancare gli attacchi)!`;
          } else {
            // Attacco multiplo più potente
            const tentacoli = Math.floor(Math.random() * 3) + 2; // 2-4 colpi
            let dannoTotale = 0;
            
            for (let i = 0; i < tentacoli; i++) {
              const dannoTentacolo = Math.floor(4 + Math.random() * 8 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.1);
              battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoTentacolo);
              dannoTotale += dannoTentacolo;
            }
            
            effettoAbilita = `🦑 ATTACCO MULTIPLO! ${tentacoli} colpi di tentacolo per ${dannoTotale} danni totali!`;
          }
          break;
          
        // Nuovo animale: Ragno  
        case 'ragno':
          const probIntrappolamento = 0.7; // 70% probabilità di intrappolare
          if (Math.random() < probIntrappolamento) {
            battaglia.intrappolato = {
              bersaglio: difensore,
              attaccante: attaccante === '1' ? battaglia.giocatore1 : battaglia.giocatore2
            };
            effettoAbilita = `🕸️ RAGNATELA! L'avversario è intrappolato! ${nomeGiocatore} mantiene il turno!`;
            
            // Il ragno mantiene il turno per un attacco predatorio
            battaglia.turniExtra = (battaglia.turniExtra || 0) + 1;
          } else {
            // Se fallisce l'intrappolamento fa un danno base
            dannoAbilita = Math.floor(10 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.3);
            battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita);
            effettoAbilita = ` AVVERSARIO GRAVEMENTE FERITO, 🕷️Infligge ${dannoAbilita} danni!`;
          }
          break;
          
        case 'gatto':
          // Il danno e la cura dipendono dalla velocità del gatto
          dannoAbilita = Math.floor(10 + Math.random() * 10 + (attaccante === '1' ? battaglia.stats1.velocita : battaglia.stats2.velocita) * 0.2)
          battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita)
          let autoCura = Math.floor(8 + Math.random() * 5 + (attaccante === '1' ? battaglia.stats1.velocita : battaglia.stats2.velocita) * 0.1)
          battaglia[`hp${attaccante}`] = Math.min(
            attaccante === '1' ? battaglia.stats1.hp : battaglia.stats2.hp,
            battaglia[`hp${attaccante}`] + autoCura
          )
          effettoAbilita = `😼 GRAFFIO VELOCE! Infligge ${dannoAbilita} danni e cura ${autoCura} HP!`
          break
          
        case 'coniglio': {
          // Probabilità di schivata aumentata in base alla velocità
          let probabilitaBase = 0.6;
          let bonusVelocita = (attaccante === '1' ? battaglia.stats1.velocita : battaglia.stats2.velocita) / 300;
          let probabilitaSchivata = Math.min(0.9, probabilitaBase + bonusVelocita);
          
          if (Math.random() < probabilitaSchivata) {
            effettoAbilita = `🐰 AGILITÀ! Schiva il prossimo attacco!`
            battaglia.schivaProssimoAttacco = attaccante
          } else {
            effettoAbilita = `🐰 AGILITÀ! Nessun effetto questa volta...`
          }
          break
        }
          
        case 'drago':
          // Danno basato sull'attacco
          dannoAbilita = Math.floor(20 + Math.random() * 15 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.6)
          battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita)
          effettoAbilita = `🐉 SOFFIO DI FUOCO! Infligge ${dannoAbilita} danni devastanti!`
          break
          
        case 'cavallo':
          // Calcio più potente e stordimento basato sulla forza
          dannoAbilita = Math.floor(15 + Math.random() * 10 + (attaccante === '1' ? battaglia.stats1.attacco : battaglia.stats2.attacco) * 0.4)
          battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita)
          effettoAbilita = `🐎 CALCIO POTENTE! Infligge ${dannoAbilita} danni e stordisce!`
          battaglia.stordito = difensore
          break
          
        case 'riccio':
          // Migliorata in base alla difesa
          dannoAbilita = Math.floor(10 + Math.random() * 8 + (attaccante === '1' ? battaglia.stats1.difesa : battaglia.stats2.difesa) * 0.3)
          battaglia[`hp${difensore}`] = Math.max(0, battaglia[`hp${difensore}`] - dannoAbilita)
          
          // Aumenta difesa e recupera HP
          let curaRiccio = Math.floor(15 + (attaccante === '1' ? battaglia.stats1.difesa : battaglia.stats2.difesa) * 0.2)
          battaglia[`hp${attaccante}`] = Math.min(
            attaccante === '1' ? battaglia.stats1.hp : battaglia.stats2.hp,
            battaglia[`hp${attaccante}`] + curaRiccio
          )
          

          effettoAbilita = `🦔 RICCIO DIFENSIVO! Infligge ${dannoAbilita} danni, recupera ${curaRiccio} HP e aumenta difesa!`
          break
        }
      // ...existing code...
      }

  // Controllo fine battaglia
  if (battaglia.hp1 <= 0 || battaglia.hp2 <= 0) {
    let vincitore = battaglia.hp1 <= 0 ? battaglia.giocatore2 : battaglia.giocatore1
    let sconfitto = battaglia.hp1 <= 0 ? battaglia.giocatore1 : battaglia.giocatore2
    let animaleVincente = battaglia.hp1 <= 0 ? battaglia.animale2 : battaglia.animale1
    
    // Premi basati sulle statistiche dell'animale vincente
    const statsVincente = battaglia.hp1 <= 0 ? battaglia.stats2 : battaglia.stats1;
    const bonusExp = Math.floor(statsVincente.attacco * 0.5 + statsVincente.velocita * 0.3);
    const bonusLimit = Math.floor(statsVincente.attacco * 3 + statsVincente.velocita * 2);
    
    users[vincitore].exp += 100 + bonusExp
    users[vincitore].limit += 500 + bonusLimit
    users[sconfitto].exp += 30
    
    await conn.sendMessage(m.chat, {
      text: `🏆 *BATTAGLIA CONCLUSA!* 🏆\n\n${conn.getName(vincitore)} vince con ${emoji[animaleVincente]} ${animaleVincente.toUpperCase()}!\n\nPremi:\n🥇 Vincitore: +${100 + bonusExp} XP e +${500 + bonusLimit} dolci\n🥈 Sconfitto: +30 XP`,
      mentions: [vincitore, sconfitto]
    })
    
    if (battaglia.timer) clearTimeout(battaglia.timer);
    terminaBattaglia(chat, vincitore)
    return
  }

  // Gestione turni extra (scoiattolo)
  if (battaglia.turniExtra && battaglia.turniExtra > 0) {
    battaglia.turniExtra--
    await conn.sendMessage(m.chat, {
      text: `${emoji[animale]} ${nomeGiocatore} ottiene un altro turno!`,
      mentions: [mittente]
    })
  } else {
    battaglia.turno = battaglia.turno === 1 ? 2 : 1
  }

  // Notifica prossimo turno
  let prossimoGiocatore = battaglia.turno === 1 ? battaglia.giocatore1 : battaglia.giocatore2
  await conn.sendMessage(m.chat, {
    text: `🔄 Turno di ${conn.getName(prossimoGiocatore)}!\nUsa *attacca*, *cura* o *speciale*`,
    mentions: [prossimoGiocatore]
  })
}

// Aggiunta della funzione per usare l'abilità speciale
async function usaAbilitaSpeciale(m, conn, battaglia, giocatore) {
  const nomeGiocatore = giocatore === '1' ? battaglia.giocatore1 : battaglia.giocatore2;
  const stats = giocatore === '1' ? battaglia.stats1 : battaglia.stats2;

  if (battaglia[`caricaSpeciale${giocatore}`] < 3) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ ${conn.getName(nomeGiocatore)}, devi caricare la tua abilità speciale attaccando almeno 3 volte!`
    });
  }

  // Esempio di abilità speciale modificata per l'uccello
  if (stats.animale === 'uccello') {
    const danno = Math.floor(stats.attacco * 2);
    const bersaglio = giocatore === '1' ? '2' : '1';
    battaglia[`hp${bersaglio}`] = Math.max(0, battaglia[`hp${bersaglio}`] - danno);

    conn.sendMessage(m.chat, {
      text: `🦅 ${conn.getName(nomeGiocatore)} usa *Volo Rapace*! Infligge ${danno} danni all'avversario!`
    });

    battaglia[`caricaSpeciale${giocatore}`] = 0; // Resetta la carica speciale
  }
}

// Funzione per generare un campo di battaglia casuale
function generaCampoDiBattaglia() {
  const campi = [
    { nome: 'Foresta', perk: 'velocita', malus: 'difesa' },
    { nome: 'Deserto', perk: 'attacco', malus: 'velocita' },
    { nome: 'Montagna', perk: 'difesa', malus: 'attacco' },
    { nome: 'Lago', perk: 'velocita', malus: 'attacco' }
  ];

  return campi[Math.floor(Math.random() * campi.length)];
}

// Funzione per scegliere un animale con output migliorato
async function scegliAnimale(m, conn, giocatore, animaliPosseduti) {
  const listaAnimali = animaliPosseduti.map(animale => `${animale.nome} (${animale.emoji})`).join(', ');

  await conn.sendMessage(m.chat, {
    text: `🐾 ${conn.getName(giocatore)}, scegli il tuo animale:
${listaAnimali}`
  });
}

// Aggiungi informazioni di aiuto per i nuovi comandi

// Move handler config and export after handler definition

// Move handler config and export after handler definition
handler.command = /^combatti|sfida|termina|fine$/i;
handler.help = [
  'combatti @utente - Inizia una battaglia',
  'termina - Concludi la battaglia',
  'scegli [animale] - Seleziona un animale per la battaglia'
]
handler.tags = ['game']
handler.group = true;

export default handler;

function generaEventoCasuale() {
  const eventi = [
    { tipo: 'bonus', descrizione: 'Un misterioso benefattore ti regala 50 dolci!', effetto: (giocatore) => { giocatore.limit += 50; } },
    { tipo: 'malus', descrizione: 'Un ladro ti ruba 30 dolci!', effetto: (giocatore) => { giocatore.limit = Math.max(0, giocatore.limit - 30); } },
    { tipo: 'bonus', descrizione: 'Trovi un amuleto che aumenta la tua difesa per questa battaglia!', effetto: (stats) => { stats.difesa += 20; } },
    { tipo: 'malus', descrizione: 'Scivoli su una buccia di banana e perdi velocità!', effetto: (stats) => { stats.velocita = Math.max(0, stats.velocita - 15); } },
    { tipo: 'bonus', descrizione: 'Un fulmine colpisce il tuo avversario, infliggendo 30 danni!', effetto: (battaglia, avversario) => { battaglia[`hp${avversario}`] = Math.max(0, battaglia[`hp${avversario}`] - 30); } },
    { tipo: 'malus', descrizione: 'Un temporale ti spaventa, riducendo il tuo attacco!', effetto: (stats) => { stats.attacco = Math.max(0, stats.attacco - 10); } },
    { tipo: 'bonus', descrizione: 'Trovi una pozione curativa e recuperi 20 HP!', effetto: (battaglia, giocatore) => { battaglia[`hp${giocatore}`] += 20; } },
    { tipo: 'malus', descrizione: 'Un veleno misterioso ti infligge 10 danni per turno!', effetto: (battaglia, giocatore) => { battaglia.veleno = { bersaglio: giocatore, dannoPerTurno: 10, turniRimanenti: 3 }; } }
  ];

  return eventi[Math.floor(Math.random() * eventi.length)];
}

async function applicaEventoCasuale(m, conn, battaglia, giocatore, avversario) {
  const evento = generaEventoCasuale();

  await conn.sendMessage(m.chat, {
    text: `🎲 Evento casuale: ${evento.descrizione}`
  });

  if (evento.effetto) {
    evento.effetto(battaglia, giocatore, avversario);
  }
}

async function iniziaBattagliaConEventi(m, conn) {
  let chat = global.db.data.chats[m.chat];
  let battaglia = chat.battaglia;
  let nome1 = conn.getName(battaglia.giocatore1);
  let nome2 = conn.getName(battaglia.giocatore2);

  // Applica un evento casuale prima dell'inizio della battaglia
  await applicaEventoCasuale(m, conn, battaglia, '1', '2');
  await applicaEventoCasuale(m, conn, battaglia, '2', '1');

  // Inizia la battaglia normalmente
  await iniziaBattaglia(m, conn);
}