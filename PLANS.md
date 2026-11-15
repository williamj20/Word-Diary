# Apply the horizontal overflow convention throughout Word Diary

## Summary

The app already has a shared horizontal scroller, but individual wrapping, sizing, and clipping rules prevent consistent behavior.

Keep whole-page horizontal scrolling, with separate scrolling inside dialogs. Preserve mobile navigation, responsive feature-card layouts, vertical form fields, and normal prose wrapping.

## Shared implementation

- Keep the root scroller in `src/app/layout.tsx`. Give its inner wrapper `width: fit-content` and `min-width: max(100%, 20rem)` so it fills the viewport and can grow with content. This uses CSS’s intrinsic sizing behavior. [CSS sizing specification](https://www.w3.org/TR/css-sizing-3/#fit-content-size)
- Add a shared `scrollbar-none` utility in `src/app/globals.css`, replacing repeated scrollbar-hiding declarations in the root and dialogs.
- Make shared action buttons non-shrinking with single-line labels. Make shared word titles consistently non-wrapping.
- Add a shared dialog-content class that owns horizontal and vertical scrolling. Keep dialog panels within the viewport and close controls outside the scrolling content.
- Document scroll ownership and deliberate wrapping exceptions in the project’s responsive CSS skill. Keep component-specific layout decisions in Tailwind; avoid universal overflow rules or JavaScript sizing.

## Fix identified gaps

| Area                 | Planned change                                                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing page         | Keep primary and secondary actions on one row at narrow widths. Preserve stacked feature cards on mobile.                                                                                           |
| Profile setup/editor | Keep submit and cancel/sign-out actions together, retaining their desktop order and alignment.                                                                                                      |
| Profile card         | Keep the email-and-edit row together; preserve complete usernames and email addresses. Allow the panel to grow before its rounded-surface clipping can hide content.                                |
| Header               | Give the brand and navigation content-aware minimum widths and prevent the brand icon from shrinking. Preserve the compact mobile menu and desktop navigation breakpoints.                          |
| Lookup dialog        | Keep the input and search actions together, with a minimum input width of `12ch`. Keep suggestions and shortcut groups on single rows. Route their overflow through the shared dialog content area. |
| Delete dialog        | Keep cancel/delete actions together, including pending labels. Use the shared scrolling body and retain a reachable close control.                                                                  |
| Pronunciation        | Remove its independent horizontal scroller; let the containing page or dialog provide scrolling. Preserve playback behavior.                                                                        |
| Diary and flashcards | Preserve existing unwrapped rows and content-driven sizing. Match skeleton sizing to loaded cards and retain disclosure/flip animations.                                                            |

Keep prose and multiword display names naturally wrapping. Remove forced midword breaking from identifiers and word titles that should instead remain reachable through scrolling.

No API, component-prop, database, or authentication changes are required.

## Verification

- Run `npm run lint` and `npm run build`.
- Check every screen family at **320, 375, 768, and 1280px**, plus **280px** to exercise overflow and a short landscape viewport for dialogs.
- Cover signed-out and authenticated navigation, profile setup/editing, own/public diaries, lookup, deletion, flashcards, and error/not-found screens.
- Exercise long words, usernames, emails, pronunciations, suggestions, pagination, validation messages, loading, pending, empty, and expanded states.
- Verify that both ends of overflowing content are reachable, controls remain usable, scrollbars are hidden, and only the page or active dialog owns horizontal scrolling.
- Check menu visibility, field focus, disclosure animations, and flashcard flipping after the shared styling changes.

The read-only audit inspected the application’s UI source and checked eight public routes in Chrome at the five widths above. Authenticated screens, dialogs, and flashcards still require browser verification during implementation. No files have been changed.
