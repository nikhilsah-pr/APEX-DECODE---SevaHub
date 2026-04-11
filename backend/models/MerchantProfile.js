const mongoose = require('mongoose');

const merchantProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  phoneVerified: { type: Boolean, default: false },
  address: String,
  locationVerified: { type: Boolean, default: false },
  serviceCategory: String,
  experienceYears: Number,
  pricingRange: String,
  idProofUrl: String, // optional
  businessProofUrl: String, // optional
  profilePhotoUrl: String, // optional
  trustScore: { type: Number, default: 0 },
  verificationStatus: { type: String, default: 'Not Verified' },
  activityCount: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('MerchantProfile', merchantProfileSchema);
