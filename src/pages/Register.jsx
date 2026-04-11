import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

export default function Register({ setUser }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting form:", form); // ✅ ADD THIS

  try {
    setLoading(true);

    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    console.log("Response from backend:", data); // ✅ ADD THIS

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    const user = data.user;
    setUser(user);
    localStorage.setItem('sevaUser', JSON.stringify(user));

    toast(`Welcome to SevaHub, ${user.name}!`, 'success');
    navigate('/');

  } catch (error) {
    console.error("Error:", error);
    toast(error.message || 'Something went wrong', 'error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              S · <span>SevaHub</span>
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join 50,000+ users discovering local services
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            
            {/* Name */}
            <div className="auth-form-group">
              <label className="auth-form-label">Full Name</label>
              <input
                type="text"
                className="auth-form-input"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="auth-form-group">
              <label className="auth-form-label">Email</label>
              <input
                type="email"
                className="auth-form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="auth-form-group">
              <label className="auth-form-label">Password</label>
              <input
                type="password"
                className="auth-form-input"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-divider">or</div>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </div>

        </div>
      </div>
    </div>
  );
}