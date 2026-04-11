'use server';

import sql from '@/app/lib/dbClient';
import { Word } from '@/app/lib/definitions';
import { getCurrentUser } from '@/app/lib/utils';
import { updateTag } from 'next/cache';

export const addWordToUserList = async (word: Word) => {
  try {
    const normalizedWord = word.word.trim().toLowerCase();
    const user = await getCurrentUser();
    if (!user) {
      console.log('User is not logged in, cannot add word to user list');
      // TODO: Consider handling errors here in the UI better
      return { success: false, error: 'Not authenticated' };
    }
    await sql.begin(async sql => {
      const [existingWord] = await sql`
        SELECT id FROM words
        WHERE word = ${normalizedWord}
      `;
      let wordId = existingWord?.id;
      if (!wordId) {
        const [wordEntry] = await sql`
          INSERT INTO words (word)
          VALUES (${normalizedWord})
          ON CONFLICT (word) DO UPDATE SET word = EXCLUDED.word
          RETURNING id
      `;
        wordId = wordEntry.id;

        for (const meaning of word.meanings) {
          const [meaningEntry] = await sql`
            INSERT INTO word_meanings (word_id, part_of_speech)
            VALUES (${wordId}, ${meaning.part_of_speech})
            RETURNING id
        `;

          for (let i = 0; i < meaning.definitions.length; i++) {
            await sql`
              INSERT INTO word_meaning_definitions (meaning_id, definition, definition_order)
              VALUES (${meaningEntry.id}, ${meaning.definitions[i]}, ${i + 1})
            `;
          }
        }
      }
      await sql`
          INSERT INTO user_words_list (user_id, word_id)
          VALUES (${user.id}, ${wordId})
          ON CONFLICT (user_id, word_id) DO NOTHING
      `;
    });
    updateTag(`user-words-${user.id}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding word to user list', error);
    return { success: false, error: 'Failed to add word to user list' };
  }
};

export const deleteWordFromUserList = async (wordListId: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('User is not logged in, cannot delete word from user list');
      return;
    }
    await sql`
      DELETE FROM user_words_list
      WHERE id = ${wordListId}
        AND user_id = ${user.id}
    `;
    updateTag(`user-words-${user.id}`);
  } catch (error) {
    console.error('Error deleting word from user list', error);
  }
};
