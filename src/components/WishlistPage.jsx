import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/shopify.js';
import ProductCard from './ProductCard.jsx';
import ProductModal from './ProductModal.jsx';
import SkeletonCard from './SkeletonCard.jsx';

function getWishlistIds() {
  try { return new Set(JSON.parse(localStorage.getItem('tidal_wishlist') || '[]')); }
  catch { return new Set(); }
}

export default function WishlistPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(getWishlistIds);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getProducts(250).then(setAllProducts).finally(() => setLoading(false));

    const handler = () => setWishlistIds(getWishlistIds());
    window.addEventListener('wishlist-change', handler);
    return () => window.removeEventListener('wishlist-change', handler);
  }, []);

  const wished = allProducts.filter(p => wishlistIds.has(p.id));

  return (
    <div className="wishlist-page">
      <div className="info-hero">
        <span className="hero-eyebrow">Your collection</span>
        <h1 className="info-headline">Saved Items</h1>
      </div>

      {loading ? (
        <div className="product-grid wishlist-grid">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : wished.length === 0 ? (
        <div className="wishlist-empty">
          <p className="wishlist-empty-text">You haven't saved anything yet.</p>
          <p className="wishlist-empty-sub">Tap ♡ on any product to save it here.</p>
          <Link to="/" className="btn-primary wishlist-shop-btn">Start Shopping →</Link>
        </div>
      ) : (
        <>
          <p className="wishlist-count">{wished.length} saved item{wished.length !== 1 ? 's' : ''}</p>
          <div className="product-grid wishlist-grid">
            {wished.map(p => (
              <ProductCard key={p.id} product={p} onShowDetails={() => setSelected(p)} />
            ))}
          </div>
        </>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
