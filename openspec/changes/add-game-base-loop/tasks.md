# Tasks: Add Game Base Loop

## 1. Foundation

- [ ] 1.1 Create `app/game/` subtree with empty `engine/`, `world/`, `hud/`, `levels/` directories
- [ ] 1.2 Create `app/game/levels/home.ts` with placeholder level data (player spawn, ground bounds, three cell positions)
- [ ] 1.3 Define `app/page.types.ts` with `Position`, `CellState`, `BuildKind`, `Currencies`, `LevelData`
- [ ] 1.4 Create `app/page.stores.ts` Zustand store with player position, velocity, move target, cells map, currencies, current input buffer, target cell id
- [ ] 1.5 Replace `app/page.tsx` content with a client-only dynamic import of `<GameWorld />`. Move existing trainer-home content out of `page.tsx` (do not delete the components themselves)
- [ ] 1.6 Update `app/page.hooks.tsx` to remove trainer-home hooks; leave a minimal export surface
- [ ] 1.7 Verify no other route or component imports the removed home-page exports

## 2. Engine

- [ ] 2.1 Port `useGameLoop` from `v2` branch (`app/game/engine/useGameLoop.ts`). Pause on `document.hidden`
- [ ] 2.2 Port `GameWorld` skeleton (`app/game/world/GameWorld.tsx`): full-viewport container, camera transform, renders level platforms + entities. Strip platforming-specific pieces
- [ ] 2.3 Implement `app/game/engine/usePlayerMovement.ts`: click sets `moveTarget.x`; WASD/arrows set velocity directly; movement integrates each tick; player Y locked to ground
- [ ] 2.4 Implement `app/game/engine/proximity.ts` (pure): given player position and cells, return nearest cell id within radius or null
- [ ] 2.5 Render `Player.tsx` as `CustomCharacter` at player position; add walking animation (scale pulse while moving)
- [ ] 2.6 Camera X lerps to follow player; ground line is fixed Y

## 3. Morse input

- [ ] 3.1 Extract `lib/useMorseInput.ts` from `components/MorseTrainer.tsx` press/hold/audio logic. Hook signature: `{ onSignal, onBeepStart, onBeepEnd, enabled, dotThreshold }`
- [ ] 3.2 Update `MorseTrainer.tsx` to use the new hook. Verify identical behavior by manual side-by-side
- [ ] 3.3 Wire `Player.tsx` pointer + keyboard events to `useMorseInput`. Hook is `enabled` only when proximity returns a target cell
- [ ] 3.4 Maintain a per-cell input buffer in the store; append dot/dash on each `onSignal`
- [ ] 3.5 Auto-delimit timer fires "submit" when inter-character pause elapses; submission is the accumulated morse string for the current target cell

## 4. Cells and activation

- [ ] 4.1 Port `SpeechBubble.tsx` from `v2` branch. Preserve styling and animations exactly. Verify orange/blue variants render correctly
- [ ] 4.2 Implement `Cell.tsx`: renders the dormant cell sprite; shows speech bubble with the prompt when player is in proximity; renders the build sprite when active
- [ ] 4.3 On submission match: set cell status to `activating`, play bubble celebration animation, swap to build sprite with entry animation, then set status to `active`
- [ ] 4.4 On submission mismatch: shake speech bubble, clear input buffer
- [ ] 4.5 Add a contextual "Transmit" interact button rendered below the player when in proximity to a dormant cell, as an explicit affordance for first-time players (button does not bypass morse — it focuses the input)

## 5. HUD and currencies

- [ ] 5.1 Implement `HUD.tsx`: fixed top bar with Beep counter top-left, Buzz counter top-right
- [ ] 5.2 Implement `CurrencyCounter.tsx`: animated number, pop animation on burst, smooth ease on trickle
- [ ] 5.3 On cell activation, dispatch the burst per spec (alignment-dependent) and start a trickle timer in the game loop
- [ ] 5.4 Trickle pauses when game loop is paused (tab hidden)

## 6. Header

- [ ] 6.1 Update `components/Header.tsx`: rename `Learn` link to `Play`, point to `/`
- [ ] 6.2 Verify `Chat`, `Profile`, account, and auth links continue to work

## 7. Verification

- [ ] 7.1 Manually walk-test the full loop on desktop: click-walk and WASD both work, three cells activate, currencies tick
- [ ] 7.2 Manually walk-test on mobile viewport (Chrome dev tools touch emulation): tap-walk, tap-and-hold morse on character
- [ ] 7.3 Run existing test suites; fix any breakage caused by `MorseTrainer` hook extraction
- [ ] 7.4 Confirm that hard-reload resets state (no persistence is intentional in this slice)
- [ ] 7.5 Lighthouse / dev-tools sanity check: rAF runs at ~60fps with the three-cell level
