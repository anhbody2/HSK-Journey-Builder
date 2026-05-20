# HSK Smart Learning

Vietnamese-language app for learning Chinese (Mandarin), guiding users from HSK 1 to HSK 5 with a personalized AI learning path, lesson flows, shadowing practice, and daily tasks.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/hsk-learning run dev` — run the frontend (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter + TanStack Query + shadcn/ui
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — DB schema (users, lessons, progress, quiz tables)
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/hsk-learning/src/pages/` — all frontend pages
- `artifacts/hsk-learning/src/components/` — shared UI components

## Architecture decisions

- Single-user model (id=1, no authentication): `getOrCreateUser()` pattern in backend avoids auth complexity while keeping all progress data.
- OpenAPI-first: all types are generated from `openapi.yaml` via Orval — never hand-write API types in the frontend.
- Lesson lesson flow: dialogue → vocabulary → shadowing → grammar → quiz. Each step records progress independently in `lesson_progress`.
- Shadowing scoring is simulated (random syllable analysis) — no real audio processing needed for MVP.
- Cinnabar red primary (`hsl(5 75% 55%)`), warm parchment background (`hsl(40 33% 96%)`), Inter + Noto Serif SC fonts.

## Product

- **Onboarding**: 5-question placement quiz → name → daily goal → target HSK level → personalized learning path
- **Dashboard**: daily task list, streak tracker, XP stats, weekly activity chart, level progress bar
- **Learn Level** (`/learn/:level`): all lessons for an HSK level grouped by unit with lock/complete state
- **Lesson** (`/lesson/:id`): 5-step lesson flow with dialogue cards, vocabulary flashcards, shadowing (mic recording), grammar explanations, and a mini-quiz
- **Checkpoint** (`/checkpoint/:level`): timed HSK-style exam with question navigator, multiple choice and pinyin input
- **Progress** (`/progress`): streak, total XP, vocabulary learned, weekly XP bar chart, HSK level roadmap

## User preferences

- UI language: Vietnamese
- Content language: Chinese characters + Pinyin side by side
- East Asian aesthetic with cinnabar red and parchment theme

## Gotchas

- Always run codegen (`pnpm --filter @workspace/api-spec run codegen`) after changing `openapi.yaml` before editing frontend code.
- The DB seed must be run manually via code_execution tool or SQL — there's no seed script in `package.json`.
- `pnpm run dev` at the workspace root doesn't exist; use workflow restart instead.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
