import {resolve, dirname as _dirname} from 'path'; 
 import _fs, {existsSync, readFileSync} from 'fs'; 
 const {promises: fs} = _fs; 
  
 class Database { 
   /** 
      * Create new Database 
      * @param {String} filepath Path to specified json database 
      * @param  {...any} args JSON.stringify arguments 
      */ 
   constructor(filepath, ...args) { 
     this.file = resolve(filepath); 
     this.logger = console; 
  
     this._load(); 
  
     this._jsonargs = args; 
     this._state = false; 
     this._queue = []; 
     this._interval = setInterval(async () => { 
       if (!this._state && this._queue && this._queue[0]) { 
         this._state = true; 
         await this[this._queue.shift()]().catch(this.logger.error); 
         this._state = false; 
       } 
     }, 1000); 
   } 
  
   get data() { 
     return this._data; 
   } 
  
   set data(value) { 
     this._data = value; 
     this.save(); 
   } 
  
   /** 
      * Queue Load 
      */ 
   load() { 
     this._queue.push('_load'); 
   } 
  
   /** 
      * Queue Save 
      */ 
   save() { 
     this._queue.push('_save'); 
   } 
  
   _load() { 
     try { 
       // Tenta di caricare il file
       if (existsSync(this.file)) {
         const content = readFileSync(this.file, 'utf8');
         
         // Verifica se il file è un JSON valido
         try {
           return this._data = JSON.parse(content);
         } catch (jsonError) {
           // Se c'è un errore di parsing, cerca di ripristinare da un backup
           this.logger.error('Errore nel parsing JSON:', jsonError);
           
           // Cerca backup
           const backupDir = _dirname(this.file) + '/backup';
           if (existsSync(backupDir)) {
             const backups = _fs.readdirSync(backupDir).filter(file => file.startsWith('database')).sort().reverse();
             if (backups.length > 0) {
               const latestBackup = backupDir + '/' + backups[0];
               this.logger.warn(`Tentativo di ripristino dal backup: ${latestBackup}`);
               const backupContent = readFileSync(latestBackup, 'utf8');
               return this._data = JSON.parse(backupContent);
             }
           }
           
           // Se non ci sono backup o fallisce il ripristino, inizia con un DB vuoto
           return this._data = {};
         }
       } else {
         return this._data = {}; 
       }
     } catch (e) { 
       this.logger.error('Errore critico nel caricamento del database:', e); 
       return this._data = {}; 
     } 
   } 
  
   async _save() { 
     try {
       // Crea directory se non esiste
       const dirname = _dirname(this.file); 
       if (!existsSync(dirname)) await fs.mkdir(dirname, {recursive: true});
       
       // Backup prima di salvare
       if (existsSync(this.file)) {
         const backupDir = dirname + '/backup';
         if (!existsSync(backupDir)) await fs.mkdir(backupDir, {recursive: true});
         
         // Crea nome file con timestamp
         const now = new Date();
         const timestamp = now.toISOString().replace(/[:.]/g, '-');
         const backupFile = `${backupDir}/database_${timestamp}.json`;
         
         // Copia file attuale come backup
         await fs.copyFile(this.file, backupFile);
         
         // Limita il numero di backup a 10
         const backups = (await fs.readdir(backupDir)).filter(file => file.startsWith('database')).sort();
         if (backups.length > 10) {
           for (let i = 0; i < backups.length - 10; i++) {
             await fs.unlink(`${backupDir}/${backups[i]}`);
           }
         }
       }
       
       // Salva il file principale
       await fs.writeFile(this.file, JSON.stringify(this._data, ...this._jsonargs));
       return this.file;
     } catch (e) {
       this.logger.error('Errore nel salvataggio del database:', e);
       throw e; // Rilancia l'errore per gestirlo nel chiamante
     }
   } 
 } 
  
 export default Database;