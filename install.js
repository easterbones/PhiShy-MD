import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Inizio installazione forzata con legacy-peer-deps...');

// Se non esiste package.json lo inizializza
if (!fs.existsSync('./package.json')) {
  console.log('📦 Nessun package.json trovato, creo un nuovo progetto npm...');
  execSync('npm init -y', { stdio: 'inherit' });
}

// Lista delle dipendenze principali
const dependencies = [
  '@whiskeysockets/baileys@6.7.18',
  'sharp@0.32.6',
  'axios',
  'chalk',
  'moment',
  'node-fetch',
  'pino',
  'qrcode-terminal',
  'awesome-phonenumber',
  'typescript',
  'ts-node',
  // Aggiungi qui altre dipendenze che usi nel tuo bot
];

// Comando completo di installazione forzata
const installCommand = `npm install ${dependencies.join(' ')} --legacy-peer-deps`;

console.log(`📦 Installazione: ${installCommand}`);
try {
  execSync(installCommand, { stdio: 'inherit' });
  console.log('✅ Tutte le dipendenze installate con successo!');
} catch (error) {
  console.error('❌ Errore durante l\'installazione delle dipendenze:', error.message);
}
