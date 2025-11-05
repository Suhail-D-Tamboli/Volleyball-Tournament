const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().sort({ points: -1, wins: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new team
router.post('/', async (req, res) => {
  try {
    const team = new Team({
      name: req.body.name,
      logoURL: req.body.logoURL,
      players: []
    });

    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a player to a team
router.post('/:id/players', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.players.push({
      name: req.body.name,
      number: req.body.number,
      role: req.body.role
    });

    const updatedTeam = await team.save();
    res.json(updatedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a team
router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        logoURL: req.body.logoURL
      },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;