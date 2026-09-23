# Purelane Shopify Data Model

This document outlines the data strategy for translating the Purelane prototype into a dynamic Shopify Online Store 2.0 implementation.

---

## 1. Shopify Data Strategy Principles

1. **Native Shopify Data First**:
   - Product titles, handles, descriptions, pricing, compare-at pricing, featured images, and URLs are sourced directly from Shopify's native `Product` object.
   - Live availability (`product.available`) determines active CTA states.
   - Prices use Shopify's localized currency formatting filter (`{{ product.price | money }}`).
2. **Merchant Editability via Section Settings & Blocks**:
   - Marketing headlines, badge text, promotional discount overrides, and call-to-action destinations are exposed to merchants inside the Shopify Theme Editor.
3. **Avoid Unnecessary Overhead**:
   - Metafields and Metaobjects are evaluated carefully. Where native Shopify features or Section Blocks provide complete flexibility without requiring custom API definitions or private app scopes, section blocks are prioritized for homepage configuration.

---

## 2. Evaluation of Custom Data Options

| Mechanism | Suitability for Purelane Homepage | Rationale |
| :--- | :--- | :--- |
| **Native Products & Collections** | **Mandatory** | Standardizes inventory, pricing, checkout, media management, and SEO. |
| **Section Settings** | **Mandatory** | Perfect for global section parameters (headings, kickers, ledes, aggregate review stats, collection pickers). |
| **Section Blocks** | **Mandatory & Optimal** | Allows merchants to add, remove, and reorder combo cards, bundle tiers, review testimonials, and hero stage slides directly in the Theme Editor sidebar without leaving the visual preview. |
| **Product Metafields** | Optional / Secondary | Useful if product-specific benefit tags (e.g. "Cuts grease instantly") or custom bottle silhouette assets need to be shared across PDPs and homepages. |
| **Metaobjects** | Over-engineered for initial Phase | Creating metaobject definitions adds external setup steps for merchants in the Shopify Admin. Blocks achieve identical rendering with higher immediacy and zero barrier to entry. |

---

## 3. Section Schema & Block Specifications

### 1. Hero (`purelane-hero.liquid`)

```json
{
  "name": "Purelane Hero",
  "settings": [
    {
      "type": "text",
      "id": "heading_line1",
      "label": "Heading Line 1",
      "default": "Clean"
    },
    {
      "type": "text",
      "id": "heading_line2",
      "label": "Heading Line 2",
      "default": "That"
    },
    {
      "type": "text",
      "id": "heading_accent",
      "label": "Heading Accent Word",
      "default": "Lasts"
    },
    {
      "type": "textarea",
      "id": "lede",
      "label": "Lede Copy",
      "default": "Homecare that works on the toughest grime, made from plants. Kind to your home, your family and the world outside it."
    },
    {
      "type": "text",
      "id": "primary_cta_label",
      "label": "Primary Button Label",
      "default": "Shop now"
    },
    {
      "type": "url",
      "id": "primary_cta_link",
      "label": "Primary Button Link"
    },
    {
      "type": "text",
      "id": "secondary_cta_label",
      "label": "Secondary Button Label",
      "default": "How it works"
    },
    {
      "type": "url",
      "id": "secondary_cta_link",
      "label": "Secondary Button Link"
    }
  ],
  "blocks": [
    {
      "type": "badge",
      "name": "Hero Badge",
      "limit": 3,
      "settings": [
        {
          "type": "select",
          "id": "icon",
          "label": "Badge Icon",
          "options": [
            { "value": "leaf", "label": "Leaf (Plant powered)" },
            { "value": "shield", "label": "Shield (Kids & pet safe)" },
            { "value": "ban", "label": "No Chemicals (Zero harsh chem)" }
          ],
          "default": "leaf"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Badge Text",
          "default": "Plant powered"
        }
      ]
    },
    {
      "type": "stage_slide",
      "name": "Stage Slide",
      "limit": 3,
      "settings": [
        {
          "type": "text",
          "id": "label",
          "label": "Price Tag Label",
          "default": "Single bottle"
        },
        {
          "type": "product_list",
          "id": "products",
          "label": "Showcase Products (1 to 3)",
          "limit": 3
        },
        {
          "type": "text",
          "id": "custom_price",
          "label": "Bundle / Override Price",
          "info": "Leave blank to derive from product price sum"
        },
        {
          "type": "text",
          "id": "custom_compare_price",
          "label": "Compare Price"
        },
        {
          "type": "text",
          "id": "discount_badge",
          "label": "Discount Tag Text",
          "default": "33% off"
        }
      ]
    }
  ]
}
```

---

### 2. Shop / Product Grid (`purelane-product-grid.liquid`)

```json
{
  "name": "Purelane Product Grid",
  "settings": [
    {
      "type": "text",
      "id": "kicker",
      "label": "Kicker",
      "default": "Bestsellers"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Loved by 30,000 homes"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    },
    {
      "type": "range",
      "id": "products_to_show",
      "min": 4,
      "max": 12,
      "step": 2,
      "default": 8,
      "label": "Number of products to show"
    }
  ],
  "blocks": [
    {
      "type": "product_badge",
      "name": "Custom Product Badge",
      "settings": [
        {
          "type": "product",
          "id": "product",
          "label": "Product"
        },
        {
          "type": "text",
          "id": "badge_text",
          "label": "Badge Text",
          "default": "Best seller"
        }
      ]
    }
  ]
}
```

---

### 3. Best-Selling Combos (`purelane-combos.liquid`)

```json
{
  "name": "Purelane Combos",
  "settings": [
    {
      "type": "text",
      "id": "kicker",
      "label": "Kicker",
      "default": "Pre-built to save you money"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Best selling combos"
    },
    {
      "type": "textarea",
      "id": "lede",
      "label": "Lede Copy",
      "default": "Swipe through the boxes people order most. Each one is already priced below buying the same products on their own."
    },
    {
      "type": "text",
      "id": "footnote",
      "label": "Footnote",
      "default": "Tapping 'Shop bundle' opens the bundle picker with these products already added. You can still swap anything before you pay."
    }
  ],
  "blocks": [
    {
      "type": "combo",
      "name": "Combo Card",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Combo Name",
          "default": "Kitchen essentials"
        },
        {
          "type": "checkbox",
          "id": "is_hero",
          "label": "Highlight as Hero/Best Value Combo",
          "default": false
        },
        {
          "type": "text",
          "id": "savings_badge",
          "label": "Savings Header Badge",
          "default": "You save ₹398"
        },
        {
          "type": "text",
          "id": "flag_badge",
          "label": "Special Flag (e.g. Most popular / Best value)"
        },
        {
          "type": "product_list",
          "id": "products",
          "label": "Included Products",
          "limit": 5
        },
        {
          "type": "text",
          "id": "product_count_label",
          "label": "Count Label",
          "default": "3 products"
        },
        {
          "type": "textarea",
          "id": "included_description",
          "label": "Includes Description",
          "default": "Includes: Foaming Kitchen Cleaner, Dishwash Gel & Tap Cleaner. Everything for a sparkling kitchen, no need to pick separately."
        },
        {
          "type": "text",
          "id": "price",
          "label": "Combo Price",
          "default": "₹499"
        },
        {
          "type": "text",
          "id": "compare_price",
          "label": "Compare Price",
          "default": "₹897"
        },
        {
          "type": "text",
          "id": "savings_tag",
          "label": "Savings Tag Text",
          "default": "Save ₹398"
        },
        {
          "type": "text",
          "id": "tax_note",
          "label": "Tax/COD Note",
          "default": "Inclusive of all taxes · COD available"
        },
        {
          "type": "url",
          "id": "bundle_link",
          "label": "Bundle Link"
        }
      ]
    }
  ]
}
```

---

### 4. Bundles (`purelane-bundles.liquid`)

```json
{
  "name": "Purelane Bundles",
  "settings": [
    {
      "type": "text",
      "id": "kicker",
      "label": "Kicker",
      "default": "Build your bundle"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "One box. Every room."
    },
    {
      "type": "textarea",
      "id": "lede",
      "label": "Lede Copy",
      "default": "Mix and match across kitchen, laundry, home and skin. One flat price, no code needed, free shipping either way."
    }
  ],
  "blocks": [
    {
      "type": "tier",
      "name": "Bundle Tier",
      "limit": 3,
      "settings": [
        {
          "type": "text",
          "id": "tag",
          "label": "Tier Tag",
          "default": "Starter"
        },
        {
          "type": "checkbox",
          "id": "is_best",
          "label": "Highlight as Most Popular",
          "default": false
        },
        {
          "type": "number",
          "id": "qty_number",
          "label": "Product Quantity Number",
          "default": 2
        },
        {
          "type": "text",
          "id": "qty_unit",
          "label": "Product Quantity Label",
          "default": "Products"
        },
        {
          "type": "text",
          "id": "price",
          "label": "Bundle Price",
          "default": "₹349"
        },
        {
          "type": "text",
          "id": "compare_price",
          "label": "Compare Price",
          "default": "₹598"
        },
        {
          "type": "text",
          "id": "per_item_note",
          "label": "Per Item Note",
          "default": "Flat ₹174 per product"
        },
        {
          "type": "textarea",
          "id": "perks",
          "label": "Perks (one per line)",
          "default": "Pick any two products\nFree shipping across India"
        },
        {
          "type": "text",
          "id": "cta_label",
          "label": "Button Label",
          "default": "Build this box"
        },
        {
          "type": "url",
          "id": "cta_link",
          "label": "Button Link"
        }
      ]
    }
  ]
}
```

---

### 5. Reviews Rail (`purelane-reviews.liquid`)

```json
{
  "name": "Purelane Reviews",
  "settings": [
    {
      "type": "text",
      "id": "kicker",
      "label": "Kicker",
      "default": "That's what they said"
    },
    {
      "type": "text",
      "id": "aggregate_stars",
      "label": "Aggregate Stars Text",
      "default": "★★★★★"
    },
    {
      "type": "text",
      "id": "aggregate_score",
      "label": "Aggregate Score",
      "default": "4.8"
    },
    {
      "type": "text",
      "id": "reviews_count_text",
      "label": "Reviews Count Text",
      "default": "from 8,000+ reviews"
    },
    {
      "type": "text",
      "id": "social_proof",
      "label": "Social Proof Text",
      "default": "Loved by 12 lakh+ homes"
    }
  ],
  "blocks": [
    {
      "type": "review",
      "name": "Review Card",
      "settings": [
        {
          "type": "text",
          "id": "stars",
          "label": "Stars",
          "default": "★★★★★"
        },
        {
          "type": "text",
          "id": "headline",
          "label": "Review Headline",
          "default": "Works like a charm"
        },
        {
          "type": "textarea",
          "id": "quote",
          "label": "Review Testimonial",
          "default": "Finally an eco option that cleans as well as the chemical detergent I used for years, and it smells better."
        },
        {
          "type": "text",
          "id": "author",
          "label": "Author Name",
          "default": "Anita"
        },
        {
          "type": "text",
          "id": "product_name",
          "label": "Product Purchased",
          "default": "Laundry detergent"
        }
      ]
    }
  ]
}
```

---

## 4. Metafields Proposal (For Store-Wide Expansion)

Should the merchant choose to configure product benefits globally across PDPs and collections in the future, the following standard Shopify Metafield namespace is recommended:

- **Namespace**: `purelane`
- **Keys**:
  - `purelane.benefit_subtitle` (Single line text): e.g. "Cuts grease instantly"
  - `purelane.rating_score` (Decimal): e.g. `4.8`
  - `purelane.rating_count` (Integer): e.g. `237`
  - `purelane.badge_label` (Single line text): e.g. "Best seller"
