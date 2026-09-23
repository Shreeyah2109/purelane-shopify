# Architectural Decisions & Prototype Adjustments

This document details the genuine technical and structural issues identified during the inspection of `reference/purelane-homepage.html`, and explains the production decisions made to adapt the prototype for Shopify Online Store 2.0.

---

### Decision 1: Transitioning Hardcoded Product Content to Native Shopify Data

- **WHAT**:
  In the prototype, product titles, prices (`₹200`, `₹499`, etc.), compare-at prices, ratings, and savings calculations are hardcoded static strings inside static HTML cards. In production, these values are populated from Shopify `product` objects and localized using `money` filters (`{{ product.price | money }}`).
- **WHY**:
  A production Shopify store cannot rely on hardcoded prices or inventory. Products must pull live pricing, real stock availability (`product.available`), actual currency formatting, and dynamic product URLs (`product.url`) from Shopify's catalog.
- **VISUAL IMPACT**:
  **Identical visual output.** Typography, spacing, color styling, currency symbols, and hierarchy remain visually indistinguishable from the prototype.

---

### Decision 2: Replacing Hardcoded Base64 SVG Visuals with Native Shopify Product Media

- **WHAT**:
  The prototype generates all product bottle images via inline CSS variables (`--p-kbtl`, `--p-tap`, `--p-kitchen`, etc.) containing base64-encoded SVGs with fixed aspect ratios (`.p-kbtl { aspect-ratio: 0.3229 }`), and four cards in `#shop` use inline SVG paths. In production, images will use Shopify's standard `image_tag` or `image_url` filter with responsive `srcset` and `sizes`. A fallback snippet will support the prototype bottle SVGs when a store product lacks an uploaded image.
- **WHY**:
  Merchants manage photography through the Shopify Admin Product media gallery. Relying strictly on hardcoded base64 CSS strings prevents merchants from uploading new product photos, packaging refreshes, or seasonal variants.
- **VISUAL IMPACT**:
  **Identical visual output.** Product shots maintain the exact aspect ratio, bottom-centered alignment, and soft ambient drop shadows (`filter: drop-shadow(0 14px 22px rgba(0,74,66,.15))`).

---

### Decision 3: Eliminating Global JavaScript Selectors for Theme Editor Safety

- **WHAT**:
  The prototype binds behavior globally using fixed DOM IDs: `document.getElementById('hstage')`, `document.getElementById('hdots')`, `document.getElementById('rot')`, and `document.querySelectorAll('.rv')`. In production, script logic is section-scoped using Custom Elements (or scoped via `this.querySelector` within `shopify:section:load` event listeners).
- **WHY**:
  In Shopify Online Store 2.0, merchants can add, remove, and duplicate sections in the Theme Editor. If a merchant duplicates the Hero or Combos section, global ID selectors either select only the first instance or cause script collisions. When the Theme Editor re-renders a section upon setting changes, global listeners can cause memory leaks and duplicate execution.
- **VISUAL IMPACT**:
  **Identical visual output.** All animations, slider interactions, and reveals execute identically, but with complete stability inside the Theme Editor.

---

### Decision 4: Consolidating Two Conflicting CSS Style Blocks into a Single Design System

- **WHAT**:
  The prototype contains two consecutive `<style>` tags: the first establishes a dark mode base palette (lines 12–633), and the second immediately overrides the root tokens and component colors with the "Version 2 - Brand Colours (light)" palette (lines 634–823). In production, these are consolidated into a single clean stylesheet (`assets/purelane.css`).
- **WHY**:
  Serving hundreds of lines of superseded dark-theme CSS rules that are instantly overwritten creates unnecessary stylesheet weight, increases CSS parsing overhead, and complicates merchant theme maintenance.
- **VISUAL IMPACT**:
  **Identical visual output.** The active light-ground palette rendered in the browser is faithfully preserved without redundant CSS rules.

---

### Decision 5: Converting Hardcoded In-Page Fragment Anchors to Merchant-Configurable Links

- **WHAT**:
  All prototype buttons use hardcoded in-page hash links (e.g., `href="#shop"`, `href="#bundles"`, `href="#how"`). In production, CTA buttons use Shopify section settings (`url` and `text` settings) with intelligent default fallbacks to the section IDs.
- **WHY**:
  Merchants frequently need to point "Shop now" or "Build bundle" buttons to dedicated landing pages, collection templates, or third-party bundle builders rather than in-page anchors.
- **VISUAL IMPACT**:
  **Identical visual output.** The buttons look and position identically, with full merchant destination control.

---

### Decision 6: Replacing Hardcoded Duplicate HTML in the Review Marquee with Liquid Duplication

- **WHAT**:
  In the prototype, the 5 review cards inside `.revtrack` are manually copied twice in the static HTML markup to achieve the continuous infinite marquee animation. In production, merchants enter review cards once as section blocks, and Liquid renders the block list twice in the output HTML.
- **WHY**:
  Merchants should only enter a testimonial once. Requiring merchants to maintain two identical copies of every review block creates human error and poor editorial experience.
- **VISUAL IMPACT**:
  **Identical visual output.** The continuous infinite scrolling loop behaves identically.

---

### Decision 7: Adding Robust Fallback States for Out-of-Stock Products and Missing Media

- **WHAT**:
  The prototype assumes all 8 products are in stock, perfectly sized, and always present. In production Liquid, cards detect `product.available == false` to display a disabled "Sold out" CTA, support long titles with graceful truncation/wrapping, and provide a fallback SVG silhouette if a product lacks a featured image.
- **WHY**:
  A production Shopify theme must never render broken layouts or throw errors when a merchant runs out of stock or creates an unpopulated product draft.
- **VISUAL IMPACT**:
  **Identical visual output** for properly configured products; robust, on-brand fallback UI for edge cases.
