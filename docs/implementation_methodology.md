# Abacus Adventure Number Quest - Implementation Methodology

This document outlines the recommended implementation methodologies for the Abacus Adventure Number Quest project, emphasizing modularity and maintainability, especially concerning the separation of different game modes.

## Core Principles

1.  **Game Mode Separation:** This is the most critical principle. Each distinct game mode (e.g., "Compare Numbers", "Write Number", "Match Number", "Read & Build") must be implemented as independently as possible. Components, logic (hooks, utils), constants, and styles specific to one game mode **must not** be directly used by another game mode. This prevents unintended side effects and makes adding or modifying games easier.
2.  **Modularity:** Break down features and UI elements into small, reusable components.
3.  **Clear Naming Conventions:** Use descriptive names for files, components, functions, variables, and CSS classes.
4.  **Co-location:** Keep related files together where practical (e.g., component JS/TSX and its specific CSS/SCSS).

## Directory Structure and File Responsibilities

*   **`src/`**: Root source directory.
    *   **`App.js`**: The main application component. Handles top-level routing or state management to switch between different screens (`StartScreen`, `GameScreen`, `TutorialScreen`). It should delegate game-specific logic to the `GameScreen` and the specific mode components.
    *   **`index.js`**: Application entry point. Renders `App` and sets up providers (like Context, i18n).
    *   **`i18n.js`**: Configuration for internationalization.
    *   **`components/`**: Contains all React components.
        *   **`abacus/`**: **Shared Components.** Components related to rendering and interacting with the abacus visualization (e.g., `Abacus.js`, `Abacus3D.js`, `AbacusControls.js`). These are fundamental and used across multiple game modes.
        *   **`compare/`**: **Game-Specific Components (Example).** Components used *exclusively* by the "Compare Numbers" game mode (e.g., `CompareAbacus.js`, `DualAbacusSection.js`). Follow this pattern for other game modes if they require unique, complex components.
        *   **`modes/`**: **Game Mode Controllers.** Each file represents a distinct game mode (e.g., `CompareNumbersMode.js`, `WriteNumberMode.js`, `MatchNumberMode.js`, `ReadBuildMode.js`). These components are responsible for:
            *   Managing the state and logic specific to that game mode (often using custom hooks).
            *   Orchestrating the UI by composing shared components (`abacus/`, `ui/`) and game-specific components (like those in `compare/`).
            *   Fetching or generating game data (numbers to compare, target numbers, etc.).
            *   Handling user interactions within the game context.
        *   **`screens/`**: **Shared Components.** High-level screen containers (e.g., `StartScreen.js`, `GameScreen.js`, `TutorialScreen.js`). `GameScreen` likely acts as a wrapper that renders the currently selected game mode component from `modes/`.
        *   **`ui/`**: **Shared Components.** General-purpose, reusable UI elements used across different screens and game modes (e.g., `FeedbackDisplay.js`, `GameHeader.js`, `Instructions.js`, `Numpad.js`, `TreasureReward.js`). These should be generic and stateless where possible.
    *   **`constants/`**: Contains constant values.
        *   Create separate files for constants specific to a game mode (e.g., `compareNumbersConstants.js`).
        *   A general `appConstants.js` can hold truly global constants if needed.
    *   **`context/`**: React Context for global state management.
        *   **`GameContext.js`**: Should manage state shared across the entire application (e.g., user profile, overall progress, selected language, difficulty settings). **Avoid** storing state specific to the *currently running* game mode here; that state belongs within the mode's component or its dedicated hook.
    *   **`hooks/`**: Custom React Hooks.
        *   Create hooks to encapsulate complex stateful logic for specific game modes (e.g., `useWriteNumberGame.js`). Follow this pattern (e.g., `useCompareNumbersGame.js`, `useMatchNumberGame.js`).
        *   General-purpose hooks (e.g., `useAudio.js` if created) can also reside here.
    *   **`services/`**: For interacting with external APIs or complex, non-UI logic.
        *   **`GameService.js`**: Could handle fetching game configurations, saving progress, etc., potentially interacting with a backend if one exists (like `server.js`).
    *   **`styles/`**: CSS files.
        *   Prefer co-locating styles with components (CSS Modules, styled-components) or using a BEM-like naming convention if using global CSS files.
        *   Ensure CSS for one game mode does not unintentionally affect others. Name files clearly (e.g., `CompareNumbersMode.css`, `WriteNumberMode.css`).
    *   **`utils/`**: Utility functions.
        *   Categorize utilities into files based on functionality (`abacusUtils.js`, `audioUtils.js`, `numberUtils.js`, `difficultyUtils.js`, `effectsUtils.js`, `gameLogicUtils.js`).
        *   If a utility function is *only* used by a single game mode, place it in a dedicated file for that mode (e.g., `compareNumbersUtils.js`) or consider if it belongs within the mode's hook or component itself. Avoid bloating general utility files with game-specific logic.

## Adding a New Game Mode

1.  **Create Mode Component:** Add a new component file in `src/components/modes/` (e.g., `NewGameMode.js`).
2.  **Develop Logic:**
    *   If state logic is complex, create a new hook in `src/hooks/` (e.g., `useNewGameHook.js`).
    *   If unique components are needed, create a new directory `src/components/newgame/` and place them there.
    *   If specific utilities are required, create `src/utils/newGameUtils.js`.
    *   If specific constants are needed, create `src/constants/newGameConstants.js`.
3.  **Compose UI:** Use shared components (`ui/`, `abacus/`) and any new game-specific components within the mode component.
4.  **Integrate:** Update `App.js` or relevant routing/state logic (likely in `StartScreen.js` or `GameScreen.js`) to allow selection and rendering of the new game mode.
5.  **Styling:** Add necessary styles, preferably co-located or in a clearly named file in `src/styles/` (e.g., `NewGameMode.css`).
6.  **Testing:** Add unit/integration tests for the new mode and its components/hooks/utils.

By adhering to these methodologies, the project will remain organized, scalable, and easier to maintain as new features and game modes are added.
