import { Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ProductListPage from './components/ProductListPage.jsx';
import ProductDetailPage from './components/ProductDetailPage.jsx';

function Header() {
  const { count, setIsOpen } = useCart();
  return (
    <header className="site-header">
      <Link to="/" className="site-logo">Tidal Commerce</Link>
      <button className="cart-btn" onClick={() => setIsOpen(true)} aria-label="Open cart">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>
    </header>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:handle" element={<ProductDetailPage />} />
        </Routes>
      </main>
      <CartDrawer />
    </CartProvider>
  );
}
