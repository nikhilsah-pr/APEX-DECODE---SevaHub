import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

export default function Navbar({ user, setUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sevaUser');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">🙏</div>
          <span>SevaHub</span>
        </Link>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/services" className={`navbar-link ${isActive('/services') ? 'active' : ''}`}>
            Services
          </Link>
          <Link to="/about" className={`navbar-link ${isActive('/about') ? 'active' : ''}`}>
            About Us
          </Link>
          <Link to="/contact" className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
          <Link to="/merchant" className={`navbar-link ${isActive('/merchant') ? 'active' : ''}`}>
            Merchant
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}>
              Admin
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`navbar-link navbar-user-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <FiUser size={15} />
                <span>{user.name}</span>
              </Link>
              <button className="navbar-btn navbar-btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="navbar-btn navbar-btn-outline">Login</button>
              </Link>
              <Link to="/register">
                <button className="navbar-btn navbar-btn-primary">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
