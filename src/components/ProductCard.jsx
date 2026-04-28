import { Link } from 'react-router-dom';
import { formatPrice } from '../api/shopify.js';
import { useWishlist } from '../utils/wishlist.js';

export default function ProductCard({ product, onShowDetails }) {
  const img = product.featuredImage || product.images?.[0];
  const secondImg = product.images?.[1] || null;
  const colorOption = product.options?.find(o => o.name.toLowerCase() === 'color');
  const { liked, toggle } = useWishlist(product.id);

  return (
    <article className="product-card">
      <div className="card-image-wrap">
        <Link to={`/products/${product.handle}`} tabIndex={-1}>
          {img && <img src={img.url} alt={img.altText || product.title} className="card-img card-img-primary" />}
          {secondImg && <img src={secondImg.url} alt={product.title} className="card-img card-img-secondary" />}
          {!img && <div className="card-img-placeholder" />}
        </Link>
        <button
          className={`card-wishlist${liked ? ' liked' : ''}`}
          onClick={toggle}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {liked ? '♥' : '♡'}
        </button>
        <button className="card-quick-view" onClick={onShowDetails}>
          Quick View
        </button>
      </div>
      <div className="card-body">
        <Link to={`/products/${product.handle}`} className="card-title">
          {product.title}
        </Link>
        <p className="card-price">
          {product.hasMultiplePrices ? `From ${formatPrice(product.price)}` : formatPrice(product.price)}
        </p>
        {colorOption && (
          <p className="card-color-count">{colorOption.values.length} colours</p>
        )}
      </div>
    </article>
  );
}
