import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Config GitHub
const GITHUB_TOKEN = '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';
const GITHUB_USERNAME = 'Giraffaaaaa';
const GITHUB_REPO = 'Phishy-site';
const GITHUB_BRANCH = 'main';
const FILE_PATH_IN_REPO = 'database.json';

// Percorso file locale
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDBPath = path.join(__dirname, '..', 'database.json');

// Funzione per ottenere lo SHA del file (necessario per l'update)
async function getFileSha() {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH_IN_REPO}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        return response.data.sha;
    } catch (error) {
        console.error('❌ Errore nel recuperare lo SHA del file:', error.message);
        return null;
    }
}

// Funzione per aggiornare il file su GitHub
async function updateGitHubDatabase() {
    try {
        const content = fs.readFileSync(localDBPath, 'utf8');
        const encodedContent = Buffer.from(content).toString('base64');
        const sha = await getFileSha();
        if (!sha) return;

        const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH_IN_REPO}`;

        const response = await axios.put(url, {
            message: `Aggiornamento automatico del database alle ${new Date().toLocaleString()}`,
            content: encodedContent,
            sha: sha,
            branch: GITHUB_BRANCH
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        console.log(`✅ Database aggiornato su GitHub: ${response.data.content.path}`);
    } catch (err) {
        console.error('❌ Errore durante l\'aggiornamento del file su GitHub:', err.message);
    }
}

// Esegui ogni 30 minuti
setInterval(updateGitHubDatabase, 1800000);
updateGitHubDatabase(); // anche subito all'avvio
