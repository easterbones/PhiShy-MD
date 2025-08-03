const handler = async (m, { conn }) => {
  const jid = m.chat;

  const cards = [
    {
      image: { url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/RedCat_8727.jpg' },
      title: '🐱 Gatto Leggendario',
      body: 'Un animale misterioso con poteri magici. Collezionalo ora!',
      footer: 'Disponibile solo oggi!',
      buttons: [
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: 'Adotta Ora',
            id: 'adopt_cat'
          })
        },
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: 'Scopri di Più',
            url: 'https://img.fotocommunity.com/madame-la-cane-e9c63fcf-8196-4203-824f-951a897ddc81.jpg?width=1000'
          })
        }
      ]
    },
    {
      image: { url: 'https://tse1.mm.bing.net/th/id/OIP.jF6NjfErdBNF7MOytOpAJwAAAA?r=0&cb=thvnextc1&rs=1&pid=ImgDetMain&o=7&rm=3' },
      title: '🎁 Pacco Premium',
      body: 'Include pozioni rare, vite bonus e oggetti esclusivi.',
      footer: 'Contenuti disponibili in edizione limitata.',
      buttons: [
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: 'Apri Pacco',
            id: 'open_box'
          })
        },
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: 'Vai allo Shop',
            url: 'https://tse1.mm.bing.net/th/id/OIP.jF6NjfErdBNF7MOytOpAJwAAAA?r=0&cb=thvnextc1&rs=1&pid=ImgDetMain&o=7&rm=3'
          })
        }
      ]
    }
  ];

  await conn.sendMessage(jid, {
    text: '🎉 Benvenuto nel negozio Phishy!',
    title: '🛒 Shop Speciale',
    subtile: 'Offerte limitate disponibili',
    footer: 'Clicca una carta per interagire',
    cards
  });
};

handler.command = ['shoptest', 'testcards'];
export default handler;
