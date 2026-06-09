# Contributing to MUSE

## Development Setup

1. Fork and clone the repository
2. Run `.\scripts\setup.ps1` (Windows) or `./scripts/setup.sh` (Unix)
3. Start dev: `npm run dev`

## Code Standards

- TypeScript strict mode (backend + frontend)
- Repository pattern for all database access
- Zod validation on all API inputs
- React Hook Form + Zod on all forms
- No `any` types unless absolutely necessary
- Match existing naming conventions

## Branch Strategy

- `main` — production-ready
- `develop` — integration branch
- `feature/*` — new features
- `fix/*` — bug fixes

## Pull Request Process

1. Create feature branch from `develop`
2. Write/update tests for changed behavior
3. Run `npm test` and `npm run lint`
4. Update relevant docs (API.md, CHANGELOG.md)
5. Submit PR with description and test plan

## Commit Messages

```
type(scope): description

feat(analyze): add Cloudinary image persistence
fix(auth): rotate refresh tokens on refresh
docs(api): document shopping query params
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
