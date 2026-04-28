const HEX = {
  black: '#111111', white: '#ffffff', red: '#e53935', blue: '#1e88e5',
  green: '#43a047', yellow: '#fdd835', pink: '#e91e8c', purple: '#8e24aa',
  orange: '#fb8c00', gray: '#757575', grey: '#757575', brown: '#6d4c41',
  navy: '#1a2744', ocean: '#006994', teal: '#00897b', coral: '#ff6b6b',
  mint: '#56cfab', sage: '#87ab69', olive: '#6b7c2c', cream: '#f5f0e8',
  ivory: '#fffff0', beige: '#d4b896', sand: '#c2b280', tan: '#c68642',
  khaki: '#c3b091', camel: '#c19a6b', charcoal: '#36454f', slate: '#708090',
  silver: '#a8a9ad', gold: '#c9952c', burgundy: '#800020', maroon: '#800000',
  wine: '#722f37', rose: '#e75480', blush: '#f4a7b9', mauve: '#c9a0dc',
  lavender: '#b57bee', lilac: '#c8a2c8', indigo: '#4b0082', cobalt: '#0047ab',
  sky: '#87ceeb', turquoise: '#40e0d0', aqua: '#00bcd4', emerald: '#50c878',
  forest: '#228b22', hunter: '#355e3b', lime: '#8bc34a', lemon: '#fff176',
  mustard: '#e8a820', amber: '#ffb300', rust: '#b7410e', terracotta: '#e2725b',
  natural: '#e8dcc8', offwhite: '#f8f4ef', ecru: '#c2b280', denim: '#1560bd',
  stone: '#928e85', mocha: '#7c5c4a', espresso: '#4a2c2a', taupe: '#b09a84',
};

export function colorToHex(name) {
  if (!name) return '#cccccc';
  const key = name.toLowerCase().replace(/[\s-_]/g, '');
  return HEX[key] ?? HEX[name.toLowerCase()] ?? null;
}

export function isLightColor(hex) {
  if (!hex) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
