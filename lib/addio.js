// Motivi di addio generici
export const motiviAddio = [
  "_ha deciso di unirsi a un monastero digitale dove non si può usare WhatsApp 🧘_",
    "_è stato assunto come tester professionista di divani (deve stare sdraiato 8 ore al giorno) 🛋️_",
    "_ha vinto un concorso per diventare l'ambasciatore mondiale della noia 🏆_",
    "_sta seguendo il suo sogno di diventare un cercatore di funghi magici 🍄_",
    "_ha scoperto che la vita esiste fuori da WhatsApp ed è andato a verificare 🌍_",
    "_è stato reclutato dalla CIA per una missione segreta di monitoraggio dei gruppi WhatsApp 🕵️_",
    "_ha deciso di dedicarsi alla coltivazione di cactus emotivi 🌵_",
    "_è diventato un influencer di silenzi imbarazzanti 🤫_",
    // ...continua con tutte le altre frasi...
    "ha deciso di vivere come un pomodoro e ora trascorre le giornate al sole 🍅"
];


// Gruppi con addio specifico
export const gruppiAddio = [
  {
    jid: '120363401630273537@g.us', // Viridi Celesti
    frasi: [
      "Addio dal gruppo principale Viridi Celesti! Torna presto! 💚",
      "Viridi Celesti saluta un membro speciale. Ci mancherai! 🌟",
      "Hai lasciato Viridi Celesti, ma le porte sono sempre aperte! 🏆"
    ]
  },
  // Aggiungi altri gruppi qui
];

/**
 * Restituisce una frase di addio, specifica se il gruppo è nell'array, altrimenti generica
 * @param {string} jid - JID del gruppo
 * @returns {string}
 */
export function getAddioRandom(jid) {
  const gruppo = gruppiAddio.find(g => g.jid === jid);
  if (gruppo) {
    return gruppo.frasi[Math.floor(Math.random() * gruppo.frasi.length)];
  }
  return motiviAddio[Math.floor(Math.random() * motiviAddio.length)];
}
