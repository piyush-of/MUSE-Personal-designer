# MUSE Architecture

## Overview

MUSE is a monorepo SaaS application with clean separation between frontend and backend.

```
┌─────────────┐     HTTPS/API      ┌─────────────┐     Prisma      ┌────────────┐
│   React     │ ◄────────────────► │   Express   │ ◄─────────────► │ PostgreSQL │
│   (Vercel)  │   JWT + Cookies    │  (Railway)  │                 │   (Neon)   │
└─────────────┘                    └──────┬──────┘                 └────────────┘
                                          │
                                   ┌──────┴──────┐
                                   │ Cloudinary  │
                                   │ Gemini AI   │
                                   └─────────────┘
```

## Backend Layers

```
routes → controllers → services → repositories → database
```

| Layer | Responsibility |
|-------|---------------|
| **Routes** | HTTP method + path mapping, middleware chain |
| **Controllers** | Request/response handling, status codes |
| **Services** | Business logic, external API calls (Gemini, Cloudinary) |
| **Repositories** | Prisma data access, query abstraction |
| **Engine** | Rule-based fashion intelligence (colour detection, scoring) |

## Frontend Layers

```
pages → layouts → components
         ↓
    hooks / contexts / services
```

| Layer | Responsibility |
|-------|---------------|
| **Pages** | Route-level views |
| **Layouts** | Shared chrome (nav, footer) |
| **Components** | Reusable UI primitives |
| **Contexts** | Global state (auth, theme, toast) |
| **Services** | API client with token refresh |
| **Hooks** | Reusable logic (cart, queries) |

## Authentication Flow

1. Login/register → access token (15min) + refresh token (7d, httpOnly cookie)
2. API requests include `Authorization: Bearer <access>`
3. On 401 → automatic refresh via `/api/auth/refresh`
4. Refresh token rotation: old token revoked on each refresh
5. CSRF double-submit cookie on auth mutations

## Database Schema

- **users** — accounts, roles, plan quotas, verification tokens
- **refresh_tokens** — hashed refresh tokens with expiry
- **analyses** — saved outfit analysis results (JSON)

## Key Design Decisions

1. **PostgreSQL over MongoDB** — relational integrity, Prisma type safety
2. **Repository pattern** — testable data layer, swappable persistence
3. **Rule engine + AI** — deterministic scoring with Gemini enhancement
4. **Client-side cart** — no server cart needed; localStorage per user
5. **Cloudinary** — persistent image storage for authenticated analyses
