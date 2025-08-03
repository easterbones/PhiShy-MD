import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import lavoriDisponibili from '../lib/lavori.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EASTER_EGG_CHANCE = 0.2; // 20% (1 su 5) possibilità di trovare un uovo di Pasqua


let handler = async (m, { conn, args, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender];
  
  // --- CASA: blocca se l'utente è dentro casa ---
  if (user.casa && user.casa.stato === 'dentro') {
    return conn.reply(m.chat, '🚪 Non puoi lavorare mentre sei dentro casa! Esci prima con *!casa esci*.', m)
  }

  // Se il comando è 'sceglilavoro' o simile
  if (command === 'sceglilavoro' || command === 'chooselob' || command === 'setjob' || command === 'lavoro') {
    let lavoro = args[0]?.toLowerCase();
    
    // Initialize job cooldown if not exists
    if (!user.jobCooldown) user.jobCooldown = 0;
    
    // Check if user is trying to change job during cooldown
    if (user.jobCooldown > Date.now() && lavoro && lavoro !== user.lavoro?.toLowerCase()) {
      let remainingTime = Math.ceil((user.jobCooldown - Date.now()) / (1000 * 60));
      return conn.reply(m.chat, 
        `⏳ *𝐂𝐎𝐎𝐋𝐃𝐎𝐖𝐍 𝐀𝐓𝐓𝐈𝐕𝐎!* ⏳\n\n` +
        `hai gia cambiato lavoro di recente!\n` +
        `devi aspettare*${remainingTime} minuti* prima di cambiare lavoro.\n\n` +
        `se vuoi diventare disoccupato scrivi:\n` +
        `${usedPrefix}sceglilavoro disoccupato`,
        m
      );
    }
    
    if (!lavoro) {
      let listaLavori = Object.entries(lavoriDisponibili)
        .filter(([key]) => key !== "disoccupato")
        .sort((a, b) => a[1].livello - b[1].livello)
        .map(([l, det]) => {
          let progressBar = '▰'.repeat(Math.floor(det.livello/10)) + '▱'.repeat(6 - Math.floor(det.livello/10));
          return `▸ ${det.emoji} *${l.charAt(0).toUpperCase() + l.slice(1)}*\n` +
                 `   › Livello: ${det.livello} ${progressBar}\n` +
                 `   › Guadagno: ${det.min}-${det.max} 💰\n` +
                 `   › Cooldown: ${det.cooldown} minuti\n`;
        }).join('\n');
      
      const jobImage = "https://th.bing.com/th/id/OIP.9nrYmMJniwuPD7CzLKK94AHaE8?rs=1&pid=ImgDetMain";
      
      let currentJobInfo = '';
      if (user.lavoro) {
        currentJobInfo = `\n\n👨‍💼 *LAVORO ATTUALE:* ${user.lavoro} ${lavoriDisponibili[user.lavoro]?.emoji || ''}`;
      }
      
      return conn.sendMessage(m.chat, {
        text: `🌟 *𝐎𝐅𝐅𝐄𝐑𝐓𝐄 𝐃𝐈 𝐋𝐀𝐕𝐎𝐑𝐎 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐈𝐋𝐈* 🌟${currentJobInfo}\n\n${listaLavori}\n` +
              `📌 _𝐔𝐬𝐚 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨: ${usedPrefix}𝐬𝐜𝐞𝐠𝐥𝐢𝐥𝐚𝐯𝐨𝐫𝐨 [𝐧𝐨𝐦𝐞 𝐥𝐚𝐯𝐨𝐫𝐨]_\n` +
              `𝐄𝐬𝐞𝐦𝐩𝐢𝐨: ${usedPrefix}sceglilavoro astronauta\n\n` +
              `💼 𝐏𝐞𝐫 𝐝𝐢𝐯𝐞𝐧𝐭𝐚𝐫𝐞 𝐝𝐢𝐬𝐨𝐜𝐜𝐮𝐩𝐚𝐭𝐨: ${usedPrefix}sceglilavoro disoccupato`,
        contextInfo: {
          externalAdReply: {
            title: "🏢 𝐂𝐄𝐍𝐓𝐑𝐎 𝐈𝐌𝐏𝐈𝐄𝐆𝐇𝐈 🏢",
            body: "𝐓𝐫𝐨𝐯𝐚 𝐢𝐥 𝐥𝐚𝐯𝐨𝐫𝐨 𝐩𝐞𝐫𝐟𝐞𝐭𝐭𝐨 𝐩𝐞𝐫 𝐭𝐞!",
            thumbnailUrl: jobImage,
            sourceUrl: "https://www.tiktok.com/login?redirect_url=https%3A%2F%2Fwww.tiktok.com%2Fit-IT&lang=en&enter_method=mandatory",
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
    }
    
    // Handle unemployed option
    if (lavoro === "disoccupato") {
      if (!user.lavoro) {
        return conn.reply(m.chat, 
          `Sei già disoccupato! ${lavoriDisponibili.disoccupato.emoji}\n` +
          `Scegli un lavoro dalla lista per iniziare a guadagnare.`,
          m
        );
      }
      
      user.lavoro = null;
      if (user.bustapaga) delete user.bustapaga[user.lavoro];
      return conn.reply(m.chat, 
        `Sei ora disoccupato! ${lavoriDisponibili.disoccupato.emoji}\n` +
        `Non guadagnerai più soldi finché non sceglierai un nuovo lavoro.`,
        m
      );
    }
    
    // Find selected job
    const lavoroSelezionato = Object.keys(lavoriDisponibili).find(
      key => key.toLowerCase() === lavoro && key !== "disoccupato"
    );
    
    if (!lavoroSelezionato) {
      return conn.reply(m.chat, 
        `*❌ LAVORO NON TROVATO ❌*\n\nIl lavoro *"${lavoro}"* non esiste.\n` +
        `Scrivi \`${usedPrefix}sceglilavoro\` senza argomenti per vedere la lista completa.`, 
        m
      );
    }
    
    const dettagliLavoro = lavoriDisponibili[lavoroSelezionato];
    
    if (user.level < dettagliLavoro.livello) {
      const progressBar = '▰'.repeat(Math.floor(user.level/10)) + '▱'.repeat(6 - Math.floor(user.level/10));
      return conn.reply(m.chat, 
        `*🔞 𝐑𝐄𝐐𝐔𝐈𝐒𝐈𝐓𝐈 𝐍𝐎𝐍 𝐒𝐎𝐃𝐃𝐈𝐒𝐅𝐀𝐓𝐓𝐈 🔞*\n\n` +
        `𝐏𝐞𝐫 𝐝𝐢𝐯𝐞𝐧𝐭𝐚𝐫𝐞 *${lavoroSelezionato}* ${dettagliLavoro.emoji} 𝐭𝐢 𝐬𝐞𝐫𝐯𝐞:\n` +
        `› 𝐋𝐢𝐯𝐞𝐥𝐥𝐨 ${dettagliLavoro.livello}\n\n` +
        `𝐈𝐥 𝐭𝐮𝐨 𝐥𝐢𝐯𝐞𝐥𝐥𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:\n` +
        `› ${user.level} ${progressBar}\n\n` +
        `𝐂𝐨𝐧𝐭𝐢𝐧𝐮𝐚 𝐚 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐩𝐞𝐫 𝐬𝐚𝐥𝐢𝐫𝐞 𝐝𝐢 𝐥𝐢𝐯𝐞𝐥𝐥𝐨!`,
        m
      );
    }
    
    // Set 1-hour cooldown when changing jobs
    user.jobCooldown = Date.now() + (60 * 60 * 1000);
    
    // Initialize pay stub if doesn't exist
    if (!user.bustapaga) user.bustapaga = {};
    if (!user.bustapaga[lavoroSelezionato]) {
      user.bustapaga[lavoroSelezionato] = {
        esperienza: 0,
        bonus: 0
      };
    }
    
    user.lavoro = lavoroSelezionato;
    
    const expAttuale = user.bustapaga[lavoroSelezionato].esperienza;
    const bonusAttuale = user.bustapaga[lavoroSelezionato].bonus;
    
    return conn.reply(m.chat, 
      `*🎉 𝐂𝐎𝐍𝐆𝐑𝐀𝐓𝐔𝐋𝐀𝐙𝐈𝐎𝐍𝐈! 🎉*\n\n` +
      `Ora sei un *${lavoroSelezionato}* ${dettagliLavoro.emoji}!\n\n` +
      `Guadagno base: *${dettagliLavoro.min}-${dettagliLavoro.max} 💰*\n` +
      `Bonus attuale: *+${bonusAttuale}%* (${expAttuale} exp)\n\n` +
      `Cooldown lavoro: *${dettagliLavoro.cooldown} minuti*\n` +
      `Cooldown cambio lavoro: *60 minuti*\n\n` +
      `Usa il comando *${usedPrefix}work* per iniziare a guadagnare!\n` +
      `Più lavori, più il tuo stipendio aumenterà!`,
      m
    );
  }
  
  // Se il comando è 'work' o simile
  if (command === 'work' || command === 'lavora' || command === 'lavoro') {
    const now = Date.now();
 // Controlla se l'utente trova un uovo di Pasqua
  let easterEggFound = Math.random() < EASTER_EGG_CHANCE;
  let easterEggMessage = '';
  
  if (easterEggFound) {
    user.uova += 1; // Incrementa il contatore uova
    easterEggMessage = '\n\n⚠️𝐚𝐭𝐭𝐞𝐧𝐳𝐢𝐨𝐧𝐞 𝐮𝐭𝐞𝐧𝐭𝐞?\n🐣 *𝐇𝐚𝐢 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 𝐮𝐧 𝐮𝐨𝐯𝐨 𝐝𝐢 𝐏𝐚𝐬𝐪𝐮𝐚!* 🥚\n𝐎𝐫𝐚 𝐡𝐚𝐢 ' + user.uova + ' 𝐮𝐨𝐯𝐚 𝐧𝐞𝐥 𝐭𝐮𝐨 𝐢𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨!';
  }
    // Inizializzazione sicura
    if (!user.money) user.money = 0;
    if (!user.bustapaga) user.bustapaga = {};
    if (!user.cooldowns) user.cooldowns = {};
    if (!user.ultimoLavoro) user.ultimoLavoro = {};

    // Verifica lavoro selezionato
    if (!user.lavoro || !lavoriDisponibili[user.lavoro]) {
      return conn.reply(m.chat, 
        `*❌ 𝐒𝐄𝐈 𝐃𝐈𝐒𝐎𝐂𝐂𝐔𝐏𝐀𝐓𝐎 ❌*\n\n` +
        `𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐬𝐜𝐞𝐥𝐭𝐨 𝐮𝐧 𝐥𝐚𝐯𝐨𝐫𝐨!\n` +
        `𝐔𝐬𝐚 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 *${usedPrefix}sceglilavoro* 𝐩𝐞𝐫 𝐬𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚𝐫𝐧𝐞 𝐮𝐧𝐨 𝐝𝐚𝐥𝐥𝐚 𝐥𝐢𝐬𝐭𝐚.`, 
        m, rcanal
      );
    }

    const lavoro = user.lavoro;
    const lavoroInfo = lavoriDisponibili[lavoro];
    const cooldownMs = lavoroInfo.cooldown * 60 * 1000;

    // Controllo cooldown
    if (user.ultimoLavoro[lavoro] && now - user.ultimoLavoro[lavoro] < cooldownMs) {
      const remainingTime = Math.ceil((cooldownMs - (now - user.ultimoLavoro[lavoro])) / 60000);
      return conn.reply(m.chat,
        `*⏳ 𝐂𝐎𝐎𝐋𝐃𝐎𝐖𝐍 𝐈𝐍 𝐂𝐎𝐑𝐒𝐎!* ⏳\n\n` +
        `𝐇𝐚𝐢 𝐠𝐢à 𝐥𝐚𝐯𝐨𝐫𝐚𝐭𝐨 𝐜𝐨𝐦𝐞 *${lavoro}* ${lavoroInfo.emoji}!\n` +
        `⏱️ *Tempo rimanente:* ${Math.ceil(remainingTime)} minuti\n\n` +
        `💡 *𝐒𝐮𝐠𝐠𝐞𝐫𝐢𝐦𝐞𝐧𝐭𝐨:* 𝐌𝐞𝐧𝐭𝐫𝐞 𝐚𝐬𝐩𝐞𝐭𝐭𝐢, 𝐩𝐮𝐨𝐢:\n` +
        `- 𝐅𝐚𝐫𝐞 𝐪𝐮𝐚𝐥𝐜𝐡𝐞 𝐦𝐢𝐬𝐬𝐢𝐨𝐧𝐞 (${usedPrefix}missione)\n` +
        `- 𝐆𝐢𝐨𝐜𝐚𝐫𝐞 𝐚𝐥 𝐜𝐚𝐬𝐢𝐧𝐨 (${usedPrefix}slot)\n` +
        `- 𝐂𝐞𝐫𝐜𝐚𝐫𝐞 𝐭𝐞𝐬𝐨𝐫𝐢 (${usedPrefix}tesoro)`,
        m, rcanal
      );
    }

    // Calcolo guadagno con variazione casuale
    const variazione = Math.random() * 0.4 - 0.2; // -20% a +20%
    let guadagnoBase = Math.floor(lavoroInfo.min + (lavoroInfo.max - lavoroInfo.min) * Math.random());
    guadagnoBase = Math.max(1, Math.floor(guadagnoBase * (1 + variazione)));

    // Sistema di esperienza e bonus
    user.bustapaga[lavoro] = user.bustapaga[lavoro] || { esperienza: 0, bonus: 0 };
    const bonusLivello = Math.min(Math.floor(user.bustapaga[lavoro].esperienza / 10), 50); // Max 50% bonus
    const guadagnoTotale = guadagnoBase + Math.floor(guadagnoBase * bonusLivello / 100);

    // Aggiornamento dati
    user.money += guadagnoTotale;
    user.bustapaga[lavoro].esperienza += 1;
    user.ultimoLavoro[lavoro] = now;

    // Frase casuale con controllo di sicurezza
    const frasiLavoro = lavoroInfo.frasi || [
      `Hai completato il tuo turno come ${lavoro} ${lavoroInfo.emoji}. Guadagni:`
    ];
    const fraseCasuale = frasiLavoro[Math.floor(Math.random() * frasiLavoro.length)];

    // Progresso verso il prossimo bonus
    const progressoBonus = user.bustapaga[lavoro].esperienza % 10;
    const nextBonusIn = 10 - progressoBonus;

    // Messaggio dettagliato
const messaggio = `
*🎉 LAVORO COMPLETATO! 🎉*

▸ *${lavoro} ${lavoroInfo.emoji}*
▸ *Guadagno:* ${guadagnoBase} 🍭${bonusLivello > 0 ? ` +${bonusLivello}% extra = *${guadagnoTotale} 🍭*` : ''}
▸ *Prossimo bonus:* tra ${nextBonusIn} lavori
▸ *Cooldown:* ${lavoroInfo.cooldown} minuti da aspettare
${easterEggMessage ? `\n${easterEggMessage}` : ''}
📌 *Resoconto giornata:*
${fraseCasuale} ${guadagnoTotale} 🍭
`.trim();
      
      
      
      
      
      
      
    // Invia messaggio con immagine di contesto
    let lavoroImage = null;
    const baseJobImgPath = path.resolve(__dirname, '../src/img/lavori');
    const lavoroImgPath = path.resolve(baseJobImgPath, `${lavoro}.png`);
    if (fs.existsSync(lavoroImgPath)) {
      lavoroImage = fs.readFileSync(lavoroImgPath);
    } else {
      lavoroImage = 'https://th.bing.com/th/id/OIP.6s5AZXgggvqpYQ1XSQERpgHaDt?rs=1&pid=ImgDetMain';
    }
    return conn.sendMessage(m.chat, {
      text: messaggio,
      contextInfo: {
        externalAdReply: {
          title: `🏆 ${lavoro.toUpperCase()} OF THE DAY!`,
          body: `Hai guadagnato ${guadagnoTotale} 💰`,
          thumbnail: Buffer.isBuffer(lavoroImage) ? lavoroImage : undefined,
          thumbnailUrl: !Buffer.isBuffer(lavoroImage) ? lavoroImage : undefined,
          sourceUrl: '',
          mediaType: 1
        }
      }
    }, { quoted: m });
  }
};

// RIMOSSA LA DICHIARAZIONE INTERNA DI lavoriDisponibili
handler.help = ['sceglilavoro [lavoro]', 'work'];
handler.tags = ['rpg'];
handler.command = ['sceglilavoro', 'chooselob', 'setjob', 'lavoro', 'work', 'lavora'];

export default handler;