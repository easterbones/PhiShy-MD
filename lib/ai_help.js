// Script per rispondere alle domande degli utenti usando DistilBERT
// Usa @xenova/transformers
import { env, pipeline } from '@xenova/transformers';
import fs from 'fs';
import path from 'path';

const CHAT_JSON_PATH = './data/ai_chat_context.json';

// Inizializza il file JSON se non esiste
function initChatJson(jid) {
    if (!fs.existsSync(CHAT_JSON_PATH)) {
        const obj = {};
        obj[jid] = [];
        fs.writeFileSync(CHAT_JSON_PATH, JSON.stringify(obj, null, 2));
    } else {
        // Se esiste ma non ha la chiave, la aggiunge
        const raw = fs.readFileSync(CHAT_JSON_PATH, 'utf8');
        let data = {};
        try { data = JSON.parse(raw); } catch { data = {}; }
        if (!(jid in data)) {
            data[jid] = [];
            fs.writeFileSync(CHAT_JSON_PATH, JSON.stringify(data, null, 2));
        }
    }
}

// Aggiunge un messaggio alla chat, mantiene solo i primi 100
function addMessageToChat(jid, message) {
    initChatJson(jid);
    const raw = fs.readFileSync(CHAT_JSON_PATH, 'utf8');
    let data = {};
    try { data = JSON.parse(raw); } catch { data = {}; }
    if (!(jid in data)) data[jid] = [];
    data[jid].push(message);
    if (data[jid].length > 100) data[jid] = data[jid].slice(-100);
    fs.writeFileSync(CHAT_JSON_PATH, JSON.stringify(data, null, 2));
}

// Legge i messaggi di una chat come contesto testuale
function getChatContext(jid) {
    if (!fs.existsSync(CHAT_JSON_PATH)) return '';
    const raw = fs.readFileSync(CHAT_JSON_PATH, 'utf8');
    let data = {};
    try { data = JSON.parse(raw); } catch { return ''; }
    if (!(jid in data)) return '';
    return data[jid].join(' ');
}

// Inizializza la pipeline QA
env.localModelPath = 'c:/PhiShy-MD/models/';
env.allowRemoteModels = false;
let qa = null;
async function loadModel() {
    if (!qa) {
        qa = await pipeline('question-answering', 'distilbert-base-cased-distilled-squad');
    }
}

// Leggi il contenuto di un file locale
// Deprecated: usa getChatContext per la AI
function readLocalFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        return 'Errore nella lettura del file: ' + err.message;
    }
}

// Funzione principale per rispondere alle domande
export async function answerQuestion(question, contextFile) {
    await loadModel();
    // contextFile ora è il jid della chat
    const context = getChatContext(contextFile);
    console.log('[ai_help] answerQuestion: question =', question);
    console.log('[ai_help] answerQuestion: context =', context);
    if (typeof context !== 'string' || context.trim().length === 0) {
        throw new Error('Il contesto della chat è vuoto o non valido. Scrivi qualche messaggio prima di usare !help.');
    }
    const result = await qa({ question, context });
    return result.answer;
}

// Funzione da chiamare per aggiungere un messaggio intercettato
export function saveMessageToAIChat(jid, message) {
    // Ignora i messaggi che iniziano con un prefisso di comando
    const prefixes = ['.help', '!help', '/help'];
    if (typeof message === 'string' && prefixes.some(p => message.trim().toLowerCase().startsWith(p))) {
        return;
    }
    addMessageToChat(jid, message);
}

// Esempio di utilizzo
// answerQuestion('Qual è la capitale d’Italia?', './data/userGroupData.json').then(console.log);
