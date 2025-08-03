const parole = [
  "gatto", "cane", "elefante", "tigre", "balena", "farfalla", "tartaruga", "coniglio", "rana", "polpo", "scoiattolo", "giraffa", "coccodrillo", "pinguino", "delfino", "serpente", "criceto", "zanzara", "ape",
  "nero", "televisione", "computer", "botsino", "reggaeton", "economia", "elettronica", "facebook", "whatsapp", "instagram", "tiktok", "presidente", "bot", "film", "gatta", "gattabot",
]

const tentativiMassimi = 6
const partite = new Map()

// Frasi di vittoria/sconfitta casuali
const vittoriaFrasi = [
  "🎉 *HAI INDOVINATO LA PAROLA!* Era _\"%PAROLA%\"_.\n\n💅 Ecco %EXP% exp, ma non gasarti troppo.",
  "👏 Complimenti! La parola era _\"%PAROLA%\"_.\nHai vinto %EXP% exp!",
  "Sei un genio! La parola era _\"%PAROLA%\"_.\nExp guadagnata: %EXP%",
  "Hai battuto l'impiccato! Parola: _\"%PAROLA%\"_.\nExp: %EXP%"
];
const sconfittaFrasi = [
  "☠️ *HAI PERSO!* La parola era: %PAROLA%\nMeglio che torni a scuola.",
  "💀 Peccato! Era _\"%PAROLA%\"_. Ritenta!",
  "Game over! La parola era _\"%PAROLA%\"_.",
  "Non hai indovinato. La parola era: _\"%PAROLA%\"_."
];

function scegliParolaCasuale() {
  return parole[Math.floor(Math.random() * parole.length)]
}

function nascondiParola(parola, lettereIndovinate) {
  let parolaNascosta = "";
  for (const lettera of parola) {
    if (lettereIndovinate.includes(lettera)) {
      parolaNascosta += lettera + " ";
    } else {
      parolaNascosta += "_ ";
    }
  }
  return parolaNascosta.trim();
}

function mostraImpiccato(tentativi) {
  const disegno = [
    " ____",
    " |  |",
    tentativi < 6 ? " |  😵" : " |",
    tentativi < 5 ? " | /" : tentativi < 4 ? " | / " : tentativi < 3 ? " | / \\" : tentativi < 2 ? " | / \\ " : " |",
    tentativi < 2 ? "_|_" : " |",
  ]
  return disegno.slice(0, tentativiMassimi - tentativi).join("\n")
}

function fineGioco(sender, messaggio, parola, lettereIndovinate, tentativi) {
  if (tentativi === 0) {
    partite.delete(sender)
    const frase = sconfittaFrasi[Math.floor(Math.random()*sconfittaFrasi.length)].replace(/%PAROLA%/g, parola)
    return `${frase}\n\n${mostraImpiccato(tentativi)}`
  } else if (!messaggio.includes("_")) {
    let expGuadagnata = Math.floor(Math.random() * 350)
    if (parola.length >= 8) {
      expGuadagnata = Math.floor(Math.random() * 6500)
    }
    global.db.data.users[sender].exp += expGuadagnata
    partite.delete(sender)
    const frase = vittoriaFrasi[Math.floor(Math.random()*vittoriaFrasi.length)].replace(/%PAROLA%/g, parola).replace(/%EXP%/g, expGuadagnata)
    return frase
  } else {
    return `${mostraImpiccato(tentativi)}\n\n${messaggio}`
  }
}

let handler = async (m, { conn }) => {
  let users = global.db.data.users[m.sender]
  if (partite.has(m.sender)) {
    return conn.reply(m.chat, "💀 Hai già una partita aperta, scemo. Finiscila prima di farne un'altra.", m)
  }
  let parola = scegliParolaCasuale()
  let lettereIndovinate = []
  let tentativi = tentativiMassimi
  let messaggio = nascondiParola(parola, lettereIndovinate)
  partite.set(m.sender, { parola, lettereIndovinate, tentativi })
  let text = `🔠 *Indovina la parola se ci riesci:*

${messaggio}

Tentativi rimasti: ${tentativi}
Lettere già usate: (nessuna)

Scrivi una lettera o prova a indovinare la parola intera.`
  conn.reply(m.chat, text, m)
}

handler.before = async (m, { conn }) => {
  let users = global.db.data.users[m.sender]
  let gioco = partite.get(m.sender)
  if (!gioco) return
  let { parola, lettereIndovinate, tentativi } = gioco

  // Mostra lettere già usate
  const lettereUsate = lettereIndovinate.length ? lettereIndovinate.join(", ") : "(nessuna)"

  if (m.text.length === 1 && m.text.match(/[a-zA-Z]/)) {
    let lettera = m.text.toLowerCase()
    if (!lettereIndovinate.includes(lettera)) {
      lettereIndovinate.push(lettera)
      if (!parola.includes(lettera)) {
        tentativi--
      }
    }
    let messaggio = nascondiParola(parola, lettereIndovinate)
    let risposta = fineGioco(m.sender, messaggio, parola, lettereIndovinate, tentativi)

    if (risposta.includes("HAI PERSO") || risposta.includes("HAI INDOVINATO") || risposta.includes("Complimenti!")) {
      conn.reply(m.chat, risposta, m)
    } else {
      partite.set(m.sender, { parola, lettereIndovinate, tentativi })
      conn.reply(m.chat, risposta + `\n\nLettere già usate: ${lettereUsate}\n❌ *SBAGLIATO!* Ti restano ${tentativi} tentativi.`, m)
    }
  } else if (m.text.length > 1) {
    // Tentativo di parola intera
    if (m.text.toLowerCase() === parola) {
      let expGuadagnata = Math.floor(Math.random() * 350)
      if (parola.length >= 8) {
        expGuadagnata = Math.floor(Math.random() * 6500)
      }
      global.db.data.users[m.sender].exp += expGuadagnata
      partite.delete(m.sender)
      const frase = vittoriaFrasi[Math.floor(Math.random()*vittoriaFrasi.length)].replace(/%PAROLA%/g, parola).replace(/%EXP%/g, expGuadagnata)
      conn.reply(m.chat, frase, m)
    } else {
      gioco.tentativi--
      if (gioco.tentativi <= 0) {
        partite.delete(m.sender)
        const frase = sconfittaFrasi[Math.floor(Math.random()*sconfittaFrasi.length)].replace(/%PAROLA%/g, parola)
        conn.reply(m.chat, `${frase}\n\n${mostraImpiccato(gioco.tentativi)}`, m)
      } else {
        partite.set(m.sender, gioco)
        conn.reply(m.chat, `❌ Parola sbagliata! Ti restano ${gioco.tentativi} tentativi.\nLettere già usate: ${lettereUsate}`, m)
      }
    }
  } else {
    let messaggio = nascondiParola(parola, lettereIndovinate)
    let risposta = fineGioco(m.sender, messaggio, parola, lettereIndovinate, tentativi)
    conn.reply(m.chat, risposta, m)
    partite.delete(m.sender)
  }
}

handler.help = ['impiccato']
handler.tags = ['game']
handler.command = ['impiccato']
handler.register = true
export default handler
