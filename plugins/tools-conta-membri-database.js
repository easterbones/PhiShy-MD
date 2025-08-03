import fs from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  // 1. Percorsi dei file da controllare
  const mainDbPath = path.join(process.cwd(), 'database.json');
  const backupDir = path.join(process.cwd(), 'backup');
  const backupFiles = Array.from({length: 9}, (_, i) => 
    path.join(backupDir, `database${i+1}.json`));

  // Aggiungi il database principale alla lista dei file da controllare
  const allDbFiles = [mainDbPath, ...backupFiles];
  
  const uniqueUsers = new Set(); // Usiamo un Set per garantire l'unicità
  const results = [];

  try {
    for (const dbPath of allDbFiles) {
      let fileUsers = 0;
      try {
        // Verifica se il file esiste
        if (!fs.existsSync(dbPath)) {
          results.push(`File non trovato: ${path.basename(dbPath)}`);
          continue;
        }

        // Leggi il file
        const rawData = fs.readFileSync(dbPath, 'utf-8');
        const database = JSON.parse(rawData);

        // Controlla se esiste la voce "users"
        if (!database.users) {
          results.push(`Voce "users" non trovata in ${path.basename(dbPath)}`);
          continue;
        }

        // Conta gli utenti univoci
        const usersInFile = Object.keys(database.users);
        fileUsers = usersInFile.length;
        
        // Aggiungi al Set (automaticamente filtra duplicati)
        usersInFile.forEach(user => uniqueUsers.add(user));
        
        results.push(`📁 ${path.basename(dbPath)}: ${fileUsers} utenti (${usersInFile.length - new Set(usersInFile).size} duplicati nel file)`);

      } catch (error) {
        results.push(`❌ Errore in ${path.basename(dbPath)}: ${error.message}`);
      }
    }

    // Costruisci il messaggio di risposta
    let replyMessage = `📊 *Utenti univoci totali:* ${uniqueUsers.size}\n`;
    replyMessage += `🔍 Analizzati ${allDbFiles.length} files\n\n`;
    replyMessage += results.join('\n');

    await m.reply(replyMessage);

  } catch (error) {
    console.error('Errore generale:', error);
    await m.reply('❌ Errore nel processare i database');
  }
};

// Comando
handler.command = /^(contautenti|countusers)$/i;
handler.tags = ['database'];
handler.help = ['contautenti - Conta gli utenti univoci registrati nei database principali e di backup'];

export default handler;