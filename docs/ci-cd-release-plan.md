# CI/CD & Release Plan — recommendation-system-v1

> **Read in browser (recommended):** Run `npm run dev`, then open  
> **http://localhost:3000/docs/ci-cd-release-plan**

> **Status:** Planning document (not yet implemented)  
> **Stack:** Next.js 16 · GitHub · Vercel · release-it  
> **Goal:** Mirror the _structure_ of the design-system GitLab pipeline, adapted for a website app deployed on Vercel.

---

## 1. Current state

| Area                    | Status                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| **Repo**                | GitHub — `github-vikas-bhardwaj/recommendation-system-v1`                                          |
| **Branch protection**   | `main` protected — PR required, no direct/force push                                               |
| **Local hooks (Husky)** | pre-commit (branch name + lint-staged), commit-msg (commitlint), pre-push (type-check, lint, knip) |
| **CI/CD**               | None yet (no `.github/workflows/`)                                                                 |
| **Tests**               | None yet                                                                                           |
| **Release tooling**     | None yet                                                                                           |
| **Deployment**          | Not connected to Vercel yet                                                                        |

### Existing npm scripts

```json
"lint": "eslint . --max-warnings 0",
"type-check": "tsc --noEmit",
"knip": "knip",
"build": "next build"
```

---

## 2. Design system vs this app — key differences

| Design system (GitLab)                | This app (GitHub + Vercel)                          |
| ------------------------------------- | --------------------------------------------------- |
| Publish npm packages to Nexus / JFrog | Deploy website to Vercel                            |
| `npm run bundle` + tarball artifacts  | `next build` (+ optional bundle analysis)           |
| `npm run docs` before release         | Optional — skip unless you add a docs site          |
| GitLab CI + `GITLAB_TOKEN`            | **GitHub Actions** + `GITHUB_TOKEN`                 |
| `@release-it/...` GitLab plugin       | `@release-it/...` **GitHub** plugin                 |
| `release/*` branch workflow           | Same pattern works; trigger deploy on tag or `main` |
| Private registry `.npmrc`             | Vercel project env vars + GitHub secrets            |

**Remove entirely:** `publish_to_nexus`, `publish_to_jfrog`, design-system bundle tarball publishing.

**Replace with:** Vercel preview deploys (PRs) + production deploy (release tag or `main`).

---

## 3. Target architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Developer workflow                        │
├─────────────────────────────────────────────────────────────────┤
│  feat/fix/chore/* branch  →  PR  →  merge to main (protected)   │
│  release/X.Y.Z branch     →  manual release job  →  tag + GH Release │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              GitHub Actions (replaces GitLab CI)                 │
├─────────────────────────────────────────────────────────────────┤
│  PR / push        →  quality + test + build (required checks)  │
│  release branch   →  release-it dry-run (manual)                 │
│  release branch   →  release-it (manual) → tag + CHANGELOG       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel                                   │
├─────────────────────────────────────────────────────────────────┤
│  PR branches      →  Preview deployment (automatic)              │
│  main             →  Production (after merge)                      │
│  tag v*.*.*       →  Production (optional — pin prod to releases)│
└─────────────────────────────────────────────────────────────────┘
```

### Recommended split of responsibility

| Layer             | Tool           | Responsibility                                        |
| ----------------- | -------------- | ----------------------------------------------------- |
| **Quality gates** | GitHub Actions | lint, types, knip, tests, build — block merge if fail |
| **Versioning**    | release-it     | bump version, CHANGELOG, git tag, GitHub Release      |
| **Hosting**       | Vercel         | build & serve the Next.js app                         |

Avoid duplicating deploy logic in both GHA and Vercel unless you need custom deploy steps. **Default recommendation:** let Vercel handle deploys; use GHA only for CI + release-it.

---

## 4. Pipeline stages (GitHub Actions mapping)

GitLab stages map to **jobs** in one or more workflow files.

### Stage 1 — `quality` (every PR + push to `main`)

| Job       | Script               | Notes                                                      |
| --------- | -------------------- | ---------------------------------------------------------- |
| **lint**  | `npm run lint`       | Already exists                                             |
| **types** | `npm run type-check` | Rename alias `types` optional for parity with old pipeline |
| **knip**  | `npm run knip`       | Dead code / unused exports                                 |

Optional later:

| Job             | Script                                  | When                                        |
| --------------- | --------------------------------------- | ------------------------------------------- |
| **bundle_size** | `@next/bundle-analyzer` or `size-limit` | Only on `release/*` or `main` — not day-one |

**Workflow file:** `.github/workflows/quality.yml`  
**Triggers:** `pull_request`, `push` to `main`

### Stage 2 — `test` (every PR + push to `main`)

| Job            | Script             | Status                        |
| -------------- | ------------------ | ----------------------------- |
| **unit_tests** | `npm run test`     | **To add** (Vitest or Jest)   |
| **e2e_tests**  | `npm run test:e2e` | **To add later** (Playwright) |

Start with unit tests only; add e2e when the app has critical flows.

**Workflow file:** `.github/workflows/test.yml`

### Stage 3 — `coverage` (optional, phase 2)

| Job               | Script                  |
| ----------------- | ----------------------- |
| **test_coverage** | `npm run test:coverage` |

Upload `coverage/` as artifact; optionally integrate Codecov.

### Stage 4 — `build` (every PR + push to `main`)

| Job       | Script          |
| --------- | --------------- |
| **build** | `npm run build` |

Validates the app compiles in CI (same as Vercel will run).  
Set env vars needed for build (e.g. `NEXT_PUBLIC_*`) in GitHub Actions secrets.

**Workflow file:** `.github/workflows/build.yml`  
Or merge quality + test + build into a single **`ci.yml`** for simpler branch protection setup.

### Stage 5 — `test_release` (manual, release branches only)

| Job              | Script                       |
| ---------------- | ---------------------------- |
| **test_release** | `npm run release:ci:dry-run` |

**Trigger rules:**

```yaml
if: startsWith(github.ref, 'refs/heads/release/')
```

**`when: manual`** → `workflow_dispatch` or `environment` with required reviewers.

### Stage 6 — `release` (manual, release branches only)

| Job         | Script               |
| ----------- | -------------------- |
| **release** | `npm run release:ci` |

Creates: version bump, `CHANGELOG.md`, commit, tag `vX.Y.Z`, GitHub Release.

**After success:** Vercel deploys production from tag (if configured) or from the merged commit on `main`.

### Stage 7 — Deploy (Vercel — not GHA publish jobs)

| Environment             | Trigger               | Vercel behavior                                             |
| ----------------------- | --------------------- | ----------------------------------------------------------- |
| **Preview**             | PR opened/updated     | Unique preview URL per PR                                   |
| **Production**          | Merge to `main`       | Default production URL                                      |
| **Production (strict)** | Git tag `v*.*.*` only | Configure in Vercel → Git → Production Branch = tag pattern |

**No** `publish_to_nexus` / `publish_to_jfrog` equivalents.

---

## 5. Branch & release workflow

### Day-to-day development

```
main (protected)
  └── feat/add-recommendations
        └── PR → required CI checks → merge
```

Branch naming (already enforced locally):

```
^(feat|fix|refactor|tests|chore|docs|ci|hotfix|perf)/[a-z0-9]+(-[a-z0-9]+)*$
```

### Release workflow (aligned with design-system pattern)

```
1. Create release branch from main
   git checkout main && git pull
   git checkout -b release/1.0.0

2. Push release branch
   git push -u origin release/1.0.0

3. CI runs quality + test + build automatically

4. Manual job: test_release (dry-run)
   npm run release:ci:dry-run

5. Manual job: release
   npm run release:ci
   → bumps package.json version
   → updates CHANGELOG.md
   → commits + tags v1.0.0
   → creates GitHub Release

6. Open PR: release/1.0.0 → main (merge changelog + version bump)

7. Vercel production deploy from main (or from tag)
```

### Versioning strategy

| Approach                                        | Pros                                  | Cons                              |
| ----------------------------------------------- | ------------------------------------- | --------------------------------- |
| **A. release-it on `release/X.Y.Z` branch**     | Matches your GitLab setup; controlled | Extra branch step                 |
| **B. release-it on `main` via manual workflow** | Simpler                               | Requires careful protection rules |

**Recommendation:** **Approach A** — consistent with your existing mental model and GitLab template.

---

## 6. release-it configuration (GitHub variant)

### Files to add

| File               | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `.release-it.json` | Release config                                    |
| `CHANGELOG.md`     | Auto-generated changelog (initial empty scaffold) |

### package.json scripts to add

```json
{
  "scripts": {
    "release": "release-it",
    "release:dry-run": "release-it -VV --dry-run",
    "release:ci": "release-it --ci",
    "release:ci:dry-run": "release-it --ci -VV --dry-run"
  },
  "devDependencies": {
    "release-it": "^19.x",
    "@release-it/conventional-changelog": "^10.x",
    "@release-it/bumper": "^7.x"
  }
}
```

### `.release-it.json` (adapted for GitHub + Vercel app)

```json
{
  "git": {
    "commitMessage": "chore: 🚀 release v${version}",
    "requireCleanWorkingDir": false,
    "tagName": "v${version}"
  },
  "github": {
    "release": true,
    "releaseName": "Release v${version}",
    "tokenRef": "GITHUB_TOKEN"
  },
  "npm": {
    "publish": false
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "infile": "CHANGELOG.md",
      "preset": {
        "name": "conventionalcommits",
        "types": [
          { "type": "feat", "section": "🚀 Features" },
          { "type": "fix", "section": "🐛 Bug Fixes" },
          { "type": "perf", "section": "📈 Performance Improvements" },
          { "type": "revert", "section": "🔁 Reverts" },
          { "type": "docs", "section": "📖 Documentation" },
          { "type": "refactor", "section": "🔨 Code Refactoring" },
          { "type": "test", "section": "🧪 Tests" },
          { "type": "build", "section": "🏗 Build System" },
          { "type": "ci", "section": "🤖 Continuous Integration" },
          { "type": "chore", "section": "🔧 Chores" }
        ]
      }
    }
  }
}
```

### Differences from design-system config

| Removed                             | Reason                                    |
| ----------------------------------- | ----------------------------------------- |
| `hooks.before:init → npm run docs`  | No docs build yet                         |
| `hooks.after:bump → npm run bundle` | App uses `next build`, not library bundle |
| `gitlab` block                      | Using GitHub                              |
| `npm.publish`                       | Private app — not publishing to npm       |
| `assets: bundle/*.tgz`              | No tarball artifacts                      |

Optional hook to add later:

```json
"hooks": {
  "after:bump": "npm run build"
}
```

---

## 7. Vercel setup

### 7.1 Connect project

1. Import GitHub repo in [Vercel Dashboard](https://vercel.com/new).
2. Framework preset: **Next.js**.
3. Root directory: `/` (monorepo: adjust if needed).
4. Build command: `npm run build` (default).
5. Install command: `npm ci`.

### 7.2 Environment variables

| Variable           | Where                   | Purpose                      |
| ------------------ | ----------------------- | ---------------------------- |
| `NEXT_PUBLIC_*`    | Vercel + GitHub Actions | Client-side config           |
| API keys / secrets | Vercel only (server)    | Backend / AI APIs            |
| Same vars          | GitHub Actions secrets  | So `next build` passes in CI |

Keep **Preview** and **Production** env scopes separate in Vercel.

### 7.3 Deploy triggers (recommended)

| Setting            | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| Production branch  | `main`                                                 |
| Preview            | All non-production branches (PRs)                      |
| Ignored build step | Optional — skip builds when only docs/CHANGELOG change |

### 7.4 Optional: deploy only on release tags

In Vercel → Settings → Git:

- Set production to deploy from tags matching `v*.*.*`
- Use when you want **production = released versions only**
- Previews still deploy on every PR

---

## 8. GitHub secrets & permissions

| Secret         | Used by                         | Purpose                                                      |
| -------------- | ------------------------------- | ------------------------------------------------------------ |
| `GITHUB_TOKEN` | release-it, Actions             | Provided automatically; needs `contents: write` for releases |
| Vercel tokens  | Only if using Vercel CLI in GHA | Optional — skip if using Vercel Git integration              |

### Branch protection — required status checks

After CI workflows exist, enable on `main`:

- [ ] CI / lint
- [ ] CI / type-check
- [ ] CI / knip
- [ ] CI / build
- [ ] CI / test (when added)

---

## 9. Local vs CI parity

| Check       | Local (Husky) | CI (GHA)             |
| ----------- | ------------- | -------------------- |
| Branch name | pre-commit    | — (PR enforces flow) |
| lint-staged | pre-commit    | full `npm run lint`  |
| commitlint  | commit-msg    | —                    |
| type-check  | pre-push      | yes                  |
| lint        | pre-push      | yes                  |
| knip        | pre-push      | yes                  |
| build       | —             | yes                  |
| test        | —             | yes (phase 2)        |

CI should run the **full** checks; hooks stay fast for developer feedback.

---

## 10. Implementation phases (step by step)

### Phase 1 — Foundation CI ✅ start here

**Goal:** Every PR runs quality + build; merge blocked on failure.

- [ ] Add `.github/workflows/ci.yml` (lint, type-check, knip, build)
- [ ] Use `node:22`, `npm ci`, cache `node_modules` / npm cache
- [ ] Open test PR; verify checks appear
- [ ] Add required status checks on protected `main`

**Deliverable:** Green CI on PRs.

---

### Phase 2 — Vercel connection

**Goal:** Preview URLs on PRs; production on `main` merge.

- [ ] Connect repo to Vercel
- [ ] Configure env vars (Preview + Production)
- [ ] Merge first PR via CI → confirm production deploy
- [ ] Document preview URL pattern in README

**Deliverable:** Live preview + production site.

---

### Phase 3 — release-it

**Goal:** Versioned releases with CHANGELOG and GitHub Releases.

- [ ] Install `release-it` + `@release-it/conventional-changelog`
- [ ] Add `.release-it.json` (GitHub config above)
- [ ] Add `CHANGELOG.md` scaffold
- [ ] Add release scripts to `package.json`
- [ ] Test locally: `npm run release:dry-run`

**Deliverable:** Local dry-run produces expected changelog + version bump (no push).

---

### Phase 4 — Release CI jobs

**Goal:** Manual release from `release/*` branches in CI.

- [ ] Add `.github/workflows/release.yml`
- [ ] Jobs: `test_release` (dry-run) + `release` (manual `workflow_dispatch`)
- [ ] Grant `contents: write` for tagging and GitHub Release
- [ ] Test full flow on `release/0.2.0` branch

**Deliverable:** One button release creating `v0.2.0` tag + GitHub Release.

---

### Phase 5 — Tests

**Goal:** Match design-system `test` stage.

- [ ] Add Vitest (or Jest) + React Testing Library
- [ ] `npm run test` + `npm run test:coverage`
- [ ] Add test job to CI
- [ ] (Later) Playwright e2e + `test:e2e` job

**Deliverable:** Unit tests gate merges.

---

### Phase 6 — Enhancements (optional)

- [ ] Bundle size check on `release/*` (`@next/bundle-analyzer`)
- [ ] Codecov integration
- [ ] Dependabot / Renovate
- [ ] Slack/Discord notify on production deploy
- [ ] Production deploy pinned to release tags only

---

## 11. Proposed workflow file structure

```
.github/
  workflows/
    ci.yml              # quality + build (all PRs)
    test.yml            # unit tests (phase 5 — or merge into ci.yml)
    release.yml         # manual release-it jobs (release/* branches)
.release-it.json
CHANGELOG.md
docs/
  ci-cd-release-plan.md # this document
```

**Start with one `ci.yml`**; split later if pipelines grow.

---

## 12. Example `ci.yml` sketch (for implementation)

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

defaults:
  run:
    shell: bash

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run knip

  build:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          # Add secrets when app needs them at build time
          NEXT_PUBLIC_APP_URL: ${{ vars.NEXT_PUBLIC_APP_URL }}
```

---

## 13. Decisions to confirm before implementation

| #   | Question                      | Options                                            |
| --- | ----------------------------- | -------------------------------------------------- |
| 1   | **CI platform**               | GitHub Actions (recommended — repo is on GitHub)   |
| 2   | **Production deploy trigger** | `main` merge vs `v*.*.*` tag only                  |
| 3   | **Release branch pattern**    | `release/1.0.0` (match GitLab) vs semver on `main` |
| 4   | **Test framework**            | Vitest (recommended for Next.js) vs Jest           |
| 5   | **E2E timing**                | Phase 5 later vs skip for MVP                      |
| 6   | **Bundle size gate**          | Skip MVP vs add on release branches                |

---

## 14. Success criteria

- [ ] PR cannot merge to `main` without passing lint, types, knip, build
- [ ] Every PR gets a Vercel preview URL
- [ ] Merging to `main` deploys production (or tag-based prod if chosen)
- [ ] `release/X.Y.Z` + manual job creates tag, CHANGELOG, GitHub Release
- [ ] No npm registry publishing — deployment is Vercel-only
- [ ] Local Husky + remote CI enforce the same standards

---

## 15. Next step

When ready to implement, start with **Phase 1** (`.github/workflows/ci.yml`) and **Phase 2** (Vercel connect) in parallel.

Say which phase to begin with and we will implement it step by step.
