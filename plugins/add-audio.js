import * as fs from 'fs';
import path from 'path';

const audioStoragePath = 'storage/audio';

let handler = async (m, { conn, text, quoted }) => {
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';
  const audioMsg = quoted?.msg?.audioMessage;

  if (!quoted || !(audioMsg || mime.startsWith('audio/'))) {
    return m.reply('⚠️ Devi rispondere a un messaggio con un audio valido (nota vocale o file audio).');
  }

  if (!text) {
    return m.reply('⚠️ Devi specificare i trigger separati da |. Esempio: .addaudio compleanno|auguri');
  }

  const triggers = text.split('|').map(t => t.trim().toLowerCase());
  const existingTriggers = global.audioResponses?.map(r => r.patterns.source.replace(/^\\b|\\b$/g, '')) || [];
  const duplicateTriggers = triggers.filter(t => existingTriggers.includes(t));

  if (duplicateTriggers.length > 0) {
    return m.reply(`⚠️ I seguenti trigger esistono già: ${duplicateTriggers.join(', ')}`);
  }

  let audioBuffer;
  try {
    // 🔥 qui usiamo il messaggio grezzo (non quello "wrapper")
    audioBuffer = await conn.downloadMediaMessage(quoted.fakeObj);
  } catch (e) {
    console.error('[ERRORE DOWNLOAD AUDIO]', e);
    return m.reply('❌ Errore nel download dell\'audio.');
  }

  const fileName = `${triggers[0].replace(/\s+/g, '_')}.m4a`;
  const filePath = path.join(audioStoragePath, fileName);

  if (!fs.existsSync(audioStoragePath)) {
    fs.mkdirSync(audioStoragePath, { recursive: true });
  }

  fs.writeFileSync(filePath, audioBuffer);

  const newAudioResponse = {
    patterns: new RegExp(`\\b(${triggers.join('|')})\\b`, 'i'),
    file: filePath,
    ptt: false
  };

  global.audioResponses = global.audioResponses || [];
  global.audioResponses.push(newAudioResponse);

  m.reply(`✅ Audio aggiunto con successo! Trigger: ${triggers.join(', ')}`);
};

handler.command = /^addaudio$/i;
handler.admin = true;

export default handler;
