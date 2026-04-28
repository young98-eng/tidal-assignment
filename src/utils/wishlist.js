import { useState, useEffect } from 'react';

const KEY = 'tidal_wishlist';

function getIds() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); }
  catch { return new Set(); }
}

function saveIds(set) {
  try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch {}
}

export function useWishlist(productId) {
  const [liked, setLiked] = useState(() => getIds().has(productId));

  useEffect(() => {
    const handler = () => setLiked(getIds().has(productId));
    window.addEventListener('wishlist-change', handler);
    return () => window.removeEventListener('wishlist-change', handler);
  }, [productId]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ids = getIds();
    ids.has(productId) ? ids.delete(productId) : ids.add(productId);
    saveIds(ids);
    setLiked(ids.has(productId));
    window.dispatchEvent(new Event('wishlist-change'));
  };

  return { liked, toggle };
}
