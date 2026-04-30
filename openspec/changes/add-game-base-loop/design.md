# Design: Add Game Base Loop

## Context

This is the first openspec change in the repo and the first slice of the game-design-v2 build order. Decisions made here set patterns later slices will follow. The full design rationale lives in `documentation/game.design.v2.md` — this document captures only the implementation choices specific to slice 1.

## Goals

- The base loop (walk → transmit → activate → accrue) feels good.
- Engine plumbing is reusable for later slices without rework.
- The Morse input timing from v1 is preserved exactly.
- Both currencies are visible from day one so look and feel can be judged.

## Non-Goals

- Persistence (slice 2).
- Decay (slice 3).
- Build choice UI (slice 4).
- NPCs, drill mode, in-world chat, multiplayer (later slices).
- Sound polish, animation polish, parallax beyond a placeholder.
- Mobile-specific tap target tuning beyond reasonable defaults.

## Directory layout

```
app/
├── page.tsx                          # Mounts <GameWorld /> via dynamic import (no SSR)
├── page.stores.ts                    # Zustand store: player, cells, currencies, input
├── page.types.ts                     # Position, CellState, BuildKind, etc.
├── page.hooks.tsx                    # React Query / hook layer (minimal in slice 1)
└── game/
    ├── engine/
    │   ├── useGameLoop.ts            # rAF loop — pause when tab hidden
    │   ├── usePlayerMovement.ts      # click + WASD/arrows → velocity → position
    │   └── proximity.ts              # pure: nearest cell within radius
    ├── world/
    │   ├── GameWorld.tsx             # Scrolling container, camera lerp, mounts level
    │   ├── Player.tsx                # CustomCharacter at playerPos + morse input target
    │   ├── Cell.tsx                  # Prompt bubble, build, activation animation
    │   └── SpeechBubble.tsx          # Ported from v2 — preserve styling exactly
    ├── hud/
    │   ├── HUD.tsx                   # Top bar: Beep counter (left), Buzz counter (right)
    │   └── CurrencyCounter.tsx       # Animated number with burst effect
    └── levels/
        └── home.ts                   # Three-cell hand-authored level
```

## Why this layout

- `app/page.*` follows the project's existing routing convention (`page.tsx` + co-located `.stores.ts` / `.types.ts` / `.hooks.tsx`). Game-specific subtree lives under `app/game/` because it's a vertical slice the rest of the app does not import.
- Splitting `engine/` (pure logic), `world/` (rendering), `hud/` (overlays), and `levels/` (data) keeps later slices easy to extend.

## Movement

- **Click-to-walk:** clicking anywhere in the game viewport sets a `moveTarget.x`. Each tick the player accelerates toward it at constant speed and stops on arrival.
- **WASD / arrows:** holding a movement key sets velocity directly. Pressing a key clears any pending `moveTarget`. Releasing the key zeros velocity.
- The player's Y is locked to ground level; no falling, no jumping.
- Camera X follows the player with a lerp factor (e.g. 0.1) for smoothness.

## Morse input → cell transmission

- A new `lib/useMorseInput.ts` hook extracts the press/hold/audio logic currently embedded in `MorseTrainer`. It exposes:
  ```
  useMorseInput({ onSignal, onBeepStart, onBeepEnd, enabled, dotThreshold })
  ```
- `Player.tsx` wires pointer/keyboard events on the character SVG to the hook.
- The hook is `enabled` only when the player is within proximity of a cell. Outside proximity, taps on the character do nothing.
- Each emitted dot/dash appends to a running buffer scoped to the current target cell. Auto-delimit timing fires the buffer as a "submission" when the inter-character pause elapses.
- A successful match against the cell's prompt triggers activation. A miss clears the buffer with a brief shake animation on the speech bubble.
- `MorseTrainer` is updated to use the same hook with no behavior change. This is verified by manual side-by-side test before slice 1 is considered done.

## Cell model

```ts
type CellState = {
  id: string
  pos: { x: number }                 // y is ground level
  prompt: string                     // e.g. "E", "T", "IT"
  align: "beep" | "buzz" | "mixed"
  build: BuildKind                   // hardcoded per cell in slice 1
  status: "dormant" | "activating" | "active"
  activatedAt: number | null
}
```

`BuildKind` is `"sapling" | "turbine" | "combined"` in slice 1.

## Currency model

```ts
type Currencies = { beep: number; buzz: number }
```

- On activation, the cell's `align` determines the burst:
  - `beep` → +10 beep instantly, +0.5 beep/sec trickle
  - `buzz` → +10 buzz instantly, +0.5 buzz/sec trickle
  - `mixed` → +5 beep + +5 buzz instantly, +0.25 each per sec
- Trickle ticks via `useGameLoop`. No real-time wall clock; if the tab is hidden the loop pauses (consistent with future play-time decay rules).
- Counters in the HUD animate with a pop on burst and a smooth ease on trickle.

## Persistence

None in slice 1. State exists only in the Zustand store. Refreshing the page resets the world. Slice 2 adds localStorage + Supabase sync.

## Open implementation questions

- Exact dot-threshold and inter-character pause timings — copy verbatim from the existing `MorseTrainer` constants.
- Cell proximity radius — start at 80px; tune by feel.
- Camera lerp factor — start at 0.1.
- Whether to disable text selection / context menu on the canvas — yes, set `user-select: none` and prevent default on context menu within the game viewport.
