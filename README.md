## Getting Started

Install dependencies with `npm install`, start local Supabase, and configure the environment variables described below.

The development server runs with webpack to resolve hot reload issues with the global CSS file:

```
npm run dev
```

## Environment Variables

Set these variables in `.env.local`:

```
DICTIONARY_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
DATABASE_URL
```

## Supabase CLI

This project uses Supabase for authentication and for a PostgreSQL database. Its configuration and migrations are already tracked in `supabase/`.

With Docker running, start the local Supabase stack:

```
npm run db:start
```

Then, inspect the local connection details:

```
npx supabase status
```

Use the PostgreSQL connection URL for `DATABASE_URL`, the project/API URL for `NEXT_PUBLIC_SUPABASE_URL`, and the publishable key for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Set `DICTIONARY_API_KEY` separately using your dictionary API key.

To connect to the hosted project, use its connection details instead. Keep local and production credentials separate.
