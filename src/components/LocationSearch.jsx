import { useState, useRef, useEffect } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FiNavigation } from 'react-icons/fi';

export default function LocationSearch({
  locations = [],
  selectedLocation,
  onSelect,
  placeholder = 'Search location...',
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef(null);

  const filtered = locations.filter((loc) =>
    loc.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleSelect = (loc) => {
    onSelect(loc);
    setQuery('');
    setOpen(false);
    setHighlighted(-1);
  };

  const handleDetectLocation = () => {
    handleSelect('Bangalore (Auto-detected)');
  };

  return (
    <div className="location-search" ref={wrapperRef}>
      <div className={`location-search-input-wrapper ${open ? 'focused' : ''}`}>
        <HiOutlineLocationMarker className="location-search-icon" />
        <input
          type="text"
          className="location-search-input"
          placeholder={selectedLocation || placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlighted(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {selectedLocation && (
          <button
            className="location-search-clear"
            onClick={() => {
              onSelect('');
              setQuery('');
            }}
            aria-label="Clear location"
          >
            ✕
          </button>
        )}
      </div>

      {open && (
        <div className="location-search-dropdown">
          <button
            className="location-detect-btn"
            onClick={handleDetectLocation}
          >
            <FiNavigation />
            <span>Detect my location</span>
          </button>

          {filtered.length > 0 ? (
            <ul className="location-search-list">
              {filtered.map((loc, i) => (
                <li
                  key={loc}
                  className={`location-search-item ${i === highlighted ? 'highlighted' : ''} ${loc === selectedLocation ? 'selected' : ''}`}
                  onClick={() => handleSelect(loc)}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  <HiOutlineLocationMarker />
                  <span>{loc}</span>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="location-search-empty">
              No locations found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
