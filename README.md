## Getting Started

The development server runs with webpack to resolve hot reload issues with the global CSS file:

```
npx next dev --webpack
```

## Environment Variables

```
DICTIONARY_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
DATABASE_URL
```

## Supabase CLI

This project uses Supabase for authentication and for a PostgreSQL database.

First, initialize the Supabase project:

```
supabase init
```

Then, connect to a local Docker Supabase project:

```
supabase start
```

Then, use `supabase status` to retrieve the env variables:

```
URL --> DATABASE_URL
Project URL --> NEXT_PUBLIC_SUPABASE_URL
Publishable --> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

To connect to the remote project, retrieve and use these variables from the actual Supabase project instead.

## Running PostgreSQL Locally Using Docker (Outdated)

The following instructions describe initializing a local Docker PostgreSQL DB, as it was used during initial development of the project. This is now **outdated**, but is kept as reference.

Run the following command to initialize a PostgreSQL docker container:

```
docker-compose up -d
```

Then to open an interactive PostgreSQL session in your terminal, run:

```
docker-compose exec db psql -U postgres word_diary
```

To reset your local database, run:

```
docker-compose down -v && docker-compose up -d
```
