import {
  DictionaryServiceResponseSchema,
  MatchKind,
  WordDefinitionSchema,
  type WordDefinition,
} from '@/app/lib/definitions';
import {
  collectMatches,
  getMatchContent,
  matchRank,
  normalizeDictionaryText,
  findReferenceTargets,
  trimTextOrNull,
  toMeaning,
  type DictionaryMatch,
} from '@/app/lib/dictionary';
import { fetchDictionary } from '@/app/lib/dictionary-service';

// Limit how many references we follow and how many extra API requests we make.
const MAX_REFERENCE_HOPS = 2;
const MAX_ADDITIONAL_REQUESTS = 4;

export type DictionaryOutcome =
  | { status: 'success'; word: WordDefinition }
  | { status: 'suggestions'; suggestions: string[] }
  | { status: 'not-found' };

// A match we still need to process, with a record of how we reached it.
interface PendingMatch {
  match: DictionaryMatch;
  content: ReturnType<typeof getMatchContent>;
  hops: number;
  visitedSourceKeys: Set<string>;
  // Positions of the starting match and each reference/target we followed.
  // Keep the original order even when some matches need more steps to resolve.
  orderPath: number[];
}

// A match with definitions ready to use. Other matches may reach the same entry.
interface ResolvedMatch {
  match: DictionaryMatch;
  definitions: string[];
  // True when only specific senses apply, rather than the whole entry or phrase.
  isRestricted: boolean;
  orderPath: number[];
}

// Combine matches for the same entry or phrase, keeping their definitions
// and pronunciation choices together.
const mergeResolvedMatches = (resolved: ResolvedMatch[]): ResolvedMatch[] => {
  const groups = new Map<string, ResolvedMatch>();
  const ordered = resolved.sort((a, b) => {
    // Direct matches come first, then inflections/variants, then derived/related.
    const rank = matchRank(a.match.kind) - matchRank(b.match.kind);
    if (rank) {
      return rank;
    }

    // Break ties using the original positions, comparing left to right.
    // The -1 puts [0] before [0, 0] when one match needed fewer steps.
    for (
      let index = 0;
      index < Math.max(a.orderPath.length, b.orderPath.length);
      index++
    ) {
      const difference =
        (a.orderPath[index] ?? -1) - (b.orderPath[index] ?? -1);
      if (difference) {
        return difference;
      }
    }
    return 0;
  });

  // Gather pronunciation choices from all matches before choosing one.
  for (const group of ordered) {
    const existingGroup = groups.get(group.match.key);
    if (!existingGroup) {
      // Start with the highest-priority match's details.
      groups.set(group.match.key, group);
      continue;
    }
    existingGroup.match.searchedPronunciations.push(
      ...group.match.searchedPronunciations
    );

    // Prefer definitions for the whole entry or phrase over selected senses.
    // If both matches select specific senses, combine them without repeating text.
    if (existingGroup.isRestricted && !group.isRestricted) {
      existingGroup.definitions = group.definitions;
      existingGroup.isRestricted = false;
    } else if (existingGroup.isRestricted) {
      existingGroup.definitions = [
        ...new Set([...existingGroup.definitions, ...group.definitions]),
      ];
    }
  }
  return [...groups.values()];
};

// Look up a word and return definition groups ready to save.
// The API route has already trimmed, NFC-normalized, and lowercased the word.
export const resolveDictionaryLookup = async (
  normalizedWord: string
): Promise<DictionaryOutcome> => {
  // Check the API response: [] means not found; strings are spelling suggestions.
  const entries = DictionaryServiceResponseSchema.parse(
    await fetchDictionary(normalizedWord)
  );
  if (!entries.length) {
    return { status: 'not-found' };
  }
  if (entries.every((entry): entry is string => typeof entry === 'string')) {
    return { status: 'suggestions', suggestions: entries.slice(0, 5) };
  }
  const matches = collectMatches(entries, normalizedWord);
  // Reuse each entry's matches during this lookup, including empty results.
  const matchesByEntry = new Map<DictionaryMatch['entry'], DictionaryMatch[]>(
    entries.map(entry => [entry, []])
  );
  for (const match of matches) {
    matchesByEntry.get(match.entry)!.push(match);
  }
  const matchesWithContent = matches.map(match => ({
    match,
    content: getMatchContent(match),
  }));

  // Find entries or phrases that another match already points to.
  const references = matchesWithContent.flatMap(
    item => item.content.references
  );
  const referencedSources = references.flatMap(reference =>
    findReferenceTargets(entries, reference)
  );
  const referencedSourceKeys = new Set(
    referencedSources.map(source => source.key)
  );

  // Process those matches through the reference so we use only the senses it
  // names. Exact headword matches can also be processed on their own.
  let pending: PendingMatch[] = matchesWithContent
    .filter(
      ({ match }) =>
        match.kind === MatchKind.Exact || !referencedSourceKeys.has(match.key)
    )
    .map(({ match, content }, index) => ({
      match,
      content,
      hops: 0,
      visitedSourceKeys: new Set([match.key]),
      orderPath: [index],
    }));
  const requestedWords = new Set([normalizedWord]);
  const resolved: ResolvedMatch[] = [];

  // Follow references one step at a time. Fetch missing entries together,
  // requesting each word only once even when several references need it.
  while (pending.length) {
    const wordsToFetch = new Set<string>();

    // Request a referenced word only if it's missing and hasn't been requested yet.
    for (const item of pending) {
      const { references } = item.content;
      if (!references.length) {
        continue;
      }
      if (item.hops >= MAX_REFERENCE_HOPS) {
        throw new Error('Dictionary reference chain exceeds the lookup limit');
      }
      for (const reference of references) {
        if (findReferenceTargets(entries, reference).length) {
          continue;
        }
        // For a target such as "axe:2", fetch "axe", then select the entry by ID.
        const target = normalizeDictionaryText(
          reference.target.replace(/:\d+$/, '')
        );
        if (!requestedWords.has(target)) {
          wordsToFetch.add(target);
        }
      }
    }

    // The original lookup is in `requestedWords`, but doesn't count
    // as an extra request.
    if (requestedWords.size - 1 + wordsToFetch.size > MAX_ADDITIONAL_REQUESTS) {
      throw new Error('Dictionary lookup exceeds the additional request limit');
    }

    // Fetch missing words together; failed requests propagate to the GET route.
    const additionalResponses = await Promise.all(
      [...wordsToFetch].map(async target => {
        requestedWords.add(target);
        return DictionaryServiceResponseSchema.parse(
          await fetchDictionary(target)
        );
      })
    );

    // Skip empty responses and suggestions, and add entries we don't already have.
    // Check below whether the referenced entries were found.
    for (const response of additionalResponses) {
      if (
        response.every((entry): entry is string => typeof entry === 'string')
      ) {
        continue;
      }
      const ids = new Set(entries.map(entry => entry.meta.id));
      entries.push(...response.filter(entry => !ids.has(entry.meta.id)));
    }

    const next: PendingMatch[] = [];
    for (const item of pending) {
      const { references, definitions, isRestricted } = item.content;

      // Keep this match's own definitions while also following its references.
      if (definitions.length) {
        resolved.push({
          match: item.match,
          definitions,
          isRestricted,
          orderPath: item.orderPath,
        });
      } else if (!references.length && item.hops > 0) {
        // This reference led to no definitions and nowhere else to look.
        // Stop so we don't save an incomplete result.
        throw new Error('Referenced dictionary entry has no definitions');
      }
      for (const [referenceIndex, reference] of references.entries()) {
        const targets = findReferenceTargets(entries, reference);
        if (!targets.length) {
          throw new Error(
            `Dictionary reference target was not found: ${reference.target}`
          );
        }
        const canCarryPronunciation =
          references.length === 1 && targets.length === 1;
        for (const [targetIndex, target] of targets.entries()) {
          const { entry, source, key, derived } = target;
          // Stop if this chain of references loops back to an entry or phrase
          // we've already visited. Separate chains can still share a result.
          if (item.visitedSourceKeys.has(key)) {
            throw new Error(`Dictionary reference cycle detected: ${key}`);
          }

          // Check the target for the searched word's pronunciation and part of speech.
          // E.g. "went" has no audio in its own entry; its form under "go" does.
          let entryMatches = matchesByEntry.get(entry);
          if (!entryMatches) {
            entryMatches = collectMatches([entry], normalizedWord);
            matchesByEntry.set(entry, entryMatches);
          }
          const targetSourceMatches = entryMatches.filter(
            match => match.key === key
          );

          // Carry earlier pronunciation choices only when there is one reference
          // and one target. With multiple choices, use the target's own matches
          // so audio stays attached to the right entry.
          const searchedPronunciations = [
            ...(canCarryPronunciation ? item.match.searchedPronunciations : []),
            ...targetSourceMatches.flatMap(
              match => match.searchedPronunciations
            ),
            ...(derived ? [{ word: derived.ure, prs: derived.prs }] : []),
          ];

          // Process this target next, keeping the reference history and order.
          // Keep the derived relationship when either end is a derived word.
          const referencedMatch: DictionaryMatch = {
            entry,
            source,
            key,
            kind:
              item.match.kind === MatchKind.Derived || derived
                ? MatchKind.Derived
                : reference.kind,
            searchedWordPartOfSpeech:
              item.match.searchedWordPartOfSpeech ??
              (derived
                ? trimTextOrNull(derived.fl)
                : (targetSourceMatches[0]?.searchedWordPartOfSpeech ?? null)),
            searchedPronunciations,
            // This link selects senses in its target; omitted means the whole target.
            sense: reference.sense,
          };
          next.push({
            match: referencedMatch,
            content: getMatchContent(referencedMatch),
            hops: item.hops + 1,
            orderPath: [...item.orderPath, referenceIndex, targetIndex],
            visitedSourceKeys: new Set([...item.visitedSourceKeys, key]),
          });
        }
      }
    }
    pending = next;
  }
  if (!resolved.length) {
    throw new Error('No usable dictionary definitions found');
  }
  // Combine matches for each entry or phrase, choose their pronunciation,
  // and check that the result has the fields the database and UI need.
  return {
    status: 'success',
    word: WordDefinitionSchema.parse({
      word: normalizedWord,
      meanings: mergeResolvedMatches(resolved).map(group =>
        toMeaning(group.match, group.definitions)
      ),
    }),
  };
};
