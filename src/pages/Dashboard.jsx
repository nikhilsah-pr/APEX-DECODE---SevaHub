import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function Dashboard({ user, bookings }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Simulate booking status progression based on time
  const getBookingStatus = (booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    if (bookingDate < now) return 'completed';
    // If booked less than 1 hour ago, show pending; otherwise confirmed
    const bookedAt = new Date(booking.bookedAt);
    const diffMs = now - bookedAt;
    if (diffMs < 60 * 60 * 1000) return 'pending';
    return 'confirmed';
  };

  const enrichedBookings = bookings
    .map((b) => ({ ...b, status: getBookingStatus(b) }))
    .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));

  const filteredBookings =
    activeTab === 'all'
      ? enrichedBookings
      : enrichedBookings.filter((b) => b.status === activeTab);

  const stats = {
    total: enrichedBookings.length,
    pending: enrichedBookings.filter((b) => b.status === 'pending').length,
    confirmed: enrichedBookings.filter((b) => b.status === 'confirmed').length,
    completed: enrichedBookings.filter((b) => b.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '80vh' }}>
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-page">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header animate-fade-in">
            <div>
              <h1 className="section-title">My Dashboard</h1>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Welcome back, {user?.name}! Here's your booking overview.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="dashboard-stats animate-fade-in animate-delay-1">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-value">{stats.total}</div>
              <div className="dashboard-stat-label">Total Bookings</div>
            </div>
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-value" style={{ color: '#F39C12' }}>
                {stats.pending}
              </div>
              <div className="dashboard-stat-label">Pending</div>
            </div>
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-value" style={{ color: '#2196F3' }}>
                {stats.confirmed}
              </div>
              <div className="dashboard-stat-label">Confirmed</div>
            </div>
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-value" style={{ color: '#27AE60' }}>
                {stats.completed}
              </div>
              <div className="dashboard-stat-label">Completed</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs animate-fade-in animate-delay-2">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="empty-state" style={{ minHeight: '350px' }}>
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">
                {activeTab === 'all'
                  ? 'No bookings yet'
                  : `No ${activeTab} bookings`}
              </h3>
              <p className="empty-state-message">
                {activeTab === 'all'
                  ? 'Browse services and make your first booking!'
                  : 'Check other tabs or browse more services.'}
              </p>
              {activeTab === 'all' && (
                <Link
                  to="/services"
                  className="service-card-btn"
                  style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  Explore Services <FiArrowRight />
                </Link>
              )}
            </div>
          ) : (
            <div className="dashboard-bookings-grid animate-fade-in animate-delay-3">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="dashboard-booking-card">
                  <div className="dashboard-booking-top">
                    <img
                      src={booking.image}
                      alt={booking.serviceName}
                      className="dashboard-booking-img"
                    />
                    <div className="dashboard-booking-info">
                      <h3 className="dashboard-booking-name">{booking.serviceName}</h3>
                      <p className="dashboard-booking-provider">by {booking.provider}</p>
                      <div className={`dashboard-booking-status ${booking.status}`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-booking-details">
                    <div className="dashboard-booking-detail-row">
                      <FiCalendar size={14} />
                      <span>
                        {new Date(booking.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="dashboard-booking-detail-row">
                      <FiClock size={14} />
                      <span>{booking.slot}</span>
                    </div>
                  </div>

                  <div className="dashboard-booking-footer">
                    <span className="dashboard-booking-price">₹{booking.price}</span>
                    <Link
                      to={`/services/${booking.serviceId}`}
                      className="dashboard-booking-link"
                    >
                      View Service <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
