const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('teamA', 'name logoURL')
      .populate('teamB', 'name logoURL')
      .populate('winner', 'name')
      .sort({ date: 1, time: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Schedule a new match
router.post('/', async (req, res) => {
  try {
    const match = new Match({
      teamA: req.body.teamA,
      teamB: req.body.teamB,
      date: req.body.date,
      time: req.body.time,
      venue: req.body.venue
    });

    const newMatch = await match.save();
    
    // Populate the match with team information before sending response
    const populatedMatch = await Match.findById(newMatch._id)
      .populate('teamA', 'name logoURL')
      .populate('teamB', 'name logoURL');
      
    res.status(201).json(populatedMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update match result
router.put('/:id/result', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Update match result
    match.winner = req.body.winner;
    match.teamAScore = req.body.teamAScore;
    match.teamBScore = req.body.teamBScore;
    match.status = 'completed';
    
    const updatedMatch = await match.save();

    // Update team statistics
    await updateTeamStats(match.teamA, match.teamB, match.winner);

    // Populate the match with team information before sending response
    const populatedMatch = await Match.findById(updatedMatch._id)
      .populate('teamA', 'name logoURL')
      .populate('teamB', 'name logoURL')
      .populate('winner', 'name');

    res.json(populatedMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Helper function to update team statistics
async function updateTeamStats(teamAId, teamBId, winnerId) {
  try {
    // If it's a draw
    if (!winnerId) {
      const teamA = await Team.findById(teamAId);
      const teamB = await Team.findById(teamBId);
      
      teamA.matchesPlayed += 1;
      teamA.draws += 1;
      teamA.points += 1;
      
      teamB.matchesPlayed += 1;
      teamB.draws += 1;
      teamB.points += 1;
      
      await teamA.save();
      await teamB.save();
    } else {
      // If there's a winner
      const winner = await Team.findById(winnerId);
      winner.matchesPlayed += 1;
      winner.wins += 1;
      winner.points += 2;
      await winner.save();
      
      // Update loser stats
      const loserId = winnerId.toString() === teamAId.toString() ? teamBId : teamAId;
      const loser = await Team.findById(loserId);
      loser.matchesPlayed += 1;
      loser.losses += 1;
      await loser.save();
    }
  } catch (err) {
    console.error('Error updating team stats:', err);
  }
}

// Update a match
router.put('/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      {
        teamA: req.body.teamA,
        teamB: req.body.teamB,
        date: req.body.date,
        time: req.body.time,
        venue: req.body.venue
      },
      { new: true }
    ).populate('teamA', 'name logoURL')
     .populate('teamB', 'name logoURL')
     .populate('winner', 'name');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a match
router.delete('/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ message: 'Match deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;