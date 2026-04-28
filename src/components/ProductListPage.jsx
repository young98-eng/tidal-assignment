import { useState, useEffect } from 'react';
import { getProducts } from '../api/shopify.js';
import ProductCard from './ProductCard.jsx';
import ProductModal from './ProductModal.jsx';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getProducts(12)
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state-msg">Loading products…</div>;
  if (error) return <div className="state-msg error">Failed to load products: {error}</div>;
  if (!products.length) return <div className="state-msg">No products found.</div>;

  return (
    <section className="product-list-page">
      <h1 className="page-title">All Products</h1>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onShowDetails={() => setSelected(p)} />
        ))}
      </div>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
