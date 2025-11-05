const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  teamAScore: {
    type: Number,
    default: 0
  },
  teamBScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'ongoing'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);