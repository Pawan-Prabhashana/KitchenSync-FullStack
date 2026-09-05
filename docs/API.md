# KitchenSync REST API

Express + JWT backend for the multi-branch Kitchen + Delivery order system.
Payloads map to the shared types in [`server/models/types.ts`](../server/models/types.ts)
(which re-exports [`src/types.ts`](../src/types.ts)). Data is served from either an
in-memory store or MongoDB — identical responses either way (see
[`docs/DATA-MODEL.md`](DATA-MODEL.md)).

- **Base URL:** `http://localhost:4000`, all routes under `/api`. JSON in/out.
- **Auth:** JWT bearer (`Authorization: Bearer <token>`), expiry `JWT_EXPIRES_IN` (default `7d`).
  Public: `/health`, `/auth/register`, `/auth/login`. Everything else requires a token.
- **Responses never leak** `_id`, `__v`, or `passwordHash`.

## Error shape

```json
{ "error": { "message": "…", "code": "…" } }
```

| Status | Codes |
|--------|-------|
| 400 | `VALIDATION_ERROR` |
| 401 | `UNAUTHORIZED` |
| 404 | `NOT_FOUND`, `ROUTE_NOT_FOUND` |
| 409 | `VERSION_CONFLICT`, `EMAIL_TAKEN` |
| 500 | `INTERNAL_ERROR` |

A malformed/unknown `:id` returns **404** (ids are strings, so there is no cast-to-500).

## Concurrency

Orders/deliveries carry an integer `version`. `PATCH` accepts optional `expectedVersion`;
if it doesn't match the stored version the API returns **409 without applying the change**,
including the current server state:

```json
{ "error": { "message": "This record was updated by someone else", "code": "VERSION_CONFLICT" },
  "current": { "version": 2, "lastUpdatedBy": "Priya Fernando", "lastUpdatedAt": "10:15 PM" } }
```

In Mongo this is enforced atomically via `findOneAndUpdate({ id, version }, { $set…, $inc:{version:1} })`.

---

## Health

### `GET /api/health` — public
`200` → `{ "status": "ok", "dataSource": "mongo"|"memory", "db": "connected"|"disconnected"|"memory" }`

## Auth

- **`POST /api/auth/register`** (public) — body `{ name, email, password, role }` → `201 { token, user }`; `400` invalid role, `409` `EMAIL_TAKEN`.
- **`POST /api/auth/login`** (public) — body `{ email, password }` → `200 { token, user }`; `401` bad credentials.
- **`GET /api/auth/me`** — `200 { user }`; `401` without a valid token.

## Orders (kitchen) — auth required

> Ids contain a leading `#` (e.g. `#ORD-COL-1001`); URL-encode as `%23` in paths.

- **`GET /api/orders?branchId=`** → `200 Order[]`.
- **`GET /api/orders/stats?branchId=`** → `200 { branchId, total, byStatus:[{status,count}], byChef:[{chef,count}] }` — real Mongo `$match/$group/$sort` aggregation (computed equivalently in memory mode).
- **`GET /api/orders/:id`** → `200 Order`; `404`.
- **`POST /api/orders`** — body `{ branchId, tableNumber, items[], specialNotes?, waiterName?, chefName? }` → `201 Order` (stage `New`, version 1, one history entry); `400`.
- **`PATCH /api/orders/:id`** — body `{ stage?, chef?, expectedVersion? }` → `200 Order` (version bump + history on stage change); `400`, `404`, **`409`**.
- **`DELETE /api/orders/:id`** → `204`; `404`.

## Deliveries — auth required

- **`GET /api/deliveries?branchId=`** → `200 DeliveryOrder[]`.
- **`GET /api/deliveries/stats?branchId=`** → `200 { branchId, total, byStatus:[{status,count}], byRider:[{rider,count}] }` (aggregation).
- **`GET /api/deliveries/:id`** → `200 DeliveryOrder`; `404`.
- **`POST /api/deliveries`** — body `{ branchId, customerName, address, items[], paymentMethod, distanceKm?, orderTotal?, etaMinutes?, specialNotes?, riderName? }` → `201 DeliveryOrder` (stage `Preparing`, version 1); `400`.
- **`PATCH /api/deliveries/:id`** — body `{ stage?, rider?, expectedVersion? }` → `200`; `400`, `404`, **`409`**.
- **`DELETE /api/deliveries/:id`** → `204`; `404`.

## Users — auth required

- **`GET /api/users`** → `200 User[]` (no password hashes).
- **`GET /api/users/:id`** → `200 User`; `404`.

---

## Example curl

```bash
BASE=http://localhost:4000
TOKEN=$(curl -s -X POST $BASE/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"priya@kitchensync.com","password":"kitchen123"}' \
  | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).token))")

# aggregation
curl -s "$BASE/api/orders/stats?branchId=br-colombo" -H "Authorization: Bearer $TOKEN"

# move a stage, then replay the stale version → 409
curl -s -X PATCH "$BASE/api/orders/%23ORD-COL-1001" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"stage":"Cooking","expectedVersion":1}'
curl -i -X PATCH "$BASE/api/orders/%23ORD-COL-1001" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"stage":"Ready","expectedVersion":1}'   # → 409
```
