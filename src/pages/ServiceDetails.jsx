import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiPhone, FiCalendar, FiChevronRight, FiClock } from 'react-icons/fi';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';
import { getServiceById } from '../api';

export default function ServiceDetails({ user, bookings }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  const isBooked = bookings.some((b) => b.serviceId === parseInt(id));

  useEffect(() => {
    setLoading(true);
    getServiceById(id).then((found) => {
      setService(found);
      if (found) {
        // Load reviews from localStorage or backend
        const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`) || 'null');
        setReviews(storedReviews || found.reviews);
      }
      setLoading(false);
    });
  }, [id]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast('Please login to submit a review', 'error');
      return;
    }
    if (!isBooked) {
      toast('You need to book this service before reviewing', 'error');
      return;
    }
    if (reviewForm.rating === 0) {
      toast('Please select a rating', 'error');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast('Please write a comment', 'error');
      return;
    }

    const newReview = {
      id: Date.now(),
      user: user.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    setReviewForm({ rating: 0, comment: '' });
    toast('Review submitted successfully!', 'success');
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '80vh' }}>
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="empty-state" style={{ minHeight: '80vh' }}>
        <div className="empty-state-icon">😕</div>
        <h3 className="empty-state-title">Service Not Found</h3>
        <p className="empty-state-message">The service you're looking for doesn't exist.</p>
        <Link to="/services" className="service-card-btn" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container detail-page">
        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/services">Services</Link>
          <FiChevronRight size={14} />
          <span>{service.name}</span>
        </div>

        {/* Images */}
        <div className="detail-images">
          {service.images.map((img, i) => (
            <img key={i} src={img} alt={`${service.name} ${i + 1}`} />
          ))}
        </div>

        {/* Main Content */}
        <div className="detail-main">
          {/* Left: Info */}
          <div>
            <div className="detail-info">
              <h1 className="detail-title">{service.name}</h1>
              {service.verified && (
                <div className="detail-verified-badge">
                  <HiOutlineBadgeCheck /> Verified Professional
                </div>
              )}

              <div className="detail-provider">
                <div className="detail-provider-avatar">
                  {service.provider.charAt(0)}
                </div>
                <div>
                  <div className="detail-provider-name">{service.provider}</div>
                  <div className="detail-provider-label">Service Provider</div>
                </div>
              </div>

              <div className="detail-meta-row">
                <FiMapPin />
                <span>{service.address}</span>
              </div>
              <div className="detail-meta-row">
                <FiPhone />
                <span>{service.phone}</span>
              </div>
              <div className="detail-meta-row">
                <FiClock />
                <span>{service.slots.length} time slots available today</span>
              </div>

              <p className="detail-description">{service.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Reviews ({reviews.length})
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiStar fill="#F59E0B" stroke="none" size={20} />
                  <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{service.rating}</span>
                </div>
              </div>

              {/* Review Cards */}
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <div className="review-user">{review.user}</div>
                      <div className="review-date">{review.date}</div>
                    </div>
                  </div>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        fill={star <= review.rating ? '#F59E0B' : 'none'}
                        stroke={star <= review.rating ? 'none' : '#DDD'}
                        size={16}
                      />
                    ))}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}

              {/* Review Form */}
              {user && isBooked ? (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h3 className="review-form-title">Write a Review</h3>
                  <div className="review-form-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`review-form-star ${star <= (hoverRating || reviewForm.rating) ? 'active' : ''}`}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    className="review-form-textarea"
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  />
                  <button type="submit" className="review-form-submit">
                    Submit Review
                  </button>
                </form>
              ) : user && !isBooked ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '0.9rem', background: '#f8f8f8', borderRadius: '12px', marginTop: '16px' }}>
                  📝 Book this service to leave a review
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '0.9rem', background: '#f8f8f8', borderRadius: '12px', marginTop: '16px' }}>
                  🔒 <Link to="/login" style={{ color: 'var(--text-accent)', fontWeight: 600 }}>Sign in</Link> to leave a review
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="detail-sidebar">
            <div className="detail-booking-card">
              <div className="detail-price">₹{service.price}</div>
              <div className="detail-price-label">Starting price</div>

              <div className="detail-rating-summary">
                <div className="detail-rating-value">{service.rating}</div>
                <div className="detail-rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      fill={star <= Math.round(service.rating) ? '#F59E0B' : 'none'}
                      stroke={star <= Math.round(service.rating) ? 'none' : '#DDD'}
                      size={16}
                    />
                  ))}
                </div>
                <div className="detail-rating-count">({service.reviewCount} reviews)</div>
              </div>

              <button
                className="detail-action-btn detail-book-btn"
                onClick={() => {
                  if (!user) {
                    toast('Please login to book a service', 'error');
                    navigate('/login');
                    return;
                  }
                  navigate(`/booking/${service.id}`);
                }}
              >
                <FiCalendar /> Book Now
              </button>

              <button
                className="detail-action-btn detail-call-btn"
                onClick={() => toast(`Calling ${service.phone}...`, 'info')}
              >
                <FiPhone /> Call Now
              </button>

              <div className="detail-slots">
                <div className="detail-slots-title">Available Today</div>
                <div className="detail-slots-grid">
                  {service.slots.map((slot) => (
                    <div
                      key={slot}
                      className="detail-slot"
                      onClick={() => {
                        if (!user) {
                          toast('Please login to book', 'error');
                          navigate('/login');
                          return;
                        }
                        navigate(`/booking/${service.id}?slot=${encodeURIComponent(slot)}`);
                      }}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
