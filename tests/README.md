# Cross-Cutting Tests

Integration tests that span frontend + backend live here.

## Planned

- E2E outfit analysis flow (Playwright)
- Auth flow (register → analyze → wardrobe)
- Docker compose smoke test

## Running

```bash
# Backend unit/integration tests
npm run test -w backend

# Frontend unit tests
npm run test -w frontend
```
