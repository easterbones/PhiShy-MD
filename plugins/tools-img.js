import { googleImage } from '@bochilteam/scraper'

var handler = async (m, { conn, text, usedPrefix, command }) => {

// Regex NSFW ultra potenziata
const regexNSFW = new RegExp(`\\b(?:` + [
  // Parole comuni
  'sex', 'sexo', 'semen', 'cum', 'hentai', 'porn', 'porno', 'xxx', 'nsfw', 'nude', 'nuda', 'nudo', 'desnuda', 'desnudo', 'hot', 'erotic', 'erotico',
  'pussy', 'boobs', 'tits', 'teta', 'vagina', 'coño', 'chocha', 'cuca', 'culo', 'polla', 'pene', 'pinga', 'verga', 'ass', 'trasero', 'butt', 'anal',
  'oral', 'blowjob', 'fingering', 'dildo', 'vibrator', 'cock', 'pija', 'milf', 'teen', 'bdsm', 'femdom', 'dominatrix', 'submissive', 'orgasm',
  'penetration', 'squirting', 'futanari', 'yuri', 'yaoi', 'lesbian', 'gay', 'masturbation', 'masturbate', 'striptease', 'camgirl', 'camsex',
  'escort', 'prostitute', 'putita', 'putito', 'puto', 'puta', 'puta madre', 'rule34', 'sexmex', 'brazzers', 'pornhub', 'xvideos', 'xnxx', 'redtube',
  'spankbang', 'bukkake', 'cumshot', 'ahegao', '69', 'deepthroat', 'hardcore', 'softcore', 'dp', 'double penetration', 'facial', 'creampie',
  'interracial', 'incest', 'stepmom', 'stepdad', 'stepsister', 'stepbrother',
  // Atti criminali
  'pedofilia', 'pedophile', 'cp', 'child porn', 'zoofilia', 'bestiality', 'necrofilia', 'necro', 'rape', 'violacion', 'violation', 'molestia', 'molestation',
  'abuso', 'abuse', 'snuff', 'gore', 'muertos', 'morte', 'assassinio', 'assassino', 'omicidio',
  // Nomi attrici/attori porno (esempi)
  'mia khalifa', 'lana rhoades', 'marsha may', 'misha cross', 'mia marin', 'violetta bloom', 'riley reid', 'abella danger', 'sasha grey',
  'brandi love', 'danny d', 'johnny sins', 'lexi belle', 'madison ivy', 'alura jenson',
  // Altro
  'furry', 'furro', 'furra', 'erofeet', 'feet fetish', 'footjob', 'fetish', '\\+18'
].join('|').replace(/\s+/g, '[\\s\\W_]*') + `)\\b`, 'i')

if (regexNSFW.test(m.text)) {
  return conn.reply(m.chat, '⚠️ 𝐍𝐨𝐧 𝐩𝐨𝐬𝐬𝐨 𝐢𝐧𝐯𝐢𝐚𝐫𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐧𝐭𝐞𝐧𝐮𝐭𝐨. 𝐏𝐚𝐫𝐨𝐥𝐞 𝐯𝐢𝐞𝐭𝐚𝐭𝐞 𝐫𝐢𝐬𝐜𝐡𝐢𝐨𝐬𝐞.', m)
}

if (!text) {
  return conn.reply(m.chat, `> ⓘ 𝐔𝐬𝐨 𝐝𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:\n> ${usedPrefix + command} gatto`, m)
}

const res = await googleImage(text)
let image = res.getRandom()
let link = image

conn.sendFile(m.chat, link, 'errore.jpg', `🔍 𝐈𝐦𝐦𝐚𝐠𝐢𝐧𝐞: ${text}`, m, rcanal)
}

handler.command = /^(immagine|img|immagini)$/
handler.priority = 0;
export default handler
