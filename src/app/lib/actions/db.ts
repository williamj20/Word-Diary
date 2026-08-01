'use server';

import { MutationResult } from '@/app/lib/definitions';
import sql from '@/app/lib/dbClient';
import { getCurrentUser } from '@/app/lib/utils';
import { revalidatePath } from 'next/cache';

const revalidateWordRoutes = () => {
  revalidatePath('/diary');
  revalidatePath('/flashcards');
};

export const saveWordToDiary = async (
  word: string
): Promise<MutationResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false };
    }
    const normalizedWord = word.trim().toLowerCase();
    await sql`
      insert into public.user_words_list (user_id, word_id)
      select ${user.id}::uuid, id
      from public.words
      where word = ${normalizedWord}
      on conflict (user_id, word_id) do nothing
    `;

    revalidateWordRoutes();
    return { success: true };
  } catch (error) {
    console.error('Failed to save word to diary', error);
    return { success: false };
  }
};

export const deleteWordFromUserList = async (
  userWordListId: number
): Promise<MutationResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false };
    }
    await sql`
      delete from public.user_words_list
      where id = ${userWordListId}
        and user_id = ${user.id}
    `;

    revalidateWordRoutes();
    return { success: true };
  } catch (error) {
    console.error('Failed to delete word from diary', error);
    return { success: false };
  }
};
