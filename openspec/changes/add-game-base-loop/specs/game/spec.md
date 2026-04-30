# Spec Delta: game

## ADDED Requirements

### Requirement: Game canvas at root route

The system SHALL mount the game canvas at the root route `/`, replacing the previous Morse-trainer-led home page.

#### Scenario: Visiting root renders the game canvas

- **WHEN** a user navigates to `/`
- **THEN** the system renders a full-viewport game canvas containing the player character, the side-scrolling world, and the HUD
- **AND** no Morse trainer or learned-letters UI is rendered on the home page

#### Scenario: Header remains visible on the game canvas

- **WHEN** the game canvas is rendered at `/`
- **THEN** the global Header is rendered above the canvas
- **AND** the Header's `Play` link points to `/`
- **AND** the Header's `Chat` link points to `/chat`

### Requirement: Player rendering and movement

The system SHALL render the player as a `CustomCharacter` at the world's ground level and move it under either click-to-walk or keyboard control.

#### Scenario: Click-to-walk

- **WHEN** the user clicks (or taps) anywhere within the game viewport that is not the player character or an interact button
- **THEN** the system sets a movement target at that X coordinate
- **AND** the player character accelerates toward the target at constant speed
- **AND** the player character stops when it reaches the target

#### Scenario: Keyboard movement

- **WHEN** the user holds `A`, `D`, `ArrowLeft`, or `ArrowRight`
- **THEN** the player character moves in the corresponding direction at constant speed
- **AND** any pending click-to-walk target is cleared
- **WHEN** the user releases all movement keys
- **THEN** the player character stops

#### Scenario: Camera follows the player

- **WHEN** the player character moves horizontally
- **THEN** the world camera lerps its X position toward the player's X
- **AND** the player remains roughly centered within the viewport

### Requirement: HUD displays both currencies

The system SHALL render a persistent HUD with a Beep counter at the top-left and a Buzz counter at the top-right.

#### Scenario: Initial counters

- **WHEN** the player first lands on the game canvas in a new session
- **THEN** both counters display `0`

#### Scenario: Currency burst animates on activation

- **WHEN** a cell activates
- **THEN** the corresponding counter (or both, for mixed cells) plays a pop animation
- **AND** the displayed value increases by the burst amount

#### Scenario: Currency trickle accrues over time

- **WHEN** at least one cell is in `active` state
- **AND** the game loop is running (tab visible)
- **THEN** the corresponding counter(s) increase smoothly at the cell's trickle rate

### Requirement: Hand-authored cells with prompts

The system SHALL place three hand-authored cells in the level on initial load.

#### Scenario: Three cells exist at level load

- **WHEN** the game canvas first mounts
- **THEN** exactly three cells are present in the world
- **AND** their prompts are `E`, `T`, and `IT` respectively
- **AND** their alignments are `beep`, `buzz`, and `mixed` respectively
- **AND** all three cells start in `dormant` state

### Requirement: Cell proximity reveals prompt

The system SHALL show a cell's prompt and an interact button when the player is within proximity radius of the cell.

#### Scenario: Approaching a dormant cell

- **WHEN** the player walks within proximity radius of a dormant cell
- **THEN** the cell renders a speech bubble containing its prompt
- **AND** an interact button labeled "Transmit" appears below the player

#### Scenario: Leaving cell proximity

- **WHEN** the player walks out of proximity of a cell that has an open prompt bubble
- **THEN** the bubble closes
- **AND** the interact button hides
- **AND** any in-progress Morse input buffer for that cell is cleared

### Requirement: Morse transmission against a cell

The system SHALL accept Morse input on the player character and submit it against the proximity-targeted cell.

#### Scenario: Tap on player while in cell proximity emits a dot

- **WHEN** the player is within proximity of a dormant cell
- **AND** the user taps (short press, under the dot threshold) on the player character
- **THEN** a dot is appended to the input buffer for that cell
- **AND** the dot tone plays

#### Scenario: Hold on player while in cell proximity emits a dash

- **WHEN** the player is within proximity of a dormant cell
- **AND** the user presses and holds (longer than the dot threshold) on the player character
- **THEN** a dash is appended to the input buffer for that cell
- **AND** the dash tone plays for the duration of the hold

#### Scenario: Morse input outside cell proximity is inert

- **WHEN** the player is not within proximity of any cell
- **AND** the user taps or holds on the player character
- **THEN** no Morse signal is recorded
- **AND** no audio plays

#### Scenario: Auto-delimit submits the buffer

- **WHEN** the user has appended at least one dot or dash to the input buffer
- **AND** the inter-character pause threshold elapses without further input
- **THEN** the system attempts to match the buffer against the target cell's prompt

### Requirement: Cell activation and reward

The system SHALL transition a cell from `dormant` to `active` on a correct Morse match, play the activation animations, and grant the configured currency burst and trickle.

#### Scenario: Correct submission activates the cell

- **WHEN** the input buffer matches the target cell's prompt exactly
- **THEN** the cell transitions to `activating`
- **AND** the speech bubble plays a celebratory animation
- **AND** the build sprite (sapling, turbine, or combined) appears with an entry animation
- **AND** the configured currency burst is added to the appropriate counter(s)
- **AND** the cell transitions to `active`
- **AND** the cell begins contributing its trickle rate to the appropriate counter(s)

#### Scenario: Incorrect submission shakes and resets

- **WHEN** the input buffer fails to match the target cell's prompt
- **THEN** the speech bubble plays a shake animation
- **AND** the input buffer is cleared
- **AND** the cell remains `dormant`

### Requirement: No persistence in this slice

The system SHALL hold all game state in memory only.

#### Scenario: Reload resets the world

- **WHEN** the user reloads the page
- **THEN** all cells return to `dormant` state
- **AND** both currency counters return to `0`
- **AND** the player respawns at the level's spawn point
