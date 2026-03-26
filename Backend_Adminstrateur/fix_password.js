const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

async function fix() {
    console.log('--- Mise à jour du mot de passe admin ---');
    
    const pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'rootwayne',
        database: process.env.DB_NAME || 'ong_db'
    });

    try {
        const hash = await bcrypt.hash('KKStechnologies2022@', 10);
        await pool.query('UPDATE users SET password = ? WHERE email = ?', [hash, 'admin@gmail.com']);
        console.log('✅ Succès : Le mot de passe de admin@gmail.com a été mis à jour !');
    } catch (err) {
        console.error('❌ Erreur :', err);
    } finally {
        process.exit();
    }
}

fix();
