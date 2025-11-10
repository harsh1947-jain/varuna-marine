
````markdown
#  Varuna Marine — Fuel EU Maritime Compliance System

This project implements a **Fuel EU Maritime Compliance Module** using a full-stack, modular architecture designed with **Node.js**, **Fastify**, **PostgreSQL**, and a **React + TailwindCSS** dashboard.
It follows **Hexagonal Architecture (Ports & Adapters)** for clean separation between domain logic, application services, and infrastructure.

---

##  Project Structure

```bash
Varuna Marine/
├── Backend/
│   ├── src/
│   │   ├── domain.ts
│   │   ├── ports.ts
│   │   ├── services.ts
│   │   ├── postgres_adapter.ts
│   │   └── main.ts
│   ├── init.sql
│   ├── package.json
│   └── tsconfig.json
│
└── fuel-eu-dashboard/
    ├── src/
    │   ├── components/
    │   │   ├── Tabs.jsx
    │   │   ├── RoutesTab.jsx
    │   │   ├── CompareTab.jsx
    │   │   ├── BankingTab.jsx
    │   │   └── PoolingTab.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js
    └── package.json
````

-----

##  Architecture Overview

###  Backend (Node.js + Fastify + TypeScript)

Implements Fuel EU logic for:

  * Managing Routes and baselines
  * Computing Compliance Balances (CB)
  * Executing Banking (surplus carry-over)
  * Running Pooling (ship CB redistribution)

Backend follows **Hexagonal Architecture**, ensuring:

  * **Domain layer:** pure business logic
  * **Ports:** abstract interfaces for DB adapters
  * **Adapters:** PostgreSQL and HTTP handlers
  * **Application services:** use-case orchestration

###  Frontend (React + Vite + TailwindCSS)

Provides an interactive dashboard with 4 main tabs:

  * **Routes:** View and set baseline routes
  * **Compare:** Show baseline vs others (percent diff, compliance flag)
  * **Banking:** Bank or apply compliance surpluses
  * **Pooling:** Group ships for compliance redistribution

-----

##  Setup Instructions

###  Clone the repository

```bash
git clone [https://github.com/harsh1947-jain/varuna-marine.git](https://github.com/harsh1947-jain/varuna-marine.git)
cd "Varuna Marine"
```

###  Start PostgreSQL via Docker

```bash
docker rm -f fuel-eu-db || true
docker run -d --name fuel-eu-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=fueleu \
  -v $(pwd)/Backend/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -p 5432:5432 postgres:16
```

Verify tables:

```bash
docker exec -it fuel-eu-db psql -U admin -d fueleu -c "SELECT COUNT(*) FROM routes;"
```

###  Run the Backend

```bash
cd Backend
npm install
npm run dev
# Default: http://localhost:3000
```

###  Run the Frontend

```bash
cd ../fuel-eu-dashboard
npm install
npm run dev
# Default: http://localhost:5173
```

-----

##  API Endpoints

###  Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/routes` | List all routes |
| POST | `/routes/:id/baseline` | Set a route as baseline |
| GET | `/routes/comparison` | Compare routes to baseline |

###  Compliance

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/compliance/cb?shipId&year` | Get Compliance Balance (CB) snapshot |
| GET | `/compliance/adjusted-cb?shipId&year` | Compute CB with banked surplus applied |

###  Banking

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/banking/bank` | Bank surplus from a ship |
| POST | `/banking/apply` | Apply banked surplus to a deficit year |

###  Pooling

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/pools` | Create a compliance pool between ships |

-----

##  Example Tests

### Banking Test

```bash
curl -X POST http://localhost:3000/banking/bank \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP_A","year":2025,"amount":500}'

# → { "success": true, "message": "Banked 500 for SHIP_A" }
```

### Pooling Test

```bash
curl -X POST http://localhost:3000/pools \
  -H "Content-Type: application/json" \
  -d '{"year":2025,"shipIds":["SHIP_A_SURPLUS","SHIP_B_DEFICIT","SHIP_C_DEFICIT"]}'

# → { "pool_id": 1, "status": "FORMED", "members": [...] }
```

-----

##  Tests & Validation

### Backend (Jest + Supertest)

```bash
cd Backend
npm test
```

### Frontend (Vitest + React Testing Library)

```bash
cd fuel-eu-dashboard
npm test
```

## File:

##  Documentation Files

| File | Purpose |
| :--- | :--- |
| `AGENT_WORKFLOW.md` | Logs of all AI agent prompts, outputs, and corrections |
| `REFLECTION.md` | Lessons learned using AI for development |
| `init.sql` | Complete PostgreSQL schema and seed data |

-----

##  Development Notes

  * Follows Hexagonal (Clean) Architecture principles
  * Uses TypeScript for backend safety and TailwindCSS for frontend styling
  * Tested locally with Docker + Vite dev servers
  * Includes AI-assisted workflows documented for traceability

-----

##  Tech Stack Summary

| Layer | Technology |
| :--- | :--- |
| Backend | Node.js + Fastify + TypeScript |
| Database | PostgreSQL (Dockerized) |
| Frontend | React + Vite + TailwindCSS |
| Architecture | Hexagonal (Ports & Adapters) |
| AI Tools | ChatGPT, Copilot, Claude, Cursor |

-----

##  Status

| Component | State | Notes |
| :--- | :--- | :--- |
| Backend APIs |  Complete | Routes, Banking, Pooling tested |
| Database Seed |  Complete | 60 total routes, 3 baselines |
| Frontend Tabs |  Complete | Connected and tested with backend |
| Docs |  Done | AI Agent Workflow, README, Reflection |

```
```


