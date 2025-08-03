import fetch from 'node-fetch';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Array di frutti del diavolo di One Piece con descrizioni e link
const devilFruits = {
  "Gomu Gomu no Mi": {
    description: "Un frutto che permette di diventare elastici come la gomma, donando al consumatore la capacità di allungare il proprio corpo come un elastico.",
    gif: "https://th.bing.com/th/id/R.9ad3353fd77afc4628a9f956c266b82a?rik=Gprj5%2bQE1XikAw&pid=ImgRaw&r=0"
  },
  "Mera Mera no Mi": {
    description: "Un frutto che regala il potere di creare e controllare il fuoco, rendendo il consumatore un essere infuocato.",
    gif: "https://gifdb.com/images/high/one-piece-ace-flaming-finger-6tc733xbyjs5l1ue.gif"
  },
  "Hito Hito no Mi": {
    description: "Un frutto che trasforma il consumatore in un essere umano o ne potenzia le capacità umane. La versione di Chopper lo ha reso un umano-renna intelligente.",
    gif: "https://th.bing.com/th/id/R.3ab4da41b579a8d530c744d59e1cbf11?rik=blsTNODNaCQ9Og&pid=ImgRaw&r=0"
  },
  "Gura Gura no Mi": {
    description: "Un frutto che conferisce il potere di creare terremoti e distruggere intere isole con la sola forza delle vibrazioni.",
    gif: "https://pa1.narvii.com/6347/1da2264ac8792d3acb89b543f0a649feb2d582f2_hq.gif"
  },
  "Ope Ope no Mi": {
    description: "Un frutto che permette di creare una 'stanza' in cui il consumatore può manipolare tutto ciò che si trova al suo interno, perfino i corpi delle persone.",
    gif: "https://media.tenor.com/zG92YYM63yoAAAAd/trafalgar-law-one-piece.gif"
  },
  "Yami Yami no Mi": {
    description: "Un frutto che dona il potere di controllare l'oscurità e annullare i poteri degli altri frutti del diavolo, rendendolo uno dei più potenti.",
    gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXBpdnpjdjUwaHZqNHQwM3Q1YXc4Z2RyM2V5OHl0a2I2eHA3OXJrbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VwpkFDijz3Bny/giphy.gif"
  },
  "Soru Soru no Mi": {
    description: "Un frutto che permette di manipolare e creare anime, donando al consumatore il potere di controllare gli spiriti e creare ombre viventi.",
    gif: "https://media1.tenor.com/m/f5QDJuedRewAAAAd/one-piece-carmel.gif"
  },
  "Magu Magu no Mi": {
    description: "Un frutto che conferisce il potere di creare e controllare il magma, rendendo il consumatore un essere vulcanico.",
    gif: "https://media1.tenor.com/m/BkdovPXB-CcAAAAd/one-piece-akainu.gif"
  },
  "Pika Pika no Mi": {
    description: "Un frutto che dona il potere di muoversi alla velocità della luce e di creare esplosioni luminose.",
    gif: "https://media1.tenor.com/m/X5GEgosD93UAAAAC/kizaru-one-piece.gif"
  },
  "Zushi Zushi no Mi": {
    description: "Un frutto che permette di manipolare la gravità, rendendo il consumatore in grado di schiacciare i nemici con una forza immensa.",
    gif: "https://media1.tenor.com/m/4_nbqljLK7QAAAAd/one-piece-one-piece-stampede.gif"
  },
  "Bara Bara no Mi": {
    description: "Un frutto che permette di dividere il proprio corpo in parti separate, rendendo il consumatore immune ai tagli e ai colpi di spada.",
    gif: "https://media.tenor.com/bpVU9gqVmi0AAAAC/buggy-one-piece.gif"
  },
  "Suke Suke no Mi": {
    description: "Un frutto che conferisce il potere di diventare invisibile, rendendo il consumatore introvabile agli occhi degli altri.",
    gif: "https://th.bing.com/th/id/OIP.TxbGOisf4eRvVfrIAQZkkwAAAA?rs=1&pid=ImgDetMain"
  },
  "Doru Doru no Mi": {
    description: "Un frutto che permette di creare e manipolare la cera, rendendo il consumatore in grado di costruire armi e barriere.",
    gif: "https://media1.tenor.com/m/RIcW9zpVekAAAAAC/mr3.gif"
  },
  "Horu Horu no Mi": {
    description: "Un frutto che dona il potere di creare ormoni e manipolare il corpo umano, curando ferite o potenziando le capacità fisiche.",
    gif: "https://media1.tenor.com/m/2DT5vSzt-xMAAAAC/one-piece-one-piece-fan-letter.gif"
  },
  "Kage Kage no Mi": {
    description: "Un frutto che permette di manipolare le ombre, rubandole alle persone e utilizzandole per creare zombie o potenziare se stessi.",
    gif: "https://media1.tenor.com/m/Pv5MPpqh5yUAAAAd/one-piece-gecko-moria.gif"
  },
  "Mero Mero no Mi": {
    description: "Un frutto che conferisce il potere di pietrificare chiunque provi sentimenti romantici o di attrazione verso il consumatore.",
    gif: "https://media1.tenor.com/m/LX9OTsXRFBEAAAAd/one-piece-boa-hancock.gif"
  },
  "Nikyu Nikyu no Mi": {
    description: "Un frutto che dona il potere di respingere qualsiasi cosa, inclusi oggetti, persone e persino il dolore.",
    gif: "https://media1.tenor.com/m/_0f8KyOtFoAAAAAC/bartholomeo-kuma-kuma.gif"
  },
  "Goro Goro no Mi": {
    description: "Un frutto che conferisce il potere di creare e controllare l'elettricità, rendendo il consumatore un essere fulminante.",
    gif: "https://media1.tenor.com/m/xT7N-0TDLQYAAAAC/one-piece-enel.gif"
  },
  "Ito Ito no Mi": {
    description: "Un frutto che permette di creare e manipolare fili indistruttibili, utilizzabili per controllare i movimenti degli altri o creare strutture complesse.",
    gif: "https://media1.tenor.com/m/TSOdQcKUufcAAAAC/doflamingo-dofi.gif"
  },
  "Fuku Fuku no Mi": {
    description: "Un frutto che dona il potere di creare e manipolare abiti, trasformandoli in armi o strumenti utili.",
    gif: "https://media1.tenor.com/m/FY7HMwDGs5EAAAAd/kinemon.gif"
  },
  "Hana Hana no Mi": {
    description: "Un frutto che permette di far spuntare parti del corpo su qualsiasi superficie, rendendo il consumatore in grado di attaccare da qualsiasi direzione.",
    gif: "https://media1.tenor.com/m/OJwwhf3Z958AAAAd/nico-robin.gif"
  }
};

const handler = async (m, { conn, command }) => {
  if (!m.isGroup) return;

  let selfUser = `@${m.sender.split('@')[0]}`; // Utente che invia il comando
  let targetUser = null;

  if (m.mentionedJid.length) {
    // Se qualcuno è stato taggato, prende il primo taggato
    targetUser = `@${m.mentionedJid[0].split('@')[0]}`;
  }

  const fruits = Object.keys(devilFruits);
  const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
  const { description, gif } = devilFruits[randomFruit];

  if (!gif) {
    return m.reply("⚠️ Il link per questo frutto del diavolo non è stato configurato. Contatta l'amministratore del bot.");
  }

  // Costruisci il messaggio in base al comando utilizzato
  let message;
  if (command === 'frutto') {
    message = `🍎 ${selfUser} hai mangiato il frutto del diavolo *${randomFruit}*!\n\n📖 *Descrizione*: ${description}`;
  } else if (command === 'sfida') {
    if (!targetUser) {
      return m.reply("⚠️ Devi taggare un utente per usare la mossa del frutto del diavolo!");
    }
    message = `💥 ${selfUser} ha usato la mossa del *${randomFruit}* su di ${targetUser}!\n\n📖 *Descrizione*: ${description}`;
  }

  try {
    // Scarica la GIF
    const response = await fetch(gif);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync('temp.gif', buffer);

    // Converti la GIF in MP4 usando ffmpeg
    await execAsync('ffmpeg -i temp.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" temp.mp4');

    // Invia il video come GIF animata
    await conn.sendMessage(m.chat, {
      video: { url: 'temp.mp4' },
      caption: message,
      mentions: targetUser ? [m.mentionedJid[0], m.sender] : [m.sender], // Corretto: rimossa la parentesi quadra extra
      gifPlayback: true // Forza WhatsApp a visualizzarlo come GIF
    });

    // Elimina i file temporanei
    fs.unlinkSync('temp.gif');
    fs.unlinkSync('temp.mp4');
  } catch (error) {
    console.error("Errore durante la conversione o l'invio della GIF:", error);
    m.reply("⚠️ Si è verificato un errore durante l'invio della GIF.");
  }
};

handler.help = ['frutto', 'sfida @utente'];
handler.tags = ['fun'];
handler.command = ['frutto', 'sfida'];

export default handler;