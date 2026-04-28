import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../api/shopify.js';
import QuantityPicker from './QuantityPicker.jsx';

export default function CartDrawer() {
  const { items, removeItem, updateQty, count, subtotal, currency, isOpen, setIsOpen } = useCart();

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}
      <aside className={`cart-drawer${isOpen ? ' open' : ''}`}>
        <div className="cart-header">
          <h2>Cart <span className="cart-count-badge">{count}</span></h2>
          <button className="cart-close" onClick={() => setIsOpen(false)} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  {item.image && (
                    <img src={item.image.url} alt={item.title} className="cart-item-img" />
                  )}
                  <div className="cart-item-info">
                    <p className="cart-item-title">{item.title}</p>
                    {item.variantTitle !== 'Default Title' && (
                      <p className="cart-item-variant">{item.variantTitle}</p>
                    )}
                    <p className="cart-item-price">
                      {formatPrice({ amount: (parseFloat(item.price.amount) * item.qty).toFixed(2), currencyCode: item.price.currencyCode })}
                    </p>
                    <div className="cart-item-actions">
                      <QuantityPicker value={item.qty} onChange={(q) => updateQty(item.variantId, q)} />
                      <button className="cart-item-remove" onClick={() => removeItem(item.variantId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>{formatPrice({ amount: subtotal.toFixed(2), currencyCode: currency })}</span>
              </div>
              <p className="cart-shipping-note">Shipping & taxes calculated at checkout</p>
              <button className="btn-primary" onClick={() => alert('Checkout coming soon!')}>
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
