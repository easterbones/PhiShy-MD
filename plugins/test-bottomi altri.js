let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: "🤖 *Clicca un bottone e io ti rispondo subito!*",
    footer: "Bottoni silenziosi di Phishy",
    buttons: [
      { buttonId: 'phishy_help', buttonText: { displayText: '🆘 Aiuto' }, type: 1 },
      { buttonId: 'phishy_info', buttonText: { displayText: 'ℹ️ Info' }, type: 1 },
      { buttonId: 'phishy_dona', buttonText: { displayText: '💖 Dona' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}
handler.command = ['silenzio', 'bottsilent', 'senzascrivere']
export default handler
