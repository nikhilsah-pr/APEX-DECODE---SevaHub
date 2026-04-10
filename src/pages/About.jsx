import { Link } from 'react-router-dom';
import {
  FiTarget, FiShield, FiUsers, FiAward, FiMapPin, FiStar,
  FiCheckCircle, FiTrendingUp,
} from 'react-icons/fi';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      {/* Hero Banner */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content animate-fade-in">
            <div className="hero-badge">🙏 Our Story</div>
            <h1 className="about-hero-title">
              Empowering India's <span className="highlight">Local Service Economy</span>
            </h1>
            <p className="about-hero-subtitle">
              SevaHub was born from a simple belief — every skilled professional
              in India deserves to be discovered, and every family deserves
              trustworthy help at their doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission">
        <div className="container">
          <div className="about-mission-grid">
            <div className="about-mission-card animate-fade-in animate-delay-1">
              <div className="about-mission-icon">
                <FiTarget />
              </div>
              <h2>Our Mission</h2>
              <p>
                To connect every Indian household with verified, skilled
                professionals within minutes — making quality services
                accessible, affordable, and reliable for all.
              </p>
            </div>
            <div className="about-mission-card animate-fade-in animate-delay-2">
              <div className="about-mission-icon vision">
                <FiTrendingUp />
              </div>
              <h2>Our Vision</h2>
              <p>
                To become India's most trusted hyper-local platform that
                empowers millions of service providers with technology
                and bridges the trust gap in local services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="about-highlights">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Why Choose SevaHub?
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>
            Built for India, with India, by India
          </p>

          <div className="about-highlights-grid">
            {[
              {
                icon: <FiShield />,
                title: 'Verified Professionals',
                desc: 'Every service provider undergoes thorough background verification and skill assessment before joining the platform.',
                color: '#27AE60',
              },
              {
                icon: <FiMapPin />,
                title: 'Hyper-Local Discovery',
                desc: 'Find services within your neighbourhood. From electricians next door to tutors around the corner.',
                color: '#FF9933',
              },
              {
                icon: <FiStar />,
                title: 'Real Reviews',
                desc: 'Genuine ratings from real customers. No fake reviews, no paid promotions — just honest feedback.',
                color: '#F39C12',
              },
              {
                icon: <FiCheckCircle />,
                title: 'Instant Booking',
                desc: 'Book services instantly with transparent pricing, available time slots, and real-time confirmation.',
                color: '#2196F3',
              },
              {
                icon: <FiUsers />,
                title: '50,000+ Users',
                desc: 'Trusted by families and businesses across 35+ cities in India and growing rapidly every day.',
                color: '#E91E63',
              },
              {
                icon: <FiAward />,
                title: 'Quality Guarantee',
                desc: 'Not satisfied? We offer full refunds and re-service guarantees to ensure your complete satisfaction.',
                color: '#9C27B0',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`about-highlight-card animate-fade-in animate-delay-${(i % 4) + 1}`}
              >
                <div
                  className="about-highlight-icon"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {[
              { value: '500+', label: 'Service Providers' },
              { value: '50,000+', label: 'Happy Customers' },
              { value: '35+', label: 'Cities Covered' },
              { value: '4.8★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="about-stat-item">
                <div className="about-stat-value">{stat.value}</div>
                <div className="about-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / CTA */}
      <section className="about-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="about-cta-title">
            Ready to find trusted services near you?
          </h2>
          <p className="about-cta-subtitle">
            Join 50,000+ users who discovered reliable professionals through SevaHub
          </p>
          <div className="about-cta-actions">
            <Link to="/services" className="about-cta-btn primary">
              Explore Services
            </Link>
            <Link to="/merchant" className="about-cta-btn outline">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
