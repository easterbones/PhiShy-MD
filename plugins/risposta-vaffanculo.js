import db from '../lib/database.js';

const handler = async (m) => {
    
    // Mappa delle frasi e delle risposte corrispondenti
    const triggerPhrases = {
        'vaffanculo': 'vacci te con il tappo in culo!',
        'vacci te con il tappo in culo': 'il tappo non ce l\'ho, a fanculo non ci vo!',
        'i tappi non ce li ho vacci te con il pedalò': 'il pedalò e arruginito vacci te all\'infinito',
        'vacci te con un calcio in culo': 'il mio culo è siciliano, vacci te col c*zzo in mano!',
        'il mio culo è siciliano vacci te col c*zzo in mano': 'il mio culo è alla vaniglia, vacci te con la famiglia!',
        'il mio culo è alla vaniglia vacci te con la famiglia': 'il mio culo è al limone, vacci te che sei un c*glione!',
        'il mio culo è al limone vacci te che sei un coglione': 'il mio culo è al cioccolato, vacci te che sei sfig*ato!',
        'il mio culo è al cioccolato vacci te che sei sfigato': 'il mio culo è all\'albicocca, vacci te col c*zzo in bocca!',
        'il mio culo è all\'albicocca vacci te col cazzo in bocca': 'il mio culo è al budino, vacci te che sei un cr*tino!',
        'il mio culo è al budino vacci te che sei un cretino': 'il mio culo è alla stracciatella, vacci te con tua sorella!',
        'il mio culo è alla stracciatella vacci te con tua sorella': 'il mio culo è al limoncello, vacci te con tuo fratello!',
        'il mio culo è al limoncello vacci te con tuo fratello': 'basta, mi avete rotto il c*lo!',
    };

    let text = m.text.toLowerCase().trim(); // Rimuove spazi extra e converte in minuscolo
 if (m.key.fromMe) return;
    // Cerca la frase esatta nella mappa
    if (triggerPhrases[text]) {
        m.reply(triggerPhrases[text]);
    }
};

// Regex per gestire tutte le frasi
handler.customPrefix = /^(vaffanculo|vacci te con il tappo in culo|vacci te con un calcio in culo|il mio culo è siciliano vacci te col c*zzo in mano|il mio culo è alla vaniglia vacci te con la famiglia|il mio culo è al limone vacci te che sei un c*glione|il mio culo è al cioccolato vacci te che sei sfig*ato|il mio culo è all'albicocca vacci te col c*zzo in bocca|il mio culo è al budino vacci te che sei un cr*tino|il mio culo è alla stracciatella vacci te con tua sorella|il mio culo è al limoncello vacci te con tuo fratello)$/i;
handler.priority = 20;
handler.command = new RegExp;

export default handler;