# beep.buzz v2 — Game Design PRD
### For: Claude Code agent collaboration session
### Status: Pre-development / Design phase

---

## Overview

beep.buzz is a Morse code learning app being redesigned from an interactive lesson + chat product into a 2D side-scrolling world-building game. The core thesis: **Morse input IS the action** — not a minigame layered on top of gameplay, but the primary mechanic through which the player interacts with the world.

The aesthetic and tone is inspired by:
- **Kingdom** (side-scrolling world exploration, resource management, emergent storytelling)
- **Duolingo** (quick reward loop, instant feedback, progressive skill unlocking)
- **Terra Nil** (patient world transformation, environmental restoration as win condition)
- **Solarpunk** (visual aesthetic of the end state — lush, technological, communal, hopeful)

---

## The World & Lore

The game world is a desolate wasteland. Two gods, **Beep** and **Buzz**, once communicated freely — but their dialogue broke down, and the world decayed. The player's role is to restore that communication and, through it, restore the world.

Morse code is literally the language of the gods. Every message you send is an act of divine invocation.

### The Gods

**Beep** — The Sun God
- Personality: warm, patient, organic, communal
- Domain: plants, solar energy, natural growth, warmth, living systems
- Currency: *beeps* (light pulses)
- Resource behaviour: TBD — options include: accumulates slowly and compounds (a planted tree generates passive beeps over time), or is earned through slow/deliberate Morse input

**Buzz** — The Storm God
- Personality: electric, urgent, chaotic, inventive
- Domain: technology, water extraction, wind turbines, machines, communication networks
- Currency: *buzzes* (energy charges)
- Resource behaviour: TBD — options include: volatile (discharges if unspent), earned through fast/rhythmic Morse input, or generated in bursts

> **Design note:** The tension between Beep and Buzz (patience vs urgency, organic vs technological) should be mechanically expressed — not just cosmetic. The balance between currencies needed for each build creates the core strategic layer.

---

## Core Gameplay Loop

1. **Explore** — Scroll through the world map horizontally. Cells of land are locked and desolate.
2. **Prompt** — Each cell has a Morse code prompt (a letter, word, or phrase, scaled to player level).
3. **Transmit** — Player inputs the correct Morse code. On success, the cell activates.
4. **Build** — The cell transforms: a tree grows, a windmill spins, a water tower rises.
5. **Earn** — The build generates beeps or buzzes passively over time.
6. **Spend** — Currency unlocks new cells, upgrades, and map expansion.
7. **Repeat** — The world gradually greens. The gods grow closer. The player learns Morse.

Every interaction teaches or reinforces a Morse character. Prompt difficulty scales with the player's demonstrated skill (tracked from v1's letter-learning system).

---

## World Progression / Tiers

The map transforms across tiers. Visual direction: grey/cracked → muted green → vibrant solarpunk.

| Tier | Dominant currency | Example builds |
|------|------------------|----------------|
| 1 | Beep-heavy | Grass patches, single trees, small solar collectors |
| 2 | Balanced | Forests, wind farms, small settlements, water condensers |
| 3 | Buzz-heavy | Solarpunk architecture, vertical gardens, light rail, comms towers |
| 4 | Both maxed | Bioluminescent trees, aurora sky effects, Beep and Buzz visible together |

> **Open question:** Is the map procedurally generated per session, or hand-authored with fixed narrative moments? A hand-authored map allows for placed story beats (a ruined city at the centre, a mountain that splits the two gods' domains). Procedural generation enables replayability.

---

## Morse Input System (Preserve from v1)

These mechanics are core and should be carried forward intact:

- **Dot/dash input** — tap for dot, hold for dash (mobile); configurable on desktop
- **Speed control** — adjustable WPM; affects how fast the world "listens" (lore framing welcome)
- **Auto-delimiting** — pauses between inputs automatically resolve to: dot/dash boundary → character boundary → word boundary → message boundary. This logic is the heart of the input feel and must be preserved exactly.
- **Letter tracking** — which characters the player has learned/practiced, used to scale prompt difficulty

> **Design note:** The speed control is not just a preference setting — it's a core accessibility and progression lever. Consider surfacing it prominently in the game UI.

---

## Multiplayer / Social Layer

Other players can join a world as guests. This is cooperative terraforming:

- Guests can claim and activate unclaimed cells using their own Morse input
- Chat between players happens in Morse code — the existing chat UX (speed control, auto-delimiting, username/random pairing) is preserved but now happens spatially within the world
- Messages could be rendered as travelling light pulses (Beep = warm light, Buzz = electric blue) moving across the landscape
- A player's world is their persistent territory; guests contribute to it

> **Open question:** Is the world persistent across sessions (a garden you tend over weeks) or session-based (a complete arc each play)? Persistent worlds are more emotionally resonant but significantly more complex to build and host.

---

## UI / Design Language

Carry forward from v1:
- Existing visual design system (colours, typography, component style)
- Speed control UI element
- Chat interface UX patterns
- Letter/character learned state tracking UI

New elements needed:
- Side-scrolling world map view (the primary game canvas)
- Cell/tile system with locked/unlocked/active states
- Resource display (beeps and buzzes, possibly as ambient visual counters)
- Build activation animation (the world coming alive)
- God presence indicators (Beep and Buzz visible in the sky, reacting to world state)

Aesthetic reference: Duolingo's reward feedback (celebration moments, streaks, level-ups) applied to world-building milestones rather than quiz completions.

---

## What to Rewrite vs Preserve

### Preserve
- Morse input engine (dot/dash timing, auto-delimiting, speed control)
- Letter learned tracking system
- Chat UX (random pairing, username entry, message delimiting)
- Visual design system

### Rewrite in service of the game
- Lesson structure → contextual prompts tied to world cells
- Progress tracking → the world itself is the progress indicator
- Home page → replaced by the game world view
- Chat page → embedded spatially in the world, still accessible as dedicated view

---

## Open Design Decisions

These are intentionally unresolved. Discuss and decide with the developer before implementing:

1. **Map generation:** Procedural (replayable, infinite) vs hand-authored (narrative, fixed) vs hybrid (authored spine with procedural fill)?

2. **World persistence:** Persistent across sessions (long-term emotional investment, requires backend) vs session-based (self-contained arc, simpler to ship)?

3. **Game tempo:** Real-time (Kingdom-style pressure, world advances while you deliberate) vs turn-based/paused (world only changes when you act, suits deliberate Morse input better)?

4. **Platform priority:** Mobile-first (tap/hold for dot/dash is natural) vs desktop-first (keyboard input, wider screen for world view)?

5. **Beep/Buzz resource mechanics:** How exactly do the two currencies behave differently? Should player behaviour (fast vs slow input, organic vs tech builds) influence which god favours them?

6. **Progression gate:** Is Morse skill the only unlock mechanism, or are there other resource/time gates? How do you handle a player who is Morse-proficient but new to the game vs a slow learner who has been playing for months?

7. **Onboarding:** How does a new player learn the game exists as a game, not just a lesson tool? What's the first 60 seconds?

---

## v1 Features to Carry Forward (Reference)

- Interactive lesson: show letter → user inputs Morse (or play Morse → user identifies letter)
- Instant feedback on input correctness
- Learned letters tracked per user
- Chat: connect with random user or by username
- Morse chat with speed control and auto-delimiting
- Character/word/message boundary detection from pause timing

---

## Suggested First Steps for Agent

1. Audit the v1 codebase — identify the Morse input engine, letter tracking, and chat modules as the preservation targets
2. Sketch the data model for: world cells, builds, player resources (beeps/buzzes), multiplayer world guests
3. Propose a component architecture for the game world canvas that can sit alongside (or replace) the current home page
4. Flag any v1 logic that conflicts with or needs adapting for the new game structure
5. Surface the open design decisions above as concrete implementation choices with tradeoffs — don't resolve them unilaterally

---

## Notes for Agent

- This document is a design brief, not a spec. Treat open questions as open — flag them, don't fill them in.
- The developer (Az) values directness and dislikes padding. Keep communication tight.
- The Morse input system is sacred. Any change to timing, delimiting, or feel needs explicit sign-off.
- The v1 chat UX is a strong asset — the multiplayer vision should extend it, not replace it.
- When in doubt, ask. This is a collaborative design process, not a solo build.
