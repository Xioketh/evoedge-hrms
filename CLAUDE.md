# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Next.js version warning (from AGENTS.md):** This repo uses Next.js 16 + React 19. APIs and conventions may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing framework-level code.

> **Breaking change — page `params` is a Promise:** In Next.js 16, dynamic route params are async. Always `await params` before accessing properties: `const { id } = await params`. Skipping the `await` causes a runtime error.

## Commands

```bash
npm run dev        # Start dev server (Next.js, default :3000)
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint (eslint-config-next)

# Prisma (v7, no prisma.schema datasource URL — it comes from prisma.config.ts)
npx prisma migrate dev --name <name>   # Create + apply a migration
npx prisma migrate deploy              # Apply migrations (CI/prod)
npx prisma generate                    # Regenerate client after schema edits
npx tsx prisma/seed.ts                 # Seed (also wired as the Prisma seed cmd)
npx tsx prisma/seeds/run-offers-only.ts  # Seed only job offers
```

There is no test runner configured.

## Architecture

Multi-tenant HRMS. Every domain row is scoped by `companyId` (the tenant); always filter queries by the session's `companyId`. Built around a **job-offer → employee lifecycle**: HR creates an offer, a PDF is generated and stored in S3, n8n emails the candidate, the candidate accepts/declines via a public tokenized link, and HR converts an accepted offer into a `User` + `EmployeeProfile`.

### Layered backend (strict direction: action → service → repository → db)

- **`src/actions/*.actions.ts`** — `"use server"` Server Actions. Entry point for all mutations from the UI. Responsibilities: auth check via `getSession()`, validate `FormData` with a Zod schema, call a service, `revalidatePath()`, and return an `ActionState` (`{ success, message?, fieldErrors?, inputs? }`). Catch `z.ZodError` and return `error.flatten().fieldErrors`. Never put business logic here.
- **`src/core/services/*.service.ts`** — Business logic, transactions (`db.$transaction`), orchestration of repositories + external integrations (S3, n8n, PDF). Services re-check the session and enforce tenant/role rules. `Decimal` fields must be serialized to `Number` before crossing to client components.
- **`src/core/repositories/*.repository.ts`** — Exported as plain object literals with async methods (e.g. `JobOfferRepository.create`). The only place that touches `db`. Methods accept an optional `Prisma.TransactionClient` when they participate in a transaction (see `completeOfferWithTx`).
- **`src/core/db/db.client.ts`** — Singleton `db` PrismaClient using the `@prisma/adapter-pg` driver adapter over a `pg.Pool`. Import `db` from here; never instantiate PrismaClient elsewhere (seeds are the exception). Also exports `PrismaTx` — the type for a Prisma transaction client. Repository methods accept it as an optional last parameter (defaulting to `db`) so services can pass `tx` inside a `db.$transaction` block.

### Auth & authorization

- JWT session in an httpOnly `session_token` cookie (8h), signed with `jose` using `JWT_SECRET`. See `src/core/services/auth.service.ts`.
- `getSession()` returns `SessionPayload | null` (`userId`, `role`, `companyId`, name). Call it at the top of every action/service that needs auth.
- **Server Components** enforce role access with `enforceRoleAccess(allowedRoles)` (`src/core/utils/auth-guard.ts`), which redirects to `/login` or `/dashboard`.
- Roles (`Role` enum): `HR_DIRECTOR`, `HR_MANAGER`, `HR_EXECUTIVE`, `TREASURY`, `HOD`, `EMPLOYEE`. Role→nav mapping and the `HR_ADMINS`/`ALL_HR_STAFF`/`EVERYONE` groupings live in `src/constants/sidebar.constants.ts`.

### Routing (App Router, route groups)

- `(auth)` — login/signup (public).
- `(dashboards)` — authenticated app. `layout.tsx` redirects unauthenticated users and renders Sidebar/Header. Page header copy is driven by `src/config/routes.ts` (`PAGE_HEADERS`), not hardcoded per page.
- `(public)` — tokenized candidate offer view at `/offer/[token]`.
- `app/api/webhooks/n8n/offer-status` — inbound webhook from n8n.

### External integrations

- **n8n** (`src/core/services/n8n.client.ts`): `triggerWorkflow(workflow, payload)` POSTs to `N8N_WEBHOOK_URL/<workflow>`. For workflows in `WORKFLOW_CALLBACK_MAP` (`src/constants/n8n.constant.ts`) it injects a `callbackUrl` + `callbackSecret`; n8n calls back into the webhook route, which authenticates with `Bearer N8N_CALLBACK_SECRET` and flips offer status to `SENT`/`SEND_FAILED`.
- **S3** (`src/core/services/s3.service.ts`): `uploadToS3(buffer, key, contentType)` and `getPresignedUrl(key, filename?, expiresIn=60)`. The storage layer is domain-agnostic — callers build the key (e.g. `offers/<YYYY-MM>/offer-<id>.pdf`, employee CVs). Downloads always go through short-lived (60s) presigned URLs returned from an action.
- **PDF** (`src/core/pdf/OfferLetterTemplate.tsx`): rendered server-side with `@react-pdf/renderer`'s `renderToBuffer`, then uploaded to S3.

### Offer state machine

`OfferStatus`: `QUEUED → SENT → CANDIDATE_ACCEPTED/CANDIDATE_DECLINED`, with `DRAFT`, `SEND_FAILED`, `EXPIRED`, `CANCELLED`, and terminal `COMPLETED`. Services guard transitions (e.g. `processCandidateResponse` only acts on `SENT`; `processOfferAcceptance` only on `CANDIDATE_ACCEPTED`). Completing an offer creates the user account inside a transaction and stamps `completedBy`/`completedAt`.

### Employee code generation

Employee codes are auto-generated on offer completion (inside the `processOfferAcceptance` transaction). Format: `{CO}_{ROLE}_{SEQ}` — e.g. `EVO_EMP_00011`. `CO` is the first 3 chars of the company name, uppercased. `ROLE` prefixes live in `src/core/utils/employee-code.ts` (e.g. `EMP`, `HRD`, `TRS`). `SEQ` is a zero-padded 5-digit counter per company+role pair, derived by querying the highest existing code with that prefix.

### Domain naming note

The `/lead` route and "Lead Management" terminology refers to the **job offer pipeline** (candidates receiving offer letters), not traditional CRM leads. `HR_DIRECTOR` is intentionally excluded from the employee directory listing (`findPaginatedWithCount` filters `role: { not: HR_DIRECTOR }`). Employees can only view their own profile at `/employee/[id]`; accessing another employee's profile redirects them to their own.

### Conventions

- Import alias `@/*` maps to repo root, so imports look like `@/src/core/services/...`.
- Frontend code under `src/components/features/<domain>/` and `src/components/ui/` (shadcn). Domain-specific components colocated in route folders as `_components/`.
- Zod schemas in `src/types/schemas/`, shared types in `src/types/`.
- `ActionState<T>` (`src/types/action.types.ts`) is the canonical return type for Server Actions. Some actions return ad-hoc shapes instead — prefer `ActionState` for new actions.
- S3 key conventions: offers → `offers/<YYYY-MM>/offer-<id>.pdf`; employee CVs → `employees/<userId>/cv/<YYYY-MM>/<safeName>`.

## Environment variables

`DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`, `N8N_WEBHOOK_URL`, `N8N_AUTH_TOKEN`, `N8N_CALLBACK_SECRET`.
