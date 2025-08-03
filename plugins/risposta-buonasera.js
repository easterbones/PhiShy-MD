import moment from 'moment-timezone';


let handler = async (m, { conn, groupMetadata }) => {
   if (m.key.fromMe) return;
   if (!groupMetadata || !groupMetadata.participants) {
      return m.reply("Errore: questo comando funziona solo nei gruppi.");
   }
   // Attiva il plugin se il messaggio contiene "buonasera" (case insensitive)
   if (!/buonasera/i.test(m.text)) return;

   let toM = a => '@' + a.split('@')[0];
   let ps = groupMetadata.participants.map(v => v.id);
   let a = ps[Math.floor(Math.random() * ps.length)];
   let b;
   do {
      b = ps[Math.floor(Math.random() * ps.length)];
   } while (b === a);

   const oraMinutiCorrenti = moment().tz('Europe/Rome').format('HH:mm');
   const oraCorrente = moment().tz('Europe/Rome').hour();

   if (oraCorrente >= 16 || oraCorrente < 3) {
      const bs = [
         `_Buonasera ${m.pushName || m.sender || ""}! Come è andata la tua giornata?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Pronto per una serata fantastica?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già cenato?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Che programmi hai per stasera?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Spero tu abbia passato una bella giornata!_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ricorda di rilassarti dopo una lunga giornata!_`,
         `_Buonasera ${m.pushName || m.sender || ""}! La serata è giovane, goditela!_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già fatto i compiti per domani?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai qualche serie TV da consigliare per stasera?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! come sta il tuo gatto?`,
         `_Buonasera ${m.pushName || m.sender || ""}! C'è qualche serie TV che stai seguendo ultimamente?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti va di condividere un momento bello della tua giornata?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già sentito l'ultima canzone di ${toM(a)}?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai visto che ${toM(a)} e ${toM(b)} stanno organizzando una serata film?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Cosa ne pensi di preparare una pizza per cena?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già annaffiato le piante oggi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! C'è qualche libro che stai leggendo in questo periodo?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti sei ricordato di chiamare tua nonna?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai bevuto abbastanza acqua oggi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di fare una passeggiata dopo cena?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Quanto tempo è passato dall'ultima volta che hai fatto stretching?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già pensato a cosa cucinare per domani?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Qual è il tuo film preferito di sempre?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Cosa ne pensi di un gelato dopo cena?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai ascoltato qualche buona canzone oggi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti va di raccontare una barzelletta al gruppo?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Quali sono i tuoi piani per il fine settimana?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di giocare a un gioco da tavolo stasera?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già preparato i vestiti per domani?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Qual è stata la cosa più interessante che hai imparato oggi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai fatto esercizio fisico oggi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di preparare dei biscotti stasera?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Quale canzone ti mette sempre di buon umore?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai visto che ${toM(a)} ha condiviso una ricetta fantastica?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di fare una videochiamata con ${toM(a)} più tardi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già controllato le previsioni del tempo per domani?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Qual è il tuo ristorante preferito in zona?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai mai provato a meditare prima di dormire?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai ricevuto qualche bella notizia oggi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già sistemato la tua stanza questa settimana?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di organizzare un'uscita con ${toM(a)} e ${toM(b)}?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già completato le tue attività quotidiane?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di condividere una foto di cosa stai mangiando per cena?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Qual è il tuo piatto preferito?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già provato quella nuova app di cui tutti parlano?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di fare un rewatch del tuo film preferito stasera?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai fatto progressi con quel progetto di cui mi parlavi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di fare una maratona di serie TV questo weekend?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai qualche consiglio per rilassarsi dopo una giornata stressante?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Che ne dici di organizzare una cena con gli amici questo weekend?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti va di condividere una tua ricetta preferita con il gruppo?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai sentito l'ultima notizia sul tuo artista preferito?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di fare un gioco online con ${toM(a)} stasera?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già pianificato le tue prossime vacanze?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di provare una nuova ricetta questo weekend?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Qual è l'ultima canzone che hai ascoltato in loop?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai fatto qualche nuova scoperta musicale ultimamente?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di condividere un aneddoto divertente della tua giornata?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai aggiornato la tua playlist recentemente?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti va di consigliare un film da vedere questo weekend?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già fatto la lista della spesa per domani?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Qual è il tuo dessert preferito?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di fare una camminata notturna più tardi?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai un rituale serale per rilassarti prima di andare a dormire?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti andrebbe di condividere una citazione che ti ispira?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Hai già provato quella nuova ricetta di cui ti ho parlato?_`,
         `_Buonasera ${m.pushName || m.sender || ""}! Ti va di fare una lista dei tuoi obiettivi per domani?_`,
      ];
      const randomResponse = bs[Math.floor(Math.random() * bs.length)];
      m.reply(randomResponse.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
   } else {
      const lamentela = [
         `_${m.pushName || m.sender || ""}, ma che buonasera è?! Sono le ${oraMinutiCorrenti}, non è ancora sera!_`,
         `_${m.pushName || m.sender || ""}, ma sei serio? Le ${oraMinutiCorrenti} e dici buonasera? Aspetta il tramonto!_`,
         `_${m.pushName || m.sender || ""}, buonasera un corno! Sono le ${oraMinutiCorrenti}, è ancora giorno!_`,
         `_${m.pushName || m.sender || ""}, a quest'ora si dice buongiorno, non buonasera!_`,
         `_${m.pushName || m.sender || ""}, sei in anticipo! Buonasera si dice dopo le 16:00, ora sono le ${oraMinutiCorrenti}!_`,
         `_${m.pushName || m.sender || ""}, guarda l'orologio prima di salutare! Sono le ${oraMinutiCorrenti}, mica sera!_`,
         `_${m.pushName || m.sender || ""}, ti sembra il momento di dire buonasera? Sono le ${oraMinutiCorrenti}!_`,
         `_${m.pushName || m.sender || ""}, hai l'orologio rotto? Alle ${oraMinutiCorrenti} non si dice buonasera!_`,
         `_${m.pushName || m.sender || ""}, forse nel tuo fuso orario è sera, ma qui sono le ${oraMinutiCorrenti}!_`,
         `_${m.pushName || m.sender || ""}, alla tua età dovresti saper distinguere il giorno dalla sera! Sono le ${oraMinutiCorrenti}!_`,
         `_${m.pushName || m.sender || ""}, ma che buonasera è? Sono le ${oraMinutiCorrenti}, non è ancora ora!_`,
         `_${m.pushName || m.sender || ""}, ma che buonasera è? Sono le ${oraMinutiCorrenti}, non è ancora sera!_`,
         `_${m.pushName || m.sender || ""}, ma che buonasera è? Sono le ${oraMinutiCorrenti}, percio vai a drogarti!_`,
         `_${m.pushName || m.sender || ""}, ma che buonasera è? non hai visto che ore sono?`,
         `_${m.pushName || m.sender || ""}, ma che buonasera è? Sono le ${oraMinutiCorrenti}, non è ancora sera!_`,
         `_${m.pushName || m.sender || ""}, ma che buonasera è? testa di cazzo svegliati sono le ${oraMinutiCorrenti}`,
         `_${m.pushName || m.sender || ""}, ma che buonasera è? Sono le ${oraMinutiCorrenti}, non è ancora sera!_`,
         `_${m.pushName || m.sender || ""}, ma che buonasera è? sta gente di merda sono le ${oraMinutiCorrenti}, non è ancora sera!_`,
      ];
      const randomLamentela = lamentela[Math.floor(Math.random() * lamentela.length)];
      m.reply(randomLamentela.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
   }
};


handler.customPrefix = /\b(buonasera|bs)\b/i;
handler.command = new RegExp;
handler.group = true;
handler.priority = 10;
export default handler;