import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, formatPrice } from '../api/shopify.js';
import ImageSlider from './ImageSlider.jsx';
import QuantityPicker from './QuantityPicker.jsx';

export default function ProductDetailPage() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProduct(handle)
      .then((p) => {
        setProduct(p);
        setSelectedVariant(p.variants[0] || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) return <div className="state-msg">Loading…</div>;
  if (error) return <div className="state-msg error">Error: {error}</div>;
  if (!product) return <div className="state-msg">Product not found.</div>;

  const colorOption = product.options.find((o) => o.name.toLowerCase() === 'color');
  const sizeOption = product.options.find((o) => o.name.toLowerCase() === 'size');

  const selectedColor = selectedVariant?.selectedOptions.find(
    (o) => o.name.toLowerCase() === 'color'
  )?.value;

  // Bonus: filter images by selected color
  const visibleImages = (() => {
    if (!colorOption || !selectedColor) return product.images;
    const colorImages = product.variants
      .filter((v) =>
        v.selectedOptions.some((o) => o.name.toLowerCase() === 'color' && o.value === selectedColor)
      )
      .map((v) => v.image)
      .filter(Boolean);
    return colorImages.length ? colorImages : product.images;
  })();

  const handleAddToCart = () => {
    alert(`Added ${qty}x "${product.title}" to cart!`);
  };

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">← Back to Products</Link>

      <div className="detail-layout">
        {/* Left: vertical image slider */}
        <ImageSlider images={visibleImages} />

        {/* Right: product info */}
        <div className="detail-info">
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-price">{formatPrice(selectedVariant?.price || product.price)}</p>
          <p className="detail-description">{product.description}</p>

          {colorOption && (
            <div className="option-group">
              <span className="option-label">Color: <strong>{selectedColor}</strong></span>
              <div className="swatches">
                {colorOption.values.map((color) => (
                  <button
                    key={color}
                    className={`swatch${selectedColor === color ? ' active' : ''}`}
                    style={{ background: color.toLowerCase() }}
                    title={color}
                    onClick={() => {
                      const match = product.variants.find((v) =>
                        v.selectedOptions.some(
                          (o) => o.name.toLowerCase() === 'color' && o.value === color
                        )
                      );
                      if (match) setSelectedVariant(match);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {sizeOption && (
            <div className="option-group">
              <span className="option-label">Size</span>
              <div className="size-options">
                {sizeOption.values.map((size) => {
                  const match = product.variants.find((v) =>
                    v.selectedOptions.some((o) => o.name.toLowerCase() === 'size' && o.value === size) &&
                    (!selectedColor ||
                      v.selectedOptions.some(
                        (o) => o.name.toLowerCase() === 'color' && o.value === selectedColor
                      ))
                  );
                  const active = selectedVariant?.selectedOptions.some(
                    (o) => o.name.toLowerCase() === 'size' && o.value === size
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
                onChange={(e) => {
                  const v = product.variants.find((v) => v.id === e.target.value);
                  if (v) setSelectedVariant(v);
                }}
                value={selectedVariant?.id || ''}
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="option-group">
            <span className="option-label">Quantity</span>
            <QuantityPicker value={qty} onChange={setQty} />
          </div>

          <button className="btn-primary detail-cta" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
