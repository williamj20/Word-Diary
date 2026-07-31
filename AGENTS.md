# Repository Guidelines

## Project Structure

This is a Next.js App Router project using React 19, TypeScript, Tailwind CSS 4, and Supabase.

- `src/app/`: routes, layouts, pages, API routes, and UI components.
- `src/app/(public)/`: public landing, login, and signup routes.
- `src/app/diary/`: authenticated diary route and diary-specific components.
- `src/app/components/`: shared app-level UI.
- `src/app/lib/`: data access, server actions, Supabase helpers, utilities, shared types, and validation schemas.
- `src/proxy.ts`: Supabase/session proxy middleware.
- `src/app/globals.css`: Tailwind import, design tokens, shared component classes, and true utilities.
- `supabase/`: local Supabase config and database migrations.
- `.agents/skills/`: project-local Codex skills. Use `.agents/skills/word-diary-responsive-css/SKILL.md` when changing UI/CSS.

There is still no dedicated automated test directory.

## Commands

- `npm run dev`: start the Next.js dev server with Webpack.
- `npm run build`: create a production build.
- `npm run start`: run the production build locally.
- `npm run lint`: run ESLint over the repo.
- `npm run db:start`: start the local Supabase CLI stack.
- `npm run db:reset`: reset the local Supabase database and reapply migrations.

Use `npm run dev` rather than bare `next dev`; the project intentionally uses `next dev --webpack`.

## Coding Style

Use TypeScript strict mode and prefer the `@/` alias for imports from `src/`. Keep React components in PascalCase and helpers, actions, and utilities in camelCase. Follow the existing 2-space indentation and concise component style.

ESLint enforces Next core web vitals, TypeScript rules, Prettier compatibility, `eqeqeq`, `curly`, no explicit `any`, and no unused variables unless prefixed with `_`.

Prefer server components unless client-side state, effects, browser APIs, or event handlers are required. Keep server actions in `src/app/lib/actions/`, data reads in `src/app/lib/data.ts`, and Supabase client helpers in `src/app/lib/supabase/`.

## CSS And UI

Use Tailwind-first styling and the existing design tokens in `src/app/globals.css`. For detailed responsive and CSS conventions, use `.agents/skills/word-diary-responsive-css/SKILL.md` instead of duplicating that guidance here.

## Testing And Verification

There is no `npm test` script. Treat `npm run lint` and `npm run build` as the minimum verification for meaningful code changes. Do not use `npx tsc --noEmit` as part of the standard test plan; the project is configured for Next’s build/type flow.

For docs-only changes, lint/build are optional unless the change affects generated docs, examples, or code snippets that should be checked.

## Supabase And Data

Local development uses the Supabase CLI stack. Production uses the hosted Supabase project. Keep local and production credentials separate.

Use migrations in `supabase/migrations/` for schema changes. `scripts/init.sql` and `docker-compose.yml` are legacy/reference material from the earlier local PostgreSQL setup; prefer Supabase CLI commands for current development.

## Security And Configuration

Do not commit Supabase keys, dictionary API keys, database URLs, or local secrets. Relevant environment variables include:

- `DICTIONARY_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `DATABASE_URL`

Document new environment variables in `README.md` or the PR description, and use safe local defaults where possible.
