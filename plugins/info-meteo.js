import axios from "axios"

let handler = async (m, { args }) => {
  if (!args[0]) throw "⚠️ *_Inserisci il nome di una città o nazione._*"
  try {
    const response = axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`
    )
    const res = await response
    const name = res.data.name
    const Country = res.data.sys.country
    const Weather = res.data.weather[0].description
    const Temperature = res.data.main.temp + "°C"
    const Minimum_Temperature = res.data.main.temp_min + "°C"
    const Maximum_Temperature = res.data.main.temp_max + "°C"
    const Humidity = res.data.main.humidity + "%"
    const Wind = res.data.wind.speed + "km/h"

    // Array di commenti di Phishy
    const phishyComments = {
      hot: [
        "Che caldo infernale! 🥵",
        "Phishy si sta sciogliendo come un gelato! 🍦",
        "Temperatura da deserto, perfetta per grigliare Phishy! 🔥",
        "Fa così caldo che persino Phishy sta cercando l'aria condizionata! ❄️"
      ],
      cold: [
        "Brrr... Phishy si sta congelando! ❄️",
        "Fa così freddo che Phishy sta pensando di migrare al sud! 🐧",
        "Temperatura polare, Phishy sta costruendo un igloo! 🏠",
        "Freddo da far tremare i tentacoli di Phishy! 🦑"
      ],
      rain: [
        "Phishy odia la pioggia, bagna i suoi circuiti! ☔",
        "Piove, governo ladro! dice Phishy 🌧️",
        "Phishy sta ballando sotto la pioggia come Gene Kelly! 💃",
        "Pioggia a catinelle, Phishy sta costruendo un'arca! 🚢"
      ],
      snow: [
        "Phishy sta facendo un pupazzo di neve... di se stesso! ⛄",
        "Nevica! Phishy sta sciando sui server! 🎿",
        "Bianco Natale con Phishy! 🎄",
        "Phishy sta lanciando palle di neve ai firewall! ❄️"
      ],
      normal: [
        "Phishy approva queste condizioni meteo! 👍",
        "Phishy dice: 'Che giornata ideale!' 😎",
        "Nemmeno Phishy potrebbe migliorare questo tempo! 🌈"
      ]
    }

    // Seleziona il tipo di commento in base alle condizioni
    let temp = parseFloat(res.data.main.temp)
    let weatherType = res.data.weather[0].main.toLowerCase()
    let randomComment = ""
    
    if (temp > 30) {
      randomComment = phishyComments.hot[Math.floor(Math.random() * phishyComments.hot.length)]
    } else if (temp < 10) {
      randomComment = phishyComments.cold[Math.floor(Math.random() * phishyComments.cold.length)]
    } else if (weatherType.includes('rain')) {
      randomComment = phishyComments.rain[Math.floor(Math.random() * phishyComments.rain.length)]
    } else if (weatherType.includes('snow')) {
      randomComment = phishyComments.snow[Math.floor(Math.random() * phishyComments.snow.length)]
    } else {
      randomComment = phishyComments.normal[Math.floor(Math.random() * phishyComments.normal.length)]
    }

    // Costruisci il messaggio
    const wea = `
「 📍 」 Località: ${name}
「 🗺️ 」 Paese: ${Country}
「 🌡️ 」 Temperatura: ${Temperature}
「 🌤️ 」 Tempo: ${Weather}
「 💦 」 Umidità: ${Humidity}
「 🌬️ 」 Vento: ${Wind}

*Phishy dice:* ${randomComment}
    `

    m.reply(wea)
  } catch (e) {
    return "⚠️ *_Errore, località non trovata. Prova con un'altra città._*"
  }
}

handler.help = ['meteo *<città/paese>*']
handler.tags = ['info']
handler.command = /^(clima|meteo)$/i
export default handler