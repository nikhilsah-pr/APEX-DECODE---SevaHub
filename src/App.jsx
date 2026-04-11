import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Booking from './pages/Booking';
import Success from './pages/Success';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Merchant from './pages/Merchant';
import Dashboard from './pages/Dashboard';
import { getBookings } from './api';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sevaUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      getBookings(user.email).then(data => setBookings(data));
    } else {
      setBookings([]);
    }
  }, [user]);

  const handleBook = (booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  return (
    <ToastProvider>
      <Router>
        <AppContent
          user={user}
          setUser={setUser}
          bookings={bookings}
          onBook={handleBook}
        />
      </Router>
    </ToastProvider>
  );
}

function AppContent({ user, setUser, bookings, onBook }) {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {showNavbar && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:id"
          element={<ServiceDetails user={user} bookings={bookings} />}
        />
        <Route
          path="/booking/:id"
          element={<Booking user={user} onBook={onBook} />}
        />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin user={user} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/merchant" element={<Merchant user={user} />} />
        <Route
          path="/dashboard"
          element={<Dashboard user={user} bookings={bookings} />}
        />
      </Routes>
    </>
  );
}
