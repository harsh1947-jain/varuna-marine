# AI Agent Workflow Log — Varuna Marine Project

## Agents Used

| Agent | Role | Purpose |
|---|---|---|
| **ChatGPT (GPT-5)** | Core architect | Designed backend hexagonal structure, banking/pooling logic, documentation |
| **GitHub Copilot** | Inline coder | Assisted with TS/React code, minor fixes, and boilerplate completion |
| **Claude Code (Anthropic)** | SQL generator | Expanded `init.sql` with 20 routes per year for 2024-2026 |
| **Cursor Agent** | Refactor assistant | Automated edits and modularization inside `src` |
| **Copilot Chat (VSCode)** | Quick checks | Helped debug TypeScript and linting issues interactively |

---

## Prompts & Outputs

### Example 1 — Backend Routes Integration

* **Prompt:**
    > “Integrate Fastify backend routes for routes, compliance, banking, and pooling using hexagonal architecture.”
* **Agent Output:**
    * Created modular structure under `/src` with `domain.ts`, `ports.ts`, `services.ts`, `postgres_adapter.ts`, and `main.ts`.
* **Manual Fixes:**
    * Replaced missing `updateCB` method with `incrementCB`.
    * Standardized error responses and added 400/500 handling.

### Example 2 — SQL Seeding

* **Prompt:**
    > “Create `init.sql` for 20 routes per year (2024-2026) with compliance and banking tables.”
* **Agent Output:**
    * Produced a fully relational schema and seed data (60 total routes).
* **Manual Fixes:**
    * Ensured unique `(route_id, year)` constraints.
    * Added one baseline per year.
    * Verified via Docker:
    ```bash
    docker exec -it fuel-eu-db psql -U admin -d fueleu -c "SELECT COUNT(*) FROM routes;"
    ```

### Example 3 — Frontend Tabs (Vite + React)

* **Prompt:**
    > “Create simple Vite app with tabs for Routes, Compare, Banking, and Pooling integrated to backend.”
* **Agent Output:**
    * Generated a Tailwind-based tab layout with `fetch` API calls and comparison charts.
* **Manual Fixes:**
    * Converted TypeScript to JavaScript with comment-based types.
    * Added proper user-facing error messages on fetch failure.
    * Updated `/routes/comparison` to correctly show the baseline badge.

---

## Validation / Corrections

| Task | Verification Method | Status |
|---|---|---|
| SQL schema | Ran in Docker Postgres |  OK |
| Routes & Baseline API | Tested via Postman |  OK |
| Banking Logic | Overbank attempt returns proper error |  OK |
| Pooling Validation | Missing ship record error handled |  OK |
| Frontend Fetch | Vite dev test (localhost:5173) |  OK |

---

## Observations

### Where AI Saved Time
* Generated the entire backend architecture and SQL schema in under 45 minutes.
* Reduced manual SQL and TypeScript boilerplate by an estimated 70%.
* Accelerated the creation of documentation and test templates.

### Where It Failed
* Invented missing repository methods (e.g., `updateCB`) that did not exist.
* SQL commas and JSON syntax were occasionally malformed or misplaced.
* Some generated frontend fetch calls lacked necessary `try...catch` error guards.

### Best Synergy
* **ChatGPT + Claude:** Resulted in a solid architecture combined with correct data seeding.
* **Copilot + Cursor:** Allowed for clean, incremental code edits directly inside the VSCode environment.
* **ChatGPT:** Best for final documentation and standardizing workflow descriptions.

---

## Best Practices Followed

* Used `tasks.md` in Cursor for scoped file generation and edits.
* Verified all AI-generated outputs manually in Docker and Postman before committing.
* Committed only reviewed and approved AI-generated code.
* Logged key prompts and manual changes in this file for reproducibility.
* Followed the hexagonal pattern consistently: Domain → Ports → Adapters → Services → Routes.