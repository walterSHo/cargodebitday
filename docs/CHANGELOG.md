# Changelog

## 2026-04-20

- Added gentle threshold alerts (discount near 27.5% and quarterly groups close to 95%), a compact target slider (`Хочу +N грн`) with short actionable suggestions, and a sticky bottom `Загальна сума` bar for long-scroll visibility.
- Added a generic quiet info-status style for any neutral non-error/non-success message, optimized localStorage writes with dirty-state snapshot checks, and skipped hint-list rerender when markup is unchanged.
- Refined status typography to a single thinner size across both calculators, reduced opacity for non-critical info (`draft`) states, and forced monochrome status text in print/PDF output.
- Simplified status badges by removing the pill frame/background treatment and leaving only clean colored text for success/draft/error messages.
- Relaxed the previous print compression pass (larger print zoom and typography) so the PDF remains one-page on A4 but is easier to read.
- Tightened print/PDF output density (smaller page margins, typography, paddings, and metric/table spacing) and applied print zoom so the existing summary report fits on a single A4 page more reliably.
- Unified the 4-button action block density so all controls now share the same compact height/spacing, and added subtle low-contrast icons to `Умови мотивації` and `Завантажити PDF`.
- Rearranged the actions block so `Умови мотивації` and `Завантажити PDF` now sit side-by-side, giving a clean 2x2 layout for the four main action buttons.
- Fixed the motivation guide modal wiring (`Умови мотивації`) so the button opens the dialog correctly, and removed stray JS text that was rendered at the page bottom.
- Added a compact helper hint under `Плановий оборот (факт)` in the monthly block.
- Added a compact helper text under `Виконання плану продажів, %` to clarify plan-bonus tiers and the 27.5% discount reduction rule without changing formulas.
- Added a compact `Умови мотивації` button and a modal reference table (monthly, CRM, plan execution, delay, overdue, quarter, groups, tires) so full conditions are available on demand without overloading the main form.
- Removed distracting service labels near field titles in the motivation form: `Фокус` was fully removed, and noisy inline tags like `Впливає` / `Ризик` / `Штраф` are no longer rendered next to labels while keeping underlying calculations unchanged.
- Performed a safe UI performance cleanup pass without changing formulas or field composition: motivation recalculation from inputs is now frame-batched via `requestAnimationFrame` to reduce bursty rerenders while typing.
- Reduced repeated DOM querying in quarterly group updates by caching group row nodes/inputs once and reusing them in calculations.
- Lowered unnecessary DOM writes by updating quarterly average/status/progress cells only when values actually changed.
- Removed forced reflow from summary flash animation restart and now animate summary cards only when totals actually changed.
- Added lightweight PDF snapshot guarding so report DOM mirrors are not rewritten when motivation output is unchanged.
- Synced the same optimization changes across `index.html`, `docs/index.html`, and `assets/scripts/app.js`.

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
