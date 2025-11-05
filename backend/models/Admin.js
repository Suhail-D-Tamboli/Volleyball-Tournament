const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    default: 'SECRET123'
  }
});

// Create default admin if it doesn't exist
adminSchema.statics.createDefaultAdmin = async function() {
  const adminCount = await this.countDocuments();
  if (adminCount === 0) {
    await this.create({ code: 'SECRET123' });
    console.log('Default admin created with code: SECRET123');
  }
};

module.exports = mongoose.model('Admin', adminSchema);