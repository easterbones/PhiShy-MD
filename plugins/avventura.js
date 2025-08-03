import fetch from 'node-fetch';
import fs from 'fs';

const cooldown = 1500000; // 25 minuti

// Frasi in italiano (completo)
const testo1 = [
  "SALUTE BASSA",
  "La tua salute 💔 è sotto *80!!* Cura la salute prima di intraprendere una nuova avventura."
];
const testo2 = [
  "RIPOSO",
  "Hai già intrapreso un'avventura, attendi che il tempo di riposo finisca\n\n⏱️",
  "🛫 Stai avventurandoti in",
  "Hai esplorato il paese"
];
const testo3 = [
  "*ID Paese:*",
  "*Città:*",
  "*Longitudine:*",
  "*Latitudine:*",
  "🏞️ Avventura completata"
];
const testo4 = "\n\n✨ Ricompense dell'avventura";
const testo5 = [
  "AVVENTURA",
  "*[❗️ERRORE❗️] Si è verificato un errore, riprova. Probabilmente l'API non ha generato l'immagine*"
];

// Aggiunta di immagini con thumbnail personalizzate
const bandieraImages = {
  AF: 'https://example.com/afghanistan.png',
  AX: 'https://example.com/aland.png',
  AL: 'https://example.com/albania.png',
  // ...aggiungi altre immagini per ogni paese
};

// Array di storielle casuali
const storieCasuali = [
  "Mentre esploravi, hai trovato un antico manufatto nascosto sotto la sabbia.",
  "Un vecchio saggio ti ha raccontato una leggenda del luogo.",
  "Hai incontrato un gruppo di viaggiatori che ti hanno offerto aiuto.",
  "Un animale selvatico ti ha seguito per un po', ma poi è sparito nella foresta.",
  "Hai scoperto un passaggio segreto che conduce a una grotta misteriosa.",
  "Durante l'avventura, hai trovato un tesoro nascosto dietro una cascata.",
  "Hai incontrato un mercante che ti ha venduto una mappa misteriosa.",
  "Un temporale improvviso ti ha costretto a cercare riparo in una caverna.",
  "Hai trovato un antico libro che racconta la storia del luogo.",
  "Un uccello raro ti ha guidato verso un'area inesplorata."
];

// Funzione per ottenere una storia casuale
function getStoriaCasuale() {
  return storieCasuali[Math.floor(Math.random() * storieCasuali.length)];
}

// Miglioramento della gestione API
async function fetchCountryData(countryCode) {
  try {
    const response = await fetch(`https://api.worldbank.org/v2/country/${countryCode}?format=json`);
    const data = await response.json();
    if (!Array.isArray(data) || !data[1] || !data[1][0]) {
      throw new Error('Dati API non validi');
    }
    return data[1][0];
  } catch (error) {
    console.error('Errore durante il fetch dei dati API:', error);
    return null;
  }
}

// Bonus e malus per le zone esplorate
const zoneEffects = {
  desert: { bonus: { exp: 50 }, malus: { health: -10 } },
  forest: { bonus: { wood: 5 }, malus: { health: -5 } },
  mountain: { bonus: { diamond: 1 }, malus: { health: -15 } },
  // ...aggiungi altre zone
};

function applyZoneEffects(zone, user) {
  const effects = zoneEffects[zone] || {};
  if (effects.bonus) {
    for (const [key, value] of Object.entries(effects.bonus)) {
      user[key] = (user[key] || 0) + value;
    }
  }
  if (effects.malus) {
    for (const [key, value] of Object.entries(effects.malus)) {
      user[key] = Math.max((user[key] || 0) - value, 0);
    }
  }
}

// Bilanciamento delle ricompense
function reward(user = {}) {
  const rewards = {
    reward: {
      limit: 200,
      exp: 150,
      pozioneminore: 1,
      pozionemaggiore: 1,
      joincount: 1,
      cane: [0, 1],
      gatto: [0, 1],
      coniglio: [0, 1],
      drago: [0, 1],
      macchina: [0, 1],
      moto: [0, 1],
      bici: [0, 1],
      uova: [0, 1],
      bacini: [0, 1],
    },
    lost: {
      health: 10,
      armordurability: 5,
    },
  };
  return rewards;
}

// Modifica della logica principale per integrare le nuove funzionalità
const handler = async (m, { usedPrefix, conn }) => {
  try {
    const user = global.db.data.users[m.sender];
    const countryCode = ct.getRandom();
    const countryData = await fetchCountryData(countryCode);

    if (!countryData) {
      return conn.reply(m.chat, "❗️ Errore: impossibile ottenere i dati del paese.", m);
    }

    const zone = 'forest'; // Esempio: determina la zona in base al paese o altre logiche
    applyZoneEffects(zone, user);

    const rewards = reward(user);
    const story = getStoriaCasuale();

    let text = `${testo2[3]} *» ${countryData.name}*
${story}

${testo3[0]} ${countryData.id}
${testo3[1]} ${countryData.capitalCity}
${testo3[2]} ${countryData.longitude}
${testo3[3]} ${countryData.latitude}

${testo3[4]}`;

    for (const rewardItem in rewards.reward) {
      if (rewardItem in user) {
        const total = rewards.reward[rewardItem].getRandom();
        user[rewardItem] += total;
        if (total) text += `\n» ${global.rpg.emoticon(rewardItem)} ${total}`;
      }
    }

    conn.reply(m.chat, text, m);
    user.lastadventure = new Date() * 1;
  } catch (e) {
    console.error('Errore avventura:', e);
    conn.reply(m.chat, `${testo5[1]}`, m);
  }
};

handler.help = ['adventure'];
handler.tags = ['rpg'];
handler.command = /^(avventura|adv|adventure|aventurar)$/i;
handler.cooldown = cooldown;
handler.disabled = false;
export default handler;