function handler(m) {
  // Ottieni sia gli owner che i mods
  const owners = global.owner.filter(([id, isCreator]) => id && isCreator);
  const mods = global.mods ? global.mods.map(id => [id, 'Moderatore']) : [];
  
  // Combina gli owner e i mods
  const contacts = [...owners, ...mods];
  
  const prova = { 
    "key": {
      "participants": "0@s.whatsapp.net", 
      "fromMe": false, 
      "id": "Halo"
    }, 
    "message": { 
      "locationMessage": { 
        name: 'Proprietari e Moderatori di PhiShy', 
        "jpegThumbnail": fs.readFileSync('./settings.png'),
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }, 
    "participant": "0@s.whatsapp.net"
  }
  
  // Invia i contatti combinati
  this.sendContact(m.chat, contacts, prova);
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['padroni','proprietario','moderatori'] 
export default handler