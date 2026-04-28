# Tidal - Crafted Essentials

A fashion e-commerce storefront built with React + Vite, powered by the Shopify Storefront GraphQL API.

## Features

**Product Listing**
- Editorial hero banner + bento-grid layout
- Responsive product grid with skeleton loading states
- Sidebar filters: gender, category, price range slider
- Sort by: Featured, Price (low/high), Name (A–Z / Z–A)
- Color arrow buttons (◀▶) on cards to preview all colorways
- Hover cross-fade to alternate product angle (where available)
- Quick View modal with full variant selection and image gallery
- Recently Viewed row

**Product Detail Page**
- Full-screen image gallery with Amazon-style zoom lens
- Color swatch selector — images update per selected color
- Size selector with out-of-stock indication
- Quantity picker + Add to Bag
- Share button (Web Share API / clipboard fallback)
- Wishlist toggle
- Related Products + Recently Viewed

**Cart**
- Slide-out cart drawer
- Quantity editing and item removal
- Persisted to localStorage across sessions
- Toast notification on add

**Wishlist**
- Heart toggle on every card and detail page
- Dedicated `/wishlist` page
- Persisted to localStorage

**Navigation & UX**
- React Router v6 — Shop, Collections, About, Info pages
- Search overlay
- Announcement bar + sticky header with scroll effect
- Page transition fade-in
- Back to Top button
- 404 page

## Tech Stack

- React 18 + React Router v6
- Vite
- Vanilla CSS (no UI libraries)
- Shopify Storefront GraphQL API (`demostore.mock.shop`)

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173` (or the port Vite assigns if 5173 is in use).

## API

```
https://demostore.mock.shop/api/2026-04/graphql.json
```

No access token required for this demo store.

## Project Structure

```
src/
├── api/
│   └── shopify.js              # GraphQL client, queries, dedup, price formatter
├── components/
│   ├── ProductListPage.jsx     # Shop page — grid, filters, hero, bento
│   ├── ProductCard.jsx         # Card with color arrows + hover swap
│   ├── ProductModal.jsx        # Quick View modal
│   ├── ProductDetailPage.jsx   # Full PDP with zoom + color-image matching
│   ├── ImageSlider.jsx         # Thumbnail slider
│   ├── CartDrawer.jsx          # Slide-out cart
│   ├── CartToast.jsx           # Add-to-cart toast
│   ├── WishlistPage.jsx        # Saved items page
│   ├── CollectionsPage.jsx     # Collections overview
│   ├── AboutPage.jsx           # Brand story page
│   ├── InfoPage.jsx            # Info / policy pages
│   ├── SearchOverlay.jsx       # Full-screen search
│   ├── RecentlyViewed.jsx      # Horizontal scroll row
│   ├── SkeletonCard.jsx        # Loading placeholder
│   ├── QuantityPicker.jsx      # +/− quantity control
│   ├── Footer.jsx              # Site footer
│   └── BackToTop.jsx           # Scroll-to-top button
├── context/
│   └── CartContext.jsx         # Cart state + localStorage persistence
├── hooks/
│   └── useScrollFadeIn.js      # IntersectionObserver fade-in hook
└── utils/
    ├── colors.js               # Color name → hex mapping
    ├── imageUrl.js             # CDN resizing + per-color image grouping
    ├── recentlyViewed.js       # localStorage recently viewed
    └── wishlist.js             # localStorage wishlist hook
```
