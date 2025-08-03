// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Per servire i file HTML, CSS e JS

// File dei commenti
const COMMENTS_FILE = path.join(__dirname, 'commenti.json');

// Inizializza il file dei commenti se non esiste
if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify({}));
}

// Leggi i commenti da file
function readComments() {
    const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
    return JSON.parse(data);
}

// Scrivi i commenti su file
function writeComments(comments) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// API per ottenere i commenti di un post
app.get('/api/comments/:postIndex', (req, res) => {
    try {
        const comments = readComments();
        const postIndex = req.params.postIndex;
        res.json(comments[postIndex] || []);
    } catch (error) {
        console.error('Errore nel recupero dei commenti:', error);
        res.status(500).json({ error: 'Errore nel recupero dei commenti' });
    }
});

// API per aggiungere un commento
app.post('/api/comments', (req, res) => {
    try {
        const { postIndex, name, text } = req.body;
        
        if (!postIndex && postIndex !== 0 || !name || !text) {
            return res.status(400).json({ error: 'Dati mancanti' });
        }
        
        const comments = readComments();
        
        if (!comments[postIndex]) {
            comments[postIndex] = [];
        }
        
        comments[postIndex].push({ name, text, date: new Date().toISOString() });
        writeComments(comments);
        
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Errore nel salvare il commento:', error);
        res.status(500).json({ error: 'Errore nel salvare il commento' });
    }
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});