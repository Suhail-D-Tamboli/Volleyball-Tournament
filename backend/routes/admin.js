const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body;
    
    // Check if admin exists with the provided code
    const admin = await Admin.findOne({ code });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin code' });
    }
    
    // In a real application, you would create a session or JWT token here
    // For this simple implementation, we'll just return a success message
    res.json({ message: 'Admin login successful', authenticated: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset tournament data (delete all teams and matches)
router.delete('/reset', async (req, res) => {
  try {
    // In a real application, you would verify admin authentication here
    
    // Delete all teams and matches
    const Team = require('../models/Team');
    const Match = require('../models/Match');
    
    await Team.deleteMany({});
    await Match.deleteMany({});
    
    res.json({ message: 'Tournament data reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;