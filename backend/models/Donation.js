// backend/models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  donor: {
    type: String, // Matches member's fullName for simplicity
    required: true
  },
  donorEmail: {
    type: String,
    required: true
  },
  ngo: {
    type: String, // Matches NGO name
    required: true
  },
  location: {
    type: String, // Matches member's pickup address
    required: true
  },
  status: {
    type: String,
    enum: ['Offer Posted', 'Accepted', 'In Transit', 'Delivered'],
    default: 'Offer Posted'
  },
  courier: {
    type: String,
    default: 'None (Awaiting Courier)'
  },
  courierEmail: {
    type: String,
    default: ''
  },
  deliveryMode: {
    type: String,
    enum: ['Volunteer', 'Self'],
    default: 'Volunteer'
  },
  otp: {
    type: String,
    default: () => Math.floor(1000 + Math.random() * 9000).toString()
  },
  deliveryOtp: {
    type: String,
    default: () => Math.floor(1000 + Math.random() * 9000).toString()
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  description: {
    type: String,
    default: ''
  },
  instructions: {
    type: String,
    default: ''
  },
  photo: {
    type: String, // Filename or URL
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', DonationSchema);
