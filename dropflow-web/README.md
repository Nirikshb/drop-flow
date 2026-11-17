# dropflow-web

Next.js 16 (App Router) application for the Dropflow marketing site and customer dashboard.

## Stack

- Next.js 16.4.6 · React 19.3 · TypeScript 5.9.3
- Tailwind CSS 4 + shadcn/ui (Radix primitives)
- Motion 14 (intentional, sparing animation)
- React Hook Form + Zod, TanStack Query, sonner
- Vitest + Testing Library + jsdom

TypeScript is pinned to 5.9.x here (rather than Next's suggested latest) because it is the stable line supported by the Next plugin and the rest of the tooling.

## Commands

```powershell
pnpm install
pnpm dev          # http://127.0.0.1:3000
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm typecheck
```

## Environment

Copy `.env.example` to `.env.local`. Only `NEXT_PUBLIC_*` values are used; they are embedded in client bundles and must never contain secrets. See [`../project-docs/ENVIRONMENT.md`](../project-docs/ENVIRONMENT.md).

## Structure

```
src/
├── app/            App Router routes
├── components/     ui/ (shadcn), marketing/, dashboard/, upload/, assets/  ← Phase 1
├── features/       auth/, projects/, api-keys/, assets/, usage/             ← Phase 1
├── hooks/          shared React hooks
├── lib/            API client, utilities
├── services/       API-backed services (mock services kept separate in Phase 1)
├── types/          shared frontend types
└── styles/         design tokens
```

> Note: `AGENTS.md` in this project documents Next 16-specific conventions. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code.
