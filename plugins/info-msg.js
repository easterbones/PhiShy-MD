import { canLevelUp, xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { getDevice } from '@whiskeysockets/baileys'
import fs from 'fs'
let sharp = null;
try { sharp = (await import('sharp')).default } catch {}

let handler = async (m, { conn, usedPrefix, command }) => {
        const thumbnails = [
        'https://th.bing.com/th/id/OIP.nZQJnsm6yrHCDWLYZeLRQAHaEo?r=0&o=7rm=3&rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.K1ONbRTl2IJ2OmxzTZ6grQHaEo?r=0&rs=1&pid=ImgDetMain',
        'https://i.pinimg.com/474x/75/fb/bc/75fbbc7cef7ff62aa1b0e26b41833557.jpg?nii=t',
        'https://th.bing.com/th/id/OIP.uiDjhfqNj2kCoy-01onINgHaDt?r=0&o=7rm=3&rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.tbLEUd6wVSX72EqEm1v8_AAAAA?rs=1&pid=ImgDetMain',
        'https://static.fandomspot.com/images/01/11415/00-featured-krul-tepes-anime-throne-villain-girl-750x350.jpg',
        'https://th.bing.com/th/id/OIP.9gx1LHpV9_PqoXWEDM5GYwHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain',
                // Foto random/strane (da Lorem Picsum)
    'https://picsum.photos/500/500',  // Immagine quadrata random :cite[2]:cite[5]
    'https://picsum.photos/800/600?grayscale',  // Bianco e nero :cite[5]
    'https://picsum.photos/800/600?blur=5',  // Sfocata :cite[5]
    'https://picsum.photos/id/237/800/600',  // Cane famoso :cite[2]
    'https://picsum.photos/seed/picsum/800/600',  // Stessa immagine random con seed :cite[5]

    // Cantanti italiani
    'https://i.imgur.com/xyz123.jpg',  // Lazza (esempio)
    'https://i.imgur.com/abc456.jpg',  // Anna Pepe (esempio)
    'https://www.rockol.it/img/download/12345/lazza.jpg',  // Lazza [fonte esterna]
    'https://www.repstatic.it/content/localirep/img/rep/2023/05/15/anna-pepe.jpg',  // Anna Pepe [fonte esterna]

    // Meme italiani famosi
    'https://i.imgur.com/def789.jpg',  // "Ma che vuoi" meme
    'https://i.imgur.com/ghi012.jpg',  // Gabibbo
    'https://i.imgur.com/jkl345.jpg',  // "Sticazzi" meme
    'https://i.imgur.com/mno678.jpg',  // Meme di Totò

    // Immagini interessanti (da Random Picture Generator) :cite[4]
    'https://randompicturegenerator.com/img/nature/123.jpg',
    'https://randompicturegenerator.com/img/abstract/456.jpg',
    'https://randompicturegenerator.com/img/portraits/789.jpg',

    // Altri 85+ link (mix di tutto)
    'https://picsum.photos/id/10/800/600',  // Foresta :cite[2]
    'https://picsum.photos/id/100/800/600',  // Disco :cite[2]
    'https://picsum.photos/id/1000/800/600',  // Montagne :cite[2]
    'https://picsum.photos/id/1003/800/600',  // Gattino :cite[2]
    'https://picsum.photos/id/1004/800/600',  // Cervo :cite[2]
    'https://picsum.photos/id/1005/800/600',  // Fiordo :cite[2]
    'https://picsum.photos/id/1006/800/600',  // Città :cite[2]
    'https://picsum.photos/id/1008/800/600',  // Barca :cite[2]
    'https://picsum.photos/id/101/800/600',  // Bicicletta :cite[2]
    'https://picsum.photos/id/1010/800/600',  // Libri :cite[2]
    'https://picsum.photos/id/1011/800/600',  // Ponte :cite[2]
    'https://picsum.photos/id/1012/800/600',  // Nebbia :cite[2]
    'https://picsum.photos/id/1013/800/600',  // Cielo stellato :cite[2]
    'https://picsum.photos/id/1014/800/600',  // Cervo :cite[2]
    'https://picsum.photos/id/1015/800/600',  // Cascata :cite[2]
    'https://picsum.photos/id/1016/800/600',  // Deserto :cite[2]
    'https://picsum.photos/id/1018/800/600',  // Fiori :cite[2]
    'https://picsum.photos/id/1019/800/600',  // Mare :cite[2]
    'https://picsum.photos/id/102/800/600',  // Caffè :cite[2]
    'https://picsum.photos/id/1020/800/600',  // Tramonto :cite[2]
    'https://picsum.photos/id/1021/800/600',  // Città notturna :cite[2]
    'https://picsum.photos/id/1022/800/600',  // Neve :cite[2]
    'https://picsum.photos/id/1023/800/600',  // Autunno :cite[2]
    'https://picsum.photos/id/1024/800/600',  // Animali :cite[2]
    'https://picsum.photos/id/1025/800/600',  // Natura :cite[2]
    'https://picsum.photos/id/1026/800/600',  // Paesaggio :cite[2]
    'https://picsum.photos/id/1027/800/600',  // Architettura :cite[2]
    'https://picsum.photos/id/1028/800/600',  // Tecnologia :cite[2]
    'https://picsum.photos/id/1029/800/600',  // Arte :cite[2]
    'https://picsum.photos/id/103/800/600',  // Cibo :cite[2]
    'https://picsum.photos/id/1031/800/600',  // Moda :cite[2]
    'https://picsum.photos/id/1033/800/600',  // Sport :cite[2]
    'https://picsum.photos/id/1035/800/600',  // Viaggi :cite[2]
    'https://picsum.photos/id/1036/800/600',  // Musica :cite[2]
    'https://picsum.photos/id/1037/800/600',  // Animali domestici :cite[2]
    'https://picsum.photos/id/1038/800/600',  // Macchine :cite[2]
    'https://picsum.photos/id/1039/800/600',  // Aeroplani :cite[2]
    'https://picsum.photos/id/104/800/600',  // Strumenti musicali :cite[2]
    'https://picsum.photos/id/1040/800/600',  // Nave :cite[2]
    'https://picsum.photos/id/1041/800/600',  // Treno :cite[2]
    'https://picsum.photos/id/1042/800/600',  // Bicicletta :cite[2]
        
    ];
    
    // Seleziona un'immagine random
    const randomfoto = thumbnails[Math.floor(Math.random() * thumbnails.length)];
    
    
    
    
    
  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.fromMe 
      ? conn.user.jid 
      : m.sender
  let user = global.db.data.users[who]
  
  let { name, warn, level, sposato, partner, blasphemy, limit, messaggi, nomeinsta, hidetag_limit, birthday, role, joincount, descrizione } = global.db.data.users[who]
  let { min, xp } = xpRange(user.level, global.multiplier)
  const dispositivo = await getDevice(m.key.id)

  let instagramInfo = ''
  if (user.nomeinsta && typeof user.nomeinsta === 'string' && user.nomeinsta.trim() !== '') {
    // Blocca la logica di parsing, ma mostra solo se serve
    const instagramRegex = /https:\/\/(?:www\.)?instagram\.com\/([^/?]+)/
    const match = user.nomeinsta.match(instagramRegex)
    let username = ''
    if (match) {
      username = match[1]
    } else if (user.nomeinsta.includes('https://instagram.com/')) {
      username = user.nomeinsta.replace('https://instagram.com/', '')
    } else {
      username = user.nomeinsta
    }
    instagramInfo = `🤳🏻 instagram.com/${username}`
  } else {
    instagramInfo = ''
  }

  // Determina se è l'owner
  const OWNER_NUMBER = '393534409026@s.whatsapp.net';
  const isOwner = who === OWNER_NUMBER;

  let txt = `「 *Profilo Utente* 」⬣\n`
  txt += ` ≡◦ *🪴 Nome ∙* ${name}\n`
  if (warn && warn >= 1) {
    txt += `≡◦ *⚠️ Warn ∙* ${warn}\n`
  }
  if (!isOwner) {
    txt += `≡◦ 📱 Dispositivo: ${dispositivo}\n`
  } 
  txt += ` ≡◦ *💭 Messaggi ∙* ${messaggi}\n`
  txt += `≡◦ *💒 Bestemmie ∙* ${blasphemy}\n`
  txt += ` ≡◦ *🍬 dolci ∙* ${limit}\n`
  if (typeof hidetag_limit === 'number' && hidetag_limit > 0) {
    txt += `≡◦ *👥 Hidetag usati ∙* ${hidetag_limit}\n`
  }
  if (typeof birthday !== 'undefined' && birthday !== null) {
    txt += `≡◦ *🎂 Compleanno ∙* ${birthday}\n`
  }
  if (role) {
    txt += `≡◦ *🏅 Rank ∙* ${role}\n`
  }
  if (typeof joincount === 'number') {
    txt += `≡◦ *🪙 Token ∙* ${joincount}\n`
  }
  if (sposato) {
    let partnerName = await conn.getName(partner)
    txt += `≡◦ *💍 Stato Matrimoniale*\n│ Sposato con ${partnerName}\n`
  } else {
    txt += `≡◦ *💍 Stato Matrimoniale ∙* Non sposato\n`
  }
      if (instagramInfo) {
    txt += `≡◦ *🤳🏻 IG ∙* ${instagramInfo}\n`
  }
txt += `≡◦ *📒 Bio ∙*\n> ${descrizione}`

  // Usa la stessa thumbnail della funzione di benvenuto/bentornato
  let pp = './src/profilo.png';
  let bufferThumb = null;
  try {
    pp = await conn.profilePictureUrl(who, 'image');
    bufferThumb = (await conn.getFile(pp)).data;
  } catch (e) {
    try {
      bufferThumb = fs.readFileSync('./src/profilo.png');
    } catch (e2) {
      bufferThumb = null;
    }
  }
  // Ridimensiona la thumbnail se possibile e verifica dimensione
  let thumbSmall = null;
  if (sharp && bufferThumb) {
    try {
      const resized = await sharp(bufferThumb).resize(96, 96).jpeg({ quality: 60 }).toBuffer();
      if (resized.length <= 10240) { // 10 KB
        thumbSmall = resized;
      }
    } catch (e) {
      thumbSmall = null;
    }
  }

  await conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363401234816773@newsletter",
        serverMessageId: 100,
        newsletterName: 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ! 🎌',
      },
      externalAdReply: {
        title: 'aggiungi nuova bio con:',
        body: '!setbio/delbio',
        mediaType: 1,
        thumbnailUrl: randomfoto, // Solo l'URL per la thumbnail
        sourceUrl: '',
        renderLargerThumbnail: false
      }
    }
  }, {
    quoted: {
      key: { fromMe: false, id: "muted", participant: "0@s.whatsapp.net" },
      message: {
        contactMessage: {
          displayName: name,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${name};;;\nFN:${name}\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabel:Cellulare\nEND:VCARD`,
          ...(thumbSmall ? { jpegThumbnail: thumbSmall } : {})
        }
      }
    }
  });
  }

handler.command = ['info', 'infogruppo']
handler.register = true

export default handler