const cooldowns = {};
const emojis = ['💘', '💋', '😘', '🥰', '😍', '👩‍❤️‍💋‍👨', '💑', '💏'];

const handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const cooldownTime = 5 * 60; // 5 minuti di cooldown
    
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < cooldownTime * 1000) {
        const remainingTime = formatCooldown(Math.ceil((cooldowns[m.sender] + cooldownTime * 1000 - Date.now()) / 1000));
        return conn.reply(m.chat, `⏳ *Devi riprendere fiato!*\nAspetta ancora *${remainingTime}* prima di poter sedurre di nuovo.`, m);
    }

    const reward = Math.floor(Math.random() * 5000);
    cooldowns[m.sender] = Date.now();
    
    const message = `${pickRandom(emojis)} ${pickRandom(pickupLines)} *${formatNumber(reward)}* XP romantici!`;
    
    await conn.reply(m.chat, message, m);
    user.limit += reward;
};

handler.help = ['seduci'];
handler.tags = ['fun', 'game'];
handler.command = ['seduci', 'flirt', 'corteggia', 'romantico'];
handler.register = true;
export default handler;

// Funzioni di utilità
function formatNumber(num) {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

function formatCooldown(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minuti e ${secs} secondi`;
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// Frasi di "seduzione" in stile italiano
const pickupLines = [
    "Hai lanciato un occhiolino al barista e hai guadagnato",
    "La tua battuta da quattro soldi ha strappato un sorriso e ottieni",
    "Hai offerto un caffè a sconosciuti e ricevi",
    "Il tuo sguardo misterioso ha colpito nel segno, ecco",
    "Hai ballato goffamente ma con stile, guadagni",
    "La tua imitazione di Alberto Sordi ha conquistato tutti,",
    "Hai recitato una poesia d'amore improvvisata, ricevi",
    "Il tuo fascino retro anni '50 ti frutta",
    "Hai cantato 'Volare' fuori tempo ma con passione,",
    "Il tuo sorriso sgangherato ha sciolto i cuori, ecco",
    "Hai organizzato una cena a lume di candela (con takeaway),",
    "Il tuo tentativo di parlare francese è stato adorabile,",
    "Hai scritto un messaggio d'amore... poi cancellato... ma comunque ottieni",
    "Il tuo fascino da romanzo rosa ti regala",
    "Hai fatto ridere con una barzelletta pessima, ricevi"
];