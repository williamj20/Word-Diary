import z from 'zod';

export enum ModalVariant {
  Danger = 'DANGER',
}

export interface Meaning {
  part_of_speech: string;
  definitions: string[];
}

export interface Word {
  word: string;
  id: number;
  meanings: Meaning[];
}

export interface WordFromUserList {
  id: number;
  word: Word;
  added_at: Date;
}

// route handler GET response
export interface WordLookupResponse {
  word: Word;
  isInUserList: boolean;
}

export interface DictionaryServiceObject {
  fl: string; // functional label
  shortdef: string[]; // short definitions
  hwi: {
    hw: string; // headword
  };
}

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
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
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
