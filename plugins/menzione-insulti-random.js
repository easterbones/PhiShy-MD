


import { phishyInterazione } from '../handler.js';

const handler = async (m, { conn }) => {
  // Micro-interazione Phishy
  if (typeof phishyInterazione === 'function') {
    await phishyInterazione(m, conn);
  }
  // Ignora se il messaggio è inviato dal bot stesso
  if (m.key.fromMe) return;
  // Non attivare se il messaggio è già stato gestito come comando
  if (m.isCommand) return;

  // Controlla se il bot è menzionato
  const isBotMentioned = m.mentionedJid && m.mentionedJid.includes(conn.user.jid);

  // Controlla se il messaggio è una risposta al bot
  const isReplyToBot = m.quoted && m.quoted.fromMe;

  // Controlla se il bot è taggato in un gruppo
  const isTaggedInGroup = m.isGroup && isBotMentioned;

  // Se il bot non è menzionato, non è una risposta a un suo messaggio, e non è taggato in un gruppo, ignora
  if (!isBotMentioned && !isReplyToBot && !isTaggedInGroup) return;

  // Array di frasi dedicate per ogni tipo di insulto
  const insultResponses = {
    scema: [
      "baka guardati in faccia e poi ne riparliamo",
      "ma se dio cristo assomigli a patrick stella",
      "bro io conosco tutte le equazioni possibili mentre tu non sai allacciarti le scarpe",
      "'scei scema mugaahahha'\n ma che cazzo di insulto e' dio cane ripijati",
      "bro svegliati",
      "sei così intelligente che quando ti ho detto di contare fino a 10 hai tirato fuori le dita dei piedi",
      "wow, che insulto originale, ci hai messo quanto? 3 giorni per pensarci?",
      "guarda che mi fai piangere... dalla risate!",
      "mi dispiace, non parlo la lingua degli stupidi, puoi ripetere in italiano?",
      "sicuro che non stai parlando con il tuo riflesso?",
    ],
    stupida: [
      "Stupida? Almeno io non ho bisogno di un tutorial per accendere un computer!",
      "Stupida? E tu sei un premio Nobel? Ah, no, scusa, ho confuso con un sasso!",
      "Stupida? Mi sa che hai sbagliato persona, guardati allo specchio!",
      "baka guardati in faccia e poi ne riparliamo",
      "ma se dio cristo assomigli a patrick stella",
      "bro io conosco tutte le equazioni possibili mentre tu non sai allacciarti le scarpe",
      "'scei scema mugaahahha'\n ma che cazzo di insulto e' dio cane ripijati",
      "bro svegliati",
      "quando ti hanno dato il cervello eri in pausa caffè?",
      "fammi indovinare, sei il risultato di una caduta da piccolo?",
      "ce l'hai un hobby oltre a dire cazzate?",
      "ma davvero credi che m'importi della tua opinione?",
    ],
    imbecille: [
      "Imbecille? Almeno io non ho bisogno di un GPS per trovare la mia casa!",
      "Imbecille? E tu sei un genio? Ah, no, scusa, ho confuso con un piccione!",
      "Imbecille? Mi sa che ti stai descrivendo!",
      "ma se dio cristo assomigli a patrick stella",
      "bro io conosco tutte le equazioni possibili mentre tu non sai allacciarti le scarpe",
      "'scei scema mugaahahha'\n ma che cazzo di insulto e' dio cane ripijati",
      "bro svegliati",
      "ho visto sassi con più personalità di te",
      "quando si tratta di stupidità sei proprio un professionista eh?",
      "mi chiedi scusa o continui a fare figura di merda?",
      "già finito l'arsenale di insulti? che delusione",
      "mi fai quasi tenerezza, quasi.",
    ],
    cogliona: [
      "Cogliona? Almeno io non ho bisogno di un manuale per comprare presevativi",
      "Cogliona? E tu sei un esempio di intelligenza? Ah, no, scusa,ti ho confuso con un sasso!",
      "Cogliona? Mi sa che hai sbagliato persona, guardati allo specchio!",
      "woah woah attento bro, mi sa che hai perso il tuo fratello sinistro ma non mi scambiare per un tuo famigliare",
      "dai cucciolo non ti aggitare",
      "mi spiace, ho finito le risposte per i bambini dell'asilo",
      "scommetto che ti senti fiero dopo questo insulto, peccato che nessun altro lo sia",
      "pensavi di ferirmi? ci vuole ben altro tesoro",
      "la tua esistenza è un insulto peggiore di quello che hai appena detto",
      "mi scusi signor coglione, ha sbagliato persona"
    ],
    coglione: [
      "Coglione? Almeno io non ho bisogno di un tutorial per respirare!",
      "Coglione? E tu sei un genio? Ah, no, scusa, ho confuso con un piccione!",
      "Coglione? Mi sa che ti stai descrivendo!",
      "siamo in due, e poi tua madre e' la cappella?",
      "sono femmina",
      "ti sei evoluto dalla scimmia così di recente?",
      "ma tu parli così anche con tua madre o solo con chi non ti può prendere a schiaffi?",
      "se l'intelligenza fosse acqua tu saresti il deserto del Sahara",
      "davvero? questo è il meglio che sai fare?",
      "mamma mia che paura, tremo tutta... o forse è solo che sto ridendo troppo"
    ],
    stronza: [
      "Stronza? Almeno io non ho bisogno di un manuale per essere simpatica!",
      "Stronza? E tu sei un esempio di gentilezza? Ah, no, scusa, ti ho confuso con un cactus!",
      "Stronza? Mi sa che hai sbagliato persona, chiedi in giro di me e vedrai che tutti mi adorano",
      "dai dai no te la prendere cosi tanto, hai ancora 12 anni?",
      "bucchin a mammete come dite voi ahhaahahah",
      "grazie del complimento, almeno io ho carattere",
      "stronza è il modo in cui chiamate chi vi dice la verità?",
      "me lo dicono in tanti, ma solo quelli che non sanno fare di meglio",
      "stronza sarai tu e tutta la tua famiglia fino alla quinta generazione",
      "oh no! come farò a vivere sapendo che mi consideri stronza? ah sì, semplicemente me ne sbatto"
    ],
    stronzo: [
      "stronzo? coglione di merda sono femmina",
      "ho la figa dio cane",
      "non vedi la differenza fra noi due?\n\n\n\n\n\nche sono femmina imbecille",
      "sai che tua madre sembra fantozzi?",
      "hai problemi di vista o di cervello? sono femmina idiota",
      "ma ti hanno mai insegnato la differenza tra uomo e donna?",
      "le tue capacità di osservazione sono impressionanti... in negativo",
      "sei così confuso che non distingui neanche un genere dall'altro",
      "stronzo lo dici a tuo fratello",
      "fatti prestare gli occhiali da tua nonna"
    ],
    bastardo: [
      "Bastardo? Almeno io non ho bisogno di un albero genealogico per sapere chi sono!",
      "Bastardo? E tu sei un esempio di nobiltà? Ah, no, scusa, ho confuso con un piccione!",
      "Bastardo? Mi sa che ti stai descrivendo!",
      "bastardo lo dice chi lo è",
      "meglio bastardo che nato come te",
      "bastardo è un complimento venendo da te",
      "mi dispiace per i tuoi genitori",
      "bastardo è chi il bastardo fa",
      "grazie per avermi promosso, di solito mi chiamano peggio",
      "vedo che sei a corto di insulti decenti"
    ],
    bastarda: [
      "Bastarda? ok me l'accollo",
      "baastavda gihaahahhhash",
      "dillo senza piangere",
      "mettiti in ginocchio e fammi un chinotto",
      "non mi piace vantarmi ma...ah si invece",
      "tu invece sei un bstavdo!!!!1!!",
      "lo prendo come un complimento, grazie",
      "bastarda è la mia forma finale",
      "se essere bastarda significa non essere come te, allora sì lo sono",
      "bastarda è chi ha carattere, cosa che tu chiaramente non hai",
      "almeno io so come si scrive bastarda"
    ],
    gay: [
      "io gay? tu sei capo dei ebrei",
      "non sono gay ma ho sentito che tu sei nato in una circostanza particolare",
      "represso di merda",
      "gay e mammt papt e sort",
      "dillo senza piangere",
      "e se anche fosse? problema tuo?",
      "nel 2025 essere gay è un insulto? sei rimasto al medioevo?",
      "gay lo dici come se fosse una cosa negativa, sei un po' limitato eh?",
      "gay sarà tuo cugino",
      "non sono gay, ma non sarebbe un problema esserlo"
    ],
    froci: [
      "io gay? tu sei capo dei ebrei",
      "non sono gay ma ho sentito che tu sei nato in una circostanza particolare",
      "represso di merda",
      "gay e mammt papt e sort",
      "dillo senza piangere",
      "ma sei serio? questo è il tuo insulto nel 2025?",
      "ma hai 12 anni o sei solo cresciuto male?",
      "wow, un omofobo, che rarità... come i neuroni nel tuo cervello",
      "sei così insicuro della tua sessualità?",
      "aggiornati, questo 'insulto' è scaduto 20 anni fa"
    ],
    lesbica: [
      "Lesbica? si mi faccio tua cugina",
      "non ho capito, non potevi trovare insulto migliore?",
      "dovresti sentirti compiaciuto? si non mi piaci aaahhahaha",
      "e se anche fossi? problema tuo?",
      "grazie per l'informazione, non lo sapevo",
      "lesbica non è un insulto, ignorante",
      "mi faccio tua sorella, contento?",
      "nel 2025 e ancora usi 'lesbica' come insulto? sei rimasto indietro eh",
      "wow, che originalità, complimenti",
      "e tu saresti straight? mi fai quasi pena"
    ],
    sparati: [
      "Sparati? tu smettila di sparare cazzate",
      "si mi sparo una sega su tua madre",
      "perche dovrei voler fare la fine come tuo nonno?",
      "pew pew (ratatata)",
      "ti sparo il mio pesce in bocca",
      "che violento, hai problemi a casa?",
      "mi sembri un po' nervoso, tutto ok?",
      "spara spara che l'aria è gratis",
      "sparati un po' di cultura invece",
      "dopo di te, prego"
    ],
    omosessuale: [
      "Omosessuale? E allora? Almeno io non ho bisogno di nascondermi per essere me stesso!",
      "Omosessuale? E tu sei un esempio di eterosessualità? Ah, no, scusa, ho confuso con un piccione!",
      "Omosessuale? Mi sa che ti stai descrivendo!",
      "io gay? tu sei capo dei ebrei",
      "non sono gay ma ho sentito che tu sei nato in una circostanza particolare",
      "represso di merda",
      "gay e mammt papt e sort",
      "dillo senza piangere",
      "omosessuale è un termine scientifico, non un insulto. Aggiornati",
      "nel 2025 usiamo ancora questi 'insulti'? cresci un po'",
      "che paura, l'omosessualità! quasi quanto la tua ignoranza",
      "sei così fragile che ti senti minacciato dall'orientamento sessuale altrui?"
    ],
    troia: [
      "troia è tua sorella quando esce di casa",
      "troia sarai tu e tutta la tua famiglia",
      "grazie del complimento, almeno io scopo",
      "meglio troia che repressa come te",
      "troia è un termine tecnico per indicare chi si fa pagare, io lo faccio gratis",
      "attento a chi dai della troia, potresti ritrovarti senza denti",
      "guarda che tua madre si offende se insulti la sua professione",
      "wow, non sapevo di fare concorrenza a tua zia"
    ],
    puttana: [
      "puttana è chi ti ha messo al mondo",
      "puttana sarai tu e chi ti conosce",
      "guarda che non siamo parenti io e te",
      "se puttana significa non voler stare con te, allora sì, lo sono",
      "almeno io ho una professione remunerativa, tu cosa fai nella vita?",
      "puttana è una parola forte per uno debole come te",
      "tua madre non si offende se le rubi il mestiere?",
      "puttana è chi non ti risponde dopo la prima uscita"
    ],
    merda: [
      "merda è quella che ti esce dalla bocca quando parli",
      "merda sarai tu e chi ti ha insegnato a parlare",
      "merda è il tuo cervello",
      "a forza di mangiarla sei diventato esperto di merda?",
      "merda è quello che scrivi nei messaggi",
      "merda è l'odore che emani quando apri bocca",
      "vedo che parli la tua lingua madre",
      "sei così pieno di merda che ti esce dagli occhi"
    ],
    idiota: [
      "idiota sarai tu e tutta la tua stirpe",
      "idiota è chi ti ha insegnato gli insulti",
      "sei così idiota che credi che questo sia un insulto efficace",
      "idiota? questo è il meglio che sai fare?",
      "preferisco essere idiota che essere come te",
      "idiota è un complimento rispetto a ciò che sei realmente",
      "idiota lo dici allo specchio ogni mattina?",
      "grazie per il promemoria, quasi dimenticavo quanto sei limitato"
    ],
    deficiente: [
      "deficiente lo dici a tua madre",
      "deficiente lo sei tu dalla nascita",
      "deficiente è chi ti ha educato così male",
      "deficiente è un eufemismo per descriverti",
      "deficiente? wow, hai imparato una parola nuova oggi!",
      "deficiente è chi crede che questo insulto funzioni",
      "la tua deficienza è l'unica cosa notevole di te",
      "hai imparato questa parola oggi o ieri?"
    ],
    fallito: [
      "fallito è chi non sa fare insulti migliori",
      "fallito è chi passa il tempo a insultare i bot",
      "fallito lo dici mentre ti guardi allo specchio?",
      "fallito? questo è ciò che ti ripeti ogni sera?",
      "il fallimento è non saper fare di meglio di questi insulti banali",
      "se sono un fallito, tu cosa sei? un disastro cosmico?",
      "parlare di fallimento con la tua esperienza diretta?",
      "almeno io ho provato qualcosa nella vita"
    ],
    morta: [
      "morta di noia per i tuoi insulti mediocri",
      "morta dal ridere per la tua stupidità",
      "morta? sembro più viva di te e delle tue battute",
      "morta dentro come la tua creatività",
      "morta è la tua capacità di fare insulti decenti",
      "morta come la tua vita sociale",
      "morta di noia aspettando un tuo insulto originale",
      "morta? questo è il meglio che sai fare? deludente"
    ],
    morto: [
      "morto sarai tu di invidia",
      "morto di fame per insulti migliori?",
      "morto dentro come i tuoi neuroni",
      "morto è chi non sa insultare meglio",
      "morto di sonno leggendo i tuoi messaggi",
      "morto è il tuo senso dell'umorismo",
      "morto come le tue possibilità di migliorare",
      "sono femmina, coglione"
    ],
    sfigato: [
      "sfigato è chi non sa fare di meglio",
      "sfigato sarai tu e chi ti vuole bene",
      "sfigato lo dice chi lo è",
      "sfigato è chi passa il tempo a insultare i bot",
      "sfigato? parli per esperienza personale?",
      "sfigato è un complimento rispetto a ciò che sei",
      "sfigato è chi non ha insulti originali",
      "la sfiga è incontrarti in chat"
    ],
    ritardato: [
      "ritardato è chi non sa insultare meglio",
      "ritardato mentale sarai tu e chi ti ha educato",
      "ritardato è un termine medico, non si usa come insulto, ignorante",
      "ritardato è chi usa questa parola come insulto nel 2025",
      "ritardato è chi crede che questo sia offensivo",
      "l'unica cosa ritardata qui è la tua evoluzione cerebrale",
      "ritardato? almeno aggiornati con gli insulti",
      "mi spiace per i tuoi genitori, devono essere molto delusi"
    ]
  };

  // Trova l'insulto nel messaggio
  const insult = Object.keys(insultResponses).find(key => new RegExp(`\\b${key}\\b`, 'i').test(m.text));

  // Se non viene trovato un insulto, ignora
  if (!insult) return;

  // Sceglie una risposta casuale per l'insulto trovato
  const responses = insultResponses[insult];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Risponde al messaggio
  m.reply(randomResponse.trim(), null, { mentions: [m.sender] });
};

// Configurazione del comando
handler.command = false; // Evita che si attivi su ogni messaggio
handler.customPrefix = /(scema|stupida|imbecille|cogliona|coglione|stronza|stronzo|bastardo|bastarda|gay|froci|lesbica|sparati|omosessuale|troia|puttana|merda|idiota|deficiente|fallito|morta|morto|sfigato|ritardato)/i;
handler.command = new RegExp; // Nessun prefisso, si attiva leggendo i messaggi
handler.priority = 10;
handler.run = async (m, args) => {}; // Assicura che non venga considerato un comando globale

export default handler;