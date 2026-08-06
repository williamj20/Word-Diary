'use client';

import { useEffect } from 'react';

const RouteError = ({
  error,
  retry,
  title,
}: {
  error: Error & { digest?: string };
  retry: () => void;
  title: string;
}) => {
  useEffect(() => {
    console.error('Route rendering failed', error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-3xl">
      <section className="rounded-[2rem] border border-[var(--danger)] bg-[var(--paper-card)] px-5 py-8 text-center shadow-md sm:px-8 sm:py-10">
        <h2 className="text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--ink-muted)] sm:text-base">
          We could not load this page from the database. Please try again.
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-5 rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-5 py-2.5 text-sm font-bold text-[var(--paper-card)] shadow-sm transition-all duration-200 hover:bg-[var(--sage)]"
        >
          Try Again
        </button>
      </section>
    </main>
  );
};

export default RouteError;
