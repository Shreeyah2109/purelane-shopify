# Purelane Visual Reference

This document catalogs the exact design tokens, typography scales, glassmorphism rules, component dimensions, and responsive breakpoints extracted directly from `reference/purelane-homepage.html`.

---

## 1. Color Palette

The prototype defines two sequential `<style>` blocks:
1. An initial dark palette (Lines 13-33).
2. An active **Version 2 - Brand Colours (Light ground)** palette (Lines 634-823), which cascades over the initial styles and represents the actual rendered visual reality of Purelane.

### Active Design Tokens (CSS Variables)

| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `--ink` | `#f4f0fb` | Primary page background ground |
| `--deep` | `#e2daf3` | Secondary muted background depth |
| `--brand` | `#4b3a8f` | Primary brand purple / deep violet |
| `--brand-lt` | `#6b55b8` | Lighter brand purple highlight |
| `--paper` | `#241a3d` | Primary body copy text ink |
| `--paper-2` | `rgba(36, 26, 61, 0.78)` | Secondary body copy / descriptive text |
| `--paper-3` | `rgba(36, 26, 61, 0.56)` | Muted copy, kicker labels, captions |
| `--accent` | `#b8701c` | Active amber / warm gold accent (darkened for light ground) |
| `--accent-2` | `#c9761d` | Leaf / honey accent secondary |
| `--surface` | `#17102b` | High-contrast heading text |

### Glassmorphism & Elevation Tokens

| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `--g-bg` | `linear-gradient(158deg, rgba(255,255,255,.80), rgba(236,230,247,.56) 58%, rgba(222,212,240,.50))` | Primary glass container fill |
| `--g-line` | `rgba(75, 58, 143, 0.16)` | Primary glass border stroke |
| `--g-shadow`| `0 22px 54px rgba(58, 44, 112, 0.13)` | Ambient drop shadow for glass panels |
| `--g-inset` | `inset 0 1px 0 rgba(255, 255, 255, 0.92)` | Top specular reflection highlight |
| `.glass-2` | Background: `linear-gradient(158deg, rgba(255,255,255,.66), rgba(236,230,247,.44))` <br>Border: `1px solid rgba(75,58,143,.13)` <br>Shadow: `0 16px 38px rgba(58,44,112,.10), inset 0 1px 0 rgba(255,255,255,.86)` | Secondary lighter glass cards and chips |

### Button Colors

| Button Class | Styling |
| :--- | :--- |
| `.btn-primary` | Background: `linear-gradient(135deg, #00706a, #004b46)` <br>Color: `#f4fdf6` <br>Shadow: `0 12px 26px rgba(0,80,74,.26), inset 0 1px 0 rgba(255,255,255,.22)` <br>Hover: `transform: translateY(-2px); box-shadow: 0 18px 36px rgba(0,80,74,.32), inset 0 1px 0 rgba(255,255,255,.28)` |
| `.btn-ghost` | Background: `rgba(255, 255, 255, 0.66)` <br>Border: `1px solid rgba(75, 58, 143, 0.22)` <br>Color: `#01423b` <br>Hover: `background: rgba(255, 255, 255, 0.9); transform: translateY(-2px)` |

---

## 2. Typography

Google Fonts used:
- **`Outfit`**: Headings, display banners, kicker typography, pricing digits, card titles.
- **`Inter`**: Body copy, ledes, reviews, meta notes, lists.

### Type Scale

| Class / Role | Font Family | Size | Line Height | Weight | Letter Spacing | Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `.d1` (Hero Heading) | Outfit | `clamp(48px, 8.6vw, 112px)` | `0.87` | 800 | `-0.018em` | UPPERCASE |
| `.d2` (Section Heading) | Outfit | `clamp(30px, 4.6vw, 54px)` | `0.94` | 800 | `-0.018em` | UPPERCASE |
| `.d3` (Card Heading) | Outfit | `clamp(21px, 2.5vw, 30px)` | `1.04` | 700 | `-0.01em` | UPPERCASE |
| `.d4` (Sub-heading) | Outfit | `clamp(16px, 1.6vw, 19px)` | `1.14` | 700 | `+0.005em` | UPPERCASE |
| `.kicker` | Inter / Outfit | `11px` | `1.4` | 700 | `+0.22em` | UPPERCASE |
| `.lede` | Inter | `clamp(15px, 1.35vw, 17.5px)`| `1.62` | 400 | Normal | Sentence |
| `.body-s` | Inter | `14.5px` | `1.66` | 400 | Normal | Sentence |
| Prices (`strong`) | Outfit | `18px` to `27px` | `1.0` | 700 / 800 | `-0.02em` | Normal |

---

## 3. Geometry & Spacing

| Token | Value | Applied To |
| :--- | :--- | :--- |
| `--maxw` | `1180px` | Maximum container width (`.wrap`, `.navpill`, `.hero-grid`) |
| `--sec-y` | `34px` (desktop), `22px` (mobile ≤ 760px) | Vertical rhythm between sections |
| `--r` | `26px` | Large container border-radius (`.glass`, section panels) |
| `--r-sm` | `16px` | Smaller card border-radius |
| Pill Radius | `999px` | Buttons, navigation pill, badges, chips |
| Container Padding | `0 18px` (desktop), `0 14px` (mobile) | Side gutters on `.wrap` |
| Section Padding | `clamp(26px, 3.4vw, 40px)` (desktop), `22px 18px` (mobile) | Inner panel padding (`.sec-pad`) |

---

## 4. Component Dimensions & Layouts

### 1. Hero Stage (`.hstage`)
- **Desktop Dimensions**: `width: 100%`, `height: clamp(380px, 74svh, 680px)`.
- **Mobile Dimensions (≤ 900px)**: `height: clamp(300px, 44svh, 430px)`.
- **Hero Image Drop Shadow**: `filter: drop-shadow(0 14px 22px rgba(0, 74, 66, 0.15))`.
- **Price Tag (`.ptag`)**: Max width `52%` (desktop), `58%` (mobile); border-radius `16px`; glass-2 background.
- **Stage Navigation Dots (`.hdots`)**: Unselected `6px x 6px` circle; Selected `.on` pill `20px x 6px`, color `var(--accent)`.

### 2. Customer Reviews Rail (`#reviews`)
- **Marquee Track (`.revrail`)**: Mask image: `linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)`.
- **Marquee Speed**: `52s` linear infinite (desktop), `40s` (mobile ≤ 760px).
- **Review Card (`.rcard`)**: `flex: 0 0 auto`, `width: 284px` (desktop), `width: 250px` (mobile ≤ 760px), padding `15px 17px`, border-radius `18px`.
- **Star Rating (`.st`)**: Color `#7a9c1e`, font size `10.5px`, letter-spacing `0.2em`.

### 3. Best-Selling Combos (`#combos`)
- **Scroll Snap Rail (`.comborail`)**: `display: flex`, `gap: 14px`, `overflow-x: auto`, `scroll-snap-type: x mandatory`.
- **Combo Card (`.combo`)**: `flex: 0 0 302px` (desktop), `flex: 0 0 268px` (mobile ≤ 760px), `scroll-snap-align: start`.
- **Tray (`.tray`)**: Padding `14px 14px 13px`, border-bottom `1px solid rgba(75,58,143,.12)`.
- **Product Stack (`.stack .it .pimg`)**: Height `66px` (desktop), `56px` (mobile).
- **Hero Combo (`.combo.hero-combo`)**: Border color `rgba(201, 118, 29, 0.46)`, outline glow `0 0 0 1px rgba(201,118,29,.24)`.

### 4. Bundles (`#bundles`)
- **Tier Grid (`.tiers`)**: 3-column grid on desktop (`repeat(3, 1fr)`), 1-column on mobile (< 760px), gap `14px`.
- **Tier Card (`.tier`)**: Padding `24px 22px`, transition `0.4s var(--ease)`. Hover: `translateY(-5px)`.
- **Best Tier (`.tier.best`)**: Border color `rgba(201, 118, 29, 0.46)`, box-shadow `0 22px 54px rgba(58,44,112,.14), 0 0 0 1px rgba(201,118,29,.24), var(--g-inset)`.
- **Quantity Display (`.qty`)**: Outfit font, font-weight `800`, font-size `52px` (desktop), `44px` (mobile), line-height `0.9`.

### 5. Shop / Product Grid (`#shop`)
- **Shelf Grid (`.shelf`)**: 4 columns on desktop (≥ 860px), 2 columns on mobile/tablet (< 860px), gap `14px`.
- **Product Card (`.card`)**: Padding `16px`, transition `0.4s var(--ease)`. Hover: `translateY(-5px)`.
- **Image Frame (`.shot`)**: Height `150px` (desktop), `126px` (mobile ≤ 760px), border-radius `14px`, background `linear-gradient(160deg, rgba(255,255,255,.60), rgba(236,230,247,.42))`.
- **Card Pill**: Top `9px`, left `9px`, font-size `8.5px`, font-weight `800`, border-radius `999px`.

---

## 5. Responsive Breakpoints

| Breakpoint | Target Devices | Key Layout Behaviors |
| :--- | :--- | :--- |
| **375px - 420px** | Small phones | Hero product width `min(92vw, 360px)`, badgestrip compact padding, single-column bundle cards. |
| **600px** | Mobile landscape | Ticker active, search/account icons hidden in header (`.ico.hide-s`), burger menu enabled. |
| **760px** | Mobile boundary | `--sec-y` drops to `22px`; tier grid becomes 1-column; combo rail card width drops to `268px`; review card width drops to `250px`. |
| **860px** | Small tablets | Product shelf switches from 2 columns to 4 columns (`.shelf`). |
| **900px** | Large tablets | Hero badges switch from vertical desktop rail (`.badges`) to mobile strip (`.badgestrip`); hero copy and stage collapse from side-by-side to stacked. |
| **1024px** | Desktop / Laptops | Desktop navigation (`.nav`) displays; burger menu disappears; mousemove subtle parallax activates. |
| **1180px** | Wide Desktop | Full `--maxw` containment; floating vertical progress rail (`.rail`) activates on the right margin. |

---

## 6. Animation Timing & Physics

- **Default Ease Curve**: `--ease: cubic-bezier(0.2, 0.7, 0.2, 1)`.
- **Scroll Reveal (`.rv`)**: Duration `0.95s`, distance `30px`, blur `7px`.
  - Delay steps: `.rv-d1` (0.09s), `.rv-d2` (0.18s), `.rv-d3` (0.27s), `.rv-d4` (0.36s), `.rv-d5` (0.45s).
- **Hero Slide Transition**: Duration `0.85s`, transform scale `0.94` to `1.0`, opacity `0` to `1`.
- **Hero Auto-Cycle Interval**: `3800ms`.
- **Review Marquee (`.revtrack`)**: Linear infinite loop, `52s` desktop, `40s` mobile.
- **Card Hover Elevation**: Duration `0.4s var(--ease)`, `transform: translateY(-5px)`.
