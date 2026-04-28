import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, formatPrice } from '../api/shopify.js';
import { colorToHex, isLightColor } from '../utils/colors.js';
import { useCart } from '../context/CartContext.jsx';
import ImageSlider from './ImageSlider.jsx';
import QuantityPicker from './QuantityPicker.jsx';

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
    getProduct(handle)
      .then(p => { setProduct(p); setSelectedVariant(p.variants[0] || null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) return (
    <div className="detail-skeleton">
      <div className="skeleton detail-skeleton-img" />
      <div className="detail-skeleton-info">
        <div className="skeleton" style={{ height: 32, width: '70%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 24, width: '30%', marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '80%' }} />
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

  // All unique images including variant images
  const allImages = (() => {
    const seen = new Set();
    const imgs = [...product.images];
    product.variants.forEach(v => {
      if (v.image && !seen.has(v.image.url) && !imgs.some(i => i.url === v.image.url)) {
        seen.add(v.image.url);
        imgs.push(v.image);
      }
    });
    return imgs;
  })();

  // Bonus: filter by selected color
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
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">← Back to Products</Link>

      <div className="detail-layout">
        <ImageSlider images={visibleImages} />

        <div className="detail-info">
          {product.productType && (
            <span className="detail-type">{product.productType}</span>
          )}
          <h1 className="detail-title">{product.title}</h1>

          <p className="detail-price">
            {formatPrice(selectedVariant?.price || product.price)}
            {product.hasMultiplePrices && !selectedVariant && (
              <span className="price-note"> — price varies by option</span>
            )}
          </p>

          {product.description && (
            <p className="detail-description">{product.description}</p>
          )}

          {colorOption && (
            <div className="option-group">
              <span className="option-label">Color: <strong>{selectedColor}</strong></span>
              <div className="swatches">
                {colorOption.values.map(color => {
                  const hex = colorToHex(color);
                  const light = hex ? isLightColor(hex) : false;
                  return (
                    <button
                      key={color}
                      className={`swatch${selectedColor === color ? ' active' : ''}${!hex ? ' swatch-text' : ''}`}
                      style={hex ? { background: hex, borderColor: light ? '#ccc' : 'transparent' } : {}}
                      title={color}
                      onClick={() => {
                        const match = product.variants.find(v =>
                          v.selectedOptions.some(o => o.name.toLowerCase() === 'color' && o.value === color)
                        );
                        if (match) setSelectedVariant(match);
                      }}
                    >
                      {!hex && <span className="swatch-label">{color.slice(0, 2)}</span>}
                    </button>
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

          <button className={`btn-primary detail-cta${added ? ' btn-added' : ''}`} onClick={handleAddToCart}>
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
