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

export interface UserWordListEntry {
  addedAt: string;
  id: number;
  word: Word;
}

// route handler GET response
export interface WordLookupResponse {
  word: WordDefinition;
  isInUserList: boolean;
}

export interface DictionaryServiceObject {
  fl: string; // functional label
  shortdef: string[]; // short definitions
  hwi: {
    hw: string; // headword
  };
}

export const SignupFormSchema = z
  .object({
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z
      .string()
      .min(8, { error: 'Be at least 8 characters long' })
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

export interface MutationResult {
  success: boolean;
}

export type SignupFormState =
  | {
      fields?: {
        email?: string;
      };
      errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
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
