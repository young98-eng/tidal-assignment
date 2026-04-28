import { useCart } from '../context/CartContext.jsx';

export default function CartToast() {
  const { toast, setIsOpen } = useCart();

  return (
    <div className={`cart-toast${toast ? ' cart-toast-show' : ''}`}>
      <span className="cart-toast-check">✓</span>
      <span className="cart-toast-msg">Added to bag</span>
      <button className="cart-toast-view" onClick={() => setIsOpen(true)}>
        View bag →
      </button>
    </div>
  );
}
