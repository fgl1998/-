# Create User API Beginner Tutorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Add one standalone, beginner-oriented tutorial that teaches the complete process of implementing `POST /api/v1/users` from zero, without changing any existing tutorial document.

**Architecture:** Explain the request's runtime journey first, then teach the reader to implement the same vertical slice from the bottom up: contract and database, shared infrastructure, request/entity/response models, repository, service, controller, route, application composition, startup, and tests. Keep the example deliberately limited to one create-user endpoint so each responsibility remains visible.

**Tech Stack:** Node.js, TypeScript, Express, MySQL, mysql2, hand-written parameterized SQL, Zod, Vitest, Supertest, PowerShell.

**Global Constraints:**

- Create only `doc/production-backend-tutorial/06-build-one-create-user-api-from-zero.md` for the new tutorial.
- Do not edit the existing tutorial README or chapters 01 through 05.
- Use complete code examples; do not use ellipses, pseudocode, TODO markers, or “other code is similar.”
- Explain every layer's purpose, inputs, outputs, dependencies, and common mistakes in beginner-friendly language.
- Preserve a clean separation: controller controls HTTP, service handles business rules, repository handles persistence.

---

### Task 1: Confirm source conventions and define the minimal vertical slice

**Files:**

- Read: `src/**`
- Read: `tests/**`
- Read: `doc/production-backend-tutorial/01-libraries-and-setup.md`
- Read: `doc/production-backend-tutorial/04-user-module-from-route-to-sql.md`

**Step 1: Inventory the reference implementation**

Identify the exact TypeScript, Express, Zod, mysql2, error-response, dependency-injection, and test conventions already used by the reference project.

**Step 2: Select only create-user dependencies**

Build a file map for a minimal but complete `POST /api/v1/users` vertical slice. Exclude unrelated list, delete, authentication, and logging features.

**Step 3: Check code consistency**

Ensure names and import styles are internally consistent with NodeNext/ESM TypeScript and can be understood independently of earlier chapters.

### Task 2: Write the mental model, contract, setup, database, and shared infrastructure

**Files:**

- Create: `doc/production-backend-tutorial/06-build-one-create-user-api-from-zero.md`

**Step 1: Explain the two different orders**

Show the runtime order (`Route → Validate → Controller → Service → Repository → MySQL`) and the recommended coding order (`requirements → database/shared infrastructure → models → repository → service → controller → route → app → tests`).

**Step 2: Freeze the API contract**

Specify URL, HTTP method, headers, valid request body, successful response, validation error, duplicate-email error, and unexpected error.

**Step 3: Explain and install libraries**

Give complete npm commands and explain what Express, mysql2, Zod, dotenv, Vitest, and Supertest each do.

**Step 4: Add complete environment and SQL examples**

Include `.env.example`, environment parsing, database creation, the `users` table, unique email index, migration command, and the connection pool.

**Step 5: Add complete shared HTTP examples**

Include `AppError`, the standard success envelope, request-validation middleware, and global error middleware, with a detailed walkthrough of each important statement.

### Task 3: Write the complete user-module implementation

**Files:**

- Modify: `doc/production-backend-tutorial/06-build-one-create-user-api-from-zero.md`

**Step 1: Add the entity, schema, and DTO**

Explain the differences among database entity, request validation schema, inferred input type, service input, and public response type. Include complete code.

**Step 2: Add the repository contract**

Define only the persistence operations required by create-user, plus the database-specific duplicate-email error abstraction.

**Step 3: Add the mapper and MySQL repository**

Include full row-to-entity mapping, parameterized SQL, result typing, insert-id handling, duplicate-key conversion, and post-insert fetch.

**Step 4: Add the service**

Implement normalization and duplicate-email business behavior. Explain pre-check versus the database unique constraint and the race condition between them.

**Step 5: Add the controller, route, and module composition**

Keep HTTP extraction/status handling in the controller and business logic in the service. Show exactly how dependencies are created and connected.

### Task 4: Write application startup, manual verification, and automated tests

**Files:**

- Modify: `doc/production-backend-tutorial/06-build-one-create-user-api-from-zero.md`

**Step 1: Add complete app and server code**

Show an app factory that is testable without opening a port and a server entry point that loads environment variables, checks MySQL, creates dependencies, and starts listening.

**Step 2: Add type-check and run instructions**

Give exact PowerShell commands and explain expected output and likely startup failures.

**Step 3: Add manual API calls**

Include valid, invalid, and duplicate-email `Invoke-RestMethod` examples and explain how each request travels through the layers.

**Step 4: Add complete service and API tests**

Include a fake repository, service tests for success and both duplicate paths, and API tests for success and validation failure. Explain what each test isolates.

**Step 5: Add debugging and reusable-interface checklists**

Provide a layer-by-layer debugging order and a reusable recipe that the reader can apply to future GET, update, and delete endpoints.

### Task 5: Verify the document and non-modification promise

**Files:**

- Verify: `doc/production-backend-tutorial/06-build-one-create-user-api-from-zero.md`
- Verify unchanged: `doc/production-backend-tutorial/README.md`
- Verify unchanged: `doc/production-backend-tutorial/01-libraries-and-setup.md`
- Verify unchanged: `doc/production-backend-tutorial/02-config-database-and-migrations.md`
- Verify unchanged: `doc/production-backend-tutorial/03-request-validation-errors-and-logging.md`
- Verify unchanged: `doc/production-backend-tutorial/04-user-module-from-route-to-sql.md`
- Verify unchanged: `doc/production-backend-tutorial/05-testing-running-and-debugging.md`

**Step 1: Scan for incomplete examples**

Search the new tutorial for TODO, TBD, ellipses, “omitted,” and “similar code” placeholders.

**Step 2: Check required topic coverage**

Confirm all contract, database, shared infrastructure, user-module, startup, manual-test, automated-test, debugging, and reusable-checklist sections exist.

**Step 3: Verify previous-document hashes**

Recalculate SHA-256 hashes for README and chapters 01 through 05 and compare them with the baseline captured before writing.

**Step 4: Report the artifact**

Provide an absolute clickable link to the new tutorial and explicitly confirm that the previous tutorial files were not modified.
