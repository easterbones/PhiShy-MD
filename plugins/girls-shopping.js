let handler = async (m, { conn, args }) => {
  const searchQuery = "prodotti trendy sotto 20€ site:amazon.it";
  
  try {
    // Cerca prodotti su Bing
    const results = await searchWeb(searchQuery);
    
    if (!results || results.length === 0) {
      return m.reply("⚠️ Nessun risultato trovato. Riprova tra poco!");
    }

    // Filtra e formatta i link
    const productLinks = results.slice(0, 5).map(res => `🔗 ${res.title}: ${res.url}`).join("\n");

    // Rispondi con i prodotti
    m.reply(`🛍️ *Shopping Trendy sotto i 20€*\n\n${productLinks}\n\n🛒 Trova l'affare perfetto!`);
  
  } catch (error) {
    m.reply("⚠️ Errore nella ricerca. Riprova più tardi!");
  }
};

handler.help = ["shopping"];
handler.tags = ["ecommerce", "amazon"];
handler.command = /^shopping$/i;

export default handler;
