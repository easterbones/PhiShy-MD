import { answerQuestion } from '../lib/ai_help.js';

const handler = async (m, { conn, text }) => {
  const domanda = text?.trim() || '';
  console.log('[tools-help] domanda:', domanda);
  console.log('[tools-help] m.chat:', m.chat);
  if (!domanda) {
    await conn.reply(m.chat, 'Scrivi una domanda dopo !help.', m);
    return;
  }
  try {
    const risposta = await answerQuestion(domanda, m.chat);
    console.log('[tools-help] risposta AI:', risposta);
    await conn.reply(m.chat, `🤖 Risposta AI:\n${risposta}`, m);
// Usa il modello locale distilbert-base-cased-distilled-squad per risposte AI
  } catch (err) {
    console.error('[tools-help] Errore AI:', err);
    await conn.reply(m.chat, `Errore AI: ${err.message}\n${err.stack}`, m);
  }
};

handler.help = ['help <domanda>'];
handler.tags = ['tools', 'ai'];
handler.command = ['help'];
handler.mods = false;
handler.group = false;

export default handler;
