# KitchenSync

**Live demo:** [https://kitchensync-m1-static-skeleton-1.vercel.app/](https://kitchensync-m1-static-skeleton-1.vercel.app/)

KitchenSync is a dual-board restaurant ops UI for **dine-in kitchen** and **delivery dispatch**. Waiters, chefs, and riders can create orders, advance stages, assign staff, and review history — with conflict guards and local persistence for demos.

> Milestone 1 (M1) static skeleton: frontend-only with demo auth and `localStorage` persistence. Real-time Socket.IO sync is planned for later milestones.

## What’s new in M1

- **Dual boards** — pick Kitchen or Delivery after login; switch anytime
- **Board-aware UI** — header, sidebar, accents, and views adapt per board
- **Delivery domain** — customer, address, distance, rider, ETA, payment, order total
- **Shared conflict guard** — version / last-updated checks on both boards (with demo simulate)
- **Separate persistence** — kitchen and delivery orders saved under different `localStorage` keys
- **Auth + routing** — login / signup pages and a board picker (`#/login`, `#/signup`, `#/select-board`)

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
- Demo login / signup flow (hash-based routes)
- Urgency / timer cues on aging orders
- Conflict guard when an order was updated by someone else
- Filters, search, and “mine” view modes where applicable
- Bottom status bar for live board context

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Motion (animations)
- Lucide icons
- Socket.IO packages present for upcoming real-time work (not wired as the primary sync layer in M1)

## Quickstart

```bash
npm install
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/).

### Production build

```bash
npm run build
npm start   # vite preview on port 3000
```

### Lint / typecheck

```bash
npm run lint
```

## Project structure

```
src/
  App.tsx                 # routing, dual-board state, persistence
  components/             # kitchen + delivery UI
  pages/                  # Login, Signup, SelectBoard
  data/                   # demo users, menu, seed orders
  hooks/                  # conflict guard, update flash
  lib/boardConfig.ts      # stages + board accents
  types.ts                # Order, DeliveryOrder, roles, stages
```

### localStorage keys

| Key | Purpose |
| --- | --- |
| `kitchensync_orders_kitchen_v1` | Kitchen orders |
| `kitchensync_orders_delivery_v1` | Delivery orders |
| `kitchensync_active_board_v1` | Last selected board |
| `kitchensync_orders_v1` | Legacy single-board key (migrated if present) |

## Demo notes

- Uses hardcoded demo users / riders and seed orders under `src/data/`.
- Designed as a local-first M1 skeleton for coursework demos and UI review.
- Backend auth, multi-user Socket.IO sync, and production persistence are out of scope for this milestone.

## License

Apache-2.0
