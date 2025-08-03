# PhiShy-MD

Un bot WhatsApp multi-funzionale con una vasta gamma di funzionalità per gruppi e chat private.

## 🚀 Caratteristiche

- Sistema RPG completo con economia, livelli e inventario
- Giochi interattivi (blackjack, tris, slot machine, ecc.)
- Strumenti di moderazione per gruppi
- Generazione di sticker e meme
- Integrazione AI per conversazioni intelligenti
- Download da social media (TikTok, Instagram, ecc.)
- Sistema di matrimonio e famiglia virtuale
- Comandi vocali e sintesi vocale
- Dashboard web per statistiche

## 📋 Requisiti

- Node.js v16 o superiore
- WhatsApp account
- Connessione internet stabile

## 🛠️ Installazione

1. Clona il repository:
```bash
git clone https://github.com/easterbones/PhiShy-MD.git
cd PhiShy-MD
```

2. Installa le dipendenze:
```bash
npm install
```

3. **Problemi con Canvas (Windows)**:
Se riscontri errori con canvas, prova:
```bash
# Opzione 1: Versione compatibile
npm install canvas@2.11.2

# Opzione 2: Ricompila da sorgente (richiede Visual Studio Build Tools)
npm run install-canvas-win
```

**Su Linux/macOS**:
```bash
npm run install-canvas-linux
```

4. Configura il bot:
```bash
node install.js
```

5. Avvia il bot:
```bash
npm start
```

## ⚠️ Risoluzione Problemi

### Errore Canvas su Windows
Se vedi errori tipo "canvas.node is not a valid Win32 application":

1. **Installa Visual Studio Build Tools 2022**
2. **Installa Python 3.x**
3. **Esegui**: `npm rebuild canvas`
4. **Alternativa**: Alcuni comandi grafici non funzioneranno ma il bot sarà comunque operativo

## 📱 Come usare

1. Scansiona il QR code con WhatsApp Web
2. Il bot sarà attivo e risponderà ai comandi
3. Usa `.menu` per vedere tutti i comandi disponibili

## 🎮 Comandi principali

- `.menu` - Mostra il menu principale
- `.reg` - Registrati per usare le funzionalità RPG
- `.perfil` - Visualizza il tuo profilo
- `.shop` - Negozio virtuale
- `.play` - Scarica musica
- `.sticker` - Crea sticker

## 🤝 Contributi

I contributi sono benvenuti! Sentiti libero di aprire issue o pull request.

## 📄 Licenza

Questo progetto è sotto licenza MIT.

## ⚠️ Disclaimer

Questo bot è solo per scopi educativi. L'uso improprio è a tuo rischio e pericolo.
