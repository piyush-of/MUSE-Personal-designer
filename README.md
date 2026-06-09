# MUSE — AI-Powered Personal Fashion Intelligence

MUSE is a production-grade SaaS platform that analyses outfits, recommends colour palettes, curates shopping picks, and tracks fashion trends — all personalised to your skin tone.

## Architecture

```
Frontend (Vercel) → Backend (Railway) → Redis → PostgreSQL (Neon)
                              ↓
                    Cloudinary · Gemini/OpenAI/Anthropic
```

```
MUSE/
├── frontend/     React + Vite + TypeScript + TailwindCSS
├── backend/      Express + TypeScript + Prisma + PostgreSQL + Redis + BullMQ
├── docker/       Dockerfiles and nginx config
├── docs/         Architecture, API, deployment, roadmap
├── scripts/      Setup automation
└── tests/        Cross-cutting integration tests
```

**v2.1** — Legacy static files removed. Single source of truth in `frontend/` and `backend/`.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16+ (or Docker)

### Setup

```bash
# Windows
.\scripts\setup.ps1

# macOS/Linux
chmod +x scripts/setup.sh && ./scripts/setup.sh
```

### Development

```bash
npm run dev          # Start backend (3001) + frontend (5173)
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

### Environment

Copy and configure:
- `backend/.env.example` → `backend/.env`
- `frontend/.env.example` → `frontend/.env`

### Database

```bash
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed demo users
```

**Demo accounts:**
- `demo@muse.style` / `Demo1234!`
- `admin@muse.style` / `Admin123!`

### Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

## Features

- **Outfit Analysis** — Upload photos, get AI-enhanced style scores
- **11 Skin Tone Profiles** — Personalised colour palettes
- **Curated Shopping** — Filter by category, gender, skin tone
- **Trend Radar** — Spring/Summer 2026 trends
- **Wardrobe** — Save and manage analysis history
- **Cart/Wishlist** — Client-side with target price alerts
- **Auth** — JWT access + refresh tokens, RBAC, email verification

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, TailwindCSS, React Query, React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL (Neon recommended) |
| Images | Cloudinary |
| AI | Google Gemini |
| Auth | JWT + bcrypt + httpOnly cookies |
| Testing | Vitest + RTL (frontend), Jest + Supertest (backend) |
| CI/CD | GitHub Actions |
| Deploy | Vercel (frontend), Railway (backend), Neon (DB) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start full stack in development |
| `npm run build` | Build frontend + backend |
| `npm test` | Run all tests |
| `npm run lint` | TypeScript + ESLint checks |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Security](docs/SECURITY.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Changelog](docs/CHANGELOG.md)
- [Migration Report](docs/MIGRATION_REPORT.md)

## License

Proprietary — MUSE Studio © 2026
