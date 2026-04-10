import { useState } from 'react';
import { FiSend, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { useToast } from '../components/Toast';
import Footer from '../components/Footer';

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email';
    }
    if (!form.message.trim()) {
      errs.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast('Message sent successfully! We\'ll get back to you soon.', 'success');
      setForm({ name: '', email: '', message: '' });
      setErrors({});
    }, 1200);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: <FiInstagram />,
      url: 'https://instagram.com/sevahub',
      color: '#E4405F',
    },
    {
      name: 'Twitter / X',
      icon: <FiTwitter />,
      url: 'https://twitter.com/sevahub',
      color: '#1DA1F2',
    },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin />,
      url: 'https://linkedin.com/company/sevahub',
      color: '#0A66C2',
    },
  ];

  return (
    <>
      <div className="contact-page">
        <div className="container">
          {/* Header */}
          <div className="contact-header animate-fade-in">
            <h1 className="section-title" style={{ textAlign: 'center', fontSize: '2rem' }}>
              Get in Touch
            </h1>
            <p className="section-subtitle" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
              Have a question, feedback, or partnership inquiry? We'd love to hear from you.
            </p>
          </div>

          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-card animate-fade-in animate-delay-1">
              <h2 className="contact-form-title">Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="contact-form-group">
                  <label className="contact-form-label">Full Name</label>
                  <input
                    type="text"
                    className={`contact-form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                  {errors.name && <span className="contact-form-error">{errors.name}</span>}
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Email Address</label>
                  <input
                    type="email"
                    className={`contact-form-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                  {errors.email && <span className="contact-form-error">{errors.email}</span>}
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Message</label>
                  <textarea
                    className={`contact-form-textarea ${errors.message ? 'error' : ''}`}
                    placeholder="Tell us how we can help..."
                    rows="5"
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                  />
                  {errors.message && <span className="contact-form-error">{errors.message}</span>}
                </div>

                <button type="submit" className="contact-submit-btn" disabled={sending}>
                  {sending ? (
                    <>
                      <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2.5, display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info + Socials */}
            <div className="contact-info-side">
              <div className="contact-info-card animate-fade-in animate-delay-2">
                <h3 className="contact-info-title">Contact Information</h3>

                <div className="contact-info-row">
                  <div className="contact-info-icon">
                    <FiMapPin />
                  </div>
                  <div>
                    <div className="contact-info-label">Office Address</div>
                    <div className="contact-info-value">
                      42, MG Road, Koramangala<br />Bangalore, Karnataka 560034
                    </div>
                  </div>
                </div>

                <div className="contact-info-row">
                  <div className="contact-info-icon">
                    <FiPhone />
                  </div>
                  <div>
                    <div className="contact-info-label">Phone</div>
                    <div className="contact-info-value">+91 80 1234 5678</div>
                  </div>
                </div>

                <div className="contact-info-row">
                  <div className="contact-info-icon">
                    <FiMail />
                  </div>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <div className="contact-info-value">hello@sevahub.in</div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="contact-social-card animate-fade-in animate-delay-3">
                <h3 className="contact-info-title">Follow Us</h3>
                <div className="contact-social-links">
                  {socialLinks.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link"
                      style={{ '--social-color': s.color }}
                    >
                      <span className="contact-social-icon">{s.icon}</span>
                      <span className="contact-social-name">{s.name}</span>
                    </a>
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
