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
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    productType: node.productType || '',
    tags: node.tags || [],
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

export async function getProducts(count = 20) {
  const data = await shopifyFetch(PRODUCTS_QUERY, { first: count });
  return data.products.edges.map(({ node }) => normalize(node));
}

export async function getProduct(handle) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id title handle description productType tags
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        featuredImage { url altText }
        images(first: 20) { edges { node { url altText } } }
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
  `;
  const data = await shopifyFetch(query, { handle });
  return normalize(data.product);
}

export function formatPrice({ amount, currencyCode }) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
