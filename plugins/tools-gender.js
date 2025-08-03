import { webp2png } from '../lib/webp2mp4.js'
import * as faceapi from 'face-api.js'
import * as canvas from 'canvas'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Configurazione canvas
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

// Percorso modelli
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MODEL_URL = path.join(__dirname, '../models')

// Variabile per tracciare lo stato del caricamento dei modelli
let modelsLoaded = false

// Mappatura espressioni in italiano
const EXPRESSION_MAP = {
  neutral: "Neutrale",
  happy: "Felice",
  sad: "Triste",
  angry: "Arrabbiato",
  fearful: "Spaventato",
  disgusted: "Disgustato",
  surprised: "Sorpreso"
}

async function loadModels() {
  if (!modelsLoaded) {
    console.log('Caricamento modelli face-api.js...')
    
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
      await faceapi.nets.ageGenderNet.loadFromDisk(MODEL_URL)
      await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL)
      await faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_URL)
      
      modelsLoaded = true
      console.log('Tutti i modelli caricati con successo!')
    } catch (error) {
      console.error('Errore nel caricamento dei modelli:', error)
      throw new Error('Impossibile caricare i modelli necessari')
    }
  }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Verifica che il messaggio sia una foto o uno sticker
    if (!m.quoted) throw `🖼️ Rispondi a una foto/sticker con *${usedPrefix + command}* per analizzare il volto`
    
    const q = m.quoted || m
    let mime = q.mimetype || ''
    
    // Carica i modelli prima di tutto
    await loadModels()

    let buffer
    // Se è uno sticker, converti in PNG
    if (/sticker/.test(mime)) {
      buffer = await q.download()
      buffer = await webp2png(buffer)
    } 
    // Se è un'immagine, scaricala direttamente
    else if (/image/.test(mime)) {
      buffer = await q.download()
    } 
    else {
      throw `❌ Formato non supportato. Rispondi a una foto o sticker`
    }

    // Salva l'immagine temporaneamente
    let tempFile = `temp_${Date.now()}.jpg`
    fs.writeFileSync(tempFile, buffer)

    // Analizza l'immagine
    const img = await canvas.loadImage(tempFile)
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withAgeAndGender()
      .withFaceExpressions()

    // Elimina il file temporaneo
    fs.unlinkSync(tempFile)

    if (detections.length === 0) {
      return m.reply('🔍 Nessun volto rilevato nella foto.')
    }

    // Processa i risultati
    let resultText = `👥 *Risultati analisi* (${detections.length} volt${detections.length > 1 ? 'i' : 'o'} trovati):\n\n`
    
    detections.forEach((detection, i) => {
      const gender = detection.gender === 'male' ? '👨 Maschio' : '👩 Femmina'
      const age = Math.round(detection.age)
      const genderConfidence = Math.round(detection.genderProbability * 100)
      
      // Trova l'espressione predominante
      const expressions = detection.expressions
      const sortedExpressions = Object.entries(expressions)
        .sort(([, a], [, b]) => b - a)
      const [dominantExpression, dominantConfidence] = sortedExpressions[0]
      
      resultText += `*Volto ${i + 1}:*\n`
      resultText += `• Genere: ${gender} (${genderConfidence}% accuratezza)\n`
      resultText += `• Età stimata: ${age} anni\n`
      resultText += `• Espressione: ${EXPRESSION_MAP[dominantExpression] || dominantExpression} (${Math.round(dominantConfidence * 100)}%)\n\n`
      
      // Aggiungi dettagli aggiuntivi per le espressioni se richiesto
      if (detections.length === 1) {
        resultText += `📊 *Dettaglio espressioni:*\n`
        sortedExpressions.forEach(([expr, conf]) => {
          resultText += `- ${EXPRESSION_MAP[expr] || expr}: ${Math.round(conf * 100)}%\n`
        })
        resultText += `\n`
      }
    })

    await m.reply(resultText)

  } catch (error) {
    console.error('Errore durante il riconoscimento:', error)
    await m.reply('❌ Errore durante l\'analisi. Assicurati di:\n1. Rispondere a una foto/sticker valido\n2. Che nella foto ci sia almeno un volto visibile\n3. Che tutti i modelli siano presenti nella cartella /models')
  }
}

// Comandi e help
handler.help = ['analizzavolto']
handler.tags = ['tools']
handler.command = /^(genere|gender|analizzavolto|face)$/i

export default handler