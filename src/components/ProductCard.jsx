import { Link } from 'react-router-dom';
import { formatPrice } from '../api/shopify.js';

export default function ProductCard({ product, onShowDetails }) {
  const img = product.featuredImage || product.images[0];

  return (
    <article className="product-card">
      <Link to={`/products/${product.handle}`} className="card-image-link">
        {img ? (
          <img src={img.url} alt={img.altText || product.title} className="card-img" />
        ) : (
          <div className="card-img-placeholder" />
        )}
      </Link>
      <div className="card-body">
        <Link to={`/products/${product.handle}`} className="card-title">
          {product.title}
        </Link>
        <p className="card-price">{formatPrice(product.price)}</p>
        <button className="btn-outline" onClick={onShowDetails}>
          Show Details
        </button>
      </div>
    </article>
  );
}
