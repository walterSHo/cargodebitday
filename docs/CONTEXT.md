# Context

## UI Constraints

- The calculator page now uses a single dark visual system across the header, delay calculator, motivation calculator, summaries, hints, and disclaimer areas.
- Existing ids, `data-*` hooks, summary table ids, and group table structure are stable integration points and should be preserved unless a task explicitly allows logic-layer changes.
- Future visual updates should keep the page stylistically unified and should avoid mixing separate light and dark UI systems on the same screen.
- In the motivation section, the layout is built as two independent vertical stacks: the left stack contains `Місячна мотивація` → `Підсумок місяця` → `Загальний підсумок`, and the right stack contains `Квартальна мотивація` → `Підсумок кварталу` → action buttons.
- Motion and feedback should stay restrained and B2B-appropriate: subtle hover, focus, and press states are welcome, but avoid heavy animations, large transforms, or flashy dashboard effects.
- Input-driven motivation updates are optimized as frame-batched UI work (`requestAnimationFrame`) to keep typing smooth and avoid redundant rerender bursts.
- Quarterly group rendering relies on cached row/input DOM references; future changes should preserve this cache-friendly pattern to avoid repeated selector cost inside recalculation loops.

## Collaboration

- Default delivery flow is branch -> commit -> pull request into `main`; direct pushes to `main` should be avoided.
