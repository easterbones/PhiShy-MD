import axios from "axios"

let handler = async (m, { args }) => {
   
  const city = args[0] || 'Roma' // Default a Roma se non specificato
  
  try {
    // Ottieni dati meteo
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&lang=it`
    )
    
    const weatherData = response.data
    const temp = weatherData.main.temp
    const weather = weatherData.weather[0].main.toLowerCase()
    const humidity = weatherData.main.humidity

    // Genera outfit in base al meteo
    let outfitSuggestion = generateOutfit(temp, weather, humidity)
    
    // Costruisci messaggio
    let message = `🧥 *OUTFIT PER ${city.toUpperCase()}* 🧥\n` +
                 `🌡️ Temperatura: ${temp}°C\n` +
                 `⛅ Condizioni: ${weatherData.weather[0].description}\n\n` +
                 `👗 *Suggerimento Outfit:*\n${outfitSuggestion}\n\n` +
                 `💡 *Extra:* ${getFashionTip(weather)}`

    // Aggiungi sticker tematico
    const weatherStickers = {
      rain: 'https://i.imgur.com/7QY7B0e.webp', // Ombrello
      sunny: 'https://i.imgur.com/KQ0gXWU.webp', // Sole
      cold: 'https://i.imgur.com/WMjpO0a.webp'   // Sciarpa
    }
    
    await conn.sendMessage(m.chat, { 
      text: message,
      mentions: [m.sender]
    }, { quoted: m })
    
    await conn.sendMessage(m.chat, {
      sticker: { url: weatherStickers[getWeatherKey(weather)] || weatherStickers.sunny }
    })

  } catch (e) {
    m.reply("⚠️ Impossibile ottenere i dati meteo. Prova con un'altra città o controlla il nome!")
  }
}

// Logica outfit
function generateOutfit(temp, weather, humidity) {
  let outfit = []
  
  // Base temperatura
  if (temp > 25) {
    outfit.push("• Top leggero o canottiera")
    outfit.push("• Pantaloncini o gonna midi")
    outfit.push("• Sandali o sneakers aperte")
  } 
  else if (temp > 15) {
    outfit.push("• T-shirt o blusa")
    outfit.push("• Jeans o pantaloni leggeri")
    outfit.push("• Scarpe comode o ballerine")
  }
  else {
    outfit.push("• Maglione o cardigan")
    outfit.push("• Pantaloni pesanti o jeans")
    outfit.push("• Stivali o scarpe chiuse")
  }
  
  // Aggiustamenti per condizioni
  if (weather.includes('rain')) {
    outfit.push("• Impermeabile o trench")
    outfit.push("• Stivali impermeabili")
    outfit.push("• Ombrello compatto")
  }
  
  if (weather.includes('snow')) {
    outfit.push("• Cappotto imbottito")
    outfit.push("• Sciarpa e guanti")
    outfit.push("• Stivali invernali")
  }
  
  if (humidity > 70) {
    outfit.push("• Tessuti traspiranti")
    outfit.push("• Evita seta e viscosa")
  }
  
  return outfit.join("\n")
}

// Consigli extra
function getFashionTip(weather) {
  const tips = {
    rain: "Porta una borsa impermeabile per proteggere il tuo smartphone!",
    sunny: "Non dimenticare gli occhiali da sole e la crema solare!",
    cold: "A cipolla è la regola: meglio più strati sottili che uno spesso!",
    default: "Colori neutri per massima versatilità!"
  }
  
  return tips[getWeatherKey(weather)] || tips.default
}

// Classificatore condizioni meteo
function getWeatherKey(weather) {
  if (weather.includes('rain')) return 'rain'
  if (weather.includes('sun') || weather.includes('clear')) return 'sunny'
  if (weather.includes('snow') || weather.includes('cold')) return 'cold'
  return 'default'
}

handler.help = ['outfit <città>', 'outfit']
handler.tags = ['lifestyle']
handler.command = /^(outfit|abbigliamento|vestiti)$/i
export default handler