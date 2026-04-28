const ENDPOINT = 'https://demostore.mock.shop/api/2026-04/graphql.json';

// In-memory cache to avoid redundant fetches on navigation
const cache = new Map();

async function shopifyFetch(query, variables = {}) {
  const key = JSON.stringify({ query, variables });
  if (cache.has(key)) return cache.get(key);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  cache.set(key, json.data);
  return json.data;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id title handle description
          productType
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          featuredImage { url altText }
          images(first: 20) {
            edges { node { url altText } }
          }
          options { name values }
          variants(first: 30) {
            edges {
              node {
                id title availableForSale
                price { amount currencyCode }
                selectedOptions { name value }
                image { url altText }
              }
            }
          }
        }
      }
    }
  }
`;

function normalize(node) {
  const rawType = node.productType || '';
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    productType: rawType.includes('=') ? '' : rawType,
    tags: (node.tags || []).filter(t => !t.includes('=')),
    price: node.priceRange.minVariantPrice,
    maxPrice: node.priceRange.maxVariantPrice,
    hasMultiplePrices:
      node.priceRange.minVariantPrice.amount !== node.priceRange.maxVariantPrice.amount,
    featuredImage: node.featuredImage,
    images: node.images.edges.map(({ node: n }) => n),
    options: node.options,
    variants: node.variants.edges.map(({ node: n }) => n),
  };
}

function getBaseTitle(title) {
  // Strips color suffixes: " - Black", " — Navy Blue", " in Jam", " in Clay", etc.
  return title.replace(/\s*([-—–|]\s*|\bin\s+)[A-Z][a-zA-Z]+(\s+[A-Z][a-zA-Z]+){0,2}\s*$/, '').trim();
}

function deduplicateByTitle(products) {
  const groups = new Map();
  for (const p of products) {
    const base = getBaseTitle(p.title);
    if (!groups.has(base)) {
      groups.set(base, {
        ...p,
        title: base,
        images: [...p.images],
        variants: [...p.variants],
        options: (p.options || []).map(o => ({ ...o, values: [...o.values] })),
      });
    } else {
      const m = groups.get(base);
      const seenUrls = new Set(m.images.map(i => i.url));
      p.images.forEach(img => { if (!seenUrls.has(img.url)) m.images.push(img); });
      m.variants.push(...p.variants);
      const colorOpt = m.options.find(o => o.name.toLowerCase() === 'color');
      const newColorOpt = p.options?.find(o => o.name.toLowerCase() === 'color');
      if (colorOpt && newColorOpt) {
        const set = new Set(colorOpt.values);
        newColorOpt.values.forEach(v => set.add(v));
        colorOpt.values = [...set];
      } else if (!colorOpt && newColorOpt) {
        m.options.push({ ...newColorOpt, values: [...newColorOpt.values] });
      }
    }
  }
  return Array.from(groups.values());
}

export async function getProducts(count = 20) {
  const data = await shopifyFetch(PRODUCTS_QUERY, { first: count });
  const normalized = data.products.edges.map(({ node }) => normalize(node));
  return deduplicateByTitle(normalized);
}

export async function getProduct(handle) {
  const all = await getProducts(250);
  const found = all.find(p => p.handle === handle);
  if (found) return found;
  // Deduped products absorb color-variant handles (e.g. "soft-cotton-hoodie-in-clay")
  // Match by stripping the "-in-*" suffix from the requested handle
  const baseHandle = handle.replace(/-in-[a-z]+(-[a-z]+){0,2}$/, '');
  return all.find(p => p.handle === baseHandle || p.handle.startsWith(baseHandle + '-in-')) ?? null;
}

export function formatPrice({ amount, currencyCode }) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
