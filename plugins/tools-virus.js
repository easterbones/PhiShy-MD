import fetch from 'node-fetch';
import { Buffer } from 'buffer'; // Importa Buffer per la codifica base64

const virusApiKey = "bb41d3de2b3edf3d53be6b826480109a1981783e1f17da31a2481fe980938f87";
const cache = new Map();

const handler = async (m, { text }) => {
    if (!text) return m.reply('⚠️ *Inserisci un URL!*\nEsempio: `.virus https://example.com`');

    const urlMatch = text.match(/url=(https?:\/\/[^\s&]+)/);
    const cleanUrl = urlMatch ? decodeURIComponent(urlMatch[1]) : text.trim();
    if (!cleanUrl.match(/^https?:\/\//i)) {
        return m.reply('❌ *URL non valido!* Usa http:// o https://');
    }

    try {
        if (cache.has(cleanUrl)) {
            return m.reply(cache.get(cleanUrl) + "\n\n*ℹ️ Risultati dalla cache*");
        }

        // Fase 1: Verifica esistenza nel database
        const res = await fetch(`https://www.virustotal.com/api/v3/urls/${encodeURIComponent(cleanUrl)}`, {
            headers: { 'x-apikey': virusApiKey }
        });

        let stats;
        if (res.status === 404) {
            // Fase 2: Avvia una nuova scansione
            const scanRes = await fetch("https://www.virustotal.com/api/v3/urls", {
                method: 'POST',
                headers: { 'x-apikey': virusApiKey, 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `url=${encodeURIComponent(cleanUrl)}`
            });
            const scanData = await scanRes.json();
            const report = await waitForScan(scanData.data.id);
            stats = report.data.attributes.stats;
        } else {
            stats = (await res.json()).data.attributes.last_analysis_stats;
        }

        const totalEngines = Object.values(stats).reduce((a, b) => a + b, 0);
        const resultText = formatResults(stats, cleanUrl, totalEngines);
        cache.set(cleanUrl, resultText);

        return m.reply(resultText);
    } catch (error) {
        console.error("[VIRUS SCAN ERROR]", error);
        return m.reply('⚠️ *Errore durante la scansione:* ' + error.message);
    }
};

async function waitForScan(scanId, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
        const res = await fetch(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
            headers: { 'x-apikey': virusApiKey }
        });
        const data = await res.json();
        console.log(`Stato scansione: ${data.data.attributes.status}`); // Debug
        if (data.data.attributes.status === 'completed') return data;
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 secondi
    }
    throw new Error("Scan non completato dopo " + maxAttempts * 10 + " secondi");
}

function formatResults(stats, url, total) {
    const encodedUrl = Buffer.from(url).toString('base64').replace(/=/g, '');
    return `🔍 *Risultati per ${url}:*\n` +
        `✅ *Puliti*: ${stats.harmless}/${total}\n` +
        `☢️ *Malware*: ${stats.malicious}/${total}\n` +
        `⚠️ *Sospetti*: ${stats.suspicious}/${total}\n\n` +
        `🔗 *Report completo*: [VirusTotal](https://www.virustotal.com/gui/url/${encodedUrl})`;
}

handler.command = ['virus'];
export default handler;