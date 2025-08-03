const handler = async (m, { conn, command, text }) => {
  const lovePercentage = Math.floor(Math.random() * 100);
  const isHighLove = lovePercentage >= 50;
  const loveMessages = [
    "Questo è un amore ardente e appassionato! Vai e diglielo subito!",
    "Sembra che ci sia una scintilla tra voi due. Prova!",
    "Potrebbe esserci qualcosa di speciale qui. Dagli una possibilità!",
    "Hmm, l'amore è nell'aria. Forse è ora di un caffè insieme!",
    "Le stelle indicano che c'è un potenziale romantico. Fai una mossa!",
    "Una storia d'amore incredibile potrebbe aspettare di essere scritta da voi.",
    "Non sottovalutare il potere del tempo e della pazienza nell'amore. Grandi cose possono accadere.",
    "Ricorda che l'amore è un viaggio e ogni passo è prezioso, indipendentemente dalla distanza.",
    "Le connessioni forti possono diventare relazioni meravigliose. Continua a esplorare!",
    "Il vero amore richiede spesso tempo e sforzo. Non rinunciare!",
  ];
  const notSoHighLoveMessages = [
    "A volte, l'amicizia è l'inizio di qualcosa di bello, ma non sempre si trasforma in amore.",
    "L'amore non è tutto, anche l'amicizia è fantastica! Mantieni la tua amicizia speciale.",
    "Ricorda che le migliori relazioni iniziano con una buona amicizia. Non sottovalutare il tuo legame!",
    "A volte, l'amore può crescere con il tempo. Continua a rafforzare la tua connessione!",
    "La vita è una sorpresa, chi sa cosa riserva il futuro! Non perdere la speranza.",
    "Anche se l'amore non sboccia come speravi, la tua connessione rimane preziosa.",
    "I cuori possono impiegare del tempo per sincronizzarsi, ma questo non diminuisce quanto siete speciali insieme.",
    "Nonostante le sfide dell'amore, la tua amicizia è un dono che merita di essere celebrato.",
    "Il tempo può rivelare cose sorprendenti. Continuiamo a esplorare insieme!",
    "La vita è piena di svolte inaspettate. Rimani aperto alle possibilità!",
  ];
  const loveDescription = isHighLove ? "hanno una connessione profonda e un amore" : "hanno una connessione speciale, anche se l'amore ha una percentuale di";
  const getRandomMessage = (messages) => messages[Math.floor(Math.random() * messages.length)];
  const loveMessage = isHighLove ? getRandomMessage(loveMessages) : getRandomMessage(notSoHighLoveMessages);
  const response =
    `━━━━⬣ ☆𝗔𝗠𝗢𝗥𝗘☆ ⬣━━━━\n` +
    `*❥ ✦Nel universo dell'amore, ${text} e @${m.sender.split('@')[0]} ${loveDescription} del ${lovePercentage}%*\n\n` +
    `*❥ ✦${loveMessage}*\n` +
    `━━━⬣ ☆𝗔𝗠𝗢𝗥𝗘☆ ⬣━━━━`    

  async function loading() {
var hawemod = [
"《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
"《 ████▒▒▒▒▒▒▒▒》30%",
"《 ███████▒▒▒▒▒》50%",
"《 ██████████▒▒》80%",
"《 ████████████》100%"
]
   let { key } = await conn.sendMessage(m.chat, {text: `💘 ¡☆𝗜𝗻𝗶𝘇𝗶𝗮 𝗶𝗹 𝗰𝗮𝗹𝗰𝗼𝗹𝗼 𝗱𝗲𝗹𝗹'𝗮𝗺𝗼𝗿𝗲☆! 💘`, mentions: conn.parseMention(response)}, {quoted: m})
 for (let i = 0; i < hawemod.length; i++) {
   await new Promise(resolve => setTimeout(resolve, 1000)); 
   await conn.sendMessage(m.chat, {text: hawemod[i], edit: key, mentions: conn.parseMention(response)}, {quoted: m}); 
  }
  await conn.sendMessage(m.chat, {text: response, edit: key, mentions: conn.parseMention(response)}, {quoted: m});         
 }
loading()    
};
handler.help = ['love'];
handler.tags = ['fun'];
handler.command = /^(love|amore)$/i;
export default handler;
