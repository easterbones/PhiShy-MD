import axios from "axios";

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `⚠️ Per favore inserisci un link di TikTok!\n*Esempio:* ${usedPrefix + command} https://vm.tiktok.com/ZM6n8r8Dk/`;
  
  const url = args[0];
  if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(url)) {
    throw `❌ Link TikTok non valido!`;
  }

  await m.reply('⏳ Sto scaricando il video, attendi...');
  
  try {
    // Usa l'API siputzx.my.id
    const apiUrl = `https://api.siputzx.my.id/api/tiktok/v2?url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(apiUrl, {
      timeout: 30000,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });

    // Controllo completo della risposta
    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error('Risposta API non valida o vuota');
    }

    const tiktokData = response.data.data;
    
    // Prendi il primo URL video disponibile (puoi scegliere tra i 3)
    const videoUrl = tiktokData.download?.video?.[0];
    if (!videoUrl) throw new Error('Nessun URL video trovato');
    
    // Estrai i metadati
    const author = m.sender.split('@')[0]; // O usa un valore fisso se non disponibile nell'API
    const description = tiktokData.metadata?.description || 'Video TikTok';
    const stats = tiktokData.metadata?.stats || {};
    
    // Crea la caption con le statistiche
    let caption = `🎵 ${description}\n👤 Autore: @${author}`;
    if (stats.playCount) caption += `\n▶️ ${formatNumber(stats.playCount)} visualizzazioni`;
    if (stats.likeCount) caption += `\n❤️ ${formatNumber(stats.likeCount)} likes`;
    if (stats.commentCount) caption += `\n💬 ${formatNumber(stats.commentCount)} commenti`;

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: caption,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (error) {
    console.error('Errore nel download TikTok:', error);
    
    let errorMessage = '❌ Errore durante il download del video.';
    if (error.message.includes('timeout')) {
      errorMessage += '\n⌛ Timeout: il server ha impiegato troppo tempo a rispondere.';
    } else if (error.message.includes('Nessun URL video trovato')) {
      errorMessage += '\n⚠️ Il video potrebbe essere privato o rimosso.';
    } else {
      errorMessage += `\n🔧 Errore: ${error.message}`;
    }
    
    await m.reply(errorMessage);
    await m.react('❌');
  }
}

// Funzione helper per formattare i numeri (es. 1000 → 1K)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

handler.help = ['tiktok'];
handler.tags = ['downloader'];
handler.command = /^(tt|tiktok)(dl|nowm)?$/i;
handler.limit = 2;
export default handler;