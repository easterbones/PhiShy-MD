import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';

var handler = async (m, { conn }) => {
  try {
    // Passo 1: Ottieni un versetto casuale in inglese
    const apiResponse = await fetch('https://bible-api.com/data/web/random');
    const verseData = await apiResponse.json();
    const verse = verseData.random_verse;
    
    // Passo 2: Traduci il versetto in italiano
    try {
      const translation = await translate(verse.text, { to: 'it', autoCorrect: true });
      
      // Formatta il messaggio finale
      const verseMessage = `
📖 *${verse.book} ${verse.chapter}:${verse.verse}*  

${translation.text}  

_(Tradotto dalla ${verse.translation || 'Bibbia in inglese'})_
      `;

      await conn.reply(m.chat, verseMessage, m);
      
    } catch (translateError) {
      // Fallback con un altro API di traduzione
      const fallbackTranslation = await fetch(`https://api.lolhuman.xyz/api/translate/auto/it?apikey=YOUR_API_KEY&text=${encodeURIComponent(verse.text)}`);
      const translated = await fallbackTranslation.json();
      
      await conn.reply(
        m.chat, 
        `📖 *${verse.book} ${verse.chapter}:${verse.verse}*\n\n${translated.result.translated}\n\n_(Tradotto automaticamente)_`, 
        m
      );
    }

  } catch (error) {
    console.error(error);
    // Sistema completo di fallback
    try {
      const backup = await fetch('https://bible-api.com/random');
      const backupVerse = await backup.json();
      
      await conn.reply(
        m.chat, 
        `📖 *${backupVerse.reference}*\n\n${backupVerse.text}\n\n_(Disponibile solo in inglese)_`, 
        m
      );
    } catch (e) {
      await conn.reply(
        m.chat, 
        '⚠️ Ci dispiace, il servizio versetti biblici è momentaneamente non disponibile.\n' +
        'Puoi leggere la Bibbia online: https://www.bible.com/it', 
        m
      );
    }
  }
};

handler.help = ['versetto'];
handler.tags = ['bibbia']
handler.command = /^(versetto|versettocasuale|bibbia|versettobiblico)$/i;
export default handler;