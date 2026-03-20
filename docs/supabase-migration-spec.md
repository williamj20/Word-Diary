# Supabase Migration Specification

This document turns the current repo analysis into an implementation-ready migration plan for moving authentication and the application database fully onto Supabase.

## Honest recommendation

For this codebase, Supabase is the right default platform choice.

Why:

- the app already uses Supabase Auth,
- the remaining split-brain architecture comes from data still using direct `postgres`,
- the product is a user-scoped CRUD app with lightweight relational data,
- and Supabase gives you the best local/dev parity once you adopt the CLI, migrations, and RLS.

Where I would still be cautious:

- if you expect to add complex background jobs soon,
- if you want strict vendor portability,
- or if you want a very custom backend security model.

For the current app, those are not strong enough reasons to avoid Supabase.

---

## Current-state problems this plan fixes

1. **Split architecture**: auth is on Supabase, but application data goes through direct SQL using `POSTGRES_URL`.
2. **Wrong user model**: the schema defines its own `users` table instead of using `auth.users`.
3. **Incorrect runtime behavior**: the word lookup API currently hard-codes user id `'1'`.
4. **No Row Level Security**: the app is not yet using Supabase the way Supabase is meant to be used.
5. **Weak local/dev story**: local setup is plain PostgreSQL, not local Supabase.
6. **Schema management drift**: the source of truth is `scripts/init.sql` instead of versioned Supabase migrations.
7. **Non-atomic write orchestration in app code**: the add-word flow belongs in a database function or a tighter Supabase server-side mutation path.

---

# Target architecture

## Platform split

Use Supabase for:

- Auth
- Postgres
- Row Level Security
- SQL migrations
- RPC/database functions
- optional storage later

Keep in Next.js:

- server actions
- route handlers
- dictionary API integration
- UI rendering/state
- cache invalidation

## Target tables

### `public.profiles`

- `id uuid primary key references auth.users(id) on delete cascade`
- `name text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### `public.words`

- shared dictionary cache
- unique `word`
- one row per normalized word

### `public.word_meanings`

- child rows for `words`
- stores `part_of_speech`

### `public.word_meaning_definitions`

- child rows for `word_meanings`
- stores ordered definitions

### `public.user_words_list`

- joins an authenticated Supabase user to a word
- `user_id uuid references auth.users(id) on delete cascade`
- unique `(user_id, word_id)`

## Security model

### User-owned tables

- `profiles`: user can read/update own row only
- `user_words_list`: user can select/insert/delete own rows only

### Shared dictionary tables

- `words`, `word_meanings`, `word_meaning_definitions`: readable by authenticated users
- write access restricted to a privileged RPC function or service-role-only path

That combination gives you safe user isolation while still letting all users benefit from the shared cached dictionary data.

---

# Repository changes at a glance

## Files to delete or deprecate

### Remove from runtime usage

- `src/app/lib/dbClient.ts`
- `scripts/init.sql`

You can keep `scripts/init.sql` temporarily during the transition, but it should stop being the canonical source of truth.

## Files to add

```text
supabase/config.toml
supabase/seed.sql
supabase/migrations/20260320000100_initial_schema.sql
supabase/migrations/20260320000200_profiles_and_rls.sql
supabase/migrations/20260320000300_add_word_to_user_list_rpc.sql
src/app/lib/supabase/admin.ts
src/app/lib/supabase/queries.ts
src/app/lib/supabase/types.ts   # optional but recommended after generating types
.env.example
```

## Files to edit

```text
README.md
package.json
src/app/lib/data.ts
src/app/lib/actions/db.ts
src/app/lib/actions/auth.ts
src/app/lib/supabase/server.ts
src/app/(diary)/api/[word]/route.ts
src/app/(diary)/components/word-list.tsx
src/app/(diary)/components/delete-button.tsx
src/app/(diary)/components/add-word.tsx
src/app/(diary)/page.tsx
src/app/components/auth-buttons.tsx
src/app/lib/definitions.ts
```

Some component edits depend on how user identity is currently threaded through the app. The required behavioral changes are exact below even where the final code shape is your choice.

---

# Exact Supabase SQL migrations

Use the Supabase CLI and put the following migrations under `supabase/migrations/`.

## Migration 1: `20260320000100_initial_schema.sql`

Purpose:

- create the app tables under `public`,
- remove the custom `users` table concept,
- convert timestamps to `timestamptz`,
- add indexes and constraints.

```sql
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.words (
  id bigint generated always as identity primary key,
  word text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint words_word_check check (char_length(trim(word)) > 0)
);

create table if not exists public.word_meanings (
  id bigint generated always as identity primary key,
  word_id bigint not null references public.words (id) on delete cascade,
  part_of_speech text,
  created_at timestamptz not null default now()
);

create table if not exists public.word_meaning_definitions (
  id bigint generated always as identity primary key,
  meaning_id bigint not null references public.word_meanings (id) on delete cascade,
  definition text not null,
  definition_order integer not null,
  created_at timestamptz not null default now(),
  constraint word_meaning_definitions_definition_order_check check (definition_order > 0)
);

create table if not exists public.user_words_list (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  word_id bigint not null references public.words (id) on delete cascade,
  added_at timestamptz not null default now(),
  constraint user_words_list_user_id_word_id_key unique (user_id, word_id)
);

create index if not exists idx_words_word on public.words (word);
create index if not exists idx_word_meanings_word_id on public.word_meanings (word_id);
create index if not exists idx_word_meaning_definitions_meaning_id on public.word_meaning_definitions (meaning_id);
create index if not exists idx_user_words_list_user_id_added_at on public.user_words_list (user_id, added_at desc);
create index if not exists idx_user_words_list_word_id on public.user_words_list (word_id);
```

## Migration 2: `20260320000200_profiles_and_rls.sql`

Purpose:

- create automatic profile provisioning,
- enable RLS,
- add exact policies.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set name = excluded.name,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_words_list enable row level security;
alter table public.words enable row level security;
alter table public.word_meanings enable row level security;
alter table public.word_meaning_definitions enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "user_words_select_own"
on public.user_words_list
for select
using (auth.uid() = user_id);

create policy "user_words_insert_own"
on public.user_words_list
for insert
with check (auth.uid() = user_id);

create policy "user_words_delete_own"
on public.user_words_list
for delete
using (auth.uid() = user_id);

create policy "words_select_authenticated"
on public.words
for select
to authenticated
using (true);

create policy "word_meanings_select_authenticated"
on public.word_meanings
for select
to authenticated
using (true);

create policy "word_meaning_definitions_select_authenticated"
on public.word_meaning_definitions
for select
to authenticated
using (true);
```

### Why there are no insert/update/delete policies for dictionary tables

That is intentional.

The dictionary cache should not be directly mutable by normal clients. Writes should go through a controlled server mutation path, ideally an RPC function using `security definer` or a service-role-only path from the server.

## Migration 3: `20260320000300_add_word_to_user_list_rpc.sql`

Purpose:

- replace the current multi-step application transaction with one atomic database function,
- safely associate the current authenticated user to a word,
- insert meanings and definitions only when needed.

```sql
create or replace function public.add_word_to_user_list(
  input_word text,
  input_meanings jsonb
)
returns table (
  user_word_id bigint,
  word_id bigint,
  was_already_saved boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  normalized_word text;
  inserted_word_id bigint;
  inserted_user_word_id bigint;
  meaning_record jsonb;
  definition_text text;
  meaning_id bigint;
  existing_user_word_id bigint;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  normalized_word := lower(trim(input_word));

  if normalized_word = '' then
    raise exception 'Word cannot be empty';
  end if;

  insert into public.words (word)
  values (normalized_word)
  on conflict (word) do update
  set updated_at = now()
  returning id into inserted_word_id;

  select uw.id
  into existing_user_word_id
  from public.user_words_list uw
  where uw.user_id = current_user_id
    and uw.word_id = inserted_word_id;

  if existing_user_word_id is null then
    insert into public.user_words_list (user_id, word_id)
    values (current_user_id, inserted_word_id)
    returning id into inserted_user_word_id;
  else
    inserted_user_word_id := existing_user_word_id;
  end if;

  if not exists (
    select 1
    from public.word_meanings wm
    where wm.word_id = inserted_word_id
  ) then
    for meaning_record in
      select * from jsonb_array_elements(input_meanings)
    loop
      insert into public.word_meanings (word_id, part_of_speech)
      values (
        inserted_word_id,
        nullif(trim(meaning_record ->> 'part_of_speech'), '')
      )
      returning id into meaning_id;

      for definition_text in
        select value::text
        from jsonb_array_elements_text(coalesce(meaning_record -> 'definitions', '[]'::jsonb))
      loop
        insert into public.word_meaning_definitions (
          meaning_id,
          definition,
          definition_order
        )
        values (
          meaning_id,
          definition_text,
          coalesce(
            (
              select count(*) + 1
              from public.word_meaning_definitions d
              where d.meaning_id = meaning_id
            ),
            1
          )
        );
      end loop;
    end loop;
  end if;

  return query
  select
    inserted_user_word_id,
    inserted_word_id,
    existing_user_word_id is not null;
end;
$$;

revoke all on function public.add_word_to_user_list(text, jsonb) from public;
grant execute on function public.add_word_to_user_list(text, jsonb) to authenticated;
```

### Important note about `security definer`

This is one place where you need to be disciplined.

Because the function runs with elevated privileges, it **must derive the user from `auth.uid()` internally** and must **never accept `user_id` as a client argument**. The function above does that.

---

# Seed data for local development

Create `supabase/seed.sql`.

Do **not** seed fake rows into `auth.users` directly.

Instead, seed only shared dictionary data that is safe to exist without a real authenticated user.

```sql
insert into public.words (word)
values
  ('run'),
  ('bright'),
  ('cast')
on conflict (word) do nothing;

with run_word as (
  select id from public.words where word = 'run'
), bright_word as (
  select id from public.words where word = 'bright'
), cast_word as (
  select id from public.words where word = 'cast'
)
insert into public.word_meanings (word_id, part_of_speech)
select run_word.id, 'verb' from run_word
where not exists (
  select 1 from public.word_meanings where word_id = run_word.id and part_of_speech = 'verb'
)
union all
select run_word.id, 'noun' from run_word
where not exists (
  select 1 from public.word_meanings where word_id = run_word.id and part_of_speech = 'noun'
)
union all
select bright_word.id, 'adjective' from bright_word
where not exists (
  select 1 from public.word_meanings where word_id = bright_word.id and part_of_speech = 'adjective'
)
union all
select cast_word.id, 'verb' from cast_word
where not exists (
  select 1 from public.word_meanings where word_id = cast_word.id and part_of_speech = 'verb'
)
union all
select cast_word.id, 'noun' from cast_word
where not exists (
  select 1 from public.word_meanings where word_id = cast_word.id and part_of_speech = 'noun'
);
```

For local authenticated test users, create them through the local Supabase auth flow instead of trying to maintain them in seed SQL.

---

# Exact file-by-file code edits

This section describes the concrete changes each repo file needs.

## 1. `package.json`

### Remove

- `postgres` from `dependencies` once all runtime direct SQL usage is gone.
- `db:start` and `db:reset` scripts that use `docker-compose`.

### Add

Use scripts like these:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prepare": "husky",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:status": "supabase status",
    "supabase:migration:new": "supabase migration new"
  }
}
```

### Notes

- `supabase migration new` normally expects a name argument, so in practice your team may prefer documenting the command rather than leaving it as a reusable npm script.
- If you keep `db:*` scripts during transition, make README say they are deprecated.

## 2. `README.md`

### Replace the local DB section entirely

Replace the current “Running PostgreSQL Locally” section with:

- Supabase CLI installation instructions,
- `supabase start`,
- how to copy local keys into `.env.local`,
- how to run migrations and seed data,
- and how to sign up a local test user.

### Add sections

- Architecture overview
- Environment variables
- Local development with Supabase
- Hosted Supabase deployment
- How RLS works in this app

### Environment variable section should explicitly document

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DICTIONARY_API_KEY=
```

And explain:

- `NEXT_PUBLIC_*` values are safe in the browser,
- `SUPABASE_SERVICE_ROLE_KEY` is server-only,
- `POSTGRES_URL` is no longer required for normal app runtime.

## 3. `src/app/lib/dbClient.ts`

### Final state

Delete this file after all direct SQL usage has been removed.

### Why

This file is the old architecture:

```ts
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!);
```

That is exactly what you are moving away from.

## 4. `src/app/lib/supabase/server.ts`

### Keep

The basic server client helper.

### Change

Add a small helper that returns both the client and authenticated user when needed.

Recommended final shape:

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignored in server components
          }
        },
      },
    }
  );
};

export const getAuthenticatedUser = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return { supabase, user };
};
```

### Why

Multiple files now need the authenticated user before querying or mutating user-scoped data.

## 5. `src/app/lib/supabase/admin.ts`

### Add new file

Only create this if you decide to use service-role access from Next.js for privileged writes.

Recommended contents:

```ts
import { createClient } from '@supabase/supabase-js';

const createSupabaseAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export default createSupabaseAdminClient;
```

### Brutally honest note

If the RPC function is good enough, you may not need this at all. That is cleaner.

## 6. `src/app/lib/data.ts`

### Replace all direct SQL with Supabase reads

#### Current problems

- imports `sql` from `dbClient.ts`
- uses raw SQL joins
- caches user-scoped data with a static cache key root

#### Final responsibilities

- `getWordFromWordsTable(word)` should query `words` plus nested meanings/definitions through Supabase.
- `getWordFromUserList(userId, word)` should query only the authenticated user’s list.
- `getUserWords(userId)` should use a user-scoped cache key or skip caching until stable.

### Recommended implementation approach

Add a new helper file `src/app/lib/supabase/queries.ts` to keep nested selects readable.

Example implementation target:

```ts
import { unstable_cache } from 'next/cache';
import { Word, WordFromUserList } from '@/app/lib/definitions';
import { createSupabaseServerClient } from '@/app/lib/supabase/server';

export const getWordFromWordsTable = unstable_cache(async (word: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('words')
    .select(
      `
      id,
      word,
      word_meanings (
        part_of_speech,
        word_meaning_definitions (
          definition,
          definition_order
        )
      )
    `
    )
    .eq('word', word.toLowerCase())
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    word: data.word,
    meanings: (data.word_meanings ?? []).map(meaning => ({
      part_of_speech: meaning.part_of_speech,
      definitions: (meaning.word_meaning_definitions ?? [])
        .sort((a, b) => a.definition_order - b.definition_order)
        .map(definition => definition.definition),
    })),
  } satisfies Word;
});

export const getUserWords = async (
  userId: string
): Promise<WordFromUserList[]> => {
  const load = unstable_cache(
    async (scopedUserId: string) => {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('user_words_list')
        .select(
          `
          id,
          added_at,
          words (
            id,
            word,
            word_meanings (
              part_of_speech,
              word_meaning_definitions (
                definition,
                definition_order
              )
            )
          )
        `
        )
        .eq('user_id', scopedUserId)
        .order('added_at', { ascending: false });

      if (error || !data) return [];

      return data.map(row => ({
        id: row.id,
        added_at: new Date(row.added_at),
        word: {
          id: row.words.id,
          word: row.words.word,
          meanings: (row.words.word_meanings ?? []).map(meaning => ({
            part_of_speech: meaning.part_of_speech,
            definitions: (meaning.word_meaning_definitions ?? [])
              .sort((a, b) => a.definition_order - b.definition_order)
              .map(definition => definition.definition),
          })),
        },
      }));
    },
    ['user-words', userId],
    { tags: [`user-words-${userId}`] }
  );

  return load(userId);
};
```

### Important rule

Do not accept arbitrary user ids from client-controlled inputs. Only pass a user id that came from `supabase.auth.getUser()` on the server.

## 7. `src/app/lib/actions/db.ts`

### Current problems

- accepts `userId` directly,
- uses raw SQL transaction logic,
- deletes a row without verifying ownership inside the query,
- depends on `dbClient.ts`.

### Final behavior

- derive the user from the current server session,
- call the RPC for add,
- delete through Supabase with `eq('id', wordListId).eq('user_id', user.id)`,
- revalidate the correct user cache tag.

### Exact implementation target

```ts
'use server';

import { Word } from '@/app/lib/definitions';
import { revalidateTag } from 'next/cache';
import { getAuthenticatedUser } from '@/app/lib/supabase/server';

export const addWordToUserList = async (word: Word) => {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    throw new Error('You must be logged in to save a word.');
  }

  const { error } = await supabase.rpc('add_word_to_user_list', {
    input_word: word.word,
    input_meanings: word.meanings,
  });

  if (error) {
    console.error('Error adding word to user list', error);
    throw new Error('Failed to save word.');
  }

  revalidateTag(`user-words-${user.id}`);
};

export const deleteWordFromUserList = async (wordListId: number) => {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    throw new Error('You must be logged in to delete a word.');
  }

  const { error } = await supabase
    .from('user_words_list')
    .delete()
    .eq('id', wordListId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting word from user list', error);
    throw new Error('Failed to delete word.');
  }

  revalidateTag(`user-words-${user.id}`);
};
```

### Required call-site changes

Any component calling these actions must stop passing `userId`.

## 8. `src/app/lib/actions/auth.ts`

### Keep

Signup/login/logout through Supabase Auth.

### Change

- keep passing `{ data: { name } }` on signup,
- rely on the database trigger to create the profile row,
- optionally call `revalidatePath('/')` after login/logout if stale UI becomes a problem.

### Additional hardening

After signup, consider redirecting users to a “check your email” page if email confirmation is enabled in Supabase.

### Final note

This file does not need large architectural change. The big change is that profile persistence becomes real because the DB trigger now handles it.

## 9. `src/app/(diary)/api/[word]/route.ts`

### Current bug

This route currently uses:

```ts
const wordFromUserList = await getWordFromUserList('1', word);
```

That is wrong.

### Exact behavior change

- create the Supabase server client,
- get the authenticated user,
- if no user, either return `401` or continue with public dictionary lookup only,
- only query the user list when a real user is present.

### Recommended final structure

```ts
import { getWordFromUserList, getWordFromWordsTable } from '@/app/lib/data';
import { DictionaryServiceObject } from '@/app/lib/definitions';
import createSupabaseServerClient from '@/app/lib/supabase/server';
import { convertDictionaryServiceResponse } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.DICTIONARY_API_KEY;

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) => {
  const { word } = await params;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const wordFromUserList = await getWordFromUserList(user.id, word);
      if (wordFromUserList) {
        return NextResponse.json({
          word: wordFromUserList.word,
          isInUserList: true,
        });
      }
    }

    const wordFromWordsTable = await getWordFromWordsTable(word);
    if (wordFromWordsTable) {
      return NextResponse.json({
        word: wordFromWordsTable,
        isInUserList: false,
      });
    }

    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${API_KEY}`,
      { next: { revalidate: false } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch definition' },
        { status: 500 }
      );
    }

    const res: DictionaryServiceObject[] = await response.json();
    if (res.length === 0) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    const formattedWord = convertDictionaryServiceResponse(res, word);
    if (!formattedWord) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    return NextResponse.json({ word: formattedWord, isInUserList: false });
  } catch (error) {
    console.error('Error fetching definition:', error);
    return NextResponse.json(
      { error: 'Failed to fetch definition' },
      { status: 500 }
    );
  }
};
```

### Brutally honest recommendation

Do **not** make this endpoint require auth unless the whole add/search UX depends on it. It is better to allow anonymous lookup and only enforce auth for saving.

## 10. `src/app/(diary)/page.tsx`

### Change

Gate the diary page behind a real Supabase session if that is the intended product behavior.

Recommended pattern:

- if no authenticated user, redirect to `/login`, or
- render an empty state telling the user to sign in.

### Why

The diary itself is user-owned data now. Treat it that way.

## 11. `src/app/(diary)/components/word-list.tsx`

### Change

Fetch the authenticated user server-side before calling `getUserWords`.

### Exact behavior

- get current user from Supabase,
- if no user, render an empty state,
- if user exists, call `getUserWords(user.id)`.

Do not thread a fake or client-provided user id into this component.

## 12. `src/app/(diary)/components/delete-button.tsx`

### Change

If it currently calls `deleteWordFromUserList(userId, wordListId)`, update it to call `deleteWordFromUserList(wordListId)` only.

Ownership enforcement is now server-side through the authenticated session and RLS.

## 13. `src/app/(diary)/components/add-word.tsx`

### Change

If it currently calls `addWordToUserList(userId, word)`, update it to call `addWordToUserList(word)` only.

Also make sure the unauthenticated UX is explicit:

- disable the save action when logged out, or
- allow lookup but show a login prompt before save.

## 14. `src/app/components/auth-buttons.tsx`

### Change

If this component is already using Supabase session state indirectly, make sure the rendered login/logout state matches the authenticated server session used by the diary routes.

This may require:

- server-rendered session lookup in the parent layout, or
- a middleware/session refresh pattern if you notice stale auth UI.

## 15. `src/app/lib/definitions.ts`

### Optional but recommended updates

- keep `Word`, `Meaning`, and `WordFromUserList`,
- add explicit Supabase row-shape helper types if you are not using generated database types,
- document that `WordFromUserList.id` is the `user_words_list.id` row id.

If you generate Supabase types, prefer importing those rather than hand-maintaining table row shapes.

## 16. `.env.example`

### Add new file

Use this exact baseline:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
DICTIONARY_API_KEY=your-dictionary-api-key
```

### Notes

- For hosted environments, replace the URL and keys with the hosted project values.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

---

# Local development setup

## 1. Install and initialize Supabase

```bash
brew install supabase/tap/supabase
supabase init
```

If you do not use Homebrew, install the CLI using Supabase’s official instructions for your OS.

## 2. Configure `supabase/config.toml`

Use the generated file, but ensure:

- local auth is enabled,
- seed SQL is configured,
- the default local project ports do not conflict with anything else you run.

## 3. Start the local stack

```bash
supabase start
```

Then copy the local values from:

```bash
supabase status
```

into `.env.local`.

## 4. Apply migrations and seed

```bash
supabase db reset
```

This should rebuild the local database from migrations and `supabase/seed.sql`.

## 5. Create a local user

Use the app’s signup form against the local Supabase instance.

That is better than trying to fake auth users in SQL.

## 6. Run the app

```bash
npm install
npm run dev
```

---

# Hosted Supabase cutover checklist

This section is the exact order I recommend for production migration.

## Phase 0: preparation

- [ ] Create a new Supabase project for staging first.
- [ ] Decide whether to do a clean cutover or a one-time data migration from the old Postgres database.
- [ ] Enable email auth providers and configure redirect URLs.
- [ ] Store these secrets in your deployment environment:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` if needed
  - [ ] `DICTIONARY_API_KEY`

## Phase 1: schema setup

- [ ] Commit the `supabase/` directory and all migrations.
- [ ] Run migrations against staging.
- [ ] Confirm the following tables exist:
  - [ ] `profiles`
  - [ ] `words`
  - [ ] `word_meanings`
  - [ ] `word_meaning_definitions`
  - [ ] `user_words_list`
- [ ] Confirm the trigger on `auth.users` creates `profiles` rows.
- [ ] Confirm all RLS policies are enabled as expected.

## Phase 2: application refactor

- [ ] Remove direct `postgres` runtime usage.
- [ ] Remove all dependencies on `POSTGRES_URL`.
- [ ] Replace user-scoped reads with Supabase queries.
- [ ] Replace the add-word transaction with the RPC call.
- [ ] Replace delete logic with a session-derived delete using Supabase.
- [ ] Remove hard-coded user id usage, especially in `src/app/(diary)/api/[word]/route.ts`.
- [ ] Verify unauthenticated users cannot read or mutate another user’s data.

## Phase 3: data migration

If you have existing production data worth preserving:

- [ ] export current `words`, `word_meanings`, `word_meaning_definitions`, and `user_words_list` data,
- [ ] map legacy user ids to real `auth.users.id` UUIDs,
- [ ] import into Supabase,
- [ ] verify counts and spot-check several user accounts.

### Brutally honest warning

If the current system truly only has fake user `'1'` data, the migration may be simpler to discard than to preserve. Do not over-engineer a migration for test junk.

## Phase 4: verification

- [ ] Sign up a fresh user in staging and verify a `profiles` row appears.
- [ ] Log in and save a word.
- [ ] Refresh the diary page and confirm the word persists.
- [ ] Delete the word and confirm cache invalidation works.
- [ ] Confirm another user cannot see that word in their diary.
- [ ] Confirm shared dictionary reads still work.
- [ ] Confirm the public lookup route still works for logged-out users if that behavior is intended.

## Phase 5: production cutover

- [ ] Deploy application code with Supabase-backed data access.
- [ ] Run production migrations.
- [ ] Update production environment variables.
- [ ] Smoke test signup, login, lookup, save, delete.
- [ ] Remove any remaining old Postgres infrastructure from the runtime path.
- [ ] Remove `POSTGRES_URL` from deployment secrets once no longer needed.

---

# Local cutover checklist for this repo

Use this order in your branch.

1. [ ] Run `supabase init` and commit the generated config.
2. [ ] Add the three migrations above.
3. [ ] Add `supabase/seed.sql`.
4. [ ] Add `.env.example`.
5. [ ] Refactor `src/app/lib/data.ts` to Supabase reads.
6. [ ] Refactor `src/app/lib/actions/db.ts` to authenticated session + RPC/delete.
7. [ ] Fix `src/app/(diary)/api/[word]/route.ts` to stop using `'1'`.
8. [ ] Update diary page/components to require or gracefully handle auth.
9. [ ] Remove `src/app/lib/dbClient.ts`.
10. [ ] Remove `postgres` from `package.json`.
11. [ ] Replace README local DB instructions with Supabase CLI instructions.
12. [ ] Run a full local verification pass.

---

# Verification checklist and exact commands

Run these after implementing the code changes.

## Supabase local stack

```bash
supabase start
supabase db reset
supabase status
```

## App quality checks

```bash
npm install
npm run lint
npm run build
```

## Manual auth/data verification

1. Sign up a new local user.
2. Confirm a row exists in `public.profiles`.
3. Search a word not already saved.
4. Save it.
5. Confirm it appears in `user_words_list` for the signed-in user.
6. Log in as a second user.
7. Confirm the first user’s saved word does not appear in the second user’s diary.
8. Delete the word as the first user.
9. Confirm it is removed.

## Useful SQL smoke tests

```sql
select * from public.profiles;
select * from public.user_words_list order by added_at desc;
select * from public.words order by id desc limit 20;
```

---

# Final blunt recommendations

1. **Yes, move fully to Supabase for auth + app data.** That is the right simplification for this app.
2. **Do not keep the current split auth/database architecture.** It is awkward and undermines Supabase’s strengths.
3. **Do not keep passing `userId` through the UI for sensitive operations.** Derive identity from the authenticated server session.
4. **Do not skip RLS.** If you skip RLS, you are doing an incomplete migration.
5. **Use RPC for the add-word workflow.** The current application-managed multi-table insert flow is exactly the sort of thing a database function should own.
6. **Use local Supabase, not raw dockerized Postgres, if dev/prod parity matters.**

If you want the next step after this spec, the right move is to implement the migration in code in this repo in small reviewable commits:

1. add Supabase CLI/migrations,
2. refactor reads,
3. refactor writes,
4. update diary auth behavior,
5. delete legacy Postgres wiring.
