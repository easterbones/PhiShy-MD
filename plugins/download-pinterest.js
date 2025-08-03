let handler = async (m, { conn, usedPrefix }) => {
  await conn.sendMessage(m.chat, {
    text: "Vuoi vedere se i bottoni funzionano?",
    buttons: [
      { buttonId: `${usedPrefix}test_yes`, buttonText: { displayText: "Sì" }, type: 1 },
      { buttonId: `${usedPrefix}test_no`, buttonText: { displayText: "No" }, type: 1 }
    ],
    footer: "Test Bottoni"
  }, { quoted: m });
};

let handlerYes = async (m, { conn }) => {
  await conn.reply(m.chat, "Bravo! Il bot funziona! 🎉", m);
};
handlerYes.command = /^test_yes$/i;

let handlerNo = async (m, { conn }) => {
  await conn.reply(m.chat, "Peccato! Riprova più tardi.", m);
};
handlerNo.command = /^test_no$/i;

handler.help = ["testbottoni"];
handler.tags = ["test"];
handler.command = /^(testbottoni)$/i;

export default handler;
export { handlerYes, handlerNo };