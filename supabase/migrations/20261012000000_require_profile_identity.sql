begin;

-- Profiles are now created explicitly after signup, once both names are supplied.
drop trigger on_auth_user_created on auth.users;
drop function public.handle_new_user();

alter table public.profiles
  alter column display_name set not null,
  alter column username set not null;

commit;
