# Environment configuration

One set of variable **names**; values change per deploy target. Code reads `APP_ENV` plus Supabase keys — never hard-code project URLs in the app.

## Matrix

| Logical env    | `APP_ENV`    | Git branch (typical) | Vercel project    | Supabase project                             |
| -------------- | ------------ | -------------------- | ----------------- | -------------------------------------------- |
| **Local**      | `local`      | any feature branch   | — (`npm run dev`) | testing (`recommendation-system-testing-v1`) |
| **Testing**    | `testing`    | `release/next`       | testing           | testing                                      |
| **Production** | `production` | `main`               | production        | production (`recommendation-system-v1`)      |

Local intentionally uses the **testing** Supabase project so dev never touches production data.

## Required variables

| Variable                               | Client    | Local          | Testing (Vercel) | Production (Vercel) |
| -------------------------------------- | --------- | -------------- | ---------------- | ------------------- |
| `APP_ENV`                              | no        | `local`        | `testing`        | `production`        |
| `NEXT_PUBLIC_SUPABASE_URL`             | yes       | testing URL    | testing URL      | prod URL            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes       | testing key    | testing key      | prod key            |
| `SUPABASE_SERVICE_ROLE_KEY`            | **never** | testing secret | testing secret   | prod secret         |

Copy `.env.example` → `.env.local` for local development.

## Local setup

```bash
cp .env.example .env.local
# Fill with recommendation-system-testing-v1 keys from Supabase → Settings → API
npm run dev
```

Restart the dev server after changing env files.

## Vercel setup

Set the same variable **names** in each Vercel project (Settings → Environment Variables):

**Testing project** (deploys `release/next`):

- `APP_ENV` = `testing` for **Production** and **Preview**
- Supabase keys from **testing** project

**Production project** (deploys `main`):

- `APP_ENV` = `production` for **Production**
- Supabase keys from **production** project

> **Important:** On the testing Vercel project, production deployments use `VERCEL_ENV=production`. Set `APP_ENV=testing` explicitly or the app will treat itself as production.

Redeploy after changing env vars.

## Code entry points

| Module                       | Purpose                                             |
| ---------------------------- | --------------------------------------------------- |
| `lib/env/app.ts`             | `getAppEnvironment()`, `usesSecureCookies()`        |
| `lib/env/supabase-public.ts` | Public Supabase URL + publishable key               |
| `lib/env/server.ts`          | `SUPABASE_SERVICE_ROLE_KEY` (server only)           |
| `utils/supabase/env.ts`      | Re-exports public Supabase env (legacy import path) |

## Migrations

Supabase GitHub integration runs migrations on the project linked to **`release/next`** (testing). Production Supabase gets the same migration files when you promote schema (separate project, same repo migrations).
