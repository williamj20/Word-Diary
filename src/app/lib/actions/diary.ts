'use server';

import { MutationResult } from '@/app/lib/definitions';
import sql from '@/app/lib/dbClient';
import { getCurrentProfile } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';

const revalidateWordRoutes = (username: string) => {
  revalidatePath(`/diary/${username}`);
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
    const saved = await sql<{ id: number }[]>`
      insert into public.user_words_list (user_id, word_id)
      select ${profile.id}::uuid, w.id
      from public.words w
      where w.word = ${normalizedWord} and exists (
        select 1 from public.word_meanings wm
        where wm.word_id = w.id
      )
      on conflict (user_id, word_id) do update set word_id = excluded.word_id
      returning id
    `;

    if (!saved.length) {
      return { success: false };
    }
    revalidateWordRoutes(profile.username);
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

    revalidateWordRoutes(profile.username);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete word from diary', error);
    return { success: false };
  }
};
