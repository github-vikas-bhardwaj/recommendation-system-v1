# Supabase schema

| File                           | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `migrations/001_shows.sql`     | `shows` table + indexes                              |
| `migrations/002_shows_rls.sql` | RLS: public read, anon insert/update for seed        |
| `migrations/003_auth.sql`      | Custom auth: `users`, `sessions` (service role only) |

**Testing project:** `recommendation-system-testing-v1`  
**Git branch for deploy:** `release/next`

**JSON → DB when seeding:**

| JSON             | Column                |
| ---------------- | --------------------- |
| `id`             | `id`                  |
| `name`           | `name`                |
| `genres`         | `source_genres`       |
| `premiered`      | `premiered` (null OK) |
| `ended`          | `ended`               |
| `image.original` | `image_url`           |
| `summary`        | `summary`             |

Data is **not** loaded by migrations — run after `002_shows_rls.sql` is applied:

```bash
npm run db:seed
```

Uses `SUPABASE_SERVICE_ROLE_KEY` when set (recommended). Otherwise uses publishable key + `shows_insert_anon` policy.

**Auth (server actions):** requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` — no RLS policies on `users` / `sessions`; only the admin client writes there.

**After seeding:** consider removing `shows_insert_anon` and `shows_update_anon` in a follow-up migration so the app cannot modify catalog rows from the browser.

**Later:** `002_add_embeddings.sql` will enable `vector` and add `embedding vector(1536)` when you start similarity search.
