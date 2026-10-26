import {
  Profile,
  UserWordListEntry,
  WordDefinition,
  WordLookupResponse,
} from '@/app/lib/definitions';
import sql from '@/app/lib/dbClient';
import { escapeLikePattern, getCurrentUser } from '@/app/lib/utils';
import { cache } from 'react';

export const ENTRIES_PER_PAGE = 6;

interface WordLookupRow extends WordDefinition {
  isInUserList: boolean;
}

// Require the signed-in user's profile before accessing their diary data.
const getRequiredProfile = async () => {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error('Authenticated database access requires a user');
  }

  return profile;
};

// A returned profile belongs to the verified, signed-in user. Null means the
// user is signed out or has not completed onboarding yet.
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const [profile] = await sql<Profile[]>`
    select
      id,
      display_name as "displayName",
      username
    from public.profiles
    where id = ${user.id}
    limit 1
  `;

  return profile ?? null;
});

export const getProfileByUsername = async (
  username: string
): Promise<Profile | null> => {
  const [profile] = await sql<Profile[]>`
    select
      id,
      display_name as "displayName",
      username
    from public.profiles
    where username = ${username.toLowerCase()}
    limit 1
  `;

  return profile ?? null;
};

export const getWordLookup = async (
  word: string
): Promise<WordLookupResponse | null> => {
  const normalizedWord = word.trim().toLowerCase();
  const profile = await getRequiredProfile();

  // Fetch the shared word and its ordered meanings, then check whether the
  // authenticated user has saved it, all in one database query.
  const [data] = await sql<WordLookupRow[]>`
    select
      w.word,
      w.definition_headword as "definitionHeadword",
      w.pronunciation_url as "pronunciationUrl",
      meaning_rows.meanings,
      exists (
        select 1
        from public.user_words_list uw
        where uw.word_id = w.id
          and uw.user_id = ${profile.id}
      ) as "isInUserList"
    from public.words w
    cross join lateral (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'part_of_speech', wm.part_of_speech,
            'definitions', wm.definitions
          )
          order by wm.meaning_order
        ),
        '[]'::jsonb
      ) as meanings
      from public.word_meanings wm
      where wm.word_id = w.id
    ) meaning_rows
    where w.word = ${normalizedWord}
    limit 1
  `;

  if (!data) {
    return null;
  }

  return {
    word: {
      word: data.word,
      definitionHeadword: data.definitionHeadword,
      pronunciationUrl: data.pronunciationUrl,
      meanings: data.meanings,
    },
    isInUserList: data.isInUserList,
  };
};

export const saveWordDefinition = async (
  wordDefinition: WordDefinition
): Promise<void> => {
  await sql.begin(async transaction => {
    const [createdWord] = await transaction<{ id: string }[]>`
      insert into public.words (word, definition_headword, pronunciation_url)
      values (
        ${wordDefinition.word},
        ${wordDefinition.definitionHeadword},
        ${wordDefinition.pronunciationUrl}
      )
      on conflict (word) do nothing
      returning id
    `;

    if (!createdWord) {
      return;
    }

    const wordId = createdWord.id;
    const meanings = wordDefinition.meanings.map((meaning, index) => ({
      meaning_order: index + 1,
      part_of_speech: meaning.part_of_speech,
      definitions: meaning.definitions,
    }));

    await transaction`
      insert into public.word_meanings (
        word_id,
        meaning_order,
        part_of_speech,
        definitions
      )
      select
        ${wordId}::bigint,
        meaning_order,
        part_of_speech,
        definitions
      from jsonb_to_recordset(${transaction.json(meanings)}::jsonb) as meaning(
        meaning_order integer,
        part_of_speech text,
        definitions jsonb
      )
    `;
  });
};

// All diaries are publicly readable for now. The owner ID identifies the diary
// being viewed, independently of the authenticated viewer.
export const getUserWordsByQuery = async (
  ownerId: string,
  query: string,
  page: number
): Promise<UserWordListEntry[]> => {
  const offset = (page - 1) * ENTRIES_PER_PAGE;
  const [data] = await sql<{ items: UserWordListEntry[] }[]>`
    with page_words as (
      select
        uw.id,
        uw.word_id,
        uw.added_at,
        w.word,
        w.definition_headword,
        w.pronunciation_url
      from public.user_words_list uw
      join public.words w on w.id = uw.word_id
      where uw.user_id = ${ownerId}
        and w.word ilike ${`%${escapeLikePattern(query)}%`}
      order by uw.added_at desc, uw.id desc
      limit ${ENTRIES_PER_PAGE}
      offset ${offset}
    )
    select
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', page_words.id,
            'addedAt', page_words.added_at,
            'word', jsonb_build_object(
              'word', page_words.word,
              'definitionHeadword', page_words.definition_headword,
              'pronunciationUrl', page_words.pronunciation_url,
              'meanings', meaning_rows.meanings
            )
          )
          order by page_words.added_at desc, page_words.id desc
        ),
        '[]'::jsonb
      ) as items
    from page_words
    cross join lateral (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', wm.id,
            'part_of_speech', wm.part_of_speech,
            'definitions', wm.definitions
          )
          order by wm.meaning_order
        ),
        '[]'::jsonb
      ) as meanings
      from public.word_meanings wm
      where wm.word_id = page_words.word_id
    ) meaning_rows
  `;
  return data.items;
};

export const getUserWordsPages = async (
  ownerId: string,
  query: string
): Promise<number> => {
  const [{ totalCount }] = await sql<{ totalCount: string }[]>`
    select count(*) as "totalCount"
    from public.user_words_list uw
    join public.words w on w.id = uw.word_id
    where uw.user_id = ${ownerId}
      and w.word ilike ${`%${escapeLikePattern(query)}%`}
  `;
  return Math.ceil(Number(totalCount) / ENTRIES_PER_PAGE);
};

export const getFlashcardDeck = async (): Promise<WordDefinition[]> => {
  const profile = await getRequiredProfile();
  const rows = await sql<WordDefinition[]>`
    select
      w.word,
      w.definition_headword as "definitionHeadword",
      w.pronunciation_url as "pronunciationUrl",
      meaning_rows.meanings
    from public.user_words_list uw
    join public.words w on w.id = uw.word_id
    cross join lateral (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'part_of_speech', wm.part_of_speech,
            'definitions', wm.definitions
          )
          order by wm.meaning_order
        ),
        '[]'::jsonb
      ) as meanings
      from public.word_meanings wm
      where wm.word_id = w.id
    ) meaning_rows
    where uw.user_id = ${profile.id}
    order by uw.added_at desc, uw.id desc
    limit 100
  `;

  return rows;
};
