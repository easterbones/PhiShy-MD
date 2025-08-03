import fs from 'fs';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const mods = (global.db.data.mods || []);
  if (!mods.length) return m.reply('❌ Nessun moderatore attualmente impostato.');

  // Scarica l'immagine e la converte in buffer
  const res = await fetch('https://i.ibb.co/pBMC095c/mod.png');
  const buffer = await res.buffer();

  // Messaggio finto da usare come quoted
  const contattoFake = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "ModList"
    },
    message: {
      locationMessage: {
        name: '⛑️ 𝐌𝐎𝐃𝐄𝐑𝐀𝐓𝐎𝐑𝐈 𝐔𝐅𝐅𝐈𝐂𝐈𝐀𝐋𝐈',
        jpegThumbnail: buffer
      }
    },
    participant: "0@s.whatsapp.net"
  };

  // Crea le vCard per ogni mod, usando il nome se presente in db.data.users
  const contatti = mods.map((jid) => {
    const numero = jid.replace(/[^0-9]/g, '');
    let nome = (global.db.data.users && global.db.data.users[jid] && global.db.data.users[jid].name) ? global.db.data.users[jid].name : `+${numero}`;
    return {
      vcard: `
BEGIN:VCARD
VERSION:3.0
FN:${nome}
TEL;type=CELL;type=VOICE;waid=${numero}:+${numero}
END:VCARD`.trim()
    };
  });

  // Invia tutti i contatti in un unico messaggio, con anteprima finta
  return conn.sendMessage(m.chat, {
    contacts: {
      displayName: `Moderatori ufficiali (${contatti.length})`,
      contacts: contatti
    }
  }, { quoted: contattoFake });
};

handler.help = ['moderatori'];
handler.tags = ['info'];
handler.command = ['moderatori', 'mods', 'modlist'];
export default handler;
