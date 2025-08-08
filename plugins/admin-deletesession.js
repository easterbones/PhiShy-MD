import { existsSync, promises as fs } from 'fs';
import path from 'path';

// Comando per il bot
const handler = async (m, { conn, usedPrefix }) => {
  // Controlla se il comando è eseguito dal numero principale del bot
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {
      text: "*Utilizza questo comando direttamente nel numero principale del Bot.*"
    }, { quoted: m });
  }

  // Messaggio iniziale
  await conn.sendMessage(m.chat, {
    text: "ⓘ 𝐑𝐢𝐩𝐫𝐢𝐬𝐭𝐢𝐧𝐨 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨..."
  }, { quoted: m });

  try {
    // Controlla se esiste la cartella "Sessioni"
    if (!existsSync("./Sessioni/")) {
      return await conn.sendMessage(m.chat, {
        text: "*La cartella Sessioni non esiste o e' vuota.*"
      }, { quoted: m });
    }

    // Legge tutti i file nella cartella
    const files = await fs.readdir("./Sessioni/");
    let eliminati = 0;

    for (const file of files) {
      // Non elimina il file delle credenziali principali
      if (file !== "creds.json") {
        await fs.unlink(path.join("./Sessioni/", file));
        eliminati++;
      }
    }

    if (eliminati === 0) {
      await conn.sendMessage(m.chat, {
        text: "ⓘ 𝐋𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐬𝐨𝐧𝐨 𝐯𝐮𝐨𝐭𝐞 ‼️"
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        text: `ⓘ 𝐒𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢 ${eliminati} 𝐚𝐫𝐜𝐡𝐢𝐯𝐢 𝐧𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢`
      }, { quoted: m });
    }

  } catch (err) {
    console.error('Errore:', err);
    await conn.sendMessage(m.chat, {
      text: "Errore"
    }, { quoted: m });
  }

  // Invia un messaggio finale con anteprima "location"
  const nomeBot = global.db.data.nomedelbot || "PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ! ";
  const fakeMsg = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: nomeBot,
        jpegThumbnail: await (await fetch("https://i.ibb.co/VW7JZ600/stella.png")).buffer(),
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;Unlimited;;;\n" +
          "FN:Unlimited\n" +
          "ORG:Unlimited\n" +
          "TITLE:\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
          "item1.X-ABLabel:Unlimited\n" +
          "X-WA-BIZ-DESCRIPTION:ofc\n" +
          "X-WA-BIZ-NAME:Unlimited\n" +
          "END:VCARD"
      }
    },
    participant: '0@s.whatsapp.net'
  };

  await conn.sendMessage(m.chat, {
    text: "ⓘ ora dovresti leggere i nuovi messagi che scrivero, sei contento?"
  }, { quoted: fakeMsg });
};

// Proprietà del comando
handler.help = ['del_reg_in_session_owner'];
handler.tags = ["owner"];
handler.command = /^(cls|ds|clearallsession)$/i;
handler.admin = true;
handler.mods = true;

export default handler;
