/*              Codigo Creado Por Bruno Sobrino
      (https://github.com/BrunoSobrino/TheMystic-Bot-MD)
*/

const handler = async (m, {conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin}) => {
  if (!args[0]) return;
  if (isNaN(args[0])) return;
  const lol = args[0].replace(/[+]/g, '');
  const ps = participants.map((u) => u.id).filter((v) => v !== conn.user.jid && v.startsWith(lol || lol));
  const bot = global.db.data.settings[conn.user.jid] || {};
  if (ps == '') return;
  const numeros = ps.map((v)=> '⭔ @' + v.replace(/@.+/, ''));
  const delay = (time) => new Promise((res)=>setTimeout(res, time));
  switch (command) {
    case 'listanum':
      conn.reply(m.chat, `` + numeros.join`\n`, m, {mentions: ps});
      break;
    case 'stermina':
      if (!bot.restrict) return;
      if (!isBotAdmin) return;
      const ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net';
      const users = participants.map((u) => u.id).filter((v) => v !== conn.user.jid && v.startsWith(lol || lol));
      for (const user of users) {
        const error = `@${user.split('@')[0]} ha abbandonato`;
        if (user !== ownerGroup + '@s.whatsapp.net' && user !== global.conn.user.jid && user !== global.owner + '@s.whatsapp.net' && user.startsWith(lol || lol) && user !== isSuperAdmin && isBotAdmin && bot.restrict) {
          await delay(500);
          const responseb = await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
          if (responseb[0].status === '404') {
            await delay(500);
          }
        } else return;
      }
      break;
  }
};
handler.command = /^(listanum|stermina)$/i;
handler.group = handler.botAdmin = handler.owner = true;
handler.fail = null;
export default handler;