import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { getServiceById, createBooking } from '../api';

export default function Booking({ user, onBook }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(searchParams.get('slot') || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    getServiceById(id).then((found) => {
      setService(found);
      setLoading(false);
    });
  }, [id, user, navigate]);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const handleConfirm = () => {
    if (!date) {
      toast('Please select a date', 'error');
      return;
    }
    if (!selectedSlot) {
      toast('Please select a time slot', 'error');
      return;
    }

    setSubmitting(true);
    const booking = {
      serviceId: service.id,
      userId: user.email,
      serviceName: service.name,
      provider: service.provider,
      price: service.price,
      date,
      slot: selectedSlot,
      image: service.images[0],
      bookedAt: new Date().toISOString(),
    };

    createBooking(booking).then((savedBooking) => {
      if (onBook) onBook(savedBooking);
      setSubmitting(false);
      navigate('/success', { state: { booking: savedBooking } });
    }).catch((err) => {
      toast('Failed to create booking', 'error');
      setSubmitting(false);
    });
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '80vh' }}>
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading booking page...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="empty-state" style={{ minHeight: '80vh' }}>
        <div className="empty-state-icon">😕</div>
        <h3 className="empty-state-title">Service Not Found</h3>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-card animate-fade-in">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
            📅 Book Service
          </h2>

          {/* Service Info */}
          <div className="booking-service-info">
            <img src={service.images[0]} alt={service.name} className="booking-service-img" />
            <div>
              <div className="booking-service-name">{service.name}</div>
              <div className="booking-service-provider">by {service.provider}</div>
              <div className="booking-service-price">₹{service.price}</div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="booking-form-group">
            <label className="booking-form-label">Select Date</label>
            <input
              type="date"
              className="booking-form-input"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time Slot Selection */}
          <div className="booking-form-group">
            <label className="booking-form-label">Select Time Slot</label>
            <div className="booking-slots-grid">
              {service.slots.map((slot) => (
                <div
                  key={slot}
                  className={`booking-slot ${selectedSlot === slot ? 'active' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {date && selectedSlot && (
            <div
              className="animate-fade-in"
              style={{
                padding: '16px',
                background: '#FFF5EB',
                borderRadius: '12px',
                marginTop: '8px',
              }}
            >
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '8px', fontWeight: 600 }}>
                Booking Summary
              </p>
              <p style={{ fontSize: '0.9rem', color: '#333' }}>
                📅 {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#333' }}>🕐 {selectedSlot}</p>
              <p style={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>💰 ₹{service.price}</p>
            </div>
          )}

          {/* Confirm Button */}
          <button
            className="booking-confirm-btn"
            onClick={handleConfirm}
            disabled={!date || !selectedSlot || submitting}
          >
            {submitting ? (
              <>
                <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 3, display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}></span>
                Confirming...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
