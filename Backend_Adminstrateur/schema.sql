-- Base de données: ong_db
CREATE DATABASE IF NOT EXISTS ong_db;
USE ong_db;

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table du contenu des pages (Accueil, QSN, Contact)
CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_name VARCHAR(50) NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT,
    content_type ENUM('text', 'image', 'json') DEFAULT 'text',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (page_name, section_name, content_key)
);

-- Table de la galerie
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de l'utilisateur admin (admin@gmail.com / KKStechnologies2022@)
INSERT IGNORE INTO users (email, password) VALUES ('admin@gmail.com', '$2b$10$7ZkQ3J6m8yQ6w4Y9z2u1e.H1y6X6S7T8U9V0W1X2Y3Z4a5b6c7d8e');

-- Insertion initiale de contenu pour l'exemple
INSERT INTO site_content (page_name, section_name, content_key, content_value) VALUES 
('accueil', 'hero', 'title', 'L''Amour Du Prochain'),
('accueil', 'hero', 'subtitle', 'Ensemble pour un monde plus solidaire'),
('contact', 'info', 'address', 'Cocody, Angré, Nelson Mandela'),
('contact', 'hours', 'week', '08h00 - 18h00')
ON DUPLICATE KEY UPDATE content_value = VALUES(content_value);
