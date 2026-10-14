'use server';

import {
  CurrentProfile,
  ProfileFormSchema,
  ProfileFormState,
} from '@/app/lib/definitions';
import sql from '@/app/lib/dbClient';
import { getCurrentProfile } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

const saveProfile = async (
  mode: 'create' | 'update',
  formData: FormData
): Promise<ProfileFormState> => {
  const fields = {
    displayName: String(formData.get('displayName') ?? ''),
    username: String(formData.get('username') ?? ''),
  };

  let profile: CurrentProfile | null;
  let profileId: string | undefined;
  try {
    profile = await getCurrentProfile();
    // Before a profile exists, its ID comes from the authenticated account.
    profileId = profile?.id ?? (await getCurrentUser())?.id;
  } catch (error) {
    console.error(`Failed to ${mode} profile`, error);
    return {
      fields,
      message: `We could not ${mode} your profile. Please try again.`,
    };
  }

  if (mode === 'create' && profile) {
    redirect('/diary');
  }

  if (!profileId) {
    return {
      fields,
      message: 'Your session has expired. Please sign in again.',
    };
  }

  if (mode === 'update' && !profile) {
    redirect('/onboarding/profile');
  }

  const validatedFields = ProfileFormSchema.safeParse(fields);
  if (!validatedFields.success) {
    return {
      fields,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  try {
    const { displayName, username } = validatedFields.data;
    if (mode === 'create') {
      await sql`
        insert into public.profiles (id, display_name, username)
        values (${profileId}::uuid, ${displayName}, ${username})
        on conflict (id) do nothing
      `;
    } else {
      const updatedProfiles = await sql`
        update public.profiles
        set display_name = ${displayName}, username = ${username}
        where id = ${profileId}::uuid
        returning id
      `;
      if (updatedProfiles.length !== 1) {
        throw new Error('Profile update did not return exactly one row');
      }
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

    console.error(`Failed to ${mode} profile`, error);
    return {
      fields,
      message: `We could not ${mode} your profile. Please try again.`,
    };
  }

  revalidatePath('/', 'layout');
  redirect(mode === 'create' ? '/diary' : '/profile');
};

export const createCurrentProfile = async (
  _previousState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> => saveProfile('create', formData);

export const updateCurrentProfile = async (
  _previousState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> => saveProfile('update', formData);
