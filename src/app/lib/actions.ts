'use server';

import sql from '@/app/lib/db';
import { Word } from '@/app/lib/definitions';
import { revalidateTag } from 'next/cache';

export async function addWordToUserList(userId: number, word: Word) {
  try {
    await sql.begin(async sql => {
      const [wordEntry] = await sql`
        INSERT INTO words (word)
        VALUES (${word.word})
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
          RETURNING id
        `;

        for (let i = 0; i < meaning.definitions.length; i++) {
          await sql`
            INSERT INTO word_meaning_definitions (meaning_id, definition, definition_order)
            VALUES (${meaningEntry.id}, ${meaning.definitions[i]}, ${i + 1})
          `;
        }
      }
    });
    revalidateTag(`user-words-${userId}`);
  } catch (error) {
    console.error('Error adding word to user list', error);
  }
}
