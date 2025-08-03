let handler = async (message, { conn }) => {
  const fineScuola = new Date('2025-06-10');
  const inizioScuola = new Date('2025-09-15');
  const oggi = new Date();
  let frase = '';

  if (oggi < fineScuola) {
    // Siamo ancora in periodo scolastico
    const diffMs = fineScuola - oggi;
    const giorniMancanti = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (giorniMancanti > 10) {
      frase = `📚 Mancano ancora *${giorniMancanti} giorni* alla fine della scuola... la libertà è lontana, soffri!`;
    } else if (giorniMancanti > 5) {
      frase = `⏳ Solo *${giorniMancanti} giorni* e potrai respirare di nuovo... ma non illuderti troppo!`;
    } else if (giorniMancanti > 1) {
      frase = `😈 *${giorniMancanti} giorni* alla fine... ormai sei in modalità sopravvivenza!`;
    } else if (giorniMancanti === 1) {
      frase = `🚨 È quasi finita... *domani* è l'ultimo giorno di scuola. Preparati a urlare di gioia (o di disperazione)!`;
    } else if (giorniMancanti === 0) {
      frase = `🎉 Oggi è l'*ultimo giorno di scuola*! Finalmente liberi (ma sempre sfigati). Goditi la pace finché dura!`;
    }
  } else if (oggi < inizioScuola) {
    // Siamo in vacanza estiva
    const diffMs = inizioScuola - oggi;
    const giorniMancanti = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const giorniDaFine = Math.ceil((oggi - fineScuola) / (1000 * 60 * 60 * 24));
    if (giorniMancanti > 30) {
      frase = `🏖️ La scuola è finita da *${giorniDaFine} giorni*. Goditi la libertà! Ancora *${giorniMancanti} giorni* di vacanza, ma il tempo vola...`;
    } else if (giorniMancanti > 15) {
      frase = `😎 Estate piena! *${giorniMancanti} giorni* e poi si torna all'inferno scolastico. Non pensare troppo, goditi ogni secondo!`;
    } else if (giorniMancanti > 7) {
      frase = `😱 Solo *${giorniMancanti} giorni* e la campanella ricomincia a suonare... l'ansia sale!`;
    } else if (giorniMancanti > 3) {
      frase = `⏰ Mancano *${giorniMancanti} giorni* all'inizio della scuola... ormai la fine delle vacanze è nell'aria!`;
    } else if (giorniMancanti > 0) {
      frase = `💀 *${giorniMancanti} giorni* e si torna tra i banchi... qualcuno ha già iniziato, tu goditi gli ultimi attimi!`;
    } else if (giorniMancanti === 0) {
      frase = `📚 Oggi si torna a scuola! Alcuni sono già dentro, tu forse no... ma la tua ora arriverà!`;
    }
  } else if (oggi.getDate() >= 10 && oggi.getDate() < 15 && oggi.getMonth() === 8) {
    // Tra il 10 e il 15 settembre
    frase = `😈 Alcuni hanno già iniziato la scuola... tu godi ancora, ma tra poco toccherà anche a te! L'ansia è nell'aria, la libertà sta finendo!`;
  } else {
    // Siamo in periodo scolastico successivo
    const fineScuolaProssima = new Date('2026-06-10');
    const diffMs = fineScuolaProssima - oggi;
    const giorniMancanti = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const giorniDaInizio = Math.ceil((oggi - inizioScuola) / (1000 * 60 * 60 * 24));
    if (giorniDaInizio < 7) {
      frase = `📚 La scuola è appena ricominciata da *${giorniDaInizio} giorni*. L'estate è solo un ricordo, ora si soffre! Mancano *${giorniMancanti} giorni* alla fine...`;
    } else if (giorniMancanti > 100) {
      frase = `😩 Sei dentro da *${giorniDaInizio} giorni*... la fine è lontana, ma non mollare!`;
    } else if (giorniMancanti > 30) {
      frase = `⏳ Mancano *${giorniMancanti} giorni* alla fine della scuola... la strada è lunga, ma ogni giorno è una conquista!`;
    } else if (giorniMancanti > 7) {
      frase = `😬 Solo *${giorniMancanti} giorni* e potrai di nuovo urlare "libertà!". Resisti!`;
    } else if (giorniMancanti > 1) {
      frase = `🔥 *${giorniMancanti} giorni* alla fine... ormai ci siamo, la fuga è vicina!`;
    } else if (giorniMancanti === 1) {
      frase = `🚨 Domani è l'ultimo giorno di scuola! Preparati a scappare!`;
    } else {
      frase = `🎉 Oggi è l'*ultimo giorno di scuola*! Finalmente liberi (ma sempre sfigati). Goditi la pace finché dura!`;
    }
  }

  conn.sendMessage(message.chat, {
    text: frase,
    contextInfo: {
      mentionedJid: [message.sender],
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363401234816773@newsletter',
        serverMessageId: '',
        newsletterName: 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!'
      }
    }
  });
};

handler.command = ['scuola'];
handler.tags = ['info'];
handler.help = ['scuola'];

export default handler;
