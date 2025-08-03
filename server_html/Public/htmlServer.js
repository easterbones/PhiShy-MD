import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// ============= Configurazione Multer per upload file =============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ============= Configurazione Express =============
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve i file caricati
app.use(express.json());

// ============= Percorsi per i commenti =============
const COMMENTS_FILE = path.join(process.cwd(), 'commenti.json');

// Carica commenti di un post
app.get('/api/comments/:postIndex', (req, res) => {
    const postIndex = req.params.postIndex;
    let comments = {};

    if (fs.existsSync(COMMENTS_FILE)) {
        comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
    }

    res.json(comments[postIndex] || []);
});

// Salva un nuovo commento
app.post('/api/comments', (req, res) => {
    const { postIndex, name, text } = req.body;
    
    // Validazione più robusta
    if (typeof postIndex === 'undefined' || !name || !text) {
        return res.status(400).json({ error: 'Dati mancanti' });
    }

    try {
        let comments = {};
        if (fs.existsSync(COMMENTS_FILE)) {
            comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
        }

        if (!comments[postIndex]) {
            comments[postIndex] = [];
        }

        comments[postIndex].push({ 
            name: name.trim(), 
            text: text.trim(),
            timestamp: new Date().toISOString() 
        });

        fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
        res.json({ success: true });
    } catch (err) {
        console.error('Errore nel salvataggio:', err);
        res.status(500).json({ error: 'Errore interno del server' });
    }
});
// ============= Percorsi per l'upload file =============
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Nessun file caricato!' });
  }
  res.json({ success: true, message: 'File caricato con successo!', filename: req.file.filename });
});

// Restituisci la lista dei file caricati
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Errore nel leggere i file!' });
    }
    res.json(files);
  });
});

// ============= Avvio server =============
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`- GET  /api/comments/:postIndex`);
  console.log(`- POST /api/comments`);
  console.log(`- POST /upload`);
  console.log(`- GET  /files`);
});