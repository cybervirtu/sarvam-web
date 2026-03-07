# Sarvam Deployment & Environment Setup

This document covers best practices and procedures for deploying the Sarvam web and API applications using Coolify.

## Coolify Setup Checklist

You will be deploying 4 Coolify "applications" mapped to your custom domains:

1. **`sarvam_web_prod`**
   - Domain: `https://sarvam.jewelminds.com`
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
   - Start Command: (Use Coolify Static or Nginx site functionality)
2. **`sarvam_api_prod`**
   - Domain: `https://sarvamapi.jewelminds.com`
   - Deploy Command (Pre-start): `python -m app.db.migrate` (Requires adding `app/db/migrate.py` or running alembic)
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
3. **`sarvam_web_staging`**
   - Domain: `https://ss.jewelminds.com`
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
4. **`sarvam_api_staging`**
   - Domain: `https://ssapi.jewelminds.com`
   - Deploy Command (Pre-start): `python -m app.db.migrate`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

## Postgres Services Checklist

We stringently recommend using separated database environments entirely for Staging and Production. Set up these Coolify services:

- **`sarvam_pg_prod`**: Contains production user data and tasks.
- **`sarvam_pg_staging`**: For QA, testing, and verifying migrations safely.
- *(Optional) `sarvam_pg_dev`*: Ephemeral debugging databases.

**Internal Networking Guidance**:
Do **NOT** expose the default PostgreSQL port `5432` publicly in Coolify unless required for external BI tools (which is not recommended). Access them internally via the internal network hostname inside Coolify.

## TLS/SSL Requirements

Cookie sessions are configured as `Secure` in production. This means the frontend and backend **must** be served over HTTPS. Coolify takes care of this via auto-provisioned Let's Encrypt certificates.

## Branch Strategy Mapping

- **Production (`sarvam_web_prod` / `sarvam_api_prod`)**: Map deployment webhooks and tracking to the **`main`** branch.
- **Staging (`sarvam_web_staging` / `sarvam_api_staging`)**: Map deployment webhooks and tracking to the **`develop`** branch.

Whenever `develop` merges into `main`, production deployment triggers automatically.

## Migrations on Deploy

To ensure the database is ready for the new API instance to start, run your migrations *before* the API process starts. You can configure this in Coolify as a "Pre-deployment" command:
`python -m app.db.migrate` (or `alembic upgrade head`)

## Debugging Cookie Sessions

If sessions are failing (users get 401 Unauthorized after login), verify the following:

- **CORS Config**: The API `allow_origins` must exactly match the frontend URL without trailing slashes. Wildcards (`*`) break credentials.
- **Credentials Included**: All frontend `fetch`/axios requests must carry `credentials: 'include'`. (We have added this constraint in `src/services/api/apiClient.ts`).
- **SameSite policy**: Ensure `COOKIE_SAMESITE` is `lax` or `none` depending on cross-domain setups (since your domains are different subdomains but same apex `jewelminds.com`, `lax` works safely).
- **Secure policy**: The API must set `COOKIE_SECURE=true` in production and use real HTTPS.

## Output Verification Checklist

### 1. Verify Staging Isolation
- [ ] Check mapping: `sarvam_api_staging` has `DATABASE_URL` pointing strictly to `sarvam_pg_staging`.
- [ ] Check `FRONTEND_ORIGIN`: `sarvam_api_staging` strictly permits `https://ss.jewelminds.com`.
- [ ] Changing tasks in Staging DOES NOT affect Production data.

### 2. Verify Cookie Sessions
- [ ] Successfully Log In via frontend.
- [ ] Open DevTools -> Network -> Inspect the auth requests.
- [ ] Ensure the response from `/auth` comes with a `Set-Cookie` header for the `sarvam_session` cookie.
- [ ] Future requests to the API successfully send the cookie.
- [ ] Cross-check API responses for valid CORS Headers (`Access-Control-Allow-Credentials: true`).
