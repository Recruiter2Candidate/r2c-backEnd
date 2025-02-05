const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType', required: true }, 
  userType: { 
    type: String, 
    enum: ['CandidateUser', 'RecruiterUser'], 
    required: true 
  }, 
  otp: { type: String, required: true },
  type: { type: String, required: true }, // Example: 'email_verification', 'password_reset'
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true }, // OTP expiry
});

// Set the expiration index
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
