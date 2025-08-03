import fetch from 'node-fetch'

const thumbnails = [
    'https://tse1.mm.bing.net/th/id/OIP.a5Oa6J5yz_KosRt6H3e1CwHaIO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://tse2.mm.bing.net/th/id/OIP.uiDjhfqNj2kCoy-01onINgHaDt?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://tse4.mm.bing.net/th/id/OIP.f1QlmL0cwaWGoMYq1CwaywHaD4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://tse4.mm.bing.net/th/id/OIP.PgwrAQVEpHNd1YBKVaA_HQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://whatnerd.com/wp-content/uploads/2021/06/popular-anime-female-characters-black-clover-charmy.jpg',
    'https://whatnerd.com/wp-content/uploads/2021/06/popular-anime-female-characters-demon-slayer-insect-pillar-shinobu-kocho.jpg',
    'https://whatnerd.com/wp-content/uploads/2023/04/most-popular-female-anime-characters-makima-chainsaw-man.jpg',
    'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/03/Anya-Forger-Spy-x-Family-Excited.jpg',
    'https://th.bing.com/th/id/OIP.1Nrvs6RMTC_UwYoMf4PhBQHaM9?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://tse3.mm.bing.net/th/id/OIP.lwDuDPbZAo6YXwne31D9KQHaGN?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    'https://tse1.mm.bing.net/th/id/OIP.ttQg-Jgj0TMI6JNabif3SAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

global.phishy = {
    contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363391446013555@newsletter",
            serverMessageId: 101,
            newsletterName: '𝘱𝘩𝘪𝘴𝘩𝘺 𝘮𝘰𝘰𝘥 🎭'
        },
        externalAdReply: {
            title: 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!',
            body: '𝙥𝙤𝙬𝙚𝙧𝙚𝙙 𝙗𝙮 ® 𓊈ҽαʂƚҽɾ𓊉𓆇𓃹',
            mediaType: 1,
            thumbnailUrl: randomThumbnail,
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
                name: "𓆩 Pʜɪꜱʜʏ 𓆪",
                jpegThumbnail: ""
            }
        }
    }
};

global.adReplyPhishy = {
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

export default global.phishy;
