import z from 'zod';

export interface MeaningContent {
  part_of_speech: string;
  definitions: string[];
}

export interface Meaning extends MeaningContent {
  id: number;
}

export interface Word {
  word: string;
  meanings: Meaning[];
}

export interface WordDefinition {
  word: string;
  meanings: MeaningContent[];
}

export interface SourcedWordDefinition {
  definition: WordDefinition;
  definitionHeadword: string;
}

export interface UserWordListEntry {
  addedAt: string;
  id: number;
  word: Word;
}

export interface CurrentProfile {
  displayName: string | null;
  username: string | null;
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

export const ProfileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(80, { error: 'Display name must be 80 characters or fewer.' })
    .transform(displayName => (displayName.length === 0 ? null : displayName)),
  username: z
    .string()
    .superRefine((username, context) => {
      if (username.length === 0) {
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
    })
    .transform(username =>
      username.length === 0 ? null : username.toLowerCase()
    ),
});

// route handler GET response
export interface WordLookupResponse {
  word: WordDefinition;
  isInUserList: boolean;
}

export interface WordLookupSuggestionsResponse {
  suggestions: string[];
}

export const DictionaryServiceObjectSchema = z.object({
  fl: z.string(), // functional label
  shortdef: z.array(z.string()), // short definitions
  hwi: z.object({
    hw: z.string(), // headword
  }),
});

export type DictionaryServiceObject = z.infer<
  typeof DictionaryServiceObjectSchema
>;

export const DictionaryServiceResponseSchema = z.union([
  z.array(z.string()),
  z.array(DictionaryServiceObjectSchema),
]);

export type DictionaryServiceResponse = z.infer<
  typeof DictionaryServiceResponseSchema
>;

export const SignupFormSchema = z
  .object({
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z
      .string()
      .min(8, { error: 'Be at least 8 characters long.' })
      .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
      .regex(/[0-9]/, { error: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        error: 'Contain at least one special character.',
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match.',
  });

export interface SignupErrors {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

export const getSignupErrors = (
  fields: z.input<typeof SignupFormSchema>
): SignupErrors | undefined => {
  const validatedFields = SignupFormSchema.safeParse(fields);
  return validatedFields.success
    ? undefined
    : z.flattenError(validatedFields.error).fieldErrors;
};

export interface MutationResult {
  success: boolean;
}

export type SignupFormState =
  | {
      fields?: {
        email?: string;
      };
      errors?: SignupErrors;
      message?: string;
    }
  | undefined;

export type LoginFormState =
  | {
      fields?: {
        email?: string;
      };
      errors?: string[];
    }
  | undefined;
