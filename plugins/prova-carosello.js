let handler = async (m, { conn, usedPrefix, command }) => {
  const sections = [{
    title: `Sezione del Menu`,
    rows: [
      { header: 'Sezione 1', title: "Comando 1", description: 'Descrizione 1', id: usedPrefix + "menu" },
      { header: 'Sezione 2', title: "Comando 2", description: 'Descrizione 2', id: usedPrefix + "ping" },
      { header: 'Sezione 3', title: "Comando 3", description: 'Descrizione 3', id: usedPrefix + "info" },
      { header: 'Sezione 4', title: "Comando 4", description: 'Descrizione 4', id: usedPrefix + "gruppi" },
    ],
  }]

  const messages = [
    [
      '🎡 Benvenuto nel carosello di esempio!',
      '💬 Questo è un footer di esempio',
      'https://telegra.ph/file/24b24c495b5384b218b2f.jpg',
      [['Apri Menu 📋', usedPrefix + 'menu'], ['Ping 🏓', usedPrefix + 'ping']],
      [['!menu'], ['!ping']],
      [['Visita il sito 🌐', 'https://example.com']],
      [['Lista Comandi', sections]]
    ],
    [
      '📦 Secondo carosello in arrivo!',
      '✨ Footer secondario',
      'https://telegra.ph/file/e9239fa926d3a2ef48df2.jpg',
      [['Info ℹ️', usedPrefix + 'info'], ['Gruppi 🧑‍🤝‍🧑', usedPrefix + 'gruppi']],
      [['!info'], ['!gruppi']],
      [['Supporto', 'https://example.com/support']],
      [['Comandi Avanzati', sections]]
    ]
  ]

  // Se la funzione sendCarousel esiste (Phishy)
  if (typeof conn.sendCarousel === 'function') {
    await conn.sendCarousel(m.chat, '📲 Carosello Attivo', '🧪 Test Carousel Multi-Bot', '🚀 Carosello', messages, m)
  } else {
    // Versione adattata per whiskeysockets senza carosello
    await conn.sendMessage(m.chat, {
      text: '📲 Carosello non supportato in questa versione del bot.\nEcco un esempio alternativo:',
      footer: '🧪 Compatibilità automatica',
      buttons: [
        { buttonId: usedPrefix + 'menu', buttonText: { displayText: 'Apri Menu 📋' }, type: 1 },
        { buttonId: usedPrefix + 'ping', buttonText: { displayText: 'Ping 🏓' }, type: 1 }
      ],
      headerType: 4,
      image: { url: 'https://telegra.ph/file/24b24c495b5384b218b2f.jpg' }
    }, { quoted: m })
  }
}

handler.command = /^(carosello)$/i
export default handler
