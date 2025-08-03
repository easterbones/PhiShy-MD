const handler = async (m, { command, text }) => {
        if (m.key.fromMe) return; // Se il messaggio proviene dal bot, non eseguire il comando
  const responses = [
    `Statte zitto e mangia ‘o sfogliatell!`,
    `Ma chi t’o ffà fà?`,
    `E chi è chest', ‘o presidente d’o Napoli?!`,
    `Nun fa ‘o scem’, ca ‘a vita è corta!`,
    `Adda venì baffone, chist’ è ‘o fatto!`,
    `O' sai ca si meglio e ‘nu babbà!`,
    `Te voglio bene, ma sulo pecché sei ‘e Napule!`,
    `Chest’è ‘a fine do' Tarallo!`,
    `Ma nun vedi ca si’ ‘nu capiton’ senza sale?!`,
    `‘O cielo è blu sopra Napoli, e tu chi si’?`,
    `Aggio visto ‘e cchiù belli cose sotto ‘o Vesuvio!`,
    `A Maronn t’accumpagn, ma nun scassà ‘o bajon’!`,
    `Fatt’ ‘o segno ‘e croce e cammina!`,
    `Nun te piglià collera, piglia ‘a pizza!`,
    `‘O saccio ca t’o credi Maradona, ma nun ce n’è cchiù!`,
    `A chi parla ‘o pallon’, ma pecché nun fai silenzio?!`,
    `Statte calmo, ca si’ cchiù agitato d’ ‘o traffico!`,
    `A Napule tutto è possibile, pure chist’ ca parli!`,
    `‘A pizza napulitana è meglio d’ ‘e chiacchiere toje!`,
    `Ma pecché nun te vai a fa ‘nu giro ‘int’ ‘o lungomare?`,
    `Aggio visto ‘e meglio guagliune e nun erano accussì!`,
    `O Vesuvio fuma, ma tu parli troppo!`,
    `Statte buono, ca chi fa ‘o scem’ campa ‘e chiù!`,
    `Chest’è ‘na sceneggiata cchiù grande e chille d’ ‘o teatro!`,
    `Adda passà ‘a nuttata, ma tu stai peggio d’essa!`,
    `Nun fa ‘o fenomen’, ca ‘o ciuccio sta ancora a fà ‘o suonno!`,
    `Chi è ‘o signor Cozzolino?!`,
    `E chi sì, Totò? Sta senza pensier’!`,
    `Si forte, si brav’, ma nun t’allargà!`,
    `E chist’è Napule, e mo’ che vuliv’?!`,
    `Tene ‘a capa fresca, ca ‘a vita nun è ‘nu babbà!`,
    `Si ‘nu guagliunciell’, va a scola!`,
    `Nun rompere, ca stong’ ccà pe magnà!`,
    `A Napule se campa d’aria buona e ‘e sfogliatell’!`,
    `Fatte ‘na risata, ca ‘a vita è troppo breve!`,
    `T’arricorde quann’ stive senza pensieri? Mo’ pure tu te lamenti!`,
    `A Napule se dice: chi nun tene cape, tene recchie!`,
    `Nun fa ‘o gallo ncopp’ a munnezza!`,
    `A Napule ce sta ‘o sole, ‘a pizza, e tu che scass’!`,
    `E pecché nun vai a canta ncopp’ ‘o balcone?!`,
    `Si ‘nu scem’, ma t’aggia volé bene lo stesso!`,
    `Chest’è pe’ te: ‘o ciuccio ‘int’ ‘a festa!`,
    `T’arricorde ‘o presepe? Ecco, si’ comme ‘a pecorella smarrita!`,
    `A Napule ce stanno ‘e guagliune seri, nun fa’ ‘o pazzo!`,
    `E io che pensavo ca Napule era tranquilla, e mo’ arrivi tu!`,
    `Vulesse sapé pecché parli, ma nun voglio sapere!`,
    `Te faccio ‘na pizza e ti calmi, va bene?`,
    `‘A serenata è bella, ma tu sei meglio statte zitto!`,
    `Si ‘nu ricordo d’ ‘a guerra: nun si capisce niente!`,
    // Frasi in siciliano
    `Chi si? ‘N’avi ‘a facci i bonu e parra!`,
    `Ma statti mutu ca parri cchiù d’un parrinu!`,
    `O tuttu o nenti, tanticchia nun vali!`,
    `Ma chi vulì, ‘u cannolu e ‘a cassata assemi?!`,
    `Avi chiù sali ‘n testa ‘na lumaca d’acqua!`,
    `Si sempri all’erta, comu un surici a matinata!`,
    `Unni viri focu, nun ‘mmiscari pagghia!`,
    `Chi ci voli? Nu vasu e passa tuttu!`,
    `Si comu un porcu nni un giardinu: scassaturi!`,
    `A tò testa pari ‘na rota ca non si ferma mai!`,
  ];

  const uniqueResponses = [...new Set(responses)];
  const randomResponse = uniqueResponses[Math.floor(Math.random() * uniqueResponses.length)];

  m.reply(randomResponse.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
};

handler.customPrefix = /\b(napoli|napoletano|napoletana|puglia|campagna)\b/i; // Parole chiave che attivano il comando
handler.command = new RegExp;
handler.priority = 10;

export default handler;