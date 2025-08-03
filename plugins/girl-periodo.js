let handler = async (m, { conn, args, usedPrefix, command }) => {
    const allowedGroup = "120363420496546412@g.us"; // ID del gruppo autorizzato

  if (m.chat !== allowedGroup) {
    return m.reply("⚠️ Questo comando può essere utilizzato solo nel gruppo specificato per motivi di privacy.");
  }
  // Database utenti
  const users = global.usersPeriodData || {};
  const userId = m.sender;
  const userData = users[userId] || {
    cycles: [],
    symptoms: [],
    settings: { reminders: true },
  };

  // Messaggio di aiuto
  const helpMessage = `
🩸 *TRACKER DEL CICLO MESTRUALE* 🩸

*Comandi disponibili:*
▸ *${usedPrefix + command} inizio* → Registra l'inizio del ciclo
▸ *${usedPrefix + command} fine* → Registra la fine del ciclo
▸ *${usedPrefix + command} prossimo* → Mostra la previsione del prossimo ciclo
▸ *${usedPrefix + command} sintomi [testo]* → Aggiungi sintomi (es: .periodo sintomi crampi)
▸ *${usedPrefix + command} stats* → Mostra le statistiche
▸ *${usedPrefix + command} aiuto* → Mostra questo messaggio

_Esempio:_
${usedPrefix + command} inizio
`;

  if (!args[0] || args[0].toLowerCase() === 'aiuto') {
    return m.reply(helpMessage);
  }

  switch (args[0].toLowerCase()) {
    case "inizio":
      userData.cycles.push({
        start: new Date(),
        predictedEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Default: 5 giorni
      });
      m.reply(`📅 *Ciclo registrato!*\nProssimo promemoria: ${formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))}`);
      break;

    case "fine":
      if (userData.cycles.length === 0) return m.reply("⚠️ Nessun ciclo attivo!");
      userData.cycles[userData.cycles.length - 1].actualEnd = new Date();
      m.reply(`✅ *Fine ciclo registrata!*\nDurata: ${calculateCycleLength(userData)} giorni`);
      break;

    case "prossimo":
    case "next":
      const nextCycle = predictNextCycle(userData);
      m.reply(`🗓️ *Prossimo ciclo previsto:*\n${formatDate(nextCycle)}\n\n${getFertilityWindow(nextCycle)}`);
      break;

    case "sintomi":
    case "symptom":
      if (!args[1]) return m.reply("⚠️ Specifica i sintomi (es: .periodo sintomi crampi malditesta)");
      userData.symptoms.push({
        date: new Date(),
        symptoms: args.slice(1).join(" "),
      });
      m.reply(`📝 *Sintomi registrati:*\n"${args.slice(1).join(" ")}"`);
      break;

    case "stats":
    case "statistiche":
      m.reply(generateStats(userData));
      break;

    default:
      m.reply(`⚠️ Comando non riconosciuto. Scrivi *${usedPrefix + command} aiuto* per la guida.`);
  }

  // Salva dati
  users[userId] = userData;
  global.usersPeriodData = users;
};

// Funzione per calcolare la durata del ciclo
function calculateCycleLength(userData) {
  if (userData.cycles.length < 1) return 0;
  const lastCycle = userData.cycles[userData.cycles.length - 1];
  return lastCycle.actualEnd
    ? Math.round((lastCycle.actualEnd - lastCycle.start) / (1000 * 60 * 60 * 24))
    : "Ancora in corso";
}

// Funzione per prevedere il prossimo ciclo
function predictNextCycle(userData) {
  const validCycles = userData.cycles.filter((cycle) => cycle.actualEnd);
  if (validCycles.length < 2) return new Date(Date.now() + 28 * 24 * 60 * 60 * 1000); // Default: 28 giorni

  const avgLength =
    validCycles.reduce((sum, cycle) => sum + calculateCycleLength({ cycles: [cycle] }), 0) /
    validCycles.length;

  return new Date(Date.now() + avgLength * 24 * 60 * 60 * 1000);
}

// Formatta la data in italiano
function formatDate(date) {
  return date.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

// Calcola la finestra fertile
function getFertilityWindow(startDate) {
  const fertileStart = new Date(startDate.getTime() - 14 * 24 * 60 * 60 * 1000);
  const fertileEnd = new Date(fertileStart.getTime() + 5 * 24 * 60 * 60 * 1000);
  return `🌸 *Finestra fertile:* ${formatDate(fertileStart)} → ${formatDate(fertileEnd)}`;
}

// Genera statistiche
function generateStats(userData) {
  if (userData.cycles.length === 0) return "📊 *Statistiche:*\nNessun ciclo registrato.";

  const completedCycles = userData.cycles.filter((cycle) => cycle.actualEnd);
  const avgLength = completedCycles.length > 0
    ? Math.round(completedCycles.reduce((sum, cycle) => sum + calculateCycleLength({ cycles: [cycle] }), 0) / completedCycles.length)
    : 0;

  const frequentSymptoms = {};
  userData.symptoms.forEach((entry) => {
    entry.symptoms.split(" ").forEach((symptom) => {
      frequentSymptoms[symptom] = (frequentSymptoms[symptom] || 0) + 1;
    });
  });
  const topSymptoms = Object.entries(frequentSymptoms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symptom]) => symptom)
    .join(", ");

  return `📊 *Statistiche:*
- Cicli registrati: ${userData.cycles.length}
- Durata media: ${avgLength} giorni
- Sintomi frequenti: ${topSymptoms || "Nessun sintomo registrato"}`;
}

// Configurazione del comando
handler.help = ['periodo'];
handler.tags = ['salute'];
handler.command = /^(periodo|mestruazioni|ciclo|pms)$/i;
export default handler;