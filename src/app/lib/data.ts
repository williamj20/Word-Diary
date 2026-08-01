import {
  MeaningContent,
  UserWordListEntry,
  WordDefinition,
  WordLookupResponse,
} from '@/app/lib/definitions';
import sql from '@/app/lib/dbClient';
import { escapeLikePattern, getCurrentUser } from '@/app/lib/utils';

export const ENTRIES_PER_PAGE = 6;

interface WordLookupRow {
  word: string;
  meanings: MeaningContent[];
  isInUserList: boolean;
}

const getAuthenticatedUser = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authenticated database access requires a user');
  }

  return user;
};

export const getWordLookup = async (
  word: string
): Promise<WordLookupResponse | null> => {
  const normalizedWord = word.trim().toLowerCase();
  const user = await getAuthenticatedUser();

  // Fetch the shared word and its ordered meanings, then check whether the
  // authenticated user has saved it, all in one database query.
  const [data] = await sql<WordLookupRow[]>`
    select
      w.word,
      meaning_rows.meanings,
      exists (
        select 1
        from public.user_words_list uw
        where uw.word_id = w.id
          and uw.user_id = ${user.id}
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
      insert into public.words (word)
      values (${wordDefinition.word})
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

export const getUserWordsByQuery = async (
  query: string,
  page: number
): Promise<UserWordListEntry[]> => {
  const user = await getAuthenticatedUser();
  const offset = (page - 1) * ENTRIES_PER_PAGE;
  const [data] = await sql<{ items: UserWordListEntry[] }[]>`
    with page_words as (
      select
        uw.id,
        uw.word_id,
        uw.added_at,
        w.word
      from public.user_words_list uw
      join public.words w on w.id = uw.word_id
      where uw.user_id = ${user.id}
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

export const getUserWordsPages = async (query: string): Promise<number> => {
  const user = await getAuthenticatedUser();
  const [{ totalCount }] = await sql<{ totalCount: string }[]>`
    select count(*) as "totalCount"
    from public.user_words_list uw
    join public.words w on w.id = uw.word_id
    where uw.user_id = ${user.id}
      and w.word ilike ${`%${escapeLikePattern(query)}%`}
  `;
  return Math.ceil(Number(totalCount) / ENTRIES_PER_PAGE);
};

export const getFlashcardDeck = async (): Promise<WordDefinition[]> => {
  const user = await getAuthenticatedUser();
  const rows = await sql<WordDefinition[]>`
    select
      w.word,
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
    where uw.user_id = ${user.id}
    order by uw.added_at desc, uw.id desc
    limit 100
  `;

  return rows;
};
