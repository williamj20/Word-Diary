import sql from '@/app/lib/dbClient';
import { Word, WordFromUserList } from '@/app/lib/definitions';
import { unstable_cache } from 'next/cache';

export const getWordFromWordsTable = unstable_cache(async (word: string) => {
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
            ORDER BY wm.id
          ) FILTER (WHERE wm.id IS NOT NULL),
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
});

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
            ORDER BY wm.id
          ) FILTER (WHERE wm.id IS NOT NULL),
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

export const getUserWords = (userId: string) =>
  unstable_cache(
    async (userId: string) => {
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
                ORDER BY wm.id
              ) FILTER (WHERE wm.id IS NOT NULL),
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
          ORDER BY uw.added_at DESC
        `;
        return wordList;
      } catch (error) {
        console.error('Error fetching user words:', error);
        return [];
      }
    },
    ['user-words'],
    {
      tags: [`user-words-${userId}`],
    }
  )(userId);
