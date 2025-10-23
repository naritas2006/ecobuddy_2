from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import jwt
from datetime import datetime, timedelta
import io
import base64
from database import db
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI(title="EcoBuddy API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    user_type: str = "Individual"

class UserLogin(BaseModel):
    email: str
    password: str

class ActivityCreate(BaseModel):
    category_id: int
    description: str
    points: int
    carbon_offset: float

class ChallengeJoin(BaseModel):
    challenge_id: int

class CommentCreate(BaseModel):
    activity_id: int
    text: str

# Authentication functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return int(user_id)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth endpoints
@app.post("/register")
async def register(user: UserCreate):
    try:
        # Check if user already exists
        check_query = "SELECT user_id FROM users WHERE email = %s"
        existing_user = db.execute_query(check_query, (user.email,))
        
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password (simplified for demo)
        password_hash = f"hashed_{user.password}"
        
        # Insert new user
        insert_query = """
            INSERT INTO users (name, email, password_hash, user_type)
            VALUES (%s, %s, %s, %s)
            RETURNING user_id, name, email, user_type
        """
        new_user = db.execute_insert(insert_query, (user.name, user.email, password_hash, user.user_type))
        
        # Create access token
        access_token = create_access_token(data={"sub": str(new_user["user_id"])})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": dict(new_user)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
async def login(user: UserLogin):
    try:
        # Find user
        query = "SELECT user_id, name, email, user_type, password_hash FROM users WHERE email = %s"
        result = db.execute_query(query, (user.email,))
        
        if not result:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user_data = result[0]
        
        # Verify password (simplified for demo)
        if user_data["password_hash"] != f"hashed_{user.password}":
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user_data["user_id"])})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user_data["user_id"],
                "name": user_data["name"],
                "email": user_data["email"],
                "user_type": user_data["user_type"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Activity endpoints
@app.get("/activity-options")
async def get_activity_options():
    try:
        query = "SELECT * FROM categories ORDER BY name"
        categories = db.execute_query(query)
        return {"categories": [dict(cat) for cat in categories]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-activity")
async def upload_activity(
    category_id: int = Form(...),
    description: str = Form(...),
    points: int = Form(...),
    carbon_offset: float = Form(...),
    file: Optional[UploadFile] = File(None),
    user_id: int = Depends(verify_token)
):
    try:
        image_data = None
        image_filename = None
        image_content_type = None
        
        if file:
            image_data = await file.read()
            image_filename = file.filename
            image_content_type = file.content_type
        
        query = """
            INSERT INTO activities (user_id, category_id, description, points, carbon_offset, image_data, image_filename, image_content_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING activity_id, date_time
        """
        result = db.execute_insert(query, (
            user_id, category_id, description, points, carbon_offset,
            image_data, image_filename, image_content_type
        ))
        
        return {"message": "Activity uploaded successfully", "activity_id": result["activity_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user-activities/{user_id}")
async def get_user_activities(user_id: int, current_user_id: int = Depends(verify_token)):
    try:
        # Verify user can access this data
        if user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        query = """
            SELECT a.*, c.name as category_name, u.name as user_name
            FROM activities a
            JOIN categories c ON a.category_id = c.category_id
            JOIN users u ON a.user_id = u.user_id
            WHERE a.user_id = %s
            ORDER BY a.date_time DESC
        """
        activities = db.execute_query(query, (user_id,))
        
        # Convert image data to base64 for JSON response
        result = []
        for activity in activities:
            activity_dict = dict(activity)
            if activity_dict["image_data"]:
                activity_dict["image_data"] = base64.b64encode(activity_dict["image_data"]).decode('utf-8')
            result.append(activity_dict)
        
        return {"activities": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Challenge endpoints
@app.get("/challenges")
async def get_challenges():
    try:
        query = """
            SELECT c.*, 
                   COUNT(uc.user_id) as participant_count
            FROM challenges c
            LEFT JOIN user_challenges uc ON c.challenge_id = uc.challenge_id
            GROUP BY c.challenge_id
            ORDER BY c.start_date DESC
        """
        challenges = db.execute_query(query)
        return {"challenges": [dict(challenge) for challenge in challenges]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/join-challenge")
async def join_challenge(challenge: ChallengeJoin, user_id: int = Depends(verify_token)):
    try:
        # Check if user already joined
        check_query = "SELECT * FROM user_challenges WHERE user_id = %s AND challenge_id = %s"
        existing = db.execute_query(check_query, (user_id, challenge.challenge_id))
        
        if existing:
            raise HTTPException(status_code=400, detail="Already joined this challenge")
        
        # Join challenge
        insert_query = """
            INSERT INTO user_challenges (user_id, challenge_id, status, points_earned)
            VALUES (%s, %s, 'Active', 0)
            RETURNING user_id, challenge_id, date_joined
        """
        result = db.execute_insert(insert_query, (user_id, challenge.challenge_id))
        
        return {"message": "Successfully joined challenge", "data": dict(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user-challenges/{user_id}")
async def get_user_challenges(user_id: int, current_user_id: int = Depends(verify_token)):
    try:
        if user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        query = """
            SELECT c.*, uc.status, uc.points_earned, uc.date_joined
            FROM challenges c
            JOIN user_challenges uc ON c.challenge_id = uc.challenge_id
            WHERE uc.user_id = %s
            ORDER BY uc.date_joined DESC
        """
        challenges = db.execute_query(query, (user_id,))
        return {"challenges": [dict(challenge) for challenge in challenges]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/challenge-leaderboard/{challenge_id}")
async def get_challenge_leaderboard(challenge_id: int):
    try:
        query = """
            SELECT u.name, u.email, uc.points_earned, uc.date_joined,
                   COUNT(a.activity_id) as activities_count,
                   COALESCE(SUM(a.points), 0) as total_activity_points
            FROM users u
            JOIN user_challenges uc ON u.user_id = uc.user_id
            LEFT JOIN activities a ON u.user_id = a.user_id 
                AND a.date_time >= uc.date_joined
                AND a.date_time <= uc.date_joined + INTERVAL '30 days'
            WHERE uc.challenge_id = %s
            GROUP BY u.user_id, u.name, u.email, uc.points_earned, uc.date_joined
            ORDER BY uc.points_earned DESC, total_activity_points DESC
        """
        leaderboard = db.execute_query(query, (challenge_id,))
        return {"leaderboard": [dict(entry) for entry in leaderboard]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Leaderboard endpoint
@app.get("/leaderboard")
async def get_global_leaderboard():
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
        leaderboard = db.execute_query(query)
        return {"leaderboard": [dict(entry) for entry in leaderboard]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# User stats endpoint
@app.get("/user-stats/{user_id}")
async def get_user_stats(user_id: int, current_user_id: int = Depends(verify_token)):
    try:
        if user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
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
            WHERE u.user_id = %s
            GROUP BY u.user_id
        """
        stats = db.execute_query(query, (user_id,))
        
        if not stats:
            return {
                "total_activities": 0,
                "total_points": 0,
                "total_carbon_offset": 0,
                "challenges_joined": 0,
                "challenge_points": 0
            }
        
        return dict(stats[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
