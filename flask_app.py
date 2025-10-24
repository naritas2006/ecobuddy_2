from flask import Flask, request, jsonify, g
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta, timezone
import base64
from database import get_db_connection, Database
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
import functools

app = Flask(__name__)
CORS(app)

# Database connection management
@app.before_request
def before_request():
    g.db_conn = get_db_connection()
    g.db = Database(g.db_conn)

@app.teardown_request
def teardown_request(exception):
    if hasattr(g, 'db_conn'):
        g.db_conn.close()

# Authentication decorator
def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            current_user_id = data['sub']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

def create_access_token(data):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Auth endpoints
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user already exists
        check_query = "SELECT user_id FROM users WHERE email = ?"
        existing_user = g.db.execute_query(check_query, (data['email'],))
        
        if existing_user:
            return jsonify({'detail': 'Email already registered'}), 400
        
        # Hash password (simplified for demo)
        password_hash = f"hashed_{data['password']}"
        
        # Insert new user
        insert_query = """
            INSERT INTO users (name, email, password_hash, user_type)
            VALUES (?, ?, ?, ?)
        """
        g.db.execute_query(insert_query, (data['name'], data['email'], password_hash, data.get('user_type', 'Individual')))
        
        # Get the new user
        user_query = "SELECT user_id, name, email, user_type FROM users WHERE email = ?"
        new_user = g.db.execute_query(user_query, (data['email'],))[0]
        
        # Create access token
        access_token = create_access_token(data={"sub": str(new_user['user_id'])})
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user": dict(new_user)
        })
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Find user
        query = "SELECT user_id, name, email, user_type, password_hash FROM users WHERE email = ?"
        result = g.db.execute_query(query, (data['email'],))
        
        if not result:
            return jsonify({'detail': 'Invalid credentials'}), 401
        
        user_data = result[0]
        
        # Verify password (simplified for demo)
        if user_data['password_hash'] != f"hashed_{data['password']}":
            return jsonify({'detail': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user_data['user_id'])})
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user_data['user_id'],
                "name": user_data['name'],
                "email": user_data['email'],
                "user_type": user_data['user_type']
            }
        })
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

# Activity endpoints
@app.route('/activity-options', methods=['GET'])
def get_activity_options():
    try:
        query = "SELECT * FROM categories ORDER BY name"
        categories = g.db.execute_query(query)
        return jsonify({"categories": [dict(cat) for cat in categories]})
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@app.route('/upload-activity', methods=['POST'])
@token_required
def upload_activity(current_user_id):
    try:
        # Get form data
        category_id = request.form.get('category_id')
        description = request.form.get('description')
        quantity = float(request.form.get('quantity'))
        
        if not all([category_id, description, quantity is not None]):
            return jsonify({'detail': 'Missing required fields'}), 400
        
        # Fetch points_per_unit and carbon_per_unit from categories table
        category_query = "SELECT points_per_unit, carbon_per_unit FROM categories WHERE category_id = ?"
        category_data = g.db.execute_query(category_query, (category_id,))
        
        if not category_data:
            return jsonify({'detail': 'Category not found'}), 404
            
        points_per_unit = category_data[0]['points_per_unit']
        carbon_per_unit = category_data[0]['carbon_per_unit']
        
        # Calculate points and carbon_offset
        points = quantity * points_per_unit
        carbon_offset = quantity * carbon_per_unit
        
        # Handle file upload
        image_data = None
        image_filename = None
        image_content_type = None
        
        if 'file' in request.files:
            file = request.files['file']
            if file and file.filename:
                image_data = file.read()
                image_filename = file.filename
                image_content_type = file.content_type
        
        query = """
            INSERT INTO activities (user_id, category_id, description, quantity, points, carbon_offset, image_data, image_filename, image_content_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        g.db.execute_query(query, (
            current_user_id, category_id, description, quantity, points, carbon_offset,
            image_data, image_filename, image_content_type
        ))
        
        return jsonify({"message": "Activity uploaded successfully"})
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@app.route('/user-activities/<int:user_id>', methods=['GET'])
@token_required
def get_user_activities(current_user_id, user_id):
    try:
        # Verify user can access this data
        if int(user_id) != int(current_user_id):
            return jsonify({'detail': 'Access denied'}), 403
        
        query = """
            SELECT a.*, c.name as category_name, u.name as user_name
            FROM activities a
            JOIN categories c ON a.category_id = c.category_id
            JOIN users u ON a.user_id = u.user_id
            WHERE a.user_id = ?
            ORDER BY a.date_time DESC
        """
        activities = g.db.execute_query(query, (user_id,))
        
        # Convert image data to base64 for JSON response
        result = []
        for activity in activities:
            activity_dict = dict(activity)
            if activity_dict['image_data']:
                activity_dict['image_data'] = base64.b64encode(activity_dict['image_data']).decode('utf-8')
            result.append(activity_dict)
        
        return jsonify({"activities": result})
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

# Challenge endpoints
@app.route('/challenges', methods=['GET'])
def get_challenges():
    try:
        query = """
            SELECT c.*, 
                   COUNT(uc.user_id) as participant_count
            FROM challenges c
            LEFT JOIN user_challenges uc ON c.challenge_id = uc.challenge_id
            GROUP BY c.challenge_id
            ORDER BY c.start_date DESC
        """
        challenges = g.db.execute_query(query)
        return jsonify({"challenges": [dict(challenge) for challenge in challenges]})
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@app.route('/join-challenge', methods=['POST'])
@token_required
def join_challenge(current_user_id):
    try:
        data = request.get_json()
        challenge_id = data['challenge_id']
        
        # Check if user already joined
        check_query = "SELECT * FROM user_challenges WHERE user_id = ? AND challenge_id = ?"
        existing = g.db.execute_query(check_query, (current_user_id, challenge_id))
        
        if existing:
            return jsonify({'detail': 'Already joined this challenge'}), 400
        
        # Join challenge
        insert_query = """
            INSERT INTO user_challenges (user_id, challenge_id, status, points_earned)
            VALUES (?, ?, 'Active', 0)
        """
        g.db.execute_query(insert_query, (current_user_id, challenge_id))
        
        return jsonify({"message": "Successfully joined challenge"})
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@app.route('/user-challenges/<int:user_id>', methods=['GET'])
@token_required
def get_user_challenges(current_user_id, user_id):
    try:
        if int(user_id) != int(current_user_id):
            return jsonify({'detail': 'Access denied'}), 403
        
        query = """
            SELECT c.*, uc.status, uc.points_earned, uc.date_joined
            FROM challenges c
            JOIN user_challenges uc ON c.challenge_id = uc.challenge_id
            WHERE uc.user_id = ?
            ORDER BY uc.date_joined DESC
        """
        challenges = g.db.execute_query(query, (user_id,))
        return jsonify({"challenges": [dict(challenge) for challenge in challenges]})
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@app.route('/challenge-leaderboard/<int:challenge_id>', methods=['GET'])
def get_challenge_leaderboard(challenge_id):
    try:
        query = """
            SELECT u.name, u.email, uc.points_earned, uc.date_joined,
                   COUNT(a.activity_id) as activities_count,
                   COALESCE(SUM(a.points), 0) as total_activity_points
            FROM users u
            JOIN user_challenges uc ON u.user_id = uc.user_id
            LEFT JOIN activities a ON u.user_id = a.user_id 
                AND a.date_time >= uc.date_joined
                AND a.date_time <= datetime(uc.date_joined, '+30 days')
            WHERE uc.challenge_id = ?
            GROUP BY u.user_id, u.name, u.email, uc.points_earned, uc.date_joined
            ORDER BY uc.points_earned DESC, total_activity_points DESC
        """
        leaderboard = g.db.execute_query(query, (challenge_id,))
        return jsonify({"leaderboard": [dict(entry) for entry in leaderboard]})
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

# Leaderboard endpoint
@app.route('/leaderboard', methods=['GET'])
def get_global_leaderboard():
    try:
        query = """
            SELECT u.name, u.email, u.user_type,
                   COALESCE(SUM(a.points), 0) as total_points,
                   COALESCE(SUM(a.carbon_offset), 0) as total_carbon_offset,
                   COUNT(a.activity_id) as activities_count
            FROM users u
            LEFT JOIN activities a ON u.user_id = a.user_id
            GROUP BY u.user_id, u.name, u.email, u.user_type
            ORDER BY total_points DESC
            LIMIT 50
        """
        leaderboard = g.db.execute_query(query)
        return jsonify({"leaderboard": [dict(entry) for entry in leaderboard]})
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

# User stats endpoint
@app.route('/user-stats/<int:user_id>', methods=['GET'])
@token_required
def get_user_stats(current_user_id, user_id):
    try:
        if int(user_id) != int(current_user_id):
            return jsonify({'detail': 'Access denied'}), 403
        
        query = """
            SELECT 
                COUNT(a.activity_id) as total_activities,
                COALESCE(SUM(a.points), 0) as total_points,
                COALESCE(SUM(a.carbon_offset), 0) as total_carbon_offset,
                COUNT(uc.challenge_id) as challenges_joined,
                COALESCE(SUM(uc.points_earned), 0) as challenge_points
            FROM users u
            LEFT JOIN activities a ON u.user_id = a.user_id
            LEFT JOIN user_challenges uc ON u.user_id = uc.user_id
            WHERE u.user_id = ?
            GROUP BY u.user_id
        """
        stats = g.db.execute_query(query, (user_id,))
        
        if not stats:
            return jsonify({
                "total_activities": 0,
                "total_points": 0,
                "total_carbon_offset": 0,
                "challenges_joined": 0,
                "challenge_points": 0
            })
        
        return jsonify(dict(stats[0]))
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
