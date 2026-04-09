drop table if exists public.word_meaning_definitions cascade;
drop table if exists public.word_meanings cascade;
drop table if exists public.user_words_list cascade;
drop table if exists public.words cascade;
drop table if exists public.profiles cascade;
drop function if exists public.handle_new_user() cascade;

create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  primary key (id)
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
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
  updated_at timestamptz not null default now()
);

create table public.user_words_list (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  word_id bigint not null references public.words(id) on delete cascade,
  added_at timestamptz not null default now(),
  constraint unique_user_word unique (user_id, word_id)
);

create table public.word_meanings (
  id bigint generated always as identity primary key,
  word_id bigint not null references public.words(id) on delete cascade,
  part_of_speech text not null
);


create table public.word_meaning_definitions (
  id bigint generated always as identity primary key,
  meaning_id bigint not null references public.word_meanings(id) on delete cascade,
  definition text not null,
  definition_order integer not null
);

create index idx_user_words_list_user_added_at on public.user_words_list(user_id, added_at desc);

alter table public.profiles enable row level security;
alter table public.words enable row level security;
alter table public.word_meanings enable row level security;
alter table public.word_meaning_definitions enable row level security;
alter table public.user_words_list enable row level security;

create policy "profiles select own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

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

create policy "authenticated can read definitions"
  on public.word_meaning_definitions
  for select
  to authenticated
  using (true);

create policy "user_words select own"
  on public.user_words_list
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "user_words insert own"
  on public.user_words_list
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "user_words delete own"
  on public.user_words_list
  for delete
  to authenticated
  using (user_id = auth.uid());
