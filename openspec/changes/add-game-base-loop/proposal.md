# Add Game Base Loop

## Why

Slice 1 from `documentation/game.design.v2.md`. This is the smallest cut that proves the central "Morse input IS the action" loop feels good. It replaces the current Morse-trainer-led home page with the game canvas, establishes the engine plumbing all later slices build on, and surfaces both currencies in the HUD so the look and feel can be judged early.

No persistence, no decay, no NPCs, no chat-in-world, no multiplayer. Those are deliberately deferred to later slices.

## What Changes

- **Home page becomes the game.** `app/page.tsx` mounts a client-only game canvas that replaces the current trainer-led home content. The current home content (`MorseTrainer`, `LearnedLetters`, etc.) is removed from `/` but the components themselves are preserved unchanged for later reuse.
- **Header navigation update.** The `Learn` link is renamed to `Play` and points to `/`.
- **Engine plumbing ported from the `v2` branch.** A stripped-down `useGameLoop`, `GameWorld` scrolling container, and `SpeechBubble` component are ported. Gravity, jumping, hearts, enemies, doors, and the trainer modal are *not* ported.
- **Movement.** Click-to-walk (primary) and WASD / arrow keys (secondary) on flat ground. No gravity, no jumping.
- **HUD.** Beep counter top-left, Buzz counter top-right. Both start at 0.
- **Three hand-placed cells.** Cell 1 prompts `E` (Beep build = sapling). Cell 2 prompts `T` (Buzz build = small turbine). Cell 3 prompts `IT` (combined build).
- **Morse input.** Tap-and-hold on the player character emits dots and dashes, reusing v1's tap/hold + auto-delimit timing logic via a new shared `useMorseInput` hook.
- **Activation flow.** Player walks near a cell → speech bubble appears with the prompt → player transmits → on a correct match the bubble plays a celebratory animation, the build appears with an entry animation, a currency burst animates into the HUD, then the cell starts a slow trickle of currency.
- **State.** All game state in Zustand. No DB calls. State resets on reload (persistence is the next slice).

## Impact

- **Affected specs:** new capability `game`.
- **Affected code:**
  - `app/page.tsx` (rewritten — was trainer home, becomes game canvas mount)
  - `app/page.stores.ts` (rewritten — was trainer state, becomes game state)
  - `app/page.types.ts` (rewritten)
  - `app/page.hooks.tsx` (rewritten — was trainer hooks, becomes game hooks)
  - `components/Header.tsx` (rename `Learn` → `Play`)
  - new `app/game/` subtree: `engine/`, `world/`, `hud/`, `levels/`
  - new `lib/useMorseInput.ts` (extraction from existing `MorseTrainer` press/hold logic)
- **Preserved unchanged:** `components/MorseTrainer.tsx`, `components/LearnedLetters.tsx`, `components/MorseChat*.tsx`, `lib/morse.utils.ts`, all auth flows, `/chat`, `/profile`, `/account`, `/welcome`. The trainer is just no longer the home page.
- **Risks:** the trainer's tap/hold timing is sacred — the extracted hook must preserve byte-identical behavior. Validated by running the existing `MorseTrainer` against the new hook before shipping.
