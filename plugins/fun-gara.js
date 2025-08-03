let raceCooldown = new Map();

let handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    
    // Controllo cooldown
    const cooldownTime = 30 * 60 * 1000; // 30 minuti in millisecondi
    const currentTime = new Date().getTime();
    
    if (raceCooldown.has(m.sender)) {
        const lastRaceTime = raceCooldown.get(m.sender);
        const remainingTime = cooldownTime - (currentTime - lastRaceTime);
        
        if (remainingTime > 0) {
            const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
            return conn.reply(m.chat, `⏳ Devi aspettare ancora ${remainingMinutes} minuti prima di poter fare un'altra gara!`, m);
        }
    }
    
    let tagged = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);

    // Verifica se è stato taggato o risposto a un utente
    if (!tagged) return conn.reply(m.chat, `Tagga un utente o rispondi a un suo messaggio per sfidarlo in una gara di corsa!\nEsempio: ${usedPrefix}gara @utente`, m);

    let user2 = global.db.data.users[tagged];

    // Verifica se entrambi gli utenti hanno almeno un veicolo
    if (!(user.macchina || user.moto) || !(user2.macchina || user2.moto)) {
        return conn.reply(m.chat, '[ ⚠ ] 𝐄𝐑𝐑𝐎𝐑𝐄\nEntrambi i partecipanti devono avere almeno un veicolo per gareggiare! (macchina o moto)', m);
    }

    // Verifica se entrambi hanno almeno 100 caramelle
    const betAmount = 100;
    if (user.limit < betAmount || user2.limit < betAmount) {
        return conn.reply(m.chat, `[ ⚠ ] 𝐄𝐑𝐑𝐎𝐑𝐄\nEntrambi i giocatori devono avere almeno ${betAmount} caramelle per partecipare alla gara!`, m);
    }

    // Sottrai la scommessa
    user.limit -= betAmount;
    user2.limit -= betAmount;

    // Avvia la gara
    let vincitore;
    let probCrash = Math.random() < 0.1; // 10% probabilità di schianto
    if (probCrash) {
        vincitore = null; // Schianto
    } else {
        let chance1 = 0.5 + (user.carModifiche || 0) * 0.05;
        let chance2 = 0.5 + (user2.carModifiche || 0) * 0.05;
        vincitore = Math.random() < chance1 / (chance1 + chance2) ? m.sender : tagged;
    }

    let { key } = await conn.sendMessage(m.chat, { text: "🏁 *GARA IN CORSO* 🏁\n\n🚦 Pronti... Partenza... Via! 🚦" }, { quoted: m });

    // Determina i veicoli dei partecipanti
    let userVehicle = user.macchina ? '🚗' : '🏍';
    let user2Vehicle = user2.macchina ? '🚗' : '🏍';
    let winner = vincitore === m.sender ? 'user' : 'user2';

    // Crea la pista di gara (da sinistra a destra)
    const createRaceTrack = (pos1, pos2) => {
        const trackLength = 15;
        let track1 = ' '.repeat(trackLength - pos1) + userVehicle + ' '.repeat(pos1);
        let track2 = ' '.repeat(trackLength - pos2) + user2Vehicle + ' '.repeat(pos2);
        return `🏁${'═'.repeat(trackLength)}\n→${track1}\n→${track2}`;
    };

    // Animazione della gara
    let userPos = 0;
    let user2Pos = 0;
    let frames = [];

    for (let i = 0; i < 15; i++) {
        if (winner === 'user') {
            userPos = Math.min(userPos + 1 + Math.random(), 15);
            user2Pos = Math.min(user2Pos + Math.random(), 15);
        } else {
            userPos = Math.min(userPos + Math.random(), 15);
            user2Pos = Math.min(user2Pos + 1 + Math.random(), 15);
        }
        frames.push(createRaceTrack(Math.floor(userPos), Math.floor(user2Pos)));
    }

    // Velocità aumentata (300ms invece di 400ms)
    for (let frame of frames) {
        await conn.sendMessage(m.chat, { text: frame, edit: key }, { quoted: m });
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (vincitore === null) {
        raceCooldown.set(m.sender, currentTime);
        return conn.reply(m.chat, 
            `💥 *SCHIANTO!* 💥\n\nEntrambi i veicoli si sono schiantati!\n\n` +
            `💰 Le scommesse (${betAmount} caramelle ciascuno) sono state perse!`, 
            m);
    }

    let premio = betAmount * 2; // Vincita totale (scommessa*2)
    let vincitoreNome = vincitore === m.sender ? 'Tu' : `@${tagged.split('@')[0]}`;
    let perdenteNome = vincitore === m.sender ? `@${tagged.split('@')[0]}` : 'Tu';
    
    await conn.sendMessage(m.chat, { 
        text: `🎉 *${vincitoreNome} HA VINTO!* 🎉\n\n` +
              `🏆 Vincita: ${premio} caramelle!\n` +
              `😢 ${perdenteNome} ha perso ${betAmount} caramelle\n\n` +
              `💰 Nuovo saldo vincitore: ${vincitore === m.sender ? user.limit + premio : user2.limit + premio} caramelle`,
        edit: key 
    }, { quoted: m });

    if (vincitore === m.sender) {
        user.limit += premio;
    } else {
        user2.limit += premio;
    }
    
    // Imposta il cooldown
    raceCooldown.set(m.sender, currentTime);
};

handler.help = ['gara'];
handler.tags = ['auto'];
handler.command = ['gara'];
handler.register = true;

export default handler;