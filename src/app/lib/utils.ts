import createSupabaseServerClient from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';

// Prefix PostgreSQL LIKE/ILIKE metacharacters with the default backslash
// escape character so user-entered `\`, `%`, and `_` are matched literally.
export const escapeLikePattern = (value: string): string =>
  value.replace(/[\\%_]/g, character => `\\${character}`);

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
});

export const redirectToSignupIfNotLoggedIn = async () => {
  const user = await getCurrentUser();
  if (!user) {
    console.log('User is not logged in, redirecting to signup page');
    redirect('/signup');
  }
  return user;
};
