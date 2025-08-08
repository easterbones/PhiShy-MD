import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import fs from 'fs'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

// Funzione globale per normalizzare i JID (WhatsApp IDs)
global.normalizeJid = function(jid) {
    if (!jid) return null
    // Se già contiene @ e non è in formato gruppo
    if (typeof jid === 'string' && jid.includes('@') && !jid.includes('@g.us')) {
        // Assicurati che abbia il formato corretto (user@s.whatsapp.net)
        return jid.replace(/^(.+)@.+@.+$/, '$1@s.whatsapp.net')
    }
    // Se è un numero, aggiungi il suffisso
    if (typeof jid === 'string' && !jid.includes('@')) {
        return jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    }
    return jid
}


global.botnumber = ""
global.confirmCode = ""


global.owner = [
  ['393534409026@s.whatsapp.net', '𓊈ҽαʂƚҽɾ𓊉𓆇𓃹'],
  ['48667726415@s.whatsapp.net', ' easter +48']
 
]

//────────────────────────────

global.prems = ['']
 

//────────────────────────────

global.catalogo = fs.readFileSync('./storage/image/rodrick.png') 
global.miniurl = fs.readFileSync('./storage/image/spiegel.png')
global.group = 'https://www.tiktok.com/tpp/age-gate?_t=ZN-8sGYtLDBXKY&_r=1'
global.canal = 'https://www.tiktok.com/tpp/age-gate?_t=ZN-8sGYtLDBXKY&_r=1'

//────────────────────────────

global.packname = ``
global.author = '{\n "bot": {\n   "name": "PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!",\n     "author": "easter",\n   "status_bot": "active"\n }\n}'
global.wait = '🐢 *PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!*'
global.botname = `𝙋𝙝𝙮𝙎𝙝𝙮 ᶠᵘᶜᵏﾠʸᵒᵘ🎌`
global.textbot = `buongiorno`
global.listo = '*🍭 Aqui tiene*'
global.namechannel = '【 PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ! 】'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.articolo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "@g.us" } : {}) }, message: { orderMessage: { itemCount : -104, status: 1, surface : 1, message: botname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}



//────────────────────────────

global.keysZens = ['c2459db922', '37CC845916', '6fb0eff124']
// 'fiktod' 'BF39D349845E' '675e34de8a' '0b917b905e6f'
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = ['BrunoSobrino']

global.APIs = { 
  xteam: 'https://api.xteam.xyz', 
  nrtm: 'https://fg-nrtm-nhie.onrender.com',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api.fgmods.xyz/',
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',	
  fgmods: 'https://api-fgmods.ddns.net'
},
global.APIKeys = { 
  'https://api.xteam.xyz': `${keysxteam}`,
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id': `${keysneoxr}`,	
  'https://violetics.pw': 'beta',
}


//────────────────────────────
global.imagen1 = ['./storage/image/rodrick.png']
global.imagen4 = fs.readFileSync('storage/image/spiegel.png')
//────────────────────────────

// Sticker WM (Nome del pacchetto degli sticker)
global.packname = 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ'
global.author = '➤⃤ᴵ ᴬᴹ𓊈Eas†er𓊉𓆇𓃹'

//────────────────────────────

global.vs = 'phishyyyyy'

global.nomebot = 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!'

global.multiplier = 10
global.maxwarn = '2' 
//────────────────────────────

global.wm = 'PᏂ𝚒𝑠𝐡ⲩ ᶠᶸᶜᵏᵧₒᵤ!'
global.wait = 'loading...'

//────────────────────────────

global.flaaa = [
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text=']

//──────────────────────────────────
  
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("file 'config.js' aggiornato"))
  import(`${file}?update=${Date.now()}`)
})
