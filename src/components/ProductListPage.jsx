import { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, formatPrice } from '../api/shopify.js';
import { colorToHex } from '../utils/colors.js';
import { resized } from '../utils/imageUrl.js';
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
        {img && <img src={resized(img.url, 1200)} alt={product.title} className="hero-img" />}
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

function BentoRow({ products }) {
  const fadeRef = useScrollFadeIn();
  if (products.length < 2) return null;
  const [main, ...rest] = products.slice(0, 3);
  const mainImg = main.featuredImage || main.images?.[0];
  const mainPrice = main.hasMultiplePrices ? `From ${formatPrice(main.price)}` : formatPrice(main.price);

  return (
    <div className="bento-row fade-in" ref={fadeRef}>
      <Link to={`/products/${main.handle}`} className="bento-feature">
        <div className="bento-feature-img-wrap">
          {mainImg && <img src={resized(mainImg.url, 700)} alt={main.title} className="bento-img" loading="lazy" />}
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
                {img && <img src={resized(img.url, 700)} alt={p.title} className="bento-img" loading="lazy" />}
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
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(500);
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

  const priceMax = useMemo(() => {
    if (!enriched.length) return 500;
    return Math.ceil(Math.max(...enriched.map(p => parseFloat(p.price.amount))));
  }, [enriched]);

  useEffect(() => {
    if (priceMax > 0) setMaxPrice(priceMax);
  }, [priceMax]);

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

  const [priceFilter, setPriceFilter] = useState(500);
  const effectiveMax = priceMax || 500;
  const deferredPriceFilter = useDeferredValue(priceFilter);

  const filtered = useMemo(() => {
    let result = enriched.filter(p =>
      (activeCategory === 'All' || p._category === activeCategory) &&
      (activeGender === 'All' || p._gender === activeGender) &&
      parseFloat(p.price.amount) <= deferredPriceFilter
    );

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount));
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => parseFloat(b.price.amount) - parseFloat(a.price.amount));
    else if (sortBy === 'name-az') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'name-za') result = [...result].sort((a, b) => b.title.localeCompare(a.title));

    return result;
  }, [enriched, activeCategory, activeGender, sortBy, deferredPriceFilter]);

  const isFiltered = activeCategory !== 'All' || activeGender !== 'All' || priceFilter < effectiveMax;

  const clearFilters = () => {
    setActiveCategory('All');
    setActiveGender('All');
    setPriceFilter(effectiveMax);
    setSortBy('featured');
  };

  const heroProduct = products[0] || null;
  const bentoProducts = products.slice(1, 4);

  return (
    <section className="product-list-page">
      {!loading && heroProduct && <EditorialHero product={heroProduct} />}
      {!loading && <BentoRow products={bentoProducts} />}

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

          <div className="filter-sidebar-section">
            <h3 className="filter-sidebar-title">
              Price — <span className="price-range-label">up to {formatPrice({ amount: String(priceFilter), currencyCode: 'CAD' })}</span>
            </h3>
            <input
              type="range"
              min={0}
              max={effectiveMax}
              step={5}
              value={priceFilter}
              onChange={e => setPriceFilter(Number(e.target.value))}
              className="price-range-slider"
              aria-label="Maximum price"
            />
            <div className="price-range-bounds">
              <span>$0</span>
              <span>{formatPrice({ amount: String(effectiveMax), currencyCode: 'CAD' })}</span>
            </div>
          </div>

          {isFiltered && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              ✕ Clear filters
            </button>
          )}
        </aside>

        <div className="shop-grid-area">
          <div className="shop-grid-header">
            <span className="shop-grid-title">
              {activeCategory === 'All' && activeGender === 'All'
                ? 'All Products'
                : `${activeGender !== 'All' ? activeGender + ' · ' : ''}${activeCategory}`}
              {!loading && <span className="product-count"> &nbsp;·&nbsp; {filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>}
            </span>

            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-az">Name: A–Z</option>
              <option value="name-za">Name: Z–A</option>
            </select>
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
              : filtered.length === 0
                ? (
                  <div className="empty-state">
                    <p className="empty-state-text">No products match your filters.</p>
                    <button className="btn-primary empty-state-btn" onClick={clearFilters}>Clear Filters</button>
                  </div>
                )
                : filtered.map(p => (
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
