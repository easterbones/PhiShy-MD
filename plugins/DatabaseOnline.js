import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Determina il percorso del file attuale
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Percorsi dei file
const sourcePath = path.join(__dirname, '..', 'database.json');
const destinationPath = path.join(__dirname, '..', 'server_html', 'Public', 'database.json');
const ngrokPath = path.join(__dirname, '..', 'ngrok_url.json');

// URL di backup su GitHub Pages
const githubPage = 'https://github.com/Giraffaaaaa/phishy-site/blob/main/database.json';

// Funzione per copiare il database
function copyDatabase() {
    try {
        if (!fs.existsSync(sourcePath)) throw new Error(`Il file ${sourcePath} non esiste.`);
        const data = fs.readFileSync(sourcePath, 'utf8');
        const destinationDir = path.dirname(destinationPath);
        if (!fs.existsSync(destinationDir)) fs.mkdirSync(destinationDir, { recursive: true });
        fs.writeFileSync(destinationPath, data, 'utf8');
        console.log(`💀 File copiato con successo alle ${new Date().toLocaleTimeString()}`);
    } catch (error) {
        console.error(`❌ Errore durante la copia del file:`, error);
    }
}

// Funzione per aggiornare l'URL da ngrok
async function updateNgrokUrl() {
    try {
        // Esegui una richiesta per ottenere i tunnel attivi da ngrok
        const response = await axios.get('http://127.0.0.1:4040/api/tunnels');
        const tunnels = response.data.tunnels;

        // Cerca un tunnel pubblico HTTPS
        const tunnel = tunnels.find(t => t.public_url && t.public_url.startsWith('https://'));
        const ngrokUrl = tunnel ? tunnel.public_url : null;

        if (ngrokUrl) {
            // Scrivi nel file JSON l'url principale (ngrok) e secondario (github)
            const urlData = {
                url: ngrokUrl,
                backup: githubPage,
                updatedAt: new Date().toISOString()
            };
            fs.writeFileSync(ngrokPath, JSON.stringify(urlData, null, 2), 'utf8');
            console.log(`🌐 URL ngrok aggiornato: ${ngrokUrl}`);
        } else {
            console.warn('⚠️ Nessun tunnel HTTPS trovato.');
        }
    } catch (error) {
        console.error('❌ Errore durante l\'aggiornamento del link ngrok:', error.message);
    }
}

// Esegui tutto ogni 30 minuti
setInterval(() => {
    copyDatabase();
    updateNgrokUrl();
}, 1800000);

// Esegui subito al primo avvio
copyDatabase();
updateNgrokUrl();
