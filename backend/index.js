const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Root
app.get('/', (req, res) => {
  res.send('Backend working ✅');
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error:", err));


// ================= MODEL ================= //

const User = require('./models/User');
const MerchantProfile = require('./models/MerchantProfile');


// ================= REGISTER ================= //

app.post('/api/register', async (req, res) => {
  console.log("REGISTER HIT:", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({
      message: "User saved in MongoDB ✅",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= LOGIN ================= //

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= SERVER ================= //

// Trust Score Calculator
const calculateTrustScore = (profile) => {
  let score = 0;
  // 1. Phone Verified -> +20
  if (profile.phoneVerified) score += 20;
  
  // 2. Location Verified -> +20
  if (profile.locationVerified) score += 20;

  // 3. Profile Completion -> +20
  let completionItems = 0;
  if (profile.name) completionItems++;
  if (profile.serviceCategory) completionItems++;
  if (profile.experienceYears) completionItems++;
  if (profile.idProofUrl || profile.businessProofUrl || profile.profilePhotoUrl) completionItems += 2;
  
  if (completionItems >= 4) score += 20;
  else if (completionItems >= 2) score += 10;

  // 4. Reviews / Ratings -> +20
  if (profile.avgRating >= 4) score += 20;
  else if (profile.avgRating > 0) score += 10;

  // 5. Activity -> +20
  if (profile.activityCount >= 5) score += 20;
  else if (profile.activityCount >= 1) score += 10;

  score = Math.min(score, 100);

  let status = 'Not Verified';
  if (score >= 80) status = 'Verified';
  else if (score >= 50) status = 'Semi-Trusted';

  return { trustScore: score, verificationStatus: status };
};

// ================= MERCHANT PROFILE ================= //

app.get('/api/merchant-profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    let profile = await MerchantProfile.findOne({ email });
    if (!profile) {
      // Return empty profile with default scores
      return res.json({ profile: null });
    }
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/merchant-profile', async (req, res) => {
  try {
    const { email, updates } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    let profile = await MerchantProfile.findOne({ email });
    
    if (!profile) {
      profile = new MerchantProfile({ email, ...updates });
    } else {
      Object.assign(profile, updates);
    }

    // Recalculate trust score
    const { trustScore, verificationStatus } = calculateTrustScore(profile);
    profile.trustScore = trustScore;
    profile.verificationStatus = verificationStatus;

    await profile.save();
    
    res.json({ message: "Profile updated", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= SERVER ================= //

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});