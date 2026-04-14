const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.json({ message: "Le serveur Backend Node.js est bien en ligne !" });
});

// Connexion MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ong_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// TEST CONNEXION
pool.getConnection()
    .then(conn => {
        console.log('Connexion MySQL réussie à ong_db');
        conn.release();
    })
    .catch(err => console.error('Erreur connexion MySQL:', err));

// CONFIG MULTER (UPLOAD IMAGES)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// MIDDLEWARE AUTHENTIFICATION
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// UPLOAD IMAGE (contenu des pages)
app.post('/api/upload-image', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });
    res.json({ url: `/uploads/${req.file.filename}` });
});

// --- ROUTES AUTH ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email || '']);
        if (rows.length === 0) return res.status(401).json({ message: 'Email non trouvé' });

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROUTES CONTENU DES PAGES ---
// Récupérer tout le contenu
app.get('/api/content', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM site_content');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mettre à jour du contenu
app.put('/api/content', authenticateToken, async (req, res) => {
    const { page_name, section_name, content_key, content_value } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO site_content (page_name, section_name, content_key, content_value) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE content_value = ?',
            [page_name, section_name, content_key, content_value, content_value]
        );
        res.json({ message: 'Contenu mis à jour avec succès', result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Réinitialiser tout le contenu du site
app.delete('/api/content/reset', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM site_content');
        res.json({ message: 'Contenu réinitialisé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROUTES MAINTENANCE ---
// Récupérer le statut de maintenance
app.get('/api/maintenance', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT content_value FROM site_content WHERE page_name = 'site' AND section_name = 'maintenance' AND content_key = 'enabled'"
        );
        const enabled = rows.length > 0 ? rows[0].content_value === 'true' : false;
        const [msgRows] = await pool.query(
            "SELECT content_value FROM site_content WHERE page_name = 'site' AND section_name = 'maintenance' AND content_key = 'message'"
        );
        const message = msgRows.length > 0 ? msgRows[0].content_value : 'Site en maintenance. Nous revenons bientôt !';
        res.json({ enabled, message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mettre à jour le mode maintenance
app.put('/api/maintenance', authenticateToken, async (req, res) => {
    const { enabled, message } = req.body;
    try {
        await pool.query(
            "INSERT INTO site_content (page_name, section_name, content_key, content_value) VALUES ('site', 'maintenance', 'enabled', ?) ON DUPLICATE KEY UPDATE content_value = ?",
            [String(enabled), String(enabled)]
        );
        await pool.query(
            "INSERT INTO site_content (page_name, section_name, content_key, content_value) VALUES ('site', 'maintenance', 'message', ?) ON DUPLICATE KEY UPDATE content_value = ?",
            [message || 'Site en maintenance. Nous revenons bientôt !', message || 'Site en maintenance. Nous revenons bientôt !']
        );
        res.json({ message: 'Mode maintenance mis à jour', enabled });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROUTES GALERIE ---
app.get('/api/gallery', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/gallery', authenticateToken, upload.single('image'), async (req, res) => {
    const { title, category } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    try {
        const [result] = await pool.query(
            'INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?)',
            [title, imageUrl, category || 'general']
        );
        res.json({ message: 'Image ajoutée à la galerie', id: result.insertId, imageUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
        res.json({ message: 'Image supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur admin en écoute sur http://localhost:${PORT}`);
});
