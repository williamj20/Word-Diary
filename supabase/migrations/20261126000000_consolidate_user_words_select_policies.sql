begin;

drop policy "user words are readable by owner or when profile is public"
  on public.user_words_list;

drop policy "accepted followers can read user words"
  on public.user_words_list;

create policy "anonymous users can read public diaries"
  on public.user_words_list
  for select
  to anon
  using (
    exists (
      select 1
      from public.profiles as profile
      where profile.id = user_words_list.user_id
        and profile.profile_is_public
    )
  );

create policy "authenticated users can read visible diaries"
  on public.user_words_list
  for select
  to authenticated
  using (
    (select auth.uid()) = user_words_list.user_id
    or exists (
      select 1
      from public.profiles as profile
      where profile.id = user_words_list.user_id
        and profile.profile_is_public
    )
    or exists (
      select 1
      from public.profile_follows as follow_record
      where follow_record.follower_id = (select auth.uid())
        and follow_record.followed_id = user_words_list.user_id
        and follow_record.status = 'accepted'
    )
  );

commit;
