---
name: word-diary-responsive-css
description: Use for Word Diary UI changes and reviews involving React layouts, Tailwind, shared CSS, or responsive behavior.
---

# Word Diary responsive CSS

Inspect the affected route, a comparable component, and `src/app/globals.css` for shared defaults and usage comments. When changing a shared rule, identify its consumers and verify each one.

## Layout and scrolling

- The root scroller in `src/app/layout.tsx` owns page overflow. Its `w-fit min-w-[max(100%,var(--app-min-width))]` wrapper can grow with content. At `--app-min-width` (25.5rem, normally 408px including gutters) and below, keep layout, type, spacing, and control sizes fixed. Narrower viewports scroll horizontally. Use parent-relative widths, inline component minimums, and a few size breakpoints above the minimum. Avoid `vw` sizing, universal overflow rules, and JavaScript sizing.
- Keep actions, word titles, usernames, emails, pronunciation controls, suggestions, and shortcuts on single rows. Size clipped cards to fit their contents. Use `scrollbar-none` on the root and dialog scrollers. Keep cards and control groups free of nested horizontal scrollers.
- Prose and multiword display names wrap. Form fields stack vertically. Preserve mobile landing-card stacking and the header menu breakpoint. Keep touch controls spaced and usable without hover.
- **Dialogs.** Fit overlays within the viewport and scroll vertically as needed. In lookup and delete panels, put the single-line title and all form or confirmation content in one two-axis `word-modal-content scrollbar-none` scroller. Use `word-modal-inner` to retain the content minimum of `calc(var(--app-min-width) - 4.875rem)` (normally 330px). Keep the 32×32px `word-modal-close` beside the scroller, aligned with the title and always reachable.
- **Study flashcards.** Use equal parent-relative widths capped at `max-w-2xl` and heights `h-80 sm:h-96 lg:h-[26rem]`. Both faces share one grid cell and scroll vertically. Allow long words, definition headings, and pronunciation to wrap. Shared headings and pronunciation controls use `w-max max-w-full` so their container determines wrapping without layout props.

## Shared CSS

Prefer inline Tailwind. Extract a global class only when at least two distinct components share a visual pattern worth naming. Keep small utility bundles inline. Put component classes in `@layer components` and shared single-purpose utilities in `@layer utilities`. Keep theme tokens and base styles global.

Follow existing class families such as `action-button-*` and `word-modal-*`. Use `@apply` for Tailwind bundles and plain CSS for tokens, gradients, and custom transitions. Keep shared defaults in the class and only genuine overrides inline. Retain single-consumer classes until superseded and remove obsolete classes after migration. Update this skill when conventions change.

## Visual conventions

- Preserve the paper gradients, inherited Literata font, and default tracking. Use margin, padding, and gap for spacing. Reserve `leading-*` for actual overlap or readability issues. Use arbitrary values only for a specific design or sizing need.
- Use ink for headings and ink-muted for supporting copy, labels, and metadata. Page/status headings use `text-2xl sm:text-3xl`, card/dialog headings `text-xl sm:text-2xl`, both `font-semibold`. Body uses `text-sm sm:text-base`, helpers `text-xs sm:text-sm`, eyebrows `text-[0.625rem] font-bold uppercase sm:text-xs`, and labels `form-input-label`. Preserve larger brand, hero, profile identity, and study-word type.
- Keep radii stable across widths. Use `rounded-[2rem]` for standard cards, diary frames, hero, flashcards, and word dialogs. Use `rounded-[1.75rem]` for diary word cards and lookup results, `rounded-2xl` for definition panels and header menus. Match existing control shapes. Reserve shadows for dropdowns (`shadow-sm`) and flashcards (`shadow-lg`). Preserve field focus rings.
- Use existing border tokens, `paper-soft` for backgrounds, `paper-card` for cards/forms, and `paper` or `paper-muted` for secondary surfaces. Use sage for primary/positive actions, brass for neutral structure, and danger tokens for destructive actions. Match saved words and lookup results, share part-of-speech badge styling, and match skeletons to loaded content. Indicate saved state with neutral surfaces and the saved control while preserving content colors.
- Buttons and action links use `transition-colors duration-100` on all devices. Swap token colors on hover, gate custom hover CSS with `@media (hover: hover)`, and apply `:active` colors immediately with a 100ms release. Keep timing shared and custom colors inline. Disabled controls retain resting colors on hover and press. Preserve disclosure and flashcard transform animations.
- Preserve accessibility-specific HTML attributes, including `aria-*`. Only add, refactor, or flag them when accessibility work is explicitly requested.

## Browser verification

- Check affected screens at 280, 320, 375, 768, and 1280px. Compare dimensions, type, spacing, and prose wrapping at the 408px minimum and below, including both flashcard faces and dialog content when affected. Only the visible scroll area should narrow.
- Exercise relevant empty, populated, expanded, pending, error, and long-content states. Check for overlap, clipped controls, unintended overflow, focus rings, and disabled interaction. For dialogs, include a short landscape viewport. At an effective 200×125 CSS pixels, scroll to the lookup field and actions, then back to the title with the close button reachable throughout.
- Report the browser checks actually performed and any coverage gaps.
