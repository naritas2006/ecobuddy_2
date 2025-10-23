-- Demo data for EcoBuddy
-- Run this script after setting up the database to populate it with sample data

-- Insert demo users
INSERT INTO users (name, email, password_hash, user_type) VALUES
('Demo User', 'demo@ecobuddy.com', 'hashed_demo123', 'Individual'),
('Eco Warrior', 'warrior@ecobuddy.com', 'hashed_demo123', 'Individual'),
('Green Team', 'team@ecobuddy.com', 'hashed_demo123', 'Organization'),
('Climate Champion', 'champion@ecobuddy.com', 'hashed_demo123', 'Individual'),
('Sustainable Living', 'sustainable@ecobuddy.com', 'hashed_demo123', 'Organization')
ON CONFLICT (email) DO NOTHING;

-- Insert sample activities
INSERT INTO activities (user_id, category_id, description, points, carbon_offset, date_time) VALUES
(1, 1, 'Recycled 10 plastic bottles and 5 aluminum cans', 15, 1.5, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(1, 2, 'Cycled to work instead of driving - 5 miles round trip', 25, 2.0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 4, 'Planted 3 trees in the community garden', 45, 6.0, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(2, 3, 'Turned off all lights and electronics for 2 hours', 10, 0.8, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, 5, 'Used rainwater to water plants instead of tap water', 8, 0.5, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 1, 'Office recycling program - collected 50kg of paper', 30, 3.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(3, 2, 'Organized carpool for 5 employees', 20, 4.0, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(4, 4, 'Started community garden with 10 participants', 60, 8.0, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(4, 6, 'Reduced office waste by 40% through better practices', 35, 2.5, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(5, 7, 'Implemented sustainable living practices at home', 25, 1.8, CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Join users to challenges
INSERT INTO user_challenges (user_id, challenge_id, status, points_earned) VALUES
(1, 1, 'Active', 15),
(1, 2, 'Active', 25),
(2, 1, 'Active', 10),
(2, 3, 'Active', 8),
(3, 1, 'Active', 30),
(3, 2, 'Active', 20),
(4, 4, 'Active', 60),
(4, 1, 'Active', 35),
(5, 3, 'Active', 25)
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (user_id, activity_id, text) VALUES
(2, 1, 'Great job on the recycling! Every bit helps.'),
(3, 2, 'Cycling to work is such a great way to reduce carbon footprint.'),
(4, 3, 'Tree planting is one of the most impactful activities!'),
(5, 4, 'Energy conservation is so important. Well done!'),
(1, 5, 'Using rainwater is a smart way to conserve resources.')
ON CONFLICT DO NOTHING;

-- Insert sample upvotes
INSERT INTO upvotes (user_id, activity_id) VALUES
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(1, 3),
(3, 3),
(2, 4),
(4, 4),
(1, 5),
(3, 5)
ON CONFLICT DO NOTHING;

-- Update user statistics (this would normally be calculated automatically)
UPDATE users SET 
    total_points = (
        SELECT COALESCE(SUM(a.points), 0) + COALESCE(SUM(uc.points_earned), 0)
        FROM activities a
        LEFT JOIN user_challenges uc ON users.user_id = uc.user_id
        WHERE a.user_id = users.user_id OR uc.user_id = users.user_id
    ),
    total_carbon_offset = (
        SELECT COALESCE(SUM(a.carbon_offset), 0)
        FROM activities a
        WHERE a.user_id = users.user_id
    )
WHERE user_id IN (1, 2, 3, 4, 5);

-- Display summary
SELECT 
    'Demo data inserted successfully!' as message,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM activities) as total_activities,
    (SELECT COUNT(*) FROM user_challenges) as total_challenge_joins,
    (SELECT COUNT(*) FROM comments) as total_comments,
    (SELECT COUNT(*) FROM upvotes) as total_upvotes;
