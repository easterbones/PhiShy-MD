let handler = async (m, { conn, args, usedPrefix, command }) => {
  const exTypes = {
    "narcisista": [
      "🔍 Sostiene di essere cambiato ma cambia solo partner.",
      "💅 Crede che il mondo ruoti attorno a lui, incluso il tuo trauma post-relazione.",
      "🎭 Ti bloccava e sbloccava solo per il dramma extra."
    ],
    "fantasma": [
      "👻 Scompariva misteriosamente per settimane, riapparendo con un 'Ehi, come stai?'.",
      "🚪 'Non sono pronto per una relazione seria' (ma la settimana dopo pubblica foto col nuovo partner).",
      "📵 Bloccava chiunque osasse chiedere coerenza."
    ],
    "l'indeciso": [
      "🤔 'Non so cosa voglio' ma pretendeva che tu fossi disponibile al 100%.",
      "🎢 Cambiava opinione su di te più velocemente di un giro sulle montagne russe.",
      "📆 Aveva un calendario emozionale più instabile del meteo in aprile."
    ],
    "l'eterno pentito": [
      "😢 Messaggi alle 3 di notte con 'Ti penso ancora'.",
      "🎶 Playlist di canzoni strappalacrime per il pubblico di Instagram.",
      "🔄 Ripete il ciclo di 'rivoglio te' ogni volta che è single."
    ]
  };

  const exCategory = args[0]?.toLowerCase();
  if (!exCategory || !exTypes[exCategory]) {
    return m.reply(`ℹ️ Usa il comando così:\n${usedPrefix + command} <tipo_ex>\n\n🧐 *Tipologie supportate:* ${Object.keys(exTypes).join(", ")}`);
  }

  const analysis = exTypes[exCategory].join("\n");
  m.reply(`🧠 *ANALISI PSICOLOGICA DELL'EX (${exCategory.toUpperCase()})* 🧠\n\n${analysis}\n\n🔮 Consiglio: ${getAdvice(exCategory)}`);
};

// Suggerimenti generali in tono sarcastico
function getAdvice(exCategory) {
  const advice = {
    "narcisista": "🚪 Blocca, fuggi e non guardarti indietro.",
    "fantasma": "📵 Ignora i messaggi 'Ciao, come stai?' con la stessa energia con cui ti ha ignorato lui.",
    "l'indeciso": "🎢 Goditi la stabilità di non doverlo più ascoltare.",
    "l'eterno pentito": "⌛ Accetta che il tuo blocco su WhatsApp è l’unico rimedio definitivo."
  };
  return advice[exCategory] || "😂 Sei finalmente libero, festeggia!";
}

handler.help = ["exanalisi <tipo_ex>"];
handler.tags = ["fun", "relationships"];
handler.command = /^exanalisi$/i;

export default handler;
