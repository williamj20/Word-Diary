'use server';

import {
  CurrentProfile,
  ProfileFormSchema,
  ProfileFormState,
} from '@/app/lib/definitions';
import sql from '@/app/lib/dbClient';
import { getCurrentUser } from '@/app/lib/utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

export const updateCurrentProfile = async (
  _previousState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> => {
  const user = await getCurrentUser();
  const fields = {
    displayName: String(formData.get('displayName') ?? ''),
    username: String(formData.get('username') ?? ''),
  };

  if (!user) {
    return {
      fields,
      message: 'Your session has expired. Please sign in again.',
    };
  }

  const validatedFields = ProfileFormSchema.safeParse(fields);
  if (!validatedFields.success) {
    return {
      fields,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  try {
    const updatedProfiles = await sql<CurrentProfile[]>`
      update public.profiles
      set
        display_name = ${validatedFields.data.displayName},
        username = ${validatedFields.data.username}
      where id = ${user.id}::uuid
      returning
        display_name as "displayName",
        username
    `;

    if (updatedProfiles.length !== 1) {
      throw new Error('Profile update did not return exactly one row');
    }
  } catch (error) {
    if (
      error instanceof sql.PostgresError &&
      error.code === '23505' &&
      error.constraint_name === 'profiles_username_key'
    ) {
      return {
        fields,
        errors: {
          username: ['This username is already taken.'],
        },
      };
    }

    console.error('Failed to update profile', error);
    return {
      fields,
      message: 'We could not update your profile. Please try again.',
    };
  }

  revalidatePath('/profile');
  revalidatePath('/profile/edit');
  redirect('/profile');
};
