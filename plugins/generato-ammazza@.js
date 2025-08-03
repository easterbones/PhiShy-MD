// Importa i moduli necessari da Baileys
import MessageType from '@whiskeysockets/baileys';

// Definizione del comando ammazza@
const handler = async (m) => {
    try {
        // Verifica se il messaggio inizia con "ammazza@"
        if (!m.text.startsWith('ammazza@')) {
            return;
        }

        // Estrazione del messaggio da ammazzare
        const targetMessage = m.text.split(' ').slice(1).join(' ');

        // Controlla se è stato fornito un messaggio
        if (!targetMessage) {
            throw new Error('Devi fornire un messaggio da ammazzare!');
        }

        // Simula l'ammazzamento del messaggio
        const responseMessage = `✝️ *Messaggio ammazzato:* "${targetMessage}" ✝️`;
        
        // Invia il messaggio di risposta
        await m.reply(responseMessage, {
            type: MessageType.text,
        });
    } catch (error) {
        // Gestione degli errori
        console.error('Errore nel comando ammazza@:', error);
        await m.reply('⚠️ Si è verificato un errore: ' + error.message);
    }
};

// Aggiunta di aiuto e informazioni sul comando
handler.help = ['ammazza@ <messaggio>'];
handler.tags = ['fun'];
handler.command = /^ammazza$/i;

// Esportazione del gestore come predefinito
export default handler;