let handler = async (m, { conn, args, participants }) => {
    let users = participants
        .filter(p => p.id !== conn.user.jid)
        .map(p => {
            let user = global.db.data.users[p.id];
            return { ...user, 'jid': p.id };
        });

    let sortedUsers = users
        .map(toNumber('messaggi'))
        .sort(sort('messaggi'));

    let topUsers = sortedUsers
        .map(enumGetKey);

    let limit = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 10)) : 10;

    if (limit > 100) {
        conn.reply(m.chat, '⚠️ La classifica può mostrare al massimo i primi 100 utenti.', m);
        return;
    }

    let userPosition = topUsers.indexOf(m.sender) + 1;
    let totalUsers = users.length;

    let message = `𝐓𝐨𝐩 ${limit} 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐩𝐢𝐮̀ 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢\n\n` +
        sortedUsers.slice(0, limit).map(({ jid, messaggi }, i) => getMedaglia(i + 1) + ` « *${messaggi}* » @${jid.split`@`[0]}`).join('\n');

    if (m.sender !== conn.user.jid) {
        message += `\n\n𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: *${userPosition}°* di *${totalUsers}*`;
    }

    let fakeMessage = {
        'key': { 'participants': '0@s.whatsapp.net', 'fromMe': false, 'id': 'Halo' },
        'message': {
            'locationMessage': {
                'name': '𝐂𝐥𝐚𝐬𝐬𝐢𝐟𝐢𝐜𝐚 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢',
                'jpegThumbnail': await (await fetch('https://telegra.ph/file/b311b1ffefcc34f681e36.png')).buffer(),
                'vcard': 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
            }
        },
        'participant': '0@s.whatsapp.net'
    };

    conn.reply(m.chat, message.trim(), fakeMessage, { 'mentions': [...topUsers.slice(0, limit)] });
};

handler.command = /^(top)$/i;
handler.group = true;
handler.admin = true;

export default handler;

function sort(key, asc = true) {
    if (key) {
        return (...args) => args[asc & 1][key] - args[!asc & 1][key];
    } else {
        return (...args) => args[asc & 1] - args[!asc & 1];
    }
}

function toNumber(key, defaultValue = 0) {
    if (key) {
        return (obj, index, array) => {
            return { ...array[index], [key]: obj[key] === undefined ? defaultValue : obj[key] };
        };
    } else {
        return value => value === undefined ? defaultValue : value;
    }
}

function enumGetKey(obj) {
    return obj.jid;
}

function getMedaglia(position) {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '🏅';
}