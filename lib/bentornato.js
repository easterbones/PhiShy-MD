// Frasi di bentornato generiche
export const motiviBentornato = [
    "ma riciao @user",
    "Bentornato @user Ci sei mancato! 💖",
    "Eccoti di nuovo qui  🎉",
    "Oh, guarda chi è tornato! @user  👀",
    " @user ha deciso di tornare tra noi! 🥳",
    "Ben tornato @user! Stavamo iniziando a preoccuparci 😌",
    " @user è riapparso come per magia! ✨",
    "E il prodigo @user ritorna! 🏠"
];


// Gruppi con bentornato specifico
export const gruppiBentornato = [
  {
    jid: '120363401630273537@g.us', // Viridi Celesti
    frasi: [
      "Bentornato su Viridi Celesti! 💚",
      "Viridi Celesti ti riabbraccia! 🌟",
      "Il gruppo principale è di nuovo al completo! 🏆"
    ]
  },
  // Aggiungi altri gruppi qui
];

/**
 * Restituisce una frase di bentornato, specifica se il gruppo è nell'array, altrimenti generica
 * @param {string} jid - JID del gruppo
 * @returns {string}
 */
export function getBentornatoRandom(jid) {
  const gruppo = gruppiBentornato.find(g => g.jid === jid);
  if (gruppo) {
    return gruppo.frasi[Math.floor(Math.random() * gruppo.frasi.length)];
  }
  return motiviBentornato[Math.floor(Math.random() * motiviBentornato.length)];
}
