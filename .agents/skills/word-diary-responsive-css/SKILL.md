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

- Prioritize horizontal overflow scrolling across the entire app and all components when space becomes too narrow. Preserve the intended layout and arrangement of content and controls; treat wrapping or stacking as deliberate design choices rather than the default response to insufficient width.
- Adapt typography, spacing, and control sizes above the app's shared minimum width. At and below that minimum, preserve the same layout, typography, spacing, and control sizes and use horizontal scrolling. Content can require a wider minimum, but do not keep shrinking individual components after their containing layout stops shrinking.
- Keep horizontal scrollbars visually hidden while preserving native scrolling and access to all content and actions. Content extending beyond the visible area must remain reachable through scrolling.
- Base layouts must remain usable at 320px, including through intentional scrolling. Use a small number of meaningful responsive breakpoints and verify behavior below a layout's minimum width.
- Keep controls comfortably separated on touch screens and make all functionality available without hover.
- Constrain overlays to the available viewport height and allow vertical scrolling when needed, keeping dismissal controls and actions reachable in short or landscape viewports.
- Keep overflow deliberate and contained to the appropriate scroll container. Avoid accidental page overflow and unnecessary nested scroll areas. Check populated, empty, expanded, pending, and error states as applicable, including long content.
- Keep border radius stable across widths. Do not add responsive `rounded-*` changes for small screens; adjust spacing or layout instead.

### Scroll Ownership And Deliberate Wrapping

- The root scroller in `src/app/layout.tsx` owns page-level horizontal scrolling. Its inner wrapper uses `w-fit min-w-[max(100%,var(--app-min-width))]` to fill the viewport and grow with the content's intrinsic minimum width. The shared `--app-min-width` token is `25.5rem` (408px at the default root font size), including the page gutters. Keep component-specific minimum widths inline; do not add universal overflow rules or JavaScript sizing.
- Use parent-relative widths and fixed small-screen type/spacing sizes. Avoid `vw` sizing: it continues shrinking when the containing page already overflows. Keep size-changing breakpoints above the shared minimum, with no smaller-screen overrides beneath it.
- Use `scrollbar-none` on the root scroller and dialog content. Do not add independent horizontal scrollers to cards, pronunciation controls, action rows, or suggestions.
- Keep the lookup and delete panels within the viewport. Put the single-line title and all form or confirmation content inside one two-axis `word-modal-content scrollbar-none` scroller. Keep the 32×32px `word-modal-close` beside the scroller, aligned with the title at the top. This leaves the full inner height available for scrolling on short screens.
- Use `word-modal-inner` for the content inside that scroller. Its minimum width is `calc(var(--app-min-width) - 4.875rem)`, or 330px at the 408px app minimum. The 78px deduction covers 24px of overlay gutters, 2px of borders, 16px of left padding, 4px of right padding, and the 32px close button. Below the minimum, narrow the visible scroll area and retain the content sizing.
- Keep action groups, word titles, usernames, email addresses, pronunciation controls, suggestions, and shortcut groups on single rows. Let their containing page or dialog scroll once their minimum width is reached. Give clipped card surfaces a content-aware minimum width so their rounded edges cannot hide controls or identifiers.
- Study flashcards are an exception: keep every card the same parent-relative width, capped at `max-w-2xl`, and let long words, definition headings, and pronunciation content wrap. Shared definition headings and pronunciation controls use `w-max max-w-full` so the container width determines when they wrap, without layout props. Use fixed heights of `h-80 sm:h-96 lg:h-[26rem]`, with both faces in the same grid cell and vertical scrolling within each face for long content. Below the shared app minimum, retain card sizing and use root horizontal scrolling.
- Preserve deliberate wrapping: prose and multiword display names wrap naturally; form fields remain vertically arranged; landing feature cards stack on mobile; header navigation switches to its compact mobile menu at the existing breakpoint. These exceptions do not apply to action rows within those layouts.

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
- Use `transition-colors duration-100` for buttons and action links on all devices. Gate custom hover rules with `@media (hover: hover)`; Tailwind `hover:` utilities already do this. Give controls an immediate `:active` color change with a zero-duration transition, then use the normal 100ms transition on release. Keep shared timing in `globals.css` and custom control colors inline. Preserve disclosure and flashcard transform animations. Disabled controls retain their resting colors on hover and press.

## Review Checklist

- Check affected screens at 320, 375, 768, and 1280px, plus 280px to exercise page overflow and a short/landscape viewport for dialogs. At an effective 200×125 CSS pixels, scroll to the lookup field and actions, then back to the title. Check that the close button stays reachable throughout. Verify relevant empty, populated, expanded, pending, and error states and long content.
- Confirm no unintended horizontal scrolling, controls clipped without a scroll path, overlapping text, unreachable dialog actions, or hover-only functionality. Check field focus and disabled hover presentation.
- Verify the horizontal overflow convention across affected pages and components: preserve the intended layout at narrow widths, scroll only when needed, hide horizontal scrollbars, and keep all content and actions reachable. Treat deliberate horizontal scrolling as expected behavior in reviews.
- Compare element dimensions, font sizes, spacing, and prose wrapping at the shared minimum width and narrower viewports. They should match; only the visible scroll area should become narrower. Check both flashcard faces and dialog content, not just whether scrolling works.
- Confirm no new responsive rounded-radius changes were added.
- Confirm every new global class is used by at least two distinct, visually similar components and adds value beyond renaming a small utility bundle. Verify the shared consumers after changes.
- Confirm consumers do not repeat sizing or other defaults already owned by their shared class. Keep overrides only when the component needs a real difference.
- Confirm no avoidable `leading-*` utility was introduced.
- Confirm arbitrary values have a local reason, such as matching the existing rounded card language or solving a specific width constraint.
- Run `npm run lint` and `npm run build` for meaningful code changes. Report actual browser coverage and any limitations; do not claim mobile verification from source inspection alone.
