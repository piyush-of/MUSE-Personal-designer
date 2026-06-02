# MUSE Fashion AI v3 — Multi-Page Platform

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

For local development, copy `.env.example` to `.env`. MongoDB and JWT secrets are required for auth, saved wardrobe history, and online deployment. Gemini and Resend keys are optional; the app falls back to local style intelligence and console email logs when they are not configured.

---

## Production Deployment

The app is ready for Docker/Railway-style deployment as a single Express web service that serves the API and static pages.

Required environment variables:

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/muse
JWT_SECRET=<64-byte-random-secret>
JWT_REFRESH_SECRET=<64-byte-random-secret>
APP_URL=https://your-domain.com
CORS_ORIGINS=https://your-domain.com
```

Optional integrations:

```bash
GEMINI_API_KEY=<gemini-api-key>
GEMINI_MODEL=gemini-2.0-flash
RESEND_API_KEY=<resend-api-key>
EMAIL_FROM=noreply@your-domain.com
```

Deploy steps:

1. Create a MongoDB Atlas database and copy its connection string into `MONGODB_URI`.
2. Generate both JWT secrets with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.
3. Deploy with the included `Dockerfile` or `railway.toml`.
4. Set `APP_URL` and `CORS_ORIGINS` to the final HTTPS domain.
5. Use `/health` as the uptime check endpoint.

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
