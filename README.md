<div align="center">

# 🍳 KitchenSync

**Real-time restaurant operations for the kitchen line and the delivery fleet — across 8 branches.**

[![CI](https://github.com/Pawan-Prabhashana/KitchenSync-FullStack/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Pawan-Prabhashana/KitchenSync-FullStack/actions/workflows/ci.yml)
[![Live demo](https://img.shields.io/badge/demo-live-brightgreen)](https://kitchensync-ten.vercel.app)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](#license)

[Live demo](https://kitchensync-ten.vercel.app) · [API contract](docs/API.md) · [Data model](docs/DATA-MODEL.md)

</div>

---

KitchenSync is a dual-board restaurant ops app. Waiters, chefs, and riders sign in,
pick a **branch** and a **board**, and move order tickets through their stages in real
time. It ships with JWT auth, a versioned REST API, optimistic-concurrency conflict
handling, an offline cache, and a one-command Docker stack.

Built as a full-stack milestone project: **React (Vite) frontend + Express REST API**,
with data in an **in-memory store** or **MongoDB (Mongoose)** — switchable with one env var.

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start-local)
- [Demo login](#demo-login)
- [Run with Docker](#run-with-docker)
- [Using MongoDB](#using-mongodb)
- [Environment variables](#environment-variables)
- [API](#api)
- [Testing & CI](#testing--ci)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Deployment](#deployment)

## Features

- **Two boards, one app**
  - 🧑‍🍳 **Kitchen:** `New → Cooking → Ready → Served` — assign chefs, tables, notes, history, analytics.
  - 🛵 **Delivery:** `Preparing → Ready for Pickup → Out for Delivery → Delivered` — riders, ETA, payment, distance.
- **8 city branches** — Colombo, Galle, Kandy, Jaffna, Negombo, Kurunegala, Anuradhapura, Batticaloa — each with its own independent data.
- **JWT auth** — register / login / me, bcrypt-hashed passwords, protected routes, role-based staff (waiter / chef / rider / admin).
- **Versioned writes** — every `PATCH` can send `expectedVersion`; a stale write is rejected with **409** and the current server state, so two staff never silently overwrite each other.
- **Aggregation stats** — `/api/orders/stats` and `/api/deliveries/stats` group live counts by status and by assignee.
- **Offline-friendly** — the UI hydrates instantly from a `localStorage` cache and reconciles with the API; a brief network drop doesn't lose in-progress work.
- **Swappable persistence** — identical repository interfaces back both the in-memory store and MongoDB; flip `DATA_SOURCE` to choose.

## Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Motion |
| Backend | Node.js, Express, JWT (`jsonwebtoken`), `bcryptjs` |
| Database | MongoDB via Mongoose (or in-memory store) |
| Tests / CI | Vitest, Testing Library, Supertest, GitHub Actions |
| Container | Docker + Docker Compose (Mongo + API + nginx) |

## Quick start (local)

**Requirements:** Node.js **18+** (CI runs on **22**), npm. Docker is optional.

```bash
git clone https://github.com/Pawan-Prabhashana/KitchenSync-FullStack.git
cd KitchenSync-FullStack
npm install
cp .env.example .env
npm run dev:all
```

| Service | URL |
| --- | --- |
| App | http://localhost:3000 |
| API | http://localhost:4000 |
| Health | http://localhost:4000/api/health |

The default is `DATA_SOURCE=memory` — **no database needed**. The store is seeded from
`src/data/` on boot and resets when the API restarts. Prefer two terminals? Run
`npm run server` and `npm run dev` separately.

## Demo login

All seeded staff share the password **`kitchen123`**.

```
priya@kitchensync.com  /  kitchen123
```

Or just tap a **quick-login** button on the sign-in page. Seeded staff live in `src/data/menu.ts`.

## Run with Docker

Bring up **MongoDB + API + frontend** together:

```bash
docker compose up --build
```

| Service | URL | Notes |
| --- | --- | --- |
| `web` | http://localhost:3000 | nginx serving the Vite build |
| `api` | http://localhost:4000 | `DATA_SOURCE=mongo`, seeds on first run |
| `mongo` | localhost:27017 | data stored in the `mongo-data` volume |

The API waits for Mongo to become healthy, connects to `mongodb://mongo:27017/kitchensync`,
and seeds users + per-branch orders on first run. Data **survives** `docker compose down`;
`docker compose down -v` wipes the volume. Stop with `Ctrl-C` or `docker compose down`.

## Using MongoDB (without full Compose)

Point the API at any MongoDB by setting two env vars, then `npm run server`.

**Atlas** (never commit the URI):

```bash
DATA_SOURCE=mongo
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/kitchensync
```

**Local Mongo in Docker:**

```bash
docker run -d -p 27017:27017 --name ks-mongo mongo:8
# .env:  DATA_SOURCE=mongo   MONGODB_URI=mongodb://127.0.0.1:27017/kitchensync
```

On first run the server logs `MongoDB connected` and seeds the data; in `mongo` mode it
**persists across API restarts**.

## Environment variables

Copy `.env.example` → `.env` (git-ignored — never commit it).

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default `4000`) |
| `JWT_SECRET` | Signs JWTs (required in production) |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CORS_ORIGIN` | Allowed frontend origin (`http://localhost:3000` in dev) |
| `VITE_API_URL` | Frontend → API base URL, baked in at **Vite build** time |
| `DATA_SOURCE` | `memory` (default) or `mongo` |
| `MONGODB_URI` | Connection string, required when `DATA_SOURCE=mongo` |

## API

Base URL `http://localhost:4000`, everything under `/api`, JSON in and out. JWT bearer
token required on all routes except `health`, `register`, and `login`.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness + data source / DB status |
| `POST` | `/api/auth/register` · `/api/auth/login` | Get a `{ token, user }` |
| `GET` | `/api/auth/me` | Current user from the token |
| `GET/POST/PATCH/DELETE` | `/api/orders` | Kitchen orders (scoped by `?branchId=`) |
| `GET/POST/PATCH/DELETE` | `/api/deliveries` | Delivery orders |
| `GET` | `/api/orders/stats` · `/api/deliveries/stats` | Aggregated counts |
| `GET` | `/api/users` | Staff directory (never leaks password hashes) |

Full request/response shapes, error codes, and the 409 concurrency contract are in
**[`docs/API.md`](docs/API.md)**; the schema and embed-vs-reference rationale in
**[`docs/DATA-MODEL.md`](docs/DATA-MODEL.md)**.

## Testing & CI

Vitest runs across both tiers and forces `DATA_SOURCE=memory`, so **tests need no database**.

```bash
npm test               # run once
npm run test:watch     # watch mode
npm run test:coverage  # HTML + lcov report in ./coverage
```

- **Server** (`server/tests/`, Supertest): health, auth, orders/deliveries CRUD, **409** conflicts, stats, 404 guards.
- **Client** (`src/**/*.test.tsx`, Testing Library): `Avatar`, `OrderCard`, `NewOrderModal`, and the `src/lib/api.ts` client.

**GitHub Actions** (`.github/workflows/ci.yml`) runs `npm ci → lint → test:coverage` on
Node 22 for every push and PR to `main`, and uploads the coverage report as an artifact.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev:all` | API + Vite together |
| `npm run dev` | Vite dev server (:3000) |
| `npm run server` | API (:4000); `server:dev` for watch mode |
| `npm run build` | Production frontend build → `dist/` |
| `npm run lint` | Typecheck (`tsc --noEmit`) |
| `npm test` / `test:coverage` | Vitest / with coverage |

## Project structure

```
src/                     React app
  components/            boards, cards, drawers, modals, Avatar
  pages/                 login, signup, select-branch, select-board
  data/branches/         one seed file per city
  lib/api.ts             typed HTTP client (JWT in localStorage)
server/
  index.ts · app.ts      API entry + express app factory
  routes/                health, auth, orders, deliveries, users
  controllers/
  repositories/          memory | mongo  (same interfaces, swap via DATA_SOURCE)
  db/                    Mongoose connection, models, seed, aggregations
  middleware/            JWT auth, error handler, validation
  utils/                 versioning (409), ids, jwt, http errors
docs/                    API.md, DATA-MODEL.md
Dockerfile               API image (tsx, :4000)
web.Dockerfile           Vite build → nginx
docker-compose.yml       mongo + api + web
```

**localStorage keys:** `kitchensync_token`, `kitchensync_user`,
`kitchensync_orders_kitchen_v1`, `kitchensync_orders_delivery_v1`,
`kitchensync_active_board_v1`.

## Deployment

The frontend is a static Vite build; `VITE_API_URL` is inlined at **build time**:

```bash
echo 'VITE_API_URL=https://your-api-host' > .env.production
npm run build     # deploy dist/ (e.g. Vercel)
```

Deploy the API to any Node host (Railway / Render configs are included), set its
`CORS_ORIGIN` to the frontend origin, and point `MONGODB_URI` at your database.

## License

Apache-2.0
