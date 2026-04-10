import { useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin } from 'react-icons/fi';
import { HiOutlineBadgeCheck } from 'react-icons/hi';

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  return (
    <div
      className="service-card animate-fade-in"
      onClick={() => navigate(`/services/${service.id}`)}
    >
      <div className="service-card-image-wrapper">
        <img
          src={service.images[0]}
          alt={service.name}
          className="service-card-image"
          loading="lazy"
        />
        <span className="service-card-badge">{service.category}</span>
        {service.verified && (
          <span className="service-card-verified">
            <HiOutlineBadgeCheck /> Verified
          </span>
        )}
      </div>
      <div className="service-card-body">
        <div className="service-card-category">{service.category}</div>
        <h3 className="service-card-name">{service.name}</h3>
        <p className="service-card-provider">by {service.provider}</p>
        <div className="service-card-meta">
          <div className="service-card-rating">
            <FiStar fill="#F59E0B" stroke="none" />
            {service.rating}
            <span>({service.reviewCount})</span>
          </div>
          <div className="service-card-distance">
            <FiMapPin size={14} />
            {service.distance} km
          </div>
          <div className="service-card-price">₹{service.price}</div>
        </div>
        <div className="service-card-footer">
          <span style={{ fontSize: '0.8rem', color: '#888' }}>
            {service.slots.length} slots available
          </span>
          <button
            className="service-card-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/services/${service.id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
