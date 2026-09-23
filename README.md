# Purelane Shopify

## Project
Purelane is a plant-based homecare brand offering non-toxic cleaning essentials across India. This project converts the supplied Purelane HTML visual prototype into a production-quality Shopify Online Store 2.0 homepage built upon a clean, current Shopify Dawn theme foundation (v16.0.0). It accurately reproduces the prototype design while delivering native Shopify product integration, merchant-editable section schemas, robust theme editor safety, high performance, and accessibility.

## Stack
- Shopify
- Dawn (v16.0.0)
- Liquid
- HTML
- CSS
- JavaScript
- Shopify Online Store 2.0

## Priority Sections
1. **Hero (`.hero`)** — Brand statement, value proposition badges, interactive 1/2/3 stage product showcase with dynamic price tag flag and slide controls.
2. **Shop / Product Grid (`#shop`)** — Native Shopify product collection grid with responsive shelf layout, custom badges, live pricing/compare pricing, ratings, and add-to-cart integration.
3. **Best-selling Combos (`#combos`)** — Horizontal touch-enabled scroll rail presenting curated multi-product bundles, bottle stack visuals, savings highlights, and quick bundle CTAs.
4. **Bundles (`#bundles`)** — Multi-tier bundle box builder cards (Starter, Most Popular, Whole Home) highlighting product quantities, unit pricing economics, and tiered perks.
5. **Reviews Rail (`#reviews`)** — Auto-scrolling customer review marquee featuring verified customer testimonials, star ratings, aggregate statistics, and pause-on-hover interaction.

## Development
To run and preview the theme locally using Shopify CLI:

1. Ensure [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) is installed and authenticated:
   ```bash
   shopify theme dev --store your-store.myshopify.com --path ./theme
   ```
2. The CLI will serve a local development preview at `http://127.0.0.1:9292` with live hot-reloading for Liquid, CSS, and JavaScript.
3. To validate theme syntax and best practices:
   ```bash
   shopify theme check ./theme
   ```

## Architecture
The theme cleanly extends Shopify Dawn without breaking Dawn's native layout or templates:
- **`theme/assets/`**: Scoped styles (`purelane.css`) and modular behaviors (`purelane.js`) alongside Dawn's baseline styles.
- **`theme/sections/`**: Modular Liquid sections for the homepage (`purelane-hero.liquid`, `purelane-product-grid.liquid`, `purelane-combos.liquid`, `purelane-bundles.liquid`, `purelane-reviews.liquid`).
- **`theme/snippets/`**: Reusable card and visual components (`purelane-product-card.liquid`, `purelane-product-image.liquid`, `purelane-combo-card.liquid`, `purelane-review-card.liquid`).
- **`theme/templates/index.json`**: Online Store 2.0 homepage JSON template assembling and ordering sections with merchant configurations.
- **`reference/`**: Houses the read-only visual prototype (`purelane-homepage.html`).
- **`docs/`**: Comprehensive documentation for architecture, visual design tokens, data models, and architectural decisions.

## Data
- **Products & Collections**: Driven dynamically by native Shopify Product and Collection resources (`title`, `price`, `compare_at_price`, `featured_image`, `available`, `url`, `vendor`).
- **Combos & Bundles**: Merchandised via Shopify Theme Editor section blocks, permitting merchants to link products, set custom promotional pricing, alter highlight badges, and modify copy directly without touching code.
- **Customer Reviews**: Curated through customizable Theme Editor blocks with reviewer name, rating stars, quote, and product badge.
