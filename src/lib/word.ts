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

const SenseSchema = z.object({
  text: NonblankText,
  example: z
    .object({ text: NonblankText, attribution: NonblankText.optional() })
    .nullable(),
});

const DefinitionSchema = SenseSchema.extend({
  dividedSense: SenseSchema.extend({ label: NonblankText }).optional(),
});

export const MeaningContentSchema = z.object({
  definitionHeadword: NonblankText,
  matchKind: z.enum(MatchKind),
  searchedWordPartOfSpeech: NonblankText.max(64).nullable(),
  definitionPartOfSpeech: NonblankText.max(64).nullable(),
  definitions: z.array(DefinitionSchema).min(1),
  pronunciationWord: NonblankText,
  pronunciationText: NonblankText.nullable(),
  pronunciationUrl: z.url().nullable(),
});

export const WordDefinitionSchema = z.object({
  word: NonblankText.max(128).refine(word => word === word.toLowerCase()),
  meanings: z.array(MeaningContentSchema).min(1),
});
