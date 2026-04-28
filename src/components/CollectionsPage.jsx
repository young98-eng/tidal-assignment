import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/shopify.js';

const COLLECTIONS = [
  {
    key: 'Tops',
    label: 'Tops',
    desc: 'T-shirts, hoodies, sweaters & jackets',
    regex: /shirt|top|blouse|sweater|hoodie|jacket|coat|vest|tee|polo|crewneck|puffer|half.?zip|workout/,
  },
  {
    key: 'Bottoms',
    label: 'Bottoms',
    desc: 'Pants, shorts, jeans & leggings',
    regex: /pant|jean|denim|trouser|short|skirt|legging|sweatpant/,
  },
  {
    key: 'Shoes',
    label: 'Shoes',
    desc: 'Sneakers, slides & everyday footwear',
    regex: /shoe|sneaker|boot|sandal|heel|loafer|slipper|slide|runner/,
  },
  {
    key: 'Accessories',
    label: 'Accessories',
    desc: 'Bags, sunglasses & finishing touches',
    regex: /bag|backpack|hat|cap|belt|sock|scarf|glove|watch|jewel|sunglass|sunni|frontpack|beanie/,
    excludeRegex: /shoe|sneaker|boot|sandal|heel|loafer|slipper|slide|runner/,
  },
];

function matchCollection(product, col) {
  const text = `${product.title} ${product.tags.join(' ')}`.toLowerCase();
  if (col.excludeRegex && col.excludeRegex.test(text)) return false;
  return col.regex.test(text);
}

export default function CollectionsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts(250).then(p => { setProducts(p); setLoading(false); });
  }, []);

  return (
    <div className="collections-page">
      <div className="collections-hero">
        <span className="hero-eyebrow">Shop by category</span>
        <h1 className="collections-headline">Collections</h1>
        <p className="collections-hero-sub">
          From everyday essentials to statement pieces — find your fit.
        </p>
      </div>

      <div className="collections-grid">
        {COLLECTIONS.map((col, i) => {
          const matched = products.filter(p => matchCollection(p, col));
          const cover = matched[0];
          const img = cover?.featuredImage || cover?.images?.[0];
          const count = matched.length;

          return (
            <div
              key={col.key}
              className={`collection-card${i === 0 ? ' collection-card-featured' : ''}`}
              onClick={() => navigate(`/?category=${col.key}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(`/?category=${col.key}`)}
            >
              <div className="collection-img-wrap">
                {loading ? (
                  <div className="collection-img-skeleton" />
                ) : img ? (
                  <img src={img.url} alt={col.label} className="collection-img" loading="lazy" />
                ) : (
                  <div className="collection-img-placeholder" />
                )}
                <div className="collection-overlay" />
              </div>
              <div className="collection-info">
                <span className="collection-count-badge">
                  {loading ? '—' : `${count} items`}
                </span>
                <h2 className="collection-name">{col.label}</h2>
                <p className="collection-desc">{col.desc}</p>
                <span className="collection-cta">Shop now →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
