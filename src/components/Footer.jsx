import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">
              🙏 <span>SevaHub</span>
            </div>
            <p className="footer-brand-desc">
              India's most trusted hyper-local services platform. Connecting you
              with verified professionals in your neighbourhood.
            </p>
          </div>

          <div>
            <h4 className="footer-column-title">Services</h4>
            <ul className="footer-links">
              <li><Link to="/services">Electrician</Link></li>
              <li><Link to="/services">Plumber</Link></li>
              <li><Link to="/services">Tutor</Link></li>
              <li><Link to="/services">Salon</Link></li>
              <li><Link to="/services">AC Repair</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-column-title">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/merchant">Partner With Us</Link></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-column-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#safety">Safety</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SevaHub. Made with ❤️ in India</span>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
