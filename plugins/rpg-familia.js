import Database from '../lib/database.js'
const db = new Database('database.json')

// Mappa delle relazioni inverse
const getInverseRelationship = (rel) => {
    const inverseMap = {
        'mamma': 'figlio/a', 'papà': 'figlio/a', 'papá': 'figlio/a', 'papa': 'figlio/a',
        'figlio': 'genitore', 'figlia': 'genitore',
        'fratello': 'fratello/sorella', 'sorella': 'fratello/sorella',
        'step-fratello': 'step-fratello/sorella', 'step-sorella': 'step-fratello/sorella',
        'step-mamma': 'figlio/a', 'step-papà': 'figlio/a', 'step-papá': 'figlio/a', 'step-papa': 'figlio/a',
        'nipote': 'nonno/a/zio/zia', 'zia': 'nipote', 'zio': 'nipote',
        'nonno': 'nipote', 'nonna': 'nipote',
        'partner': 'partner', 'sposo': 'sposa', 'sposa': 'sposo',
    }
    return inverseMap[rel] || 'parente'
}

// Limiti per tipo di relazione
const relationshipLimits = {
    'mamma': 1, 'papà': 1, 'papá': 1, 'papa': 1,
    'step-mamma': 1, 'step-papà': 1, 'step-papá': 1, 'step-papa': 1,
    'figlio': 99, 'figlia': 99,
    'fratello': 3, 'sorella': 3,
    'step-fratello': 3, 'step-sorella': 3,
    'nipote': 3, 'zia': 3, 'zio': 3,
    'nonno': 2, 'nonna': 2,
    'partner': 1, 'sposo': 1, 'sposa': 1
}

// Lista relazioni valide
const validRelationships = [
    'mamma', 'papà', 'papá', 'papa',
    'step-mamma', 'step-papà', 'step-papá', 'step-papa',
    'figlio', 'figlia',
    'fratello', 'sorella',
    'step-fratello', 'step-sorella',
    'nipote', 'zia', 'zio',
    'nonno', 'nonna',
    'partner', 'sposo', 'sposa'
]

// Funzione per normalizzare il JID per consistenza tra plugin
function normalizeJid(jid) {
    if (!jid) return null
    // Assicurati che abbia il formato corretto (user@s.whatsapp.net)
    if (typeof jid === 'string' && jid.includes('@')) {
        // Rimuovi eventuali parti multiple come user@server@s.whatsapp.net
        return jid.replace(/^(.+)@.+@.+$/, '$1@s.whatsapp.net')
    }
    // Aggiungi il suffisso se manca
    return jid + '@s.whatsapp.net'
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    // Inizializzazione robusta di db.data e db.data.users
    if (!db.data) db.data = { users: {} }
    if (!db.data.users) db.data.users = {}

    // VISUALIZZAZIONE FAMIGLIA
    if ((command === 'famiglia' || command === 'mifamiglia' || command === 'myfamily') && !text.trim()) {
        try {
            let user = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
            // Normalizza il JID
            user = normalizeJid(user)
            console.log('famiglia - JID normalizzato:', user)
            
            if (!db.data.users[user]) db.data.users[user] = { family: {} }
            if (!db.data.users[user].family || typeof db.data.users[user].family !== 'object') db.data.users[user].family = {}
            
            // Costruzione messaggio partner con protezione
            let partnerMsg = ''
            try {
                if (db.data.users[user]?.partner) {
                    const partnerId = db.data.users[user].partner
                    let partnerName = 'Utente'
                    try {
                        partnerName = await conn.getName(partnerId)
                        if (typeof partnerName !== 'string') partnerName = String(partnerName || 'Utente')
                    } catch (e) {
                        console.log('Errore nel recuperare il nome del partner:', e)
                    }
                    partnerMsg = `• *sposo/a*: ${partnerName}\n`
                }
            } catch (e) {
                console.log('Errore nel gestire il partner:', e)
            }
            
            // Recupero nome utente con protezione
            let userName = 'Utente'
            try {
                userName = await conn.getName(user)
                if (typeof userName !== 'string') userName = String(userName || 'Utente')
            } catch (e) {
                console.log('Errore nel recuperare il nome utente:', e)
            }
            
            // Visualizzazione famiglia vuota
            if (Object.keys(db.data.users[user].family).length === 0) {
                return m.reply(`👪 *Famiglia di* ${userName}\n\n${partnerMsg}Nessuna relazione familiare registrata.\nUsa */famiglia <relazione> @utente* per aggiungere membri.`)
            }
            
            // Costruzione lista membri con protezione
            let familyList = `👪 *Famiglia di* ${userName} *[${Object.keys(db.data.users[user].family).length} membri]*\n\n`
            familyList += partnerMsg
            
            for (const [memberId, relationship] of Object.entries(db.data.users[user].family)) {
                try {
                    // Verifica struttura relationship
                    if (!relationship || typeof relationship !== 'object') continue
                    
                    // Visualizza la relazione in base alla nuova struttura { type, jid }
                    const relType = relationship.type
                    if (!relType || relType === 'partner' || relType === 'sposo' || relType === 'sposa') continue
                    
                    // Recupera nome con protezione
                    let memberName = 'Utente'
                    try {
                        console.log('Recupero nome per:', memberId)
                        memberName = await conn.getName(memberId)
                        console.log('Nome recuperato:', memberName)
                        
                        // Assicurati che sia una stringa
                        if (typeof memberName !== 'string') {
                            console.log('Nome non è stringa, conversione da:', typeof memberName)
                            memberName = String(memberName || 'Utente')
                        }
                    } catch (e) {
                        console.log('Errore nel recuperare il nome membro:', e)
                    }
                    
                    console.log(`Aggiunta alla lista: • *${relType}*: ${memberName}`)
                    familyList += `• *${relType}*: ${memberName}\n`
                } catch (e) {
                    console.log('Errore nel processare membro famiglia:', e)
                }
            }
            
            familyList += `\nℹ️ *Comandi utili:*\n▢ */famiglia <relazione> @utente* - Aggiungi\n▢ */rimuovifamiglia @utente* - Rimuovi`
            
            // Invio messaggio con protezione
            return conn.sendMessage(m.chat, {
                text: familyList,
                mentions: Object.keys(db.data.users[user].family).concat(db.data.users[user]?.partner ? [db.data.users[user].partner] : [])
            }, { quoted: m })
        } catch (e) {
            console.error('Errore visualizzazione famiglia:', e)
            return m.reply('❌ Errore nel visualizzare la famiglia: ' + e.message)
        }
    }

    // RIMOZIONE RELAZIONE
    if (command === 'rimuovifamiglia' || command === 'removefamily') {
        try {
            const who = m.mentionedJid?.[0] || m.quoted?.sender
            if (!who) return m.reply(`❌ Devi menzionare o rispondere a un utente\nEsempio: ${usedPrefix}rimuovifamiglia @utente`)
            // Normalizza i JID
            const user1 = normalizeJid(m.sender)
            const user2 = normalizeJid(who)
            console.log('rimuovifamiglia - JIDs normalizzati:', user1, user2)
            if (!db.data.users[user1]) db.data.users[user1] = { family: {} }
            if (!db.data.users[user2]) db.data.users[user2] = { family: {} }
            if (!db.data.users[user1].family || typeof db.data.users[user1].family !== 'object') db.data.users[user1].family = {}
            if (!db.data.users[user2].family || typeof db.data.users[user2].family !== 'object') db.data.users[user2].family = {}
            if (!db.data.users[user1]?.family?.[user2] && !db.data.users[user2]?.family?.[user1]) {
                return m.reply('❌ Nessuna relazione familiare trovata tra voi due.')
            }
            
            // Supporta la nuova struttura oggetto con protezione
            let relationType = 'relazione'
            try {
                const type1 = db.data.users[user1].family[user2]?.type
                const type2 = db.data.users[user2].family[user1]?.type
                relationType = type1 || getInverseRelationship(type2) || 'relazione'
            } catch (e) {
                console.log('Errore nel recuperare il tipo di relazione:', e)
            }
            
            // Rimozione
            delete db.data.users[user1].family[user2]
            delete db.data.users[user2].family[user1]
            
            // Salvataggio
            if (typeof db.write === 'function') await db.write()
            else if (typeof db.save === 'function') await db.save()
            
            // Recupero nomi con protezione
            let name1 = 'Utente1', name2 = 'Utente2'
            try {
                name1 = await conn.getName(user1)
                if (typeof name1 !== 'string') name1 = String(name1 || 'Utente1')
            } catch (e) {
                console.log('Errore nel recuperare il nome utente1:', e)
            }
            
            try {
                name2 = await conn.getName(user2)
                if (typeof name2 !== 'string') name2 = String(name2 || 'Utente2')
            } catch (e) {
                console.log('Errore nel recuperare il nome utente2:', e)
            }
            
            return m.reply(`✅ Relazione *${relationType}* rimossa con successo tra ${name1} e ${name2}`)
        } catch (e) {
            console.error('Errore rimozione relazione:', e)
            return m.reply('❌ Errore nella rimozione della relazione')
        }
    }

    // CREAZIONE RELAZIONE
    try {
        const who = m.mentionedJid?.[0] || m.quoted?.sender
        if (!who) return m.reply(`❌ Devi menzionare o rispondere a un utente\nEsempio: ${usedPrefix}famiglia mamma @utente`)
        const relationshipType = text.toLowerCase().split(' ')[0]
        if (!validRelationships.includes(relationshipType)) {
            return m.reply(`❌ Relazione non valida. Scegli tra:\n${validRelationships.map(r => `▢ ${r}`).join('\n')}`)
        }
        // Normalizza i JID
        const user1 = normalizeJid(m.sender)
        const user2 = normalizeJid(who)
        console.log('creazione famiglia - JIDs normalizzati:', user1, user2)
        if (user1 === user2) return m.reply('❌ Non puoi creare una relazione con te stesso!')
        if (!db.data.users[user1]) db.data.users[user1] = { family: {} }
        if (!db.data.users[user2]) db.data.users[user2] = { family: {} }
        if (!db.data.users[user1].family || typeof db.data.users[user1].family !== 'object') db.data.users[user1].family = {}
        if (!db.data.users[user2].family || typeof db.data.users[user2].family !== 'object') db.data.users[user2].family = {}
        // Limiti per tipo di relazione
        const countRel = (user, rels) => Object.values(db.data.users[user].family).filter(obj => obj?.type && rels.includes(obj.type)).length
        if (["partner","sposo","sposa"].includes(relationshipType)) {
            if (db.data.users[user1].partner || db.data.users[user2].partner) {
                return m.reply('❌ Uno dei due ha già un partner!')
            }
            db.data.users[user1].partner = user2
            db.data.users[user2].partner = user1
            db.data.users[user1].family[user2] = { type: relationshipType, jid: user2 }
            db.data.users[user2].family[user1] = { type: getInverseRelationship(relationshipType), jid: user1 }
        } else {
            const relsToCheck = [relationshipType]
            if (['mamma','papà','papá','papa'].includes(relationshipType)) relsToCheck.push('mamma','papà','papá','papa')
            if (['step-mamma','step-papà','step-papá','step-papa'].includes(relationshipType)) relsToCheck.push('step-mamma','step-papà','step-papá','step-papa')
            if (['fratello','sorella'].includes(relationshipType)) relsToCheck.push('fratello','sorella')
            if (['step-fratello','step-sorella'].includes(relationshipType)) relsToCheck.push('step-fratello','step-sorella')
            if (['zia','zio'].includes(relationshipType)) relsToCheck.push('zia','zio')
            if (['nonno','nonna'].includes(relationshipType)) relsToCheck.push('nonno','nonna')
            if (countRel(user1, relsToCheck) >= (relationshipLimits[relationshipType] || 99)) {
                return m.reply(`❌ Hai già raggiunto il limite per questo tipo di relazione!`)
            }
            if (db.data.users[user1].family[user2] || db.data.users[user2].family[user1]) {
                return m.reply(`❌ Esiste già una relazione tra voi due! Usa */rimuovifamiglia @utente* per eliminarla.`)
            }
            db.data.users[user1].family[user2] = { type: relationshipType, jid: user2 }
            db.data.users[user2].family[user1] = { type: getInverseRelationship(relationshipType), jid: user1 }
        }
        // Debug: mostra la struttura family PRIMA del salvataggio
        try {
            console.log('FAMILY user1 prima del salvataggio:', JSON.stringify(db.data.users[user1].family))
            console.log('FAMILY user2 prima del salvataggio:', JSON.stringify(db.data.users[user2].family))
        } catch (e) {
            console.log('Errore log family:', e)
        }
        
        let saveSuccess = false
        try {
            if (typeof db.write === 'function') { await db.write(); saveSuccess = true }
            else if (typeof db.save === 'function') { await db.save(); saveSuccess = true }
        } catch (err) {
            console.error('Errore durante il salvataggio del database:', err)
        }
        
        // Debug: mostra la struttura family DOPO il salvataggio
        try {
            console.log('FAMILY user1 dopo il salvataggio:', JSON.stringify(db.data.users[user1].family))
            console.log('FAMILY user2 dopo il salvataggio:', JSON.stringify(db.data.users[user2].family))
        } catch (e) {
            console.log('Errore log family dopo salvataggio:', e)
        }
        
        if (!saveSuccess) return m.reply('❌ Errore: il database non è stato salvato correttamente!')
        
        // Preleva i nomi con await e fallback stringa
        let name1 = '', name2 = '', relType = '', relTypeStr = ''
        try {
            name1 = await conn.getName(user1)
            name1 = typeof name1 === 'string' ? name1 : String(name1 || 'Utente')
        } catch (e) {
            name1 = 'Utente'
        }
        
        try {
            name2 = await conn.getName(user2)
            name2 = typeof name2 === 'string' ? name2 : String(name2 || 'Utente')
        } catch (e) {
            name2 = 'Utente'
        }
        
        try {
            relType = db.data.users[user2]?.family?.[user1]?.type || ''
            relTypeStr = typeof relType === 'string' ? relType : String(relType || '')
        } catch (e) {
            relTypeStr = ''
        }
        
        const relTypeStrSafe = typeof relationshipType === 'string' ? relationshipType : String(relationshipType || '')
        
        return m.reply(`✅ *Relazione creata con successo!*\n\n${name1} è ora *${relTypeStrSafe}* di ${name2}\n${name2} è ora *${relTypeStr}* di ${name1}`)
    } catch (e) {
        console.error('Errore creazione relazione:', e)
        return m.reply('❌ Errore nella creazione della relazione')
    }
}

handler.help = [
    'famiglia <relazione> @utente',
    'famiglia (visualizza la tua famiglia)',
    'rimuovifamiglia @utente'
]
handler.tags = ['fun', 'rpg']
handler.command = /^(famiglia|family|mifamiglia|myfamily|rimuovifamiglia|removefamily)$/i

export default handler