import { getCurrentUser } from '@/app/lib/utils';
import { BookMarked, Search } from 'lucide-react';
import Link from 'next/link';

const featureCards = [
  {
    icon: Search,
    eyebrow: 'Discover',
    title: 'Look up words in the moment',
    description:
      'Search unfamiliar words as you read, then keep the ones worth remembering.',
  },
  {
    icon: BookMarked,
    eyebrow: 'Collect',
    title: 'Build a vocabulary diary',
    description:
      'Save definitions into your own growing diary instead of looking them up and forgetting afterwards.',
  },
];

const LandingPage = async () => {
  const user = await getCurrentUser();
  const primaryHref = user ? '/diary' : '/signup';
  const primaryLabel = user ? 'Go To Your Diary' : 'Start Your Diary';

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-0 sm:gap-10 sm:px-4 lg:gap-14 lg:px-8">
      <section className="rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] px-4 py-8 shadow-lg sm:px-6 sm:py-10">
        <div className="flex flex-col items-center gap-4 text-center sm:gap-6">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)] sm:text-xs">
            A Vocabulary Journal For Curious Readers
          </p>
          <h2 className="display-font text-[clamp(2rem,8.5vw,2.6rem)] text-[var(--ink)] sm:text-[clamp(2.6rem,3.75vw,2.85rem)]">
            Keep the words you want to remember.
          </h2>
          <p className="text-base text-[var(--ink-muted)] sm:text-lg">
            Word Diary helps you search unfamiliar words with definitions
            retrieved from the{' '}
            <a
              href="https://www.merriam-webster.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Merriam-Webster
            </a>{' '}
            online dictionary, save the ones that matter, and build a personal
            lexicon you can return to later.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="display-font rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-5 py-2.5 text-base font-semibold text-[var(--paper-card)] shadow-lg transition-all duration-200 hover:bg-[var(--sage)] sm:px-7 sm:py-3 sm:text-lg"
            >
              {primaryLabel}
            </Link>
            {!user && (
              <Link
                href="/login"
                className="auth-button px-5 py-2.5 text-base sm:px-7 sm:py-3 sm:text-lg"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {featureCards.map(({ icon: Icon, eyebrow, title, description }) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] p-4 shadow-lg sm:p-6"
          >
            <div className="inline-flex w-fit rounded-2xl border border-[var(--sage)] bg-[var(--sage-soft)] p-2.5 text-[var(--sage-dark)] sm:p-3">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)] sm:text-xs sm:tracking-[0.14em]">
              {eyebrow}
            </p>
            <h3 className="display-font text-xl text-[var(--ink)] sm:text-3xl">
              {title}
            </h3>
            <p className="text-sm text-[var(--ink-muted)] sm:text-base">
              {description}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default LandingPage;
