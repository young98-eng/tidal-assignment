const KEY = 'tidal_recently_viewed';
const MAX = 6;

export function addRecentlyViewed(product) {
  try {
    const prev = getRecentlyViewed();
    const filtered = prev.filter(p => p.handle !== product.handle);
    const next = [
      { id: product.id, handle: product.handle, title: product.title, price: product.price, hasMultiplePrices: product.hasMultiplePrices, featuredImage: product.featuredImage || product.images?.[0] || null },
      ...filtered,
    ].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}
