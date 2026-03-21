# Managed Redis Service Boundary

This project uses Redis as a separately hosted service (outside `backend/` and `frontend/`).

## Provider
- Recommended: Upstash Redis or Redis Cloud (TLS-enabled endpoint).

## Env Contract
Set these values in `backend/.env`:
- `REDIS_URL` Example: `rediss://default:<password>@<host>:<port>`

## TLS Notes
- Use `rediss://` for managed providers.
- Keep password in secret manager / deployment env settings.
- Never commit production credentials.

## Quick Connectivity Check
Run from repo root:

```bash
node redis/scripts/check-connection.mjs
```

This script reads `REDIS_URL` from environment and performs a raw `PING` over TCP/TLS.

## Hosting Notes
- Redis is not started from this repo.
- Deploy Redis independently, then point backend to its URL.
