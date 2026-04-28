import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyViewed } from '../utils/recentlyViewed.js';
import { formatPrice } from '../api/shopify.js';

export default function RecentlyViewed({ excludeHandle }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const all = getRecentlyViewed();
    setItems(excludeHandle ? all.filter(p => p.handle !== excludeHandle) : all);
  }, [excludeHandle]);

  if (!items.length) return null;

  return (
    <section className="rv-section">
      <h2 className="rv-title">Recently Viewed</h2>
      <div className="rv-row">
        {items.map(p => (
          <Link key={p.handle} to={`/products/${p.handle}`} className="rv-card">
            <div className="rv-img-wrap">
              {p.featuredImage && <img src={p.featuredImage.url} alt={p.title} className="rv-img" />}
            </div>
            <p className="rv-name">{p.title}</p>
            <p className="rv-price">
              {p.hasMultiplePrices ? `From ${formatPrice(p.price)}` : formatPrice(p.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
