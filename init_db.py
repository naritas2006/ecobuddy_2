import sqlite3
import os

def init_database():
    """Initialize the SQLite database with schema and sample data"""
    
    # Read the schema file
    with open('schema_sqlite.sql', 'r') as f:
        schema_sql = f.read()
    
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
        
        -- Insert sample activities
        INSERT OR IGNORE INTO activities (user_id, category_id, description, points, carbon_offset, date_time) VALUES
        (1, 1, 'Recycled 10 plastic bottles and 5 aluminum cans', 15, 1.5, datetime('now', '-1 day')),
        (1, 2, 'Cycled to work instead of driving - 5 miles round trip', 25, 2.0, datetime('now', '-2 days')),
        (1, 4, 'Planted 3 trees in the community garden', 45, 6.0, datetime('now', '-3 days')),
        (2, 3, 'Turned off all lights and electronics for 2 hours', 10, 0.8, datetime('now', '-1 day')),
        (2, 5, 'Used rainwater to water plants instead of tap water', 8, 0.5, datetime('now', '-2 days')),
        (3, 1, 'Office recycling program - collected 50kg of paper', 30, 3.0, datetime('now', '-1 day')),
        (3, 2, 'Organized carpool for 5 employees', 20, 4.0, datetime('now', '-3 days')),
        (4, 4, 'Started community garden with 10 participants', 60, 8.0, datetime('now', '-5 days')),
        (4, 6, 'Reduced office waste by 40% through better practices', 35, 2.5, datetime('now', '-2 days')),
        (5, 7, 'Implemented sustainable living practices at home', 25, 1.8, datetime('now', '-1 day'));
        
        -- Join users to challenges
        INSERT OR IGNORE INTO user_challenges (user_id, challenge_id, status, points_earned) VALUES
        (1, 1, 'Active', 15),
        (1, 2, 'Active', 25),
        (2, 1, 'Active', 10),
        (2, 3, 'Active', 8),
        (3, 1, 'Active', 30),
        (3, 2, 'Active', 20),
        (4, 4, 'Active', 60),
        (4, 1, 'Active', 35),
        (5, 3, 'Active', 25);
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
