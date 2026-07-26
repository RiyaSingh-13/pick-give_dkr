// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Member', 'NGO', 'Admin'],
    required: true
  },
  fullName: {
    type: String,
    required: function() { return this.role === 'Member'; }
  },
  ngoName: {
    type: String,
    required: function() { return this.role === 'NGO'; }
  },
  email: {
    type: String,
    required: function() { return this.role === 'Member' || this.role === 'Admin'; },
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  officialEmail: {
    type: String,
    required: function() { return this.role === 'NGO'; },
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: function() { return this.role === 'Member'; }
  },
  address: {
    type: String,
    required: function() { return this.role === 'NGO'; }
  },
  joinedDate: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: ''
  },
  
  // NGO-specific Verification fields
  description: {
    type: String,
    required: function() { return this.role === 'NGO'; }
  },
  registrationNumber: {
    type: String,
    required: function() { return this.role === 'NGO'; }
  },
  password: {
    type: String,
    required: true
  },
  certificate: {
    type: String, // Filename or URL
    default: 'uploaded_cert.pdf'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: function() {
      return this.role === 'NGO' ? 'Pending' : 'Approved';
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
