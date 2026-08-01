begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.words (
  id bigint generated always as identity primary key,
  word text not null unique,
  updated_at timestamptz not null default now(),
  constraint words_word_canonical_check check (
    word = lower(btrim(word))
    and char_length(word) between 1 and 128
  )
);

create table public.word_meanings (
  id bigint generated always as identity primary key,
  word_id bigint not null references public.words(id) on delete cascade,
  meaning_order integer not null,
  part_of_speech text not null,
  definitions jsonb not null,
  constraint word_meanings_order_positive_check check (meaning_order > 0),
  constraint word_meanings_part_of_speech_check check (
    char_length(btrim(part_of_speech)) between 1 and 64
  ),
  constraint word_meanings_definitions_array_check check (
    jsonb_typeof(definitions) = 'array'
    and jsonb_array_length(definitions) > 0
  ),
  constraint word_meanings_word_order_key unique (word_id, meaning_order)
);

create table public.user_words_list (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  word_id bigint not null references public.words(id) on delete cascade,
  added_at timestamptz not null default now(),
  constraint user_words_list_word_key unique (user_id, word_id)
);

create index idx_user_words_list_user_added_at
  on public.user_words_list(user_id, added_at desc);

create index idx_word_meanings_word_id
  on public.word_meanings(word_id);

alter table public.profiles enable row level security;
alter table public.words enable row level security;
alter table public.word_meanings enable row level security;
alter table public.user_words_list enable row level security;

create policy "profiles select own"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "authenticated can read words"
  on public.words
  for select
  to authenticated
  using (true);

create policy "authenticated can read meanings"
  on public.word_meanings
  for select
  to authenticated
  using (true);

create policy "user_words select own"
  on public.user_words_list
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "user_words insert own"
  on public.user_words_list
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user_words delete own"
  on public.user_words_list
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

commit;
