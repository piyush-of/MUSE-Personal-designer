# MUSE v2.1 Roadmap

**Current score: ~85/100** (post legacy cleanup + infrastructure)

## Completed in v2.1

- [x] Removed legacy static HTML/CSS/JS and old JavaScript backend
- [x] Redis caching layer (trends, AI results, shopping context)
- [x] BullMQ job queue (email, quota reset) with in-process fallback
- [x] Pino structured logging
- [x] Sentry integration (optional via `SENTRY_DSN`)
- [x] AI provider abstraction (Gemini / OpenAI / Anthropic)
- [x] Subscription schema (Plan, Subscription, Payment, UsageRecord)
- [x] Extended entities (AuditLog, Notification, Favorite, Outfit, StyleProfile)
- [x] Expanded test suite (~48% coverage, path to 80%)

## Next: Production Deploy

1. Deploy frontend → Vercel (`VITE_API_URL`)
2. Deploy backend → Railway
3. Provision Neon PostgreSQL + connection pooling
4. Configure Cloudinary, Resend, Gemini API keys
5. Set `SENTRY_DSN` for error tracking

## Next: 80%+ Test Coverage

Priority test areas:
- Auth flows (register, login, refresh rotation, password reset)
- Wardrobe CRUD with mocked Prisma
- Analyze endpoint with mocked file upload
- Repository layer unit tests

## Next: Subscription Billing

- Stripe integration for Premium/Pro tiers
- Webhook handler for subscription events
- Usage metering via `UsageRecord`

## Next: Observability

- OpenTelemetry traces (optional)
- Custom metrics dashboard
- Alerting on error rate / latency SLOs

## Target Score: 90+/100

| Milestone | Impact |
|-----------|--------|
| Production deploy + demo URL | Portfolio visibility |
| 80% test coverage | Engineering credibility |
| Stripe billing | True SaaS positioning |
| OpenTelemetry | Enterprise readiness |
