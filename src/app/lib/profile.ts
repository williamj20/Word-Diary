import z from 'zod';

export interface Profile {
  id: string;
  displayName: string;
  username: string;
}

export interface ProfileFormFields {
  displayName: string;
  username: string;
}

export interface ProfileFormErrors {
  displayName?: string[];
  username?: string[];
}

export interface ProfileFormState {
  fields: ProfileFormFields;
  errors?: ProfileFormErrors;
  message?: string;
}

const DISALLOWED_USERNAMES = new Set(['edit']);

export const USERNAME_TAKEN_MESSAGE = 'This username is unavailable';

export const ProfileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, { error: 'Please enter a display name.' })
    .max(80, { error: 'Display name must be 80 characters or fewer.' }),
  username: z
    .string()
    .superRefine((username, context) => {
      if (username.length === 0) {
        context.addIssue({
          code: 'custom',
          message: 'Please enter a username.',
        });
        return;
      }
      if (/\s/.test(username)) {
        context.addIssue({
          code: 'custom',
          message: 'Username cannot contain spaces.',
        });
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        context.addIssue({
          code: 'custom',
          message: 'Use only letters, numbers, and underscores.',
        });
        return;
      }
      if (username.length < 3 || username.length > 30) {
        context.addIssue({
          code: 'custom',
          message: 'Username must be between 3 and 30 characters.',
        });
      }
      if (DISALLOWED_USERNAMES.has(username.toLowerCase())) {
        context.addIssue({
          code: 'custom',
          message: USERNAME_TAKEN_MESSAGE,
        });
      }
    })
    .transform(username => username.toLowerCase()),
});
