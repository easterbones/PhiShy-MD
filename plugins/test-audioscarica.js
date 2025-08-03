let handler = async (m, { conn, quoted }) => {
  console.log('[DEBUG] quoted = ', JSON.stringify(quoted, null, 2));
  try {
    const buffer = await conn.downloadMediaMessage(quoted);
    m.reply('✅ Audio scaricato correttamente, dimensione: ' + buffer.length + ' byte');
  } catch (e) {
    console.error('[ERRORE AUDIO]', e);
    m.reply('❌ Errore nel download dell\'audio');
  }
};

handler.command = /^testaudio$/i;
export default handler;
