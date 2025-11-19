import sql from '@/app/lib/db';
import { Word } from '@/app/lib/definitions';

export async function getUserWords(userId: number) {
  try {
    const wordList = await sql<Word[]>`
      SELECT w.word, w.meanings, uw.added_at, uw.id
      FROM user_words_list uw
      INNER JOIN words w ON uw.word_id = w.id
      WHERE uw.user_id = ${userId}
      ORDER BY uw.added_at DESC`;
    console.log('Word List:', wordList);
    return wordList;
  } catch (error) {
    console.error('Error fetching user words:', error);
    return [];
  }
}
