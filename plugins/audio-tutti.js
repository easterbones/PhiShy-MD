const audioResponses = [
    {
        patterns: /\b(diocan|diahane)\b/i,
        files: [
            'storage/audio/dio.m4a',
            'storage/audio/Porcodio.m4a'
        ],
        ptt: true,
        random: true
    },
    {
        patterns: /\b(bober|kurwa|balliamo|balla|danza|diva|disco|serata)\b/i,
        file: 'storage/audio/bober.m4a',
        ptt: false
    },
    {
        patterns: /\b(cicciona|ciccione|ciccottella|ciccia|cicci|grasso|grassa|obeso|obesa|sovrappeso|grossa)\b/i,
        file: 'storage/audio/cicciona.m4a',
        ptt: false
    },
    {
        patterns: /\b(ohno|dandan)\b/i,
        file: 'storage/audio/dandan.m4a',
        ptt: false
    },
    {
        patterns: /\b(maiale|scrofa|gino|maialino|porcellino|suino)\b/i,
        file: 'storage/audio/maiale.m4a',
        ptt: false
    },
    {
        patterns: /\b(maionese|ketchup|salsa|patatine|giovane|birre)\b/i,
        file: 'storage/audio/maionese.m4a',
        ptt: false
    },
    {
        patterns: /paguro|cicciogamer/i,
        file: 'storage/audio/paguro.m4a',
        ptt: false
    },
    {
        patterns: /\b(piedi)\b/i,
        file: 'storage/audio/piedi.opus',
        ptt: false
    },
    {
        patterns: /gennaro|mosconi/i,
        file: 'storage/audio/Porcodio.m4a',
        ptt: false
    },
    {
        patterns: /razzismo|razzista|fascista|immigrat/i,
        file: 'storage/audio/razzismo.m4a',
        ptt: false
    },
    {
        patterns: /\b(skibidi|rizz)\b/i,
        file: 'storage/audio/rizz.m4a',
        ptt: false
    },
    {
        patterns: /\b(troia|rosario|muniz)\b/i,
        file: 'storage/audio/rosario.m4a',
        ptt: false
    },
    {
        patterns: /topolino|tiska|tuska|mickey/i,
        file: 'storage/audio/topolino.m4a',
        ptt: false
    },
    {
        patterns: /topa|bona/i,
        file: 'storage/audio/topolona.m4a',
        ptt: true
    },
    {
        patterns: /\b(uomo|danny|vai)\b/i,
        file: 'storage/audio/uomo.m4a',
        ptt: false
    },
    {
        patterns: /\b(ushpapa|non mi conosci|conosco|chiamo|chiami)\b/i,
        file: 'storage/audio/ushpapa.m4a',
        ptt: false
    },
    {
        patterns: /\b(women|donne|donna|woman)\b/i,
        file: 'storage/audio/women.m4a',
        ptt: true
    },
    {
        patterns: /\b(brainrot)\b/i,
        file: 'storage/audio/oai.m4a',
        ptt: false
    },
    {
        patterns: /\b(allah|akbar)\b/i,
        file: 'storage/audio/allah.m4a',
        ptt: false
    },
    {
        patterns: /\b(albanese)\b/i,
        file: 'storage/audio/ban.m4a',
        ptt: false
    },
    {
        patterns: /\b(erba|banda)\b/i,
        file: 'storage/audio/erba.m4a',
        ptt: false
    },
    {
        patterns: /\b(lavora|lavoro)\b/i,
        file: 'storage/audio/lavora.m4a',
        ptt: false
    },
    {
        patterns: /\b(stefano|patrick)\b/i,
        file: 'storage/audio/stefano.m4a',
        ptt: false
    },
    {
        patterns: /\b(teresa|paura|creapypasta)\b/i,
        file: 'storage/audio/teresa.m4a',
        ptt: false
    },
    {
        patterns: /\b(tette|boobs)\b/i,
        file: 'storage/audio/tette.m4a',
        ptt: false
    },
    {
        patterns: /\b(trallallero|trallalla)\b/i,
        file: 'storage/audio/trallallero.m4a',
        ptt: false
    },
    {
        patterns: /\b(inculare|inculo|incula)\b/i,
        file: 'storage/audio/tu_vuoi_inculare_me.m4a',
        ptt: false
    },
    {
        patterns: /\b(fuckyou|fanculo|greta|menchi)\b/i,
        file: 'storage/audio/fuckyou.m4a',
        ptt: false
    },
];
const allTriggers = audioResponses.map(r => r.patterns.source.replace(/^\\b|\\b$/g, '')).join('|');
const combinedRegex = new RegExp(`\\b(${allTriggers})\\b`, 'i');

let handler = async (m, { conn }) => {
    if (m.key.fromMe) return;
    
    const matchedResponse = audioResponses.find(response => 
        response.patterns.test(m.text)
    );
    
    if (!matchedResponse) return;
    
    try {
        let audioPath;
        if (matchedResponse.random) {
            audioPath = matchedResponse.files[Math.floor(Math.random() * matchedResponse.files.length)];
        } else {
            audioPath = matchedResponse.file;
        }
        
        await conn.sendMessage(
            m.chat, 
            { 
                audio: { url: audioPath }, 
                mimetype: 'audio/mp4', 
                ptt: matchedResponse.ptt 
            }, 
            { quoted: m }
        );
    } catch (error) {
        console.log(error);
        m.reply("Si è verificato un errore durante l'invio dell'audio.");
    }
};

handler.customPrefix = combinedRegex;
handler.command = new RegExp;
handler.priority = 10;
export default handler;