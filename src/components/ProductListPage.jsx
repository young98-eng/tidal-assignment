import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../api/shopify.js';
import ProductCard from './ProductCard.jsx';
import ProductModal from './ProductModal.jsx';
import SkeletonCard from './SkeletonCard.jsx';

const GENDER_TAGS = ['men', 'women', 'unisex', 'male', 'female', "men's", "women's"];

function deriveGender(product) {
  const tags = product.tags.map(t => t.toLowerCase());
  const title = product.title.toLowerCase();
  if (tags.some(t => t.includes('women') || t.includes('female')) || title.includes("women's"))
    return 'Women';
  if (tags.some(t => t.includes('men') || t.includes('male')) || title.includes("men's"))
    return 'Men';
  return 'Unisex';
}

function deriveCategory(product) {
  if (product.productType) return product.productType;
  const t = product.title.toLowerCase();
  const tags = product.tags.map(t => t.toLowerCase()).join(' ');
  const text = `${t} ${tags}`;
  if (/shoe|sneaker|boot|sandal|heel|loafer|slipper/.test(text)) return 'Shoes';
  if (/pant|jean|denim|trouser|short|skirt|legging/.test(text)) return 'Bottoms';
  if (/shirt|top|blouse|sweater|hoodie|jacket|coat|vest|tee|polo/.test(text)) return 'Tops';
  if (/bag|backpack|hat|cap|belt|sock|scarf|glove|watch|jewel/.test(text)) return 'Accessories';
  return 'Other';
}

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGender, setActiveGender] = useState('All');

  useEffect(() => {
    getProducts(250)
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const enriched = useMemo(() =>
    products.map(p => ({ ...p, _category: deriveCategory(p), _gender: deriveGender(p) })),
    [products]
  );

  const categories = useMemo(() => {
    const set = new Set(enriched.map(p => p._category));
    return ['All', ...Array.from(set).sort()];
  }, [enriched]);

  const genders = useMemo(() => {
    const set = new Set(enriched.map(p => p._gender).filter(g => g !== 'Unisex'));
    return ['All', ...Array.from(set).sort()];
  }, [enriched]);

  const filtered = useMemo(() =>
    enriched.filter(p =>
      (activeCategory === 'All' || p._category === activeCategory) &&
      (activeGender === 'All' || p._gender === activeGender)
    ),
    [enriched, activeCategory, activeGender]
  );

  return (
    <section className="product-list-page">
      <div className="list-header">
        <h1 className="page-title">All Products</h1>
        <span className="product-count">{loading ? '—' : `${filtered.length} items`}</span>
      </div>

      {/* Gender filter */}
      {!loading && genders.length > 2 && (
        <div className="filter-group">
          {genders.map(g => (
            <button
              key={g}
              className={`filter-pill${activeGender === g ? ' active' : ''}`}
              onClick={() => setActiveGender(g)}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Category filter */}
      {!loading && categories.length > 2 && (
        <div className="filter-group filter-category">
          {categories.map(c => (
            <button
              key={c}
              className={`filter-tab${activeCategory === c ? ' active' : ''}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {error && <div className="state-msg error">Failed to load: {error}</div>}

      <div className="product-grid">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
            ? <p className="state-msg">No products in this category.</p>
            : filtered.map(p => (
                <ProductCard key={p.id} product={p} onShowDetails={() => setSelected(p)} />
              ))
        }
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
