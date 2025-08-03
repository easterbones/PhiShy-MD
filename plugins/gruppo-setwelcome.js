let handler = async (m, { conn, text, isROwner, isOwner }) => {
    if (text) {
        global.db.data.chats[m.chat].sWelcome = text
        conn.sendMessage(m.chat, {
            text: `✨ *Benvenuto impostato con successo!* ✨\n\nIl messaggio di benvenuto è stato configurato correttamente per questo gruppo.`,
            contextInfo: {
                externalAdReply: {
                    title: "Benvenuto Personalizzato",
                    body: "Configurazione Gruppo",
                    thumbnailUrl: "https://i.ibb.co/DDhrGZWK/modifiche-apportate.webp", // Sostituisci con un'immagine pertinente
                    sourceUrl: "https://0.0.0.0",
                    mediaType: 1,
                   renderLargerThumbnail: false
                }
            }
        }, { quoted: m })
    } else {
        const usage = `📌 *Come usare il comando setwelcome:*\n\nScrivi il messaggio di benvenuto includendo queste variabili:\n\n• *@user* - Menzione del nuovo membro\n• *@group* - Nome del gruppo\n• *@desc* - Descrizione del gruppo\n\nEsempio:\n> setwelcome Benvenuto @user nel gruppo @group! (@desc)`
        conn.sendMessage(m.chat, { 
            text: usage,
            contextInfo: {
                externalAdReply: {
                    title: "𝙁𝙤𝙧𝙢𝙖𝙩𝙤 𝙧𝙞𝙘𝙝𝙞𝙚𝙨𝙩𝙤",
                    body: "𝙣𝙚𝙨𝙨𝙪𝙣 𝙢𝙚𝙨𝙨𝙖𝙜𝙜𝙞𝙤",
                    thumbnailUrl: "https://www.pockettactics.com/wp-content/sites/pockettactics/2022/12/whatsapp-not-working-550x309.jpg",
                     renderLargerThumbnail: false,
                    sourceUrl: "",
                    mediaType: 1
                }
            }
        }, { quoted: m })
    }
}

handler.help = ['setwelcome <testo>']
handler.tags = ['group']
handler.command = ['setwelcome'] 
handler.admin = true
export default handler