# Purelane Shopify Architecture

## 1. Overview & Dawn Foundation
This project converts the supplied Purelane HTML prototype into a production-ready Shopify Online Store 2.0 theme. It is built strictly on top of Shopify's reference open-source theme, **Dawn (version 16.0.0)**.

### Architectural Principles
1. **Preserve Dawn Integrity**: Dawn core files (`layout/theme.liquid`, cart snippets, localization files, and settings schemas) remain intact. Purelane features are implemented as isolated, cleanly structured sections, snippets, and assets.
2. **Visual Fidelity**: The prototype design is the visual source of truth. Layouts, fonts (`Outfit` and `Inter`), color tokens, glassmorphic effects, card borders, and micro-interactions match the prototype.
3. **Shopify Native Data First**: Real store products, collections, pricing, images, and inventory drive the storefront. No hardcoded product details or static prices.
4. **Merchant Control**: All five priority sections are merchant-editable via Shopify Online Store 2.0 JSON templates (`templates/index.json`) and section schemas.
5. **Theme Editor Safety**: Sections are safely reorderable, duplicatable, and reload-proof without duplicate listeners or broken global ID selectors.

---

## 2. Directory Structure

```text
purelane-shopify/
│
├── .gitignore
├── README.md
│
├── docs/
│   ├── architecture.md       # High-level architecture, lifecycle, and patterns
│   ├── visual-reference.md   # Design tokens, typography, dimensions, spacing
│   ├── data-model.md         # Shopify data mapping, section schemas, blocks
│   └── decisions.md          # Architectural rationale and prototype adjustments
│
├── reference/
│   └── purelane-homepage.html # Read-only visual prototype
│
└── theme/
    ├── assets/
    │   ├── purelane.css      # Scoped design tokens, typography, glassmorphism, layouts
    │   └── purelane.js       # Section-scoped controllers, marquee, stage slider
    │
    ├── sections/
    │   ├── purelane-hero.liquid
    │   ├── purelane-product-grid.liquid
    │   ├── purelane-combos.liquid
    │   ├── purelane-bundles.liquid
    │   └── purelane-reviews.liquid
    │
    ├── snippets/
    │   ├── purelane-product-card.liquid
    │   ├── purelane-product-image.liquid
    │   ├── purelane-combo-card.liquid
    │   └── purelane-review-card.liquid
    │
    ├── templates/
    │   └── index.json        # OS 2.0 homepage section configuration
    │
    └── ... (standard Dawn theme files preserved)
```

---

## 3. Section Architecture & Responsibilities

### 1. `purelane-hero.liquid`
- **Scope**: Homepage hero banner (`.hero`).
- **Features**:
  - Brand heading (`.d1`) with accent color highlight, decorative divider (`.rule`), lede text, and primary/ghost CTAs.
  - Value proposition badges (`.badges` for desktop, `.badgestrip` for mobile).
  - Dynamic Hero Product Stage (`.hstage`): 1 -> 2 -> 3 product interactive visual with glassmorphic price tag (`.ptag`) showing dynamic discount calculations and stage dots (`.hdots`).
  - Scoped controls supporting automated slide cycling, manual dot clicks, and pause on hover.
- **Data Source**: Section settings (copy, badges, links) and product picker blocks (products, override discount text).

### 2. `purelane-product-grid.liquid`
- **Scope**: Bestseller product shelf (`#shop`).
- **Features**:
  - Section header with kicker, `h2`, and decorative divider.
  - Responsive 4-column desktop / 2-column mobile card shelf (`.shelf`).
  - Product cards displaying featured product image, badges (e.g., "Best seller", "Top rated", "New"), titles, review ratings, compare-at and current prices with discount pill, and quick "Add to cart" CTA.
  - Graceful handling of missing product images, long product titles, and sold-out states.
- **Data Source**: Shopify Collection selector (or manual product list) via section settings.

### 3. `purelane-combos.liquid`
- **Scope**: Curated multi-product combos (`#combos`).
- **Features**:
  - Horizontal touch-enabled scroll-snap rail (`.comborail`).
  - Combo cards with upper product stack tray (`.stack` with `+` connectors, savings pill, highlight flag).
  - Card body containing combo title, item count, included products summary, price row with savings badge, tax note, and "Shop bundle" CTA.
  - Special highlight styling (`.hero-combo`) for featured bundles.
  - Touch swipe cue for mobile devices.
- **Data Source**: Section blocks where each block configures a combo (title, product selections, promotional bundle price, compare price, custom badges).

### 4. `purelane-bundles.liquid`
- **Scope**: Tiered bundle box builder (`#bundles`).
- **Features**:
  - 3-tier grid (`.tiers`) comparing Starter, Most Popular, and Whole Home box configurations.
  - Highlights product quantity (`.qty`), tier price, per-unit price breakdown, and bulleted perk list with accent checkmarks.
  - Recommended tier highlighting (`.tier.best`) with gold/accent rim and glassmorphism.
- **Data Source**: Section blocks for each tier (product count, bundle price, compare-at price, per-item note, benefit bullets, CTA link).

### 5. `purelane-reviews.liquid`
- **Scope**: Customer review rail (`#reviews`).
- **Features**:
  - Section header with kicker, aggregate star rating ("★ 4.8 from 8,000+ reviews"), and social proof proofpoint.
  - Infinite auto-scrolling marquee (`.revrail` and `.revtrack`) with pause on hover/focus.
  - Review cards (`.rcard`) displaying 5-star rating, headline, testimonial text, and verified buyer badge with purchased product context.
- **Data Source**: Section settings (aggregate score, count) and review blocks (reviewer name, product, quote, headline, rating).

---

## 4. Reusable Snippet Strategy

1. **`purelane-product-card.liquid`**:
   - Encapsulates individual product card layout for the product grid.
   - Handles product URL, image rendering, badge calculation, localized price formatting (`{{ product.price | money }}`), compare price logic, review snippet, and AJAX add-to-cart form.
2. **`purelane-product-image.liquid`**:
   - Standardized responsive image wrapper with proper `aspect-ratio`, `srcset`, `sizes`, `loading="lazy"`, and SVG placeholder fallback when a product has no image assigned.
3. **`purelane-combo-card.liquid`**:
   - Reusable card component for combo items within `.comborail`, handling the product tray stack, price math, and bundle CTA.
4. **`purelane-review-card.liquid`**:
   - Standardized review bubble component used within the marquee track.

---

## 5. Theme Editor Lifecycle & Safety

### Challenges in Shopify Theme Editor
In the Shopify Theme Editor, sections can be added, deleted, reordered, or edited at any time. Standard script tags with global IDs (`document.getElementById('hstage')`) break because:
- Multiple instances of a section may exist on a page or template.
- The Theme Editor re-renders sections by replacing their DOM node without a full page reload (`shopify:section:load` event).
- Global event listeners attached to `window` or `document` leak memory and trigger duplicate executions.

### Purelane Scoped Controller Architecture
To ensure complete safety:
1. **Section Scoping**: JavaScript behaviors are either encapsulated in standard Web Components (`customElements.define('purelane-hero', ...)`), or scoped using `data-section-id` container wrappers:
   ```javascript
   class PurelaneHero extends HTMLElement {
     connectedCallback() {
       this.initStage();
     }
     disconnectedCallback() {
       this.teardown();
     }
     // ...
   }
   ```
2. **Shopify Section Event Listeners**:
   ```javascript
   document.addEventListener('shopify:section:load', (event) => {
     // Re-initialize only the loaded section target
     initSection(event.target);
   });
   document.addEventListener('shopify:section:unload', (event) => {
     // Clean up timers and observers for the target
     teardownSection(event.target);
   });
   ```
3. **No Unique Global ID Selectors for Script Execution**:
   Component queries use class names and relative selectors (`this.querySelectorAll('.hslide')`) rather than hardcoded global IDs.

---

## 6. Animation & Interaction Architecture

1. **Scroll Reveals (`.rv`)**:
   - Handled via `IntersectionObserver` observing `.rv` elements within sections.
   - Adds the `.in` class with smooth staggered CSS transitions (`--ease: cubic-bezier(.2,.7,.2,1)`).
   - Instant reveal when `prefers-reduced-motion` is active.
2. **Continuous Reviews Marquee (`.revrail`)**:
   - Smooth GPU-accelerated CSS keyframe transform (`translate3d(0,0,0)` to `translate3d(-50%,0,0)`).
   - Automatically pauses on hover (`:hover`) and keyboard focus (`:focus-within`) for accessibility.
3. **Hero Product Stage Slider (`.hstage`)**:
   - Timed automatic carousel (3800ms) with interactive dot navigation.
   - Utilizes `IntersectionObserver` so timer only runs while the hero is visible on screen, conserving CPU and battery.
   - Stops immediately on mouseenter or touch start.
4. **Reduced Motion Compliance**:
   - Global media query `@media (prefers-reduced-motion: reduce)` disables continuous animations, marquee loops, and parallax transforms while ensuring all content is immediately fully visible.

---

## 7. Performance & Optimization Strategy

1. **Asset Optimization**:
   - Consolidated `purelane.css` loaded asynchronously or linked in layout header with `media="all"`.
   - Vanilla JavaScript in `purelane.js` deferred (`defer="defer"`), zero third-party framework overhead.
2. **Image Loading Strategy**:
   - Hero images load eagerly (`loading="eager"`, `fetchpriority="high"`) to optimize Largest Contentful Paint (LCP).
   - Below-the-fold product images, combo stacks, and tier thumbnails load lazily (`loading="lazy"`).
   - Responsive `srcset` generated via Shopify's Liquid image filters (`image_url: width: ...`).
3. **Layout Shift Prevention**:
   - Strict CSS aspect ratios (`aspect-ratio: ...`) and explicit dimension attributes on all images and containers prevent Cumulative Layout Shift (CLS).

---

## 8. Accessibility Strategy

1. **Semantic Hierarchy**: Single `<h1>` tag in Hero; descriptive `<h2>` headings for each section; `<h3>` headings for product/combo cards; `<article>` containers for cards.
2. **Keyboard Navigation & Visible Focus**:
   - Custom `:focus-visible` styling (`outline: 2px solid var(--accent); outline-offset: 3px;`).
   - All interactive controls (buttons, slide dots, links) are keyboard focusable (`<button type="button">`, `<a href="...">`).
3. **Accessible Labels**:
   - SVG decorative icons tagged with `aria-hidden="true"`.
   - Actionable buttons and slide controls have descriptive `aria-label` attributes (e.g. `aria-label="Show 2 products"`).
4. **Contrast**:
   - Tested against WCAG AA standards using dark text on light glass containers (`--surface: #17102b`, `--paper: #241a3d` on `--ink: #f4f0fb` and `--surface: #faf7fd` on dark buttons).
