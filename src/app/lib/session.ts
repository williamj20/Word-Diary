import createSupabaseServerClient from '@/app/lib/supabase/server';
import { cache } from 'react';

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
