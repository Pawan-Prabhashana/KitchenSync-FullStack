# KitchenSync

[![CI](https://github.com/Pawan-Prabhashana/KitchenSync-FullStack/actions/workflows/ci.yml/badge.svg)](https://github.com/Pawan-Prabhashana/KitchenSync-FullStack/actions/workflows/ci.yml)

**Live demo:** [https://kitchensync-ten.vercel.app](https://kitchensync-ten.vercel.app)

KitchenSync is a dual-board restaurant ops app for **dine-in kitchen** and **delivery dispatch**, across **8 Sri Lankan city branches**. Waiters, chefs, and riders create orders, advance stages, assign staff, and review history — with JWT auth, an Express REST API, and conflict guards.

> Full-stack milestone: React frontend on Vercel + Express API (JWT, in-memory store seeded per branch). The API store resets when the server process restarts. Real database persistence is a later milestone.

## What’s included

- **8 branches** — Colombo, Galle, Kandy, Jaffna, Negombo, Kurunegala, Anuradhapura, Batticaloa
- **Dual boards** — Kitchen or Delivery after login; switch anytime
- **Express REST API** (`server/`) — routes → controllers → repositories (in-memory now)
- **JWT auth** — `register` / `login` / `me`, bcrypt-hashed passwords, protected order/delivery routes
- **Full CRUD** under `/api/orders` and `/api/deliveries`
- **Optimistic concurrency** — `PATCH` takes `expectedVersion` and returns **409** on a stale write
- **Offline cache** — `localStorage` hydrates the UI if the API is briefly unreachable

## Features

### Kitchen board
- Kanban stages: **New → Cooking → Ready → Served**
- Assign chefs, table numbers, special notes, and menu items
- Order detail drawer with stage history and undo for recent moves
- Views: Board, Orders table, Chefs, History, Analytics, Settings

### Delivery board
- Kanban stages: **Preparing → Ready for Pickup → Out for Delivery → Delivered**
- Assign riders; track ETA / lateness, payment method, and distance
- Delivery-specific detail drawer, table view, history, and analytics
- Riders view for dispatch staffing

### Shared
- Demo login / signup (hash-based routes)
- Branch picker after login
- Urgency / timer cues on aging orders
- Conflict guard when an order was updated by someone else
- Filters, search, and “mine” view modes where applicable

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4, Motion, Lucide icons
- Express REST API + JWT (`jsonwebtoken`) + `bcryptjs` (via `tsx`)
- Frontend hosted on [Vercel](https://kitchensync-ten.vercel.app); API on Railway

## Quickstart

```bash
npm install
cp .env.example .env   # optional; JWT_SECRET, PORT, VITE_API_URL, CORS_ORIGIN
npm run dev:all        # API on :4000 and Vite app on :3000
```

Open [http://localhost:3000/](http://localhost:3000/). Prefer two terminals? Run `npm run server` and `npm run dev` separately.

### Demo login

All seeded users share the password **`kitchen123`** — e.g. `priya@kitchensync.com` / `kitchen123`, or use the quick-login buttons (they hit the API). Seeded staff live in `src/data/menu.ts`.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run server` | Start the API on `PORT` (default 4000) |
| `npm run server:dev` | API in watch mode |
| `npm run dev` | Vite frontend on port 3000 |
| `npm run dev:all` | API and frontend together |
| `npm run build` | Production frontend build |
| `npm run lint` | Typecheck |

### Production frontend build (Vercel folder upload)

`VITE_API_URL` is baked in at **build** time:

```bash
echo 'VITE_API_URL=https://your-api-host' > .env.production
npm run build
# upload the dist/ folder to Vercel
```

## Run with Docker

The whole stack — **MongoDB + Express API + static frontend** — runs locally with one
command (the "docker-compose for local multi-service runs" the brief asks for):

```bash
docker compose up --build
```

| Service | URL | Notes |
|---|---|---|
| `web` (nginx serving the Vite build) | http://localhost:3000 | built with `VITE_API_URL=http://localhost:4000` |
| `api` (Express) | http://localhost:4000 | `DATA_SOURCE=mongo`, connects to the `mongo` service, seeds on first run |
| `mongo` (MongoDB 8) | localhost:27017 | data persists in the `mongo-data` named volume |

- The API waits for Mongo to be healthy, then connects to `mongodb://mongo:27017/kitchensync` and seeds users + per-branch orders on first run.
- Data **survives** `docker compose down` + `up` (named volume). `docker compose down -v` wipes it.
- Files: `Dockerfile` (API), `web.Dockerfile` + `nginx.conf` (frontend), `docker-compose.yml`, `.dockerignore`. Compose uses local dev values only — no secrets. The existing Vercel/Railway/Render deploy configs are unchanged.

Stop with `Ctrl-C` (or `docker compose down`). Running without Docker (against Atlas or
the in-memory store) still works exactly as below.

## Data Model & Persistence

The API runs on either an **in-memory store** (default) or **MongoDB via Mongoose**,
chosen by `DATA_SOURCE`. Both implement the same async repository interfaces, so
controllers/routes are identical. Full schema + indexes: [`docs/DATA-MODEL.md`](docs/DATA-MODEL.md).

### Embedded vs referenced

| Collection | Field | Modelling | Why |
|---|---|---|---|
| `orders` / `deliveries` | `items[]` | **Embedded** | Bounded (a handful per order) and *always* read/written together with the order — never queried on their own. One document = one atomic read/write. |
| `orders` / `deliveries` | `history[]` | **Embedded** | Append-only, small, and only ever shown inside that order's timeline. Embedding keeps the whole audit trail in one place with the order. |
| `orders` / `deliveries` | `branchId` | **Referenced** (string id) | Branches are a small, stable set defined in app data; storing the id avoids duplicating branch info and lets us index/filter by branch. |
| `orders` / `deliveries` | `waiter` / `chef` / `rider` | **Referenced by name** | Staff are a separate `users` collection; assignments are lightweight labels and staff records evolve independently. |
| `users` | — | Own collection | Read for auth and staff dropdowns, independent lifecycle; never embedded into orders. |

The read/write pattern drives it: a board reads *all of an order at once* (items +
history + status), so embedding beats joins; staff and branches are shared, slowly
changing, and referenced by id/name.

### Concurrency strategy

Every order/delivery carries a `version` integer. Mutations use **optimistic
concurrency**: the client sends the `expectedVersion` it last saw, and the Mongo repo
applies the change with an **atomic** `findOneAndUpdate({ id, version }, { $set…, $inc:{version:1} })`.
If the stored version has moved on, the guarded update matches nothing → the API returns
**409** with the current `version`/`lastUpdatedBy`/`lastUpdatedAt` instead of silently
overwriting. This avoids lost updates when two staff act on the same ticket, without
long-held locks — a good fit for a fast, multi-user board.

### Client-side persistence

The frontend keeps a **localStorage cache** per branch/board: on load the board hydrates
instantly from cache, then reconciles with the API. In-progress work therefore survives a
refresh or a brief network drop (the bottom status bar flips to *Disconnected* rather than
losing the action) — satisfying "renders from local storage / works offline" without a
sync engine like PouchDB. The API remains the source of truth.

### Running against MongoDB

Set these in `.env` (already configured for this project against **MongoDB Atlas**):

```bash
DATA_SOURCE=mongo
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/kitchensync   # Atlas
npm run server    # logs "MongoDB connected" and seeds on first run
```

Prefer a local DB? Run Mongo in Docker and point the URI at it:

```bash
docker run -d -p 27017:27017 --name ks-mongo mongo:8
MONGODB_URI=mongodb://127.0.0.1:27017/kitchensync
```

The in-memory store (`DATA_SOURCE=memory`, the default) needs no database and behaves
identically for the same requests. Data written in `mongo` mode **survives a server
restart**; the in-memory store resets each process start.

## Project structure

```
src/
  App.tsx                 # routing, boards, API wiring
  components/             # kitchen + delivery UI
  pages/                  # Login, Signup, SelectBoard, SelectBranch
  data/branches/          # per-city seed orders (one file per branch)
  hooks/                  # conflict guard, update flash
  lib/api.ts              # typed HTTP client + JWT storage
  lib/boardConfig.ts      # stages + board accents
  types.ts                # Order, DeliveryOrder, roles, stages
server/
  index.ts / app.ts       # API entry + app factory
  controllers/            # auth, orders, deliveries, users
  repositories/memory/    # in-memory store, seeded per branch
  routes/                 # /api routers
  middleware/             # JWT, errors, validation
```

### localStorage keys (offline cache)

| Key | Purpose |
| --- | --- |
| `kitchensync_token` | JWT for the current session |
| `kitchensync_user` | Cached current user |
| `kitchensync_orders_kitchen_v1` | Kitchen orders cache |
| `kitchensync_orders_delivery_v1` | Delivery orders cache |
| `kitchensync_active_board_v1` | Last selected board |

## Demo notes

- The API seeds from `src/data/` on boot; state resets when the server restarts.
- Passwords are bcrypt-hashed. `JWT_SECRET` comes from the environment.
- Multi-user Socket.IO sync is a later milestone.

## Testing

Automated tests run on **both tiers** with [Vitest](https://vitest.dev):

- **Server** — Supertest integration tests against the Express app (`server/tests/*`): health, auth (register/login/`/me`/401), orders & deliveries CRUD, optimistic-concurrency **409**, aggregation stats, and 404 guards.
- **Client** — React Testing Library + jsdom (`src/**/*.test.tsx`): the `Avatar`, `OrderCard`, and `NewOrderModal` components, plus the `src/lib/api.ts` client (token handling + typed errors).

```bash
npm test               # run everything once
npm run test:watch     # watch mode
npm run test:coverage  # + HTML/lcov report in ./coverage
```

Tests use the **in-memory store** (`DATA_SOURCE=memory`) and mocked fetch — **no MongoDB required**, so they run anywhere. **CI** (GitHub Actions, `.github/workflows/ci.yml`) runs `npm run lint` + `npm run test:coverage` on every push and pull request to `main`, and uploads the coverage report as an artifact.

## License

Apache-2.0
