async function handler(m, { conn, usedPrefix, command, args }) {
    // Ottieni l'utente menzionato o risposto
    let mentionedUser = m.mentionedJid && m.mentionedJid[0];
    let repliedUser = m.quoted && m.quoted.sender;
    let targetUserId = mentionedUser || repliedUser || m.sender; // Se nessuno è menzionato, usa chi ha inviato il comando
    let targetUser = global.db.data.users[targetUserId];
    let targetName = conn.getName(targetUserId) || "utente";

    // Controlla se l'utente ha specificato cosa vuole misurare
    let type = args[0]?.toLowerCase(); // "pene" o "tette"

    if (!type || (type !== "pene" && type !== "bocce")) {
        // Se l'utente non ha specificato, mostra un menu di scelta
        let message = `
🔍 *Cosa vuoi misurare di ${targetName}?*

Usa uno di questi comandi:
- *${usedPrefix}misura pene*: Misura il pene 🍆
- *${usedPrefix}misura bocce*: Misura le tette 🍒
        `;
        return m.reply(message);
    }

    // Genera la misura in base alla scelta
    let result;
    if (type === "pene") {
        let peneSize = Math.floor(Math.random() * 30) + 1; // Tra 1 e 30 cm
        let peneVisual = generatePeneVisual(peneSize); // Genera la rappresentazione visiva
        let peneComment = getPeneComment(peneSize);
        result = `
🍆 *Misura del pene di ${targetName}:* ${peneSize} cm
${peneVisual}
${peneComment}
        `;
    } else if (type === "bocce") {
        let tetteSize = Math.floor(Math.random() * 9) + 1; // Tra 1 e 9 (per "prima" a "nona")
        let tetteSizeWord = getTetteSizeWord(tetteSize); // Converti il numero in parola
        let tetteVisual = generateTetteVisual(tetteSize); // Genera la rappresentazione visiva
        let tetteComment = getTetteComment(tetteSize);
        result = `
🍒 *Misura delle tette di ${targetName}:* ${tetteSizeWord}
${tetteVisual}
${tetteComment}
        `;
    }

    // Funzione per l'animazione di caricamento
    async function loading() {
        var hawemod = [
            "《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
            "《 ███████▒▒▒▒▒》50%",
            "《 ██████████▒▒》80%",
            "《 ████████████》100%"
        ];

        // Invia il messaggio iniziale di caricamento
        let { key } = await conn.sendMessage(m.chat, { text: `📊 Calcolo in corso...`, mentions: conn.parseMention(result) }, { quoted: m });

        // Modifica il messaggio con l'animazione di caricamento
        for (let i = 0; i < hawemod.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            await conn.sendMessage(m.chat, { text: hawemod[i], edit: key, mentions: conn.parseMention(result) }, { quoted: m });
        }

        // Invia il risultato finale
        await conn.sendMessage(m.chat, { text: result, edit: key, mentions: conn.parseMention(result) }, { quoted: m });
    }

    // Avvia l'animazione di caricamento
    loading();
}

// Funzione per generare la rappresentazione visiva del pene
function generatePeneVisual(size) {
    let equalsCount = Math.floor(size / 5); // Numero di "=" in base alla misura
    equalsCount = Math.max(1, equalsCount); // Almeno un "="
    equalsCount = Math.min(6, equalsCount); // Massimo 6 "="
    return `8${"=".repeat(equalsCount)}D`;
}

// Funzione per generare la rappresentazione visiva delle tette
function generateTetteVisual(size) {
    let spaceCount = Math.floor(size / 2); // Numero di spazi in base alla misura
    spaceCount = Math.max(1, spaceCount); // Almeno uno spazio
    spaceCount = Math.min(5, spaceCount); // Massimo 5 spazi
    return `(${" ".repeat(spaceCount)}.${" ".repeat(spaceCount)}) (${" ".repeat(spaceCount)}.${" ".repeat(spaceCount)})`;
}

// Funzione per convertire il numero in parola (prima, seconda, ecc.)
function getTetteSizeWord(size) {
    const sizes = ["prima", "seconda", "terza", "quarta", "quinta", "sesta", "settima", "ottava", "nona"];
    return sizes[size - 1] || "nona"; // Se il numero è fuori range, usa "nona"
}

// Funzione per generare un commento sul pene
function getPeneComment(size) {
    if (size < 5) return "Wow, è proprio piccolo! 😅";
    if (size < 10) return "Niente male, ma c'è di meglio! 😉";
    if (size < 15) return "Un buon compromesso! 😎";
    if (size < 20) return "Impressionante! 🥵";
    return "Mamma mia, è enorme! 😱";
}

// Funzione per generare un commento sulle tette
function getTetteComment(size) {
    if (size < 3) return "Piccole ma carine! 😊";
    if (size < 5) return "Un bel manciabile! 😏";
    if (size < 7) return "Wow, che curve! 😍";
    if (size < 9) return "Davvero notevoli! 🥵";
    return "Sono enormi! 😱";
}

handler.help = ["misura"];
handler.tags = ["fun"];
handler.command = ["misura"];
handler.group = true; // Funziona solo nei gruppi
handler.register = true; // Richiede la registrazione dell'utente

export default handler;