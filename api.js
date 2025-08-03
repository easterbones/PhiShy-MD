import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

/* Se vuoi modificare questo e aggiungere più API, assipozioneti di impostare global.tuapi = ['apikey']  skid 🤑 */

global.openai_key = 'sk-0'
/* Ottieni la tua ApiKey da questo link: https://platform.openai.com/account/api-keys */

global.openai_org_id = 'org-3'
/* Ottieni il tuo ID organizzazione da questo link: https://platform.openai.com/account/org-settings */

global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124', 'hdiiofficial', 'fiktod', 'BF39D349845E', '675e34de8a', '0b917b905e6f']
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = ['BrunoSobrino']
global.itsrose = ['4b146102c4d500809da9d1ff']

global.APIs = {
  xteam: 'https://api.xteam.xyz',
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://api.zahwazein.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  fgmods: 'https://api-fgmods.ddns.net',
  botcahx: 'https://api.botcahx.biz.id',
  ibeng: 'https://api.ibeng.tech/docs',
  rose: 'https://api.itsrose.site',
  popcat: 'https://api.popcat.xyz',
  xcoders: 'https://api-xcoders.site'
},
global.APIKeys = {
  'https://api.xteam.xyz': `${keysxteam}`,
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id': `${keysneoxr}`,
  'https://violetics.pw': 'beta',
  'https://api.zahwazein.xyz': `${keysxxx}`,
  'https://api.fgmods.xyz': 'Cy3Elwb2',
  'https://api.botcahx.biz.id': 'Admin',
  'https://api.ibeng.tech/docs': 'tamvan',
  'https://api.itsrose.site': 'Rs-Zeltoria',
  'https://api-xcoders.site': 'Frieren'
}

/**************************/
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    let emot = {
      bacini: '🥰 bacini',
      level: '🧬 Livello',
      limit: '🍬 dolci',
      pozione_minore: '🧪 pozione Minore',
      pozione_maggiore: '🧪 pozione Maggiore',
      pozione_definitiva: '🧪 pozione Definitiva',
      vita: '🛡️ scudo ',
    credito: '🏦 Banca',
      forcina: '📎 forcina' ,
        
        
        
      canna: '🎣 Canna',
      bici: '🚲 Bici',
      moto: '🏍️ Moto',
      macchina: '🚗 Macchina',
      exp: '⚡ Esperienza',
      diamond: '💎 Diamante',
      health: '❤️ Salute',
      kyubi: '🌀 Magia',
      joincount: '🪙 Token',
      emerald: '💚 Smeraldo',
      stamina: '✨ Energia',
      role: '💪 Rango',
      premium: '🎟️ Premium',
      pointxp: '📧 Punti Exp',
      gold: '👑 Oro',
      trash: '🗑 Spazzatura',
      crystal: '🔮 Cristallo',
      intelligence: '🧠 Intelligenza',
      string: '🕸️ Corda',
      keygold: '🔑 Chiave d’Oro',
      keyiron: '🗝️ Chiave di Ferro',
      emas: '🪅 Piñata',
      fishingrod: '🎣 Canna da Pesca',
      gems: '🍀 Gemme',
      magicwand: '⚕️ Bacchetta Magica',
      mana: '🪄 Incantesimo',
      agility: '🤸‍♂️ Agilità',
      darkcrystal: '♠️ Cristallo Oscuro',
      iron: '⛓️ Ferro',
      rock: '🪨 Roccia',
      potion: '🥤 Pozione',
      superior: '💼 Superiore',
      robo: '🚔 Robo',
      upgrader: '🧰 Migliora Potenziamento',
      wood: '🪵 Legno',
      strength: '🦹‍♀️ Forza',
      arc: '🏹 Arco',
      armor: '🥼 Armatura',
      bow: '🏹 Super Arco',
      pickaxe: '⛏️ Piccone',
      sword: '⚔️ Spada',
      common: '📦 Scatola Comune',
      uncoommon: '🥡 Scatola Non Comune',
      mythic: '🗳️ Scatola Mitica',
      legendary: '🎁 Scatola Leggendaria',
      petFood: '🍖 Cibo per Animali',
      pet: '🍱 Scatola per Animali',
      bibitanggur: '🍇 Semi d’Uva',
      bibitapel: '🍎 Semi di Mela',
      bibitjeruk: '🍊 Semi d’Arancia',
      bibitmangga: '🥭 Semi di Mango',
      bibitpisang: '🍌 Semi di Banana',
      ayam: '🐓 Gallina',
      babi: '🐖 Maiale',
      Jabali: '🐗 Cinghiale',
      bull: '🐃 Toro',
      buaya: '🐊 Coccodrillo',
      cat: '🐈 Gatto',
      centaur: '🐐 Centauro',
      chicken: '🐓 Gallina',
      cow: '🐄 Mucca',
      dog: '🐕 Cane',
      dragon: '🐉 Drago',
      elephant: '🐘 Elefante',
      fox: '🦊 Volpe',
      giraffe: '🦒 Giraffa',
      griffin: '🦅 Grifone',
      horse: '🐎 Cavallo',
      kambing: '🐐 Capra',
      kerbau: '🐃 Bufalo',
      lion: '🦁 Leone',
      money: '👾 Monete Mistiche',
      monyet: '🐒 Scimmia',
      panda: '🐼 Panda',
      snake: '🐍 Serpente',
      phonix: '🕊️ Fenice',
      rhinoceros: '🦏 Rinoceronte',
      wolf: '🐺 Lupo',
      tiger: '🐅 Tigre',
      cumi: '🦑 Calamaro',
      udang: '🦐 Gamberetto',
      ikan: '🐟 Pesce',
      fideos: '🍝 Spaghetti',
      ramuan: '🧪 Ingrediente NOVA',
      knife: '🔪 Coltello'
    }
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  }
}
global.rpgg = { // Solo emoji
  emoticon(string) {
    string = string.toLowerCase()
    let emott = {
      forcina: '📎',
      bacini: '🥰',
      level: '🧬',
      limit: '💎',
      exp: '⚡',
      credito: '🏦',
      diamond: '💎+',
      health: '❤️',
      vita: '🛡️',
      kyubi: '🌀',
      joincount: '🪙',
      emerald: '💚',
      stamina: '✨',
      role: '💪',
      premium: '🎟️',
      pointxp: '📧',
      gold: '👑',
      trash: '🗑',
      crystal: '🔮',
      intelligence: '🧠',
      string: '🕸️',
      keygold: '🔑',
      keyiron: '🗝️',
      emas: '🪅',
      fishingrod: '🎣',
      gems: '🍀',
      magicwand: '⚕️',
      mana: '🪄',
      agility: '🤸‍♂️',
      darkcrystal: '♠️',
      iron: '⛓️',
      rock: '🪨',
      potion: '🥤',
      superior: '💼',
      robo: '🚔',
      upgrader: '🧰',
      wood: '🪵',
      strength: '🦹‍♀️',
      arc: '🏹',
      armor: '🥼',
      bow: '🏹',
      pickaxe: '⛏️',
      sword: '⚔️',
      common: '📦',
      uncoommon: '🥡',
      mythic: '🗳️',
      legendary: '🎁',
      petFood: '🍖',
      pet: '🍱',
      bibitanggur: '🍇',
      bibitapel: '🍎',
      bibitjeruk: '🍊',
      bibitmangga: '🥭',
      bibitpisang: '🍌',
      ayam: '🐓',
      babi: '🐖',
      Jabali: '🐗',
      bull: '🐃',
      buaya: '🐊',
      cat: '🐈',
      centaur: '🐐',
      chicken: '🐓',
      cow: '🐄',
      dog: '🐕',
      dragon: '🐉',
      elephant: '🐘',
      fox: '🦊',
      giraffe: '🦒',
      griffin: '🦅',
      horse: '🐎',
      kambing: '🐐',
      kerbau: '🐃',
      lion: '🦁',
      money: '👾',
      monyet: '🐒',
      panda: '🐼',
      snake: '🐍',
      phonix: '🕊️',
      rhinoceros: '🦏',
      wolf: '🐺',
      tiger: '🐅',
      cumi: '🦑',
      udang: '🦐',
      ikan: '🐟',
      fideos: '🍝',
      ramuan: '🧪',
      knife: '🔪'
    }
    let results = Object.keys(emott).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emott[results[0][0]]
  }
}
global.rpgshop = { // Negozio
  emoticon(string) {
    string = string.toLowerCase()
    let emottt = {
        
      bacini: '🥰 bacini',
      exp: '⚡ Esperienza',
      limit: '🍬 dolci',
      pozione_minore: '🧪 pozione Minore',
      pozione_maggiore: '🧪 pozione Maggiore',
      pozione_definitiva: '🧪 pozione Definitiva',
      canna: '🎣 Canna',
        bici: '🚲 Bici',
      moto: '🏍️ Moto',
      macchina: '🚗 Macchina', 
      vita: '🛡️ scudo ',
    credito: '🏦 Banca',  
      forcina: '📎 forcina',
        
        
        
      diamond: '💎 Diamante',
      joincount: '🪙 Token',
      emerald: '💚 Smeraldo',
      berlian: '♦️ Gioiello',
      kyubi: '🌀 Magia',
      gold: '👑 Oro',
      money: '👾 Monete Mistiche',
      tiketcoin: '🎫 Biglietti Mistici',
      stamina: '✨ Energia',
      potion: '🥤 Pozione',
      aqua: '💧 Acqua',
      trash: '🗑 Spazzatura',
      wood: '🪵 Legno',
      rock: '🪨 Roccia',
      batu: '🥌 Pietra',
      string: '🕸️ Corda',
      iron: '⛓️ Ferro',
      coal: '⚱️ Carbone',
      botol: '🍶 Bottiglia',
      kaleng: '🥫 Lattina',
      kardus: '🪧 Cartone',
      eleksirb: '💡 Elettricità',
      emasbatang: '〽️ Lingotto d’Oro',
      emasbiasa: '🧭 Oro Comune',
      rubah: '🦊🌫️ Volpe Grande',
      sampah: '🗑🌫️ Super Spazzatura',
      serigala: '🐺🌫️ Super Lupo',
      kayu: '🛷 Super Legno',
      sword: '⚔️ Spada',
      umpan: '🪱 Esca',
      healtmonster: '💵 Banconote',
      emas: '🪅 Piñata',
      pancingan: '🪝 Amo',
      pancing: '🎣 Canna da Pesca',
      common: '📦 Scatola Comune',
      uncoommon: '🥡 Scatola Non Comune',
      mythic: '🗳️ Scatola Mitica',
      pet: '📫 Scatola per Animali',
      gardenboxs: '💐 Scatola da Giardino',
      legendary: '🎁 Scatola Leggendaria',
      anggur: '🍇 Uva',
      apel: '🍎 Mela',
      jeruk: '🍊 Arancia',
      mangga: '🥭 Mango',
      pisang: '🍌 Banana',
      bibitanggur: '🌾🍇 Semi d’Uva',
      bibitapel: '🌾🍎 Semi di Mela',
      bibitjeruk: '🌾🍊 Semi d’Arancia',
      bibitmangga: '🌾🥭 Semi di Mango',
      bibitpisang: '🌾🍌 Semi di Banana',
      centaur: '🐐 Centauro',
      griffin: '🦅 Grifone',
      kucing: '🐈 Gatto',
      naga: '🐉 Drago',
      fox: '🦊 Volpe',
      kuda: '🐎 Cavallo',
      phonix: '🕊️ Fenice',
      wolf: '🐺 Lupo',
      anjing: '🐶 Cane',
      petFood: '🍖 Cibo per Animali',
      makanancentaur: '🐐🥩 Cibo per Centauro',
      makanangriffin: '🦅🥩 Cibo per Grifone',
      makanankyubi: '🌀🥩 Cibo Magico',
      makanannaga: '🐉🥩 Cibo per Drago',
      makananpet: '🍱🥩 Cibo per Animali',
      makananphonix: '🕊️🥩 Cibo per Fenice'
    }
    let results = Object.keys(emottt).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emottt[results[0][0]]
  }
}
global.rpgshopp = { // Negozio
  emoticon(string) {
    string = string.toLowerCase()
    let emotttt = {
      bacini: '🥰',
      exp: '⚡',
      limit: '🍬',
      pozione_minore: '🧪',
      pozione_maggiore: '🧪',
      pozione_definitiva: '🧪',
      canna: '🎣',
      macchina: '🚗',
      moto: '🏍️',
      bici: '🚲',

      diamond: '💎+',
      joincount: '🪙',
      emerald: '💚',
      berlian: '♦️',
      kyubi: '🌀',
      gold: '👑',
      money: '👾',
      tiketcoin: '🎫',
      stamina: '✨',
      potion: '🥤',
      aqua: '💧',
      trash: '🗑',
      wood: '🪵',
      rock: '🪨',
      batu: '🥌',
      string: '🕸️',
      iron: '⛓️',
      coal: '⚱️',
      botol: '🍶',
      kaleng: '🥫',
      kardus: '🪧',
      eleksirb: '💡',
      emasbatang: '〽️',
      emasbiasa: '🧭',
      rubah: '🦊🌫️',
      sampah: '🗑🌫️',
      serigala: '🐺🌫️',
      kayu: '🛷',
      sword: '⚔️',
      umpan: '🪱',
      healtmonster: '💵',
      emas: '🪅',
      pancingan: '🪝',
      pancing: '🎣',
      common: '📦',
      uncoommon: '🥡',
      mythic: '🗳️',
      pet: '📫',
      gardenboxs: '💐',
      legendary: '🎁',
      anggur: '🍇',
      apel: '🍎',
      jeruk: '🍊',
      mangga: '🥭',
      pisang: '🍌',
      bibitanggur: '🌾🍇',
      bibitapel: '🌾🍎',
      bibitjeruk: '🌾🍊',
      bibitmangga: '🌾🥭',
      bibitpisang: '🌾🍌',
      centaur: '🐐',
      griffin: '🦅',
      kucing: '🐈',
      naga: '🐉',
      fox: '🦊',
      kuda: '🐎',
      phonix: '🕊️',
      wolf: '🐺',
      anjing: '🐶',
      petFood: '🍖',
      makanancentaur: '🐐🥩',
      makanangriffin: '🦅🥩',
      makanankyubi: '🌀🥩',
      makanannaga: '🐉🥩',
      makananpet: '🍱🥩',
      makananphonix: '🕊️🥩'
    }
    let results = Object.keys(emotttt).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emotttt[results[0][0]]
  }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Aggiornato 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})