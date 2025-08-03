
import { readFileSync } from 'fs';

let handler = async (m, { conn }) => {
    try {
        // Leggi il file JSON
        const data = JSON.parse(readFileSync('ngrok_url.json', 'utf8'));

        // Verifica se l'URL è presente e valido
        if (data.url && typeof data.url === 'string' && data.url.trim() !== '') {
            // Crea la vCard
            const vcardData = `
BEGIN:VCARD
VERSION:3.0
N:${m.sender.split('@')[0]};;;
FN:${m.sender.split('@')[0]}
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Cellulare
END:VCARD
            `.trim();

            // Crea il messaggio con la vCard e il testo
            const message = {
                text: `> 🌍 𝐞𝐜𝐜𝐨 𝐥𝐚 𝐩𝐚𝐠𝐢𝐧𝐚 𝐮𝐟𝐟𝐢𝐜𝐢𝐚𝐥𝐞 𝐝𝐢 𝐩𝐡𝐢𝐬𝐡𝐲
https://giraffaaaaa.github.io/phishy-site/


𝐧𝐞𝐥𝐥𝐚 𝐩𝐚𝐠𝐢𝐧𝐚 𝐩𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞 𝐩𝐨𝐭𝐫𝐚𝐢:
- 𝐯𝐞𝐝𝐞𝐫𝐞 𝐥𝐞 𝐭𝐮𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 
- 𝐠𝐮𝐚𝐫𝐝𝐚𝐫𝐞 𝐥𝐚 𝐭𝐨𝐩 10 𝐮𝐭𝐞𝐧𝐭𝐢
- 𝐯𝐞𝐝𝐞𝐫𝐞 𝐢 𝐧𝐨𝐬𝐭𝐫𝐢 𝐯𝐢𝐝𝐞𝐨 𝐬𝐮𝐢 𝐦𝐞𝐦𝐞 𝐞 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐮𝐧 𝐦𝐢𝐧𝐢 𝐠𝐢𝐨𝐜𝐨 𝐬𝐩𝐞𝐫𝐢𝐦𝐞𝐧𝐭𝐚𝐥𝐞 𝐬𝐮𝐢 𝐜𝐨𝐦𝐛𝐚𝐭𝐭𝐢𝐦𝐞𝐧𝐭𝐢 

se hai domande chiedi a wa.me/+393534409026`,
                contextInfo: {
                    externalAdReply: {
                        title: "",
                        body: "pagina del bot",
                 //       thumbnailUrl: data.url  ,
                        sourceUrl: "https://chatgpt.com/ " ,
                    },
                    mentionedJid: [m.sender], // Menziona l'utente
                    forwardingScore: 999, // Aumenta il punteggio di inoltro
                    isForwarded: true
                },
                contacts: {
                    displayName: m.sender.split('@')[0],
                    contacts: [{ vcard: vcardData }]
                }
            };

            // Invia il messaggio con la vCard e il testo
            await conn.sendMessage(m.chat, message);
        } else {
            await m.reply("❌ Nessun sito disponibile."), rcanal
        }
    } catch (err) {
        console.error('Errore durante la lettura del file:', err); // Log dell'errore
        await m.reply("❌ Errore durante l'invio del link");
    }
};

handler.command = ['sito'];
export default handler;