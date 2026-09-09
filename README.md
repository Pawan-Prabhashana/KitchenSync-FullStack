# KitchenSync

[![CI](https://github.com/Pawan-Prabhashana/KitchenSync-FullStack/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Pawan-Prabhashana/KitchenSync-FullStack/actions/workflows/ci.yml)

**Live demo:** [https://kitchensync-ten.vercel.app](https://kitchensync-ten.vercel.app)

KitchenSync is a dual-board restaurant ops app for **dine-in kitchen** and **delivery dispatch** across **8 Sri Lankan city branches**. Staff log in with JWT, pick a branch and board, move tickets through stages, and keep a local cache if the API drops.

The stack is React (Vite) + an Express REST API. Persistence is either an **in-memory store** or **MongoDB (Mongoose)**. Docker Compose runs Mongo + API + nginx frontend together.

## Requirements

- Node.js **18+** (GitHub Actions uses **22** because Vitest 5 / jsdom 30 need it)
- npm
- Optional: Docker Desktop, for the full Mongo + API + web stack

## How to run (local, npm)

```bash
git clone https://github.com/Pawan-Prabhashana/KitchenSync-FullStack.git
cd KitchenSync-FullStack
npm install
cp .env.example .env
npm run dev:all
```

- App: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:4000](http://localhost:4000)
- Health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

This default uses `DATA_SOURCE=memory` (no database). The in-memory store is seeded from `src/data/` on boot and **resets when the API process restarts**.

Two terminals instead of `dev:all`:

```bash
npm run server    # API on :4000
npm run dev       # Vite on :3000
```

### Demo login

All seeded users share the password **`kitchen123`**.

Example: `priya@kitchensync.com` / `kitchen123`

Use the quick-login buttons on the login page (they hit the API). Seeded staff are in `src/data/menu.ts`.

### Environment

Copy `.env.example` to `.env`. Do not commit `.env`.

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default `4000`) |
| `JWT_SECRET` | Signs JWTs (required in production) |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CORS_ORIGIN` | Allowed frontend origin (`http://localhost:3000` in dev) |
| `VITE_API_URL` | Frontend → API base URL (baked in at **Vite build** time) |
| `DATA_SOURCE` | `memory` (default) or `mongo` |
| `MONGODB_URI` | Required when `DATA_SOURCE=mongo` |

## How to run (Docker)

MongoDB + Express + static frontend:

```bash
docker compose up --build
```

| Service | URL | Notes |
| --- | --- | --- |
| `web` | http://localhost:3000 | nginx serving the Vite build (`VITE_API_URL=http://localhost:4000`) |
| `api` | http://localhost:4000 | `DATA_SOURCE=mongo`, seeds on first run |
| `mongo` | localhost:27017 | data in the `mongo-data` volume |

The API waits until Mongo is healthy, then connects to `mongodb://mongo:27017/kitchensync`. Data **survives** `docker compose down`. Wipe it with `docker compose down -v`.

Stop with `Ctrl-C` or `docker compose down`.

Compose files: `Dockerfile` (API), `web.Dockerfile` + `nginx.conf` (frontend), `docker-compose.yml`, `.dockerignore`. Compose uses local-dev values only — no production secrets.

## MongoDB without full Compose

Atlas (put the URI in `.env`, never commit it):

```bash
DATA_SOURCE=mongo
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/kitchensync
npm run server
```

Local Mongo only:

```bash
docker run -d -p 27017:27017 --name ks-mongo mongo:8
# in .env: DATA_SOURCE=mongo  MONGODB_URI=mongodb://127.0.0.1:27017/kitchensync
npm run server
```

The server logs Mongo connected and seeds users + per-branch orders on first run. Data in `mongo` mode **survives API restarts**.

## What’s in the app

- **8 branches:** Colombo, Galle, Kandy, Jaffna, Negombo, Kurunegala, Anuradhapura, Batticaloa
- **Kitchen board:** New → Cooking → Ready → Served (chefs, tables, notes, history, analytics)
- **Delivery board:** Preparing → Ready for Pickup → Out for Delivery → Delivered (riders, ETA, payment, distance)
- **JWT auth:** `register` / `login` / `me`; bcrypt passwords; protected order/delivery/user routes
- **CRUD** under `/api/orders` and `/api/deliveries`, plus aggregation **stats**
- **Optimistic concurrency:** `PATCH` with `expectedVersion` → **409** on a stale write
- **Offline cache:** `localStorage` hydrates the UI if the API is briefly unreachable

Full HTTP contract: [`docs/API.md`](docs/API.md). Schema and embed-vs-reference notes: [`docs/DATA-MODEL.md`](docs/DATA-MODEL.md).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev:all` | API + Vite together |
| `npm run server` | API on `PORT` (default 4000) |
| `npm run server:dev` | API in watch mode |
| `npm run dev` | Vite on port 3000 |
| `npm run build` | Production frontend build |
| `npm run lint` | Typecheck (`tsc --noEmit`) |
| `npm test` | Vitest once |
| `npm run test:watch` | Vitest watch |
| `npm run test:coverage` | Coverage under `./coverage` |

## Tests and CI

Vitest covers both tiers. Tests force `DATA_SOURCE=memory` — **no Mongo required**.

- **Server** (`server/tests/`): health, auth, orders/deliveries CRUD, **409** conflicts, stats, 404s (Supertest)
- **Client** (`src/**/*.test.tsx`): Avatar, OrderCard, NewOrderModal, `src/lib/api.ts`

GitHub Actions (`.github/workflows/ci.yml`) on every push/PR to `main`: `npm ci` → `npm run lint` → `npm run test:coverage` (Node 22).

## Project structure

```
src/                  React app (boards, pages, API client, per-city seeds)
  data/branches/      one seed file per city
  lib/api.ts          typed HTTP client + JWT in localStorage
server/
  index.ts / app.ts   API entry
  routes/             /api/health, auth, orders, deliveries, users
  controllers/
  repositories/memory | mongo   same interfaces, swap via DATA_SOURCE
  db/                 Mongoose connection, models, seed, aggregations
  middleware/         JWT, errors, validation
docs/                 API.md, DATA-MODEL.md
Dockerfile            API image (tsx, port 4000)
web.Dockerfile        Vite build → nginx
docker-compose.yml    mongo + api + web
.github/workflows/ci.yml
```

### localStorage keys

| Key | Purpose |
| --- | --- |
| `kitchensync_token` | JWT |
| `kitchensync_user` | Cached user |
| `kitchensync_orders_kitchen_v1` | Kitchen cache |
| `kitchensync_orders_delivery_v1` | Delivery cache |
| `kitchensync_active_board_v1` | Last selected board |

## Production frontend (Vercel)

`VITE_API_URL` is baked in at **build** time:

```bash
echo 'VITE_API_URL=https://your-api-host' > .env.production
npm run build
```

Host `dist/` on Vercel. Point `CORS_ORIGIN` on the API at the Vercel origin. Railway / Render configs in the repo are unchanged.

## License

Apache-2.0
