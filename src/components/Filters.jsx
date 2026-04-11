import { useState, useEffect } from 'react';
import { getCategories } from '../api';

export default function Filters({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCategoryClick = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === cat ? '' : cat,
    }));
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label className="filter-label">Rating</label>
        <select
          className="filter-select"
          value={filters.rating}
          onChange={(e) => setFilters((p) => ({ ...p, rating: e.target.value }))}
        >
          <option value="">All</option>
          <option value="4.5">4.5+ ⭐</option>
          <option value="4">4+ ⭐</option>
          <option value="3">3+ ⭐</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Price</label>
        <select
          className="filter-select"
          value={filters.price}
          onChange={(e) => setFilters((p) => ({ ...p, price: e.target.value }))}
        >
          <option value="">All</option>
          <option value="300">Under ₹300</option>
          <option value="500">Under ₹500</option>
          <option value="1000">Under ₹1000</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Distance</label>
        <select
          className="filter-select"
          value={filters.distance}
          onChange={(e) => setFilters((p) => ({ ...p, distance: e.target.value }))}
        >
          <option value="">Any</option>
          <option value="1">Within 1 km</option>
          <option value="2">Within 2 km</option>
          <option value="5">Within 5 km</option>
        </select>
      </div>

      <div className="filter-group" style={{ flexWrap: 'wrap', gap: '6px', marginLeft: '8px' }}>
        {categories.slice(0, 6).map((cat) => (
          <button
            key={cat.id}
            className={`filter-chip ${filters.category === cat.name ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.name)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
