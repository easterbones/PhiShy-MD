// install.js
// Modifica la variabile customCommand per eseguire qualsiasi comando desiderato

import { execSync } from 'child_process';

// Modifica qui il comando da eseguire
let customCommand = 'node index.js';

function runCustomCommand() {
  try {
    console.log('Esecuzione comando custom:');
    const output = execSync(customCommand, { stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error('Errore durante l\'esecuzione del comando:', error.message);
  }
}

// Esempio di utilizzo:
// runCustomCommand();

export { runCustomCommand, customCommand };
