@echo off
echo Starting EcoBuddy Application...
echo.

echo Starting Backend Server (Flask)...
start "EcoBuddy Backend" cmd /k "cd /d C:\Users\Rekha Sharma\OneDrive\Documents\ecobuddy && venv\Scripts\activate.bat && python flask_app.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server (React)...
start "EcoBuddy Frontend" cmd /k "cd /d C:\Users\Rekha Sharma\OneDrive\Documents\ecobuddy && npm start"

echo.
echo EcoBuddy is starting up!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
