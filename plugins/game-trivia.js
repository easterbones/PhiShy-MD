import fetch from 'node-fetch';

const handler = async (m, { conn, reply }) => {
  try {
    // Fetch domanda trivia
    let res = await fetch("https://opentdb.com/api.php?amount=1");
    let json = await res.json();
    
    if (!json.results || json.results.length === 0) {
      throw new Error("Nessuna domanda trovata");
    }

    let question = json.results[0].question;
    let answer = json.results[0].correct_answer;
    let category = json.results[0].category;
    let difficulty = json.results[0].difficulty;

    // Invia la domanda con una card estetica
    await conn.sendMessage(m.chat, {
      text: `🎲 *TRIVIA* 🎲\n\n📚 Categoria: ${category}\n⚡ Difficoltà: ${difficulty}\n\n❓ Domanda:\n${question}\n\n💡 Hai *20 secondi* per rispondere!`,
      contextInfo: {
        externalAdReply: {
          title: "🧠 Phishy Trivia",
          body: "Metti alla prova la tua conoscenza!",
          thumbnailUrl: "https://i.imgur.com/JiZ2FpG.png", // Sostituisci con un'immagine PNG
          sourceUrl: "",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

    // Timer per la risposta
    setTimeout(async () => {
      await conn.sendMessage(m.chat, {
        text: `⏰ Tempo scaduto!\n\n✅ Risposta corretta:\n${answer}`,
        contextInfo: {
          externalAdReply: {
            title: "📣 Risposta Trivia",
            body: "Ecco la soluzione!",
            thumbnailUrl: "https://i.imgur.com/vWnNWcY.png", // Immagine diversa per la risposta
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      });
    }, 20000);

  } catch (error) {
    console.error('[TRIVIA ERROR]', error);
    reply('❌ Si è verificato un errore nel recuperare la domanda di trivia.');
  }
};

handler.command = /^(trivia|quiz|domanda)$/i;
handler.tags = ['game'];
handler.help = ['trivia', 'quiz', 'domanda'];
handler.group = true;
handler.register = true;

export default handler;