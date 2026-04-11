import { useState, useEffect } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiPackage } from 'react-icons/fi';
import { useToast } from '../components/Toast';
import { getCategories, addService } from '../api';
import Footer from '../components/Footer';
import MerchantVerification from '../components/MerchantVerification';

export default function Merchant({ user }) {
  const toast = useToast();
  const [myServices, setMyServices] = useState(() => {
    const saved = localStorage.getItem('sevaMerchantServices');
    return saved ? JSON.parse(saved) : [];
  });

  const emptyForm = {
    name: '',
    category: '',
    price: '',
    description: '',
    location: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    localStorage.setItem('sevaMerchantServices', JSON.stringify(myServices));
  }, [myServices]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Service name is required';
    if (!form.category) errs.category = 'Select a category';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = 'Enter a valid price';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.description.trim().length < 15)
      errs.description = 'At least 15 characters';
    if (!form.location.trim()) errs.location = 'Location is required';
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editing !== null) {
      setMyServices((prev) =>
        prev.map((s) =>
          s.id === editing
            ? { ...s, ...form, price: Number(form.price), updatedAt: new Date().toISOString() }
            : s
        )
      );
      toast('Service updated successfully!', 'success');
      setEditing(null);
      setForm(emptyForm);
      setShowForm(false);
      setErrors({});
    } else {
      const newService = {
        ...form,
        price: Number(form.price),
        address: form.location, // align with backend property
        provider: user ? user.name : 'Unknown Merchant',
      };
      
      addService(newService).then((savedService) => {
        setMyServices((prev) => [savedService, ...prev]);
        toast('Service added to the backend successfully!', 'success');
        setForm(emptyForm);
        setShowForm(false);
        setErrors({});
      }).catch(e => {
        toast('Failed to add service', 'error');
      });
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      category: service.category,
      price: String(service.price),
      description: service.description,
      location: service.location,
    });
    setEditing(service.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setMyServices((prev) => prev.filter((s) => s.id !== id));
    toast('Service removed', 'info');
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setErrors({});
    setEditing(null);
    setShowForm(false);
  };

  return (
    <>
      <div className="merchant-page">
        <div className="container">
          <MerchantVerification user={user} />
          
          {/* Header */}
          <div className="merchant-header animate-fade-in">
            <div>
              <h1 className="section-title">Merchant Dashboard</h1>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Manage your services and reach thousands of customers
              </p>
            </div>
            {!showForm && (
              <button
                className="merchant-add-btn"
                onClick={() => setShowForm(true)}
              >
                <FiPlus /> Add Service
              </button>
            )}
          </div>

          {/* Add Service Form */}
          {showForm && (
            <div className="merchant-form-card animate-fade-in">
              <h2 className="merchant-form-title">
                {editing ? '✏️ Edit Service' : '➕ Add New Service'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="merchant-form-row">
                  <div className="merchant-form-group">
                    <label className="merchant-form-label">Service Name</label>
                    <input
                      type="text"
                      className={`merchant-form-input ${errors.name ? 'error' : ''}`}
                      placeholder="e.g., Expert Plumbing Services"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                    {errors.name && <span className="merchant-form-error">{errors.name}</span>}
                  </div>

                  <div className="merchant-form-group">
                    <label className="merchant-form-label">Category</label>
                    <select
                      className={`merchant-form-input ${errors.category ? 'error' : ''}`}
                      value={form.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && <span className="merchant-form-error">{errors.category}</span>}
                  </div>
                </div>

                <div className="merchant-form-row">
                  <div className="merchant-form-group">
                    <label className="merchant-form-label">Price (₹)</label>
                    <input
                      type="number"
                      className={`merchant-form-input ${errors.price ? 'error' : ''}`}
                      placeholder="e.g., 499"
                      value={form.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      min="1"
                    />
                    {errors.price && <span className="merchant-form-error">{errors.price}</span>}
                  </div>

                  <div className="merchant-form-group">
                    <label className="merchant-form-label">Location</label>
                    <input
                      type="text"
                      className={`merchant-form-input ${errors.location ? 'error' : ''}`}
                      placeholder="e.g., Koramangala, Bangalore"
                      value={form.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                    />
                    {errors.location && <span className="merchant-form-error">{errors.location}</span>}
                  </div>
                </div>

                <div className="merchant-form-group">
                  <label className="merchant-form-label">Description</label>
                  <textarea
                    className={`merchant-form-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Describe your service in detail..."
                    rows="4"
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                  {errors.description && <span className="merchant-form-error">{errors.description}</span>}
                </div>

                <div className="merchant-form-actions">
                  <button type="submit" className="merchant-submit-btn">
                    {editing ? 'Update Service' : 'Add Service'}
                  </button>
                  <button type="button" className="merchant-cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Services List */}
          <div className="merchant-services-section">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>
              <FiPackage style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Your Services ({myServices.length})
            </h2>

            {myServices.length === 0 ? (
              <div className="empty-state" style={{ minHeight: '300px' }}>
                <div className="empty-state-icon">🏪</div>
                <h3 className="empty-state-title">No services added yet</h3>
                <p className="empty-state-message">
                  Click "Add Service" to list your first service and start reaching customers.
                </p>
              </div>
            ) : (
              <div className="merchant-services-grid">
                {myServices.map((service) => {
                  const cat = categories.find((c) => c.name === service.category);
                  return (
                    <div key={service.id} className="merchant-service-card animate-fade-in">
                      <div className="merchant-service-card-header">
                        <div
                          className="merchant-service-icon"
                          style={{ background: cat ? `${cat.color}15` : '#f0f0f0' }}
                        >
                          {cat ? cat.icon : '📦'}
                        </div>
                        <div className="merchant-service-status">
                          <span className={`admin-status ${service.status}`}>
                            {service.status}
                          </span>
                        </div>
                      </div>

                      <h3 className="merchant-service-name">{service.name}</h3>
                      <p className="merchant-service-category">{service.category}</p>
                      <p className="merchant-service-desc">{service.description}</p>

                      <div className="merchant-service-meta">
                        <span className="merchant-service-price">₹{service.price}</span>
                        <span className="merchant-service-location">📍 {service.location}</span>
                      </div>

                      <div className="merchant-service-actions">
                        <button
                          className="merchant-edit-btn"
                          onClick={() => handleEdit(service)}
                        >
                          <FiEdit3 size={14} /> Edit
                        </button>
                        <button
                          className="merchant-delete-btn"
                          onClick={() => handleDelete(service.id)}
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
