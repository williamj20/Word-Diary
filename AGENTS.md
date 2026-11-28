# Word Diary

Next.js App Router, React 19, strict TypeScript, Tailwind CSS 4, and Supabase. Edit files only when explicitly requested.

## Development

- Use `npm run dev` for Webpack. Run `npm run lint` and `npm run build` for meaningful code changes. The build handles type checking. There is no `npm test`. Docs-only edits need checks only for affected generated content or examples.
- Prefer Server Components. Keep route UI in `src/app/`, shared UI in `src/components/`, server actions in `src/lib/actions/`, reads in `src/lib/data.ts`, and Supabase clients in `src/lib/supabase/`. Prefer `@/` imports, two-space indentation, PascalCase components, and camelCase helpers and actions.
- For UI changes and reviews, follow `.agents/skills/word-diary-responsive-css/SKILL.md`.
- Use the local Supabase CLI and put schema changes in `supabase/migrations/`. Keep local and hosted production credentials separate. Never commit secrets. Give new environment variables safe local defaults where possible and document them in `README.md` or the PR description.

## Code review

Review changed code and affected callers. Use `vercel-react-best-practices` when available. Include all four sections, even when there are no findings.

1. **Bugs and required fixes** — Cite the code, impact, and concrete fix for each finding. State when none were found.
2. **Optional improvements** — Give the location, suggested change, and practical benefit for each worthwhile improvement.
3. **Review coverage** — Address correctness, security, regressions, edge cases, readability, naming, complexity, conventions, React/Next.js boundaries, state, effects, props, and data fetching. Include responsive behavior for UI changes and identify gaps.
4. **Verification** — Distinguish checks run during this review from earlier results. Identify what remains unverified.
