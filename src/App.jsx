import { Routes, Route, Link } from 'react-router-dom';
import ProductListPage from './components/ProductListPage.jsx';
import ProductDetailPage from './components/ProductDetailPage.jsx';

export default function App() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-logo">Tidal Commerce</Link>
      </header>
      <main className="site-main">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:handle" element={<ProductDetailPage />} />
        </Routes>
      </main>
    </>
  );
}
