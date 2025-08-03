import axios from 'axios';

const handler = async (m, { conn, reply }) => {
  try {
    const { data } = await axios.get('https://nekos.life/api/v2/fact');
    
    await conn.sendMessage(m.chat, {
      text: `*📌 F A C T*\n\n${data.fact}`,
      contextInfo: {
        externalAdReply: {
          title: "🔍 Phishy Fact",
          body: "Did you know?",
          thumbnailUrl: "https://i.imgur.com/8Km9tLL.png", // Sostituisci con un'immagine appropriata
          sourceUrl: "",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, {
      quoted: m
    });
    
  } catch (err) {
    console.error(err);
    reply('*❌ Errore nel recuperare il fact*');
  }
};

handler.command = /^(fact|fatto|curiosità)$/i;
handler.tags = ['fun'];
handler.help = ['fact', 'fatto', 'curiosità'];
handler.group = false; // Può essere usato sia in privato che in gruppo
handler.register = true;

export default handler;