import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function WishlistHeaderBtn() {
  const [count, setCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tidal_wishlist') || '[]').length; } catch { return 0; }
  });

  useEffect(() => {
    const handler = () => {
      try { setCount(JSON.parse(localStorage.getItem('tidal_wishlist') || '[]').length); } catch {}
    };
    window.addEventListener('wishlist-change', handler);
    return () => window.removeEventListener('wishlist-change', handler);
  }, []);

  return (
    <Link to="/wishlist" className="wishlist-header-btn" aria-label={`Wishlist (${count})`}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill={count > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {count > 0 && <span className="wishlist-badge">{count}</span>}
    </Link>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}
import { CartProvider, useCart } from './context/CartContext.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CartToast from './components/CartToast.jsx';
import Footer from './components/Footer.jsx';
import SearchOverlay from './components/SearchOverlay.jsx';
import ProductListPage from './components/ProductListPage.jsx';
import ProductDetailPage from './components/ProductDetailPage.jsx';
import CollectionsPage from './components/CollectionsPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import InfoPage from './components/InfoPage.jsx';
import WishlistPage from './components/WishlistPage.jsx';
import BackToTop from './components/BackToTop.jsx';

function Header() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-active' : ''}>Shop</NavLink>
          <NavLink to="/collections" className={({ isActive }) => isActive ? 'nav-active' : ''}>Collections</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-active' : ''}>About</NavLink>
        </nav>

        <Link to="/" className="site-logo">
          <span className="logo-wordmark">Tidal</span>
          <span className="logo-sub">Est. 2026 · Crafted Essentials</span>
        </Link>

        <div className="header-actions">
          <button className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <WishlistHeaderBtn />
          <button className="cart-btn" onClick={() => setIsOpen(true)} aria-label="Open cart">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <span className="hero-eyebrow">404</span>
      <h1 className="info-headline">Page not found</h1>
      <p className="not-found-sub">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary not-found-btn">Back to Shop →</Link>
    </div>
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
      <ScrollToTop />
      <Header />
      <main className="site-main">
        <PageTransition>
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/products/:handle" element={<ProductDetailPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/info/:slug" element={<InfoPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <CartToast />
      <BackToTop />
    </CartProvider>
  );
}
