import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
// Plugin NSFW: elimina immagini NSFW tranne nel gruppo QI Negativo
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nsfwjs = require('nsfwjs');
const tf = require('@tensorflow/tfjs-node');

const QI_NEGATIVO_JID = '120363397981323139@g.us';
const THRESHOLD = 0.7; // Soglia per considerare NSFW
let nsfwModel;

async function loadModel() {
  if (!nsfwModel) {
    nsfwModel = await nsfwjs.load();
  }
}

/**
 * Analizza un'immagine buffer e restituisce true se NSFW
 */
async function isNSFW(buffer) {
  await loadModel();
  const image = tf.node.decodeImage(buffer, 3);
  const predictions = await nsfwModel.classify(image);
  image.dispose();
  // Considera NSFW se una delle classi "Porn", "Hentai" supera la soglia
  return predictions.some(p => (p.className === 'Porn' || p.className === 'Hentai') && p.probability >= THRESHOLD);
}

/**
 * Handler principale: intercetta messaggi con immagini
 * @param {object} msg - Messaggio Baileys
 * @param {object} sock - Socket Baileys
 */
export async function onImageMessage(msg, sock) {
  const jid = msg.key.remoteJid;
  // Consenti materiale NSFW solo in QI Negativo
  if (jid === QI_NEGATIVO_JID) return;
  // Solo immagini
  if (!msg.message?.imageMessage) return;
  try {
    const stream = await sock.downloadMediaMessage(msg);
    if (!stream) return;
    const buffer = Buffer.isBuffer(stream) ? stream : Buffer.from(stream);
    if (await isNSFW(buffer)) {
      // Elimina il messaggio
      await sock.sendMessage(jid, { delete: msg.key });
      // Avvisa l'utente
      await sock.sendMessage(jid, {
        text: `Il materiale NSFW non è consentito in questo gruppo! Il tuo messaggio è stato eliminato.`,
        mentions: [msg.key.participant || msg.key.remoteJid]
      });
    }
  } catch (e) {
    console.error('Errore NSFW handler:', e);
  }
}

// Esempio di registrazione handler in main.js o handler.js:
// const { onImageMessage } = require('./plugins/antiporno');
// sock.ev.on('messages.upsert', async ({ messages }) => {
//   for (const msg of messages) {
//     await onImageMessage(msg, sock);
//   }
// });


