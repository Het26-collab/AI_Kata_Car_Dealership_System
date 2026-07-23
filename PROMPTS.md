# PROMPTS.md — AI Tooling Prompt History

This document contains the verbatim prompt history and user instructions used throughout the development and hardening of DriveFlow (AutoFleet Pro).

---

## Initial Audit & Analysis

```text
go through this project and analyze this fully
```

---

## Test Consolidation & Reporting Prompt

```text
All tests are green: 25 backend + 10 frontend = 35 total, across 9 test files, with clean git history and Co-authored-by trailers on every AI-assisted commit.

Two things:

1. Check why the root `npx vitest run` only picks up the 5 backend test files and not the 4 frontend ones — likely a root vitest.config.js include/projects scoping issue. Fix it so a single `npx vitest run` from repo root runs and reports on all 9 files together (backend + frontend), so a reviewer doesn't have to know to run two separate commands. Show me that combined output once fixed.

2. Generate TEST_REPORT.md at the repo root with real output from that combined run:
   - Total test files, total tests, pass/fail count
   - Breakdown by area: auth, vehicle CRUD, search, purchase, restock (backend) and registration, purchase button, search wiring, admin gating (frontend)
   - Note what's NOT covered (e.g., no E2E tests, no load/concurrency testing on purchase race conditions, no explicit test for JWT expiration)
```

---

## Documentation Finalization Prompt

```text
Now finalize documentation:

1. Update README.md with:
   - Project overview (1-2 paragraphs)
   - Architecture summary: Node/Express + Prisma/SQLite backend, React/TypeScript/Vite/Tailwind frontend, JWT auth with role-based access (user/admin)
   - Local setup instructions from a fresh clone: install steps, env vars needed (.env.example file if one doesn't exist), Prisma migrate/seed commands, how to run backend, how to run frontend, how to run the full test suite
   - A screenshots section with placeholder markers: [SCREENSHOT: login page], [SCREENSHOT: dashboard], [SCREENSHOT: purchase flow], [SCREENSHOT: admin CRUD] — I'll replace these myself
   - Link to TEST_REPORT.md
   - A "My AI Usage" section — draft this honestly based on the actual build process: TDD-first backend development stage by stage, a real debugging episode (the cross-file SQLite test pollution issue and its root cause), frontend feature wiring, and a genuine reflection on how AI assistance changed speed/workflow
```

---

## Production Hardening Add-ons Prompt

```text
Documentation is done (README with setup/AI usage sections, TEST_REPORT.md, PROMPTS.md). All 35 tests passing in one unified root command. Now add the following high-signal, low-scope-creep add-ons, test-first, one commit per item:

1. INPUT VALIDATION LAYER — add Zod schema validation on every backend endpoint that accepts a body (register, login, create vehicle, update vehicle, restock quantity). Return a consistent 400 response shape with field-level error messages for invalid payloads. Write failing tests first for at least one invalid-payload case per endpoint, then implement.

2. RATE LIMITING — add express-rate-limit on POST /api/auth/login and POST /api/auth/register specifically (e.g. 10 requests per 15 minutes per IP). Write a test confirming the limit triggers a 429 after the threshold, then implement.

3. CENTRALIZED ERROR HANDLING — add one Express error-handling middleware so every error path (validation, not-found, unauthorized, unexpected) returns a consistent JSON shape. Write a test first, then implement.

4. PAGINATION — add limit and offset query params to GET /api/vehicles and GET /api/vehicles/search (e.g. ?limit=20&offset=0 default), return total count in response. Write a test first, then implement.

5. LOW-STOCK INDICATOR — on the frontend, visually highlight vehicles with quantity < 3 (e.g. a small badge or colored border) on the dashboard/inventory view. Write a component test first confirming the badge appears below the threshold and not at/above it, then implement.

6. AUTOMATED CI PIPELINE — add a .github/workflows/test.yml that runs npx vitest run on push/PR.
```

---

## End-to-End Browser & Final Verification Prompt

```text
Pagination now wraps vehicle list/search responses as { data, total, limit, offset } instead of a bare array. Confirm the frontend's vehicle-fetching code (wherever it consumes GET /api/vehicles and GET /api/vehicles/search) was updated to read response.data.data (or equivalent) instead of expecting the response body to be the array directly. If it wasn't updated, fix it now and add a test confirming the inventory list still renders correctly against the new paginated shape.

Then start the app for real (npm run dev on both backend and frontend) and manually click through: register a new user, log in, view dashboard, search/filter, purchase a vehicle down to 0 stock and confirm the button disables, and log in as admin to confirm add/edit/delete/restock controls appear and work.

If everything checks out, run npx vitest run from root one final time and confirm 46/46 still passes.
```
