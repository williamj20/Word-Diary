'use server';

import {
  getSignupErrors,
  LoginFormState,
  SignupFormState,
} from '@/app/lib/definitions';
import createSupabaseServerClient from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';

export const signup = async (_state: SignupFormState, formData: FormData) => {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const confirmPassword = String(formData.get('confirmPassword'));
  const fields = { email };

  const errors = getSignupErrors({ email, password, confirmPassword });
  if (errors) {
    return {
      fields,
      errors,
    };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return {
      fields,
      errors: {
        email: [error.message],
      },
    };
  }
  redirect('/');
};

export const login = async (_state: LoginFormState, formData: FormData) => {
  const supabase = await createSupabaseServerClient();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.log('Error logging in: ', error);
    return {
      fields: {
        email,
      },
      errors: [error.message],
    };
  }
  redirect('/diary');
};

export const logout = async () => {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
};
