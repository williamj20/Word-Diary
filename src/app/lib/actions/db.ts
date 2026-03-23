'use server';

import sql from '@/app/lib/dbClient';
import { Word } from '@/app/lib/definitions';
import { revalidateTag } from 'next/cache';

export const addWordToUserList = async (userId: string, word: Word) => {
  try {
    const normalizedWord = word.word.trim().toLowerCase();

    await sql.begin(async sql => {
      const [wordEntry] = await sql`
        INSERT INTO words (word)
        VALUES (${normalizedWord})
        ON CONFLICT (word) DO UPDATE SET word = EXCLUDED.word
        RETURNING id
      `;

      await sql`
        INSERT INTO user_words_list (user_id, word_id)
        VALUES (${userId}, ${wordEntry.id})
        ON CONFLICT (user_id, word_id) DO NOTHING
      `;

      for (const meaning of word.meanings) {
        const [meaningEntry] = await sql`
          INSERT INTO word_meanings (word_id, part_of_speech)
          VALUES (${wordEntry.id}, ${meaning.part_of_speech})
          ON CONFLICT (word_id, part_of_speech)
          DO UPDATE SET part_of_speech = EXCLUDED.part_of_speech
          RETURNING id
        `;

        for (let i = 0; i < meaning.definitions.length; i++) {
          await sql`
            INSERT INTO word_meaning_definitions (meaning_id, definition, definition_order)
            VALUES (${meaningEntry.id}, ${meaning.definitions[i].trim()}, ${i + 1})
            ON CONFLICT (meaning_id, definition_order)
            DO UPDATE SET definition = EXCLUDED.definition
          `;
        }
      }
    });
    revalidateTag(`user-words-${userId}`);
  } catch (error) {
    console.error('Error adding word to user list', error);
  }
};

export const deleteWordFromUserList = async (
  userId: string,
  wordListId: number
) => {
  try {
    await sql`
      DELETE FROM user_words_list
      WHERE id = ${wordListId}
        AND user_id = ${userId}
    `;
    revalidateTag(`user-words-${userId}`);
  } catch (error) {
    console.error('Error deleting word from user list', error);
  }
};
