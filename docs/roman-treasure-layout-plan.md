# Plan: Refactor Roman Treasure Hunt Layout

**Goal:** Implement a responsive layout for the game elements (Ana, Puzzle/Options, Treasure Chest, Robi) that arranges them in a column on mobile and a row on desktop, preventing overlap. Add a treasure chest image that changes based on answer correctness. Keep the `TreasureLog` fixed at the top.

**1. Refactor JSX in `src/components/modes/RomanTreasureMode.js`:**

*   Inside the `<Ruins>` component, replace the current structure with a dedicated `div` container having the class `game-area`.
*   Place the components within this `div` in the specified order:
    *   `<AnaCharacterRoman ... />`
    *   `<PuzzleCard ... />`
    *   `<RomanOptions ... />`
    *   An `<img>` tag for the treasure chest:
        *   Assign it a class, e.g., `treasure-chest`.
        *   Set the `src` conditionally based on the `isCorrect` state:
            ```javascript
            src={isCorrect ? `${process.env.PUBLIC_URL}/assets/images/treasure-open.png` : `${process.env.PUBLIC_URL}/assets/images/treasure-closed.png`}
            ```
        *   Add appropriate `alt` text (e.g., "Treasure Chest").
    *   `<RobiCharacter ... />` (conditionally rendered).
*   Remove any old layout `div`s that used absolute positioning for these elements.

**2. Update CSS in `src/styles/roman/Ruins.css`:**

*   **Remove Absolute Positioning:** Delete CSS rules for `.puzzle-options-group` and `.treasure-chest-image` if they use `position: absolute`.
*   **Style the New Container (`.game-area`):**
    *   Add a new rule for `.game-area`.
    *   **Mobile First (Default):**
        ```css
        .game-area {
          display: flex;
          flex-direction: column; /* Stack vertically */
          align-items: center;    /* Center horizontally */
          gap: 20px; /* Adjust spacing */
          width: 100%;
          padding: 10px 0;
        }
        ```
    *   **Desktop Layout (Media Query):**
        ```css
        @media (min-width: 768px) { /* Adjust breakpoint */
          .game-area {
            flex-direction: row; /* Arrange horizontally */
            justify-content: space-around; /* Distribute space */
            align-items: flex-end; /* Align to bottom */
          }
        }
        ```
*   **Style the Treasure Chest (`.treasure-chest`):**
    ```css
    .treasure-chest {
      width: 100px; /* Adjust size */
      height: auto;
    }
    ```
*   **Adjust `.ruins-content-area`:** Review and simplify its styles if `.game-area` now handles the primary layout within it.
*   **Review Individual Component Styles:** Ensure child components don't have conflicting fixed dimensions or margins.

**Mermaid Diagram:**

```mermaid
graph TD
    subgraph RomanTreasureMode.js Structure
        direction TB
        RTM[RomanTreasureMode Component] --> TL(TreasureLog);
        RTM --> RU(Ruins Component);
        RU --> GA(div.game-area);
        GA --> ANA(AnaCharacterRoman);
        GA --> PZ(PuzzleCard);
        GA --> OP(RomanOptions);
        GA --> TC(img.treasure-chest);
        GA --> ROB(RobiCharacter);
        RU --> FB(FeedbackDisplay);
        RTM --> TR(TreasureReward Modal);
    end

    subgraph CSS Layout (div.game-area)
        direction TB
        CSS_GA[Styles for .game-area] --> CSS_MOB(Mobile: flex-direction: column, align-items: center);
        CSS_GA --> CSS_DES(Desktop: flex-direction: row, justify-content: space-around, align-items: flex-end);
        CSS_GA --> CSS_GAP[gap: value];
        CSS_TC[Styles for .treasure-chest] --> CSS_TC_SIZE[width, height];
    end

    RTM_State[State (isCorrect)] -- controls --> TC(src);
    GA -- styled by --> CSS_GA;
    TC -- styled by --> CSS_TC;
```

**Summary:**

This plan uses Flexbox within a `.game-area` container for a responsive layout, integrates the treasure chest, and maintains the specified element order.