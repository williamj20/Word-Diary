# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js App Router project. Application routes and UI live in `src/app/`, including the diary pages, login/signup flows, and shared layout. Reusable server-side code lives in `src/app/lib/` for database access, server actions, Supabase helpers, utility functions, and shared TypeScript types. Database schema files live in `supabase/` and `scripts/init.sql`. There is currently no dedicated `tests/` directory.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js dev server with Turbopack.
- `npm run build`: create a production build.
- `npm run start`: run the production build locally.
- `npm run lint`: run project linting checks.
- `npm run db:start`: start the local PostgreSQL container from `docker-compose.yml`.
- `npm run db:reset`: recreate the local database container and data volume.

## Coding Style & Naming Conventions

Use TypeScript with strict mode enabled. Prefer the `@/` path alias for imports from `src/`. Name React components in PascalCase (`WordList.tsx`) and helpers, actions, and utilities in camelCase (`redirectToHomeIfLoggedIn`). Follow the existing style of 2-space indentation, concise React components, and Tailwind-first styling. Shared Tailwind component classes belong in `src/app/globals.css`. Formatting is handled with Prettier; linting uses ESLint with `next/core-web-vitals`, TypeScript, and Prettier configs.

## Testing Guidelines

There is no formal automated test suite yet and no `npm test` script. For now, contributors should treat `npm run lint` and `npm run build` as the minimum verification steps before opening a PR. If you add tests, keep them close to the feature they cover or introduce a consistent test directory and naming pattern such as `*.test.ts`.

## Commit & Pull Request Guidelines

Keep commit messages short, imperative, and focused on one change, matching the existing history (for example: `Add login form validation`). Pull requests should include a brief summary, note any schema or environment variable changes, and attach screenshots for UI updates. Link related issues when applicable and call out any follow-up work or known limitations.

## Security & Configuration Tips

Do not commit Supabase keys, dictionary API keys, or local database secrets. Document any new environment variables in `README.md` or the PR description, and prefer safe defaults for local development.
