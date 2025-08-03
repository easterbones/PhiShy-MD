import axios from 'axios';
import { textpro } from '../lib/textpro.js';

const handler = async (m, { conn, args }) => {
    const testo = args.join` `;
    if (!testo) return conn.reply(m.chat, 'Per favore inserisci del testo!', m);
    if (testo.length > 15) return conn.reply(m.chat, 'Il testo può contenere al massimo 15 caratteri!', m);
    
    try {
        const url = await textpro("https://textpro.me/create-a-mystical-neon-blackpink-logo-text-effect-1180.html", testo);
        const buffer = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: { 'user-agent': 'GoogleBot' }
        });
        
        await conn.reply(m.chat, 'Ecco la tua immagine, attendi un momento...', m);
        await conn.sendFile(m.chat, buffer.data, 'blackpink.png', 'Ecco il tuo logo BlackPink neon!', m);
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, 'Si è verificato un errore durante la creazione del logo.', m);
    }
};

handler.help = ['blackpink <testo>'];
handler.tags = ['textpro'];
handler.command = /^blackpink$/i;

export default handler;