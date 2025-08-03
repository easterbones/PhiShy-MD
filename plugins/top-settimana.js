// Plugin: top-settimana.js
// Mostra la classifica dei messaggi settimanali degli utenti
// Comando: .topsettimana

import fs from 'fs'

const handler = async (m, { conn }) => {
    const users = global.db.data.users || {}
    // Crea array [userId, messaggi_settimanali]
    const classifica = Object.entries(users)
        .filter(([_, u]) => typeof u.messaggi_settimanali === 'number')
        .sort((a, b) => b[1].messaggi_settimanali - a[1].messaggi_settimanali)
        .slice(0, 10)

    if (classifica.length === 0) {
        return conn.sendMessage(m.chat, { text: 'Nessun dato disponibile per la classifica settimanale.' }, { quoted: m })
    }

    let testo = '*🏆 TOP 10 Messaggi Settimanali 🏆*\n\n'
    classifica.forEach(([userId, u], i) => {
        testo += `${i + 1}. @${userId.split('@')[0]} — ${u.messaggi_settimanali} messaggi\n`
    })

    return conn.sendMessage(m.chat, {
        text: testo,
        mentions: classifica.map(([userId]) => userId)
    }, { quoted: m })
}

handler.help = ['topsettimana']
handler.tags = ['info']
handler.command = /^topsettimana$/i
handler.group = true
handler.admin = true

export default handler
