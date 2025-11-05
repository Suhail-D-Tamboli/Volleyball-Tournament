const mongoose = require('mongoose');
const Team = require('./models/Team');
const Match = require('./models/Match');
const Admin = require('./models/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/volleyballTournament', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing data
    await Team.deleteMany({});
    await Match.deleteMany({});
    await Admin.deleteMany({});
    
    // Create default admin
    await Admin.create({ code: 'SECRET123' });
    console.log('Default admin created');
    
    // Create sample teams
    const teams = [
      {
        name: 'Lightning Spikers',
        logoURL: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=LS',
        players: [
          { name: 'John Smith', number: 1, role: 'Setter' },
          { name: 'Mike Johnson', number: 2, role: 'Outside Hitter' },
          { name: 'David Wilson', number: 3, role: 'Middle Blocker' }
        ]
      },
      {
        name: 'Thunder Blocks',
        logoURL: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=TB',
        players: [
          { name: 'Sarah Davis', number: 1, role: 'Setter' },
          { name: 'Emma Garcia', number: 2, role: 'Outside Hitter' },
          { name: 'Lisa Brown', number: 3, role: 'Libero' }
        ]
      },
      {
        name: 'Storm Serve',
        logoURL: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=SS',
        players: [
          { name: 'James Miller', number: 1, role: 'Setter' },
          { name: 'Robert Taylor', number: 2, role: 'Opposite Hitter' },
          { name: 'Thomas Anderson', number: 3, role: 'Middle Blocker' }
        ]
      }
    ];
    
    const createdTeams = [];
    for (const teamData of teams) {
      const team = new Team(teamData);
      const savedTeam = await team.save();
      createdTeams.push(savedTeam);
      console.log(`Created team: ${savedTeam.name}`);
    }
    
    // Create sample matches
    const matches = [
      {
        teamA: createdTeams[0]._id,
        teamB: createdTeams[1]._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '19:00',
        venue: 'Main Court'
      },
      {
        teamA: createdTeams[1]._id,
        teamB: createdTeams[2]._id,
        date: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        time: '20:30',
        venue: 'Side Court'
      },
      {
        teamA: createdTeams[0]._id,
        teamB: createdTeams[2]._id,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        time: '18:00',
        venue: 'Main Court',
        status: 'completed',
        teamAScore: 25,
        teamBScore: 20,
        winner: createdTeams[0]._id
      }
    ];
    
    for (const matchData of matches) {
      const match = new Match(matchData);
      const savedMatch = await match.save();
      console.log(`Created match: ${savedMatch.teamA} vs ${savedMatch.teamB}`);
    }
    
    // Update team stats for the completed match
    const completedMatch = matches[2];
    const winningTeam = createdTeams[0];
    const losingTeam = createdTeams[2];
    
    winningTeam.matchesPlayed += 1;
    winningTeam.wins += 1;
    winningTeam.points += 2;
    await winningTeam.save();
    
    losingTeam.matchesPlayed += 1;
    losingTeam.losses += 1;
    await losingTeam.save();
    
    console.log('Sample data initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
});