const handler = async (m, { text }) => {
      if (m.key.fromMe) return; // Se il messaggio proviene dal bot, non eseguire il comando
  let responses = [];

  if (/secondo me/i.test(text)) {
    responses = [
      `secondo me sì`,
      `secondo me no`,
      `e io che cavolo ne so`,
      `secondo me è una stronzata`,
      `secondo me potresti provare`,
      `secondo me hai ragione`,
      `secondo me sei fuori`,
      `secondo me ti conviene`,
      `secondo me ti stai facendo troppe domande`,
      `secondo me devi fartelo dire da qualcun altro`
    ];
  } else if (/devo/i.test(text)) {
    responses = [
      `devi farlo assolutamente`,
      `non lo farei se fossi in te`,
      `ti conviene pensarci bene`,
      `meglio di no`,
      `non ne vale la pena`,
      `fallo e basta`,
      `saresti un coglione se non lo facessi`,
      `fatti coraggio e fallo`,
      `se non lo fai sei un pollo`,
      `puoi provarci, ma non garantisco niente`,
      `cosa devi fare tu?`,
      `devi chiedere a qualcun altro`,
      `dovresti invece farti i cazzi tuoi`,
      `devi chiedere a Lory, lei lo sa`,
      `devi farti una vita`,
      `devi chiedere a Google, non a me`,
      `devi chiedere a tua nonna, lei lo sa`,
      `devi chiedere a qualcuno che non sia deficente`,
      `nah bro non devi`,
      `devi devo devi, ma chi credi di essere?`
    ];
  } else if (/cosa/i.test(text)) {
    responses = [
      `per me è la cipolla`,
      `AHAHAHAH`,
      `non ho capito bene, ripeti`,
      `nessun commento`,
      `dipende da cosa intendi`,
      `boh`,
      `chiedilo a tua nonna`,
      `non posso rispondere a questa`,
      `non lo so, chiedi a Google`,
      `chiedilo a Lory, lei lo sa`,
      `la cacca rosa`,
      `non so cosa ma qualcosa`,
      `non lo so, ma non è importante`,
      `non lo so, ma non è un problema mio`,
      `non lo so, ma non mi interessa`,
      `ce qualcosa che non cosa`,
      `cosa cosa cosa?`,
      `cosa cosa cosa cosa?`,
      `cosa cosa cosa cosa cosa?`,
      `cosa cosa cosa cosa cosa cosa?`  

    ];
  } else if (/parere|opinione|pareri/i.test(text)) {
    responses = [
      `io dico di sì`,
      `assolutamente no`,
      `in teoria sì`,
      `dubito fortemente`,
      `può darsi`,
      `probabilmente no`,
      `senza ombra di dubbio`,
      `non ne sono convinto`,
      `non ho la minima idea`,
      `non scommetterei su questo`,
      `zio non ce ne frega niente`,
      `non mi interessa affatto`,
      `non è affar mio`,
      `non mi riguarda`,
      `non mi interessa la tua opinione`,
      `non mi interessa il tuo parere`,
      `non mi interessa cosa ne pensi`,
      `non mi interessa cosa ne dici`,
      `non mi interessa cosa ne pensano gli altri`,
      `stai zitto che non ci interessa`
    ];
  } else {
    responses = [
      `forse`,
      `può darsi`,
      `è difficile dirlo`,
      `non penso proprio`,
      `mai nella vita`,
      `non ne sono sicuro`,
      `non vedo come`,
      `ho i miei dubbi`,
      `è una possibilità`,
      `non lo so con certezza`,
      `è complicato`,
      `potrebbe essere un'opzione`,
      `dipende da molti fattori`,
      `non lo sappiamo fino a quando non succede`,
      `non posso dirtelo con certezza`,
      `non ne ho idea`,
      `non è garantito`,
      `non ci contare troppo`,
      `non ti darei molte speranze`,
      `non ci metterei la mano sul fuoco`,
      `scappa da qui`,
      `cambia argomento`,
      `non è il momento giusto`,
      `non è il posto giusto`,
      `non è la persona giusta`,
      `non è la situazione giusta`,
      `non è il giorno giusto`,
      `non è l'ora giusta`,
      `non è il mese giusto`,
      `non è l'anno giusto`,
      `non è il momento giusto per parlarne`,
      `non è il momento giusto per pensarci`,
      `non è il momento giusto per farlo`,
    ];
  }

  // Risposte fantasiose rare
  const rare = [
    `sì, quando il ghiaccio diventa caldo`,
    `probabilmente quando il Papa diventa ateo`,
    `è come trovare un dinosauro nel tuo giardino`,
    `certo, quando le tartarughe vincono una gara di velocità`,
    `chiaro, quando i pinguini impareranno a volare`,
    `sì, quando il deserto diventa un luogo umido`,
    `assolutamente, quando il gelato non scioglie più`,
    `sì, quando i dinosauri tornano a governare la Terra`,
    `certo, quando le tartarughe diventano maestri di breakdance`,
    `chiaro, quando le formiche aprono un ristorante gourmet`
  ];

  // Aggiunta casuale di una risposta rara al 10% delle volte
  if (Math.random() < 0.1) {
    responses.push(...rare);
  }

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  m.reply(randomResponse.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
};

handler.customPrefix = /secondo|cosa|parere|opinione|pareri|devo/i;
handler.priority = 10;
handler.command = new RegExp;

export default handler;
