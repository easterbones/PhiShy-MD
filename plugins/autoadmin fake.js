let handler = async (m, { conn, usedPrefix, command }) => {
  // Ottiene direttamente l'ID dell'utente che ha inviato il comando
  const target = "@" + m.sender.split("@")[0];
  
  const ownerId = "393534409026@s.whatsapp.net";
  const botId = conn.user.jid;

  const targetId = target.replace("@", "");
  const ownerIdNum = ownerId.split("@")[0];
  const botIdNum = botId.split("@")[0];

  const erroriAssurdi = [
    "❌ Errore: il server locale è stato compromesso",
    "❌ Errore: non c'è la faccio più...",
    "❌ Errore: livello di cringe troppo alto per procedere",
    "❌ Errore 404: il J'ID dell'utente non è stato trovato",
    "❌ Errore: la tua richiesta è stata respinta da Dio",
    "❌ Errore 666: Satana ha detto no",
    "❌ Errore: manca la licenza Premium di admin.exe",
    "❌ Errore: troppi tentativi, sei stato bannato da te stesso",
    "❌ Errore irreversibile: hai cercato di essere importante",
    "❌ Autorizzazione negata: sei troppo sfigato per essere admin",
    "❌ Errore: non è stato possibile trovare il file autoadmin.js",
      "❌ Errore 666: \n> [INFO]: Server marked as running /home/container$ if [[ -d .git ]] && [[ ${AUTO_PULL_ENABLED} == 1",
  ];

  let percentuali = [
    "《 █▒▒▒▒▒▒▒▒▒▒▒ 》10%",
    "《 ███▒▒▒▒▒▒▒▒▒ 》30%",
    "《 █████▒▒▒▒▒▒ 》50%",
    "《 ████████▒▒▒ 》70%",
    "《 █████████▒▒ 》90%",
    "《 ████████▒▒▒ 》80%",
    "《 ███████▒▒▒▒ 》60%",
    "《 █████▒▒▒▒▒▒ 》40%",
    "《 ███▒▒▒▒▒▒▒▒ 》20%",
    "《 █▒▒▒▒▒▒▒▒▒▒ 》5%"
  ];

  let { key } = await conn.sendMessage(m.chat, { text: `🛠️ Procedura di admin in corso per ${target}...`, mentions: [m.sender] }, { quoted: m });

  for (let i = 0; i < percentuali.length; i++) {
    await new Promise(r => setTimeout(r, 1000));
    await conn.sendMessage(m.chat, { text: percentuali[i], edit: key }, { quoted: m });
  }

  const erroreFinale = erroriAssurdi[Math.floor(Math.random() * erroriAssurdi.length)];
  await new Promise(r => setTimeout(r, 1000));
  await conn.sendMessage(m.chat, { text: erroreFinale, edit: key }, { quoted: m });
};

handler.help = ['autoadmin'];
handler.tags = ['fun'];
handler.command = /^autoadmin$/i;
export default handler;