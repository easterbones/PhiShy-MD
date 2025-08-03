import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `*🎌 Inserisci il nome di un manga/anime*\n\nEsempio: .mangainfo Attack on Titan`, m)
  
  try {
    await conn.reply(m.chat, '🔍 *Ricerca in corso...*', m)
    
    let res = await fetch('https://api.jikan.moe/v4/manga?q=' + encodeURIComponent(text))
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    
    let json = await res.json()
    if (!json.data || json.data.length === 0) return conn.reply(m.chat, `*❌ Nessun risultato per "${text}"*`, m)
    
    let manga = json.data[0]
    let {
      title,
      title_japanese,
      title_english,
      chapters,
      volumes,
      type,
      score,
      scored_by,
      rank,
      popularity,
      members,
      favorites,
      status,
      synopsis,
      url,
      images,
      authors,
      genres
    } = manga
    
    // Estrazione dati
    let imageUrl = images?.jpg?.large_image_url || images?.jpg?.image_url
    let author = authors?.[0]?.name || 'Sconosciuto'
    let genreList = genres?.map(g => g.name).join(', ') || 'N/D'
    
    // Formattazione testo con markdown
    let caption = `
*📚 ${title}* ${title_english ? `\n*${title_english}*` : ''}
${title_japanese ? `*[日本]* ${title_japanese}` : ''}

*👨‍🎨 Autore:* ${author}
*📌 Genere:* ${genreList}
*📊 Stato:* ${status}
*📖 Capitoli:* ${chapters || 'N/D'}
*🗂 Volumi:* ${volumes || 'N/D'}
*⭐ Punteggio:* ${score} (${scored_by?.toLocaleString()} voti)
*🏆 Rank:* #${rank}
*🔥 Popolarità:* #${popularity}
*👥 Membri:* ${members?.toLocaleString()}
*❤️ Preferiti:* ${favorites?.toLocaleString()}


*🔗 MyAnimeList:* ${url}
`.trim()

    // Invio solo come anteprima senza immagine grande
    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: title.slice(0, 60),
          body: `⚡ ${type} | ${status}`,
          thumbnail: await (await fetch(imageUrl)).buffer(),
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          showAdAttribution: true
        }
      }
    }, { quoted: m })

  } catch (error) {
    console.error('Errore:', error)
    await conn.reply(m.chat, `*❌ Errore nella ricerca*\n${error.message}`, m)
  }
}

handler.help = ['mangainfo <nome>']
handler.tags = ['anime']
handler.command = /^(mangainfo|animeinfo|manga)$/i

export default handler