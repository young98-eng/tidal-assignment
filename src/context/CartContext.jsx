import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product, variant, qty) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === variant.id);
      if (existing) {
        return prev.map(i =>
          i.variantId === variant.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, {
        id: `${product.id}-${variant.id}`,
        variantId: variant.id,
        title: product.title,
        variantTitle: variant.title,
        price: variant.price,
        image: product.featuredImage || product.images?.[0] || null,
        qty,
      }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((variantId) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId));
  }, []);

  const updateQty = useCallback((variantId, qty) => {
    if (qty <= 0) { removeItem(variantId); return; }
    setItems(prev => prev.map(i => i.variantId === variantId ? { ...i, qty } : i));
  }, [removeItem]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const currency = items[0]?.price.currencyCode || 'CAD';
  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, count, subtotal, currency, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
