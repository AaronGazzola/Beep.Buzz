# Beep.Buzz — Phase 1 Implementation Plan

## Scope

Get the game *feeling good* across devices. No database integration — all state is local (Zustand). The goal is a complete, playable loop: home area → Zone 1 → boss defeat → back to home.

---

## Architecture Decisions

### No external game engine

The blob character is an SVG React component driven by `requestAnimationFrame`. Using a canvas-based engine (Phaser, Excalibur) would require re-implementing the character as a canvas draw call or maintaining an awkward DOM/canvas hybrid. For this game's interaction model (click-to-walk, no fast-paced physics), a React DOM approach is the right fit.

- World is a `position: relative` container with `transform: translateX` camera scrolling
- Player and all entities are absolutely positioned React components
- A `useGameLoop` hook drives a `requestAnimationFrame` loop that updates position state
- Collision is AABB (axis-aligned bounding box) checked against static level geometry

Excalibur.js is the candidate if Phase 2 introduces tile maps, true gravity, or performance issues at scale.

### MorseTrainer as a modal overlay

When the player interacts with Beep or Buzz, the existing `MorseTrainer` component mounts as a full-screen overlay. No changes needed to `MorseTrainer` itself. Game loop pauses while the trainer is open.

### Shared morse input hook

The press/hold/audio input logic currently lives inside `MorseTrainer`. Extract it to `lib/useMorseInput.ts` so it can be used both by `MorseTrainer` and by the in-game player input (tapping the character sprite). `MorseTrainer` is updated to use the hook — no behavior change.

### Static level data

Zone layout (platforms, enemy positions, doors, NPCs, chests) is TypeScript objects in `app/game/levels/`. No level editor, no DB. Iterate by editing the data directly.

---

## File Structure

```
app/game/
├── page.tsx                   # Route entry — dynamic import (no SSR), mounts GameWorld
├── page.stores.ts             # All game state: player pos/vel, hearts, zone, enemy states, interaction
├── page.types.ts              # Position, Entity, LevelData, EnemyConfig, DoorConfig, etc.
│
├── engine/
│   ├── useGameLoop.ts         # rAF loop — ticks movement, collision, enemy timers each frame
│   ├── usePlayerMovement.ts   # Click target → velocity → AABB collision → position update
│   └── collision.ts           # Pure functions: AABB overlap, resolve, find ground
│
├── world/
│   ├── GameWorld.tsx          # Scrolling container, camera transform, renders level entities
│   ├── Player.tsx             # CustomCharacter at player position + tap/hold morse input target
│   ├── Enemy.tsx              # Enemy sprite + speech bubble + reactive/timer state
│   ├── Door.tsx               # Morse-locked door — shows required morse, opens on correct input
│   ├── NPC.tsx                # Beep/Buzz — proximity detect, interact button, triggers trainer modal
│   ├── Platform.tsx           # Rendered platform tile (visual only — geometry comes from level data)
│   ├── Chest.tsx              # Heart chest — interact to open, awards +1 heart
│   └── Signpost.tsx           # Signpost — interact to read dialog
│
├── hud/
│   ├── HUD.tsx                # Hearts, current zone label, morse input feedback (dots/dashes display)
│   └── TrainerModal.tsx       # Full-screen overlay wrapping MorseTrainer, pauses game loop
│
└── levels/
    ├── home.ts                # Home area: Beep, Buzz, wardrobe, starter chest, signposts, zone doors
    └── zone1.ts               # Zone 1 — The Zap Lands: 3 sections + The Zapper boss

lib/
└── useMorseInput.ts           # Extracted from MorseTrainer: press/hold timing, audio, dot/dash emit
```

---

## Game State (`page.stores.ts`)

```ts
{
  zone: "home" | "zone1"
  playerPos: { x: number; y: number }
  playerVel: { x: number; y: number }
  moveTarget: { x: number } | null
  isGrounded: boolean
  hearts: number                          // 0–3
  isAlive: boolean
  nearbyEntity: EntityId | null           // what the interact button refers to
  interactingWith: EntityId | null        // currently open interaction
  trainerOpen: boolean
  enemies: Record<EntityId, EnemyState>  // per-enemy: hp, phase, timer, alive
  doors: Record<EntityId, DoorState>     // open/closed
  chests: Record<EntityId, boolean>      // opened
  unlockedZones: Zone[]
  cosmetics: UnlockedCosmetics
  learnedLetters: string[]               // local — synced to DB later
}
```

---

## Phases

### Phase 1A — Foundation

The bare minimum to have a character in a world.

- `app/game/page.tsx` — client-only route via `dynamic(() => import('./GameWorld'), { ssr: false })`
- `useGameLoop` — rAF loop, pauses when `document.hidden` or trainer is open
- `GameWorld.tsx` — full-viewport container, camera tracks player X with lerp, renders level platforms
- `Player.tsx` — renders `CustomCharacter` at `playerPos`, walking animation (scale pulse while moving)
- `usePlayerMovement` — click anywhere on world → set `moveTarget` → each frame: move toward target at constant speed, stop on arrival
- `collision.ts` — AABB: player rect vs platform rects, resolve Y (gravity + ground snap), resolve X (wall stop)
- Simple gravity: constant downward velocity when not grounded
- `home.ts` level data — flat ground, a few platforms, placeholder positions for all entities

**Deliverable:** Character walks left/right on click, stands on platforms, falls off edges.

---

### Phase 1B — Auto-Jump and Death

- Auto-jump: when `moveTarget` is set and a wall collision is detected in the movement direction, apply upward velocity impulse if grounded
- When player walks off a ledge and falls below world floor Y → lose 1 heart, respawn at last safe grounded position
- `HUD.tsx` — heart display (3 heart icons, filled/empty state)
- Losing all hearts → `isAlive = false` → respawn screen overlay → reset to home

**Deliverable:** Character navigates platforms without manual jump input, dies on falls.

---

### Phase 1C — Interaction System

- Proximity detection: each frame, check if player is within interact radius of any nearby entity
- When nearby: show interact button (absolute-positioned below player)
- Tap interact button → set `interactingWith`

Interactable entities for Phase 1C (home area):
- **Signposts** — open a simple dialog modal with text content from level data
- **Chests** — award +1 heart (max 3), mark as opened, play a simple CSS animation

**Deliverable:** Player can read signposts and open chests.

---

### Phase 1D — Morse Input in World

Extract `useMorseInput` from `MorseTrainer`:

```ts
useMorseInput(options: {
  onSignal: (signal: "." | "-") => void
  onBeepStart: () => void
  onBeepEnd: () => void
  enabled: boolean
  dotThreshold: number
})
```

Handles: mouse down/up, touch start/end/cancel, keyboard (space), long-press timer, audio oscillator.

Update `MorseTrainer` to use the hook — same behavior, no visible change.

In `Player.tsx`:
- Pointer events on the character SVG target call `useMorseInput`
- Input is only active when `enabled` (player is in morse context — near an enemy/door)
- Accumulated morse string shown live in `HUD.tsx`
- Auto-clear after letter-gap timeout (same timing as MorseTrainer)

**Deliverable:** Player can tap/hold their character to emit dots and dashes. Morse string appears in HUD.

---

### Phase 1E — Beep, Buzz, and Teaching Sessions

- Add Beep and Buzz to home area level data (and zone entrance positions)
- `NPC.tsx` — renders appropriate character (Beep = UserCharacter, Buzz = BuzzCharacter), proximity detect
- On interact → `trainerOpen = true`, game loop pauses
- `TrainerModal.tsx` — full-screen overlay, mounts `MorseTrainer`, close button sets `trainerOpen = false`
- Letters learned in trainer are saved to local `learnedLetters` state
- Zone 1 door in home is locked until E and T are in `learnedLetters`

**Deliverable:** Player can learn morse with Beep and Buzz. Zone 1 door unlocks after learning E and T.

---

### Phase 1F — Enemies

`Enemy.tsx` takes an `EnemyConfig` from level data:

```ts
type EnemyConfig = {
  id: EntityId
  pos: { x: number }
  challengeMode: "morse+audio" | "letter+audio" | "letter-only"
  behavior: "reactive" | "timer"
  timerMs?: number
  challengeLetter: string
  hp: number
}
```

Enemy behavior:
- Renders a blob character (enemy color/style from config) with a speech bubble showing the current challenge
- Speech bubble content depends on `challengeMode`
- **Reactive**: does nothing until player submits wrong morse → plays hit animation, player loses 1 heart
- **Timer**: countdown bar visible in speech bubble → on expiry, player loses 1 heart
- Correct morse → enemy takes damage → at 0 HP, defeat animation, enemy removed from state
- Player must be within combat range (proximity) for morse input to target the enemy

Audio plays from enemy speech bubble (not from player) when `challengeMode` includes audio.

**Deliverable:** Player can fight reactive and timer enemies using morse input.

---

### Phase 1G — Morse-Locked Doors

`Door.tsx`:
- Displays required morse (or letter, depending on mode) in a speech bubble-style badge above the door
- Player approaches → interact button appears → tap to enter combat with door
- Submit correct morse → door opens (CSS transition), player can pass through
- Doors in Zone 1 use the same contextual morse input system as enemies

**Deliverable:** Player can open morse-locked doors.

---

### Phase 1H — Zone 1: The Zap Lands

`zone1.ts` level data — three sections connected by doors:

**Section 1 (Entry):**
- 2–3 reactive enemies, all `morse+audio` mode
- 1 signpost (morse input instructions)
- 1 door requiring E (`·`)

**Section 2 (Middle):**
- Mix of reactive + timer enemies, `morse+audio` and `letter+audio` modes
- 1 chest (heart reward)
- 1 door requiring T (`-`)
- 1 platforming gap

**Section 3 (Boss Run):**
- 2–3 timer enemies, `letter+audio` mode
- Boss: The Zapper

**The Zapper boss:**
- Large blob character (oversized `CustomCharacter` with distinct color)
- 3 HP (one per phase)
- Phase 1: challenges E repeatedly (3 correct hits to clear)
- Phase 2: challenges T repeatedly
- Phase 3: alternates E and T randomly — player must read each prompt
- Timer on all phases — constant urgency
- Defeat → cosmetic unlock (hat style 1) applied immediately, Zone 1 door in home area opens

**Deliverable:** Full Zone 1 playable from entry to boss defeat.

---

### Phase 1I — Polish and Cross-Device

- Smooth camera lerp (don't snap to player)
- Death screen with "Return to Home" button
- Zone transition animations (fade out/in)
- Touch input audit — ensure all interactions work on mobile (interact button size, tap targets, scroll prevention)
- Viewport lock (prevent page scroll while game is active)
- Pause when tab is backgrounded
- Visual feedback pass: hit flash on player/enemies, door open animation, chest pop animation
- Signpost dialog polish (matches game visual style)

---

## Out of Scope for Phase 1

- Database reads/writes (no Supabase calls)
- XP and leveling
- Wardrobe (character customization mid-game) — profile page handles this
- Zone 2+
- Multiplayer
- Timer difficulty scaling
- Letter-only challenge mode (no audio) — add in Phase 2 once feel is established
- Sound effects beyond morse audio and in-game beep on input
