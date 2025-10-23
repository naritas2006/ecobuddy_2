-- EcoBuddy Database Schema for SQLite
-- This script creates all tables for the EcoBuddy application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    user_type TEXT DEFAULT 'Individual' CHECK (user_type IN ('Individual', 'Organization')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    carbon_per_point REAL NOT NULL DEFAULT 0.1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id),
    description TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    carbon_offset REAL NOT NULL DEFAULT 0,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_data BLOB,
    image_filename TEXT,
    image_content_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
    challenge_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reward_points INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Challenges (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS user_challenges (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Completed')),
    points_earned INTEGER DEFAULT 0,
    date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, challenge_id)
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL,
    description TEXT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Team Members (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS team_members (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, team_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(activity_id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    date_posted DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Upvotes table
CREATE TABLE IF NOT EXISTS upvotes (
    upvote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(activity_id) ON DELETE CASCADE,
    upvote_date DATETIME DEFAULT CURRENT_TIMESTAMP,
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
INSERT OR IGNORE INTO categories (name, description, carbon_per_point) VALUES
('Recycling', 'Recycling materials like plastic, paper, glass', 0.1),
('Transportation', 'Using eco-friendly transportation methods', 0.2),
('Energy Conservation', 'Reducing energy consumption', 0.15),
('Tree Planting', 'Planting trees and maintaining green spaces', 0.3),
('Water Conservation', 'Saving water through various methods', 0.08),
('Waste Reduction', 'Reducing overall waste production', 0.12),
('Sustainable Living', 'General sustainable living practices', 0.1);

-- Insert sample challenges
INSERT OR IGNORE INTO challenges (name, description, start_date, end_date, reward_points) VALUES
('30-Day Recycling Challenge', 'Recycle at least one item every day for 30 days', date('now'), date('now', '+30 days'), 100),
('Green Commute Week', 'Use eco-friendly transportation for a week', date('now'), date('now', '+7 days'), 50),
('Energy Saver Month', 'Reduce energy consumption by 20% this month', date('now'), date('now', '+30 days'), 150),
('Tree Planting Initiative', 'Plant 5 trees this month', date('now'), date('now', '+30 days'), 200);
