import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CartToast from './components/CartToast.jsx';
import Footer from './components/Footer.jsx';
import ProductListPage from './components/ProductListPage.jsx';
import ProductDetailPage from './components/ProductDetailPage.jsx';

function Header() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="announcement-bar">Free shipping on orders over $75 · Free returns · Secure checkout</div>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <nav className="header-nav">
          <Link to="/">Shop</Link>
          <Link to="/">Collections</Link>
          <Link to="/">About</Link>
        </nav>
        <Link to="/" className="site-logo">
          <span className="logo-wordmark">Tidal</span>
          <span className="logo-sub">Est. 2026 · Crafted Essentials</span>
        </Link>
        <div className="header-actions">
          <button className="cart-btn" onClick={() => setIsOpen(true)} aria-label="Open cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </header>
    </>
  );
}

function PageTransition({ children }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [location.pathname]);

  return <div className={`page-transition${visible ? ' page-visible' : ''}`}>{children}</div>;
}

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main className="site-main">
        <PageTransition>
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/products/:handle" element={<ProductDetailPage />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <CartToast />
    </CartProvider>
  );
}
