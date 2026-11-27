import {
  DictionaryPronunciationsSchema,
  type DictionaryServiceObject as Entry,
  type DictionaryPronunciations as Pronunciations,
} from '@/lib/dictionary-response';
import { MatchKind } from '@/lib/word';
import type { Definition, MeaningContent, Pronunciation } from '@/types/word';

// Definitions can come from a whole entry or a phrase nested in its `dros` array.
type Phrase = NonNullable<Entry['dros']>[number];

type Source = Entry | Phrase;

const MAX_DEFINITIONS = 3;

// Keep each set of pronunciations attached to the word it actually describes.
export type PronunciationCandidate = { word: string; prs: Pronunciations };

// Temporary lookup information used to build a meaning for the searched word.
export interface DictionaryMatch {
  // The full API entry containing the source, including entry-wide references.
  entry: Entry;
  // The entry or nested phrase whose definitions we read.
  source: Source;
  // Identifies the source for merging matches and detecting reference loops.
  // Uses meta.id for entries, or meta.id + "/dros/<index>" for nested phrases.
  key: string;
  // How the searched word matched, e.g. Exact, Inflection, Phrase, or Derived.
  kind: MatchKind;
  // The searched word's part of speech, e.g. "adverb" for "voluminously".
  searchedWordPartOfSpeech: string | null;
  // Pronunciation choices for the searched spelling, each with its word and prs.
  searchedPronunciations: PronunciationCandidate[];
  // Limit definitions to sense numbers named by a reference, e.g. "1b" or "1a, 2".
  sense?: string;
  // Sense objects chosen by a matching form, e.g. "customs" selects 2, 2a, and 2b.
  selectedSenses?: DictionarySense[];
  // A spelling listed only on the divided sense doesn't select its parent.
  dividedSenseOnly?: boolean;
}

// A link such as "plural of" or "variant of". It can name specific senses to use.
export interface DictionaryReference {
  target: string;
  sense?: string;
  kind: MatchKind.Inflection | MatchKind.Variant;
}

interface DictionaryReferenceTarget
  extends Pick<DictionaryMatch, 'entry' | 'source' | 'key'> {
  // A derived target uses its parent's definitions but has its own word details.
  derived?: NonNullable<Entry['uros']>[number];
}

// Remove syllable markers for display, e.g. "ax*is" becomes "axis".
export const displayHeadword = (word: string) =>
  word.replaceAll('*', '').trim();

export const normalizeDictionaryText = (word: string) =>
  displayHeadword(word).normalize('NFC').toLowerCase();

// Normalize the API spelling; the comparison word is already normalized.
const isSameWord = (word: string | undefined, normalizedWord: string) =>
  word !== undefined && normalizeDictionaryText(word) === normalizedWord;

export const trimTextOrNull = (text: string | undefined) =>
  text?.trim() || null;

// Build an MP3 URL from the API's audio filename using Merriam-Webster's rules.
export const buildPronunciationUrl = (audio: string): string | null => {
  // Expect a filename, with no spaces, control characters, paths, or query strings.
  if (!audio || /[\s/\\?#]|\p{C}/u.test(audio)) {
    return null;
  }
  let directory = audio[0].toLowerCase();
  if (audio.startsWith('bix')) {
    directory = 'bix';
  } else if (audio.startsWith('gg')) {
    directory = 'gg';
  } else if (!/^[a-z]/i.test(audio)) {
    directory = 'number';
  }
  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${directory}/${encodeURIComponent(audio)}.mp3`;
};

// Choose a pronunciation, keeping its word, written pronunciation, and audio together.
export const selectPronunciation = (
  searched: PronunciationCandidate[],
  source: PronunciationCandidate
): Pronunciation => {
  // Try audio for the searched word first, then audio for the definition's word.
  const candidates = [...searched, source];
  for (const candidate of candidates) {
    for (const pronunciation of candidate.prs ?? []) {
      const url = pronunciation?.sound?.audio
        ? buildPronunciationUrl(pronunciation.sound.audio)
        : null;
      if (url) {
        return {
          pronunciationWord: displayHeadword(candidate.word),
          pronunciationText: trimTextOrNull(pronunciation?.mw),
          pronunciationUrl: url,
        };
      }
    }
  }

  // If no audio is available, use the first written pronunciation.
  for (const candidate of candidates) {
    for (const pronunciation of candidate.prs ?? []) {
      const text = trimTextOrNull(pronunciation?.mw);
      if (text) {
        return {
          pronunciationWord: displayHeadword(candidate.word),
          pronunciationText: text,
          pronunciationUrl: null,
        };
      }
    }
  }

  // With no pronunciation, keep the definition's word and leave the details empty.
  return {
    pronunciationWord: displayHeadword(source.word),
    pronunciationText: null,
    pronunciationUrl: null,
  };
};

// Find the searched word in inflections (`ins`), variants (`vrs`), and alternate
// headwords (`ahws`). Return inflections first, keeping each form's pronunciation.
const matchingForms = (
  source: Pick<Entry, 'ins' | 'vrs' | 'ahws'>,
  normalizedWord: string
) => {
  return [
    ...(source.ins ?? [])
      .filter(form => isSameWord(form.if, normalizedWord))
      .map(form => ({
        kind: MatchKind.Inflection,
        word: form.if!,
        prs: form.prs,
      })),
    ...(source.vrs ?? [])
      .filter(form => isSameWord(form.va, normalizedWord))
      .map(form => ({
        kind: MatchKind.Variant,
        word: form.va,
        prs: form.prs,
      })),
    ...(source.ahws ?? [])
      .filter(form => isSameWord(form.hw, normalizedWord))
      .map(form => ({
        kind: MatchKind.Variant,
        word: form.hw,
        prs: form.prs,
      })),
  ];
};

// Lower values sort first: direct matches, then forms, then derived/related words.
export const matchRank = (kind: MatchKind) =>
  kind === MatchKind.Exact || kind === MatchKind.Phrase
    ? 0
    : kind === MatchKind.Inflection || kind === MatchKind.Variant
      ? 1
      : 2;

// Find matches in each entry and its nested words. Keep each match so the resolver
// can later combine definitions and pronunciations from the same entry or phrase.
export const collectMatches = (
  entries: Entry[],
  word: string
): DictionaryMatch[] => {
  const normalizedWord = normalizeDictionaryText(word);
  const matches: DictionaryMatch[] = [];
  for (const entry of entries) {
    const entryMatches: DictionaryMatch[] = [];

    // Shared details for this entry's matches. A nested word can replace them below.
    const base = {
      entry,
      source: entry,
      key: entry.meta.id,
      searchedWordPartOfSpeech: trimTextOrNull(entry.fl),
    };
    const forms = matchingForms(entry, normalizedWord);
    const isExactMatch = isSameWord(entry.hwi.hw, normalizedWord);

    // Prefer the Exact kind when the headword matches. Keep pronunciations from
    // both the matching headword and any matching forms.
    if (isExactMatch || forms.length) {
      entryMatches.push({
        ...base,
        kind: isExactMatch ? MatchKind.Exact : forms[0].kind,
        searchedPronunciations: [
          ...(isExactMatch ? [{ word: entry.hwi.hw, prs: entry.hwi.prs }] : []),
          ...forms,
        ],
      });
    }

    // Find forms listed under specific senses, e.g. "customs" under sense 2 of "custom".
    const addSenseFormMatches = (source: Source, key: string) => {
      const sourceSenses = collectSenses(source);
      for (const sense of sourceSenses) {
        const parentForms = matchingForms(sense.node, normalizedWord);
        const senseForms = sense.node.sdsense
          ? [
              ...parentForms,
              ...matchingForms(sense.node.sdsense, normalizedWord),
            ]
          : parentForms;
        if (!senseForms.length) {
          continue;
        }
        entryMatches.push({
          ...base,
          source,
          key,
          kind: senseForms[0].kind,
          searchedWordPartOfSpeech: trimTextOrNull(source.fl),
          // Sense data bypasses the entry schema, so validate its optional audio too.
          searchedPronunciations: senseForms.map(form => ({
            ...form,
            prs: DictionaryPronunciationsSchema.parse(form.prs),
          })),
          // When isSenseHeading is true, also include its subsenses in this section:
          // "customs" matches heading 2, so we include definitions 2a and 2b.
          selectedSenses:
            sense.isSenseHeading && sense.number && parentForms.length
              ? sourceSenses.filter(
                  selected =>
                    selected.section === sense.section &&
                    matchesSense(selected.number, sense.number)
                )
              : [sense],
          dividedSenseOnly: !parentForms.length,
        });
      }
    };

    addSenseFormMatches(entry, entry.meta.id);

    // Phrases in `dros` have their own definitions. Give each one a separate key
    // so it stays separate from the parent entry when we combine results.
    for (const [index, phrase] of (entry.dros ?? []).entries()) {
      addSenseFormMatches(phrase, `${entry.meta.id}/dros/${index}`);
      const phraseForms = matchingForms(phrase, normalizedWord);
      const isExactPhraseMatch = isSameWord(phrase.drp, normalizedWord);
      if (isExactPhraseMatch || phraseForms.length) {
        entryMatches.push({
          ...base,
          source: phrase,
          key: `${entry.meta.id}/dros/${index}`,
          kind: MatchKind.Phrase,
          searchedWordPartOfSpeech: trimTextOrNull(phrase.fl),
          searchedPronunciations: [
            ...(isExactPhraseMatch
              ? [{ word: phrase.drp, prs: phrase.prs }]
              : []),
            ...phraseForms,
          ],
        });
      }
    }

    // Derived words in `uros`, such as "voluminously", have no definitions of their
    // own. Use the parent's definitions and the derived word's part of speech.
    for (const derived of entry.uros ?? []) {
      const derivedForms = matchingForms(derived, normalizedWord);
      const isExactDerivedMatch = isSameWord(derived.ure, normalizedWord);
      if (isExactDerivedMatch || derivedForms.length) {
        entryMatches.push({
          ...base,
          kind: MatchKind.Derived,
          searchedWordPartOfSpeech: trimTextOrNull(derived.fl),
          searchedPronunciations: [
            ...(isExactDerivedMatch
              ? [{ word: derived.ure, prs: derived.prs }]
              : []),
            ...derivedForms,
          ],
        });
      }
    }

    // If nothing else matched, check `stems`. This links the word to the entry,
    // but doesn't tell us its part of speech or pronunciation.
    if (
      !entryMatches.length &&
      entry.meta.stems?.some(stem => isSameWord(stem, normalizedWord))
    ) {
      entryMatches.push({
        ...base,
        kind: MatchKind.Related,
        searchedWordPartOfSpeech: null,
        searchedPronunciations: [],
      });
    }
    matches.push(...entryMatches);
  }

  return matches;
};

// Ignore "see ..." notes in both displayed definitions and form references.
const removeDirectionalNotes = (text: string) =>
  text.replace(/\{(?:dx|dx_def)\}[\s\S]*?\{\/(?:dx|dx_def)\}/g, '');

// Convert API formatting to plain text, e.g. "{it}word{/it}" becomes "word".
export const getDictionaryPlainText = (text: string): string => {
  return removeDirectionalNotes(text)
    .replace(/\{([^{}]+)\}/g, (_token, body: string) => {
      const [name, label, , sense] = body.split('|');
      // Keep readable link text and optional sense numbers, discarding link markup.
      if (
        label &&
        ['a_link', 'd_link', 'i_link', 'et_link', 'sx', 'dxt', 'mat'].includes(
          name
        )
      ) {
        return `${label}${sense ? ` (sense ${sense})` : ''}`;
      }
      const punctuation: Record<string, string> = {
        bc: ': ',
        ldquo: '“',
        rdquo: '”',
        p_br: ' ',
        gloss: ' (',
        '/gloss': ')',
      };
      return punctuation[name] ?? '';
    })
    .replace(/\s+/g, ' ')
    .replace(/^\s*:\s*/, '')
    .trim();
};

// The fields we read from the API's sense and heading objects.
interface DictionarySenseNode extends Pick<Entry, 'ins' | 'vrs'> {
  sn?: string;
  dt?: unknown[];
  sdsense?: DictionarySenseNode & { sd: string };
}

interface DictionarySense {
  number: string;
  order: number;
  node: DictionarySenseNode;
  // True for a `sen` heading, whose definitions are in the senses beneath it.
  isSenseHeading: boolean;
  // Separate definition sections can reuse the same sense numbers.
  section: number;
}

// Collect senses from the nested API response into one list. Keep their numbers
// so references can select specific definitions.
const collectSenses = (source: Source): DictionarySense[] => {
  const result: DictionarySense[] = [];
  let currentNumber = '';
  let currentLetter = '';
  let currentSection = 0;

  // Add a sense's number and definition text. Keep the original object so we can
  // also check its forms, such as "customs" under "custom".
  const addSense = (sense: DictionarySenseNode, isSenseHeading = false) => {
    // `sn` may omit an earlier number/letter: after "1 a", "b" means "1b",
    // and a following "(1)" means "1b(1)".
    const rawNumber = sense.sn?.replaceAll(' ', '') ?? '';
    const numberedSense = rawNumber.match(/^(\d+)([a-z]?)/i);
    let number = rawNumber;

    if (numberedSense) {
      currentNumber = numberedSense[1];
      currentLetter = numberedSense[2];
    } else if (rawNumber.startsWith('(')) {
      number = `${currentNumber}${currentLetter}${rawNumber}`;
    } else if (rawNumber) {
      currentLetter = rawNumber[0];
      number = `${currentNumber}${rawNumber}`;
    }

    result.push({
      number,
      order: result.length,
      node: sense,
      isSenseHeading,
      section: currentSection,
    });
  };

  for (const [index, section] of (source.def ?? []).entries()) {
    currentSection = index;
    currentNumber = '';
    currentLetter = '';

    // Read nested arrays in order. Once a sense is found, add it without
    // searching inside its examples or other details.
    const pendingItems: unknown[] = [section.sseq];
    while (pendingItems.length) {
      const value = pendingItems.shift();
      if (!Array.isArray(value)) {
        continue;
      }
      if (value[0] === 'sense' || value[0] === 'sen') {
        addSense(value[1] as DictionarySenseNode, value[0] === 'sen');
        continue;
      }
      if (value[0] === 'bs') {
        addSense((value[1] as { sense: DictionarySenseNode }).sense);
        continue;
      }
      // Read these children in their original order, before the remaining items.
      pendingItems.unshift(...value);
    }
  }
  return result;
};

const matchesSense = (number: string, restriction: string): boolean => {
  // A reference to sense 1 includes 1a and 1b, but not 10.
  // A reference to 1a excludes 1b.
  return (
    number === restriction ||
    (number.startsWith(restriction) &&
      /^[a-z(]/i.test(number.slice(restriction.length)))
  );
};

// Recognize labels such as "plural of" and "variant of". Return null for other
// labels so ordinary dictionary links don't replace the entry's definitions.
const getReferenceMatchKind = (
  label: string
): DictionaryReference['kind'] | null => {
  if (
    /\b(?:plural|singular|past|present|participle|inflection|comparative|superlative)\b.*\bof\b/i.test(
      label
    )
  ) {
    return MatchKind.Inflection;
  }
  if (/\b(?:variant|spelling|form)s?\b.*\bof\b/i.test(label)) {
    return MatchKind.Variant;
  }
  return null;
};

// Follow a form reference only when its label starts the definition and it
// supplies a target. Ordinary links stay in the displayed text.
const extractFormReferences = (text: string): DictionaryReference[] => {
  if (
    !/^(?:\{[^}]+\}|\s)*(?:plural|past|present|variant|less common|chiefly|alternative|alternate|comparative|superlative)/i.test(
      text
    )
  ) {
    return [];
  }
  const kind = getReferenceMatchKind(getDictionaryPlainText(text));
  if (!kind) {
    return [];
  }
  return Array.from(
    removeDirectionalNotes(text).matchAll(
      /\{(?:d_link|sx|dxt)\|([^|{}]+)\|([^|{}]*)(?:\|([^{}]*))?\}/g
    ),
    token => ({
      target: token[2] || token[1],
      sense: token[3] || undefined,
      kind,
    })
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readAttribution = (aq: unknown): string => {
  if (!isRecord(aq)) {
    return '';
  }
  const subsource = isRecord(aq.subsource) ? aq.subsource : undefined;
  return [aq.auth, aq.source, aq.aqdate, subsource?.source, subsource?.aqdate]
    .filter((field): field is string => typeof field === 'string')
    .map(getDictionaryPlainText)
    .filter(Boolean)
    .join(', ');
};

const firstExample = (illustrations: unknown): Definition['example'] => {
  if (!Array.isArray(illustrations)) {
    return null;
  }
  for (const item of illustrations) {
    if (!isRecord(item) || typeof item.t !== 'string') {
      continue;
    }
    const text = getDictionaryPlainText(item.t);
    if (text) {
      const attribution = readAttribution(item.aq);
      return attribution ? { text, attribution } : { text };
    }
  }
  return null;
};

// Run-in words and biographical names are part of the surrounding sentence.
const readInlineText = (tag: unknown, value: unknown): string | null => {
  if (tag === 'bnw' && isRecord(value)) {
    const name = [value.pname, value.sname, value.altname]
      .filter((field): field is string => typeof field === 'string')
      .map(displayHeadword)
      .filter(Boolean)
      .join(' ');
    return name ? `${name},` : null;
  }
  if (tag !== 'ri' || !Array.isArray(value)) {
    return null;
  }
  const words: string[] = [];
  for (const part of value) {
    if (!Array.isArray(part)) {
      return null;
    }
    const [kind, item] = part;
    if (kind === 'text' && typeof item === 'string') {
      words.push(item);
    } else if (
      kind === 'riw' &&
      isRecord(item) &&
      typeof item.rie === 'string' &&
      item.rie.trim()
    ) {
      words.push(displayHeadword(item.rie));
    } else if (kind === 'vrs' && Array.isArray(item)) {
      for (const variant of item) {
        if (!isRecord(variant) || typeof variant.va !== 'string') {
          continue;
        }
        const spelling = displayHeadword(variant.va);
        if (spelling) {
          const label = typeof variant.vl === 'string' ? variant.vl.trim() : '';
          words.push(label || 'or', spelling);
        }
      }
    } else {
      return null;
    }
  }
  return words.join(' ').trim() || null;
};

const readSense = (
  node: DictionarySenseNode,
  references: DictionaryReference[],
  retainDefinition: boolean
): Pick<Definition, 'text' | 'example'> | 'incomplete' | null => {
  const fragments: string[] = [];
  let example: Definition['example'] = null;
  let incomplete = false;
  for (const part of Array.isArray(node.dt) ? node.dt : []) {
    if (!Array.isArray(part)) {
      continue;
    }
    const [tag, value] = part;
    if (tag === 'text' && typeof value === 'string') {
      const targets = extractFormReferences(value);
      if (targets.length) {
        references.push(...targets);
      } else if (retainDefinition) {
        fragments.push(value);
      }
    } else if (retainDefinition) {
      if (tag === 'vis') {
        example ??= firstExample(value);
      } else if (tag !== 'uns' && tag !== 'snote' && tag !== 'ca') {
        // Supplemental notes have their own text and examples. Unknown inline
        // content, however, would leave a gap in the definition.
        const inline = readInlineText(tag, value);
        if (inline === null) {
          incomplete = true;
        } else {
          fragments.push(inline);
        }
      }
    }
  }
  if (incomplete) {
    return 'incomplete';
  }
  if (!fragments.length) {
    return null;
  }
  const text = getDictionaryPlainText(fragments.join(' '))
    .replace(/\( +/g, '(')
    .replace(/ +([),;])/g, '$1');
  return text ? { text, example } : null;
};

// Read this match's definitions and references. The resolver follows the references.
export const getMatchContent = (match: DictionaryMatch) => {
  const isRestricted = Boolean(match.sense || match.selectedSenses);
  const references: DictionaryReference[] = [];

  // Only use the entry's general references when we're reading the whole entry.
  const referenceGroups =
    !isRestricted && match.source === match.entry ? match.entry.cxs : [];
  for (const referenceGroup of referenceGroups ?? []) {
    const headwords = [match.entry.hwi, ...(match.entry.ahws ?? [])];
    for (const [index, target] of referenceGroup.cxtis.entries()) {
      // Use this target's relationship label, or the group's label if it has none.
      const kind = getReferenceMatchKind(
        target.cxl ?? referenceGroup.cxl ?? ''
      );
      if (!kind) {
        continue;
      }

      // Match each grouped spelling to its corresponding target:
      // organisation/organise/organiser -> organization/organize/organizer.
      const isGroupedSpellingReference =
        kind === MatchKind.Variant &&
        headwords.length > 1 &&
        referenceGroup.cxtis.length > 1;
      if (isGroupedSpellingReference) {
        // Only pair headwords and targets when the lists have the same length.
        if (headwords.length !== referenceGroup.cxtis.length) {
          continue;
        }
        const normalizedHeadword = normalizeDictionaryText(headwords[index].hw);
        const isSearchedHeadword = match.searchedPronunciations.some(
          candidate => isSameWord(candidate.word, normalizedHeadword)
        );
        if (!isSearchedHeadword) {
          continue;
        }
      }

      // `cxr` gives the target ID when it differs from the displayed `cxt`.
      // `cxn` restricts the reference to a sense within that target.
      references.push({
        target: target.cxr || target.cxt,
        sense: target.cxn || undefined,
        kind,
      });
    }
  }
  // Keep source positions so overlapping restrictions can be merged in order.
  const definitions = new Map<number, Definition>();
  let hasIncompleteSense = false;

  // "1 intransitive" selects sense 1 from the intransitive verb section.
  // References without a qualifier can select senses from any section.
  const requestedSenses = match.sense?.split(/[,;]/).map(reference => {
    const verbQualifier = /\b(intransitive|transitive)(?:\s+verb)?\b/i;
    const verbType = reference.match(verbQualifier)?.[1].toLowerCase();
    return {
      number: reference.replace(verbQualifier, '').replaceAll(' ', ''),
      verbDivider: verbType ? `${verbType} verb` : undefined,
    };
  });

  for (const sense of match.selectedSenses ?? collectSenses(match.source)) {
    if (
      requestedSenses &&
      !requestedSenses.some(
        ({ number, verbDivider }) =>
          (!number || matchesSense(sense.number, number)) &&
          (!verbDivider || match.source.def?.[sense.section].vd === verbDivider)
      )
    ) {
      continue;
    }
    // Later senses can still point to other sources after the display limit.
    const retain = definitions.size < MAX_DEFINITIONS;
    const primary = match.dividedSenseOnly
      ? null
      : readSense(sense.node, references, retain);
    const divided = sense.node.sdsense;
    const child = divided && readSense(divided, references, retain);
    if (!retain) {
      continue;
    }
    if (primary === 'incomplete' || child === 'incomplete') {
      hasIncompleteSense = true;
    }
    const usableChild = child === 'incomplete' ? null : child;
    const label =
      typeof divided?.sd === 'string' ? getDictionaryPlainText(divided.sd) : '';
    if (primary && primary !== 'incomplete') {
      definitions.set(
        sense.order,
        usableChild && label
          ? { ...primary, dividedSense: { label, ...usableChild } }
          : primary
      );
    } else if (usableChild) {
      // A sense can supply its only usable definition after the divider.
      definitions.set(sense.order, {
        ...usableChild,
        text: label ? `${label}: ${usableChild.text}` : usableChild.text,
      });
    }
  }

  // Use summaries only when no detailed sense survived. A reference-only
  // entry gets its definitions from the target.
  if (
    !isRestricted &&
    !definitions.size &&
    (!references.length || hasIncompleteSense)
  ) {
    for (const [order, raw] of (match.source.shortdef ?? []).entries()) {
      const text = getDictionaryPlainText(raw);
      if (text) {
        definitions.set(order, { text, example: null });
        if (definitions.size === MAX_DEFINITIONS) {
          break;
        }
      }
    }
  }

  return {
    definitions,
    references: [
      ...new Map(
        references.map(ref => [`${ref.target}|${ref.sense ?? ''}`, ref])
      ).values(),
    ],
    isRestricted,
  };
};

// Find a referenced entry, phrase, or derived word in the responses already fetched.
export const findReferenceTargets = (
  entries: Entry[],
  reference: DictionaryReference
): DictionaryReferenceTarget[] => {
  const target = normalizeDictionaryText(reference.target);
  const hasEntryNumber = /:\d+$/.test(target);
  return entries.flatMap<DictionaryReferenceTarget>(entry => {
    // "axe:2" selects that exact entry. "axe" includes both "axe:1" and "axe:2".
    const matchesEntry = hasEntryNumber
      ? normalizeDictionaryText(entry.meta.id) === target
      : normalizeDictionaryText(entry.meta.id.replace(/:\d+$/, '')) === target;
    if (matchesEntry) {
      return [{ entry, source: entry as Source, key: entry.meta.id }];
    }

    // Phrases supply their own definitions; derived words use their parent's.
    return [
      ...(entry.dros ?? []).flatMap((phrase, index) =>
        isSameWord(phrase.drp, target)
          ? [{ entry, source: phrase, key: `${entry.meta.id}/dros/${index}` }]
          : []
      ),
      ...(entry.uros ?? [])
        .filter(derived => isSameWord(derived.ure, target))
        .map(derived => ({
          entry,
          source: entry,
          key: entry.meta.id,
          derived,
        })),
    ];
  });
};

// Build the meaning used by the database and UI. Definitions come from the matched
// entry or phrase; pronunciation may belong to the searched word.
export const toMeaning = (
  match: DictionaryMatch,
  definitions: Map<number, Definition>
): MeaningContent => {
  const source = match.source;
  const headword = 'drp' in source ? source.drp : source.hwi.hw;
  const prs = 'drp' in source ? source.prs : source.hwi.prs;
  return {
    definitionHeadword: displayHeadword(headword),
    matchKind: match.kind,
    searchedWordPartOfSpeech: match.searchedWordPartOfSpeech,
    definitionPartOfSpeech: trimTextOrNull(source.fl),
    definitions: [...definitions]
      .sort(([a], [b]) => a - b)
      .slice(0, MAX_DEFINITIONS)
      .map(([, definition]) => definition),
    ...selectPronunciation(match.searchedPronunciations, {
      word: headword,
      prs,
    }),
  };
};
