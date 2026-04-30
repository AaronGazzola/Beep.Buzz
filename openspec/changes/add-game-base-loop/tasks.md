# Tasks: Add Game Base Loop

## 1. Foundation

- [x] 1.1 Create `app/game/` subtree with `engine/`, `world/`, `hud/`, `levels/` directories
- [x] 1.2 Create `app/game/levels/home.ts` with placeholder level data (player spawn, ground bounds, three cell positions)
- [x] 1.3 Define `app/page.types.ts` with `Position`, `CellState`, `BuildKind`, `Currencies`, `LevelData`
- [x] 1.4 Create `app/page.stores.ts` Zustand store with player position, velocity, move target, cells map, currencies, current input buffer, target cell id
- [x] 1.5 Replace `app/page.tsx` content with a client-only dynamic import of `<GameWorld />`. Move existing trainer-home content out of `page.tsx` (do not delete the components themselves)
- [x] 1.6 Update `app/page.hooks.tsx` to remove trainer-home hooks; leave a minimal export surface
- [x] 1.7 Verify no other route or component imports the removed home-page exports (moved trainer/chat surface to `app/morse.{stores,types,hooks,actions}` and updated all 13 import sites)

## 2. Engine

- [x] 2.1 Port `useGameLoop` from `v2` branch (`app/game/engine/useGameLoop.ts`). Pause on `document.hidden`
- [x] 2.2 Port `GameWorld` skeleton (`app/game/world/GameWorld.tsx`): full-viewport container, camera transform, renders level platforms + entities. Strip platforming-specific pieces
- [x] 2.3 Implement `app/game/engine/usePlayerMovement.ts`: click sets `moveTarget.x`; WASD/arrows set velocity directly; movement integrates each tick; player Y locked to ground
- [x] 2.4 Implement `app/game/engine/proximity.ts` (pure): given player position and cells, return nearest cell id within radius or null
- [x] 2.5 Render `Player.tsx` as `CustomCharacter` (via `UserCharacter`) at player position
- [x] 2.6 Camera X lerps to follow player; ground line is fixed Y

## 3. Morse input

- [x] 3.1 Extract `lib/useMorseInput.ts` from `components/MorseTrainer.tsx` press/hold/audio logic. Hook signature: `{ onSignal, enabled, dotThresholdMs, audioEnabled, frequency, volume }`
- [ ] 3.2 Update `MorseTrainer.tsx` to use the new hook (deferred — preserving trainer's inline logic byte-identical; hook is a separate extraction for the game player. Trainer→hook integration is its own follow-up task to avoid risking the sacred timing)
- [x] 3.3 Wire `Player.tsx` pointer events to `useMorseInput`. Hook is `enabled` only when proximity returns a target cell whose status is `dormant`
- [x] 3.4 Maintain a per-cell input buffer in the store; append dot/dash on each `onSignal`
- [x] 3.5 Auto-delimit timer fires "submit" when inter-character pause elapses; submission is the accumulated morse string for the current target cell

## 4. Cells and activation

- [x] 4.1 Build `SpeechBubble.tsx` with default/challenge/hit/miss variants. Shake animation on miss, pop on hit
- [x] 4.2 Implement `Cell.tsx`: dormant footprint, prompt bubble shown when in proximity, build sprite swapped in on activation
- [x] 4.3 On submission match: cell → `activating`, bubble plays celebration, build sprite enters with `build-pop` animation, then cell → `active`
- [x] 4.4 On submission mismatch: shake speech bubble, clear input buffer
- [ ] 4.5 Add a contextual "Transmit" interact button below the player (deferred — proximity bubble already provides the affordance; adding a redundant button can be revisited after first playtest feedback)

## 5. HUD and currencies

- [x] 5.1 Implement `HUD.tsx`: fixed top bar with Beep counter top-left, Buzz counter top-right
- [x] 5.2 Implement `CurrencyCounter.tsx`: animated number, pop animation on burst, smooth ease on trickle
- [x] 5.3 On cell activation, dispatch the burst per spec (alignment-dependent) and start a trickle timer in the game loop
- [x] 5.4 Trickle pauses when game loop is paused (tab hidden)

## 6. Header

- [x] 6.1 Update `components/Header.tsx`: rename `Learn` link to `Play`, swap icon to `Gamepad2`, point to `/`
- [x] 6.2 Verified `Chat`, `Profile`, account, and auth links continue to work (no other Header changes)

## 7. Verification

- [ ] 7.1 Manually walk-test the full loop on desktop (deferred to user — type-check + lint pass; runtime test requires browser session)
- [ ] 7.2 Manually walk-test on mobile viewport (deferred to user)
- [x] 7.3 Run typecheck — clean except for 3 pre-existing test-type errors (TS2556) unrelated to this change
- [ ] 7.4 Confirm hard-reload resets state (deferred to user — store has no persistence layer, will reset by design)
- [ ] 7.5 Lighthouse / dev-tools fps sanity check (deferred to user)
