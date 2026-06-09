# MUSE Deployment Guide

## Targets

| Component | Platform | URL Pattern |
|-----------|----------|-------------|
| Frontend | Vercel | `https://muse.style` |
| Backend | Railway | `https://api.muse.style` |
| Database | Neon PostgreSQL | Connection pooling via `?pgbouncer=true` |
| Images | Cloudinary | `res.cloudinary.com` |

## Frontend (Vercel)

1. Connect GitHub repo, set root directory to `frontend`
2. Framework preset: Vite
3. Environment variables:
   ```
   VITE_API_URL=https://api.muse.style
   ```
4. Build command: `npm run build`
5. Output directory: `dist`

## Backend (Railway)

1. Connect repo, set root to `backend`
2. Use `docker/Dockerfile.backend` or Nixpacks with:
   - Build: `npm run build && npx prisma generate`
   - Start: `npx prisma migrate deploy && node dist/server.js`
3. Environment variables (see `backend/.env.example`)
4. Add PostgreSQL plugin or connect Neon `DATABASE_URL`

### Neon Connection String

```
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/muse?sslmode=require&pgbouncer=true
```

## Docker (Self-hosted)

```bash
docker compose up --build -d
```

Set secrets in `.env` at project root:
```
JWT_SECRET=<32+ char random>
JWT_REFRESH_SECRET=<32+ char random>
GEMINI_API_KEY=<optional>
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
RESEND_API_KEY=<optional>
```

## Post-Deploy Checklist

- [ ] Run `prisma migrate deploy`
- [ ] Run `prisma db seed` (first deploy only)
- [ ] Verify `/health` returns `status: ok`
- [ ] Test CORS from frontend domain
- [ ] Configure Cloudinary upload folder `muse`
- [ ] Set `APP_URL` and `CORS_ORIGINS` to production URLs
- [ ] Enable HTTPS (automatic on Vercel/Railway)
