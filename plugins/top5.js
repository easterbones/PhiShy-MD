let handler = async (m, { conn }) => {
   const videoList = [
      './storage/video/top5animal.mp4',
      './storage/video/Top5egg.mp4',
      './storage/video/Top5fart.mp4',
      './storage/video/Top5Grandpa.mp4',
      './storage/video/Top5Haircuts.mp4',
      './storage/video/Top5NPC.mp4',
       './storage/video/Top5Person.mp4',
       './storage/video/Top5Spin.mp4',
       './storage/video/Top5Turkish.mp4',
       './storage/video/Top5walter.mp4'
       
   ];

   // Seleziona casualmente un video dall'array
   const randomVideo = videoList[Math.floor(Math.random() * videoList.length)];

   try {
      // Invia il video selezionato
      await conn.sendMessage(m.chat, { video: { url: randomVideo }, mimetype: 'video/mp4', ptt: false }, { quoted: m });
   } catch (error) {
      console.log(error);
      m.reply("Si è verificato un errore durante l'invio del video.");
   }
};
handler.admin = true;
handler.command = ['top5'];
export default handler;