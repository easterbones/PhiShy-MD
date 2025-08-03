import { randomUUID } from 'crypto'
import { LUOGHI, AZIONI, PERSONAGGI, OGGETTI, FRASI } from '../lib/rickmorty_data.js'

// Funzione per estrarre due id random dal gruppo (come in zizzania)
function getRandomGroupMembers(m) {
  if (m && m.isGroup && m.groupMetadata && m.groupMetadata.participants && m.groupMetadata.participants.length >= 2) {
    let ps = m.groupMetadata.participants.map(v => v.id)
    let a = ps[Math.floor(Math.random() * ps.length)]
    let b
    let tries = 0
    do { b = ps[Math.floor(Math.random() * ps.length)]; tries++ } while (b === a && tries < 5)
    // Format: mostra solo la parte nome/numero
    let toM = x => '@' + (x.split('@')[0] || x)
    return [toM(a), toM(b)]
  }
  // fallback
  return ['@Rick', '@Morty']
}

// Estendi PERSONAGGI con altri universi
const CROSSOVER = [
  'Shrek',
  'SpongeBob',
  'Patrick Stella',
  'Harry Potter',
  'Hermione Granger',
  'Darth Vader',
  'Luke Skywalker',
  'Homer Simpson',
  'Bart Simpson',
  'Lisa Simpson',
  'Goku',
  'Vegeta',
  'Naruto',
  'Sasuke',
  'Batman',
  'Joker',
  'Spider-Man',
  'Iron Man',
  'Capitan America',
  'Thanos',
  'Optimus Prime',
  'Megatron',
  'Elsa',
  'Olaf',
  'Gru',
  'Minion',
  'Pikachu',
  'Ash Ketchum',
  'Yoda',
  'Gandalf',
  'Frodo',
  'Dobby',
  'Rick Sanchez',
  'Morty Smith',
  'Summer Smith',
  'Jerry Smith',
  'Beth Smith'
]

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomFrase(personaggio) {
  const frasiPersonaggio = FRASI.filter(f => f.startsWith(personaggio + ':'))
  if (frasiPersonaggio.length > 0) return random(frasiPersonaggio)
  return random(FRASI)
}

function metaFrase(step, p1, p2) {
  // Frasi che rompono la quarta parete
  const meta = [
    `Narratore: Sì, questa storia è generata da un bot. Non fateci troppo caso.`,
    `Rick: Morty, hai notato che ogni volta che facciamo qualcosa, sembra scritto da un algoritmo?`,
    `Morty: Rick, perché ogni volta che parliamo succede qualcosa di assurdo?`,
    `Narratore: Se siete ancora qui, complimenti. Siete più resistenti di Jerry!`,
    `Rick: Ehi, spettatore! Sì, parlo con te. Sei pronto per un altro step casuale?`,
    `Morty: Non mi piace quando il narratore ci osserva così...`,
    `Narratore: Non preoccupatevi, tutto questo ha perfettamente senso... in qualche universo.`,
    `Rick: Morty, questa storia è più random di una puntata scritta da un bot ubriaco.`,
    `Narratore: Se volete saltare avanti, non potete. È tutto generato in tempo reale!`,
    `Rick: Scommetto che il prossimo step non avrà senso.`,
    `Morty: Rick, chi ci sta scrivendo queste battute?`,
    `Narratore: E ora, un po' di pubblicità... Scherzo!`,
    `Rick: Morty, saluta l'utente che sta leggendo questa roba!`,
    `Morty: Ciao utente! Spero che tu stia capendo qualcosa...`,
    `Narratore: E se vi state chiedendo dove stiamo andando... nemmeno io lo so.`
  ]
  // Più spesso ai primi step e random dopo
  if (step === 1 || Math.random() < 0.3) return '\n' + random(meta)
  return ''
}

function generaAvventura(m) {
  const [main1, main2] = getRandomGroupMembers(m)
  const steps = Math.floor(Math.random() * 3) + 6
  let storia = []
  let luogo = random(LUOGHI)
  let oggetto = random(OGGETTI)
  storia.push(`🌀 Narratore: Benvenuti in un nuovo episodio generato!\n${main1} e ${main2} si ritrovano in ${luogo}, armati solo di un ${oggetto}.`)
  let personaggio = random(CROSSOVER)
  for (let i = 1; i < steps; i++) {
    if (Math.random() < 0.5) luogo = random(LUOGHI)
    if (Math.random() < 0.5) oggetto = random(OGGETTI)
    if (Math.random() < 0.5) personaggio = random(CROSSOVER)
    const azione = random(AZIONI)
    // Narratore introduce lo step
    storia.push(`\n🌌 Step ${i}: Narratore: E ora succede qualcosa di totalmente plausibile...`)
    // Azione
    storia.push(`${main1} e ${main2} ${azione.toLowerCase()} insieme a ${personaggio} in ${luogo} usando ${oggetto}.`)
    const [p1, p2] = randomPair([main1, main2])
    const frase1 = randomFrase(p1)
    let frase2 = randomFrase(p2)
    let tries = 0
    while ((frase2 === frase1 || frase2.startsWith(p1)) && tries < 5) { frase2 = randomFrase(p2); tries++ }
    storia.push(`💬 ${p1}: ${frase1.replace(p1 + ':', '').trim()}`)
    storia.push(`💬 ${p2}: ${frase2.replace(p2 + ':', '').trim()}`)
    storia.push(metaFrase(i, p1, p2))
    // Dialogo aggiuntivo
    if (Math.random() < 0.5) {
      const frase1b = randomFrase(p1)
      const frase2b = randomFrase(p2)
      storia.push(`💬 ${p1}: ${frase1b.replace(p1 + ':', '').trim()}`)
      storia.push(`💬 ${p2}: ${frase2b.replace(p2 + ':', '').trim()}`)
    }
  }
  // Finale narrativo e meta
  const finali = [
    'Narratore: E così, tra un portale e l’altro, i nostri eroi si allontanano verso una nuova assurda avventura. Forse questa era la migliore storia generata oggi.',
    'Narratore: Ma questa è solo una delle infinite storie del multiverso... e probabilmente la più casuale.',
    'Narratore: Il multiverso non sarà mai più lo stesso, ma i protagonisti sono già pronti a ripartire. O a essere generati di nuovo.',
    'Narratore: Tutto torna alla normalità... o forse no? Grazie per aver sopportato questa follia!',
    'Narratore: Un portale si apre e li risucchia in una nuova avventura. O forse in un altro prompt.'
  ]
  storia.push('\n🌀 ' + random(finali))
  return storia
}

function randomPair(arr) {
  const first = random(arr)
  let second = random(arr)
  let tries = 0
  while (second === first && tries < 5) { second = random(arr); tries++ }
  return [first, second]
}

let handler = async (m, { conn }) => {
  const storia = generaAvventura(m)
  for (let step of storia) {
    await conn.sendMessage(m.chat, { text: step }, { quoted: m })
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
  }
}

handler.help = ['rickmorty']
handler.tags = ['fun']
handler.command = /^(rickmorty|rickandmorty|avventurarickmorty)$/i
handler.register = false

export default handler
