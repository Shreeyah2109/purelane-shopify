# Purelane Shopify Homepage — Build Notes

## Overview

Implemented the Purelane homepage prototype as a Shopify-native Dawn theme while preserving the visual language and structure of the supplied reference.

The implementation uses clean, reusable Liquid sections and snippets rather than hardcoded HTML content.

## Core Sections

The homepage currently includes:

1. Hero
2. Customer Reviews
3. Shop / Product Grid
4. Best Selling Combos
5. One Box. Every Room. / Bundles

Reviews were intentionally positioned directly below the Hero to match the supplied reference.

## Shopify Architecture

The implementation uses Shopify-native data wherever possible:

- Shopify Product objects for individual products and bundle products
- `product_list` settings for product collections inside combos and bundles
- Live product title, price, compare-at price, image, availability and URL
- Theme Editor settings for section content and product selection
- Reusable Liquid snippets for product, combo, bundle and review cards

Fallback values are used only for safe Theme Editor preview states when products have not yet been configured.

## Visual Implementation

The supplied Purelane HTML was treated as the visual reference.

The implementation preserves:

- Purple / teal / green environmental palette
- Glassmorphism surfaces
- Translucent borders
- Soft shadows
- Rounded cards
- Botanical visual language
- Horizontal product/combo rails
- Highlighted promotional cards
- Responsive typography and spacing

The glass system uses translucent surfaces with backdrop blur and saturation rather than generic solid Dawn cards.

## Responsive Behaviour

The homepage was checked across:

- 375px
- 390px
- 768px
- 1024px
- 1440px

Mobile layouts use stacked content where appropriate and horizontal scrolling rails for the Reviews and Combos sections.

## Accessibility

Implemented:

- Semantic section/article structure
- Keyboard focus states
- Keyboard-accessible review rail
- Appropriate hidden/duplicate marquee handling
- Hover/focus pause behaviour
- `prefers-reduced-motion` handling
- Visible focus indicators

## Data and Pricing

Combo and bundle pricing is derived from Shopify product data when configured.

Savings are calculated dynamically from selling price and comparison price/product totals rather than relying on hardcoded production pricing.

## Validation

Validated:

- Theme JSON syntax
- Liquid section schema JSON
- UTF-8 encoding
- BOM detection
- Replacement-character/mojibake detection
- Responsive layouts
- Accessibility behaviour
- Shopify-native data architecture

Shopify CLI / Theme Check was not available in the local environment, so Theme Check was not claimed as completed.

## Development Notes

A temporary Node/Liquid local preview server was used during development for visual verification.

The temporary development server files were removed from the final repository so the submitted repository remains focused on the Shopify theme itself.

Git history was maintained manually with focused implementation commits.
