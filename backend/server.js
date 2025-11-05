const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/volleyballTournament', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  
  // Initialize default admin
  const Admin = require('./models/Admin');
  Admin.createDefaultAdmin();
});

// Routes
app.use('/api/teams', require('./routes/teams'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/admin', require('./routes/admin'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Volleyball Tournament Tracker API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});