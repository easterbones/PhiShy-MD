import moment from 'moment-timezone';

let handler = async (m, { conn, groupMetadata }) => {
   if (m.key.fromMe) return; // Ignora i messaggi inviati dal bot stesso

   // Verifica se il messaggio proviene da un gruppo
   if (!groupMetadata || !groupMetadata.participants) {
      return m.reply("Errore: questo comando funziona solo nei gruppi.");
   }

   let toM = a => '@' + a.split('@')[0];
   let ps = groupMetadata.participants.map(v => v.id);

   // Seleziona due partecipanti casuali
   let a = ps[Math.floor(Math.random() * ps.length)];
   let b;
   do {
      b = ps[Math.floor(Math.random() * ps.length)];
   } while (b === a);

   const oraMinutiCorrenti = moment().tz('Europe/Rome').format('HH:mm');
   const oraCorrente = moment().tz('Europe/Rome').hour();

   // Dalle 5:00 alle 20:00, il bot risponde con "buongiorno"
   if (oraCorrente >= 5 && oraCorrente < 22) {
      const bg = [
         `_Buongiorno ${m.pushName || m.sender || ""}! Ti sei già alzato dal letto o ti serve un invito speciale?_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Oggi è una giornata con i fiocchi!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Pronto a conquistare il mondo?_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Dormito bene?_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Hai già fatto colazione?_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata fantastica!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Sei pronto per affrontare la giornata?_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia pieno di sorprese!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di energia!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di successi!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di felicità!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di amore!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di avventure!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di risate!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di creatività!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di ispirazione!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di gratitudine!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di pace!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di serenità!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di gioia!_`,
         `_Buongiorno ${m.pushName || m.sender || ""}! Spero che oggi sia una giornata piena di successo!_`,
      ];

      const randomResponse = bg[Math.floor(Math.random() * bg.length)];
      m.reply(randomResponse.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
   } else {
      // Dalle 20:00 alle 5:00, il bot risponde in modo scontroso
      const lamentela = [
         `_${m.pushName || m.sender || ""}, ma che buongiorno è?! Sono le ${oraMinutiCorrenti}, vai a dormire invece di scrivere!_`,
         `_${m.pushName || m.sender || ""}, ma sei serio? Le ${oraMinutiCorrenti} e dici buongiorno? Vai a contare le pecore! 🐑_`,
         `_${m.pushName || m.sender || ""}, buongiorno un corno! Sono le ${oraMinutiCorrenti}, fatti una camomilla e torna domani!_`,
         `_${m.pushName || m.sender || ""}, a quest'ora solo i vampiri sono svegli! E tu non sei Dracula!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a dormire!_`,
         `_${m.pushName || m.sender || ""}, ma sei rincoglionito? Le ${oraMinutiCorrenti} e dici buongiorno? Sei fuori di testa!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a farti una passeggiata e smettila di scrivere!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a farti una doccia e smettila di scrivere!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a farti una colazione e smettila di scrivere!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a meditare sulla cazzata che hai appena scritto!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, trovati un lavoro`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a fare una passeggiata e smettila di scrivere!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a fare una corsa e smettila di scrivere!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a fare una nuotata e smettila di scrivere!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, australiano di merda!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a fare un pisolino e smettila di scrivere!_`,
         `_${m.pushName || m.sender || ""}, ma che buongiorno? Sono le ${oraMinutiCorrenti}, vai a fare un giro in bicicletta e smettila di scrivere!_`,
      ];

      const randomLamentela = lamentela[Math.floor(Math.random() * lamentela.length)];
      m.reply(randomLamentela.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
   }
};

handler.customPrefix = /\b(buongiorno|bg)\b/i;
handler.command = new RegExp;
handler.group = true;
handler.priority = 10;

export default handler;







