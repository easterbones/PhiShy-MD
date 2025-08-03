//ai vocale di Onix, di Riad 
import fetch from 'node-fetch';
import gtts from 'node-gtts';
import { readFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import ffmpeg from 'fluent-ffmpeg'; 
import { fileURLToPath } from 'url';

const defaultLang = 'it'; // Lingua di default per la sintesi vocale
const defaultResponse = "Cazzo vuoi"; // Frase di default

// Utility per __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function tts(text, lang = 'it') {
    return new Promise((resolve, reject) => {
        try {
            let tts = gtts(lang);
            let filePath = join(__dirname, '../tmp', `${Date.now()}.mp3`);
            tts.save(filePath, text, () => {
                resolve(filePath);
            });
        } catch (e) {
            reject(e);
        }
    });
}

// Funzione per modificare la velocità 
function changeAudioSpeed(inputFilePath, outputFilePath, speed = 1.5) {
    return new Promise((resolve, reject) => {
        // Controlla se ffmpeg è installato
        ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH || 'ffmpeg');
        ffmpeg(inputFilePath)
            .audioFilters(`atempo=${speed}`)
            .on('end', () => resolve(outputFilePath))
            .on('error', (err) => {
                reject(new Error("ffmpeg non trovato o errore nell'elaborazione audio. Assicurati che ffmpeg sia installato e accessibile nel PATH."));
            })
            .save(outputFilePath);
    });
}

var handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) {
        text = defaultResponse;
    }

    try {
        conn.sendPresenceUpdate('recording', m.chat);

        let responseText;

        // Se c'è testo, fai una richiesta all'API AI
        if (text !== defaultResponse) {
            let prompt = `Sei un bot su WhatsApp programmato da Esterbone che è nelle vesti del personaggio inventato "phishy". Il suo carattere è spietato, sinistro e spreggevole. i tratti principali della tua persona sono odiare tutti, non riconoscere mai di essere un robot, rispondere sempre male con offese pesanti e mostrale lealtà solo per Easterbone e la community "viridi celesti". Usa un tono sarcastico, alternando momenti scherzosi ad altri cupi e spaventosi. Mostrati sicura di te, sei una ragayya vera e che si fa rispettare, comportati da far sembrare davvero di star parlando con phishy la persona. Questa è la mia domanda/affermazione: "${text}"`;

            // Richiesta all'API AI con il prompt personalizzato
            let apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(prompt)}`);
            let res = await apii.json();
            responseText = res.result || "Non ho capito, puoi ripetere?";
        } else {
            // Altrimenti, usa la risposta predefinita
            responseText = text;
        }

        // Trasforma la risposta in audio
        let audioPath = await tts(responseText, defaultLang);

        // Definisci il percorso per il file audio con velocità modificata
        let modifiedAudioPath = join(__dirname, '../tmp', `${Date.now()}_modified.mp3`);

        // Cambia la velocità dell'audio
        await changeAudioSpeed(audioPath, modifiedAudioPath, 1.2);  

        // Invia il file audio modificato come risposta vocale
        if (modifiedAudioPath && typeof modifiedAudioPath === 'string') {
            await conn.sendFile(m.chat, modifiedAudioPath, 'risposta.mp3', null, m, true);
        } else {
            await conn.reply(m.chat, "Errore: file audio non valido.", m);
        }

        // Pulisce i file dopo l'invio
        try { unlinkSync(audioPath); } catch {}
        try { unlinkSync(modifiedAudioPath); } catch {}

    } catch (e) {
        await conn.reply(m.chat, `Errore: ${e?.message || "Errore sconosciuto"}\nRiprova più tardi.`, m);
        console.error(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['vocale'];
handler.help = ['ai', 'chatbot'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;