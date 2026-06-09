# MUSE API Reference

Base URL: `http://localhost:3001` (dev) | `https://api.muse.style` (prod)

## Health

### `GET /health`
Returns service status, database connection, AI provider.

## Authentication

All auth mutations require `X-CSRF-Token` header matching `muse_csrf` cookie.

### `POST /api/auth/register`
```json
{ "name": "Jane", "email": "jane@example.com", "password": "Secure123" }
```

### `POST /api/auth/login`
```json
{ "email": "jane@example.com", "password": "Secure123" }
```

### `POST /api/auth/refresh`
Uses `muse_refresh` httpOnly cookie. Returns new access token.

### `POST /api/auth/logout`
Revokes refresh token, clears cookie.

### `GET /api/auth/me`
Returns current user or `null`. Optional Bearer token.

### `GET /api/auth/verify/:token`
Email verification link.

### `POST /api/auth/forgot-password`
```json
{ "email": "jane@example.com" }
```

### `POST /api/auth/reset-password/:token`
```json
{ "password": "NewSecure123" }
```

## Analyze

### `POST /api/analyze`
`multipart/form-data`:
- `image` (file, max 10MB)
- `skinTone` (enum: porcelain, fair, light, light_medium, medium, olive, tan, deep, rich, ebony, dark)
- `gender` (women | men)

Optional auth saves to wardrobe. Rate limited: 20/15min.

## Trends

### `GET /api/trends` — All trends + AI content
### `GET /api/trends/women` — Women's trends
### `GET /api/trends/men` — Men's trends
### `GET /api/trends/static` — Raw data, no AI

## Shopping

### `GET /api/shopping`
Query params: `category`, `skinTone`, `gender`, `itemType`

## Wardrobe (Auth Required)

### `GET /api/wardrobe` — List saved analyses
### `GET /api/wardrobe/:id` — Full analysis record
### `DELETE /api/wardrobe/:id` — Delete record

## Error Format

```json
{ "success": false, "error": "Message", "errors": ["field errors"] }
```

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| General API | 200 / 15min |
| Analyze | 20 / 15min |
| Auth login | 10 / 15min (failed only) |
| Auth register | 5 / hour |
