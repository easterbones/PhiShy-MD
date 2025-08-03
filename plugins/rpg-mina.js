let handler = async (m, { conn, usedPrefix }) => {
	
	  let user = global.db.data.users[m.sender];
	let pickaxe = global.db._data.users[m.sender].pickaxe
	let pdurability = global.db._data.users[m.sender].pickaxedurability
    let __waktur = (new Date - global.db._data.users[m.sender].lastmining)
    let _waktur = (180000 - __waktur)
    let waktur = clockString(_waktur)
    let risultato = (pickaxe == 1 ? Math.floor(Math.random() * 5) : '' || pickaxe == 2 ? Math.floor(Math.random() * 7) : '' || pickaxe == 3 ? Math.floor(Math.random() * 10) : '' || pickaxe == 4 ? Math.floor(Math.random() * 20) : '' || pickaxe == 5 ? Math.floor(Math.random() * 30) : '' )
    let risultato2 = (pickaxe == 1 ? Math.floor(Math.random() * 20) : '' || pickaxe == 2 ? Math.floor(Math.random() * 30) : '' || pickaxe == 3 ? Math.floor(Math.random() * 40) : '' || pickaxe == 4 ? Math.floor(Math.random() * 50) : '' || pickaxe == 5 ? Math.floor(Math.random() * 60) : '' )
    let risultato3 = (pickaxe == 1 ? Math.ceil(Math.random() * 200) : '' || pickaxe == 2 ? Math.ceil(Math.random() * 250) : '' || pickaxe == 3 ? Math.ceil(Math.random() * 300) : '' || pickaxe == 4 ? Math.ceil(Math.random() * 350) : '' || pickaxe == 5 ? Math.ceil(Math.random() * 500) : '' )
    let risultato4 = (pickaxe == 1 ? Math.ceil(Math.random() * 200) : '' || pickaxe == 2 ? Math.ceil(Math.random() * 400) : '' || pickaxe == 3 ? Math.ceil(Math.random() * 600) : '' || pickaxe == 4 ? Math.ceil(Math.random() * 800) : '' || pickaxe == 5 ? Math.ceil(Math.random() * 1000) : '' )
    let usura = Math.floor(Math.random() * 100)
    let exp = (Math.floor(Math.random() * 200) + (pickaxe * 70))
    let luogo = (pickRandom(['una grotta', 'un vulcano', 'Giove', 'Saturno']))
    let commento = (pickRandom(['Uff', 'Finalmente finito', 'Sembra spazzatura', 'Sembra buono', 'Dovresti migliorare il piccone per risultati migliori', 'Spazzatura!', 'GG', 'Tante pietre', 'Poco ferro', 'Pochi diamanti', 'Wow tanti diamanti', 'Wow tanto ferro']))
     
    if (pickaxe > 0) {
    if (global.DATABASE._data.users[m.sender].pickaxedurability > 99) {
    if (new Date - global.DATABASE._data.users[m.sender].lastmining > 180000) {
       
global.DATABASE._data.users[m.sender].lastmining = new Date * 1
global.DATABASE._data.users[m.sender].diamond += risultato * 1 
global.DATABASE._data.users[m.sender].iron += risultato2 * 1 
global.DATABASE._data.users[m.sender].batu += risultato3 * 1 
global.DATABASE._data.users[m.sender].pickaxedurability -= usura * 1
global.DATABASE._data.users[m.sender].exp += risultato4 * 1

          setTimeout(() => {
          	m.reply(`Hai minato in *${luogo}* e hai ottenuto:
          
- Diamanti: ${risultato}
- Ferro: ${risultato2}
- Pietre: ${risultato3}
- Exp: ${risultato4}

${commento}`)
          }, 0)
          
            } else m.reply(`Sei senza energia, ritorna tra *${waktur}*`)
         } else m.reply(`Ripara il tuo piccone scrivendo ${usedPrefix}shop up piccone`)
     } else m.reply(`Non hai ancora un piccone, compralo scrivendo ${usedPrefix}shop buy piccone`)
 }

handler.help = ['mining']
handler.tags = ['rpg']

handler.command = /^(mining|mina)$/i

export default handler;

function clockString(seconds) {
  d = Math.floor(seconds / (1000 * 60 * 60 * 24));
  h = Math.floor((seconds / (1000 * 60 * 60)) % 24);
  m = Math.floor((seconds / (1000 * 60)) % 60);
  s = Math.floor((seconds / 1000) % 60);
  
  dDisplay = d > 0 ? d + (d == 1 ? " giorno," : " giorni,") : "";
  hDisplay = h > 0 ? h + (h == 1 ? " ora, " : " ore, ") : "";
  mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minuti, ") : "";
  sDisplay = s > 0 ? s + (s == 1 ? " secondo" : " secondi") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}