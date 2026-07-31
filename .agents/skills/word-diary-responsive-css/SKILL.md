---
name: word-diary-responsive-css
description: Project-specific responsive UI and CSS conventions for the Word Diary Next.js app. Use when Codex edits `src/app` screens, React components, Tailwind class names, `src/app/globals.css`, modals, forms, cards, pagination, or any visual layout that must remain polished on small-width screens.
---

# Word Diary Responsive CSS

## Overview

Follow the existing Word Diary styling system: Tailwind-first components, tokenized colors, stable rounded shapes, and small-width checks after layout changes.

## Before Editing

- Inspect the component being changed, nearby route/page files, and `src/app/globals.css` before editing styles.
- It is acceptable to sketch or implement the first pass from the desktop layout when that is the clearest way to reason about the screen. Before finishing, check the result at small widths and make only the responsive adjustments the component actually needs.
- Preserve the warm paper/card visual language: use existing CSS variables such as `var(--paper-card)`, `var(--paper-soft)`, `var(--ink)`, `var(--ink-muted)`, `var(--sage)`, `var(--sage-dark)`, `var(--brass)`, and danger tokens.
- Prefer existing shared classes (`auth-*`, `word-card-*`, `form-input`, `icon-button`, `error-message`, `keycap-style`, `display-font`) when the component is visually part of the same family.

## Responsive Rules

- Do not overfit components with many responsive rules. Add breakpoints only when there is a concrete small-width issue or an existing nearby pattern clearly calls for it.
- Keep border radius stable across widths. Do not add responsive `rounded-*` changes for small screens; adjust spacing or layout instead.

## CSS Class Placement

- Keep one-off styling inline in `className` with Tailwind utilities.
- Add or extend `src/app/globals.css` component classes only when at least two components use the same class and are visually similar, or when a repeated pattern is already established there.
- Put shared classes inside `@layer components`. Put true single-purpose utilities inside `@layer utilities`.
- Avoid creating generic global names for a single component. Prefer domain names that match existing families, such as `word-card-*`, `auth-*`, or `form-*`.
- Use `@apply` for Tailwind utility bundles in shared classes, then use plain CSS declarations for design tokens, gradients, custom transitions, and CSS variables.

## HTML Attributes

- Ignore accessibility-specific HTML attributes for this project, including `aria-*`, unless the user explicitly asks for accessibility work.
- Do not add, refactor, or flag missing `aria-*` attributes during responsive UI/CSS changes. Preserve existing attributes when editing nearby markup.

## Typography And Spacing

- Avoid `leading-*` unless a concrete overlap or readability problem requires it. The project generally relies on font defaults plus margin, padding, and gap.
- Reserve `display-font` for brand, page, section, and word titles. Use the body font for controls, descriptions, errors, and metadata.
- Keep uppercase metadata compact and token-colored. Use existing tracking patterns only when matching nearby eyebrow/label styles.
- Prefer spacing utilities (`mt-*`, `mb-*`, `gap-*`, `px-*`, `py-*`) over line-height adjustments to create vertical rhythm.

## Color, Borders, And Interaction

- Use `border border-[var(--...)]` with existing tokens instead of new border colors.
- Keep fills aligned with the current surface hierarchy: `paper-soft` for page/background-like areas, `paper-card` for cards and forms, `paper` or `paper-muted` for secondary surfaces.
- Use sage for positive/primary actions, brass for neutral structure, and danger tokens for destructive actions.
- Keep hover states simple color swaps using existing tokens. Preserve `transition-all duration-200` or `transition-colors` patterns already present.
- Use lucide icons at established sizes: commonly `h-4 w-4` for compact controls, `sm:h-5 sm:w-5` for modal close buttons, and larger sizes only for header/feature icons.

## Review Checklist

- If the screen was designed desktop-first, check narrow widths before completion.
- Confirm no new responsive rounded-radius changes were added.
- Confirm any new global class is used by at least two visually similar components or clearly extends an existing repeated family.
- Confirm no avoidable `leading-*` utility was introduced.
- Confirm arbitrary values have a local reason, such as matching the existing rounded card language or solving a specific width constraint.
