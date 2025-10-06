-- Initialize TechBirds Database
CREATE DATABASE IF NOT EXISTS techbirds;

-- Create database user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'techbirds_user') THEN

      CREATE ROLE techbirds_user LOGIN PASSWORD 'techbirds_password';
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE techbirds TO techbirds_user;

-- Connect to techbirds database
\c techbirds;

-- Create basic tables structure (placeholder)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    author_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, first_name, last_name, password_hash, role) VALUES
('admin@techbirds.com', 'Admin', 'User', '$2a$10$examplehash', 'Admin'),
('editor@techbirds.com', 'Editor', 'User', '$2a$10$examplehash', 'Editor')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Latest technology news and trends'),
('Startups', 'startups', 'Startup news and entrepreneurship'),
('AI & ML', 'ai-ml', 'Artificial Intelligence and Machine Learning'),
('Web Development', 'web-development', 'Web development tutorials and news')
ON CONFLICT (slug) DO NOTHING;

-- Grant table privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO techbirds_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO techbirds_user;