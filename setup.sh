#!/bin/bash

# EcoBuddy Setup Script
# This script sets up the EcoBuddy application

echo "🌱 Setting up EcoBuddy..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is required but not installed."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Setup database
echo "🗄️ Setting up database..."
createdb ecobuddy 2>/dev/null || echo "Database 'ecobuddy' already exists"
psql -d ecobuddy -f schema.sql

echo "✅ Backend setup complete"

# Setup frontend
echo "🔧 Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
npm install

echo "✅ Frontend setup complete"

# Create environment file
echo "📝 Creating environment file..."
cd ..
cp env.example .env

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && source venv/bin/activate && python main.py"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Don't forget to update the .env file with your database credentials!"
