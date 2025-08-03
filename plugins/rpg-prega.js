const EASTER_EGG_CHANCE = 0.2; // 20% (1 su 5) possibilità di trovare un uovo di Pasqua

let handler = async (m) => {
  let user = global.db.data.users[m.sender];
  let d = Math.floor(Math.random() * 20); // Quantità casuale di dolci (da 0 a 20)
  let time = user.lastbeg + 300000; // Tempo di attesa: 30 minuti

  // Verifica se l'utente ha già mendicato e se è ancora in cooldown
  if (new Date() - user.lastbeg < 300000) {
    return conn.reply(m.chat, 
      `⚠️ Devi aspettare ${msToTime(time - new Date())} prima di poter pregare di nuovo! nel frattempo boh, bestemmia`, 
      m, rcanal
    );
  }

  // Controlla se l'utente trova un uovo di Pasqua
  let easterEggFound = Math.random() < EASTER_EGG_CHANCE;
  let easterEggMessage = '';
  
  if (easterEggFound) {
    user.uova += 1; // Incrementa il contatore uova
    easterEggMessage = '\n\n🐣 *Hai trovato un uovo di Pasqua!* 🥚\nOra hai ' + user.uova + ' uova nel tuo inventario!';
  }

  // Messaggio di ricompensa
  let replyMessage = `*${pickRandom(global.beg)} ${d}* *DOLCI 🍬*${easterEggMessage}`;
  
  // Aggiungi i dolci all'utente
  user.limit += d;
  user.lastbeg = new Date() * 1; // Imposta il tempo di cooldown

  conn.reply(m.chat, replyMessage, m, phishy);
};

handler.command = ["beg", "prega"]; // Comandi che attivano questo handler
handler.dfail = null; // Gestione degli errori
handler.exp = 0; // Esperienza guadagnata
export default handler;

// Funzione per convertire i millisecondi in minuti e secondi
function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return minutes + " minuti e " + seconds + " secondi";
}

// Funzione per scegliere un elemento casuale da una lista
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

// Lista di frasi legate alla mendicità
global.beg = [
  "Diventi un esperto nel trovare monete perdute nei divani e guadagni",
  "Mendichi online offrendo consigli su come evitare le faccende domestiche e guadagni",
  "Organizzi una competizione di 'faccia da cucciolo triste' per strada e i passanti ti danno",
  "Porti un cartello che dice 'Il mio unicorno ha bisogno di cibo' e sorprendentemente raccogli",
  "Decidi di diventare un mendicante gourmet e chiedi donazioni per il tuo 'caffè immaginario', raccogli",
  "Offri un servizio di 'consigli inutili' sul marciapiede e la gente ti ricompensa con",
  "Metti un cappello per terra e fingi di essere un 'artista di strada', raccogli",
  "Ti fingi un influencer della mendicità sui social media e ottieni",
  "Mendichi nel parco condividendo battute pessime e guadagni",
  "Vestito come un gentiluomo in disgrazia, chiedi l'elemosina al mercato e riesci a raccogliere",
  "Offri 'storie emozionanti' in cambio di monete nel parco e guadagni",
  "Vendi aria fresca in una busta come 'prodotto esclusivo' e ottieni",
  "Metti un cartello che dice 'L'ultimo mendicante Jedi ha bisogno di aiuto' e la gente ti dà",
  "Mendichi come 'consulente per problemi inesistenti' per strada e guadagni",
  "Offri abbracci virtuali e ottieni donazioni per la tua 'calore umano'",
  "Fai uno spettacolo di mimo comico e la gente ti ricompensa con",
  "Vestito come uno scienziato pazzo, chiedi 'donazioni per esperimenti' e riesci a raccogliere",
  "Mendichi a un angolo vestito da unicorno ballerino e guadagni",
  "Offri 'previsioni del futuro gratuite' e ottieni donazioni per le tue immaginarie capacità divinatorie",
  "Metti un cartello che dice 'Il mio altro lavoro è mendicare su Marte' e la gente ti ricompensa con",
  "Mendichi come 'allenatore di pollici' per aiutare le persone a cliccare più velocemente e guadagni",
  "Offri 'cure immaginarie' per malanni inesistenti e ottieni donazioni per i tuoi 'poteri di guarigione'",
  "Porti una scatola di cartone che dice 'Spazio in affitto nella mia scatola' e la gente ti dà",
  "Mendichi vestito da pirata e racconti storie emozionanti delle tue avventure in mare, guadagnando",
  "Offri 'consigli di stile' con vestiti di seconda mano e ottieni donazioni per il tuo 'senso della moda squisito'",
  "Fai una competizione di 'danza goffa' per strada e guadagni",
];