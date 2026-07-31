'use client';

import RouteError from '@/app/components/route-error';
import type { ErrorInfo } from 'next/error';

const FlashcardsError = ({ error, unstable_retry }: ErrorInfo) => {
  return (
    <RouteError
      error={error}
      retry={unstable_retry}
      title="Your flashcards are unavailable"
    />
  );
};

export default FlashcardsError;
