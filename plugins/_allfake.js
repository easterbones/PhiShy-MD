import fetch from 'node-fetch'

const thumbnails = [
   'https://i.pinimg.com/736x/3a/b9/0b/3ab90b7ef141837e9eef90424f58e1b4.jpg',
        'https://th.bing.com/th/id/OIP.jWEM7d4i8Y8lIH_IkN92wQHaEK?rs=1&pid=ImgDetMain',
        'https://wallpapers.com/images/hd/anime-girl-evil-smile-26uoopezlf24c1tk.jpg',
        'https://th.bing.com/th/id/OIP.XKDQtTn0HopB0HUfPDp6UgHaFl?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.tbLEUd6wVSX72EqEm1v8_AAAAA?rs=1&pid=ImgDetMain',
        'https://static.fandomspot.com/images/01/11415/00-featured-krul-tepes-anime-throne-villain-girl-750x350.jpg',
        'https://i.pinimg.com/originals/85/df/94/85df94d847a91f2b9e571ae3bb644de8.jpg',
        'https://th.bing.com/th/id/OIP.g3iw20vBQdQ5tYXjkNfoCAHaEK?r=0&rs=1&pid=ImgDetMain',
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

// Inizializzazione GLOBALE (viene eseguita all'avvio)
global.rcanal = {
    contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363401234816773@newsletter",
            serverMessageId: 100,
            newsletterName: '𝘣𝘰𝘵 𝘶𝘱𝘥𝘢𝘵𝘦𝘴 🎌'
        },
        externalAdReply: {
            title: '[ ⚠ ] 𝐄𝐑𝐑𝐎𝐑𝐄',
            body: 'sei stato inculato',
            thumbnailUrl: randomThumbnail,
            mediaType: 1,
            renderLargerThumbnail: true
        }
    },
    quoted: {
        key: { 
            fromMe: false, 
            id: "muted", 
            participant: "0@s.whatsapp.net" 
        },
        message: {
            locationMessage: {
                name: "𓅰 𓅬 𓅭 𓅮 𓅯",
                jpegThumbnail: ""
            }
        }
    }
};

global.adReply = {
    contextInfo: { 
        forwardingScore: 9999, 
        isForwarded: false, 
        externalAdReply: {
            showAdAttribution: true,
            title: 'ciao',
            body: 'cohones',
            mediaUrl: null,
            description: null,
            previewType: "PHOTO",
            thumbnailUrl: randomThumbnail,
            thumbnail: randomThumbnail,
            sourceUrl: 'https://www.tiktok.com/@viridi.celesti',
            mediaType: 1,
            renderLargerThumbnail: true
        }
    }
};

export default global.rcanal;