// Plugin per nominare i propri animali
// Comando: .nomina <animale> <nome>

const animaliSupportati = [
  'cane', 'gatto', 'coniglio', 'drago', 'piccione', 'serpente', 'cavallo', 'pesce', 'riccio', 'scoiattolo', 'polpo', 'ragno', 'scorpione'
];

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { args }) => {
  if (args.length < 2) return m.reply('Usa: .nomina <animale> <nome>');

  // Percorso assoluto alla cartella immagini shop
  const baseShopImgPath = path.resolve(__dirname, '../src/img/shop');
  const animale = args[0].toLowerCase();
  const nome = args.slice(1).join(' ').trim();
  if (!animaliSupportati.includes(animale)) {
    return conn.reply(m.chat, 'Animale non supportato. Scegli tra: ' + animaliSupportati.join(', '), m, rcanal);
  }
  let user = global.db.data.users[m.sender];
  if (!user) return m.reply('Utente non trovato.');
  if (!user[animale]) return m.reply(`Non possiedi un ${animale}.`);
  // Controlla che l'utente abbia almeno 1 nametag (come numero)
  if (typeof user.nametag !== 'number' || user.nametag < 1) {
    return conn.reply(m.chat, '❌ Non hai nessuna targhetta per nominare un animale, prova il comando .shop nametag', m, rcanal);
  }
  // Se l'animale è solo un boolean o altro, lo trasformiamo in oggetto con lista nomi
  if (typeof user[animale] !== 'object' || Array.isArray(user[animale])) {
    user[animale] = { nomi: [] };
  } else if (!Array.isArray(user[animale].nomi)) {
    user[animale].nomi = [];
  }
  // Aggiungi il nome solo se non già presente
  if (!user[animale].nomi.includes(nome)) {
    // Sovrascrivi la lista dei nomi con solo il nuovo nome
    user[animale].nomi = [nome];
    user.nametag -= 1;
    const successMessage = `🎉✅ *NOMINA COMPLETATA!* 🎉\n\n` +
      `┣ 🐾 *Animale:* ${animale.charAt(0).toUpperCase() + animale.slice(1)}\n` +
      `┣ 🏷️ *Nuovo nome:* ${nome}\n` +
      `┣ 🔖 *Targhette rimaste:* ${user.nametag}\n` +
      `┗ ✨ *Usa il nome personalizzato nei tuoi comandi!* ✨`;
    // Usa lo stesso sistema di shop: nome file sempre minuscolo
    const imgName = `${animale.toLowerCase()}.png`;
    const imgPath = path.resolve(baseShopImgPath, imgName);
    let thumb = null;
    if (fs.existsSync(imgPath)) {
      thumb = fs.readFileSync(imgPath);
    } else {
      // fallback: nessuna thumbnail
      thumb = null;
    }
    await conn.sendMessage(m.chat, {
      text: successMessage,
      contextInfo: {
        externalAdReply: {
          isforwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363391446013555@newsletter",
            serverMessageId: 100,
            newsletterName: 'canale dei meme 🎌',
          },
          title: 'hai cambiato il nome ',
          body: 'del tuo animale',
          thumbnail: thumb,
          mediaType: 1,
          sourceUrl: ''
        }
      }
    }, { quoted: m });
  } else {
    const alreadyMessage = `ℹ️❗ Il tuo 🐾 ${animale} si chiama già *${nome}*.`;
    const imgName = `${animale.toLowerCase()}.png`;
    const imgPath = path.resolve(baseShopImgPath, imgName);
    let thumb = null;
    if (fs.existsSync(imgPath)) {
      thumb = fs.readFileSync(imgPath);
    } else {
      thumb = null;
    }
    await conn.sendMessage(m.chat, {
      text: alreadyMessage,
      contextInfo: {
        externalAdReply: {
          isforwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363391446013555@newsletter",
            serverMessageId: 100,
            newsletterName: 'canale dei meme 🎌',
          },
          title: 'nome già presente',
          body: 'del tuo animale',
          thumbnail: thumb,
          mediaType: 1,
          sourceUrl: ''
        }
      }
    }, { quoted: m });
  }
};

handler.help = ['nomina <animale> <nome>'];
handler.tags = ['fun'];
handler.command = ['nomina', 'nomanimale', 'rinomina'];

export default handler;
