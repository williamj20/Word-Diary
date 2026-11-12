import z from 'zod';

export enum MatchKind {
  Exact = 'exact',
  Inflection = 'inflection',
  Variant = 'variant',
  Derived = 'derived',
  Phrase = 'phrase',
  Related = 'related',
}

const NonblankText = z.string().trim().min(1);
export const MeaningContentSchema = z.object({
  definitionHeadword: NonblankText,
  matchKind: z.enum(MatchKind),
  searchedWordPartOfSpeech: NonblankText.max(64).nullable(),
  definitionPartOfSpeech: NonblankText.max(64).nullable(),
  definitions: z.array(NonblankText).min(1),
  pronunciationWord: NonblankText,
  pronunciationText: NonblankText.nullable(),
  pronunciationUrl: z.url().nullable(),
});

export type MeaningContent = z.infer<typeof MeaningContentSchema>;
export type Pronunciation = Pick<
  MeaningContent,
  'pronunciationWord' | 'pronunciationText' | 'pronunciationUrl'
>;

export const WordDefinitionSchema = z.object({
  word: NonblankText.max(128).refine(word => word === word.toLowerCase()),
  meanings: z.array(MeaningContentSchema).min(1),
});

export interface Meaning extends MeaningContent {
  id: number;
}

export interface Word extends WordDefinition {
  meanings: Meaning[];
}

export type WordDefinition = z.infer<typeof WordDefinitionSchema>;

export interface UserWordListEntry {
  addedAt: string;
  id: number;
  word: Word;
}

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

// route handler GET response
export interface WordLookupResponse {
  word: WordDefinition;
  isInUserList: boolean;
}

export interface WordLookupSuggestionsResponse {
  suggestions: string[];
}

// Ignore malformed optional audio without losing otherwise usable definitions
// or valid recordings elsewhere in the pronunciation array.
const DictionaryPronunciationSchema = z
  .object({
    mw: z.string().optional(),
    sound: z
      .object({ audio: z.string().optional().catch(undefined) })
      .optional()
      .catch(undefined),
  })
  .nullable()
  .catch(null);

export const DictionaryPronunciationsSchema = z
  .array(DictionaryPronunciationSchema)
  .optional()
  .catch(undefined);

const pronunciationFields = { prs: DictionaryPronunciationsSchema };

const VariantSchema = z.object({
  va: z.string(),
  ...pronunciationFields,
});

const InflectionSchema = z.object({
  if: z.string().optional(),
  ...pronunciationFields,
});

const formFields = {
  ins: z.array(InflectionSchema).optional(),
  vrs: z.array(VariantSchema).optional(),
};

const sourceFields = {
  fl: z.string().optional(),
  shortdef: z.array(z.string()).optional(),
  // Only the limited sense extractor reads these sections. Keep their structure
  // without requiring unrelated illustrations/etymologies to validate.
  def: z
    .array(
      z.object({
        vd: z.string().optional(),
        sseq: z.array(z.unknown()),
      })
    )
    .optional(),
};

export const DictionaryServiceObjectSchema = z.object({
  meta: z.object({ id: NonblankText, stems: z.array(z.string()).optional() }),
  hwi: z.object({ hw: NonblankText, ...pronunciationFields }),
  ...sourceFields,
  ...formFields,
  ahws: z
    .array(z.object({ hw: z.string(), ...pronunciationFields }))
    .optional(),
  uros: z
    .array(
      z.object({
        ure: z.string(),
        fl: z.string().optional(),
        ...pronunciationFields,
        ...formFields,
      })
    )
    .optional(),
  dros: z
    .array(
      z.object({
        drp: z.string(),
        ...sourceFields,
        ...pronunciationFields,
        ...formFields,
      })
    )
    .optional(),
  cxs: z
    .array(
      z.object({
        cxl: z.string().optional(),
        cxtis: z.array(
          z.object({
            cxt: z.string(),
            cxr: z.string().optional(),
            cxn: z.string().optional(),
            cxl: z.string().optional(),
          })
        ),
      })
    )
    .optional(),
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
