import fs from 'fs';
import { xpRange } from '../lib/levelling.js';
import Incantesimi from '../lib/incantesimi.js';

const MAGHI_DB = 'maghi.json';

let handler = async (m, { conn, usedPrefix }) => {
    // Carica il database dei maghi
    let maghiData;
    try {
        maghiData = JSON.parse(fs.readFileSync(MAGHI_DB));
    } catch (e) {
        console.error(e);
        return conn.reply(m.chat, "❌ Errore nel caricamento del database dei maghi", m, rcanal);
    }

    // Ottieni i dati dell'utente
    let user = maghiData.users[m.sender] || {};
    
    // Inizializza i parametri mancanti
    if (!user.livello) user.livello = 1;
    if (!user.score) user.score = 0;
    if (!user.incantesimi) user.incantesimi = [];
    if (!user.oggetti) user.oggetti = {};
    if (!user.casata) user.casata = { nome: "Non assegnata" };
    if (!user.bacchetta) user.bacchetta = { nome: "Nessuna", rarita: "N/D" };

 

    // Formattazione dati
    const formatItems = () => {
        const items = Object.entries(user.oggetti)
            .filter(([_, qty]) => qty > 0)
            .map(([item, qty]) => `▸ ${item}: ${qty}`);
        return items.length > 0 ? items.join('\n') : 'Nessun oggetto';
    };

    const formatSpells = () => {
        return user.incantesimi.length > 0 ? 
            user.incantesimi.map(inc => `▸ ${inc}`).join('\n') : 
            'Nessun incantesimo appreso\n(Usa *.studia* per impararne)';
    };

    // Costruisci il messaggio
    let txt = `📜 *PROFILO MAGICO* 📜\n\n`;
    txt += `🧙 *Mago*: ${user.nome || conn.getName(m.sender)}\n`;
    txt += `🎩 *Casata*: ${user.casa.nome}\n`;
    txt += `⚡ *Livello*: ${user.livello}\n`;
    txt += `✨ *XP*: ${user.score}\n`;
    
    txt += `🪄 *Bacchetta*: ${user.bacchetta.nome} (${user.bacchetta.rarita})\n`;
    txt += `		 *materiale*: ${user.bacchetta.materiale} (${user.bacchetta.rarita})\n`;
    txt += `		 *stats*: ${user.bacchetta.potenza} potenza, ${user.bacchetta.precisione} precisione, ${user.bacchetta.affinità} affinità\n`;
    
    
    txt += `🎒 *Inventario*:\n${formatItems()}\n\n`;
    
    txt += `🔮 *Prossimi obiettivi*:\n`;
    txt += `Usa ${usedPrefix}studia per avanzare`;

    // Invia il messaggio con anteprima
    await conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
            externalAdReply: {
                title: `${user.nome || "Mago"} - Livello ${user.livello}`,
                body: `Casata ${user.casa.nome}`,
                thumbnailUrl: 'https://www.eusemfronteiras.com.br/wp-content/uploads/2023/03/shutterstock_2195696831-scaled.jpg',
                sourceUrl: ''
            }
        }
    }, { quoted: m });
};

handler.getNextSpell = (level) => {
    if (level < 5) return "Lumos (al livello 5)";
    if (level < 10) return "Wingardium Leviosa (al livello 10)";
    if (level < 15) return "Expelliarmus (al livello 15)";
    if (level < 20) return "Protego (al livello 20)";
    return "Hai sbloccato tutti gli incantesimi base!";
};

handler.help = ['profilo'];
handler.tags = ['magia'];
handler.command = ['borsa', 'profile', 'stats'];
export default handler;