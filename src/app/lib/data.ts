import sql from '@/app/lib/db';
import { Word, WordDAO } from '@/app/lib/definitions';
import { unstable_cache } from 'next/cache';

export const getWordFromWordsTable = unstable_cache(async (word: string) => {
  try {
    const wordFromWordsTable = await sql<Word[]>`
      SELECT
      w.word,
      jsonb_agg(
        jsonb_build_object(
          'part_of_speech', wm.part_of_speech,
          'definitions', defs.definitions_json
        )
      ) AS meanings
      FROM words w
      LEFT JOIN word_meanings wm ON wm.word_id = w.id
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(md.definition ORDER BY md.definition_order) AS definitions_json
        FROM word_meaning_definitions md
        WHERE md.meaning_id = wm.id
      ) defs ON true
      WHERE w.word = ${word}
      GROUP BY w.id`;
    return wordFromWordsTable[0];
  } catch (error) {
    console.error('Error fetching word from words table', error);
    return null;
  }
});

export const getWordFromUserList = async (userId: number, word: string) => {
  try {
    const userWords = await getUserWords(userId);
    const wordFromUserList = userWords.find(w => w.word === word);
    return wordFromUserList ? wordFromUserList : null;
  } catch (error) {
    console.error('Error fetching word from user list:', error);
    return null;
  }
};

export const getUserWords = (userId: number) =>
  unstable_cache(
    async (userId: number) => {
      try {
        const wordList = await sql<WordDAO[]>`
      SELECT jsonb_build_object(
          'id', uw.id,
          'word', w.word,
          'added_at', uw.added_at,
          'meanings', meanings.meanings_json
      ) AS word
      FROM user_words_list uw
      JOIN words w ON w.id = uw.word_id
      LEFT JOIN LATERAL (
          SELECT jsonb_agg(
              jsonb_build_object(
                  'part_of_speech', wm.part_of_speech,
                  'definitions', defs.definitions_json
              )
          ) AS meanings_json
          FROM word_meanings wm
          LEFT JOIN LATERAL (
              SELECT jsonb_agg(md.definition ORDER BY md.definition_order) AS definitions_json
              FROM word_meaning_definitions md
              WHERE md.meaning_id = wm.id
          ) defs ON true
          WHERE wm.word_id = w.id
      ) meanings ON true
      WHERE uw.user_id = ${userId}
      ORDER BY uw.added_at DESC`;
        return wordList.map(row => row.word);
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
