let handler = async (m, { conn }) => {
   const audioPath = './storage/video/f1.mp4'; // Sostituisci con il percorso del tuo file audio .m4a
   try {
     // Invia il file audio dal percorso specificato
     await conn.sendMessage(m.chat, { video: { url: audioPath }, mimetype: 'video/mp4', ptt: false }, { quoted: m });
   } catch (error) {
     console.log(error);
     m.reply("Si è verificato un errore durante l'invio dell'audio.");
   }
};

handler.customPrefix = /f1|charles/i;
handler.command = new RegExp;
export default handler;
