import { Link } from 'react-router-dom';
import { formatPrice } from '../api/shopify.js';

export default function ProductCard({ product, onShowDetails }) {
  const img = product.featuredImage || product.images[0];
  const colorOption = product.options?.find(o => o.name.toLowerCase() === 'color');

  return (
    <article className="product-card">
      <div className="card-image-wrap">
        <Link to={`/products/${product.handle}`}>
          {img
            ? <img src={img.url} alt={img.altText || product.title} className="card-img" />
            : <div className="card-img-placeholder" />
          }
        </Link>
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
