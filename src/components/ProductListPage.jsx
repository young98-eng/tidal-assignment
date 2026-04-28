import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, formatPrice } from '../api/shopify.js';
import { colorToHex } from '../utils/colors.js';
import ProductCard from './ProductCard.jsx';
import ProductModal from './ProductModal.jsx';
import SkeletonCard from './SkeletonCard.jsx';
import RecentlyViewed from './RecentlyViewed.jsx';
import useScrollFadeIn from '../hooks/useScrollFadeIn.js';

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

function EditorialHero({ product }) {
  const img = product?.featuredImage || product?.images?.[0];
  return (
    <section className="editorial-hero">
      <div className="hero-img-wrap">
        {img && <img src={img.url} alt={product.title} className="hero-img" />}
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <span className="hero-eyebrow">Vol. 01 — Crafted Essentials</span>
        <h1 className="hero-headline">Wear what<br /><em>matters</em></h1>
        <p className="hero-copy">Thoughtfully sourced. Endlessly wearable.</p>
        <Link to="/" className="hero-cta" onClick={e => {
          e.preventDefault();
          document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          Shop the edit ↓
        </Link>
      </div>
    </section>
  );
}

function BentoRow({ products, onShowDetails }) {
  const fadeRef = useScrollFadeIn();
  if (products.length < 2) return null;
  const [main, ...rest] = products.slice(0, 3);
  const mainImg = main.featuredImage || main.images?.[0];
  const mainPrice = main.hasMultiplePrices ? `From ${formatPrice(main.price)}` : formatPrice(main.price);

  return (
    <div className="bento-row fade-in" ref={fadeRef}>
      <Link to={`/products/${main.handle}`} className="bento-feature">
        <div className="bento-feature-img-wrap">
          {mainImg && <img src={mainImg.url} alt={main.title} className="bento-img" />}
        </div>
        <div className="bento-feature-info">
          <span className="bento-label">Featured</span>
          <p className="bento-title">{main.title}</p>
          <p className="bento-price">{mainPrice}</p>
        </div>
      </Link>
      <div className="bento-side">
        {rest.map(p => {
          const img = p.featuredImage || p.images?.[0];
          return (
            <Link key={p.id} to={`/products/${p.handle}`} className="bento-small">
              <div className="bento-small-img-wrap">
                {img && <img src={img.url} alt={p.title} className="bento-img" />}
              </div>
              <p className="bento-small-title">{p.title}</p>
              <p className="bento-small-price">
                {p.hasMultiplePrices ? `From ${formatPrice(p.price)}` : formatPrice(p.price)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [activeGender, setActiveGender] = useState('All');
  const gridFadeRef = useScrollFadeIn();

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
    const ORDER = ['Tops', 'Bottoms', 'Shoes', 'Accessories', 'Other'];
    const sorted = [...set].sort((a, b) => {
      const ai = ORDER.indexOf(a);
      const bi = ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return ['All', ...sorted];
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

  const heroProduct = products[0] || null;
  const bentoProducts = products.slice(1, 4);
  const gridProducts = loading ? [] : filtered;

  return (
    <section className="product-list-page">
      {!loading && heroProduct && <EditorialHero product={heroProduct} />}

      {!loading && <BentoRow products={bentoProducts} onShowDetails={setSelected} />}

      <div id="product-grid-section" className="shop-layout">
        <aside className="filter-sidebar">
          <div className="filter-sidebar-section">
            <h3 className="filter-sidebar-title">Gender</h3>
            {genders.map(g => (
              <button
                key={g}
                className={`sidebar-filter-item${activeGender === g ? ' active' : ''}`}
                onClick={() => setActiveGender(g)}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="filter-sidebar-section">
            <h3 className="filter-sidebar-title">Category</h3>
            {categories.map(c => (
              <button
                key={c}
                className={`sidebar-filter-item${activeCategory === c ? ' active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        <div className="shop-grid-area">
          <div className="shop-grid-header">
            <span className="shop-grid-title">
              {activeCategory === 'All' && activeGender === 'All' ? 'All Products' : `${activeGender !== 'All' ? activeGender + ' · ' : ''}${activeCategory}`}
            </span>
            <span className="product-count">{loading ? '—' : `${filtered.length} items`}</span>
          </div>

          {/* Mobile filter pills */}
          <div className="mobile-filter-bar">
            {genders.map(g => (
              <button key={g} className={`filter-pill${activeGender === g ? ' active' : ''}`} onClick={() => setActiveGender(g)}>{g}</button>
            ))}
            {categories.filter(c => c !== 'All').map(c => (
              <button key={c} className={`filter-pill${activeCategory === c ? ' active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
          </div>

          {error && <div className="state-msg error">Failed to load: {error}</div>}

          <div className="product-grid fade-in" ref={gridFadeRef}>
            {loading
              ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
              : gridProducts.length === 0
                ? <p className="state-msg">No products in this category.</p>
                : gridProducts.map(p => (
                    <ProductCard key={p.id} product={p} onShowDetails={() => setSelected(p)} />
                  ))
            }
          </div>
        </div>
      </div>

      <RecentlyViewed />

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
