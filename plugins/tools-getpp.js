import { canLevelUp, xpRange } from '../lib/levelling.js';
import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, usedPrefix, command, args, isAdmin, isOwner }) => {
  if (args.length === 0) {
    return m.reply(`❌ Inserisci un numero di telefono.\nEsempio: *${usedPrefix + command} +39 333 1234567* o *${usedPrefix + command} +54 911 12345678*`);
  }

  let rawInput = args.join(' ').replace(/[^0-9+]/g, '');
  let number = rawInput.startsWith('+') ? rawInput : '+' + rawInput;
  let phoneNumber = PhoneNumber(number);
  let jid = number.replace(/\D/g, '') + '@s.whatsapp.net';

  if (m.isGroup && !(isAdmin || isOwner)) {
    global.dfail("admin", m, conn);
    throw false;
  }

  try {
    let ppUrl = await conn.profilePictureUrl(jid, 'image').catch(() => null);

    if (!ppUrl) return m.reply('❌ Questo numero non ha una foto profilo visibile o non è registrato su WhatsApp.');

    let formatted = phoneNumber.isValid()
      ? (phoneNumber.getNumber ? phoneNumber.getNumber('international') : phoneNumber.number)
      : number;

    await conn.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: `📸 Foto profilo di *${formatted}*`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    return m.reply('❌ Errore durante il recupero della foto profilo. Assicurati che il numero sia registrato su WhatsApp.');
  }
};

handler.command = ['gepp', 'getpp', 'fotoprofilo'];
handler.help = ['gepp <numero>', 'getpp <numero>', 'fotoprofilo <numero>'];
handler.tags = ['tools'];

export default handler;
