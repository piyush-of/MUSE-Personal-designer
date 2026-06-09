# Changelog

## [2.1.0] — 2026-06-09

### Added
- Redis caching for trends, AI results, and shopping context
- BullMQ background jobs (email delivery, monthly quota reset)
- Pino structured logging replacing console logger
- Sentry error tracking (optional, production)
- AI provider abstraction: Gemini, OpenAI, Anthropic with failover
- Subscription models: Plan, Subscription, Payment, UsageRecord
- Extended models: AuditLog, Notification, Favorite, Outfit, StyleProfile
- 12 backend test suites (~48% coverage)

### Removed
- Legacy root HTML pages (`index.html`, `auth.html`, etc.)
- Legacy `css/` and `js/` directories
- Entire old JavaScript/MongoDB backend (`backend/*.js`, models, routes)
- Root `config/index.js` and GitHub Pages static deploy workflow

## [2.0.0] — 2026-06-09

### Added
- Complete monorepo restructure (`frontend/` + `backend/`)
- React + Vite + TypeScript + TailwindCSS frontend
- Express + TypeScript + Prisma + PostgreSQL backend
- JWT auth with refresh token rotation and RBAC
- Cloudinary image upload integration
- Prisma migrations and seed scripts
- Docker Compose with PostgreSQL
- GitHub Actions CI (build, lint, test, security audit)
- Comprehensive documentation suite

### Changed
- Migrated from MongoDB/Mongoose to PostgreSQL/Prisma
- Migrated from vanilla HTML/JS to React SPA
- Consolidated dual JavaScript/TypeScript backends into single TS architecture
- Email reset links now point to React `/auth` route

### Removed
- Root-level static HTML page serving from Express
- Legacy MongoDB docker service
- Duplicate Mongoose models and JS controllers (superseded)

## [1.0.0] — Prior

- Initial MUSE v4 monolithic release
- Vanilla HTML/CSS/JS frontend
- MongoDB + Express JavaScript backend
- Rule-based fashion engine with Gemini enhancement
