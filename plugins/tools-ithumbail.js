import axios from 'axios';
import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `✳️ Inserisci un prompt per generare l'immagine\n\nEsempio: *${usedPrefix + command} un cane che gioca a calcio*`;
  
  await m.reply('⏳ Generando la tua immagine...');
  
  try {
    // Chiamata all'API Dreamshaper
    const apiUrl = `https://api.siputzx.my.id/api/ai/dreamshaper?prompt=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 60000 // 1 minuto di timeout
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('Nessun dato ricevuto dall\'API');
    }

    // Salva l'immagine temporaneamente
    const tempPath = join(tmpdir(), `dreamshaper_${Date.now()}.jpg`);
    fs.writeFileSync(tempPath, response.data);

    // Invia l'immagine
    await conn.sendFile(m.chat, tempPath, 'dreamshaper.jpg', 
      `🖼️ *Dreamshaper AI* 🎨\n\n` +
      `▢ *Prompt:* ${text}\n` +
      `▢ *Dimensioni:* ${response.headers['content-length']} bytes\n` +
      `▢ *Tempo di generazione:* ${response.headers['x-response-time'] || 'sconosciuto'}`, 
      m);

    // Elimina il file temporaneo
    fs.unlinkSync(tempPath);

  } catch (error) {
    console.error('Errore nella generazione dell\'immagine:', error);
    await m.reply(`❌ Errore durante la generazione dell'immagine:\n${error.message}`);
    await m.react('❌');
  }
};

handler.help = ['dreamshaper <prompt>'];
handler.tags = ['ai'];
handler.command = ['dreamshaper', 'ds', 'aiimg'];
handler.limit = true;
handler.premium = false;

export default handler;