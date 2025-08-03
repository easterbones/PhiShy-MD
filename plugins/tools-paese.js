import fetch from 'node-fetch';

let handler = async (m, { conn, args, command }) => {
  if (!args[0]) {
    return m.reply(`🌍 Scrivi il nome di un paese\nEsempio: *.paese italia*`);
  }
  
  let paese = args.join(' ');
  
  try {
    console.log(`Cercando informazioni per: ${paese}`);
    
    // Usa l'endpoint corretto
    let res = await fetch(`https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(paese)}`);
    
    // Verifica se la risposta è ok
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    // Ottieni il testo della risposta prima di parsarlo
    let responseText = await res.text();
    console.log('Risposta API:', responseText);
    
    // Verifica se la risposta non è vuota
    if (!responseText || responseText.trim() === '') {
      throw new Error('Risposta vuota dall\'API');
    }
    
    // Prova a parsare il JSON
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Errore nel parsing JSON:', parseError);
      throw new Error('Risposta non valida dall\'API');
    }
    
    // Verifica la struttura della risposta
    if (!json || typeof json !== 'object') {
      throw new Error('Formato risposta non valido');
    }
    
    if (!json.status || !json.data) {
      throw new Error('Paese non trovato o dati non disponibili');
    }
    
    let data = json.data;
    
    // Verifica che i dati essenziali siano presenti
    if (!data.name) {
      throw new Error('Dati del paese incompleti');
    }
    
    // Costruisci il messaggio con i dati corretti
    let testo = `🌎 Informazioni su ${data.name}\n\n`;
    
    if (data.continent && data.continent.name) {
      testo += `📍 Continente: ${data.continent.emoji} ${data.continent.name}\n`;
    }
    
    if (data.capital) {
      testo += `🏙️ Capitale: ${data.capital}\n`;
    }
    
    if (data.area && data.area.squareKilometers) {
      testo += `📏 Superficie: ${data.area.squareKilometers.toLocaleString()} km²\n`;
    }
    
    if (data.languages && data.languages.native && data.languages.native.length > 0) {
      testo += `🗣️ Lingua: ${data.languages.native.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ')}\n`;
    }
    
    if (data.currency) {
      testo += `💰 Valuta: ${data.currency}\n`;
    }
    
    if (data.phoneCode) {
      testo += `📞 Prefisso: ${data.phoneCode}\n`;
    }
    
    if (data.constitutionalForm) {
      testo += `🏛️ Forma di governo: ${data.constitutionalForm.charAt(0).toUpperCase() + data.constitutionalForm.slice(1)}\n`;
    }
    
    if (data.drivingSide) {
      testo += `🚗 Guida: ${data.drivingSide === 'right' ? 'A destra' : 'A sinistra'}\n`;
    }
    
    if (data.internetTLD) {
      testo += `🌐 Dominio internet: ${data.internetTLD}\n`;
    }
    
    if (data.isoCode) {
      testo += `🪪 Codici ISO: ${data.isoCode.alpha2?.toUpperCase() || 'N/A'} / ${data.isoCode.alpha3?.toUpperCase() || 'N/A'}\n`;
    }
    
    if (data.famousFor) {
      testo += `⭐ Famoso per: ${data.famousFor}\n`;
    }
    
    if (data.coordinates) {
      testo += `🗺️ Coordinate: ${data.coordinates.latitude}°, ${data.coordinates.longitude}°\n`;
    }
    
    // Aggiungi informazioni sui paesi confinanti se disponibili
    if (data.neighbors && data.neighbors.length > 0) {
      let neighborsNames = data.neighbors.map(n => n.name).slice(0, 5); // Limita a 5 per non essere troppo lungo
      testo += `🏘️ Paesi confinanti: ${neighborsNames.join(', ')}`;
      if (data.neighbors.length > 5) {
        testo += ` e altri ${data.neighbors.length - 5}`;
      }
      testo += `\n`;
    }
    
    // Aggiungi link Google Maps se disponibile
    if (data.googleMapsLink) {
      testo += `\n🗺️ [Visualizza su Google Maps](${data.googleMapsLink})`;
    }
    
    // Invia il messaggio con l'immagine della bandiera se disponibile
    if (data.flag) {
      await conn.sendMessage(m.chat, {
        image: { url: data.flag },
        caption: testo,
      }, { quoted: m });
    } else {
      // Se non c'è la bandiera, invia solo il testo
      await m.reply(testo);
    }
    
  } catch (e) {
    console.error('Errore completo:', e);
    
    // Messaggi di errore più specifici
    if (e.message.includes('HTTP')) {
      m.reply('❌ Errore: API non raggiungibile. Riprova più tardi.');
    } else if (e.message.includes('vuota') || e.message.includes('parsing')) {
      m.reply('❌ Errore: risposta non valida dall\'API. Controlla il nome del paese.');
    } else if (e.message.includes('non trovato')) {
      m.reply('❌ Paese non trovato. Controlla l\'ortografia e riprova.');
    } else {
      m.reply('❌ Errore generico. Riprova più tardi.');
    }
  }
};

handler.command = /^paese$/i;
export default handler;