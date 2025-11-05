# Volleyball Tournament Tracker

A full-stack web application for managing volleyball tournaments with team standings, match scheduling, and result tracking.

## Tech Stack
- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Features

### Home Page
- Dynamic Points Table that automatically updates based on match results
- Upcoming Matches section
- Match Results section
- Team Standings with logos

### Admin Panel
- Protected with admin code authentication
- Add/Remove Teams with logo upload
- Add Players to Teams
- Schedule Matches
- Update Match Results
- Automatic Points Table updates
- Reset Tournament Data

## Database Schema

### Teams
```javascript
{
  name: String,
  logoURL: String,
  players: [{
    name: String,
    number: Number,
    role: String
  }],
  points: Number,
  matchesPlayed: Number,
  wins: Number,
  losses: Number,
  draws: Number
}
```

### Matches
```javascript
{
  teamA: ObjectId (ref: Team),
  teamB: ObjectId (ref: Team),
  date: Date,
  time: String,
  venue: String,
  winner: ObjectId (ref: Team),
  teamAScore: Number,
  teamBScore: Number,
  status: String (upcoming/completed/ongoing)
}
```

### Admin
```javascript
{
  code: String (default: "SECRET123")
}
```

## Setup Instructions

1. **Database Setup**:
   - Option 1 (Local MongoDB): Install MongoDB locally and make sure it's running on the default port (27017)
   - Option 2 (MongoDB Atlas): Create a MongoDB Atlas account and cluster, then update the connection string in `backend/.env`
   - For MongoDB Atlas, replace the username, password, and cluster details in the connection string

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend will run on http://localhost:5000

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will run on http://localhost:3000

## API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Add a new team
- `POST /api/teams/:id/players` - Add a player to a team
- `PUT /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Schedule a new match
- `PUT /api/matches/:id` - Update a match
- `PUT /api/matches/:id/result` - Update match result
- `DELETE /api/matches/:id` - Delete a match

### Admin
- `POST /api/admin/login` - Admin login
- `DELETE /api/admin/reset` - Reset tournament data

## Default Admin Code
The default admin code is: `SECRET123`

## Points System
- Win: 2 points
- Draw: 1 point
- Loss: 0 points

## Team Ranking
Teams are ranked by:
1. Points (descending)
2. Wins (descending)
3. Alphabetical order

## Development Scripts

### Windows Users
- `start-dev.bat` - Starts the development environment (MongoDB, backend, and frontend)
- `build-prod.bat` - Builds the frontend for production

### Manual Setup
1. Make sure MongoDB is running
2. In one terminal, navigate to the `backend` directory and run `npm start`
3. In another terminal, navigate to the `frontend` directory and run `npm run dev`

## Initializing Sample Data
To initialize the database with sample teams and matches:
```bash
cd backend
npm run init-data
```

## Development Notes
- The application uses a simple admin code authentication system (not suitable for production)
- All data is stored in MongoDB
- The frontend uses React with TailwindCSS for styling
- The backend uses Express.js with Mongoose for MongoDB interactions
- For production deployment, consider using environment variables for sensitive data