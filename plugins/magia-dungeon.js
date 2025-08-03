import fs from 'fs';
import { xpRange } from '../lib/levelling.js';
const DATABASE_FILE = 'dungeon_players.json';

// Definizione degli oggetti disponibili nel gioco
const ITEMS = {
  'Pozione di Cura': { 
    description: 'Ripristina 20 punti vita', 
    effect: (player) => { 
      player.hp = Math.min(player.hp + 20, player.maxHp); 
      return 'Hai recuperato 20 punti vita!'; 
    }
  },
  'Pozione di Mana': { 
    description: 'Ripristina 15 punti mana', 
    effect: (player) => { 
      player.mana = Math.min(player.mana + 15, player.maxMana); 
      return 'Hai recuperato 15 punti mana!'; 
    }
  },
  'Chiave di Ferro': { 
    description: 'Apre porte e forzieri bloccati', 
    consumable: false
  },
  'Torcia': { 
    description: 'Illumina i luoghi bui e può incendiare oggetti', 
    consumable: false
  },
  'Pergamena di Teletrasporto': { 
    description: 'Ti teletrasporta all\'inizio del dungeon', 
    effect: (player) => { 
      player.currentRoom = 'entrance'; 
      return 'Sei stato teletrasportato all\'ingresso del dungeon!'; 
    }
  },
  'Amuleto della Fortuna': { 
    description: 'Aumenta le probabilità di trovare oggetti rari', 
    consumable: false,
    effect: (player) => {
      player.luckBonus = (player.luckBonus || 0) + 15;
      return 'La tua fortuna è aumentata!';
    }
  },
  'Pugnale Avvelenato': { 
    description: 'Un\'arma per attacchi a sorpresa', 
    consumable: false,
    damage: 10
  },
  'Scudo di Legno': { 
    description: 'Offre protezione dagli attacchi', 
    consumable: false,
    defense: 5
  },
  'Corda': { 
    description: 'Utile per superare crepacci o scalare pareti', 
    consumable: false
  },
  'Antidoto': { 
    description: 'Cura dagli avvelenamenti', 
    effect: (player) => { 
      player.status.poisoned = false; 
      return 'L\'avvelenamento è stato curato!'; 
    }
  }
};

// Definizione delle stanze del dungeon
const DUNGEON_ROOMS = {
  'entrance': {
    name: 'Ingresso del Dungeon',
    description: 'Ti trovi all\'ingresso di un oscuro dungeon. Il pavimento è coperto di polvere e ragnatele pendono dall\'alto. Una fiaccola tremolante illumina debolmente il passaggio davanti a te.',
    options: [
      { text: 'Prosegui nel corridoio', nextRoom: 'corridor1' },
      { text: 'Ispeziona l\'ambiente circostante', action: 'search' }
    ],
    search: {
      text: 'Guardandoti intorno, noti un piccolo baule nascosto dietro alcune pietre cadute.',
      options: [
        { text: 'Apri il baule', action: 'openChest' },
        { text: 'Lascia perdere e prosegui', nextRoom: 'corridor1' }
      ]
    },
    openChest: {
      success: {
        text: 'Hai aperto il baule! All\'interno trovi:',
        rewards: [
          { item: 'Pozione di Cura', quantity: 1 },
          { item: 'Torcia', quantity: 1 }
        ]
      },
      failure: {
        text: 'Il baule è chiuso a chiave. Ti serve una chiave per aprirlo.',
        requiredItem: 'Chiave di Ferro'
      }
    }
  },
  'corridor1': {
    name: 'Corridoio Oscuro',
    description: 'Il corridoio si estende nell\'oscurità. Le pareti sono umide al tatto e senti il suono di gocce d\'acqua che cadono in lontananza.',
    options: [
      { text: 'Prosegui con cautela', nextRoom: 'fork' },
      { text: 'Usa la torcia per illuminare meglio', action: 'useTorch', requiredItem: 'Torcia' },
      { text: 'Torna indietro', nextRoom: 'entrance' }
    ],
    useTorch: {
      text: 'Accendi la torcia, illuminando il corridoio. Ora puoi vedere meglio! Noti dei simboli incisi sulla parete e un piccolo passaggio nascosto.',
      options: [
        { text: 'Esamina i simboli', action: 'examineSymbols' },
        { text: 'Esplora il passaggio nascosto', nextRoom: 'secretPassage' },
        { text: 'Continua per il corridoio principale', nextRoom: 'fork' }
      ]
    },
    examineSymbols: {
      text: 'I simboli sembrano essere un avvertimento. "Attenti al guardiano delle profondità. Solo chi possiede la luce può passare indenne."',
      options: [
        { text: 'Prendi nota e prosegui per il corridoio', nextRoom: 'fork' },
        { text: 'Esplora il passaggio nascosto', nextRoom: 'secretPassage' }
      ]
    }
  },
  'secretPassage': {
    name: 'Passaggio Segreto',
    description: 'Ti intrufoli nel passaggio stretto e buio. L\'aria è stantia e il soffitto è così basso che devi procedere chinato.',
    options: [
      { text: 'Avanza nel passaggio', action: 'advanceTrap' },
      { text: 'Torna indietro', nextRoom: 'corridor1' }
    ],
    advanceTrap: {
      text: 'Mentre avanzi, il terreno sotto di te cede improvvisamente!',
      trap: {
        name: 'Pavimento Cedevole',
        damage: 10,
        description: 'Cadi in una fossa poco profonda piena di spuntoni. Riesci a evitare i peggiori, ma ti ferisci comunque.',
        escapable: true,
        escapeText: 'Riesci ad arrampicarti fuori dalla fossa e continui il tuo cammino.',
        escapeRoom: 'treasureRoom'
      }
    }
  },
  'treasureRoom': {
    name: 'Stanza del Tesoro',
    description: 'Hai trovato una piccola camera del tesoro! Al centro della stanza c\'è un piedistallo con un forziere decorato.',
    options: [
      { text: 'Apri il forziere', action: 'openTreasure' },
      { text: 'Ispeziona la stanza prima', action: 'inspectRoom' },
      { text: 'Torna nel passaggio principale', nextRoom: 'fork' }
    ],
    openTreasure: {
      text: 'Apri il forziere e al suo interno trovi:',
      rewards: [
        { item: 'Amuleto della Fortuna', quantity: 1 },
        { item: 'Pozione di Mana', quantity: 2 },
        { item: 'Chiave di Ferro', quantity: 1 },
        { xp: 50, gold: 100 }
      ]
    },
    inspectRoom: {
      text: 'Esaminando attentamente la stanza, noti che ci sono delle trappole intorno al forziere. Fortunatamente ora puoi evitarle.',
      options: [
        { text: 'Apri il forziere con cautela', action: 'openTreasureSafely' },
        { text: 'Lascia stare e torna nel passaggio principale', nextRoom: 'fork' }
      ]
    },
    openTreasureSafely: {
      text: 'Disinnescando attentamente le trappole, apri il forziere e trovi:',
      rewards: [
        { item: 'Amuleto della Fortuna', quantity: 1 },
        { item: 'Pozione di Mana', quantity: 2 },
        { item: 'Chiave di Ferro', quantity: 1 },
        { item: 'Pugnale Avvelenato', quantity: 1 },
        { xp: 100, gold: 150 }
      ]
    }
  },
  'fork': {
    name: 'Bivio',
    description: 'Il corridoio si divide in due direzioni. A sinistra senti un debole suono d\'acqua corrente. A destra percepisci un\'aria più calda.',
    options: [
      { text: 'Vai a sinistra (verso l\'acqua)', nextRoom: 'waterChamber' },
      { text: 'Vai a destra (verso il calore)', nextRoom: 'fireChamber' },
      { text: 'Torna indietro', nextRoom: 'corridor1' }
    ]
  },
  'waterChamber': {
    name: 'Camera Allagata',
    description: 'Entri in una vasta camera parzialmente allagata. Al centro si trova una piccola isola con quello che sembra un altare. L\'acqua arriva alle caviglie ed è gelida.',
    options: [
      { text: 'Attraversa l\'acqua verso l\'altare', action: 'crossWater' },
      { text: 'Cerca un altro modo per raggiungere l\'altare', action: 'searchAlternative' },
      { text: 'Torna al bivio', nextRoom: 'fork' }
    ],
    crossWater: {
      text: 'Mentre attraversi l\'acqua gelida, senti qualcosa muoversi sotto la superficie!',
      encounter: {
        name: 'Serpente d\'Acqua',
        hp: 30,
        damage: 8,
        description: 'Un grande serpente acquatico emerge dall\'acqua, mostrando zanne affilate!',
        rewards: [
          { item: 'Antidoto', quantity: 1 },
          { xp: 40, gold: 25 }
        ],
        escape: {
          text: 'Riesci a fuggire tornando rapidamente verso l\'ingresso della stanza.',
          room: 'fork'
        }
      }
    },
    searchAlternative: {
      text: 'Scrutando attentamente la stanza, noti alcune pietre che emergono dall\'acqua, formando un possibile percorso verso l\'altare.',
      options: [
        { text: 'Salta da una pietra all\'altra', action: 'jumpStones' },
        { text: 'Attraversa comunque l\'acqua', action: 'crossWater' },
        { text: 'Torna al bivio', nextRoom: 'fork' }
      ]
    },
    jumpStones: {
      text: 'Con un po\' di agilità, riesci a saltare da una pietra all\'altra fino a raggiungere l\'altare senza toccare l\'acqua.',
      nextRoom: 'waterAltar',
      rewardXp: 25
    }
  },
  'waterAltar': {
    name: 'Altare dell\'Acqua',
    description: 'Sull\'altare vedi un bacile di pietra contenente un liquido azzurro luminescente. Accanto c\'è una piccola ampolla vuota.',
    options: [
      { text: 'Raccogli il liquido nell\'ampolla', action: 'collectLiquid' },
      { text: 'Bevi direttamente dal bacile', action: 'drinkLiquid' },
      { text: 'Lascia l\'altare e torna indietro', nextRoom: 'waterChamber' }
    ],
    collectLiquid: {
      text: 'Riempi l\'ampolla con il liquido azzurro. Hai ottenuto: Elisir dell\'Acqua!',
      rewards: [
        { item: 'Elisir dell\'Acqua', quantity: 1, newItem: {
          description: 'Un potente liquido magico che può spegnere qualsiasi fiamma',
          effect: (player) => {
            player.hasWaterElixir = true;
            return 'L\'elisir brilla nella tua borsa, pronto all\'uso.';
          }
        }}
      ],
      nextRoom: 'waterChamber'
    },
    drinkLiquid: {
      text: 'Bevi direttamente dal bacile. Il liquido è freddo come ghiaccio e ti senti rinvigorito, ma allo stesso tempo senti che avresti potuto utilizzarlo in modo migliore.',
      effect: (player) => {
        player.hp = player.maxHp;
        player.mana = player.maxMana;
        return 'Tutti i tuoi punti vita e mana sono stati ripristinati!';
      },
      nextRoom: 'waterChamber'
    }
  },
  'fireChamber': {
    name: 'Camera del Fuoco',
    description: 'La stanza è illuminata da un grande braciere al centro. Il calore è intenso e vedi simboli di fiamme incisi sulle pareti. Dall\'altra parte della stanza c\'è una porta chiusa con un lucchetto rosso.',
    options: [
      { text: 'Esamina il braciere', action: 'examineBrazier' },
      { text: 'Prova ad aprire la porta', action: 'tryDoor' },
      { text: 'Torna al bivio', nextRoom: 'fork' }
    ],
    examineBrazier: {
      text: 'Avvicinandoti al braciere, noti che tra le fiamme brilla qualcosa di metallico.',
      options: [
        { text: 'Prova a prendere l\'oggetto tra le fiamme', action: 'reachFire' },
        { text: 'Usa l\'Elisir dell\'Acqua sul braciere', action: 'useWaterElixir', requiredItem: 'Elisir dell\'Acqua' },
        { text: 'Allontanati dal braciere', nextRoom: 'fireChamber' }
      ]
    },
    reachFire: {
      text: 'Tenti di afferrare l\'oggetto tra le fiamme, ma il calore è troppo intenso!',
      damage: 15,
      damageText: 'Ti scotti gravemente la mano. (-15 HP)'
    },
    useWaterElixir: {
      text: 'Versi l\'Elisir dell\'Acqua sul braciere. Le fiamme si spengono con un sibilo, rivelando una chiave rossa tra le ceneri.',
      consumeItem: 'Elisir dell\'Acqua',
      rewards: [
        { item: 'Chiave Rossa', quantity: 1, newItem: {
          description: 'Una chiave forgiata in metallo rosso, calda al tatto',
          consumable: false
        }}
      ]
    },
    tryDoor: {
      text: 'La porta è bloccata da un lucchetto di metallo rosso.',
      options: [
        { text: 'Usa la Chiave Rossa', action: 'useRedKey', requiredItem: 'Chiave Rossa' },
        { text: 'Torna indietro', nextRoom: 'fireChamber' }
      ]
    },
    useRedKey: {
      text: 'La Chiave Rossa si adatta perfettamente al lucchetto. La porta si apre con un cigolio.',
      nextRoom: 'bossRoom',
      consumeItem: 'Chiave Rossa'
    }
  },
  'bossRoom': {
    name: 'Sala del Guardiano',
    description: 'Una vasta sala circolare si apre davanti a te. Al centro, su un trono di pietra, siede una figura imponente avvolta in un\'armatura antica. La figura si alza lentamente quando ti vede entrare.',
    options: [
      { text: 'Avvicinati con cautela', action: 'approachBoss' },
      { text: 'Prepara le armi per combattere', action: 'prepareFight' },
      { text: 'Tenta di parlare con il guardiano', action: 'talkGuardian' }
    ],
    approachBoss: {
      text: 'Mentre ti avvicini, il guardiano sbatte la sua arma a terra. "Chi osa entrare nel mio dominio?" tuona con voce cavernosa.',
      options: [
        { text: 'Attacca immediatamente', action: 'fightBoss' },
        { text: 'Rispondi rispettosamente', action: 'respectfulAnswer' }
      ]
    },
    prepareFight: {
      text: 'Impugni le tue armi, pronto allo scontro. Il guardiano nota la tua postura e si prepara a sua volta.',
      options: [
        { text: 'Attacca per primo', action: 'fightBoss' },
        { text: 'Aspetta che faccia la prima mossa', action: 'waitBossMove' }
      ]
    },
    talkGuardian: {
      text: '"Chi osa disturbare il mio riposo?" chiede il guardiano con voce tonante.',
      options: [
        { text: 'Spiegagli che sei un avventuriero in cerca di tesori', action: 'explainIntent' },
        { text: 'Chiedi se puoi passare pacificamente', action: 'askPeacefulPassage' }
      ]
    },
    respectfulAnswer: {
      text: '"Sono solo un avventuriero, nobile guardiano. Non intendo mancare di rispetto." Il guardiano ti studia attentamente.',
      options: [
        { text: 'Attendi in silenzio', action: 'guardianResponse' },
        { text: 'Chiedi del tesoro', action: 'askTreasure' }
      ]
    },
    guardianResponse: {
      text: '"Pochi sono coloro che mostrano rispetto in questi luoghi. Ti metterò alla prova, avventuriero."',
      nextAction: 'guardianChallenge'
    },
    guardianChallenge: {
      text: 'Il guardiano solleva tre pietre magiche: una blu, una rossa e una verde. "Scegli saggiamente," dice.',
      options: [
        { text: 'Scegli la pietra blu', action: 'chooseBlue' },
        { text: 'Scegli la pietra rossa', action: 'chooseRed' },
        { text: 'Scegli la pietra verde', action: 'chooseGreen' }
      ]
    },
    chooseBlue: {
      text: 'Scegli la pietra blu. Il guardiano annuisce. "Hai scelto la saggezza. Puoi passare." Si fa da parte, rivelando un passaggio.',
      nextRoom: 'finalTreasure'
    },
    chooseRed: {
      text: 'Scegli la pietra rossa. "Hai scelto la forza," dice il guardiano. "Dimostra di esserne degno."',
      nextAction: 'fightBoss'
    },
    chooseGreen: {
      text: 'Scegli la pietra verde. "Hai scelto l\'astuzia," dice il guardiano. "Risolvi il mio enigma."',
      nextAction: 'solveRiddle'
    },
    solveRiddle: {
      text: '"Cosa ha quattro gambe al mattino, due a mezzogiorno e tre alla sera?"',
      options: [
        { text: 'L\'uomo', action: 'correctRiddle' },
        { text: 'Il tavolo', action: 'wrongRiddle' },
        { text: 'Il cane', action: 'wrongRiddle' }
      ]
    },
    correctRiddle: {
      text: '"Saggezza nelle tue parole. Puoi passare." Il guardiano si sposta, rivelando un passaggio.',
      nextRoom: 'finalTreasure'
    },
    wrongRiddle: {
      text: '"Risposta errata. Dovrai dimostrare il tuo valore in battaglia!"',
      nextAction: 'fightBoss'
    },
    fightBoss: {
      text: 'Il guardiano si erge in tutta la sua altezza, brandendo un\'antica ascia da battaglia!',
      encounter: {
        name: 'Guardiano Antico',
        hp: 70,
        damage: 15,
        description: 'Un imponente guerriero in armatura antica, protettore del tesoro finale.',
        rewards: [
          { item: 'Ascia del Guardiano', quantity: 1, newItem: {
            description: 'Un\'antica ascia da battaglia con rune incise',
            damage: 25,
            consumable: false
          }},
          { xp: 200, gold: 300 }
        ],
        escape: {
          text: 'Impossibile fuggire da questo scontro!',
          possible: false
        },
        victory: {
          text: 'Con un ultimo colpo, il guardiano cade in ginocchio. "Sei... degno..." mormora, prima di dissolversi in polvere dorata.',
          nextRoom: 'finalTreasure'
        }
      }
    }
  },
  'finalTreasure': {
    name: 'Camera del Tesoro Finale',
    description: 'Finalmente raggiungi la leggendaria camera del tesoro! Mucchi di oro, gemme e artefatti magici riempiono la stanza, brillando alla luce delle torce magiche.',
    options: [
      { text: 'Raccogli il tesoro', action: 'collectTreasure' },
      { text: 'Cerca oggetti speciali', action: 'searchSpecial' }
    ],
    collectTreasure: {
      text: 'Riempi il tuo zaino con oro e gemme preziose!',
      rewards: [
        { gold: 1000, xp: 500 }
      ],
      nextAction: 'dungeonComplete'
    },
    searchSpecial: {
      text: 'Tra i tanti tesori, noti alcuni oggetti che emanano un\'aura magica potente.',
      options: [
        { text: 'Prendi l\'amuleto scintillante', action: 'takeAmulet' },
        { text: 'Prendi la spada dall\'elsa gemmata', action: 'takeSword' },
        { text: 'Prendi il libro con copertina di pelle di drago', action: 'takeBook' }
      ]
    },
    takeAmulet: {
      text: 'Hai scelto l\'Amuleto del Potere! Senti la sua energia attraversarti.',
      rewards: [
        { item: 'Amuleto del Potere', quantity: 1, newItem: {
          description: 'Un potente amuleto che aumenta tutte le tue capacità',
          effect: (player) => {
            player.maxHp += 20;
            player.maxMana += 20;
            player.strength = (player.strength || 0) + 10;
            return 'I tuoi attributi sono aumentati permanentemente!';
          },
          consumable: false
        }},
        { gold: 500, xp: 300 }
      ],
      nextAction: 'dungeonComplete'
    },
    takeSword: {
      text: 'Hai scelto la Spada Draconica! La lama emette un leggero bagliore bluastro.',
      rewards: [
        { item: 'Spada Draconica', quantity: 1, newItem: {
          description: 'Una spada forgiata con squame di drago, incredibilmente affilata',
          damage: 30,
          consumable: false
        }},
        { gold: 500, xp: 300 }
      ],
      nextAction: 'dungeonComplete'
    },
    takeBook: {
      text: 'Hai scelto il Tomo degli Antichi! Le pagine contengono conoscenze arcane dimenticate.',
      rewards: [
        { item: 'Tomo degli Antichi', quantity: 1, newItem: {
          description: 'Un libro antico contenente potenti incantesimi',
          effect: (player) => {
            player.maxMana += 40;
            player.knownSpells = (player.knownSpells || []).concat(['Palla di Fuoco', 'Teletrasporto', 'Scudo Arcano']);
            return 'Hai imparato 3 nuovi potenti incantesimi e la tua capacità magica è aumentata!';
          },
          consumable: false
        }},
        { gold: 500, xp: 300 }
      ],
      nextAction: 'dungeonComplete'
    }
  }
};

// Sistema per gestire lo stato del gioco
let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Inizializza o carica il database
  let playersData;
  try {
    playersData = JSON.parse(fs.readFileSync(DATABASE_FILE));
  } catch (e) {
    playersData = { players: {} };
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(playersData));
  }
  
  // Ottieni o crea dati giocatore
  if (!playersData.players[m.sender]) {
    playersData.players[m.sender] = {
      name: conn.getName(m.sender),
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      level: 1,
      xp: 0,
      gold: 0,
      inventory: {},
      currentRoom: 'entrance',
      gameState: {},
      completedDungeons: 0
    };
  }
  
  let player = playersData.players[m.sender];
  
  // Azioni di base
  if (command === 'dungeon' || command === 'inizia') {
    // Mostra lo stato attuale e le opzioni disponibili
    return sendRoomInfo(conn, m, player);
  }
  
  if (command === 'stats' || command === 'stato') {
    return sendPlayerStats(conn, m, player);
  }
  
  if (command === 'inventario' || command === 'inv') {
    return sendInventory(conn, m, player);
  }
  
  if (command === 'usa') {
    const itemName = args.join(' ');
    return useItem(conn, m, player, itemName);
  }
  
  if (command === 'scegli') {
    const choiceIndex = parseInt(args[0]);
    if (isNaN(choiceIndex) || choiceIndex < 1) {
      return conn.reply(m.chat, "❌ Scelta non valida. Usa un numero per selezionare un'opzione.", m);
    }
    return processChoice(conn, m, player, choiceIndex - 1);
  }
  
  if (command === 'restart') {
    player.hp = player.maxHp;
    player.mana = player.maxMana;
    player.currentRoom = 'entrance';
    player.gameState = {};
    savePlayerData(playersData);
    return conn.reply(m.chat, "🔄 Avventura riavviata! Ti trovi nuovamente all'ingresso del dungeon.", m);
  }
  
  return conn.reply(m.chat, `❓ Comando non riconosciuto. Comandi disponibili:
- *${usedPrefix}dungeon* o *${usedPrefix}inizia* - Mostra la situazione attuale
- *${usedPrefix}stats* o *${usedPrefix}stato* - Mostra le tue statistiche
- *${usedPrefix}inventario* o *${usedPrefix}inv* - Mostra il tuo inventario
- *${usedPrefix}usa [oggetto]* - Usa un oggetto dal tuo inventario
- *${usedPrefix}scegli [numero]* - Fai una scelta
- *${usedPrefix}restart* - Ricomincia l'avventura`, m);
};

// Funzioni di supporto
async function sendRoomInfo(conn, m, player) {
  const room = DUNGEON_ROOMS[player.currentRoom];
  if (!room) {
    return conn.reply(m.chat, "❌ Errore: stanza non trovata!", m);
  }
  
  let text = `🏰 *${room.name}* 🏰\n\n`;
  text += `${room.description}\n\n`;
  
  // Mostra opzioni disponibili
  const currentOptions = getAvailableOptions(player, room.options);
  text += `🔍 *Cosa vuoi fare?*\n`;
  currentOptions.forEach((option, index) => {
    text += `${index + 1}. ${option.text}\n`;
  });
  
  text += `\n💡 Usa *!scegli [numero]* per selezionare un'opzione`;
  text += `\n💼 Usa *!inventario* per vedere i tuoi oggetti`;
  text += `\n📊 Usa *!stats* per vedere le tue statistiche`;
  
  // Salva le opzioni disponibili nello stato del giocatore per riferimento futuro
  player.gameState.currentOptions = currentOptions;
  savePlayerData({ players: { [m.sender]: player } });
  
  return await conn.sendMessage(m.chat, {
    text: text,
    contextInfo: {
      externalAdReply: {
        title: `${room.name} - Livello ${player.level}`,
        body: `HP: ${player.hp}/${player.maxHp} | Mana: ${player.mana}/${player.maxMana}`,
        thumbnailUrl: 'https://i.imgur.com/HQK3BFS.jpg',
        sourceUrl: ''
      }
    }
  }, { quoted: m });
}

async function sendPlayerStats(conn, m, player) {
  let text = `📊 *STATISTICHE PERSONAGGIO* 📊\n\n`;
  text += `👤 Nome: ${player.name}\n`;
  text += `⚜️ Livello: ${player.level}\n`;
  text += `✨ Esperienza: ${player.xp} XP\n`;
  text += `❤️ Vita: ${player.hp}/${player.maxHp}\n`;
  text += `🔮 Mana: ${player.mana}/${player.maxMana}\n`;
  text += `💰 Oro: ${player.gold} monete\n`;
  
  // Mostro statistiche aggiuntive se presenti
  if (player.strength) text += `💪 Forza: ${player.strength}\n`;
  if (player.luckBonus) text += `🍀 Bonus Fortuna: ${player.luckBonus}%\n`;
  if (player.knownSpells && player.knownSpells.length > 0) {
    text += `\n📜 *Incantesimi Conosciuti:*\n`;
    player.knownSpells.forEach(spell => text += `- ${spell}\n`);
  }
  
  text += `\n🏆 Dungeon completati: ${player.completedDungeons}`;
  
  return await conn.sendMessage(m.chat, {
    text: text,
    contextInfo: {
      externalAdReply: {
        title: `${player.name} - Livello ${player.level}`,
        body: `HP: ${player.hp}/${player.maxHp} | Mana: ${player.mana}/${player.maxMana}`,
        thumbnailUrl: 'https://i.imgur.com/d3tsMkJ.jpg',
        sourceUrl: ''
      }
    }
  }, { quoted: m });
}

async function sendInventory(conn, m, player) {
  // Formattazione dell'inventario
  const formatItems = () => {
    const items = Object.entries(player.inventory)
      .filter(([_, qty]) => qty > 0)
      .map(([item, qty]) => `▸ ${item}: ${qty} ${getItemDescription(item)}`);
    return items.length > 0 ? items.join('\n') : 'Nessun oggetto nel tuo inventario';
  };
  
  let text = `🎒 *INVENTARIO* 🎒\n\n`;
  text += formatItems();
  text += `\n\n💡 Usa *!usa [nome oggetto]* per utilizzare un oggetto`;
  
  return await conn.sendMessage(m.chat, {
    text: text,
    contextInfo: {
      externalAdReply: {
        title: `Inventario di ${player.name}`,
        body: `Oggetti disponibili: ${Object.values(player.inventory).reduce((a, b) => a + b, 0)}`,
        thumbnailUrl: 'https://i.imgur.com/MVtGb2J.jpg',
        sourceUrl: ''
      }
    }
  }, { quoted: m });
}

function getItemDescription(itemName) {
  const item = ITEMS[itemName] || (player.gameState.customItems && player.gameState.customItems[itemName]);
  if (!item) return '';
  return `(${item.description})`;
}

async function useItem(conn, m, player, itemName) {
  // Verifica se l'oggetto è nell'inventario
  if (!player.inventory[itemName] || player.inventory[itemName] <= 0) {
    return conn.reply(m.chat, `❌ Non hai ${itemName} nel tuo inventario.`, m);
  }
  
  // Ottieni definizione dell'oggetto
  const item = ITEMS[itemName] || (player.gameState.customItems && player.gameState.customItems[itemName]);
  if (!item) {
    return conn.reply(m.chat, `❌ Oggetto sconosciuto o non utilizzabile.`, m);
  }
  
  // Usa l'effetto dell'oggetto se disponibile
  let resultMessage = '';
  if (item.effect) {
    resultMessage = item.effect(player);
  } else {
    resultMessage = `Hai usato ${itemName}, ma non sembra avere alcun effetto qui.`;
  }
  
  // Consuma l'oggetto se consumabile
  if (item.consumable !== false) {
    player.inventory[itemName]--;
    if (player.inventory[itemName] <= 0) {
      delete player.inventory[itemName];
    }
  }
  
  // Salva i dati del giocatore
  savePlayerData({ players: { [m.sender]: player } });
  
  return conn.reply(m.chat, `✅ ${resultMessage}`, m);
}

function getAvailableOptions(player, options) {
  return options.filter(option => {
    // Filtra opzioni basate su oggetti richiesti
    if (option.requiredItem && (!player.inventory[option.requiredItem] || player.inventory[option.requiredItem] <= 0)) {
      return false;
    }
    return true;
  });
}

async function processChoice(conn, m, player, choiceIndex) {
  // Recupera le opzioni correnti dallo stato del giocatore
  const currentOptions = player.gameState.currentOptions || [];
  
  if (!currentOptions || choiceIndex >= currentOptions.length) {
    return conn.reply(m.chat, "❌ Scelta non valida. Usa *!dungeon* per vedere le opzioni disponibili.", m);
  }
  
  const choice = currentOptions[choiceIndex];
  
  // Processa la scelta
  if (choice.nextRoom) {
    // Cambia stanza
    player.currentRoom = choice.nextRoom;
    // Aggiungi XP per l'esplorazione
    if (choice.rewardXp) {
      player.xp += choice.rewardXp;
      await checkLevelUp(conn, m, player);
    }
    savePlayerData({ players: { [m.sender]: player } });
    return sendRoomInfo(conn, m, player);
  }
  
  if (choice.action) {
    // Esegui un'azione specifica
    return processAction(conn, m, player, choice.action);
  }
  
  // Fallback
  savePlayerData({ players: { [m.sender]: player } });
  return sendRoomInfo(conn, m, player);
}

async function processAction(conn, m, player, action) {
  const room = DUNGEON_ROOMS[player.currentRoom];
  if (!room || !room[action]) {
    return conn.reply(m.chat, "❌ Azione non valida.", m);
  }
  
  const actionData = room[action];
  
  // Controlla se l'azione richiede un oggetto specifico
  if (actionData.requiredItem) {
    if (!player.inventory[actionData.requiredItem] || player.inventory[actionData.requiredItem] <= 0) {
      return conn.reply(m.chat, `❌ Hai bisogno di ${actionData.requiredItem} per questa azione.`, m);
    }
  }
  
  // Consuma l'oggetto se necessario
  if (actionData.consumeItem && player.inventory[actionData.consumeItem] > 0) {
    player.inventory[actionData.consumeItem]--;
    if (player.inventory[actionData.consumeItem] <= 0) {
      delete player.inventory[actionData.consumeItem];
    }
  }
  
  // Gestisci danni da azione se presenti
  if (actionData.damage) {
    player.hp -= actionData.damage;
    if (player.hp <= 0) {
      return handlePlayerDeath(conn, m, player);
    }
    conn.reply(m.chat, actionData.damageText || `Hai subito ${actionData.damage} danni!`, m);
  }
  
  // Gestisci ricompense se presenti
  if (actionData.rewards) {
    await giveRewards(conn, m, player, actionData.rewards);
  }
  
  // Gestisci effetti
  if (actionData.effect) {
    const effectResult = actionData.effect(player);
    if (effectResult) {
      conn.reply(m.chat, effectResult, m);
    }
  }
  
  // Gestisci incontri
  if (actionData.encounter) {
    return handleEncounter(conn, m, player, actionData.encounter);
  }
  
  // Gestisci trappole
  if (actionData.trap) {
    return handleTrap(conn, m, player, actionData.trap);
  }
  
  // Mostra il testo dell'azione
  let text = actionData.text || "Hai eseguito l'azione.";
  
  // Gestisci casi speciali
  if (action === 'openChest' || action === 'openTreasure') {
    if (actionData.success && (!actionData.requiredItem || 
        (player.inventory[actionData.requiredItem] && player.inventory[actionData.requiredItem] > 0))) {
      text = actionData.success.text;
      if (actionData.success.rewards) {
        await giveRewards(conn, m, player, actionData.success.rewards);
      }
    } else if (actionData.failure) {
      text = actionData.failure.text;
    }
  }
  
  // Cambia stanza se specificato
  if (actionData.nextRoom) {
    player.currentRoom = actionData.nextRoom;
  }
  
  // Esegui la prossima azione se specificata
  if (actionData.nextAction) {
    await conn.reply(m.chat, text, m);
    return processAction(conn, m, player, actionData.nextAction);
  }
  
  // Costruisci le opzioni disponibili
  const options = actionData.options || [];
  player.gameState.currentOptions = getAvailableOptions(player, options);
  
  // Mostra opzioni disponibili
  if (player.gameState.currentOptions && player.gameState.currentOptions.length > 0) {
    text += '\n\n🔍 *Cosa vuoi fare?*\n';
    player.gameState.currentOptions.forEach((option, index) => {
      text += `${index + 1}. ${option.text}\n`;
    });
    text += `\n💡 Usa *!scegli [numero]* per selezionare un'opzione`;
  } else {
    // Se non ci sono opzioni, torna alle opzioni della stanza
    savePlayerData({ players: { [m.sender]: player } });
    await conn.reply(m.chat, text, m);
    return await sendRoomInfo(conn, m, player);
  }
  
  savePlayerData({ players: { [m.sender]: player } });
  return conn.reply(m.chat, text, m);
}

async function handleEncounter(conn, m, player, encounter) {
  // Inizializza lo stato del combattimento
  player.gameState.combat = {
    enemyName: encounter.name,
    enemyHp: encounter.hp,
    enemyMaxHp: encounter.hp,
    enemyDamage: encounter.damage,
    rewards: encounter.rewards,
    escape: encounter.escape,
    victory: encounter.victory
  };
  
  let text = `⚔️ *INCONTRO* ⚔️\n\n`;
  text += `Hai incontrato: ${encounter.name}!\n`;
  text += encounter.description + '\n\n';
  
  text += `❤️ ${encounter.name}: ${encounter.hp} HP\n`;
  text += `❤️ Tu: ${player.hp}/${player.maxHp} HP\n\n`;
  
  text += `🔍 *Cosa vuoi fare?*\n`;
  text += `1. Attacca\n`;
  
  // Aggiungi opzione fuga se possibile
  if (encounter.escape && encounter.escape.possible !== false) {
    text += `2. Tenta la fuga\n`;
  }
  
  // Aggiungi opzione usa oggetto
  text += `3. Usa un oggetto\n`;
  
  player.gameState.currentOptions = [
    { text: 'Attacca', action: 'attackEnemy' },
    { text: 'Tenta la fuga', action: 'escapeEnemy' },
    { text: 'Usa un oggetto', action: 'combatUseItem' }
  ];
  
  savePlayerData({ players: { [m.sender]: player } });
  return conn.reply(m.chat, text, m);
}

async function attackEnemy(conn, m, player) {
  const combat = player.gameState.combat;
  if (!combat) {
    return conn.reply(m.chat, "❌ Non sei in combattimento.", m);
  }
  
  // Calcola il danno del giocatore
  let playerDamage = 10; // Danno base
  
  // Aggiungi danno da armi equipaggiate
  Object.entries(player.inventory).forEach(([itemName, qty]) => {
    if (qty > 0) {
      const item = ITEMS[itemName] || (player.gameState.customItems && player.gameState.customItems[itemName]);
      if (item && item.damage) {
        playerDamage += item.damage;
      }
    }
  });
  
  // Aggiungi bonus da statistiche
  if (player.strength) {
    playerDamage += Math.floor(player.strength / 2);
  }
  
  // Applica il danno al nemico
  combat.enemyHp -= playerDamage;
  
  let text = `⚔️ *COMBATTIMENTO* ⚔️\n\n`;
  text += `Hai inflitto ${playerDamage} danni a ${combat.enemyName}!\n`;
  
  // Controlla se il nemico è stato sconfitto
  if (combat.enemyHp <= 0) {
    return handleVictory(conn, m, player);
  }
  
  // Il nemico attacca
  player.hp -= combat.enemyDamage;
  text += `${combat.enemyName} ti ha inflitto ${combat.enemyDamage} danni!\n\n`;
  
  // Controlla se il giocatore è morto
  if (player.hp <= 0) {
    return handlePlayerDeath(conn, m, player);
  }
  
  // Stato attuale
  text += `❤️ ${combat.enemyName}: ${combat.enemyHp}/${combat.enemyMaxHp} HP\n`;
  text += `❤️ Tu: ${player.hp}/${player.maxHp} HP\n\n`;
  
  text += `🔍 *Cosa vuoi fare?*\n`;
  text += `1. Attacca\n`;
  
  // Aggiungi opzione fuga se possibile
  if (combat.escape && combat.escape.possible !== false) {
    text += `2. Tenta la fuga\n`;
  }
  
  // Aggiungi opzione usa oggetto
  text += `3. Usa un oggetto\n`;
  
  savePlayerData({ players: { [m.sender]: player } });
  return conn.reply(m.chat, text, m);
}

async function escapeEnemy(conn, m, player) {
  const combat = player.gameState.combat;
  if (!combat) {
    return conn.reply(m.chat, "❌ Non sei in combattimento.", m);
  }
  
  // Controlla se la fuga è possibile
  if (!combat.escape || combat.escape.possible === false) {
    // Subisci un attacco per il tentativo fallito
    player.hp -= combat.enemyDamage;
    if (player.hp <= 0) {
      return handlePlayerDeath(conn, m, player);
    }
    
    let text = `❌ Non puoi fuggire da questo scontro!\n`;
    text += `${combat.enemyName} ti ha colpito mentre tentavi di scappare, infliggendoti ${combat.enemyDamage} danni!\n\n`;
    
    text += `❤️ ${combat.enemyName}: ${combat.enemyHp}/${combat.enemyMaxHp} HP\n`;
    text += `❤️ Tu: ${player.hp}/${player.maxHp} HP\n\n`;
    
    text += `🔍 *Cosa vuoi fare?*\n`;
    text += `1. Attacca\n`;
    text += `3. Usa un oggetto\n`;
    
    savePlayerData({ players: { [m.sender]: player } });
    return conn.reply(m.chat, text, m);
  }
  
  // La fuga ha successo
  let text = combat.escape.text || "Sei riuscito a fuggire dallo scontro!";
  
  // Cambia stanza se specificato
  if (combat.escape.room) {
    player.currentRoom = combat.escape.room;
  }
  
  // Pulisci lo stato di combattimento
  delete player.gameState.combat;
  
  savePlayerData({ players: { [m.sender]: player } });
  await conn.reply(m.chat, text, m);
  return sendRoomInfo(conn, m, player);
}

async function handleVictory(conn, m, player) {
  const combat = player.gameState.combat;
  if (!combat) {
    return conn.reply(m.chat, "❌ Errore nel gestire la vittoria.", m);
  }
  
  let text = `🏆 *VITTORIA!* 🏆\n\n`;
  text += `Hai sconfitto ${combat.enemyName}!\n\n`;
  
  // Aggiungi testo della vittoria se presente
  if (combat.victory && combat.victory.text) {
    text += combat.victory.text + '\n\n';
  }
  
  // Assegna ricompense
  if (combat.rewards) {
    text += "Ricompense ottenute:\n";
    text += await giveRewards(conn, m, player, combat.rewards, true);
  }
  
  // Cambia stanza se specificato
  if (combat.victory && combat.victory.nextRoom) {
    player.currentRoom = combat.victory.nextRoom;
  }
  
  // Pulisci lo stato di combattimento
  delete player.gameState.combat;
  
  savePlayerData({ players: { [m.sender]: player } });
  await conn.reply(m.chat, text, m);
  
  // Mostra informazioni sulla stanza corrente
  return sendRoomInfo(conn, m, player);
}

async function handlePlayerDeath(conn, m, player) {
  let text = `☠️ *SEI MORTO* ☠️\n\n`;
  text += "Sei stato sconfitto! Hai perso metà del tuo oro e sei tornato all'ingresso del dungeon.\n\n";
  
  // Riduci l'oro
  player.gold = Math.floor(player.gold / 2);
  
  // Ripristina la vita a un valore minimo
  player.hp = Math.floor(player.maxHp / 4);
  
  // Riporta il giocatore all'ingresso
  player.currentRoom = 'entrance';
  
  // Pulisci lo stato di combattimento e altri stati temporanei
  delete player.gameState.combat;
  
  savePlayerData({ players: { [m.sender]: player } });
  await conn.reply(m.chat, text, m);
  
  // Mostra informazioni sulla stanza corrente
  return sendRoomInfo(conn, m, player);
}

async function handleTrap(conn, m, player, trap) {
  let text = `⚠️ *TRAPPOLA* ⚠️\n\n`;
  text += trap.description + '\n\n';
  
  // Applica danni se presenti
  if (trap.damage) {
    player.hp -= trap.damage;
    text += `Hai subito ${trap.damage} danni!\n`;
    
    // Controlla se il giocatore è morto
    if (player.hp <= 0) {
      savePlayerData({ players: { [m.sender]: player } });
      await conn.reply(m.chat, text, m);
      return handlePlayerDeath(conn, m, player);
    }
  }
  
  // Controlla se la trappola è evitabile
  if (trap.escapable) {
    text += '\n' + (trap.escapeText || "Sei riuscito a superare la trappola.") + '\n';
    
    // Cambia stanza se specificato
    if (trap.escapeRoom) {
      player.currentRoom = trap.escapeRoom;
    }
  }
  
  savePlayerData({ players: { [m.sender]: player } });
  await conn.reply(m.chat, text, m);
  
  // Mostra informazioni sulla stanza corrente
  return sendRoomInfo(conn, m, player);
}

async function giveRewards(conn, m, player, rewards, returnText = false) {
  let rewardText = '';
  
  for (const reward of rewards) {
    // Aggiungi oro
    if (reward.gold) {
      player.gold += reward.gold;
      rewardText += `💰 ${reward.gold} oro\n`;
    }
    
    // Aggiungi XP
    if (reward.xp) {
      player.xp += reward.xp;
      rewardText += `✨ ${reward.xp} XP\n`;
      await checkLevelUp(conn, m, player);
    }
    
    // Aggiungi oggetti
    if (reward.item && reward.quantity) {
      // Gestisci nuovi oggetti personalizzati non presenti in ITEMS
      if (reward.newItem) {
        if (!player.gameState.customItems) {
          player.gameState.customItems = {};
        }
        player.gameState.customItems[reward.item] = reward.newItem;
      }
      
      // Aggiungi all'inventario
      if (!player.inventory[reward.item]) {
        player.inventory[reward.item] = 0;
      }
      player.inventory[reward.item] += reward.quantity;
      
      rewardText += `🎁 ${reward.quantity}x ${reward.item}\n`;
    }
  }
  
  if (!returnText) {
    if (rewardText) {
      conn.reply(m.chat, `✅ Hai ottenuto:\n${rewardText}`, m);
    }
    return;
  }
  
  return rewardText;
}

async function checkLevelUp(conn, m, player) {
  // Formula di calcolo XP per livello: 100 * livello attuale
  const xpNeeded = 100 * player.level;
  
  if (player.xp >= xpNeeded) {
    // Level up!
    player.level++;
    player.xp -= xpNeeded;
    
    // Aumenta statistiche
    const hpIncrease = 10;
    const manaIncrease = 5;
    
    player.maxHp += hpIncrease;
    player.maxMana += manaIncrease;
    
    // Cura completamente il giocatore come bonus per il level up
    player.hp = player.maxHp;
    player.mana = player.maxMana;
    
    // Notifica livello aumentato
    await conn.reply(m.chat, `🌟 *LEVEL UP!* 🌟\n\nSei salito al livello ${player.level}!\n+${hpIncrease} HP massimi\n+${manaIncrease} Mana massimo\n\nVita e mana completamente ripristinati!`, m);
    
    // Controlla ancora in caso di multi-level up
    return checkLevelUp(conn, m, player);
  }
  
  return false;
}

async function dungeonComplete(conn, m, player) {
  let text = `🎊 *DUNGEON COMPLETATO!* 🎊\n\n`;
  text += `Congratulazioni! Hai completato con successo il dungeon!\n\n`;
  
  // Incrementa contatore dungeon completati
  player.completedDungeons = (player.completedDungeons || 0) + 1;
  
  // Bonus per completamento
  const completionBonus = {
    xp: 300,
    gold: 200
  };
  
  text += `Bonus completamento:\n`;
  text += `✨ ${completionBonus.xp} XP\n`;
  text += `💰 ${completionBonus.gold} oro\n\n`;
  
  player.xp += completionBonus.xp;
  player.gold += completionBonus.gold;
  
  // Ripristina il giocatore all'ingresso per nuove avventure
  player.currentRoom = 'entrance';
  player.hp = player.maxHp; // Cura completa
  player.mana = player.maxMana;
  
  text += `Sei tornato all'ingresso, pronto per nuove avventure!\n`;
  text += `Usa *!dungeon* per iniziare una nuova esplorazione.`;
  
  savePlayerData({ players: { [m.sender]: player } });
  return conn.reply(m.chat, text, m);
}

function savePlayerData(data) {
  // Carica l'intero file
  let fullData;
  try {
    fullData = JSON.parse(fs.readFileSync(DATABASE_FILE));
  } catch (e) {
    fullData = { players: {} };
  }
  
  // Aggiorna solo i dati del giocatore specifico
  Object.assign(fullData.players, data.players);
  
  // Salva il file aggiornato
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(fullData, null, 2));
}

// Registrazione dei comandi
handler.help = ['dungeon', 'inizia', 'stats', 'stato', 'inventario', 'inv', 'usa', 'scegli', 'restart'];
handler.tags = ['rpg', 'game'];
handler.command = /^(dungeon|inizia|stats|stato|inventario|inv|usa|scegli|restart)$/i;

export default handler;