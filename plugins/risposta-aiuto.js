/*---------------------------------------------------------------------------------------
  💌 • Consigli Phishy By https://github.com/HACHEJOTA
  🔄 • Enhanced with more crazy advice
-----------------------------------------------------------------------------------------*/

const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

var handler = async (m, { conn, text }) => {
  let problema = text.toLowerCase()
  let risposta = ''
  
  // Consigli mirati basati sulla richiesta
  if (/amore|cuore|ragazz[oa]|fidanzat[oa]|relazione|crush|partner/i.test(problema)) {
    risposta = pickRandom([
      "Manda 3 caramelle alla persona che ti piace dicendo 'sono dolce come il mio carattere' - funziona al 120%",
      "Fatti un tatuaggio temporaneo col suo nome sulla fronte e mandale la foto dicendo 'look what you made me do'",
      "Organizza un flash mob solitario sotto casa sua ballando la macarena con un cartello 'sono qui per errore... o forse no?'",
      "Scrivi una poesia d'amore usando solo emoji e inviala ogni 15 minuti per 24 ore consecutive",
      "Fai una serenata con canzoni tradotte male con Google Translate da lingue che non conosci",
      "Presentati al primo appuntamento indossando un costume da dinosauro dicendo 'Il mio amore per te è preistorico'",
      "Regalagli un cactus con scritto 'Il mio amore è spinoso ma resistente come questa pianta'",
      "Invia 50 messaggi vocali di te che respiri pesantemente e alla fine dici solo 'pensavo a te'",
      "Chiedi ai suoi genitori il permesso di sposarla prima ancora del primo appuntamento"
    ])
  } 
  else if (/studio|scuola|esam|universit|lezione|compiti|prof/i.test(problema)) {
    risposta = pickRandom([
      "Leggi i libri stando a testa in giù: la conoscenza entra meglio per osmosi cerebrale",
      "Prendi appunti con la mano sinistra (anche se sei mancino): il cervello si sblocca per disperazione",
      "Mangia un quaderno prima dell'esame: la cellulosa è memoria a lunga conservazione",
      "Studia con le cuffie ma senza musica, solo il rumore di una lavatrice in centrifuga registrato",
      "Incolla post-it con formule matematiche sul soffitto sopra il letto: l'apprendimento notturno è scientifico",
      "Rispondi a ogni domanda del professore con 'Dipende dal contesto quantistico' e fissa il vuoto",
      "Traduci tutti i tuoi appunti in Klingon e poi ritorna all'italiano: la doppia traduzione aumenta la memorizzazione",
      "Ripeti gli argomenti importanti a un peluche e fai finta che ti faccia domande impossibili",
      "Indossa una corona di alloro durante lo studio per ingannare il cervello facendogli credere che sei già laureato"
    ])
  }
  else if (/lavoro|stipendio|capo|ufficio|carriera|colleghi|professionale/i.test(problema)) {
    risposta = pickRandom([
      "Presentati in mutande al colloquio: dimostrerai di non aver nulla da nascondere",
      "Chiedi un aumento scrivendo la richiesta con il ketchup sulla scrivania del capo",
      "Sostituisci gradualmente il caffè dell'ufficio con succo di carota: migliorerà l'umore generale",
      "Invia email importanti sostituendo tutte le vocali con la 'u': sarai ricordato per la tua unicità",
      "Porta un pesce rosso in ufficio e presentalo come il tuo assistente personale",
      "Rispondi a tutte le domande in riunione iniziando con 'Come direbbe mia nonna...' seguita da consigli totalmente irrilevanti",
      "Stampa il tuo curriculum su una t-shirt e indossala a ogni meeting aziendale",
      "Crea una presentazione con solo meme di gatti e insisti che contiene informazioni subliminali fondamentali",
      "Cambia il tuo titolo email in 'Futuro CEO (o forse no)' e firma ogni messaggio con 'Cordialmente dal bagno dell'ufficio'"
    ])
  }
  else if (/amiciz|amici|compagn|social|gruppo/i.test(problema)) {
    risposta = pickRandom([
      "Organizza una gara di rutti a distanza: il vincitore diventa il tuo migliore amico",
      "Regala a tutti calzini puzzolenti con scritto 'questo è il nostro legame'",
      "Crea un gruppo WhatsApp chiamato 'SOS Amicizia' e aggiungi solo sconosciuti",
      "Manda messaggi vocali di 10 minuti dove racconti nei minimi dettagli i tuoi sogni notturni",
      "Proponi un picnic dove ognuno deve portare solo cibi di un colore specifico assegnato da te",
      "Festeggia il compleanno dei tuoi amici nel giorno sbagliato insistendo che il calendario è una costruzione sociale",
      "Inizia a parlare di te in terza persona in ogni conversazione: 'Marco pensa che questa sia un'ottima idea'",
      "Inventa un linguaggio segreto fatto solo di versi di animali e pretendi che tutti lo imparino",
      "Proponi di fare un tatuaggio di gruppo con il volto del membro più antipatico del gruppo"
    ])
  }
  else if (/famigli|genitor|parent|mamma|papà|padre|madre|fratell|sorell/i.test(problema)) {
    risposta = pickRandom([
      "A cena indossa una maschera da cavallo e rifiutati di spiegare il perché",
      "Sostituisci tutte le foto di famiglia con screenshot di Gabibbo",
      "Inizia a chiamare tua madre 'colei che non deve essere nominata' in stile Voldemort",
      "Parla ai tuoi genitori solo attraverso note scritte a mano consegnate dal vicino di casa",
      "Proponi di ribattezzare tutti i membri della famiglia con nomi di personaggi di Star Wars",
      "Crea un PowerPoint di 50 slide sui motivi per cui dovresti adottare un alligatore domestico",
      "Chiedi a tuo padre di accompagnarti a comprare il pane vestito da ninja",
      "Organizza una riunione familiare formale per discutere chi ha finito il rotolo di carta igienica",
      "Metti sottotitoli sbagliati a tutti i film durante le serate cinema in famiglia e insisti che sono corretti"
    ])
  }
  else if (/cibo|cucina|cucinare|ricetta|dieta|mangiare/i.test(problema)) {
    risposta = pickRandom([
      "Prepara la pasta col ketchup e chiamala 'Spaghetti all'americana fusion gourmet'",
      "Servi tutti i piatti in contenitori da bagno come la tazza del WC o il porta sapone",
      "Aggiungi brillantini commestibili a tutto ciò che cucini 'per migliorare i nutrienti visivi'",
      "Crea un menu dove tutti i piatti iniziano con la stessa lettera del tuo nome",
      "Cucina bendato e chiama l'esperimento 'degustazione al buio casalinga'",
      "Sostituisci tutti gli ingredienti con versioni blu e chiama il risultato 'cena dei puffi'",
      "Servi la cena in ordine inverso: prima il dessert, poi il secondo, il primo e infine l'antipasto",
      "Inventa la 'pizza verticale': impila tutti gli ingredienti in una torre instabile",
      "Prepara un piatto usando solo ingredienti che scadono lo stesso giorno"
    ])
  }
  else if (/soldi|denaro|risparmi|economia|finanz|pagament|banca/i.test(problema)) {
    risposta = pickRandom([
      "Investi tutti i tuoi risparmi in una collezione di sassi dipinti a mano",
      "Paga tutto in centesimi contati uno ad uno mentre fischietti la sigla di 'La casa di carta'",
      "Apri un conto corrente a nome del tuo animale domestico per 'diversificare il portafoglio familiare'",
      "Conserva i soldi in barattoli di marmellata etichettati con destinazioni impossibili come 'Viaggio su Marte'",
      "Crea la tua moneta personale chiamata 'MeCoins' e proponi scambi con amici e negozianti",
      "Sostituisci il portafoglio con un calzino e spiega che è 'l'ultima tendenza in microfinanza'",
      "Inizia a pagare tutto in natura, portando zucchine dell'orto o disegni fatti a mano",
      "Proponi al tuo capo di essere pagato in abbracci o complimenti invece che in euro",
      "Chiedi un prestito alla banca portando come garanzia la tua collezione di figurine"
    ])
  }
  else if (/tecnologia|computer|telefono|smartphone|pc|app|social|internet/i.test(problema)) {
    risposta = pickRandom([
      "Proteggi il telefono avvolgendolo in tre strati di pellicola trasparente e uno di alluminio 'contro le onde aliene'",
      "Usa il computer indossando guanti da forno 'per proteggere le impronte digitali dal furto online'",
      "Parla al tuo smartphone con accento straniero perché 'l'assistente vocale capisce meglio'",
      "Installa tutte le app nella lingua che non conosci per 'allenamento cerebrale passivo'",
      "Scatta selfie esclusivamente con il telefono capovolto per 'prospettive alternative innovative'",
      "Rispondi a tutti i messaggi con vocali cantati in stile opera lirica",
      "Naviga su internet solo in modalità privata indossando occhiali da sole anche di notte",
      "Crea un profilo social per il tuo elettrodomestico preferito e taggalo in tutte le foto",
      "Usa il mouse con i piedi per 'migliorare la coordinazione neuromuscolare'"
    ])
  }
  else if (/salute|benessere|fitness|palestra|esercizio|medico|malattia/i.test(problema)) {
    risposta = pickRandom([
      "Sostituisci la sedia con una palla da fitness e rimbalza durante tutte le videochiamate",
      "Cammina all'indietro per almeno 20 minuti al giorno 'per bilanciare il karma motorio'",
      "Crea una dieta basata esclusivamente sui colori dell'arcobaleno: ogni giorno un colore diverso",
      "Massaggia i gomiti con fette di cetriolo prima di dormire 'per disintossicare i giunti'",
      "Fai jogging sul posto mentre sei in fila al supermercato per 'ottimizzare i tempi morti'",
      "Prepara tisane con foglie raccolte dal parco, ma prima di berle recita una poesia",
      "Indossa calzini diversi per stimolare 'l'equilibrio energetico bipolare dei piedi'",
      "Sostituisci la doccia con rotolamenti nell'erba bagnata 'per la pulizia naturale primordiale'",
      "Parla con le tue piante d'appartamento di tutti i tuoi problemi di salute aspettando consigli"
    ])
  }
  else if (/casa|pulizie|domestico|arredamento|trasloco|appartamento/i.test(problema)) {
    risposta = pickRandom([
      "Arreda casa seguendo rigorosamente i principi dell'anti-feng shui: mobili in diagonale e porte bloccate",
      "Pulisci i pavimenti indossando calzini bagnati e scivolando come se fossi su una pista di pattinaggio",
      "Sostituisci tutte le lampadine con luci colorate da discoteca 'per stimolare la produttività'",
      "Appendi i vestiti al soffitto 'per sfruttare lo spazio aereo domestico inutilizzato'",
      "Etichetta tutti gli oggetti in casa con nomi di personaggi storici e inizia a chiamarli così",
      "Usa le pentole come vasi per piante e i vasi come contenitori per la pasta",
      "Crea un sistema di comunicazione tra stanze usando bicchieri di plastica e spago",
      "Trasforma il bagno in una 'spa naturale' riempiendolo di piante e riproduzioni di suoni della giungla",
      "Costruisci un forte di cuscini nel soggiorno e usalo come unico spazio abitativo per una settimana"
    ])
  }
  else if (/viaggi|vacanza|turismo|estero|valigia|hotel|aereo/i.test(problema)) {
    risposta = pickRandom([
      "Prepara la valigia un mese prima ma metti solo vestiti dello stesso colore per 'coerenza estetica'",
      "Comunica solo con gesti e disegni durante tutto il viaggio 'per un'esperienza linguistica autentica'",
      "Scatta foto solo agli oggetti più insignificanti come prese elettriche o maniglie dell'hotel",
      "Porta con te una pianta in vaso come 'compagno di viaggio' e presentala a tutti",
      "Prenota hotel diversi per ogni notte della stessa città 'per un'esperienza comparativa completa'",
      "Crea un diario di viaggio scritto dal punto di vista delle tue scarpe",
      "Indossa un cappello diverso in ogni monumento e chiedi agli sconosciuti di fotografarti",
      "Viaggia seguendo un tema specifico, come 'tutti i luoghi con una statua equestre' o 'città che iniziano con la B'",
      "Porta una forchetta personale e usala per mangiare TUTTO, anche zuppe e bevande"
    ])
  }
  else {
    // Consigli generici assurdi
    risposta = pickRandom([
      "Fai 3 giri su te stesso borbottando 'supercazzola' - la soluzione apparirà in 3... 2... 1...",
      "Scrivi il problema su una banana e mangiala: la digestione è la migliore analisi dei problemi",
      "Indossa gli occhiali al contrario per 24h: la nuova prospettiva risolverà tutto",
      "Costruisci un altare con posate e chiedi consiglio al dio della cucina",
      "Fai la verticale e urla 'EUREKA!' anche se non hai capito nulla",
      "Prendi due cuscini e fagli fare un combattimento WWE - il vincitore ti darà la risposta",
      "Disegna un mostro che rappresenta il tuo problema e poi mangia il disegno per assimilare la soluzione",
      "Cucina una torta salata con dentro il tuo cellulare: la tecnologia deve essere assimilata, non usata",
      "Organizza una processione di scarpe per esorcizzare la sfortuna",
      "Impara a parlare al contrario per 3 giorni: le risposte arrivano quando meno te le aspetti",
      "Adotta un sasso come animale domestico e chiedigli consiglio: la saggezza minerale è sottovalutata",
      "Cammina come un granchio per un giorno intero: la visione laterale apre nuove prospettive",
      "Scambia il tuo nome con quello di un elettrodomestico: 'Ciao, sono Frullatore!'",
      "Cerca risposte nei fondi del caffè, ma solo di caffè preparati il martedì",
      "Fai domande importanti alla luna piena standosul tetto con un calzino in testa",
      "Crea un'orchestra usando solo oggetti trovati nel bagno e suona la 'Sinfonia della Soluzione'",
      "Inizia a misurare il tempo in 'momenti gatto' invece che in minuti",
      "Scrivi lettere d'amore al tuo problema e poi brucia le lettere in un rituale con candele colorate",
      "Cambia il tuo accento ogni ora dell'orologio per confondere i problemi che ti perseguitano",
      "Sostituisci una parola a caso nel tuo vocabolario con 'patata' per una settimana"
    ])
  }

  conn.reply(m.chat, `*╭─────◈🦑◈──────╮*\n\n` +
    `*Problema:* ${text}\n` +
    `*Soluzione Phishy:* ${risposta}\n\n` +
    `*╰─────◈🦑◈──────╯*`, m, {
    contextInfo: {
      externalAdReply: {
        title: '🦑 Phishy Emergency Help 🦑',
        body: 'Soluzioni sbagliate per problemi veri',
        sourceUrl: '',
        thumbnail: '',
       renderLargerThumbnail: true
      }
    }
  })
}

handler.help = ['aiuto']
handler.tags = ['fun']
handler.customPrefix = /^(aiuto|help|consiglio)\s?(.+)/i
handler.command = new RegExp
handler.priority = 10;
handler.exp = 0

export default handler

function pickRandom(lista) {
  return lista[Math.floor(lista.length * Math.random())]
}