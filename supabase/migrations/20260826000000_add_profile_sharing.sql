begin;

alter table public.profiles
  add column username text,
  add column display_name text,
  add column profile_is_public boolean not null default true,
  add constraint profiles_username_key unique (username),
  add constraint profiles_username_canonical_check check (
    username is null
    or (
      username = lower(btrim(username))
      and username ~ '^[a-z0-9_]{3,30}$'
    )
  ),
  add constraint profiles_display_name_canonical_check check (
    display_name is null
    or (
      display_name = btrim(display_name)
      and char_length(display_name) between 1 and 80
    )
  );

revoke all
  on table public.profiles
  from anon, authenticated;

grant select (
    id,
    username,
    display_name,
    profile_is_public
  )
  on table public.profiles
  to anon, authenticated;

drop policy "profiles select own"
  on public.profiles;

create policy "profile rows are publicly discoverable"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

create table public.profile_follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followed_id uuid not null references public.profiles(id) on delete cascade,
  status text not null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  constraint profile_follows_pkey primary key (follower_id, followed_id),
  constraint profile_follows_no_self_follow_check check (follower_id <> followed_id),
  constraint profile_follows_status_check check (status in ('pending', 'accepted')),
  constraint profile_follows_status_timestamp_check check (
    (status = 'pending' and accepted_at is null)
    or (status = 'accepted' and accepted_at is not null)
  )
);

create index idx_profile_follows_followed_status
  on public.profile_follows(followed_id, status);

create index idx_user_words_list_word_id
  on public.user_words_list(word_id);

alter table public.profile_follows enable row level security;

create policy "profile follow participants can read"
  on public.profile_follows
  for select
  to authenticated
  using (
    (select auth.uid()) = follower_id
    or (select auth.uid()) = followed_id
  );

create policy "profile follow participants can delete"
  on public.profile_follows
  for delete
  to authenticated
  using (
    (select auth.uid()) = follower_id
    or (select auth.uid()) = followed_id
  );

revoke all
  on table public.profile_follows
  from anon, authenticated;

grant select, delete
  on table public.profile_follows
  to authenticated;

-- RPC naming convention: p_ identifies caller-supplied parameters, while v_
-- identifies local variables created and used only inside a function.
create function public.request_profile_follow(p_target_profile_id uuid)
returns public.profile_follows
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_profile_id uuid := auth.uid();
  v_target_profile_is_public boolean;
  v_follow_record public.profile_follows;
begin
  if v_current_profile_id is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication required';
  end if;

  if p_target_profile_id = v_current_profile_id then
    raise exception using
      errcode = '22023',
      message = 'A profile cannot follow itself';
  end if;

  select target_profile.profile_is_public
  into v_target_profile_is_public
  from public.profiles as target_profile
  where target_profile.id = p_target_profile_id
  for no key update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Target profile not found';
  end if;

  select follow_record.*
  into v_follow_record
  from public.profile_follows as follow_record
  where follow_record.follower_id = v_current_profile_id
    and follow_record.followed_id = p_target_profile_id;

  if found then
    return v_follow_record;
  end if;

  insert into public.profile_follows (
    follower_id,
    followed_id,
    status,
    accepted_at
  )
  values (
    v_current_profile_id,
    p_target_profile_id,
    case when v_target_profile_is_public then 'accepted' else 'pending' end,
    case when v_target_profile_is_public then pg_catalog.now() else null end
  )
  returning * into v_follow_record;

  return v_follow_record;
end;
$$;

create function public.accept_profile_follow(p_follower_profile_id uuid)
returns public.profile_follows
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_profile_id uuid := auth.uid();
  v_follow_record public.profile_follows;
begin
  if v_current_profile_id is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication required';
  end if;

  select follow_record.*
  into v_follow_record
  from public.profile_follows as follow_record
  where follow_record.follower_id = p_follower_profile_id
    and follow_record.followed_id = v_current_profile_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Follow request not found';
  end if;

  if v_follow_record.status = 'accepted' then
    return v_follow_record;
  end if;

  update public.profile_follows as follow_record
  set
    status = 'accepted',
    accepted_at = pg_catalog.now()
  where follow_record.follower_id = p_follower_profile_id
    and follow_record.followed_id = v_current_profile_id
  returning follow_record.* into v_follow_record;

  return v_follow_record;
end;
$$;

create function public.set_profile_public(p_profile_is_public boolean)
returns table (
  profile_is_public boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_profile_id uuid := auth.uid();
  v_current_profile_is_public boolean;
begin
  if v_current_profile_id is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication required';
  end if;

  if p_profile_is_public is null then
    raise exception using
      errcode = '22004',
      message = 'Profile visibility is required';
  end if;

  select current_profile.profile_is_public
  into v_current_profile_is_public
  from public.profiles as current_profile
  where current_profile.id = v_current_profile_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Profile not found';
  end if;

  if p_profile_is_public = v_current_profile_is_public then
    return query
    select v_current_profile_is_public;
    return;
  end if;

  update public.profiles as current_profile
  set profile_is_public = p_profile_is_public
  where current_profile.id = v_current_profile_id
  returning current_profile.profile_is_public
  into v_current_profile_is_public;

  if p_profile_is_public then
    update public.profile_follows as follow_record
    set
      status = 'accepted',
      accepted_at = pg_catalog.now()
    where follow_record.followed_id = v_current_profile_id
      and follow_record.status = 'pending';
  end if;

  return query
  select v_current_profile_is_public;
end;
$$;

revoke all
  on function public.request_profile_follow(uuid)
  from public, anon, authenticated;

revoke all
  on function public.accept_profile_follow(uuid)
  from public, anon, authenticated;

revoke all
  on function public.set_profile_public(boolean)
  from public, anon, authenticated;

grant execute
  on function public.request_profile_follow(uuid)
  to authenticated;

grant execute
  on function public.accept_profile_follow(uuid)
  to authenticated;

grant execute
  on function public.set_profile_public(boolean)
  to authenticated;

drop policy "user_words select own"
  on public.user_words_list;

create policy "user words are readable by owner or when profile is public"
  on public.user_words_list
  for select
  to anon, authenticated
  using (
    (select auth.uid()) = user_words_list.user_id
    or exists (
      select 1
      from public.profiles as profile
      where profile.id = user_words_list.user_id
        and profile.profile_is_public
    )
  );

create policy "accepted followers can read user words"
  on public.user_words_list
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profile_follows as follow_record
      where follow_record.follower_id = (select auth.uid())
        and follow_record.followed_id = user_words_list.user_id
        and follow_record.status = 'accepted'
    )
  );

create policy "anonymous can read public words"
  on public.words
  for select
  to anon
  using (
    exists (
      select 1
      from public.user_words_list as listed_word
      where listed_word.word_id = words.id
    )
  );

create policy "anonymous can read public meanings"
  on public.word_meanings
  for select
  to anon
  using (
    exists (
      select 1
      from public.user_words_list as listed_word
      where listed_word.word_id = word_meanings.word_id
    )
  );

grant select
  on table public.user_words_list, public.words, public.word_meanings
  to anon;

commit;
