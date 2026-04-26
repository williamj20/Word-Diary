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
    <main className="mx-auto flex w-full max-w-7xl flex-col px-8 gap-14">
      <section className="rounded-[2.5rem] border border-[var(--brass)] bg-[var(--paper-card)] px-6 py-10 shadow-lg">
        <div className="flex flex-col gap-6 items-center text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            A Vocabulary Journal For Curious Readers
          </p>
          <h2 className="display-font text-[var(--ink)] text-5xl">
            Keep the words you want to remember.
          </h2>
          <p className="leading-7 text-[var(--ink-muted)] text-lg">
            Word Diary helps you search unfamiliar words, save the ones that
            matter, and build a personal lexicon you can return to later.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="display-font rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-7 py-3 text-lg font-semibold text-[var(--paper-card)] shadow-lg transition-all duration-200 hover:bg-[var(--sage)]"
            >
              {primaryLabel}
            </Link>
            {!user && (
              <Link href="/login" className="auth-button px-7 py-3 text-lg">
                Log In
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {featureCards.map(({ icon: Icon, eyebrow, title, description }) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] p-6 shadow-lg"
          >
            <div className="inline-flex w-fit rounded-2xl border border-[var(--sage)] bg-[var(--sage-soft)] p-3 text-[var(--sage-dark)]">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              {eyebrow}
            </p>
            <h3 className="display-font text-3xl text-[var(--ink)]">{title}</h3>
            <p className="text-base leading-7 text-[var(--ink-muted)]">
              {description}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default LandingPage;
