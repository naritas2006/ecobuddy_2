import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration - using SQLite for easier setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecobuddy.db")

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
