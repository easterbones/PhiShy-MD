import db from '../lib/database.js';

const cooldown = 5 * 60 * 1000; // 5 minuti
const maxOkCount = 2;
const handler = async (m) => {
      if (m.key.fromMe) return;
    if (!db.data) db.data = {};
    if (!db.data.users) db.data.users = {};
    
    let user = db.data.users[m.sender] || (db.data.users[m.sender] = {});
    
    if (!user.okCount) user.okCount = 0;
    if (!user.okCooldown) user.okCooldown = 0;
    
    let now = Date.now();
    if (now < user.okCooldown) return;
    
    if (m.text.toLowerCase() === 'ok') {
        user.okCount++;
        const funnyReplies = [
            'ok',
            'ok... ma hai altro da dire?',
            'okissimo!',
            'ok 👌',
            'ok, ma la smetti?',
            'ok, ma se scrivi solo ok ti banno 😂',
            'ok, ma la vita è più di un semplice ok',
            'ok, ma hai rotto il tasto?',
            'ok, ma ogni volta che scrivi ok un programmatore piange',
            'ok, ma la prossima volta rispondo con "ko"',
            'ok, ma la tua tastiera si sta annoiando',
            'ok, ma il bot si sta addormentando',
            'ok, ma hai vinto un ok gratis',
            'ok, ma ora basta',
        ];
        if (user.okCount > maxOkCount) {
            const rageReplies = [
                'BASTA CON STO OK! 😡',
                'PORCO DIO HAI ROTTO I COGLIONI CON STO OK',
                'Se scrivi ancora ok ti mando la finanza',
                'Ok, ora ti ignoro per 5 minuti',
                'Basta ok, cambia disco!',
                'Sei in cooldown, pensa a qualcosa di più originale!',
            ];
            m.reply(rageReplies[Math.floor(Math.random() * rageReplies.length)]);
            user.okCount = 0;
            user.okCooldown = now + cooldown;
        } else {
            m.reply(funnyReplies[Math.floor(Math.random() * funnyReplies.length)]);
        }
    }
};

handler.customPrefix = /^ok$/i;
handler.priority = 10;
handler.command = new RegExp;

export default handler;
