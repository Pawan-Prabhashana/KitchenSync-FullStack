# KitchenSync

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

## License

Apache-2.0
