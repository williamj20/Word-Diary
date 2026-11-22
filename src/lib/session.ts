import createSupabaseServerClient from '@/lib/supabase/server';
import { cache } from 'react';

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
});
