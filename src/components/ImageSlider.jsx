import { useState } from 'react';

export default function ImageSlider({ images }) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  return (
    <div className="image-slider">
      <div className="slider-main">
        <img
          src={images[active]?.url}
          alt={images[active]?.altText || 'Product image'}
          className="slider-main-img"
        />
      </div>
      {images.length > 1 && (
        <div className="slider-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`thumb-btn${i === active ? ' active' : ''}`}
              onClick={() => setActive(i)}
            >
              <img src={img.url} alt={img.altText || `Image ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
