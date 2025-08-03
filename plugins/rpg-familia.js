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

let handler = async (m, { conn, text, command, usedPrefix }) => {
    // Inizializzazione robusta di db.data e db.data.users
    if (!db.data) db.data = { users: {} }
    if (!db.data.users) db.data.users = {}

    // VISUALIZZAZIONE FAMIGLIA
    if ((command === 'famiglia' || command === 'mifamiglia' || command === 'myfamily') && !text.trim()) {
        try {
            const user = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
            if (!db.data.users[user]) db.data.users[user] = { family: {} }
            if (!db.data.users[user].family || typeof db.data.users[user].family !== 'object') db.data.users[user].family = {}
            let partnerMsg = ''
            if (db.data.users[user]?.partner) {
                const partnerId = db.data.users[user].partner
                const partnerName = await conn.getName(partnerId)
                partnerMsg = `• *sposo/a*: ${partnerName}\n`
            }
            if (Object.keys(db.data.users[user].family).length === 0) {
                return m.reply(`👪 *Famiglia di* ${conn.getName(user)}\n\n${partnerMsg}Nessuna relazione familiare registrata.\nUsa */famiglia <relazione> @utente* per aggiungere membri.`)
            }
            let familyList = `👪 *Famiglia di* ${conn.getName(user)} *[${Object.keys(db.data.users[user].family).length} membri]*\n\n`
            familyList += partnerMsg
            for (const [memberId, relationship] of Object.entries(db.data.users[user].family)) {
                // Visualizza la relazione in base alla nuova struttura { type, jid }
                if (relationship.type === 'partner' || relationship.type === 'sposo' || relationship.type === 'sposa') continue
                familyList += `• *${relationship.type}*: ${await conn.getName(memberId)}\n`
            }
            familyList += `\nℹ️ *Comandi utili:*\n▢ */famiglia <relazione> @utente* - Aggiungi\n▢ */rimuovifamiglia @utente* - Rimuovi`
            return conn.sendMessage(m.chat, {
                text: familyList,
                mentions: Object.keys(db.data.users[user].family).concat(db.data.users[user]?.partner ? [db.data.users[user].partner] : [])
            }, { quoted: m })
        } catch (e) {
            console.error('Errore visualizzazione famiglia:', e)
            return m.reply('❌ Errore nel visualizzare la famiglia')
        }
    }

    // RIMOZIONE RELAZIONE
    if (command === 'rimuovifamiglia' || command === 'removefamily') {
        try {
            const who = m.mentionedJid?.[0] || m.quoted?.sender
            if (!who) return m.reply(`❌ Devi menzionare o rispondere a un utente\nEsempio: ${usedPrefix}rimuovifamiglia @utente`)
            const user1 = m.sender
            const user2 = who
            if (!db.data.users[user1]) db.data.users[user1] = { family: {} }
            if (!db.data.users[user2]) db.data.users[user2] = { family: {} }
            if (!db.data.users[user1].family || typeof db.data.users[user1].family !== 'object') db.data.users[user1].family = {}
            if (!db.data.users[user2].family || typeof db.data.users[user2].family !== 'object') db.data.users[user2].family = {}
            if (!db.data.users[user1]?.family?.[user2] && !db.data.users[user2]?.family?.[user1]) {
                return m.reply('❌ Nessuna relazione familiare trovata tra voi due.')
            }
            // Supporta la nuova struttura oggetto
            const relationType = db.data.users[user1].family[user2]?.type || getInverseRelationship(db.data.users[user2].family[user1]?.type)
            delete db.data.users[user1].family[user2]
            delete db.data.users[user2].family[user1]
            if (typeof db.write === 'function') await db.write()
            else if (typeof db.save === 'function') await db.save()
            return m.reply(`✅ Relazione *${relationType}* rimossa con successo tra ${await conn.getName(user1)} e ${await conn.getName(user2)}`)
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
        const user1 = m.sender
        const user2 = who
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
        console.log('FAMILY user1 prima del salvataggio:', db.data.users[user1].family)
        console.log('FAMILY user2 prima del salvataggio:', db.data.users[user2].family)
        let saveSuccess = false
        try {
            if (typeof db.write === 'function') { await db.write(); saveSuccess = true }
            else if (typeof db.save === 'function') { await db.save(); saveSuccess = true }
        } catch (err) {
            console.error('Errore durante il salvataggio del database:', err)
        }
        // Debug: mostra la struttura family DOPO il salvataggio
        console.log('FAMILY user1 dopo il salvataggio:', db.data.users[user1].family)
        console.log('FAMILY user2 dopo il salvataggio:', db.data.users[user2].family)
        if (!saveSuccess) return m.reply('❌ Errore: il database non è stato salvato correttamente!')
        return m.reply(`✅ *Relazione creata con successo!*\n\n${await conn.getName(user1)} è ora *${relationshipType}* di ${await conn.getName(user2)}\n${await conn.getName(user2)} è ora *${db.data.users[user2].family[user1]?.type}* di ${await conn.getName(user1)}`)
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