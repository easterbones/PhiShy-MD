import fs from 'fs';
import path from 'path';

let handler = async (m, { text, conn, isAdmin }) => {
  if (m.key.fromMe) return;
  if (!isAdmin) return;
  if (!m.quoted || !m.quoted.fileSha256) return;

  // Rilevazione tipo file
  let isImage = m.quoted.mtype === 'imageMessage';
  let isVideo = m.quoted.mtype === 'videoMessage';
  let isAudio = m.quoted.mtype === 'audioMessage';
  let hasCaption = m.quoted.text?.trim().length > 0;

  // Generazione nome file migliorata
  let filename = text?.trim() || 
    (isImage ? `img_${Date.now()}.png` : 
     isVideo ? `vid_${Date.now()}.mp4` : `audio_${Date.now()}.mp3`);
  
  // Assicura l'estensione corretta
  if (!filename.includes('.')) {
    filename += isImage ? '.png' : isVideo ? '.mp4' : '.mp3';
  }

  // Gestione cartella ./tmp
  const tempDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Download e salvataggio
  try {
    let media = await m.quoted.download();
    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, media);

    // Opzioni di invio migliorate
    let options = {
      caption: hasCaption ? 
        `📝 ${m.quoted.text}\n\nFile salvato come: *${filename}*` : 
        `File salvato come: *${filename}*`,
      fileName: filename,
      mimetype: isImage ? 'image/png' : 
               isVideo ? 'video/mp4' : 'audio/mpeg'
    };

    // Invio file
    if (isImage) {
      await conn.sendMessage(m.sender, { image: fs.readFileSync(filePath), ...options }, { quoted: m });
    } else if (isVideo) {
      await conn.sendMessage(m.sender, { video: fs.readFileSync(filePath), ...options }, { quoted: m });
    } else if (isAudio) {
      await conn.sendMessage(m.sender, { audio: fs.readFileSync(filePath), ...options }, { quoted: m });
    }
  } catch (e) {
    console.error('Errore nel plugin:', e);
    m.reply('Ops! Qualcosa è andato storto...');
  }
};

// Mantieni la customPrefix se vuoi continuare a rilevare i trigger, ma senza risposta
handler.customPrefix = /^(yo+|ya+|boh+|we+|benvenut[oa!]*|salve+|hey+|hi+|rivela+|welcome|ehi|ah|bella|ehilà|eccomi|presente|damn)/i;
handler.command = new RegExp();

export default handler;
