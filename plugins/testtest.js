import fetch from 'node-fetch'

let handler = async (m, { groupMetadata }) => {
   let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   
   global.rcanal = {
      contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
            newsletterJid: "120363391446013555@newsletter",
            serverMessageId: 100,
            newsletterName: 'viridi - meme 🎌',
         },
         externalAdReply: {
            showAdAttribution: true,
            title: 'Gia che ci sei',
            body: 'Seguici e posta i nostri video',
            mediaUrl: null,
            description: '',
            previewType: "PHOTO",
            thumbnailUrl: 'https://i.ibb.co/SD1vv3xG/file.jpg',
            sourceUrl: 'https://www.tiktok.com/@viridi.celesti?_t=ZN-8tdUIAxqAyM&_r=1',
            mediaType: 1,
            renderLargerThumbnail: false
         },
      },
   }

   let img = 'https://i.ibb.co/SD1vv3xG/file.jpg' 
   global.adReply = {
      contextInfo: { 
         forwardingScore: 9999, 
         isForwarded: false, 
         externalAdReply: {
            showAdAttribution: true,
            title: 'Ciao',
            body: 'Cohones',
            mediaUrl: null,
            description: null,
            previewType: "PHOTO",
            thumbnailUrl: img,
            thumbnail: img,
            sourceUrl: 'https://www.tiktok.com/@viridi.celesti?_t=ZN-8tdUIAxqAyM&_r=1',
            mediaType: 1,
            renderLargerThumbnail: true
         }
      }
   }

   await m.reply(`
DOCUMENTAZIONE SUI VARI NOMI DEL GERGO SU WHATSAPP:

ZOZZAP - WhatsApp modificato con funzioni extra.
ZOZZAPER - Hacker o esperto di sicurezza su WhatsApp.
MEME - Troll che si finge Zozzaper.
RANDOM - Utente comune di WhatsApp.
VOIP - Numero virtuale senza SIM.
BUZON - Tecnica per rubare numeri di telefono.

Segui il nostro canale per altri aggiornamenti:
`, rcanal, { mentions: [who] })
}

handler.help = ['doc']
handler.command = ['doct']

export default handler
