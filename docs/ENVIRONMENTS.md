# Environment Setup

This document lists the required environment variables for the Sarvam UI and API on Coolify.

## 1. Backend (`sarvam_api_*`)
You must configure the Environment Variables section in Coolify for both `sarvam_api_prod` and `sarvam_api_staging`.

### Production Variables (`sarvam_api_prod`)
```dotenv
DATABASE_URL=postgresql://<prod-db-user>:<prod-db-password>@<sarvam_pg_prod-internal-name>:5432/sarvam
FRONTEND_ORIGIN=https://sarvam.jewelminds.com
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
SESSION_TTL_DAYS=30
SESSION_SECRET=<generate-a-secure-random-32-byte-string-here>
ENV=prod
```

### Staging Variables (`sarvam_api_staging`)
```dotenv
DATABASE_URL=postgresql://<staging-db-user>:<staging-db-password>@<sarvam_pg_staging-internal-name>:5432/sarvam
FRONTEND_ORIGIN=https://ss.jewelminds.com
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
SESSION_TTL_DAYS=30
SESSION_SECRET=<generate-a-secure-random-32-byte-string-here>
ENV=staging
```

## 2. Frontend (`sarvam_web_*`)
You must configure the Build Environment Variables section in Coolify for both `sarvam_web_prod` and `sarvam_web_staging`.
Because Vite builds the frontend statically, these are swapped during the `npm run build` step.

### Production Variables (`sarvam_web_prod`)
```dotenv
VITE_API_BASE_URL=https://sarvamapi.jewelminds.com/api/v1
```

### Staging Variables (`sarvam_web_staging`)
```dotenv
VITE_API_BASE_URL=https://ssapi.jewelminds.com/api/v1
```
