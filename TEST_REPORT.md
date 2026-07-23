# Comprehensive Test Report — DriveFlow / AutoFleet Pro

This document records the results of running the unified test suite across both the **backend** and **frontend** components of the Car Dealership Inventory System.

All 46 automated unit and integration tests execute together from the repository root via a single command:
```bash
npx vitest run
```

---

## 1. Summary Results

| Metric | Result |
| :--- | :--- |
| **Total Test Files** | 13 passed (13 total) |
| **Total Tests** | 46 passed (46 total) |
| **Failures / Errors** | 0 |
| **Pass Rate** | 100% |

---

## 2. Test Coverage Breakdown by Area

### Backend Integration Tests (8 test files / 34 tests)

1. **Authentication & Authorization (`backend/tests/auth.integration.test.js` - 7 tests)**
   - User registration with BCrypt password hashing (omits password hash from response).
   - Duplicate email registration rejection (`400 Bad Request` / `409 Conflict`).
   - User login returning a valid signed JWT containing `userId` and `role`.
   - Rejection of invalid login credentials (`401 Unauthorized`).
   - Endpoint protection enforcing JWT token authentication (`401 Unauthorized`).
   - Role-based access control restricting non-admin users from admin-only routes (`403 Forbidden`).

2. **Input Validation Layer (`backend/tests/validation.integration.test.js` - 5 tests)**
   - Rejection of malformed emails and short passwords on registration with `400 Bad Request` and field-level error messages.
   - Rejection of missing required fields on login (`400 Bad Request`).
   - Rejection of invalid prices or negative quantities on vehicle creation (`400 Bad Request`).
   - Rejection of invalid payload types on vehicle update (`400 Bad Request`).
   - Rejection of non-positive restock amounts on restock endpoint (`400 Bad Request`).

3. **Rate Limiting Layer (`backend/tests/rateLimit.integration.test.js` - 1 test)**
   - Verification that exceeding request thresholds on auth endpoints triggers `429 Too Many Requests` with rate limit message.

4. **Pagination Support (`backend/tests/pagination.integration.test.js` - 3 tests)**
   - Verification of default `limit=20` and `offset=0` query parameter behavior.
   - Application of custom `limit` and `offset` values with accurate total count in response.
   - Verification of `limit` and `offset` payload inclusion on search endpoint (`GET /api/vehicles/search`).

5. **Vehicle CRUD Operations (`backend/tests/vehicles.integration.test.js` - 5 tests)**
   - Vehicle creation in SQLite database returning correct vehicle model structure (`POST /api/vehicles`).
   - Listing vehicles from SQLite (`GET /api/vehicles`).
   - Updating vehicle attributes (`PUT /api/vehicles/:id`).
   - Deleting vehicles (`DELETE /api/vehicles/:id`).
   - Query string filtering via list parameters (`GET /api/vehicles?make=...&category=...`).

6. **Search Endpoint (`backend/tests/search.integration.test.js` - 5 tests)**
   - Filtering by make (`GET /api/vehicles/search?make=...`).
   - Filtering by category (`GET /api/vehicles/search?category=...`).
   - Filtering by price bounds (`GET /api/vehicles/search?minPrice=...&maxPrice=...`).
   - Multi-parameter search combining make, model, category, and price range.
   - Empty result set return (`200 OK` with `[]`) when no vehicles match criteria.

7. **Purchase Business Logic (`backend/tests/purchase.integration.test.js` - 4 tests)**
   - Returning `404 Not Found` for non-existent vehicle IDs.
   - Decrementing vehicle `quantity` by 1 on valid purchase requests (`POST /api/vehicles/:id/purchase`).
   - Rejection of purchase requests when `quantity` is already 0 (`409 Conflict` or `400 Bad Request`).

8. **Restock Admin Logic (`backend/tests/restock.integration.test.js` - 4 tests)**
   - Enforcing admin role requirement for restocking (`403 Forbidden` for standard users).
   - Returning `404 Not Found` for invalid vehicle IDs.
   - Incrementing stock quantity on happy path with custom quantity and default quantity (`POST /api/vehicles/:id/restock`).

---

### Frontend Component & Page Tests (5 test files / 12 tests)

1. **Low-Stock Visual Badge (`frontend/src/components/VehicleCard.test.tsx` - 2 tests)**
   - Rendering "Low Stock" visual badge when vehicle quantity is below 3 units.
   - Hiding "Low Stock" badge when vehicle quantity is 3 or more units.

2. **Registration Form (`frontend/src/pages/RegisterPage.test.tsx` - 4 tests)**
   - Form submission payload handling and navigation redirect to login on success.
   - Inline rendering of backend validation error for invalid email formats.
   - Inline rendering of backend validation error for short/weak passwords (<8 characters).
   - Inline rendering of backend duplicate email error response.

3. **Purchase Button & Stock Gating (`frontend/src/pages/InventoryPage.purchase.test.tsx` - 3 tests)**
   - Disabling purchase button and displaying "Out of Stock" badge when vehicle `quantity === 0`.
   - Triggering purchase API call, updating vehicle quantity state, and displaying success toast notification.
   - Displaying error toast notification and refreshing inventory data when purchase API returns an error (`400/409`).

4. **Search Wiring (`frontend/src/pages/InventoryPage.search.test.tsx` - 1 test)**
   - Constructing and dispatching multi-field search queries (make, model, category, minPrice, maxPrice) to the `useVehicles` search hook.

5. **Admin UI Control Gating (`frontend/src/pages/InventoryPage.admin-gating.test.tsx` - 2 tests)**
   - Hiding Add Vehicle, Edit, Delete, and Restock controls for standard (non-admin) users.
   - Rendering Add Vehicle, Edit, Delete, and Restock controls for authenticated Admin users.

---

## 3. Scope & Known Test Gaps

While core API endpoints, database persistence, authorization rules, validation, rate limiting, and frontend page workflows are fully verified, the following areas are **not** covered by automated tests:

1. **End-to-End (E2E) Browser Tests**: No Playwright or Cypress suite is included to test browser rendering, live DOM event handling, or visual layout regression across desktop and mobile viewports.
2. **Concurrency / Race Condition Testing**: No load or concurrent stress tests are run on `POST /api/vehicles/:id/purchase` to simulate simultaneous purchase requests competing for the last stock unit.
3. **JWT Expiration & Token Refresh Edge Cases**: No test explicitly verifies token expiry behavior (e.g., handling expired JWT signatures after token expiration time window).
4. **Network Partition & Resilience**: Network failure states (e.g., unexpected database disconnects or HTTP timeout handling) are not simulated in automated integration tests.

---

## 4. Actual Terminal Output Evidence

```text
 RUN  v2.1.9 K:/project/car-dealership-inventory

 ✓ |backend| tests/rateLimit.integration.test.js (1 test) 700ms
   ✓ Rate Limiting Layer > triggers 429 Too Many Requests after exceeding threshold on POST /api/auth/login 687ms
 ✓ |backend| tests/purchase.integration.test.js (4 tests) 1720ms
   ✓ POST /api/vehicles/:id/purchase > returns 404 when the vehicle id does not exist 669ms
   ✓ POST /api/vehicles/:id/purchase > decrements quantity by 1 on happy path 546ms
   ✓ POST /api/vehicles/:id/purchase > rejects with 409 or 400 when quantity is already 0 530ms
 ✓ |backend| tests/pagination.integration.test.js (3 tests) 1967ms
   ✓ Pagination Support (limit & offset) > GET /api/vehicles returns default limit=20 and offset=0 with total count 809ms
   ✓ Pagination Support (limit & offset) > GET /api/vehicles accepts custom limit and offset query parameters 566ms
   ✓ Pagination Support (limit & offset) > GET /api/vehicles/search returns limit and offset in response shape 535ms
 ✓ |backend| tests/restock.integration.test.js (4 tests) 1990ms
   ✓ POST /api/vehicles/:id/restock > requires admin role (returns 403 for non-admin user) 648ms
   ✓ POST /api/vehicles/:id/restock > returns 404 for a non-existent vehicle ID 527ms
   ✓ POST /api/vehicles/:id/restock > increments quantity on happy path with custom quantity and default quantity 579ms
 ✓ |backend| tests/validation.integration.test.js (5 tests) 1863ms
   ✓ Input Validation Layer (Zod Schemas) > POST /api/vehicles rejects invalid price or negative quantity 583ms
   ✓ Input Validation Layer (Zod Schemas) > PUT /api/vehicles/:id rejects invalid field types 513ms
   ✓ Input Validation Layer (Zod Schemas) > POST /api/vehicles/:id/restock rejects zero or negative restock quantity 459ms
 ✓ |backend| tests/auth.integration.test.js (7 tests) 2702ms
   ✓ auth and authorization > registers a user with a hashed password and omits the password hash from the response 534ms
   ✓ auth and authorization > rejects duplicate email registration 605ms
   ✓ auth and authorization > logs in with a real signed JWT containing the user id and role 468ms
   ✓ auth and authorization > rejects login with invalid credentials 594ms
   ✓ auth and authorization > rejects non-admin users on admin-only routes 341ms
 ✓ |backend| tests/search.integration.test.js (5 tests) 2857ms
   ✓ GET /api/vehicles/search > filters by make only 824ms
   ✓ GET /api/vehicles/search > filters by category only 562ms
   ✓ GET /api/vehicles/search > filters by price range only (minPrice and maxPrice) 544ms
   ✓ GET /api/vehicles/search > filters by combined make, model, category, and price range 567ms
   ✓ GET /api/vehicles/search > returns an empty array when no vehicles match the criteria 332ms
 ✓ |backend| tests/vehicles.integration.test.js (5 tests) 2871ms
   ✓ vehicle API with real database > creates a vehicle in SQLite and returns only the required fields 836ms
   ✓ vehicle API with real database > lists vehicles from SQLite 554ms
   ✓ vehicle API with real database > updates an existing vehicle in SQLite 552ms
   ✓ vehicle API with real database > deletes a vehicle from SQLite 572ms
   ✓ vehicle API with real database > searches vehicles in SQLite by make, model, category, and price range via list query params 327ms
 ✓ |frontend| src/components/VehicleCard.test.tsx (2 tests) 143ms
   ✓ VehicleCard Low-Stock Indicator > renders low-stock badge when vehicle quantity is less than 3 100ms
   ✓ VehicleCard Low-Stock Indicator > does not render low-stock badge when vehicle quantity is 3 or more 43ms
 ✓ |frontend| src/pages/InventoryPage.admin-gating.test.tsx (2 tests) 506ms
   ✓ InventoryPage admin-only control gating > hides add/edit/delete/restock controls for non-admin users 413ms
 ✓ |frontend| src/pages/InventoryPage.search.test.tsx (1 test) 1090ms
   ✓ InventoryPage search endpoint filters > sends make/model/category/minPrice/maxPrice combined filters to useVehicles search mode 1088ms
 ✓ |frontend| src/pages/InventoryPage.purchase.test.tsx (3 tests) 744ms
   ✓ InventoryPage purchase behavior > disables purchase and shows out-of-stock label when quantity is zero 425ms
 ✓ |frontend| src/pages/RegisterPage.test.tsx (4 tests) 4107ms
   ✓ RegisterPage > submits registration payload and redirects to login on success 1426ms
   ✓ RegisterPage > renders backend invalid email validation error inline 841ms
   ✓ RegisterPage > renders backend weak password validation error inline 802ms
   ✓ RegisterPage > renders duplicate email error inline 1033ms

 Test Files  13 passed (13)
      Tests  46 passed (46)
   Start at  16:40:36
   Duration  37.18s
```
