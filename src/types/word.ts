import type { MeaningContentSchema, WordDefinitionSchema } from '@/lib/word';
import type z from 'zod';

export type MeaningContent = z.infer<typeof MeaningContentSchema>;
export type Pronunciation = Pick<
  MeaningContent,
  'pronunciationWord' | 'pronunciationText' | 'pronunciationUrl'
>;

export type WordDefinition = z.infer<typeof WordDefinitionSchema>;

export interface Meaning extends MeaningContent {
  id: number;
}

export interface Word extends WordDefinition {
  meanings: Meaning[];
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

export interface WordLookupSuggestionsResponse {
  suggestions: string[];
}
