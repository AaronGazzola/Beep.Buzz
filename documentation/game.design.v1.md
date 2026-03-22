# Beep.Buzz — Game Design Document v1

## Overview

Beep.Buzz is a 2D platformer where morse code is the core interaction mechanic. Players explore a world, engage enemies, unlock doors, and interact with NPCs entirely through morse code input. The educational structure follows Duolingo's curriculum approach — progressive letter introduction, varied challenge types, and clear progression gates — delivered inside an IdleOn-style world with character depth, items, and exploration.

---

## Core Concept

> A cheerful 2D platformer where you learn morse code by using it. Everything in the world responds to morse — enemies, doors, NPCs, chests. The better you know morse, the further you can go.

---

## Visual Style

- Abstract blob characters — the existing player character style extends to all NPCs, enemies, and bosses
- Cheerful, colorful, simplistic but animated and dynamic
- Duolingo-style UI and educational content
- IdleOn-style world structure and character depth

---

## Characters

### The Player
- Custom-named and styled blob character
- Appearance configured during the welcome/onboarding flow
- Starts with only **color** and **spikiness** customizable
- All other appearance options (hats, glasses, eyes, shoes, makeup, etc.) are unlocked through gameplay

### Beep
- Teacher NPC
- Lives in the home area — teaches and drills all letters the player has learned
- Also appears at the entrance of new zones before the player can enter — teaches only the new letters for that zone

### Buzz
- Teacher NPC (alongside Beep)
- Same role and placement as Beep
- Together, Beep and Buzz run all teaching sessions using the existing MorseTrainer interface

---

## Controls

### Movement
- **Click or tap anywhere on the screen** — the player character walks to that point
- The camera follows the character; the world scrolls

### Jumping
- **Auto-jump** — when the character reaches a ledge while moving, they jump automatically
- The player must keep moving; stopping mid-gap causes the character to fall and respawn at the last safe position

### Morse Input
- **Short tap on own character** — sends a dot (`·`)
- **Hold tap on own character** — sends a dash (`-`)
- Release ends the current element; a pause between inputs separates characters
- Morse is always contextual — what it does depends on what is nearby

### Interaction
- When the player stands in front of an interactable object (door, chest, ladder, signpost, NPC), a contextual **interact button** appears below the character
- Tapping the interact button triggers the action (open, climb, read, talk)

---

## Morse Input — Challenge Modes

When an enemy, door, NPC, or object requires a morse response, it displays a speech bubble showing the required input. There are three challenge modes:

| Mode | Visual | Audio | Difficulty |
|------|--------|-------|------------|
| Morse pattern + audio | Shows dots and dashes | Plays morse | Easiest — see and hear it, copy it |
| Letter + audio | Shows the letter | Plays morse | Medium — builds letter-to-sound association |
| Letter only | Shows the letter | None | Hardest — must recall pattern from memory |

- Audio is **never played alone** — it always accompanies a visual
- Morse pattern is **never shown without audio** — it always plays alongside
- Different enemies, doors, and NPCs use different modes, creating natural difficulty variety

---

## Hearts

- The player always has a maximum of **3 hearts**
- There is **no passive heart regeneration**
- Hearts are earned by:
  - Opening chests
  - Finding items in the world
  - Learning new letters with Beep or Buzz
- Losing all 3 hearts resets the player to the home area

---

## Enemy Behavior

### Reactive Enemies
- Only attack when the player inputs **incorrect morse**
- Forgiving — good for beginner zones and introductory encounters
- Still display a speech bubble with the required input

### Timer Enemies
- Attack after a set time if the player has not responded correctly
- Create urgency and pressure — used in later sections and boss run areas
- Also display a speech bubble, but the timer is visible

---

## Leveling

- Players earn XP from:
  - Correct morse responses
  - Defeating enemies
  - Learning new letters with Beep or Buzz
  - Defeating a zone boss for the first time
- **Leveling up primarily unlocks cosmetics** — new appearance options for the player character
- Leveling also **gates special areas** within the world (used later to separate multiplayer zones by skill level)
- There is no stat increase from leveling — skill progression comes from morse knowledge, not numbers

---

## Cosmetics & The Wardrobe

- The home area contains a **wardrobe** — the player interacts with it to change their appearance
- At the start, only color and spikiness are available
- All other options (hats, glasses, eye styles, shoes, makeup, etc.) are unlocked through:
  - Leveling up
  - Defeating bosses (each boss drops a specific cosmetic item)
  - Opening chests
- When a cosmetic item is received, it can be **instantly applied** — no need to visit the wardrobe first
- The wardrobe is used to swap between unlocked options at any time

---

## Letter Curriculum

Letters are introduced progressively, ordered by complexity:

| Stage | Letters | Available Words |
|-------|---------|-----------------|
| Zone 1 | E (`·`), T (`-`) | None (insufficient for real words) |
| Zone 2 | I (`··`), A (`·-`), N (`-·`), M (`--`) | TAN, ANT, MAN, EAT, ATE, NET, TEN, MINE, TEAM... |
| Zone 3 | S (`···`), O (`---`) | SO, SON, STONE, MOST, NOSE... |
| ... | ... | ... |

- Words are introduced gradually using **only letters the player has already learned**
- Word challenges appear from Zone 2 onwards as vocabulary grows
- Beep and Buzz always teach new letters before the player enters a zone that uses them

---

## World Structure

The world is structured in the style of IdleOn — a central home area with multiple doors leading outward to distinct zones.

### Home Area
- Safe zone — no enemies
- Contains:
  - **Beep and Buzz** — available to teach and drill any learned letter or word
  - **Starter chest** — contains one heart, available from the start
  - **Wardrobe** — for changing player appearance
  - **Multiple doors** — many locked initially, unlock as zones are completed
  - **Multiple signposts** — each contains a dialog explaining a game mechanic (read by standing in front and pressing the interact button)
- The player respawns here on death

### Onboarding
- New players are dropped directly into the home area with no forced tutorial
- Signposts explain the controls and mechanics at the player's own pace
- Beep and Buzz are immediately available to begin learning letters
- The door to Zone 1 is accessible once the player has interacted with Beep or Buzz and learned E and T

---

## Zone 1 — The Zap Lands

**Letters introduced:** E (`·`), T (`-`)

**Teaching gate:** The player must interact with Beep or Buzz at the zone entrance to learn E and T before entering. This uses the existing MorseTrainer interface.

---

### Section 1 — The Entry

- 2–3 **reactive enemies** (attack on wrong input only)
- All enemies display **morse pattern + audio** — the easiest mode, appropriate for first exposure
- A **signpost** explaining the morse input mechanic (tap character for dot, hold for dash)
- A **morse-locked door** displaying `·` (E) — player taps E to open it and progress

---

### Section 2 — The Middle

- Mix of **reactive and timer enemies** — pressure begins to build
- Enemy challenge mode variety:
  - Some display **morse pattern + audio**
  - Some display **letter + audio**
- A **chest** containing a heart — mid-zone reward for reaching this far
- A **morse-locked door** displaying `-` (T) — player taps T to open it
- A **platforming gap** — tests auto-jump movement, builds confidence with controls

---

### Section 3 — The Boss Run

- 2–3 **timer enemies** guarding the boss — all use urgency, no forgiving reactive behavior
- Enemy challenge modes:
  - **Letter + audio** — player sees the letter and hears the morse
- **Boss: The Zapper**
  - A large, animated blob enemy
  - Three phases:
    - **Phase 1** — displays E repeatedly, player must respond correctly multiple times to deal damage
    - **Phase 2** — displays T repeatedly, same mechanic
    - **Phase 3** — alternates between E and T unpredictably, player must read each prompt and respond correctly
  - Boss uses **letter + audio** throughout — tests both visual recall and audio recognition
  - Boss attacks on a timer — urgency is constant in all phases

**Completion reward:**
- A specific **cosmetic item** (e.g. a hat or eye style) unlocked immediately on defeat
- The corresponding **door in the home area unlocks**, granting access to Zone 2

---

## Multiplayer (Post-MVP)

Multiplayer is not part of the initial build but is designed into the world structure from the start.

- Players will appear in the world as their custom blob characters, with username and level displayed above them
- **Proximity chat** — morse tapped by nearby players appears as a speech bubble above their head, visible to players in range
  - Proximity audio can be muted or hidden
  - Does not conflict with contextual morse interactions
- Clicking on another player opens options: block, report, or request private chat
- Private chat moves to the existing chat page
- **Level-gated zones** — special areas accessible only at certain player levels will serve as skill-separated multiplayer zones (competent players interact in higher-level zones)

---

## Technical Notes

- Built as a web-based 2D platformer within the existing Next.js 15 app
- Game engine: to be decided (Phaser.js or Excalibur.js recommended — both TypeScript-compatible)
- Player character rendered using the existing blob character system
- MorseTrainer component reused for all Beep/Buzz teaching sessions
- Existing learned letters, XP, level, and character settings DB schema provides the foundation
- Existing chat infrastructure provides the foundation for multiplayer proximity chat
