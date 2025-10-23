# EcoBuddy Server Startup Script
Write-Host "Starting EcoBuddy Backend Server..." -ForegroundColor Green

# Change to project directory
Set-Location "C:\Users\Rekha Sharma\OneDrive\Documents\ecobuddy"

# Activate virtual environment
& "venv\Scripts\activate.bat"

# Start the server
Write-Host "Server starting on http://localhost:8000" -ForegroundColor Yellow
Write-Host "API Documentation available at http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red

python main.py
