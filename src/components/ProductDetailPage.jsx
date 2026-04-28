import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProducts, formatPrice } from '../api/shopify.js';
import { colorToHex, isLightColor } from '../utils/colors.js';
import { useCart } from '../context/CartContext.jsx';
import QuantityPicker from './QuantityPicker.jsx';

function RelatedProducts({ currentHandle, currentCategory }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts(250).then(all => {
      const related = all
        .filter(p => p.handle !== currentHandle)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setProducts(related);
    });
  }, [currentHandle]);

  if (!products.length) return null;

  return (
    <section className="related-section">
      <h2 className="related-title">You May Also Like</h2>
      <div className="related-grid">
        {products.map(p => {
          const img = p.featuredImage || p.images[0];
          return (
            <Link key={p.id} to={`/products/${p.handle}`} className="related-card">
              <div className="related-img-wrap">
                {img && <img src={img.url} alt={p.title} className="related-img" />}
              </div>
              <p className="related-name">{p.title}</p>
              <p className="related-price">{formatPrice(p.price)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function ProductDetailPage() {
  const { handle } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    getProduct(handle)
      .then(p => { setProduct(p); setSelectedVariant(p.variants[0] || null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) return (
    <div className="detail-skeleton">
      <div className="skeleton detail-skeleton-img" />
      <div className="detail-skeleton-info">
        {[70, 30, 100, 100, 60].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: i === 0 ? 28 : 16, width: `${w}%`, marginBottom: 12 }} />
        ))}
      </div>
    </div>
  );
  if (error) return <div className="state-msg error">Error: {error}</div>;
  if (!product) return <div className="state-msg">Product not found.</div>;

  const colorOption = product.options.find(o => o.name.toLowerCase() === 'color');
  const sizeOption = product.options.find(o => o.name.toLowerCase() === 'size');
  const selectedColor = selectedVariant?.selectedOptions.find(
    o => o.name.toLowerCase() === 'color'
  )?.value;

  // All unique images + variant images
  const allImages = (() => {
    const seen = new Set(product.images.map(i => i.url));
    const imgs = [...product.images];
    product.variants.forEach(v => {
      if (v.image && !seen.has(v.image.url)) {
        seen.add(v.image.url);
        imgs.push(v.image);
      }
    });
    return imgs;
  })();

  // Bonus: filter by color
  const visibleImages = (() => {
    if (!colorOption || !selectedColor) return allImages;
    const colorImgs = product.variants
      .filter(v => v.selectedOptions.some(o => o.name.toLowerCase() === 'color' && o.value === selectedColor))
      .map(v => v.image)
      .filter(Boolean);
    return colorImgs.length ? colorImgs : allImages;
  })();

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-detail-page">
      <div className="detail-breadcrumb">
        <Link to="/">All Products</Link>
        <span>/</span>
        <span>{product.title}</span>
      </div>

      <div className="detail-layout">
        {/* Left: stacked images — scrolls */}
        <div className="detail-images">
          {visibleImages.map((img, i) => (
            <div key={i} className="detail-image-item">
              <img src={img.url} alt={img.altText || `${product.title} ${i + 1}`} />
            </div>
          ))}
        </div>

        {/* Right: sticky info panel */}
        <div className="detail-info">
          {product.productType && (
            <span className="detail-type">{product.productType}</span>
          )}
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-price">
            {formatPrice(selectedVariant?.price || product.price)}
            {product.hasMultiplePrices && !selectedVariant && (
              <span className="price-note"> — varies by option</span>
            )}
          </p>

          {colorOption && (
            <div className="option-group">
              <span className="option-label">
                Colour — <strong>{selectedColor}</strong>
              </span>
              <div className="swatches">
                {colorOption.values.map(color => {
                  const hex = colorToHex(color);
                  const light = hex ? isLightColor(hex) : false;
                  return (
                    <button
                      key={color}
                      className={`swatch${selectedColor === color ? ' active' : ''}`}
                      style={hex ? { background: hex, borderColor: light ? '#ccc' : 'transparent' } : { background: '#ddd' }}
                      title={color}
                      onClick={() => {
                        const match = product.variants.find(v =>
                          v.selectedOptions.some(o => o.name.toLowerCase() === 'color' && o.value === color)
                        );
                        if (match) setSelectedVariant(match);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {sizeOption && (
            <div className="option-group">
              <span className="option-label">Size</span>
              <div className="size-options">
                {sizeOption.values.map(size => {
                  const match = product.variants.find(v =>
                    v.selectedOptions.some(o => o.name.toLowerCase() === 'size' && o.value === size) &&
                    (!selectedColor || v.selectedOptions.some(o => o.name.toLowerCase() === 'color' && o.value === selectedColor))
                  );
                  const active = selectedVariant?.selectedOptions.some(
                    o => o.name.toLowerCase() === 'size' && o.value === size
                  );
                  return (
                    <button
                      key={size}
                      className={`size-btn${active ? ' active' : ''}${!match?.availableForSale ? ' disabled' : ''}`}
                      onClick={() => match && setSelectedVariant(match)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!colorOption && !sizeOption && product.variants.length > 1 && (
            <div className="option-group">
              <span className="option-label">Variant</span>
              <select
                className="variant-select"
                onChange={e => {
                  const v = product.variants.find(v => v.id === e.target.value);
                  if (v) setSelectedVariant(v);
                }}
                value={selectedVariant?.id || ''}
              >
                {product.variants.map(v => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="option-group">
            <span className="option-label">Quantity</span>
            <QuantityPicker value={qty} onChange={setQty} />
          </div>

          <button
            className={`btn-primary detail-cta${added ? ' btn-added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>

          {product.description && (
            <details className="detail-desc-wrap">
              <summary className="detail-desc-toggle">Description</summary>
              <p className="detail-description">{product.description}</p>
            </details>
          )}
        </div>
      </div>

      <RelatedProducts currentHandle={handle} />
    </div>
  );
}
