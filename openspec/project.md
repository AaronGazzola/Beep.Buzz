# Project: Beep.Buzz

## What this is

Beep.Buzz is a 2D side-scrolling world-restoration game where Morse code is the primary interaction. Players transmit Morse to activate cells of land, which generate two currencies (Beep and Buzz) that fund higher-tier builds. The world transforms from grey wasteland into solarpunk garden-city as the player progresses.

The full design lives in `documentation/game.design.v2.md`. The v1 PRD (`documentation/beep-buzz-v2-PRD.md`) and v1 game design (`documentation/game.design.v1.md`, the platformer) are superseded references.

## Stack

- Next.js 15 (App Router) + TypeScript
- TailwindCSS v4 + shadcn/ui
- Supabase (remote only, no local DB) for auth + persistence
- Zustand for client state
- React Query for data fetching
- Vitest + Playwright for tests

See `CLAUDE.md` for code conventions (no comments, throw all errors, no middleware route protection, file naming patterns).

## Spec capabilities

- `game` — the playable world: canvas, player, movement, HUD, cells, transmission, builds, currencies.

Additional capabilities (`persistence`, `decay`, `multiplayer`, etc.) are added in later changes per the build order in `documentation/game.design.v2.md`.
