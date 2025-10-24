import sqlite3
import os

def init_database():
    """Initialize the SQLite database with schema and sample data"""
    
    # Read the schema file
    with open('schema.sql', 'r') as f:
        schema_sql = f.read()

    # Add DROP TABLE statements to clear existing tables
    drop_tables_sql = """
    DROP TABLE IF EXISTS upvotes;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS team_members;
    DROP TABLE IF EXISTS teams;
    DROP TABLE IF EXISTS user_challenges;
    DROP TABLE IF EXISTS challenges;
    DROP TABLE IF EXISTS activities;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS users;
    """
    schema_sql = drop_tables_sql + schema_sql
    
    # Connect to database
    conn = sqlite3.connect('ecobuddy.db')
    cursor = conn.cursor()
    
    try:
        # Execute schema
        cursor.executescript(schema_sql)
        conn.commit()
        print("Database schema created successfully!")
        
        # Insert demo data
        demo_data = """
        -- Insert demo users
        INSERT OR IGNORE INTO users (name, email, password_hash, user_type) VALUES
        ('Demo User', 'demo@ecobuddy.com', 'hashed_demo123', 'Individual'),
        ('Eco Warrior', 'warrior@ecobuddy.com', 'hashed_demo123', 'Individual'),
        ('Green Team', 'team@ecobuddy.com', 'hashed_demo123', 'Organization'),
        ('Climate Champion', 'champion@ecobuddy.com', 'hashed_demo123', 'Individual'),
        ('Sustainable Living', 'sustainable@ecobuddy.com', 'hashed_demo123', 'Organization');
        
        -- Insert sample categories with new fields
        INSERT OR IGNORE INTO categories (name, description, points_per_unit, carbon_per_unit) VALUES
        ('Tree Planting', 'Planting or maintaining a tree', 1.0, 22.0),
        ('Recycling Paper', 'Recycling paper instead of using virgin paper', 1.0, 1.0),
        ('Car → Train/Bus', 'Using public transport instead of car', 1.0, 0.18),
        ('Cycling', 'Cycling instead of driving', 1.0, 0.3),
        ('Walking', 'Walking instead of driving', 1.0, 0.3),
        ('LED Bulb Replacement', 'Replacing incandescent bulb with LED', 1.0, 20.0),
        ('Avoid Single-Use Plastic', 'Avoiding single-use plastic items', 1.0, 0.04),
        ('Compost Food Waste', 'Composting food waste instead of sending to landfill', 1.0, 0.25),
        ('Skip Beef Meal', 'Avoiding one beef-based meal (~120 g)', 3.0, 3.0),
        ('Solar Electricity', 'Generating solar electricity instead of using grid power', 1.0, 0.5);
        
        -- Insert sample activities with quantity
        INSERT OR IGNORE INTO activities (user_id, category_id, description, quantity, points, carbon_offset) 
        VALUES 
        (1, 1, 'Planted a maple tree in backyard', 2, 2.0, 44.0), 
        (2, 2, 'Recycled office paper', 5, 5.0, 5.0), 
        (1, 4, 'Cycled to work', 10, 10.0, 3.0);
        
        -- Insert sample challenges
        INSERT OR IGNORE INTO challenges (name, description, start_date, end_date, reward_points)
        VALUES
        ('30-Day Recycling Challenge', 'Recycle daily for 30 days', '2025-11-01', '2025-11-30', 50),
        ('Green Commute Week', 'Use eco-friendly transport for a week', '2025-11-01', '2025-11-07', 20);
        
        -- Join users to challenges
        INSERT OR IGNORE INTO user_challenges (user_id, challenge_id, status, points_earned)
        VALUES
        (1, 1, 'Active', 0),
        (2, 1, 'Completed', 50),
        (1, 2, 'Active', 0);
        
        -- Insert sample teams
        INSERT OR IGNORE INTO teams (team_name, description)
        VALUES
        ('Eco Warriors', 'Team focused on sustainability'),
        ('Green Riders', 'Cycling enthusiasts promoting clean transport');

        -- Insert sample team members
        INSERT OR IGNORE INTO team_members (user_id, team_id)
        VALUES
        (1, 1),
        (2, 1),
        (1, 2);

        -- Insert sample upvotes
        INSERT OR IGNORE INTO upvotes (user_id, activity_id)
        VALUES
        (2, 1),
        (1, 2);

        -- Insert sample comments
        INSERT OR IGNORE INTO comments (user_id, activity_id, text)
        VALUES
        (2, 1, 'Great job planting trees!'),
        (1, 2, 'Recycling is important, keep it up!');
        """
        
        cursor.executescript(demo_data)
        conn.commit()
        print("Demo data inserted successfully!")
        
        # Verify data
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM activities")
        activity_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM categories")
        category_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM challenges")
        challenge_count = cursor.fetchone()[0]
        
        print("Database Summary:")
        print(f"   Users: {user_count}")
        print(f"   Activities: {activity_count}")
        print(f"   Categories: {category_count}")
        print(f"   Challenges: {challenge_count}")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    init_database()
