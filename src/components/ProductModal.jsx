import { useEffect, useState } from 'react';
import { formatPrice } from '../api/shopify.js';
import { colorToHex, isLightColor } from '../utils/colors.js';
import { useCart } from '../context/CartContext.jsx';
import QuantityPicker from './QuantityPicker.jsx';
import ImageSlider from './ImageSlider.jsx';

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
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

  const visibleImages = (() => {
    if (!colorOption || !selectedColor) return allImages;
    const colorImgs = product.variants
      .filter(v => v.selectedOptions.some(o => o.name.toLowerCase() === 'color' && o.value === selectedColor))
      .map(v => v.image)
      .filter(Boolean);
    const uniqueColor = colorImgs.filter((img, i, a) => a.findIndex(x => x.url === img.url) === i);
    return uniqueColor.length ? uniqueColor : allImages;
  })();

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, qty);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-body">
          <div className="modal-slider-wrap">
            <ImageSlider images={visibleImages} />
          </div>

          <div className="modal-info">
            {product.productType && (
              <span className="detail-type">{product.productType}</span>
            )}
            <h2 className="modal-title">{product.title}</h2>
            <p className="modal-price">
              {formatPrice(selectedVariant?.price || product.price)}
              {product.hasMultiplePrices && !selectedVariant && (
                <span className="price-note"> and up</span>
              )}
            </p>

            {colorOption && (
              <div className="option-group">
                <span className="option-label">Colour — <strong>{selectedColor}</strong></span>
                <div className="swatches">
                  {colorOption.values.map((color) => {
                    const hex = colorToHex(color);
                    const light = hex ? isLightColor(hex) : false;
                    return (
                      <div key={color} className="swatch-chip-wrap">
                        <button
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
                        <span className="swatch-chip-label">{color}</span>
                      </div>
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

            <button className="btn-primary" onClick={handleAddToCart}>
              Add to Bag — {formatPrice(selectedVariant?.price || product.price)}
            </button>

            {product.description && (
              <p className="modal-desc">{product.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
