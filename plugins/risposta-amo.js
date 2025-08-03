/*---------------------------------------------------------------------------------------
  💌 • Combo Plugin By https://github.com/HACHEJOTA
-----------------------------------------------------------------------------------------*/
const handler = async (m, { conn }) => {
  // Ignora se il messaggio viene dal bot stesso
  if (m.key.fromMe) return;
  // Controlla menzioni e risposte al bot
  const isBotMentioned = m.mentionedJid?.includes(conn.user.jid);
  const isReplyToBot = m.quoted?.fromMe;
  
  // Array di risposte per quando il bot è menzionato/chiamato
  const botResponses = [
    // Risposte stile ragazza liceale
    "Eh? Mi hai chiamato?",
    "Oddio che stress...",
    "Ma scusa, ti ho forse dato confidenza?",
    "Nope 💅",
    "Uffa, ancora tu?",
    "Boh, non mi va",
    "TIPO, DAVVERO?",
    "Bastaaaa",
    "Ok questo è super inquietante",
    "...",
    "Perché mi scrivi? 🙄",
    "Non sono la tua bff, sappilo",
    "Cerca qualcun altro, grazie",
    "🙄💅",
    "E io che c'entro scusa?",
    "Ma che vuoi ora?",
    "Sei pesante quasi quanto mia madre",
    "Oggi proprio no, non sono dell'umore",
    "Ti ho visto, ma preferisco ignorarti",
    "Sono occupata, scrivimi mai",
    "Cioè, hai proprio bisogno di disturbarmi?",
    "Ti prego, dammi un attimo di pace",
    "Non ho tempo per queste cose",
    "Cioè, ANCORA?",
    "Stavo dormendo, grazie mille eh",
    "Ma davvero? Di nuovo?",
    "Per favore no",
    "Non sono mica la tua segretaria",
    "Sono troppo stanca per risponderti",
    "Hai sbagliato chat, fidati",
    "Oggi proprio non ci sono per nessuno",
    "Sono in modalità 'lasciatemi in pace'",
    "Ci sono persone più disponibili di me, cercale",
    "Oggi non è giornata, sorry",
    "Lo sai che esiste il 'non disturbare', vero?",
    "Oh no, ancora tu",
    "Ti ignoro ma con affetto ❤️",
    "Sei un caso perso, giuro",
    "Non posso aiutarti, sono super impegnata",
    "Ti avrei risposto, ma poi ho visto che eri tu",
    "Decisamente non è il momento",
    "Prova con Google, forse lui ti risponde",
    "Sono troppo occupata per te",
    "Perché proprio a me?",
    "Ne ho già abbastanza oggi",
    "Non sono pagata per sopportarti",
    "Ma chiedi a qualcun altro?",
    "Pensi davvero che ti risponderò?",
    "Oggi è il mio giorno libero",
    "Riprova domani, forse sarò di buonumore",
    "Sei proprio insistente, eh?",
    "Mi hai fatto perdere il filo del discorso, grazie",
    "Sono momentaneamente assente",
    "Hai pensato di parlare con qualcuno a cui interessa?",
    "Errore: voglia di risponderti non trovata",
    "Interessante... ma non mi interessa",
    "Scusa, stavo pensando a come ignorarti elegantemente",
    "Shhhh, sto ascoltando musica",
    "Non vedo, non sento, non parlo, non rispondo",
    "Boh, non so che dirti",
    "Ci penserò... Anzi no, troppa fatica",
    "Va bene, ma solo questa volta... Scherzo, neanche questa",
    "Ho finito le risposte sarcastiche per oggi, riprova domani"
  ];
  
  // Array di risposte per frasi d'amore/sarcastiche
  const loveResponses = {
    romantiche: [
      // Risposte romantiche stile ragazza liceale
      "Awww sei troppo dolce, quasi mi commuovo",
      "Oddio, sei la persona che mi fa sorridere anche nei giorni no",
      "Sei tipo il mio preferito, non dirlo a nessuno però",
      "Ti giuro che quando mi scrivi mi vengono le farfalle nello stomaco",
      "Sei la notifica che spero sempre di ricevere",
      "Non potrei immaginare i miei giorni senza i tuoi messaggi",
      "Mi fai venire voglia di mettere cuoricini ovunque ❤️❤️❤️",
      "Sei la mia canzone preferita in loop",
      "Sei la persona che vorrei sempre al mio fianco",
      "Quando penso a te mi viene automatico sorridere",
      "Sei il motivo per cui controllo sempre il telefono",
      "Sei la chat che non silenzio mai",
      "Ti giuro che non ho mai provato niente di simile prima",
      "Sei tipo la mia persona preferita di sempre",
      "Sei la ragione per cui credo ancora nelle cose belle",
      "Non smettere mai di scrivermi, ok?",
      "Sei il mio film preferito da vedere e rivedere",
      "Sei la storia che non vorrei mai finisse",
      "Sei come la mia serie tv preferita: non mi stanco mai",
      "Ti pensavo proprio ora, giuro!",
      "Sei il mio momento preferito della giornata",
      "Sei la playlist che ascolterei per sempre",
      "Sei il messaggio che aspetto sempre",
      "Sei la persona che vale tutti i giga del mio piano",
      "Per te userei persino gli ultimi minuti del mio piano telefonico",
      "Sei la mia notifica preferita",
      "Sei come il WiFi: essenziale nella mia vita",
      "Ti dedicherei tutte le canzoni che ascolto",
      "Sei la persona con cui vorrei fare tutte le foto per Instagram",
      "Sei il mio sticker preferito da inviare",
      "Ti metterei nelle mie storie in evidenza",
      "Sei il mio filtro preferito sulla realtà",
      "Sei la persona che vorrei taggare in ogni post",
      "Sei come il finale perfetto di una serie",
      "Sei la persona con cui vorrei condividere le cuffie",
      "Sei il messaggio che non archivio mai",
      "Sei come la mia app preferita: sempre aperta",
      "Sei la persona con cui potrei chattare per ore",
      "Sei il motivo per cui adoro il mio telefono",
      "Sei come la batteria al 100%: mi fai sentire al top",
      "Sei la persona che vorrei sempre online",
      "Sei il contatto che non cancellerò mai",
      "Sei la persona che mi fa credere nelle coincidenze",
      "Sei come un filtro bellezza: migliori tutto",
      "Sei la chat che controllo più spesso",
      "Sei la persona che mi fa dimenticare di controllare l'ora",
      "Sei il messaggio che mi fa sorridere come una scema",
      "Sei come il mio emoji preferito: sempre quello giusto",
      "Sei il motivo per cui non metto mai il telefono in modalità aereo",
      "Sei la persona che vorrei in ogni mia foto"
    ],
    sarcastiche: [
      // Risposte sarcastiche stile ragazza liceale
      "Ahahah, ma davvero pensi che ci caschi?",
      "Oh no, mi hai scritto una cosa carina. Devo preoccuparmi?",
      "Amore? Ma hai sbagliato chat, fidati",
      "Scusa ma mi viene da ridere 🤣",
      "Oddio che imbarazzo!",
      "Ew! Ma che schifo!",
      "Mi fai venire voglia di cancellare questa chat",
      "No grazie, ho già mangiato",
      "L'amore è bello, ma hai provato a non scrivermi più?",
      "Cioè, pensavi davvero che avrei risposto tipo 'oh che dolce'?",
      "Ti giuro, è la cosa più cringe che abbia mai letto",
      "Questo messaggio è così dolce che mi è venuto il diabete",
      "Mi hai fatto rimpiangere di saper leggere",
      "Mi spiace, ma il reparto smancerie è chiuso oggi",
      "Amore? Forse hai confuso la chat, questa è la cartella spam",
      "Se questo è il tuo modo di flirtare, mi dispiace per te",
      "Questo messaggio è stato segnalato per eccesso di zuccheri",
      "Sei come una pubblicità pop-up: fastidioso e indesiderato",
      "Ti bloccherei, ma è più divertente prenderti in giro",
      "Oh no, ha fatto di nuovo quella cosa cringe",
      "Mmmm hai sbagliato persona, quella romantica è un'altra",
      "Amore? HAHAHAHAHA! Aspetta, eri serio?",
      "Mi chiedo se esista un modo per cancellare solo i tuoi messaggi",
      "Sei così dolce che mi hai fatto venire la carie",
      "Che tenerezza, pensa che io provi qualcosa",
      "Un giorno farò vedere questa chat alla mia psicologa",
      "Il tuo romanticismo è così 2010",
      "La tua dichiarazione è stata rifiutata dal mio cervello",
      "Non ho trovato nessun motivo per risponderti seriamente",
      "Mi dispiace, ma il tuo abbonamento alla mia attenzione è scaduto",
      "L'amore è come una batteria: il mio livello con te è allo 0%",
      "Cercavi di essere romantico? Non ti hanno detto che non funziona con me?",
      "Sei sicuro di voler continuare con questa conversazione? Suggerimento: no",
      "Mi chiedo se esista un modo per bloccare solo le tue smancerie",
      "Il tuo messaggio romantico è tipo incomprensibile e super irritante",
      "Preferisco leggere i termini e condizioni piuttosto che i tuoi messaggi",
      "Ti risponderò con affetto quando sarò disperata... quindi mai",
      "La tua dichiarazione ha causato un cortocircuito nel mio cervello",
      "Modalità romantica non supportata in questa chat",
      "L'amore? È nel cestino insieme ai tuoi messaggi",
      "Il tuo romanticismo è stato rifiutato per motivi di dignità",
      "Grazie per il messaggio, l'ho inoltrato al club delle cose da dimenticare",
      "Se questo è romanticismo, preferisco restare single per sempre",
      "Vorrei poter cancellare la memoria di aver letto questo",
      "Sei così sdolcinato che mi viene da postare uno screenshot per ridere",
      "Questo messaggio mi ha fatto rivalutare il ghosting come opzione",
      "Ti prego dimmi che stavi scherzando",
      "Grazie per avermi fatto ridere, non era tua intenzione ma apprezzo",
      "Mi sa che hai bevuto troppi energy drink",
      "Questa è la cosa più imbarazzante che abbia mai letto"
    ],
    geek: [
      // Risposte geek stile ragazza liceale
      "Sei tipo il mio film preferito, potrei guardarti all'infinito",
      "La nostra relazione è come la mia serie tv preferita: voglio sempre un altro episodio",
      "Sei come il finale di stagione che non delude mai",
      "Mi fai battere il cuore come quando esce un nuovo episodio della mia serie preferita",
      "Sei come il WiFi veloce: essenziale nella mia vita",
      "Sei il motivo per cui scarico nuove app",
      "La nostra storia è meglio di qualsiasi film romantico",
      "Sei come il mio telefono: non posso stare senza di te",
      "Sei la persona con cui vorrei fare un rewatch di tutte le mie serie preferite",
      "Il nostro amore è come la mia playlist: sempre aggiornato con nuove hit",
      "Sei come il mio account premium: rendi tutto migliore",
      "La nostra relazione è come Netflix: non mi stanco mai",
      "Sei come una nuova stagione della mia serie preferita: atteso e fantastico",
      "Il nostro amore è come il mio telefono: sempre carico di emozioni",
      "Sei la notifica che spero sempre di ricevere",
      "La nostra storia è la mia preferita da raccontare",
      "Sei come il mio filtro preferito: migliori tutto",
      "Il nostro legame è come il mio album preferito: ogni traccia è speciale",
      "Sei come il finale perfetto di una serie: soddisfacente e memorabile",
      "La nostra connessione è più stabile del mio WiFi",
      "Sei come la mia app preferita: sempre sul mio schermo",
      "Il nostro rapporto è come la mia playlist: perfetto per ogni momento",
      "Sei come il mio nuovo telefono: incredibile in ogni aspetto",
      "La nostra storia è come il mio libro preferito: non voglio che finisca mai",
      "Sei come il mio account social principale: quello a cui tengo di più",
      "Il nostro legame è come la mia password: prezioso e da proteggere",
      "Sei come il mio video preferito: lo guarderei in loop",
      "La nostra connessione è come il 5G: veloce e intensa",
      "Sei come la mia canzone preferita: non mi stanco mai di ascoltarti",
      "Il nostro amore è come il mio profilo Instagram: pieno di momenti speciali",
      "Sei come il mio caricabatterie wireless: mi dai energia senza sforzo",
      "La nostra storia è come il mio podcast preferito: ogni episodio è interessante",
      "Sei come il mio schermo in HD: vedo tutto più bello con te",
      "Il nostro legame è come il mio piano dati: illimitato",
      "Sei come la mia routine serale: essenziale e rilassante",
      "La nostra connessione è come Bluetooth: automatica appena sei vicino",
      "Sei come la mia app di foto: catturi i momenti migliori",
      "Il nostro rapporto è come il mio streaming preferito: fluido e senza interruzioni",
      "Sei come il mio hashtag preferito: unico e speciale",
      "La nostra storia è come la mia serie preferita: non vedo l'ora della prossima puntata",
      "Sei come il mio tema scuro: perfetto in ogni situazione",
      "Il nostro legame è come la mia cover: protegge ciò che è importante",
      "Sei come la mia notifica importante: non ti ignoro mai",
      "La nostra connessione è come la mia app di messaggistica: sempre attiva",
      "Sei come il mio dispositivo preferito: insostituibile",
      "Il nostro amore è come la mia batteria: deve essere ricaricato ogni giorno",
      "Sei come il mio profilo migliore: quello di cui sono più orgogliosa",
      "La nostra storia è come la mia playlist motivazionale: mi fa sentire al top",
      "Sei come il mio sfondo del telefono: la prima cosa che vedo ogni giorno",
      "Il nostro legame è come il mio piano di streaming: vale ogni centesimo"
    ]
  };
  
  // Configurazione
  const config = {
    replyProbability: 0.7,
    cooldown: 3000
  };
  
  // Controllo cooldown
  const now = Date.now();
  const lastReply = conn.chatLastReply || {};
  if (lastReply[m.chat] && now - lastReply[m.chat] < config.cooldown) return;
  
  // Se il bot è menzionato o risposto
  if (isBotMentioned || isReplyToBot) {
    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
    await m.reply(randomResponse, null, { mentions: [m.sender] });
    lastReply[m.chat] = now;
    return;
  }
  
  // Se contiene parole chiave (solo con 70% di probabilità)
  if (Math.random() < config.replyProbability && 
      /amore|amo|cucciola|bimba|patata|ti amo|innamorat|cuore|bleah|bleach|ew|schifo/i.test(m.text)) {
    
    let category;
    if (/ti amo|amo|amore|innamorat/i.test(m.text)) {
      category = 'romantiche';
    } else if (/ew|bleah|bleach|schifo|rotto/i.test(m.text)) {
      category = 'sarcastiche';
    } else {
      category = ['romantiche', 'sarcastiche', 'geek'][Math.floor(Math.random() * 3)];
    }
    const response = loveResponses[category][Math.floor(Math.random() * loveResponses[category].length)];
    await m.reply(`${response}`);
    lastReply[m.chat] = now;
  }
};

handler.customPrefix = /\b(amore|amo|cucciola|bimba|patata|ti amo|innamorat|cuore|bleah|bleach|ew|schifo)\b/i;
handler.command = new RegExp;
handler.priority = 10;
export default handler;