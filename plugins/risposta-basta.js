import db from '../lib/database.js';

const handler = async (m) => {
    let triggerWords = {
        'basta': 'buona la pasta'
    };

    let text = m.text.toLowerCase();
    if (text === 'basta') {
        m.reply(triggerWords['basta']);
    }
};

handler.customPrefix = /^basta$/i;
handler.priority = 10;
handler.command = new RegExp;

export default handler;