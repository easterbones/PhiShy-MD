import fetch from 'node-fetch';
import fs from 'fs';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `❌ Inserisci il nome di una canzone o artista.\n\nEsempio: *${usedPrefix + command} Good Feeling - Flo Rida*`;
  }

  try {
    // Cerca la canzone
    const res = await fetch(`${global.MyApiRestBaseUrl}/api/spotifysearch?text=${text}&apikey=${global.MyApiRestApikey}`);
    const data = await res.json();

    const linkDL = data?.spty?.resultado[0]?.url || data?.spty?.resultado[0]?.link;

    // Scarica l'audio
    const musics = await fetch(`${global.MyApiRestBaseUrl}/api/spotifydl?text=${linkDL}&apikey=${global.MyApiRestApikey}`);
    const music = await conn.getFile(musics?.url);

    // Recupera le info della traccia
    const infos = await fetch(`${global.MyApiRestBaseUrl}/api/spotifyinfo?text=${linkDL}&apikey=${global.MyApiRestApikey}`);
    const info = await infos.json();
    const spty = info?.spty?.resultado;

    const img = await (await fetch(`${spty.thumbnail}`)).buffer();

    // Testo descrizione
    let spotifyi = `🎵 *Titolo:* ${spty.title}\n`;
    spotifyi += `👤 *Artista:* ${spty.artist}\n`;
    spotifyi += `💽 *Album:* ${spty.album}\n`;
    spotifyi += `📅 *Anno:* ${spty.year}\n\n`;
    spotifyi += `⬇️ Scarico la canzone...`;

    // Invia anteprima
    await conn.sendMessage(m.chat, {
      text: spotifyi.trim(),
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true,
        externalAdReply: {
          showAdAttribution: true,
          containsAutoReply: true,
          renderLargerThumbnail: true,
          title: spty.title,
          body: spty.artist,
          mediaType: 1,
          thumbnail: img,
          thumbnailUrl: spty.thumbnail,
          mediaUrl: linkDL,
          sourceUrl: linkDL
        }
      }
    }, { quoted: m });

    // Invia audio
    await conn.sendMessage(m.chat, {
      audio: music.data,
      fileName: `${spty.title}.mp3`,
      mimetype: 'audio/mpeg'
    }, { quoted: m });

  } catch (error) {
    console.error('Errore:', error.message);
    throw '❌ Errore durante il download. Riprova o cambia link/testo.';
  }
};

handler.command = /^(spotify|music)$/i;
export default handler;
