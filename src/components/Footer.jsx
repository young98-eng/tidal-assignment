import { useState } from 'react';

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
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Tidal Commerce</span>
          <p className="footer-tagline">Crafted essentials for everyday living.</p>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Shop</h4>
          <ul className="footer-links">
            <li><a href="/">New Arrivals</a></li>
            <li><a href="/">Tops</a></li>
            <li><a href="/">Bottoms</a></li>
            <li><a href="/">Accessories</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Help</h4>
          <ul className="footer-links">
            <li><a href="/">Shipping & Returns</a></li>
            <li><a href="/">Sizing Guide</a></li>
            <li><a href="/">FAQ</a></li>
            <li><a href="/">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h4 className="footer-col-title">Stay in the edit</h4>
          <p className="footer-newsletter-copy">New drops, style notes, and member-only offers.</p>
          {sent ? (
            <p className="footer-newsletter-thanks">You're on the list.</p>
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

      <div className="footer-bottom">
        <span>© 2026 Tidal Commerce · All rights reserved</span>
        <span className="footer-bottom-links">
          <a href="/">Privacy</a>
          <a href="/">Terms</a>
        </span>
      </div>
    </footer>
  );
}
