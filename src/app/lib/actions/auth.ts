'use server';

import {
  LoginFormState,
  SignupFormSchema,
  SignupFormState,
} from '@/app/lib/definitions';
import createSupabaseServerClient from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import z from 'zod';

export const signup = async (_state: SignupFormState, formData: FormData) => {
  const name = String(formData.get('name'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const confirmPassword = String(formData.get('confirmPassword'));

  const validatedFields = SignupFormSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });
  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      fields: {
        name,
        email,
      },
      errors: {
        name: tree.properties?.name?.errors,
        email: tree.properties?.email?.errors,
        password: tree.properties?.password?.errors,
        confirmPassword: tree.properties?.confirmPassword?.errors,
      },
    };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await (
    await supabase
  ).auth.signUp({ email, password, options: { data: { name } } });

  if (error) {
    return {
      fields: {
        name,
        email,
      },
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
  redirect('/');
};
