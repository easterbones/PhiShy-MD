import tf from '@tensorflow/tfjs-node';
import nsfwjs from 'nsfwjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

// Configurazione paths ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione
export const NSFW_CONFIG = {
    threshold: 0.75, // Soglia per considerare un'immagine come NSFW
    deleteMedia: true, // Se true, elimina il media NSFW
    warnUser: true, // Se true, invia un avviso all'utente
    tempDir: path.join(__dirname, 'temp_nsfw'), // Cartella per i file temporanei
    logFile: 'nsfw_actions.log' // File di log
};

// Inizializza il modello
let nsfwModel;
let isModelReady = false;


export async function initializeModel() {
    const modelPaths = [
        path.join(__dirname, '../models/nsfwjs/'),
        path.join(__dirname, '../models/nsfwjs-model/'),
        path.join(__dirname, './models/nsfwjs/'),
        path.join(__dirname, './models/nsfwjs-model/'),
        'models/nsfwjs/',
        'models/nsfwjs-model/'
    ];
    let loaded = false;
    for (const modelPath of modelPaths) {
        try {
            console.log(`[NSFW] Provo a caricare il modello da: ${modelPath}`);
            nsfwModel = await nsfwjs.load(modelPath);
            isModelReady = true;
            loaded = true;
            console.log(`[NSFW] Modello pronto da: ${modelPath}`);
            break;
        } catch (error) {
            console.error(`[NSFW] Errore caricamento modello da ${modelPath}:`, error.message || error);
        }
    }
    if (!loaded) {
        isModelReady = false;
        console.error('[NSFW] Nessun modello NSFW caricato. Verifica le path e la connessione.');
    }
}

// Crea la cartella temp se non esiste
if (!fs.existsSync(NSFW_CONFIG.tempDir)) {
    fs.mkdirSync(NSFW_CONFIG.tempDir);
}

// Funzione per processare un media
async function processMedia(mediaBuffer, fileExtension = '.jpg') {
    if (!isModelReady) {
        console.warn('[NSFW] Modello non pronto, skip...');
        return { isNSFW: false, probabilities: null };
    }

    const tempFilePath = path.join(NSFW_CONFIG.tempDir, `nsfw_check_${Date.now()}${fileExtension}`);
    
    try {
        // Salva il buffer su file
        fs.writeFileSync(tempFilePath, mediaBuffer);
        
        // Classifica l'immagine
        const image = await tf.node.decodeImage(mediaBuffer, 3);
        const predictions = await nsfwModel.classify(image);
        image.dispose();
        
        // Estrai le probabilità
        const pornProb = predictions.find(p => p.className === 'Porn').probability;
        const hentaiProb = predictions.find(p => p.className === 'Hentai').probability;
        const sexyProb = predictions.find(p => p.className === 'Sexy').probability;
        
        const isNSFW = pornProb >= NSFW_CONFIG.threshold || 
                      hentaiProb >= NSFW_CONFIG.threshold ||
                      sexyProb >= NSFW_CONFIG.threshold;
        
        return {
            isNSFW,
            probabilities: {
                porn: pornProb,
                hentai: hentaiProb,
                sexy: sexyProb
            }
        };
    } catch (error) {
        console.error('[NSFW] Errore durante la classificazione:', error);
        return { isNSFW: false, probabilities: null };
    } finally {
        // Pulisci il file temporaneo
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
}

// Log delle azioni
function logNSFWAction(sender, chatId, isNSFW, probabilities) {
    const logEntry = `[${new Date().toISOString()}] ${isNSFW ? 'NSFW' : 'Clean'} | User: ${sender} | Chat: ${chatId} | ` +
                    `Probs: Porn=${probabilities?.porn?.toFixed(2) || 'N/A'}, ` +
                    `Hentai=${probabilities?.hentai?.toFixed(2) || 'N/A'}, ` +
                    `Sexy=${probabilities?.sexy?.toFixed(2) || 'N/A'}\n`;
    
    fs.appendFileSync(NSFW_CONFIG.logFile, logEntry);
}

// Handler principale per Baileys
export function createNSFWHandler(sock) {
    return async (message) => {
        try {
            // Controlla solo messaggi con media
            if (!message.message?.imageMessage && !message.message?.stickerMessage) {
                return;
            }

            const mediaType = message.message.imageMessage ? 'image' : 'sticker';
            const mediaMessage = message.message[`${mediaType}Message`];
            const sender = message.key.participant || message.key.remoteJid;
            const chatId = message.key.remoteJid;

            // Scarica il media usando la funzione Baileys corretta
            const buffer = await downloadMediaMessage(message, 'buffer');
            if (!buffer) return;

            // Analizza il media
            const ext = mediaType === 'image' ? '.jpg' : '.webp';
            const { isNSFW, probabilities } = await processMedia(buffer, ext);
            
            // Log dell'azione
            logNSFWAction(sender, chatId, isNSFW, probabilities);

            if (isNSFW) {
                console.log(`[NSFW] Rilevato contenuto NSFW da ${sender} in ${chatId}`);

                // Elimina il messaggio se configurato
                if (NSFW_CONFIG.deleteMedia) {
                    await sock.sendMessage(chatId, { delete: message.key });
                }

                // Avvisa l'utente se configurato
                if (NSFW_CONFIG.warnUser) {
                    const warningMsg = `⚠️ Contenuto NSFW rilevato! Per favore non inviare ${mediaType} inappropriate.`;
                    await sock.sendMessage(chatId, { text: warningMsg }, { quoted: message });
                }
            }
        } catch (error) {
            console.error('[NSFW] Errore nel handler:', error);
        }
    };
}

export default {
    initializeModel,
    createNSFWHandler,
    NSFW_CONFIG
};