import fsPromises from 'fs/promises';
import { createReadStream } from 'fs';
import fetch from 'node-fetch';
import { join } from 'path';

// Sostituisci con il tuo token Wit.ai (è gratuito)
const WIT_API_TOKEN = "Y6JVE6ISAGQE7NFGQESDNPGXFVXGUDS7";

/**
 * Funzione che, dato il percorso di un file audio, invia una richiesta
 * a Wit.ai per ottenere la trascrizione.
 *
 * @param {string} filePath - Il percorso del file audio (in formato MP3)
 * @returns {Promise<string>} - La trascrizione ottenuta dall'API
 */
async function witTranscribe(filePath) {
  const audioStream = createReadStream(filePath)

  const res = await fetch('https://api.wit.ai/speech?v=20250414', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WIT_API_TOKEN}`,
      'Content-Type': 'audio/mpeg'
    },
    body: audioStream
  })

  const contentType = res.headers.get("content-type")

  if (contentType?.includes("application/json")) {
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.text || "(trascrizione vuota)"
  } else {
    const text = await res.text()
    throw new Error(`Risposta non valida da Wit.ai:\n${text}`)
  }
}


let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Verifica se il messaggio (o quello citato) contiene un audio
  const messageAudio = m.quoted || m;
  if (!messageAudio || !messageAudio.mimetype?.startsWith('audio')) {
    return conn.reply(m.chat, "❌ Devi inviare o citare un messaggio audio per trascrivere il discorso.", m);
  }
  
  if (!messageAudio.url) {
    return conn.reply(m.chat, "❌ URL dell'audio non trovato nel messaggio.", m);
  }
  
  // Scarica l'audio utilizzando fetch
  let buffer;
  try {
    const res = await fetch(messageAudio.url);
    if (!res.ok) throw new Error("Risposta non valida dal server");
    buffer = await res.buffer();
  } catch (e) {
    console.error("Errore nel download dell'audio:", e);
    return conn.reply(m.chat, "❌ Errore nel scaricare il file audio.", m);
  }
  
  // Salva temporaneamente il file audio su disco in formato MP3
  const filePath = join('./tmp', `${Date.now()}.mp3`);
  try {
    await fsPromises.writeFile(filePath, buffer);
  } catch (e) {
    console.error("Errore nel salvataggio del file:", e);
    return conn.reply(m.chat, "❌ Errore nel salvare il file audio temporaneo.", m);
  }
  
  // Usa la funzione witTranscribe per ottenere la trascrizione
  try {
    const transcription = await witTranscribe(filePath);
    await conn.reply(m.chat, `📢 Trascrizione:\n\n${transcription}`, m);
  } catch (e) {
    console.error("Errore nella trascrizione:", e);
    return conn.reply(m.chat, `❌ Errore durante la trascrizione: ${e.message}`, m);
  } finally {
    // Elimina il file temporaneo
    try {
      await fsPromises.unlink(filePath);
    } catch (e) {
      console.error("Errore nell'eliminazione del file temporaneo:", e);
    }
  }
};

handler.help = ['stt'];
handler.tags = ['tools', 'speech'];
handler.command = ['stt', 'speechtotext', 'transcribe'];
export default handler;
