import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import ServiceCard from '../components/ServiceCard';
import Footer from '../components/Footer';
import { categories, services } from '../data/services';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/services');
    }
  };

  const featuredServices = services.filter((s) => s.verified).slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Trusted by 50,000+ users across India</div>
          <h1 className="hero-title">
            Find <span className="highlight">Trusted Local</span><br />
            Services Near You
          </h1>
          <p className="hero-subtitle">
            Discover verified electricians, plumbers, tutors, salons and more in your neighbourhood.
            Book instantly. Pay securely.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-icon">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Search for electrician, plumber, tutor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">
              Search
            </button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Service Providers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">50K+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">35+</div>
              <div className="hero-stat-label">Cities</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">4.8★</div>
              <div className="hero-stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Browse by Category
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>
            Find the right professional for every need
          </p>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link
                to={`/services?category=${cat.name}`}
                key={cat.id}
                className={`category-card animate-fade-in animate-delay-${(i % 4) + 1}`}
              >
                <div className="category-icon">
                  {cat.icon}
                </div>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="featured">
        <div className="container">
          <div className="featured-header">
            <div>
              <h2 className="section-title">Featured Services</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Top-rated professionals handpicked for you
              </p>
            </div>
            <Link to="/services" className="featured-view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="services-grid">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>How It Works</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Book a service in 3 simple steps</p>
          <div className="how-it-works-grid">
            {[
              { step: '01', icon: '🔍', title: 'Search', desc: 'Find the service you need from 100+ categories in your area' },
              { step: '02', icon: '📋', title: 'Compare & Book', desc: 'Compare ratings, reviews, prices & book your preferred professional' },
              { step: '03', icon: '⭐', title: 'Rate & Review', desc: 'After service completion, share your experience to help others' },
            ].map((item) => (
              <div key={item.step} className="how-it-works-card animate-fade-in">
                <div className="how-it-works-emoji">{item.icon}</div>
                <div className="how-it-works-step">STEP {item.step}</div>
                <h3 className="how-it-works-title">{item.title}</h3>
                <p className="how-it-works-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home-cta">
        <div className="container">
          <div className="home-cta-inner">
            <h2 className="home-cta-title">Ready to get started?</h2>
            <p className="home-cta-subtitle">
              Join thousands of happy customers who trust SevaHub for their daily needs.
            </p>
            <div className="home-cta-actions">
              <Link to="/services" className="home-cta-btn primary">Explore Services</Link>
              <Link to="/register" className="home-cta-btn outline">Create Account</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
