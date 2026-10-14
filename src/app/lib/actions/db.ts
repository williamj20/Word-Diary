'use server';

import { MutationResult } from '@/app/lib/definitions';
import sql from '@/app/lib/dbClient';
import { getCurrentProfile } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';

const revalidateWordRoutes = () => {
  revalidatePath('/diary');
  revalidatePath('/flashcards');
};

export const saveWordToDiary = async (
  word: string
): Promise<MutationResult> => {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { success: false };
    }
    const normalizedWord = word.trim().toLowerCase();
    await sql`
      insert into public.user_words_list (user_id, word_id)
      select ${profile.id}::uuid, id
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
    const profile = await getCurrentProfile();
    if (!profile) {
      return { success: false };
    }
    await sql`
      delete from public.user_words_list
      where id = ${userWordListId}
        and user_id = ${profile.id}
    `;

    revalidateWordRoutes();
    return { success: true };
  } catch (error) {
    console.error('Failed to delete word from diary', error);
    return { success: false };
  }
};
