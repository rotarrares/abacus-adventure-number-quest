# Magic Bakery Game Assets

This document outlines the visual assets required for the "Robi and Ana's Magic Bakery" game mode.

**Suggested Base Path:** `public/assets/images/magic_bakery/`

---

## 1. Characters

*   **Robi:** A cheerful boy character. Needs variations for different expressions/actions.
    *   **Filename:** `robi_neutral.png`
    *   **Description:** Robi standing, looking friendly and neutral/attentive. Whimsical, cartoon style matching the overall theme.
    *   **Size:** Approx. 150-200px height.
    *   **Format:** PNG (with transparency).
    *   **Variations:**
        *   `robi_happy.png`: Cheering, smiling broadly (for correct answers).
        *   `robi_thinking.png`: Slightly puzzled or looking thoughtful (for hints or incorrect answers).
        *   `robi_explaining.png`: Pointing or gesturing, looking like he's explaining something.
*   **Ana:** A clever girl character. Needs variations similar to Robi.
    *   **Filename:** `ana_neutral.png`
    *   **Description:** Ana standing, looking friendly and knowledgeable. Style consistent with Robi.
    *   **Size:** Approx. 150-200px height.
    *   **Format:** PNG (with transparency).
    *   **Variations:**
        *   `ana_happy.png`: Clapping or smiling encouragingly.
        *   `ana_thinking.png`: Finger on chin, looking thoughtful.
        *   `ana_explaining.png`: Holding a notepad or pointing, looking like she's giving instructions.

## 2. Backgrounds

*   **Bakery Interior:** A background image for the main game screen.
    *   **Filename:** `bakery_background.jpg` (or `.png`)
    *   **Description:** A whimsical, colorful bakery interior. Could show counters, shelves with jars, an oven in the distance. Warm and inviting. Should match the level themes if possible, or be generic enough for all levels.
    *   **Size:** Full screen aspect ratio (e.g., 1920x1080px, but scalable).
    *   **Format:** JPG (if no transparency needed) or PNG.
    *   **Variations (Optional):** Different backgrounds for each level (Cupcake Corner, Cookie Kitchen, etc.) could enhance the theme. E.g., `bakery_bg_level1_cupcakes.jpg`, `bakery_bg_level2_cookies.jpg`.

## 3. Game Elements

*   **Ingredient Jar:** Visual representation for displaying numbers.
    *   **Filename:** `ingredient_jar.png`
    *   **Description:** A cute, slightly rounded glass jar, perhaps with a simple label area or lid. Could be generic or themed (e.g., flour jar, sugar jar). Needs to clearly display numbers inside or on it.
    *   **Size:** Approx. 100-150px height. Needs to fit numbers comfortably.
    *   **Format:** PNG (with transparency).
*   **Mixing Bowl:** Visual for the addition process.
    *   **Filename:** `mixing_bowl.png`
    *   **Description:** A simple, colorful mixing bowl. Needs to look like digits can be "poured" or mixed inside. Could have subtle texture.
    *   **Size:** Approx. 150-200px width.
    *   **Format:** PNG (with transparency).
*   **Carry-Over Indicator:** Visual for the digit being carried over.
    *   **Filename:** `carry_over_sparkle.png` (or similar)
    *   **Description:** Could be a glowing number '1' (or other digit), a sparkle effect, or a small "bubble" containing the digit. Needs to be visually distinct and noticeable when it "flies" to the next place value.
    *   **Size:** Small, approx. 30-40px.
    *   **Format:** PNG (with transparency).
*   **Baked Treats:** Visual rewards for correct answers. One for each level theme.
    *   **Filenames:** `treat_cupcake.png`, `treat_cookie.png`, `treat_pie.png`, `treat_donut.png`, `treat_cake.png`
    *   **Description:** Cute, appealing illustrations of each treat. Should look delicious and rewarding. Could have a slight glow or sparkle.
    *   **Size:** Approx. 80-120px.
    *   **Format:** PNG (with transparency).

## 4. UI Elements (Optional - Can be CSS/SVG)

*   **Buttons:** While likely CSS, custom image buttons could be used for "Mix Units", "Mix Tens", etc., or for answer options if desired.
    *   **Filename:** `button_mix.png`, `button_mix_hover.png` (etc.)
    *   **Description:** Themed buttons, perhaps looking like cookies or decorated signs.
    *   **Size:** Standard button sizes.
    *   **Format:** PNG.
*   **Recipe Book Icon/Visual:** If the RecipeBook component has a visual element beyond text.
    *   **Filename:** `recipe_book_icon.png`
    *   **Description:** A small icon representing a recipe book.
    *   **Size:** Small icon size, e.g., 32x32px or 64x64px.
    *   **Format:** PNG.

---