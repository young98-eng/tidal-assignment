import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../api/shopify.js';
import { useWishlist } from '../utils/wishlist.js';
import { resized, getColorImages } from '../utils/imageUrl.js';

function ProductCard({ product, onShowDetails }) {
  const colorOption = product.options?.find(o => o.name.toLowerCase() === 'color');
  const colors = colorOption?.values || [];
  const hasMultiColors = colors.length > 1;
  const [colorIdx, setColorIdx] = useState(0);
  const activeColor = colors[colorIdx];

  const colorImages = hasMultiColors
    ? getColorImages(product, activeColor)
    : (product.images || []);

  const primaryImg = colorImages[0] || product.featuredImage || product.images?.[0];
  const secondImg = colorImages[1] && colorImages[1].url !== primaryImg?.url ? colorImages[1] : null;

  const cycleColor = (delta) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setColorIdx(i => (i + delta + colors.length) % colors.length);
  };

  const { liked, toggle } = useWishlist(product.id);

  return (
    <article className="product-card">
      <div className={`card-image-wrap${secondImg ? ' has-hover' : ''}`}>
        <Link to={`/products/${product.handle}`} tabIndex={-1} aria-label={product.title}>
          {primaryImg && (
            <img
              src={resized(primaryImg.url, 600)}
              alt={primaryImg.altText || product.title}
              className="card-img card-img-primary"
              loading="lazy"
            />
          )}
          {secondImg && (
            <img
              src={resized(secondImg.url, 600)}
              alt={`${product.title} — alternate view`}
              className="card-img card-img-secondary"
              loading="lazy"
            />
          )}
          {!primaryImg && <div className="card-img-placeholder" aria-hidden="true" />}
        </Link>

        {hasMultiColors && (
          <>
            <button className="card-color-nav prev" onClick={cycleColor(-1)} aria-label="Previous color">‹</button>
            <button className="card-color-nav next" onClick={cycleColor(1)} aria-label="Next color">›</button>
            <span className="card-color-name">{activeColor}</span>
          </>
        )}

        <button
          className={`card-wishlist${liked ? ' liked' : ''}`}
          onClick={toggle}
          aria-label={liked ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        >
          {liked ? '♥' : '♡'}
        </button>
        <button
          className="card-quick-view"
          onClick={onShowDetails}
          aria-label={`Quick view ${product.title}`}
        >
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
          <p className="card-color-count">{colors.length} colour{colors.length !== 1 ? 's' : ''}</p>
        )}
      </div>
    </article>
  );
}

export default memo(ProductCard);
