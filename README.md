# EcoBuddy - Carbon Tracking Web App

EcoBuddy is a comprehensive carbon tracking web application where users can log eco-friendly activities, earn points, track carbon offset, join challenges, and compete with other users.

## Features

- **Activity Logging**: Record eco-friendly activities with photos and detailed descriptions
- **Points System**: Earn points for sustainable actions and track your progress
- **Carbon Tracking**: Monitor your carbon offset impact
- **Challenges**: Join community challenges and compete with other users
- **Leaderboards**: See how you rank globally and in specific challenges
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Robust relational database
- **psycopg2**: PostgreSQL adapter for Python
- **JWT**: JSON Web Tokens for authentication
- **Raw SQL**: Direct database queries without ORM

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Axios**: HTTP client for API requests
- **React Router**: Client-side routing

## Project Structure

```
ecobuddy/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database connection and queries
│   ├── config.py            # Configuration settings
│   ├── requirements.txt     # Python dependencies
│   └── schema.sql           # Database schema
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React context providers
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── postcss.config.js   # PostCSS configuration
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL database**:
   ```bash
   # Create database
   createdb ecobuddy
   
   # Run schema
   psql -d ecobuddy -f schema.sql
   ```

3. **Configure environment variables**:
   ```bash
   # Copy example environment file
   cp env.example .env
   
   # Edit .env with your database credentials
   DATABASE_URL=postgresql://username:password@localhost/ecobuddy
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ```

4. **Run the backend server**:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login user

### Activities
- `GET /activity-options` - Get all activity categories
- `POST /upload-activity` - Log a new activity
- `GET /user-activities/{user_id}` - Get user's activities

### Challenges
- `GET /challenges` - Get all available challenges
- `POST /join-challenge` - Join a challenge
- `GET /user-challenges/{user_id}` - Get user's challenges
- `GET /challenge-leaderboard/{challenge_id}` - Get challenge leaderboard

### Leaderboards
- `GET /leaderboard` - Get global leaderboard
- `GET /user-stats/{user_id}` - Get user statistics

## Database Schema

The application uses the following main entities:
- **Users**: User accounts and profiles
- **Activities**: Eco-friendly activities logged by users
- **Categories**: Activity types and their carbon impact
- **Challenges**: Community challenges and competitions
- **UserChallenges**: Many-to-many relationship between users and challenges
- **Comments**: User comments on activities
- **Upvotes**: User upvotes on activities

## Demo Credentials

For testing purposes, you can use:
- **Email**: demo@ecobuddy.com
- **Password**: demo123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
