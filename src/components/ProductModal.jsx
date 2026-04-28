import { useEffect, useState } from 'react';
import { formatPrice } from '../api/shopify.js';
import QuantityPicker from './QuantityPicker.jsx';

export default function ProductModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const colorOption = product.options.find((o) => o.name.toLowerCase() === 'color');
  const sizeOption = product.options.find((o) => o.name.toLowerCase() === 'size');

  const selectedColor = selectedVariant?.selectedOptions.find(
    (o) => o.name.toLowerCase() === 'color'
  )?.value;

  const visibleImages = (() => {
    if (!colorOption || !selectedColor) return product.images;
    const colorImages = product.variants
      .filter((v) => v.selectedOptions.some((o) => o.name.toLowerCase() === 'color' && o.value === selectedColor))
      .map((v) => v.image)
      .filter(Boolean);
    return colorImages.length ? colorImages : product.images;
  })();

  const handleAddToCart = () => {
    alert(`Added ${qty}x "${product.title}" to cart!`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

        <div className="modal-body">
          <div className="modal-images">
            {visibleImages.map((img, i) => (
              <img key={i} src={img.url} alt={img.altText || product.title} className="modal-img" />
            ))}
          </div>

          <div className="modal-info">
            <h2 className="modal-title">{product.title}</h2>
            <p className="modal-price">{formatPrice(selectedVariant?.price || product.price)}</p>

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
                          v.selectedOptions.some((o) => o.name.toLowerCase() === 'color' && o.value === color)
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
                        v.selectedOptions.some((o) => o.name.toLowerCase() === 'color' && o.value === selectedColor))
                    );
                    const active =
                      selectedVariant?.selectedOptions.some(
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

            <div className="modal-qty">
              <span className="option-label">Quantity</span>
              <QuantityPicker value={qty} onChange={setQty} />
            </div>

            <button className="btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
