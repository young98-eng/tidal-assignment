import { useState } from 'react';
import { Link } from 'react-router-dom';

const SOCIAL = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.19-.76 1.22-5.16 1.22-5.16s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.26-.87 3.51-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.11-2.39 3.11-5.22 0-2.15-1.45-3.77-4.08-3.77-2.98 0-4.83 2.22-4.83 4.7 0 .85.25 1.46.64 1.92.18.22.21.3.14.55-.05.17-.16.59-.2.75-.06.25-.26.34-.47.25-1.32-.54-1.93-1.99-1.93-3.62 0-2.69 2.27-5.94 6.77-5.94 3.63 0 6.01 2.64 6.01 5.48 0 3.76-2.09 6.57-5.17 6.57-1.04 0-2.01-.56-2.35-1.19l-.65 2.51c-.22.85-.68 1.71-1.05 2.36.79.24 1.62.37 2.48.37 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.07 8.07 0 004.74 1.51V6.75a4.84 4.84 0 01-.97-.06z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail('');
  };

  return (
    <footer className="site-footer">
      {/* Newsletter banner */}
      <div className="footer-newsletter-banner">
        <div className="footer-newsletter-banner-inner">
          <div className="footer-newsletter-banner-text">
            <h3 className="footer-newsletter-headline">Stay in the edit</h3>
            <p className="footer-newsletter-sub">New drops, style notes, and member-only offers.</p>
          </div>
          {sent ? (
            <p className="footer-newsletter-thanks">✓ You're on the list.</p>
          ) : (
            <form className="footer-newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="footer-newsletter-input"
                required
              />
              <button type="submit" className="footer-newsletter-btn">Subscribe</button>
            </form>
          )}
        </div>
      </div>

      {/* Main columns */}
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Tidal Commerce</Link>
          <p className="footer-tagline">Crafted essentials for everyday living.</p>
          <div className="footer-social">
            {SOCIAL.map(s => (
              <a
                key={s.name}
                href={s.href}
                className="footer-social-link"
                aria-label={s.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Shop</h4>
          <ul className="footer-links">
            <li><Link to="/info/new-arrivals">New Arrivals</Link></li>
            <li><Link to="/?category=Tops">Tops</Link></li>
            <li><Link to="/?category=Bottoms">Bottoms</Link></li>
            <li><Link to="/?category=Shoes">Shoes</Link></li>
            <li><Link to="/?category=Accessories">Accessories</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Discover</h4>
          <ul className="footer-links">
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/info/careers">Careers</Link></li>
            <li><Link to="/info/press">Press</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Help</h4>
          <ul className="footer-links">
            <li><Link to="/info/shipping">Shipping &amp; Returns</Link></li>
            <li><Link to="/info/sizing">Sizing Guide</Link></li>
            <li><Link to="/info/faq">FAQ</Link></li>
            <li><Link to="/info/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-copyright">© 2026 Tidal Commerce · All rights reserved</span>
        <div className="footer-payments">
          {['VISA', 'MC', 'PayPal', '⌘Pay', 'GPay'].map(p => (
            <span key={p} className="payment-chip">{p}</span>
          ))}
        </div>
        <div className="footer-bottom-links">
          <Link to="/about">About</Link>
          <Link to="/collections">Collections</Link>
        </div>
      </div>
    </footer>
  );
}
