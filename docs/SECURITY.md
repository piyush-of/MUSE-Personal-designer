# MUSE Security

## Implemented Controls

### Authentication
- bcrypt password hashing (12 rounds)
- JWT access tokens (15min) + refresh tokens (7d)
- Refresh token rotation on each refresh
- httpOnly, secure, sameSite cookies
- Account lockout after 5 failed logins (15min)
- Email verification tokens (SHA-256 hashed, 24h expiry)
- Password reset tokens (SHA-256 hashed, 1h expiry)

### HTTP Security
- Helmet with CSP directives
- CORS whitelist (configurable via `CORS_ORIGINS`)
- Rate limiting (general, auth, analyze endpoints)
- CSRF double-submit cookie on auth mutations
- Request body size limits (1MB JSON, 10MB uploads)
- express-mongo-sanitize (NoSQL injection prevention)
- HPP (HTTP Parameter Pollution protection)
- Input validation via Zod schemas
- HTML escaping on user names (validator.escape)

### Infrastructure
- Environment variable validation (Zod) at startup
- JWT secrets enforced min 32 characters in production
- Prisma parameterized queries (SQL injection prevention)
- No secrets in client bundle
- `x-powered-by` disabled

## Audit Findings (Resolved)

| Issue | Status |
|-------|--------|
| Dual backend codebases | ✅ Consolidated to TypeScript |
| MongoDB without transactions | ✅ Migrated to PostgreSQL |
| No persistent image storage | ✅ Cloudinary integration |
| Dev JWT fallbacks in production | ✅ Production exit on invalid env |
| Missing refresh token rotation | ✅ Implemented |
| Monolithic static serving | ✅ Separated frontend/backend |

## Remaining Recommendations

1. Add `@vitest/coverage-v8` and increase test coverage to 80%+
2. Upgrade multer to v2.x (v1 has known CVEs)
3. Add refresh token family detection (reuse detection)
4. Implement 2FA for admin accounts
5. Add WAF rules on production (Cloudflare/AWS)
6. Set up dependency scanning in CI (Snyk/Dependabot)
7. Add security headers monitoring

## Reporting Vulnerabilities

Email: security@muse.style
