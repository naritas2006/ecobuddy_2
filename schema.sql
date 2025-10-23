-- EcoBuddy Database Schema
-- Create database: CREATE DATABASE ecobuddy;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'Individual' CHECK (user_type IN ('Individual', 'Organization')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    carbon_per_point DECIMAL(10, 4) NOT NULL DEFAULT 0.1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    activity_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id),
    description TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    carbon_offset DECIMAL(10, 4) NOT NULL DEFAULT 0,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_data BYTEA,
    image_filename VARCHAR(255),
    image_content_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
    challenge_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reward_points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Challenges (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS user_challenges (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed')),
    points_earned INTEGER DEFAULT 0,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, challenge_id)
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    description TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS team_members (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, team_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(activity_id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Upvotes table
CREATE TABLE IF NOT EXISTS upvotes (
    upvote_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(activity_id) ON DELETE CASCADE,
    upvote_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, activity_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date_time ON activities(date_time);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_comments_activity_id ON comments(activity_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_activity_id ON upvotes(activity_id);

-- Insert default categories
INSERT INTO categories (name, description, carbon_per_point) VALUES
('Recycling', 'Recycling materials like plastic, paper, glass', 0.1),
('Transportation', 'Using eco-friendly transportation methods', 0.2),
('Energy Conservation', 'Reducing energy consumption', 0.15),
('Tree Planting', 'Planting trees and maintaining green spaces', 0.3),
('Water Conservation', 'Saving water through various methods', 0.08),
('Waste Reduction', 'Reducing overall waste production', 0.12),
('Sustainable Living', 'General sustainable living practices', 0.1)
ON CONFLICT DO NOTHING;

-- Insert sample challenges
INSERT INTO challenges (name, description, start_date, end_date, reward_points) VALUES
('30-Day Recycling Challenge', 'Recycle at least one item every day for 30 days', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 100),
('Green Commute Week', 'Use eco-friendly transportation for a week', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 50),
('Energy Saver Month', 'Reduce energy consumption by 20% this month', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 150),
('Tree Planting Initiative', 'Plant 5 trees this month', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 200)
ON CONFLICT DO NOTHING;
