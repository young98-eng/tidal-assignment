import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/shopify.js';

const COLLECTIONS = [
  {
    key: 'Tops',
    label: 'Tops',
    desc: 'T-shirts, hoodies, jackets & more',
    tags: ['tops'],
  },
  {
    key: 'Bottoms',
    label: 'Bottoms',
    desc: 'Pants, shorts, jeans & skirts',
    tags: ['bottoms'],
  },
  {
    key: 'Shoes',
    label: 'Shoes',
    desc: 'Sneakers, slides & boots',
    tags: ['shoes'],
  },
  {
    key: 'Accessories',
    label: 'Accessories',
    desc: 'Bags, sunglasses & essentials',
    tags: ['accessories'],
  },
];

function matchCollection(product, col) {
  const text = `${product.title} ${product.tags.join(' ')}`.toLowerCase();
  return col.tags.some(t => text.includes(t));
}

export default function CollectionsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts(250).then(setProducts);
  }, []);

  return (
    <div className="collections-page">
      <div className="collections-hero">
        <span className="hero-eyebrow">Browse by category</span>
        <h1 className="collections-headline">Collections</h1>
      </div>

      <div className="collections-grid">
        {COLLECTIONS.map(col => {
          const match = products.find(p => matchCollection(p, col));
          const img = match?.featuredImage || match?.images?.[0];
          const count = products.filter(p => matchCollection(p, col)).length;

          return (
            <button
              key={col.key}
              className="collection-card"
              onClick={() => navigate(`/?category=${col.key}`)}
            >
              <div className="collection-img-wrap">
                {img
                  ? <img src={img.url} alt={col.label} className="collection-img" />
                  : <div className="collection-img-placeholder" />
                }
                <div className="collection-overlay" />
              </div>
              <div className="collection-info">
                <h2 className="collection-name">{col.label}</h2>
                <p className="collection-desc">{col.desc}</p>
                <span className="collection-count">{count} items</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
