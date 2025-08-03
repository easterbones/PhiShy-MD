// Plugin: traduci-hybrid.js
// Comando: .traduci <lang|dialetto|phishy> <testo> oppure in risposta a un messaggio
import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let mode = (args[0] || '').toLowerCase();
    let testo = args.slice(1).join(' ');
    if (!testo && m.quoted?.text) {
        testo = m.quoted.text;
    }
    if (!testo) {
        return m.reply('❓ Scrivi il testo da tradurre o rispondi a un messaggio.\nEsempio: .traduci it Hello world\nEsempio: .traduci dialetto Che stai dicendo?\nEsempio: .traduci phishy Dimmi una frase divertente');
    }
    try {
        if (mode === 'dialetto') {
            // Dialect/unclear text to Italian
            const url = `https://laurine.site/api/ai/heckai?query=${encodeURIComponent(testo)}`;
            const res = await fetch(url);
            const json = await res.json();
            if (json && json.result) {
                await m.reply(`🗣️ Traduzione in italiano (dialetto):\n${json.result}`);
            } else {
                await m.reply('❌ Non sono riuscito a tradurre il testo dal dialetto.');
            }
        } else if (mode === 'phishy') {
            // Creative/funny translation using Phishy AI
            const promptBase = `Sei Phishy, una ragazza sarcastica e un po' arrogante in una chat WhatsApp. Rispondi in modo diretto, a volte crudele, ma sempre con stile. Usa emoji occasionalmente. Non essere troppo formale. Rispondi a questo:`;
            const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/turbo-ai?content=${encodeURIComponent(promptBase)}&text=${encodeURIComponent(testo)}`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(apiUrl, { signal: controller.signal }).finally(() => clearTimeout(timeout));
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            if (!data?.content?.trim()) throw new Error('Empty API response');
            await m.reply(`🤖 Phishy dice:\n${data.content.trim()}`);
        } else {
            // Default: Google Translate (or fallback)
            let lang = mode.length === 2 ? mode : 'it';
            let textToTranslate = mode.length === 2 ? testo : [mode, ...args.slice(1)].join(' ');
            try {
                let result = await translate(`${textToTranslate}`, { to: lang, autoCorrect: true });
                await m.reply('🌐 Traduzione: ' + result.text);
            } catch {
                try {
                    let lol = await fetch(`https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${encodeURIComponent(textToTranslate)}`);
                    let loll = await lol.json();
                    let result2 = loll.result.translated;
                    await m.reply('🌐 Traduzione (fallback): ' + result2);
                } catch {
                    await m.reply('❌ Errore nella traduzione.');
                }
            }
        }
    } catch (e) {
        await m.reply('⚠️ Errore durante la traduzione.');
    }
};

handler.help = ['traduci <it|en|dialetto|phishy> <testo> (o rispondi a un messaggio)'];
handler.tags = ['tools'];
handler.command = /^traduci$/i;

export default handler;
