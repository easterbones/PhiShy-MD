import { jidNormalizedUser } from '@whiskeysockets/baileys';

/**
 * ##################################################################################
 * #                                  CONFIGURAZIONE                                #
 * ##################################################################################
 *
 * Inserisci qui i numeri di telefono che sono autorizzati a essere amministratori.
 * È FONDAMENTALE che tu inserisca il numero del PROPRIETARIO del bot.
 * I numeri devono essere in formato JID (es: '391234567890@s.whatsapp.net').
 */
const OWNER_NUMBER = '393534409026@s.whatsapp.net'; // <-- CAMBIA QUESTO! Inserisci il tuo numero.
const AUTHORIZED_ADMINS = [
    OWNER_NUMBER,
    // Aggiungi qui altri numeri di admin fidati, se necessario.
    // '391112223334@s.whatsapp.net',
];

/**
 * Controlla se una promozione è autorizzata ed esegue la procedura di sicurezza se non lo è.
 * @param {import('@whiskeysockets/baileys').WASocket} sock L'istanza della socket Baileys.
 * @param {object} update L'oggetto dell'evento, contiene { id, participants, action, actor }.
 * @returns {Promise<boolean>} Ritorna `true` se l'evento è stato gestito e la procedura antiruba è stata attivata, altrimenti `false`.
 */
async function checkPromotion(sock, update) {
    const { id: groupId, participants, action, actor } = update;
    
    // Log di debug per vedere tutti i parametri dell'update
    console.log(`[Antiruba DEBUG] Evento ricevuto:`, {
        action, 
        groupId, 
        participants, 
        actor,
        ownerNumber: OWNER_NUMBER
    });

    // Agiamo solo in caso di promozione ('promote')
    if (action !== 'promote') {
        return false; // Non è una promozione, non facciamo nulla.
    }

    // Ottieni l'utente che è stato promosso
    const promotedUserJid = participants[0];
    
    // IMPORTANTE: Verifica se l'owner sta promuovendo qualcuno
    // Controlla se l'attore è l'owner usando confronto di numero
    const actorNumber = actor ? actor.split('@')[0].replace(/[^0-9]/g, '') : '';
    const ownerNumber = OWNER_NUMBER.split('@')[0].replace(/[^0-9]/g, '');
    
    console.log(`[Antiruba DEBUG] Confronto attore: ${actorNumber} con owner: ${ownerNumber}`);
    
    if (actorNumber && actorNumber === ownerNumber) {
        console.log(`[Antiruba] Promozione effettuata dall'owner (${actor}), nessuna azione necessaria.`);
        return false;
    }
    
    // IMPORTANTE: Verifica se questa è una promozione fatta dal bot stesso
    if (actor && actor.includes(sock.user.id.split(':')[0])) {
        console.log(`[Antiruba] Promozione effettuata dal bot stesso, nessuna azione necessaria.`);
        return false;
    }

    // Controlliamo se l'utente promosso è nella lista degli autorizzati
    const isAuthorized = AUTHORIZED_ADMINS.includes(jidNormalizedUser(promotedUserJid));

    // Se l'utente è autorizzato, non facciamo nulla e ritorniamo false per far continuare la normale esecuzione.
    if (isAuthorized) {
        console.log(`[Antiruba] Promozione autorizzata di ${promotedUserJid} nel gruppo ${groupId}.`);
        return false;
    }

    // --- SE ARRIVIAMO QUI, È STATA RILEVATA UNA PROMOZIONE NON AUTORIZZATA ---
    console.warn(`[Antiruba] RILEVATA PROMOZIONE NON AUTORIZZATA di ${promotedUserJid} nel gruppo ${groupId}! Avvio procedura di sicurezza.`);

    try {
        // Messaggio di avviso nel gruppo
        await sock.sendMessage(groupId, {
            text: `🚨 *Rilevata promozione non autorizzata* 🚨\n\nVerrà retrocesso solo l'utente @${promotedUserJid.split('@')[0]} promosso senza autorizzazione.`,
            mentions: [promotedUserJid]
        });

        // In questo caso, demoteremo SOLO l'utente appena promosso senza autorizzazione
        // NON rimuoviamo tutti gli admin del gruppo
        const participantsToDemote = [promotedUserJid];
        
        console.log(`[Antiruba] Retrocessione dell'utente ${promotedUserJid} nel gruppo ${groupId}.`);
        
        try {
            // Retrocedi solo l'utente appena promosso senza autorizzazione
            await sock.groupParticipantsUpdate(groupId, participantsToDemote, 'demote');
            
            // Invia conferma di procedura completata
            await sock.sendMessage(groupId, {
                text: `✅ *Procedura di Sicurezza Completata* \nL'utente @${promotedUserJid.split('@')[0]} è stato retrocesso.`,
                mentions: [promotedUserJid]
            });
            
            // Invia log dettagliato all'owner
            await sock.sendMessage(OWNER_NUMBER, {
                text: `✅ *Antiruba: Procedura Completata* ✅\n\nGruppo: ${groupId}\nUtente retrocesso: @${promotedUserJid.split('@')[0]}`,
                mentions: [promotedUserJid]
            });
            
            console.log(`[Antiruba] Procedura completata con successo nel gruppo ${groupId}`);
        } catch (demoterError) {
            console.error(`[Antiruba] Errore durante la retrocessione:`, demoterError);
            // Notifica errore
            await sock.sendMessage(groupId, {
                text: `⚠️ *Errore durante la procedura di sicurezza*\nNon è stato possibile retrocedere l'utente.`
            });
            
            await sock.sendMessage(OWNER_NUMBER, {
                text: `⚠️ *ERRORE NELLA RETROCESSIONE*\n\nGruppo: ${groupId}\nUtente: @${promotedUserJid.split('@')[0]}\nErrore: ${demoterError.message}`,
                mentions: [promotedUserJid]
            });
        }
        
        // Ritorniamo true per indicare a handler.js di fermarsi qui.
        return true;
    } catch (error) {
        console.error(`[Antiruba] Errore durante l'esecuzione della procedura di sicurezza:`, error);
        await sock.sendMessage(OWNER_NUMBER, {
            text: `❌ *ERRORE CRITICO NEL PLUGIN ANTIRUBA* ❌\n\nNon è stato possibile completare la procedura di sicurezza nel gruppo ${groupId}.\n\nErrore: ${error.message}`
        });
        // Anche in caso di errore, indichiamo che abbiamo tentato di gestire l'evento.
        return true;
    }
}

// Esportiamo la funzione per poterla usare nel file principale del bot
export default checkPromotion;
