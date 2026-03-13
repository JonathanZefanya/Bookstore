-- Create database if not exists
CREATE DATABASE IF NOT EXISTS bookstore_db;
USE bookstore_db;

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  site_name VARCHAR(255),
  site_logo VARCHAR(255),
  site_favicon VARCHAR(255),
  theme_color VARCHAR(7),
  footer_text TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(255),
  canonical_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  author VARCHAR(255),
  cover VARCHAR(255),
  isbn VARCHAR(20),
  price DECIMAL(10,2),
  publish_year INT,
  content LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (site_name, theme_color, created_at, updated_at) 
SELECT 'Bookstore', '#000000', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM settings);
