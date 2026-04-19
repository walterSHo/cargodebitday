# Changelog

## 2026-04-20

- Removed native number-field spin buttons from the calculator inputs to clean up the compact dark UI.
- Removed the yellow framed priority container treatment in the motivation form and kept priority feedback on the small label badges instead.
- Simplified the priority badge further so only colored text remains near the label, avoiding overlap with the field grid.
- Flipped the cat speech-bubble tail so it visually points toward the cat instead of away from it.
- Reworked the `Швидкий старт` copy and all four presets so they stay more realistic while still favoring the least painful overdue bucket (`1–10 днів`) for common short EUR delays.
- Synced the same behavior and preset data across `index.html` and `docs/index.html`.
- Blended the UI into a calmer hybrid of executive dashboard clarity, blue tactical accents, and restrained glass depth so the numbers remain the primary focus.

## 2026-04-19

- Reworked the visual presentation of the calculator page to align with the approved dark target design.
- Kept the existing business logic, calculations, field ids, DOM bindings, copy flow, and print/export behavior intact.
- Updated both `index.html` and `docs/index.html` so the main page and Pages build stay visually in sync.
- Tightened the motivation section geometry with sharper corners, smaller spacing, and a more compact layout scale.
- Reorganized summaries so the month summary sits under the monthly block, the quarter summary sits under the quarterly block, and the overall summary spans a full row below them.
- Adjusted the summary layout so `Загальний підсумок` now sits in the left lower card position instead of spanning the full row.
- Rebuilt the motivation layout into two independent vertical stacks so the left summary cards flow directly under the monthly block.
- Turned the EUR rate field into a combined input + `Автокурс` control and prepared the rate loader for Minfin-based autofill with fallbacks.
- Moved the remaining action buttons under `Підсумок кварталу`, removed both copy actions, and reorganized the controls into a compact two-row layout.
- Balanced the `Місячна мотивація` field grid to remove visual gaps and added restrained micro-interactions for inputs, buttons, cards, tables, and helper lists.
- Updated the quarterly group progress bars to use explicit fill-color thresholds: gray below 70%, yellow from 70% to under 95%, and green from 95%.
- Removed the internal scroll from the quarterly groups block so the full groups table expands to its natural height.
- Reworked the EUR rate control into a compact input with an inline refresh icon button, preserving manual entry, helper text, and auto-rate behavior.
- Replaced the quarterly progress bar color jumps with a smoother neutral-to-warning-to-success gradient fill while keeping the 95%+ end zone visually green.
- Polished the overall UI with stronger visual hierarchy, clearer focus/hover states, ambient depth, and light motion so the calculator feels cleaner and more tactile without changing business logic.
- Added a small cat easter egg in the lower summary area: it strolls back and forth on its own and changes its little message when clicked.
- Added local persistence so the calculator restores the latest user inputs on return, and moved the cat into a compact block under `Загальний підсумок` without mirrored text while it moves.
- Tightened the persistence flow for manual edits and clears, removed the visible `Пасхалка` label, and added a much denser print layout aimed at fitting the PDF output onto a single page.
- Compressed the print stylesheet even further by hiding the hints section in PDF, reducing print spacing and typography, and applying a stronger print zoom to improve one-page output.
- Added a `Швидкий старт` panel with four realistic preset scenarios that autofill the existing calculator fields without changing the business logic.
- Introduced a soft autosave status (`Чернетка оновлена` / `Збережено`), smarter `localStorage` persistence flow, contextual summary notes, and priority highlighting for the fields that most strongly affect the result.
- Reworked PDF export into a separate clean short report that prints only summary content, adds a compact `Ключові показники` row, and includes a timestamped unbranded report header.
- Improved zero-state and reward feel by making empty summaries more guided, adding subtle success emphasis for strong results, and giving the cat easter egg celebratory reactions when all quarterly groups are green.
