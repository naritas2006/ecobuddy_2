@echo off
REM EcoBuddy Startup Script for Windows
REM This script starts both the backend and frontend servers

echo 🌱 Starting EcoBuddy...

REM Start backend
echo 🔧 Starting backend server...
cd backend
start "EcoBuddy Backend" cmd /k "venv\Scripts\activate.bat && python main.py"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🔧 Starting frontend server...
cd frontend
start "EcoBuddy Frontend" cmd /k "npm start"
cd ..

echo ✅ Both servers are starting...
echo 🌐 Backend: http://localhost:8000
echo 🌐 Frontend: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
pause
