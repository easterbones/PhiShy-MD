import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
  let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   if (who == conn.user.jid) return error 
   if (!(who in global.db.data.users)) return conn.reply(m.chat, 'non sei nel database del gioco', m)
   let user = global.db.data.users[who]
   
  const lvl = user.level;
  const now = Date.now();
   if (!user.level) user.level = 1;

   

  if (user.dungeonTime && now < user.dungeonTime) {
    let timeLeft = (user.dungeonTime - now) / 1000;
    return m.reply(`\`\`\`⏳ Aspetta ancora ${timeLeft.toFixed(0)} secondi, verme impaziente.\`\`\``);
  }

  const animals = ["cane", "gatto", "coniglio", "drago", "piccione", "serpente", "cavallo", "pesce", "riccio", "scoiattolo", "polpo", "ragno", "scorpione"];
  const lootItems = ["vita", "forcina", "pozioneminore", "pozionemaggiore", "pozionedefinitiva", "scudo"];

  const baseDungeonImgPath = path.join('src', 'img', 'dungeon');

  const floors = {
    "Palude di Shrek": {
      monsters: [
        { name: "Goblin piagnone", str: [10, 30], reward: [50, 200] },
        { name: "Topa malefica", str: [20, 40], reward: [100, 300] },
      ],
      levelRange: [1, 10],
      img: "Shrek.png"
    },
    "Rifugio delle Emo": {
      monsters: [
        { name: "Ragno gigante", str: [40, 60], reward: [300, 500] },
        { name: "Scorpione tossico", str: [55, 75], reward: [450, 650] },
      ],
      levelRange: [11, 25],
      img: "emo.png"
    },
    "Caverna dei Draghi": {
      monsters: [
        { name: "Phishy l’Antipatica", str: [100, 150], reward: [1000, 1500] },
        { name: "Succube Oscura", str: [120, 170], reward: [1200, 1600] },
      ],
      levelRange: [26, 9999],
      img: "drago.png"
    },
  };

  function getRandomFloor(lvl) {
    const availableFloors = Object.entries(floors).filter(([, data]) => lvl >= data.levelRange[0] && lvl <= data.levelRange[1]);
    if (availableFloors.length === 0) return null; // <-- fix
    const randomIndex = Math.floor(Math.random() * availableFloors.length);
    return availableFloors[randomIndex];
  }

  function Dungeon(userLvl) {
    const floorEntry = getRandomFloor(userLvl);
    if (!floorEntry) {
      return { msg: "Nessun dungeon disponibile per il tuo livello.", floorImg: null };
    }
    const [floorName, floorData] = floorEntry;
    const { monsters } = floorData;
    const coinsFound = randomNumber(300, 2500);
    let msg = "";

    const monster = monsters[Math.floor(Math.random() * monsters.length)];
    const userStr = userLvl * randomNumber(5, 15);
    const encounterChance = userLvl <= 10 ? 70 : userLvl <= 30 ? 60 : 50;

    const roll = randomNumber(1, 100);

    if (roll <= encounterChance) {
      if (userStr > randomNumber(monster.str[0], monster.str[1])) {
        const extraBonus = randomNumber(monster.reward[0], monster.reward[1]); 
        user.limit += extraBonus + coinsFound;
        msg = `\`\`\`🧟 Sei entratə in ${floorName}, hai fatto il culo a ${monster.name} e hai trovato ${coinsFound} dolci 🍬 + ${extraBonus} bonus. Brava illusa.\`\`\``;
        
        // 1 su 5 possibilità di loot
        if (randomNumber(1, 5) === 1) {
          const loot = lootItems[Math.floor(Math.random() * lootItems.length)];
          user[loot] = (user[loot] || 0) + 1;
          msg += `\n\`\`\`🎁 Hai trovato anche un oggetto utile: ${loot.toUpperCase()}.\`\`\``;
        }

        // 1 su 6 possibilità di incontrare un animale
        if (randomNumber(1, 6) === 1) {
          const animal = animals[Math.floor(Math.random() * animals.length)];
          if (!user[animal]) user[animal] = 0;
          user[animal]++;
          msg += `\n\`\`\`🐾 Un ${animal} ti ha seguito! Ora è tuo schiavo... ehm... animale domestico.\`\`\``;
        }

      } else {
        const damage = randomNumber(10, 35);
        user.salute = Math.max(0, (user.salute || 100) - damage);
        msg = `\`\`\`☠️ Sei entratə in ${floorName}, ma ${monster.name} ti ha fatto il culo. Hai perso ${damage} salute, incapace.\`\`\``;
      }
    } else {
      user.limit += coinsFound;
      msg = `\`\`\`🪙 Hai vagato per ${floorName} e trovato ${coinsFound} dolci 🍬 senza fare niente. Che culo.\`\`\``;
    }

    // Restituisci anche floorData.img per la thumb
    return { msg, floorImg: floorData.img };
  }

  const result = Dungeon(lvl);
  user.dungeonTime = now + 30000;

  // Thumbnail dungeon
  let thumb = null;
  if (result.floorImg) {
    const imgPath = path.join(baseDungeonImgPath, result.floorImg);
    if (fs.existsSync(imgPath)) {
      thumb = fs.readFileSync(imgPath);
    }
  }

  await conn.sendMessage(m.chat, {
    text: result.msg,
    contextInfo: {
      externalAdReply: {
        title: '𝘋𝘜𝘕𝘎𝘌𝘖𝘕',
        body: '𝘌𝘴𝘱𝘭𝘰𝘳𝘢 𝘶𝘯𝘢 𝘻𝘰𝘯𝘢 misteriosa!',
        thumbnail: thumb,
        mediaType: 1,
        sourceUrl: ''
      }
    }
  }, { quoted: m });
};

handler.help = ["dungeon"];
handler.tags = ["economy"];
handler.command = ["dungeon", "mazmorra", "esplora"];

export default handler;

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
