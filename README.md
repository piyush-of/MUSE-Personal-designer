# MUSE Fashion v3 

> A complete full-stack fashion intelligence platform. Five pages, light/dark mode, celebrity trends, curated shopping with Amazon & Flipkart links, and a pixel-level outfit analyser.

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with hero, features, how-it-works |
| **Analyse** | `/analyze.html` | Upload outfit → full style report |
| **Shopping** | `/shopping.html` | Curated picks with Amazon & Flipkart links |
| **Trends** | `/trends.html` | Celebrity & global fashion trends |
| **About** | `/about.html` | Project info, tech stack, philosophy |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
open http://localhost:3000
```


---

## Project Structure

```
muse-v3/
├── backend/
│   ├── server.js                    ← Entry point + graceful shutdown
│   ├── app.js                       ← Express + all middleware
│   ├── engine/
│   │   └── fashionEngine.js         ★ Complete rule-based fashion AI
│   ├── data/
│   │   └── trends.js                ← Celebrity & global trend data
│   ├── controllers/
│   │   └── analyzeController.js
│   ├── routes/
│   │   └── index.js                 ← /api/analyze + /api/trends + /api/shopping
│   └── middleware/
│       ├── validate.js
│       └── errorHandler.js
│
├── frontend/public/
│   ├── index.html                   ← Home page
│   ├── analyze.html                 ← Outfit analyser
│   ├── shopping.html                ← Curated shopping
│   ├── trends.html                  ← Celebrity trends
│   ├── about.html                   ← Project about page
│   ├── css/
│   │   └── style.css                ← Complete design system (light + dark mode)
│   └── js/
│       ├── nav.js                   ← Shared navigation injector
│       └── shared.js                ← Theme toggle, active nav, toast
│
└── config/index.js
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Analyse outfit image for skin tone |
| `GET`  | `/api/trends` | All celebrity + global trends |
| `GET`  | `/api/trends/celebrity` | Bollywood celebrity trends only |
| `GET`  | `/api/trends/global` | Global fashion trends only |
| `GET`  | `/api/shopping?category=earthy` | Shopping picks (filter by category) |
| `GET`  | `/health` | Server health check |

---

## Design System

### Light Mode (default)
- Background: `#F9F5EF` (warm ivory)
- Surface: `#FFFFFF`
- Accent: `#B5674D` (rose terracotta)
- Gold: `#A8864A`

### Dark Mode
- Background: `#0F0D0B` (deep charcoal)
- Surface: `#1A1714`
- Accent: `#D4856A` (warm rose)
- Gold: `#C4A060`

Toggle with the `☾ / ☀` button in the top navigation. Persists via `localStorage`.

### Typography
- **Display**: Playfair Display (editorial headings)
- **Body**: Jost (formal, readable body text)
- **Data**: DM Mono (labels, tags, metadata)

---

## Fashion Engine

All intelligence lives in `backend/engine/fashionEngine.js`:

| Component | Description |
|-----------|-------------|
| `SKIN_DATA` | 6 skin tone profiles with best/avoid colours, hex palettes, metals, neutrals |
| `COLOR_CATEGORIES` | 22 RGB test functions mapping pixels to fashion colour names |
| `STYLE_RULES` | Pattern rules detecting 7 style categories |
| `GOOD_PAIRS` | 13 harmonious colour combinations (+18 pts each) |
| `BAD_PAIRS` | 5 clashing colour combinations (−15 pts each) |
| `SHOPPING_DB` | 5 categories × 4 items = 20 curated shopping picks with Amazon/Flipkart links |
| `COMBO_DB` | 4 occasion types × 3 combos = 12 curated outfit formulas |
| `DOS_DONTS` | Per-skin-tone style rules (4 dos + 3 don'ts each) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Server | Express 4 |
| Image Processing | Jimp (pure JS, no native deps) |
| Upload | Multer (memory storage) |
| Security | Helmet + CORS + express-rate-limit |
| Frontend | Vanilla HTML / CSS / JS |
| Fonts | Playfair Display + Jost + DM Mono |
| Theme | CSS Custom Properties (light + dark) |
