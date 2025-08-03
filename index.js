console.log('phishy sta partennndooooo...')
import { join, dirname } from 'path'
import { createRequire } from "module";
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile, writeFileSync } from 'fs'
import cfonts from 'cfonts';
import { createInterface } from 'readline'
import yargs from 'yargs'
import gradient from 'gradient-string';
import { animatePhishy } from './lib/animation.js';

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname) 
const { name, author } = require(join(__dirname, './package.json')) 
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

var isRunning = false
global.LAST_NGROK_URL = "" // Variabile per salvare il link

/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
    if (isRunning) return
    isRunning = true
    let args = [join(__dirname, file), ...process.argv.slice(2)]

    setupMaster({
        exec: args[0],
        args: args.slice(1),
    })
    let p = fork()
    p.on('message', data => {
        console.log('[RECEIVED]', data)
        switch (data) {
            case 'reset':
                p.process.kill()
                isRunning = false
                start.apply(this, arguments)
                break
            case 'uptime':
                p.send(process.uptime())
                break
        }
    })
    p.on('exit', (_, code) => {
        isRunning = false
        console.error('Errore inaspettato', code)
  
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
  
        if (code === 0) return
        watchFile(args[0], () => {
            unwatchFile(args[0])
            start(file)
        })
    })
    
    let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    if (!opts['test'])
        if (!rl.listenerCount()) rl.on('line', line => {
            p.emit('message', line.trim())
        })
}


// 🚀 SEQUENZA DI INIZIALIZZAZIONE CORRETTA
async function initializePhishySystem() {
    try {
        console.log('🎬 Avvio animazione Phishy...');

        // 1. Prima esegui l'animazione e aspetta che finisca
        await animatePhishy();

        console.log('\n🔄 Animazione completata! Inizializzazione sistema...\n');

        // 2. Solo dopo che l'animazione è finita, avvia il bot
        console.log('🤖 Avvio bot main.js...');
        start('main.js');

        console.log('✅ Sistema Phishy completamente inizializzato!');

    } catch (error) {
        console.error('❌ Errore durante l\'inizializzazione:', error);
    }
}

// 🎯 AVVIA IL SISTEMA NELL'ORDINE CORRETTO
initializePhishySystem()