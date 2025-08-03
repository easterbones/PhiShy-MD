import fs from 'fs';
import path from 'path';
import * as CloudmersiveImageApiClient from 'cloudmersive-image-api-client';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || !m.quoted.mimetype?.startsWith('image/')) {
    return m.reply(`📸 *Rispondi a un'immagine* con *${usedPrefix + command}* per analizzarla.`);
  }

  try {
    // Ricarica il messaggio se incompleto
    if (!m.quoted.message) {
      const quotedMsg = await conn.loadMessage(m.chat, m.quoted.id);
      m.quoted.message = quotedMsg.message;
    }

    // Scarica il buffer dell'immagine
    let buffer = await downloadMediaMessage(
      m.quoted,
      'buffer',
      {},
      { logger: console, reuploadRequest: conn.updateMediaMessage }
    );

    // Salva temporaneamente
    let filename = `./tmp/nsfw-${Date.now()}.jpg`;
    fs.writeFileSync(filename, buffer);

    // Imposta la chiave API
    let defaultClient = CloudmersiveImageApiClient.ApiClient.instance;
    let Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = '2464d824-7110-4630-95ba-cc341f455f7f'; // sostituiscila se serve

    let apiInstance = new CloudmersiveImageApiClient.ExplicitImageDetectionApi();
    let imageFile = fs.readFileSync(filename);

    apiInstance.explicitImageDetectionDetectPorn(Buffer.from(imageFile), function (error, data, response) {
      fs.unlinkSync(filename); // elimina file temporaneo

      if (error) {
        console.error(error);
        return m.reply('❌ Errore durante la scansione dell\'immagine.');
      }

      if (data.Pornographic) {
        m.reply(`🚫 *NSFW rilevato!*\n🔞 Livello: *${data.PornographyScore.toFixed(2)}*`);
      } else {
        m.reply(`✅ L'immagine è *sicura*.\n🟢 Rischio: *${data.PornographyScore.toFixed(2)}*`);
      }
    });

  } catch (err) {
    console.error(err);
    m.reply('⚠️ Errore durante il download o la scansione dell\'immagine.');
  }
};

handler.command = /^nsfwcheck$/i;
export default handler;
