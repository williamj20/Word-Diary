import sql from '@/app/lib/dbClient';
import { Word, WordFromUserList } from '@/app/lib/definitions';

export const getWordFromWordsTable = async (word: string) => {
  try {
    const wordFromWordsTable = await sql<Word[]>`
      SELECT
        w.word,
        w.id,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'part_of_speech', wm.part_of_speech,
              'definitions', defs.definitions_json
            )
          ),
          '[]'::jsonb
        ) AS meanings
      FROM words w
      LEFT JOIN word_meanings wm ON wm.word_id = w.id
      LEFT JOIN LATERAL (
        SELECT COALESCE(
          jsonb_agg(md.definition ORDER BY md.definition_order),
          '[]'::jsonb
        ) AS definitions_json
        FROM word_meaning_definitions md
        WHERE md.meaning_id = wm.id
      ) defs ON true
      WHERE w.word = ${word}
      GROUP BY w.id
    `;
    return wordFromWordsTable[0];
  } catch (error) {
    console.error('Error fetching word from words table', error);
    return null;
  }
};

export const getWordFromUserList = async (userId: string, word: string) => {
  try {
    const wordFromUserList = await sql<WordFromUserList[]>`
      SELECT
        uw.id,
        jsonb_build_object(
          'id', w.id,
          'word', w.word,
          'meanings', meanings.meanings_json
        ) AS word,
        uw.added_at
      FROM user_words_list uw
      JOIN words w ON w.id = uw.word_id
      LEFT JOIN LATERAL (
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'part_of_speech', wm.part_of_speech,
              'definitions', defs.definitions_json
            )
          ),
          '[]'::jsonb
        ) AS meanings_json
        FROM word_meanings wm
        LEFT JOIN LATERAL (
          SELECT COALESCE(
            jsonb_agg(md.definition ORDER BY md.definition_order),
            '[]'::jsonb
          ) AS definitions_json
          FROM word_meaning_definitions md
          WHERE md.meaning_id = wm.id
        ) defs ON true
        WHERE wm.word_id = w.id
      ) meanings ON true
      WHERE uw.user_id = ${userId}
        AND w.word = ${word}
      LIMIT 1
    `;
    return wordFromUserList[0] ?? null;
  } catch (error) {
    console.error('Error fetching word from user list:', error);
    return null;
  }
};

export const ENTRIES_PER_PAGE = 6;

export const getUserWordsByQuery = async (
  userId: string,
  query: string,
  page: number
) => {
  const offset = (page - 1) * ENTRIES_PER_PAGE;
  try {
    const wordList = await sql<WordFromUserList[]>`
        SELECT
          uw.id,
          jsonb_build_object(
            'id', w.id,
            'word', w.word,
            'meanings', meanings.meanings_json
          ) AS word,
          uw.added_at
        FROM user_words_list uw
        JOIN words w ON w.id = uw.word_id
        LEFT JOIN LATERAL (
          SELECT COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'part_of_speech', wm.part_of_speech,
                'definitions', defs.definitions_json
              )
            ),
            '[]'::jsonb
          ) AS meanings_json
          FROM word_meanings wm
          LEFT JOIN LATERAL (
            SELECT COALESCE(
              jsonb_agg(md.definition ORDER BY md.definition_order),
              '[]'::jsonb
            ) AS definitions_json
            FROM word_meaning_definitions md
            WHERE md.meaning_id = wm.id
          ) defs ON true
          WHERE wm.word_id = w.id
        ) meanings ON true
        WHERE uw.user_id = ${userId}
          AND w.word ILIKE ${`%${query}%`}
        ORDER BY uw.added_at DESC
        LIMIT ${ENTRIES_PER_PAGE}
        OFFSET ${offset}
      `;
    return wordList;
  } catch (error) {
    console.error('Error fetching user words:', error);
    return [];
  }
};

export const getUserWordsPages = async (userId: string, query: string) => {
  try {
    const [data] = await sql<{ count: number }[]>`
      SELECT COUNT(*)
      FROM user_words_list uw
      JOIN words w ON w.id = uw.word_id
      WHERE uw.user_id = ${userId}
        AND w.word ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(data.count) / ENTRIES_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Error fetching user word pages:', error);
    return 0;
  }
};
