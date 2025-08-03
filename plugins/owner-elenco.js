/*
Plugin: elenco-jid.js
Invia in chat un elenco numerato dei JID WhatsApp, convertendo i numeri forniti.
*/


const numbers = [
  '+39 353 436 3092', '+39 379 161 9801', '+39 347 519 1964', '+39 327 368 8531', '+39 370 367 4034',
  '+39 320 828 2220', '+39 351 945 8219', '+39 327 935 0714', '+39 339 582 4742', '+39 351 871 0589',
  '+39 327 139 1524', '+39 351 439 3772', '+39 339 337 6752', '+39 388 878 2525', '+39 351 629 8684',
  '+39 320 035 3860', '+39 391 151 2769', '+39 371 441 5412', '+39 351 932 1986', '+39 350 913 0817',
  '+39 324 891 6069', '+39 328 403 8997', '+39 333 905 6406', '+39 334 383 3767', '+39 334 793 8870',
  '+39 339 579 0969', '+39 351 123 7668', '+39 351 427 5326', '+39 351 634 1435', '+39 351 707 3739',
  '+39 351 717 8660', '+39 351 728 3622', '+39 351 843 9734', '+39 351 995 5459', '+39 375 860 9964',
  '+39 377 396 5324', '+39 379 136 4628', '+39 388 380 9707', '+39 388 654 4392', '+39 392 269 0625',
  '+39 392 348 8432', '+39 392 889 4331', '+39 351 922 9759'
];

function numberToJid(number) {
  const digits = number.replace(/\D/g, '');
  return `${digits}@s.whatsapp.net`;
}

function formatJidList(numbers) {
  let output = '───── Elenco Numeri (JID) ─────\n';
  numbers.forEach((num, idx) => {
    output += `${idx + 1}. @${numberToJid(num)}\n`;
    if ((idx + 1) % 10 === 0) output += '\n';
  });
  output += '───────────────────────────────';
  return output;
}


let handler = async (m, { conn }) => {
  // Crea la lista dei JID
  const jids = numbers.map(numberToJid);
  // Crea il messaggio con menzioni
  let message = '───── Elenco Numeri (JID) ─────\n\n' +
    jids.map((jid, idx) => `${idx + 1}. @${jid.split('@')[0]}`).join('\n') +
    '\n\n───────────────────────────────';
  // Invia il messaggio con le menzioni
  await conn.sendMessage(m.chat, { text: message, mentions: jids }, { quoted: m });
};

handler.command = ['elenco', 'jidlist'];
handler.tags = ['info'];
handler.help = ['elenco - Elenco numerato dei JID WhatsApp'];
handler.register = false;

export default handler;
