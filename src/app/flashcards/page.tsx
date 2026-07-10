import FlashcardDeck from '@/app/flashcards/components/flashcard-deck';
import { getUserWordsForFlashcards } from '@/app/lib/data';
import { FlashcardWord } from '@/app/lib/definitions';
import { redirectToSignupIfNotLoggedIn } from '@/app/lib/utils';
import Link from 'next/link';

const shuffleWords = (words: FlashcardWord[]) => {
  const shuffled = [...words];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
};

const FlashcardsPage = async () => {
  const user = await redirectToSignupIfNotLoggedIn();
  const words = await getUserWordsForFlashcards(user.id);

  if (words.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl">
        <section className="rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] px-5 py-8 text-center shadow-md sm:py-10">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <h2 className="display-font text-1xl text-[var(--ink)] sm:text-3xl">
              Add words to start studying.
            </h2>
            <p className="max-w-xl text-sm text-[var(--ink-muted)] sm:text-base">
              Your saved words become a shuffled deck here. Add a few words to
              your diary, then come back for a focused review session.
            </p>
            <Link
              href="/diary"
              className="display-font inline-flex items-center gap-2 rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-5 py-2.5 text-sm font-semibold text-[var(--paper-card)] shadow-sm transition-all duration-200 hover:bg-[var(--sage)]"
            >
              Go To Diary
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100svh-8.5rem)] items-center">
      <FlashcardDeck words={shuffleWords(words)} />
    </main>
  );
};

export default FlashcardsPage;
