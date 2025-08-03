// Frasi di benvenuto generiche
export const frasiBenvenuto = [
    "_Benvenuto! Sei il visitatore numero 1.000.000! (Mentiamo sempre sui numeri) 🎉_",
    "_Attenzione: questo gruppo può causare dipendenza e risate incontrollabili ⚠️_",
    "_Sei appena entrato nel miglior gruppo di sempre... o almeno così ci piace pensare 🤪_",
    "_Benvenuto! Abbiamo biscotti virtuali e caffè immaginario ☕_",
    "_Ecco un nuovo membro da aggiungere alla nostra collezione di stranezze 🧩_",
    "_Benvenuto! Le tue credenziali sono state registrate nel nostro database segreto... scherzo (forse) 👾_",
    "_Sei entrato nel momento sbagliato, stavamo parlando male di te... ah no, non ti conoscevamo ancora 😈_",
    "_Benvenuto! Qui l'unica regola è che non ci sono regole... a parte tutte quelle che abbiamo 📜_",
    "_Congratulazioni! Hai appena vinto un viaggio tutto pagato! Scherzo, sei solo in un gruppo WhatsApp ✈️_",
    "_Benvenuto! Sei più un tipo da gif, meme o messaggi vocali? 🎭_",
    "_Ehilà! Sei qui per la riunione segreta degli illuminati o per sbaglio? 👁️_",
    "_Benvenuto! Il nostro gruppo è come una scatola di cioccolatini: non sai mai cosa ti capita 🍫_",
    "_Salve! Ti avviso che qui dentro perdiamo tutti almeno il 50% del QI giornalmente 🧠_",
    "_Benvenuto! Sei pronto a perdere la tua dignità un messaggio alla volta? 😏_",
    "_Ciao nuovo! Sei qui per la festa a sorpresa? Che stupido, te l'ho rovinata 🎂_",
    "_Benvenuto! Sei l'elemento casuale che mancava al nostro caos organizzato 🌀_",
    "_Eccoti! Stavo giusto pensando che mancava qualcuno da bullizzare... ehm, accogliere 🤗_",
    "_Salve viaggiatore! Hai portato con te provviste per sopravvivere a questo gruppo? 🎒_",
    "_Benvenuto! Sei più forte di quanto sembri se hai deciso di entrare qui 💪_",
    "_Ciao! Sei qui per caso o perché tutti gli altri gruppi ti hanno bannato? 🚫_",
    "_Benvenuto! Il nostro gruppo è come un bonsai: richiede cure costanti e nessuno sa davvero come si fa 🌱_",
    "_Benvenuto! Sei l'ultimo arrivato, quindi secondo la tradizione paghi la pizza virtuale 🍕"
];

// Gruppi con benvenuto specifico
export const gruppiBenvenuto = [
  {
    jid: '120363401630273537@g.us', // Viridi Celesti
    frasi: [
      "Benvenuto sul nostro gruppo principale Viridi Celesti! 🌟",
      "Sei entrato in Viridi Celesti, qui si fa la storia! 🏆",
      "Viridi Celesti ti accoglie tra i migliori! 💚"
    ]
  },
  // Aggiungi altri gruppi qui
];

/**
 * Restituisce una frase di benvenuto, specifica se il gruppo è nell'array, altrimenti generica
 * @param {string} jid - JID del gruppo
 * @returns {string}
 */
export function getBenvenutoRandom(jid) {
  const gruppo = gruppiBenvenuto.find(g => g.jid === jid);
  if (gruppo) {
    return gruppo.frasi[Math.floor(Math.random() * gruppo.frasi.length)];
  }
  return frasiBenvenuto[Math.floor(Math.random() * frasiBenvenuto.length)];
}
