import fs from 'fs';

// Configurazione globale
const config = {
    ownername: "ᴸᴱᴼˣᴱᴸ⁴ˢ 👁️‍🗨️",
    location: "Italy",
    prefa: [' ', ''],
    limitawal: {
        premium: "Infinity",
        free: 20
    }
};

// Impostazione delle variabili globali (se necessario per compatibilità)
if (typeof global !== 'undefined') {
    global.ownername = config.ownername;
    global.location = config.location;
    global.prefa = config.prefa;
    global.limitawal = config.limitawal;
}

// File watching per hot-reload (solo se supportato)
const currentFile = import.meta.url;
if (fs.watchFile) {
    try {
        fs.watchFile(new URL(currentFile).pathname, () => {
            fs.unwatchFile(new URL(currentFile).pathname);
            console.log(`Update ${currentFile}`);
            // Note: Hot-reload con ES6 modules richiede approcci diversi
            // come dynamic imports o restart del processo
        });
    } catch (error) {
        console.log('File watching not supported in this environment');
    }
}

export default config;