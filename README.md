# Tidal Commerce — Developer Co-Op Assignment

Product listing and detail page built with React + Vite, using the Shopify Storefront API.

## Features

**Task 1 — Product List**
- Responsive grid of product cards showing image, title, and price
- "Show Details" button opens a modal with full product info, variants, quantity picker, and Add to Cart

**Task 2 — Product Detail Page**
- Click a product image or title to navigate to the full detail page
- Vertical image slider on the left; title, price, description, variants, quantity picker, and Add to Cart on the right

**Bonus — Color Image Filter**
- Clicking a color swatch updates the visible images to only those associated with that color

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

App runs at `http://localhost:5173`.

## API

Data is fetched from:
```
https://demostore.mock.shop/api/2026-04/graphql.json
```

No access token is required for this demo store endpoint.

## Project Structure

```
src/
├── api/
│   └── shopify.js          # GraphQL client + queries + price formatter
└── components/
    ├── ProductListPage.jsx  # Task 1 — product grid + modal trigger
    ├── ProductCard.jsx      # Individual product card
    ├── ProductModal.jsx     # Quick-view modal (Task 1 interaction)
    ├── ProductDetailPage.jsx# Task 2 — full product page
    ├── ImageSlider.jsx      # Vertical image slider with thumbnails
    └── QuantityPicker.jsx   # +/- quantity control
```
