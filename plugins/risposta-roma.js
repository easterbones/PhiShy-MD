const handler = async (m) => {
   // Seleziona una frase casuale
   const frase = frasiRoma[Math.floor(Math.random() * frasiRoma.length)];
   if (m.key.fromMe) return; 
   // Risponde con la frase tipica romana
   await m.reply(`🧢 ${frase}`);
};

// Configurazione del comando
handler.customPrefix = /roma|romano|er cuppolone|caput mundi/i; // Parole chiave per attivare il comando
handler.command = new RegExp; // Il comando si attiva senza prefisso
handler.priority = 10;

export default handler;

// Array di frasi tipiche romane
const frasiRoma = [
   "A regà, daje che semo tutti fratelli!",
   "Ma chi t’ha mannato, er Papa?!",
   "Stai sereno, che tanto a Roma ce sta er sole pure quanno piove!",
   "Aho, ma che sei de coccio?!",
   "Sei forte come er Colosseo, ma meno antico, eh!",
   "Anvedi questo, pare er core de Roma!",
   "Nun t’allargà, ché te mando a fa’ ‘na passeggiata su er Cupolone!",
   "Roma nun se discute, se ama!",
   "Aridaje, semo sempre ‘a città eterna!",
   "Ma che te credi d’esse Totti?!",
   "Er traffico nun lo regge manco er Colosseo, figurati te!",
   "Aho, a Roma pure i sampietrini te salutano!",
   "Se magna mejo qua che da tutte le parti, fattene ‘na ragione!",
   "Ma nun te preoccupà, ché Roma accoglie tutti, pure te!",
   "Er Tevere l’è lungo, ma a parlà te ce metti più tempo!",
   "Daje, famo squadra come la Roma ‘n Champions!",
   "Aridaje, sempre er primo a fa casino, eh?!",
   "Guarda che a Roma ce semo abituati ai fenomeni... pure a te!",
   "Nun fa ‘r burino, che poi te perdi ‘n mezzo a Trastevere!",
   "Aho, ma chi te credi d’esse, er gladiatore de Testaccio?!",
];

