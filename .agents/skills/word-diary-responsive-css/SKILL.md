---
name: word-diary-responsive-css
description: Project-specific responsive UI and CSS conventions for the Word Diary Next.js app. Use when Codex edits `src/app` screens, React components, Tailwind class names, `src/app/globals.css`, modals, forms, cards, pagination, or any visual layout that must remain polished on small-width screens.
---

# Word Diary Responsive CSS

## Overview

Preserve Word Diary's warm paper-and-ink journal aesthetic. Use inline Tailwind, the inherited Literata font, and existing color tokens. Standardize by component role; the hero, brand, profile identity, and study word intentionally have larger display typography. Responsive and mobile-friendly behavior is a completion requirement for UI changes.

## Before Editing

- Inspect the component being changed, nearby route/page files, and `src/app/globals.css` before editing styles.
- Inspect the shared class consumers before modifying a rule; verify each affected component afterwards.
- For new components, inspect a comparable existing component and the usage comments in `src/app/globals.css`. Reuse suitable shared classes; use the code as the reference for their current defaults and keep sizing differences inline.

## Responsive Rules

- Base utilities must work at 320px. Add `sm`, `md`, or `lg` rules when content needs more room; do not overfit with many breakpoints. A desktop-first sketch still requires narrow-width verification before completion.
- Use responsive typography, spacing and control sizes appropriate to each screen width. Wrap or stack content when it cannot fit comfortably, keeping text readable and controls easy to use. Use `min-w-0` on constrained flex/grid children, `shrink-0` on icons, and `break-words` for long words or `break-all` for email/username values where needed.
- Keep controls comfortably usable and separated on touch screens. Keep menus inside the viewport and make all functionality available without hover.
- Constrain dialogs to the dynamic viewport height (`100dvh`). Use `min-h-0 overflow-y-auto overscroll-contain` for scrollable content, reserve space for close buttons, and keep actions reachable in short/landscape viewports. Do not hide overflow on content that must be read without providing a scroll path.
- Avoid unintended horizontal page scrolling at supported widths. Check populated, empty, expanded, pending, and error states as applicable, including long content.
- Keep border radius stable across widths. Do not add responsive `rounded-*` changes for small screens; adjust spacing or layout instead.

## CSS Class Placement

- Prefer inline Tailwind. Give shared component classes useful defaults, and keep layout, spacing, and sizing differences inline. Small repeated utility bundles are fine; do not extract a class just to eliminate repetition.
- Create a class in `src/app/globals.css` only when at least **two distinct components** actually share a cohesive visual recipe, such as a button, menu item, or dialog surface. Two consumers are a minimum, not an automatic reason to extract a class. Repeated elements within one component do not qualify.
- Put shared component classes inside `@layer components`. Any new custom single-purpose utility belongs in `@layer utilities` and must also have at least two distinct component consumers. Existing theme tokens and base styles remain global.
- Use descriptive family names such as `action-button-*`, `header-menu-*`, `word-modal-*`, and `form-*`. Do not create a single-consumer global class merely to shorten JSX.
- Use `@apply` for Tailwind utility bundles in shared classes, then use plain CSS declarations for design tokens, gradients, custom transitions, and CSS variables.
- Preserve existing single-consumer rules unless the current work supersedes them; remove obsolete classes after migrating their consumers. Keep this skill synchronized when changing these conventions.

## Component Conventions

Use these shapes for comparable UI roles:

| Role                                                        | Shape                            |
| ----------------------------------------------------------- | -------------------------------- |
| Standard cards (auth, profile, feature, empty/error/status) | `rounded-[2rem]`                 |
| Diary word cards and lookup results                         | `rounded-[1.75rem]`              |
| Landing hero and study flashcard                            | `rounded-[2rem]`                 |
| Nested definition panels / diary outer frame                | `rounded-2xl` / `rounded-[2rem]` |
| Action/icon/pagination controls                             | Match the existing control shape |
| Header menus                                                | `rounded-2xl`                    |
| Word dialogs                                                | `rounded-[2rem]`                 |

- Use shadows only for dropdown menus (`shadow-sm`) and study flashcards (`shadow-lg`). Preserve field focus rings.
- Keep saved words and lookup results visually consistent, and reuse part-of-speech badge styling across word views. Preserve the existing paper gradients.
- Match loading skeletons to the loaded component.

## HTML Attributes

- Ignore accessibility-specific HTML attributes for this project, including `aria-*`, unless the user explicitly asks for accessibility work.
- Do not add, refactor, or flag missing `aria-*` attributes during responsive UI/CSS changes. Preserve existing attributes when editing nearby markup.

## Typography And Spacing

- Avoid `leading-*` unless a concrete overlap or readability problem requires it. The project generally relies on font defaults plus margin, padding, and gap.
- Use the inherited Literata font with its default character spacing throughout the app. Do not add alternate font families or font-family utilities; create hierarchy with size, weight, color, and capitalization.
- Prefer spacing utilities (`mt-*`, `mb-*`, `gap-*`, `px-*`, `py-*`) over line-height adjustments to create vertical rhythm.

| Text role           | Tailwind recipe                                          |
| ------------------- | -------------------------------------------------------- |
| Page/status heading | `text-2xl font-semibold sm:text-3xl`                     |
| Card/dialog heading | `text-xl font-semibold sm:text-2xl`                      |
| Standard body       | `text-sm sm:text-base`                                   |
| Eyebrow             | `text-[0.625rem] font-bold uppercase sm:text-xs`         |
| Form label          | `text-xs font-bold uppercase` through `form-input-label` |
| Helper text         | `text-xs sm:text-sm`                                     |

Headings use ink; supporting copy, labels, and metadata use ink-muted. Keep intentional display typography on the brand, hero, profile identity, and study word. Use real Tailwind sizes (`text-base`, `text-xl`); `text-md` and `text-1xl` are undefined.

## Color, Borders, And Interaction

- Use `border border-[var(--...)]` with existing tokens instead of new border colors.
- Keep fills aligned with the current surface hierarchy: `paper-soft` for page/background-like areas, `paper-card` for cards and forms, `paper` or `paper-muted` for secondary surfaces.
- Use sage for positive/primary actions, brass for neutral structure, and danger tokens for destructive actions.
- Keep hover states simple token color swaps. Do not desaturate a whole content subtree to indicate a saved state; use neutral surface tokens and the saved control state.
- Use `transition-colors duration-200` for ordinary controls; preserve disclosure and flashcard transform animations. Disabled controls retain their resting colors on hover.

## Review Checklist

- Check affected screens at 320, 375, 768, and 1280px, plus a short/landscape viewport for dialogs. Verify relevant empty, populated, expanded, pending, and error states and long content.
- Confirm no unintended horizontal scrolling, clipped controls, overlapping text, unreachable dialog actions, or hover-only functionality. Check field focus and disabled hover presentation.
- Confirm no new responsive rounded-radius changes were added.
- Confirm every new global class is used by at least two distinct, visually similar components and adds value beyond renaming a small utility bundle. Verify the shared consumers after changes.
- Confirm consumers do not repeat sizing or other defaults already owned by their shared class. Keep overrides only when the component needs a real difference.
- Confirm no avoidable `leading-*` utility was introduced.
- Confirm arbitrary values have a local reason, such as matching the existing rounded card language or solving a specific width constraint.
- Run `npm run lint` and `npm run build` for meaningful code changes. Report actual browser coverage and any limitations; do not claim mobile verification from source inspection alone.
