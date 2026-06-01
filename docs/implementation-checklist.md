# Implementation Checklist — CI/CD, Environments & Release

> **Read in browser (recommended):** Run `npm run dev`, then open  
> **http://localhost:3000/docs/implementation-checklist**

> **Project:** recommendation-system-v1  
> **Stack:** Next.js 16 · GitHub · Vercel · Husky · release-it  
> **Target workflow:** Staging (dev branches) → Testing (`release/next`) → Production (`main`)  
> **Status:** Use this as your step-by-step journey. Check items off as you complete them.

---

## How to use this document

1. Work **top to bottom** — later phases depend on earlier ones.
2. Do **not skip Phase 0** — it gets the repo into a clean starting state.
3. **release-it (Phase 7)** is isolated — only needed after production deploys work.
4. Each phase ends with a **Verification** section — do not proceed until it passes.

---

## Current project snapshot (as of analysis)

| Area                           | Status                                        |
| ------------------------------ | --------------------------------------------- |
| Next.js app                    | ✅ Bootstrapped (`app/`, `next build` works)  |
| Local hooks                    | ✅ Husky — pre-commit, commit-msg, pre-push   |
| Commit conventions             | ✅ commitlint + conventional commits          |
| Lint / types / knip            | ✅ Scripts in `package.json`                  |
| GitHub remote                  | ✅ Connected                                  |
| `main` branch protection       | ✅ PR required, no direct/force push (tested) |
| `release/next` branch          | ❌ Not created yet                            |
| GitHub Actions (CI)            | ❌ No `.github/workflows/`                    |
| Vercel                         | ❌ Not connected                              |
| Unit / e2e tests               | ❌ Not set up                                 |
| release-it                     | ❌ Not set up                                 |
| Branch hook for `release/next` | ❌ Not in `validate-branch-name.sh`           |

**Active branch note:** Work may still be on `feat/initial-setup` — Phase 0 covers landing code on `main` / `release/next` first.

---

## Environment model (reference)

| Environment    | Git trigger                          | Vercel mapping                  | Audience          |
| -------------- | ------------------------------------ | ------------------------------- | ----------------- |
| **Staging**    | Push / PR on `feat/*`, `fix/*`, etc. | Preview deploy (per branch)     | Developers        |
| **Testing**    | Push / merge to `release/next`       | Pinned preview or custom domain | QA + stakeholders |
| **Production** | Merge to `main`                      | Production deploy               | End users         |

**release-it:** Runs **after** production is live on `main`. Documentation only (tag + CHANGELOG + GitHub Release). Does not deploy.

---

## Phase 0 — Repo foundation

**Goal:** Code is on GitHub, integration branch exists, test branches cleaned up.

### 0.1 Land initial code on GitHub

- [ ] Ensure local project builds: `npm ci && npm run build`
- [ ] Ensure local hooks pass: `npm run lint && npm run type-check && npm run knip`
- [ ] Create `release/next` from current stable code:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b release/next
  git push -u origin release/next
  ```
- [ ] If app code is still on a feature branch (e.g. `feat/initial-setup`):
  - [ ] Open PR: `feat/initial-setup` → `release/next`
  - [ ] Pass review + merge
  - [ ] Open PR: `release/next` → `main` (first production promotion)
  - [ ] Pass review + merge
- [ ] Delete obsolete remote test branches (e.g. `chore/test-force-push`) if no longer needed

### 0.2 Repo hygiene

- [ ] Confirm `package.json` `name` / README title match repo intent (currently `recommendation-system-v2` vs repo `v1`)
- [ ] Add `.env.example` listing required env vars (no secrets):
  ```bash
  # Example — adjust to your app
  NEXT_PUBLIC_APP_URL=
  ```
- [ ] Document in README that `.env*` files are gitignored

### Phase 0 verification

- [ ] `main` and `release/next` exist on GitHub
- [ ] Both branches contain the app source (not just README)
- [ ] `npm run build` succeeds locally

---

## Phase 1 — Local git hooks & branch rules

**Goal:** Local rules match the 3-environment branching model.

### 1.1 Update branch name validation

File: `.husky/validate-branch-name.sh`

- [ ] Add `release/next` to protected branches (block direct commits):
  ```sh
  main | master | develop | staging | release/next)
  ```
- [ ] Update help text: “No direct commits on: main, release/next, …”
- [ ] Remove or keep `staging` in the list (your “Testing” env is `release/next`, not a `staging` branch — avoid confusion)

### 1.2 Confirm hook pipeline

- [ ] **pre-commit:** branch validation + lint-staged — working
- [ ] **commit-msg:** commitlint — working
- [ ] **pre-push:** type-check, lint, knip — working
- [ ] Fix `.husky/pre-commit` if any broken lines exist (verify `npm run validate:branch` runs cleanly)

### 1.3 Document branch naming for the team

- [ ] Feature branches: `feat/`, `fix/`, `chore/`, `docs/`, `ci/`, `hotfix/`, `perf/`, `refactor/`, `tests/`
- [ ] Integration branch: `release/next` (merge via PR only)
- [ ] Production branch: `main` (merge via PR only)

### Phase 1 verification

- [ ] `git commit` on `main` locally → **blocked**
- [ ] `git commit` on `release/next` locally → **blocked**
- [ ] `git commit` on `feat/test-hook` → **allowed**
- [ ] Invalid branch name (e.g. `my-feature`) → **blocked**

---

## Phase 2 — GitHub branch protection & repo settings

**Goal:** Remote rules enforce PR-only merges and required CI (once CI exists).

### 2.1 Protect `main` (confirm / extend)

GitHub → Settings → Branches → Branch protection rules → `main`

- [ ] Require a pull request before merging
- [ ] Require approvals (set count — e.g. 1)
- [ ] Dismiss stale pull request approvals when new commits are pushed (optional)
- [ ] Require status checks to pass before merging _(enable after Phase 3)_
- [ ] Require branches to be up to date before merging
- [ ] Do not allow bypassing the above settings (or restrict to admins only)
- [ ] Restrict who can push to matching branches
- [ ] Block force pushes
- [ ] Block deletions

### 2.2 Protect `release/next`

- [ ] Create branch protection rule for `release/next`
- [ ] Require pull request before merging
- [ ] Require approvals (e.g. 1)
- [ ] Require status checks to pass _(enable after Phase 3)_
- [ ] Block force pushes for regular users
- [ ] **Allow admins** force push only (needed for post-release reset — Phase 6)
- [ ] Block deletions

### 2.3 Repository settings

- [ ] Confirm repo visibility (private if team-only)
- [ ] Add collaborators with appropriate roles (Read / Write / Maintain)
- [ ] Enable “Automatically delete head branches” after merge (optional, recommended)
- [ ] Confirm default branch is `main`

### Phase 2 verification

- [ ] Direct push to `main` → rejected (already tested)
- [ ] Direct push to `release/next` → rejected
- [ ] PR merge to `release/next` without approval → blocked (if approvals required)

---

## Phase 3 — GitHub Actions CI

**Goal:** Every PR runs quality checks; failed CI blocks merge.

### 3.1 Create CI workflow

- [ ] Add `.github/workflows/ci.yml`
- [ ] Triggers:
  - [ ] `pull_request` (all branches)
  - [ ] `push` to `main` and `release/next`
- [ ] Runner: `ubuntu-latest`
- [ ] Node: `22` (match local / Vercel)
- [ ] Steps: checkout → setup-node (cache npm) → `npm ci` → quality jobs

### 3.2 CI jobs (minimum)

- [ ] **lint** — `npm run lint`
- [ ] **type-check** — `npm run type-check`
- [ ] **knip** — `npm run knip`
- [ ] **build** — `npm run build` (with env vars if needed)

### 3.3 CI configuration details

- [ ] Add GitHub Actions variables / secrets for build-time env (if app needs them):
  - [ ] `NEXT_PUBLIC_*` vars as GitHub **Variables** or **Secrets**
- [ ] Set workflow concurrency (optional — cancel in-progress runs on same PR)
- [ ] Name jobs clearly (names appear in branch protection required checks)

### 3.4 Enable required status checks

Back in GitHub branch protection for `main` and `release/next`:

- [ ] Add required check: CI / lint (or your workflow job name)
- [ ] Add required check: CI / type-check
- [ ] Add required check: CI / knip
- [ ] Add required check: CI / build

### Phase 3 verification

- [ ] Open test PR `feat/ci-smoke-test` → `release/next`
- [ ] All CI jobs pass
- [ ] Introduce intentional lint error → CI fails → merge blocked
- [ ] Fix error → CI green → merge allowed

---

## Phase 4 — Vercel (3 environments)

**Goal:** Staging previews on feature branches, Testing on `release/next`, Production on `main`.

### 4.1 Connect Vercel to GitHub

- [ ] Create Vercel account / team (if needed)
- [ ] Import repo: `github-vikas-bhardwaj/recommendation-system-v1`
- [ ] Framework preset: **Next.js**
- [ ] Root directory: `/`
- [ ] Build command: `npm run build` (default)
- [ ] Install command: `npm ci`
- [ ] Output directory: default (Next.js)

### 4.2 Production environment (`main`)

- [ ] Set **Production Branch** to `main`
- [ ] Assign production domain (Vercel default or custom domain)
- [ ] Configure **Production** environment variables in Vercel dashboard

### 4.3 Testing environment (`release/next`)

- [ ] Ensure Vercel deploys `release/next` branch
- [ ] Assign stable URL for testers:
  - [ ] Option A: Vercel branch alias / custom domain (e.g. `testing.yourapp.com`)
  - [ ] Option B: Document the fixed `release/next` preview URL for the team
- [ ] Configure **Preview** environment variables (can mirror production or use test API keys)

### 4.4 Staging environment (feature branches)

- [ ] Confirm PR / branch pushes create **Preview** deployments
- [ ] Each `feat/*` PR gets a unique preview URL
- [ ] (Recommended) Enable **“Wait for GitHub Checks”** before promoting deployment — aligns with “CI pass then staging deploy”

### 4.5 Vercel ↔ GitHub integration

- [ ] Install Vercel GitHub app on the repo
- [ ] Confirm PR comments show preview deployment links
- [ ] (Optional) Enable Deployment Protection for Production

### 4.6 Environment variables parity

- [ ] List all env vars needed at build time
- [ ] Set in Vercel: Production scope
- [ ] Set in Vercel: Preview scope (for staging + testing)
- [ ] Set in GitHub Actions secrets (for CI build job)
- [ ] Add `.env.example` in repo (Phase 0)

### Phase 4 verification

- [ ] Push / PR on `feat/*` → Preview (Staging) URL appears on PR
- [ ] Merge to `release/next` → Testing URL updates
- [ ] Merge `release/next` → `main` → Production URL updates
- [ ] All three URLs serve the app without build errors

---

## Phase 5 — End-to-end workflow validation

**Goal:** Prove the full Staging → Testing → Production path with the team.

### 5.1 Developer flow (Staging)

- [ ] Dev creates `feat/checklist-smoke-test` from `release/next`
- [ ] Makes a visible UI change + conventional commit
- [ ] Pushes and opens PR → `release/next`
- [ ] CI passes on PR
- [ ] Staging preview URL shows the change
- [ ] Code review + merge to `release/next`

### 5.2 QA / stakeholder flow (Testing)

- [ ] Testing URL reflects merged changes
- [ ] Tester verifies on Testing environment
- [ ] Stakeholder sign-off recorded (process doc / ticket — your choice)

### 5.3 Production promotion

- [ ] Open PR: `release/next` → `main`
- [ ] CI passes on promotion PR
- [ ] Approve + merge
- [ ] Production URL shows the change

### 5.4 Post-release branch reset

- [ ] Reset `release/next` to match `main`:
  ```bash
  git checkout release/next
  git fetch origin
  git reset --hard origin/main
  git push origin release/next --force-with-lease
  ```
- [ ] Confirm Testing URL matches Production content

### 5.5 Hotfix drill (optional but recommended)

- [ ] Create `hotfix/smoke-fix` from `main`
- [ ] PR → `main` → merge → Production updated
- [ ] Back-merge `main` into `release/next`
- [ ] Confirm Testing stays in sync

### Phase 5 verification

- [ ] Full cycle completed once without bypassing hooks or protection rules
- [ ] Team agrees on who approves PRs at each stage

---

## Phase 6 — Team documentation & runbooks

**Goal:** Written process so the team does not rely on memory.

### 6.1 Create workflow runbook

- [ ] Add `docs/workflow-runbook.md` (or extend README) covering:
  - [ ] Branch roles (`feat/*`, `release/next`, `main`)
  - [ ] Staging / Testing / Production URLs
  - [ ] PR targets: features → `release/next`, promotion → `main`
  - [ ] Who reviews at each stage
  - [ ] Post-release reset steps for `release/next`
  - [ ] Hotfix procedure

### 6.2 Update README

- [ ] Link to `docs/implementation-checklist.md` and runbook
- [ ] Local dev setup (`npm ci`, `npm run dev`)
- [ ] Hook bypass note: avoid `--no-verify` except emergencies

### Phase 6 verification

- [ ] New team member can follow runbook to ship a test feature

---

## Phase 7 — release-it (post-production documentation)

**Goal:** After production is live, publish version + changelog on GitHub for the team.

> **Reminder:** release-it does **not** deploy. It runs **after** `main` is live.

### 7.1 Install dependencies

- [ ] `npm install -D release-it @release-it/conventional-changelog`
- [ ] Commit lockfile changes

### 7.2 Add configuration

- [ ] Create `.release-it.json`:
  - [ ] `github.release: true`
  - [ ] `github.releaseName: "Release v${version}"`
  - [ ] `npm.publish: false`
  - [ ] `@release-it/conventional-changelog` → `CHANGELOG.md`
  - [ ] Conventional commit preset with emoji sections (Features, Fixes, etc.)
- [ ] Create initial `CHANGELOG.md`:

  ```markdown
  # Changelog

  All notable changes to this project will be documented in this file.
  ```

### 7.3 Add npm scripts

- [ ] `"release": "release-it"`
- [ ] `"release:dry-run": "release-it -VV --dry-run"`
- [ ] `"release:ci": "release-it --ci"`
- [ ] `"release:ci:dry-run": "release-it --ci -VV --dry-run"`

### 7.4 Local smoke test

- [ ] Run `npm run release:dry-run` on `main`
- [ ] Confirm expected version bump + CHANGELOG output
- [ ] Do **not** push until ready for first real release

### 7.5 GitHub Actions release workflow (manual)

- [ ] Add `.github/workflows/release.yml`
- [ ] Trigger: `workflow_dispatch` (manual only)
- [ ] Runs only on `main` branch
- [ ] Permissions: `contents: write`
- [ ] Steps: checkout (full history) → `npm ci` → `npm run release:ci`
- [ ] Optional second job: `release:ci:dry-run` for preview

### 7.6 First production release

- [ ] Complete Phase 5 production promotion first
- [ ] Run `npm run release:ci:dry-run` (local or CI) — review output
- [ ] Run `npm run release:ci` (local or manual CI job)
- [ ] Confirm on GitHub:
  - [ ] Tag `v0.1.0` (or next version) exists
  - [ ] **Releases** page shows release notes
  - [ ] `CHANGELOG.md` updated in repo

### Phase 7 verification

- [ ] GitHub Releases page visible to team collaborators
- [ ] Release notes grouped by Features / Fixes / etc.
- [ ] Production site unchanged by release-it (deploy already happened)

---

## Phase 8 — Tests (future enhancement)

**Goal:** Add automated tests to CI before the app grows complex.

### 8.1 Unit tests

- [ ] Choose test runner (Vitest recommended for Next.js)
- [ ] Install: Vitest + React Testing Library
- [ ] Add `npm run test` script
- [ ] Write first meaningful test (e.g. page or utility)
- [ ] Add **test** job to `.github/workflows/ci.yml`
- [ ] Add as required status check on `main` and `release/next`

### 8.2 Coverage (optional)

- [ ] Add `npm run test:coverage`
- [ ] Upload coverage artifact in CI
- [ ] (Optional) Integrate Codecov

### 8.3 E2E tests (later)

- [ ] Add Playwright
- [ ] Add `npm run test:e2e`
- [ ] Run on PR to `release/next` only (heavier job)

### Phase 8 verification

- [ ] CI fails when a test fails
- [ ] Tests run on every PR

---

## Phase 9 — Optional enhancements

Pick these up when the core flow is stable.

### Observability & quality

- [ ] Bundle size check on PRs to `release/next` (`@next/bundle-analyzer`)
- [ ] Dependabot or Renovate for dependency updates
- [ ] Sentry or similar error tracking in Production

### Vercel hardening

- [ ] Custom domains for Production and Testing
- [ ] Deployment Protection on Production
- [ ] Separate Vercel projects for prod vs preview (only if needed)

### GitHub

- [ ] PR template (`.github/pull_request_template.md`)
- [ ] Issue templates
- [ ] CODEOWNERS for required reviewers on `main` / `release/next`

---

## Master checklist — implementation order

Use this as your journey map:

| Step | Phase | What you build                    | Blocker for next step     |
| ---- | ----- | --------------------------------- | ------------------------- |
| 1    | **0** | Land code + create `release/next` | Everything                |
| 2    | **1** | Update local branch hooks         | —                         |
| 3    | **2** | GitHub branch protection          | —                         |
| 4    | **3** | GitHub Actions CI                 | Required checks           |
| 5    | **4** | Vercel 3 environments             | E2E deploy test           |
| 6    | **5** | Full workflow smoke test          | Team confidence           |
| 7    | **6** | Runbook for team                  | —                         |
| 8    | **7** | release-it + GitHub Releases      | Production live on `main` |
| 9    | **8** | Unit tests in CI                  | Optional                  |
| 10   | **9** | Enhancements                      | Optional                  |

---

## Quick reference — final flow

```
1. feat/* ──PR──► release/next     →  CI  →  Staging preview (Vercel)
2. release/next (Testing URL)      →  QA + stakeholders sign off
3. release/next ──PR──► main       →  CI  →  Production (Vercel)
4. release-it on main (manual)     →  tag + CHANGELOG + GitHub Release
5. reset release/next from main    →  ready for next cycle
```

---

## Files you will create or modify

| File / setting                   | Phase | Action                     |
| -------------------------------- | ----- | -------------------------- |
| `.husky/validate-branch-name.sh` | 1     | Add `release/next`         |
| `.github/workflows/ci.yml`       | 3     | Create                     |
| `.github/workflows/release.yml`  | 7     | Create                     |
| `.release-it.json`               | 7     | Create                     |
| `CHANGELOG.md`                   | 7     | Create                     |
| `package.json`                   | 7     | Add release scripts + deps |
| `.env.example`                   | 0     | Create                     |
| `docs/workflow-runbook.md`       | 6     | Create                     |
| GitHub branch rules              | 2     | Configure                  |
| Vercel project                   | 4     | Configure                  |

---

## When you are ready to start

**Begin with Phase 0, Step 0.1** — get `release/next` on GitHub and land your app code through PRs.

Tell me _“start Phase 0”_ (or any specific phase number) and we will implement it together step by step.
