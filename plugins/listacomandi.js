let handler = async (m, { conn }) => {
    const listaComandi = `
📜 *Lista completa dei comandi*:
👥 *Comandi per tutti*: ".gruppo"
🛡️ *Comandi per admin*: ".admin"
👑 *Comandi per l'owner*: ".owner"
🎲 *Giochi di ruolo*: ".rpg"
🎵 *Audio di phishy*: ".audio"
✨ *Effetti audio*: ".effetti"
💬 *Risposte di phishy*: ".risposta"
⚙️ *Impostazioni*: ".impostazioni"
`.trim();

    const menuImage = 'https://th.bing.com/th/id/OIP.vQ2tzt2wjroqtFZ9t3LpywHaHa?cb=iwc2&rs=1&pid=ImgDetMain';

    return conn.sendMessage(m.chat, {
        text: listaComandi,
        contextInfo: {
            externalAdReply: {
                title: `Phishy Bot - Lista Comandi`,
                body: `Clicca qui per unirti al nostro canale!`,
                thumbnailUrl: menuImage,
                sourceUrl: 'https://t.me/PhishyBotChannel',
                mediaType: 1,
                renderLargerThumbnail: false,
                
            },
             mentionedJid: conn.parseMention(wm),
            forwardingScore: 1,
            isForwarded: true,
            
             forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401234816773@newsletter',
                serverMessageId: '',
                newsletterName: 'aggiornamenti 🎌 '
            }

        }
    });
};

handler.help = ['listacomandi'];
handler.tags = ['info'];
handler.command = ['listacomandi'];

export default handler;
