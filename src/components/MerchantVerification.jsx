import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiShield, FiAlertTriangle, FiMapPin, FiPhone, FiInfo } from 'react-icons/fi';
import { getMerchantProfile, updateMerchantProfile } from '../api';
import { useToast } from './Toast';
import '../styles/Verification.css';

export default function MerchantVerification({ user }) {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    serviceCategory: '',
    experienceYears: '',
    pricingRange: '',
    idProofUrl: '',
  });

  useEffect(() => {
    if (user?.email) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    const data = await getMerchantProfile(user.email);
    if (data && data.profile) {
      setProfile(data.profile);
      setFormData({
        name: data.profile.name || '',
        phone: data.profile.phone || '',
        address: data.profile.address || '',
        serviceCategory: data.profile.serviceCategory || '',
        experienceYears: data.profile.experienceYears || '',
        pricingRange: data.profile.pricingRange || '',
        idProofUrl: data.profile.idProofUrl || '',
      });
    } else {
      setProfile({ trustScore: 0, verificationStatus: 'Not Verified' });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateMerchantProfile(user.email, formData);
      if (res && res.profile) {
        setProfile(res.profile);
        toast('Profile updated and trust score recalculated!', 'success');
        setShowForm(false);
      }
    } catch (err) {
      toast('Failed to update profile', 'error');
    }
  };

  const handleVerifyPhone = async () => {
    // Simulate OTP verification
    const otp = prompt('Enter the OTP sent to your phone (Simulated: enter 1234):');
    if (otp === '1234') {
      const res = await updateMerchantProfile(user.email, { phoneVerified: true });
      if (res && res.profile) {
        setProfile(res.profile);
        toast('Phone verified successfully!', 'success');
      }
    } else {
      toast('Invalid OTP', 'error');
    }
  };

  const handleVerifyLocation = async () => {
    // Simulate location capture
    if (navigator.geolocation) {
      toast('Capturing geolocation...', 'info');
      setTimeout(async () => {
        const res = await updateMerchantProfile(user.email, { locationVerified: true });
         if (res && res.profile) {
           setProfile(res.profile);
           toast('Location verified successfully!', 'success');
         }
      }, 1500);
    } else {
      toast('Geolocation is not supported by this browser.', 'error');
    }
  };

  if (loading) return <div>Loading Verification Data...</div>;

  const score = profile?.trustScore || 0;
  const status = profile?.verificationStatus || 'Not Verified';

  // Determine color and icon
  let color = '#dc3545'; // Red
  let icon = <FiAlertTriangle color={color} size={24} />;
  
  if (score >= 80) {
    color = '#28a745'; // Green
    icon = <FiCheckCircle color={color} size={24} />;
  } else if (score >= 50) {
    color = '#ffc107'; // Yellow
    icon = <FiShield color={color} size={24} />;
  }

  return (
    <div className="verification-widget animate-fade-in">
      <div className="verification-header">
        <div className="verification-title-area">
           {icon}
           <h2 className="verification-title">Trust Score & Verification</h2>
        </div>
        <div className="verification-status-badge" style={{ backgroundColor: `${color}20`, color: color, borderColor: color }}>
          {status}
        </div>
      </div>

      <div className="trust-score-container">
        <div className="score-details">
          <span className="score-label">Your Trust Score</span>
          <span className="score-value" style={{ color }}>{score} / 100</span>
        </div>
        <div className="score-progress-bar">
          <div className="score-progress-fill" style={{ width: `${score}%`, backgroundColor: color }}></div>
        </div>
      </div>

      <div className="verification-suggestions">
        <h3><FiInfo /> How to improve your score:</h3>
        <ul className="suggestions-list">
          <li className={profile?.phoneVerified ? 'completed' : ''}>
            <span>📱 Phone Number Verification (+20 pts)</span>
            {!profile?.phoneVerified && <button className="btn-verify-small" onClick={handleVerifyPhone}>Verify Now</button>}
          </li>
          <li className={profile?.locationVerified ? 'completed' : ''}>
            <span>📍 Location Validation (+20 pts)</span>
            {!profile?.locationVerified && <button className="btn-verify-small" onClick={handleVerifyLocation}>Capture GPS</button>}
          </li>
          <li className={(profile?.name && profile?.serviceCategory) ? 'completed' : ''}>
            <span>👤 Complete Business Profile (+20 pts)</span>
            {!(profile?.name && profile?.serviceCategory) && <button className="btn-verify-small" onClick={() => setShowForm(true)}>Complete</button>}
          </li>
          <li className={(profile?.avgRating >= 4) ? 'completed' : ''}>
             <span>⭐ Get Good Reviews/Ratings (+20 pts)</span>
          </li>
          <li className={(profile?.activityCount >= 1) ? 'completed' : ''}>
             <span>📈 Stay Active & List Services (+20 pts)</span>
          </li>
        </ul>
      </div>

      {!showForm && (
        <button className="btn-edit-profile" onClick={() => setShowForm(true)}>
          Edit Merchant Profile
        </button>
      )}

      {showForm && (
        <div className="verification-form-card">
          <h3>Update Profile Details</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Business or personal name" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Shop or home address" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Service Category</label>
                <input type="text" name="serviceCategory" value={formData.serviceCategory} onChange={handleChange} placeholder="e.g. Electrician, Tutor" />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Pricing Range</label>
                <input type="text" name="pricingRange" value={formData.pricingRange} onChange={handleChange} placeholder="e.g. ₹500 - ₹2000" />
              </div>
              <div className="form-group">
                <label>ID Proof URL (Optional)</label>
                <input type="text" name="idProofUrl" value={formData.idProofUrl} onChange={handleChange} placeholder="Link to Aadhaar/PAN" />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">Save & Update Score</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
