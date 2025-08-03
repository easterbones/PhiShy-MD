import fs from 'fs';
import path from 'path';

// Percorso assoluto al file database.json
const dbPath = path.resolve('./database.json');

// Leggi il database
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const handler = async (m, { conn, args }) => {
    if (args.length < 1) return m.reply('Uso corretto: .modificareg <true/false>');
    
    let valore = args[0].toLowerCase();
    if (valore !== 'true' && valore !== 'false') return m.reply('Errore: Il valore deve essere true o false.');
    
    let valoreBooleano = valore === 'true';
    
    // Modifica il parametro per tutti gli utenti
    Object.keys(db.users).forEach(utente => {
        db.users[utente].registered = valoreBooleano;
    });
    
    // Salva le modifiche nel file
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    return m.reply(`Parametro 'registered' modificato in '${valoreBooleano}' per tutti gli utenti.`);
};

handler.command = ['modificareg'];
export default handler;