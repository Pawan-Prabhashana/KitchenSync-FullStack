# KitchenSync — Data Model

MongoDB (via Mongoose) with three collections: **users**, **orders**, **deliveries**.
Entities use their own **string `id`** as the primary key (e.g. `ORD-COL-1001`) — Mongo's
`_id`/`__v` are stripped from every API response. `orders` and `deliveries` **embed**
their `items` and `history` as subdocuments. Both carry a `version` integer for
optimistic concurrency and a `branchId` linking them to a branch.

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "assigned as chef (by name)"
    USERS ||--o{ DELIVERIES : "assigned as rider (by name)"
    ORDERS ||--|{ ORDER_ITEMS : embeds
    ORDERS ||--o{ ORDER_HISTORY : embeds
    DELIVERIES ||--|{ DELIVERY_ITEMS : embeds
    DELIVERIES ||--o{ DELIVERY_HISTORY : embeds

    USERS {
        string id PK "unique, e.g. u1"
        string name
        string email UK "unique, lowercased"
        string role "waiter|chef|admin|rider"
        string avatar "optional"
        string passwordHash "bcrypt — never returned by the API"
    }

    ORDERS {
        string id PK "unique, e.g. ORD-COL-1001"
        string branchId FK "indexed"
        string tableNumber
        string stage "New|Cooking|Ready|Served (status)"
        string waiter
        string chef "optional"
        string specialNotes "optional"
        string createdAt
        number createdAtTimestamp "indexed for sort"
        string servedAt "optional"
        number servedAtTimestamp "optional"
        string lastUpdatedBy
        string lastUpdatedAt
        number version "optimistic-concurrency counter"
        array  items "embedded ORDER_ITEMS"
        array  history "embedded ORDER_HISTORY"
    }

    ORDER_ITEMS {
        string id
        string name
        number quantity
        string notes "optional"
    }

    ORDER_HISTORY {
        string id
        string stage
        string timestamp
        string user
        string role
    }

    DELIVERIES {
        string id PK "unique, e.g. DEL-COL-2001"
        string branchId FK "indexed"
        string customerName
        string address
        number distanceKm
        string stage "Preparing|Ready for Pickup|Out for Delivery|Delivered (status)"
        string rider "optional"
        string paymentMethod "Cash|Card|Online"
        number orderTotal
        number etaMinutes
        string specialNotes "optional"
        string createdAt
        number createdAtTimestamp "indexed for sort"
        string deliveredAt "optional"
        number deliveredAtTimestamp "optional"
        string lastUpdatedBy
        string lastUpdatedAt
        number version "optimistic-concurrency counter"
        array  items "embedded DELIVERY_ITEMS"
        array  history "embedded DELIVERY_HISTORY"
    }

    DELIVERY_ITEMS {
        string id
        string name
        number quantity
        string notes "optional"
    }

    DELIVERY_HISTORY {
        string id
        string stage
        string timestamp
        string user
        string role
    }
```

## Indexes

| Collection | Index | Serves |
|---|---|---|
| users | `{ id: 1 }` unique | primary-key lookup |
| users | `{ email: 1 }` unique (lowercased) | login / register duplicate guard (→ 409) |
| orders | `{ id: 1 }` unique | `findById`, PATCH/DELETE |
| orders | `{ branchId: 1, stage: 1 }` | `/orders/stats` aggregation + stage-filtered board reads |
| orders | `{ branchId: 1, createdAtTimestamp: -1 }` | `findAll(branchId)` newest-first |
| deliveries | `{ id: 1 }` unique | `findById`, PATCH/DELETE |
| deliveries | `{ branchId: 1, stage: 1 }` | `/deliveries/stats` aggregation + stage-filtered reads |
| deliveries | `{ branchId: 1, createdAtTimestamp: -1 }` | `findAll(branchId)` newest-first |

> `stage` is this domain's "status" field; `createdAtTimestamp` is the sortable numeric
> form of `createdAt`.

## Aggregation

`GET /api/orders/stats?branchId=…` and `GET /api/deliveries/stats?branchId=…` run a real
Mongo pipeline — `$match` (branch) → `$group` (by `stage`, and by `chef`/`rider` with
`$ifNull → "Unassigned"`) → `$sort` — returning `{ branchId, total, byStatus[], byChef|byRider[] }`.
In memory mode the same shape is computed in code so the endpoint behaves identically.
