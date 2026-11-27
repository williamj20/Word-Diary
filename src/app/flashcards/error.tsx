'use client';

import RouteError from '@/components/route-error';
import type { ErrorInfo } from 'next/error';

const FlashcardsError = ({ error, retry }: ErrorInfo) => {
  return (
    <RouteError
      error={error}
      retry={retry}
      title="Your flashcards are unavailable"
    />
  );
};

export default FlashcardsError;
