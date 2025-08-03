import db from '../lib/database.js';

const handler = async (m) => {
    let triggerWords = {
        'follia': '_Ti ho mai detto qual è la definizione di follia, sì? Follia è fare e rifare la stessa cazzo di cosa, ancora e poi ancora, sperando che qualcosa cambi_'
    };

    let text = m.text.toLowerCase();
    if (text === 'follia') {
        m.reply(triggerWords['follia']);
    }
};

handler.customPrefix = /^follia/i;
handler.command = new RegExp;
handler.priority = 10;

export default handler;