import { useEffect, useState } from 'react';
import { formatPrice } from '../api/shopify.js';
import { colorToHex, isLightColor } from '../utils/colors.js';
import { useCart } from '../context/CartContext.jsx';
import QuantityPicker from './QuantityPicker.jsx';

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [added, setAdded] = useState(false);

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

  // Collect all images: product images + any unique variant images
  const allImages = (() => {
    const seen = new Set();
    const imgs = [...product.images];
    product.variants.forEach(v => {
      if (v.image && !seen.has(v.image.url)) {
        seen.add(v.image.url);
        if (!imgs.some(i => i.url === v.image.url)) imgs.push(v.image);
      }
    });
    return imgs;
  })();

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
            <p className="modal-price">
              {formatPrice(selectedVariant?.price || product.price)}
              {product.hasMultiplePrices && !selectedVariant && (
                <span className="price-note"> and up</span>
              )}
            </p>

            {colorOption && (
              <div className="option-group">
                <span className="option-label">Color: <strong>{selectedColor}</strong></span>
                <div className="swatches">
                  {colorOption.values.map((color) => {
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
                  {sizeOption.values.map((size) => {
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
                  onChange={(e) => {
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

            <button className={`btn-primary${added ? ' btn-added' : ''}`} onClick={handleAddToCart}>
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
