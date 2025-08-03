import moment from 'moment-timezone';

let handler = async (m, { conn, groupMetadata }) => {
    if (m.key.fromMe) return;

    const oraMinutiCorrenti = moment().tz('Europe/Rome').format('HH:mm');
    const oraCorrente = moment().tz('Europe/Rome').hour();

    const isDirectGoodnight = /^(buonanotte|notte|gn|boninotti)(\s*|$)/i.test(m.text);
    const isReplyToSomeone = m.quoted;
    const containsOtherText = /(buonanotte|notte|gn|boninotti).+/.test(m.text) || /.+(buonanotte|notte|gn|boninotti)/i.test(m.text);

    if (isReplyToSomeone || containsOtherText) return;

    if (isDirectGoodnight) {
        if (oraCorrente >= 22 || oraCorrente < 5) {
            const bg = [
                `_Buonanotte ${m.pushName || m.sender || ""} sogni d'oro💫_`,
                `_Notte bella ${m.pushName || m.sender || ""}_`,
                `_Notte stellata ${m.pushName || m.sender || ""}💫_`,
                `_Notte stupenda ${m.pushName || m.sender || ""}_`,
                `_Buonanotte anche a te ${m.pushName || m.sender || ""}, che Dio si avvicini al tuo lettino e lasci la sua benedizione🙏🏻_`,
                `_Notte cucciolo ${m.pushName || m.sender || ""}_`,
                `_Notte cucciola ${m.pushName || m.sender || ""}_`,
                `_${m.pushName || m.sender || ""} notte campione, domani ti aspetta una giornata lunga👊🏻_`
            ];
            const randomResponse = bg[Math.floor(Math.random() * bg.length)];
            m.reply(randomResponse.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
        } else {
            const lamentela = [
                `_${m.pushName || m.sender || ""} ma come buonanotte? Sono le ${oraMinutiCorrenti}_`,
                `_${m.pushName || m.sender || ""} non puoi dire buonanotte, sono le ${oraMinutiCorrenti}_`,
                `_${m.pushName || m.sender || ""} forse tu stai già nel mondo dei sogni, ma per noi sono le ${oraMinutiCorrenti}_`
            ];
            const randomLamentela = lamentela[Math.floor(Math.random() * lamentela.length)];
            m.reply(randomLamentela.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
        }
    }
};

handler.customPrefix = /\b(buonanotte|gn|notte|boninotti)\b/i;
// questa riga è facoltativa, ma sicura
handler.command = /^$/;
handler.priority = 10;

export default handler;
