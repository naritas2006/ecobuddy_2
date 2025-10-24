-- USERS TABLE 
 CREATE TABLE users ( 
     user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
     name TEXT NOT NULL, 
     email TEXT NOT NULL UNIQUE, 
     password_hash TEXT NOT NULL, 
     user_type TEXT CHECK(user_type IN ('Individual', 'Organization')) NOT NULL, 
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP 
 ); 
 
 -- CATEGORIES TABLE (Updated) 
 CREATE TABLE categories ( 
     category_id INTEGER PRIMARY KEY AUTOINCREMENT, 
     name TEXT NOT NULL, 
     description TEXT, 
     points_per_unit REAL NOT NULL DEFAULT 1.0,       -- Points per unit of activity 
     carbon_per_unit REAL NOT NULL DEFAULT 0.0,       -- Carbon offset per unit of activity (kg) 
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
 ); 
 
 -- ACTIVITIES TABLE 
 CREATE TABLE activities ( 
     activity_id INTEGER PRIMARY KEY AUTOINCREMENT, 
     user_id INTEGER NOT NULL, 
     category_id INTEGER NOT NULL, 
     description TEXT, 
     quantity REAL NOT NULL,            -- NEW: Quantity entered by user 
     points REAL NOT NULL,              -- Calculated: quantity * points_per_unit 
     carbon_offset REAL NOT NULL,       -- Calculated: quantity * carbon_per_unit 
     date_time DATETIME DEFAULT CURRENT_TIMESTAMP, 
     image_data BLOB, 
     image_filename TEXT, 
     image_content_type TEXT, 
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
     FOREIGN KEY(user_id) REFERENCES users(user_id), 
     FOREIGN KEY(category_id) REFERENCES categories(category_id) 
 ); 
 
 -- CHALLENGES TABLE 
 CREATE TABLE challenges ( 
     challenge_id INTEGER PRIMARY KEY AUTOINCREMENT, 
     name TEXT NOT NULL, 
     description TEXT, 
     start_date DATE, 
     end_date DATE, 
     reward_points REAL, 
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
 ); 
 
 -- USER_CHALLENGES TABLE 
 CREATE TABLE user_challenges ( 
     user_id INTEGER NOT NULL, 
     challenge_id INTEGER NOT NULL, 
     status TEXT CHECK(status IN ('Active', 'Completed')) NOT NULL DEFAULT 'Active', 
     points_earned REAL DEFAULT 0, 
     date_joined DATETIME DEFAULT CURRENT_TIMESTAMP, 
     PRIMARY KEY(user_id, challenge_id), 
     FOREIGN KEY(user_id) REFERENCES users(user_id), 
     FOREIGN KEY(challenge_id) REFERENCES challenges(challenge_id) 
 ); 
 
 -- TEAMS TABLE 
 CREATE TABLE teams ( 
     team_id INTEGER PRIMARY KEY AUTOINCREMENT, 
     team_name TEXT NOT NULL, 
     description TEXT, 
     date_created DATETIME DEFAULT CURRENT_TIMESTAMP 
 ); 
 
 -- TEAM_MEMBERS TABLE 
 CREATE TABLE team_members ( 
     user_id INTEGER NOT NULL, 
     team_id INTEGER NOT NULL, 
     join_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
     PRIMARY KEY(user_id, team_id), 
     FOREIGN KEY(user_id) REFERENCES users(user_id), 
     FOREIGN KEY(team_id) REFERENCES teams(team_id) 
 ); 
 
 -- COMMENTS TABLE 
 CREATE TABLE comments ( 
     comment_id INTEGER PRIMARY KEY AUTOINCREMENT, 
     user_id INTEGER NOT NULL, 
     activity_id INTEGER NOT NULL, 
     text TEXT NOT NULL, 
     date_posted DATETIME DEFAULT CURRENT_TIMESTAMP, 
     FOREIGN KEY(user_id) REFERENCES users(user_id), 
     FOREIGN KEY(activity_id) REFERENCES activities(activity_id) 
 ); 
 
 -- UPVOTES TABLE 
 CREATE TABLE upvotes ( 
     upvote_id INTEGER PRIMARY KEY AUTOINCREMENT, 
     user_id INTEGER NOT NULL, 
     activity_id INTEGER NOT NULL, 
     upvote_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
     UNIQUE(user_id, activity_id), 
     FOREIGN KEY(user_id) REFERENCES users(user_id), 
     FOREIGN KEY(activity_id) REFERENCES activities(activity_id) 
 ); 
 
 -- INDEXES 
 CREATE INDEX idx_activities_user_id ON activities(user_id); 
 CREATE INDEX idx_activities_date_time ON activities(date_time); 
 CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id); 
 CREATE INDEX idx_user_challenges_challenge_id ON user_challenges(challenge_id); 
 CREATE INDEX idx_comments_activity_id ON comments(activity_id); 
 CREATE INDEX idx_upvotes_activity_id ON upvotes(activity_id);