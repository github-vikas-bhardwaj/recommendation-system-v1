# Supabase schema

| File                       | Purpose                 |
| -------------------------- | ----------------------- |
| `migrations/001_shows.sql` | `shows` table + indexes |

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

Data is **not** loaded by migrations — use a seed script after the table exists.

**Later:** `002_add_embeddings.sql` will enable `vector` and add `embedding vector(1536)` when you start similarity search.
