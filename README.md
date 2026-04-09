# Smart Campus Transportation System

Monorepo with a **Node.js + Express + MongoDB** API and a **React (Vite)** web app.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ recommended  
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (default: `mongodb://127.0.0.1:27017`)

## Backend

1. Ensure MongoDB is running.
2. Configure environment variables in `backend/config/.env` (already present with defaults).
3. Install and start:

```bash
cd backend
npm install
npm run seed
npm run dev
```

The API listens on **http://localhost:5000** (see `PORT` in `backend/config/.env`).

**Swagger UI:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs) — interactive docs and **Try it out**. Use **Authorize** with a JWT from login/register (`Bearer <token>`). Raw OpenAPI JSON: `/api-docs.json`.

The optional **`npm run seed`** command creates:

- An **ADMIN** user: **`admin@campus.local`** / **`admin12345`** (11 characters — include the final `5`). Override with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `backend/config/.env` if you like.
- Sample **gates** and **cars** so trip requests can be assigned immediately

**Admin login fails (“Invalid email or password”)?**

1. Run **`npm run seed`** at least once while MongoDB is running (otherwise the admin user does not exist).
2. If the admin was created earlier with a different password, reset it (PowerShell):

   `$env:SEED_RESET_ADMIN_PASSWORD="1"; npm run seed`

   Or add `SEED_RESET_ADMIN_PASSWORD=1` to `backend/config/.env`, run `npm run seed`, then remove it.

### Admin UI (frontend)

When logged in as **ADMIN**, the home dashboard shows management shortcuts. The nav adds **Users**, **All trips**, **Cars**, **Gates**, and **Routes** (gate A → gate B with an admin-defined **digit**). Non-admin users still see only **Request trip** and **My trips**.

### Main HTTP routes

| Area | Method | Path | Notes |
|------|--------|------|--------|
| Paths | GET/POST | `/api/paths` | **ADMIN** — directed routes between gates; body: `fromGateId`, `toGateId`, `digit` (non‑negative integer) |
| Paths | PATCH/DELETE | `/api/paths/:id` | **ADMIN** |
| Auth | POST | `/api/auth/register` | Body: `email`, `password`, `full_name`, `role` (`FACULTY` \| `DISABLED`) |
| Auth | POST | `/api/auth/login` | Body: `email`, `password` |
| Users | GET | `/api/users/me` | JWT required |
| Users | GET/PATCH/DELETE | `/api/users`, `/api/users/:id` | **ADMIN** |
| Cars | GET | `/api/cars/available` | Authenticated — vehicles with `isAvailable: true` (for booking UI) |
| Trips | POST | `/api/trips/request` | Body: `fromGateId`, `toGateId`, **`carId`** (must be available). Requires a **Routes** record for the pair (**digit** stored). Trip is created as **ASSIGNED** with that vehicle. Other **PENDING** trips still get auto-assigned cars when one frees up |
| Trips | GET | `/api/trips/my` | Current user’s trips |
| Trips | GET | `/api/trips` | **ADMIN** – all trips |
| Trips | PATCH | `/api/trips/:id/status` | **ADMIN** – body: `status`: `IN_PROGRESS` or `COMPLETED` (and auto re-assigns cars when completed) |
| Cars / Gates | CRUD | `/api/cars`, `/api/gates` | **GET** gates uses JWT (for pickup list); **write** operations **ADMIN** |

## Frontend

1. Point the API URL (optional): `frontend/.env` sets `VITE_API_URL=http://localhost:5000/api`.
2. Install and run:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**).

Register as **Faculty** or **Accessible mobility**, log in, then use **Request trip** and **My trips** from the dashboard.

## Trip status flow

`PENDING` → `ASSIGNED` (automatic when a vehicle is free) → `IN_PROGRESS` → `COMPLETED` (admin updates the last two steps via API).

Each trip stores a **start gate** (`fromGateId`) and **destination gate** (`toGateId`). If you upgraded from an older version that only had a single `gate` field, clear old trips in MongoDB (e.g. `db.trips.deleteMany({})`) or they may not load correctly.

When a trip is marked **COMPLETED**, its vehicle is freed and **pending** trips are re-evaluated with the same priority rules.
