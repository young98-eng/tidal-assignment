import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, formatPrice } from '../api/shopify.js';

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    getProducts(250).then(setAllProducts);
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    const matched = allProducts
      .filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
      .slice(0, 8);
    setResults(matched);
  }, [query, allProducts]);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={e => e.stopPropagation()}>
        <div className="search-input-row">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="search-close" onClick={onClose}>✕</button>
        </div>

        {query.trim() && (
          <div className="search-results">
            {results.length === 0 ? (
              <p className="search-empty">No results for "<strong>{query}</strong>"</p>
            ) : (
              <>
                <p className="search-results-label">{results.length} result{results.length !== 1 ? 's' : ''}</p>
                {results.map(p => {
                  const img = p.featuredImage || p.images?.[0];
                  return (
                    <Link
                      key={p.id}
                      to={`/products/${p.handle}`}
                      className="search-result-item"
                      onClick={onClose}
                    >
                      <div className="search-result-img-wrap">
                        {img && <img src={img.url} alt={p.title} className="search-result-img" />}
                      </div>
                      <div className="search-result-info">
                        <p className="search-result-title">{p.title}</p>
                        <p className="search-result-price">
                          {p.hasMultiplePrices ? `From ${formatPrice(p.price)}` : formatPrice(p.price)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="search-suggestions">
            <p className="search-suggestions-label">Popular searches</p>
            {['Hoodie', 'Sneakers', 'T-shirt', 'Shorts', 'Bag'].map(s => (
              <button key={s} className="search-suggestion-chip" onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
