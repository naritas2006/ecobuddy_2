@echo off
REM EcoBuddy Setup Script for Windows
REM This script sets up the EcoBuddy application

echo 🌱 Setting up EcoBuddy...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed.
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is required but not installed.
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup backend
echo 🔧 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install Python dependencies
pip install -r requirements.txt

REM Setup database
echo 🗄️ Setting up database...
createdb ecobuddy 2>nul || echo Database 'ecobuddy' already exists
psql -d ecobuddy -f schema.sql

echo ✅ Backend setup complete

REM Setup frontend
echo 🔧 Setting up frontend...
cd ..\frontend

REM Install Node.js dependencies
npm install

echo ✅ Frontend setup complete

REM Create environment file
echo 📝 Creating environment file...
cd ..
copy env.example .env

echo 🎉 Setup complete!
echo.
echo To start the application:
echo 1. Backend: cd backend ^&^& venv\Scripts\activate.bat ^&^& python main.py
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo Don't forget to update the .env file with your database credentials!
pause
